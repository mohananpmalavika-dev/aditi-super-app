import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Phone,
  Video,
  Search,
  MessageSquare,
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
  Check,
  Navigation,
  FileText,
  ChevronLeft,
  Mail,
  Users,
  Plus,
  UserPlus,
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
  Square,
  Megaphone,
  Hash,
  UserCheck,
  Ban,
  UserMinus,
  BarChart2,
  Forward,
  Palette,
  VolumeX,
  Volume2,
  PinOff,
  Film
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ChatConversation, ChatMessage, ChatPoll } from '../../types/superApp';
import { AudioRecorder } from './AudioRecorder';
import { VideoCallModal } from './VideoCallModal';
import { FloatingCallWidget } from './FloatingCallWidget';
import { SnapCameraModal } from './SnapCameraModal';
import { LocationShareModal } from './LocationShareModal';
import { SchedulerModal } from './SchedulerModal';
import { ScheduledQueueDrawer } from './ScheduledQueueDrawer';
import { AutomatedScheduledCallModal } from './AutomatedScheduledCallModal';
import { SecretTimerBar } from './SecretTimerBar';
import { EmailComposerModal } from './EmailComposerModal';
import { GroupCreateModal } from './GroupCreateModal';
import { ChannelCreateModal } from './ChannelCreateModal';
import { BroadcastModal } from './BroadcastModal';
import { ChatDetailsDrawer } from './ChatDetailsDrawer';
import { AddFriendModal } from './AddFriendModal';
import { PollModal } from './PollModal';
import { StickerGifPickerModal } from './StickerGifPickerModal';
import { VideoNoteModal } from './VideoNoteModal';
import { ForwardModal } from './ForwardModal';
import { StarredMessagesDrawer } from './StarredMessagesDrawer';
import { WallpaperModal } from './WallpaperModal';
import { LiveBackgroundCamera } from './LiveBackgroundCamera';
import { VoiceCloneStudioModal } from './VoiceCloneStudioModal';
import { TalkingPortraitModal } from './TalkingPortraitModal';
import { playTextInSenderVoice } from '../../services/voiceCloneService';
import { UserVoiceProfile } from '../../types/superApp';
import confetti from 'canvas-confetti';

const emojis = ['😀', '😂', '😍', '🔥', '👍', '🎉', '🚀', '❤️', '🙌', '💯', '✨', '🙏', '😎', '🥳'];
const reactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉'];

