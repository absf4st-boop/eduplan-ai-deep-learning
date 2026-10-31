/**
 * Storage and state manager for EDU PLAN AI
 * Handles user sessions, profile management, saved documents, and students
 */
import { UserAccount, SavedDocument, Student } from '../types';
import {
  syncUserToFirestore,
  syncDocumentToFirestore,
  deleteDocumentFromFirestore
} from './firebase';

export const DEMO_USER: UserAccount = {
  id: 'demo-user-001',
  name: 'Husein Apriyanto, S.Pd.',
  email: 'husein.apriyanto@sekolah.id',
  password: 'demo123Password',
  isDemo: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  teacherProfile: {
    name: 'Husein Apriyanto, S.Pd.',
    fullName: 'Husein Apriyanto, S.Pd.',
    nip: '19900815 201802 1 001',
    email: 'husein.apriyanto@sekolah.id',
    position: 'Guru PJOK SD',
    rank: 'Penata Muda Tk. I / III-b',
    rankGroup: 'Penata Muda Tk. I / III-b',
  },
  schoolProfile: {
    name: 'SDN Kasepuhan 04',
    schoolName: 'SDN Kasepuhan 04',
    npsn: '20301928',
    level: 'Sekolah Dasar (SD)',
    educationLevel: 'Sekolah Dasar (SD)',
    address: 'Jl. Raya Kasepuhan No. 04',
    village: 'Kasepuhan',
    district: 'Batang',
    regency: 'Kabupaten Batang',
    province: 'Jawa Tengah',
    schoolYear: '2026/2027',
    academicYear: '2026/2027',
    principalName: 'Drs. H. Sugiyanto, M.Pd.',
    principalNip: '19750312 199903 1 002',
    headmaster: {
      name: 'Drs. H. Sugiyanto, M.Pd.',
      nip: '19750312 199903 1 002',
    },
    logoUrl: '',
    activeSubject: 'PJOK',
    activeGrade: '5',
    activePhase: 'Fase C',
  },
};

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-1', nisn: '0123456781', name: 'Ahmad Fauzi Pratama', gender: 'L', grade: '5' },
  { id: 'std-2', nisn: '0123456782', name: 'Aisyah Nur Rahmawati', gender: 'P', grade: '5' },
  { id: 'std-3', nisn: '0123456783', name: 'Bagas Dwi Saputra', gender: 'L', grade: '5' },
  { id: 'std-4', nisn: '0123456784', name: 'Cantika Dewi Lestari', gender: 'P', grade: '5' },
  { id: 'std-5', nisn: '0123456785', name: 'Dimas Arya Nugroho', gender: 'L', grade: '5' },
  { id: 'std-6', nisn: '0123456786', name: 'Eka Putri Handayani', gender: 'P', grade: '5' },
  { id: 'std-7', nisn: '0123456787', name: 'Fajar Maulana Malik', gender: 'L', grade: '5' },
  { id: 'std-8', nisn: '0123456788', name: 'Gita Ayu Paramitha', gender: 'P', grade: '5' },
  { id: 'std-9', nisn: '0123456789', name: 'Hafiz Al-Ghifari', gender: 'L', grade: '5' },
  { id: 'std-10', nisn: '0123456790', name: 'Indah Permatasari', gender: 'P', grade: '5' },
];

const USERS_KEY = 'eduplan_users_v2';
const CURRENT_USER_KEY = 'eduplan_current_user_v2';
const DOCUMENTS_KEY = 'eduplan_documents_v2';
const STUDENTS_KEY = 'eduplan_students_v2';

export function getDemoUser(): UserAccount {
  return DEMO_USER;
}

export function getActiveSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) {
        return normalizeUserAccount(parsed);
      }
    }
  } catch (e) {
    console.error('Failed to load active session', e);
  }
  return null;
}

export function getCurrentUser(): UserAccount {
  const active = getActiveSession();
  if (active) {
    return active;
  }
  return DEMO_USER;
}

function normalizeUserAccount(user: any): UserAccount {
  const tp = user.teacherProfile || {};
  const sp = user.schoolProfile || {};

  return {
    ...user,
    teacherProfile: {
      ...tp,
      fullName: tp.fullName || tp.name || user.name || 'Guru SD',
      name: tp.name || tp.fullName || user.name || 'Guru SD',
      rankGroup: tp.rankGroup || tp.rank || 'Penata Muda / III a',
      rank: tp.rank || tp.rankGroup || 'Penata Muda / III a',
      nip: tp.nip || '-',
      email: tp.email || user.email || '',
      position: tp.position || 'Guru Kelas / PJOK',
    },
    schoolProfile: {
      ...sp,
      schoolName: sp.schoolName || sp.name || 'SD Negeri',
      name: sp.name || sp.schoolName || 'SD Negeri',
      academicYear: sp.academicYear || sp.schoolYear || '2026/2027',
      schoolYear: sp.schoolYear || sp.academicYear || '2026/2027',
      activeSubject: sp.activeSubject || 'PJOK',
      activeGrade: sp.activeGrade || '5',
      activePhase: sp.activePhase || 'Fase C',
      headmaster: sp.headmaster || {
        name: sp.principalName || 'Kepala Sekolah',
        nip: sp.principalNip || '-',
      },
    },
  };
}

