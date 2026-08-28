import React, { useState } from 'react';
import { 
  MoonStar, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Activity, 
  RotateCcw, 
  Compass, 
  Sun, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  Clock, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Grid3X3, 
  TrendingUp, 
  Landmark, 
  Hourglass 
} from 'lucide-react';
import { calculateVedicKundali, TAROT_DECK } from '../../services/astrologyEngine';
import { 
  MALAYALAM_RASHIS, 
  MalayalamRashiInfo, 
  getLiveMalayalamPanchangam 
} from '../../services/malayalamAstroService';
import { 
  generateKeralaRashiChakra, 
  calculate10Porutham, 
  KERALA_NAKSHATRAS, 
  TenPoruthamResult,
  generatePersonalizedJathakamForecast,
  askPersonalizedAstroOracle,
  PersonalizedJathakamForecast,
  PersonalizedAstroOracleResult
} from '../../services/keralaAstroEngine';
import { TarotCardData } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

export const AstrologyView: React.FC = () => {
  const { user, showToast } = useSuperApp();
  
  // Language & Tab State
  const [lang, setLang] = useState<'ml' | 'en'>('ml');
  const [activeTab, setActiveTab] = useState<'kundali' | 'forecast' | 'oracle' | 'compatibility' | 'tarot'>('kundali');
  
  // Multi-Horizon Period State (Today, Tomorrow, This Week, This Month, This Year, Next 3 Years)
  const [forecastHorizon, setForecastHorizon] = useState<'today' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'thisYear' | 'nextThreeYears'>('today');
  const [forecastMode, setForecastMode] = useState<'personalized' | 'rashiGeneral'>('personalized');
  
  // Kundali Chart View Mode
  const [kundaliChartMode, setKundaliChartMode] = useState<'keralaGrid' | 'navamsha' | 'bhavaList'>('keralaGrid');

  // Selected Malayalam Rashi for General Forecasts
  const [selectedRashi, setSelectedRashi] = useState<MalayalamRashiInfo>(() => {
    const userZodiac = (user.zodiacSign || 'Leo').toLowerCase();
    return MALAYALAM_RASHIS.find((r) => r.nameEnglish.toLowerCase() === userZodiac) || MALAYALAM_RASHIS[4];
  });

  // Live Panchangam
  const panchangam = getLiveMalayalamPanchangam();

  /* ========== 1. BIRTH TIME & JATHAKAM (ജാതകം) STATE ========== */
  const [birthName, setBirthName] = useState(user.name || 'User');
  const [birthDate, setBirthDate] = useState(user.dateOfBirth || '1998-08-15');
  const [birthTime, setBirthTime] = useState(user.timeOfBirth || '10:30');
  const [birthPlace, setBirthPlace] = useState(user.placeOfBirth || 'Kollam, Kerala, India');
  
  const [kundaliReport, setKundaliReport] = useState(() =>
    calculateVedicKundali(
      user.name || 'User', 
      user.dateOfBirth || '1998-08-15', 
      user.timeOfBirth || '10:30', 
      user.placeOfBirth || 'Kollam, Kerala, India'
    )
  );

  const [keralaChakra, setKeralaChakra] = useState(() => 
    generateKeralaRashiChakra(
      user.name || 'User', 
      user.dateOfBirth || '1998-08-15', 
      user.timeOfBirth || '10:30', 
      user.placeOfBirth || 'Kollam, Kerala, India'
    )
  );

  const [personalizedForecast, setPersonalizedForecast] = useState<PersonalizedJathakamForecast>(() =>
    generatePersonalizedJathakamForecast(
      user.dateOfBirth || '1998-08-15',
      user.timeOfBirth || '10:30',
      user.placeOfBirth || 'Kollam, Kerala, India',
      user.name || 'User'
    )
  );

  const handleComputeKundali = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateVedicKundali(birthName, birthDate, birthTime, birthPlace);
    const chakra = generateKeralaRashiChakra(birthName, birthDate, birthTime, birthPlace);
    const forecast = generatePersonalizedJathakamForecast(birthDate, birthTime, birthPlace, birthName);
    
    setKundaliReport(result);
    setKeralaChakra(chakra);
    setPersonalizedForecast(forecast);
    confetti({ particleCount: 50, spread: 60 });
    showToast(lang === 'ml' ? '✨ ജാതക ഗണിതവും ഫലങ്ങളും തയ്യാറായി!' : '✨ Vedic Kundali & Forecasts Generated!');
  };

  /* ========== 2. ASTROLOGICAL AI Q&A ORACLE (ജ്യോതിഷ ചോദ്യോത്തരം) STATE ========== */
  const [questionInput, setQuestionInput] = useState('');
  const [isCalculatingOracle, setIsCalculatingOracle] = useState(false);
  const [oracleResult, setOracleResult] = useState<PersonalizedAstroOracleResult | null>(() =>
    askPersonalizedAstroOracle(
      'എനിക്ക് വിദേശ ജോലി അല്ലെങ്കിൽ പ്രമോഷൻ ലഭിക്കുമോ? (Will I get a foreign job promotion?)',
      user.dateOfBirth || '1998-08-15',
      user.timeOfBirth || '10:30',
      user.placeOfBirth || 'Kollam, Kerala, India',
      user.name || 'User'
    )
  );

  const handleAskOracle = (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const q = customQuestion || questionInput;
    if (!q.trim()) {
      showToast(lang === 'ml' ? '⚠️ ദയവായി നിങ്ങളുടെ ചോദ്യം നൽകുക.' : '⚠️ Please enter your astrological question.');
      return;
    }

    setIsCalculatingOracle(true);
    setTimeout(() => {
      const res = askPersonalizedAstroOracle(q.trim(), birthDate, birthTime, birthPlace, birthName);
      setOracleResult(res);
      setIsCalculatingOracle(false);
      confetti({ particleCount: 60, spread: 60 });
      showToast(lang === 'ml' ? '🔮 പ്രശ്നഫലം വിജയകരമായി ഗണിച്ചു!' : '🔮 Astrological Oracle Answer Calculated!');
    }, 450);
  };

  /* ========== 3. 10-PORUTHAM MATCHMAKING STATE ========== */
  const [boyStar, setBoyStar] = useState(KERALA_NAKSHATRAS[0]); // Ashwathi
  const [girlStar, setGirlStar] = useState(KERALA_NAKSHATRAS[3]); // Rohini
  const [matchResult, setMatchResult] = useState<TenPoruthamResult>(() => 
    calculate10Porutham(KERALA_NAKSHATRAS[0], KERALA_NAKSHATRAS[3])
  );

  const handleCalculateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculate10Porutham(boyStar, girlStar);
    setMatchResult(res);
    confetti({ particleCount: 70, spread: 65 });
    showToast(lang === 'ml' ? '💑 പത്തു പൊരുത്ത ഫലം കണക്കാക്കി!' : '💑 10-Porutham Match Calculated!');
  };

  /* ========== 4. 3-CARD TAROT READER STATE ========== */
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

  const popularOracleQuestions = [
    { ml: 'എനിക്ക് എപ്പോഴാണ് പുതിയ ജോലി അല്ലെങ്കിൽ വിദേശ ജോലി ലഭിക്കുക?', en: 'When will I get a new job or foreign employment?' },
    { ml: 'വിവാഹം എപ്പോൾ നടക്കും? ദാമ്പത്യ ജീവിതം എങ്ങനെയുണ്ടാകും?', en: 'When will I get married and how will married life be?' },
    { ml: 'സ്വന്തമായി വീട് അല്ലെങ്കിൽ വസ്തു വാങ്ങാൻ പറ്റിയ സമയമാണോ?', en: 'Is this the auspicious time to buy house or real estate?' },
    { ml: 'പുതിയ ബിസിനസ്സ് അല്ലെങ്കിൽ നിക്ഷേപം തുടങ്ങിയാൽ ലാഭമുണ്ടാകുമോ?', en: 'Will starting a new business venture or investment yield wealth?' },
    { ml: 'ആരോഗ്യസ്ഥിതി മെച്ചപ്പെടുമോ? എന്തെങ്കിലും ദോഷ പരിഹാരങ്ങൾ ആവശ്യമുണ്ടോ?', en: 'Will health improve and what temple pariharams are required?' },
    { ml: 'മത്സരപരീക്ഷകളിലും ഉന്നത വിദ്യാഭ്യാസത്തിലും വിജയം ലഭിക്കുമോ?', en: 'Will I succeed in competitive exams and higher studies?' }
  ];

  return (
    <div className="space-y-5 pb-20">
      
      {/* Studio Header with Bilingual Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <MoonStar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {lang === 'ml' ? 'മലയാള ജ്യോതിഷം & സമ്പൂർണ്ണ ജാതകം' : 'Kerala Vedic Astrology & Complete Jathakam'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1201 കൊല്ലവർഷം
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'ml' 
                ? 'ജനന സമയമനുസരിച്ചുള്ള സമ്പൂർണ്ണ ജാതകം, ഇന്ന്, നാളെ, ഈ ആഴ്ച, ഈ മാസം, 2026 വർഷഫലം, അടുത്ത 3 വർഷം & ജ്യോതിഷ ചോദ്യോത്തരം.' 
                : 'Complete Birth Chart Jathakam, Today, Tomorrow, This Week, Month, 2026 Year, Next 3 Years & Astro Q&A Oracle.'}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 self-start lg:self-auto">
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
      </div>

      {/* Live Astronomical Panchangam Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 text-xs text-slate-300 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-bold text-white">
            {lang === 'ml' ? 'ഇന്നത്തെ പഞ്ചാംഗം:' : 'Live Panchangam:'}
          </span>
          <span className="text-amber-300 font-mono font-semibold">
            {panchangam.kollamEraFormatted} • {panchangam.tithiMalayalam} • {panchangam.nakshatraMalayalam}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {lang === 'ml' ? 'രാഹുകാലം:' : 'Rahu:'} {panchangam.rahuKalamMalayalam}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {lang === 'ml' ? 'ഗുളികൻ:' : 'Gulika:'} {panchangam.gulikaKalamMalayalam}
          </span>
        </div>
      </div>

      {/* 5 Core Feature Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'kundali' as const, label: lang === 'ml' ? '📜 സമ്പൂർണ്ണ ജാതകം' : '📜 Full Jathakam', desc: 'കട്ട ചാർട്ട് & ദശ' },
          { id: 'forecast' as const, label: lang === 'ml' ? '🔮 കാലഫലങ്ങൾ' : '🔮 Multi-Horizon Forecasts', desc: 'ഇന്ന് മുതൽ 3 വർഷം' },
          { id: 'oracle' as const, label: lang === 'ml' ? '❓ ചോദ്യോത്തരം' : '❓ Astro Q&A Oracle', desc: 'ചോദ്യം ചോദിക്കാം' },
          { id: 'compatibility' as const, label: lang === 'ml' ? '💑 പത്തു പൊരുത്തം' : '💑 10-Porutham Match', desc: 'വിവാഹ പൊരുത്തം' },
          { id: 'tarot' as const, label: lang === 'ml' ? '🃏 ടാരോ റീഡിംഗ്' : '🃏 Tarot 3-Cards', desc: 'നിഗൂഢ കാർഡുകൾ' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="font-extrabold">{tab.label}</span>
            <span className="text-[9px] opacity-75 font-normal">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL JATHAKAM (ജാതകം, കട്ട ചാർട്ട്, ദശാപഹാരങ്ങൾ & ഭാവഫലം) */}
      {/* ========================================================================= */}
      {activeTab === 'kundali' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Birth Details Input Form */}
          <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {lang === 'ml' ? 'ജനന വിവരങ്ങൾ നൽകി സമ്പൂർണ്ണ ജാതകം ഗണിക്കുക' : 'Enter Birth Details for Complete Vedic Kundali'}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Lahiri Chitrapaksha Ephemeris
              </span>
            </div>

            <form onSubmit={handleComputeKundali} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'ml' ? 'പേര് (Full Name)' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={birthName}
                  onChange={(e) => setBirthName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'ml' ? 'ജനന തീയതി (Date of Birth)' : 'Date of Birth'}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'ml' ? 'ജനന സമയം (Time of Birth - 24 Hr)' : 'Time of Birth (Exact)'}
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'ml' ? 'ജനന സ്ഥലം (Place of Birth)' : 'Place of Birth'}
                </label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="e.g. Kozhikode, Kerala"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 pt-1 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ml' ? 'സമ്പൂർണ്ണ ജാതകം ഗണിക്കുക' : 'Calculate Complete Jathakam'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Vital Identity Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ml' ? 'ലഗ്നം (Ascendant)' : 'Lagna (Ascendant)'}</span>
              <h4 className="font-extrabold text-sm text-indigo-400">{keralaChakra.lagnaRashiMalayalam}</h4>
              <p className="text-[11px] text-slate-400">{keralaChakra.lagnaRashiEnglish}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ml' ? 'ചന്ദ്രരാശി (Moon Sign)' : 'Chandra Rashi'}</span>
              <h4 className="font-extrabold text-sm text-purple-400">{keralaChakra.moonRashiMalayalam}</h4>
              <p className="text-[11px] text-slate-400">{keralaChakra.moonRashiEnglish}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ml' ? 'ജന്മനക്ഷത്രം (Birth Star)' : 'Janma Nakshatra'}</span>
              <h4 className="font-extrabold text-sm text-amber-400 truncate">{keralaChakra.nakshatraMalayalam}</h4>
              <p className="text-[11px] text-slate-400 truncate">{keralaChakra.nakshatraEnglish}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ml' ? 'നിലവിലെ ദശ (Current Dasha)' : 'Current Mahadasha'}</span>
              <h4 className="font-extrabold text-sm text-emerald-400">{keralaChakra.currentDasha}</h4>
              <p className="text-[11px] text-slate-400">{keralaChakra.currentBhukti} അപഹാരം</p>
            </div>
          </div>

          {/* Chart View Mode Switcher */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs text-slate-200">
                {lang === 'ml' ? 'ചാർട്ട് രൂപം തിരഞ്ഞെടുക്കുക:' : 'Select Kundali Chart View:'}
              </span>
            </div>
            
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => setKundaliChartMode('keralaGrid')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  kundaliChartMode === 'keralaGrid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ml' ? 'കട്ട ചാർട്ട് (രാശി)' : 'Kerala 12-Box (D1)'}
              </button>
              <button
                onClick={() => setKundaliChartMode('navamsha')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  kundaliChartMode === 'navamsha' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ml' ? 'നവാംശകം (D9)' : 'Navamsha (D9)'}
              </button>
              <button
                onClick={() => setKundaliChartMode('bhavaList')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  kundaliChartMode === 'bhavaList' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ml' ? 'ഗ്രഹ നില' : 'Planetary Table'}
              </button>
            </div>
          </div>

          {/* South Indian 12-Box Traditional Kerala Rashi Chakra Grid (കട്ട ചാർട്ട്) */}
          {(kundaliChartMode === 'keralaGrid' || kundaliChartMode === 'navamsha') && (
            <div className="p-4 sm:p-6 rounded-3xl card-3d space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  {kundaliChartMode === 'keralaGrid'
                    ? (lang === 'ml' ? 'പരമ്പരാഗത കേരള രാശി ചക്രം (കട്ട ചാർട്ട്)' : 'Traditional South Indian 12-Box Rashi Chakra (D1)')
                    : (lang === 'ml' ? 'സൂക്ഷ്മ നവാംശക ചക്രം (D9 Navamsha Chart)' : 'Vedic Navamsha Chakra (D9)')}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ml' ? 'ലഗ്നവും 10 ഗ്രഹങ്ങളുടെ നിലയും കൃത്യമായ ഡിഗ്രി സഹിതം' : 'Planetary positions with exact sidereal longitudes and retrogrades'}
                </p>
              </div>

              {/* 4x4 Grid Layout (South Indian Kerala Astrology Box Structure) */}
              <div className="max-w-xl mx-auto grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-indigo-500/40 shadow-2xl">
                {(() => {
                  const activeGrid = kundaliChartMode === 'keralaGrid' ? keralaChakra.grid : keralaChakra.navamshaGrid;
                  const gridCellIndexMap = [
                    0, 1, 2, 3,
                    11, -1, -2, 4,
                    10, -3, -4, 5,
                    9, 8, 7, 6
                  ];

                  return gridCellIndexMap.map((boxIdx, cellIdx) => {
                    if (boxIdx < 0) {
                      if (boxIdx === -1) {
                        return (
                          <div key={cellIdx} className="col-span-2 row-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 shadow-inner">
                            <span className="text-2xl animate-spin-slow">🌐</span>
                            <h5 className="font-extrabold text-xs text-amber-300">
                              {birthName || 'ജാതകം'}
                            </h5>
                            <p className="text-[10px] text-indigo-300 font-mono">{birthDate} • {birthTime}</p>
                            <span className="text-[9px] text-slate-400 font-semibold">{birthPlace}</span>
                          </div>
                        );
                      }
                      return null;
                    }

                    const box = activeGrid[boxIdx];
                    return (
                      <div
                        key={cellIdx}
                        className={`min-h-[85px] sm:min-h-[100px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                          box.isLagna
                            ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                            : box.planets.length > 0
                            ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                            : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-1">
                          <span className="text-[11px] font-black text-amber-400">{box.nameMalayalam}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{box.nameEnglish.slice(0, 3)}</span>
                        </div>

                        <div className="my-auto space-y-0.5 py-1">
                          {box.planets.map((p, pIdx) => (
                            <div key={pIdx} className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                              {p}
                            </div>
                          ))}
                        </div>

                        {box.isLagna && (
                          <span className="text-[8px] font-extrabold px-1 py-0.2 rounded bg-indigo-500 text-white uppercase text-center self-start">
                            ലഗ്നം
                          </span>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Planetary Longitudes & Bhava Table */}
          {kundaliChartMode === 'bhavaList' && (
            <div className="p-5 rounded-3xl card-3d space-y-4">
              <h4 className="font-extrabold text-sm text-white">
                {lang === 'ml' ? 'സൂക്ഷ്മ ഗ്രഹ നില പട്ടിക (Sidereal Planetary Degrees)' : 'Sidereal Planetary Longitudes'}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">ഗ്രഹം (Planet)</th>
                      <th className="py-2.5 px-3">രാശി (Rashi)</th>
                      <th className="py-2.5 px-3">ഡിഗ്രി (Longitude)</th>
                      <th className="py-2.5 px-3">നക്ഷത്രം & പാദം (Star & Pada)</th>
                      <th className="py-2.5 px-3">നവാംശകം (Navamsha)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="bg-indigo-950/30 text-indigo-300 font-bold">
                      <td className="py-2.5 px-3">ലഗ്നം (Ascendant)</td>
                      <td className="py-2.5 px-3">{keralaChakra.chartData.lagna.rashiNameMalayalam} ({keralaChakra.chartData.lagna.rashiNameEnglish})</td>
                      <td className="py-2.5 px-3 font-mono">{keralaChakra.chartData.lagna.formattedDegree}</td>
                      <td className="py-2.5 px-3">{keralaChakra.chartData.lagna.nakshatraNameMalayalam} (പാദം {keralaChakra.chartData.lagna.pada})</td>
                      <td className="py-2.5 px-3">{keralaChakra.chartData.lagna.navamshaRashiIndex}</td>
                    </tr>
                    {keralaChakra.chartData.planets.map((planet) => (
                      <tr key={planet.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                          <span>{planet.symbol}</span>
                          <span>{planet.nameMalayalam} ({planet.nameEnglish})</span>
                          {planet.isRetrograde && (
                            <span className="text-[9px] font-extrabold px-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">വക്രം (R)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">{planet.rashiNameMalayalam} ({planet.rashiNameEnglish})</td>
                        <td className="py-2.5 px-3 font-mono">{planet.formattedDegree}</td>
                        <td className="py-2.5 px-3">{planet.nakshatraNameMalayalam} (പാദം {planet.pada})</td>
                        <td className="py-2.5 px-3">{planet.navamshaRashiIndex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vimshottari Dasha Calendar & Life Path Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Vimshottari Dasha Card */}
            <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    {lang === 'ml' ? 'വിംശോത്തരി ദശാകാലങ്ങൾ' : 'Vimshottari Dasha Timeline'}
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  {keralaChakra.dashaBalanceMalayalam}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">{lang === 'ml' ? 'നിലവിലെ മഹാദശ:' : 'Current Mahadasha:'}</span>
                  <span className="text-amber-400 font-black text-sm">{keralaChakra.currentDasha} ദശ</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">{lang === 'ml' ? 'അപഹാരം (Bhukti):' : 'Current Antardasha:'}</span>
                  <span className="text-indigo-300 font-bold">{keralaChakra.currentBhukti} അപഹാരം</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">{lang === 'ml' ? 'അടുത്ത മഹാദശ:' : 'Next Mahadasha:'}</span>
                  <span className="text-emerald-300 font-bold">{keralaChakra.nextDasha} ദശ</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{lang === 'ml' ? 'ദശാ പുരോഗതി' : 'Dasha Progress'}</span>
                    <span>{keralaChakra.dashaProgressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 rounded-full" 
                      style={{ width: `${keralaChakra.dashaProgressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Doshas & Yogas Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'ml' ? 'ചൊവ്വാദോഷം' : 'Kuja Dosha'}</span>
                  <p className="font-bold text-white">
                    {keralaChakra.doshaSummary.kujaDosha ? 'ഉണ്ട് (ചൊവ്വാദോഷം)' : 'ദോഷമില്ല (ഉത്തമം)'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'ml' ? 'പാപസാമ്യം' : 'Papasamya Score'}</span>
                  <p className="font-bold text-emerald-400">{keralaChakra.doshaSummary.papasamyaScore} Points</p>
                </div>
              </div>
            </div>

            {/* 12 Bhava Life Analysis */}
            <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  {lang === 'ml' ? 'ജീവിത ഭാവഫല നിരൂപണം' : '12 Bhava Life Path Analysis'}
                </h4>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {kundaliReport.houses.slice(0, 6).map((house) => (
                  <div key={house.houseNumber} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-amber-400">
                        {house.houseNumber}-ാം ഭാവം: {house.significance}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{house.sign}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {house.planets.length > 0 
                        ? (lang === 'ml' ? `സ്ഥിതി ചെയ്യുന്ന ഗ്രഹങ്ങൾ: ${house.planets.join(', ')}` : `Occupying planets: ${house.planets.join(', ')}`)
                        : (lang === 'ml' ? 'ശുഭ ഭാവ സ്ഥിതി.' : 'Benefic house disposition.')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTI-HORIZON TIME FORECASTS (ഇന്ന്, നാളെ, ആഴ്ച, മാസം, വർഷം, 3 വർഷം) */}
      {/* ========================================================================= */}
      {activeTab === 'forecast' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Mode Switcher: Personalized Birth-Chart vs 12 General Rashis */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-black text-sm text-white">
                  {lang === 'ml' ? 'സമയഫല ഗതി തിരഞ്ഞെടുക്കുക' : 'Select Forecast Mode'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ml' ? 'നിങ്ങളുടെ കൃത്യമായ ജാതകാധിഷ്ഠിത ഫലങ്ങൾ അല്ലെങ്കിൽ 12 രാശികൾ' : 'Tailored to your exact birth time or general Zodiac signs'}
                </p>
              </div>
            </div>

            <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setForecastMode('personalized')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  forecastMode === 'personalized'
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ml' ? '✨ വ്യക്തിഗത ജാതകഫലം' : '✨ My Birth Jathakam'}
              </button>
              <button
                onClick={() => setForecastMode('rashiGeneral')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  forecastMode === 'rashiGeneral'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ml' ? '♈ 12 രാശിഫലങ്ങൾ' : '♈ 12 Rashis'}
              </button>
            </div>
          </div>

          {/* 6 Time Horizon Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'today' as const, icon: Sun, labelMl: 'ഇന്ന്', labelEn: 'Today' },
              { id: 'tomorrow' as const, icon: Compass, labelMl: 'നാളെ', labelEn: 'Tomorrow' },
              { id: 'thisWeek' as const, icon: Calendar, labelMl: 'ഈ ആഴ്ച', labelEn: 'This Week' },
              { id: 'thisMonth' as const, icon: MoonStar, labelMl: 'ഈ മാസം', labelEn: 'This Month' },
              { id: 'thisYear' as const, icon: Sparkles, labelMl: '2026 വർഷം', labelEn: 'This Year' },
              { id: 'nextThreeYears' as const, icon: TrendingUp, labelMl: 'അടുത്ത 3 വർഷം', labelEn: 'Next 3 Years' }
            ].map((hz) => {
              const Icon = hz.icon;
              const isActive = forecastHorizon === hz.id;
              return (
                <button
                  key={hz.id}
                  onClick={() => setForecastHorizon(hz.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 text-white border-white/20 shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-extrabold text-xs">{lang === 'ml' ? hz.labelMl : hz.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* If General Rashi Mode is selected: Rashi Selector Grid */}
          {forecastMode === 'rashiGeneral' && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {MALAYALAM_RASHIS.map((rashi) => (
                <button
                  key={rashi.id}
                  onClick={() => setSelectedRashi(rashi)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    selectedRashi.id === rashi.id
                      ? 'bg-indigo-950 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base block">{rashi.symbol}</span>
                  <span className="font-black text-xs block truncate">{rashi.nameMalayalam}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{rashi.nameEnglish}</span>
                </button>
              ))}
            </div>
          )}

          {/* ==================== 1. TODAY'S FORECAST ==================== */}
          {forecastHorizon === 'today' && (
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <h4 className="font-extrabold text-sm sm:text-base text-amber-400 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <span>
                      {forecastMode === 'personalized' 
                        ? (lang === 'ml' ? personalizedForecast.today.titleMalayalam : personalizedForecast.today.titleEnglish)
                        : (lang === 'ml' ? `ഇന്നത്തെ ദിവസഫലം: ${selectedRashi.nameMalayalam}` : `Today's Horoscope: ${selectedRashi.nameEnglish}`)}
                    </span>
                  </h4>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {lang === 'ml' ? 'ശുഭ മുഹൂർത്തം:' : 'Muhurtham:'} {personalizedForecast.today.muhurthamEnglish}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {forecastMode === 'personalized' 
                    ? (lang === 'ml' ? personalizedForecast.today.summaryMalayalam : personalizedForecast.today.summaryEnglish)
                    : (lang === 'ml' ? selectedRashi.daily.generalMalayalam : selectedRashi.daily.generalEnglish)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{lang === 'ml' ? 'തൊഴിൽ & വ്യാപാരം' : 'Career & Business'}</span>
                    </span>
                    <p className="text-xs text-slate-300">
                      {forecastMode === 'personalized'
                        ? (lang === 'ml' ? personalizedForecast.today.careerMalayalam : personalizedForecast.today.careerEnglish)
                        : (lang === 'ml' ? selectedRashi.daily.careerMalayalam : selectedRashi.daily.careerEnglish)}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{lang === 'ml' ? 'ധനാഗമം & സമ്പത്ത്' : 'Finance & Gains'}</span>
                    </span>
                    <p className="text-xs text-slate-300">
                      {forecastMode === 'personalized'
                        ? (lang === 'ml' ? personalizedForecast.today.financeMalayalam : personalizedForecast.today.financeEnglish)
                        : (lang === 'ml' ? selectedRashi.daily.financeMalayalam : selectedRashi.daily.financeEnglish)}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>{lang === 'ml' ? 'ഇന്നത്തെ പരിഹാരം:' : 'Daily Remedy:'}</strong>{' '}
                    {forecastMode === 'personalized'
                      ? (lang === 'ml' ? personalizedForecast.today.remedyMalayalam : personalizedForecast.today.remedyEnglish)
                      : (lang === 'ml' ? selectedRashi.daily.remedyMalayalam : selectedRashi.daily.remedyEnglish)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. TOMORROW'S FORECAST ==================== */}
          {forecastHorizon === 'tomorrow' && (
            <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <h4 className="font-extrabold text-sm sm:text-base text-purple-400 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <span>
                    {lang === 'ml' ? personalizedForecast.tomorrow.titleMalayalam : personalizedForecast.tomorrow.titleEnglish}
                  </span>
                </h4>
                <span className="text-xs font-mono text-indigo-300 font-bold">
                  {personalizedForecast.tomorrow.favorableHoursEnglish}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {lang === 'ml' ? personalizedForecast.tomorrow.summaryMalayalam : personalizedForecast.tomorrow.summaryEnglish}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{lang === 'ml' ? 'നാളത്തെ കർമ്മപദ്ധതികൾ' : 'Work & Projects'}</span>
                  </span>
                  <p className="text-xs text-slate-300">
                    {lang === 'ml' ? personalizedForecast.tomorrow.careerMalayalam : personalizedForecast.tomorrow.careerEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{lang === 'ml' ? 'സാമ്പത്തിക ക്രയവിക്രയങ്ങൾ' : 'Financial Discipline'}</span>
                  </span>
                  <p className="text-xs text-slate-300">
                    {lang === 'ml' ? personalizedForecast.tomorrow.financeMalayalam : personalizedForecast.tomorrow.financeEnglish}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <span>
                  <strong>{lang === 'ml' ? 'ശുഭ പരിഹാരം:' : 'Remedy:'}</strong>{' '}
                  {lang === 'ml' ? personalizedForecast.tomorrow.remedyMalayalam : personalizedForecast.tomorrow.remedyEnglish}
                </span>
              </div>
            </div>
          )}

          {/* ==================== 3. THIS WEEK'S FORECAST ==================== */}
          {forecastHorizon === 'thisWeek' && (
            <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <h4 className="font-extrabold text-sm sm:text-base text-indigo-400 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>
                    {lang === 'ml' ? personalizedForecast.thisWeek.titleMalayalam : personalizedForecast.thisWeek.titleEnglish}
                  </span>
                </h4>
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {lang === 'ml' ? 'അനുകൂല ദിനങ്ങൾ:' : 'Favorable Days:'} {personalizedForecast.thisWeek.favorableDaysEnglish}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {lang === 'ml' ? personalizedForecast.thisWeek.summaryMalayalam : personalizedForecast.thisWeek.summaryEnglish}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-amber-400">{lang === 'ml' ? 'തൊഴിൽ & സാമ്പത്തികം' : 'Career & Finance'}</span>
                  <p className="text-xs text-slate-300">
                    {lang === 'ml' ? personalizedForecast.thisWeek.careerFinanceMalayalam : personalizedForecast.thisWeek.careerFinanceEnglish}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-purple-400">{lang === 'ml' ? 'കുടുംബം & ആരോഗ്യം' : 'Family & Health'}</span>
                  <p className="text-xs text-slate-300">
                    {lang === 'ml' ? personalizedForecast.thisWeek.familyHealthMalayalam : personalizedForecast.thisWeek.familyHealthEnglish}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. THIS MONTH'S FORECAST ==================== */}
          {forecastHorizon === 'thisMonth' && (
            <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <MoonStar className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-sm sm:text-base text-amber-300">
                  {lang === 'ml' ? personalizedForecast.thisMonth.titleMalayalam : personalizedForecast.thisMonth.titleEnglish}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {lang === 'ml' ? personalizedForecast.thisMonth.summaryMalayalam : personalizedForecast.thisMonth.summaryEnglish}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400">{lang === 'ml' ? 'സ്ഥിരനിക്ഷേപങ്ങൾ & ധനം' : 'Wealth & Investments'}</span>
                  <p className="text-xs text-slate-300">
                    {lang === 'ml' ? personalizedForecast.thisMonth.wealthInvestmentsMalayalam : personalizedForecast.thisMonth.wealthInvestmentsEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-pink-400">{lang === 'ml' ? 'ദാമ്പത്യം & ബന്ധങ്ങൾ' : 'Marriage & Relations'}</span>
                  <p className="text-xs text-slate-300">
                    {lang === 'ml' ? personalizedForecast.thisMonth.relationshipsMalayalam : personalizedForecast.thisMonth.relationshipsEnglish}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5. THIS YEAR (2026) FORECAST ==================== */}
          {forecastHorizon === 'thisYear' && (
            <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <h4 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                  <span>{lang === 'ml' ? personalizedForecast.thisYear.titleMalayalam : personalizedForecast.thisYear.titleEnglish}</span>
                </h4>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Annual Roadmap
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {lang === 'ml' ? personalizedForecast.thisYear.summaryMalayalam : personalizedForecast.thisYear.summaryEnglish}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-amber-400">{lang === 'ml' ? 'ഗുരു മാറ്റം (Jupiter)' : 'Jupiter Transit'}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ml' ? personalizedForecast.thisYear.guruTransitMalayalam : personalizedForecast.thisYear.guruTransitEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-400">{lang === 'ml' ? 'ശനി മാറ്റം (Saturn)' : 'Saturn Transit'}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ml' ? personalizedForecast.thisYear.saniTransitMalayalam : personalizedForecast.thisYear.saniTransitEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-purple-400">{lang === 'ml' ? 'രാഹു-കേതു പ്രഭാവം' : 'Rahu-Ketu Axis'}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ml' ? personalizedForecast.thisYear.rahuKetuTransitMalayalam : personalizedForecast.thisYear.rahuKetuTransitEnglish}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400">{lang === 'ml' ? 'തൊഴിൽ & ബിസിനസ്സ് നേട്ടങ്ങൾ' : 'Career & Enterprise'}</span>
                  <p className="text-xs text-slate-300">{lang === 'ml' ? personalizedForecast.thisYear.careerMilestonesMalayalam : personalizedForecast.thisYear.careerMilestonesEnglish}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-purple-400">{lang === 'ml' ? 'ഭവനം, ഭൂമി & സമ്പത്ത്' : 'Property & Real Estate'}</span>
                  <p className="text-xs text-slate-300">{lang === 'ml' ? personalizedForecast.thisYear.wealthPropertyMalayalam : personalizedForecast.thisYear.wealthPropertyEnglish}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-950 border border-amber-500/30 space-y-1">
                <span className="font-extrabold text-xs text-amber-300">{lang === 'ml' ? '2026 വിശേഷാൽ പരിഹാരങ്ങൾ:' : '2026 Grand Temple Pariharams:'}</span>
                <p className="text-xs text-slate-300">{lang === 'ml' ? personalizedForecast.thisYear.grandPariharamsMalayalam : personalizedForecast.thisYear.grandPariharamsEnglish}</p>
              </div>
            </div>
          )}

          {/* ==================== 6. NEXT 3 YEARS (2026, 2027, 2028) FORECAST ==================== */}
          {forecastHorizon === 'nextThreeYears' && (
            <div className="space-y-5">
              
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-tr from-indigo-950/80 via-purple-950/80 to-slate-900 border border-indigo-500/40 shadow-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                  <h4 className="font-black text-base sm:text-xl text-white">
                    {lang === 'ml' ? personalizedForecast.nextThreeYears.titleMalayalam : personalizedForecast.nextThreeYears.titleEnglish}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {lang === 'ml' ? personalizedForecast.nextThreeYears.overviewMalayalam : personalizedForecast.nextThreeYears.overviewEnglish}
                </p>
              </div>

              {/* 3 Years Timeline Cards (2026, 2027, 2028) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Year 2026 */}
                <div className="p-5 rounded-3xl card-3d space-y-3 border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-indigo-400">2026</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Year 1</span>
                  </div>
                  <h5 className="font-black text-xs text-white">
                    {lang === 'ml' ? personalizedForecast.nextThreeYears.year2026.themeMalayalam : personalizedForecast.nextThreeYears.year2026.themeEnglish}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ml' ? personalizedForecast.nextThreeYears.year2026.predictionsMalayalam : personalizedForecast.nextThreeYears.year2026.predictionsEnglish}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-300 font-semibold">
                    🎯 {lang === 'ml' ? personalizedForecast.nextThreeYears.year2026.keyFocusMalayalam : personalizedForecast.nextThreeYears.year2026.keyFocusEnglish}
                  </div>
                </div>

                {/* Year 2027 */}
                <div className="p-5 rounded-3xl card-3d space-y-3 border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-purple-400">2027</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Year 2</span>
                  </div>
                  <h5 className="font-black text-xs text-white">
                    {lang === 'ml' ? personalizedForecast.nextThreeYears.year2027.themeMalayalam : personalizedForecast.nextThreeYears.year2027.themeEnglish}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ml' ? personalizedForecast.nextThreeYears.year2027.predictionsMalayalam : personalizedForecast.nextThreeYears.year2027.predictionsEnglish}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-purple-300 font-semibold">
                    🎯 {lang === 'ml' ? personalizedForecast.nextThreeYears.year2027.keyFocusMalayalam : personalizedForecast.nextThreeYears.year2027.keyFocusEnglish}
                  </div>
                </div>

                {/* Year 2028 */}
                <div className="p-5 rounded-3xl card-3d space-y-3 border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-amber-400">2028</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Year 3</span>
                  </div>
                  <h5 className="font-black text-xs text-white">
                    {lang === 'ml' ? personalizedForecast.nextThreeYears.year2028.themeMalayalam : personalizedForecast.nextThreeYears.year2028.themeEnglish}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ml' ? personalizedForecast.nextThreeYears.year2028.predictionsMalayalam : personalizedForecast.nextThreeYears.year2028.predictionsEnglish}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 font-semibold">
                    🎯 {lang === 'ml' ? personalizedForecast.nextThreeYears.year2028.keyFocusMalayalam : personalizedForecast.nextThreeYears.year2028.keyFocusEnglish}
                  </div>
                </div>

              </div>

              {/* Pilgrimages & Gemstone Advice */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h5 className="font-black text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'ml' ? '3 വർഷത്തേക്ക് നിർദ്ദേശിക്കുന്ന പ്രധാന ക്ഷേത്രങ്ങൾ' : 'Recommended 3-Year Temple Pilgrimages'}</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {(lang === 'ml' ? personalizedForecast.nextThreeYears.templePilgrimagesMalayalam : personalizedForecast.nextThreeYears.templePilgrimagesEnglish).map((temple, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">🛕</span>
                      <span>{temple}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ASTROLOGICAL AI Q&A ORACLE (ജ്യോതിഷ ചോദ്യോത്തരം / Astro Oracle) */}
      {/* ========================================================================= */}
      {activeTab === 'oracle' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Question Input Card */}
          <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {lang === 'ml' ? 'നിങ്ങളുടെ ഏത് സംശയവും ഇവിടെ ചോദിക്കാം' : 'Ask Any Astrological Question (Astro Oracle)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ml' ? 'നിങ്ങളുടെ ജാതകവും ഗോചര ഗ്രഹനിലയും ആധാരമാക്കി തത്സമയം ഗണിക്കുന്നു' : 'Computed instantly using your birth chart, current Dasha & Prashna Aroodha'}
                </p>
              </div>
            </div>

            <form onSubmit={handleAskOracle} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder={lang === 'ml' ? 'ഉദാ: എനിക്ക് എപ്പോഴാണ് പുതിയ ജോലി അല്ലെങ്കിൽ പ്രമോഷൻ ലഭിക്കുക?' : "e.g. When will I get my promotion or foreign visa?"}
                  className="w-full pl-4 pr-28 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  disabled={isCalculatingOracle}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isCalculatingOracle ? (lang === 'ml' ? 'ഗണിക്കുന്നു...' : 'Calculating...') : (lang === 'ml' ? 'ചോദിക്കുക' : 'Ask Oracle')}</span>
                </button>
              </div>

              {/* Popular Question Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">
                  {lang === 'ml' ? 'പ്രധാനപ്പെട്ട ചോദ്യങ്ങൾ:' : 'Popular Questions:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularOracleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuestionInput(lang === 'ml' ? q.ml : q.en);
                        handleAskOracle(undefined, lang === 'ml' ? q.ml : q.en);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all text-left"
                    >
                      <span>💬 {lang === 'ml' ? q.ml : q.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Oracle Calculation Result */}
          {oracleResult && (
            <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-500/40 shadow-2xl space-y-5 animate-in zoom-in-95">
              
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {lang === 'ml' ? oracleResult.categoryLabelMalayalam : oracleResult.categoryLabelEnglish}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    "{oracleResult.question}"
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">{lang === 'ml' ? 'കാര്യസിദ്ധി സാധ്യത' : 'Auspiciousness'}</span>
                    <span className="text-sm font-black text-emerald-400">{oracleResult.outcomeScore}%</span>
                  </div>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-extrabold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{lang === 'ml' ? oracleResult.verdictMalayalam : oracleResult.verdictEnglish}</span>
              </div>

              {/* Detailed Astrological Analysis */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-amber-300 uppercase tracking-wider">
                  {lang === 'ml' ? 'ജ്യോതിഷ വിശകലനം & ഗ്രഹ സ്വാധീനം' : 'Astrological Analysis & Planetary Rationale'}
                </h5>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  {lang === 'ml' ? oracleResult.detailedAnalysisMalayalam : oracleResult.detailedAnalysisEnglish}
                </p>
              </div>

              {/* Timeframe & Dasha Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Hourglass className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ml' ? 'കാര്യസിദ്ധി കാലയളവ്' : 'Manifestation Timeframe'}</span>
                  </span>
                  <p className="text-xs font-bold text-amber-300">
                    {lang === 'ml' ? oracleResult.manifestationTimelineMalayalam : oracleResult.manifestationTimelineEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lang === 'ml' ? 'അനുകൂല ദിവസങ്ങൾ / മുഹൂർത്തം' : 'Auspicious Days'}</span>
                  </span>
                  <p className="text-xs font-bold text-indigo-300">
                    {lang === 'ml' ? oracleResult.auspiciousDatesMalayalam : oracleResult.auspiciousDatesEnglish}
                  </p>
                </div>
              </div>

              {/* Recommended Temple Offerings & Mantras */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Landmark className="w-4 h-4" />
                  <span>{lang === 'ml' ? 'നിർദ്ദേശിക്കുന്ന ക്ഷേത്ര വഴിപാടുകളും മന്ത്രവും:' : 'Temple Pariharams & Sacred Mantra:'}</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                  <p>🛕 <strong>{lang === 'ml' ? 'ക്ഷേത്ര വഴിപാട്:' : 'Offering:'}</strong> {lang === 'ml' ? oracleResult.templePariharamMalayalam : oracleResult.templePariharamEnglish}</p>
                  <p>🕉️ <strong>{lang === 'ml' ? 'ജപിക്കേണ്ട മന്ത്രം:' : 'Mantra:'}</strong> {lang === 'ml' ? oracleResult.gemstoneMantraMalayalam : oracleResult.gemstoneMantraEnglish}</p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 10-PORUTHAM MATCHMAKING (പത്തു പൊരുത്തം) */}
      {/* ========================================================================= */}
      {activeTab === 'compatibility' && (
        <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-5 animate-in fade-in">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              {lang === 'ml' ? 'കേരള ജ്യോതിഷ പത്തു പൊരുത്ത ഗണിതം' : 'Authentic Kerala 10-Porutham Matchmaker'}
            </h3>
          </div>

          <form onSubmit={handleCalculateMatch} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                {lang === 'ml' ? 'വരന്റെ നക്ഷത്രം (Groom\'s Star)' : 'Groom\'s Nakshatra'}
              </label>
              <select
                value={boyStar}
                onChange={(e) => setBoyStar(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                {KERALA_NAKSHATRAS.map((star) => (
                  <option key={star} value={star}>{star}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                {lang === 'ml' ? 'വധുവിന്റെ നക്ഷത്രം (Bride\'s Star)' : 'Bride\'s Nakshatra'}
              </label>
              <select
                value={girlStar}
                onChange={(e) => setGirlStar(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                {KERALA_NAKSHATRAS.map((star) => (
                  <option key={star} value={star}>{star}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30"
              >
                {lang === 'ml' ? 'പൊരുത്തം പരിശോധിക്കുക' : 'Compute 10-Porutham Match'}
              </button>
            </div>
          </form>

          {/* Match Results */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-white">
                {matchResult.totalScore} / 10 {lang === 'ml' ? 'പൊരുത്തങ്ങൾ അനുകൂലം' : 'Poruthams Matched'} ({matchResult.percentage}%)
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                matchResult.totalScore >= 6 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {lang === 'ml' ? matchResult.verdictMalayalam : matchResult.verdictEnglish}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-2">
              {matchResult.poruthams.map((p, idx) => {
                const isMatch = p.points > 0;
                return (
                  <div key={idx} className={`p-2.5 rounded-xl border text-center ${
                    isMatch ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}>
                    <span className="font-black block text-[11px]">{p.nameMalayalam}</span>
                    <span className="text-[9px] block opacity-80">{isMatch ? 'ഉത്തമം ✓' : 'പൊരുത്തമില്ല ✕'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MYSTICAL TAROT (ടാരോ കാർഡുകൾ) */}
      {/* ========================================================================= */}
      {activeTab === 'tarot' && (
        <div className="p-5 sm:p-6 rounded-3xl card-3d space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {lang === 'ml' ? 'നിഗൂഢ 3-കാർഡ് ടാരോ വായന' : 'Mystical 3-Card Tarot Reading'}
              </h3>
            </div>
            <button
              onClick={drawNewTarotCards}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'കാർഡുകൾ മാറ്റുക' : 'Draw New Cards'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {drawnCards.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2 text-center">
                <span className="text-[10px] font-bold text-purple-300 uppercase block">{item.position}</span>
                <div className="w-16 h-24 mx-auto rounded-xl bg-gradient-to-tr from-purple-800 via-indigo-900 to-slate-950 border border-purple-400 flex items-center justify-center text-2xl shadow-lg">
                  🔮
                </div>
                <h5 className="font-black text-xs text-white">{item.card.name}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.card.meaningUpright}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