export const LiveChatMessenger: React.FC = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    sendChatMessage,
    createGroup,
    createChannel,
    sendBroadcast,
    toggleFriendStatus,
    toggleBlockStatus,
    votePoll,
    toggleStarMessage,
    reactToMessage,
    togglePinChat,
    toggleMuteChat,
    setChatWallpaper,
    clearChatHistory,
    scheduledMessages,
    chatReminders,
    scheduleChatMessage,
    cancelScheduledMessage,
    sendScheduledMessageNow,
    setChatReminder,
    dismissChatReminder,
    incomingScheduledCall,
    clearIncomingScheduledCall,
    triggerScheduledCallNow,
    user,
    showToast
  } = useSuperApp();
  
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilterTab, setChatFilterTab] = useState<'all' | 'direct' | 'group' | 'channel'>('all');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSecretBar, setShowSecretBar] = useState(false);
  const [secretTimer, setSecretTimer] = useState<number | null>(null);

  // Live Camera & Audio Walk & Chat Background with Location Tagging
  const [isLiveBgActive, setIsLiveBgActive] = useState(false);
  const [isLocationTagged, setIsLocationTagged] = useState(false);
  const [currentLiveLocation, setCurrentLiveLocation] = useState('📍 Kozhikode, Kerala (11.2588° N, 75.7804° E)');

  // Scheduler & Reminders state
  const [scheduledQueueDrawerOpen, setScheduledQueueDrawerOpen] = useState(false);
  const [schedulerInitialText, setSchedulerInitialText] = useState('');
  const [schedulerInitialMode, setSchedulerInitialMode] = useState<'schedule' | 'reminder'>('schedule');

  // AI Voice Avatar & Voice Cloning Narration
  const [voiceStudioOpen, setVoiceStudioOpen] = useState(false);
  const [activePlayingVoiceMsgId, setActivePlayingVoiceMsgId] = useState<string | null>(null);
  const [talkingPortraitModalData, setTalkingPortraitModalData] = useState<{
    senderName: string;
    senderAvatar: string;
    messageText: string;
    voiceProfile?: Partial<UserVoiceProfile>;
  } | null>(null);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  const handlePlayMessageInSenderVoice = (msg: ChatMessage) => {
    if (activePlayingVoiceMsgId === msg.id) {
      stopVoiceRef.current?.();
      setActivePlayingVoiceMsgId(null);
      return;
    }

    stopVoiceRef.current?.();
    setActivePlayingVoiceMsgId(msg.id);

    const stopper = playTextInSenderVoice(
      msg.text,
      msg.voiceProfile,
      () => setActivePlayingVoiceMsgId(msg.id),
      () => setActivePlayingVoiceMsgId(null),
      () => {
        setActivePlayingVoiceMsgId(null);
      }
    );
    stopVoiceRef.current = stopper;
    showToast(`🔊 Speaking in ${msg.senderName}'s AI voice avatar...`);
  };

  // Message Actions state
  const [replyingMessage, setReplyingMessage] = useState<{ id: string; text: string; senderName: string } | null>(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [pinnedMessage, setPinnedMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [audioSpeedMap, setAudioSpeedMap] = useState<Record<string, number>>({});

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
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);

  // WhatsApp & Telegram Super Features Modals
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [stickerModalOpen, setStickerModalOpen] = useState(false);
  const [videoNoteModalOpen, setVideoNoteModalOpen] = useState(false);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [forwardingMsg, setForwardingMsg] = useState<ChatMessage | null>(null);
  const [starredDrawerOpen, setStarredDrawerOpen] = useState(false);
  const [wallpaperModalOpen, setWallpaperModalOpen] = useState(false);

  // Pre-filled Email state
  const [emailInitialSubject, setEmailInitialSubject] = useState('');
  const [emailInitialBody, setEmailInitialBody] = useState('');

  // Audio Playback
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Real-time 1s ticking clock for disappearing countdown badges
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = (chats && chats.length > 0) ? (chats.find((c) => c.id === activeChatId) || chats[0]) : null;

  // Helper to count consecutive messages sent by the user since the last incoming message from the participant
  const getConsecutiveUserSentCount = (chat: ChatConversation | null | undefined): number => {
    if (!chat || !chat.messages || chat.messages.length === 0) return 0;
    let count = 0;
    for (let i = chat.messages.length - 1; i >= 0; i--) {
      const msg = chat.messages[i];
      if (msg.isUser) {
        count++;
      } else {
        break; // Encountered reply from the other person -> stops consecutive streak
      }
    }
    return count;
  };

  // Anti-spam 3-Message Limit and Block logic
  const isDirectChat = !activeChat?.conversationType || activeChat?.conversationType === 'direct';
  const isFriend = activeChat?.isFriend ?? false;
  const isBlocked = activeChat?.isBlocked ?? false;
  const isNonFriendDirect = isDirectChat && !isFriend && !isBlocked;
  const consecutiveSentCount = isNonFriendDirect && activeChat ? getConsecutiveUserSentCount(activeChat) : 0;
  const remainingNonFriendMessages = Math.max(0, 3 - consecutiveSentCount);
  const isNonFriendBlocked = isNonFriendDirect && consecutiveSentCount >= 3;

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

  // Filter and Sort: Pinned conversations always stick to the top
  const filteredChats = chats
    .filter((c) => {
      const matchesSearch =
        c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roleOrContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.channelHandle && c.channelHandle.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (chatFilterTab === 'direct') {
        return !c.conversationType || c.conversationType === 'direct';
      }
      if (chatFilterTab === 'group') {
        return c.conversationType === 'group';
      }
      if (chatFilterTab === 'channel') {
        return c.conversationType === 'channel';
      }

      return true;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setMobileView('chat');
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    if (isBlocked) {
      showToast(`🚫 You have blocked ${activeChat.participantName}. Unblock to send messages.`);
      return;
    }

    if (isNonFriendBlocked) {
      showToast(`🚫 Message limit reached (3/3). Please wait for ${activeChat.participantName} to reply, or add as friend.`);
      return;
    }

    let fullMsg = inputText.trim();
    if (isLocationTagged) {
      fullMsg = `${fullMsg}\n${currentLiveLocation}`;
    }
    if (replyingMessage) {
      fullMsg = `↩️ Replying to [${replyingMessage.senderName}: "${replyingMessage.text.slice(0, 30)}..."]\n${fullMsg}`;
    }

    sendChatMessage(activeChat.id, fullMsg, { expiresDuration: secretTimer });
    setInputText('');
    setReplyingMessage(null);
    setShowEmojiPicker(false);

    if (isNonFriendDirect && consecutiveSentCount === 2) {
      showToast(`⚠️ You sent 3/3 daily messages. Awaiting reply from ${activeChat.participantName} to unlock next messages.`);
    }

    // Simulate typing feedback
    setTimeout(() => setIsTyping(true), 600);
    setTimeout(() => setIsTyping(false), 2400);
  };

  // Send Voice Note
  const handleSendAudio = (audioData: { duration: number; bars: number[] }) => {
    if (!activeChat) return;
    const voiceMsg = `🎙️ Voice Note (${audioData.duration}s)`;
    sendChatMessage(activeChat.id, voiceMsg, { expiresDuration: secretTimer, mediaType: 'audio' });
    setIsRecordingAudio(false);
    showToast('🎙️ Voice memo delivered via MediaRecorder!');
  };

  // Send Ephemeral Snap
  const handleSendSnap = (snapUrl: string, duration: number) => {
    if (!activeChat) return;
    const snapMsg = `🔥 Ephemeral Snap (${duration}s self-destruct timer)`;
    sendChatMessage(activeChat.id, snapMsg, { expiresDuration: duration || secretTimer, mediaUrl: snapUrl, mediaType: 'image' });
    confetti({ particleCount: 50, spread: 60 });
    showToast('🔥 Ephemeral snap sent!');
  };

  // Send Location (OpenStreetMap GPS)
  const handleSendLocation = (locationText: string, mapUrl: string, isLive?: boolean, duration?: number) => {
    if (!activeChat) return;
    sendChatMessage(activeChat.id, `${locationText}\n🔗 OpenStreetMap: ${mapUrl}`, { expiresDuration: secretTimer });
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
      `📧 Direct Email Sent to [${emailData.to}]\nSubject: ${emailData.subject}\n"${emailData.body.slice(0, 60)}..."`,
      { expiresDuration: secretTimer }
    );
    showToast(`📧 Outbound email dispatched to ${emailData.to}!`);
  };

  // Convert Chat Message to Email
  const handleMessageToEmail = (msgText: string) => {
    setEmailInitialSubject(`Aditi Conversation with ${activeChat?.participantName || 'Contact'}`);
    setEmailInitialBody(msgText);
    setEmailModalOpen(true);
  };

  // Create Group Chat
  const handleCreateGroup = (groupData: { name: string; description: string; members: string[]; avatar: string }) => {
    const newGroupId = createGroup(groupData);
    handleSelectChat(newGroupId);
    showToast(`👥 Group "${groupData.name}" created with ${groupData.members.length + 1} members!`);
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    const fileMsg = `📁 Shared Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    sendChatMessage(activeChat.id, fileMsg, { expiresDuration: secretTimer, mediaType: 'file' });
    showToast(`📎 File "${file.name}" sent to ${activeChat.participantName}!`);
  };

  // Voice Note Speed Toggle
  const toggleAudioSpeed = (msgId: string) => {
    const current = audioSpeedMap[msgId] || 1;
    const next = current === 1 ? 1.5 : current === 1.5 ? 2 : 1;
    setAudioSpeedMap((prev) => ({ ...prev, [msgId]: next }));
  };

  // Handle Forward Message
  const handleForwardMessage = (targetChatIds: string[], msg: ChatMessage) => {
    targetChatIds.forEach((chatId) => {
      sendChatMessage(chatId, msg.text, {
        isForwarded: true,
        mediaUrl: msg.mediaUrl,
        mediaType: msg.mediaType,
        poll: msg.poll
      });
    });
    showToast(`↪️ Forwarded to ${targetChatIds.length} recipient${targetChatIds.length > 1 ? 's' : ''}!`);
  };

  // Start Voice/Video Call
  const handleStartCall = (video: boolean) => {
    setIsVideoCall(video);
    setCallModalOpen(true);
    setFloatingCallActive(false);
  };

  // Minimize Call to PiP
  const handleMinimizeCall = () => {
    setCallModalOpen(false);
    setFloatingCallActive(true);
  };

  // End Floating Call
  const handleEndFloatingCall = () => {
    setFloatingCallActive(false);
    setCallDuration(0);
    showToast('📞 Call ended');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden font-sans border-t border-slate-800">
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR: CONVERSATION LIST & SEARCH */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-950 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Send className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-extrabold text-base tracking-tight text-white">AditiChat Pro</h2>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setScheduledQueueDrawerOpen(true)}
                className="p-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-colors relative"
                title="Scheduled Deliveries & Reminders Queue"
              >
                <Clock className="w-3.5 h-3.5" />
                {scheduledMessages.filter((m) => !m.isSent).length + chatReminders.filter((r) => !r.isTriggered).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-[9px] font-extrabold text-slate-950 flex items-center justify-center">
                    {scheduledMessages.filter((m) => !m.isSent).length + chatReminders.filter((r) => !r.isTriggered).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setStarredDrawerOpen(true)}
                className="p-1.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 transition-colors"
                title="Starred Bookmarks (WhatsApp)"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={() => setAddFriendModalOpen(true)}
                className="p-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 transition-colors font-bold text-xs flex items-center gap-1"
                title="Add & Invite Friends"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChannelModalOpen(true)}
                className="p-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 transition-colors"
                title="New Broadcast Channel (Telegram)"
              >
                <Megaphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setBroadcastModalOpen(true)}
                className="p-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                title="Broadcast Message (WhatsApp)"
              >
                <Radio className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGroupModalOpen(true)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="New Group Chat"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, channels, messages..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setChatFilterTab('all')}
              className={`flex-1 py-1 rounded-lg transition-all text-center ${
                chatFilterTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setChatFilterTab('direct')}
              className={`flex-1 py-1 rounded-lg transition-all text-center ${
                chatFilterTab === 'direct'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct
            </button>
            <button
              type="button"
              onClick={() => setChatFilterTab('group')}
              className={`flex-1 py-1 rounded-lg transition-all text-center ${
                chatFilterTab === 'group'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Groups
            </button>
            <button
              type="button"
              onClick={() => setChatFilterTab('channel')}
              className={`flex-1 py-1 rounded-lg transition-all text-center ${
                chatFilterTab === 'channel'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Channels
            </button>
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
                    <div className="flex items-center gap-1.5 min-w-0">
                      {chat.isPinned && (
                        <Pin className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                      )}
                      <h4 className="font-bold text-xs text-white truncate">{chat.participantName}</h4>
                      {chat.isMuted && (
                        <VolumeX className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      )}
                      {chat.isBlocked && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex-shrink-0">
                          Blocked
                        </span>
                      )}
                      {chat.isFriend && (!chat.conversationType || chat.conversationType === 'direct') && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                          Friend
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{chat.lastMessageTime}</span>
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
      <div className={`flex-1 flex flex-col ${activeChat?.customWallpaper || 'bg-slate-950/40'} relative ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-xl shadow-indigo-500/10">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-white mb-1">Select a Conversation</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              Choose an existing chat from the left sidebar or start a new group, channel, or broadcast.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGroupModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/30"
              >
                + New Group
              </button>
              <button
                type="button"
                onClick={() => setChannelModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-lg shadow-purple-600/30"
              >
                + New Channel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live Real-time Camera & Audio Environment Background with GPS Tagging (Walk & Chat Mode) */}
            <LiveBackgroundCamera
              isActive={isLiveBgActive}
              onClose={() => setIsLiveBgActive(false)}
              onLocationUpdate={(loc) => setCurrentLiveLocation(loc)}
              isLocationTagged={isLocationTagged}
              onToggleLocationTag={() => {
                const next = !isLocationTagged;
                setIsLocationTagged(next);
                showToast(next ? '📍 Live GPS Location Tagging active on chat background!' : 'Location tagging deactivated');
              }}
            />

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
                    
                    {/* Friend / Non-friend / Blocked Badges */}
                    {isDirectChat && (
                      isBlocked ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBlockStatus(activeChat.id);
                          }}
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 flex items-center gap-1 transition-all"
                          title="Click to unblock this contact"
                        >
                          <Ban className="w-2.5 h-2.5" />
                          <span>Blocked (Unblock)</span>
                        </button>
                      ) : isFriend ? (
                        <div className="flex items-center gap-1">
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>Friend</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFriendStatus(activeChat.id);
                            }}
                            className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 items-center gap-1 transition-colors"
                            title="Unfriend this contact"
                          >
                            <UserMinus className="w-2.5 h-2.5" />
                            <span>Unfriend</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFriendStatus(activeChat.id);
                          }}
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                        >
                          <UserPlus className="w-2.5 h-2.5" />
                          <span>+ Add Friend</span>
                        </button>
                      )
                    )}

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
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            
            {/* Live Camera & Audio Background with Location Tagging */}
            <button
              onClick={() => {
                const next = !isLiveBgActive;
                setIsLiveBgActive(next);
                if (next) {
                  showToast('🎥 Live Cam & Ambient Audio Chat Background activated!');
                } else {
                  showToast('Live background deactivated');
                }
              }}
              className={`p-2 rounded-xl transition-all ${
                isLiveBgActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300'
              }`}
              title="Walk & Chat: Live Camera & Audio Background with Location Tagging"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Custom Chat Wallpaper / Theme */}
            <button
              onClick={() => setWallpaperModalOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Chat Wallpapers & Themes (WhatsApp & Telegram)"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Pin / Unpin Chat */}
            <button
              onClick={() => togglePinChat(activeChat.id)}
              className={`p-2 rounded-xl transition-colors ${
                activeChat.isPinned ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              title={activeChat.isPinned ? 'Unpin chat' : 'Pin chat to top'}
            >
              <Pin className={`w-4 h-4 ${activeChat.isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Mute / Unmute Notifications */}
            <button
              onClick={() => toggleMuteChat(activeChat.id)}
              className={`p-2 rounded-xl transition-colors ${
                activeChat.isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              title={activeChat.isMuted ? 'Unmute notifications' : 'Mute notifications'}
            >
              {activeChat.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Secret Timer */}
            <button
              onClick={() => setShowSecretBar(!showSecretBar)}
              className={`p-2 rounded-xl transition-colors ${
                secretTimer ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              title="Disappearing Messages (Viber & Telegram Secret Chat)"
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
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors hidden sm:block"
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

        {/* Non-Friend Safety & 3-Message Daily Limit Banner */}
        {isNonFriendDirect && (
          <div className="px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs z-10 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-300 min-w-0">
              <UserPlus className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="truncate">
                <strong>{activeChat.participantName}</strong> is not in your friends list. Daily limit: <strong className="text-amber-200">{remainingNonFriendMessages} of 3</strong> messages remaining.
              </span>
            </div>
            <button
              onClick={() => toggleFriendStatus(activeChat.id)}
              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition-all hover:scale-105 flex-shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Friend</span>
            </button>
          </div>
        )}

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

        {/* Secret Disappearing Timer Configuration Bar */}
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

        {/* Active Disappearing Message Banner */}
        {secretTimer !== null && (
          <div className="px-4 py-2 bg-rose-950/70 border-b border-rose-500/30 flex items-center justify-between text-xs animate-in slide-in-from-top-1 text-rose-300">
            <div className="flex items-center gap-2 truncate">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse flex-shrink-0" />
              <span className="font-bold">Disappearing Messages Active ({secretTimer >= 60 ? `${secretTimer / 60}m` : `${secretTimer}s`})</span>
              <span className="text-[11px] text-rose-400/80 hidden sm:inline">— Messages will auto self-destruct</span>
            </div>
            <button
              onClick={() => {
                setSecretTimer(null);
                showToast('Disappearing messages turned off');
              }}
              className="px-2 py-0.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-bold text-[11px] border border-rose-500/40 transition-colors flex-shrink-0"
            >
              Turn Off
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
          {activeChat.messages.map((msg) => {
            const isUser = msg.isUser;
            const isAudio = msg.text.startsWith('🎙️') || msg.mediaType === 'audio';
            const isSnap = msg.text.startsWith('🔥');
            const isLocation = msg.text.includes('OpenStreetMap') || msg.text.startsWith('📍') || msg.text.startsWith('🔴');
            const isFile = msg.text.startsWith('📁') || msg.mediaType === 'file';
            const isEmail = msg.text.startsWith('📧');
            const isVideoNote = msg.mediaType === 'video_note';
            const isSticker = msg.mediaType === 'sticker';
            const isGif = msg.mediaType === 'gif';
            const remainingSecs = msg.expiresAt ? Math.max(0, Math.ceil((msg.expiresAt - now) / 1000)) : null;

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
                  
                  {/* Forwarded Tag */}
                  {msg.isForwarded && (
                    <div className={`flex items-center gap-1 text-[10px] text-indigo-300 italic px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <Forward className="w-3 h-3" />
                      <span>Forwarded</span>
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg relative ${
                      isSticker
                        ? 'bg-transparent shadow-none p-0'
                        : isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    
                    {/* Live Poll Rendering */}
                    {msg.poll ? (
                      <div className="space-y-3 p-1 min-w-[240px] sm:min-w-[280px]">
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                          <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-indigo-300" />
                            <span className="font-extrabold text-sm">{msg.poll.question}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {msg.poll.options.map((opt) => {
                            const isVoted = opt.votedUserIds?.includes('user');
                            const pct = msg.poll!.totalVotes > 0 ? Math.round((opt.votes / msg.poll!.totalVotes) * 100) : 0;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => votePoll(activeChat.id, msg.id, opt.id)}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all relative overflow-hidden flex flex-col gap-1.5 ${
                                  isVoted ? 'border-indigo-400 bg-indigo-950/60 ring-1 ring-indigo-400/40' : 'border-white/10 bg-black/20 hover:bg-black/40'
                                }`}
                              >
                                <div className="flex items-center justify-between relative z-10">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isVoted ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-white/40'}`}>
                                      {isVoted && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className="font-bold">{opt.text}</span>
                                  </div>
                                  <span className="font-mono font-bold text-[11px]">{pct}% ({opt.votes})</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-indigo-400 h-full transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-white/70 pt-1">
                          <span>{msg.poll.totalVotes} vote{msg.poll.totalVotes !== 1 ? 's' : ''}</span>
                          <span>{msg.poll.isAnonymous ? '🔒 Anonymous poll' : 'Public poll'}</span>
                        </div>
                      </div>
                    ) : isVideoNote ? (
                      <div className="relative p-1">
                        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-indigo-500/80 shadow-2xl bg-black relative group/vid">
                          <img
                            src={msg.mediaUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                            alt="Round Video Note"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 transition-opacity">
                            <Play className="w-10 h-10 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10px] text-indigo-300 font-mono">
                          <Video className="w-3 h-3" />
                          <span>Round Video Memo ({msg.audioDuration || 6}s)</span>
                        </div>
                      </div>
                    ) : isSticker ? (
                      <div className="p-1">
                        <img
                          src={msg.mediaUrl}
                          alt="Sticker"
                          className="w-36 h-36 object-contain rounded-2xl hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : isGif ? (
                      <div className="p-1 rounded-2xl overflow-hidden max-w-xs">
                        <img
                          src={msg.mediaUrl}
                          alt="GIF"
                          className="w-full max-h-56 object-cover rounded-xl"
                        />
                      </div>
                    ) : isAudio ? (
                      <div className="flex items-center gap-3 py-1 min-w-[220px]">
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
                        <button
                          type="button"
                          onClick={() => toggleAudioSpeed(msg.id)}
                          className="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-extrabold text-white transition-colors"
                          title="Playback Speed (WhatsApp/Telegram)"
                        >
                          {audioSpeedMap[msg.id] || 1}x
                        </button>
                      </div>
                    ) : isSnap ? (
                      <div className="space-y-2">
                        {msg.mediaUrl && (
                          <img
                            src={msg.mediaUrl}
                            alt="Snap"
                            className="w-full max-h-60 rounded-xl object-cover"
                          />
                        )}
                        <div className="flex items-center gap-2.5 py-1">
                          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Flame className="w-4 h-4 fill-amber-400" />
                          </div>
                          <div>
                            <span className="font-bold block text-xs">Ephemeral Snap</span>
                            <span className="text-[10px] text-amber-300">Self-destruct view protection active</span>
                          </div>
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

                    {/* Receiver AI Voice Narration & Talking Photo Chips */}
                    {!msg.mediaType && !msg.poll && !isSnap && !isLocation && msg.text.trim() && (
                      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between gap-1.5 flex-wrap">
                        
                        {/* Hear Voice Audio Button */}
                        <button
                          type="button"
                          onClick={() => handlePlayMessageInSenderVoice(msg)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
                            activePlayingVoiceMsgId === msg.id
                              ? 'bg-purple-600 text-white shadow-purple-600/40 ring-2 ring-purple-400 animate-pulse'
                              : isUser
                              ? 'bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200'
                              : 'bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 text-purple-300'
                          }`}
                          title="Listen to this text message spoken aloud in sender's AI voice avatar"
                        >
                          {activePlayingVoiceMsgId === msg.id ? (
                            <>
                              <Pause className="w-3 h-3 text-white" />
                              <span>Speaking...</span>
                              <div className="flex items-center gap-0.5 ml-1">
                                {[40, 90, 60, 100, 50].map((h, i) => (
                                  <div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full animate-pulse"
                                    style={{ height: `${h * 0.12}px`, animationDelay: `${i * 0.1}s` }}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-purple-400" />
                              <span>Hear Voice</span>
                            </>
                          )}
                        </button>

                        {/* Interactive Talking Photo Avatar Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setTalkingPortraitModalData({
                              senderName: msg.senderName,
                              senderAvatar: msg.talkingPhotoUrl || (isUser ? user.avatar : activeChat.participantAvatar),
                              messageText: msg.text,
                              voiceProfile: msg.voiceProfile
                            });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/40 text-purple-200 text-[11px] font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm"
                          title="Watch sender's photo talk and speak this message with lip-sync animation"
                        >
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>🗣️ Watch Photo Speak (സംസാരിക്കുന്ന ഫോട്ടോ)</span>
                        </button>

                      </div>
                    )}

                    {/* Disappearing Message Live Countdown Badge */}
                    {msg.isDisappearing && remainingSecs !== null && (
                      <div className="mt-2 pt-1.5 border-t border-white/15 flex items-center justify-between gap-2 text-[10px] font-mono">
                        <div className="flex items-center gap-1 text-rose-300 font-bold animate-pulse">
                          <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                          <span>Disappearing in {remainingSecs}s</span>
                        </div>
                        <span className="text-[9px] text-white/70 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                          Self-destruct
                        </span>
                      </div>
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
                        onClick={() => toggleStarMessage(activeChat.id, msg.id)}
                        className={`p-1 transition-colors ${msg.isStarred ? 'text-yellow-400' : 'hover:text-yellow-400 text-slate-400'}`}
                        title={msg.isStarred ? 'Unstar Message' : 'Star Message'}
                      >
                        <Star className={`w-3 h-3 ${msg.isStarred ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => {
                          setForwardingMsg(msg);
                          setForwardModalOpen(true);
                        }}
                        className="p-1 hover:text-indigo-400 text-slate-400"
                        title="Forward Message"
                      >
                        <Forward className="w-3 h-3" />
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
                          setSchedulerInitialText(msg.text);
                          setSchedulerInitialMode('reminder');
                          setSchedulerModalOpen(true);
                        }}
                        className="p-1 hover:text-amber-400 text-slate-400"
                        title="Set Reminder for this Message (WhatsApp & Telegram)"
                      >
                        <Clock className="w-3 h-3" />
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
                              reactToMessage(activeChat.id, msg.id, emo);
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

                  {/* Reaction Chips Display */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex items-center gap-1 px-1 flex-wrap ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => reactToMessage(activeChat.id, msg.id, emoji)}
                          className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border transition-all ${
                            msg.userReaction === emoji
                              ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-sm'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px]">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp, Star & Delivery State */}
                  <div
                    className={`flex items-center gap-1.5 text-[10px] text-slate-500 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.isStarred && <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />}
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

        {/* Blocked User Banner OR Non-Friend 3-Message Blocked Banner OR Standard Composer */}
        {isBlocked ? (
          <div className="p-3.5 sm:p-4 bg-slate-950/95 border-t border-rose-500/40 backdrop-blur-xl animate-in slide-in-from-bottom-2">
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-rose-300 font-extrabold text-xs sm:text-sm">
                <Ban className="w-4 h-4 text-rose-400" />
                <span>You have blocked {activeChat.participantName}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                You cannot send or receive messages while this contact is blocked.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleBlockStatus(activeChat.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Unblock {activeChat.participantName}</span>
                </button>
              </div>
            </div>
          </div>
        ) : isNonFriendBlocked ? (
          <div className="p-3.5 sm:p-4 bg-slate-950/95 border-t border-rose-500/30 backdrop-blur-xl animate-in slide-in-from-bottom-2">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-rose-300 font-extrabold text-xs sm:text-sm">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Daily Non-Friend Message Limit Reached (3/3)</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Messaging is paused until <strong>{activeChat.participantName}</strong> replies to your message, or until you add them as a friend.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleFriendStatus(activeChat.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add {activeChat.participantName} as Friend</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Non-friend remaining counter ribbon */}
            {isNonFriendDirect && (
              <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] animate-in fade-in">
                <span className="text-amber-300 font-medium">
                  💬 Non-friend limit: <strong className="text-amber-200">{remainingNonFriendMessages} of 3</strong> messages remaining (resets on reply)
                </span>
                <button
                  type="button"
                  onClick={() => toggleFriendStatus(activeChat.id)}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Add Friend for Unlimited Chat</span>
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
                className="p-2 sm:p-3 bg-slate-950/95 border-t border-slate-800 flex items-center gap-1 sm:gap-2 backdrop-blur-xl relative"
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
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors"
                  title="Add Emoji"
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Stickers & GIFs Button (WhatsApp / Telegram / Viber) */}
                <button
                  type="button"
                  onClick={() => setStickerModalOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-yellow-300 transition-colors"
                  title="Stickers & Trending GIFs (WhatsApp, Telegram & Viber)"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* AI Voice Avatar & Voice Cloning Studio */}
                <button
                  type="button"
                  onClick={() => setVoiceStudioOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors"
                  title="AI Voice Avatar & Cloning Studio (നിങ്ങളുടെ സ്വന്തം AI ശബ്ദം)"
                >
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Message Scheduler & In-Chat Reminder (Telegram & WhatsApp) */}
                <button
                  type="button"
                  onClick={() => {
                    setSchedulerInitialText(inputText);
                    setSchedulerInitialMode('schedule');
                    setSchedulerModalOpen(true);
                  }}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Schedule Message / Set Chat Reminder"
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Live Poll Creator Button (WhatsApp & Telegram) */}
                <button
                  type="button"
                  onClick={() => setPollModalOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                  title="Create Live Poll (WhatsApp & Telegram)"
                >
                  <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Circular Video Note (Telegram Round Video) */}
                <button
                  type="button"
                  onClick={() => setVideoNoteModalOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                  title="Record Circular Video Note (Telegram Style)"
                >
                  <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Ephemeral Snap (Snapchat) */}
                <button
                  type="button"
                  onClick={() => setSnapModalOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors"
                  title="Send Ephemeral Snap (Snapchat Style)"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Location Share (OpenStreetMap GPS) */}
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors hidden sm:block"
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
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors hidden sm:block"
                  title="Attach File"
                >
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Input Field */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeChat?.participantName || 'contact'}...`}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-w-0"
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
        )}
        </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* INTEGRATED ADITICHAT MODALS & ADVANCED SERVICES */}
      {/* ========================================================================= */}
      
      {/* WebRTC Video Call Modal with Dual Merge & Native PiP */}
      <VideoCallModal
        isOpen={callModalOpen}
        contactName={activeChat?.participantName || 'Aditi Contact'}
        contactAvatar={activeChat?.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
        isVideo={isVideoCall}
        onClose={() => {
          setCallModalOpen(false);
          setFloatingCallActive(false);
          setCallDuration(0);
          showToast('📞 Call ended');
        }}
        onMinimize={handleMinimizeCall}
      />

      {/* Floating Call PiP Mini Widget */}
      {floatingCallActive && (
        <FloatingCallWidget
          contactName={activeChat?.participantName || 'Aditi Contact'}
          contactAvatar={activeChat?.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
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

      {/* Ephemeral Snaps (Snapchat) */}
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

      {/* Scheduler & In-Chat Reminder Modal */}
      <SchedulerModal
        isOpen={schedulerModalOpen}
        contactName={activeChat?.participantName || 'Aditi Contact'}
        chatId={activeChat?.id || ''}
        initialText={schedulerInitialText}
        initialMode={schedulerInitialMode}
        onClose={() => setSchedulerModalOpen(false)}
        onScheduleMessage={(text, deliverAtMs, deliverAtStr, deliveryType, audioUrl, audioDuration) => {
          if (activeChat) {
            scheduleChatMessage(activeChat.id, text, deliverAtMs, deliverAtStr, deliveryType, audioUrl, audioDuration);
            setInputText('');
          }
        }}
        onSetReminder={(snippet, remindAtMs, remindAtStr, note) => {
          if (activeChat) {
            setChatReminder(activeChat.id, snippet, remindAtMs, remindAtStr, note);
          }
        }}
      />

      {/* Scheduled Queue & Reminders Drawer */}
      <ScheduledQueueDrawer
        isOpen={scheduledQueueDrawerOpen}
        onClose={() => setScheduledQueueDrawerOpen(false)}
        chatId={activeChat?.id || ''}
        scheduledMessages={scheduledMessages}
        chatReminders={chatReminders}
        onSendNow={(id) => sendScheduledMessageNow(id)}
        onTriggerCallNow={(sMsg) => triggerScheduledCallNow(sMsg)}
        onCancelScheduled={(id) => cancelScheduledMessage(id)}
        onDismissReminder={(id) => dismissChatReminder(id)}
      />

      {/* Automated Scheduled Incoming Voice Call Modal */}
      {incomingScheduledCall && (
        <AutomatedScheduledCallModal
          isOpen={!!incomingScheduledCall}
          senderName={incomingScheduledCall.senderName}
          senderAvatar={incomingScheduledCall.senderAvatar}
          audioUrl={incomingScheduledCall.audioUrl}
          audioDuration={incomingScheduledCall.audioDuration}
          textSnippet={incomingScheduledCall.text}
          onClose={clearIncomingScheduledCall}
          onCallCompleted={() => {
            clearIncomingScheduledCall();
            showToast('📞 Scheduled voice call completed.');
          }}
        />
      )}

      {/* Direct SMTP Email Composer */}
      <EmailComposerModal
        isOpen={emailModalOpen}
        initialRecipientEmail={`${(activeChat?.participantName || 'contact').toLowerCase().replace(/\s+/g, '')}@malabarbazaar.shop`}
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
        chat={activeChat || chats[0]}
        onClose={() => setDetailsDrawerOpen(false)}
        onBlockUser={() => {
          if (activeChat) {
            toggleBlockStatus(activeChat.id);
            setDetailsDrawerOpen(false);
          }
        }}
        onToggleFriend={() => {
          if (activeChat) {
            toggleFriendStatus(activeChat.id);
          }
        }}
        onReportUser={() => {
          if (activeChat) {
            showToast(`🛡️ Report filed for ${activeChat.participantName}.`);
            setDetailsDrawerOpen(false);
          }
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

      {/* Add and Invite Friends Modal */}
      <AddFriendModal
        isOpen={addFriendModalOpen}
        onClose={() => setAddFriendModalOpen(false)}
        onSelectChat={(chatId) => handleSelectChat(chatId)}
      />

      {/* Broadcast Channel Creator Modal (Telegram) */}
      <ChannelCreateModal
        isOpen={channelModalOpen}
        onClose={() => setChannelModalOpen(false)}
        onCreateChannel={(channelData) => {
          const newChanId = createChannel(channelData);
          handleSelectChat(newChanId);
        }}
      />

      {/* Broadcast Message to Multiple Contacts Modal (WhatsApp) */}
      <BroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        chats={chats}
        onSendBroadcast={(selectedChatIds, messageText) => {
          sendBroadcast(selectedChatIds, messageText);
        }}
      />

      {/* Live Poll Creator Modal (WhatsApp & Telegram) */}
      <PollModal
        isOpen={pollModalOpen}
        onClose={() => setPollModalOpen(false)}
        onCreatePoll={(poll: ChatPoll) => {
          if (activeChat) {
            sendChatMessage(activeChat.id, '', { poll });
            showToast('📊 Live poll created and broadcasted!');
          }
        }}
      />

      {/* Stickers & Trending GIFs Studio Modal (Telegram, WhatsApp & Viber) */}
      <StickerGifPickerModal
        isOpen={stickerModalOpen}
        onClose={() => setStickerModalOpen(false)}
        onSelectMedia={(mediaUrl, mediaType) => {
          if (activeChat) {
            sendChatMessage(activeChat.id, '', { mediaUrl, mediaType });
            showToast(mediaType === 'sticker' ? '🌟 Sticker sent!' : '🎬 Animated GIF sent!');
          }
        }}
      />

      {/* Telegram Round Video Memo Modal */}
      <VideoNoteModal
        isOpen={videoNoteModalOpen}
        onClose={() => setVideoNoteModalOpen(false)}
        onSendVideoNote={(videoUrl, duration) => {
          if (activeChat) {
            sendChatMessage(activeChat.id, '', {
              mediaUrl: videoUrl,
              mediaType: 'video_note',
              expiresDuration: secretTimer
            });
            confetti({ particleCount: 40, spread: 60 });
            showToast('⭕ Circular video note dispatched!');
          }
        }}
      />

      {/* Forward Message to Multiple Contacts Modal (WhatsApp & Telegram) */}
      <ForwardModal
        isOpen={forwardModalOpen}
        onClose={() => {
          setForwardModalOpen(false);
          setForwardingMsg(null);
        }}
        message={forwardingMsg}
        chats={chats}
        onForwardMessage={handleForwardMessage}
      />

      {/* Starred Messages Drawer (WhatsApp) */}
      <StarredMessagesDrawer
        isOpen={starredDrawerOpen}
        onClose={() => setStarredDrawerOpen(false)}
        chats={chats}
        onSelectChat={(chatId) => handleSelectChat(chatId)}
        onUnstarMessage={(chatId, msgId) => toggleStarMessage(chatId, msgId)}
      />

      {/* Chat Wallpapers & Themes Switcher (WhatsApp & Telegram) */}
      <WallpaperModal
        isOpen={wallpaperModalOpen}
        onClose={() => setWallpaperModalOpen(false)}
        currentWallpaper={activeChat?.customWallpaper || ''}
        onSelectWallpaper={(themeClass) => {
          if (activeChat) {
            setChatWallpaper(activeChat.id, themeClass);
          }
        }}
      />

      {/* AI Voice Avatar & Voice Cloning Studio Modal */}
      <VoiceCloneStudioModal
        isOpen={voiceStudioOpen}
        onClose={() => setVoiceStudioOpen(false)}
        onProfileUpdated={() => showToast('🎙️ AI Voice Avatar updated successfully!')}
      />

      {/* AI Talking Photo Avatar Player Modal */}
      {talkingPortraitModalData && (
        <TalkingPortraitModal
          isOpen={!!talkingPortraitModalData}
          senderName={talkingPortraitModalData.senderName}
          senderAvatar={talkingPortraitModalData.senderAvatar}
          messageText={talkingPortraitModalData.messageText}
          voiceProfile={talkingPortraitModalData.voiceProfile}
          onClose={() => setTalkingPortraitModalData(null)}
        />
      )}

    </div>
  );
};
