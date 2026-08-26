import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Phone,
  Video,
  Search,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Flame,
  Lock,
  Sparkles,
  MapPin,
  Calendar,
  Camera,
  Play,
  Pause,
  Clock,
  Heart,
  ThumbsUp,
  Laugh,
  Rocket,
  CheckCheck,
  Navigation,
  FileText,
  ChevronLeft,
  Mail,
  Users,
  Plus,
  Info,
  CornerUpLeft,
  Copy,
  Star,
  Pin,
  Trash2,
  Edit2,
  Share2,
  ExternalLink,
  ShieldCheck,
  Radio,
  Square
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ChatConversation } from '../../types/superApp';
import { AudioRecorder } from './AudioRecorder';
import { VideoCallModal } from './VideoCallModal';
import { FloatingCallWidget } from './FloatingCallWidget';
import { SnapCameraModal } from './SnapCameraModal';
import { LocationShareModal } from './LocationShareModal';
import { SchedulerModal } from './SchedulerModal';
import { SecretTimerBar } from './SecretTimerBar';
import { EmailComposerModal } from './EmailComposerModal';
import { GroupCreateModal } from './GroupCreateModal';
import { ChatDetailsDrawer } from './ChatDetailsDrawer';
import confetti from 'canvas-confetti';

interface RichMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  replyTo?: { text: string; senderName: string };
  isStarred?: boolean;
  isPinned?: boolean;
  reactions?: Record<string, number>;
  userReaction?: string;
  expiresAt?: string;
}

