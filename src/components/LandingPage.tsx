import React from 'react';
import { Logo } from './Logo';
import { Footer } from './Footer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Brain,
  Smile,
  Heart,
  Compass,
  FileText,
  Layers,
  Award,
  Zap,
  BookOpen,
  Calendar,
  Users,
  Download,
  Printer,
  Phone
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenPublishGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenPublishGuide,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="md" variant="dark" />

          {/* Nav links & CTA buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPublishGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              <span>Panduan Publikasi</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 rounded-xl hover:bg-blue-50 transition cursor-pointer border border-blue-200"
            >
              LOGIN
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>DAFTAR SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Solusi Cerdas Administrasi Pembelajaran Mendalam Guru Sekolah Dasar</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              SELAMAT DATANG DI <br />
              <span className="bg-gradient-to-r from-blue-200 via-white to-amber-300 bg-clip-text text-transparent">
                EDU PLAN AI
              </span>
            </h1>

            <div className="inline-block text-lg sm:text-2xl font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-6 py-1 rounded-full border border-amber-400/20">
              DEEP LEARNING
            </div>

            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Platform kecerdasan buatan terdepan yang dirancang khusus untuk membantu Guru Sekolah Dasar di Indonesia menghasilkan 11 dokumen administrasi pembelajaran Kurikulum Merdeka secara otomatis, terintegrasi, dan berbasis pendekatan <strong>Pembelajaran Mendalam</strong>.
            </p>

            {/* CTA action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>DAFTAR SEKARANG DENGAN OTP</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm sm:text-base rounded-2xl backdrop-blur-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>LOGIN KE RUANG KERJA</span>
              </button>
            </div>

            {/* Key badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-white/10 mt-10">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>11 Dokumen Administrasi SD Lengkap</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Download Word (.doc) & PDF Siap Cetak</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kop Surat & Tanda Tangan Otomatis</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>10 Mata Pelajaran & Semua Fase SD</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Principles of Deep Learning */}
      <section id="deep-learning" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Pondasi Filosofis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              3 Prinsip Pembelajaran Mendalam (Deep Learning)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Seluruh administrasi yang dihasilkan secara otomatis menyelaraskan 3 pilar utama untuk mengembangkan potensi holistik peserta didik sekolah dasar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center mb-4 shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">1. Berkesadaran (Mindful)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Peserta didik diajak memahami tujuan belajarnya, menyadari proses berpikirnya (metakognisi), fokus, serta merefleksikan setiap pemahaman secara mendalam.
              </p>
              <div className="mt-4 pt-3 border-t border-blue-100 text-[11px] font-semibold text-blue-800">
                • Aktivitas reflektif & hening cipta belajar
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4 shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Bermakna (Meaningful)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Materi dikaitkan langsung dengan pengalaman autentik kehidupan sehari-hari, lingkungan sekitar sekolah, dan pemecahan masalah kontekstual yang nyata.
              </p>
              <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-semibold text-amber-800">
                • Kontekstual & relevan dengan lingkungan anak
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Menggembirakan (Joyful)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Suasana belajar menyenangkan, membangkitkan rasa ingin tahu alami anak, berbasis permainan edukatif (gamifikasi), serta kolaborasi aktif tanpa rasa tertekan.
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] font-semibold text-emerald-800">
                • Ice breaking bermakna & aktivitas kinetik gembira
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Administration Modules Breakdown */}
      <section id="fitur" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">
              Fitur Utama Lengkap
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              11 Menu Administrasi Pembelajaran Guru SD
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Seluruh kebutuhan administrasi wajib guru Sekolah Dasar tersedia lengkap dengan generator AI canggih.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                no: '01',
                title: 'TP – Tujuan Pembelajaran',
                desc: 'Rumusan tujuan terpadu kompetensi, lingkup materi, dan variasi keterampilan berpikir tingkat tinggi.',
                icon: BookOpen,
              },
              {
                no: '02',
                title: 'ATP – Alur Tujuan Pembelajaran',
                desc: 'Alur kronologis pencapaian kompetensi dalam satu fase (Fase A, B, atau C) secara sistematis.',
                icon: Layers,
              },
              {
                no: '03',
                title: 'CP – Capaian Pembelajaran',
                desc: 'Pemetaan capaian per elemen mata pelajaran sesuai regulasi Kemendikbudristek terbaru.',
                icon: Award,
              },
              {
                no: '04',
                title: 'RPP – Rencana Pelaksanaan',
                desc: 'Format RPP efektif terpadu dengan 3 prinsip Deep Learning dan penilaian autentik.',
                icon: FileText,
              },
              {
                no: '05',
                title: 'Modul Ajar Deep Learning',
                desc: 'Perangkat ajar lengkap mencakup apersepsi berkesadaran, inti bermakna, dan penutup menggembirakan.',
                icon: Sparkles,
              },
              {
                no: '06',
                title: 'PROTA – Program Tahunan',
                desc: 'Alokasi waktu seluruh bab/tujuan pembelajaran selama satu tahun ajaran ganjil dan genap.',
                icon: Calendar,
              },
              {
                no: '07',
                title: 'PROMES – Program Semester',
                desc: 'Distribusi materi rinci mingguan dan jadwal asesmen formatif / sumatif tiap semester.',
                icon: Calendar,
              },
              {
                no: '08',
                title: 'LKPD – Lembar Kerja Peserta Didik',
                desc: 'Lembar aktivitas eksplorasi siswa yang menarik, interaktif, kontekstual dan reflektif.',
                icon: FileText,
              },
              {
                no: '09',
                title: 'Jurnal Harian Guru',
                desc: 'Dokumentasi keterlaksanaan tatap muka, kehadiran siswa, hambatan pembelajaran, dan rencana perbaikan.',
                icon: FileText,
              },
              {
                no: '10',
                title: 'Daftar Hadir Siswa Interaktif',
                desc: 'Pencatatan presensi siswa harian dengan rekapitulasi otomatis H, S, I, A dan persentase kehadiran.',
                icon: Users,
              },
              {
                no: '11',
                title: 'Daftar Nilai & Rapor Otomatis',
                desc: 'Pengelolaan nilai formatif TP, sumatif STS/SAS, kalkulasi Nilai Akhir (NA), dan deskripsi capaian otomatis.',
                icon: Award,
              },
              {
                no: '12',
                title: 'Ekspor Word (.doc) & Cetak PDF',
                desc: 'Semua hasil dokumen langsung dapat diunduh ke Microsoft Word atau dicetak lengkap dengan Kop Surat Sekolah.',
                icon: Download,
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.no}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {f.no}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{f.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Logo size="lg" variant="light" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Mulai Buat Administrasi Guru SD dalam Hitungan Detik
          </h2>
          <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Daftar sekarang dengan verifikasi OTP cepat. Data sekolah dan guru otomatis terisi pada setiap lembar kerja dan modul ajar yang Anda hasilkan.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>DAFTAR SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>LOGIN KE AKUN SAYA</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenPublishGuide={onOpenPublishGuide} onOpenAuth={onOpenAuth} />
    </div>
  );
};
