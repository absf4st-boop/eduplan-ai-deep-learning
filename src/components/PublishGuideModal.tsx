import React, { useState } from 'react';
import { X, CheckCircle2, Copy, ExternalLink, Globe, Terminal, FileCode, Check } from 'lucide-react';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
              <Globe className="w-3.5 h-3.5" /> Panduan Publikasi Mandiri
            </div>
            <h2 className="text-xl font-bold">Cara Publikasi Website ke GitHub & Netlify / Vercel</h2>
            <p className="text-xs text-blue-200 mt-1">
              Ikuti langkah berikut agar website aktif online dan fitur AI Generator tetap berfungsi 100%!
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Note about AI Working Everywhere */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Kabar Baik!</span> Versi ini telah dilengkapi dengan{' '}
              <strong>Mesin Deep Learning Client-Side Cerdas</strong>. Bahkan jika Anda mengunggah website sebagai file statis biasa di GitHub Pages atau Netlify tanpa backend, fitur AI Generator akan tetap menghasilkan dokumen RPP, Modul Ajar, LKPD, dll secara lengkap dan terstruktur!
            </div>
          </div>

          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-bold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Hubungkan ke GitHub Repository</span>
            </div>
            <p className="text-xs text-slate-600 pl-8">
              Jalankan perintah ini di terminal komputer Anda jika ingin push ke GitHub Anda sendiri:
            </p>
            <div className="pl-8">
              <div className="relative bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                <button
                  onClick={() => handleCopy('git init\ngit add .\ngit commit -m "Deploy EDU PLAN AI Deep Learning"\ngit branch -M main\ngit remote add origin https://github.com/USERNAME/edu-plan-ai.git\ngit push -u origin main', 'git')}
                  className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  {copiedKey === 'git' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre>{`git init
git add .
git commit -m "Deploy EDU PLAN AI Deep Learning"
git branch -M main
git remote add origin https://github.com/USERNAME/edu-plan-ai.git
git push -u origin main`}</pre>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-bold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
              <span>Deploy ke Netlify (Gratis & Sangat Mudah)</span>
            </div>
            <div className="pl-8 space-y-2 text-xs text-slate-600">
              <p>1. Buka <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">app.netlify.com</a> dan Login dengan GitHub.</p>
              <p>2. Klik <strong>Add new site</strong> &gt; <strong>Import an existing project</strong> &gt; Pilih repositori GitHub Anda.</p>
              <p>3. Pengaturan build otomatis terdeteksi (karena sudah ada file <code>netlify.toml</code>):</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <div>• <strong>Build command:</strong> <code>npm run build</code></div>
                <div>• <strong>Publish directory:</strong> <code>dist</code></div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-bold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
              <span>Menambahkan GEMINI_API_KEY (Opsional tapi Direkomendasikan)</span>
            </div>
            <div className="pl-8 space-y-2 text-xs text-slate-600">
              <p>Agar Netlify Function menggunakan server-side Gemini AI asli:</p>
              <p>Di dashboard Netlify Anda, masuk ke <strong>Site Configuration</strong> &gt; <strong>Environment variables</strong> &gt; <strong>Add a variable</strong>:</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-slate-800 space-y-1">
                <div><strong>Key:</strong> <code>GEMINI_API_KEY</code></div>
                <div><strong>Value:</strong> Masukkan kunci API Gemini Anda dari Google AI Studio.</div>
              </div>
            </div>
          </div>

          {/* Help box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-blue-950 text-xs">Butuh Bantuan Pemasangan?</h4>
              <p className="text-xs text-blue-700">Hubungi pengembang melalui WhatsApp untuk panduan langsung.</p>
            </div>
            <a
              href="https://wa.me/6285725080078?text=Halo%20Mas%20Husein,%20mohon%20bantuan%20deploy%20EDU%20PLAN%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition"
            >
              Hubungi 085725080078
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-medium text-xs rounded-lg transition"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
