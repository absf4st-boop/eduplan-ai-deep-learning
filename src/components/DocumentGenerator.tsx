import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Layers,
  History,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { DocumentType, UserAccount, SavedDocument } from '../types';
import { DocumentEditor } from './DocumentEditor';

interface DocumentGeneratorProps {
  documentType: DocumentType;
  currentUser: UserAccount;
  savedDocuments: SavedDocument[];
  onSaveDocument: (doc: SavedDocument) => void;
  onNavigateToType: (type: DocumentType) => void;
}

export const SUBJECT_OPTIONS = [
  'PJOK',
  'PAI dan Budi Pekerti',
  'MATEMATIKA',
  'BAHASA JAWA',
  'BAHASA INDONESIA',
  'IPAS',
  'SENI MUSIK',
  'SENI TARI',
  'BAHASA INGGRIS',
  'PENDIDIKAN PANCASILA',
];

export const GRADE_PHASE_MAP: Record<string, string> = {
  '1': 'A',
  '2': 'A',
  '3': 'B',
  '4': 'B',
  '5': 'C',
  '6': 'C',
};

export const DOC_PIPELINE_ORDER: DocumentType[] = [
  'CP',
  'TP',
  'ATP',
  'PROTA',
  'PROMES',
  'RPP',
  'MODUL_AJAR',
  'LKPD',
  'JURNAL',
  'HADIR',
  'NILAI',
];

export const DOC_TITLES: Record<DocumentType, string> = {
  CP: 'Capaian Pembelajaran (CP)',
  TP: 'Tujuan Pembelajaran (TP)',
  ATP: 'Alur Tujuan Pembelajaran (ATP)',
  RPP: 'Rencana Pelaksanaan Pembelajaran (RPP)',
  MODUL_AJAR: 'Modul Ajar Deep Learning',
  PROTA: 'Program Tahunan (PROTA)',
  PROMES: 'Program Semester (PROMES)',
  LKPD: 'Lembar Kerja Peserta Didik (LKPD)',
  JURNAL: 'Jurnal Harian Guru',
  HADIR: 'Daftar Hadir Peserta Didik',
  NILAI: 'Daftar Nilai Asesmen',
};

