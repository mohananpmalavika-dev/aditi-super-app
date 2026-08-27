import React, { useState } from 'react';
import { X, Search, Sparkles, Image, Heart, Flame, Smile, Film } from 'lucide-react';

interface StickerGifPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string, type: 'sticker' | 'gif') => void;
}

const STICKER_PACKS = [
  {
    name: '🌟 Malayalam & Festive',
    stickers: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: '🐱 Cute & Anime Cats',
    stickers: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=200&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: '🔥 Reactions & Memes',
    stickers: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80'
    ]
  }
];

const TRENDING_GIFS = [
  {
    title: 'Party Celebration',
    url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    preview: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=80'
  },
  {
    title: 'Mind Blown',
    url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    preview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80'
  },
  {
    title: 'Coding Matrix',
    url: 'https://media.giphy.com/media/ule4akeEDWAYE/giphy.gif',
    preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80'
  },
  {
    title: 'Thumbs Up Approval',
    url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
    preview: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    title: 'Sunset Vibes',
    url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80'
  },
  {
    title: 'Laughter',
    url: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif',
    preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  }
];

export const StickerGifPickerModal: React.FC<StickerGifPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia
}) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'gifs'>('stickers');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
        
        {/* Top Header & Tab Toggle */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="font-extrabold text-sm text-white">Stickers & GIFs Studio</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('stickers')}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'stickers'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Stickers (Telegram & Viber)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gifs')}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'gifs'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Trending GIFs (Giphy)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'stickers' ? (
            <div className="space-y-4">
              {STICKER_PACKS.map((pack, pIdx) => (
                <div key={pIdx} className="space-y-2">
                  <span className="text-xs font-bold text-slate-400">{pack.name}</span>
                  <div className="grid grid-cols-4 gap-2.5">
                    {pack.stickers.map((stk, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          onSelectMedia(stk, 'sticker');
                          onClose();
                        }}
                        className="aspect-square rounded-2xl bg-slate-950 border border-slate-800/80 p-1.5 hover:border-indigo-500 hover:scale-105 transition-all shadow-md overflow-hidden group"
                      >
                        <img
                          src={stk}
                          alt="Sticker"
                          className="w-full h-full object-cover rounded-xl group-hover:rotate-6 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {TRENDING_GIFS.map((gif, gIdx) => (
                <button
                  key={gIdx}
                  onClick={() => {
                    onSelectMedia(gif.preview, 'gif');
                    onClose();
                  }}
                  className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden hover:border-indigo-500 hover:scale-[1.02] transition-all relative group text-left"
                >
                  <div className="aspect-video relative">
                    <img
                      src={gif.preview}
                      alt={gif.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-black text-amber-300">
                      GIF
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900/90 border-t border-slate-800">
                    <p className="text-[11px] font-bold text-white truncate">{gif.title}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
