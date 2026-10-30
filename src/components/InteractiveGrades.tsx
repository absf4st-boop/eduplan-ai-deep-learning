import React, { useState } from 'react';
import { Student } from '../types';
import { Award, Printer, FileDown, Sliders, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { printOrExportPdf, downloadWordDocument } from '../utils/exportUtils';

interface GradesProps {
  students: Student[];
  grade: string;
  subject: string;
  semester: string;
  schoolYear: string;
  material: string;
  schoolName: string;
  teacherName: string;
}

interface StudentGrade {
  diagnostik: number;
  formatif: number;
  praktik: number;
  proyek: number;
  tugas: number;
  refleksi: number;
  sumatif: number;
}

export const InteractiveGrades: React.FC<GradesProps> = ({
  students,
  grade,
  subject,
  semester,
  schoolYear,
  material,
  schoolName,
  teacherName,
}) => {
  const filteredStudents = students.filter((s) => s.grade === grade);

  // Bobot penilaian (dapat diatur oleh guru)
  const [showWeightsConfig, setShowWeightsConfig] = useState(false);
  const [weights, setWeights] = useState({
    formatif: 20,
    praktik: 25,
    proyek: 20,
    tugas: 15,
    refleksi: 10,
    sumatif: 10,
  });

  const [grades, setGrades] = useState<Record<string, StudentGrade>>(() => {
    const initial: Record<string, StudentGrade> = {};
    const sampleScores = [
      { diagnostik: 85, formatif: 88, praktik: 92, proyek: 90, tugas: 86, refleksi: 92, sumatif: 88 },
      { diagnostik: 80, formatif: 84, praktik: 86, proyek: 85, tugas: 82, refleksi: 85, sumatif: 84 },
      { diagnostik: 75, formatif: 78, praktik: 80, proyek: 82, tugas: 75, refleksi: 80, sumatif: 79 },
      { diagnostik: 90, formatif: 94, praktik: 95, proyek: 94, tugas: 92, refleksi: 95, sumatif: 93 },
      { diagnostik: 70, formatif: 72, praktik: 74, proyek: 72, tugas: 70, refleksi: 75, sumatif: 71 },
    ];
    filteredStudents.forEach((s, idx) => {
      initial[s.id] = sampleScores[idx % sampleScores.length];
    });
    return initial;
  });

  const updateScore = (studentId: string, field: keyof StudentGrade, val: number) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { diagnostik: 75, formatif: 75, praktik: 75, proyek: 75, tugas: 75, refleksi: 75, sumatif: 75 }),
        [field]: Math.min(100, Math.max(0, val)),
      },
    }));
  };

  const calculateFinalScore = (g: StudentGrade) => {
    const totalWeight =
      weights.formatif + weights.praktik + weights.proyek + weights.tugas + weights.refleksi + weights.sumatif;
    const weightedSum =
      g.formatif * weights.formatif +
      g.praktik * weights.praktik +
      g.proyek * weights.proyek +
      g.tugas * weights.tugas +
      g.refleksi * weights.refleksi +
      g.sumatif * weights.sumatif;
    return Number((weightedSum / (totalWeight || 1)).toFixed(1));
  };

  const getAchievementDesc = (finalScore: number, studentName: string) => {
    if (finalScore >= 88) {
      return `Sangat mahir memahami konsep ${material} dan aktif mendemonstrasikan sikap profil lulusan.`;
    } else if (finalScore >= 75) {
      return `Mencapai kompetensi dengan baik dalam aspek praktik dan kerja sama materi ${material}.`;
    } else {
      return `Perlu pendampingan dan remedial pada penguasaan dasar materi ${material}.`;
    }
  };

  const generateGradesTableHtml = () => {
    const rows = filteredStudents
      .map((st, idx) => {
        const g = grades[st.id] || { diagnostik: 75, formatif: 75, praktik: 75, proyek: 75, tugas: 75, refleksi: 75, sumatif: 75 };
        const final = calculateFinalScore(g);
        const desc = getAchievementDesc(final, st.name);
        return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td>${st.nisn}</td>
          <td>${st.name}</td>
          <td style="text-align: center;">${g.formatif}</td>
          <td style="text-align: center;">${g.praktik}</td>
          <td style="text-align: center;">${g.proyek}</td>
          <td style="text-align: center;">${g.tugas}</td>
          <td style="text-align: center;">${g.refleksi}</td>
          <td style="text-align: center;">${g.sumatif}</td>
          <td style="text-align: center; font-weight: bold; color: ${final >= 75 ? '#1e3a8a' : '#b91c1c'};">${final}</td>
          <td>${desc}</td>
        </tr>
      `;
      })
      .join('');

    return `
      <div style="font-family: 'Times New Roman', serif;">
        <div style="text-align: center;">
          <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase;">DAFTAR NILAI ASESMEN PEMBELAJARAN MENDALAM</h2>
          <h3 style="margin: 4px 0 16px 0; font-size: 12pt;">${schoolName}</h3>
        </div>
        <table style="width: 100%; margin-bottom: 12px; font-size: 10.5pt;">
          <tr><td>Mata Pelajaran: <strong>${subject}</strong></td><td>Kelas: <strong>${grade}</strong></td><td>Semester: <strong>${semester}</strong></td><td>Tahun: <strong>${schoolYear}</strong></td></tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;" border="1">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: center;">
              <th>No</th><th>NISN</th><th>Nama Siswa</th>
              <th>Formatif</th><th>Praktik</th><th>Proyek</th><th>Tugas</th><th>Refleksi</th><th>Sumatif</th>
              <th>Nilai Akhir</th><th>Deskripsi Ketercapaian TP</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: right;">
          <p>Guru Pengampu,</p>
          <div style="height: 60px;"></div>
          <p><strong>${teacherName}</strong></p>
        </div>
      </div>
    `;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-900" />
            <span>Kalkulator & Rekap Nilai Pembelajaran Mendalam (Kelas {grade})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Otomatis menghitung bobot nilai, nilai akhir, serta menghasilkan deskripsi capaian kompetensi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowWeightsConfig(!showWeightsConfig)}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Atur Bobot (%)</span>
          </button>
          <button
            type="button"
            onClick={() => downloadWordDocument(generateGradesTableHtml(), `Daftar_Nilai_Kelas_${grade}_${subject}`)}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Unduh Word</span>
          </button>
          <button
            type="button"
            onClick={() => printOrExportPdf(generateGradesTableHtml(), `Daftar_Nilai_Kelas_${grade}_${subject}`)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Weights Config Bar */}
      {showWeightsConfig && (
        <div className="p-4 bg-blue-50/70 border-b border-blue-200 text-xs">
          <span className="font-bold text-blue-950 block mb-2">
            Pengaturan Bobot Penilaian (Harus berjumlah 100%):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div>
              <label className="block text-[10px] text-slate-600 font-bold mb-1">Formatif (%)</label>
              <input
                type="number"
                value={weights.formatif}
                onChange={(e) => setWeights({ ...weights, formatif: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 font-bold mb-1">Praktik (%)</label>
              <input
                type="number"
                value={weights.praktik}
                onChange={(e) => setWeights({ ...weights, praktik: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 font-bold mb-1">Proyek (%)</label>
              <input
                type="number"
                value={weights.proyek}
                onChange={(e) => setWeights({ ...weights, proyek: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 font-bold mb-1">Tugas (%)</label>
              <input
                type="number"
                value={weights.tugas}
                onChange={(e) => setWeights({ ...weights, tugas: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 font-bold mb-1">Refleksi (%)</label>
              <input
                type="number"
                value={weights.refleksi}
                onChange={(e) => setWeights({ ...weights, refleksi: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 font-bold mb-1">Sumatif (%)</label>
              <input
                type="number"
                value={weights.sumatif}
                onChange={(e) => setWeights({ ...weights, sumatif: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Grades Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider text-center">
            <tr>
              <th className="px-3 py-2 w-10">No</th>
              <th className="px-3 py-2 text-left w-44">Nama Siswa</th>
              <th className="px-2 py-2 w-16">Formatif</th>
              <th className="px-2 py-2 w-16">Praktik</th>
              <th className="px-2 py-2 w-16">Proyek</th>
              <th className="px-2 py-2 w-16">Tugas</th>
              <th className="px-2 py-2 w-16">Refleksi</th>
              <th className="px-2 py-2 w-16">Sumatif</th>
              <th className="px-2 py-2 w-20 bg-blue-50 text-blue-900 font-black">Nilai Akhir</th>
              <th className="px-3 py-2 text-left">Deskripsi Ketercapaian TP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((st, idx) => {
              const g = grades[st.id] || { diagnostik: 75, formatif: 75, praktik: 75, proyek: 75, tugas: 75, refleksi: 75, sumatif: 75 };
              const final = calculateFinalScore(g);
              const desc = getAchievementDesc(final, st.name);
              const needsHelp = final < 75;

              return (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-2 py-2 text-center text-slate-500 font-bold">{idx + 1}</td>
                  <td className="px-3 py-2 font-semibold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span>{st.name}</span>
                      {needsHelp && (
                        <span title="Membutuhkan bimbingan remedial (< 75)">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Editable grade inputs */}
                  {(['formatif', 'praktik', 'proyek', 'tugas', 'refleksi', 'sumatif'] as const).map((field) => (
                    <td key={field} className="p-1 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={g[field]}
                        onChange={(e) => updateScore(st.id, field, Number(e.target.value))}
                        className="w-14 text-center py-1 text-xs font-semibold border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                  ))}

                  <td className="px-2 py-1 text-center font-black text-sm bg-blue-50/60">
                    <span className={final >= 75 ? 'text-blue-900' : 'text-red-600'}>
                      {final}
                    </span>
                  </td>
                  <td className="px-3 py-1 text-slate-600 text-[11px] leading-tight">
                    {desc}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
