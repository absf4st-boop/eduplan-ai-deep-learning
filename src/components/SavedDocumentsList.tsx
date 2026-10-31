import React, { useState } from 'react';
import { SavedDocument, DocumentType, UserAccount } from '../types';
import { deleteDocument } from '../services/storage';
import { downloadWordDocument, printOrExportPdf } from '../utils/exportUtils';
import {
  FileText,
  Search,
  Trash2,
  Edit3,
  FileDown,
  Printer,
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface SavedDocumentsListProps {
  documents: SavedDocument[];
  user: UserAccount;
  onSelectDocument: (doc: SavedDocument) => void;
  onRefresh: () => void;
}

export const SavedDocumentsList: React.FC<SavedDocumentsListProps> = ({
  documents,
  user,
  onSelectDocument,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini dari arsip?')) {
      deleteDocument(id);
      onRefresh();
    }
  };

  const handleDownloadDoc = (doc: SavedDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadWordDocument(
      doc.title.replace(/[^a-zA-Z0-9_-]/g, '_'),
      doc.title,
      doc.content,
      user.schoolProfile,
      user.teacherProfile
    );
  };

  const handlePrintDoc = (doc: SavedDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    printOrExportPdf(doc.title, doc.content);
  };

  const filtered = documents.filter((d) => {
    const topicText = d.topic || d.material || '';
    const docTypeText = d.type || d.documentType || 'MODUL_AJAR';
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      topicText.toLowerCase().includes(search.toLowerCase()) ||
      d.subject.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || docTypeText === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Arsip Dokumen Administrasi Tersimpan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {documents.length} dokumen tersimpan di ruang kerja akun Anda.
          </p>
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="ALL">Semua Jenis Dokumen</option>
            <option value="TP">TP (Tujuan Pembelajaran)</option>
            <option value="ATP">ATP (Alur Tujuan)</option>
            <option value="CP">CP (Capaian)</option>
            <option value="RPP">RPP Merdeka</option>
            <option value="MODUL_AJAR">Modul Ajar Deep Learning</option>
            <option value="PROTA">PROTA</option>
            <option value="PROMES">PROMES</option>
            <option value="LKPD">LKPD Peserta Didik</option>
            <option value="JURNAL_HARIAN">Jurnal Harian</option>
            <option value="DAFTAR_HADIR">Daftar Hadir</option>
            <option value="DAFTAR_NILAI">Daftar Nilai</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Cari berdasarkan judul dokumen, materi, atau mata pelajaran..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      {/* Documents List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">
            {documents.length === 0
              ? 'Belum ada dokumen tersimpan. Mulai buat administrasi pembelajaran Anda menggunakan EDU PLAN AI.'
              : 'Tidak ada dokumen yang cocok dengan kata kunci pencarian.'}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan tombol menu di navigasi untuk membuat RPP, Modul Ajar, LKPD, dll.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition bg-white flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                    {(doc.type || doc.documentType || 'MODUL_AJAR').replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(doc.createdAt).toLocaleDateString('id-ID')}</span>
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition line-clamp-2">
                  {doc.title}
                </h4>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Materi: <span className="text-slate-700 font-medium">{doc.topic}</span>
                </p>

                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">{doc.subject}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Kelas {doc.grade}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Sem {doc.semester[0]}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  <span>Buka Editor & Cetak</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDownloadDoc(doc, e)}
                    title="Download Word (.doc)"
                    className="p-1.5 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg transition"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handlePrintDoc(doc, e)}
                    title="Cetak / PDF"
                    className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    title="Hapus Dokumen"
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
