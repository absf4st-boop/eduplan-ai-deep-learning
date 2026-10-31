import { GoogleGenAI } from '@google/genai';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { params, schoolProfile, teacherProfile } = JSON.parse(event.body || '{}');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fallback: true,
          message: 'GEMINI_API_KEY not configured. Falling back to client-side Deep Learning generator.',
        }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Anda adalah Ahli Kurikulum Merdeka dan Pengembang Perangkat Pembelajaran Mendalam (Deep Learning) Sekolah Dasar (SD) di Indonesia.
Hasilkan dokumen ${params.type} berbahasa Indonesia yang sangat lengkap, komprehensif, dan siap cetak/ekspor ke Word.
Gunakan 3 prinsip Deep Learning:
1. Berkesadaran (Mindful): Mengajak siswa memahami makna belajar dan refleksi diri.
2. Bermakna (Meaningful): Mengaitkan materi dengan kehidupan nyata dan masalah kontekstual.
3. Menggembirakan (Joyful): Aktivitas yang memicu rasa ingin tahu, antusiasme, dan kolaborasi tanpa rasa tertekan.

Struktur format harus rapi dalam tag HTML (gunakan <h2>, <h3>, <table>, <tr>, <td>, <ul>, <li>, <p>, <strong>). Jangan membungkus dengan tag <html> atau <body>.`;

    const prompt = `Buat dokumen ${params.type} untuk:
Mata Pelajaran: ${params.subject}
Kelas: ${params.grade} (${params.phase})
Semester: ${params.semester}
Tahun Pelajaran: ${params.academicYear}
Topik/Materi: ${params.topic}
Alokasi Waktu: ${params.duration}
Model Pembelajaran: ${params.learningModel}
Instruksi Tambahan: ${params.additionalPrompt || 'Lengkap dengan rubrik asesmen autentik'}

Nama Guru: ${teacherProfile?.fullName || 'Guru Kelas'}
Nama Sekolah: ${schoolProfile?.schoolName || 'SD Negeri'}
Kepala Sekolah: ${schoolProfile?.headmaster?.name || 'Kepala Sekolah'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: text }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
