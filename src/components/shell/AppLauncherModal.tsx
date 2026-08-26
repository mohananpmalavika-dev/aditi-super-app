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
  Wallet, 
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
    icon: <Home className="w-6 h-6" />,
    description: 'Central Command Center, Daily Briefing & LifeOS Widgets',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'brain',
    name: 'Aditi Brain AI',
    category: 'creative',
    icon: <Sparkles className="w-6 h-6" />,
    description: 'Autonomous AI Core, Cross-App Dispatcher & Reasoning Memory',
    badge: 'AGY AI',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'media_studio',
    name: 'AI Media Studio',
    category: 'creative',
    icon: <Palette className="w-6 h-6" />,
    description: 'FLUX Image Generator, Text-to-Video & Web Video Editor',
    badge: '100% Free',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'astrology',
    name: 'Astrology & Tarot',
    category: 'lifestyle',
    icon: <MoonStar className="w-6 h-6" />,
    description: 'Daily Horoscopes, Vedic Kundali & 3-Card Tarot Deck',
    badge: 'Mystic',
    color: 'from-indigo-500 to-violet-600'
  },
  {
    id: 'social',
    name: 'Social Media Feed',
    category: 'lifestyle',
    icon: <Share2 className="w-6 h-6" />,
    description: 'Explore Stories, Posts, Creator Feed & Trending Hashtags',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'matrimony',
    name: 'Matrimony & Dating',
    category: 'lifestyle',
    icon: <Heart className="w-6 h-6" />,
    description: 'Verified Matchmaking, Compatibility Scoring & Connection Requests',
    badge: 'Verified',
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'realestate',
    name: 'Real Estate Portal',
    category: 'commerce',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Buy & Rent Luxury Homes, Mortgage Calculator & Agent Tours',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'tutor',
    name: 'Tutor & Skill Academy',
    category: 'commerce',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Find Certified Mentors in Tech, Math, Music & Book 1-on-1 Sessions',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'chat',
    name: 'Chat & Messenger',
    category: 'daily',
    icon: <MessageSquare className="w-6 h-6" />,
    description: 'Real-Time Messaging with Agents, Tutors, Matches & AI Bot',
    badge: 'Live',
    color: 'from-sky-500 to-indigo-600'
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    category: 'daily',
    icon: <Wallet className="w-6 h-6" />,
    description: 'P2P Payments, Bill Recharges & Visual Spending Analytics',
    color: 'from-emerald-600 to-green-600'
  },
  {
    id: 'productivity',
    name: 'Tasks & Habits',
    category: 'daily',
    icon: <CheckSquare className="w-6 h-6" />,
    description: 'Kanban Board, Calendar Schedule & Habit Streak Tracker',
    color: 'from-indigo-600 to-blue-700'
  },
  {
    id: 'utilities',
    name: 'Utility Suite',
    category: 'daily',
    icon: <Wrench className="w-6 h-6" />,
    description: 'Open-Meteo Weather, Currency Converter & World Clocks',
    color: 'from-slate-600 to-slate-800'
  },
  {
    id: 'settings',
    name: 'Settings & Cloud Backup',
    category: 'core',
    icon: <Settings className="w-6 h-6" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>🚀 Mini-App Ecosystem</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                12 Integrated Verticals
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Instant access to creative tools, marketplaces, social, and daily essentials.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mini-apps (e.g. real estate, tutor, tarot)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {['all', 'creative', 'lifestyle', 'commerce', 'daily'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Apps' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleLaunch(app.id)}
              className="group p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    {app.icon}
                  </div>
                  {app.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {app.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {app.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-indigo-400 font-semibold">
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
