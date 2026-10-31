import React, { useState } from 'react';
import { UserAccount, Student } from '../types';
import { getStudents } from '../services/storage';
import { downloadWordDocument, printOrExportPdf } from '../utils/exportUtils';
import { Calendar, FileDown, Printer, Users, Save, CheckCircle2 } from 'lucide-react';

interface InteractiveAttendanceProps {
  user: UserAccount;
  onSaveAsDocument?: (title: string, content: string) => void;
}

export const InteractiveAttendance: React.FC<InteractiveAttendanceProps> = ({
  user,
  onSaveAsDocument,
}) => {
  const students = getStudents(user.id);
  const [selectedMonth, setSelectedMonth] = useState('Agustus');
  const [academicYear, setAcademicYear] = useState(user.schoolProfile.academicYear || '2026/2027');
  const [grade, setGrade] = useState(user.schoolProfile.activeGrade || '5');
  const [subject, setSubject] = useState(user.schoolProfile.activeSubject || 'PJOK');

  // Days: 1 to 25
  const days = Array.from({ length: 20 }, (_, i) => i + 1);

  // Attendance state: { [studentId]: { [day]: 'H' | 'S' | 'I' | 'A' } }
  const [attendance, setAttendance] = useState<Record<string, Record<number, string>>>(() => {
    const initial: Record<string, Record<number, string>> = {};
    students.forEach((s) => {
      initial[s.id] = {};
      days.forEach((d) => {
        // Default most to Hadir (H)
        initial[s.id][d] = 'H';
      });
    });
    return initial;
  });

  const [savedAlert, setSavedAlert] = useState(false);

  const handleStatusChange = (studentId: string, day: number, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [day]: status,
      },
    }));
  };

  const getStats = (studentId: string) => {
    const records = attendance[studentId] || {};
    let h = 0, s = 0, i = 0, a = 0;
    days.forEach((d) => {
      const val = records[d] || 'H';
      if (val === 'H') h++;
      else if (val === 'S') s++;
      else if (val === 'I') i++;
      else if (val === 'A') a++;
    });
    const total = days.length;
    const percent = Math.round((h / total) * 100);
    return { h, s, i, a, percent };
  };

  const generateHtmlSummary = () => {
    let rows = '';
    students.forEach((st, idx) => {
      const stats = getStats(st.id);
      let dayCols = '';
      days.forEach((d) => {
        const val = attendance[st.id]?.[d] || 'H';
        dayCols += `<td style="border:1px solid #cbd5e1; padding:4px; text-align:center;">${val}</td>`;
      });
      rows += `
        <tr>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${idx + 1}</td>
          <td style="border:1px solid #cbd5e1; padding:6px;"><strong>${st.name}</strong><br/><small style="color:#64748b;">${st.nisn}</small></td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${st.gender}</td>
          ${dayCols}
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold; background:#f0fdf4;">${stats.h}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; background:#fefce8;">${stats.s}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; background:#eff6ff;">${stats.i}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; background:#fef2f2; color:#b91c1c;">${stats.a}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold;">${stats.percent}%</td>
        </tr>
      `;
    });

    let dayHeaders = '';
    days.forEach((d) => {
      dayHeaders += `<th style="border:1px solid #cbd5e1; padding:4px; text-align:center; width:22px;">${d}</th>`;
    });

    return `
      <div style="font-family:'Times New Roman', Times, serif; color:#0f172a; line-height:1.5;">
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="margin:0; font-size:16pt; font-weight:bold; text-transform:uppercase;">DAFTAR HADIR PESERTA DIDIK DEEP LEARNING</h2>
          <h3 style="margin:4px 0 0; font-size:13pt; font-weight:bold;">${(user.schoolProfile.schoolName || user.schoolProfile.name || 'SD NEGERI').toUpperCase()}</h3>
          <p style="margin:4px 0 0; font-size:10pt;">Mata Pelajaran: ${subject} | Kelas: ${grade} | Bulan: ${selectedMonth} | Tahun Pelajaran: ${academicYear}</p>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:9pt; margin-bottom:24px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; width:35px; text-align:center;">No</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; text-align:left;">Nama Peserta Didik</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; width:35px; text-align:center;">L/P</th>
              <th colspan="${days.length}" style="border:1px solid #cbd5e1; padding:4px; text-align:center;">Tanggal Pertemuan</th>
              <th colspan="4" style="border:1px solid #cbd5e1; padding:4px; text-align:center;">Rekapitulasi</th>
              <th rowspan="2" style="border:1px solid #cbd5e1; padding:6px; width:50px; text-align:center;">%</th>
            </tr>
            <tr style="background:#f8fafc;">
              ${dayHeaders}
              <th style="border:1px solid #cbd5e1; padding:4px; text-align:center; width:24px; color:#15803d;">H</th>
              <th style="border:1px solid #cbd5e1; padding:4px; text-align:center; width:24px; color:#a16207;">S</th>
              <th style="border:1px solid #cbd5e1; padding:4px; text-align:center; width:24px; color:#1d4ed8;">I</th>
              <th style="border:1px solid #cbd5e1; padding:4px; text-align:center; width:24px; color:#b91c1c;">A</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="margin-top:30px; display:flex; justify-content:space-between; font-size:10pt;">
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
      `Daftar_Hadir_${grade}_${selectedMonth}_${subject}`,
      `DAFTAR HADIR KELAS ${grade} BULAN ${selectedMonth.toUpperCase()}`,
      html,
      user.schoolProfile,
      user.teacherProfile
    );
  };

  const handlePrint = () => {
    const html = generateHtmlSummary();
    printOrExportPdf(`Daftar Hadir Kelas ${grade} - ${selectedMonth}`, html);
  };

  const handleSaveToDocs = () => {
    if (onSaveAsDocument) {
      const html = generateHtmlSummary();
      onSaveAsDocument(
        `Daftar Hadir Siswa Kelas ${grade} - Bulan ${selectedMonth} (${subject})`,
        html
      );
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            <span>Presensi & Daftar Hadir Siswa (Interaktif)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan kehadiran peserta didik harian dengan rekap otomatis H, S, I, A serta persentase kehadiran.
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
          <span>Daftar Hadir berhasil disimpan ke Arsip Dokumen Anda!</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Bulan Presensi</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
          >
            {['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
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

      {/* Interactive Table */}
      {students.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">Belum Ada Data Peserta Didik</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-3">
            Silakan tambahkan siswa di menu "Data Siswa" atau gunakan tombol di bawah untuk mengisi contoh siswa otomatis.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-2 text-center w-10">No</th>
                <th className="py-2.5 px-3 min-w-[160px]">Nama Peserta Didik</th>
                <th className="py-2.5 px-2 text-center w-8">L/P</th>
                {days.map((d) => (
                  <th key={d} className="py-2 px-1 text-center w-8 text-[11px] font-mono">
                    {d}
                  </th>
                ))}
                <th className="py-2 px-2 text-center w-8 bg-emerald-50 text-emerald-800">H</th>
                <th className="py-2 px-2 text-center w-8 bg-amber-50 text-amber-800">S</th>
                <th className="py-2 px-2 text-center w-8 bg-blue-50 text-blue-800">I</th>
                <th className="py-2 px-2 text-center w-8 bg-rose-50 text-rose-800">A</th>
                <th className="py-2 px-2 text-center w-12 bg-slate-200 text-slate-900">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st, idx) => {
                const stats = getStats(st.id);
                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2 px-2 text-center text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900">{st.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{st.nisn}</div>
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-slate-600">{st.gender}</td>
                    {days.map((d) => {
                      const val = attendance[st.id]?.[d] || 'H';
                      return (
                        <td key={d} className="py-1 px-0.5 text-center">
                          <select
                            value={val}
                            onChange={(e) => handleStatusChange(st.id, d, e.target.value)}
                            className={`w-7 h-7 text-center rounded font-bold text-[11px] focus:outline-none border cursor-pointer ${
                              val === 'H'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : val === 'S'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : val === 'I'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : 'bg-rose-100 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="H">H</option>
                            <option value="S">S</option>
                            <option value="I">I</option>
                            <option value="A">A</option>
                          </select>
                        </td>
                      );
                    })}
                    <td className="py-2 px-2 text-center font-bold text-emerald-700 bg-emerald-50/60">{stats.h}</td>
                    <td className="py-2 px-2 text-center font-bold text-amber-700 bg-amber-50/60">{stats.s}</td>
                    <td className="py-2 px-2 text-center font-bold text-blue-700 bg-blue-50/60">{stats.i}</td>
                    <td className="py-2 px-2 text-center font-bold text-rose-700 bg-rose-50/60">{stats.a}</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900 bg-slate-100">{stats.percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend & Help */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 gap-3">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Keterangan:</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> <strong>H</strong> = Hadir</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block"></span> <strong>S</strong> = Sakit</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 inline-block"></span> <strong>I</strong> = Izin</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500 inline-block"></span> <strong>A</strong> = Alpa</span>
        </div>
        <p className="text-[11px] text-slate-400">
          * Klik pada huruf di setiap kolom tanggal untuk mengubah status kehadiran siswa.
        </p>
      </div>
    </div>
  );
};
