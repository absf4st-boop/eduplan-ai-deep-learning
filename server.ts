import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
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

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    aiReady: Boolean(apiKey),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    developedBy: 'huseinapriyanto',
  });
});

app.post('/api/generate', async (req, res) => {
  const {
    documentType,
    subject,
    grade,
    phase,
    semester,
    schoolYear,
    material,
    additionalInstructions,
    teacher,
    school,
    contextDocuments,
  } = req.body;

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
    HADIR: 'Daftar Hadir Siswa',
    NILAI: 'Daftar Nilai Asesmen Pembelajaran Mendalam',
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
        model: 'gemini-3.8-flash',
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
