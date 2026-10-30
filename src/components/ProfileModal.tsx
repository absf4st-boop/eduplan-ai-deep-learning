import React, { useState } from 'react';
import { X, Building2, UserCheck, Save, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { UserAccount, TeacherProfile, SchoolProfile } from '../types';
import { setCurrentUser } from '../services/storage';

interface ProfileModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  onClose: () => void;
  onSaved: (updatedUser: UserAccount) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'guru' | 'sekolah' | 'kepsek'>('guru');

  // Teacher Profile state
  const [teacher, setTeacher] = useState<TeacherProfile>({
    name: currentUser.teacherProfile.name || currentUser.name,
    nip: currentUser.teacherProfile.nip || '',
    email: currentUser.teacherProfile.email || currentUser.email,
    position: currentUser.teacherProfile.position || 'Guru Kelas / PJOK SD',
    rank: currentUser.teacherProfile.rank || 'Penata Muda / III-a',
  });

  // School Profile state
  const [school, setSchool] = useState<SchoolProfile>({
    name: currentUser.schoolProfile.name || 'SD Negeri Unggulan 01',
    npsn: currentUser.schoolProfile.npsn || '20301928',
    educationLevel: currentUser.schoolProfile.educationLevel || 'Sekolah Dasar (SD)',
    address: currentUser.schoolProfile.address || 'Jl. Pendidikan No. 4',
    village: currentUser.schoolProfile.village || 'Kasepuhan',
    district: currentUser.schoolProfile.district || 'Batang',
    regency: currentUser.schoolProfile.regency || 'Kabupaten Batang',
    province: currentUser.schoolProfile.province || 'Jawa Tengah',
    schoolYear: currentUser.schoolProfile.schoolYear || '2026/2027',
    principalName: currentUser.schoolProfile.principalName || 'Drs. H. Sugiyanto, M.Pd.',
    principalNip: currentUser.schoolProfile.principalNip || '19750312 199903 1 002',
    logoUrl: currentUser.schoolProfile.logoUrl || '',
  });

  const [updateExistingDocs, setUpdateExistingDocs] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchool((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser: UserAccount = {
      ...currentUser,
      name: teacher.name,
      teacherProfile: teacher,
      schoolProfile: school,
    };

    setCurrentUser(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved(updatedUser);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Identitas Guru & Satuan Pendidikan
            </h3>
            <p className="text-xs text-blue-200">
              Otomatis terintegrasi ke seluruh dokumen pembelajaran (CP, TP, ATP, Modul Ajar, RPP, dll)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('guru')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guru'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Identitas Guru</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sekolah')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sekolah'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Identitas Sekolah & Logo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kepsek')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'kepsek'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Kepala Sekolah</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'guru' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Guru (dengan Gelar) *
                </label>
                <input
                  type="text"
                  required
                  value={teacher.name}
                  onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: Husein Apriyanto, S.Pd."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP Guru *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacher.nip}
                    onChange={(e) => setTeacher({ ...teacher, nip: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: 19900815 201802 1 001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={teacher.email}
                    onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jabatan Guru
                  </label>
                  <input
                    type="text"
                    value={teacher.position}
                    onChange={(e) => setTeacher({ ...teacher, position: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: Guru PJOK SD"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pangkat / Golongan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={teacher.rank}
                    onChange={(e) => setTeacher({ ...teacher, rank: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: Penata Muda Tk. I / III-b"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sekolah' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Satuan Pendidikan (Sekolah) *
                  </label>
                  <input
                    type="text"
                    required
                    value={school.name}
                    onChange={(e) => setSchool({ ...school, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: SDN Kasepuhan 04"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NPSN Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={school.npsn}
                    onChange={(e) => setSchool({ ...school, npsn: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="20301928"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Jalan Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={school.address}
                  onChange={(e) => setSchool({ ...school, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Jl. Raya Kasepuhan No. 04"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desa/Kelurahan</label>
                  <input
                    type="text"
                    value={school.village}
                    onChange={(e) => setSchool({ ...school, village: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={school.district}
                    onChange={(e) => setSchool({ ...school, district: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kabupaten/Kota</label>
                  <input
                    type="text"
                    value={school.regency}
                    onChange={(e) => setSchool({ ...school, regency: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={school.province}
                    onChange={(e) => setSchool({ ...school, province: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun Pelajaran Aktif *
                  </label>
                  <input
                    type="text"
                    required
                    value={school.schoolYear}
                    onChange={(e) => setSchool({ ...school, schoolYear: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="2026/2027"
                  />
                </div>

                {/* Logo Sekolah Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Logo Resmi Sekolah (PNG / JPG)
                  </label>
                  <div className="flex items-center gap-3">
                    {school.logoUrl ? (
                      <img
                        src={school.logoUrl}
                        alt="Logo Sekolah"
                        className="w-12 h-12 rounded-lg object-contain border border-slate-200 p-1 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-slate-50">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer transition-colors border border-slate-300">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{school.logoUrl ? 'Ganti Logo' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kepsek' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kepala Sekolah (dengan Gelar) *
                </label>
                <input
                  type="text"
                  required
                  value={school.principalName}
                  onChange={(e) => setSchool({ ...school, principalName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: Drs. H. Sugiyanto, M.Pd."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP Kepala Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={school.principalNip}
                  onChange={(e) => setSchool({ ...school, principalNip: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: 19750312 199903 1 002"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 leading-relaxed">
                Tanda tangan Kepala Sekolah dan Guru Pengampu otomatis dicantumkan di lembar pengesahan dan footer setiap administrasi pembelajaran yang dicetak.
              </div>
            </div>
          )}

          {/* Sync Option */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={updateExistingDocs}
                onChange={(e) => setUpdateExistingDocs(e.target.checked)}
                className="w-4 h-4 rounded text-blue-900 focus:ring-blue-500"
              />
              <span>Terapkan identitas baru pada dokumen baru (dokumen tersimpan lama tidak otomatis ditimpa)</span>
            </label>
          </div>

          {/* Footer Action */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Identitas Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Identitas Guru & Sekolah</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
