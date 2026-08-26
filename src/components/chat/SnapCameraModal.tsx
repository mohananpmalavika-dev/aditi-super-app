import React, { useState } from 'react';
import { Camera, X, Sparkles, Flame, Send, Timer } from 'lucide-react';

interface SnapCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSnap: (snapUrl: string, duration: number) => void;
}

const SAMPLE_SNAPS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
];

export const SnapCameraModal: React.FC<SnapCameraModalProps> = ({
  isOpen,
  onClose,
  onSendSnap
}) => {
  const [selectedSnap, setSelectedSnap] = useState(SAMPLE_SNAPS[0]);
  const [snapDuration, setSnapDuration] = useState(5); // seconds
  const [caption, setCaption] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    onSendSnap(selectedSnap, snapDuration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Aditi Ephemeral Snap</span>
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Self-destructs after viewing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snap Preview Canvas */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <img
            src={selectedSnap}
            alt="Snap Preview"
            className="w-full h-full object-cover"
          />

          {/* Caption Overlay */}
          {caption && (
            <div className="absolute bottom-12 left-0 right-0 py-2 bg-black/60 backdrop-blur-md text-center text-xs font-semibold text-white">
              {caption}
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-400 flex items-center gap-1">
            <Timer className="w-3.5 h-3.5" />
            <span>{snapDuration}s View</span>
          </div>
        </div>

        {/* Choose Sample Snap */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Select Capture
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_SNAPS.map((snap, idx) => (
              <img
                key={idx}
                src={snap}
                alt="Option"
                onClick={() => setSelectedSnap(snap)}
                className={`h-16 w-full object-cover rounded-xl cursor-pointer border-2 transition-all ${
                  selectedSnap === snap
                    ? 'border-purple-500 scale-105 shadow-md shadow-purple-500/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Caption Input & Timer Slider */}
        <div className="space-y-3 pt-1">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a snap caption..."
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>View Timer:</span>
            <div className="flex gap-1.5">
              {[3, 5, 10].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSnapDuration(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    snapDuration === t
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Send Ephemeral Snap</span>
        </button>

      </div>
    </div>
  );
};