export function setCurrentUser(user: UserAccount): void {
  const normalized = normalizeUserAccount(user);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));

  // Sync to users list, avoiding duplicates by id or by email
  const users = getAllUsers();
  const idx = users.findIndex(
    (u) =>
      u.id === normalized.id ||
      (!u.isDemo && !normalized.isDemo && u.email.trim().toLowerCase() === normalized.email.trim().toLowerCase())
  );
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...normalized };
  } else {
    users.push(normalized);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Sync to Firestore if not a demo account
  if (!normalized.isDemo && normalized.id && !normalized.id.startsWith('demo-')) {
    syncUserToFirestore(normalized).catch((err) => {
      console.warn('Firestore user profile sync error (offline/pending):', err);
    });
  }
}

export function saveRegisteredUser(user: UserAccount): void {
  setCurrentUser(user);
}

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeUserAccount);
      }
    }
  } catch (e) {
    console.error('Failed to load users', e);
  }
  return [DEMO_USER];
}

export function getRegisteredUsers(): UserAccount[] {
  const users = getAllUsers();
  return users.filter((u) => !u.isDemo);
}

export function findUserByEmail(email: string): UserAccount | undefined {
  if (!email) return undefined;
  const cleanEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function logoutUser(): void {
  clearCurrentUser();
}

// User-scoped documents
export function getSavedDocuments(userId: string): SavedDocument[] {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    if (raw) {
      const all: SavedDocument[] = JSON.parse(raw);
      return all
        .filter((d) => d.userId === userId)
        .map((d) => ({
          ...d,
          type: d.type || d.documentType || 'MODUL_AJAR',
          documentType: d.documentType || d.type || 'MODUL_AJAR',
          topic: d.topic || d.material || 'Pembelajaran',
        }));
    }
  } catch (e) {
    console.error('Failed to load documents', e);
  }
  return [];
}

export const getDocuments = getSavedDocuments;

export function saveDocument(doc: SavedDocument): void {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    let all: SavedDocument[] = raw ? JSON.parse(raw) : [];
    const normalized: SavedDocument = {
      ...doc,
      type: doc.type || doc.documentType || 'MODUL_AJAR',
      documentType: doc.documentType || doc.type || 'MODUL_AJAR',
      topic: doc.topic || doc.material || 'Materi',
      updatedAt: new Date().toISOString(),
    };

    const index = all.findIndex((d) => d.id === doc.id);
    if (index >= 0) {
      all[index] = normalized;
    } else {
      all.unshift(normalized);
    }
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(all));

    // Sync to Firestore if user is not demo
    if (normalized.userId && !normalized.userId.startsWith('demo-')) {
      syncDocumentToFirestore(normalized.userId, normalized).catch((err) => {
        console.warn('Firestore document sync error (offline/pending):', err);
      });
    }
  } catch (e) {
    console.error('Failed to save document', e);
  }
}

export function deleteDocument(docId: string): void {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    if (raw) {
      let all: SavedDocument[] = JSON.parse(raw);
      const target = all.find((d) => d.id === docId);
      all = all.filter((d) => d.id !== docId);
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(all));

      if (target && target.userId && !target.userId.startsWith('demo-')) {
        deleteDocumentFromFirestore(target.userId, docId).catch((err) => {
          console.warn('Firestore document deletion error:', err);
        });
      }
    }
  } catch (e) {
    console.error('Failed to delete document', e);
  }
}

// Students
export function getStudents(userId: string): Student[] {
  try {
    const raw = localStorage.getItem(`${STUDENTS_KEY}_${userId}`);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch (e) {
    console.error('Failed to get students', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStudent(student: Student): void {
  const userId = student.userId || 'default_user';
  const students = getStudents(userId);
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }
  saveStudents(userId, students);
}

export function deleteStudent(studentId: string): void {
  const allKeys = Object.keys(localStorage).filter((k) => k.startsWith(STUDENTS_KEY));
  allKeys.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        let students: Student[] = JSON.parse(raw);
        students = students.filter((s) => s.id !== studentId);
        localStorage.setItem(key, JSON.stringify(students));
      }
    } catch (e) {}
  });
}

export function saveStudents(userId: string, students: Student[]): void {
  localStorage.setItem(`${STUDENTS_KEY}_${userId}`, JSON.stringify(students));
}
