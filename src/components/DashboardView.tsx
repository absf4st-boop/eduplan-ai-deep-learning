import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  DocumentType,
  SavedDocument
} from '../types';
import { Logo } from './Logo';
import { DocumentGenerator } from './DocumentGenerator';
import { DocumentEditor } from './DocumentEditor';
import { SavedDocumentsList } from './SavedDocumentsList';
import { StudentManager } from './StudentManager';
import { InteractiveAttendance } from './InteractiveAttendance';
import { InteractiveGrades } from './InteractiveGrades';
import { ProfileModal } from './ProfileModal';
import { PublishGuideModal } from './PublishGuideModal';
import { getDocuments, saveDocument } from '../services/storage';
import { auth, subscribeToUserDocuments } from '../services/firebase';
import {
  LayoutDashboard,
  FileText,
  Users,
  Award,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
  Layers,
  BookOpen,
  Menu,
  X,
  Building2,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  Globe
} from 'lucide-react';

interface DashboardViewProps {
  user: UserAccount;
  onLogout: () => void;
  onUserUpdated: (updated: UserAccount) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onLogout,
  onUserUpdated,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'generator' | 'documents' | 'students' | 'attendance' | 'grades'
  >('overview');

  const [activeGeneratorType, setActiveGeneratorType] = useState<DocumentType>('MODUL_AJAR');
  const [selectedDoc, setSelectedDoc] = useState<SavedDocument | null>(null);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPublishGuideOpen, setIsPublishGuideOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Documents list for current user
  const [documents, setDocuments] = useState<SavedDocument[]>(() => getDocuments(user.id));

  // Attach real-time Firestore onSnapshot listener when authenticated in Firebase
  useEffect(() => {
    // Initial sync from local storage
    setDocuments(getDocuments(user.id));

    const handleDocsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setDocuments(e.detail);
      } else {
        setDocuments(getDocuments(user.id));
      }
    };
    window.addEventListener('eduplan:documents-updated', handleDocsUpdated);

    if (!user.isDemo && auth.currentUser) {
      const unsub = subscribeToUserDocuments(user.id, (firestoreDocs) => {
        if (firestoreDocs) {
          setDocuments(firestoreDocs);
        }
      });
      return () => {
        window.removeEventListener('eduplan:documents-updated', handleDocsUpdated);
        unsub();
      };
    }

