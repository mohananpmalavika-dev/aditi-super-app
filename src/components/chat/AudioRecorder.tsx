import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Trash2, Send, FileText, Globe, Sparkles } from 'lucide-react';
import { startVoiceRecognition, stopVoiceRecognition, SpeechLanguage, isSpeechRecognitionSupported } from '../../services/voiceToTextService';

interface AudioRecorderProps {
  onSendAudio: (audioData: { duration: number; bars: number[] }) => void;
  onSendTranscribedText?: (text: string) => void;
  onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onSendAudio,
  onSendTranscribedText,
  onCancel
}) => {
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>([40, 60, 30, 80, 50, 90, 70, 45, 60, 85, 35, 95]);
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechLang, setSpeechLang] = useState<SpeechLanguage>('ml-IN');
  const timerRef = useRef<any>(null);
  const stopRecognitionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Start audio duration timer & waveform simulation
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
      setBars((prev) => [
        ...prev.slice(1),
        Math.floor(Math.random() * 70) + 25
      ]);
    }, 1000);

    // Auto-start live speech recognition if supported
    if (isSpeechRecognitionSupported()) {
      setIsTranscribing(true);
      const stopper = startVoiceRecognition({
        lang: speechLang,
        continuous: true,
        interimResults: true,
        onResult: (text) => {
          setTranscribedText(text);
        },
        onError: () => {
          setIsTranscribing(false);
        }
      });
      stopRecognitionRef.current = stopper;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecognitionRef.current?.();
      stopVoiceRecognition();
    };
  }, [speechLang]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendVoiceMemo = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopRecognitionRef.current?.();
    onSendAudio({ duration: Math.max(duration, 1), bars });
  };

  const handleSendAsText = () => {
    if (!transcribedText.trim()) return;
    if (timerRef.current) clearInterval(timerRef.current);
    stopRecognitionRef.current?.();
    if (onSendTranscribedText) {
      onSendTranscribedText(transcribedText.trim());
    } else {
      onSendAudio({ duration: Math.max(duration, 1), bars });
    }
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl animate-in fade-in space-y-2.5">
      
      {/* Top Controls Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Recording Pulse */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-rose-400">
              {formatTime(duration)}
            </span>
          </div>

          {/* Dynamic Waveform Visualizer */}
          <div className="flex items-center gap-1 h-8 px-2 bg-slate-950/80 rounded-xl border border-slate-800">
            {bars.map((height, idx) => (
              <div
                key={idx}
                className="w-1 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* Language Toggle Pill */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
            <button
              type="button"
              onClick={() => setSpeechLang('ml-IN')}
              className={`px-2 py-0.5 rounded-lg font-extrabold transition-all ${
                speechLang === 'ml-IN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              മലയാളം
            </button>
            <button
              type="button"
              onClick={() => setSpeechLang('en-IN')}
              className={`px-2 py-0.5 rounded-lg font-extrabold transition-all ${
                speechLang === 'en-IN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Cancel / Trash */}
          <button
            type="button"
            onClick={() => {
              stopRecognitionRef.current?.();
              onCancel();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Cancel Recording"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Send as Transcribed Text (Voice to Text) */}
          {transcribedText.trim() && (
            <button
              type="button"
              onClick={handleSendAsText}
              className="p-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
              title="Convert Voice to Text and Send"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Send as Text (എഴുത്ത്)</span>
            </button>
          )}

          {/* Send Raw Audio Memo */}
          <button
            type="button"
            onClick={handleSendVoiceMemo}
            className="p-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Audio</span>
          </button>
        </div>
      </div>

      {/* Live Speech Recognition Transcription Banner */}
      {isTranscribing && (
        <div className="p-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 flex items-start gap-2 text-xs">
          <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
            <Mic className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
              <span className="flex items-center gap-1 text-indigo-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Voice to Text ({speechLang === 'ml-IN' ? 'മലയാളം' : 'English'} തത്സമയം):</span>
              </span>
              <span className="text-[9px] text-slate-500">Live speech recognition</span>
            </div>
            <p className="text-slate-200 font-medium text-xs leading-relaxed italic">
              {transcribedText || 'Speak now... നിങ്ങളുടെ ശബ്ദം ഇവിടെ എഴുത്തായി കാണാം...'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
