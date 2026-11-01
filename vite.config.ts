import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function apiPlugin(): Plugin {
  return {
    name: 'eduplan-api-plugin',
    configureServer(server) {
      // /api/status endpoint
      server.middlewares.use('/api/status', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            status: 'ok',
            aiReady: Boolean(process.env.GEMINI_API_KEY),
            timestamp: new Date().toISOString(),
            version: '2.5.0',
            developedBy: 'huseinapriyanto',
          })
        );
      });

      // /api/generate endpoint
      server.middlewares.use('/api/generate', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const { params, schoolProfile, teacherProfile } = parsed;

            const apiKey = process.env.GEMINI_API_KEY;
            if (apiKey && params) {
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
Hasilkan dokumen ${params.type} resmi, lengkap, dan profesional dalam Bahasa Indonesia yang siap pakai dan dapat diekspor ke Word.
Gunakan 3 prinsip Deep Learning: Berkesadaran (Mindful), Bermakna (Meaningful), Menggembirakan (Joyful).
Format keluaran HARUS berupa HTML murni yang rapi (gunakan <h2>, <h3>, <table>, <tr>, <td>, <ul>, <li>, <p>, <strong>). Jangan menggunakan tag <html> atau <body>.`;

                const userPrompt = `Buatlah dokumen: ${params.type}
Mata Pelajaran: ${params.subject}
Kelas: ${params.grade} (${params.phase})
Semester: ${params.semester}
Tahun Pelajaran: ${params.academicYear}
Topik/Materi: ${params.topic}
Alokasi Waktu: ${params.duration || '3 JP'}
Model Pembelajaran: ${params.learningModel}
Instruksi Tambahan: ${params.additionalPrompt || 'Lengkap dengan asesmen autentik'}
Guru: ${teacherProfile?.fullName || teacherProfile?.name}, NIP: ${teacherProfile?.nip}
Sekolah: ${schoolProfile?.schoolName || schoolProfile?.name}`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: userPrompt,
                  config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.7,
                  },
                });

                let cleanHtml = (response.text || '').trim();
                if (cleanHtml.startsWith('```html')) {
                  cleanHtml = cleanHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
                } else if (cleanHtml.startsWith('```')) {
                  cleanHtml = cleanHtml.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
                }

                if (cleanHtml) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      success: true,
                      source: 'gemini-ai',
                      html: cleanHtml,
                    })
                  );
                  return;
                }
              } catch (aiErr) {
                console.warn('Gemini API call warning in dev server:', aiErr);
              }
            }

            // Return fallback flag so client will generate instantaneously with deep learning templates
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                fallback: true,
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
