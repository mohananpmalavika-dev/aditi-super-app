import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Sun, 
  MapPin, 
  RefreshCw, 
  ArrowUpRight, 
  Zap, 
  Palette, 
  MoonStar, 
  Building2, 
  Heart, 
  GraduationCap, 
  CheckSquare, 
  Flame, 
  CheckCircle2, 
  UserCheck
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { useOmniBrain } from '../../context/OmniBrainContext';
import { MiniAppId } from '../../types/superApp';
import { fetchUserCurrentLocationWeather, WeatherData } from '../../services/openMeteoService';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

export const SuperAppHome: React.FC = () => {
  const { user, tasks, toggleTaskStatus, habits, toggleHabitDay, properties, matrimonyProfiles, tutors, setActiveMiniApp, showToast } = useSuperApp();
  const { askBrain, toggleAgentDrawer } = useOmniBrain();

  const [quickInput, setQuickInput] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const loadUserLocationWeather = () => {
    setLoadingWeather(true);
    fetchUserCurrentLocationWeather()
      .then((data) => {
        setWeather(data);
      })
      .catch(() => {
        // Handled silently
      })
      .finally(() => {
        setLoadingWeather(false);
      });
  };

  useEffect(() => {
    loadUserLocationWeather();
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    askBrain(quickInput);
    toggleAgentDrawer();
    setQuickInput('');
  };

  const activeTasks = tasks.filter((t) => t.status !== 'done').slice(0, 3);
  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      
      {/* 3D Hero Welcome & OmniBrain Assistant Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 via-purple-950/80 to-slate-950 border border-indigo-500/40 p-5 sm:p-7 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.25)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="max-w-xl space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-1.5 leading-normal">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
                <span>LifeOS Command Center</span>
              </span>
              <span className="text-[11px] text-slate-300 font-semibold">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              Good day, <span className="bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Your 12-in-1 Aditi ecosystem is synchronized in 3D. You have {activeTasks.length} pending tasks, 1 upcoming tutor session, and 3 new matrimony matches today.
            </p>

            {/* Quick OmniBrain Prompt Launcher */}
            <form onSubmit={handleQuickSubmit} className="pt-2 flex gap-2 w-full max-w-md">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Ask Aditi Brain (e.g. 'book tutor', 'draw anime city')..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-indigo-500/40 text-xs text-white placeholder-slate-400 shadow-inner focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 shadow-[0_4px_16px_rgba(99,102,241,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all flex-shrink-0 border border-white/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Execute</span>
              </button>
            </form>
          </div>

          {/* Live User Current Location Weather Widget */}
          {weather && (
            <div className="flex-shrink-0 p-4 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl flex items-center gap-3 w-full sm:w-auto min-w-[210px] shadow-3d-lg relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-amber-500/40 flex items-center justify-center text-amber-300 flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Sun className="w-7 h-7 animate-spin-slow" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white tracking-tight drop-shadow">{weather.temperature}°C</span>
                    <span className="text-xs font-bold text-amber-300">{weather.condition}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      loadUserLocationWeather();
                      showToast('📍 Updating temperature for current location...');
                    }}
                    className="p-1 rounded-lg hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-white transition-colors"
                    title="Refresh Location Temperature"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingWeather ? 'animate-spin text-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200 truncate mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{weather.city}</span>
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span>Humidity {weather.humidity}%</span>
                  <button
                    type="button"
                    onClick={() => setActiveMiniApp('utilities')}
                    className="font-bold text-indigo-300 hover:underline flex items-center gap-0.5"
                  >
                    <span>Forecast</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ambient decorative glowing 3D backdrop aura */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none animate-pulse-slow"></div>
      </div>

      {/* Mini-App Quick Launch Row (Isometric 3D App Tiles) */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-xs sm:text-sm text-slate-200 tracking-wide uppercase flex items-center gap-1.5 sm:gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Featured 3D Verticals</span>
          </h2>
          <span className="text-[11px] text-indigo-300 font-bold">1-Tap 3D Launch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {[
            { id: 'media_studio', name: 'AI Creative Studio', icon: <Palette className="w-5 h-5" />, desc: 'FLUX Art & Video', color: 'from-pink-500 via-rose-500 to-pink-600', shadow: 'shadow-[0_8px_20px_-4px_rgba(236,72,153,0.5)]' },
            { id: 'astrology', name: 'Astrology & Tarot', icon: <MoonStar className="w-5 h-5" />, desc: 'Kundali & Horoscopes', color: 'from-purple-500 via-indigo-600 to-purple-700', shadow: 'shadow-[0_8px_20px_-4px_rgba(168,85,247,0.5)]' },
            { id: 'realestate', name: 'Real Estate', icon: <Building2 className="w-5 h-5" />, desc: 'Luxury Buy & Rent', color: 'from-amber-500 via-orange-500 to-amber-600', shadow: 'shadow-[0_8px_20px_-4px_rgba(245,158,11,0.5)]' },
            { id: 'matrimony', name: 'Matrimony', icon: <Heart className="w-5 h-5" />, desc: 'Verified Matches', color: 'from-rose-500 via-pink-600 to-rose-700', shadow: 'shadow-[0_8px_20px_-4px_rgba(244,63,94,0.5)]' },
            { id: 'tutor', name: 'Tutor Academy', icon: <GraduationCap className="w-5 h-5" />, desc: '1-on-1 Mentorship', color: 'from-emerald-500 via-teal-600 to-emerald-700', shadow: 'shadow-[0_8px_20px_-4px_rgba(16,185,129,0.5)]' },
            { id: 'chat', name: 'AditiChat & Calls', icon: <Send className="w-5 h-5" />, desc: 'P2P Video & Voice', color: 'from-blue-600 via-indigo-600 to-blue-700', shadow: 'shadow-[0_8px_20px_-4px_rgba(59,130,246,0.5)]' },
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveMiniApp(app.id as MiniAppId)}
              className="p-3.5 sm:p-4 rounded-3xl card-3d card-3d-interactive text-left transition-all group flex flex-col justify-between"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white ${app.shadow} mb-2.5 group-hover:scale-110 group-hover:-translate-y-1 transition-all border border-white/25 shadow-inner`}>
                {app.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-indigo-200 transition-colors truncate">
                  {app.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{app.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: LifeOS Productivity + Marketplaces Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Column 1: Daily Tasks & Habit Streaks */}
        <div className="space-y-4">
          
          {/* Tasks Widget */}
          <div className="p-4 sm:p-5 rounded-3xl card-3d space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Today's Priorities</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-indigo-300 border border-indigo-500/30">
                {completedTasksCount}/{tasks.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {activeTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">All tasks completed for today! 🎉</p>
              ) : (
                activeTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 flex items-start gap-2.5 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={t.status === 'done'}
                      onChange={() => toggleTaskStatus(t.id)}
                      className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{t.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded-md font-bold uppercase ${
                          t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {t.priority}
                        </span>
                        <span>{t.dueDate || 'No due date'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveMiniApp('productivity')}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-xs font-bold text-indigo-300 hover:text-white border border-slate-800 shadow-3d-sm transition-all"
            >
              Open Full Kanban & Calendar →
            </button>
          </div>

          {/* Habits Streak Widget */}
          <div className="p-4 sm:p-5 rounded-3xl card-3d space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Daily Habit Streaks</h3>
              </div>
              <span className="text-[11px] font-black text-orange-400">Active</span>
            </div>

            <div className="space-y-2.5">
              {habits.map((h) => (
                <div key={h.id} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
                    <span className="truncate pr-2">{h.name}</span>
                    <span className="text-orange-400 font-bold flex-shrink-0">{h.streak}d streak 🔥</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 justify-between">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleHabitDay(h.id, idx)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-[11px] font-black flex items-center justify-center transition-all active:scale-95 ${
                          h.completedDays[idx]
                            ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_2px_8px_rgba(99,102,241,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20'
                            : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 2: Marketplaces - Real Estate & Tutors Highlights */}
        <div className="space-y-4">
          
          {/* Real Estate Quick Highlight */}
          <div className="p-4 sm:p-5 rounded-3xl card-3d space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Featured Property</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('realestate')}
                className="text-xs font-bold text-indigo-400 hover:underline"
              >
                View all ({properties.length})
              </button>
            </div>

            {properties[0] && (
              <div
                onClick={() => setActiveMiniApp('realestate')}
                className="rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800 cursor-pointer group hover:border-amber-500/40 shadow-3d transition-all"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={properties[0].images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                    alt={properties[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-amber-300 border border-amber-500/30">
                    {properties[0].type} • {properties[0].listingType}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-indigo-600/90 text-white text-xs font-black shadow-lg">
                    {properties[0].priceFormatted}
                  </div>
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition-colors">
                    {properties[0].title}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                    <span>{properties[0].location || properties[0].city}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tutors Quick Highlight */}
          <div className="p-4 sm:p-5 rounded-3xl card-3d space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Top Certified Mentors</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('tutor')}
                className="text-xs font-bold text-indigo-400 hover:underline"
              >
                Explore all
              </button>
            </div>

            <div className="space-y-2">
              {tutors.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveMiniApp('tutor')}
                  className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={getSafeAvatarUrl(t.avatar, t.name)}
                      alt={t.name}
                      onError={(e) => handleAvatarError(e, t.name)}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40 flex-shrink-0 shadow-md"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                        {t.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{t.subjects.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-black text-xs text-emerald-400">${t.hourlyRate}/hr</span>
                    <span className="text-[9px] text-slate-500 block">⭐ {t.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 3: Matrimony & AI Media Feed Spotlight */}
        <div className="space-y-4">
          
          {/* Matrimony Spotlight */}
          <div className="p-4 sm:p-5 rounded-3xl card-3d space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Curated Matches</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('matrimony')}
                className="text-xs font-bold text-indigo-400 hover:underline"
              >
                View ({matrimonyProfiles.length})
              </button>
            </div>

            {matrimonyProfiles[0] && (
              <div
                onClick={() => setActiveMiniApp('matrimony')}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 cursor-pointer group hover:border-pink-500/40 shadow-3d transition-all flex items-center gap-3.5"
              >
                <img
                  src={getSafeAvatarUrl(matrimonyProfiles[0].photos[0], matrimonyProfiles[0].name)}
                  alt={matrimonyProfiles[0].name}
                  onError={(e) => handleAvatarError(e, matrimonyProfiles[0].name)}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-500/40 flex-shrink-0 shadow-lg"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-white group-hover:text-pink-300 transition-colors truncate">
                      {matrimonyProfiles[0].name}, {matrimonyProfiles[0].age}
                    </h4>
                    {matrimonyProfiles[0].isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{matrimonyProfiles[0].profession}</p>
                  <p className="text-[10px] text-pink-300 font-semibold mt-0.5">{matrimonyProfiles[0].city} • {matrimonyProfiles[0].community}</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Creative Studio Spotlight */}
          <div className="p-4 sm:p-5 rounded-3xl card-3d space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">AI Image Generation</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('media_studio')}
                className="text-xs font-bold text-indigo-400 hover:underline"
              >
                Launch Studio
              </button>
            </div>

            <div
              onClick={() => setActiveMiniApp('media_studio')}
              className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 cursor-pointer group shadow-3d"
            >
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                alt="AI Artwork"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                <p className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors">
                  🎨 FLUX.1 Pro Generative Synthesis & Kerala Kasavu AI
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
