import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  Share2,
  Mic,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTextInSenderVoice, getUserVoiceProfile } from '../../services/voiceCloneService';
import { UserVoiceProfile } from '../../types/superApp';

interface TalkingPortraitModalProps {
  isOpen: boolean;
  senderName: string;
  senderAvatar: string;
  messageText: string;
  voiceProfile?: Partial<UserVoiceProfile>;
  onClose: () => void;
}

export const TalkingPortraitModal: React.FC<TalkingPortraitModalProps> = ({
  isOpen,
  senderName,
  senderAvatar,
  messageText,
  voiceProfile,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [mouthScale, setMouthScale] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [isMiniMode, setIsMiniMode] = useState(false);
  const stopSpeechRef = useRef<(() => void) | null>(null);

  const words = messageText.trim().split(/\s+/);

  useEffect(() => {
    if (isOpen) {
      startTalkingAvatar();
    } else {
      stopSpeechRef.current?.();
      setIsPlaying(false);
    }
    return () => {
      stopSpeechRef.current?.();
    };
  }, [isOpen, messageText]);

  // Audio-reactive lip-sync animation simulation loop
  useEffect(() => {
    let animId: any = null;
    let wordInterval: any = null;

    if (isPlaying) {
      let frame = 0;
      animId = setInterval(() => {
        frame++;
        // Rapid rhythmic mouth open-close for lip-sync effect
        const randomScale = 0.15 + Math.abs(Math.sin(frame * 0.45)) * 0.85 + (Math.random() * 0.2);
        setMouthScale(randomScale);
        setIsMouthOpen(randomScale > 0.4);

        // Subtle head tilt
        setHeadTilt(Math.sin(frame * 0.08) * 3);

        // Periodic blink every ~45 frames
        if (frame % 40 === 0) {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 180);
        }
      }, 70);

      // Karaoke word progress
      const totalWords = words.length;
      const durationPerWordMs = Math.max(220, (messageText.length * 55) / totalWords);
      let curr = 0;
      wordInterval = setInterval(() => {
        if (curr < totalWords) {
          setActiveWordIndex(curr);
          curr++;
        } else {
          clearInterval(wordInterval);
        }
      }, durationPerWordMs);
    } else {
      setMouthScale(0);
      setIsMouthOpen(false);
      setHeadTilt(0);
      setActiveWordIndex(-1);
    }

    return () => {
      clearInterval(animId);
      clearInterval(wordInterval);
    };
  }, [isPlaying, messageText, words.length]);

  const startTalkingAvatar = () => {
    stopSpeechRef.current?.();
    setIsPlaying(true);
    setActiveWordIndex(0);

    const stopper = playTextInSenderVoice(
      messageText,
      voiceProfile,
      () => setIsPlaying(true),
      () => {
        setIsPlaying(false);
        confetti({ particleCount: 35, spread: 50 });
      },
      () => setIsPlaying(false)
    );
    stopSpeechRef.current = stopper;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeechRef.current?.();
      setIsPlaying(false);
    } else {
      startTalkingAvatar();
    }
  };

  const handleReplay = () => {
    startTalkingAvatar();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all ${
      isMiniMode 
        ? 'bottom-6 right-6 w-80 shadow-2xl rounded-3xl animate-in slide-in-from-bottom-5'
        : 'inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4 animate-in fade-in'
    }`}>
      <div className={`relative w-full bg-slate-900 border-2 border-purple-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between ${
        isMiniMode ? 'p-4' : 'max-w-md p-6 min-h-[540px]'
      } animate-in zoom-in-95`}>
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white">
                Live Talking AI Portrait
              </h3>
              <p className="text-[10px] text-purple-300">
                {senderName}'s Audio-reactive Talking Avatar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMiniMode(!isMiniMode)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isMiniMode ? 'Expand' : 'Minimize to PiP'}
            >
              {isMiniMode ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopSpeechRef.current?.();
                onClose();
              }}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Animated Talking Head Portrait */}
        <div className="my-auto py-4 flex flex-col items-center justify-center relative">
          
          {/* Animated Glow Aura Waves */}
          {isPlaying && (
            <>
              <div 
                className="absolute w-52 h-52 rounded-full bg-purple-600/20 blur-2xl animate-pulse" 
                style={{ transform: `scale(${1 + mouthScale * 0.25})` }}
              />
              <div className="absolute w-44 h-44 rounded-full border-2 border-purple-500/40 animate-ping duration-1000" />
            </>
          )}

          {/* Portrait Container with Dynamic 3D Head Tilt */}
          <div 
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-purple-500/70 shadow-2xl transition-transform duration-100 ease-out bg-slate-950 flex items-center justify-center select-none"
            style={{
              transform: `rotate(${headTilt}deg) scale(${isPlaying ? 1.02 : 1})`,
              boxShadow: isPlaying ? '0 0 35px rgba(168, 85, 247, 0.45)' : 'none'
            }}
          >
            {/* Base Portrait Image */}
            <img
              src={senderAvatar}
              alt={senderName}
              className={`w-full h-full object-cover transition-all duration-75 ${
                isBlinking ? 'brightness-90 scale-95' : 'brightness-100 scale-100'
              }`}
            />

            {/* Dynamic Lip-Sync Mouth Morphing Overlay */}
            {isPlaying && (
              <div 
                className="absolute bottom-8 w-10 sm:w-12 rounded-full bg-rose-950/90 border border-rose-500/60 transition-all duration-75 ease-out shadow-inner flex items-center justify-center overflow-hidden"
                style={{
                  height: `${Math.max(4, mouthScale * 22)}px`,
                  transform: `scaleX(${0.8 + mouthScale * 0.4})`,
                  opacity: isMouthOpen ? 0.95 : 0.2
                }}
              >
                {/* Teeth / Tongue Visual Accent */}
                <div 
                  className="w-5 h-1 bg-white/80 rounded-full mb-auto"
                  style={{ opacity: mouthScale > 0.5 ? 0.9 : 0 }}
                />
                <div 
                  className="w-4 h-2 bg-rose-500/80 rounded-full mt-auto"
                  style={{ opacity: mouthScale > 0.6 ? 0.8 : 0 }}
                />
              </div>
            )}

            {/* Eye Blink Darkening Glint Overlay */}
            {isBlinking && (
              <div className="absolute top-14 w-24 h-2 bg-black/70 rounded-full blur-[1px] animate-in fade-in duration-75" />
            )}

            {/* Speaking Status Badge */}
            {isPlaying && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white font-extrabold text-[9px] flex items-center gap-1 shadow-md animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>LIVE</span>
              </div>
            )}
          </div>

          <h4 className="font-extrabold text-sm sm:text-base text-white mt-3 flex items-center gap-1.5">
            <span>{senderName}</span>
            <span className="text-purple-400 text-xs">✨</span>
          </h4>

          {/* Equalizer Wave Strip */}
          {isPlaying && (
            <div className="flex items-center gap-1 mt-2">
              {[25, 70, 45, 95, 60, 100, 80, 50, 90, 35, 75, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full animate-pulse"
                  style={{
                    height: `${h * 0.22}px`,
                    animationDelay: `${i * 0.07}s`
                  }}
                />
              ))}
            </div>
          )}

        </div>

        {/* Live Karaoke Subtitles Display */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 my-2 max-h-24 overflow-y-auto">
          <p className="text-xs sm:text-sm leading-relaxed text-center font-medium">
            {words.map((word, idx) => (
              <span
                key={idx}
                className={`transition-colors duration-150 inline-block mx-0.5 ${
                  idx === activeWordIndex
                    ? 'text-purple-300 font-extrabold scale-110 bg-purple-950 px-1 rounded border border-purple-500/50 shadow-sm'
                    : idx < activeWordIndex
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Bottom Call to Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          
          <button
            type="button"
            onClick={handleReplay}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Replay from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`flex-1 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-purple-600/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Talking Avatar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Watch {senderName} Speak</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
