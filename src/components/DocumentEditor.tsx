import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  Table as TableIcon,
  Undo,
  Redo,
  Save,
  FileDown,
  Printer,
  Eye,
  Edit3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { downloadWordDocument, printOrExportPdf } from '../utils/exportUtils';

interface DocumentEditorProps {
  initialContent: string;
  documentTitle: string;
  documentType: string;
  onSave: (updatedContent: string) => void;
  onContinueNextDoc?: () => void;
  nextDocName?: string;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialContent,
  documentTitle,
  documentType,
  onSave,
  onContinueNextDoc,
  nextDocName,
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [fontFamily, setFontFamily] = useState<'times' | 'arial' | 'calibri'>('times');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('Tersimpan di editor');

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync when initialContent changes
  useEffect(() => {
    setContent(initialContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  // Handle rich text formatting commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setAutoSaveStatus('Ada perubahan belum disimpan');
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;" border="1">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 6px; border: 1px solid #334155;">No</th>
            <th style="padding: 6px; border: 1px solid #334155;">Aktivitas / Indikator</th>
            <th style="padding: 6px; border: 1px solid #334155;">Deskripsi Pelaksanaan</th>
            <th style="padding: 6px; border: 1px solid #334155;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px; text-align: center; border: 1px solid #334155;">1</td>
            <td style="padding: 6px; border: 1px solid #334155;">Pengamatan Mandiri</td>
            <td style="padding: 6px; border: 1px solid #334155;">Peserta didik mengamati materi dengan kesadaran penuh.</td>
            <td style="padding: 6px; border: 1px solid #334155;">Mindful</td>
          </tr>
        </tbody>
      </table>
      <p></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setAutoSaveStatus('Ada perubahan belum disimpan');
    }
  };

  const handleManualSave = () => {
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : content;
    onSave(currentHtml);
    setIsSaved(true);
    setAutoSaveStatus('Berhasil disimpan ke arsip akun!');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportWord = () => {
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : content;
    downloadWordDocument(currentHtml, documentTitle);
  };

  const handlePrintOrPdf = () => {
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : content;
    printOrExportPdf(currentHtml, documentTitle);
  };

  const fontClass = {
    times: 'font-serif',
    arial: 'font-sans',
    calibri: 'font-sans',
  }[fontFamily];

  const fontSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[fontSize];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col my-6">
      {/* Top Action Bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-amber-400 text-blue-950">
              {documentType}
            </span>
            <h3 className="font-bold text-base sm:text-lg">{documentTitle}</h3>
          </div>
          <span className="text-xs text-blue-200 block mt-0.5">
            Format Resmi Standar Pendidikan SD • Deep Learning Framework
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="bg-white/10 p-1 rounded-xl flex items-center border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'edit'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Teks</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Cetak A4</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleManualSave}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              isSaved
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Tersimpan!' : 'SIMPAN'}</span>
          </button>

          {/* Download Word */}
          <button
            type="button"
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            title="Download file Microsoft Word (.doc)"
          >
            <FileDown className="w-4 h-4 text-blue-200" />
            <span>WORD (.DOC)</span>
          </button>

          {/* Print / PDF */}
          <button
            type="button"
            onClick={handlePrintOrPdf}
            className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            title="Download PDF atau Cetak ke Printer A4"
          >
            <Printer className="w-4 h-4 text-indigo-200" />
            <span>PDF / CETAK</span>
          </button>
        </div>
      </div>

      {/* Editor Formatting Toolbar (visible in edit mode) */}
      {viewMode === 'edit' && (
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-slate-700">
          <div className="flex flex-wrap items-center gap-1">
            {/* Font Family selector */}
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-700"
            >
              <option value="times">Times New Roman (Standar Surat)</option>
              <option value="arial">Arial (Modern Bersih)</option>
              <option value="calibri">Calibri (Dokumen Formal)</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as any)}
              className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-700"
            >
              <option value="sm">Ukuran Huruf Kecil (10pt)</option>
              <option value="md">Ukuran Huruf Sedang (11pt)</option>
              <option value="lg">Ukuran Huruf Besar (12pt)</option>
            </select>

            <div className="h-5 w-[1px] bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Tebal (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Miring (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Garis Bawah (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="h-5 w-[1px] bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'h2')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Judul Bab (H2)"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'h3')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Sub Judul (H3)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Daftar Poin"
            >
              <List className="w-4 h-4" />
            </button>

            <div className="h-5 w-[1px] bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Rata Kiri"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Rata Tengah"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Rata Kanan"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="h-5 w-[1px] bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={insertTable}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700 flex items-center gap-1 text-xs"
              title="Sisipkan Tabel Rapi"
            >
              <TableIcon className="w-4 h-4 text-blue-700" />
              <span className="hidden sm:inline">Tabel</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand('undo')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            {autoSaveStatus}
          </div>
        </div>
      )}

      {/* Editor Canvas Container - Styled like a physical A4 sheet */}
      <div className="bg-slate-200/80 p-4 sm:p-8 flex justify-center min-h-[600px] overflow-y-auto">
        <div
          className={`w-full max-w-[850px] bg-white rounded-lg shadow-xl p-8 sm:p-14 border border-slate-300 transition-all ${fontClass} ${fontSizeClass}`}
          style={{
            minHeight: '1050px',
            boxSizing: 'border-box',
          }}
        >
          {viewMode === 'edit' ? (
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              className="outline-none focus:outline-none min-h-[800px] leading-relaxed text-slate-900"
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="leading-relaxed text-slate-900"
            />
          )}
        </div>
      </div>

      {/* Pipeline Navigation Footer */}
      {onContinueNextDoc && nextDocName && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              <strong>Keterhubungan Antarmenu Aktif:</strong> Dokumen ini siap menjadi acuan turunan otomatis untuk{' '}
              <strong>{nextDocName}</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={onContinueNextDoc}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Buat Dokumen Berikutnya ({nextDocName})</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};
