/**
 * Storage and state manager for EDU PLAN AI
 * Handles user sessions, profile management, and saved documents
 */
import { UserAccount, SavedDocument, Student } from '../types';

export const DEMO_USER: UserAccount = {
  id: 'demo-user-001',
  name: 'Husein Apriyanto',
  email: 'husein.apriyanto@sekolah.id',
  isDemo: true,
  createdAt: new Date().toISOString(),
  teacherProfile: {
    name: 'Husein Apriyanto',
    nip: '19900815 201802 1 001',
    email: 'husein.apriyanto@sekolah.id',
    position: 'Guru PJOK SD',
    rank: 'Penata Muda Tk. I / III-b',
  },
  schoolProfile: {
    name: 'SDN Kasepuhan 04',
    npsn: '20301928',
    educationLevel: 'Sekolah Dasar (SD)',
    address: 'Jl. Raya Kasepuhan No. 04',
    village: 'Kasepuhan',
    district: 'Batang',
    regency: 'Kabupaten Batang',
    province: 'Jawa Tengah',
    schoolYear: '2026/2027',
    principalName: 'Drs. H. Sugiyanto, M.Pd.',
    principalNip: '19750312 199903 1 002',
    logoUrl: '',
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

const USERS_KEY = 'eduplan_users_v1';
const CURRENT_USER_KEY = 'eduplan_current_user_v1';
const DOCUMENTS_KEY = 'eduplan_documents_v1';
const STUDENTS_KEY = 'eduplan_students_v1';

export function getActiveSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) {
        return parsed;
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

export function setCurrentUser(user: UserAccount): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  // Sync to users list, avoiding duplicates by id or by email
  const users = getAllUsers();
  const idx = users.findIndex(
    (u) =>
      u.id === user.id ||
      (!u.isDemo && !user.isDemo && u.email.trim().toLowerCase() === user.email.trim().toLowerCase())
  );
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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


export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// User-scoped documents
export function getSavedDocuments(userId: string): SavedDocument[] {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    if (raw) {
      const all: SavedDocument[] = JSON.parse(raw);
      return all.filter((d) => d.userId === userId);
    }
  } catch (e) {
    console.error('Failed to load documents', e);
  }
  return [];
}

export function saveDocument(doc: SavedDocument): void {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    let all: SavedDocument[] = raw ? JSON.parse(raw) : [];
    const index = all.findIndex((d) => d.id === doc.id);
    if (index >= 0) {
      all[index] = { ...doc, updatedAt: new Date().toISOString() };
    } else {
      all.unshift(doc);
    }
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save document', e);
  }
}

export function deleteDocument(docId: string): void {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    if (raw) {
      let all: SavedDocument[] = JSON.parse(raw);
      all = all.filter((d) => d.id !== docId);
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(all));
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
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get students', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStudents(userId: string, students: Student[]): void {
  localStorage.setItem(`${STUDENTS_KEY}_${userId}`, JSON.stringify(students));
}
