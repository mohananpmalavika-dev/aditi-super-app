import React, { useState } from 'react';
import { 
  MoonStar, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Activity, 
  Layers, 
  RotateCcw, 
  Compass, 
  Sun, 
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  Calendar,
  Send,
  Flame,
  CheckCircle2,
  Navigation,
  Globe
} from 'lucide-react';
import { calculateVedicKundali, TAROT_DECK } from '../../services/astrologyEngine';
import { 
  MALAYALAM_RASHIS, 
  MalayalamRashiInfo, 
  calculateAstrologicalPrashnam, 
  PrashnaResult,
  getLiveMalayalamPanchangam 
} from '../../services/malayalamAstroService';
import { TarotCardData } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

export const AstrologyView: React.FC = () => {
  const { user, showToast } = useSuperApp();
  
  // Language & Tab State
  const [lang, setLang] = useState<'ml' | 'en'>('ml');
  const [activeTab, setActiveTab] = useState<'horoscope' | 'prashnam' | 'kundali' | 'tarot' | 'compatibility'>('horoscope');
  const [horoscopePeriod, setHoroscopePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  // Selected Malayalam Rashi
  const [selectedRashi, setSelectedRashi] = useState<MalayalamRashiInfo>(() => {
    const userZodiac = (user.zodiacSign || 'Leo').toLowerCase();
    return MALAYALAM_RASHIS.find((r) => r.nameEnglish.toLowerCase() === userZodiac) || MALAYALAM_RASHIS[4]; // Default Leo (ചിങ്ങം)
  });

  // Live Panchangam
  const panchangam = getLiveMalayalamPanchangam();

  /* ========== QUESTION-BASED PRASHNAM (പ്രശ്ന ജ്യോതിഷം) STATE ========== */
  const [questionInput, setQuestionInput] = useState('');
  const [prashnaResult, setPrashnaResult] = useState<PrashnaResult | null>(() => 
    calculateAstrologicalPrashnam('എന്റെ പുതിയ സംരംഭം വിജയകരമാകുമോ? (Will my new venture prosper?)')
  );
  const [isCalculatingPrashnam, setIsCalculatingPrashnam] = useState(false);

  const handleAskPrashnam = (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const q = customQuestion || questionInput;
    if (!q.trim()) {
      showToast(lang === 'ml' ? '⚠️ ദയവായി നിങ്ങളുടെ ചോദ്യം നൽകുക.' : '⚠️ Please enter your question.');
      return;
    }

    setIsCalculatingPrashnam(true);
    setTimeout(() => {
      const res = calculateAstrologicalPrashnam(q.trim());
      setPrashnaResult(res);
      setIsCalculatingPrashnam(false);
      confetti({ particleCount: 60, spread: 60 });
      showToast(lang === 'ml' ? '🔮 പ്രശ്നഫലം വിജയകരമായി ഗണിച്ചു!' : '🔮 Horary Prashna Chart Calculated!');
    }, 600);
  };

  /* ========== KUNDALI GENERATOR STATE ========== */
  const [birthName, setBirthName] = useState(user.name);
  const [birthDate, setBirthDate] = useState(user.dateOfBirth || '1998-08-15');
  const [birthTime, setBirthTime] = useState(user.timeOfBirth || '10:30');
  const [birthPlace, setBirthPlace] = useState(user.placeOfBirth || 'Kollam, Kerala, India');
  const [kundaliReport, setKundaliReport] = useState(() =>
    calculateVedicKundali(
      user.name, 
      user.dateOfBirth || '1998-08-15', 
      user.timeOfBirth || '10:30', 
      user.placeOfBirth || 'Kollam, Kerala, India'
    )
  );

  const handleComputeKundali = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateVedicKundali(birthName, birthDate, birthTime, birthPlace);
    setKundaliReport(result);
    confetti({ particleCount: 50, spread: 60 });
    showToast(lang === 'ml' ? '✨ ജാതക ഗണിത ഫലം തയ്യാറായി!' : '✨ Vedic Kundali Birth Chart Calculated!');
  };

  /* ========== 3-CARD TAROT READER STATE ========== */
  const [drawnCards, setDrawnCards] = useState<Array<{ card: TarotCardData; isFlipped: boolean; position: string }>>([
    { card: TAROT_DECK[0], isFlipped: true, position: 'Past Influences' },
    { card: TAROT_DECK[1], isFlipped: true, position: 'Present Situation' },
    { card: TAROT_DECK[7], isFlipped: true, position: 'Future Outcome' }
  ]);

  const drawNewTarotCards = () => {
    const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
    setDrawnCards([
      { card: shuffled[0], isFlipped: true, position: 'Past Influences' },
      { card: shuffled[1], isFlipped: true, position: 'Present Situation' },
      { card: shuffled[2], isFlipped: true, position: 'Future Outcome' }
    ]);
    confetti({ particleCount: 70, spread: 70 });
    showToast(lang === 'ml' ? '🃏 ടാരോ കാർഡുകൾ വെളിപ്പെട്ടു!' : '🔮 Mystical 3-Card Spread Revealed!');
  };

  /* ========== ZODIAC COMPATIBILITY STATE ========== */
  const [compatSign1, setCompatSign1] = useState('ചിങ്ങം (Leo)');
  const [compatSign2, setCompatSign2] = useState('ധനു (Sagittarius)');

  const popularKeralaQuestions = [
    { ml: 'എനിക്ക് എപ്പോഴാണ് പുതിയ ജോലി ലഭിക്കുക?', en: 'When will I get a new job promotion?' },
    { ml: 'വിദേശത്ത് ജോലി അല്ലെങ്കിൽ പഠനം സാധ്യമാകുമോ?', en: 'Will my foreign study or visa succeed?' },
    { ml: 'പുതിയ വീട് / വസ്തു വാങ്ങാൻ പറ്റിയ സമയമാണോ?', en: 'Is this the right time to buy property in Kerala?' },
    { ml: 'വിവാഹ കാര്യങ്ങളിൽ എപ്പോഴാണ് അനുകൂല തീരുമാനമുണ്ടാകുക?', en: 'When will marriage alliance be finalized?' },
    { ml: 'പുതിയ ബിസിനസ്സ് ആരംഭിച്ചാൽ ലാഭകരമാകുമോ?', en: 'Will my new business venture generate wealth?' }
  ];

  return (
    <div className="space-y-5 pb-20">
      
      {/* Studio Header with Bilingual Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <MoonStar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {lang === 'ml' ? 'മലയാള ജ്യോതിഷം & പ്രശ്ന ചിന്ത' : 'Kerala Vedic Astrology & Prashnam'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1201 കൊല്ലവർഷം
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'ml' 
                ? 'ദിവസഫലം, വാരഫലം, മാസഫലം, 2026 വർഷഫലം, പ്രശ്ന ജ്യോതിഷം, പഞ്ചാംഗം & ജാതക ഗണിതം.' 
                : 'Daily, Weekly, Monthly, 2026 Yearly Horoscopes, Horary Prashna Oracle & Kundali.'}
            </p>
          </div>
        </div>

        {/* Language Switcher & Tab Bar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Language Toggle Button */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setLang('ml')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                lang === 'ml'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>മലയാളം</span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                lang === 'en'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>English</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('horoscope')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'horoscope'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'രാശിഫലം' : 'Horoscopes'}</span>
            </button>

            <button
              onClick={() => setActiveTab('prashnam')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'prashnam'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? '🔮 പ്രശ്ന ചിന്ത (ചോദ്യം)' : '🔮 Horary Prashnam'}</span>
            </button>

            <button
              onClick={() => setActiveTab('kundali')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'kundali'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'ജാതകം' : 'Kundali'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tarot')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'tarot'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'ടാരോ' : 'Tarot'}</span>
            </button>

            <button
              onClick={() => setActiveTab('compatibility')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'compatibility'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'പൊരുത്തം' : 'Match'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Live Malayalam Daily Panchangam Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 border border-amber-500/30 text-xs shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🪐</span>
            <span className="font-extrabold text-amber-300">{panchangam.dayMalayalam}, {panchangam.dateString}</span>
            <span className="text-slate-400 font-mono hidden sm:inline">• {panchangam.kollamEra}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500 font-bold">തിഥി: </span>
              <span className="text-amber-200 font-semibold">{panchangam.thithiMalayalam}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold">നക്ഷത്രം: </span>
              <span className="text-indigo-200 font-semibold">{panchangam.nakshatraMalayalam}</span>
            </div>
            <div>
              <span className="text-rose-400 font-bold">രാഹുകാലം: </span>
              <span className="font-mono text-rose-300">{panchangam.rahuKalamMalayalam}</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">അഭിജിത് മുഹൂർത്തം: </span>
              <span className="font-mono text-emerald-300">{panchangam.abhijithMuhurthamMalayalam}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HOROSCOPES TAB (DAILY, WEEKLY, MONTHLY, 2026 YEARLY) */}
      {/* ========================================================================= */}
      {activeTab === 'horoscope' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Period Selector Tabs */}
          <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-900 border border-purple-500/30 max-w-lg mx-auto">
            <button
              onClick={() => setHoroscopePeriod('daily')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                horoscopePeriod === 'daily'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌅 {lang === 'ml' ? 'ദിവസഫലം' : 'Daily'}</span>
            </button>

            <button
              onClick={() => setHoroscopePeriod('weekly')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                horoscopePeriod === 'weekly'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🗓️ {lang === 'ml' ? 'വാരഫലം' : 'Weekly'}</span>
            </button>

            <button
              onClick={() => setHoroscopePeriod('monthly')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                horoscopePeriod === 'monthly'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌕 {lang === 'ml' ? 'മാസഫലം' : 'Monthly'}</span>
            </button>

            <button
              onClick={() => setHoroscopePeriod('yearly')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                horoscopePeriod === 'yearly'
                  ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white shadow-md'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>👑 {lang === 'ml' ? '2026 വർഷഫലം' : '2026 Yearly'}</span>
            </button>
          </div>

          {/* 12 Malayalam Rashis Carousel */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {MALAYALAM_RASHIS.map((r) => {
                const isSelected = selectedRashi.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRashi(r)}
                    className={`flex flex-col items-center min-w-[85px] sm:min-w-[95px] p-2.5 sm:p-3 rounded-2xl border transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-105'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl mb-1">{r.symbol}</span>
                    <span className="text-xs font-black">{lang === 'ml' ? r.nameMalayalam : r.nameEnglish}</span>
                    <span className="text-[10px] text-purple-300 mt-0.5">{lang === 'ml' ? r.nameEnglish : r.nameMalayalam}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Rashi Display & Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left Rashi Profile Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-800/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedRashi.symbol}</span>
                  <div>
                    <h2 className="text-xl font-black text-white">
                      {selectedRashi.nameMalayalam} ({selectedRashi.nameEnglish})
                    </h2>
                    <p className="text-xs text-purple-300 font-semibold">
                      {lang === 'ml' ? `അധിപൻ: ${selectedRashi.lordMalayalam}` : `Lord: ${selectedRashi.lordEnglish}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedRashi.elementMalayalam}
                </span>
              </div>

              {/* Nakshatrams */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === 'ml' ? 'ഉൾപ്പെടുന്ന നക്ഷത്രങ്ങൾ' : 'Included Nakshatras'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedRashi.nakshatrams.map((nak, i) => (
                    <span key={i} className="text-[11px] font-semibold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
                      {nak}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'ml' ? 'ഭാഗ്യ സംഖ്യ' : 'Lucky Number'}</p>
                  <p className="text-lg font-black text-amber-400">{selectedRashi.luckyNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'ml' ? 'ഭാഗ്യ നിറം' : 'Lucky Color'}</p>
                  <p className="text-xs font-black text-pink-400 mt-1 truncate">{selectedRashi.luckyColorMalayalam}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'ml' ? 'അനുകൂല ദിവസം' : 'Lucky Day'}</p>
                <p className="text-xs font-extrabold text-indigo-300 mt-0.5">{selectedRashi.luckyDayMalayalam}</p>
              </div>
            </div>

            {/* Right Predictions Panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                
                {/* 1. DAILY VIEW */}
                {horoscopePeriod === 'daily' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <Sparkles className="w-4 h-4" />
                        <span>{lang === 'ml' ? 'ദിവസഫല പൊതു അവലോകനം' : 'Daily Celestial Transit Overview'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {lang === 'ml' ? selectedRashi.daily.generalMalayalam : selectedRashi.daily.generalEnglish}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                      <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-800/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{lang === 'ml' ? 'തൊഴിൽ' : 'Career'}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {lang === 'ml' ? selectedRashi.daily.careerMalayalam : selectedRashi.daily.careerEnglish}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{lang === 'ml' ? 'സാമ്പത്തികം' : 'Finance'}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {lang === 'ml' ? selectedRashi.daily.financeMalayalam : selectedRashi.daily.financeEnglish}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                          <Heart className="w-3.5 h-3.5" />
                          <span>{lang === 'ml' ? 'ദാമ്പത്യം / പ്രണയം' : 'Love & Family'}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {lang === 'ml' ? selectedRashi.daily.loveMalayalam : selectedRashi.daily.loveEnglish}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{lang === 'ml' ? 'ജ്യോതിഷ പരിഹാരം & ക്ഷേത്ര വഴിപാട്' : 'Astrological Remedy & Puja'}</span>
                      </span>
                      <p className="text-xs text-slate-300">
                        {lang === 'ml' ? selectedRashi.daily.remedyMalayalam : selectedRashi.daily.remedyEnglish}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. WEEKLY VIEW */}
                {horoscopePeriod === 'weekly' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-purple-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span>{lang === 'ml' ? 'ഈ ആഴ്ചയിലെ വാരഫലം' : 'Comprehensive Weekly Forecast'}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {lang === 'ml' ? selectedRashi.weekly.summaryMalayalam : selectedRashi.weekly.summaryEnglish}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <h4 className="font-bold text-xs text-slate-400">
                        {lang === 'ml' ? 'പ്രധാന ഫലങ്ങൾ' : 'Key Highlights of the Week'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(lang === 'ml' ? selectedRashi.weekly.highlightsMalayalam : selectedRashi.weekly.highlightsEnglish).map((h, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{lang === 'ml' ? 'അനുകൂല ദിവസങ്ങൾ:' : 'Favorable Days:'}</span>
                      <span className="font-black text-indigo-300">{selectedRashi.weekly.favorableDaysMalayalam}</span>
                    </div>
                  </div>
                )}

                {/* 3. MONTHLY VIEW */}
                {horoscopePeriod === 'monthly' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-purple-300 flex items-center gap-2">
                        <MoonStar className="w-4 h-4 text-purple-400" />
                        <span>{lang === 'ml' ? 'സമ്പൂർണ്ണ മാസഫലം' : 'Monthly Astrological Overview'}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {lang === 'ml' ? selectedRashi.monthly.summaryMalayalam : selectedRashi.monthly.summaryEnglish}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'ml' ? 'ഗ്രഹമാറ്റ സ്വാധീനം' : 'Planetary Transits Impact'}</span>
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lang === 'ml' ? selectedRashi.monthly.transitEffectsMalayalam : selectedRashi.monthly.transitEffectsEnglish}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs space-y-1">
                      <span className="font-bold text-purple-300">{lang === 'ml' ? 'മാസ പരിഹാരം:' : 'Monthly Remedy:'}</span>
                      <p className="text-slate-300">{selectedRashi.monthly.remediesMalayalam}</p>
                    </div>
                  </div>
                )}

                {/* 4. 2026 YEARLY VIEW */}
                {horoscopePeriod === 'yearly' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-purple-950/60 border border-amber-500/40 space-y-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                        {selectedRashi.yearly.year} {lang === 'ml' ? 'സമ്പൂർണ്ണ വാർഷികഫലം' : 'Full Yearly Horoscope'}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                        {lang === 'ml' ? selectedRashi.yearly.summaryMalayalam : selectedRashi.yearly.summaryEnglish}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{lang === 'ml' ? 'വ്യാഴ-ശനി മാറ്റങ്ങൾ' : 'Guru & Saturn Transits'}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {lang === 'ml' ? selectedRashi.yearly.guruSaturnTransitMalayalam : selectedRashi.yearly.guruSaturnTransitEnglish}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-xs text-indigo-400 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{lang === 'ml' ? 'തൊഴിലും സാമ്പത്തികവും' : 'Career & Wealth 2026'}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {lang === 'ml' ? selectedRashi.yearly.careerWealthMalayalam : selectedRashi.yearly.careerWealthEnglish}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <h4 className="font-bold text-xs text-rose-400 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{lang === 'ml' ? 'കുടുംബവും ആരോഗ്യവും' : 'Family & Health'}</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lang === 'ml' ? selectedRashi.yearly.familyHealthMalayalam : selectedRashi.yearly.familyHealthEnglish}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                      <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{lang === 'ml' ? 'വർഷ പരിഹാരവും ക്ഷേത്ര വഴിപാടുകളും' : 'Annual Remedies & Pujas'}</span>
                      </span>
                      <p className="text-xs text-slate-300">
                        {lang === 'ml' ? selectedRashi.yearly.pujaPariharamMalayalam : selectedRashi.yearly.pujaPariharamEnglish}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. QUESTION-BASED PRASHNAM (പ്രശ്ന ജ്യോതിഷം / PRASHNA MARGA ORACLE) */}
      {/* ========================================================================= */}
      {activeTab === 'prashnam' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Question Input Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>{lang === 'ml' ? 'പ്രശ്ന ജ്യോതിഷ ചിന്ത (Prashna Marga Horary Oracle)' : 'Instant Prashna Horary Oracle'}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    നിമിഷ ഗ്രഹനില
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ml'
                    ? 'നിങ്ങളുടെ മനസ്സിലെ ഏത് ചോദ്യവും ഇവിടെ ചോദിക്കാം. തത്സമയ ആരൂഢ ലഗ്നം അടിസ്ഥാനമാക്കി വ്യക്തമായ ഫലവും പരിഹാരവും അറിയാം.'
                    : 'Ask any question to receive real-time horary chart computations, success probability, timeframes, and remedies.'}
                </p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskPrashnam} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder={lang === 'ml' ? 'നിങ്ങളുടെ ചോദ്യം ഇവിടെ നൽകുക (ഉദാ: ജോലി എപ്പോൾ ലഭിക്കും? / പുതിയ സംരംഭം തുടങ്ങാമോ?)...' : 'Type your question here (e.g. When will I get a new job?)...'}
                  className="w-full pl-4 pr-24 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isCalculatingPrashnam}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isCalculatingPrashnam ? (lang === 'ml' ? 'ഗണിക്കുന്നു...' : 'Calculating...') : (lang === 'ml' ? 'ഫലം അറിയുക' : 'Ask Oracle')}</span>
                </button>
              </div>

              {/* Popular Kerala Prashnam Questions Shortcut Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">
                  {lang === 'ml' ? 'ജനപ്രിയ പ്രശ്ന ചോദ്യങ്ങൾ (ക്ലിക്ക് ചെയ്ത് ചോദിക്കാം):' : 'Popular Horary Inquiries (Click to Ask):'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularKeralaQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuestionInput(lang === 'ml' ? q.ml : q.en);
                        handleAskPrashnam(undefined, lang === 'ml' ? q.ml : q.en);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 font-medium transition-colors"
                    >
                      {lang === 'ml' ? q.ml : q.en}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Prashnam Outcome Report */}
          {prashnaResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-in zoom-in-95">
              
              {/* Summary Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-rose-950/70 border border-amber-500/40 shadow-2xl space-y-4 text-center">
                <span className="text-4xl">🔮</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {lang === 'ml' ? 'കാര്യവിജയ സാധ്യത' : 'Success Probability'}
                  </span>
                  <div className="text-4xl font-black text-amber-400 mt-1">
                    {prashnaResult.outcomePercentage}%
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{lang === 'ml' ? 'ആരൂഢ രാശി:' : 'Aroodha Rashi:'}</span>
                    <span className="font-bold text-amber-300">{lang === 'ml' ? prashnaResult.aroodhaRashiMalayalam : prashnaResult.aroodhaRashiEnglish}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{lang === 'ml' ? 'ലഗ്നാധിപൻ:' : 'Lagna Lord:'}</span>
                    <span className="font-bold text-indigo-300">{prashnaResult.lagnaLordMalayalam}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{lang === 'ml' ? 'അനുകൂല ദിശ:' : 'Favorable Direction:'}</span>
                    <span className="font-bold text-emerald-300">{lang === 'ml' ? prashnaResult.favorableDirectionMalayalam : prashnaResult.favorableDirectionEnglish}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{lang === 'ml' ? 'ഇഷ്ടദേവത:' : 'Presiding Deity:'}</span>
                    <span className="font-bold text-pink-300">{prashnaResult.deityMalayalam}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Reading */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  <strong className="text-white">{lang === 'ml' ? 'ചോദിച്ച ചോദ്യം: ' : 'Inquiry: '}</strong>
                  <span>"{prashnaResult.question}"</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ml' ? 'ജ്യോതിഷ ഉത്തര വിശകലനം' : 'Astrological Oracle Interpretation'}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {lang === 'ml' ? prashnaResult.answerMalayalam : prashnaResult.answerEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1 text-xs">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lang === 'ml' ? 'കാര്യസിദ്ധി സമയം (Timeframe):' : 'Estimated Manifestation Timeframe:'}</span>
                  </span>
                  <p className="text-slate-200 font-semibold">
                    {lang === 'ml' ? prashnaResult.timeframeMalayalam : prashnaResult.timeframeEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1 text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ml' ? 'നിർദ്ദേശിക്കപ്പെടുന്ന ദോഷപരിഹാരം:' : 'Recommended Astrological Remedy:'}</span>
                  </span>
                  <p className="text-slate-300">
                    {lang === 'ml' ? prashnaResult.remedyMalayalam : prashnaResult.remedyEnglish}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VEDIC KUNDALI BIRTH CHART TAB */}
      {/* ========================================================================= */}
      {activeTab === 'kundali' && (
        <div className="space-y-5 animate-in fade-in">
          
          <form onSubmit={handleComputeKundali} className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'ml' ? 'ജാതക ഗണിത വിവരങ്ങൾ നൽകുക' : 'Enter Birth Ephemeris Parameters'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">{lang === 'ml' ? 'പേര്' : 'Full Name'}</label>
                <input
                  type="text"
                  value={birthName}
                  onChange={(e) => setBirthName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">{lang === 'ml' ? 'ജനന തീയതി' : 'Date of Birth'}</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">{lang === 'ml' ? 'ജനന സമയം' : 'Birth Time'}</label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">{lang === 'ml' ? 'ജനിച്ച സ്ഥലം' : 'Birth City / Place'}</label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/25"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'ജാതകം ഗണിക്കുക' : 'Calculate Vedic Chart'}</span>
              </button>
            </div>
          </form>

          {/* Computed Kundali Report */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                {lang === 'ml' ? 'ലഗ്നവും ഗ്രഹനിലയും' : 'Lagna & Planetary Alignments'}
              </h4>
              
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">{lang === 'ml' ? 'ലഗ്നം (Ascendant)' : 'Ascendant (Lagna)'}</span>
                  <span className="text-xs font-black text-indigo-400">{kundaliReport.ascendant}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">{lang === 'ml' ? 'ചന്ദ്ര രാശി (Moon Sign)' : 'Moon Sign (Rashi)'}</span>
                  <span className="text-xs font-black text-purple-400">{kundaliReport.moonSign}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">{lang === 'ml' ? 'സൂര്യ രാശി (Sun Sign)' : 'Sun Sign (Surya)'}</span>
                  <span className="text-xs font-black text-amber-400">{kundaliReport.sunSign}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ml' ? 'ദോഷ നിർണ്ണയം' : 'Dosha Analysis'}</span>
                </div>
                <p className="text-xs text-slate-300">{kundaliReport.doshaReport}</p>
              </div>

              <p className="text-[11px] text-slate-400 italic bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                "{kundaliReport.lifeRecommendation}"
              </p>
            </div>

            <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'ml' ? '12 ഭാവങ്ങളും ഗ്രഹസ്ഥിതിയും' : '12 Bhava (Houses) Planetary Positions'}</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {kundaliReport.houses.map((house) => (
                  <div
                    key={house.houseNumber}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-black text-indigo-400">
                        <span>H{house.houseNumber}</span>
                        <span className="text-[10px] text-slate-400 font-normal truncate">{house.sign.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{house.significance.split(':')[1]}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                      {house.planets.length > 0 ? (
                        house.planets.map((p, idx) => (
                          <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-600">{lang === 'ml' ? 'ഗ്രഹങ്ങളില്ല' : 'No planets'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 3-CARD TAROT DECK TAB */}
      {/* ========================================================================= */}
      {activeTab === 'tarot' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{lang === 'ml' ? '3-കാർഡ് ടാരോ ചിന്ത (ഭൂതം • വർത്തമാനം • ഭാവി)' : '3-Card Past • Present • Future Reading'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ml' ? 'മനസ്സിൽ ഒരു കാര്യം വിചാരിച്ച് പുതിയ കാർഡുകൾ തിരഞ്ഞെടുക്കുക.' : 'Focus your intention on a question and reveal your mystical guidance.'}
              </p>
            </div>

            <button
              onClick={drawNewTarotCards}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'പുതിയ കാർഡുകൾ എടുക്കുക' : 'Shuffle & Draw New Cards'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {drawnCards.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-2xl shadow-purple-950/40 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-pink-400 uppercase tracking-wider">{item.position}</span>
                    <span className="text-[10px] text-slate-400">{item.card.arcana} Arcana</span>
                  </div>

                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800">
                    <img
                      src={item.card.imageUrl}
                      alt={item.card.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-3">
                      <span className="font-black text-sm text-white drop-shadow-md">{item.card.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.card.keywords.map((kw, i) => (
                      <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p className="font-semibold text-slate-200 mb-0.5">{lang === 'ml' ? 'വ്യാഖ്യാനം:' : 'Interpretation:'}</p>
                  <p className="text-[11px] text-slate-400">{item.card.meaningUpright}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ZODIAC COMPATIBILITY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'compatibility' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 animate-in fade-in">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>{lang === 'ml' ? 'രാശിപ്പൊരുത്ത നിർണ്ണയ എൻജിൻ' : 'Zodiac Love & Relationship Compatibility Engine'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">{lang === 'ml' ? 'ആദ്യത്തെ പങ്കാളിയുടെ രാശി' : 'First Partner Sign'}</label>
              <select
                value={compatSign1}
                onChange={(e) => setCompatSign1(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {MALAYALAM_RASHIS.map((r) => (
                  <option key={r.id} value={`${r.nameMalayalam} (${r.nameEnglish})`}>
                    {r.symbol} {r.nameMalayalam} ({r.nameEnglish}) - {r.elementMalayalam}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">{lang === 'ml' ? 'രണ്ടാമത്തെ പങ്കാളിയുടെ രാശി' : 'Second Partner Sign'}</label>
              <select
                value={compatSign2}
                onChange={(e) => setCompatSign2(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {MALAYALAM_RASHIS.map((r) => (
                  <option key={r.id} value={`${r.nameMalayalam} (${r.nameEnglish})`}>
                    {r.symbol} {r.nameMalayalam} ({r.nameEnglish}) - {r.elementMalayalam}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border border-rose-800/40 max-w-xl mx-auto text-center space-y-3">
            <span className="text-3xl font-black text-rose-400">94% {lang === 'ml' ? 'ഉത്തമ പൊരുത്തം' : 'Compatibility'}</span>
            <h4 className="font-extrabold text-sm text-white">
              {lang === 'ml' ? 'ജ്യോതിഷപരമായി അതിശ്രേഷ്ഠമായ ഗ്രഹപ്പൊരുത്തം 🔥' : 'Dynamic Harmonic Cosmic Connection 🔥'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ml'
                ? `${compatSign1}, ${compatSign2} എന്നീ രാശിക്കാർ തമ്മിൽ പരസ്പര ധാരണയും ആത്മബന്ധവും വർദ്ധിക്കും. ജീവിതത്തിൽ സന്തോഷവും ഐശ്വര്യവും നിലനിൽക്കും.`
                : `${compatSign1} and ${compatSign2} share exceptional enthusiasm, mutual inspiration, and boundless creative energy. Their shared optimism fuels long-lasting growth.`}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
