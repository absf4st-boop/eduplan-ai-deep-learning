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

export function generateCurriculumFallback(
  params: any,
  schoolProfile?: any,
  teacherProfile?: any
): string {
  const documentType = params.type || params.documentType || 'MODUL_AJAR';
  const subject = params.subject || 'PJOK';
  const grade = params.grade || '5';
  const phase = params.phase || 'Fase C';
  const semester = params.semester || '1 (Ganjil)';
  const schoolYear = params.academicYear || params.schoolYear || '2026/2027';
  const material = params.topic || params.material || 'Aktivitas Kebugaran Jasmani dan Pola Hidup Sehat';

  const teacher = teacherProfile || params.teacher || {
    name: 'Husein Apriyanto',
    fullName: 'Husein Apriyanto',
    nip: '19900815 201802 1 001',
  };

  const school = schoolProfile || params.school || {
    name: 'SDN Kasepuhan 04',
    schoolName: 'SDN Kasepuhan 04',
    principalName: 'Drs. H. Sugiyanto, M.Pd.',
    principalNip: '19750312 199903 1 002',
    address: 'Jl. Raya Kasepuhan No. 4, Jawa Tengah',
    npsn: '20301928',
  };

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
        </tbody>
      </table>

      ${signatureHtml}
      `;

    case 'PROMES':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">PROGRAM SEMESTER (PROMES)</h2>
      <p style="text-align: center;">Mata Pelajaran: ${subject} | Kelas: ${grade} | Semester: ${semester} | Tahun: ${schoolYear}</p>
      ${signatureHtml}
      `;

    case 'LKPD':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
      <p style="text-align: center;">Mata Pelajaran: ${subject} | Kelas: ${grade} | Topik: ${material}</p>
      ${signatureHtml}
      `;

    case 'JURNAL':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">JURNAL HARIAN GURU PEMBELAJARAN MENDALAM</h2>
      <p style="text-align: center;">Mata Pelajaran: ${subject} | Kelas: ${grade} | Materi: ${material}</p>
      ${signatureHtml}
      `;

    case 'HADIR':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">DAFTAR HADIR PESERTA DIDIK</h2>
      <p style="text-align: center;">Mata Pelajaran: ${subject} | Kelas: ${grade} | Semester: ${semester}</p>
      ${signatureHtml}
      `;

    case 'NILAI':
      return `
      ${headerHtml}
      <h2 style="text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">DAFTAR NILAI ASESMEN PEMBELAJARAN MENDALAM</h2>
      <p style="text-align: center;">Mata Pelajaran: ${subject} | Kelas: ${grade} | Materi: ${material}</p>
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
