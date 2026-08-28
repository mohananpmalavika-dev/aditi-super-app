import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  User, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Camera, 
  Lock, 
  Smartphone, 
  KeyRound 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { useTheme } from '../../context/ThemeContext';
import { exportBackupJSON, importBackupJSON } from '../../services/storageService';
import { PhotoCaptureModal } from '../auth/PhotoCaptureModal';
import { isDeviceLockEnabled, setDeviceLockEnabled, verifyDeviceLock } from '../../services/deviceLockService';
import confetti from 'canvas-confetti';
import { searchLocations, LocationSuggestion } from '../../services/locationService';

export const SettingsView: React.FC = () => {
  const { user, updateUser, properties, matrimonyProfiles, tutors, bookings, posts, chats, tasks, habits, resetDefaults, showToast } = useSuperApp();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [zodiac, setZodiac] = useState(user.zodiacSign);
  const [dob, setDob] = useState(user.dateOfBirth || '1998-08-15');
  const [tob, setTob] = useState(user.timeOfBirth || '10:30');
  const [pob, setPob] = useState(user.placeOfBirth || 'Kollam, Kerala, India');
  const [gender, setGender] = useState(user.gender || 'Female');
  const [showCameraModal, setShowCameraModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [placeSuggestions, setPlaceSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);

  React.useEffect(() => {
    if (pob.length >= 2 && !pob.includes(',')) {
      searchLocations(pob).then((results) => {
        setPlaceSuggestions(results);
        setShowPlaceDropdown(results.length > 0);
      });
    } else {
      setPlaceSuggestions([]);
      setShowPlaceDropdown(false);
    }
  }, [pob]);

  const handleDobChange = (dobString: string) => {
    setDob(dobString);
    if (!dobString) return;
    const date = new Date(dobString);
    const m = date.getMonth() + 1;
    const d = date.getDate();

    let calculatedSign = 'Aries';
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) calculatedSign = 'Aries';
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) calculatedSign = 'Taurus';
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) calculatedSign = 'Gemini';
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) calculatedSign = 'Cancer';
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) calculatedSign = 'Leo';
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) calculatedSign = 'Virgo';
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) calculatedSign = 'Libra';
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) calculatedSign = 'Scorpio';
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) calculatedSign = 'Sagittarius';
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) calculatedSign = 'Capricorn';
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) calculatedSign = 'Aquarius';
    else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) calculatedSign = 'Pisces';

    setZodiac(calculatedSign);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ 
      name, 
      handle, 
      email, 
      avatar,
      bio, 
      zodiacSign: zodiac,
      dateOfBirth: dob,
      timeOfBirth: tob,
      placeOfBirth: pob,
      location: pob,
      gender: gender as any
    });
    confetti({ particleCount: 40, spread: 50 });
    showToast('✨ User profile updated successfully!');
  };

  const handleExportBackup = () => {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user,
      properties,
      matrimonyProfiles,
      tutors,
      bookings,
      posts,
      chats,
      tasks,
      habits
    };
    exportBackupJSON(fullBackup);
    showToast('💾 Complete Aditi backup exported successfully!');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importBackupJSON(file);
      showToast('Restoring state from file...');
      localStorage.clear();
      Object.keys(data).forEach((k) => {
        if (k !== 'version' && k !== 'exportedAt') {
          localStorage.setItem(`omnilife_${k}`, JSON.stringify(data[k]));
        }
      });
      window.location.reload();
    } catch (err) {
      showToast('⚠️ Error importing backup file format.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-slate-700 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-extrabold text-white">System Settings & Data Control</h1>
              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                100% Private
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage user identity, theme engine & offline-first JSON cloud backup.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Profile Customization Form */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">User Profile & Identity</h3>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="relative flex-shrink-0">
                <img
                  src={avatar}
                  alt={name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/60 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-indigo-600 text-white shadow">
                  <Camera className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <span className="font-bold text-white block">{name}</span>
                  <span className="text-[11px] text-indigo-400 font-mono">{handle}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Live Camera Snapshot */}
                  <button
                    type="button"
                    onClick={() => setShowCameraModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Take Live Photo</span>
                  </button>

                  {/* Device Upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setAvatar(event.target.result as string);
                          showToast('📸 Profile photo updated!');
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Date of Birth, Time of Birth, Zodiac */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Time of Birth</label>
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Zodiac Sign</label>
                <select
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Place of Birth with Autofill */}
            <div className="space-y-1 relative">
              <label className="font-bold text-slate-300">Place of Birth (Autofill)</label>
              <input
                type="text"
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                placeholder="Type city (e.g. kollam, kochi)..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
              />

              {showPlaceDropdown && placeSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-indigo-500/40 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-1.5 bg-slate-950/80 text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-3 border-b border-slate-800">
                    Suggested Locations
                  </div>
                  {placeSuggestions.map((place, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setPob(place.formatted);
                        setShowPlaceDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-indigo-600/30 hover:text-white transition-colors flex items-center justify-between border-b border-slate-800/50 last:border-0"
                    >
                      <span className="font-semibold">{place.formatted}</span>
                      <span className="text-[10px] text-slate-400">{place.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Settings Controls */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Theme Engine */}
          <div className="p-4 sm:p-5 rounded-3xl card-3d space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>3D Theme Engine</span>
              </h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-400/30">
                6 Visual Presets
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'dark' as const, name: 'Obsidian Sapphire', color: 'from-indigo-600 to-blue-800', desc: 'Deep cosmic 3D' },
                { id: 'amethyst' as const, name: 'Royal Amethyst', color: 'from-purple-600 to-fuchsia-800', desc: 'Velvet luxury 3D' },
                { id: 'cyberpunk' as const, name: 'Cyber Neon', color: 'from-cyan-500 to-pink-600', desc: 'Sci-fi glow 3D' },
                { id: 'aurora' as const, name: 'Emerald Aurora', color: 'from-emerald-500 to-teal-800', desc: 'Northern lights 3D' },
                { id: 'gold' as const, name: 'Golden Sunset', color: 'from-amber-500 to-red-700', desc: 'Warm royal gold' },
                { id: 'light' as const, name: 'Solar Pearl', color: 'from-slate-100 to-indigo-100', desc: 'Luminous light 3D' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    showToast(`✨ Switched theme to ${t.name}!`);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                    theme === t.id
                      ? 'bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border-indigo-400 text-white shadow-[0_4px_16px_rgba(99,102,241,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] scale-[1.02]'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className={`w-full h-4 rounded-lg bg-gradient-to-r ${t.color} mb-1.5 shadow-sm`} />
                  <span className="text-[11px] font-black text-white truncate block">{t.name}</span>
                  <span className="text-[9px] text-slate-400 truncate block">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Portable JSON Backup & Restore */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3.5">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Cost Data Portability</span>
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed">
              Export and download 100% of your tasks, wallet history, booked sessions, and AI creations to a local JSON file.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Restore from JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  if (window.confirm('Reset all data back to clean factory state?')) {
                    resetDefaults();
                  }
                }}
                className="w-full py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Factory Defaults</span>
              </button>
            </div>
          </div>

          {/* Real Device Screen Lock & Biometrics (Face ID / Fingerprint / PIN) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/30 shadow-xl space-y-3">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>App Lock & Device Security</span>
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed">
              When enabled, closing the app without logging out will protect your session with your phone/PC's native <strong>Face ID</strong>, <strong>Touch ID</strong>, or <strong>PIN</strong> upon reopening.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Device Screen Lock</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isDeviceLockEnabled();
                    setDeviceLockEnabled(next);
                    showToast(next ? '🛡️ Device Screen Lock enabled' : 'Device Screen Lock turned off');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    isDeviceLockEnabled() ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isDeviceLockEnabled() ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={async () => {
                  showToast('Checking device hardware biometrics...');
                  const res = await verifyDeviceLock();
                  if (res.success) {
                    confetti({ particleCount: 50, spread: 60 });
                    showToast('✅ Device hardware authentication verified successfully!');
                  } else {
                    showToast(`⚠️ ${res.error || 'Verification failed'}`);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span>Test Hardware Biometrics (Face ID / PIN)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Live Camera Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={(photoDataUrl) => {
          setAvatar(photoDataUrl);
          updateUser({ avatar: photoDataUrl });
          showToast('📸 Live photo captured and updated as profile picture!');
        }}
      />

    </div>
  );
};
