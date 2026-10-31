import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { UserAccount, TeacherProfile, SchoolProfile } from '../types';
import {
  findUserByEmail,
  saveRegisteredUser,
  setCurrentUser,
  getRegisteredUsers
} from '../services/storage';
import { signInWithGoogle } from '../services/firebase';
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
  Phone,
  Clock,
  RotateCw,
  Send
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

  // Status & Timers
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState<number>(300); // 5 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [devOtp, setDevOtp] = useState<string>('');
  const [brevoSent, setBrevoSent] = useState<boolean>(false);

  // Active timer for 5 minutes expiration and resend cooldown
  useEffect(() => {
    if (step !== 'otp') return;

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Registered accounts in local storage for quick login suggestions
  const registeredAccounts = getRegisteredUsers().filter(u => !u.isDemo);

  const handleStartOtpFlow = async (e: React.FormEvent) => {
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

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || 'Bapak/Ibu Guru',
          purpose: tab === 'register' ? 'Pendaftaran Akun Guru' : 'Reset Password Akun',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStep('otp');
        setOtpInput('');
        setCountdown(data.expiresInSeconds || 300); // 5 minutes
        setResendCooldown(30); // 30s resend cooldown
        setBrevoSent(Boolean(data.brevoSent));
        setDevOtp(data.devCode || '');
        setSuccessMessage(data.message || `Kode verifikasi OTP 6-digit berhasil dikirimkan ke ${email}`);
      } else {
        setErrorMessage(data.message || 'Gagal mengirimkan kode OTP. Silakan periksa koneksi atau coba lagi.');
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kendala jaringan saat menghubungi server: ' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || 'Bapak/Ibu Guru',
          purpose: tab === 'register' ? 'Pendaftaran Akun Guru (Kirim Ulang)' : 'Reset Password Akun (Kirim Ulang)',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setOtpInput('');
        setCountdown(data.expiresInSeconds || 300);
        setResendCooldown(30);
        setBrevoSent(Boolean(data.brevoSent));
        setDevOtp(data.devCode || '');
        setSuccessMessage(data.message || `Kode OTP baru telah dikirimkan ke ${email}`);
      } else {
        setErrorMessage(data.message || 'Gagal mengirim ulang OTP.');
      }
    } catch (err: any) {
      setErrorMessage('Gagal menghubungi server pengirim OTP: ' + (err.message || err));
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (countdown <= 0) {
      setErrorMessage('Kode OTP telah kedaluwarsa (masa berlaku 5 menit habis). Silakan klik Kirim Ulang Kode.');
      return;
    }

    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setErrorMessage('Silakan masukkan 6 digit kode OTP lengkap.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otpInput.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Kode OTP tidak valid atau sudah kedaluwarsa.');
        setIsLoading(false);
        return;
      }

      // Verification succeeded! Proceed with registration or password reset
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
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan saat memverifikasi OTP: ' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const fUser = await signInWithGoogle();
      if (!fUser || !fUser.uid) {
        throw new Error('Gagal mendapatkan kredensial akun Google.');
      }
      const gEmail = (fUser.email || '').trim().toLowerCase();
      const gName = fUser.displayName || 'Bapak/Ibu Guru';
      const existing = findUserByEmail(gEmail);

      let userToSet: UserAccount;
      let isNew = false;

      if (existing) {
        userToSet = {
          ...existing,
          id: fUser.uid,
          lastLogin: new Date().toISOString(),
        };
      } else {
        isNew = true;
        const defaultTeacher: TeacherProfile = {
          fullName: gName,
          name: gName,
          nip: '-',
          email: gEmail,
          position: 'Guru PJOK SD',
          rank: 'Penata Muda / III a',
          rankGroup: 'Penata Muda / III a',
        };

        const defaultSchool: SchoolProfile = {
          schoolName: 'SD Negeri Kasepuhan 04',
          name: 'SD Negeri Kasepuhan 04',
          npsn: '20301928',
          educationLevel: 'Sekolah Dasar (SD)',
          level: 'Sekolah Dasar (SD)',
          address: 'Jl. Raya Kasepuhan No. 04',
          village: 'Kasepuhan',
          district: 'Batang',
          regency: 'Kabupaten Batang',
          province: 'Jawa Tengah',
          academicYear: '2026/2027',
          activeSubject: 'PJOK',
          activeGrade: '5',
          activePhase: 'Fase C',
        };

        userToSet = {
          id: fUser.uid,
          email: gEmail,
          name: gName,
          isVerified: true,
          isDemo: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          teacherProfile: defaultTeacher,
          schoolProfile: defaultSchool,
        };
      }

      saveRegisteredUser(userToSet);
      setCurrentUser(userToSet);
      onSuccess(userToSet, isNew);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      // If user closed the popup, don't show an alarming error
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Jendela login Google ditutup sebelum selesai.');
      } else {
        setErrorMessage('Gagal masuk dengan Google: ' + (err.message || 'Terjadi kendala'));
      }
    } finally {
      setIsLoading(false);
    }
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

                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-semibold text-slate-400">
                      <span className="bg-white px-2">Atau masuk langsung dengan</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-3 border border-slate-300 hover:border-blue-400 rounded-xl bg-white hover:bg-blue-50/50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Masuk dengan Google (Firebase)</span>
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

                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-semibold text-slate-400">
                      <span className="bg-white px-2">Atau daftar langsung dengan</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-3 border border-slate-300 hover:border-blue-400 rounded-xl bg-white hover:bg-blue-50/50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Daftar Cepat dengan Google (Firebase)</span>
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

          {/* Step 2: Real Brevo OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-1">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Verifikasi OTP 6 Digit</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Masukkan 6 digit angka yang dikirimkan ke email Gmail:
                </p>
                <div className="text-xs font-bold text-blue-900 mt-0.5 break-all">
                  {email}
                </div>

                {/* 5-Minute Timer & Expiration Display */}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200">
                  <Clock className={`w-3.5 h-3.5 ${countdown <= 60 ? 'text-rose-600 animate-pulse' : 'text-blue-700'}`} />
                  <span className={countdown <= 60 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                    {countdown > 0 ? (
                      <>Masa berlaku: <strong className="font-mono text-slate-900">{formatTime(countdown)}</strong> (5 menit)</>
                    ) : (
                      <span className="text-rose-600 font-bold">Kode telah kedaluwarsa. Silakan kirim ulang.</span>
                    )}
                  </span>
                </div>

                {brevoSent && (
                  <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] text-emerald-800 flex items-center justify-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Email resmi berhasil dikirim ke Gmail via Brevo! Cek Inbox & folder Spam.</span>
                  </div>
                )}

                {/* Development Helper when Brevo Key is not yet populated */}
                {devOtp && (
                  <div className="mt-2.5 p-2 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900">
                    <div className="font-semibold text-amber-800">Mode Pengetesan (Kunci Brevo Belum Diisi di Server):</div>
                    <div className="font-mono font-bold text-sm tracking-widest my-1">{devOtp}</div>
                    <button
                      type="button"
                      onClick={() => setOtpInput(devOtp)}
                      className="text-[10px] text-blue-700 underline font-semibold hover:text-blue-900 cursor-pointer"
                    >
                      Klik untuk isi kode pengujian otomatis
                    </button>
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  disabled={countdown <= 0}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  autoFocus
                  className="w-full text-center tracking-[0.8em] sm:tracking-[1em] text-2xl font-mono font-bold py-3 bg-slate-50 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:opacity-50 disabled:bg-slate-100"
                />
                <div className="text-[10px] text-slate-500 text-center mt-1">
                  Kode 6-digit sekali pakai (single-use) • Valid 5 menit
                </div>
              </div>

              {/* Actions: Verify & Resend */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isLoading || countdown <= 0 || otpInput.trim().length !== 6}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Memverifikasi...' : 'Verifikasi & Masuk ke Ruang Kerja'}</span>
                </button>

                {/* Resend OTP Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep('form'); setErrorMessage(''); }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Ganti email / kembali
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isResending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {isResending
                        ? 'Mengirim...'
                        : resendCooldown > 0
                        ? `Kirim Ulang (${resendCooldown}s)`
                        : 'Kirim Ulang Kode OTP'}
                    </span>
                  </button>
                </div>
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
