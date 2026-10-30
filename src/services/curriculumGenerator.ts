/**
 * EDU PLAN AI - DEEP LEARNING
 * Curriculum Generation Service & Official Indonesian SD Deep Learning Templates
 * Developed by: huseinapriyanto
 */

export interface GenerationParams {
  documentType: string;
  subject: string;
  grade: string;
  phase: string;
  semester: string;
  schoolYear: string;
  material: string;
  teacher?: {
    name: string;
    nip: string;
    role?: string;
  };
  school?: {
    name: string;
    principalName: string;
    principalNip: string;
    address: string;
    npsn?: string;
    logoUrl?: string;
  };
  additionalInstructions?: string;
}

export function generateCurriculumFallback(params: GenerationParams): string {
  const {
    documentType,
    subject,
    grade,
    phase,
    semester,
    schoolYear,
    material,
    teacher = { name: 'Husein Apriyanto', nip: '19900815 201802 1 001' },
    school = {
      name: 'SDN Kasepuhan 04',
      principalName: 'Drs. H. Sugiyanto, M.Pd.',
      principalNip: '19750312 199903 1 002',
      address: 'Jl. Raya Kasepuhan No. 4, Jawa Tengah',
      npsn: '20301928',
    },
  } = params;

  const headerHtml = `
  <div style="border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 20px; text-align: center; font-family: 'Times New Roman', Times, serif;">
    <div style="font-size: 16pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase;">PEMERINTAH KABUPATEN / DINAS PENDIDIKAN</div>
    <div style="font-size: 18pt; font-weight: bold; color: #0f172a; text-transform: uppercase;">${school.name}</div>
    <div style="font-size: 10pt; color: #475569; margin-top: 4px;">Alamat: ${school.address} | NPSN: ${school.npsn || '20301928'}</div>
    <div style="font-size: 9pt; color: #64748b; font-style: italic; margin-top: 2px;">Tahun Pelajaran: ${schoolYear}</div>
  </div>
  `;

  const signatureHtml = `
  <div style="margin-top: 40px; page-break-inside: avoid; font-family: 'Times New Roman', Times, serif;">
    <table style="width: 100%; border: none;">
      <tr>
        <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
          <p style="margin: 0;">Mengetahui,</p>
          <p style="margin: 0; font-weight: bold;">Kepala ${school.name}</p>
          <div style="height: 70px;"></div>
          <p style="margin: 0; font-weight: bold; text-decoration: underline;">${school.principalName}</p>
          <p style="margin: 0; font-size: 10pt;">NIP. ${school.principalNip}</p>
        </td>
        <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
          <p style="margin: 0;">Kasepuhan, ........................ ${schoolYear.split('/')[0]}</p>
          <p style="margin: 0; font-weight: bold;">Guru Mata Pelajaran ${subject}</p>
          <div style="height: 70px;"></div>
          <p style="margin: 0; font-weight: bold; text-decoration: underline;">${teacher.name}</p>
          <p style="margin: 0; font-size: 10pt;">NIP. ${teacher.nip}</p>
        </td>
      </tr>
    </table>
  </div>
  `;

  switch (documentType) {
    case 'CP':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">CAPAIAN PEMBELAJARAN (CP) PEMBELAJARAN MENDALAM</h2>
      
      <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 4px 0;">Satuan Pendidikan</td><td>: ${school.name}</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 0;">Fase / Kelas</td><td>: ${phase} / Kelas ${grade}</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 0;">Tahun Pelajaran</td><td>: ${schoolYear}</td></tr>
        <tr><td style="font-weight: bold; padding: 4px 0;">Penyusun</td><td>: ${teacher.name} (NIP. ${teacher.nip})</td></tr>
      </table>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">A. RASIONALISASI MATA PELAJARAN</h3>
      <p style="text-align: justify; line-height: 1.6; font-size: 11pt;">
        Mata pelajaran <strong>${subject}</strong> pada Fase ${phase} (Kelas ${grade}) diselenggarakan dengan pendekatan <em>Pembelajaran Mendalam (Deep Learning)</em> yang menekankan tiga pilar utama: <strong>Berkesadaran (Mindful)</strong>, <strong>Bermakna (Meaningful)</strong>, dan <strong>Menggembirakan (Joyful)</strong>. Pembelajaran dirancang bukan sekadar mentransfer materi hafalan mekanistik, melainkan menumbuhkan pemahaman mendasar, keterampilan hidup nyata, serta pembentukan karakter luhur profil lulusan.
      </p>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 18px;">B. CAPAIAN PEMBELAJARAN FASE ${phase}</h3>
      <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px; margin-bottom: 16px; font-size: 11pt; line-height: 1.6;">
        Pada akhir Fase ${phase}, peserta didik mampu memahami esensi materi <strong>${material}</strong>, mendemonstrasikan keterampilan esensial secara mandiri maupun kolaboratif, serta mampu merefleksikan manfaat pembelajaran dalam kehidupan bermasyarakat dan menjaga pola hidup berkesadaran.
      </div>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 18px;">C. ELEMEN DAN DESKRIPSI CAPAIAN PEMBELAJARAN</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10.5pt;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th style="padding: 8px; border: 1px solid #94a3b8; width: 25%;">Elemen</th>
            <th style="padding: 8px; border: 1px solid #94a3b8; width: 45%;">Capaian Pembelajaran (CP)</th>
            <th style="padding: 8px; border: 1px solid #94a3b8; width: 30%;">Keterkaitan 8 Dimensi Profil</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #94a3b8; font-weight: bold;">1. Pemahaman Konsep (Understanding)</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Peserta didik memahami prinsip dasar, pola interaksi, dan kaidah esensial terkait ${material} secara mendalam dan berkesadaran penuh.</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Penalaran Kritis, Kemandirian</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #94a3b8; font-weight: bold;">2. Keterampilan Proses & Aplikasi (Applying)</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Peserta didik mampu mempraktikkan keterampilan, memecahkan tantangan situasional, serta berinovasi melalui proyek nyata yang bermakna.</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Kreativitas, Kolaborasi, Komunikasi</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #94a3b8; font-weight: bold;">3. Refleksi & Pembiasaan Karakter (Reflecting)</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Peserta didik membiasakan diri mengevaluasi proses belajarnya, mensyukuri anugerah Tuhan YME, serta menjaga kesehatan mental dan fisik secara konsisten.</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Keimanan & Ketakwaan, Kesehatan, Kewargaan</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'TP':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">TUJUAN PEMBELAJARAN (TP) – DEEP LEARNING</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Fase / Kelas</td><td>: ${phase} / Kelas ${grade}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Semester / TP</td><td>: ${semester} / ${schoolYear}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Materi Pokok</td><td>: ${material}</td></tr>
      </table>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">RUMUSAN TUJUAN PEMBELAJARAN BERBASIS 4 PENGALAMAN BELAJAR</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10.5pt;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th style="padding: 8px; border: 1px solid #94a3b8; width: 10%;">Kode</th>
            <th style="padding: 8px; border: 1px solid #94a3b8; width: 40%;">Rumusan Tujuan Pembelajaran (TP)</th>
            <th style="padding: 8px; border: 1px solid #94a3b8; width: 25%;">Indikator Ketercapaian (IKTP)</th>
            <th style="padding: 8px; border: 1px solid #94a3b8; width: 25%;">Prinsip Deep Learning & Asesmen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #94a3b8; text-align: center; font-weight: bold;">TP.${grade}.1</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">
              <strong>Fase Memahami:</strong> Peserta didik mampu mengidentifikasi dan mendeskripsikan konsep esensial pada materi <em>${material}</em> melalui penyelidikan kontekstual dengan kesadaran penuh.
            </td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Mampu menjelaskan 3 konsep kunci materi dengan bahasa sendiri secara lugas.</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;"><strong>Mindful</strong><br>Asesmen Diagnostik & Tes Lisan Pemahaman</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #94a3b8; text-align: center; font-weight: bold;">TP.${grade}.2</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">
              <strong>Fase Mengaplikasi:</strong> Peserta didik dapat mempraktikkan keterampilan gerak / penyelesaian masalah materi <em>${material}</em> dalam situasi simulasi atau permainan kelompok yang menggembirakan.
            </td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Melakukan prosedur keterampilan dengan teknik benar dan sportif/kolaboratif.</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;"><strong>Meaningful & Joyful</strong><br>Penilaian Kinerja / Praktik Nyata</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #94a3b8; text-align: center; font-weight: bold;">TP.${grade}.3</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">
              <strong>Fase Merefleksi & Mengembangkan:</strong> Peserta didik mampu mengevaluasi kemajuan belajar dirinya, menyusun target perbaikan diri, dan menunjukkan komitmen hidup berkarakter.
            </td>
            <td style="padding: 8px; border: 1px solid #94a3b8;">Mengisi jurnal refleksi diri dan menyusun kartu komitmen perbaikan.</td>
            <td style="padding: 8px; border: 1px solid #94a3b8;"><strong>Reflective Growth</strong><br>Asesmen Formatif Diri & Portofolio</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'ATP':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">ALUR TUJUAN PEMBELAJARAN (ATP)</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Fase / Kelas</td><td>: ${phase} / Kelas ${grade}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Tahun Pelajaran</td><td>: ${schoolYear}</td></tr>
      </table>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">PETA ALUR DAN ALOKASI WAKTU PEMBELAJARAN MENDALAM</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th style="padding: 6px; border: 1px solid #94a3b8;">Alur</th>
            <th style="padding: 6px; border: 1px solid #94a3b8;">Materi / Unit</th>
            <th style="padding: 6px; border: 1px solid #94a3b8;">Tujuan Pembelajaran (TP)</th>
            <th style="padding: 6px; border: 1px solid #94a3b8;">Pengalaman Belajar</th>
            <th style="padding: 6px; border: 1px solid #94a3b8;">JP</th>
            <th style="padding: 6px; border: 1px solid #94a3b8;">Dimensi Profil</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px; text-align: center; font-weight: bold;">1</td>
            <td style="padding: 6px;">Unit 1: ${material} (Fondasi & Kesadaran Diri)</td>
            <td style="padding: 6px;">TP.${grade}.1: Memahami konsep esensial dan manfaat dalam kehidupan.</td>
            <td style="padding: 6px;"><strong>Memahami</strong> melalui eksplorasi & tanya jawab mindful.</td>
            <td style="padding: 6px; text-align: center;">4 JP</td>
            <td style="padding: 6px;">Penalaran Kritis, Kemandirian</td>
          </tr>
          <tr>
            <td style="padding: 6px; text-align: center; font-weight: bold;">2</td>
            <td style="padding: 6px;">Unit 2: ${material} (Aplikasi & Kolaborasi Kelompok)</td>
            <td style="padding: 6px;">TP.${grade}.2: Mempraktikkan keterampilan melalui tantangan nyata.</td>
            <td style="padding: 6px;"><strong>Mengaplikasi</strong> via games kooperatif & demonstrasi.</td>
            <td style="padding: 6px; text-align: center;">6 JP</td>
            <td style="padding: 6px;">Kolaborasi, Kreativitas, Komunikasi</td>
          </tr>
          <tr>
            <td style="padding: 6px; text-align: center; font-weight: bold;">3</td>
            <td style="padding: 6px;">Unit 3: Evaluasi, Refleksi, & Gelar Karya Mandiri</td>
            <td style="padding: 6px;">TP.${grade}.3: Menilai kemajuan pribadi & merancang aksi perbaikan.</td>
            <td style="padding: 6px;"><strong>Merefleksi & Mengembangkan</strong> kapasitas belajar.</td>
            <td style="padding: 6px; text-align: center;">4 JP</td>
            <td style="padding: 6px;">Keimanan, Kesehatan, Kemandirian</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'RPP':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">RENCANA PELAKSANAAN PEMBELAJARAN (RPP) PEMBELAJARAN MENDALAM</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Sekolah</td><td>: ${school.name}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Kelas / Fase</td><td>: Kelas ${grade} / Fase ${phase}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Materi Pokok</td><td>: ${material}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Alokasi Waktu</td><td>: 2 x 35 Menit (1 Pertemuan)</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Guru Pengampu</td><td>: ${teacher.name}</td></tr>
      </table>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">I. TUJUAN PEMBELAJARAN</h3>
      <p style="font-size: 11pt; line-height: 1.6;">
        Melalui pendekatan Pembelajaran Mendalam (Deep Learning), peserta didik mampu memahami esensi materi <strong>${material}</strong>, menerapkan keterampilan dalam aktivitas kolaboratif yang menggembirakan, serta merefleksikan hikmah pembelajaran dalam kehidupan sehari-hari.
      </p>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 16px;">II. PENDEKATAN PEMBELAJARAN MENDALAM</h3>
      <ul style="font-size: 11pt; line-height: 1.6;">
        <li><strong>Prinsip Berkesadaran (Mindful):</strong> Latihan pernapasan 2 menit sebelum mulai belajar untuk menumbuhkan fokus dan kesadaran emosional peserta didik.</li>
        <li><strong>Prinsip Bermakna (Meaningful):</strong> Mengaitkan materi ${material} dengan kebiasaan sehat dan aktivitas di rumah murid.</li>
        <li><strong>Prinsip Menggembirakan (Joyful):</strong> Permainan edukatif interaktif berkelompok yang memicu tawa, semangat sportif, dan antusiasme belajar.</li>
      </ul>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 16px;">III. LANGKAH-LANGKAH PEMBELAJARAN</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 10.5pt;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th style="padding: 8px; width: 25%;">Tahapan</th>
            <th style="padding: 8px; width: 60%;">Deskripsi Kegiatan Guru & Murid</th>
            <th style="padding: 8px; width: 15%;">Waktu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; font-weight: bold;">A. Kegiatan Pendahuluan</td>
            <td style="padding: 8px;">
              1. <em>Orientasi:</em> Guru menyapa murid dengan hangat, doa bersama, cek presensi.<br>
              2. <em>Mindful Moment:</em> Hening sejenak (Stop, Breathe, Feel) untuk menyelaraskan kesiapan hati dan pikiran.<br>
              3. <em>Apersepsi & Motivasi:</em> Menampilkan gambar/video pemantik terkait ${material} dan mengaitkannya dengan kehidupan nyata murid.<br>
              4. <em>Tujuan:</em> Menyampaikan kesepakatan kelas dan capaian yang ingin dicapai bersama.
            </td>
            <td style="padding: 8px; text-align: center;">10 Menit</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">B. Kegiatan Inti<br>(Deep Learning)</td>
            <td style="padding: 8px;">
              <strong>1. Fase Memahami:</strong> Peserta didik mengamati demonstrasi, mendiskusikan konsep esensial materi dalam kelompok kecil, dan mencatat poin-poin utama pada LKPD.<br><br>
              <strong>2. Fase Mengaplikasi:</strong> Peserta didik mempraktikkan keterampilan melalui tantangan berjenjang (game-based practice). Murid saling memberi dukungan dan kerja sama tim yang solid.<br><br>
              <strong>3. Fase Merefleksi:</strong> Peserta didik berkumpul membentuk lingkaran refleksi. Menjawab pertanyaan pemantik: "Apa hal baru yang paling membuatmu senang hari ini?" dan "Bagaimana kamu memperbaiki gerakanmu selanjutnya?"
            </td>
            <td style="padding: 8px; text-align: center;">50 Menit</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">C. Kegiatan Penutup</td>
            <td style="padding: 8px;">
              1. Guru bersama murid menyimpulkan intisari pembelajaran.<br>
              2. Memberikan apresiasi atas usaha terbaik semua anak (positive reinforcement).<br>
              3. Tindak lanjut penguatan di rumah bersama keluarga.<br>
              4. Doa syukur dan salam penutup yang ceria.
            </td>
            <td style="padding: 8px; text-align: center;">10 Menit</td>
          </tr>
        </tbody>
      </table>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 16px;">IV. ASESMEN PEMBELAJARAN</h3>
      <ul style="font-size: 11pt; line-height: 1.6;">
        <li><strong>Asesmen Awal (Diagnostik):</strong> Tanya jawab pemantik kesiapan belajar siswa.</li>
        <li><strong>Asesmen Proses (Formatif):</strong> Lembar observasi keaktifan kolaborasi dan rubrik performa praktik saat kegiatan inti.</li>
        <li><strong>Asesmen Akhir (Sumatif/Reflektif):</strong> Lembar refleksi diri (Joyful Learning Journal) dan tes pemahaman singkat.</li>
      </ul>

      ${signatureHtml}
      `;

    case 'MODUL_AJAR':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 15pt; font-weight: bold; text-decoration: underline; margin-bottom: 8px;">MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)</h2>
      <div style="text-align: center; font-weight: bold; color: #1e3a8a; margin-bottom: 20px;">SEKOLAH DASAR (SD) - KURIKULUM NASIONAL & MERDEKA</div>

      <div style="background-color: #f1f5f9; padding: 12px; border-left: 4px solid #1e3a8a; margin-bottom: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12pt; color: #1e3a8a;">BAGIAN 1: INFORMASI UMUM</h3>
        <table style="width: 100%; border: none; font-size: 10.5pt;">
          <tr><td style="width: 25%; font-weight: bold;">Nama Penyusun</td><td>: ${teacher.name}</td></tr>
          <tr><td style="font-weight: bold;">Satuan Pendidikan</td><td>: ${school.name}</td></tr>
          <tr><td style="font-weight: bold;">Tahun Penyusunan</td><td>: ${schoolYear}</td></tr>
          <tr><td style="font-weight: bold;">Mata Pelajaran</td><td>: ${subject}</td></tr>
          <tr><td style="font-weight: bold;">Fase / Kelas</td><td>: ${phase} / Kelas ${grade}</td></tr>
          <tr><td style="font-weight: bold;">Alokasi Waktu</td><td>: 3 x 35 Menit (3 JP)</td></tr>
          <tr><td style="font-weight: bold;">Kompetensi Awal</td><td>: Peserta didik telah mengenal dasar-dasar materi ${material} dalam kehidupan sehari-hari.</td></tr>
          <tr><td style="font-weight: bold;">Profil Pelajar</td><td>: Penalaran Kritis, Gotong Royong (Kolaborasi), Mandiri, Sehat Bugar.</td></tr>
          <tr><td style="font-weight: bold;">Sarana & Prasarana</td><td>: Ruang kelas/lapangan, media visual, LKPD, alat peraga relevan.</td></tr>
          <tr><td style="font-weight: bold;">Target Peserta Didik</td><td>: Reguler / Tipikal (28-32 Peserta Didik).</td></tr>
        </table>
      </div>

      <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #0284c7; margin-bottom: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12pt; color: #0284c7;">BAGIAN 2: KOMPONEN INTI & DESAIN DEEP LEARNING</h3>
        <p style="font-size: 10.5pt; margin: 4px 0;"><strong>Tujuan Pembelajaran:</strong> Peserta didik dengan sadar dan antusias dapat memahami, mempraktikkan, dan merefleksikan nilai-nilai kebaikan dari materi <em>${material}</em>.</p>
        <p style="font-size: 10.5pt; margin: 4px 0;"><strong>Pemahaman Bermakna (Meaningful):</strong> Materi ini membantu kita menjadi individu yang tangguh, terampil, berempati, dan siap memecahkan persoalan sehari-hari.</p>
        <p style="font-size: 10.5pt; margin: 4px 0;"><strong>Pertanyaan Pemantik:</strong> "Mengapa penting bagi kita menguasai ${material}?", "Bagaimana rasanya ketika kita berhasil bekerja sama dalam tim?"</p>
      </div>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">BAGIAN 3: PENGALAMAN BELAJAR BERTAHAP</h3>
      
      <div style="margin-bottom: 14px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
        <div style="font-weight: bold; color: #1e3a8a;">A. KEGIATAN PENDAHULUAN (15 Menit) - Mindful Awakening</div>
        <p style="font-size: 10.5pt; line-height: 1.5; margin: 4px 0;">
          • Pengkondisian kelas dengan salam ceria, pembacaan doa syukur, dan presensi berkesadaran.<br>
          • <em>Mindful Breathing</em> selama 2 menit: Mengarahkan perhatian murid ke napas masuk dan keluar agar fokus penuh hadir dalam ruangan.<br>
          • Apersepsi hangat menghubungkan materi ${material} dengan pengalaman nyata murid kemarin sore.<br>
          • Penyampaian target capaian dan tantangan seru hari ini.
        </p>
      </div>

      <div style="margin-bottom: 14px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
        <div style="font-weight: bold; color: #0284c7;">B. KEGIATAN INTI (75 Menit) - 3 Fase Pembelajaran Mendalam</div>
        <p style="font-size: 10.5pt; line-height: 1.5; margin: 6px 0;">
          <strong>1. Fase Memahami (25 Menit):</strong><br>
          Peserta didik diajak mengamati demonstrasi langsung atau tayangan visual. Guru memfasilitasi diskusi terbimbing dengan pertanyaan terbuka. Murid berdialog aktif menemukan logika konsep ${material} secara mandiri.
        </p>
        <p style="font-size: 10.5pt; line-height: 1.5; margin: 6px 0;">
          <strong>2. Fase Mengaplikasi (30 Menit):</strong><br>
          Peserta didik dibagi menjadi tim kolaboratif kecil. Mereka melakukan praktik uji coba langsung dan menyelesaikan skenario studi kasus pada LKPD. Guru bertindak sebagai fasilitator yang memberikan scaffolding kepada kelompok yang membutuhkan bantuan.
        </p>
        <p style="font-size: 10.5pt; line-height: 1.5; margin: 6px 0;">
          <strong>3. Fase Merefleksi (20 Menit):</strong><br>
          Masing-masing kelompok berbagi pengalaman hasil praktik. Murid saling memberikan apresiasi 2 Bintang 1 Harapan (peer-feedback). Peserta didik menuliskan hal yang paling ia banggakan dari usahanya hari ini.
        </p>
      </div>

      <div style="margin-bottom: 14px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
        <div style="font-weight: bold; color: #166534;">C. KEGIATAN PENUTUP (15 Menit) - Joyful Closure</div>
        <p style="font-size: 10.5pt; line-height: 1.5; margin: 4px 0;">
          • Murid bersama guru menyusun kesimpulan bersama dalam 3 kata kunci utama.<br>
          • Guru memberikan penguatan positif atas perkembangan sikap mandiri dan kerja sama siswa.<br>
          • Perayaan tepuk tangan apresiasi (Joyful Applause) untuk seluruh kelas.<br>
          • Doa penutup dan salam keberkahan.
        </p>
      </div>

      <h3 style="font-size: 12pt; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 18px;">BAGIAN 4: ASESMEN & RUBRIK KETERCAPAIAN (KKTP)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 10pt;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th style="padding: 6px; width: 25%;">Kriteria Penilaian</th>
            <th style="padding: 6px; width: 25%;">Perlu Bimbingan (0-69)</th>
            <th style="padding: 6px; width: 25%;">Cukup / Baik (70-84)</th>
            <th style="padding: 6px; width: 25%;">Sangat Baik (85-100)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px; font-weight: bold;">Pemahaman Konsep</td>
            <td style="padding: 6px;">Belum mampu menjelaskan konsep materi ${material}.</td>
            <td style="padding: 6px;">Mampu menjelaskan konsep inti dengan bantuan pemantik guru.</td>
            <td style="padding: 6px;">Mampu menjelaskan konsep secara mandiri dan memberi contoh nyata.</td>
          </tr>
          <tr>
            <td style="padding: 6px; font-weight: bold;">Keterampilan Praktik</td>
            <td style="padding: 6px;">Perlu bimbingan penuh saat mempraktikkan gerakan/tugas.</td>
            <td style="padding: 6px;">Mempraktikkan tugas dengan tepat dan terkoordinasi.</td>
            <td style="padding: 6px;">Mempraktikkan tugas dengan sangat luwes, kreatif, dan membantu teman.</td>
          </tr>
          <tr>
            <td style="padding: 6px; font-weight: bold;">Refleksi & Karakter</td>
            <td style="padding: 6px;">Pasif dalam sesi refleksi bersama.</td>
            <td style="padding: 6px;">Mampu mengidentifikasi perasaan dan kelebihan diri.</td>
            <td style="padding: 6px;">Mampu merefleksikan proses belajar serta menyusun target perbaikan diri.</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'PROTA':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">PROGRAM TAHUNAN (PROTA) DEEP LEARNING</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Satuan Pendidikan</td><td>: ${school.name}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Fase / Kelas</td><td>: ${phase} / Kelas ${grade}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Tahun Pelajaran</td><td>: ${schoolYear}</td></tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; font-size: 10pt;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th style="padding: 6px; width: 10%;">Semester</th>
            <th style="padding: 6px; width: 15%;">Unit / Bab</th>
            <th style="padding: 6px; width: 45%;">Tujuan Pembelajaran (TP)</th>
            <th style="padding: 6px; width: 15%;">Alokasi Waktu</th>
            <th style="padding: 6px; width: 15%;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px; text-align: center; font-weight: bold;" rowspan="3">1 (Ganjil)</td>
            <td style="padding: 6px;">Unit 1: ${material} Bagian 1</td>
            <td style="padding: 6px;">Memahami pola esensial dan keterampilan fondasi dengan mindful.</td>
            <td style="padding: 6px; text-align: center;">12 JP</td>
            <td style="padding: 6px;">Tuntas Formatif</td>
          </tr>
          <tr>
            <td style="padding: 6px;">Unit 2: ${material} Aplikasi Kontekstual</td>
            <td style="padding: 6px;">Menerapkan kolaborasi tim dan kreasi penyelesaian masalah.</td>
            <td style="padding: 6px; text-align: center;">15 JP</td>
            <td style="padding: 6px;">Proyek Bermakna</td>
          </tr>
          <tr>
            <td style="padding: 6px;">Asesmen Sumatif Semester 1</td>
            <td style="padding: 6px;">Pengukuran capaian pemahaman dan refleksi perkembangan diri.</td>
            <td style="padding: 6px; text-align: center;">5 JP</td>
            <td style="padding: 6px;">Gelar Karya Refleksi</td>
          </tr>
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <td colspan="3" style="padding: 6px; text-align: right;">Total Jam Pelajaran Semester 1 :</td>
            <td style="padding: 6px; text-align: center;">32 JP</td>
            <td></td>
          </tr>
          <tr>
            <td style="padding: 6px; text-align: center; font-weight: bold;" rowspan="3">2 (Genap)</td>
            <td style="padding: 6px;">Unit 3: Pendalaman & Inovasi Berkelanjutan</td>
            <td style="padding: 6px;">Mengembangkan variasi gerak/materi dengan penalaran kritis.</td>
            <td style="padding: 6px; text-align: center;">14 JP</td>
            <td style="padding: 6px;">Tuntas Formatif</td>
          </tr>
          <tr>
            <td style="padding: 6px;">Unit 4: Proyek Kolaborasi Warga Sekolah</td>
            <td style="padding: 6px;">Mewujudkan pembiasaan positif di lingkungan rumah dan sekolah.</td>
            <td style="padding: 6px; text-align: center;">14 JP</td>
            <td style="padding: 6px;">Aksi Nyata</td>
          </tr>
          <tr>
            <td style="padding: 6px;">Asesmen Akhir Fase / Semester 2</td>
            <td style="padding: 6px;">Evaluasi komprehensif profil lulusan dan portofolio karya.</td>
            <td style="padding: 6px; text-align: center;">4 JP</td>
            <td style="padding: 6px;">Uji Keterampilan</td>
          </tr>
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <td colspan="3" style="padding: 6px; text-align: right;">Total Jam Pelajaran Semester 2 :</td>
            <td style="padding: 6px; text-align: center;">32 JP</td>
            <td></td>
          </tr>
          <tr style="background-color: #e2e8f0; font-weight: bold;">
            <td colspan="3" style="padding: 8px; text-align: right;">TOTAL ALOKASI WAKTU TAHUN PELAJARAN :</td>
            <td style="padding: 8px; text-align: center; color: #1e3a8a;">64 JP</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'PROMES':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">PROGRAM SEMESTER (PROMES) – SEMESTER ${semester.toUpperCase()}</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Kelas / Fase</td><td>: Kelas ${grade} / Fase ${phase}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Tahun Pelajaran</td><td>: ${schoolYear}</td></tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; font-size: 9pt; text-align: center;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th rowspan="2" style="padding: 6px; width: 5%;">No</th>
            <th rowspan="2" style="padding: 6px; width: 35%;">Materi Pembelajaran & TP</th>
            <th rowspan="2" style="padding: 6px; width: 6%;">JP</th>
            <th colspan="4" style="padding: 4px;">Juli</th>
            <th colspan="4" style="padding: 4px;">Agustus</th>
            <th colspan="4" style="padding: 4px;">September</th>
            <th colspan="4" style="padding: 4px;">Oktober</th>
            <th colspan="4" style="padding: 4px;">November</th>
            <th colspan="4" style="padding: 4px;">Desember</th>
          </tr>
          <tr style="background-color: #3b82f6; color: white;">
            <th>1</th><th>2</th><th>3</th><th>4</th>
            <th>1</th><th>2</th><th>3</th><th>4</th>
            <th>1</th><th>2</th><th>3</th><th>4</th>
            <th>1</th><th>2</th><th>3</th><th>4</th>
            <th>1</th><th>2</th><th>3</th><th>4</th>
            <th>1</th><th>2</th><th>3</th><th>4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td style="text-align: left; padding: 6px;">${material} (Pemahaman Konsep Mindful)</td>
            <td>6</td>
            <td style="background-color: #dbeafe;">3</td><td style="background-color: #dbeafe;">3</td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td>2</td>
            <td style="text-align: left; padding: 6px;">${material} (Praktik Kolaboratif Joyful)</td>
            <td>8</td>
            <td></td><td></td><td style="background-color: #dbeafe;">4</td><td style="background-color: #dbeafe;">4</td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td>3</td>
            <td style="text-align: left; padding: 6px;">Penguatan Karakter & Aksi Nyata</td>
            <td>6</td>
            <td></td><td></td><td></td><td></td>
            <td style="background-color: #dbeafe;">3</td><td style="background-color: #dbeafe;">3</td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td>4</td>
            <td style="text-align: left; padding: 6px;">Asesmen Tengah Semester & Refleksi</td>
            <td>4</td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td style="background-color: #fef08a;">2</td><td style="background-color: #fef08a;">2</td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td>5</td>
            <td style="text-align: left; padding: 6px;">Asesmen Sumatif Akhir Semester</td>
            <td>4</td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td>
            <td style="background-color: #fca5a5;">2</td><td style="background-color: #fca5a5;">2</td><td>R</td><td>L</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'LKPD':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
      <div style="text-align: center; font-weight: bold; color: #1e3a8a; margin-bottom: 16px;">AKTIVITAS BELAJAR MENDALAM: MINDFUL, MEANINGFUL & JOYFUL</div>

      <div style="border: 2px dashed #3b82f6; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <table style="width: 100%; border: none; font-size: 11pt;">
          <tr><td style="width: 25%; font-weight: bold;">Nama Peserta Didik</td><td>: ............................................................................</td></tr>
          <tr><td style="font-weight: bold;">Nomor Absen / Kelas</td><td>: ........... / Kelas ${grade}</td></tr>
          <tr><td style="font-weight: bold;">Mata Pelajaran</td><td>: ${subject}</td></tr>
          <tr><td style="font-weight: bold;">Materi / Topik</td><td>: <strong>${material}</strong></td></tr>
        </table>
      </div>

      <div style="margin-bottom: 14px;">
        <h3 style="font-size: 11.5pt; color: #1e3a8a; margin: 0 0 6px 0;">🎯 TUJUAN KEGIATAN:</h3>
        <p style="font-size: 10.5pt; margin: 0;">Anak-anak hebat, hari ini kita akan menjelajahi materi <strong>${material}</strong> dengan gembira, belajar bekerja sama dengan teman, dan menemukan manfaat sehatnya untuk tubuh kita!</p>
      </div>

      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px; margin-bottom: 14px;">
        <h4 style="margin: 0 0 6px 0; font-size: 11pt; color: #1d4ed8;">1. AKTIVITAS MEMAHAMI (Mindful Observation)</h4>
        <p style="font-size: 10pt; margin: 0 0 8px 0;">Amatilah gambar peragaan yang ditunjukkan bapak/ibu guru. Tuliskan 3 hal menarik yang kamu amati:</p>
        <div style="border-bottom: 1px dotted #64748b; height: 24px; margin-bottom: 6px;">1. .................................................................................................................................</div>
        <div style="border-bottom: 1px dotted #64748b; height: 24px; margin-bottom: 6px;">2. .................................................................................................................................</div>
        <div style="border-bottom: 1px dotted #64748b; height: 24px;">3. .................................................................................................................................</div>
      </div>

      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px; margin-bottom: 14px;">
        <h4 style="margin: 0 0 6px 0; font-size: 11pt; color: #15803d;">2. AKTIVITAS MENGAPLIKASI (Joyful Challenge Bersama Tim)</h4>
        <p style="font-size: 10pt; margin: 0 0 8px 0;">Lakukan praktik bersama kelompokmu. Catat hasil kerja sama kelompok pada tabel di bawah ini:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 10pt; background-color: white;" border="1">
          <thead>
            <tr style="background-color: #22c55e; color: white;">
              <th style="padding: 6px;">Tantangan Gerak / Praktik</th>
              <th style="padding: 6px;">Status Percobaan (Berhasil / Coba Lagi)</th>
              <th style="padding: 6px;">Kerja Sama Tim</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px;">Tantangan 1: Gerak Dasar & Keseimbangan</td>
              <td style="padding: 8px; text-align: center;">[ &nbsp; ] Berhasil &nbsp;&nbsp; [ &nbsp; ] Coba Lagi</td>
              <td style="padding: 8px;">⭐⭐⭐⭐⭐</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Tantangan 2: Rangkaian Gerak Kolaboratif</td>
              <td style="padding: 8px; text-align: center;">[ &nbsp; ] Berhasil &nbsp;&nbsp; [ &nbsp; ] Coba Lagi</td>
              <td style="padding: 8px;">⭐⭐⭐⭐⭐</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
        <h4 style="margin: 0 0 6px 0; font-size: 11pt; color: #b45309;">3. AKTIVITAS MEREFLEKSI (Pojok Refleksi Hatiku)</h4>
        <p style="font-size: 10pt; margin: 0 0 6px 0;">Lingkari emotikon yang menggambarkan perasaanmu setelah belajar hari ini:</p>
        <div style="font-size: 20pt; text-align: center; margin: 6px 0;">
          😃 Sangat Senang &nbsp;&nbsp;&nbsp;&nbsp; 🙂 Senang &nbsp;&nbsp;&nbsp;&nbsp; 🤔 Perlu Berlatih Lagi
        </div>
        <p style="font-size: 10pt; margin: 6px 0 0 0;">Apa komitmen kebaikanmu untuk menjaga kesehatan dan membantu teman besok?</p>
        <div style="border-bottom: 1px dotted #64748b; height: 26px;">..................................................................................................................................................</div>
      </div>

      <div style="text-align: right; margin-top: 20px;">
        <table style="width: 40%; margin-left: auto; border-collapse: collapse; font-size: 10pt;" border="1">
          <tr style="background-color: #f1f5f9;"><th style="padding: 6px;">Nilai / Paraf Guru</th><th style="padding: 6px;">Catatan Semangat</th></tr>
          <tr><td style="height: 50px;"></td><td></td></tr>
        </table>
      </div>
      `;

    case 'JURNAL':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">JURNAL HARIAN GURU PEMBELAJARAN MENDALAM</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Nama Guru</td><td>: ${teacher.name}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Satuan Pendidikan</td><td>: ${school.name}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Kelas / Fase</td><td>: Kelas ${grade} / Fase ${phase}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Tahun Pelajaran</td><td>: ${schoolYear}</td></tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th style="padding: 6px; width: 12%;">Hari / Tanggal</th>
            <th style="padding: 6px; width: 15%;">Materi & TP</th>
            <th style="padding: 6px; width: 35%;">Aktivitas Deep Learning (Memahami, Mengaplikasi, Merefleksi)</th>
            <th style="padding: 6px; width: 10%;">Absensi</th>
            <th style="padding: 6px; width: 18%;">Refleksi Guru & Tindak Lanjut</th>
            <th style="padding: 6px; width: 10%;">Paraf</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px;">Senin, 03 Agustus 2026</td>
            <td style="padding: 6px;"><strong>${material}</strong><br>TP.${grade}.1</td>
            <td style="padding: 6px;">
              • Memahami: Mengamati peragaan dan diskusi mindful.<br>
              • Mengaplikasi: Praktik formasi kelompok kecil secara joyful.<br>
              • Merefleksi: Menulis kartu komitmen sehat.
            </td>
            <td style="padding: 6px; text-align: center;">H: 28<br>S: 1<br>I: 0<br>A: 0</td>
            <td style="padding: 6px;">Pembelajaran sangat kondusif dan antusias. 2 siswa perlu penguatan koordinasi tubuh pada pertemuan berikutnya.</td>
            <td style="padding: 6px; text-align: center;">✓</td>
          </tr>
          <tr>
            <td style="padding: 6px;">Senin, 10 Agustus 2026</td>
            <td style="padding: 6px;"><strong>${material}</strong><br>TP.${grade}.2</td>
            <td style="padding: 6px;">
              • Memahami: Analisis kesalahan gerak bersama.<br>
              • Mengaplikasi: Turnamen mini kooperatif.<br>
              • Merefleksi: Umpan balik teman sebaya (peer-feedback).
            </td>
            <td style="padding: 6px; text-align: center;">H: 29<br>S: 0<br>I: 0<br>A: 0</td>
            <td style="padding: 6px;">Seluruh siswa menunjukkan karakter gotong royong dan sportivitas yang tinggi.</td>
            <td style="padding: 6px; text-align: center;">✓</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'HADIR':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">DAFTAR HADIR PESERTA DIDIK</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Kelas / Semester</td><td>: Kelas ${grade} / Semester ${semester}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Tahun Pelajaran</td><td>: ${schoolYear}</td></tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; font-size: 9pt; text-align: center;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th rowspan="2" style="padding: 4px; width: 4%;">No</th>
            <th rowspan="2" style="padding: 4px; width: 12%;">NISN</th>
            <th rowspan="2" style="padding: 4px; width: 30%;">Nama Peserta Didik</th>
            <th rowspan="2" style="padding: 4px; width: 5%;">L/P</th>
            <th colspan="10" style="padding: 4px;">Pertemuan / Tanggal</th>
            <th colspan="4" style="padding: 4px;">Rekapitulasi</th>
            <th rowspan="2" style="padding: 4px; width: 7%;">%</th>
          </tr>
          <tr style="background-color: #3b82f6; color: white;">
            <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
            <th>H</th><th>S</th><th>I</th><th>A</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td><td>0123456781</td><td style="text-align: left; padding-left: 6px;">Ahmad Fauzi Pratama</td><td>L</td>
            <td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td>
            <td>10</td><td>0</td><td>0</td><td>0</td><td style="font-weight: bold;">100%</td>
          </tr>
          <tr>
            <td>2</td><td>0123456782</td><td style="text-align: left; padding-left: 6px;">Aisyah Nur Rahmawati</td><td>P</td>
            <td>H</td><td>H</td><td>S</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td>
            <td>9</td><td>1</td><td>0</td><td>0</td><td style="font-weight: bold;">90%</td>
          </tr>
          <tr>
            <td>3</td><td>0123456783</td><td style="text-align: left; padding-left: 6px;">Bagas Dwi Saputra</td><td>L</td>
            <td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td>
            <td>10</td><td>0</td><td>0</td><td>0</td><td style="font-weight: bold;">100%</td>
          </tr>
          <tr>
            <td>4</td><td>0123456784</td><td style="text-align: left; padding-left: 6px;">Cantika Dewi Lestari</td><td>P</td>
            <td>H</td><td>H</td><td>H</td><td>H</td><td>I</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td>
            <td>9</td><td>0</td><td>1</td><td>0</td><td style="font-weight: bold;">90%</td>
          </tr>
          <tr>
            <td>5</td><td>0123456785</td><td style="text-align: left; padding-left: 6px;">Dimas Arya Nugroho</td><td>L</td>
            <td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td><td>H</td>
            <td>10</td><td>0</td><td>0</td><td>0</td><td style="font-weight: bold;">100%</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'NILAI':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">DAFTAR NILAI ASESMEN PEMBELAJARAN MENDALAM</h2>
      
      <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse; font-size: 11pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3px 0;">Mata Pelajaran</td><td>: ${subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Kelas / Fase</td><td>: Kelas ${grade} / Fase ${phase}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Semester / TP</td><td>: ${semester} / ${schoolYear}</td></tr>
        <tr><td style="font-weight: bold; padding: 3px 0;">Materi Acuan</td><td>: ${material}</td></tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; font-size: 9pt; text-align: center;" border="1">
        <thead>
          <tr style="background-color: #1e3a8a; color: white;">
            <th rowspan="2" style="padding: 4px; width: 4%;">No</th>
            <th rowspan="2" style="padding: 4px; width: 25%;">Nama Peserta Didik</th>
            <th colspan="2" style="padding: 4px;">Formatif (TP.1)</th>
            <th colspan="2" style="padding: 4px;">Praktik (TP.2)</th>
            <th colspan="2" style="padding: 4px;">Sumatif Lingkup</th>
            <th rowspan="2" style="padding: 4px; width: 8%;">Nilai Akhir</th>
            <th rowspan="2" style="padding: 4px; width: 25%;">Deskripsi Ketercapaian TP</th>
          </tr>
          <tr style="background-color: #3b82f6; color: white;">
            <th>Tugas</th><th>Refleksi</th>
            <th>Unjuk Kerja</th><th>Proyek</th>
            <th>Tes Tulis</th><th>Gelar Karya</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td style="text-align: left; padding-left: 6px; font-weight: bold;">Ahmad Fauzi Pratama</td>
            <td>88</td><td>90</td><td>92</td><td>88</td><td>86</td><td>90</td>
            <td style="font-weight: bold; color: #1e3a8a;">89.0</td>
            <td style="text-align: left; padding: 4px 6px;">Sangat mahir memahami konsep dan sangat terampil dalam mempraktikkan gerakan secara mandiri.</td>
          </tr>
          <tr>
            <td>2</td>
            <td style="text-align: left; padding-left: 6px; font-weight: bold;">Aisyah Nur Rahmawati</td>
            <td>85</td><td>86</td><td>88</td><td>85</td><td>84</td><td>87</td>
            <td style="font-weight: bold; color: #1e3a8a;">85.8</td>
            <td style="text-align: left; padding: 4px 6px;">Menunjukkan penguasaan materi yang baik, kolaboratif, dan reflektif dalam kegiatan tim.</td>
          </tr>
          <tr>
            <td>3</td>
            <td style="text-align: left; padding-left: 6px; font-weight: bold;">Bagas Dwi Saputra</td>
            <td>82</td><td>84</td><td>85</td><td>82</td><td>80</td><td>84</td>
            <td style="font-weight: bold; color: #1e3a8a;">82.8</td>
            <td style="text-align: left; padding: 4px 6px;">Mencapai kriteria dengan baik pada praktik fisik, perlu sedikit peningkatan ketelitian pemahaman konsep.</td>
          </tr>
          <tr>
            <td>4</td>
            <td style="text-align: left; padding-left: 6px; font-weight: bold;">Cantika Dewi Lestari</td>
            <td>90</td><td>92</td><td>94</td><td>92</td><td>90</td><td>92</td>
            <td style="font-weight: bold; color: #1e3a8a;">91.7</td>
            <td style="text-align: left; padding: 4px 6px;">Sangat istimewa dalam kepemimpinan kelompok, kreativitas gerak, dan kesadaran refleksi.</td>
          </tr>
          <tr>
            <td>5</td>
            <td style="text-align: left; padding-left: 6px; font-weight: bold;">Dimas Arya Nugroho</td>
            <td>80</td><td>80</td><td>82</td><td>80</td><td>78</td><td>82</td>
            <td style="font-weight: bold; color: #1e3a8a;">80.3</td>
            <td style="text-align: left; padding: 4px 6px;">Tuntas mencapai seluruh indikator TP dengan sikap sportif dan semangat kebersamaan.</td>
          </tr>
        </tbody>
      </table>

      ${signatureHtml}
      `;

    default:
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold;">DOKUMEN ADMINISTRASI PEMBELAJARAN MENDALAM</h2>
      <p>Mata Pelajaran: ${subject} | Kelas: ${grade} | Fase: ${phase}</p>
      <p>Materi: ${material}</p>
      ${signatureHtml}
      `;
  }
}
