import React, { useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  LogOut,
  FolderOpen,
  Clock,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { UserAccount, SavedDocument, DocumentType } from '../types';
import { Logo } from './Logo';
import { DocumentGenerator, DOC_TITLES } from './DocumentGenerator';
import { SavedDocumentsList } from './SavedDocumentsList';
import { StudentManager } from './StudentManager';
import { InteractiveAttendance } from './InteractiveAttendance';
import { InteractiveGrades } from './InteractiveGrades';
import { DocumentEditor } from './DocumentEditor';

interface DashboardViewProps {
  currentUser: UserAccount;
  savedDocuments: SavedDocument[];
  onSaveDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onOpenPublishGuide: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  savedDocuments,
  onSaveDocument,
  onDeleteDocument,
  onOpenProfile,
  onLogout,
  onOpenPublishGuide,
}) => {
  // Navigation active tab
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [editingDoc, setEditingDoc] = useState<SavedDocument | null>(null);

  // Default active class context
  const [currentGrade, setCurrentGrade] = useState<string>('5');
  const [currentSubject, setCurrentSubject] = useState<string>('PJOK');

  // Shared students state
  const [students, setStudents] = useState(() => {
    // try to load or fallback to initial
    return [
      { id: 'std-1', nisn: '0123456781', name: 'Ahmad Fauzi Pratama', gender: 'L' as const, grade: '5' },
      { id: 'std-2', nisn: '0123456782', name: 'Aisyah Nur Rahmawati', gender: 'P' as const, grade: '5' },
      { id: 'std-3', nisn: '0123456783', name: 'Bagas Dwi Saputra', gender: 'L' as const, grade: '5' },
      { id: 'std-4', nisn: '0123456784', name: 'Cantika Dewi Lestari', gender: 'P' as const, grade: '5' },
      { id: 'std-5', nisn: '0123456785', name: 'Dimas Arya Nugroho', gender: 'L' as const, grade: '5' },
    ];
  });

  const menus: { id: DocumentType; label: string; icon: string; short: string }[] = [
    { id: 'CP', label: '3. CP – Capaian Pembelajaran', short: 'CP', icon: '🎯' },
    { id: 'TP', label: '1. TP – Tujuan Pembelajaran', short: 'TP', icon: '📌' },
    { id: 'ATP', label: '2. ATP – Alur Tujuan Pembelajaran', short: 'ATP', icon: '🛣️' },
    { id: 'RPP', label: '4. RPP – Rencana Pelaksanaan', short: 'RPP', icon: '📝' },
    { id: 'MODUL_AJAR', label: '5. Modul Ajar Deep Learning', short: 'Modul', icon: '📘' },
    { id: 'PROTA', label: '6. PROTA – Program Tahunan', short: 'PROTA', icon: '📅' },
    { id: 'PROMES', label: '7. PROMES – Program Semester', short: 'PROMES', icon: '📆' },
    { id: 'LKPD', label: '8. LKPD – Lembar Kerja Siswa', short: 'LKPD', icon: '📋' },
    { id: 'JURNAL', label: '9. Jurnal Harian Guru', short: 'Jurnal', icon: '📔' },
    { id: 'HADIR', label: '10. Daftar Hadir Siswa', short: 'Presensi', icon: '👥' },
    { id: 'NILAI', label: '11. Daftar Nilai Asesmen', short: 'Nilai', icon: '📊' },
  ];

  const handleOpenDocFromList = (doc: SavedDocument) => {
    setEditingDoc(doc);
    setActiveMenu('editor_view');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white flex flex-col shrink-0 border-r border-blue-900/40">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <Logo size="md" inverted={true} />
        </div>

        {/* User Mini Profile Card */}
        <div className="p-4 mx-3 my-3 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            {currentUser.schoolProfile.logoUrl ? (
              <img
                src={currentUser.schoolProfile.logoUrl}
                alt="Logo Sekolah"
                className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-sm shadow">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white truncate block">
                  {currentUser.teacherProfile.name || currentUser.name}
                </span>
              </div>
              <span className="text-[11px] text-amber-300 block truncate font-medium">
                {currentUser.schoolProfile.name}
              </span>
              {currentUser.isDemo && (
                <span className="inline-block mt-1 px-1.5 py-0.2 bg-amber-400 text-blue-950 font-black text-[9px] rounded uppercase tracking-wider">
                  DATA DEMO
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProfile}
            className="mt-3 w-full py-1.5 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 border border-white/10"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Edit Identitas Sekolah</span>
          </button>
        </div>

        {/* Navigation Menus List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-xs">
          {/* Main Dashboard Overview */}
          <button
            type="button"
            onClick={() => {
              setActiveMenu('dashboard');
              setEditingDoc(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition-all ${
              activeMenu === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span>Dashboard Utama</span>
          </button>

          {/* Arsip Dokumen Saya */}
          <button
            type="button"
            onClick={() => {
              setActiveMenu('saved_docs');
              setEditingDoc(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
              activeMenu === 'saved_docs'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-4 h-4 text-blue-300" />
              <span>Dokumen Tersimpan</span>
            </div>
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] font-bold">
              {savedDocuments.length}
            </span>
          </button>

          {/* Data Siswa */}
          <button
            type="button"
            onClick={() => {
              setActiveMenu('students');
              setEditingDoc(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition-all ${
              activeMenu === 'students'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Database Siswa (Roster)</span>
          </button>

          {/* Section Heading: 11 Menu Administrasi */}
          <div className="pt-4 pb-1.5 px-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/90">
              11 MENU ADMINISTRASI SD
            </span>
          </div>

          {menus.map((m) => {
            const isActive = activeMenu === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setActiveMenu(m.id);
                  setEditingDoc(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-sm">{m.icon}</span>
                <span className="truncate">{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout & Netlify Guide */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            type="button"
            onClick={onOpenPublishGuide}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-white/5 rounded-xl font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Panduan Netlify & GitHub</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi Guru</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {activeMenu === 'dashboard' && 'Dashboard Pembelajaran Mendalam'}
              {activeMenu === 'saved_docs' && 'Arsip Dokumen Administrasi Tersimpan'}
              {activeMenu === 'students' && 'Manajemen Data Peserta Didik'}
              {activeMenu === 'editor_view' && editingDoc?.title}
              {DOC_TITLES[activeMenu as DocumentType] &&
                `Generator: ${DOC_TITLES[activeMenu as DocumentType]}`}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp Quick Help */}
            <a
              href="https://wa.me/6285725080078"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bantuan WA (huseinapriyanto)</span>
            </a>

            {/* School Profile Badge */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-3 pr-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-700 transition-colors"
            >
              <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                {currentUser.schoolProfile.name}
              </span>
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px]">
                SD
              </div>
            </button>
          </div>
        </header>

        {/* View Router */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {/* DASHBOARD OVERVIEW */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Hero */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 font-black text-[10px] uppercase">
                      {currentUser.isDemo ? 'DATA DEMO' : 'AKUN RESMI GURU'}
                    </span>
                    <span className="text-xs text-blue-200">
                      Tahun Ajaran {currentUser.schoolProfile.schoolYear || '2026/2027'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Selamat datang, {currentUser.teacherProfile.name || currentUser.name}!
                  </h2>
                  <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                    Satuan Pendidikan: <strong>{currentUser.schoolProfile.name}</strong> • Mata Pelajaran Aktif: <strong>{currentSubject}</strong> (Kelas {currentGrade} - Fase C).
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveMenu('MODUL_AJAR')}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Buat Modul Ajar Deep Learning</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMenu('CP')}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                    >
                      <span>Mulai dari Capaian Pembelajaran (CP)</span>
                    </button>
                  </div>
                </div>

                {/* Decorative emblem badge background */}
                <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden lg:block">
                  <Logo size="xl" showSubtitle={false} inverted={true} />
                </div>
              </div>

              {/* Statistics Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Dokumen Tersimpan</span>
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-2xl font-black text-slate-900">{savedDocuments.length}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Di ruang kerja Anda</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Total Menu Kurikulum</span>
                    <Layers className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-black text-slate-900">11 Menu</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Terhubung otomatis</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Mata Pelajaran SD</span>
                    <BookOpen className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-2xl font-black text-slate-900">10 Mapel</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Fase A, B, dan C</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Target Generasi AI</span>
                    <Clock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-2xl font-black text-indigo-950">~5 Detik</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Super Responsif</span>
                </div>
              </div>

              {/* 11 Document Quick Launch Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Alur Pembuatan Administrasi Terpadu (CP → Nilai)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pilih dokumen yang ingin Anda hasilkan hari ini:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {menus.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMenu(m.id)}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
                    >
                      <span className="text-2xl block mb-2">{m.icon}</span>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-900">
                        {m.label}
                      </h4>
                      <span className="text-[11px] text-slate-500 mt-0.5 block flex items-center gap-1 group-hover:text-blue-700">
                        <span>Buka Generator</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Saved Documents Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-900" />
                    <span>Dokumen Terbaru Anda</span>
                  </h3>
                  {savedDocuments.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveMenu('saved_docs')}
                      className="text-xs text-blue-700 font-bold hover:underline"
                    >
                      Lihat Semua ({savedDocuments.length})
                    </button>
                  )}
                </div>

                {savedDocuments.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                      Belum ada dokumen tersimpan. Mulai buat administrasi pembelajaran Anda menggunakan EDU PLAN AI.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveMenu('CP')}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Buat Dokumen Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {savedDocuments.slice(0, 5).map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => handleOpenDocFromList(doc)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-bold text-[10px] rounded uppercase">
                            {doc.documentType}
                          </span>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{doc.title}</h4>
                            <span className="text-[11px] text-slate-500">
                              {doc.subject} • Kelas {doc.grade} • {doc.material}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SAVED DOCUMENTS LIST */}
          {activeMenu === 'saved_docs' && (
            <SavedDocumentsList
              documents={savedDocuments}
              onOpenDoc={handleOpenDocFromList}
              onDeleteDoc={onDeleteDocument}
              onStartCreateDoc={() => setActiveMenu('CP')}
            />
          )}

          {/* STUDENTS MANAGER */}
          {activeMenu === 'students' && (
            <StudentManager
              userId={currentUser.id}
              students={students}
              grade={currentGrade}
              onUpdateStudents={setStudents}
            />
          )}

          {/* EDITOR VIEW OF AN OPENED SAVED DOCUMENT */}
          {activeMenu === 'editor_view' && editingDoc && (
            <div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setActiveMenu('saved_docs')}
                  className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>← Kembali ke Daftar Dokumen</span>
                </button>
              </div>
              <DocumentEditor
                initialContent={editingDoc.content}
                documentTitle={editingDoc.title}
                documentType={editingDoc.documentType}
                onSave={(newHtml) => {
                  const updated: SavedDocument = {
                    ...editingDoc,
                    content: newHtml,
                    updatedAt: new Date().toISOString(),
                  };
                  onSaveDocument(updated);
                  setEditingDoc(updated);
                }}
              />
            </div>
          )}

          {/* 11 MENUS GENERATORS */}
          {menus.map((m) => {
            if (activeMenu !== m.id) return null;

            return (
              <div key={m.id} className="space-y-6">
                {/* Specific custom interactive view for Attendance and Grades */}
                {m.id === 'HADIR' && (
                  <InteractiveAttendance
                    students={students}
                    grade={currentGrade}
                    subject={currentSubject}
                    semester="1 (Ganjil)"
                    schoolYear={currentUser.schoolProfile.schoolYear || '2026/2027'}
                    schoolName={currentUser.schoolProfile.name}
                    teacherName={currentUser.teacherProfile.name || currentUser.name}
                  />
                )}

                {m.id === 'NILAI' && (
                  <InteractiveGrades
                    students={students}
                    grade={currentGrade}
                    subject={currentSubject}
                    semester="1 (Ganjil)"
                    schoolYear={currentUser.schoolProfile.schoolYear || '2026/2027'}
                    material="Aktivitas Kebugaran Jasmani dan Pola Hidup Sehat"
                    schoolName={currentUser.schoolProfile.name}
                    teacherName={currentUser.teacherProfile.name || currentUser.name}
                  />
                )}

                {/* Formal Generator for this document type */}
                <DocumentGenerator
                  documentType={m.id}
                  currentUser={currentUser}
                  savedDocuments={savedDocuments}
                  onSaveDocument={(doc) => {
                    onSaveDocument(doc);
                    alert(`Dokumen "${doc.title}" berhasil disimpan ke arsip Anda!`);
                  }}
                  onNavigateToType={(nextType) => setActiveMenu(nextType)}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
