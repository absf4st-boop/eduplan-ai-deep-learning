import React, { useState } from 'react';
import { Student } from '../types';
import { CheckCircle, Printer, FileDown, Calendar, Users, Percent } from 'lucide-react';
import { printOrExportPdf, downloadWordDocument } from '../utils/exportUtils';

interface AttendanceProps {
  students: Student[];
  grade: string;
  subject: string;
  semester: string;
  schoolYear: string;
  schoolName: string;
  teacherName: string;
}

export const InteractiveAttendance: React.FC<AttendanceProps> = ({
  students,
  grade,
  subject,
  semester,
  schoolYear,
  schoolName,
  teacherName,
}) => {
  const filteredStudents = students.filter((s) => s.grade === grade);

  // 10 meetings record: map of studentId -> array of 10 statuses ('H' | 'I' | 'S' | 'A')
  const [records, setRecords] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    filteredStudents.forEach((s) => {
      initial[s.id] = ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
    });
    return initial;
  });

  const updateStatus = (studentId: string, meetingIndex: number, newStatus: string) => {
    setRecords((prev) => {
      const current = prev[studentId] || ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
      const updated = [...current];
      updated[meetingIndex] = newStatus;
      return { ...prev, [studentId]: updated };
    });
  };

  const calculateStats = (studentId: string) => {
    const list = records[studentId] || [];
    const h = list.filter((x) => x === 'H').length;
    const s = list.filter((x) => x === 'S').length;
    const i = list.filter((x) => x === 'I').length;
    const a = list.filter((x) => x === 'A').length;
    const total = list.length || 1;
    const percentage = Math.round((h / total) * 100);
    return { h, s, i, a, percentage };
  };

  const generateAttendanceTableHtml = () => {
    const rows = filteredStudents
      .map((st, idx) => {
        const stats = calculateStats(st.id);
        const cells = (records[st.id] || []).map((c) => `<td style="text-align: center;">${c}</td>`).join('');
        return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td>${st.nisn}</td>
          <td>${st.name}</td>
          <td style="text-align: center;">${st.gender}</td>
          ${cells}
          <td style="text-align: center;">${stats.h}</td>
          <td style="text-align: center;">${stats.s}</td>
          <td style="text-align: center;">${stats.i}</td>
          <td style="text-align: center;">${stats.a}</td>
          <td style="text-align: center; font-weight: bold;">${stats.percentage}%</td>
        </tr>
      `;
      })
      .join('');

    return `
      <div style="text-align: center; font-family: 'Times New Roman', serif;">
        <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase;">DAFTAR HADIR PESERTA DIDIK</h2>
        <h3 style="margin: 4px 0 16px 0; font-size: 12pt;">${schoolName}</h3>
        <table style="width: 100%; margin-bottom: 12px; font-size: 10.5pt; text-align: left;">
          <tr><td>Mata Pelajaran: <strong>${subject}</strong></td><td>Kelas: <strong>${grade}</strong></td><td>Semester: <strong>${semester}</strong></td><td>Tahun: <strong>${schoolYear}</strong></td></tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;" border="1">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th rowspan="2">No</th><th rowspan="2">NISN</th><th rowspan="2">Nama Peserta Didik</th><th rowspan="2">L/P</th>
              <th colspan="10">Pertemuan</th>
              <th colspan="4">Rekapitulasi</th>
              <th rowspan="2">%</th>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
              <th>H</th><th>S</th><th>I</th><th>A</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: right;">
          <p>Guru Mata Pelajaran,</p>
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
            <Users className="w-5 h-5 text-blue-900" />
            <span>Presensi Interaktif Peserta Didik (Kelas {grade})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Klik pada huruf kehadiran (H/I/S/A) untuk mengubah status presensi harian siswa secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadWordDocument(generateAttendanceTableHtml(), `Daftar_Hadir_Kelas_${grade}_${subject}`)}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Unduh Word</span>
          </button>
          <button
            type="button"
            onClick={() => printOrExportPdf(generateAttendanceTableHtml(), `Daftar_Hadir_Kelas_${grade}_${subject}`)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th rowSpan={2} className="px-3 py-2 w-10 border-b border-slate-200">No</th>
              <th rowSpan={2} className="px-3 py-2 text-left w-48 border-b border-slate-200">Nama Siswa</th>
              <th rowSpan={2} className="px-2 py-2 w-10 border-b border-slate-200">L/P</th>
              <th colSpan={10} className="px-2 py-1 bg-blue-50/60 border-b border-slate-200">Pertemuan</th>
              <th colSpan={4} className="px-2 py-1 bg-slate-200/50 border-b border-slate-200">Rekap</th>
              <th rowSpan={2} className="px-3 py-2 w-14 border-b border-slate-200">%</th>
            </tr>
            <tr className="bg-slate-50 text-[9px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <th key={num} className="p-1 w-7 border-b border-slate-200">{num}</th>
              ))}
              <th className="p-1 w-6 bg-emerald-50 text-emerald-800 border-b border-slate-200">H</th>
              <th className="p-1 w-6 bg-amber-50 text-amber-800 border-b border-slate-200">S</th>
              <th className="p-1 w-6 bg-blue-50 text-blue-800 border-b border-slate-200">I</th>
              <th className="p-1 w-6 bg-red-50 text-red-800 border-b border-slate-200">A</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((st, idx) => {
              const stats = calculateStats(st.id);
              const meetingList = records[st.id] || ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];

              return (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-2 py-2 text-slate-500 font-bold">{idx + 1}</td>
                  <td className="px-3 py-2 text-left font-semibold text-slate-800">{st.name}</td>
                  <td className="px-2 py-2 text-slate-500">{st.gender}</td>

                  {meetingList.map((status, mIdx) => (
                    <td key={mIdx} className="p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus = status === 'H' ? 'I' : status === 'I' ? 'S' : status === 'S' ? 'A' : 'H';
                          updateStatus(st.id, mIdx, nextStatus);
                        }}
                        className={`w-6 h-6 rounded text-[10px] font-black transition-all ${
                          status === 'H'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : status === 'S'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : status === 'I'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Klik untuk mengubah (H -> I -> S -> A)"
                      >
                        {status}
                      </button>
                    </td>
                  ))}

                  <td className="px-1 py-1 font-bold text-emerald-700 bg-emerald-50/40">{stats.h}</td>
                  <td className="px-1 py-1 font-bold text-amber-700 bg-amber-50/40">{stats.s}</td>
                  <td className="px-1 py-1 font-bold text-blue-700 bg-blue-50/40">{stats.i}</td>
                  <td className="px-1 py-1 font-bold text-red-700 bg-red-50/40">{stats.a}</td>
                  <td className="px-2 py-1 font-black text-slate-900 bg-slate-50">
                    {stats.percentage}%
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
