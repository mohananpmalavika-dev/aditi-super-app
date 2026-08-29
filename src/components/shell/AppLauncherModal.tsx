import React, { useState } from 'react';
import { 
  X, 
  Home, 
  Sparkles, 
  Palette, 
  Share2, 
  MoonStar, 
  Building2, 
  Heart, 
  GraduationCap, 
  MessageSquare, 
  CheckSquare, 
  Wrench, 
  Settings,
  Search
} from 'lucide-react';
import { MiniAppId } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';

interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MiniAppMeta {
  id: MiniAppId;
  name: string;
  category: 'core' | 'creative' | 'lifestyle' | 'commerce' | 'daily';
  icon: React.ReactNode;
  description: string;
  badge?: string;
  color: string;
}

const MINI_APPS: MiniAppMeta[] = [
  {
    id: 'home',
    name: 'Home Hub',
    category: 'core',
    icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Central Command Center, Daily Briefing & LifeOS Widgets',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'brain',
    name: 'Aditi Brain AI',
    category: 'creative',
    icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Autonomous AI Core, Cross-App Dispatcher & Reasoning Memory',
    badge: 'AGY AI',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'media_studio',
    name: 'AI Media Studio',
    category: 'creative',
    icon: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'FLUX Image Generator, Text-to-Video & Web Video Editor',
    badge: '100% Free',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'astrology',
    name: 'Astrology & Tarot',
    category: 'lifestyle',
    icon: <MoonStar className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Daily Horoscopes, Vedic Kundali & 3-Card Tarot Deck',
    badge: 'Mystic',
    color: 'from-indigo-500 to-violet-600'
  },
  {
    id: 'social',
    name: 'Social Media Feed',
    category: 'lifestyle',
    icon: <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Explore Stories, Posts, Creator Feed & Trending Hashtags',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'matrimony',
    name: 'Matrimony & Matchmaking',
    category: 'lifestyle',
    icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Verified Matchmaking, Compatibility Scoring & Connection Requests',
    badge: 'Verified',
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'realestate',
    name: 'Real Estate Portal',
    category: 'commerce',
    icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Buy & Rent Luxury Homes, Mortgage Calculator & Agent Tours',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'tutor',
    name: 'Tutor & Skill Academy',
    category: 'commerce',
    icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Find Certified Mentors in Tech, Math, Music & Book 1-on-1 Sessions',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'chat',
    name: 'Chat & Messenger',
    category: 'daily',
    icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Real-Time Messaging with Agents, Tutors, Matches & AI Bot',
    badge: 'Live',
    color: 'from-sky-500 to-indigo-600'
  },
  {
    id: 'productivity',
    name: 'Tasks & Habits',
    category: 'daily',
    icon: <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Kanban Board, Calendar Schedule & Habit Streak Tracker',
    color: 'from-indigo-600 to-blue-700'
  },
  {
    id: 'settings',
    name: 'Settings & Cloud Backup',
    category: 'core',
    icon: <Settings className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Theme customization, JSON Export/Restore & Profile Editor',
    color: 'from-gray-600 to-gray-800'
  }
];

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({ isOpen, onClose }) => {
  const { setActiveMiniApp } = useSuperApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredApps = MINI_APPS.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                          app.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLaunch = (appId: MiniAppId) => {
    setActiveMiniApp(appId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90dvh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl glass-sheet border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.25)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2">
        
        {/* Modal Handle (Mobile) & Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col gap-2 bg-slate-950/40">
          <div className="w-12 h-1 rounded-full bg-slate-700 mx-auto sm:hidden" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 drop-shadow-sm">
                <span>🚀 Mini-App Launcher</span>
                <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                  12 Verticals
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">Instant access to creative AI tools, marketplaces, and daily LifeOS essentials.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 shadow-3d-sm transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/60 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mini-apps..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-400 shadow-inner focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {['all', 'creative', 'lifestyle', 'commerce', 'daily'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize whitespace-nowrap transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid (3D Cards) */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-safe">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleLaunch(app.id)}
              className="group p-4 rounded-3xl card-3d card-3d-interactive text-left transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-[0_8px_20px_-4px_rgba(99,102,241,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-all border border-white/25`}>
                    {app.icon}
                  </div>
                  {app.badge && (
                    <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-200 border border-indigo-400/30 shadow-sm">
                      {app.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-indigo-200 transition-colors">
                  {app.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                  {app.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 group-hover:text-indigo-300 font-bold">
                <span>Launch App</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
