import React, { useState } from 'react';
import {
  DocumentType,
  GenerationParams,
  UserAccount,
  SavedDocument
} from '../types';
import { generateCurriculumFallback } from '../services/curriculumGenerator';
import { saveDocument } from '../services/storage';
import { downloadWordDocument, printOrExportPdf } from '../utils/exportUtils';
import {
  Sparkles,
  Wand2,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Save,
  FileDown,
  Printer,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Compass,
  Smile,
  Brain,
  Lightbulb
} from 'lucide-react';

interface DocumentGeneratorProps {
  initialType?: DocumentType;
  user: UserAccount;
  onDocumentCreated: (doc: SavedDocument) => void;
}

const DOCUMENT_MENU_LIST: { id: DocumentType; label: string; desc: string }[] = [
  { id: 'TP', label: '1. TP – Tujuan Pembelajaran', desc: 'Rumusan tujuan berbasis kompetensi, konten, dan variasi mendalam' },
  { id: 'ATP', label: '2. ATP – Alur Tujuan Pembelajaran', desc: 'Urutan capaian pembelajaran logis berfase terstruktur' },
  { id: 'CP', label: '3. CP – Capaian Pembelajaran', desc: 'Pemetaan elemen, capaian fase dan analisis kompetensi' },
  { id: 'RPP', label: '4. RPP – Rencana Pelaksanaan', desc: 'Format ringkas 1 lembar / terintegrasi Deep Learning' },
  { id: 'MODUL_AJAR', label: '5. Modul Ajar Deep Learning', desc: 'Perangkat ajar komprehensif berkesadaran, bermakna, menggembirakan' },
  { id: 'PROTA', label: '6. PROTA – Program Tahunan', desc: 'Alokasi waktu seluruh bab/materi selama satu tahun ajaran' },
  { id: 'PROMES', label: '7. PROMES – Program Semester', desc: 'Distribusi materi mingguan per semester ganjil/genap' },
  { id: 'LKPD', label: '8. LKPD – Lembar Kerja Siswa', desc: 'Aktivitas eksplorasi siswa kontekstual & reflektif' },
  { id: 'JURNAL_HARIAN', label: '9. Jurnal Harian Mengajar', desc: 'Catatan pelaksanaan tatap muka harian, kendala & tindak lanjut' },
  { id: 'DAFTAR_HADIR', label: '10. Daftar Hadir & Presensi', desc: 'Format absensi siswa SD terstruktur' },
  { id: 'DAFTAR_NILAI', label: '11. Daftar Nilai & Asesmen', desc: 'Format rekapitulasi nilai formatif TP & sumatif STS/SAS' },
];

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  initialType = 'MODUL_AJAR',
  user,
  onDocumentCreated,
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialType);

  // Form parameters
  const [subject, setSubject] = useState(user.schoolProfile.activeSubject || 'PJOK');
  const [grade, setGrade] = useState(user.schoolProfile.activeGrade || '5');
  const [phase, setPhase] = useState(user.schoolProfile.activePhase || 'Fase C');
  const [semester, setSemester] = useState<'1 (Ganjil)' | '2 (Genap)'>('1 (Ganjil)');
  const [academicYear, setAcademicYear] = useState(user.schoolProfile.academicYear || '2026/2027');
  const [topic, setTopic] = useState('Kombinasi Pola Gerak Dasar Lokomotor, Nonlokomotor, dan Manipulatif');
  const [duration, setDuration] = useState('3 JP (3 x 35 Menit)');
  const [learningModel, setLearningModel] = useState('Problem-Based Learning terpadu Deep Learning');
  const [additionalPrompt, setAdditionalPrompt] = useState('');

  // 3 Deep Learning Principles
  const [includeMindful, setIncludeMindful] = useState(true);
  const [includeMeaningful, setIncludeMeaningful] = useState(true);
  const [includeJoyful, setIncludeJoyful] = useState(true);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [engineSource, setEngineSource] = useState<'cloud_ai' | 'smart_fallback' | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto set phase based on grade
  const handleGradeChange = (g: string) => {
    setGrade(g);
    if (g === '1' || g === '2') setPhase('Fase A');
    else if (g === '3' || g === '4') setPhase('Fase B');
    else setPhase('Fase C');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSavedSuccess(false);

    const params: GenerationParams = {
      type: docType,
      subject,
      grade,
      phase,
      semester,
      academicYear,
      topic: topic.trim() || 'Pembelajaran Tematik & Keterampilan Esensial SD',
      duration,
      learningModel,
      additionalPrompt,
      principles: {
        mindful: includeMindful,
        meaningful: includeMeaningful,
        joyful: includeJoyful,
      },
    };

    let resultHtml = '';
    let usedSource: 'cloud_ai' | 'smart_fallback' = 'smart_fallback';

    // 1. Try server-side API proxy first (Vite dev middleware or Netlify function)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params,
          schoolProfile: user.schoolProfile,
          teacherProfile: user.teacherProfile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.html && data.html.length > 50) {
          resultHtml = data.html;
          usedSource = 'cloud_ai';
        }
      }
    } catch (err) {
      // Server not reachable or static host (Netlify static / GitHub Pages)
      console.log('Using robust client-side Deep Learning generation engine.');
    }

    // 2. Fallback to client-side curriculum engine if API did not return HTML
    if (!resultHtml) {
      resultHtml = generateCurriculumFallback(
        params,
        user.schoolProfile,
        user.teacherProfile
      );
      usedSource = 'smart_fallback';
    }

    const docTitle = `${docType.replace('_', ' ')}: ${topic} (${subject} Kelas ${grade})`;
    setGeneratedTitle(docTitle);
    setGeneratedHtml(resultHtml);
    setEngineSource(usedSource);
    setIsGenerating(false);

    // Scroll to preview smoothly
    setTimeout(() => {
      document.getElementById('generation-preview-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSaveToDocs = () => {
    if (!generatedHtml) return;

    const newDoc: SavedDocument = {
      id: 'doc_' + Date.now(),
      userId: user.id,
      title: generatedTitle,
      type: docType,
      subject,
      grade,
      semester,
      academicYear,
      topic,
      content: generatedHtml,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deepLearningTags: ['Mindful', 'Meaningful', 'Joyful'],
    };

    saveDocument(newDoc);
    onDocumentCreated(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadDoc = () => {
    if (!generatedHtml) return;
    downloadWordDocument(
      `${docType}_${subject}_Kelas${grade}_${topic}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
      generatedTitle,
      generatedHtml,
      user.schoolProfile,
      user.teacherProfile
    );
  };

  const handlePrint = () => {
    if (!generatedHtml) return;
    printOrExportPdf(generatedTitle, generatedHtml);
  };

  return (
    <div className="space-y-6">
      {/* 11 Menu Selector Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <span>Pilih Jenis Dokumen Administrasi SD (11 Menu Lengkap):</span>
          </h3>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Pendekatan Deep Learning
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {DOCUMENT_MENU_LIST.map((item) => {
            const isSelected = docType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDocType(item.id)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-slate-50 hover:bg-blue-50/50 text-slate-700 border-slate-200'
                }`}
              >
                <div className="font-bold">{item.label}</div>
                <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-700" />
              <span>Form Parameter Pembuatan Dokumen {docType.replace('_', ' ')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identitas guru dan sekolah ({user.schoolProfile.schoolName}) diterapkan secara otomatis.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Kop Sekolah & Tanda Tangan Siap</span>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Row 1: Subject, Grade, Phase, Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran (SD)</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              >
                <option value="PJOK">1. PJOK</option>
                <option value="PAI dan Budi Pekerti">2. PAI dan Budi Pekerti</option>
                <option value="MATEMATIKA">3. MATEMATIKA</option>
                <option value="BAHASA JAWA">4. BAHASA JAWA</option>
                <option value="BAHASA INDONESIA">5. BAHASA INDONESIA</option>
                <option value="IPAS">6. IPAS</option>
                <option value="SENI MUSIK">7. SENI MUSIK</option>
                <option value="SENI TARI">8. SENI TARI</option>
                <option value="BAHASA INGGRIS">9. BAHASA INGGRIS</option>
                <option value="PENDIDIKAN PANCASILA">10. PENDIDIKAN PANCASILA</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas SD</label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              >
                <option value="1">Kelas 1 (Fase A)</option>
                <option value="2">Kelas 2 (Fase A)</option>
                <option value="3">Kelas 3 (Fase B)</option>
                <option value="4">Kelas 4 (Fase B)</option>
                <option value="5">Kelas 5 (Fase C)</option>
                <option value="6">Kelas 6 (Fase C)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fase Pembelajaran</label>
              <input
                type="text"
                readOnly
                value={phase}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester & Tahun</label>
              <div className="flex gap-2">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as any)}
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                >
                  <option value="1 (Ganjil)">1 (Ganjil)</option>
                  <option value="2 (Genap)">2 (Genap)</option>
                </select>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                  placeholder="2026/2027"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Topic & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Topik / Materi Pembelajaran Pokok
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="contoh: Senam Lantai Guling Depan, Siklus Air, Pecahan Senilai, Dongeng Fabel"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alokasi Waktu</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3 JP (3 x 35 Menit)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Row 3: Model & Deep Learning Principles */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Model / Pendekatan</label>
                <select
                  value={learningModel}
                  onChange={(e) => setLearningModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                >
                  <option value="Problem-Based Learning terpadu Deep Learning">Problem-Based Learning (PBL) terpadu Deep Learning</option>
                  <option value="Project-Based Learning (PjBL) Inovatif">Project-Based Learning (PjBL) Inovatif</option>
                  <option value="Discovery / Inquiry Learning">Discovery / Inquiry Learning</option>
                  <option value="Diferensiasi Konten, Proses & Produk">Pembelajaran Berdiferensiasi</option>
                  <option value="Cooperative Learning Tipe STAD">Cooperative Learning</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan / Instruksi Khusus Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={additionalPrompt}
                  onChange={(e) => setAdditionalPrompt(e.target.value)}
                  placeholder="contoh: Sertakan rubrik asesmen unjuk kerja & ice breaking bertema gerak tubuh"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* 3 Principles Checkboxes */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-xl border border-blue-200">
              <div className="text-xs font-bold text-blue-950 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-700" />
                <span>3 Prinsip Utama Pembelajaran Mendalam (Deep Learning):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMindful}
                    onChange={(e) => setIncludeMindful(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-800">1. Berkesadaran (Mindful)</span>
                    <p className="text-[10px] text-slate-500">Refleksi, pemahaman diri & fokus</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMeaningful}
                    onChange={(e) => setIncludeMeaningful(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-800">2. Bermakna (Meaningful)</span>
                    <p className="text-[10px] text-slate-500">Relevan dengan kehidupan nyata</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeJoyful}
                    onChange={(e) => setIncludeJoyful(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-800">3. Menggembirakan (Joyful)</span>
                    <p className="text-[10px] text-slate-500">Menyenangkan, aktif & antusias</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Kecerdasan Buatan Sedang Menyusun Dokumen Administrasi SD...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>GENERATE DOKUMEN {docType.replace('_', ' ')} DENGAN AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Result Section */}
      <div id="generation-preview-anchor"></div>
      {generatedHtml && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
          {/* Action Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Berhasil Dihasilkan</span>
                </span>
                <span className="text-xs text-slate-500">
                  {engineSource === 'cloud_ai' ? '🤖 Ditenagai Gemini AI Engine' : '⚡ Ditenagai Smart Deep Learning Engine'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{generatedTitle}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveToDocs}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savedSuccess ? 'Tersimpan!' : 'Simpan ke Arsip'}</span>
              </button>

              <button
                onClick={handleDownloadDoc}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Word (.doc)</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dokumen berhasil disimpan ke arsip Ruang Kerja Anda!</span>
            </div>
          )}

          {/* Paper View Container */}
          <div className="bg-slate-200/70 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto">
            <div className="bg-white shadow-xl rounded-sm border border-slate-300 w-full max-w-[850px] p-8 sm:p-12 text-slate-900 font-serif">
              {/* Kop Surat Sekolah */}
              <div className="border-b-4 border-double border-slate-900 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  {user.schoolProfile.logoUrl ? (
                    <img
                      src={user.schoolProfile.logoUrl}
                      alt="Logo Sekolah"
                      className="w-20 h-20 object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 text-center p-1 shrink-0">
                      LOGO SEKOLAH
                    </div>
                  )}
                  <div className="text-center flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      PEMERINTAH {(user.schoolProfile.province || 'JAWA TENGAH').toUpperCase()}
                    </h4>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      DINAS PENDIDIKAN DAN KEBUDAYAAN {(user.schoolProfile.regency || 'KABUPATEN').toUpperCase()}
                    </h4>
                    <h2 className="text-base sm:text-lg font-black uppercase text-slate-950 mt-0.5">
                      {(user.schoolProfile.schoolName || user.schoolProfile.name || 'SD NEGERI').toUpperCase()}
                    </h2>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {user.schoolProfile.address}, Kec. {user.schoolProfile.district}, {user.schoolProfile.regency} | NPSN: {user.schoolProfile.npsn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rendered Content */}
              <div
                className="prose max-w-none text-slate-900 leading-relaxed font-serif text-sm"
                dangerouslySetInnerHTML={{ __html: generatedHtml }}
              />

              {/* Tanda Tangan */}
              <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 text-xs font-serif text-slate-900">
                <div className="text-center">
                  <p>Mengetahui,</p>
                  <p className="font-semibold">Kepala {user.schoolProfile.schoolName}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">{user.schoolProfile.headmaster?.name || 'Drs. H. Slamet Raharjo, M.Pd.'}</p>
                  <p>NIP. {user.schoolProfile.headmaster?.nip || '19680512 199303 1 004'}</p>
                </div>

                <div className="text-center">
                  <p>{user.schoolProfile.regency}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-semibold">Guru Mata Pelajaran</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline uppercase">{user.teacherProfile.fullName}</p>
                  <p>NIP. {user.teacherProfile.nip}</p>
                </div>
              </div>

              {/* Watermark branding */}
              <div className="mt-8 pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                <span>Dihasilkan dengan EDU PLAN AI – DEEP LEARNING</span>
                <span>Developed by huseinapriyanto | 085725080078</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
