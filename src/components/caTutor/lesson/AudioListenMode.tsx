import React, { useState } from 'react';
import { Volume2, Play, Pause, FastForward, RotateCcw, Headphones, BookOpen, Sparkles } from 'lucide-react';
import { PaperId } from '../../../types/caTutor';

interface AudioTrack {
  id: string;
  title: string;
  titleMalayalam: string;
  subjectTitle: string;
  durationMinutes: number;
  spokenAudioText: string;
}

const SAMPLE_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'aud-1',
    title: 'Bank Reconciliation Statement (BRS) Complete Audio Revision',
    titleMalayalam: 'ബാങ്ക് റികൺസിലിയേഷൻ സ്റ്റേറ്റ്‌മെന്റ് ഓഡിയോ റിവിഷൻ',
    subjectTitle: 'Paper 1: Accounting',
    durationMinutes: 12,
    spokenAudioText: 'Bank Reconciliation Statement ennal Cash book-um Pass book-um thammilulla balance difference reconcile cheyyan prepare cheyyunna statement aanu. Cheques issued but not presented nammal Cash book favorable balanceil ADD cheyyunnu.'
  },
  {
    id: 'aud-2',
    title: 'Indian Contract Act: Consideration & Landmark Case Precedents',
    titleMalayalam: 'ഇന്ത്യൻ കരാർ നിയമം: പ്രതിഫലവും പ്രധാന വിധിന്യായങ്ങളും',
    subjectTitle: 'Paper 2: Business Laws',
    durationMinutes: 15,
    spokenAudioText: 'Consideration ennal Quid Pro Quo aanu. Section 2 d of Indian Contract Act prakaram stranger to consideration can sue. Leading precedent is Chinnaya v. Ramayya.'
  },
  {
    id: 'aud-3',
    title: 'Time Value of Money: Formulae & Calculator Shortcuts',
    titleMalayalam: 'മാത്തമാറ്റിക്സ് ഓഫ് ഫിനാൻസ്: ഫോർമുലകളും കാൽക്കുലേറ്റർ ട്രിക്കുകളും',
    subjectTitle: 'Paper 3: Quantitative Aptitude',
    durationMinutes: 10,
    spokenAudioText: 'Time Value of Money il Annuity Regular Future Value calculation shortcut: One point ten into equals equals minus one divided by zero point ten into installment.'
  },
  {
    id: 'aud-4',
    title: 'Business Economics: Price Elasticity & Total Outlay Rules',
    titleMalayalam: 'ബിസിനസ്സ് ഇക്കണോമിക്സ്: വില ഇലാസ്തികത സംഗ്രഹം',
    subjectTitle: 'Paper 4: Business Economics',
    durationMinutes: 14,
    spokenAudioText: 'Price Elasticity of Demand Ep greater than one indicates elastic demand. Total Outlay inverse relation means demand is elastic.'
  }
];

export const AudioListenMode: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const activeTrack = SAMPLE_AUDIO_TRACKS[currentTrackIndex];

  const handleTogglePlay = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(activeTrack.spokenAudioText);
        utter.rate = speed;
        utter.onend = () => setIsPlaying(false);
        utter.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utter);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-6 text-white font-sans animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 flex-shrink-0">
          <Headphones className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black">Audio-Only Commute Listen Mode</h2>
          <p className="text-xs text-slate-400">Hands-free high-yield CA Foundation audio lectures for travel & rapid recall.</p>
        </div>
      </div>

      {/* Active Track Player */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase">
            {activeTrack.subjectTitle}
          </span>
          <h3 className="font-extrabold text-base sm:text-lg text-white">{activeTrack.title}</h3>
          <p className="text-xs text-purple-300 font-medium">{activeTrack.titleMalayalam}</p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-4 py-2">
          <button
            onClick={() => setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : SAMPLE_AUDIO_TRACKS.length - 1))}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 hover:scale-105 flex items-center justify-center text-white shadow-xl shadow-purple-500/40 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
          </button>

          <button
            onClick={() => setCurrentTrackIndex((prev) => (prev + 1) % SAMPLE_AUDIO_TRACKS.length)}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <span className="text-[11px] text-slate-400 font-bold">Speed:</span>
          {[0.75, 1, 1.25, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                speed === s
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Available Audio Lectures ({SAMPLE_AUDIO_TRACKS.length})
        </span>
        <div className="space-y-2">
          {SAMPLE_AUDIO_TRACKS.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(false);
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                currentTrackIndex === idx
                  ? 'bg-purple-950/40 border-purple-500/60 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <p className="font-bold text-xs text-white">{t.title}</p>
                <p className="text-[10px] text-slate-400">{t.subjectTitle} • {t.durationMinutes} Mins</p>
              </div>
              <Volume2 className={`w-4 h-4 flex-shrink-0 ${currentTrackIndex === idx ? 'text-purple-400' : 'text-slate-600'}`} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
