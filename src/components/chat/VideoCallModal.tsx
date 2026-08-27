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
  Users,
  UserPlus,
  Search,
  X,
  Check,
  Radio,
  Share2,
  Grid,
  Volume2
} from 'lucide-react';
import { DualVideoMergeEngine, DualVideoLayout } from '../../services/DualVideoMergeEngine';
import { WebRTCManager } from '../../services/webrtcService';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

interface VideoCallModalProps {
  isOpen: boolean;
  contactName: string;
  contactAvatar: string;
  isVideo: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

interface MergedParticipant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  contactName,
  contactAvatar,
  isVideo,
  onClose,
  onMinimize
}) => {
  const { chats, showToast, user } = useSuperApp();

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideo);
  const [callDuration, setCallDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mergeLayout, setMergeLayout] = useState<DualVideoLayout>('SIDE_BY_SIDE');
  
  // Call Merge / Conference State
  const [mergedParticipants, setMergedParticipants] = useState<MergedParticipant[]>([]);
  const [isMergeDrawerOpen, setIsMergeDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mergeEngineRef = useRef<DualVideoMergeEngine | null>(null);
  const webrtcManagerRef = useRef<WebRTCManager | null>(null);

  // Call duration counter
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setMergedParticipants([]);
      setIsMergeDrawerOpen(false);
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
      showToast('🖥️ Screen sharing stopped. Switched back to camera.');
      const stream = await webrtcManagerRef.current?.startLocalMedia(!isVideoOff, !isAudioMuted);
      mergeEngineRef.current?.setLocalStream(stream || null);
    } else {
      try {
        const screenStream = await webrtcManagerRef.current?.startScreenShare();
        if (screenStream && screenStream.getVideoTracks().length > 0) {
          setIsScreenSharing(true);
          mergeEngineRef.current?.setLocalStream(screenStream);
          showToast('🖥️ Screen sharing active! Broadcasting full desktop/app window (1080p).');
          
          // Revert when user clicks browser's native stop share button
          screenStream.getVideoTracks()[0].onended = async () => {
            setIsScreenSharing(false);
            showToast('🖥️ Screen sharing ended.');
            const camStream = await webrtcManagerRef.current?.startLocalMedia(!isVideoOff, !isAudioMuted);
            mergeEngineRef.current?.setLocalStream(camStream || null);
          };
        } else {
          showToast('Screen share cancelled or not supported on this device.');
        }
      } catch (err) {
        console.warn('Screen share error:', err);
        showToast('Screen share permission denied or unsupported.');
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

  // Merge another contact into the ongoing call
  const handleMergeContact = (chat: any) => {
    if (mergedParticipants.some((p) => p.id === chat.id)) {
      showToast(`${chat.participantName} is already merged in this call.`);
      return;
    }

    const newParticipant: MergedParticipant = {
      id: chat.id,
      name: chat.participantName,
      avatar: chat.participantAvatar,
      role: chat.roleOrContext,
      isMuted: false,
      isVideoOff: false,
      isSpeaking: true
    };

    setMergedParticipants((prev) => [...prev, newParticipant]);
    confetti({ particleCount: 60, spread: 70 });
    showToast(`🎉 Merged ${chat.participantName} into conference call!`);
    setIsMergeDrawerOpen(false);
  };

  const handleRemoveMerged = (id: string, name: string) => {
    setMergedParticipants((prev) => prev.filter((p) => p.id !== id));
    showToast(`Removed ${name} from call.`);
  };

  const filteredContacts = chats.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleOrContext.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCallersCount = 2 + mergedParticipants.length; // Host (User) + Primary Remote + Merged contacts

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[94dvh] rounded-3xl bg-slate-950 border-2 border-indigo-500/40 overflow-hidden shadow-2xl flex flex-col justify-between my-auto">
        
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent flex items-center justify-between z-20 border-b border-slate-800/80">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            
            {/* Avatars Cluster */}
            <div className="flex items-center -space-x-3 flex-shrink-0">
              <img
                src={contactAvatar}
                alt={contactName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/60"
              />
              {mergedParticipants.map((p) => (
                <img
                  key={p.id}
                  src={p.avatar}
                  alt={p.name}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-purple-500/80 animate-in zoom-in-50"
                />
              ))}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-extrabold text-xs sm:text-base text-white truncate">
                  {mergedParticipants.length === 0
                    ? contactName
                    : `${contactName} + ${mergedParticipants.length} others`}
                </h3>
                
                {mergedParticipants.length > 0 ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Merged Conference ({totalCallersCount} In Call)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Dual WebRTC P2P
                  </span>
                )}
                
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline">
                  E2EE Encrypted
                </span>
              </div>
              <p className="text-xs font-mono text-indigo-300">
                {formatDuration(callDuration)} • {isVideo ? '30 FPS HD Video Merge' : 'HD Audio Conference'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Merge Call / Add Contact Button */}
            <button
              onClick={() => setIsMergeDrawerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
              title="Merge another contact into this call (Call Merger)"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Merge Call</span>
            </button>

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

        {/* Main Viewport: Multi-Party Call Merge Grid OR 1-on-1 Dual Merge Stream */}
        <div className="relative flex-1 min-h-[360px] sm:min-h-[440px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 overflow-hidden m-2 sm:m-3 rounded-2xl border border-slate-800">
          
          {mergedParticipants.length === 0 ? (
            /* 1-on-1 Dual Merge View */
            isVideo ? (
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
            )
          ) : (
            /* Merged Conference Multi-Tile Grid */
            <div className={`w-full h-full p-2 sm:p-3 grid gap-2.5 ${
              totalCallersCount <= 2 ? 'grid-cols-2' : totalCallersCount === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-2'
            }`}>
              
              {/* Tile 1: Primary Contact */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-indigo-500/50 shadow-xl flex items-center justify-center group">
                <img
                  src={contactAvatar}
                  alt={contactName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Volume2 className="w-2.5 h-2.5 animate-pulse" />
                      Speaking
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white truncate">{contactName}</h4>
                    <span className="text-[10px] text-indigo-300">Primary Peer</span>
                  </div>
                </div>
              </div>

              {/* Tile 2: Local User (Self) */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-indigo-500/30 shadow-xl flex items-center justify-center">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-950/80 text-[10px] font-bold text-indigo-300 border border-indigo-500/40">
                      You (Host)
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white truncate">{user.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Local HD Stream</span>
                  </div>
                </div>
              </div>

              {/* Merged Participant Tiles */}
              {mergedParticipants.map((p) => (
                <div
                  key={p.id}
                  className="relative rounded-2xl overflow-hidden bg-slate-900 border border-purple-500/50 shadow-xl flex items-center justify-center group animate-in zoom-in-95"
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg bg-purple-950/80 text-[10px] font-bold text-purple-300 border border-purple-500/40 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        Merged
                      </span>

                      <button
                        onClick={() => handleRemoveMerged(p.id, p.name)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[10px] font-bold transition-opacity"
                        title="Remove from call"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white truncate">{p.name}</h4>
                      <span className="text-[10px] text-purple-300 truncate block">{p.role}</span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Screen Sharing Live Broadcast Floating HUD */}
          {isScreenSharing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-950/90 border border-emerald-500/50 backdrop-blur-md shadow-2xl flex items-center gap-3 z-30 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs">
                <Monitor className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>You are sharing your screen (Full HD)</span>
              </div>
              <button
                onClick={handleScreenShare}
                className="px-2.5 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[10px] transition-colors"
              >
                Stop Sharing
              </button>
            </div>
          )}

          {/* Floating Call Info Tag */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs text-slate-200 border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {isScreenSharing
                ? 'Desktop Screen Broadcast Active (1080p 60fps)'
                : mergedParticipants.length === 0
                ? 'Dual Stream Combined (Canvas 30 FPS)'
                : `Merged Conference (${totalCallersCount} Participants)`}
            </span>
          </div>
        </div>

        {/* Bottom Call Controls Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-950/95 border-t border-slate-800 flex items-center justify-center gap-2 sm:gap-4 z-20 flex-wrap">
          
          {/* Mute Microphone */}
          <button
            onClick={handleToggleMic}
            className={`p-3 sm:p-3.5 rounded-2xl transition-all ${
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
              className={`p-3 sm:p-3.5 rounded-2xl transition-all ${
                isVideoOff
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Screen Share (1080p Screen / Window / Tab Sharing) */}
          {isVideo && (
            <button
              onClick={handleScreenShare}
              className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-1.5 ${
                isScreenSharing
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen (Full Desktop / Window / Browser Tab)'}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-xs font-bold hidden md:inline">
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </span>
            </button>
          )}

          {/* Merge Call / Add Contact Button */}
          <button
            onClick={() => setIsMergeDrawerOpen(true)}
            className="p-3 sm:p-3.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 transition-colors flex items-center gap-1.5"
            title="Merge Call (കോൺഫറൻസ് കോൾ ലയനം)"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-xs font-bold hidden md:inline">Merge Call</span>
          </button>

          {/* Native Browser Picture-in-Picture */}
          {isVideo && (
            <button
              onClick={handleNativePiP}
              className="p-3 sm:p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors hidden sm:block"
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
            className="p-3 sm:p-3.5 px-5 sm:px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-xs">End Call</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* CALL MERGER CONTACT SELECTOR MODAL / DRAWER */}
      {/* ========================================================================= */}
      {isMergeDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
            
            {/* Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400">
                <Users className="w-5 h-5" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">Call Merger (കോൺഫറൻസ് കോൾ ലയനം)</h3>
                  <p className="text-[11px] text-slate-400">Select a contact to merge into this live call</p>
                </div>
              </div>
              <button
                onClick={() => setIsMergeDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Contacts */}
            <div className="p-3.5 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts to merge into call..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredContacts.map((c) => {
                const isAlreadyIn = c.participantName === contactName || mergedParticipants.some((p) => p.id === c.id);
                return (
                  <div
                    key={c.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      isAlreadyIn
                        ? 'bg-slate-950/40 border-slate-800/40 opacity-50'
                        : 'bg-slate-950 border-slate-800 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={c.participantAvatar}
                        alt={c.participantName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{c.participantName}</h4>
                        <p className="text-[11px] text-indigo-400 font-medium truncate">{c.roleOrContext}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyIn}
                      onClick={() => handleMergeContact(c)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        isAlreadyIn
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-md shadow-purple-600/30 hover:scale-105'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isAlreadyIn ? 'In Call' : 'Merge Call'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 text-center">
              <span className="text-xs text-purple-300 font-mono">
                Supports Multi-party HD Canvas Merge & Grid Layouts
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
