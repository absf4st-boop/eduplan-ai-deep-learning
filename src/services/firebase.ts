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
  query,
  where,
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

// Sign out from Firebase
export async function signOutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase sign-out error:', error);
  }
}

// Sync user profile to Firestore
// Strictly guarantees target path matches request.auth.uid to satisfy security rules
export async function syncUserToFirestore(user: UserAccount): Promise<void> {
  const currentAuth = auth.currentUser;
  if (!currentAuth) {
    // Only authenticated Firebase users can write to Firestore per security rules
    return;
  }

  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}`;

  try {
    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(userDocRef, {
      id: targetUid,
      name: user.name || user.teacherProfile?.fullName || currentAuth.displayName || 'Guru SD',
      email: currentAuth.email || user.email || '',
      isVerified: currentAuth.emailVerified ?? user.isVerified ?? true,
      isDemo: false,
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
export async function loadUserFromFirestore(userId?: string): Promise<UserAccount | null> {
  const currentAuth = auth.currentUser;
  if (!currentAuth) {
    return null;
  }

  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
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
  const currentAuth = auth.currentUser;
  if (!currentAuth) {
    return;
  }

  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/documents/${document.id}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'documents', document.id);
    await setDoc(docRef, {
      id: document.id,
      userId: targetUid,
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
  const currentAuth = auth.currentUser;
  if (!currentAuth) {
    return;
  }

  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/documents/${documentId}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'documents', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Load all saved documents from Firestore for the current authenticated teacher
export async function loadDocumentsFromFirestore(userId?: string): Promise<SavedDocument[]> {
  const currentAuth = auth.currentUser;
  if (!currentAuth) {
    return [];
  }

  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/documents`;
  try {
    const q = query(
      collection(db, 'users', targetUid, 'documents'),
      where('userId', '==', targetUid)
    );
    const snapshot = await getDocs(q);
    const docs: SavedDocument[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      docs.push({
        id: data.id || docSnap.id,
        userId: targetUid,
        type: data.documentType,
        documentType: data.documentType,
        title: data.title,
        subject: data.subject,
        grade: data.grade,
        semester: data.semester,
        topic: data.topic,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    return docs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Real-time listener for User Profile updates using onSnapshot.
 * Only attached when Firebase user is authenticated.
 */
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (user: UserAccount) => void
): () => void {
  const currentAuth = auth.currentUser;
  if (!currentAuth) {
    return () => {};
  }

  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}`;
  const docRef = doc(db, 'users', targetUid);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserAccount;
        onUpdate(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Real-time listener for Saved Curriculum Documents subcollection using onSnapshot.
 * Only attached when Firebase user is authenticated.
 */
export function subscribeToUserDocuments(
  userId: string,
  onUpdate: (docs: SavedDocument[]) => void
): () => void {
  const currentAuth = auth.currentUser;
  if (!currentAuth) {
    return () => {};
  }

  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/documents`;
  const q = query(
    collection(db, 'users', targetUid, 'documents'),
    where('userId', '==', targetUid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const docs: SavedDocument[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        docs.push({
          id: data.id || docSnap.id,
          userId: targetUid,
          type: data.documentType || data.type || 'MODUL_AJAR',
          documentType: data.documentType || data.type || 'MODUL_AJAR',
          title: data.title || 'Dokumen Pembelajaran',
          subject: data.subject || 'PJOK',
          grade: data.grade || '5',
          semester: data.semester || '1',
          topic: data.topic || data.material || 'Materi',
          content: data.content || '',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          deepLearningTags: data.deepLearningTags || [],
        });
      });
      onUpdate(docs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Sync student to Firestore
export async function syncStudentToFirestore(userId: string, student: Student): Promise<void> {
  const currentAuth = auth.currentUser;
  if (!currentAuth) return;
  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/students/${student.id}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'students', student.id);
    await setDoc(docRef, {
      id: student.id,
      userId: targetUid,
      nisn: student.nisn || '',
      name: student.name,
      gender: student.gender,
      grade: student.grade || '5',
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete student from Firestore
export async function deleteStudentFromFirestore(userId: string, studentId: string): Promise<void> {
  const currentAuth = auth.currentUser;
  if (!currentAuth) return;
  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/students/${studentId}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'students', studentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Load all students from Firestore
export async function loadStudentsFromFirestore(userId?: string): Promise<Student[]> {
  const currentAuth = auth.currentUser;
  if (!currentAuth) return [];
  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/students`;
  try {
    const q = query(
      collection(db, 'users', targetUid, 'students'),
      where('userId', '==', targetUid)
    );
    const snap = await getDocs(q);
    const list: Student[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: data.id || d.id,
        userId: targetUid,
        nisn: data.nisn || '',
        name: data.name,
        gender: data.gender || 'L',
        grade: data.grade || '5',
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Real-time listener for classroom students using onSnapshot
export function subscribeToUserStudents(
  userId: string,
  onUpdate: (students: Student[]) => void
): () => void {
  const currentAuth = auth.currentUser;
  if (!currentAuth) return () => {};
  const targetUid = currentAuth.uid;
  const path = `users/${targetUid}/students`;
  const q = query(
    collection(db, 'users', targetUid, 'students'),
    where('userId', '==', targetUid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: data.id || d.id,
          userId: targetUid,
          nisn: data.nisn || '',
          name: data.name,
          gender: data.gender || 'L',
          grade: data.grade || '5',
        });
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
