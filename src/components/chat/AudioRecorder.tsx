import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Trash2, Send, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
  onSendAudio: (audioData: { duration: number; bars: number[] }) => void;
  onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSendAudio, onCancel }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>([40, 60, 30, 80, 50, 90, 70, 45, 60, 85, 35, 95]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
      // Simulate live audio waveform fluctuations
      setBars((prev) => [
        ...prev.slice(1),
        Math.floor(Math.random() * 70) + 25
      ]);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSend = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onSendAudio({ duration: Math.max(duration, 1), bars });
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl animate-in fade-in">
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
      </div>

      <div className="flex items-center gap-2">
        {/* Cancel / Trash */}
        <button
          onClick={onCancel}
          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
          title="Cancel Recording"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Send Audio */}
        <button
          onClick={handleSend}
          className="p-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Voice</span>
        </button>
      </div>
    </div>
  );
};
