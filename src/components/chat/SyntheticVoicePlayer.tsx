import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Volume2, 
  Sparkles, 
  ShieldAlert, 
  Loader2, 
  FastForward, 
  AlertTriangle 
} from 'lucide-react';
import { VoiceProfile } from '../../types/superApp';
import { playSyntheticVoice } from '../../services/voice/voiceSynthesisEngine';
import { evaluateVoiceSafety } from '../../services/voice/voiceSafetyPolicy';

interface SyntheticVoicePlayerProps {
  messageId: string;
  senderName: string;
  senderId?: string;
  text: string;
  voiceProfile?: Partial<VoiceProfile>;
  isUserMessage: boolean;
}

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5, 2.0];

export const SyntheticVoicePlayer: React.FC<SyntheticVoicePlayerProps> = ({
  messageId,
  senderName,
  text,
  voiceProfile,
  isUserMessage
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stopPlaybackRef = useRef<(() => void) | null>(null);

  const safetyResult = evaluateVoiceSafety(text);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopPlaybackRef.current?.();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlaybackRef.current?.();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    if (!safetyResult.isAllowed) {
      setErrorMsg(safetyResult.warningMessage || 'Voice playback unavailable');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const stopper = playSyntheticVoice(
      messageId,
      text,
      voiceProfile || {
        displayName: `${senderName}'s Voice`,
        pitch: 1.0,
        rate: 1.0,
        timbre: 'warm',
        profileVersion: 1
      },
      {
        speedMultiplier: playbackSpeed,
        onStart: () => {
          setIsLoading(false);
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        onError: (err) => {
          console.warn('Voice playback error:', err);
          setErrorMsg(typeof err === 'string' ? err : 'Voice playback failed');
          setIsPlaying(false);
          setIsLoading(false);
        }
      }
    );

    stopPlaybackRef.current = stopper;
  };

  const handleCycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = SPEED_OPTIONS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    const nextSpeed = SPEED_OPTIONS[nextIndex];
    setPlaybackSpeed(nextSpeed);

    // If currently playing, restart with new speed
    if (isPlaying) {
      stopPlaybackRef.current?.();
      setIsPlaying(false);
      setTimeout(() => {
        handleTogglePlay();
      }, 50);
    }
  };

  // If sensitive content is blocked, display safety alert badge
  if (!safetyResult.isAllowed) {
    return (
      <div className="mt-2 pt-1.5 border-t border-rose-500/20 flex items-center gap-1.5 text-[11px] text-rose-300/90 font-medium">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
        <span>Voice playback blocked for sensitive authentication text</span>
      </div>
    );
  }

  const firstSenderName = senderName.split(' ')[0];

  return (
    <div className={`mt-2 pt-1.5 border-t ${isUserMessage ? 'border-indigo-400/30' : 'border-slate-700/60'} text-xs select-none`}>
      
      {/* Playback Controls Row */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all text-xs font-bold shadow-sm ${
            isPlaying
              ? 'bg-rose-500 text-white animate-pulse'
              : isLoading
              ? 'bg-indigo-600/80 text-white cursor-wait'
              : isUserMessage
              ? 'bg-indigo-800/80 hover:bg-indigo-700 text-white'
              : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30'
          }`}
          title={isPlaying ? 'Stop Voice' : `Play text in ${firstSenderName}'s AI synthetic voice`}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isPlaying ? (
            <Square className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}

          <span>
            {isLoading
              ? 'Generating voice...'
              : isPlaying
              ? 'Playing...'
              : `Play in ${firstSenderName}'s Voice`}
          </span>

          {isPlaying && (
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </button>

        {/* Speed Multiplier Button */}
        <button
          type="button"
          onClick={handleCycleSpeed}
          className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-colors ${
            isUserMessage
              ? 'bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Change playback speed"
        >
          {playbackSpeed}x
        </button>
      </div>

      {/* Mandatory Safety & AI-Generated Voice Indicator */}
      <div className="flex items-center justify-between mt-1 text-[10px] opacity-75 font-mono">
        <span className="flex items-center gap-1 text-indigo-300">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Synthetic AI Voice</span>
        </span>
        
        {safetyResult.reason === 'FINANCIAL_WARNING' && (
          <span className="flex items-center gap-0.5 text-amber-300 font-sans" title="Verify independently">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Verify Request</span>
          </span>
        )}
      </div>

      {/* Error display */}
      {errorMsg && (
        <p className="mt-1 text-[10px] text-rose-300 font-sans">{errorMsg}</p>
      )}

    </div>
  );
};
