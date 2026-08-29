/**
 * NewsOS Public Digital News Portal
 * Multilingual (English + Malayalam), Hyperlocal Kerala Districts,
 * Breaking News Ticker, Daily 5-Min Audio Bulletin, Fact-Check Debunking, Live Developing Stories,
 * and Grounded "Ask News AI" Assistant.
 */

import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Sparkles, 
  Volume2, 
  Radio, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Search, 
  SlidersHorizontal, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Bookmark,
  Share2,
  Filter,
  Eye
} from 'lucide-react';
import { 
  NewsArticle, 
  NewsStory, 
  NewsLanguage, 
  NewsCategory, 
  KeralaDistrict,
  LiveStory,
  FactCheck 
} from '../../types/news';
import { getNewsArticles, filterArticles } from '../../services/news/newsArticleService';
import { getNewsStories } from '../../services/news/newsClusteringService';
import { getLiveStories } from '../../services/news/newsLiveStoryService';
import { getFactChecks } from '../../services/news/newsFactCheckService';
import { playArticleSpeech, stopArticleSpeech, generateDailyNewsBulletin } from '../../services/news/newsAudioService';
import { NewsStoryDetailModal } from './NewsStoryDetailModal';
import { AskNewsAiModal } from './AskNewsAiModal';
import { NewsroomDashboard } from './NewsroomDashboard';

