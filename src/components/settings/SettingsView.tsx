import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  User, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { useTheme } from '../../context/ThemeContext';
import { exportBackupJSON, importBackupJSON } from '../../services/storageService';
import confetti from 'canvas-confetti';

import { searchLocations, LocationSuggestion } from '../../services/locationService';

export const SettingsView: React.FC = () => {
  const { user, updateUser, properties, matrimonyProfiles, tutors, bookings, posts, chats, tasks, habits, resetDefaults, showToast } = useSuperApp();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [zodiac, setZodiac] = useState(user.zodiacSign);
  const [dob, setDob] = useState(user.dateOfBirth || '1998-08-15');
  const [tob, setTob] = useState(user.timeOfBirth || '10:30');
  const [pob, setPob] = useState(user.placeOfBirth || 'Kollam, Kerala, India');
  const [gender, setGender] = useState(user.gender || 'Female');

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
      bio, 
      zodiacSign: zodiac,
      dateOfBirth: dob,
      timeOfBirth: tob,
      placeOfBirth: pob,
      location: pob,
      gender: gender as any
    });
    confetti({ particleCount: 40, spread: 50 });
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
      // Store all keys
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">System Settings & Data Control</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                100% Private
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage user identity, theme engine & offline-first JSON cloud backup.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Customization Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">User Profile & Identity</h3>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
              />
              <div className="space-y-1">
                <span className="font-bold text-white block">{user.name}</span>
                <span className="text-[11px] text-indigo-400 font-mono">{user.handle}</span>
                <p className="text-[10px] text-slate-500">Avatar linked to verified OmniLife ID</p>
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
              <label className="font-bold text-slate-300">Personal Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Theming & Portable Data Backup */}
        <div className="space-y-6">
          
          {/* Visual Theme Engine */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Theme Appearance</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dark', label: 'Dark Slate', icon: '🌑' },
                { id: 'cyberpunk', label: 'Cyberpunk', icon: '⚡' },
                { id: 'midnight', label: 'Midnight', icon: '🌌' },
                { id: 'light', label: 'Clean Light', icon: '☀️' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                    theme === th.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{th.icon}</span>
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Portable JSON Backup & Restore */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
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
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors">
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
                  if (window.confirm('Reset all demo data back to clean factory state?')) {
                    resetDefaults();
                  }
                }}
                className="w-full py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Factory Defaults</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
