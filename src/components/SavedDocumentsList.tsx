import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Trash2,
  Eye,
  FileDown,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SavedDocument, DocumentType } from '../types';
import { downloadWordDocument, printOrExportPdf } from '../utils/exportUtils';
import { SUBJECT_OPTIONS, DOC_TITLES } from './DocumentGenerator';

interface SavedDocumentsListProps {
  documents: SavedDocument[];
  onOpenDoc: (doc: SavedDocument) => void;
  onDeleteDoc: (docId: string) => void;
  onStartCreateDoc: () => void;
}

export const SavedDocumentsList: React.FC<SavedDocumentsListProps> = ({
  documents,
  onOpenDoc,
  onDeleteDoc,
  onStartCreateDoc,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [filterGrade, setFilterGrade] = useState<string>('ALL');

  const filtered = documents.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'ALL' || doc.documentType === filterType;
    const matchSubject = filterSubject === 'ALL' || doc.subject === filterSubject;
    const matchGrade = filterGrade === 'ALL' || doc.grade === filterGrade;
    return matchSearch && matchType && matchSubject && matchGrade;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul dokumen atau materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter:</span>
          </div>

          {/* Doc Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="ALL">Semua Jenis Dokumen</option>
            {Object.entries(DOC_TITLES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="ALL">Semua Mapel</option>
            {SUBJECT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="ALL">Semua Kelas</option>
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-blue-800" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">
              Belum ada dokumen tersimpan.
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Belum ada dokumen tersimpan. Mulai buat administrasi pembelajaran Anda menggunakan EDU PLAN AI.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartCreateDoc}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Buat Dokumen Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-blue-100 text-blue-900">
                    {doc.documentType}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(doc.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors line-clamp-2">
                  {doc.title}
                </h4>

                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="font-semibold text-slate-700">Mapel:</span> {doc.subject}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="font-semibold text-slate-700">Kelas / Fase:</span> Kelas {doc.grade} (Fase {doc.phase})
                  </div>
                  <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-1">
                    "{doc.material}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenDoc(doc)}
                    className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Buka & Edit Dokumen"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Buka</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadWordDocument(doc.content, doc.title)}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg"
                    title="Download Word (.doc)"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => printOrExportPdf(doc.content, doc.title)}
                    className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-slate-50 rounded-lg"
                    title="Cetak atau PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus dokumen "${doc.title}"?`)) {
                      onDeleteDoc(doc.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
