import React, { useState, useRef } from 'react';
import { UserAccount, SavedDocument } from '../types';
import { downloadWordDocument, printOrExportPdf } from '../utils/exportUtils';
import {
  FileDown,
  Printer,
  Save,
  Check,
  Copy,
  ArrowLeft,
  Sparkles,
  Bold,
  Italic,
  List,
  Heading,
  Eye,
  Edit3
} from 'lucide-react';

interface DocumentEditorProps {
  document: SavedDocument;
  user: UserAccount;
  onBack: () => void;
  onSave: (updatedDoc: SavedDocument) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  user,
  onBack,
  onSave,
}) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');

  const editorRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : content;
    const updated: SavedDocument = {
      ...document,
      title,
      content: currentHtml,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
    setContent(currentHtml);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownloadWord = () => {
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : content;
    downloadWordDocument(
      title.replace(/[^a-zA-Z0-9_-]/g, '_'),
      title,
      currentHtml,
      user.schoolProfile,
      user.teacherProfile
    );
  };

  const handlePrintPdf = () => {
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : content;
    printOrExportPdf(title, currentHtml);
  };

  const handleCopyText = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.innerText);
    } else {
      navigator.clipboard.writeText(content.replace(/<[^>]+>/g, ''));
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Kembali ke Daftar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                {document.type}
              </span>
              <span className="text-xs text-slate-400">
                Dibuat {new Date(document.createdAt).toLocaleDateString('id-ID')}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base font-bold text-slate-900 mt-0.5 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle View */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'preview' ? 'bg-white shadow-xs text-blue-900 font-bold' : 'text-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Kertas A4</span>
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'edit' ? 'bg-white shadow-xs text-blue-900 font-bold' : 'text-slate-600'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Mode Edit</span>
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Tersimpan!' : 'Simpan'}</span>
          </button>

          <button
            onClick={handleDownloadWord}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Word (.doc)</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Document Sheet (Simulated A4 Paper) */}
      <div className="bg-slate-200/70 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto min-h-[800px]">
        <div className="bg-white shadow-2xl rounded-sm border border-slate-300 w-full max-w-[850px] p-8 sm:p-12 text-slate-900 font-serif relative">
          
          {/* Header Kop Surat Sekolah */}
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

          {/* Editable Document Body */}
          <div
            ref={editorRef}
            contentEditable={viewMode === 'edit'}
            suppressContentEditableWarning
            className={`prose max-w-none text-slate-900 leading-relaxed font-serif ${
              viewMode === 'edit'
                ? 'outline-2 outline-blue-500/50 p-2 rounded-lg bg-blue-50/20'
                : 'outline-none'
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Signature Block */}
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

          {/* Footer watermark branding */}
          <div className="mt-8 pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
            <span>Dihasilkan dengan EDU PLAN AI – DEEP LEARNING</span>
            <span>Developed by huseinapriyanto | 085725080078</span>
          </div>
        </div>
      </div>
    </div>
  );
};
