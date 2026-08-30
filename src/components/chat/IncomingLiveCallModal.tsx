import React, { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface IncomingLiveCallModalProps {
  isOpen: boolean;
  callerName: string;
  callerAvatar: string;
  isVideo: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingLiveCallModal: React.FC<IncomingLiveCallModalProps> = ({
  isOpen,
  callerName,
  callerAvatar,
  isVideo,
  onAccept,
  onDecline
}) => {
  const audioIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Ringtone synthesizer function using Web Audio API
      const playRingChime = () => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
          osc2.frequency.setValueAtTime(480, ctx.currentTime); // Standard ringback tone

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();

          setTimeout(() => {
            try {
              osc1.stop();
              osc2.stop();
              ctx.close();
            } catch {}
          }, 1800);
        } catch {}
      };

      playRingChime();
      audioIntervalRef.current = setInterval(playRingChime, 3000);
    }

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-indigo-500/60 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center justify-between min-h-[460px] animate-in zoom-in-95">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="text-center space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/50 text-[11px] font-extrabold text-indigo-300 shadow-md">
            {isVideo ? (
              <>
                <Video className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Incoming HD Video Call</span>
              </>
            ) : (
              <>
                <Phone className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>Incoming Live Voice Call</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Encrypted • Real-Time WebRTC</p>
        </div>

        {/* Caller Avatar with Animated Rings */}
        <div className="relative my-6 flex items-center justify-center z-10">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500/40 animate-ping absolute opacity-40" />
          <div className="w-28 h-28 rounded-full border-2 border-purple-500/60 animate-pulse absolute" />
          
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl relative bg-slate-800">
            <img
              src={callerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
              alt={callerName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Caller Info */}
        <div className="text-center space-y-1 z-10">
          <h2 className="text-xl font-black text-white tracking-tight">{callerName}</h2>
          <p className="text-xs text-indigo-300 font-medium">is calling you right now...</p>
        </div>

        {/* Action Buttons: Decline & Accept */}
        <div className="w-full flex items-center justify-around pt-6 border-t border-slate-800/80 z-10">
          
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onDecline}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
              title="Decline Call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-[10px] font-bold text-rose-400">Decline</span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
                onAccept();
              }}
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all animate-pulse"
              title="Accept Call"
            >
              {isVideo ? <Video className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
            </button>
            <span className="text-[10px] font-bold text-emerald-400">Accept</span>
          </div>

        </div>

      </div>
    </div>
  );
};
