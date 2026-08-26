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
  ChevronLeft
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ChatConversation } from '../../types/superApp';
import { AudioRecorder } from './AudioRecorder';
import { VideoCallModal } from './VideoCallModal';
import { SnapCameraModal } from './SnapCameraModal';
import { LocationShareModal } from './LocationShareModal';
import { SchedulerModal } from './SchedulerModal';
import { SecretTimerBar } from './SecretTimerBar';
import confetti from 'canvas-confetti';

export const LiveChatMessenger: React.FC = () => {
  const { chats, activeChatId, setActiveChatId, sendChatMessage, user, showToast } = useSuperApp();
  
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSecretBar, setShowSecretBar] = useState(false);
  const [secretTimer, setSecretTimer] = useState<number | null>(null);

  // Mobile View state: show sidebar list or active conversation
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Modals
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);

  // Audio Playback State
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

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
    sendChatMessage(activeChat.id, inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  // Send Voice Note
  const handleSendAudio = (audioData: { duration: number; bars: number[] }) => {
    if (!activeChat) return;
    const voiceMsg = `🎙️ Voice Note (${audioData.duration}s)`;
    sendChatMessage(activeChat.id, voiceMsg);
    setIsRecordingAudio(false);
    showToast('🎙️ Voice message delivered!');
  };

  // Send Snap
  const handleSendSnap = (snapUrl: string, duration: number) => {
    if (!activeChat) return;
    const snapMsg = `🔥 Ephemeral Snap (${duration}s self-destruct timer)`;
    sendChatMessage(activeChat.id, snapMsg);
    confetti({ particleCount: 50, spread: 60 });
    showToast('🔥 Ephemeral snap sent!');
  };

  // Send Location
  const handleSendLocation = (locationText: string, mapUrl: string) => {
    if (!activeChat) return;
    const locMsg = `📍 Location shared: ${locationText}`;
    sendChatMessage(activeChat.id, locMsg);
    showToast('📍 Live location map point shared!');
  };

  // Send Scheduled Message
  const handleScheduleMessage = (text: string, date: string, time: string) => {
    showToast(`⏰ Message scheduled for ${date} at ${time}!`);
  };

  // File Attachment
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    const fileMsg = `📁 Shared attachment: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    sendChatMessage(activeChat.id, fileMsg);
    showToast(`📁 File ${file.name} uploaded!`);
  };

  // Call Handlers
  const handleStartCall = (video: boolean) => {
    setIsVideoCall(video);
    setCallModalOpen(true);
  };

  const emojis = ['😀', '🔥', '❤️', '🚀', '✨', '🎉', '👍', '🙏', '💯', '😍', '🌴', '😎', '🥳', '⚡'];

  return (
    <div className="h-[calc(100dvh-175px)] sm:h-[calc(100dvh-160px)] flex flex-col md:flex-row rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      
      {/* ========================================================================= */}
      {/* LEFT CHAT SIDEBAR (CONTACTS & CHANNELS) */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-slate-950/70 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Search & Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-white">AditiChat</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                P2P Live
              </span>
            </div>

            <button
              onClick={() => handleStartCall(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors"
              title="Quick Call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, tutors, agents..."
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
                className={`w-full p-3 sm:p-3.5 text-left transition-all flex items-center gap-3 relative ${
                  isSelected
                    ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                    : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.participantAvatar}
                    alt={chat.participantName}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-slate-800"
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
            
            {/* Back Button on Mobile */}
            <button
              onClick={() => setMobileView('list')}
              className="md:hidden p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to chat list"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative flex-shrink-0">
              <img
                src={activeChat.participantAvatar}
                alt={activeChat.participantName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover ring-2 ring-indigo-500/40"
              />
              {activeChat.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-white truncate">{activeChat.participantName}</h3>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 truncate">
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
                {activeChat.isOnline ? 'Online • E2EE' : 'Active 2h ago'}
              </p>
            </div>
          </div>

          {/* Chat Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Secret Chat Timer Button */}
            <button
              onClick={() => setShowSecretBar(!showSecretBar)}
              className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
                secretTimer ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              title="Disappearing Messages"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Voice Call */}
            <button
              onClick={() => handleStartCall(false)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Voice Call"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* HD Video Call */}
            <button
              onClick={() => handleStartCall(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-colors"
              title="HD Video Call"
            >
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Schedule Message */}
            <button
              onClick={() => setSchedulerModalOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Schedule Message"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

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
            const isLocation = msg.text.startsWith('📍');
            const isFile = msg.text.startsWith('📁');

            return (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[75%] ${
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

                <div className="space-y-1">
                  <div
                    className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg relative group ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Audio Note Rendering */}
                    {isAudio ? (
                      <div className="flex items-center gap-3 py-1 min-w-[180px] sm:min-w-[200px]">
                        <button
                          onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                          className="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        >
                          {playingAudioId === msg.id ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 h-5">
                            {[30, 60, 45, 80, 55, 90, 70, 40, 65, 85].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full ${playingAudioId === msg.id ? 'bg-yellow-300 animate-pulse' : 'bg-white/60'}`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-white/80 font-mono">Voice Memo</span>
                        </div>
                      </div>
                    ) : isSnap ? (
                      <div className="flex items-center gap-2.5 py-1">
                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Flame className="w-4 h-4 fill-amber-400" />
                        </div>
                        <div>
                          <span className="font-bold block text-xs">Ephemeral Snap</span>
                          <span className="text-[10px] text-amber-300">Self-destruct view protection</span>
                        </div>
                      </div>
                    ) : isLocation ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold">{msg.text}</span>
                        </div>
                        <div className="h-20 sm:h-24 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-xs text-emerald-400">
                          🗺️ Interactive Map View
                        </div>
                      </div>
                    ) : isFile ? (
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-300" />
                        <span>{msg.text}</span>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>

                  {/* Timestamp & Status */}
                  <div
                    className={`flex items-center gap-1.5 text-[10px] text-slate-500 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Audio Recorder Toolbar (when recording) */}
        {isRecordingAudio && (
          <div className="p-2.5 sm:p-3 bg-slate-950/95 border-t border-slate-800">
            <AudioRecorder
              onSendAudio={handleSendAudio}
              onCancel={() => setIsRecordingAudio(false)}
            />
          </div>
        )}

        {/* Bottom Message Input Bar */}
        {!isRecordingAudio && (
          <form
            onSubmit={handleSendText}
            className="p-2.5 sm:p-3 bg-slate-950/95 border-t border-slate-800 flex items-center gap-1.5 sm:gap-2 backdrop-blur-xl relative"
          >
            {/* Emoji Picker Popover */}
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
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Snap Camera Button */}
            <button
              type="button"
              onClick={() => setSnapModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors"
              title="Send Ephemeral Snap"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Location Share Button */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
              title="Share Location"
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

            {/* Input Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeChat.participantName}...`}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />

            {/* Voice Record or Send */}
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
                title="Hold / Click to Record Voice Note"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </form>
        )}

      </div>

      {/* ========================================================================= */}
      {/* INTEGRATED ADITICHAT MODALS */}
      {/* ========================================================================= */}
      <VideoCallModal
        isOpen={callModalOpen}
        contactName={activeChat.participantName}
        contactAvatar={activeChat.participantAvatar}
        isVideo={isVideoCall}
        onClose={() => setCallModalOpen(false)}
      />

      <SnapCameraModal
        isOpen={snapModalOpen}
        onClose={() => setSnapModalOpen(false)}
        onSendSnap={handleSendSnap}
      />

      <LocationShareModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSendLocation={handleSendLocation}
      />

      <SchedulerModal
        isOpen={schedulerModalOpen}
        contactName={activeChat.participantName}
        onClose={() => setSchedulerModalOpen(false)}
        onScheduleMessage={handleScheduleMessage}
      />

    </div>
  );
};
