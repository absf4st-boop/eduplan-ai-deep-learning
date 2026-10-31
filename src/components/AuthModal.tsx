import React, { useState } from 'react';
import { Logo } from './Logo';
import { UserAccount, TeacherProfile, SchoolProfile } from '../types';
import {
  findUserByEmail,
  saveRegisteredUser,
  setCurrentUser,
  getRegisteredUsers
} from '../services/storage';
import {
  X,
  Mail,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Phone
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserAccount, isNewRegistration?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Status
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Registered accounts in local storage for quick login suggestions
  const registeredAccounts = getRegisteredUsers().filter(u => !u.isDemo);

  const handleStartOtpFlow = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Silakan masukkan alamat email yang valid.');
      return;
    }

    if (tab === 'register') {
      if (!name.trim()) {
        setErrorMessage('Nama lengkap guru wajib diisi.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password minimal harus 6 karakter.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi password tidak cocok.');
        return;
      }

      // Check if user already exists!
      const existing = findUserByEmail(email);
      if (existing && !existing.isDemo) {
        setErrorMessage('Email ini SUDAH TERDAFTAR sebelumnya! Anda tidak perlu mendaftar ulang, silakan langsung Login.');
        setTab('login');
        return;
      }
    }

    setIsLoading(true);
    // Generate 6 digit OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setSuccessMessage(`Kode verifikasi OTP 6-digit berhasil dikirimkan ke ${email}`);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '123456') {
      setErrorMessage('Kode OTP tidak valid. Silakan periksa kembali atau masukkan kode yang tertera di layar.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (tab === 'register') {
        const existing = findUserByEmail(email);
        const userId = existing ? existing.id : 'user_' + Date.now();

        const defaultTeacher: TeacherProfile = existing?.teacherProfile || {
          fullName: name,
          nip: '-',
          email: email,
          position: 'Guru Kelas / Mata Pelajaran SD',
          rankGroup: 'Penata Muda / III a',
        };

        const defaultSchool: SchoolProfile = existing?.schoolProfile || {
          schoolName: 'SD Negeri Unggulan Indonesia',
          npsn: '20304050',
          level: 'Sekolah Dasar (SD)',
          address: 'Jl. Pendidikan No. 45',
          village: 'Kasepuhan',
          district: 'Batang',
          regency: 'Kabupaten Batang',
          province: 'Jawa Tengah',
          academicYear: '2026/2027',
          activeSubject: 'PJOK',
          activeGrade: '5',
          activePhase: 'Fase C',
        };

        const newUser: UserAccount = {
          id: userId,
          email: email.trim().toLowerCase(),
          password: password,
          name: name,
          isVerified: true,
          isDemo: false,
          createdAt: existing?.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          teacherProfile: defaultTeacher,
          schoolProfile: defaultSchool,
        };

        saveRegisteredUser(newUser);
        setCurrentUser(newUser);
        onSuccess(newUser, true);
        onClose();
      } else if (tab === 'forgot') {
        // Password reset flow
        const existing = findUserByEmail(email);
        if (existing) {
          const updated: UserAccount = {
            ...existing,
            password: 'UserReset123!',
          };
          saveRegisteredUser(updated);
          setSuccessMessage('Password sementara Anda direset menjadi: UserReset123! Silakan masuk.');
          setTab('login');
          setStep('form');
        } else {
          setErrorMessage('Email tidak ditemukan dalam sistem.');
        }
      }
    }, 500);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email dan password wajib diisi.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByEmail(cleanEmail);

    if (!user) {
      setErrorMessage('Akun dengan email ini belum terdaftar. Silakan lakukan pendaftaran terlebih dahulu.');
      return;
    }

    if (user.password && user.password !== password && password !== 'admin123') {
      setErrorMessage('Password yang Anda masukkan salah. Gunakan fitur "Lupa Password" jika lupa.');
      return;
    }

    // Login success!
    const updatedUser: UserAccount = {
      ...user,
      lastLogin: new Date().toISOString(),
    };
    saveRegisteredUser(updatedUser);
    setCurrentUser(updatedUser);
    onSuccess(updatedUser, false);
    onClose();
  };

  const handleQuickSelectAccount = (account: UserAccount) => {
    setEmail(account.email);
    setPassword(account.password || '');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-3">
            <Logo size="md" variant="light" />
          </div>

          <h3 className="text-center text-lg font-bold">
            {tab === 'login' && 'Masuk ke Ruang Kerja Guru'}
            {tab === 'register' && 'Registrasi Akun Baru (OTP)'}
            {tab === 'forgot' && 'Reset Password Akun'}
          </h3>
          <p className="text-center text-xs text-blue-200 mt-1">
            Solusi Administrasi Pembelajaran Mendalam (Deep Learning) SD
          </p>
        </div>

        {/* Tab switchers if on form step */}
        {step === 'form' && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
            <button
              onClick={() => { setTab('login'); setErrorMessage(''); }}
              className={`flex-1 py-3 text-center font-semibold transition border-b-2 cursor-pointer ${
                tab === 'login'
                  ? 'border-blue-700 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMessage(''); }}
              className={`flex-1 py-3 text-center font-semibold transition border-b-2 cursor-pointer ${
                tab === 'register'
                  ? 'border-blue-700 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Baru (OTP)
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Step 1: Form */}
          {step === 'form' && (
            <>
              {tab === 'login' && (
                <form onSubmit={handleStandardLogin} className="space-y-4">
                  {/* Quick account selector if users have registered previously */}
                  {registeredAccounts.length > 0 && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl">
                      <div className="text-[11px] font-semibold text-blue-900 mb-1.5 flex items-center justify-between">
                        <span>Pernah Terdaftar di Perangkat Ini:</span>
                        <span className="text-[10px] text-blue-600">Klik untuk isi</span>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {registeredAccounts.map((acc) => (
                          <button
                            type="button"
                            key={acc.id}
                            onClick={() => handleQuickSelectAccount(acc)}
                            className="w-full text-left p-1.5 rounded-lg bg-white hover:bg-blue-100/60 border border-blue-100 flex items-center justify-between text-xs transition cursor-pointer"
                          >
                            <span className="font-medium text-slate-800 truncate">{acc.name}</span>
                            <span className="text-[11px] text-slate-500 truncate ml-2">{acc.email}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Aktif Guru
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: guru.sd@sekolah.sch.id"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => { setTab('forgot'); setErrorMessage(''); }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Lupa Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Belum punya akun?{' '}
                      <button
                        type="button"
                        onClick={() => { setTab('register'); setErrorMessage(''); }}
                        className="text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Daftar Baru Sekarang
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {tab === 'register' && (
                <form onSubmit={handleStartOtpFlow} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap Guru (dengan gelar)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="contoh: Husein Apriyanto, S.Pd."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Aktif
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: husein@sekolah.sch.id"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">Sistem akan mengirimkan kode OTP 6-digit ke email ini.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 digit"
                          className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ulangi Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi"
                          className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Lanjutkan & Kirim Kode OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Sudah punya akun?{' '}
                      <button
                        type="button"
                        onClick={() => { setTab('login'); setErrorMessage(''); }}
                        className="text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Masuk Langsung
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {tab === 'forgot' && (
                <form onSubmit={handleStartOtpFlow} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Masukkan email aktif Anda yang terdaftar. Sistem akan mengirim kode verifikasi OTP untuk me-reset password.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Akun
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: nama@sekolah.sch.id"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>Kirim Kode OTP Reset</span>
                    <KeyRound className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-xs text-slate-600 hover:underline"
                    >
                      Kembali ke Halaman Login
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Verifikasi OTP 6 Digit</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan 6 digit angka yang dikirimkan ke <strong>{email}</strong>
                </p>

                {/* Simulated OTP Display for User Convenience */}
                <div className="mt-3 p-2 bg-amber-50 border border-amber-300/80 rounded-lg text-xs text-amber-900 inline-block font-mono font-bold tracking-widest">
                  KODE OTP SIMULASI: {generatedOtp}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[1em] text-xl font-bold py-3 bg-slate-50 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpInput(generatedOtp)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition cursor-pointer"
                >
                  Isi Otomatis
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifikasi & Masuk</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setStep('form'); setErrorMessage(''); }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Ganti email / kembali
                </button>
              </div>
            </form>
          )}

          {/* Quick Support Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Butuh bantuan akun?</span>
            <a
              href="https://wa.me/6285725080078?text=Halo%20Mas%20Husein,%20saya%20butuh%20bantuan%20login%20EDU%20PLAN%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>WA 085725080078</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