export const DEFAULT_MATERIALS: Record<string, string> = {
  PJOK: 'Aktivitas Kebugaran Jasmani & Pola Hidup Sehat Berkelanjutan',
  'PAI dan Budi Pekerti': 'Meneladani Sifat Akhlak Mulia dan Kasih Sayang terhadap Sesama',
  MATEMATIKA: 'Operasi Hitung Pecahan dan Pengukuran dalam Kehidupan Sehari-hari',
  'BAHASA JAWA': 'Unggah-Ungguh Basa lan Maca Geguritan Kanthi Rasa Pangrasa',
  'BAHASA INDONESIA': 'Menulis Teks Eksplanasi Fakta dan Menyimak Berkesadaran',
  IPAS: 'Ekosistem dan Harmoni Keanekaragaman Hayati di Lingkungan Sekitar',
  'SENI MUSIK': 'Irama, Pola Ritme, dan Bernyanyi Lagu Daerah Secara Harmonis',
  'SENI TARI': 'Eksplorasi Gerak Tari Tradisional Berpola Ruang dan Level',
  'BAHASA INGGRIS': 'Daily Activities and Asking for Help with Polite Expression',
  'PENDIDIKAN PANCASILA': 'Penerapan Nilai Gotong Royong dan Hak Kewajiban Warga Negara',
};

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  documentType,
  currentUser,
  savedDocuments,
  onSaveDocument,
  onNavigateToType,
}) => {
  // Settings state (Default: PJOK - Kelas 5 - Fase C)
  const [subject, setSubject] = useState<string>('PJOK');
  const [grade, setGrade] = useState<string>('5');
  const [phase, setPhase] = useState<string>('C');
  const [semester, setSemester] = useState<string>('1 (Ganjil)');
  const [schoolYear, setSchoolYear] = useState<string>(currentUser.schoolProfile.schoolYear || '2026/2027');
  const [material, setMaterial] = useState<string>(DEFAULT_MATERIALS['PJOK']);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');

  // Deep learning dimension selections
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'Penalaran kritis',
    'Kolaborasi',
    'Kemandirian',
    'Kesehatan',
  ]);

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [linkedDocs, setLinkedDocs] = useState<SavedDocument[]>([]);
  const [sourceNotice, setSourceNotice] = useState<string | null>(null);

  // Sync phase whenever grade changes
  useEffect(() => {
    setPhase(GRADE_PHASE_MAP[grade] || 'C');
  }, [grade]);

  // Sync default material when subject changes
  useEffect(() => {
    if (DEFAULT_MATERIALS[subject]) {
      setMaterial(DEFAULT_MATERIALS[subject]);
    }
  }, [subject]);

  // Find upstream linked documents (e.g. for TP, look for CP; for ATP, look for TP, etc.)
  useEffect(() => {
    const upstreamTypes: Record<DocumentType, DocumentType[]> = {
      CP: [],
      TP: ['CP'],
      ATP: ['TP', 'CP'],
      PROTA: ['ATP', 'TP'],
      PROMES: ['ATP', 'TP'],
      RPP: ['MODUL_AJAR', 'ATP', 'TP', 'CP'],
      MODUL_AJAR: ['ATP', 'TP', 'CP'],
      LKPD: ['MODUL_AJAR', 'RPP', 'TP'],
      JURNAL: ['MODUL_AJAR', 'ATP'],
      HADIR: [],
      NILAI: ['TP', 'MODUL_AJAR'],
    };

    const targetUpstreams = upstreamTypes[documentType] || [];
    const matched = savedDocuments.filter(
      (d) => targetUpstreams.includes(d.documentType) && d.subject === subject && d.grade === grade
    );
    setLinkedDocs(matched);
  }, [documentType, subject, grade, savedDocuments]);

  // Use previous document data
  const handleUsePreviousDoc = (doc: SavedDocument) => {
    setMaterial(doc.material);
    setSourceNotice(`Data diambil dari dokumen sumber: ${doc.title} (${doc.documentType})`);
    setTimeout(() => setSourceNotice(null), 4000);
  };

  const toggleDimension = (dim: string) => {
    if (selectedDimensions.includes(dim)) {
      setSelectedDimensions(selectedDimensions.filter((d) => d !== dim));
    } else {
      setSelectedDimensions([...selectedDimensions, dim]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep(1);

    // Prepare context documents for prompt
    const contextMap: Record<string, string> = {};
    linkedDocs.forEach((d) => {
      contextMap[`${d.documentType}_${d.title}`] = d.content.substring(0, 1500); // pass contextual snippet
    });

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType,
          subject,
          grade,
          phase,
          semester,
          schoolYear,
          material,
          additionalInstructions: `${additionalInstructions}. Dimensi Profil Lulusan: ${selectedDimensions.join(', ')}. Pendekatan 3 Prinsip Deep Learning (Mindful, Meaningful, Joyful).`,
          teacher: currentUser.teacherProfile,
          school: currentUser.schoolProfile,
          contextDocuments: contextMap,
        }),
      });

      const data = await response.json();
      clearInterval(stepInterval);
      setGenerationStep(5);

      setTimeout(() => {
        setIsGenerating(false);
        if (data && data.content) {
          setGeneratedHtml(data.content);
        }
      }, 600);
    } catch (err) {
      console.error('Generation error', err);
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleSaveToWorkspace = (contentToSave: string) => {
    const newDoc: SavedDocument = {
      id: 'doc_' + Date.now(),
      userId: currentUser.id,
      documentType,
      title: `${DOC_TITLES[documentType]} - ${subject} Kelas ${grade}`,
      subject,
      grade,
      phase,
      semester,
      schoolYear,
      material,
      content: contentToSave,
      sourceDocumentIds: linkedDocs.map((d) => d.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveDocument(newDoc);
  };

  // Next document in pipeline
  const currentIndex = DOC_PIPELINE_ORDER.indexOf(documentType);
  const nextDocType = currentIndex >= 0 && currentIndex < DOC_PIPELINE_ORDER.length - 1
    ? DOC_PIPELINE_ORDER[currentIndex + 1]
    : null;

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-lg border border-blue-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-400 text-blue-950 font-black text-xs rounded-lg uppercase tracking-wider">
                ADMINISTRASI GURU SD
              </span>
              <span className="text-xs text-blue-200">
                Tahun Ajaran {schoolYear}
              </span>
            </div>
            <h2 className="text-2xl font-black mt-2 tracking-tight">
              {DOC_TITLES[documentType]}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1 leading-relaxed">
              Disusun berbasis kerangka <strong>Pembelajaran Mendalam (Deep Learning)</strong>: Berkesadaran (Mindful), Bermakna (Meaningful), dan Menggembirakan (Joyful).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 self-start md:self-auto">
            <Zap className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-blue-200 block font-bold">
                Kecepatan Generator
              </span>
              <span className="text-xs font-bold text-white">Target Optimal 5 Detik</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Documents Banner (Sistem Keterhubungan Antarmenu) */}
      {linkedDocs.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <LinkIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Sistem Keterhubungan Antarmenu Aktif
              </h4>
              <p className="text-[11px] text-amber-800">
                Ditemukan {linkedDocs.length} dokumen acuan terkait ({linkedDocs.map((d) => d.documentType).join(', ')}). Anda dapat menggunakan data yang sudah ada agar materi sinkron secara otomatis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {linkedDocs.slice(0, 2).map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleUsePreviousDoc(doc)}
                className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Gunakan Data {doc.documentType}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {sourceNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{sourceNotice}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-5 h-5 text-blue-900" />
          <span>Pengaturan Pembelajaran</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Mata Pelajaran (10 Pilihan) *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {SUBJECT_OPTIONS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Kelas & Fase */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kelas & Fase *
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="1">Kelas 1 (Fase A)</option>
              <option value="2">Kelas 2 (Fase A)</option>
              <option value="3">Kelas 3 (Fase B)</option>
              <option value="4">Kelas 4 (Fase B)</option>
              <option value="5">Kelas 5 (Fase C)</option>
              <option value="6">Kelas 6 (Fase C)</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Semester *
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
              <option value="2 (Genap)">Semester 2 (Genap)</option>
            </select>
          </div>

          {/* Tahun Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tahun Pelajaran *
            </label>
            <input
              type="text"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              placeholder="2026/2027"
            />
          </div>
        </div>

        {/* Topik / Materi Pembelajaran */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Topik / Materi Pembelajaran *
          </label>
          <input
            type="text"
            required
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            placeholder="Contoh: Aktivitas Kebugaran Jasmani dan Pola Hidup Sehat"
          />
        </div>

        {/* 8 Dimensi Profil Lulusan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Delapan Dimensi Profil Lulusan (Deep Learning Framework)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Keimanan dan ketakwaan',
              'Kewargaan',
              'Penalaran kritis',
              'Kreativitas',
              'Kolaborasi',
              'Kemandirian',
              'Kesehatan',
              'Komunikasi',
            ].map((dim) => {
              const active = selectedDimensions.includes(dim);
              return (
                <button
                  key={dim}
                  type="button"
                  onClick={() => toggleDimension(dim)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {dim}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instruksi Tambahan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Instruksi / Catatan Khusus Guru (Opsional)
          </label>
          <textarea
            rows={2}
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Contoh: Sertakan permainan tradisional beregu, tambahkan rubrik asesmen unjuk kerja untuk murid berkebutuhan khusus."
          />
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BookOpen className="w-4 h-4 text-blue-800" />
            <span>
              Identitas otomatis: <strong>{currentUser.teacherProfile.name}</strong> •{' '}
              <strong>{currentUser.schoolProfile.name}</strong>
            </span>
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>GENERATE DENGAN AI</span>
          </button>
        </div>
      </div>

      {/* AI 5-Second Generation Progress Overlay / Animation */}
      {isGenerating && (
        <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8 text-center space-y-5 animate-pulse">
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900">
              EDU PLAN AI sedang menyusun administrasi pembelajaran Anda...
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Menyelaraskan kerangka Pembelajaran Mendalam (Mindful, Meaningful, Joyful)
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="max-w-md mx-auto space-y-2">
            {[
              'Membaca identitas pembelajaran...',
              'Menghubungkan CP, TP, dan ATP...',
              'Menyusun kegiatan pembelajaran mendalam...',
              'Menyusun instrumen asesmen & rubrik...',
              'Menyelesaikan dokumen siap pakai...',
            ].map((stepText, idx) => {
              const isCompleted = generationStep > idx + 1;
              const isCurrent = generationStep === idx + 1;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                      : isCompleted
                      ? 'text-emerald-700 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-900 text-white animate-bounce'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span>{stepText}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Target generasi secepat 5 detik...</span>
          </div>
        </div>
      )}

      {/* Editor Result */}
      {generatedHtml && !isGenerating && (
        <DocumentEditor
          initialContent={generatedHtml}
          documentTitle={`${DOC_TITLES[documentType]} - ${subject} Kelas ${grade}`}
          documentType={documentType}
          onSave={handleSaveToWorkspace}
          onContinueNextDoc={nextDocType ? () => onNavigateToType(nextDocType) : undefined}
          nextDocName={nextDocType ? DOC_TITLES[nextDocType] : undefined}
        />
      )}
    </div>
  );
};
