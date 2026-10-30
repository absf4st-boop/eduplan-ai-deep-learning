/**
 * Data types for EDU PLAN AI - DEEP LEARNING
 */

export type DocumentType =
  | 'CP'
  | 'TP'
  | 'ATP'
  | 'RPP'
  | 'MODUL_AJAR'
  | 'PROTA'
  | 'PROMES'
  | 'LKPD'
  | 'JURNAL'
  | 'HADIR'
  | 'NILAI';

export interface TeacherProfile {
  name: string;
  nip: string;
  email: string;
  position: string;
  rank?: string; // Pangkat / Golongan
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  educationLevel: string; // Sekolah Dasar
  address: string;
  village: string; // Desa / Kelurahan
  district: string; // Kecamatan
  regency: string; // Kabupaten / Kota
  province: string;
  schoolYear: string;
  principalName: string;
  principalNip: string;
  logoUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  isDemo?: boolean;
  teacherProfile: TeacherProfile;
  schoolProfile: SchoolProfile;
  createdAt: string;
}

export interface SavedDocument {
  id: string;
  userId: string;
  documentType: DocumentType;
  title: string;
  subject: string;
  grade: string;
  phase: string;
  semester: string;
  schoolYear: string;
  material: string;
  content: string; // HTML rich text
  sourceDocumentIds?: string[]; // IDs of upstream documents (e.g. CP -> TP)
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  grade: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'H' | 'I' | 'S' | 'A';
}

export interface GradeRecord {
  studentId: string;
  formativeScore: number;
  practiceScore: number;
  summativeScore: number;
  projectScore: number;
  reflectionScore: number;
  finalScore: number;
  achievementDescription: string;
}
