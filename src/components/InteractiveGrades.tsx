import React, { useState } from 'react';
import { UserAccount, Student } from '../types';
import { getStudents } from '../services/storage';
import { downloadWordDocument, printOrExportPdf } from '../utils/exportUtils';
import { Award, FileDown, Printer, Save, CheckCircle2, Calculator, Info } from 'lucide-react';

interface InteractiveGradesProps {
  user: UserAccount;
  onSaveAsDocument?: (title: string, content: string) => void;
}

export const InteractiveGrades: React.FC<InteractiveGradesProps> = ({
  user,
  onSaveAsDocument,
}) => {
  const students = getStudents(user.id);
  const [grade, setGrade] = useState(user.schoolProfile.activeGrade || '5');
  const [subject, setSubject] = useState(user.schoolProfile.activeSubject || 'PJOK');
  const [semester, setSemester] = useState<'1 (Ganjil)' | '2 (Genap)'>('1 (Ganjil)');
  const [academicYear, setAcademicYear] = useState(user.schoolProfile.academicYear || '2026/2027');

  // Grades state: { [studentId]: { tp1: number, tp2: number, tp3: number, sts: number, sas: number } }
  const [scores, setScores] = useState<Record<string, { tp1: number; tp2: number; tp3: number; sts: number; sas: number }>>(() => {
    const initial: Record<string, { tp1: number; tp2: number; tp3: number; sts: number; sas: number }> = {};
    students.forEach((s, idx) => {
      // Realistic default grades
      const base = 80 + (idx % 12);
      initial[s.id] = {
        tp1: Math.min(100, base + 2),
        tp2: Math.min(100, base - 1),
        tp3: Math.min(100, base + 4),
        sts: Math.min(100, base),
        sas: Math.min(100, base + 3),
      };
    });
    return initial;
  });

  const [savedAlert, setSavedAlert] = useState(false);

  const handleScoreChange = (
    studentId: string,
    field: 'tp1' | 'tp2' | 'tp3' | 'sts' | 'sas',
    val: number
  ) => {
    const clamped = isNaN(val) ? 0 : Math.max(0, Math.min(100, val));
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { tp1: 80, tp2: 80, tp3: 80, sts: 80, sas: 80 }),
        [field]: clamped,
      },
    }));
  };

  const calculateFinal = (studentId: string) => {
    const s = scores[studentId] || { tp1: 80, tp2: 80, tp3: 80, sts: 80, sas: 80 };
    // Formula Kurikulum Merdeka / Deep Learning:
    // Rata-rata Formatif TP (50%) + Sumatif STS (25%) + Sumatif SAS (25%)
    const avgTp = (s.tp1 + s.tp2 + s.tp3) / 3;
    const finalScore = Math.round(avgTp * 0.5 + s.sts * 0.25 + s.sas * 0.25);

    let predicate = 'C';
    let desc = 'Mulai menunjukkan pemahaman dalam pembelajaran mendalam.';
    if (finalScore >= 90) {
      predicate = 'A';
      desc = 'Sangat baik dan mandiri dalam menguasai konsep esensial serta mampu merefleksikan praktik pembelajaran mendalam dengan kritis dan antusias.';
    } else if (finalScore >= 80) {
      predicate = 'B';
      desc = 'Telah mencapai tujuan pembelajaran secara bermakna dan mampu mengaplikasikan keterampilan belajar dengan konsisten dan berkesadaran.';
    } else if (finalScore >= 70) {
      predicate = 'C';
      desc = 'Cukup terampil dalam capaian pembelajaran, memerlukan sedikit bimbingan penguatan konsep pada tahap aplikasi kontekstual.';
    } else {
      predicate = 'D';
      desc = 'Perlu bimbingan dan intervensi khusus untuk meningkatkan pemahaman mendalam dan ketuntasan materi pokok.';
    }

    return { finalScore, predicate, desc, avgTp: Math.round(avgTp) };
  };

  const generateHtmlSummary = () => {
    let rows = '';
    students.forEach((st, idx) => {
      const s = scores[st.id] || { tp1: 80, tp2: 80, tp3: 80, sts: 80, sas: 80 };
      const calc = calculateFinal(st.id);
      rows += `
        <tr>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${idx + 1}</td>
          <td style="border:1px solid #cbd5e1; padding:6px;"><strong>${st.name}</strong><br/><small style="color:#64748b;">${st.nisn}</small></td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${st.gender}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${s.tp1}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${s.tp2}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${s.tp3}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold; background:#f8fafc;">${calc.avgTp}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${s.sts}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${s.sas}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold; font-size:11pt; background:#f0fdf4; color:#15803d;">${calc.finalScore}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold;">${calc.predicate}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; font-size:8.5pt;">${calc.desc}</td>
        </tr>
      `;
    });

    return `
      <div style="font-family:'Times New Roman', Times, serif; color:#0f172a; line-height:1.4;">
        <div style="text-align:center; margin-bottom:16px;">
          <h2 style="margin:0; font-size:15pt; font-weight:bold; text-transform:uppercase;">DAFTAR REKAPITULASI NILAI DEEP LEARNING (RAPOR MERDEKA)</h2>
          <h3 style="margin:4px 0 0; font-size:12pt; font-weight:bold;">${(user.schoolProfile.schoolName || user.schoolProfile.name || 'SD NEGERI').toUpperCase()}</h3>
          <p style="margin:4px 0 0; font-size:10pt;">Mata Pelajaran: ${subject} | Kelas: ${grade} | Semester: ${semester} | Tahun Pelajaran: ${academicYear}</p>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:9pt; margin-bottom:20px;">
          <thead>
            <tr style="background:#f1f5f9; text-align:center;">
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; width:30px;">No</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; text-align:left;">Nama Siswa</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; width:30px;">L/P</th>
              <th colspan="4" style="border:1px solid #cbd5e1; padding:4px;">Asesmen Formatif (TP)</th>
              <th colspan="2" style="border:1px solid #cbd5e1; padding:4px;">Asesmen Sumatif</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; width:45px; background:#e2e8f0;">NA</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; width:35px;">Predikat</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; min-width:180px;">Deskripsi Capaian Kompetensi (Deep Learning)</th>
            </tr>
            <tr style="background:#f8fafc; text-align:center;">
              <th style="border:1px solid #cbd5e1; padding:4px; width:40px;">TP 1</th>
              <th style="border:1px solid #cbd5e1; padding:4px; width:40px;">TP 2</th>
              <th style="border:1px solid #cbd5e1; padding:4px; width:40px;">TP 3</th>
              <th style="border:1px solid #cbd5e1; padding:4px; width:40px; background:#f1f5f9;">Rata</th>
              <th style="border:1px solid #cbd5e1; padding:4px; width:40px;">STS</th>
              <th style="border:1px solid #cbd5e1; padding:4px; width:40px;">SAS</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="margin-top:24px; display:flex; justify-content:space-between; font-size:10pt;">
          <div style="float:left; width:45%; text-align:center;">
            <p style="margin:0;">Mengetahui,</p>
            <p style="margin:0 0 50px;">Kepala ${user.schoolProfile.schoolName}</p>
            <p style="margin:0; font-weight:bold; text-decoration:underline;">${user.schoolProfile.headmaster?.name || 'Drs. H. Slamet Raharjo, M.Pd.'}</p>
            <p style="margin:0;">NIP. ${user.schoolProfile.headmaster?.nip || '19680512 199303 1 004'}</p>
          </div>
          <div style="float:right; width:45%; text-align:center;">
            <p style="margin:0;">${user.schoolProfile.regency}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin:0 0 50px;">Guru Mata Pelajaran</p>
            <p style="margin:0; font-weight:bold; text-decoration:underline;">${user.teacherProfile.fullName}</p>
            <p style="margin:0;">NIP. ${user.teacherProfile.nip}</p>
          </div>
          <div style="clear:both;"></div>
        </div>
      </div>
    `;
  };

  const handleDownloadDoc = () => {
    const html = generateHtmlSummary();
    downloadWordDocument(
      `Daftar_Nilai_${grade}_${subject}_Sem${semester[0]}`,
      `DAFTAR NILAI KELAS ${grade} SEMESTER ${semester}`,
      html,
      user.schoolProfile,
      user.teacherProfile
    );
  };

  const handlePrint = () => {
    const html = generateHtmlSummary();
    printOrExportPdf(`Daftar Nilai Kelas ${grade} - ${subject}`, html);
  };

  const handleSaveToDocs = () => {
    if (onSaveAsDocument) {
      const html = generateHtmlSummary();
      onSaveAsDocument(
        `Daftar Nilai Siswa Kelas ${grade} - Semester ${semester} (${subject})`,
        html
      );
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Daftar Nilai & Rapor Peserta Didik (Interaktif)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan nilai formatif TP1–TP3, sumatif STS/SAS dengan perhitungan Nilai Akhir (NA) dan deskripsi capaian otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveToDocs}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan ke Dokumen</span>
          </button>
          <button
            onClick={handleDownloadDoc}
            className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Word</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Daftar Nilai berhasil disimpan ke Arsip Dokumen Anda!</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value as any)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
          >
            <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
            <option value="2 (Genap)">Semester 2 (Genap)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
          >
            <option value="PJOK">PJOK</option>
            <option value="PAI dan Budi Pekerti">PAI dan Budi Pekerti</option>
            <option value="MATEMATIKA">MATEMATIKA</option>
            <option value="BAHASA JAWA">BAHASA JAWA</option>
            <option value="BAHASA INDONESIA">BAHASA INDONESIA</option>
            <option value="IPAS">IPAS</option>
            <option value="SENI MUSIK">SENI MUSIK</option>
            <option value="SENI TARI">SENI TARI</option>
            <option value="BAHASA INGGRIS">BAHASA INGGRIS</option>
            <option value="PENDIDIKAN PANCASILA">PENDIDIKAN PANCASILA</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Kelas SD</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
          >
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
          />
        </div>
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <p className="text-xs text-slate-500">
            Belum ada data siswa. Silakan buka menu <strong>Data Siswa</strong> di sidebar untuk menambah siswa terlebih dahulu.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-center">
              <tr>
                <th rowSpan={2} className="py-2 px-2 w-10">No</th>
                <th rowSpan={2} className="py-2 px-3 text-left min-w-[160px]">Nama Peserta Didik</th>
                <th rowSpan={2} className="py-2 px-2 w-8">L/P</th>
                <th colSpan={4} className="py-1.5 px-2 bg-blue-50/70 border-b border-slate-200">Formatif (TP)</th>
                <th colSpan={2} className="py-1.5 px-2 bg-indigo-50/70 border-b border-slate-200">Sumatif</th>
                <th rowSpan={2} className="py-2 px-2 w-14 bg-emerald-100 text-emerald-900 font-bold">NA</th>
                <th rowSpan={2} className="py-2 px-2 w-10">Pred</th>
                <th rowSpan={2} className="py-2 px-3 text-left min-w-[220px]">Deskripsi Capaian (Deep Learning)</th>
              </tr>
              <tr className="bg-slate-50 text-[11px]">
                <th className="py-1.5 px-1 w-14">TP 1</th>
                <th className="py-1.5 px-1 w-14">TP 2</th>
                <th className="py-1.5 px-1 w-14">TP 3</th>
                <th className="py-1.5 px-1 w-14 bg-slate-200 font-bold">Rata</th>
                <th className="py-1.5 px-1 w-14">STS</th>
                <th className="py-1.5 px-1 w-14">SAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st, idx) => {
                const s = scores[st.id] || { tp1: 80, tp2: 80, tp3: 80, sts: 80, sas: 80 };
                const calc = calculateFinal(st.id);

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2 px-2 text-center text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900">{st.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{st.nisn}</div>
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-slate-600">{st.gender}</td>
                    
                    {/* TP 1 */}
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.tp1}
                        onChange={(e) => handleScoreChange(st.id, 'tp1', parseInt(e.target.value))}
                        className="w-12 text-center py-1 bg-white border border-slate-300 rounded font-semibold text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    {/* TP 2 */}
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.tp2}
                        onChange={(e) => handleScoreChange(st.id, 'tp2', parseInt(e.target.value))}
                        className="w-12 text-center py-1 bg-white border border-slate-300 rounded font-semibold text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    {/* TP 3 */}
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.tp3}
                        onChange={(e) => handleScoreChange(st.id, 'tp3', parseInt(e.target.value))}
                        className="w-12 text-center py-1 bg-white border border-slate-300 rounded font-semibold text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    {/* Rata TP */}
                    <td className="py-2 px-1 text-center font-bold text-slate-700 bg-slate-100 font-mono">
                      {calc.avgTp}
                    </td>

                    {/* STS */}
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.sts}
                        onChange={(e) => handleScoreChange(st.id, 'sts', parseInt(e.target.value))}
                        className="w-12 text-center py-1 bg-white border border-slate-300 rounded font-semibold text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    {/* SAS */}
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.sas}
                        onChange={(e) => handleScoreChange(st.id, 'sas', parseInt(e.target.value))}
                        className="w-12 text-center py-1 bg-white border border-slate-300 rounded font-semibold text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* NA */}
                    <td className="py-2 px-2 text-center font-bold text-emerald-800 bg-emerald-50 text-sm font-mono">
                      {calc.finalScore}
                    </td>
                    {/* Predikat */}
                    <td className="py-2 px-2 text-center font-bold text-slate-800">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        calc.predicate === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        calc.predicate === 'B' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {calc.predicate}
                      </span>
                    </td>
                    {/* Deskripsi */}
                    <td className="py-2 px-3 text-[11px] text-slate-600 leading-snug">
                      {calc.desc}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Info note */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Bobot Penghitungan Nilai Akhir (NA):</strong> Rata-rata Formatif (50%) + Sumatif Tengah Semester (25%) + Sumatif Akhir Semester (25%). Deskripsi capaian kompetensi merefleksikan 3 prinsip Deep Learning (Berkesadaran, Bermakna, Menggembirakan).
        </div>
      </div>
    </div>
  );
};
