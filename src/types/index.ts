/**
 * Data types for EDU PLAN AI - DEEP LEARNING
 */

export type DocumentType =
  | 'TP'
  | 'ATP'
  | 'CP'
  | 'RPP'
  | 'MODUL_AJAR'
  | 'PROTA'
  | 'PROMES'
  | 'LKPD'
  | 'JURNAL_HARIAN'
  | 'DAFTAR_HADIR'
  | 'DAFTAR_NILAI'
  | 'JURNAL'
  | 'HADIR'
  | 'NILAI';

export interface HeadmasterProfile {
  name: string;
  nip: string;
}

export interface TeacherProfile {
  name?: string;
  fullName?: string;
  nip: string;
  email: string;
  position: string;
  rank?: string;
  rankGroup?: string;
}

export interface SchoolProfile {
  name?: string;
  schoolName?: string;
  npsn: string;
  level?: string;
  educationLevel?: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  schoolYear?: string;
  academicYear?: string;
  principalName?: string;
  principalNip?: string;
  headmaster?: HeadmasterProfile;
  logoUrl?: string;
  activeSubject?: string;
  activeGrade?: string;
  activePhase?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  isVerified?: boolean;
  isDemo?: boolean;
  teacherProfile: TeacherProfile;
  schoolProfile: SchoolProfile;
  createdAt: string;
  lastLogin?: string;
}

export interface SavedDocument {
  id: string;
  userId: string;
  type?: DocumentType;
  documentType?: DocumentType;
  title: string;
  subject: string;
  grade: string;
  phase?: string;
  semester: string;
  schoolYear?: string;
  academicYear?: string;
  topic?: string;
  material?: string;
  content: string;
  sourceDocumentIds?: string[];
  createdAt: string;
  updatedAt: string;
  deepLearningTags?: string[];
}

export interface Student {
  id: string;
  userId?: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  grade: string;
}

export interface GenerationParams {
  type: DocumentType;
  subject: string;
  grade: string;
  phase: string;
  semester: string;
  academicYear: string;
  topic: string;
  duration?: string;
  learningModel?: string;
  additionalPrompt?: string;
  principles?: {
    mindful: boolean;
    meaningful: boolean;
    joyful: boolean;
  };
}
