import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, Volume2, Sparkles, Clock, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AutomatedScheduledCallModalProps {
  isOpen: boolean;
  senderName: string;
  senderAvatar: string;
  audioUrl?: string;
  audioDuration?: number;
  textSnippet?: string;
  onClose: () => void;
  onCallCompleted?: () => void;
}

export const AutomatedScheduledCallModal: React.FC<AutomatedScheduledCallModalProps> = ({
  isOpen,
  senderName,
  senderAvatar,
  audioUrl,
  audioDuration = 10,
  textSnippet,
  onClose,
  onCallCompleted
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCallState('ringing');
      setElapsedSeconds(0);
      setIsPlayingAudio(false);

      // Play soft ringtone audio tone
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        try {
          osc.stop();
          ctx.close();
        } catch {}
      }, 1500);
    }
  }, [isOpen]);

  // Duration ticker when connected
  useEffect(() => {
    let timer: any = null;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= audioDuration) {
            handleEndCall();
            return audioDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState, audioDuration]);

  const handleAnswer = () => {
    setCallState('connected');
    setIsPlayingAudio(true);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      onCallCompleted?.();
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-indigo-500/50 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center justify-between min-h-[480px] animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-[11px] font-extrabold text-indigo-300 shadow-md">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Automated Scheduled Voice Call</span>
          </div>

          <h3 className="text-xs text-slate-400 pt-1">
            {callState === 'ringing' ? 'Incoming Scheduled Call...' : callState === 'connected' ? 'Call Connected • Playing Voice Note' : 'Call Finished'}
          </h3>
        </div>

        {/* Center Visual: Avatar with Pulsing Rings & Equalizer */}
        <div className="relative my-6 flex flex-col items-center">
          <div className="relative">
            {callState === 'ringing' && (
              <>
                <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping duration-1000" />
                <div className="absolute -inset-4 rounded-full border-2 border-emerald-400/40 animate-pulse" />
              </>
            )}

            {callState === 'connected' && (
              <div className="absolute -inset-4 rounded-full border-2 border-indigo-400/40 animate-spin" style={{ animationDuration: '8s' }} />
            )}

            <img
              src={senderAvatar}
              alt={senderName}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-indigo-500/60 shadow-2xl relative z-10"
            />
          </div>

          <h2 className="text-lg font-extrabold text-white mt-4">{senderName}</h2>
          
          {callState === 'connected' ? (
            <div className="mt-2 space-y-2 text-center">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                00:{(audioDuration - elapsedSeconds).toString().padStart(2, '0')} remaining
              </span>

              {/* Audio Equalizer Waves */}
              <div className="flex items-center justify-center gap-1 h-6 pt-2">
                {[30, 75, 45, 90, 60, 100, 75, 40, 85, 50, 95, 35].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-emerald-400 animate-pulse"
                    style={{
                      height: `${h * 0.25}px`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>
            </div>
          ) : callState === 'ringing' ? (
            <p className="text-xs text-slate-400 mt-1 animate-pulse">
              Ringing on schedule...
            </p>
          ) : (
            <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Voice memo delivered successfully
            </span>
          )}

          {textSnippet && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 max-w-xs text-center line-clamp-2">
              "{textSnippet}"
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="w-full flex items-center justify-center gap-6 pt-4">
          {callState === 'ringing' ? (
            <>
              {/* Decline Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transition-all hover:scale-110 active:scale-95"
                title="Decline Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Answer Button */}
              <button
                type="button"
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 animate-bounce transition-all hover:scale-110 active:scale-95"
                title="Answer Scheduled Call"
              >
                <Phone className="w-7 h-7" />
              </button>
            </>
          ) : callState === 'connected' ? (
            /* End Call Button */
            <button
              type="button"
              onClick={handleEndCall}
              className="px-8 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-rose-600/40 transition-all hover:scale-105"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Voice Call</span>
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
};
