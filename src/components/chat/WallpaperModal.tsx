import React from 'react';
import { X, Palette, Check } from 'lucide-react';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: string;
  onSelectWallpaper: (themeClass: string) => void;
}

const WALLPAPERS = [
  {
    id: 'default',
    name: 'Classic Dark Slate (Default)',
    style: 'bg-slate-950/40',
    preview: 'bg-slate-950 border-slate-800'
  },
  {
    id: 'emerald-doodle',
    name: 'Emerald Textured Doodle',
    style: 'bg-[#0b141a] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]',
    preview: 'bg-[#0b141a] border-emerald-500/40'
  },
  {
    id: 'midnight-purple',
    name: 'Deep Midnight Purple',
    style: 'bg-gradient-to-b from-[#182533] via-[#0e1621] to-[#17212b]',
    preview: 'bg-gradient-to-b from-[#182533] to-[#0e1621] border-indigo-500/40'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon Matrix',
    style: 'bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 border-t border-purple-500/20',
    preview: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 border-purple-500/50'
  },
  {
    id: 'sunset-glow',
    name: 'Warm Sunset Glow',
    style: 'bg-gradient-to-b from-slate-950 via-amber-950/30 to-slate-950',
    preview: 'bg-gradient-to-br from-amber-950 via-rose-950 to-slate-950 border-amber-500/40'
  }
];

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  currentWallpaper,
  onSelectWallpaper
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <Palette className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-white">Chat Wallpapers & Themes</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallpaper Grid */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {WALLPAPERS.map((wp) => {
            const isSelected = currentWallpaper === wp.style || (!currentWallpaper && wp.id === 'default');
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => {
                  onSelectWallpaper(wp.style);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl border shadow-inner ${wp.preview}`} />
                  <div>
                    <h4 className="font-bold text-xs text-white">{wp.name}</h4>
                    <p className="text-[10px] text-slate-400">Tap to apply theme</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
