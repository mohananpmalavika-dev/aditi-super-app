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
  Zap
} from 'lucide-react';
import { calculateVedicKundali, TAROT_DECK, ZODIAC_SIGNS } from '../../services/astrologyEngine';
import { TarotCardData, ZodiacSignInfo } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

export const AstrologyView: React.FC = () => {
  const { user, showToast } = useSuperApp();
  const [activeTab, setActiveTab] = useState<'horoscope' | 'kundali' | 'tarot' | 'compatibility'>('horoscope');
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSignInfo>(() => {
    return ZODIAC_SIGNS.find((z) => z.sign.toLowerCase() === user.zodiacSign.toLowerCase()) || ZODIAC_SIGNS[4]; // default Leo
  });

  /* ========== KUNDALI GENERATOR STATE ========== */
  const [birthName, setBirthName] = useState(user.name);
  const [birthDate, setBirthDate] = useState('1998-08-15');
  const [birthTime, setBirthTime] = useState('06:45');
  const [birthPlace, setBirthPlace] = useState('San Francisco, USA');
  const [kundaliReport, setKundaliReport] = useState(() =>
    calculateVedicKundali(user.name, '1998-08-15', '06:45', 'San Francisco')
  );

  const handleComputeKundali = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateVedicKundali(birthName, birthDate, birthTime, birthPlace);
    setKundaliReport(result);
    confetti({ particleCount: 50, spread: 60 });
    showToast('✨ Vedic Kundali Birth Chart Calculated!');
  };

  /* ========== 3-CARD TAROT READER STATE ========== */
  const [drawnCards, setDrawnCards] = useState<Array<{ card: TarotCardData; isFlipped: boolean; position: string }>>([
    { card: TAROT_DECK[0], isFlipped: true, position: 'Past Influences' },
    { card: TAROT_DECK[1], isFlipped: true, position: 'Present Situation' },
    { card: TAROT_DECK[7], isFlipped: true, position: 'Future Outcome' }
  ]);

  const drawNewTarotCards = () => {
    // Shuffle and pick 3 distinct cards
    const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
    setDrawnCards([
      { card: shuffled[0], isFlipped: true, position: 'Past Influences' },
      { card: shuffled[1], isFlipped: true, position: 'Present Situation' },
      { card: shuffled[2], isFlipped: true, position: 'Future Outcome' }
    ]);
    confetti({ particleCount: 70, spread: 70 });
    showToast('🔮 Mystical 3-Card Spread Revealed!');
  };

  /* ========== ZODIAC COMPATIBILITY STATE ========== */
  const [compatSign1, setCompatSign1] = useState('Leo');
  const [compatSign2, setCompatSign2] = useState('Sagittarius');

  return (
    <div className="space-y-6 pb-20">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <MoonStar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Astrology & Tarot Studio</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Vedic & Western
              </span>
            </div>
            <p className="text-xs text-slate-400">Daily planetary horoscopes, Kundali birth charts & 3-card Tarot readings.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/70 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'horoscope'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Horoscopes</span>
          </button>
          <button
            onClick={() => setActiveTab('kundali')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'kundali'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Vedic Kundali</span>
          </button>
          <button
            onClick={() => setActiveTab('tarot')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'tarot'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tarot Deck</span>
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'compatibility'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Compatibility</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DAILY HOROSCOPES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'horoscope' && (
        <div className="space-y-6">
          
          {/* Zodiac Sign Carousel */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {ZODIAC_SIGNS.map((z) => (
                <button
                  key={z.sign}
                  onClick={() => setSelectedZodiac(z)}
                  className={`flex flex-col items-center min-w-[80px] p-3 rounded-2xl border transition-all ${
                    selectedZodiac.sign === z.sign
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-105'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{z.symbol}</span>
                  <span className="text-xs font-bold">{z.sign}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">{z.element}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Zodiac Details & Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Overview Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedZodiac.symbol}</span>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{selectedZodiac.sign}</h2>
                    <p className="text-xs text-purple-300 font-semibold">{selectedZodiac.dateRange}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedZodiac.element} Sign
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Lucky Number</p>
                  <p className="text-lg font-black text-amber-400">{selectedZodiac.luckyNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Lucky Color</p>
                  <p className="text-sm font-black text-pink-400 truncate">{selectedZodiac.luckyColor}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Daily Cosmic Mood</p>
                <p className="text-xs font-extrabold text-indigo-300 mt-0.5">{selectedZodiac.mood}</p>
              </div>
            </div>

            {/* Detailed Predictions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                
                {/* General Forecast */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>General Celestial Transit</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {selectedZodiac.dailyHoroscope.general}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  
                  {/* Love */}
                  <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Love & Chemistry</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {selectedZodiac.dailyHoroscope.love}
                    </p>
                  </div>

                  {/* Career */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-800/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Career & Wealth</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {selectedZodiac.dailyHoroscope.career}
                    </p>
                  </div>

                  {/* Wellness */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Energy & Health</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {selectedZodiac.dailyHoroscope.wellness}
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VEDIC KUNDALI BIRTH CHART TAB */}
      {/* ========================================================================= */}
      {activeTab === 'kundali' && (
        <div className="space-y-6">
          
          {/* Birth Details Input Form */}
          <form onSubmit={handleComputeKundali} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Enter Birth Ephemeris Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={birthName}
                  onChange={(e) => setBirthName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Date of Birth</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Exact Birth Time</label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Birth City / Country</label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/25"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Calculate Vedic Chart</span>
              </button>
            </div>
          </form>

          {/* Computed Kundali Report */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Primary Signs Summary */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Lagna & Planetary Alignments</h4>
              
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Ascendant (Lagna)</span>
                  <span className="text-xs font-black text-indigo-400">{kundaliReport.ascendant}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Moon Sign (Rashi)</span>
                  <span className="text-xs font-black text-purple-400">{kundaliReport.moonSign}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Sun Sign (Surya)</span>
                  <span className="text-xs font-black text-amber-400">{kundaliReport.sunSign}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Dosha Analysis</span>
                </div>
                <p className="text-xs text-slate-300">{kundaliReport.doshaReport}</p>
              </div>

              <p className="text-[11px] text-slate-400 italic bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                "{kundaliReport.lifeRecommendation}"
              </p>
            </div>

            {/* 12 Vedic Houses Grid */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>12 Bhava (Houses) Planetary Positions</span>
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
                        <span className="text-[9px] text-slate-600">No planets</span>
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
      {/* 3. 3-CARD TAROT DECK TAB */}
      {/* ========================================================================= */}
      {activeTab === 'tarot' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>3-Card Past • Present • Future Reading</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Focus your intention on a question and reveal your mystical guidance.</p>
              </div>

              <button
                onClick={drawNewTarotCards}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Shuffle & Draw New Cards</span>
              </button>
            </div>

            {/* 3 Cards Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <p className="font-semibold text-slate-200 mb-0.5">Interpretation:</p>
                    <p className="text-[11px] text-slate-400">{item.card.meaningUpright}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ZODIAC COMPATIBILITY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'compatibility' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Zodiac Love & Relationship Compatibility Engine</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">First Partner Sign</label>
              <select
                value={compatSign1}
                onChange={(e) => setCompatSign1(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {ZODIAC_SIGNS.map((z) => (
                  <option key={z.sign} value={z.sign}>
                    {z.symbol} {z.sign} ({z.element})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Second Partner Sign</label>
              <select
                value={compatSign2}
                onChange={(e) => setCompatSign2(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {ZODIAC_SIGNS.map((z) => (
                  <option key={z.sign} value={z.sign}>
                    {z.symbol} {z.sign} ({z.element})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border border-rose-800/40 max-w-xl mx-auto text-center space-y-3">
            <span className="text-3xl font-black text-rose-400">94% Compatibility</span>
            <h4 className="font-extrabold text-sm text-white">Dynamic Harmonic Fire Connection 🔥</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {compatSign1} and {compatSign2} share exceptional enthusiasm, mutual inspiration, and boundless creative energy. Their shared optimism fuels long-lasting growth and joyful companionship.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
