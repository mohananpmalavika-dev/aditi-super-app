import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, FastForward, RotateCcw, Sparkles } from 'lucide-react';
import { LanguageMode } from '../../../types/caTutor';

interface VoiceTutorBarProps {
  isListening: boolean;
  isSpeaking: boolean;
  languageMode: LanguageMode;
  onToggleListen: () => void;
  onStopSpeaking: () => void;
  onQuickVoiceCommand: (cmd: string) => void;
  onSpeedChange: (speed: number) => void;
  playbackSpeed: number;
}

export const VoiceTutorBar: React.FC<VoiceTutorBarProps> = ({
  isListening,
  isSpeaking,
  languageMode,
  onToggleListen,
  onStopSpeaking,
  onQuickVoiceCommand,
  onSpeedChange,
  playbackSpeed
}) => {
  return (
    <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* 1. Main Mic Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleListen}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 flex-shrink-0 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50 ring-4 ring-rose-500/30'
              : 'bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/25'
          }`}
        >
          {isListening ? <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-xs sm:text-sm">
              {isListening ? '🎙 Listening to your doubt...' : 'Talk to AI Tutor'}
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
              {languageMode === 'ml' ? 'Malayalam' : languageMode === 'ml-en' ? 'Manglish' : 'English'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isListening
              ? 'Speak naturally (e.g. "BRS enikku onnu explain cheyyamo?")'
              : 'Tap mic or speak anytime. Interruption supported.'}
          </p>
        </div>
      </div>

      {/* 2. Quick Voice Directive Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { label: 'Simplify', cmd: 'Explain this in simpler terms' },
          { label: 'Give Example', cmd: 'Give me a real-life example' },
          { label: 'Whiteboard', cmd: 'Show step-by-step working on whiteboard' },
          { label: 'Repeat', cmd: 'Repeat the last explanation' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => onQuickVoiceCommand(item.cmd)}
            className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-bold whitespace-nowrap transition-all"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. Audio TTS & Speed Controls */}
      <div className="flex items-center gap-2">
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="px-2.5 py-1.5 rounded-xl bg-rose-600/30 border border-rose-500/50 text-rose-300 text-[11px] font-bold flex items-center gap-1 animate-pulse"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Stop Audio</span>
          </button>
        )}

        <select
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono font-bold focus:outline-none focus:border-amber-400"
        >
          <option value="0.75">0.75x</option>
          <option value="1">1.0x (Normal)</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2.0x (Fast)</option>
        </select>
      </div>

    </div>
  );
};
