import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Users, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { saveStudents } from '../services/storage';

interface StudentManagerProps {
  userId: string;
  students: Student[];
  grade: string;
  onUpdateStudents: (updated: Student[]) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  userId,
  students,
  grade,
  onUpdateStudents,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New student form
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');

  // Edit student form
  const [editNisn, setEditNisn] = useState('');
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState<'L' | 'P'>('L');

  const filteredStudents = students.filter((s) => s.grade === grade);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent: Student = {
      id: 'std_' + Date.now(),
      nisn: nisn.trim() || `012345${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      gender,
      grade,
    };

    const updated = [...students, newStudent];
    saveStudents(userId, updated);
    onUpdateStudents(updated);
    setIsAdding(false);
    setName('');
    setNisn('');
  };

  const startEdit = (s: Student) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditNisn(s.nisn);
    setEditGender(s.gender);
  };

  const handleSaveEdit = (id: string) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, name: editName, nisn: editNisn, gender: editGender } : s
    );
    saveStudents(userId, updated);
    onUpdateStudents(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus data siswa ini dari daftar kelas?')) {
      const updated = students.filter((s) => s.id !== id);
      saveStudents(userId, updated);
      onUpdateStudents(updated);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Database Peserta Didik (Kelas {grade})
            </h3>
            <p className="text-xs text-slate-500">
              Total: {filteredStudents.length} siswa aktif. Terhubung ke menu Daftar Hadir & Daftar Nilai.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Batal' : 'Tambah Siswa Baru'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="p-4 bg-blue-50/60 border-b border-blue-100 flex flex-wrap gap-3 items-end">
          <div className="w-32">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">NISN</label>
            <input
              type="text"
              placeholder="0123456789"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Muhammad Rizki"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-24">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">L/P</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'L' | 'P')}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            Simpan Siswa
          </button>
        </form>
      )}

      {/* Students Table */}
      <div className="overflow-x-auto">
        {filteredStudents.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Belum ada data siswa untuk Kelas {grade}. Klik tombol Tambah Siswa di atas.</span>
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3 w-32">NISN</th>
                <th className="px-4 py-3">Nama Lengkap Siswa</th>
                <th className="px-4 py-3 w-20 text-center">L/P</th>
                <th className="px-4 py-3 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">
                    {editingId === s.id ? (
                      <input
                        type="text"
                        value={editNisn}
                        onChange={(e) => setEditNisn(e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded w-28"
                      />
                    ) : (
                      s.nisn
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">
                    {editingId === s.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded w-full"
                      />
                    ) : (
                      s.name
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {editingId === s.id ? (
                      <select
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value as 'L' | 'P')}
                        className="px-1 py-1 text-xs border border-slate-300 rounded"
                      >
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.gender === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {s.gender}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {editingId === s.id ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(s.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Simpan"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          title="Batal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(s)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Ubah"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
