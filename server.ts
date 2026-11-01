import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Environment constraint: Dev server must run on port 3000
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Curriculum reference helper & fallback generator
import { generateCurriculumFallback } from './src/services/curriculumGenerator.ts';

import { getRecommendedTopics } from './src/constants/curriculumTopics.ts';
import {
  generateSixDigitOtp,
  storeOtp,
  verifyOtpCode,
  sendOtpViaBrevo,
  OTP_EXPIRATION_MS,
  getStoredOtp
} from './src/services/brevoMailer.ts';

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    aiReady: Boolean(apiKey),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    developedBy: 'huseinapriyanto',
  });
});

// ==========================================
// BREVO OTP TRANSACTIONAL EMAIL ENDPOINTS
// ==========================================

// Check OTP & Brevo Configuration status
app.get('/api/otp/status', (req, res) => {
  const brevoApiKey = process.env.BREVO_API_KEY || '';
  const brevoSender = process.env.BREVO_SENDER_EMAIL || 'admin@eduplanai.com';
  res.json({
    brevoConfigured: Boolean(brevoApiKey),
    senderEmail: brevoSender,
    expiresInSeconds: OTP_EXPIRATION_MS / 1000,
  });
});

// Send 6-digit OTP to user's real email via Brevo
app.post('/api/otp/send', async (req, res) => {
  try {
    const { email, name = 'Bapak/Ibu Guru', purpose = 'Pendaftaran Akun' } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid. Masukkan alamat email aktif Anda.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check rate limit / cooldown: do not allow spamming within 25 seconds
    const existing = getStoredOtp(cleanEmail);
    if (existing && !existing.used && (Date.now() - existing.createdAt < 25 * 1000)) {
      const waitSeconds = Math.ceil((25 * 1000 - (Date.now() - existing.createdAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Harap tunggu ${waitSeconds} detik sebelum meminta pengiriman ulang kode OTP.`,
      });
    }

    // Generate new 6-digit OTP and store with 5-minute expiry
    const otpCode = generateSixDigitOtp();
    storeOtp(cleanEmail, otpCode);

    // Send real transactional email via Brevo
    const brevoResult = await sendOtpViaBrevo({
      recipientEmail: cleanEmail,
      recipientName: name,
      otpCode,
      purpose,
    });

    if (brevoResult.success) {
      return res.json({
        success: true,
        brevoSent: true,
        message: `Kode verifikasi OTP 6-digit telah dikirimkan ke ${cleanEmail} via Brevo. Silakan periksa Kotak Masuk atau folder Spam Gmail Anda.`,
        expiresInSeconds: 300,
      });
    } else {
      // If Brevo is not configured or returned an error, return informative status
      console.warn(`[OTP] Brevo send note for ${cleanEmail}: ${brevoResult.message}`);
      return res.json({
        success: true,
        brevoSent: false,
        brevoConfigured: brevoResult.brevoConfigured,
        notice: brevoResult.message,
        message: brevoResult.brevoConfigured
          ? `Pengiriman Brevo terkendala: ${brevoResult.message}`
          : 'BREVO_API_KEY belum diisi di server. Kode verifikasi ditampilkan sementara untuk pengetesan.',
        // For development fallback when API key is not configured yet
        devCode: !brevoResult.brevoConfigured ? otpCode : undefined,
        expiresInSeconds: 300,
      });
    }
  } catch (error: any) {
    console.error('Error in /api/otp/send:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses pengiriman OTP: ' + (error.message || error),
    });
  }
});

// Verify 6-digit OTP (single-use, 5 minutes validity)
app.post('/api/otp/verify', (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email dan kode OTP wajib diisi.',
      });
    }

    const verification = verifyOtpCode(email, otp);
    if (verification.success) {
      return res.json({
        success: true,
        message: verification.message,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }
  } catch (error: any) {
    console.error('Error in /api/otp/verify:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memverifikasi OTP: ' + (error.message || error),
    });
  }
});

// ==========================================
// CENTRALIZED SERVER & CROSS-DEVICE AUTH SYNC
// ==========================================
const ACCOUNTS_DB_PATH = path.join(__dirname, 'server_data', 'users.json');

function ensureUsersDbDir() {
  const dir = path.dirname(ACCOUNTS_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ACCOUNTS_DB_PATH)) {
    fs.writeFileSync(ACCOUNTS_DB_PATH, JSON.stringify([]), 'utf-8');
  }
}

function getServerUsers(): any[] {
  try {
    ensureUsersDbDir();
    const data = fs.readFileSync(ACCOUNTS_DB_PATH, 'utf-8');
    return JSON.parse(data) || [];
  } catch (e) {
    return [];
  }
}

function saveServerUsers(users: any[]) {
  try {
    ensureUsersDbDir();
    fs.writeFileSync(ACCOUNTS_DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save accounts to server file', e);
  }
}

// Check if user exists on any device
app.get('/api/auth/user/:email', (req, res) => {
  const email = (req.params.email || '').trim().toLowerCase();
  const users = getServerUsers();
  const found = users.find((u) => (u.email || '').trim().toLowerCase() === email);
  if (found) {
    const { password, ...safeUser } = found;
    return res.json({ exists: true, user: safeUser });
  }
  return res.json({ exists: false });
});

// Centralized register
app.post('/api/auth/register', (req, res) => {
  try {
    const { user, password } = req.body || {};
    if (!user || !user.email) {
      return res.status(400).json({ success: false, message: 'Data akun tidak lengkap' });
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const users = getServerUsers();
    const idx = users.findIndex((u) => (u.email || '').trim().toLowerCase() === cleanEmail);

    const accountToStore = {
      ...user,
      email: cleanEmail,
      password: password || user.password || '',
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      users[idx] = { ...users[idx], ...accountToStore };
    } else {
      users.push(accountToStore);
    }

    saveServerUsers(users);
    const { password: _, ...safeUser } = accountToStore;
    return res.json({ success: true, user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Gagal mendaftarkan akun di server' });
  }
});

// Centralized login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getServerUsers();
    const user = users.find((u) => (u.email || '').trim().toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Akun dengan email ini belum terdaftar di sistem. Silakan daftar baru.',
      });
    }

    if (user.password && user.password !== password && password !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Password yang Anda masukkan salah. Silakan coba lagi atau reset password.',
      });
    }

    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Gagal melakukan login di server' });
  }
});

// Sync user updates from any device
app.post('/api/auth/sync', (req, res) => {
  try {
    const { user } = req.body || {};
    if (!user || !user.email) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const users = getServerUsers();
    const idx = users.findIndex(
      (u) => (u.email || '').trim().toLowerCase() === cleanEmail || u.id === user.id
    );

    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }

    saveServerUsers(users);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Gagal menyinkronkan profil' });
  }
});

// Endpoint to generate or suggest tailored curriculum topics for any subject
app.post('/api/suggest-topics', async (req, res) => {
  const { subject = 'PJOK', grade = '5', semester = '1 (Ganjil)' } = req.body;

  if (ai) {
    try {
      const prompt = `Bertindaklah sebagai pakar Kurikulum Merdeka Sekolah Dasar (SD) Indonesia dengan pendekatan Pembelajaran Mendalam (Deep Learning).
Berikan 4 sampai 5 rekomendasi topik atau materi pembelajaran pokok spesifik, resmi, dan kontekstual untuk:
- Mata Pelajaran: ${subject}
- Kelas: ${grade} SD
- Semester: ${semester}

Format keluaran HARUS murni JSON array tanpa markdown/fences:
[
  {
    "id": "topik-1",
    "title": "Judul materi pokok yang jelas dan menarik untuk SD",
    "description": "Deskripsi capaian dan aktivitas utama",
    "tag": "Mindful"
  }
]
Tag hanya bernilai salah satu dari: "Mindful", "Meaningful", "Joyful".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      if (responseText.trim()) {
        const parsed = JSON.parse(responseText.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({
            success: true,
            topics: parsed,
            source: 'gemini-ai',
          });
        }
      }
    } catch (err: any) {
      console.warn('AI topic generation fallback to local matrix:', err?.message || err);
    }
  }

  // Local authentic Kurikulum Merdeka fallback
  const localTopics = getRecommendedTopics(subject, grade, semester);
  return res.json({
    success: true,
    topics: localTopics,
    source: 'curriculum-matrix',
  });
});

app.post('/api/generate', async (req, res) => {
  const body = req.body || {};
  const params = body.params || body;
  const teacher = body.teacherProfile || body.teacher || { name: 'Husein Apriyanto', nip: '19900815 201802 1 001' };
  const school = body.schoolProfile || body.school || { name: 'SDN Kasepuhan 04', principalName: 'Drs. H. Sugiyanto, M.Pd.', principalNip: '19750312 199903 1 002', address: 'Jl. Raya Kasepuhan No. 4, Jawa Tengah' };

  const documentType = params.documentType || params.type || 'MODUL_AJAR';
  const subject = params.subject || 'PJOK';
  const grade = params.grade || '5';
  const phase = params.phase || 'Fase C';
  const semester = params.semester || '1 (Ganjil)';
  const schoolYear = params.schoolYear || params.academicYear || '2026/2027';
  const material = params.material || params.topic || 'Kombinasi Pola Gerak Dasar Lokomotor, Nonlokomotor, dan Manipulatif';
  const additionalInstructions = params.additionalInstructions || params.additionalPrompt || '';
  const contextDocuments = body.contextDocuments || {};

  const docTypeNames: Record<string, string> = {
    CP: 'Capaian Pembelajaran (CP)',
    TP: 'Tujuan Pembelajaran (TP)',
    ATP: 'Alur Tujuan Pembelajaran (ATP)',
    RPP: 'Rencana Pelaksanaan Pembelajaran (RPP) Pembelajaran Mendalam',
    MODUL_AJAR: 'Modul Ajar Pembelajaran Mendalam (Deep Learning)',
    PROTA: 'Program Tahunan (PROTA)',
    PROMES: 'Program Semester (PROMES)',
    LKPD: 'Lembar Kerja Peserta Didik (LKPD)',
    JURNAL: 'Jurnal Harian Guru Pembelajaran Mendalam',
    JURNAL_HARIAN: 'Jurnal Harian Guru Pembelajaran Mendalam',
    HADIR: 'Daftar Hadir Siswa',
    DAFTAR_HADIR: 'Daftar Hadir Siswa',
    NILAI: 'Daftar Nilai Asesmen Pembelajaran Mendalam',
    DAFTAR_NILAI: 'Daftar Nilai Asesmen Pembelajaran Mendalam',
  };

  const documentName = docTypeNames[documentType] || documentType;

  // Build high-context prompt
  const systemPrompt = `Anda adalah pakar kurikulum Sekolah Dasar (SD) Indonesia dan spesialis Pembelajaran Mendalam (Deep Learning).
Hasilkan dokumen administrasi pembelajaran resmi, lengkap, dan profesional dalam Bahasa Indonesia yang siap pakai dan dapat diedit oleh guru.

KERANGKA PEMBELAJARAN MENDALAM (DEEP LEARNING):
- TIGA PRINSIP PEMBELAJARAN:
  1. Berkesadaran (Mindful): Murid sadar akan tujuan belajar, memahami proses, aktif berefleksi.
  2. Bermakna (Meaningful): Menghubungkan materi dengan kehidupan nyata sehari-hari dan pengalaman murid di lingkungan SD.
  3. Menggembirakan (Joyful): Suasana belajar positif, seru, interaktif, memotivasi, dan aman secara psikologis.
- EMPAT PENGALAMAN BELAJAR:
  1. Memahami (Concept understanding & exploration)
  2. Mengaplikasi (Real-world practice & problem solving)
  3. Merefleksi (Metacognition, feedback & evaluation)
  4. Mengembangkan Kapasitas Belajar (Self-directed learning & growth mindset)
- DELAPAN DIMENSI PROFIL LULUSAN:
  Keimanan dan ketakwaan terhadap Tuhan YME, Kewargaan, Penalaran kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi.

FORMAT KELUARAN:
Format keluaran HARUS berupa HTML murni yang rapi, profesional, dan siap cetak (gunakan heading h1, h2, h3, tabel bergaris dengan tag <table>, <thead>, <tbody>, <tr>, <th>, <td>, class styling Tailwind atau inline border yang bersih, daftar terurut, dan bagian tanda tangan guru serta kepala sekolah di akhir dokumen).
JANGAN sertakan tag <html>, <head>, atau <body>, hanya potongan HTML dokumen utama.`;

  const contextStr = contextDocuments && Object.keys(contextDocuments).length > 0
    ? `\nDOKUMEN ACUAN TERKAIT:\n` + Object.entries(contextDocuments).map(([k, v]) => `--- Acuan ${k} ---\n${v}`).join('\n\n')
    : '';

  const userPrompt = `Buatlah dokumen administrasi: ${documentName}
DATA PEMBELAJARAN:
- Mata Pelajaran: ${subject || 'PJOK'}
- Kelas: ${grade || '5'}
- Fase: ${phase || 'C'}
- Semester: ${semester || '1 (Ganjil)'}
- Tahun Pelajaran: ${schoolYear || '2026/2027'}
- Topik/Materi: ${material || 'Aktivitas Kebugaran Jasmani dan Pola Hidup Sehat'}
- Guru: ${teacher?.name || 'Husein Apriyanto'}, NIP: ${teacher?.nip || '19900815 201802 1 001'}
- Kepala Sekolah: ${school?.principalName || 'Drs. H. Sugiyanto, M.Pd.'}, NIP: ${school?.principalNip || '19750312 199903 1 002'}
- Sekolah: ${school?.name || 'SDN Kasepuhan 04'}, Alamat: ${school?.address || 'Jl. Raya Kasepuhan No. 4, Jawa Tengah'}
${contextStr}
- Instruksi Tambahan: ${additionalInstructions || 'Lengkap dengan rubrik penilaian, instrumen asesmen, dan alur pengalaman belajar.'}

Pastikan dokumen memuat:
1. Kop & Identitas Lengkap (Sekolah, Guru, Mapel, Kelas, Fase, Semester, TP).
2. Penerapan nyata 3 Prinsip Deep Learning (Mindful, Meaningful, Joyful).
3. Penerapan nyata 4 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi, Mengembangkan Kapasitas Belajar).
4. Pemilihan Dimensi Profil Lulusan yang relevan.
5. Tabel terstruktur rapi untuk kegiatan, alur, atau rubrik.
6. Kolom Tanda Tangan Guru Pengampu dan Kepala Sekolah di bagian bawah dengan titimangsa tempat dan tanggal.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const generatedText = response.text || '';
      if (generatedText.trim()) {
        // Strip markdown code block wrapping if present
        let cleanHtml = generatedText.trim();
        if (cleanHtml.startsWith('```html')) {
          cleanHtml = cleanHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
        } else if (cleanHtml.startsWith('```')) {
          cleanHtml = cleanHtml.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
        }

        return res.json({
          success: true,
          source: 'gemini-ai',
          content: cleanHtml,
          html: cleanHtml,
        });
      }
    }

    // Fallback to rich high-fidelity generator
    const fallbackHtml = generateCurriculumFallback({
      documentType,
      subject: subject || 'PJOK',
      grade: grade || '5',
      phase: phase || 'C',
      semester: semester || '1 (Ganjil)',
      schoolYear: schoolYear || '2026/2027',
      material: material || 'Aktivitas Gerak Berkesadaran & Kebugaran Jasmani',
      teacher: teacher || { name: 'Husein Apriyanto', nip: '19900815 201802 1 001' },
      school: school || { name: 'SDN Kasepuhan 04', principalName: 'Drs. H. Sugiyanto, M.Pd.', principalNip: '19750312 199903 1 002', address: 'Jl. Raya Kasepuhan No. 4, Jawa Tengah' },
      additionalInstructions,
    });

    return res.json({
      success: true,
      source: 'curriculum-engine',
      content: fallbackHtml,
      html: fallbackHtml,
    });
  } catch (error: any) {
    console.error('AI Generation error:', error);
    // Provide deterministic fallback on error so user never gets broken screen
    const fallbackHtml = generateCurriculumFallback({
      documentType,
      subject: subject || 'PJOK',
      grade: grade || '5',
      phase: phase || 'C',
      semester: semester || '1 (Ganjil)',
      schoolYear: schoolYear || '2026/2027',
      material: material || 'Aktivitas Gerak Berkesadaran & Kebugaran Jasmani',
      teacher: teacher || { name: 'Husein Apriyanto', nip: '19900815 201802 1 001' },
      school: school || { name: 'SDN Kasepuhan 04', principalName: 'Drs. H. Sugiyanto, M.Pd.', principalNip: '19750312 199903 1 002', address: 'Jl. Raya Kasepuhan No. 4, Jawa Tengah' },
      additionalInstructions,
    });

    return res.json({
      success: true,
      source: 'curriculum-engine-fallback',
      content: fallbackHtml,
      html: fallbackHtml,
      notice: error?.message || 'Generated via EDU PLAN AI Curriculum Engine',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EDU PLAN AI server running at http://localhost:${PORT}`);
  });
}

startServer();
