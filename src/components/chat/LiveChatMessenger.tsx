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
  Film,
  Globe,
  Languages,
  ChevronDown,
  AlertTriangle,
  Settings,
  X
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ChatConversation, ChatMessage, ChatPoll } from '../../types/superApp';
import { AudioRecorder } from './AudioRecorder';
import { VideoCallModal } from './VideoCallModal';
import { IncomingLiveCallModal } from './IncomingLiveCallModal';
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
import { MessageInfoModal } from './MessageInfoModal';
import { SharedMediaDrawer } from './SharedMediaDrawer';
import { GroupSettingsModal } from './GroupSettingsModal';
import { ChatSearchModal } from './ChatSearchModal';
import { AiChatAssistantModal } from './AiChatAssistantModal';
import { filterConversationsByFolder } from '../../services/messagingEngine';
import { ChatFolderType } from '../../types/superApp';
import { StickerGifPickerModal } from './StickerGifPickerModal';
import { VideoNoteModal } from './VideoNoteModal';
import { ForwardModal } from './ForwardModal';
import { StarredMessagesDrawer } from './StarredMessagesDrawer';
import { WallpaperModal } from './WallpaperModal';
import { LiveBackgroundCamera } from './LiveBackgroundCamera';
import { VoiceCloneStudioModal } from './VoiceCloneStudioModal';
import { TalkingPortraitModal } from './TalkingPortraitModal';
import { playTextInSenderVoice } from '../../services/voiceCloneService';
import { startVoiceRecognition, stopVoiceRecognition, SpeechLanguage, isSpeechRecognitionSupported } from '../../services/voiceToTextService';
import { INDIAN_LANGUAGES, translateIndianLanguageToEnglish, IndianLanguageMeta } from '../../services/indianLanguageTranslationService';
import { UserVoiceProfile } from '../../types/superApp';
import confetti from 'canvas-confetti';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

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
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    unfriendContact,
    votePoll,
    toggleStarMessage,
    reactToMessage,
    togglePinChat,
    toggleMuteChat,
    setChatWallpaper,
    clearChatHistory,
    deleteChatConversation,
    clearAllChatHistory,
    editChatMessage,
    deleteChatMessage,
    pinMessageToChat,
    unpinMessageFromChat,
    registeredUsers,
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
    incomingLiveCall,
    activeLiveCall,
    acceptIncomingLiveCall,
    declineIncomingLiveCall,
    startLiveCallWith,
    endLiveCall,
    user,
    showToast
  } = useSuperApp();
  
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFolderTab, setChatFolderTab] = useState<ChatFolderType>('all');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSecretBar, setShowSecretBar] = useState(false);
  const [secretTimer, setSecretTimer] = useState<number | null>(null);

  // Chat History & Deletion Confirmation State
  const [confirmModal, setConfirmModal] = useState<{
    type: 'clear_chat' | 'delete_chat' | 'clear_all';
    chatId?: string;
    participantName?: string;
  } | null>(null);
  const [showSidebarSettingsMenu, setShowSidebarSettingsMenu] = useState(false);

  // New Production Messenger Modals & Drawers
  const [messageInfoModalOpen, setMessageInfoModalOpen] = useState(false);
  const [messageInfoMsg, setMessageInfoMsg] = useState<ChatMessage | null>(null);
  const [sharedMediaDrawerOpen, setSharedMediaDrawerOpen] = useState(false);
  const [groupSettingsModalOpen, setGroupSettingsModalOpen] = useState(false);
  const [chatSearchModalOpen, setChatSearchModalOpen] = useState(false);
  const [aiAssistantModalOpen, setAiAssistantModalOpen] = useState(false);
  const [aiAssistantSelectedMsg, setAiAssistantSelectedMsg] = useState<ChatMessage | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState('');

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

  // Mobile Ergonomics & De-congestion State
  const [showHeaderMoreMenu, setShowHeaderMoreMenu] = useState(false);
  const [showAttachmentsMenu, setShowAttachmentsMenu] = useState(false);
  const [showSidebarActionsMenu, setShowSidebarActionsMenu] = useState(false);

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

  // Voice-to-Text (Speech Recognition / STT) & Indian Language Auto-Translation
  const [isDictating, setIsDictating] = useState(false);
  const [dictationLangMeta, setDictationLangMeta] = useState<IndianLanguageMeta>(INDIAN_LANGUAGES[0]); // Default: Malayalam
  const [autoTranslateToEnglish, setAutoTranslateToEnglish] = useState(true);
  const [dictationSpokenText, setDictationSpokenText] = useState('');
  const [dictationTranslatedEnglish, setDictationTranslatedEnglish] = useState('');
  const [isTranslatingVoice, setIsTranslatingVoice] = useState(false);
  const [showDictationLangMenu, setShowDictationLangMenu] = useState(false);
  const stopDictationRef = useRef<(() => void) | null>(null);

  const toggleVoiceToTextDictation = (targetLangMeta?: IndianLanguageMeta) => {
    const lang = targetLangMeta || dictationLangMeta;
    if (targetLangMeta) {
      setDictationLangMeta(targetLangMeta);
    }

    if (isDictating && !targetLangMeta) {
      stopDictationRef.current?.();
      stopVoiceRecognition();
      setIsDictating(false);
      setDictationSpokenText('');
      setDictationTranslatedEnglish('');
      showToast('⏹️ Voice dictation stopped');
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      showToast('⚠️ Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    stopDictationRef.current?.();
    setIsDictating(true);
    const stopper = startVoiceRecognition({
      lang: lang.speechCode,
      continuous: true,
      interimResults: true,
      onResult: (text, isFinal) => {
        setDictationSpokenText(text);
        if (text.trim()) {
          setIsTranslatingVoice(true);
          translateIndianLanguageToEnglish(text, lang.code, 'en').then((res) => {
            setDictationTranslatedEnglish(res.translatedText);
            setIsTranslatingVoice(false);
            if (autoTranslateToEnglish && isFinal) {
              setInputText((prev) => (prev ? `${prev} ${res.translatedText}` : res.translatedText));
            } else if (!autoTranslateToEnglish && isFinal) {
              setInputText((prev) => (prev ? `${prev} ${text}` : text));
            }
          });
        }
      },
      onError: (err) => {
        showToast(`⚠️ Dictation notice: ${err}`);
        setIsDictating(false);
      },
      onEnd: () => {
        setIsDictating(false);
      }
    });
    stopDictationRef.current = stopper;
    showToast(`🎙️ Voice active (${lang.flag} ${lang.nameNative} ➔ English Translation). Speak now!`);
  };

  // Send Translated English Message
  const handleSendTranslatedEnglishMessage = (customEnglish?: string) => {
    const text = (customEnglish || dictationTranslatedEnglish || inputText).trim();
    if (!text || !activeChat) return;

    sendChatMessage(activeChat.id, text, { expiresDuration: secretTimer });
    setInputText('');
    setDictationSpokenText('');
    setDictationTranslatedEnglish('');
    setIsDictating(false);
    stopDictationRef.current?.();
    stopVoiceRecognition();
    showToast('🌐 Translated English message sent!');
  };

  // Send Bilingual Message (English + Original Indian language)
  const handleSendBilingualMessage = () => {
    if (!activeChat) return;
    const eng = dictationTranslatedEnglish.trim() || inputText.trim();
    const native = dictationSpokenText.trim();
    if (!eng && !native) return;

    const bilingual = native && eng !== native ? `${eng}\n(${native})` : eng || native;
    sendChatMessage(activeChat.id, bilingual, { expiresDuration: secretTimer });
    setInputText('');
    setDictationSpokenText('');
    setDictationTranslatedEnglish('');
    setIsDictating(false);
    stopDictationRef.current?.();
    stopVoiceRecognition();
    showToast('🌐 Bilingual message (English + Indian) sent!');
  };

  // Send Text directly as Cloned Voice Note (Text-to-Voice)
  const handleSendTextAsVoiceNote = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeChat) return;

    const audioMsg = `🎙️ [AI Voice Note]: ${text}`;
    sendChatMessage(activeChat.id, audioMsg, {
      expiresDuration: secretTimer,
      mediaType: 'audio'
    });
    setInputText('');
    setIsDictating(false);
    stopDictationRef.current?.();
    showToast('🗣️ Text converted to Voice Note & sent!');
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

  // Interactive Chat Features & Media Modals
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

  // Anti-spam 3-Message Limit, Block, and Friend Request logic
  const isDirectChat = !activeChat?.conversationType || activeChat?.conversationType === 'direct';
  const isFriend = activeChat?.isFriend ?? false;
  const isBlocked = activeChat?.isBlocked ?? false;

  const incomingReqForActive = activeChat
    ? friendRequests.find(
        (r) =>
          r.status === 'pending' &&
          (r.fromUserId === activeChat.id ||
            r.fromUserName.toLowerCase() === activeChat.participantName.toLowerCase() ||
            (registeredUsers.find((u) => u.name.toLowerCase() === activeChat.participantName.toLowerCase())?.id === r.fromUserId))
      )
    : null;

  const outgoingReqForActive = activeChat
    ? friendRequests.find(
        (r) =>
          r.status === 'pending' &&
          (r.toUserId === activeChat.id ||
            r.toUserName.toLowerCase() === activeChat.participantName.toLowerCase() ||
            (registeredUsers.find((u) => u.name.toLowerCase() === activeChat.participantName.toLowerCase())?.id === r.toUserId))
      )
    : null;

  const isRequestReceived = Boolean(incomingReqForActive || activeChat?.friendRequestReceived);
  const isRequestSent = Boolean(outgoingReqForActive || activeChat?.friendRequestSent);

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

  // Filter and Sort: Folders + Pinned conversations priority
  const filteredChats = filterConversationsByFolder(chats, chatFolderTab, searchQuery)
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
    if (!activeChat) return;
    setIsVideoCall(video);
    setCallModalOpen(true);
    setFloatingCallActive(false);
    startLiveCallWith(activeChat.participantName, activeChat.participantAvatar, video);
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
    <div className="h-[calc(100dvh-7.5rem)] md:h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden font-sans border-t md:border border-slate-800 md:rounded-3xl md:shadow-2xl">
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR: CONVERSATION LIST & SEARCH */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-950 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 space-y-3 bg-slate-900/60 backdrop-blur-xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Send className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>AditiChat Pro</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Live
                  </span>
                </h2>
              </div>
            </div>
            
            {/* Mobile Actions Menu Dropdown Trigger */}
            <div className="flex md:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => setAddFriendModalOpen(true)}
                className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-extrabold flex items-center gap-1"
                title="Add Friends"
              >
                <UserPlus className="w-4 h-4" />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSidebarActionsMenu(!showSidebarActionsMenu)}
                  className={`p-2 rounded-xl border transition-colors ${
                    showSidebarActionsMenu
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showSidebarActionsMenu && (
                  <div className="absolute right-0 top-11 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 w-56 space-y-1 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => {
                        setAddFriendModalOpen(true);
                        setShowSidebarActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors text-left"
                    >
                      <UserPlus className="w-4 h-4 text-indigo-400" />
                      <span>Add & Discover Friends</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGroupModalOpen(true);
                        setShowSidebarActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>New Group Chat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChannelModalOpen(true);
                        setShowSidebarActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Megaphone className="w-4 h-4 text-pink-400" />
                      <span>New Broadcast Channel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBroadcastModalOpen(true);
                        setShowSidebarActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <span>Broadcast Message</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStarredDrawerOpen(true);
                        setShowSidebarActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>Starred Bookmarks</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScheduledQueueDrawerOpen(true);
                        setShowSidebarActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Scheduled Queue</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Actions Row */}
            <div className="hidden md:flex items-center gap-1">
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
                title="Starred Bookmarks"
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
                title="New Broadcast Channel"
              >
                <Megaphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setBroadcastModalOpen(true)}
                className="p-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                title="Broadcast to Multiple Contacts"
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

              {/* Chat Privacy & Global History Management Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSidebarSettingsMenu(!showSidebarSettingsMenu)}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    showSidebarSettingsMenu
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title="Chat Privacy & History Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>

                {showSidebarSettingsMenu && (
                  <div className="absolute right-0 top-9 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 w-56 space-y-1 animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Chat Privacy & Data
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSidebarSettingsMenu(false);
                        setConfirmModal({ type: 'clear_all' });
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span>Delete All Chat History</span>
                    </button>
                  </div>
                )}
              </div>
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

          {/* Chat Inbox Folders & Category Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setChatFolderTab('all')}
              className={`px-2.5 py-1 rounded-lg transition-all text-center whitespace-nowrap ${
                chatFolderTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setChatFolderTab('friends')}
              className={`px-2.5 py-1 rounded-lg transition-all text-center whitespace-nowrap ${
                chatFolderTab === 'friends'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Friends
            </button>
            <button
              type="button"
              onClick={() => setChatFolderTab('unread')}
              className={`px-2.5 py-1 rounded-lg transition-all text-center whitespace-nowrap ${
                chatFolderTab === 'unread'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setChatFolderTab('personal')}
              className={`px-2.5 py-1 rounded-lg transition-all text-center whitespace-nowrap ${
                chatFolderTab === 'personal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => setChatFolderTab('groups')}
              className={`px-2.5 py-1 rounded-lg transition-all text-center whitespace-nowrap ${
                chatFolderTab === 'groups'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Groups
            </button>
            <button
              type="button"
              onClick={() => setChatFolderTab('channels')}
              className={`px-2.5 py-1 rounded-lg transition-all text-center whitespace-nowrap ${
                chatFolderTab === 'channels'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Channels
            </button>
            <button
              type="button"
              onClick={() => setChatFolderTab('favorites')}
              className={`px-2.5 py-1 rounded-lg transition-all text-center whitespace-nowrap ${
                chatFolderTab === 'favorites'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⭐ Favorites
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
                className={`w-full p-3.5 text-left transition-all flex items-center gap-3 relative group ${
                  isSelected
                    ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                    : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={getSafeAvatarUrl(chat.participantAvatar, chat.participantName)}
                    alt={chat.participantName}
                    onError={(e) => handleAvatarError(e, chat.participantName)}
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
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] text-slate-500 group-hover:hidden">{chat.lastMessageTime}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({
                            type: 'delete_chat',
                            chatId: chat.id,
                            participantName: chat.participantName
                          });
                        }}
                        className="hidden group-hover:flex p-1 rounded-lg hover:bg-rose-950/70 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-all"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
            <div className="px-3 sm:px-4 py-2.5 bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl flex items-center justify-between z-20 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-2 -ml-1 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                  title="Back to conversations"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Avatar */}
                <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setDetailsDrawerOpen(true)}>
                  <img
                    src={getSafeAvatarUrl(activeChat.participantAvatar, activeChat.participantName)}
                    alt={activeChat.participantName}
                    onError={(e) => handleAvatarError(e, activeChat.participantName)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                  />
                  {activeChat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                  )}
                </div>

                {/* Participant Info */}
                <div className="min-w-0 cursor-pointer flex-1" onClick={() => setDetailsDrawerOpen(true)}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-black text-xs sm:text-sm text-white truncate">{activeChat.participantName}</h3>
                    {isFriend && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5 flex-shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Friend</span>
                      </span>
                    )}
                    {isRequestSent && !isFriend && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Requested</span>
                      </span>
                    )}
                    {isRequestReceived && !isFriend && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5 flex-shrink-0 animate-pulse">
                        <UserPlus className="w-2.5 h-2.5" />
                        <span>Pending</span>
                      </span>
                    )}
                    {secretTimer && (
                      <span className="flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex-shrink-0">
                        <Lock className="w-2.5 h-2.5 mr-0.5" />
                        {secretTimer}s
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                    {isTyping ? (
                      <span className="text-emerald-400 font-bold animate-pulse">Typing a message...</span>
                    ) : activeChat.isOnline ? (
                      <span className="text-emerald-400 font-medium">Online • E2EE</span>
                    ) : (
                      <span className="text-slate-400">{activeChat.roleOrContext || 'Aditi Contact'}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                
                {/* Voice Call */}
                <button
                  onClick={() => handleStartCall(false)}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>

                {/* HD Video Call */}
                <button
                  onClick={() => handleStartCall(true)}
                  className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                  title="HD Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>

                {/* Desktop-Only Quick Buttons */}
                <button
                  onClick={() => {
                    setAiAssistantSelectedMsg(null);
                    setAiAssistantModalOpen(true);
                  }}
                  className="hidden md:flex p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-yellow-400 border border-indigo-500/30 transition-all"
                  title="OmniBrain AI Assistant"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setChatSearchModalOpen(true)}
                  className="hidden md:flex p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Search in Chat"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* More Options Menu (Dropdown for both Mobile & Desktop) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowHeaderMoreMenu(!showHeaderMoreMenu)}
                    className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${
                      showHeaderMoreMenu
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                    title="More conversation options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showHeaderMoreMenu && (
                    <div className="absolute right-0 top-12 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 w-60 space-y-0.5 animate-in fade-in zoom-in-95 max-h-[75vh] overflow-y-auto">
                      
                      {/* Search */}
                      <button
                        type="button"
                        onClick={() => {
                          setChatSearchModalOpen(true);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        <Search className="w-4 h-4 text-indigo-400" />
                        <span>Search in Chat</span>
                      </button>

                      {/* AI Assistant */}
                      <button
                        type="button"
                        onClick={() => {
                          setAiAssistantSelectedMsg(null);
                          setAiAssistantModalOpen(true);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-yellow-300 hover:bg-indigo-600/20 transition-colors text-left"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span>OmniBrain AI Tools</span>
                      </button>

                      {/* Friend Request / Friendship Actions in Menu */}
                      {isFriend ? (
                        <button
                          type="button"
                          onClick={() => {
                            unfriendContact(activeChat.id);
                            setShowHeaderMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
                        >
                          <UserMinus className="w-4 h-4 text-rose-400" />
                          <span>Unfriend Contact</span>
                        </button>
                      ) : isRequestReceived ? (
                        <button
                          type="button"
                          onClick={() => {
                            acceptFriendRequest(activeChat.id);
                            setShowHeaderMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-950/40 transition-colors text-left"
                        >
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Accept Friend Request</span>
                        </button>
                      ) : isRequestSent ? (
                        <button
                          type="button"
                          onClick={() => {
                            cancelFriendRequest(activeChat.id);
                            setShowHeaderMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-slate-800 transition-colors text-left"
                        >
                          <X className="w-4 h-4 text-amber-400" />
                          <span>Cancel Sent Request</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            sendFriendRequest(activeChat.id, activeChat.participantName, activeChat.participantAvatar, activeChat.roleOrContext);
                            setShowHeaderMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 hover:bg-indigo-600/20 transition-colors text-left"
                        >
                          <UserPlus className="w-4 h-4 text-indigo-400" />
                          <span>Send Friend Request</span>
                        </button>
                      )}

                      {/* Shared Media Vault */}
                      <button
                        type="button"
                        onClick={() => {
                          setSharedMediaDrawerOpen(true);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>Media, Links & Docs Vault</span>
                      </button>

                      {/* Wallpaper & Themes */}
                      <button
                        type="button"
                        onClick={() => {
                          setWallpaperModalOpen(true);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        <Palette className="w-4 h-4 text-pink-400" />
                        <span>Chat Wallpaper & Themes</span>
                      </button>

                      {/* Pin Chat */}
                      <button
                        type="button"
                        onClick={() => {
                          togglePinChat(activeChat.id);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        <Pin className="w-4 h-4 text-amber-400" />
                        <span>{activeChat.isPinned ? 'Unpin Conversation' : 'Pin to Top'}</span>
                      </button>

                      {/* Mute Chat */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleMuteChat(activeChat.id);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        {activeChat.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
                        <span>{activeChat.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                      </button>

                      {/* Disappearing Messages */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowSecretBar(!showSecretBar);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        <Lock className="w-4 h-4 text-rose-400" />
                        <span>Disappearing Messages</span>
                      </button>

                      {/* Live Cam Walk & Chat */}
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isLiveBgActive;
                          setIsLiveBgActive(next);
                          setShowHeaderMoreMenu(false);
                          showToast(next ? '🎥 Live Camera Background activated!' : 'Live background deactivated');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>Walk & Chat (Live Cam)</span>
                      </button>

                      {/* Send Direct Email */}
                      <button
                        type="button"
                        onClick={() => {
                          setEmailInitialSubject(`Aditi Inquiry with ${activeChat.participantName}`);
                          setEmailInitialBody('');
                          setEmailModalOpen(true);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                      >
                        <Mail className="w-4 h-4 text-emerald-400" />
                        <span>Send Direct Email</span>
                      </button>

                      {/* Group Settings (if group) */}
                      {(activeChat.conversationType === 'group' || activeChat.conversationType === 'channel') && (
                        <button
                          type="button"
                          onClick={() => {
                            setGroupSettingsModalOpen(true);
                            setShowHeaderMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                        >
                          <Users className="w-4 h-4 text-indigo-400" />
                          <span>Group Permissions</span>
                        </button>
                      )}

                      <div className="border-t border-slate-800 my-1" />

                      {/* View Contact Details */}
                      <button
                        type="button"
                        onClick={() => {
                          setDetailsDrawerOpen(true);
                          setShowHeaderMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 hover:bg-indigo-600/20 transition-colors text-left"
                      >
                        <Info className="w-4 h-4 text-indigo-400" />
                        <span>Contact Info & Details</span>
                      </button>

                      <div className="border-t border-slate-800 my-1" />

                      {/* Clear Chat History */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowHeaderMoreMenu(false);
                          setConfirmModal({
                            type: 'clear_chat',
                            chatId: activeChat.id,
                            participantName: activeChat.participantName
                          });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-950/40 transition-colors text-left"
                      >
                        <Trash2 className="w-4 h-4 text-amber-400" />
                        <span>Clear Chat History</span>
                      </button>

                      {/* Delete Conversation */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowHeaderMoreMenu(false);
                          setConfirmModal({
                            type: 'delete_chat',
                            chatId: activeChat.id,
                            participantName: activeChat.participantName
                          });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Delete Conversation</span>
                      </button>

                    </div>
                  )}
                </div>

              </div>
            </div>

        {/* Non-Friend Safety & 3-Message Daily Limit Banner / Friend Request State */}
        {isNonFriendDirect && (
          isRequestReceived ? (
            <div className="px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border-b border-indigo-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs z-10 animate-in fade-in shadow-lg">
              <div className="flex items-center gap-2 text-indigo-200 min-w-0">
                <UserPlus className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="leading-snug">
                  <strong>{activeChat.participantName}</strong> sent you a friend request! Accept to connect and unlock unlimited messaging.
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => acceptFriendRequest(activeChat.id)}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-md transition-all hover:scale-105"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Accept Request</span>
                </button>
                <button
                  type="button"
                  onClick={() => declineFriendRequest(activeChat.id)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : isRequestSent ? (
            <div className="px-3.5 sm:px-5 py-2 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs z-10 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 min-w-0">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="truncate">
                  Friend request sent to <strong>{activeChat.participantName}</strong> (Pending approval). Daily limit: <strong className="text-amber-200">{remainingNonFriendMessages} of 3</strong> messages remaining.
                </span>
              </div>
              <button
                type="button"
                onClick={() => cancelFriendRequest(activeChat.id)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-bold transition-all flex-shrink-0"
              >
                Cancel Request
              </button>
            </div>
          ) : (
            <div className="px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs z-10 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 min-w-0">
                <UserPlus className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="truncate">
                  <strong>{activeChat.participantName}</strong> is not in your friends list. Daily limit: <strong className="text-amber-200">{remainingNonFriendMessages} of 3</strong> messages remaining.
                </span>
              </div>
              <button
                type="button"
                onClick={() => sendFriendRequest(activeChat.id, activeChat.participantName, activeChat.participantAvatar, activeChat.roleOrContext)}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition-all hover:scale-105 flex-shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Send Friend Request</span>
              </button>
            </div>
          )
        )}

        {/* Authoritative Synchronized Pinned Messages Banner */}
        {((activeChat.pinnedMessages && activeChat.pinnedMessages.length > 0) || pinnedMessage) && (
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border-b border-indigo-500/30 flex items-center justify-between text-xs animate-in slide-in-from-top-1 z-10">
            <div className="flex items-center gap-2 text-indigo-300 truncate">
              <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
              <span className="font-bold text-amber-300">Pinned:</span>
              <span className="truncate">
                {activeChat.pinnedMessages && activeChat.pinnedMessages.length > 0
                  ? activeChat.pinnedMessages[0].text
                  : pinnedMessage}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <button
                type="button"
                onClick={() => {
                  if (activeChat.pinnedMessages && activeChat.pinnedMessages.length > 0) {
                    unpinMessageFromChat(activeChat.id, activeChat.pinnedMessages[0].messageId);
                  }
                  setPinnedMessage(null);
                }}
                className="text-slate-400 hover:text-white text-[11px] font-bold"
              >
                Unpin
              </button>
            </div>
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
            const isDeleted = msg.isDeleted || msg.deletedForEveryone;
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
                    src={getSafeAvatarUrl(activeChat.participantAvatar, msg.senderName)}
                    alt={msg.senderName}
                    onError={(e) => handleAvatarError(e, msg.senderName)}
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
                      isDeleted
                        ? 'bg-slate-900/60 border border-slate-800 text-slate-500 italic'
                        : isSticker
                        ? 'bg-transparent shadow-none p-0'
                        : isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Quoted Reply Snapshot Header */}
                    {msg.replySnapshot && !isDeleted && (
                      <div className="mb-2 p-2 rounded-xl bg-black/20 border-l-4 border-indigo-400 text-[11px] space-y-0.5">
                        <span className="font-bold text-indigo-300 block">{msg.replySnapshot.senderName}</span>
                        <p className="text-white/80 line-clamp-1 italic">{msg.replySnapshot.text}</p>
                      </div>
                    )}

                    {/* Deleted Tombstone */}
                    {isDeleted ? (
                      <div className="flex items-center gap-2 py-1 text-slate-400 font-mono text-xs">
                        <Ban className="w-3.5 h-3.5 text-slate-500" />
                        <span>This message was deleted</span>
                      </div>
                    ) : editingMessageId === msg.id ? (
                      /* Inline Message Editor */
                      <div className="space-y-2 min-w-[240px]">
                        <span className="font-bold text-[11px] text-amber-300 block">Edit Message:</span>
                        <textarea
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                          rows={2}
                          className="w-full p-2 rounded-xl bg-slate-950 border border-amber-500 text-xs text-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-2 text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => setEditingMessageId(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              editChatMessage(activeChat.id, msg.id, editingMessageText);
                              setEditingMessageId(null);
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                              title="Playback Speed"
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
                              <Navigation className="w-4 h-4 text-emerald-400" />
                              <span className="font-bold text-xs">{msg.text}</span>
                            </div>
                            <div className="h-32 w-full rounded-xl bg-slate-950 border border-slate-700/60 overflow-hidden relative group/loc">
                              <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-2.5 rounded-2xl bg-indigo-600/90 text-white shadow-xl flex items-center gap-1.5 text-xs font-bold animate-bounce">
                                  <MapPin className="w-4 h-4" />
                                  <span>Live Geolocation</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : isFile ? (
                          <div className="flex items-center gap-3 py-1">
                            <div className="p-2.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold block truncate text-xs">{msg.text}</span>
                              <span className="text-[10px] text-purple-300">Shared Attachment</span>
                            </div>
                          </div>
                        ) : isEmail ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-300 font-bold">
                              <Mail className="w-4 h-4" />
                              <span>Dispatched via SMTP Email</span>
                            </div>
                            <p className="whitespace-pre-wrap font-mono text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                              {msg.text}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {msg.mediaUrl && (
                              <img
                                src={msg.mediaUrl}
                                alt="Attachment"
                                className="w-full max-h-64 object-cover rounded-xl mb-2"
                              />
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            
                            {/* AI Voice Avatar Player Button (Text to Voice) */}
                            {!isUser && (
                              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handlePlayMessageInSenderVoice(msg)}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                                    activePlayingVoiceMsgId === msg.id
                                      ? 'bg-purple-600 text-white animate-pulse'
                                      : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30'
                                  }`}
                                  title="Listen to this text message spoken aloud"
                                >
                                  {activePlayingVoiceMsgId === msg.id ? (
                                    <>
                                      <Pause className="w-3 h-3 text-white" />
                                      <span>Speaking...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3 h-3 text-purple-400" />
                                      <span>🔊 Text to Voice</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTalkingPortraitModalData({
                                      senderName: msg.senderName,
                                      senderAvatar: msg.talkingPhotoUrl || activeChat.participantAvatar,
                                      messageText: msg.text,
                                      voiceProfile: msg.voiceProfile
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 text-[11px] font-extrabold flex items-center gap-1 transition-all"
                                >
                                  <Sparkles className="w-3 h-3 text-yellow-400" />
                                  <span>🗣️ Photo Lip-Sync</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Disappearing Message Live Countdown Badge */}
                    {msg.isDisappearing && remainingSecs !== null && !isDeleted && (
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
                    {!isDeleted && (
                      <div className="absolute right-2 -top-3 hidden group-hover:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 shadow-xl z-20">
                        {/* Message Info / Read Receipts */}
                        <button
                          onClick={() => {
                            setMessageInfoMsg(msg);
                            setMessageInfoModalOpen(true);
                          }}
                          className="p-1 hover:text-cyan-400 text-slate-400"
                          title="Message Info (Read & Delivery Receipts)"
                        >
                          <Info className="w-3 h-3" />
                        </button>

                        {/* Edit Message (if Sender) */}
                        {isUser && (
                          <button
                            onClick={() => {
                              setEditingMessageId(msg.id);
                              setEditingMessageText(msg.text);
                            }}
                            className="p-1 hover:text-amber-400 text-slate-400"
                            title="Edit Message"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}

                        {/* AI Assistant Tools */}
                        <button
                          onClick={() => {
                            setAiAssistantSelectedMsg(msg);
                            setAiAssistantModalOpen(true);
                          }}
                          className="p-1 hover:text-yellow-400 text-slate-400"
                          title="OmniBrain AI Tools (Task, Calendar, Rewrite)"
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>

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
                          onClick={() => {
                            pinMessageToChat(activeChat.id, msg);
                          }}
                          className="p-1 hover:text-yellow-400 text-slate-400"
                          title="Pin Message Authoritatively"
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

                        {/* Delete Message */}
                        <button
                          onClick={() => {
                            deleteChatMessage(activeChat.id, msg.id, isUser);
                          }}
                          className="p-1 hover:text-rose-400 text-slate-400"
                          title={isUser ? 'Delete for Everyone' : 'Delete for Me'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

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
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && !isDeleted && (
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

                  {/* Timestamp, Edited Tag, Star & Delivery State Machine Ticks */}
                  <div
                    className={`flex items-center gap-1.5 text-[10px] text-slate-500 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.isStarred && <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />}
                    {msg.editedAt && <span className="italic text-amber-400/80">(edited • {msg.editedAt})</span>}
                    <span>{msg.timestamp}</span>
                    
                    {/* Delivery Status Machine Ticks */}
                    {isUser && !isDeleted && (
                      <span title={msg.status === 'read' ? 'Read by recipient' : msg.status === 'delivered' ? 'Delivered to device' : msg.status === 'sent' ? 'Sent to server' : msg.status === 'sending' || msg.status === 'queued' ? 'Sending...' : 'Delivered & Read'}>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                        ) : msg.status === 'sent' ? (
                          <Check className="w-3.5 h-3.5 text-slate-400" />
                        ) : msg.status === 'sending' || msg.status === 'queued' ? (
                          <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </span>
                    )}
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

            {/* Audio Recorder Toolbar with Voice-to-Text Transcription */}
            {isRecordingAudio && (
              <div className="p-2.5 sm:p-3 bg-slate-950/95 border-t border-slate-800">
                <AudioRecorder
                  onSendAudio={handleSendAudio}
                  onSendTranscribedText={(text) => {
                    if (activeChat) {
                      sendChatMessage(activeChat.id, text, { expiresDuration: secretTimer });
                      setIsRecordingAudio(false);
                      showToast('🎙️ Transcribed voice message sent!');
                    }
                  }}
                  onCancel={() => setIsRecordingAudio(false)}
                />
              </div>
            )}

            {/* Live Indian Language Voice-to-Text & English Translation Stream Banner */}
            {isDictating && !isRecordingAudio && (
              <div className="p-3 sm:p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-t border-rose-500/40 shadow-2xl space-y-2.5 text-xs animate-in slide-in-from-bottom-2 relative">
                
                {/* Header: Status, Language Dropdown & Translation Toggle */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute" />
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 relative" />
                    </div>
                    <span className="font-extrabold text-rose-300 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Voice Translation (തത്സമയ വിവർത്തനം):</span>
                    </span>
                  </div>

                  {/* Language Selector Dropdown & Auto-Translate Switch */}
                  <div className="flex items-center gap-2">
                    {/* Indian Language Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDictationLangMenu(!showDictationLangMenu)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs font-bold text-indigo-300 hover:text-white transition-all shadow-sm"
                        title="Select Spoken Indian Language"
                      >
                        <span>{dictationLangMeta.flag}</span>
                        <span className="text-[11px]">{dictationLangMeta.nameNative}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {showDictationLangMenu && (
                        <div className="absolute bottom-9 right-0 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 w-52 max-h-60 overflow-y-auto space-y-1 animate-in fade-in">
                          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                            Select Spoken Language
                          </div>
                          {INDIAN_LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => {
                                setDictationLangMeta(lang);
                                setShowDictationLangMenu(false);
                                toggleVoiceToTextDictation(lang);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                                dictationLangMeta.code === lang.code
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span>{lang.nameNative}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">{lang.nameEnglish}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Auto-Translate Toggle */}
                    <button
                      type="button"
                      onClick={() => setAutoTranslateToEnglish(!autoTranslateToEnglish)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                        autoTranslateToEnglish
                          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title="Toggle real-time translation to English"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>➔ English</span>
                    </button>
                  </div>
                </div>

                {/* Live Spoken Text & Real-time English Translation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  {/* Spoken Native Voice */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1 text-indigo-300">
                        <Mic className="w-3 h-3 text-rose-400 animate-pulse" />
                        <span>Spoken Voice ({dictationLangMeta.flag} {dictationLangMeta.nameNative}):</span>
                      </span>
                    </div>
                    <p className="text-slate-200 text-xs font-medium italic truncate">
                      {dictationSpokenText || `Listening in ${dictationLangMeta.nameEnglish}... സംസാരിക്കൂ...`}
                    </p>
                  </div>

                  {/* Translated English Text */}
                  <div className="min-w-0 space-y-0.5 border-t md:border-t-0 md:border-l border-slate-800 md:pl-2.5 pt-1.5 md:pt-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1 text-emerald-300">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span>English Translation (പരിഭാഷ):</span>
                      </span>
                      {isTranslatingVoice && <span className="text-[9px] text-amber-400 animate-pulse">Translating...</span>}
                    </div>
                    <p className="text-emerald-200 font-bold text-xs truncate">
                      {dictationTranslatedEnglish || 'Live English translation appears here...'}
                    </p>
                  </div>
                </div>

                {/* Instant Action Buttons */}
                <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Send Translated English Message */}
                    {dictationTranslatedEnglish.trim() && (
                      <button
                        type="button"
                        onClick={() => handleSendTranslatedEnglishMessage()}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                        title="Send translated English text immediately into chat"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Send in English (ഇംഗ്ലീഷിൽ അയക്കുക)</span>
                      </button>
                    )}

                    {/* Send Bilingual (English + Native) */}
                    {dictationTranslatedEnglish.trim() && dictationSpokenText.trim() && (
                      <button
                        type="button"
                        onClick={handleSendBilingualMessage}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-200 font-bold text-xs flex items-center gap-1 transition-all"
                        title="Send both English translation and original spoken text"
                      >
                        <span>🌐+🌴 Bilingual (ഇംഗ്ലീഷ് + മാതൃഭാഷ)</span>
                      </button>
                    )}

                    {/* Insert English into Textbox */}
                    {dictationTranslatedEnglish.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          setInputText((prev) => (prev ? `${prev} ${dictationTranslatedEnglish}` : dictationTranslatedEnglish));
                          showToast('📝 Inserted English translation into message box');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                        title="Insert English translation into input box for editing"
                      >
                        <span>Insert English (ബോക്സിൽ ചേർക്കുക)</span>
                      </button>
                    )}
                  </div>

                  {/* Stop / Done */}
                  <button
                    type="button"
                    onClick={() => {
                      stopDictationRef.current?.();
                      stopVoiceRecognition();
                      setIsDictating(false);
                      setDictationSpokenText('');
                      setDictationTranslatedEnglish('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all ml-auto"
                  >
                    Done (പൂർത്തിയായി)
                  </button>
                </div>

              </div>
            )}

            {/* Bottom Input Form & Smart Attachment Tools Sheet */}
            {!isRecordingAudio && (
              <div className="relative bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl">
                
                {/* Emoji Picker Popover */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-2 sm:left-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-40 grid grid-cols-7 gap-2 animate-in fade-in zoom-in-95">
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

                {/* Smart Attachments & Advanced Tools Sheet (3D Grid) */}
                {showAttachmentsMenu && (
                  <div className="p-3 bg-slate-900/95 border-b border-slate-800 border-t border-indigo-500/30 animate-in slide-in-from-bottom-2 shadow-2xl">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Media & Super Tools</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAttachmentsMenu(false)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      
                      {/* 1. Snap Camera */}
                      <button
                        type="button"
                        onClick={() => {
                          setSnapModalOpen(true);
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 text-slate-300 hover:text-pink-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-1 group-hover:bg-pink-500/30">
                          <Camera className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">Snap</span>
                      </button>

                      {/* 2. File Attachment */}
                      <button
                        type="button"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1 group-hover:bg-indigo-500/30">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">Document</span>
                      </button>

                      {/* 3. GPS Location */}
                      <button
                        type="button"
                        onClick={() => {
                          setLocationModalOpen(true);
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:bg-emerald-500/30">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">Location</span>
                      </button>

                      {/* 4. Live Poll */}
                      <button
                        type="button"
                        onClick={() => {
                          setPollModalOpen(true);
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1 group-hover:bg-amber-500/30">
                          <BarChart2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">Live Poll</span>
                      </button>

                      {/* 5. Scheduler & Reminders */}
                      <button
                        type="button"
                        onClick={() => {
                          setSchedulerInitialText(inputText);
                          setSchedulerInitialMode('schedule');
                          setSchedulerModalOpen(true);
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1 group-hover:bg-cyan-500/30">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">Schedule</span>
                      </button>

                      {/* 6. Video Note */}
                      <button
                        type="button"
                        onClick={() => {
                          setVideoNoteModalOpen(true);
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-blue-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1 group-hover:bg-blue-500/30">
                          <Video className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">Video Note</span>
                      </button>

                      {/* 7. AI Voice Studio */}
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceStudioOpen(true);
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1 group-hover:bg-purple-500/30">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">AI Voice</span>
                      </button>

                      {/* 8. Stickers & GIFs */}
                      <button
                        type="button"
                        onClick={() => {
                          setStickerModalOpen(true);
                          setShowAttachmentsMenu(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/50 text-slate-300 hover:text-yellow-300 transition-all hover:scale-105 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-1 group-hover:bg-yellow-500/30">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold truncate">Stickers</span>
                      </button>

                    </div>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Main Clean Input Bar */}
                <form
                  onSubmit={handleSendText}
                  className="p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2"
                >
                  {/* Emoji Picker Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowAttachmentsMenu(false);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors flex-shrink-0"
                    title="Add Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {/* Smart Plus (+) Tools Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachmentsMenu(!showAttachmentsMenu);
                      setShowEmojiPicker(false);
                    }}
                    className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                      showAttachmentsMenu
                        ? 'bg-indigo-600 text-white shadow-md rotate-45'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300'
                    }`}
                    title="Attach Media & Tools"
                  >
                    <Plus className="w-5 h-5 transition-transform" />
                  </button>

                  {/* Wide Text Input Box */}
                  <div className="flex-1 relative flex items-center min-w-0">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Message ${activeChat?.participantName || 'contact'}...`}
                      className="w-full pl-3.5 pr-10 py-2 sm:py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                    />

                    {/* Quick Mic Speech Dictation inside input */}
                    <button
                      type="button"
                      onClick={() => toggleVoiceToTextDictation()}
                      className={`absolute right-2 p-1.5 rounded-xl transition-all ${
                        isDictating
                          ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/40'
                          : 'text-slate-400 hover:text-rose-400'
                      }`}
                      title={isDictating ? 'Stop Voice Dictation' : 'Voice-to-Text Dictation (സംസാരിച്ച് ടൈപ്പ് ചെയ്യുക)'}
                    >
                      <Mic className={`w-4 h-4 ${isDictating ? 'animate-bounce text-white' : ''}`} />
                    </button>
                  </div>

                  {/* Action Buttons: Send / Text-to-Voice / Voice Memo */}
                  {inputText.trim() ? (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSendTextAsVoiceNote()}
                        className="hidden sm:flex p-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs items-center gap-1 transition-all"
                        title="Send as AI Voice Note (Text to Voice)"
                      >
                        <Volume2 className="w-4 h-4 text-purple-400" />
                        <span className="hidden md:inline">Voice Note</span>
                      </button>

                      <button
                        type="submit"
                        className="p-2 sm:p-2.5 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs">Send</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsRecordingAudio(true)}
                        className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                        title="Record Voice Memo"
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                </form>
              </div>
            )}
          </div>
        )}
        </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* INTEGRATED ADITICHAT MODALS & ADVANCED SERVICES */}
      {/* ========================================================================= */}
      
      {/* Real-time Incoming Live Call Ringing Modal */}
      {incomingLiveCall && (
        <IncomingLiveCallModal
          isOpen={!!incomingLiveCall}
          callerName={incomingLiveCall.callerName}
          callerAvatar={incomingLiveCall.callerAvatar}
          isVideo={incomingLiveCall.isVideo}
          onAccept={acceptIncomingLiveCall}
          onDecline={declineIncomingLiveCall}
        />
      )}

      {/* WebRTC Video Call Modal with Dual Merge & Native PiP */}
      <VideoCallModal
        isOpen={callModalOpen || !!activeLiveCall}
        contactName={activeLiveCall?.contactName || activeChat?.participantName || 'Aditi Contact'}
        contactAvatar={activeLiveCall?.contactAvatar || activeChat?.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
        isVideo={activeLiveCall ? activeLiveCall.isVideo : isVideoCall}
        callId={activeLiveCall?.callId}
        isCaller={activeLiveCall?.isCaller}
        targetUserId={activeLiveCall?.targetUserId}
        onClose={() => {
          setCallModalOpen(false);
          endLiveCall();
          setFloatingCallActive(false);
          setCallDuration(0);
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

      {/* Ephemeral Disappearing Snaps */}
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
        onClearHistory={() => {
          if (activeChat) {
            setConfirmModal({
              type: 'clear_chat',
              chatId: activeChat.id,
              participantName: activeChat.participantName
            });
          }
        }}
        onDeleteConversation={() => {
          if (activeChat) {
            setConfirmModal({
              type: 'delete_chat',
              chatId: activeChat.id,
              participantName: activeChat.participantName
            });
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

      {/* Broadcast Channel Creator Modal */}
      <ChannelCreateModal
        isOpen={channelModalOpen}
        onClose={() => setChannelModalOpen(false)}
        onCreateChannel={(channelData) => {
          const newChanId = createChannel(channelData);
          handleSelectChat(newChanId);
        }}
      />

      {/* Broadcast Message to Multiple Contacts Modal */}
      <BroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        chats={chats}
        onSendBroadcast={(selectedChatIds, messageText) => {
          sendBroadcast(selectedChatIds, messageText);
        }}
      />

      {/* Live Poll Creator Modal */}
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

      {/* Stickers & Trending GIFs Studio Modal */}
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

      {/* Circular Video Memo Modal */}
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

      {/* Forward Message to Multiple Contacts Modal */}
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

      {/* Starred Messages Drawer */}
      <StarredMessagesDrawer
        isOpen={starredDrawerOpen}
        onClose={() => setStarredDrawerOpen(false)}
        chats={chats}
        onSelectChat={(chatId) => handleSelectChat(chatId)}
        onUnstarMessage={(chatId, msgId) => toggleStarMessage(chatId, msgId)}
      />

      {/* Chat Wallpapers & Themes Switcher */}
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

      {/* Message Info & Read Receipts Modal */}
      <MessageInfoModal
        isOpen={messageInfoModalOpen}
        message={messageInfoMsg}
        onClose={() => {
          setMessageInfoModalOpen(false);
          setMessageInfoMsg(null);
        }}
      />

      {/* Shared Media, Docs, Audio & Links Vault Drawer */}
      {activeChat && (
        <SharedMediaDrawer
          isOpen={sharedMediaDrawerOpen}
          conversation={activeChat}
          onClose={() => setSharedMediaDrawerOpen(false)}
        />
      )}

      {/* Group Permissions & QR Invite Links Modal */}
      {activeChat && (
        <GroupSettingsModal
          isOpen={groupSettingsModalOpen}
          conversation={activeChat}
          onClose={() => setGroupSettingsModalOpen(false)}
        />
      )}

      {/* In-Chat & Media Search Modal */}
      {activeChat && (
        <ChatSearchModal
          isOpen={chatSearchModalOpen}
          conversation={activeChat}
          onSelectMessage={(msgId) => {
            showToast(`🔍 Jumped to message ID: ${msgId.slice(0, 8)}...`);
          }}
          onClose={() => setChatSearchModalOpen(false)}
        />
      )}

      {/* OmniBrain AI Chat Assistant Modal */}
      {activeChat && (
        <AiChatAssistantModal
          isOpen={aiAssistantModalOpen}
          conversation={activeChat}
          selectedMessage={aiAssistantSelectedMsg}
          onClose={() => {
            setAiAssistantModalOpen(false);
            setAiAssistantSelectedMsg(null);
          }}
        />
      )}

      {/* Chat & History Deletion Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-white">
                {confirmModal.type === 'clear_all'
                  ? 'Delete Entire Chat History?'
                  : confirmModal.type === 'delete_chat'
                  ? `Delete Conversation with ${confirmModal.participantName || 'this contact'}?`
                  : `Clear Chat History with ${confirmModal.participantName || 'this contact'}?`}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                {confirmModal.type === 'clear_all'
                  ? '⚠️ Warning: This will permanently delete all conversations, messages, media, and attachments for all contacts. This action is irreversible.'
                  : confirmModal.type === 'delete_chat'
                  ? 'This will completely remove the conversation thread and delete all messages with this contact from your inbox.'
                  : 'This will delete all messages in this conversation. The contact will remain in your chat list for future messaging.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.type === 'clear_all') {
                    clearAllChatHistory();
                  } else if (confirmModal.type === 'delete_chat' && confirmModal.chatId) {
                    deleteChatConversation(confirmModal.chatId);
                  } else if (confirmModal.type === 'clear_chat' && confirmModal.chatId) {
                    clearChatHistory(confirmModal.chatId);
                  }
                  setConfirmModal(null);
                  setDetailsDrawerOpen(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {confirmModal.type === 'clear_all'
                    ? 'Delete All Chats'
                    : confirmModal.type === 'delete_chat'
                    ? 'Delete Conversation'
                    : 'Clear Messages'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
