import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  FileCheck,
  Shield,
  Zap,
  ArrowRight,
  Send,
  MessageCircle,
  Users,
  Award,
  UserCheck,
} from 'lucide-react';
import { Logo } from './Logo';
import { getRegisteredUsers } from '../services/storage';
import { UserAccount } from '../types';

interface LandingPageProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenPublishGuide: () => void;
  onAutoLogin?: (user: UserAccount) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegister,
  onOpenLogin,
  onOpenPublishGuide,
  onAutoLogin,
}) => {
  const registeredUsers = getRegisteredUsers();
  const lastUser = registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="md" />

          <div className="flex items-center gap-3">
            {lastUser && onAutoLogin ? (
              <button
                type="button"
                onClick={() => onAutoLogin(lastUser)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Masuk: {lastUser.name.split(' ')[0]}</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors"
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              DAFTAR SEKARANG
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                DEEP LEARNING PLATFORM UNTUK GURU SD
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              SELAMAT DATANG DI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
                EDU PLAN AI
              </span>
            </h1>

            <p className="text-base sm:text-xl text-blue-100 font-medium max-w-2xl leading-relaxed">
              "Solusi Cerdas Administrasi Pembelajaran Mendalam Guru Sekolah Dasar"
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Platform kecerdasan buatan terdepan yang dirancang khusus untuk guru SD di seluruh Indonesia dalam menyusun 11 dokumen kurikulum resmi—mulai dari CP, TP, ATP, Modul Ajar, RPP, hingga Jurnal dan Nilai secara sinkron dan otomatis.
            </p>

            {/* Remembered User Auto-Login Box */}
            {lastUser && onAutoLogin && (
              <div className="bg-white/10 border border-emerald-400/50 rounded-2xl p-4 max-w-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                      Akun Guru Anda Terdeteksi
                    </span>
                    <span className="text-sm font-bold text-white block truncate">
                      {lastUser.name}
                    </span>
                    <span className="text-xs text-blue-200 block truncate">
                      {lastUser.email} • {lastUser.schoolProfile.name}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onAutoLogin(lastUser)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all whitespace-nowrap"
                >
                  Masuk Otomatis →
                </button>
              </div>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-blue-950 font-black text-sm rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>DAFTAR SEKARANG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <span>LOGIN KE RUANG KERJA</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Bahasa Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Target Generasi 5 Detik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ekspor Word & PDF A4</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Illustration of Teacher with AI Digital Classroom */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-br from-blue-900/80 to-indigo-950/90 rounded-3xl p-6 border border-white/20 shadow-2xl backdrop-blur-xl">
              {/* Badge top */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-mono text-blue-300">
                  EDU PLAN AI v1.0
                </span>
              </div>

              {/* Graphical Card: Interactive Dashboard preview */}
              <div className="mt-4 space-y-3">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">
                    DEEP LEARNING ENGINE
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Modul Ajar PJOK Kelas 5 Fase C
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] rounded font-bold">
                      Mindful
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] rounded font-bold">
                      Meaningful
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] rounded font-bold">
                      Joyful
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Keterhubungan</span>
                    <span className="text-sm font-black text-amber-400">11 Menu Sinkron</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Kecepatan AI</span>
                    <span className="text-sm font-black text-emerald-400">5 Detik</span>
                  </div>
                </div>

                <div className="bg-blue-600/30 rounded-xl p-3 border border-blue-400/30 text-xs text-blue-100 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Otomatis mengintegrasikan identitas Kepala Sekolah & Guru ke seluruh dokumen cetak!
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Dikembangkan oleh:</span>
                <span className="font-bold text-white">huseinapriyanto</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Principles of Deep Learning */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
              FILOSOFI & KERANGKA INTI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Tiga Pilar Pembelajaran Mendalam (Deep Learning)
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Seluruh administrasi yang dihasilkan bukan sekadar dokumen administratif formalitas, melainkan benar-benar mengimplementasikan pengalaman belajar aktif untuk murid SD:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mindful */}
            <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Berkesadaran (Mindful)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Peserta didik memahami dengan sadar tujuan belajarnya, menyadari setiap tahapan proses belajar, dan terlibat secara aktif dengan kesadaran diri penuh.
              </p>
            </div>

            {/* Meaningful */}
            <div className="bg-amber-50/50 rounded-2xl p-8 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-500 text-blue-950 rounded-xl flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Bermakna (Meaningful)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pembelajaran menghubungkan materi dengan kehidupan nyata sehari-hari, pengalaman kontekstual, dan lingkungan tempat peserta didik tinggal.
              </p>
            </div>

            {/* Joyful */}
            <div className="bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Menggembirakan (Joyful)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pembelajaran berlangsung dalam suasana positif, aman, menyenangkan, menantang, serta mendorong rasa ingin tahu alami anak Sekolah Dasar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Integrated Menus Overview */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
              SISTEM RELASI DOKUMEN OTOMATIS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              11 Menu Administrasi Pembelajaran Lengkap
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Cukup isi data satu kali, seluruh dokumen turunan otomatis terhubung dari CP sampai dengan Rekapitulasi Nilai Asesmen.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: '1. TP (Tujuan Pembelajaran)', desc: 'Spesifik, terukur, berbasis 4 pengalaman belajar.', icon: '🎯' },
              { title: '2. ATP (Alur Tujuan)', desc: 'Urutan logis, alokasi JP bertahap dan teratur.', icon: '🛣️' },
              { title: '3. CP (Capaian Pembelajaran)', desc: 'Elemen kurikulum resmi & profil lulusan.', icon: '📌' },
              { title: '4. RPP Deep Learning', desc: 'Langkah mindful, meaningful, joyful lengkap.', icon: '📝' },
              { title: '5. Modul Ajar Lengkap', desc: 'Informasi umum, desain, pengalaman, lampiran.', icon: '📘' },
              { title: '6. PROTA (Program Tahunan)', desc: 'Distribusi JP semester 1 & 2 per minggu efektif.', icon: '📅' },
              { title: '7. PROMES (Program Semester)', desc: 'Matriks bulanan & jadwal asesmen komprehensif.', icon: '📆' },
              { title: '8. LKPD Siswa', desc: 'Lembar kerja ramah anak usia Sekolah Dasar.', icon: '📋' },
              { title: '9. Jurnal Harian', desc: 'Pencatatan harian, refleksi guru, tindak lanjut.', icon: '📔' },
              { title: '10. Daftar Hadir', desc: 'Presensi harian H/I/S/A & rekap otomatis.', icon: '👥' },
              { title: '11. Daftar Nilai', desc: 'Bobot fleksibel & deskripsi capaian otomatis.', icon: '📊' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all"
              >
                <span className="text-2xl block mb-2">{item.icon}</span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Mata Pelajaran SD */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Mendukung 10 Mata Pelajaran Sekolah Dasar
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fase A (Kelas 1-2), Fase B (Kelas 3-4), dan Fase C (Kelas 5-6)
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              'PJOK',
              'PAI dan Budi Pekerti',
              'MATEMATIKA',
              'BAHASA JAWA',
              'BAHASA INDONESIA',
              'IPAS',
              'SENI MUSIK',
              'SENI TARI',
              'BAHASA INGGRIS',
              'PENDIDIKAN PANCASILA',
            ].map((s) => (
              <span
                key={s}
                className="px-4 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Mulai Buat Administrasi Guru SD dalam Hitungan Detik
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Tinggalkan cara manual yang memakan waktu berhari-hari. Nikmati kemudahan menyusun modul ajar mendalam, RPP, dan asesmen yang siap cetak dan diunduh.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-sm rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              DAFTAR AKUN SEKARANG GRATIS
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all"
            >
              MASUK KE SISTEM
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
