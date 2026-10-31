import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Heart, Sparkles, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenPublishGuide?: () => void;
  onOpenAuth?: (tab: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPublishGuide, onOpenAuth }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" variant="light" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform administrasi pembelajaran mendalam (Deep Learning) berbasis kecerdasan buatan untuk Guru Sekolah Dasar di seluruh Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded-lg p-2.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Prinsip: Berkesadaran, Bermakna & Menggembirakan</span>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('login') : window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Masuk ke Dashboard Guru
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('register') : window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Registrasi Akun Baru (OTP)
                </button>
              </li>
              <li>
                <a href="#fitur" className="hover:text-amber-400 transition">
                  11 Menu Administrasi Lengkap
                </a>
              </li>
              <li>
                <a href="#deep-learning" className="hover:text-amber-400 transition">
                  Konsep Deep Learning SD
                </a>
              </li>
              {onOpenPublishGuide && (
                <li>
                  <button
                    onClick={onOpenPublishGuide}
                    className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1 cursor-pointer"
                  >
                    🚀 Panduan Publikasi GitHub & Netlify
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* 11 Administrasi */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Administrasi SD</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-400">
              <span>• RPP Merdeka</span>
              <span>• Modul Ajar</span>
              <span>• TP & ATP</span>
              <span>• Capaian (CP)</span>
              <span>• Prota & Promes</span>
              <span>• LKPD Kreatif</span>
              <span>• Jurnal Harian</span>
              <span>• Presensi Siswa</span>
              <span>• Daftar Nilai</span>
              <span>• Ekspor Word & PDF</span>
            </div>
          </div>

          {/* Kontak Pengembang */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Kontak Pengembang</h4>
            <div className="space-y-3 text-xs">
              <p className="text-slate-400">
                Dikembangkan dengan dedikasi untuk memajukan pendidikan Sekolah Dasar di Indonesia:
              </p>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 space-y-2">
                <div className="font-semibold text-white">huseinapriyanto</div>
                <a
                  href="https://wa.me/6285725080078"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp: 085725080078</span>
                </a>
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dukungan Teknis Langsung</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 EDU PLAN AI | Developed by huseinapriyanto</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>Dibuat dengan</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>untuk Guru SD Indonesia</span>
            </span>
            <span>•</span>
            <span>Versi 2.5 (Deep Learning AI Ready)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