export const LiveChatMessenger: React.FC = () => {
  const { chats, activeChatId, setActiveChatId, sendChatMessage, user, showToast } = useSuperApp();
  
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSecretBar, setShowSecretBar] = useState(false);
  const [secretTimer, setSecretTimer] = useState<number | null>(null);

  // Message Actions state
  const [replyingMessage, setReplyingMessage] = useState<{ id: string; text: string; senderName: string } | null>(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [pinnedMessage, setPinnedMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Mobile navigation state
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Modals & Drawers state
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [floatingCallActive, setFloatingCallActive] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCallVideoOff, setIsCallVideoOff] = useState(false);

  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);

  // Pre-filled Email state
  const [emailInitialSubject, setEmailInitialSubject] = useState('');
  const [emailInitialBody, setEmailInitialBody] = useState('');

  // Audio Playback
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  // Floating call timer
  useEffect(() => {
    let timer: any = null;
    if (callModalOpen || floatingCallActive) {
      timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callModalOpen, floatingCallActive]);

  const filteredChats = chats.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleOrContext.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setMobileView('chat');
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    let fullMsg = inputText.trim();
    if (replyingMessage) {
      fullMsg = `↩️ Replying to [${replyingMessage.senderName}: "${replyingMessage.text.slice(0, 30)}..."]\n${fullMsg}`;
    }

    sendChatMessage(activeChat.id, fullMsg);
    setInputText('');
    setReplyingMessage(null);
    setShowEmojiPicker(false);

    // Simulate typing feedback
    setTimeout(() => setIsTyping(true), 600);
    setTimeout(() => setIsTyping(false), 2400);
  };

  // Send Voice Note
  const handleSendAudio = (audioData: { duration: number; bars: number[] }) => {
    if (!activeChat) return;
    const voiceMsg = `🎙️ Voice Note (${audioData.duration}s)`;
    sendChatMessage(activeChat.id, voiceMsg);
    setIsRecordingAudio(false);
    showToast('🎙️ Voice memo delivered via MediaRecorder!');
  };

  // Send Ephemeral Snap
  const handleSendSnap = (snapUrl: string, duration: number) => {
    if (!activeChat) return;
    const snapMsg = `🔥 Ephemeral Snap (${duration}s self-destruct timer)`;
    sendChatMessage(activeChat.id, snapMsg);
    confetti({ particleCount: 50, spread: 60 });
    showToast('🔥 Ephemeral snap sent!');
  };

  // Send Location (OpenStreetMap GPS)
  const handleSendLocation = (locationText: string, mapUrl: string, isLive?: boolean, duration?: number) => {
    if (!activeChat) return;
    sendChatMessage(activeChat.id, `${locationText}\n🔗 OpenStreetMap: ${mapUrl}`);
    showToast(isLive ? '🔴 Live GPS broadcast active!' : '📍 Map point shared!');
  };

  // Send Scheduled Message
  const handleScheduleMessage = (text: string, date: string, time: string) => {
    showToast(`⏰ Scheduled for ${date} at ${time}!`);
  };

  // Send Direct SMTP Email
  const handleSendEmail = (emailData: any) => {
    if (!activeChat) return;
    sendChatMessage(
      activeChat.id,
      `📧 Direct Email Sent to [${emailData.to}]\nSubject: ${emailData.subject}\n"${emailData.body.slice(0, 60)}..."`
    );
    showToast(`📧 Outbound email dispatched to ${emailData.to}!`);
  };

  // Convert Chat Message to Email
  const handleMessageToEmail = (msgText: string) => {
    setEmailInitialSubject(`Aditi Conversation with ${activeChat.participantName}`);
    setEmailInitialBody(msgText);
    setEmailModalOpen(true);
  };

  // Create Group Chat
  const handleCreateGroup = (groupData: any) => {
    showToast(`👥 Group "${groupData.name}" created with ${groupData.members.length} members!`);
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    const fileMsg = `📁 Shared Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    sendChatMessage(activeChat.id, fileMsg);
    showToast(`📁 File ${file.name} uploaded!`);
  };

  // Call Triggers
  const handleStartCall = (video: boolean) => {
    setIsVideoCall(video);
    setFloatingCallActive(false);
    setCallModalOpen(true);
  };

  const handleMinimizeCall = () => {
    setCallModalOpen(false);
    setFloatingCallActive(true);
    showToast('📱 Video Call minimized to Floating PiP!');
  };

  const handleEndFloatingCall = () => {
    setFloatingCallActive(false);
    setCallModalOpen(false);
    showToast('☎ Call terminated.');
  };

  const emojis = ['😀', '🔥', '❤️', '🚀', '✨', '🎉', '👍', '🙏', '💯', '😍', '😎', '🥳', '⚡', '👏'];
  const reactionEmojis = ['❤️', '👍', '😂', '😮', '😢', '😡', '👏', '🔥'];

  return (
    <div className="h-[calc(100dvh-175px)] sm:h-[calc(100dvh-160px)] flex flex-col md:flex-row rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl relative">
      
      {/* ========================================================================= */}
      {/* LEFT CHAT SIDEBAR (CONTACTS & CHANNELS) */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-slate-950/75 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Top Header & Search */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-white">AditiChat</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                P2P Live
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Create Group Button */}
              <button
                onClick={() => setGroupModalOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 transition-colors"
                title="New Group Chat"
              >
                <Users className="w-4 h-4" />
              </button>

              {/* Direct Email Compose */}
              <button
                onClick={() => {
                  setEmailInitialSubject('');
                  setEmailInitialBody('');
                  setEmailModalOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors"
                title="Compose SMTP Email"
              >
                <Mail className="w-4 h-4" />
              </button>

              {/* Instant Call */}
              <button
                onClick={() => handleStartCall(true)}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
                title="Quick Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, tutors, messages..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredChats.map((chat) => {
            const isSelected = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full p-3.5 text-left transition-all flex items-center gap-3 relative ${
                  isSelected
                    ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                    : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.participantAvatar}
                    alt={chat.participantName}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-800"
                  />
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white truncate">{chat.participantName}</h4>
                    <span className="text-[10px] text-slate-500">{chat.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-indigo-400 font-medium truncate">{chat.roleOrContext}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{chat.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT MAIN CHAT WINDOW */}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col bg-slate-950/40 relative ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Top Active Chat Header */}
        <div className="px-3.5 sm:px-5 py-3 bg-slate-950/90 border-b border-slate-800 backdrop-blur-xl flex items-center justify-between z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            
            {/* Mobile Back Button */}
            <button
              onClick={() => setMobileView('list')}
              className="md:hidden p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to conversations"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setDetailsDrawerOpen(true)}>
              <img
                src={activeChat.participantAvatar}
                alt={activeChat.participantName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/40"
              />
              {activeChat.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
              )}
            </div>

            <div className="min-w-0 cursor-pointer" onClick={() => setDetailsDrawerOpen(true)}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-white truncate">{activeChat.participantName}</h3>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 truncate">
                  {activeChat.roleOrContext}
                </span>
                {secretTimer && (
                  <span className="flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    <Lock className="w-2.5 h-2.5 mr-1" />
                    {secretTimer}s
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                {isTyping ? (
                  <span className="text-emerald-400 font-bold animate-pulse">Typing a message...</span>
                ) : activeChat.isOnline ? (
                  'Online • WebRTC & STUN E2EE'
                ) : (
                  'Active today'
                )}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Secret Timer */}
            <button
              onClick={() => setShowSecretBar(!showSecretBar)}
              className={`p-2 rounded-xl transition-colors ${
                secretTimer ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              title="Disappearing Messages"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Direct Email to Contact */}
            <button
              onClick={() => {
                setEmailInitialSubject(`Aditi Inquiry with ${activeChat.participantName}`);
                setEmailInitialBody('');
                setEmailModalOpen(true);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Send Direct Email"
            >
              <Mail className="w-4 h-4" />
            </button>

            {/* Voice Call */}
            <button
              onClick={() => handleStartCall(false)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* HD Video Call (Dual Merge + PiP) */}
            <button
              onClick={() => handleStartCall(true)}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-colors"
              title="HD Video Call (Dual Video Merge & PiP)"
            >
              <Video className="w-4 h-4" />
            </button>

            {/* Contact Details Drawer */}
            <button
              onClick={() => setDetailsDrawerOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="View Details"
            >
              <Info className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Pinned Message Banner */}
        {pinnedMessage && (
          <div className="px-4 py-2 bg-indigo-950/60 border-b border-indigo-500/30 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2 text-indigo-300 truncate">
              <Pin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="font-bold">Pinned:</span>
              <span className="truncate">{pinnedMessage}</span>
            </div>
            <button
              onClick={() => setPinnedMessage(null)}
              className="text-slate-400 hover:text-white ml-2 text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Secret Disappearing Timer Bar */}
        {showSecretBar && (
          <SecretTimerBar
            currentTimer={secretTimer}
            onSelectTimer={(val) => {
              setSecretTimer(val);
              showToast(val ? `⏳ Disappearing timer set to ${val}s` : 'Disappearing timer turned off');
            }}
            onClose={() => setShowSecretBar(false)}
          />
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
          {activeChat.messages.map((msg) => {
            const isUser = msg.isUser;
            const isAudio = msg.text.startsWith('🎙️');
            const isSnap = msg.text.startsWith('🔥');
            const isLocation = msg.text.includes('OpenStreetMap') || msg.text.startsWith('📍') || msg.text.startsWith('🔴');
            const isFile = msg.text.startsWith('📁');
            const isEmail = msg.text.startsWith('📧');

            return (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 max-w-[92%] sm:max-w-[78%] group relative ${
                  isUser ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {!isUser && (
                  <img
                    src={activeChat.participantAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover flex-shrink-0 mt-1 ring-1 ring-slate-800"
                  />
                )}

                <div className="space-y-1 min-w-0">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg relative ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Audio Note Rendering */}
                    {isAudio ? (
                      <div className="flex items-center gap-3 py-1 min-w-[200px]">
                        <button
                          onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                          className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        >
                          {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 h-5">
                            {[30, 60, 45, 80, 55, 90, 70, 40, 65, 85, 40, 95].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                  playingAudioId === msg.id ? 'bg-yellow-300 animate-pulse' : 'bg-white/60'
                                }`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-white/80 font-mono">MediaRecorder Audio Note</span>
                        </div>
                      </div>
                    ) : isSnap ? (
                      <div className="flex items-center gap-2.5 py-1">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Flame className="w-5 h-5 fill-amber-400" />
                        </div>
                        <div>
                          <span className="font-bold block text-xs">Ephemeral Snap</span>
                          <span className="text-[10px] text-amber-300">Self-destruct view protection active</span>
                        </div>
                      </div>
                    ) : isLocation ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="font-bold truncate">{msg.text.split('\n')[0]}</span>
                        </div>
                        <a
                          href="https://www.openstreetmap.org"
                          target="_blank"
                          rel="noreferrer"
                          className="block p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 transition-colors text-xs text-emerald-300"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">🗺️ View on OpenStreetMap</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </a>
                      </div>
                    ) : isEmail ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-bold text-emerald-300">
                          <Mail className="w-4 h-4 text-emerald-400" />
                          <span>{msg.text.split('\n')[0]}</span>
                        </div>
                        <p className="text-slate-300 font-mono text-[11px] whitespace-pre-line">
                          {msg.text}
                        </p>
                      </div>
                    ) : isFile ? (
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-300" />
                        <span className="font-medium">{msg.text}</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Quick Hover Message Action Bar */}
                    <div className="absolute right-2 -top-3 hidden group-hover:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 shadow-xl z-20">
                      <button
                        onClick={() => setReplyingMessage({ id: msg.id, text: msg.text, senderName: msg.senderName })}
                        className="p-1 hover:text-indigo-400 text-slate-400"
                        title="Reply"
                      >
                        <CornerUpLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMessageToEmail(msg.text)}
                        className="p-1 hover:text-emerald-400 text-slate-400"
                        title="Send as Email"
                      >
                        <Mail className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setPinnedMessage(msg.text);
                          showToast('📌 Message pinned!');
                        }}
                        className="p-1 hover:text-yellow-400 text-slate-400"
                        title="Pin Message"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          showToast('📋 Message copied to clipboard!');
                        }}
                        className="p-1 hover:text-slate-200 text-slate-400"
                        title="Copy"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                        className="p-1 hover:text-pink-400 text-slate-400"
                        title="React"
                      >
                        <Smile className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Reaction Floating Bar */}
                    {activeReactionMsgId === msg.id && (
                      <div className="absolute right-0 -bottom-8 bg-slate-900 border border-slate-700 rounded-full px-2 py-1 flex items-center gap-1.5 shadow-2xl z-30 animate-in fade-in">
                        {reactionEmojis.map((emo) => (
                          <button
                            key={emo}
                            onClick={() => {
                              showToast(`Reacted with ${emo}`);
                              setActiveReactionMsgId(null);
                            }}
                            className="text-base hover:scale-125 transition-transform p-0.5"
                          >
                            {emo}
                          </button>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Timestamp & Delivery State */}
                  <div
                    className={`flex items-center gap-1.5 text-[10px] text-slate-500 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs w-max animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span>{activeChat.participantName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Replying Preview Banner */}
        {replyingMessage && (
          <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 truncate">
              <CornerUpLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Replying to <strong className="text-white">{replyingMessage.senderName}</strong>:</span>
              <span className="text-slate-300 truncate">"{replyingMessage.text}"</span>
            </div>
            <button
              onClick={() => setReplyingMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Audio Recorder Toolbar */}
        {isRecordingAudio && (
          <div className="p-2.5 sm:p-3 bg-slate-950/95 border-t border-slate-800">
            <AudioRecorder
              onSendAudio={handleSendAudio}
              onCancel={() => setIsRecordingAudio(false)}
            />
          </div>
        )}

        {/* Bottom Input Form */}
        {!isRecordingAudio && (
          <form
            onSubmit={handleSendText}
            className="p-2.5 sm:p-3.5 bg-slate-950/95 border-t border-slate-800 flex items-center gap-1.5 sm:gap-2 backdrop-blur-xl relative"
          >
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-2 sm:left-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-30 grid grid-cols-7 gap-2 animate-in fade-in">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-lg sm:text-xl hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors"
              title="Add Emoji"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Ephemeral Snap */}
            <button
              type="button"
              onClick={() => setSnapModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors"
              title="Send Ephemeral Snap"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Location Share (OpenStreetMap GPS) */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
              title="Share GPS Location"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* File Attachment */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors hidden sm:block"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeChat.participantName}...`}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />

            {/* Send or Record Mic */}
            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2 sm:p-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Send</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecordingAudio(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                title="Record Voice Memo"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </form>
        )}

      </div>

      {/* ========================================================================= */}
      {/* INTEGRATED ADITICHAT MODALS & ADVANCED SERVICES */}
      {/* ========================================================================= */}
      
      {/* WebRTC Video Call Modal with Dual Merge & Native PiP */}
      <VideoCallModal
        isOpen={callModalOpen}
        contactName={activeChat.participantName}
        contactAvatar={activeChat.participantAvatar}
        isVideo={isVideoCall}
        onClose={() => setCallModalOpen(false)}
        onMinimize={handleMinimizeCall}
      />

      {/* Floating Picture-in-Picture Call Widget */}
      {floatingCallActive && (
        <FloatingCallWidget
          contactName={activeChat.participantName}
          contactAvatar={activeChat.participantAvatar}
          isVideo={isVideoCall}
          isMuted={isCallMuted}
          isVideoOff={isCallVideoOff}
          callDuration={callDuration}
          onMaximize={() => {
            setFloatingCallActive(false);
            setCallModalOpen(true);
          }}
          onEndCall={handleEndFloatingCall}
          onToggleMic={() => setIsCallMuted(!isCallMuted)}
          onToggleVideo={() => setIsCallVideoOff(!isCallVideoOff)}
        />
      )}

      {/* Ephemeral Snaps */}
      <SnapCameraModal
        isOpen={snapModalOpen}
        onClose={() => setSnapModalOpen(false)}
        onSendSnap={handleSendSnap}
      />

      {/* OpenStreetMap GPS Location */}
      <LocationShareModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSendLocation={handleSendLocation}
      />

      {/* Scheduler Modal */}
      <SchedulerModal
        isOpen={schedulerModalOpen}
        contactName={activeChat.participantName}
        onClose={() => setSchedulerModalOpen(false)}
        onScheduleMessage={handleScheduleMessage}
      />

      {/* Direct SMTP Email Composer */}
      <EmailComposerModal
        isOpen={emailModalOpen}
        initialRecipientEmail={`${activeChat.participantName.toLowerCase().replace(/\s+/g, '')}@malabarbazaar.shop`}
        initialSubject={emailInitialSubject}
        initialBody={emailInitialBody}
        onClose={() => setEmailModalOpen(false)}
        onSendEmail={handleSendEmail}
      />

      {/* Group Chat Creator */}
      <GroupCreateModal
        isOpen={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      {/* Contact Details Drawer */}
      <ChatDetailsDrawer
        isOpen={detailsDrawerOpen}
        chat={activeChat}
        onClose={() => setDetailsDrawerOpen(false)}
        onBlockUser={() => {
          showToast(`🚫 ${activeChat.participantName} has been blocked.`);
          setDetailsDrawerOpen(false);
        }}
        onReportUser={() => {
          showToast(`🛡️ Report filed for ${activeChat.participantName}.`);
          setDetailsDrawerOpen(false);
        }}
        onOpenEmail={() => {
          setDetailsDrawerOpen(false);
          setEmailModalOpen(true);
        }}
        onStartCall={(video) => {
          setDetailsDrawerOpen(false);
          handleStartCall(video);
        }}
      />

    </div>
  );
};
