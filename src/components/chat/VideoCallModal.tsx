import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Sparkles, 
  ShieldCheck, 
  Flame,
  Phone,
  Maximize2
} from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  contactName: string;
  contactAvatar: string;
  isVideo: boolean;
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  contactName,
  contactAvatar,
  isVideo,
  onClose
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideo);
  const [callDuration, setCallDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      return;
    }
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl bg-slate-950 border border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/60"
            />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>{contactName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  HD Encrypted
                </span>
              </h3>
              <p className="text-xs font-mono text-indigo-300">
                {formatDuration(callDuration)} • Connected via Aditi Peer Net
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>P2P E2EE</span>
            </span>
          </div>
        </div>

        {/* Main Remote Video / Visual Feed */}
        <div className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 overflow-hidden m-4 rounded-2xl border border-slate-800">
          {isVideo && !isVideoOff ? (
            <div className="relative w-full h-full">
              <img
                src={contactAvatar}
                alt="Remote Video"
                className="w-full h-full object-cover opacity-85 filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{contactName}</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img
                  src={contactAvatar}
                  alt={contactName}
                  className="w-32 h-32 rounded-3xl object-cover ring-4 ring-indigo-500/50 shadow-2xl animate-pulse"
                />
                <span className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <Phone className="w-5 h-5" />
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{contactName}</h2>
              <p className="text-xs text-slate-400 font-mono">Audio Stream Active</p>
            </div>
          )}

          {/* Self Video PiP Thumbnail */}
          {isVideo && (
            <div className="absolute top-4 right-4 w-32 sm:w-44 h-24 sm:h-32 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl bg-slate-900 z-30">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Self View"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-black/70 text-[9px] text-white">
                You
              </div>
            </div>
          )}
        </div>

        {/* Bottom Call Controls Toolbar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-center gap-4 z-20">
          
          {/* Mute Microphone */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-3.5 rounded-2xl transition-all ${
              isAudioMuted
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isAudioMuted ? 'Unmute' : 'Mute'}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-2xl transition-all ${
              isVideoOff
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3.5 rounded-2xl transition-all ${
              isScreenSharing
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Share Screen"
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Hang Up Button */}
          <button
            onClick={onClose}
            className="p-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-xs">End Call</span>
          </button>

        </div>

      </div>
    </div>
  );
};
