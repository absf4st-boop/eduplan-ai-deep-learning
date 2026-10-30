import { GoogleGenAI } from '@google/genai';
import { generateCurriculumFallback } from '../../src/services/curriculumGenerator';

export const handler = async (event: any) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body: any = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const {
    documentType,
    subject = 'PJOK',
    grade = '5',
    phase = 'C',
    semester = '1 (Ganjil)',
    schoolYear = '2026/2027',
    material = 'Aktivitas Kebugaran Jasmani dan Pola Hidup Sehat',
    additionalInstructions = '',
    teacher = { name: 'Husein Apriyanto', nip: '19900815 201802 1 001' },
    school = {
      name: 'SDN Kasepuhan 04',
      principalName: 'Drs. H. Sugiyanto, M.Pd.',
      principalNip: '19750312 199903 1 002',
      address: 'Jl. Raya Kasepuhan No. 4, Jawa Tengah',
    },
    contextDocuments = {},
  } = body;

  const apiKey = process.env.GEMINI_API_KEY || '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemPrompt = `Anda adalah pakar kurikulum Sekolah Dasar (SD) Indonesia dan spesialis Pembelajaran Mendalam (Deep Learning).
Hasilkan dokumen administrasi pembelajaran resmi, lengkap, dan profesional dalam Bahasa Indonesia yang siap pakai dan dapat diedit oleh guru.
Format keluaran HARUS berupa HTML murni yang rapi, profesional, dan siap cetak (gunakan h1, h2, h3, tabel bergaris, dan tanda tangan di akhir).`;

      const userPrompt = `Buatlah dokumen administrasi: ${documentType}
Mata Pelajaran: ${subject}
Kelas: ${grade} (Fase ${phase})
Semester: ${semester}
Tahun Pelajaran: ${schoolYear}
Topik/Materi: ${material}
Guru: ${teacher?.name}, NIP: ${teacher?.nip}
Kepala Sekolah: ${school?.principalName}, NIP: ${school?.principalNip}
Sekolah: ${school?.name}, Alamat: ${school?.address}
Instruksi Tambahan: ${additionalInstructions}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      let cleanHtml = (response.text || '').trim();
      if (cleanHtml.startsWith('```html')) {
        cleanHtml = cleanHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
      } else if (cleanHtml.startsWith('```')) {
        cleanHtml = cleanHtml.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
      }

      if (cleanHtml) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            source: 'gemini-ai-netlify',
            content: cleanHtml,
          }),
        };
      }
    } catch (err: any) {
      console.warn('Gemini AI error on Netlify function, falling back to curriculum engine:', err);
    }
  }

  // Fallback to high fidelity Deep Learning engine
  const content = generateCurriculumFallback({
    documentType,
    subject,
    grade,
    phase,
    semester,
    schoolYear,
    material,
    teacher,
    school,
    additionalInstructions,
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      source: 'curriculum-engine-netlify',
      content,
    }),
  };
};
