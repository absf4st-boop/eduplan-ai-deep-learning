import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Github, Globe, Terminal, ShieldCheck } from 'lucide-react';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Langkah 1: Mengapa AI Tidak Berfungsi Sebelumnya & Solusinya',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      desc: 'GitHub Pages dan hosting statis hanya menjalankan file HTML/JS (frontend) tanpa server backend Express. Sekarang aplikasi telah diperbarui dengan Dual-Engine: jika server backend offline (di GitHub), generator langsung otomatis beralih ke Mesin Kurikulum Deep Learning di browser sehingga 100% selalu berhasil membuat dokumen!',
    },
    {
      title: 'Langkah 2: Siapkan Repository di GitHub',
      icon: <Github className="w-5 h-5 text-slate-800" />,
      desc: 'Buat repository baru di akun GitHub Anda (misalnya: `eduplan-ai-deep-learning`), lalu push kode terbaru:',
      commands: `git init
git add .
git commit -m "feat: inisialisasi EDU PLAN AI Deep Learning dengan netlify serverless functions"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/eduplan-ai-deep-learning.git
git push -u origin main`,
    },
    {
      title: 'Langkah 3: Hubungkan Repository ke Netlify (Disarankan)',
      icon: <Globe className="w-5 h-5 text-teal-600" />,
      desc: 'Buka dashboard Netlify (app.netlify.com), klik "Add new site" > "Import an existing project", lalu pilih akun GitHub dan repository yang baru dibuat.',
      settings: [
        { label: 'Build command', val: 'npm run build' },
        { label: 'Publish directory', val: 'dist' },
        { label: 'Functions directory', val: 'netlify/functions' },
      ],
    },
    {
      title: 'Langkah 4: Konfigurasi Environment Variables di Netlify',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      desc: 'Di menu Site configuration > Environment variables Netlify, tambahkan variabel:',
      envVars: [
        { key: 'GEMINI_API_KEY', desc: 'API Key Google Gemini Anda agar Netlify Functions dapat memproses AI server-side.' },
        { key: 'NODE_VERSION', desc: '22' },
      ],
    },
    {
      title: 'Langkah 5: Deploy & Selesai',
      icon: <Terminal className="w-5 h-5 text-blue-600" />,
      desc: 'Klik tombol "Deploy site". Berkat konfigurasi netlify.toml & functions yang sudah kami sertakan, seluruh 11 menu administrasi akan langsung aktif dan dapat di-generate!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Globe className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Panduan Publish via GitHub & Netlify</h3>
              <p className="text-xs text-blue-200">
                Cara men-deploy EDU PLAN AI – DEEP LEARNING menjadi website online mandiri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-3">
            <div className="font-bold text-sm bg-amber-200 text-amber-900 px-2 py-0.5 rounded">INFO</div>
            <div>
              Aplikasi ini sudah siap build dan deploy dengan framework modern (Vite, React, Tailwind CSS, TypeScript). Seluruh data guru dan dokumen disimpan dengan aman pada browser masing-masing guru, serta dilengkapi serverless engine.
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">{step.desc}</p>

                {step.commands && (
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      {step.commands}
                    </pre>
                    <button
                      onClick={() => copyCode(step.commands, idx)}
                      className="absolute top-2 right-2 flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700 transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {step.settings && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    {step.settings.map((s, sIdx) => (
                      <div key={sIdx}>
                        <span className="text-[11px] text-slate-400 block font-medium">{s.label}:</span>
                        <code className="text-xs font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded">
                          {s.val}
                        </code>
                      </div>
                    ))}
                  </div>
                )}

                {step.envVars && (
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    {step.envVars.map((env, eIdx) => (
                      <div key={eIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                        <span className="font-mono font-bold text-indigo-700">{env.key}</span>
                        <span className="text-slate-600">{env.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Developer Contact Footer */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h5 className="font-bold text-blue-950 text-sm">Butuh pendampingan deploy untuk dinas / sekolah?</h5>
              <p className="text-xs text-blue-800">Hubungi langsung pengembang aplikasi (huseinapriyanto).</p>
            </div>
            <a
              href="https://wa.me/6285725080078"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <span>Chat WhatsApp: 085725080078</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Action */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
