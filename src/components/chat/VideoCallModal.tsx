import React, { useState, useEffect, useRef } from 'react';
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
  Maximize2,
  Minimize2,
  Split,
  Layers,
  PictureInPicture,
  Users
} from 'lucide-react';
import { DualVideoMergeEngine, DualVideoLayout } from '../../services/DualVideoMergeEngine';
import { WebRTCManager } from '../../services/webrtcService';

interface VideoCallModalProps {
  isOpen: boolean;
  contactName: string;
  contactAvatar: string;
  isVideo: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  contactName,
  contactAvatar,
  isVideo,
  onClose,
  onMinimize
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideo);
  const [callDuration, setCallDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mergeLayout, setMergeLayout] = useState<DualVideoLayout>('SIDE_BY_SIDE');
  const [showDualMerge, setShowDualMerge] = useState(true);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mergeEngineRef = useRef<DualVideoMergeEngine | null>(null);
  const webrtcManagerRef = useRef<WebRTCManager | null>(null);

  // Call duration counter
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

  // Initialize WebRTC & Dual Merge Engine
  useEffect(() => {
    if (isOpen && isVideo) {
      const engine = new DualVideoMergeEngine(1280, 720, mergeLayout);
      mergeEngineRef.current = engine;

      const webrtc = new WebRTCManager();
      webrtcManagerRef.current = webrtc;

      // Start local camera stream
      webrtc.startLocalMedia(!isVideoOff, !isAudioMuted).then((stream) => {
        if (stream && mergeEngineRef.current) {
          mergeEngineRef.current.setLocalStream(stream);
        }
      });

      engine.start();

      const canvas = engine.getCanvas();
      canvas.className = 'w-full h-full object-contain rounded-2xl';
      
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = '';
        canvasContainerRef.current.appendChild(canvas);
      }
    }

    return () => {
      mergeEngineRef.current?.destroy();
      webrtcManagerRef.current?.stopAllTracks();
    };
  }, [isOpen, isVideo]);

  // Update layout changes dynamically
  useEffect(() => {
    if (mergeEngineRef.current) {
      mergeEngineRef.current.setLayout(mergeLayout);
    }
  }, [mergeLayout]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleMic = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    webrtcManagerRef.current?.toggleAudio(!nextMuted);
  };

  const handleToggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);
    webrtcManagerRef.current?.toggleVideo(!nextVideoOff);
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      const stream = await webrtcManagerRef.current?.startLocalMedia(!isVideoOff, !isAudioMuted);
      mergeEngineRef.current?.setLocalStream(stream || null);
    } else {
      const screenStream = await webrtcManagerRef.current?.startScreenShare();
      if (screenStream) {
        setIsScreenSharing(true);
        mergeEngineRef.current?.setLocalStream(screenStream);
      }
    }
  };

  const handleNativePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (mergeEngineRef.current) {
        const stream = mergeEngineRef.current.captureMergedStream();
        const tempVideo = document.createElement('video');
        tempVideo.srcObject = stream;
        tempVideo.muted = true;
        await tempVideo.play();
        await tempVideo.requestPictureInPicture();
      }
    } catch (err) {
      onMinimize();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92dvh] rounded-3xl bg-slate-950 border-2 border-indigo-500/40 overflow-hidden shadow-2xl flex flex-col justify-between my-auto">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent flex items-center justify-between z-20 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/60"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">{contactName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  WebRTC P2P
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline">
                  STUN Encrypted
                </span>
              </div>
              <p className="text-xs font-mono text-indigo-300">
                {formatDuration(callDuration)} • 30 FPS Dual Stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Layout Mode Switcher */}
            {isVideo && (
              <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  onClick={() => setMergeLayout('SIDE_BY_SIDE')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    mergeLayout === 'SIDE_BY_SIDE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Side by Side Split"
                >
                  <Split className="w-3.5 h-3.5 inline mr-1" />
                  Split
                </button>
                <button
                  onClick={() => setMergeLayout('PIP')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    mergeLayout === 'PIP' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Picture in Picture Thumbnail"
                >
                  <PictureInPicture className="w-3.5 h-3.5 inline mr-1" />
                  PiP
                </button>
              </div>
            )}

            {/* Minimize to Floating Widget */}
            <button
              onClick={onMinimize}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Minimize to Floating PiP"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Viewport: Canvas Dual Video Merge Stream */}
        <div className="relative flex-1 min-h-[360px] sm:min-h-[440px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 overflow-hidden m-3 rounded-2xl border border-slate-800">
          
          {isVideo ? (
            <div ref={canvasContainerRef} className="w-full h-full flex items-center justify-center relative p-2" />
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="relative inline-block">
                <img
                  src={contactAvatar}
                  alt={contactName}
                  className="w-28 sm:w-36 h-28 sm:h-36 rounded-3xl object-cover ring-4 ring-indigo-500/50 shadow-2xl animate-pulse"
                />
                <span className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <Phone className="w-5 h-5" />
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{contactName}</h2>
              <p className="text-xs text-indigo-400 font-mono">WebRTC HD Audio Stream Active</p>
            </div>
          )}

          {/* Floating Call Info Tag */}
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs text-slate-200 border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dual Stream Combined</span>
          </div>
        </div>

        {/* Bottom Call Controls Toolbar */}
        <div className="p-4 bg-slate-950/95 border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-4 z-20">
          
          {/* Mute Microphone */}
          <button
            onClick={handleToggleMic}
            className={`p-3.5 rounded-2xl transition-all ${
              isAudioMuted
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isAudioMuted ? 'Unmute' : 'Mute'}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Camera Toggle */}
          {isVideo && (
            <button
              onClick={handleToggleVideo}
              className={`p-3.5 rounded-2xl transition-all ${
                isVideoOff
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Screen Share */}
          {isVideo && (
            <button
              onClick={handleScreenShare}
              className={`p-3.5 rounded-2xl transition-all ${
                isScreenSharing
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
              <Monitor className="w-5 h-5" />
            </button>
          )}

          {/* Native Browser Picture-in-Picture */}
          {isVideo && (
            <button
              onClick={handleNativePiP}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Pop out in Picture-in-Picture"
            >
              <PictureInPicture className="w-5 h-5" />
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={() => {
              webrtcManagerRef.current?.stopAllTracks();
              mergeEngineRef.current?.destroy();
              onClose();
            }}
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
