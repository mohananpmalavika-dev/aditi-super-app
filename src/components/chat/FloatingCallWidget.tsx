import React from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Maximize2, 
  Sparkles,
  Users
} from 'lucide-react';

interface FloatingCallWidgetProps {
  contactName: string;
  contactAvatar: string;
  isVideo: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  callDuration: number;
  onMaximize: () => void;
  onEndCall: () => void;
  onToggleMic: () => void;
  onToggleVideo: () => void;
}

export const FloatingCallWidget: React.FC<FloatingCallWidgetProps> = ({
  contactName,
  contactAvatar,
  isVideo,
  isMuted,
  isVideoOff,
  callDuration,
  onMaximize,
  onEndCall,
  onToggleMic,
  onToggleVideo
}) => {
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-72 sm:w-80 rounded-3xl bg-slate-950/95 border-2 border-indigo-500/60 shadow-2xl backdrop-blur-2xl p-3.5 animate-in slide-in-from-bottom-5">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-extrabold text-xs text-white truncate">{contactName}</span>
          <span className="text-[10px] text-indigo-300 font-mono">{formatDuration(callDuration)}</span>
        </div>

        <button
          onClick={onMaximize}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Expand to Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mini Visual Area */}
      <div className="relative h-24 my-2.5 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
        {isVideo && !isVideoOff ? (
          <img
            src={contactAvatar}
            alt={contactName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/50"
            />
            <div>
              <span className="text-xs font-bold text-white block truncate">{contactName}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Audio Connected</span>
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[9px] text-indigo-300 font-bold flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>Dual Feed Active</span>
        </div>
      </div>

      {/* Mini Controls Bar */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <button
          onClick={onToggleMic}
          className={`p-2 rounded-xl text-xs transition-colors ${
            isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {isVideo && (
          <button
            onClick={onToggleVideo}
            className={`p-2 rounded-xl text-xs transition-colors ${
              isVideoOff ? 'bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>
        )}

        <button
          onClick={onEndCall}
          className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>End Call</span>
        </button>
      </div>

    </div>
  );
};