    return () => {
      window.removeEventListener('eduplan:documents-updated', handleDocsUpdated);
    };
  }, [user.id, user.isDemo]);

  const refreshDocuments = () => {
    setDocuments(getDocuments(user.id));
  };

  const handleDocumentCreated = (newDoc: SavedDocument) => {
    refreshDocuments();
    setSelectedDoc(newDoc);
  };

  const handleSaveDocumentFromModule = (title: string, content: string) => {
    const doc: SavedDocument = {
      id: 'doc_' + Date.now(),
      userId: user.id,
      title,
      type: 'DAFTAR_HADIR',
      subject: user.schoolProfile.activeSubject || 'PJOK',
      grade: user.schoolProfile.activeGrade || '5',
      semester: '1 (Ganjil)',
      academicYear: user.schoolProfile.academicYear || '2026/2027',
      topic: 'Presensi & Kehadiran Kelas ' + (user.schoolProfile.activeGrade || '5'),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deepLearningTags: ['Mindful'],
    };
    saveDocument(doc);
    refreshDocuments();
  };

  const handleNavigateToGenerator = (type: DocumentType) => {
    setActiveGeneratorType(type);
    setSelectedDoc(null);
    setActiveTab('generator');
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo size="sm" variant="dark" />
          </div>

          {/* User info & quick buttons */}
          <div className="flex items-center gap-3">
            {user.isDemo && (
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                DATA DEMO
              </span>
            )}

            <button
              onClick={() => setIsPublishGuideOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              <span>Panduan GitHub / Netlify</span>
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition text-left cursor-pointer"
            >
              {user.schoolProfile.logoUrl ? (
                <img
                  src={user.schoolProfile.logoUrl}
                  alt="Logo"
                  className="w-7 h-7 rounded-full object-contain border border-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-xs">
                <div className="font-bold text-slate-800 truncate max-w-[130px]">{user.name}</div>
                <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{user.schoolProfile.schoolName}</div>
              </div>
            </button>

            <button
              onClick={onLogout}
              title="Keluar (Logout)"
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 transform lg:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Top */}
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Mobile close button */}
            <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-white">Menu Ruang Kerja</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* School badge */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Satuan Pendidikan</div>
              <div className="text-xs font-bold text-white truncate">{user.schoolProfile.schoolName}</div>
              <div className="text-[11px] text-amber-400 font-medium mt-1">
                {user.schoolProfile.activeSubject} • Kelas {user.schoolProfile.activeGrade} ({user.schoolProfile.activePhase})
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 text-xs">
              <button
                onClick={() => { setActiveTab('overview'); setSelectedDoc(null); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Beranda Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab('documents'); setSelectedDoc(null); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                  activeTab === 'documents'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Arsip Dokumen</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
                  {documents.length}
                </span>
              </button>

              <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                11 Generator AI Administrasi
              </div>

              {[
                { type: 'MODUL_AJAR', label: 'Modul Ajar Deep Learning' },
                { type: 'RPP', label: 'RPP Merdeka 1 Lembar' },
                { type: 'LKPD', label: 'LKPD Peserta Didik' },
                { type: 'TP', label: 'TP – Tujuan Pembelajaran' },
                { type: 'ATP', label: 'ATP – Alur Tujuan' },
                { type: 'CP', label: 'CP – Capaian Pembelajaran' },
                { type: 'PROTA', label: 'PROTA – Program Tahunan' },
                { type: 'PROMES', label: 'PROMES – Program Semester' },
                { type: 'JURNAL_HARIAN', label: 'Jurnal Harian Guru' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleNavigateToGenerator(item.type as DocumentType)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    activeTab === 'generator' && activeGeneratorType === item.type
                      ? 'bg-blue-600/80 text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}

              <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Presensi & Penilaian
              </div>

              <button
                onClick={() => { setActiveTab('attendance'); setSelectedDoc(null); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>10. Daftar Hadir Siswa</span>
              </button>

              <button
                onClick={() => { setActiveTab('grades'); setSelectedDoc(null); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  activeTab === 'grades'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>11. Daftar Nilai & Rapor</span>
              </button>

              <button
                onClick={() => { setActiveTab('students'); setSelectedDoc(null); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Data Peserta Didik</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Bottom Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Pengaturan Identitas & Logo</span>
            </button>
            <div className="text-[10px] text-slate-500 text-center pt-1">
              EDU PLAN AI v2.5 | huseinapriyanto
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* If viewing/editing a selected document */}
          {selectedDoc ? (
            <DocumentEditor
              document={selectedDoc}
              user={user}
              onBack={() => setSelectedDoc(null)}
              onSave={(updated) => {
                saveDocument(updated);
                setSelectedDoc(updated);
                refreshDocuments();
              }}
            />
          ) : (
            <>
              {/* TAB 1: OVERVIEW BERANDA */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Welcome Hero Banner */}
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-3xl space-y-3 relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pembelajaran Mendalam (Deep Learning) SD</span>
                      </div>

                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">
                        Selamat Datang, {user.teacherProfile.fullName}!
                      </h1>

                      <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
                        Anda saat ini mengelola administrasi di <strong>{user.schoolProfile.schoolName}</strong> pada mata pelajaran <strong>{user.schoolProfile.activeSubject}</strong> (Kelas {user.schoolProfile.activeGrade} - {user.schoolProfile.activePhase}) Tahun Ajaran {user.schoolProfile.academicYear}.
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2.5">
                        <button
                          onClick={() => handleNavigateToGenerator('MODUL_AJAR')}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Buat Modul Ajar Baru</span>
                        </button>
                        <button
                          onClick={() => handleNavigateToGenerator('RPP')}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Buat RPP Merdeka</span>
                        </button>
                        <button
                          onClick={() => setIsProfileOpen(true)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>Ubah Identitas / Ganti Logo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Dokumen Tersimpan</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{documents.length}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Siap unduh Word & PDF</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Mata Pelajaran</div>
                      <div className="text-xl font-bold text-blue-700 mt-1 truncate">{user.schoolProfile.activeSubject}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Kelas {user.schoolProfile.activeGrade} SD</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Capaian Fase</div>
                      <div className="text-xl font-bold text-indigo-700 mt-1">{user.schoolProfile.activePhase}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Kurikulum Merdeka</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Tahun Ajaran</div>
                      <div className="text-xl font-bold text-amber-700 mt-1">{user.schoolProfile.academicYear}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Status Aktif</div>
                    </div>
                  </div>

                  {/* Quick Generators Grid */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-700" />
                        <span>Pintas Pembuatan Administrasi Cepat</span>
                      </h3>
                      <button
                        onClick={() => { setActiveTab('documents'); setSelectedDoc(null); }}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        Lihat Semua Dokumen &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                      {[
                        { type: 'MODUL_AJAR', name: 'Modul Ajar Deep Learning', desc: 'Lengkap Berkesadaran, Bermakna, Menggembirakan' },
                        { type: 'RPP', name: 'RPP Merdeka 1 Lembar', desc: 'Ringkas, praktis, dan berorientasi murid' },
                        { type: 'LKPD', name: 'LKPD Peserta Didik', desc: 'Aktivitas eksplorasi interaktif kontekstual' },
                        { type: 'TP', name: 'Tujuan Pembelajaran (TP)', desc: 'Rumusan kompetensi dan variasi mendalam' },
                        { type: 'ATP', name: 'Alur Tujuan (ATP)', desc: 'Peta urutan pembelajaran berfase' },
                        { type: 'CP', name: 'Capaian Pembelajaran (CP)', desc: 'Analisis elemen dan capaian pembelajaran' },
                        { type: 'PROTA', name: 'Program Tahunan (PROTA)', desc: 'Distribusi alokasi waktu tahunan' },
                        { type: 'PROMES', name: 'Program Semester (PROMES)', desc: 'Distribusi tatap muka per semester' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => handleNavigateToGenerator(item.type as DocumentType)}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/70 hover:border-blue-300 text-left transition group cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-700">
                              {item.name}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-2 text-[10px] font-semibold text-blue-600 flex items-center gap-1">
                            <span>Buat Sekarang</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Documents Table / Empty State */}
                  <SavedDocumentsList
                    documents={documents}
                    user={user}
                    onSelectDocument={(doc) => setSelectedDoc(doc)}
                    onRefresh={refreshDocuments}
                  />
                </div>
              )}

              {/* TAB 2: AI GENERATOR */}
              {activeTab === 'generator' && (
                <DocumentGenerator
                  initialType={activeGeneratorType}
                  user={user}
                  onDocumentCreated={handleDocumentCreated}
                />
              )}

              {/* TAB 3: SAVED DOCUMENTS */}
              {activeTab === 'documents' && (
                <SavedDocumentsList
                  documents={documents}
                  user={user}
                  onSelectDocument={(doc) => setSelectedDoc(doc)}
                  onRefresh={refreshDocuments}
                />
              )}

              {/* TAB 4: STUDENTS */}
              {activeTab === 'students' && (
                <StudentManager
                  userId={user.id}
                  grade={user.schoolProfile.activeGrade || '5'}
                />
              )}

              {/* TAB 5: ATTENDANCE */}
              {activeTab === 'attendance' && (
                <InteractiveAttendance
                  user={user}
                  onSaveAsDocument={handleSaveDocumentFromModule}
                />
              )}

              {/* TAB 6: GRADES */}
              {activeTab === 'grades' && (
                <InteractiveGrades
                  user={user}
                  onSaveAsDocument={handleSaveDocumentFromModule}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        user={user}
        onClose={() => setIsProfileOpen(false)}
        onUpdated={(updated) => {
          onUserUpdated(updated);
          setIsProfileOpen(false);
        }}
      />

      {/* Publish Guide Modal */}
      <PublishGuideModal
        isOpen={isPublishGuideOpen}
        onClose={() => setIsPublishGuideOpen(false)}
      />
    </div>
  );
};
