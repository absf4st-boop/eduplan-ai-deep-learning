import React from 'react';
import { Logo } from './Logo';
import { MessageCircle, Heart, Shield, BookOpen, Sparkles, Send } from 'lucide-react';

interface FooterProps {
  onOpenPublishGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPublishGuide }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2">
            <Logo size="md" inverted={true} />
            <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
              <strong>Solusi Cerdas Administrasi Pembelajaran Mendalam Guru Sekolah Dasar</strong>. Membantu guru SD di seluruh Indonesia menyusun CP, TP, ATP, Modul Ajar, RPP, PROTA, PROMES, LKPD, Jurnal, dan Nilai berbasis prinsip <em>Berkesadaran (Mindful)</em>, <em>Bermakna (Meaningful)</em>, dan <em>Menggembirakan (Joyful)</em>.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Teknologi Generasi AI Terintegrasi & Kurikulum Nasional SD</span>
            </div>
          </div>

          {/* Kontak & Bantuan */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Bantuan Pengembang
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-slate-500 text-xs block">Developer:</span>
                <span className="text-slate-200 font-semibold">huseinapriyanto</span>
              </li>
              <li>
                <span className="text-slate-500 text-xs block">WhatsApp Resmi:</span>
                <a
                  href="https://wa.me/6285725080078"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  085725080078
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-xs block">Dukungan:</span>
                <span className="text-slate-300">Konsultasi Teknis & Kurikulum</span>
              </li>
            </ul>
          </div>

          {/* Quick links & Publishing */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Panduan & Deploy
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onOpenPublishGuide}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 text-left transition-colors"
                >
                  <span>🚀 Panduan GitHub & Netlify</span>
                </button>
              </li>
              <li>
                <span className="text-slate-400 text-xs">
                  Panduan langkah demi langkah mem-publish aplikasi ke GitHub dan Netlify SaaS.
                </span>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ruang Kerja Terisolasi per Akun Guru</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p className="font-medium text-slate-300">
            © 2026 EDU PLAN AI | Developed by huseinapriyanto
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Didedikasikan untuk kemajuan Pendidikan Guru SD Indonesia</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
