import React, { useState } from 'react';
import { Student } from '../types';
import { getStudents, saveStudent, deleteStudent } from '../services/storage';
import { Users, Plus, Trash2, Edit2, Check, X, Sparkles, Search } from 'lucide-react';

interface StudentManagerProps {
  userId: string;
  grade: string;
  onStudentsUpdated?: () => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  userId,
  grade,
  onStudentsUpdated,
}) => {
  const [students, setStudents] = useState<Student[]>(() => getStudents(userId));
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New student form
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNisn, setEditNisn] = useState('');
  const [editGender, setEditGender] = useState<'L' | 'P'>('L');

  const refreshList = () => {
    const list = getStudents(userId);
    setStudents(list);
    if (onStudentsUpdated) onStudentsUpdated();
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent: Student = {
      id: 'std_' + Date.now(),
      userId,
      nisn: nisn.trim() || String(Math.floor(1000000000 + Math.random() * 9000000000)),
      name: name.trim(),
      gender,
      grade,
    };

    saveStudent(newStudent);
    setName('');
    setNisn('');
    setIsAdding(false);
    refreshList();
  };

  const handleStartEdit = (s: Student) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditNisn(s.nisn);
    setEditGender(s.gender);
  };

  const handleSaveEdit = (id: string) => {
    const existing = students.find((s) => s.id === id);
    if (!existing) return;

    const updated: Student = {
      ...existing,
      name: editName.trim(),
      nisn: editNisn.trim(),
      gender: editGender,
    };

    saveStudent(updated);
    setEditingId(null);
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus data siswa ini dari daftar kelas?')) {
      deleteStudent(id);
      refreshList();
    }
  };

  const handleSeedDemoStudents = () => {
    const demoNames: [string, 'L' | 'P'][] = [
      ['Ahmad Farhan Pratama', 'L'],
      ['Anindya Zahra Safitri', 'P'],
      ['Bagus Dwi Wicaksono', 'L'],
      ['Citra Kirana Dewi', 'P'],
      ['Dimas Aditya Nugraha', 'L'],
      ['Eka Putri Handayani', 'P'],
      ['Fajar Hidayatullah', 'L'],
      ['Gita Maharani', 'P'],
      ['Hafiz Al-Ghazali', 'L'],
      ['Indah Permata Sari', 'P'],
    ];

    demoNames.forEach(([sName, sGender], idx) => {
      saveStudent({
        id: 'demo_std_' + idx + '_' + Date.now(),
        userId,
        nisn: `00${idx + 1}4592${idx + 10}`,
        name: sName,
        gender: sGender,
        grade,
      });
    });

    refreshList();
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nisn.includes(search)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-700" />
            <span>Daftar Peserta Didik (Kelas {grade})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {students.length} siswa tercatat. Data siswa terhubung otomatis ke Daftar Hadir & Daftar Nilai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {students.length === 0 && (
            <button
              onClick={handleSeedDemoStudents}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Isi 10 Siswa Contoh</span>
            </button>
          )}

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Add form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-blue-900">Form Tambah Peserta Didik Baru</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder="Nama Lengkap Siswa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="NISN Siswa"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Cari siswa berdasarkan nama atau NISN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">No</th>
              <th className="py-2.5 px-3">Nama Siswa</th>
              <th className="py-2.5 px-3 w-28">NISN</th>
              <th className="py-2.5 px-3 w-16 text-center">L/P</th>
              <th className="py-2.5 px-3 w-24 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Belum ada peserta didik. Klik <strong>Tambah Siswa</strong> atau <strong>Isi 10 Siswa Contoh</strong>.
                </td>
              </tr>
            ) : (
              filtered.map((s, idx) => {
                const isEditing = editingId === s.id;
                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-blue-400 rounded text-xs"
                        />
                      ) : (
                        <span className="font-semibold text-slate-800">{s.name}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editNisn}
                          onChange={(e) => setEditNisn(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-blue-400 rounded text-xs"
                        />
                      ) : (
                        s.nisn
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {isEditing ? (
                        <select
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value as 'L' | 'P')}
                          className="px-1 py-1 bg-white border border-blue-400 rounded text-xs"
                        >
                          <option value="L">L</option>
                          <option value="P">P</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {s.gender}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(s.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(s)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