const KERALA_DISTRICTS: KeralaDistrict[] = [
  'All Districts',
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

const CATEGORIES: { id: NewsCategory | 'All'; labelEn: string; labelMl: string }[] = [
  { id: 'All', labelEn: 'All Feeds', labelMl: 'എല്ലാം' },
  { id: 'Top Stories', labelEn: 'Top Stories', labelMl: 'പ്രധാന വാർത്തകൾ' },
  { id: 'Kerala', labelEn: 'Kerala', labelMl: 'കേരളം' },
  { id: 'India', labelEn: 'India', labelMl: 'ദേശീയം' },
  { id: 'Environment & Weather', labelEn: 'Weather & Climate', labelMl: 'കാലാവസ്ഥ' },
  { id: 'Technology & AI', labelEn: 'Tech & AI', labelMl: 'ടെക് & എഐ' },
  { id: 'Business & Economy', labelEn: 'Business', labelMl: 'ബിസിനസ്' },
  { id: 'Health & Science', labelEn: 'Health', labelMl: 'ആരോഗ്യം' },
  { id: 'Fact Check', labelEn: 'Fact Check', labelMl: 'ഫാക്റ്റ് ചെക്ക്' }
];

export const NewsPortalView: React.FC = () => {
  // State
  const [articles, setArticles] = useState<NewsArticle[]>(getNewsArticles());
  const [stories, setStories] = useState<NewsStory[]>(getNewsStories());
  const [liveStories, setLiveStories] = useState<LiveStory[]>(getLiveStories());
  const [factChecks, setFactChecks] = useState<FactCheck[]>(getFactChecks());

  const [currentLanguage, setCurrentLanguage] = useState<NewsLanguage>('en');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<KeralaDistrict>('All Districts');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Modals & Views
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [isNewsroomMode, setIsNewsroomMode] = useState(false);

  // Audio Bulletin State
  const [isPlayingBulletin, setIsPlayingBulletin] = useState(false);

  const refreshPortalData = () => {
    setArticles(getNewsArticles());
    setStories(getNewsStories());
    setLiveStories(getLiveStories());
    setFactChecks(getFactChecks());
  };

  const filteredArticles = filterArticles(articles, {
    language: currentLanguage,
    category: selectedCategory,
    district: selectedDistrict,
    searchQuery
  });

  const featuredArticle = filteredArticles[0] || null;
  const secondaryArticles = filteredArticles.slice(1);
  const activeLiveStory = liveStories.find(l => l.status === 'active') || liveStories[0];

  const handlePlayBulletin = () => {
    if (isPlayingBulletin) {
      stopArticleSpeech();
      setIsPlayingBulletin(false);
    } else {
      const bulletin = generateDailyNewsBulletin(articles, currentLanguage);
      if (filteredArticles[0]) {
        const dummyArticle: NewsArticle = {
          ...filteredArticles[0],
          headline: bulletin.title,
          summary: '',
          body: bulletin.bulletinScript
        };
        const ok = playArticleSpeech(dummyArticle, 1.0, () => setIsPlayingBulletin(false), () => setIsPlayingBulletin(false));
        if (ok) setIsPlayingBulletin(true);
      }
    }
  };

  if (isNewsroomMode) {
    return (
      <NewsroomDashboard
        onSwitchToReaderMode={() => {
          refreshPortalData();
          setIsNewsroomMode(false);
        }}
        onSelectArticlePreview={(art) => setSelectedArticle(art)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24">
      
      {/* ==================== 1. BREAKING NEWS TICKER ==================== */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-slate-950 border-b border-red-800/80 px-4 py-2 flex items-center gap-3 text-xs overflow-hidden">
        <div className="flex items-center gap-1.5 bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>BREAKING</span>
        </div>
        <div className="flex-1 truncate text-red-100 font-bold">
          {currentLanguage === 'ml'
            ? 'വടക്കൻ കേരളത്തിലെ 4 ജില്ലകളിൽ റെഡ് അലർട്ട്; കൺട്രോൾ റൂമുകൾ സജ്ജമാക്കി ദുരന്ത നിവാരണ അതോറിറ്റി'
            : 'IMD Declares Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod; KSDMA Sets Up 24x7 Emergency Control Rooms'}
        </div>
      </div>

      {/* ==================== 2. MAIN PORTAL HEADER ==================== */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight">
                  News<span className="text-indigo-400">OS</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Multilingual Digital News Portal • Kerala & India</p>
            </div>
          </div>

          {/* Controls: Search, Language Switcher, Ask AI, Newsroom Control */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => setCurrentLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentLanguage === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLanguage('ml')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentLanguage === 'ml' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                മലയാളം
              </button>
            </div>

            {/* Ask News AI Button */}
            <button
              onClick={() => setIsAskAiOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask News AI</span>
            </button>

            {/* Newsroom Mode Switcher */}
            <button
              onClick={() => setIsNewsroomMode(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Open Editorial Control Desk"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">AI Newsroom</span>
            </button>

          </div>

        </div>
      </header>

      {/* ==================== 3. CATEGORY & DISTRICT FILTERS ==================== */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {currentLanguage === 'ml' ? cat.labelMl : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Kerala District Dropdown Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as KeralaDistrict)}
              className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {KERALA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ==================== 4. DAILY 5-MIN AUDIO BULLETIN BAR ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 w-full">
        <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/60 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayBulletin}
              className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{currentLanguage === 'ml' ? 'പ്രഭാത 5-മിനിറ്റ് വാർത്താ ബുള്ളറ്റിൻ' : 'Daily 5-Minute News Audio Bulletin'}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300">
                  AI VOICE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isPlayingBulletin ? 'Playing voice briefing...' : 'Listen to top stories in 5 minutes'}
              </p>
            </div>
          </div>

          <button
            onClick={handlePlayBulletin}
            className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
          >
            {isPlayingBulletin ? 'Pause Briefing' : 'Play Briefing 🎧'}
          </button>
        </div>
      </div>

      {/* ==================== 5. PORTAL MAIN CONTENT GRID ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 w-full space-y-8 flex-1">
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Newspaper className="w-12 h-12 text-indigo-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No News Reports Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No published articles match the selected district or category. Switch language or category to explore more verified stories.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* HERO FEATURED STORY CARD */}
            {featuredArticle && (
              <div
                onClick={() => setSelectedArticle(featuredArticle)}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-2xl transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
              >
                {/* Image Section */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[260px] overflow-hidden bg-slate-950">
                  {featuredArticle.primaryImageUrl ? (
                    <img
                      src={featuredArticle.primaryImageUrl}
                      alt={featuredArticle.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                      <Newspaper className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent lg:hidden" />
                </div>

                {/* Content Section */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-slate-900/90">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {featuredArticle.category}
                      </span>
                      {featuredArticle.district && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-400" />
                          {featuredArticle.district}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {featuredArticle.headline}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(featuredArticle.publishedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Full Story →
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SECONDARY STORIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {secondaryArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/40 p-5 shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Image */}
                    {art.primaryImageUrl && (
                      <div className="rounded-2xl overflow-hidden h-40 bg-slate-950 border border-slate-800/60">
                        <img
                          src={art.primaryImageUrl}
                          alt={art.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {art.category}
                      </span>
                      {art.district && (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-indigo-400" />
                          {art.district}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                      {art.headline}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span>{new Date(art.publishedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== 6. FACT CHECK DEBUNKING SECTION ==================== */}
        {factChecks.length > 0 && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black text-white">
                  {currentLanguage === 'ml' ? 'ഫാക്റ്റ് ചെക്ക് & വ്യാജവാർത്ത പരിശോധന' : 'Fact Check & Viral Misinformation Debunking'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {factChecks.map((fc) => (
                <div key={fc.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400">{fc.claimant}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                      {fc.classification}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    "{fc.claim}"
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentLanguage === 'ml' && fc.explanationMalayalam ? fc.explanationMalayalam : fc.explanation}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Verified by: <strong className="text-slate-300">{fc.reviewer}</strong></span>
                    <span>{new Date(fc.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ==================== 7. ARTICLE READER DETAIL MODAL ==================== */}
      {selectedArticle && (
        <NewsStoryDetailModal
          article={selectedArticle}
          story={stories.find(s => s.id === selectedArticle.storyId) || null}
          onClose={() => setSelectedArticle(null)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {/* ==================== 8. ASK NEWS AI MODAL DRAWER ==================== */}
      {isAskAiOpen && (
        <AskNewsAiModal
          onClose={() => setIsAskAiOpen(false)}
          onOpenArticle={(articleId) => {
            const found = articles.find(a => a.id === articleId);
            if (found) {
              setIsAskAiOpen(false);
              setSelectedArticle(found);
            }
          }}
        />
      )}

    </div>
  );
};
