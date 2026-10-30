import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, RefreshCw, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { getAllUsers, setCurrentUser } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'forgot';
  onClose: () => void;
  onSuccess: (user: UserAccount, isNewRegistration: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot' | 'reset'>(initialMode);
  
  // Registration & Login fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP state
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number>(0);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState<number>(300);
  const [attempts, setAttempts] = useState<number>(0);
  const [simulatedEmailNotification, setSimulatedEmailNotification] = useState<string | null>(null);

  // Status message
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  // Timer countdown
  useEffect(() => {
    if (mode === 'otp' && otpSecondsLeft > 0) {
      const interval = setInterval(() => {
        setOtpSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, otpSecondsLeft]);

  if (!isOpen) return null;

  const triggerOtpSend = (targetEmail: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpExpiry(Date.now() + 300000); // 5 mins
    setOtpSecondsLeft(300);
    setAttempts(0);
    setOtpInput('');
    setSimulatedEmailNotification(
      `Kode OTP Verifikasi Anda: ${code} (Berlaku 5 menit untuk akun ${targetEmail})`
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Format email tidak valid');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok');
      return;
    }

    // Trigger OTP Flow
    triggerOtpSend(email);
    setMode('otp');
    setSuccessMsg('Kode verifikasi 6 digit telah dikirimkan ke email Anda.');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (Date.now() > otpExpiry) {
      setErrorMsg('Kode OTP telah kedaluwarsa. Silakan kirim ulang.');
      return;
    }

    if (attempts >= 5) {
      setErrorMsg('Percobaan melebihi batas (maks 5 kali). Silakan minta kode baru.');
      return;
    }

    if (otpInput.trim() !== generatedOtp) {
      setAttempts((prev) => prev + 1);
      setErrorMsg(`Kode OTP salah. Sisa kesempatan: ${4 - attempts}`);
      return;
    }

    // OTP Verified! Create user
    const newUserId = 'user_' + Date.now();
    const newUser: UserAccount = {
      id: newUserId,
      name,
      email,
      passwordHash: btoa(password), // simple base64 hash simulation
      isDemo: false,
      createdAt: new Date().toISOString(),
      teacherProfile: {
        name,
        nip: '19850101 201501 1 001',
        email,
        position: 'Guru Kelas / Mata Pelajaran SD',
        rank: 'Penata Muda / III-a',
      },
      schoolProfile: {
        name: 'SD Negeri Unggulan 01',
        npsn: '20309999',
        educationLevel: 'Sekolah Dasar (SD)',
        address: 'Jl. Pendidikan Nasional No. 10',
        village: 'Sukamaju',
        district: 'Kecamatan Cerdas',
        regency: 'Kabupaten Prestasi',
        province: 'Jawa Barat',
        schoolYear: '2026/2027',
        principalName: 'H. Bambang Irawan, M.Pd.',
        principalNip: '19700101 199503 1 001',
        logoUrl: '',
      },
    };

    setCurrentUser(newUser);
    onSuccess(newUser, true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const users = getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setErrorMsg('Email tidak terdaftar. Silakan lakukan registrasi terlebih dahulu.');
      return;
    }

    if (user.passwordHash && user.passwordHash !== btoa(password)) {
      setErrorMsg('Password yang Anda masukkan salah.');
      return;
    }

    setCurrentUser(user);
    onSuccess(user, false);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const users = getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      setErrorMsg('Email tersebut tidak ditemukan dalam sistem kami.');
      return;
    }

    triggerOtpSend(email);
    setMode('reset');
    setSuccessMsg('Kode verifikasi reset password telah dikirim ke email Anda.');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (otpInput.trim() !== generatedOtp) {
      setErrorMsg('Kode OTP salah.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password baru minimal 6 karakter.');
      return;
    }

    const users = getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.passwordHash = btoa(password);
      setCurrentUser(user);
      setSuccessMsg('Password berhasil diperbarui! Silakan masuk.');
      setMode('login');
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black tracking-tight">
              {mode === 'login' && 'Masuk Akun Guru'}
              {mode === 'register' && 'Daftar Akun EDU PLAN AI'}
              {mode === 'otp' && 'Verifikasi OTP Email'}
              {mode === 'forgot' && 'Lupa Password'}
              {mode === 'reset' && 'Reset Password'}
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Ruang kerja administrasi pembelajaran pribadi guru
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mock Email Banner if triggered */}
        {simulatedEmailNotification && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">📨 Simulasi Pengiriman Email:</span>
              <span>{simulatedEmailNotification}</span>
              <button
                type="button"
                onClick={() => setOtpInput(generatedOtp)}
                className="block text-[11px] underline font-bold text-emerald-700 mt-1 hover:text-emerald-900"
              >
                Klik di sini untuk mengisi otomatis kode OTP
              </button>
            </div>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && !simulatedEmailNotification && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun Guru
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama.guru@sekolah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-blue-700 font-bold hover:underline"
                >
                  Daftar Sekarang
                </button>
              </div>
            </form>
          )}

          {/* REGISTER MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Guru (dengan Gelar)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Husein Apriyanto, S.Pd."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Aktif
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="email.aktif@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Ketik ulang kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Verifikasi OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-700 font-bold hover:underline"
                >
                  Masuk di Sini
                </button>
              </div>
            </form>
          )}

          {/* OTP VERIFICATION MODE */}
          {mode === 'otp' && (
            <form onSubmit={handleOtpVerify} className="space-y-4 text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">Masukkan 6 Digit Kode OTP</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kode telah dikirimkan ke <strong>{email}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-48 mx-auto text-center font-mono text-2xl tracking-widest font-black py-2.5 border-2 border-blue-900/40 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <span>Masa berlaku:</span>
                <span className="font-mono font-bold text-red-600">
                  {formatSeconds(otpSecondsLeft)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verifikasi & Masuk Ruang Kerja</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => triggerOtpSend(email)}
                  disabled={otpSecondsLeft > 240}
                  className="text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-40"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Kirim Ulang Kode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Ubah Email
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun Terdaftar
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="email.guru@sekolah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md"
              >
                Kirim Kode OTP Reset
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  Kembali ke Halaman Masuk
                </button>
              </div>
            </form>
          )}

          {/* RESET PASSWORD */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode OTP 6 Digit
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center font-mono text-xl py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
              >
                Simpan Password Baru
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
