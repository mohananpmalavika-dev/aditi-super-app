import React from 'react';
import { Lock, Timer, Flame, X } from 'lucide-react';

interface SecretTimerBarProps {
  currentTimer: number | null; // seconds
  onSelectTimer: (seconds: number | null) => void;
  onClose: () => void;
}

export const SecretTimerBar: React.FC<SecretTimerBarProps> = ({
  currentTimer,
  onSelectTimer,
  onClose
}) => {
  const options = [
    { label: 'Off', value: null },
    { label: '5s', value: 5 },
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '1h', value: 3600 },
    { label: '24h', value: 86400 }
  ];

  return (
    <div className="px-4 py-2 bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border-b border-rose-500/30 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
      <div className="flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-rose-400" />
        <span className="font-bold text-rose-300">Disappearing Messages:</span>
      </div>

      <div className="flex items-center gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onSelectTimer(opt.value)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
              currentTimer === opt.value
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
