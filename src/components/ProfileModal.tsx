import React, { useState } from 'react';
import { UserAccount, TeacherProfile, SchoolProfile, HeadmasterProfile } from '../types';
import { saveRegisteredUser, setCurrentUser } from '../services/storage';
import { X, Save, User, Building2, Award, Upload, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  user: UserAccount;
  onClose: () => void;
  onUpdated: (user: UserAccount) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'guru' | 'sekolah' | 'kepsek'>('guru');

  // Teacher Profile state
  const [fullName, setFullName] = useState(user.teacherProfile.fullName || user.name);
  const [nip, setNip] = useState(user.teacherProfile.nip || '-');
  const [email, setEmail] = useState(user.teacherProfile.email || user.email);
  const [position, setPosition] = useState(user.teacherProfile.position || 'Guru Kelas / PJOK');
  const [rankGroup, setRankGroup] = useState(user.teacherProfile.rankGroup || 'Penata Muda / III a');

  // Headmaster Profile state
  const [headmasterName, setHeadmasterName] = useState(user.schoolProfile.headmaster?.name || 'Drs. H. Slamet Raharjo, M.Pd.');
  const [headmasterNip, setHeadmasterNip] = useState(user.schoolProfile.headmaster?.nip || '19680512 199303 1 004');

  // School Profile state
  const [schoolName, setSchoolName] = useState(user.schoolProfile.schoolName || 'SD Negeri Kasepuhan 04');
  const [npsn, setNpsn] = useState(user.schoolProfile.npsn || '20322891');
  const [level, setLevel] = useState(user.schoolProfile.level || 'Sekolah Dasar (SD)');
  const [address, setAddress] = useState(user.schoolProfile.address || 'Jl. Pemuda No. 12 Kasepuhan');
  const [village, setVillage] = useState(user.schoolProfile.village || 'Kasepuhan');
  const [district, setDistrict] = useState(user.schoolProfile.district || 'Batang');
  const [regency, setRegency] = useState(user.schoolProfile.regency || 'Kabupaten Batang');
  const [province, setProvince] = useState(user.schoolProfile.province || 'Jawa Tengah');
  const [academicYear, setAcademicYear] = useState(user.schoolProfile.academicYear || '2026/2027');
  const [schoolLogo, setSchoolLogo] = useState(user.schoolProfile.logoUrl || '');

  // Subject default
  const [activeSubject, setActiveSubject] = useState(user.schoolProfile.activeSubject || 'PJOK');
  const [activeGrade, setActiveGrade] = useState(user.schoolProfile.activeGrade || '5');
  const [activePhase, setActivePhase] = useState(user.schoolProfile.activePhase || 'Fase C');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchoolLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGradeChange = (newGrade: string) => {
    setActiveGrade(newGrade);
    if (newGrade === '1' || newGrade === '2') setActivePhase('Fase A');
    else if (newGrade === '3' || newGrade === '4') setActivePhase('Fase B');
    else setActivePhase('Fase C');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const headmaster: HeadmasterProfile = {
      name: headmasterName,
      nip: headmasterNip,
    };

    const updatedTeacher: TeacherProfile = {
      fullName,
      nip,
      email,
      position,
      rankGroup,
    };

    const updatedSchool: SchoolProfile = {
      schoolName,
      npsn,
      level,
      address,
      village,
      district,
      regency,
      province,
      academicYear,
      logoUrl: schoolLogo,
      headmaster,
      activeSubject,
      activeGrade,
      activePhase,
    };

    const updatedUser: UserAccount = {
      ...user,
      name: fullName,
      isDemo: false, // User has customized their identity!
      teacherProfile: updatedTeacher,
      schoolProfile: updatedSchool,
    };

    saveRegisteredUser(updatedUser);
    setCurrentUser(updatedUser);
    onUpdated(updatedUser);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Profil Guru, Sekolah & Kepala Sekolah</span>
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Data ini otomatis terintegrasi ke seluruh dokumen RPP, Modul Ajar, LKPD, Jurnal, dan Presensi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => setActiveTab('guru')}
            className={`flex-1 py-3 px-2 text-center font-semibold transition border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'guru'
                ? 'border-blue-700 text-blue-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Identitas Guru</span>
          </button>
          <button
            onClick={() => setActiveTab('sekolah')}
            className={`flex-1 py-3 px-2 text-center font-semibold transition border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'sekolah'
                ? 'border-blue-700 text-blue-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Identitas Sekolah & Logo</span>
          </button>
          <button
            onClick={() => setActiveTab('kepsek')}
            className={`flex-1 py-3 px-2 text-center font-semibold transition border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'kepsek'
                ? 'border-blue-700 text-blue-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Kepala Sekolah & Kelas</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Identitas berhasil disimpan dan diterapkan ke semua dokumen!</span>
              </div>
            )}

            {/* TAB GURU */}
            {activeTab === 'guru' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Guru (dengan gelar)</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="contoh: Husein Apriyanto, S.Pd."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Guru</label>
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="19900101 202012 1 002 (atau tanda -)"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Guru</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="guru@sekolah.sch.id"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jabatan / Tugas</label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Guru PJOK / Guru Kelas SD"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                    <input
                      type="text"
                      value={rankGroup}
                      onChange={(e) => setRankGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Penata Muda / III a"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB SEKOLAH */}
            {activeTab === 'sekolah' && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan (Sekolah)</label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="SD Negeri Kasepuhan 04"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
                    <input
                      type="text"
                      value={npsn}
                      onChange={(e) => setNpsn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="20322891"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Jl. Pemuda No. 12 Kasepuhan"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Desa/Kel.</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kab/Kota</label>
                    <input
                      type="text"
                      value={regency}
                      onChange={(e) => setRegency(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Logo Sekolah */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Logo Satuan Pendidikan (Opsional - Muncul di Kop Dokumen)
                  </label>
                  <div className="flex items-center gap-4">
                    {schoolLogo ? (
                      <div className="relative w-16 h-16 rounded-xl border border-slate-300 overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                        <img src={schoolLogo} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setSchoolLogo('')}
                          className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                        <Upload className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id="logo-upload"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih File Logo (PNG / JPG)</span>
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1">Disarankan format persegi transparan (maks 2MB).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB KEPSEK & DEFAULT KELAS */}
            {activeTab === 'kepsek' && (
              <div className="space-y-4">
                <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/80 space-y-3">
                  <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Identitas Kepala Sekolah (Penanda Tangan)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                      <input
                        type="text"
                        value={headmasterName}
                        onChange={(e) => setHeadmasterName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        placeholder="Nama dan gelar"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                      <input
                        type="text"
                        value={headmasterNip}
                        onChange={(e) => setHeadmasterNip(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        placeholder="NIP Kepala Sekolah"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs">Pengaturan Default Pembelajaran Anda</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran Aktif</label>
                      <select
                        value={activeSubject}
                        onChange={(e) => setActiveSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                      >
                        <option value="PJOK">PJOK</option>
                        <option value="PAI dan Budi Pekerti">PAI dan Budi Pekerti</option>
                        <option value="MATEMATIKA">MATEMATIKA</option>
                        <option value="BAHASA JAWA">BAHASA JAWA</option>
                        <option value="BAHASA INDONESIA">BAHASA INDONESIA</option>
                        <option value="IPAS">IPAS</option>
                        <option value="SENI MUSIK">SENI MUSIK</option>
                        <option value="SENI TARI">SENI TARI</option>
                        <option value="BAHASA INGGRIS">BAHASA INGGRIS</option>
                        <option value="PENDIDIKAN PANCASILA">PENDIDIKAN PANCASILA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kelas Aktif</label>
                      <select
                        value={activeGrade}
                        onChange={(e) => handleGradeChange(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                      >
                        <option value="1">Kelas 1 (Fase A)</option>
                        <option value="2">Kelas 2 (Fase A)</option>
                        <option value="3">Kelas 3 (Fase B)</option>
                        <option value="4">Kelas 4 (Fase B)</option>
                        <option value="5">Kelas 5 (Fase C)</option>
                        <option value="6">Kelas 6 (Fase C)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
                      <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        placeholder="2026/2027"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Terapkan Identitas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
