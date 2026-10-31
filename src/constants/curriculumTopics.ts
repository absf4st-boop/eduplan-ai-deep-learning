/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Kurikulum Merdeka SD - Database Topik & Materi Pembelajaran Pokok
 * Mencakup 10 Mata Pelajaran Resmi untuk Kelas 1 - 6 (Fase A, B, C)
 * Dilengkapi prinsip Pembelajaran Mendalam (Mindful, Meaningful, Joyful)
 */

export interface TopicItem {
  id: string;
  title: string;
  description: string;
  tag: 'Mindful' | 'Meaningful' | 'Joyful' | 'Eksplorasi';
  duration?: string;
}

export const SD_CURRICULUM_TOPICS: Record<
  string, // Subject
  Record<
    string, // Grade '1' | '2' | '3' | '4' | '5' | '6'
    Record<
      string, // Semester '1' | '2'
      TopicItem[]
    >
  >
> = {
  'PJOK': {
    '1': {
      '1': [
        { id: 'pjok-1-1-1', title: 'Pola Gerak Dasar Lokomotor: Jalan, Lari, dan Lompat Menyenangkan', description: 'Melatih koordinasi tubuh dan kelincahan melalui permainan tradisional', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-1-1-2', title: 'Pola Gerak Dasar Nonlokomotor: Membungkuk, Meliuk, dan Mengayun', description: 'Meningkatkan kelenturan dan kesadaran postur tubuh yang baik', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-1-1-3', title: 'Mengenal Anggota Tubuh & Kebersihan Diri Sehari-hari', description: 'Kebiasaan mencuci tangan, menyikat gigi, dan menjaga kerapian', tag: 'Meaningful', duration: '2 JP' },
      ],
      '2': [
        { id: 'pjok-1-2-1', title: 'Pola Gerak Manipulatif: Melempar dan Menangkap Bola Kecil', description: 'Koordinasi mata dan tangan dengan game berpasangan gembira', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-1-2-2', title: 'Senam Irama Anak: Gerak Berirama Mengikuti Musik Ceria', description: 'Melatih kepekaan ritme, kelenturan, dan kebersamaan', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-1-2-3', title: 'Pengenalan Aktivitas Air dan Keselamatan di Kolam Dangkal', description: 'Percaya diri dan kewaspadaan dasar di lingkungan air', tag: 'Mindful', duration: '3 JP' },
      ],
    },
    '2': {
      '1': [
        { id: 'pjok-2-1-1', title: 'Variasi Gerak Dasar Lokomotor dalam Permainan Sederhana', description: 'Lari zig-zag, melompati rintangan rendah dengan sportif', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-2-1-2', title: 'Gerak Keseimbangan Statis dan Dinamis (Senam Ketangkasan)', description: 'Sikap lilin sederhana, berjalan di atas garis lurus', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-2-1-3', title: 'Makanan Bergizi Seimbang dan Minum Air Putih Cukup', description: 'Memilih camilan sehat dan memahami kebutuhan hidrasi anak', tag: 'Meaningful', duration: '2 JP' },
      ],
      '2': [
        { id: 'pjok-2-2-1', title: 'Gerak Manipulatif Menendang dan Menggiring Bola', description: 'Latihan dasar sepak bola ceria dan kerja sama tim', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-2-2-2', title: 'Aktivitas Senam Lantai: Berguling Menyamping dan Melompat', description: 'Keberanian, keseimbangan, dan pendaratan yang aman', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-2-2-3', title: 'Menjaga Kebersihan Lingkungan Sekolah dan Rumah', description: 'Aktivitas fisik bersih-bersih lingkungan secara aktif', tag: 'Meaningful', duration: '2 JP' },
      ],
    },
    '3': {
      '1': [
        { id: 'pjok-3-1-1', title: 'Kombinasi Pola Gerak Dasar Lokomotor & Manipulatif Permainan Bola Besar', description: 'Mengoper dan menangkap bola basket/voli modifikasi', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-3-1-2', title: 'Latihan Kebugaran Jasmani: Daya Tahan Otot dan Kelincahan', description: 'Sirkuit training anak SD yang seru dan menantang', tag: 'Meaningful', duration: '3 JP' },
        { id: 'pjok-3-1-3', title: 'Istirahat Cukup dan Pola Tidur untuk Pertumbuhan', description: 'Refleksi kebiasaan tidur dan pemulihan energi tubuh', tag: 'Mindful', duration: '2 JP' },
      ],
      '2': [
        { id: 'pjok-3-2-1', title: 'Gerak Kombinasi Senam Lantai: Guling Depan Berbantuan Matras', description: 'Teknik awalan, tolakan, putaran, dan sikap akhir berkesadaran', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-3-2-2', title: 'Permainan Tradisional Gobak Sodor dan Kasti Mini', description: 'Menumbuhkan kekompakan, strategi, dan sportivitas', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-3-2-3', title: 'Mengenal Bahaya Penyakit Menular dan Pencegahannya', description: 'Perilaku hidup bersih sehat (PHBS) di sekolah', tag: 'Meaningful', duration: '2 JP' },
      ],
    },
    '4': {
      '1': [
        { id: 'pjok-4-1-1', title: 'Variasi dan Kombinasi Gerak Dasar Permainan Sepak Bola', description: 'Passing kaki bagian dalam, dribbling, dan shooting mini', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-4-1-2', title: 'Variasi Gerak Dasar Permainan Bola Voli (Passing Bawah)', description: 'Posisi lutut, ayunan lengan, dan kontak bola stabil', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-4-1-3', title: 'Kebugaran Jasmani: Lari Bolak-Balik (Shuttle Run) & Push Up Modifikasi', description: 'Mengukur peningkatan stamina dan kekuatan otot', tag: 'Meaningful', duration: '3 JP' },
      ],
      '2': [
        { id: 'pjok-4-2-1', title: 'Kombinasi Senam Lantai Guling Lenting dan Sikap Lilin', description: 'Penguasaan koordinasi gerak tubuh lentik dan aman', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-4-2-2', title: 'Gerak Berirama Kombinasi Langkah Kaki dan Ayunan Lengan', description: 'Koreografi senam SKJ atau kreasi musik nusantara', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-4-2-3', title: 'Pertolongan Pertama pada Cedera Ringan (P3K Anak)', description: 'Penanganan memar, lecet, dan kram saat berolahraga', tag: 'Meaningful', duration: '2 JP' },
      ],
    },
    '5': {
      '1': [
        { id: 'pjok-5-1-1', title: 'Kombinasi Pola Gerak Dasar Lokomotor, Nonlokomotor, dan Manipulatif Bola Besar', description: 'Strategi menyerang dan bertahan permainan bola basket/voli', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-5-1-2', title: 'Kombinasi Gerak Dasar Atletik: Lari Cepat dan Lompat Jauh Gaya Jongkok', description: 'Akselerasi, tumpuan balok, melayang di udara, dan pendaratan', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-5-1-3', title: 'Pengukuran Tingkat Kebugaran Jasmani Siswa (TKJI/Tes Sederhana)', description: 'Menghitung denyut nadi istirahat dan denyut nadi latihan', tag: 'Meaningful', duration: '3 JP' },
        { id: 'pjok-5-1-4', title: 'Aktivitas Kebugaran Jasmani dan Pola Hidup Sehat Berkelanjutan', description: 'Mendesain rencana kebugaran mandiri siswa SD', tag: 'Mindful', duration: '3 JP' },
      ],
      '2': [
        { id: 'pjok-5-2-1', title: 'Kombinasi Gerak Senam Ketangkasan Menggunakan Alat (Peti Lompat/Kuda-kuda)', description: 'Tolakan dua kaki, melompat, dan mendarat sempurna', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-5-2-2', title: 'Kombinasi Gerak Berirama Berbasis Budaya Nusantara', description: 'Rangkaian senam irama dengan musik daerah', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-5-2-3', title: 'Renang Gaya Dada: Gerakan Tungkai, Lengan, dan Pernapasan Efisien', description: 'Ketahanan mengapung dan efisiensi kayuhan air', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-5-2-4', title: 'Pencegahan Bahaya Merokok, Miras, dan Pengenalan Pubertas', description: 'Kesehatan reproduksi remaja awal dan batasan pergaulan', tag: 'Meaningful', duration: '2 JP' },
      ],
    },
    '6': {
      '1': [
        { id: 'pjok-6-1-1', title: 'Penerapan Taktik dan Kerjasama dalam Permainan Bola Kecil (Rounders/Kasti)', description: 'Memukul bola melambung, melempar tepat, dan lari pos', tag: 'Joyful', duration: '3 JP' },
        { id: 'pjok-6-1-2', title: 'Kombinasi Gerak Bela Diri Pencak Silat: Kuda-kuda, Pukulan, dan Tangkisan', description: 'Menjunjung etika kesatria, kontrol emosi, dan disiplin', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-6-1-3', title: 'Peningkatan Komponen Kebugaran Jasmani Berkala', description: 'Latihan kelenturan sendi, kecepatan reaksi, dan daya ledak', tag: 'Meaningful', duration: '3 JP' },
      ],
      '2': [
        { id: 'pjok-6-2-1', title: 'Rangkaian Senam Lantai Kompleks: Guling Depan, Guling Belakang, dan Meroda', description: 'Konsistensi gerak estetik dan keselamatan tinggi', tag: 'Mindful', duration: '3 JP' },
        { id: 'pjok-6-2-2', title: 'Penyusunan Rencana Aktivitas Fisik Sehat Keluarga', description: 'Proyek keterlibatan keluarga dalam olahraga akhir pekan', tag: 'Meaningful', duration: '2 JP' },
        { id: 'pjok-6-2-3', title: 'Edukasi Dampak Sedentary Lifestyle (Kecanduan Gawai) bagi Fisik', description: 'Manajemen waktu layar (screen time) dan postur ergonomis', tag: 'Mindful', duration: '2 JP' },
      ],
    },
  },

  'MATEMATIKA': {
    '1': {
      '1': [
        { id: 'mat-1-1-1', title: 'Bilangan 1 sampai 10: Menghitung, Menulis, dan Membandingkan Benda', description: 'Konsep jumlah konkrit menggunakan benda di sekitar kelas', tag: 'Mindful', duration: '4 JP' },
        { id: 'mat-1-1-2', title: 'Penjumlahan sampai dengan 10: Menggabungkan Dua Kumpulan Objek', description: 'Simbol tambah (+) dan sama dengan (=) melalui cerita bergambar', tag: 'Joyful', duration: '4 JP' },
        { id: 'mat-1-1-3', title: 'Mengenal Bangun Datar: Segitiga, Segi Empat, dan Lingkaran', description: 'Menemukan bentuk benda di kelas dan membuat kreasi kolase', tag: 'Joyful', duration: '3 JP' },
      ],
      '2': [
        { id: 'mat-1-2-1', title: 'Pengurangan sampai dengan 10: Mengambil dan Memisahkan Benda', description: 'Memahami konsep berkurang dengan kelereng atau balok warna', tag: 'Meaningful', duration: '4 JP' },
        { id: 'mat-1-2-2', title: 'Mengenal Bilangan 11 sampai 20 dan Nilai Tempat Puluhan-Satuan', description: 'Mengelompokkan 1 ikat puluhan dan sisa satuan', tag: 'Mindful', duration: '4 JP' },
        { id: 'mat-1-2-3', title: 'Pengukuran Panjang dan Berat Tidak Baku', description: 'Mengukur meja dengan jengkal tangan dan membandingkan berat benda', tag: 'Meaningful', duration: '3 JP' },
      ],
    },
    '2': {
      '1': [
        { id: 'mat-2-1-1', title: 'Bilangan Cacah sampai 100: Membaca, Menulis, dan Nilai Tempat', description: 'Ratusan, puluhan, dan satuan dengan blok Dienes / sedotan', tag: 'Mindful', duration: '4 JP' },
        { id: 'mat-2-1-2', title: 'Penjumlahan dan Pengurangan Bersusun sampai 100', description: 'Menyelesaikan soal cerita kontekstual belanja di kantin', tag: 'Meaningful', duration: '4 JP' },
        { id: 'mat-2-1-3', title: 'Mengenal Jam dan Durasi Waktu Sehari-hari', description: 'Membaca jam analog (pukul tepat dan setengah) kegiatan sekolah', tag: 'Meaningful', duration: '3 JP' },
      ],
      '2': [
        { id: 'mat-2-2-1', title: 'Konsep Perkalian sebagai Penjumlahan Berulang', description: 'Menghitung kelompok benda yang sama jumlahnya secara interaktif', tag: 'Joyful', duration: '4 JP' },
        { id: 'mat-2-2-2', title: 'Konsep Pembagian sebagai Pengurangan Berulang sampai Habis', description: 'Membagi permen atau kue secara adil kepada teman sekelas', tag: 'Meaningful', duration: '4 JP' },
        { id: 'mat-2-2-3', title: 'Bangun Datar dan Bangun Ruang Sederhana', description: 'Sisi, sudut, titik sudut kubus, balok, dan tabung', tag: 'Mindful', duration: '3 JP' },
      ],
    },
    '3': {
      '1': [
        { id: 'mat-3-1-1', title: 'Bilangan Cacah sampai 1.000: Operasi Hitung Campuran', description: 'Strategi mental math dan algoritma bersusun pendek', tag: 'Mindful', duration: '5 JP' },
        { id: 'mat-3-1-2', title: 'Pengenalan Pecahan Sederhana (1/2, 1/3, 1/4) dengan Benda Konkret', description: 'Memotong buah, pizza, atau kertas lipat secara presisi', tag: 'Joyful', duration: '4 JP' },
        { id: 'mat-3-1-3', title: 'Pengukuran Panjang Baku (m, cm, mm) dan Berat Baku (kg, gram)', description: 'Mengukur tinggi badan dan menimbang barang dengan timbangan', tag: 'Meaningful', duration: '4 JP' },
      ],
      '2': [
        { id: 'mat-3-2-1', title: 'Perkalian dan Pembagian Bilangan Cacah sampai 100', description: 'Tabel perkalian dan permainan kartu angka cepat', tag: 'Joyful', duration: '4 JP' },
        { id: 'mat-3-2-2', title: 'Keliling dan Luas Persegi serta Persegi Panjang dengan Satuan Kotak', description: 'Ubin lantai kelas sebagai media eksplorasi luas', tag: 'Meaningful', duration: '4 JP' },
        { id: 'mat-3-2-3', title: 'Penyajian Data Sederhana dalam Diagram Gambar (Piktogram)', description: 'Mendata buah kesukaan atau cara berangkat ke sekolah', tag: 'Mindful', duration: '3 JP' },
      ],
    },
    '4': {
      '1': [
        { id: 'mat-4-1-1', title: 'Bilangan Cacah sampai 10.000 dan Komposisi Nilai Tempat', description: 'Menyelesaikan permasalahan transaksi jual beli pasar tradisional', tag: 'Meaningful', duration: '5 JP' },
        { id: 'mat-4-1-2', title: 'Pecahan Senilai, Menyederhanakan, dan Mengurutkan Pecahan', description: 'Memahami kesetaraan porsi melalui representasi visual grafik', tag: 'Mindful', duration: '5 JP' },
        { id: 'mat-4-1-3', title: 'Faktor dan Kelipatan Bilangan (FPB dan KPK Pengantar)', description: 'Pohon faktor, tabel pembagian, dan puzzle angka', tag: 'Joyful', duration: '4 JP' },
      ],
      '2': [
        { id: 'mat-4-2-1', title: 'Pecahan Desimal dan Persen dalam Kehidupan Sehari-hari', description: 'Menghitung diskon belanja dan membaca label kemasan makanan', tag: 'Meaningful', duration: '5 JP' },
        { id: 'mat-4-2-2', title: 'Pengukuran Sudut dengan Busur Derajat dan Jenis Sudut', description: 'Sudut lancip, siku-siku, tumpul pada arsitektur rumah adat', tag: 'Mindful', duration: '4 JP' },
        { id: 'mat-4-2-3', title: 'Keliling dan Luas Bangun Datar Gabungan', description: 'Menghitung luas denah pekarangan atau lapangan sekolah', tag: 'Meaningful', duration: '4 JP' },
      ],
    },
    '5': {
      '1': [
        { id: 'mat-5-1-1', title: 'Operasi Penjumlahan dan Pengurangan Pecahan Biasa & Campuran', description: 'Menyamakan penyebut dengan KPK dan menyelesaikan masalah kontekstual', tag: 'Mindful', duration: '5 JP' },
        { id: 'mat-5-1-2', title: 'Perkalian dan Pembagian Pecahan serta Desimal', description: 'Aplikasi resep masakan, takaran bahan kue, dan pembagian cairan', tag: 'Meaningful', duration: '5 JP' },
        { id: 'mat-5-1-3', title: 'Perbandingan, Skala, dan Denah Lokasi', description: 'Membaca peta wilayah, menghitung jarak sebenarnya dari skala peta', tag: 'Meaningful', duration: '4 JP' },
        { id: 'mat-5-1-4', title: 'Volume Kubus dan Balok dengan Satuan Kubus Satuan', description: 'Eksplorasi rumus volume dan jaring-jaring bangun ruang', tag: 'Joyful', duration: '4 JP' },
      ],
      '2': [
        { id: 'mat-5-2-1', title: 'Kecepatan dan Debit Aliran Air', description: 'Menghitung waktu tempuh perjalanan dan waktu pengisian bak air', tag: 'Meaningful', duration: '5 JP' },
        { id: 'mat-5-2-2', title: 'Jaring-jaring Kubus, Balok, Prisma, dan Limas', description: 'Membuat kreasi kemasan produk ramah lingkungan dari karton', tag: 'Joyful', duration: '4 JP' },
        { id: 'mat-5-2-3', title: 'Pengumpulan dan Penyajian Data (Tabel, Diagram Batang, Diagram Garis)', description: 'Survei hobi siswa dan membuat kesimpulan berbasis data', tag: 'Mindful', duration: '4 JP' },
      ],
    },
    '6': {
      '1': [
        { id: 'mat-6-1-1', title: 'Bilangan Bulat Negatif: Konsep Garis Bilangan dan Operasi Hitung', description: 'Suhu di bawah nol, kedalaman laut, dan keuntungan-kerugian', tag: 'Mindful', duration: '5 JP' },
        { id: 'mat-6-1-2', title: 'Operasi Hitung Campuran Bilangan Cacah, Pecahan, dan Desimal', description: 'Prioritas urutan operasi (Kabataku) pada studi kasus bisnis cilik', tag: 'Meaningful', duration: '5 JP' },
        { id: 'mat-6-1-3', title: 'Unsur-unsur Lingkaran, Keliling, dan Luas Lingkaran (Pi: 3,14 atau 22/7)', description: 'Mengukur roda sepeda, koin, dan membuat miniatur taman bundar', tag: 'Joyful', duration: '5 JP' },
      ],
      '2': [
        { id: 'mat-6-2-1', title: 'Volume dan Luas Permukaan Bangun Ruang (Tabung, Kerucut, Bola)', description: 'Menghitung daya tampung kaleng susu dan bola dunia (globe)', tag: 'Mindful', duration: '5 JP' },
        { id: 'mat-6-2-2', title: 'Statistika Data: Rata-rata (Mean), Nilai Tengah (Median), Modus', description: 'Menganalisis nilai ulangan dan data tinggi badan siswa sekelas', tag: 'Meaningful', duration: '4 JP' },
        { id: 'mat-6-2-3', title: 'Peluang dan Kejadian Sederhana dalam Permainan', description: 'Eksperimen pelemparan koin dan dadu untuk mengamati frekuensi', tag: 'Joyful', duration: '3 JP' },
      ],
    },
  },

  'IPAS': {
    '3': {
      '1': [
        { id: 'ipas-3-1-1', title: 'Mari Kenali Hewan di Sekitar Kita: Ciri Fisik dan Habitat', description: 'Mengamati siklus hidup dan adaptasi hewan peliharaan & liar', tag: 'Joyful', duration: '5 JP' },
        { id: 'ipas-3-1-2', title: 'Mengenal Siklus Hidup Makhluk Hidup (Metamorfosis Sempurna & Tidak)', description: 'Metamorfosis kupu-kupu, katak, dan kecoa dengan diaroma', tag: 'Mindful', duration: '5 JP' },
        { id: 'ipas-3-1-3', title: 'Wujud Benda dan Perubahannya (Padat, Cair, Gas)', description: 'Eksperimen es mencair, menguap, dan mengembun di gelas', tag: 'Meaningful', duration: '4 JP' },
      ],
      '2': [
        { id: 'ipas-3-2-1', title: 'Tradisi dan Kehidupan Masyarakat di Lingkungan Sekitar', description: 'Mengenal gotong royong dan kearifan lokal desa setempat', tag: 'Meaningful', duration: '4 JP' },
        { id: 'ipas-3-2-2', title: 'Mengenal Denah Rumah, Sekolah, dan Lingkungan Tetangga', description: 'Membuat peta sederhana rute perjalanan dari rumah ke sekolah', tag: 'Joyful', duration: '4 JP' },
        { id: 'ipas-3-2-3', title: 'Kebutuhan dan Keinginan: Mengelola Uang Saku Bijak', description: 'Pendidikan literasi finansial sederhana sejak usia dini', tag: 'Mindful', duration: '3 JP' },
      ],
    },
    '4': {
      '1': [
        { id: 'ipas-4-1-1', title: 'Tumbuhan, Sumber Kehidupan di Bumi: Fotosintesis & Bagian Tumbuhan', description: 'Percobaan membuktikan daun menghasilkan oksigen & amilum', tag: 'Mindful', duration: '5 JP' },
        { id: 'ipas-4-1-2', title: 'Wujud Zat dan Perubahannya dalam Kehidupan Sehari-hari', description: 'Massa dan volume zat cair, padat, gas dalam berbagai wadah', tag: 'Meaningful', duration: '5 JP' },
        { id: 'ipas-4-1-3', title: 'Gaya di Sekitar Kita: Gaya Otot, Gesek, Magnet, Pegas, dan Gravitasi', description: 'Eksperimen mobil mainan di permukaan licin vs kasar', tag: 'Joyful', duration: '5 JP' },
      ],
      '2': [
        { id: 'ipas-4-2-1', title: 'Mengubah Bentuk Energi: Energi Panas, Listrik, Bunyi, dan Kinetik', description: 'Membuat kincir angin mini dan panel surya mainan', tag: 'Joyful', duration: '5 JP' },
        { id: 'ipas-4-2-2', title: 'Cerita Tentang Daerahku: Sejarah, Peninggalan, dan Pahlawan Lokal', description: 'Wawancara tetua adat atau berkunjung ke museum/situs lokal', tag: 'Meaningful', duration: '5 JP' },
        { id: 'ipas-4-2-3', title: 'Keanekaragaman Hayati dan Bentang Alam Indonesiaku', description: 'Gunung, pantai, dataran tinggi, dan pelestarian flora-fauna', tag: 'Mindful', duration: '4 JP' },
      ],
    },
    '5': {
      '1': [
        { id: 'ipas-5-1-1', title: 'Melihat karena Cahaya, Mendengar karena Bunyi (Sifat Cahaya & Bunyi)', description: 'Eksperimen perambatan cahaya, cermin, lensa, dan resonansi bunyi', tag: 'Joyful', duration: '5 JP' },
        { id: 'ipas-5-1-2', title: 'Harmoni dalam Ekosistem: Rantai Makanan & Jaring-jaring Makanan', description: 'Keseimbangan produsen, konsumen, pengurai, dan ancaman kepunahan', tag: 'Mindful', duration: '5 JP' },
        { id: 'ipas-5-1-3', title: 'Magnet, Listrik, dan Teknologi untuk Kehidupan Manusia', description: 'Merangkai sirkuit listrik sederhana seri-paralel dan elektromagnet', tag: 'Joyful', duration: '5 JP' },
        { id: 'ipas-5-1-4', title: 'Ayo Berkenalan dengan Bumi Kita: Lapisan Atmosfer & Litosfer', description: 'Struktur bumi, gempa tektonik, dan mitigasi bencana ramah anak', tag: 'Meaningful', duration: '4 JP' },
      ],
      '2': [
        { id: 'ipas-5-2-1', title: 'Bagaimana Kita Hidup dan Bertumbuh: Sistem Pernapasan & Pencernaan', description: 'Model tiruan paru-paru balon dan pencernaan makanan sehat', tag: 'Mindful', duration: '5 JP' },
        { id: 'ipas-5-2-2', title: 'Indonesiaku Kaya Hayati: Keanekaragaman Budaya dan Sumber Daya Alam', description: 'Peta persebaran rempah, tambang, dan kearifan suku bangsa', tag: 'Meaningful', duration: '5 JP' },
        { id: 'ipas-5-2-3', title: 'Warisan Budaya Indonesia dan Pelestarian di Era Digital', description: 'Kain tradisional, rumah adat, dan pementasan seni kelas', tag: 'Joyful', duration: '4 JP' },
        { id: 'ipas-5-2-4', title: 'Bumiku Sayang, Bumiku Malang: Dampak Sampah & Krisis Iklim', description: 'Aksi 3R (Reduce, Reuse, Recycle) dan bank sampah sekolah', tag: 'Mindful', duration: '4 JP' },
      ],
    },
    '6': {
      '1': [
        { id: 'ipas-6-1-1', title: 'Sistem Organ Gerak Manusia: Rangka, Otot, Sendi, dan Kesehatan Postur', description: 'Menghindari skoliosis, lordosis, dan pentingnya berjemur pagi', tag: 'Mindful', duration: '5 JP' },
        { id: 'ipas-6-1-2', title: 'Cerita Perjuangan Kemerdekaan Indonesia dan Semangat Persatuan', description: 'Peristiwa Rengasdengklok, Proklamasi, dan nilai kepahlawanan', tag: 'Meaningful', duration: '5 JP' },
        { id: 'ipas-6-1-3', title: 'Sistem Tata Surya: Matahari, Planet, Asteroid, dan Rotasi Bumi', description: 'Simulasi revolusi bumi, pergantian musim, dan fase bulan', tag: 'Joyful', duration: '5 JP' },
      ],
      '2': [
        { id: 'ipas-6-2-1', title: 'Hubungan Antarnegara di Kawasan ASEAN dan Globalisasi', description: 'Kerjasama ekonomi, budaya, dan peran aktif Indonesia di dunia', tag: 'Meaningful', duration: '5 JP' },
        { id: 'ipas-6-2-2', title: 'Energi Bersih Terbarukan untuk Masa Depan Bumi', description: 'Pembangkit listrik tenaga air, angin, dan biogas kotoran ternak', tag: 'Meaningful', duration: '5 JP' },
        { id: 'ipas-6-2-3', title: 'Menjelajahi Luar Angkasa dan Teknologi Satelit Modern', description: 'Teleskop James Webb, stasiun ISS, dan satelit komunikasi', tag: 'Joyful', duration: '4 JP' },
      ],
    },
  },

  'BAHASA INDONESIA': {
    '1': {
      '1': [
        { id: 'bi-1-1-1', title: 'Bunyi dan Huruf: Mengenal Huruf Abjad dan Suku Kata Ceria', description: 'Membaca kata bersuku dua dengan bantuan kartu bergambar warna-warni', tag: 'Joyful', duration: '5 JP' },
        { id: 'bi-1-1-2', title: 'Tempat dan Benda di Sekitarku: Menyimak Cerita dan Bertanya', description: 'Memperhatikan dongeng fabel dan menjawab pertanyaan siapa, di mana', tag: 'Mindful', duration: '5 JP' },
        { id: 'bi-1-1-3', title: 'Awas Kuman!: Membaca Kata Kuman, Bersih, Sabun, dan Menulis Rapi', description: 'Menulis tegak bersambung sederhana tentang pola hidup bersih', tag: 'Meaningful', duration: '4 JP' },
      ],
      '2': [
        { id: 'bi-1-2-1', title: 'Sopan Santun Berbicara: Mengucapkan Maaf, Tolong, dan Terima Kasih', description: 'Bermain peran situasi sehari-hari di rumah dan sekolah', tag: 'Meaningful', duration: '4 JP' },
        { id: 'bi-1-2-2', title: 'Binatang di Sekitarku: Membaca Mandiri Cerita Bergambar', description: 'Membedakan suara hewan dan menirukan gerakannya dengan gembira', tag: 'Joyful', duration: '5 JP' },
        { id: 'bi-1-2-3', title: 'Bermain di Lingkungan Aman: Mengenal Tanda Bahaya dan Lampu Lalu Lintas', description: 'Membaca tanda rambu umum dan aturan menyeberang zebra cross', tag: 'Mindful', duration: '4 JP' },
      ],
    },
    '2': {
      '1': [
        { id: 'bi-2-1-1', title: 'Mengenal Perasaan Diri: Senang, Sedih, Takut, dan Marah Secara Sehat', description: 'Mengekspresikan emosi dengan kata-kata santun tanpa menyakiti', tag: 'Mindful', duration: '5 JP' },
        { id: 'bi-2-1-2', title: 'Menjaga Kesehatan Diri: Teks Petunjuk Mencuci Buah dan Sayur', description: 'Menulis urutan langkah-langkah membuat jus atau salad sederhana', tag: 'Meaningful', duration: '4 JP' },
        { id: 'bi-2-1-3', title: 'Berhati-hati di Mana Saja: Teks Narasi Pendek & Tanda Peringatan', description: 'Menemukan informasi penting pada teks peringatan lingkungan', tag: 'Mindful', duration: '4 JP' },
      ],
      '2': [
        { id: 'bi-2-2-1', title: 'Keluargaku Unik: Menceritakan Silsilah dan Kebiasaan di Rumah', description: 'Mempresentasikan foto keluarga di depan kelas dengan percaya diri', tag: 'Joyful', duration: '4 JP' },
        { id: 'bi-2-2-2', title: 'Cinta Lingkungan: Memilah Sampah Organik dan Anorganik lewat Dongeng', description: 'Membaca fabel tentang hewan laut yang terkena dampak plastik', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-2-2-3', title: 'Puisi Anak yang Indah: Membaca Nyaring dengan Lafal dan Intonasi Tepat', description: 'Menciptakan 4 bait puisi tentang keindahan alam desa', tag: 'Joyful', duration: '4 JP' },
      ],
    },
    '3': {
      '1': [
        { id: 'bi-3-1-1', title: 'Kawan Seiring: Memahami Nilai Persahabatan dan Gotong Royong', description: 'Menganalisis watak tokoh dalam cerita pendek dan saling berbagi', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-3-1-2', title: 'Kreativitas Tanpa Batas: Menulis Teks Petunjuk Membuat Mainan Bekas', description: 'Kalimat perintah efektif, penggunaan tanda baca titik dan koma', tag: 'Joyful', duration: '5 JP' },
        { id: 'bi-3-1-3', title: 'Mengenal Cuaca dan Iklim di Indonesia lewat Teks Informatif', description: 'Mencatat kosa kata baru tentang hujan, kemarau, dan awan', tag: 'Mindful', duration: '4 JP' },
      ],
      '2': [
        { id: 'bi-3-2-1', title: 'Hemat Energi demi Masa Depan: Poster dan Slogan Sederhana', description: 'Menulis ajakan mematikan lampu dan kran air yang terpasang di kelas', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-3-2-2', title: 'Menjelajahi Ragam Alat Transportasi Tradisional dan Modern', description: 'Membandingkan delman, perahu dayung, kereta cepat, dan pesawat', tag: 'Joyful', duration: '4 JP' },
        { id: 'bi-3-2-3', title: 'Cerita Rakyat Nusantara: Menemukan Amanat dan Pesan Moral', description: 'Menceritakan kembali kisah Malin Kundang atau Timun Mas', tag: 'Mindful', duration: '4 JP' },
      ],
    },
    '4': {
      '1': [
        { id: 'bi-4-1-1', title: 'Aku yang Unik: Teks Deskripsi Diri, Menyimak Instruksi, dan Kata Sifat', description: 'Mengenal keberagaman karakter diri dan menghargai teman', tag: 'Mindful', duration: '5 JP' },
        { id: 'bi-4-1-2', title: 'Di Bawah Atap: Kalimat Transitif dan Intransitif dalam Cerita Keluarga', description: 'Struktur SPOK dan penggunaan awalan me- yang benar', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-4-1-3', title: 'Lihat Sekitar: Teks Petunjuk Arah, Denah, dan Kata Penghubung', description: 'Menulis rute jalan menggunakan kata depan di, ke, dari', tag: 'Joyful', duration: '4 JP' },
      ],
      '2': [
        { id: 'bi-4-2-1', title: 'Meliuk dan Menerjang: Teks Informasi Tarian Daerah & Puisi Berima', description: 'Mengapresiasi gerak seni tari saman dan pendet lewat tulisan', tag: 'Joyful', duration: '5 JP' },
        { id: 'bi-4-2-2', title: 'Raja Ampat Nan Eksotis: Teks Eksplanasi Wisata dan Wawancara Sederhana', description: 'Latihan membuat daftar pertanyaan 5W+1H untuk narasumber', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-4-2-3', title: 'Sehat Jiwa dan Raga: Menulis Laporan Hasil Pengamatan Kantin Bersih', description: 'Menyusun laporan observasi sederhana dengan fakta akurat', tag: 'Mindful', duration: '4 JP' },
      ],
    },
    '5': {
      '1': [
        { id: 'bi-5-1-1', title: 'Aku yang Unik: Teks Deskripsi Tokoh, Antonim-Sinonim, dan Kalimat Majemuk', description: 'Menggambarkan kepribadian sahabat secara mendalam dan berempati', tag: 'Mindful', duration: '5 JP' },
        { id: 'bi-5-1-2', title: 'Buku Jendela Dunia: Unsur Intrinsik Cerita, Majas Personifikasi & Metafora', description: 'Menelaah alur, tema, latar, dan pesan moral dalam novel anak', tag: 'Joyful', duration: '5 JP' },
        { id: 'bi-5-1-3', title: 'Ekspresi Diri Melalui Hobi: Teks Prosedur dan Wawancara Tokoh Inspiratif', description: 'Menulis tata cara merawat tanaman bonsai atau memasak kue khas', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-5-1-4', title: 'Belajar Berwirausaha: Menulis Teks Iklan Komersial dan Brosur Kreatif', description: 'Memilih diksi persuasif yang menarik dan etis', tag: 'Joyful', duration: '4 JP' },
      ],
      '2': [
        { id: 'bi-5-2-1', title: 'Menjadi Warga Digital Cerdas: Membaca Teks Berita dan Menangkal Hoaks', description: 'Memverifikasi sumber berita online dengan berpikir kritis', tag: 'Mindful', duration: '5 JP' },
        { id: 'bi-5-2-2', title: 'Cinta Indonesia: Menulis Surat Pribadi dan Surat Resmi Sekolah', description: 'Membedakan bahasa baku dan tidak baku serta tata letak surat resmi', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-5-2-3', title: 'Sayangi Bumi: Teks Pidato Persuasif Menjaga Kelestarian Hutan', description: 'Berpidato di depan kelas dengan intonasi mantap dan bahasa tubuh meyakinkan', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-5-2-4', title: 'Pantun dan Syair Nasihat: Menciptakan Karya Sastra Berpola a-b-a-b', description: 'Menyampaikan pesan kebaikan melalui bait pantun jenaka dan nasihat', tag: 'Joyful', duration: '4 JP' },
      ],
    },
    '6': {
      '1': [
        { id: 'bi-6-1-1', title: 'Bangga Menjadi Anak Indonesia: Menulis Formulir Pendaftaran dan Daftar Riwayat Hidup', description: 'Mengisi form lomba dan mendeskripsikan keahlian diri secara jujur', tag: 'Meaningful', duration: '5 JP' },
        { id: 'bi-6-1-2', title: 'Musyawarah Mufakat: Teks Diskusi dan Berpendapat Santun', description: 'Menyampaikan argumen pro dan kontra tanpa emosi berlebihan', tag: 'Mindful', duration: '5 JP' },
        { id: 'bi-6-1-3', title: 'Kisah Penemu Hebat: Teks Biografi dan Ringkasan Gagasan Utama', description: 'Meneladani ketekunan B.J. Habibie dan Thomas Alva Edison', tag: 'Meaningful', duration: '5 JP' },
      ],
      '2': [
        { id: 'bi-6-2-1', title: 'Naskah Drama Anak: Menulis Dialog dan Memerankan Adegan Bertema Toleransi', description: 'Kolaborasi pentas drama kelas yang menggembirakan', tag: 'Joyful', duration: '5 JP' },
        { id: 'bi-6-2-2', title: 'Pidato Perpisahan Sekolah: Menulis Naskah Haru dan Penuh Semangat Masa Depan', description: 'Refleksi 6 tahun menempuh pendidikan SD dan ucapan terima kasih pada guru', tag: 'Mindful', duration: '5 JP' },
        { id: 'bi-6-2-3', title: 'Kritik Sastra Ringkas: Mengulas Buku Cerita Favorit (Resensi Anak)', description: 'Memberikan penilaian kelebihan dan kekurangan buku secara objektif', tag: 'Mindful', duration: '4 JP' },
      ],
    },
  },

  'PENDIDIKAN PANCASILA': {
    '1': {
      '1': [
        { id: 'pp-1-1-1', title: 'Aku Cinta Pancasila: Simbol Garuda Pancasila dan 5 Sila', description: 'Mengenal bintang, rantai, pohon beringin, banteng, dan padi kapas', tag: 'Joyful', duration: '4 JP' },
        { id: 'pp-1-1-2', title: 'Aku Anak yang Tertib: Aturan di Rumah dan di Sekolah', description: 'Kebiasaan merapikan tempat tidur dan mendengarkan penjelasan guru', tag: 'Mindful', duration: '4 JP' },
      ],
      '2': [
        { id: 'pp-1-2-1', title: 'Kita Berbeda tetapi Bersatu: Keberagaman Teman Sekelas', description: 'Menghargai teman yang berbeda suku, warna kulit, dan kesukaan', tag: 'Meaningful', duration: '4 JP' },
        { id: 'pp-1-2-2', title: 'Aku Cinta Negaraku: Bendera Merah Putih dan Lagu Indonesia Raya', description: 'Sikap tegak saat upacara bendera hari Senin', tag: 'Mindful', duration: '4 JP' },
      ],
    },
    '5': {
      '1': [
        { id: 'pp-5-1-1', title: 'Pancasila dalam Kehidupanku: Memahami Makna dan Nilai Luhur Tiap Sila', description: 'Menerapkan gotong royong, keadilan sosial, dan toleransi beragama di sekolah', tag: 'Mindful', duration: '4 JP' },
        { id: 'pp-5-1-2', title: 'Norma dalam Masyarakat: Norma Agama, Kesusilaan, Kesopanan, dan Hukum', description: 'Analisis studi kasus pelanggaran norma dan sanksinya di lingkungan RT/RW', tag: 'Meaningful', duration: '4 JP' },
        { id: 'pp-5-1-3', title: 'Hak dan Kewajiban Warga Negara Muda secara Bertanggung Jawab', description: 'Keseimbangan antara hak mendapatkan pendidikan dan kewajiban belajar giat', tag: 'Meaningful', duration: '4 JP' },
      ],
      '2': [
        { id: 'pp-5-2-1', title: 'Menghargai Keragaman Budaya Indonesia sebagai Kekayaan Bangsa', description: 'Pameran busana adat, kuliner tradisional, dan rumah adat 38 provinsi', tag: 'Joyful', duration: '4 JP' },
        { id: 'pp-5-2-2', title: 'Menjaga Keutuhan Negara Kesatuan Republik Indonesia (NKRI)', description: 'Peran murid SD menjaga kerukunan dan persatuan di tengah era medsos', tag: 'Meaningful', duration: '4 JP' },
        { id: 'pp-5-2-3', title: 'Musyawarah untuk Mufakat dalam Memilih Pengurus Kelas', description: 'Simulasi pemilihan ketua kelas yang demokratis dan saling menghargai hasil', tag: 'Mindful', duration: '4 JP' },
      ],
    },
  },

  'PAI dan Budi Pekerti': {
    '5': {
      '1': [
        { id: 'pai-5-1-1', title: 'Menyayangi Anak Yatim: Memahami Makna Q.S. Al-Ma\'un', description: 'Menghafal, mengartikan, dan mempraktikkan sedekah jumat berkah', tag: 'Meaningful', duration: '4 JP' },
        { id: 'pai-5-1-2', title: 'Mengenal Asmaul Husna: Al-Qawiyyu, Al-Qayyum, Al-Muhyi, Al-Mumit', description: 'Meneladani sifat mandiri, kuat pendirian, dan bersyukur atas kehidupan', tag: 'Mindful', duration: '4 JP' },
        { id: 'pai-5-1-3', title: 'Indahnya Saling Menghargai dalam Keragaman Agama dan Budaya', description: 'Toleransi persahabatan antarumat beragama tanpa mencampuradukkan akidah', tag: 'Meaningful', duration: '4 JP' },
      ],
      '2': [
        { id: 'pai-5-2-1', title: 'Zakat, Infak, dan Sedekah Membersihkan Harta dan Jiwa', description: 'Simulasi menghitung zakat fitrah beras dan menyalurkannya ke mustahik', tag: 'Joyful', duration: '4 JP' },
        { id: 'pai-5-2-2', title: 'Meneladani Perjuangan Nabi Muhammad SAW Membangun Kota Madinah', description: 'Persaudaraan kaum Muhajirin dan Anshar serta Piagam Madinah', tag: 'Meaningful', duration: '4 JP' },
        { id: 'pai-5-2-3', title: 'Menjaga Amanah dan Menepati Janji dalam Pergaulan', description: 'Refleksi kejujuran mengerjakan ulangan dan memegang rahasia teman', tag: 'Mindful', duration: '3 JP' },
      ],
    },
  },

  'BAHASA INGGRIS': {
    '5': {
      '1': [
        { id: 'eng-5-1-1', title: 'What a Delicious Food!: Describing Taste and Healthy Diet', description: 'Sweet, sour, bitter, salty food vocabulary and dining etiquette conversation', tag: 'Joyful', duration: '4 JP' },
        { id: 'eng-5-1-2', title: 'How Much Is It?: Shopping at Supermarket & Indonesian Rupiah Currency', description: 'Inquiring prices, calculating totals, and polite shopping expressions', tag: 'Meaningful', duration: '4 JP' },
        { id: 'eng-5-1-3', title: 'Daily Routines and Telling the Time with Clock Analog', description: 'Wake up, take a shower, quarter past, half past sentence building', tag: 'Mindful', duration: '4 JP' },
      ],
      '2': [
        { id: 'eng-5-2-1', title: 'My Future Dream Job: Astronaut, Doctor, Pilot, and Teacher', description: 'Speaking practice about future aspirations and why we choose them', tag: 'Joyful', duration: '4 JP' },
        { id: 'eng-5-2-2', title: 'Public Places and Giving Directions (Turn Left, Go Straight)', description: 'Reading school maps and guiding tourists with friendly English', tag: 'Meaningful', duration: '4 JP' },
        { id: 'eng-5-2-3', title: 'Save Our Planet: Talking About Animals, Forests, and Clean Air', description: 'Simple environmental slogan making and short descriptive speech', tag: 'Mindful', duration: '4 JP' },
      ],
    },
  },

  'BAHASA JAWA': {
    '5': {
      '1': [
        { id: 'bj-5-1-1', title: 'Unggah-Ungguh Basa Jawa: Basa Ngoko lan Krama Inggil marang Wong Tuwa', description: 'Gladhi pacelathon matur marang bapak/ibu guru lan tiyang sepuh kanthi sopan', tag: 'Mindful', duration: '4 JP' },
        { id: 'bj-5-1-2', title: 'Cerita Wayang Pandhawa: Lakon Satriya Madukara Raden Janaka', description: 'Nintingi watak becik, kautaman, lan lelabuhan pahlawan bangsa', tag: 'Meaningful', duration: '4 JP' },
        { id: 'bj-5-1-3', title: 'Tembang Macapat Maskumambang lan Mijil: Nguri-uri Sastra Jawa', description: 'Nembang sesarengan kanthi nggatekake guru lagu, guru wilangan, lan guru gatra', tag: 'Joyful', duration: '4 JP' },
      ],
      '2': [
        { id: 'bj-5-2-1', title: 'Maca lan Nulis Aksara Jawa Legena kanthi Sandhangan Swara', description: 'Wulu, suku, taling, tarung, pepet dipraktekake nulis ukara prasaja', tag: 'Mindful', duration: '4 JP' },
        { id: 'bj-5-2-2', title: 'Cangkriman lan Parikan: Dolanan Basa Jawa Ceria lan Gesit', description: 'Tebak-tebakan basa Jawa tradisional sing ngesuk pintere nalar bocah', tag: 'Joyful', duration: '4 JP' },
        { id: 'bj-5-2-3', title: 'Tradisi Bersih Desa lan Gotong Royong Masyarakat Jawa', description: 'Nguripake rasa handarbeni marang kabudayan lokal adiluhung', tag: 'Meaningful', duration: '4 JP' },
      ],
    },
  },

  'SENI MUSIK': {
    '5': {
      '1': [
        { id: 'sm-5-1-1', title: 'Mengenal Notasi Angka, Notasi Balok, dan Ritme Ketukan 4/4', description: 'Membaca partitur lagu anak dan menyanyikan solmisasi tepat nada', tag: 'Mindful', duration: '3 JP' },
        { id: 'sm-5-1-2', title: 'Lagu Wajib Nasional dan Lagu Daerah Nusantara Berharmoni', description: 'Menyanyikan lagu Halo-Halo Bandung dan Gundhul-Gundhul Pacul', tag: 'Joyful', duration: '4 JP' },
        { id: 'sm-5-1-3', title: 'Alat Musik Melodis dan Ritmis Sederhana (Pianika, Rekorder, Kastanyet)', description: 'Ansambel musik kelas memainkan lagu daerah dengan kompak', tag: 'Joyful', duration: '4 JP' },
      ],
      '2': [
        { id: 'sm-5-2-1', title: 'Eksplorasi Bunyi dan Perkusi dari Barang Bekas (Galon, Botol Kaca, Ember)', description: 'Menghasilkan aransemen musik ramah lingkungan yang energik', tag: 'Joyful', duration: '4 JP' },
        { id: 'sm-5-2-2', title: 'Apresiasi Musik Tradisional Nusantara (Gamelan, Angklung, Kolintang)', description: 'Mendengarkan rekaman dan mengidentifikasi instrumen khas daerah', tag: 'Mindful', duration: '3 JP' },
      ],
    },
  },

  'SENI TARI': {
    '5': {
      '1': [
        { id: 'st-5-1-1', title: 'Mengenal Elemen Dasar Gerak Tari: Ruang, Waktu, dan Tenaga', description: 'Mengeksplorasi gerak lambat, sedang, cepat dengan ekspresi wajah hidup', tag: 'Joyful', duration: '3 JP' },
        { id: 'st-5-1-2', title: 'Gerak Tari Tradisional Nusantara Bertema Lingkungan Alam', description: 'Menirukan gerak burung merak, ombak pantai, dan angin sepoi-sepoi', tag: 'Mindful', duration: '4 JP' },
      ],
      '2': [
        { id: 'st-5-2-1', title: 'Menyusun Koreografi Tari Kelompok Kreatif dan Harmonis', description: 'Bekerja sama dalam formasi lantai lingkaran, diagonal, dan zigzag', tag: 'Joyful', duration: '4 JP' },
        { id: 'st-5-2-2', title: 'Pementasan Tari Mini di Kelas dengan Properti Tradisional (Selendang/Kipas)', description: 'Membangun rasa percaya diri tampil di depan teman dan guru', tag: 'Meaningful', duration: '4 JP' },
      ],
    },
  },
};

/**
 * Helper to get recommended topics for any Subject, Grade, and Semester.
 * If exact match is not found, provides an intelligent contextual fallback based on subject.
 */
export function getRecommendedTopics(
  subject: string,
  grade: string,
  semester: string | number
): TopicItem[] {
  const cleanSem = String(semester).includes('2') ? '2' : '1';
  const cleanGrade = String(grade).replace(/\D/g, '') || '5';

  const subjectData = SD_CURRICULUM_TOPICS[subject];
  if (subjectData) {
    const gradeData = subjectData[cleanGrade] || subjectData['5'] || subjectData['1'];
    if (gradeData && gradeData[cleanSem] && gradeData[cleanSem].length > 0) {
      return gradeData[cleanSem];
    }
    // Return any semester available
    const anySem = Object.values(gradeData || {})[0];
    if (anySem && anySem.length > 0) return anySem;
  }

  // Generative default based on subject
  return [
    {
      id: `${subject.toLowerCase()}-gen-1`,
      title: `Eksplorasi Konsep Dasar & Pemahaman Esensial ${subject}`,
      description: `Membangun pemahaman mendalam secara kontekstual melalui studi kasus nyata`,
      tag: 'Mindful',
      duration: '4 JP',
    },
    {
      id: `${subject.toLowerCase()}-gen-2`,
      title: `Aplikasi Praktis & Proyek Kolaboratif Siswa ${subject}`,
      description: `Menghubungkan konsep teori dengan aktivitas menyenangkan di kelas`,
      tag: 'Joyful',
      duration: '4 JP',
    },
    {
      id: `${subject.toLowerCase()}-gen-3`,
      title: `Refleksi Bermakna dan Pemecahan Masalah Kehidupan Sehari-hari (${subject})`,
      description: `Mengasah keterampilan berpikir kritis dan karakter Profil Pelajar Pancasila`,
      tag: 'Meaningful',
      duration: '3 JP',
    },
  ];
}
