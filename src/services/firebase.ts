/**
 * Firebase Services for EDU PLAN AI - DEEP LEARNING
 * Handles Firestore persistence, Authentication, and connection checks
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserAccount, SavedDocument, Student } from '../types';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test required by skill guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Firebase Google Login
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Firebase Google Sign-in error:', error);
    throw error;
  }
}

// Sync user profile to Firestore
export async function syncUserToFirestore(user: UserAccount): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const userDocRef = doc(db, 'users', user.id);
    await setDoc(userDocRef, {
      id: user.id,
      name: user.name || user.teacherProfile?.fullName || 'Guru SD',
      email: user.email || '',
      isVerified: user.isVerified ?? true,
      isDemo: user.isDemo ?? false,
      teacherProfile: user.teacherProfile || {},
      schoolProfile: user.schoolProfile || {},
      createdAt: user.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Load user profile from Firestore
export async function loadUserFromFirestore(userId: string): Promise<UserAccount | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Sync saved document to Firestore
export async function syncDocumentToFirestore(userId: string, document: SavedDocument): Promise<void> {
  const path = `users/${userId}/documents/${document.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'documents', document.id);
    await setDoc(docRef, {
      id: document.id,
      userId: userId,
      documentType: document.documentType || document.type || 'MODUL_AJAR',
      title: document.title || 'Dokumen Pembelajaran',
      subject: document.subject || 'PJOK',
      grade: document.grade || '5',
      semester: document.semester || '1',
      topic: document.topic || 'Materi',
      content: document.content || '',
      createdAt: document.createdAt || new Date().toISOString(),
      updatedAt: document.updatedAt || new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete document from Firestore
export async function deleteDocumentFromFirestore(userId: string, documentId: string): Promise<void> {
  const path = `users/${userId}/documents/${documentId}`;
  try {
    const docRef = doc(db, 'users', userId, 'documents', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Load all saved documents from Firestore
export async function loadDocumentsFromFirestore(userId: string): Promise<SavedDocument[]> {
  const path = `users/${userId}/documents`;
  try {
    const colRef = collection(db, 'users', userId, 'documents');
    const snapshot = await getDocs(colRef);
    const docs: SavedDocument[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      docs.push({
        id: data.id || docSnap.id,
        userId: data.userId,
        type: data.documentType,
        documentType: data.documentType,
        title: data.title,
        subject: data.subject,
        grade: data.grade,
        semester: data.semester,
        topic: data.topic,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    return docs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
