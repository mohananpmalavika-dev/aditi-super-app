import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Building2, 
  Heart, 
  GraduationCap, 
  Palette, 
  MoonStar, 
  Wallet, 
  CheckSquare, 
  ArrowUpRight, 
  Flame, 
  Calendar,
  Send,
  Zap,
  TrendingUp,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { useOmniBrain } from '../../context/OmniBrainContext';
import { fetchUserCurrentLocationWeather, fetchLiveWeather, WeatherData } from '../../services/openMeteoService';
import { MiniAppId } from '../../types/superApp';

export const SuperAppHome: React.FC = () => {
  const { 
    user, 
    tasks, 
    toggleTaskStatus, 
    habits, 
    toggleHabitDay, 
    properties, 
    matrimonyProfiles, 
    tutors, 
    setActiveMiniApp,
    alerts,
    showToast
  } = useSuperApp();
  const { toggleAgentDrawer, askBrain } = useOmniBrain();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const loadUserLocationWeather = () => {
    setLoadingWeather(true);
    fetchUserCurrentLocationWeather()
      .then((data) => {
        setWeather(data);
        setLoadingWeather(false);
      })
      .catch(() => {
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
    <div className="space-y-6 pb-20">
      
      {/* Hero Welcome & OmniBrain Assistant Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 animate-spin-slow text-yellow-300" />
                <span>LifeOS Command Center</span>
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good day, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your 12-in-1 Aditi ecosystem is synchronized. You have {activeTasks.length} pending tasks, 1 upcoming tutor session, and 3 new matrimony matches today.
            </p>

            {/* Quick OmniBrain Prompt Launcher */}
            <form onSubmit={handleQuickSubmit} className="pt-2 flex gap-2 max-w-md">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Ask Aditi Brain (e.g. 'book tutor', 'draw cyberpunk cat')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Execute</span>
              </button>
            </form>
          </div>

          {/* Live User Current Location Weather Widget */}
          {weather && (
            <div className="flex-shrink-0 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 min-w-[220px] shadow-xl relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-inner">
                <Sun className="w-7 h-7 animate-spin-slow" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white tracking-tight">{weather.temperature}°C</span>
                    <span className="text-xs font-semibold text-amber-300">{weather.condition}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      loadUserLocationWeather();
                      showToast('📍 Updating temperature for current location...');
                    }}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Refresh Location Temperature"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingWeather ? 'animate-spin text-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 truncate mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{weather.city}</span>
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span>Humidity {weather.humidity}%</span>
                  <button
                    type="button"
                    onClick={() => setActiveMiniApp('utilities')}
                    className="font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Forecast</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ambient decorative glowing backdrop blur */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Mini-App Quick Launch Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-slate-200 tracking-wide uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Featured Verticals</span>
          </h2>
          <span className="text-xs text-slate-400">1-Click Launch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'media_studio', name: 'AI Creative Studio', icon: <Palette className="w-5 h-5" />, desc: 'FLUX Art & Video', color: 'from-pink-500 to-rose-600' },
            { id: 'astrology', name: 'Astrology & Tarot', icon: <MoonStar className="w-5 h-5" />, desc: 'Kundali & Horoscopes', color: 'from-purple-500 to-indigo-600' },
            { id: 'realestate', name: 'Real Estate', icon: <Building2 className="w-5 h-5" />, desc: 'Luxury Buy & Rent', color: 'from-amber-500 to-orange-600' },
            { id: 'matrimony', name: 'Matrimony', icon: <Heart className="w-5 h-5" />, desc: 'Verified Matches', color: 'from-rose-500 to-pink-600' },
            { id: 'tutor', name: 'Tutor Academy', icon: <GraduationCap className="w-5 h-5" />, desc: '1-on-1 Mentorship', color: 'from-emerald-500 to-teal-600' },
            { id: 'chat', name: 'AditiChat & Calls', icon: <Send className="w-5 h-5" />, desc: 'P2P Video & Voice', color: 'from-blue-600 to-indigo-600' },
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveMiniApp(app.id as MiniAppId)}
              className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group flex flex-col justify-between"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                {app.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  {app.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{app.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: LifeOS Productivity + Real-World Verticals Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Daily Tasks & Habit Streaks */}
        <div className="space-y-4">
          
          {/* Tasks Widget */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Today's Priorities</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
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
                    className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 flex items-start gap-2.5 transition-colors"
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
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                          t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
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
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
            >
              Open Full Kanban & Calendar →
            </button>
          </div>

          {/* Habits Streak Widget */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-white">Daily Habit Streaks</h3>
              </div>
              <span className="text-xs font-bold text-orange-400">Active</span>
            </div>

            <div className="space-y-2.5">
              {habits.map((h) => (
                <div key={h.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1.5">
                    <span>{h.name}</span>
                    <span className="text-orange-400 font-bold">{h.streak} day streak 🔥</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-between">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleHabitDay(h.id, idx)}
                        className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                          h.completedDays[idx]
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40'
                            : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
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
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Featured Property</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('realestate')}
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                View all ({properties.length})
              </button>
            </div>

            {properties[0] && (
              <div
                onClick={() => setActiveMiniApp('realestate')}
                className="rounded-2xl overflow-hidden bg-slate-800/60 border border-slate-700/50 cursor-pointer group hover:border-indigo-500/40 transition-all"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={properties[0].images[0]}
                    alt={properties[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white">
                    {properties[0].type} • {properties[0].listingType}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-indigo-600/90 text-xs font-extrabold text-white">
                    {properties[0].priceFormatted}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-white truncate">{properties[0].title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{properties[0].location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tutor & Learning Highlight */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Certified Mentors</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('tutor')}
                className="text-xs font-semibold text-emerald-400 hover:underline"
              >
                Find Tutor
              </button>
            </div>

            {tutors[0] && (
              <div
                onClick={() => setActiveMiniApp('tutor')}
                className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <img
                  src={tutors[0].avatar}
                  alt={tutors[0].name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white truncate">{tutors[0].name}</h4>
                    <span className="text-xs font-extrabold text-emerald-400">${tutors[0].hourlyRate}/hr</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium truncate">{tutors[0].subjects[0]}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">⭐ {tutors[0].rating} ({tutors[0].reviewCount} reviews)</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Column 3: Matrimony Matches & Astrology Preview */}
        <div className="space-y-4">
          
          {/* Matrimony Highlight */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Matchmaking Picks</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('matrimony')}
                className="text-xs font-semibold text-rose-400 hover:underline"
              >
                View Matches
              </button>
            </div>

            {matrimonyProfiles[0] && (
              <div
                onClick={() => setActiveMiniApp('matrimony')}
                className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <img
                  src={matrimonyProfiles[0].photos[0]}
                  alt={matrimonyProfiles[0].name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white truncate">
                      {matrimonyProfiles[0].name}, {matrimonyProfiles[0].age}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {matrimonyProfiles[0].compatibilityScore}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">{matrimonyProfiles[0].profession}</p>
                  <p className="text-[10px] text-slate-400">{matrimonyProfiles[0].city} • {matrimonyProfiles[0].education.split('(')[0]}</p>
                </div>
              </div>
            )}
          </div>

          {/* Daily Astrology & Tarot Peek */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MoonStar className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Daily Horoscope: {user.zodiacSign} ♌</h3>
              </div>
              <button
                onClick={() => setActiveMiniApp('astrology')}
                className="text-xs font-semibold text-purple-400 hover:underline"
              >
                Kundali & Tarot
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic bg-purple-950/30 p-3 rounded-2xl border border-purple-800/30">
              "Sun & Jupiter alignment amplifies your natural leadership and creative output today. Auspicious time for career pitches and bold investments."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
