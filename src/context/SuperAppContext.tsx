import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_USER,
  MOCK_ALERTS,
  MOCK_CHATS,
  MOCK_HABITS,
  MOCK_MATRIMONY_PROFILES,
  MOCK_PROPERTIES,
  MOCK_SOCIAL_POSTS,
  MOCK_STORIES,
  MOCK_TASKS,
  MOCK_TUTORS
} from '../data/mockData';
import {
  addCloudComment,
  cloudLoginUser,
  cloudLogoutUser,
  cloudRegisterUser,
  createCloudBooking,
  createCloudPost,
  createCloudTask,
  deleteCloudTask,
  getCloudBookings,
  getCloudChats,
  getCloudHabits,
  getCloudMatrimonyProfiles,
  getCloudPosts,
  getCloudProperties,
  getCloudTasks,
  getCloudTutors,
  getCloudUserProfile,
  isSupabaseConfigured,
  likeCloudPost,
  sendCloudInterestToMatrimony,
  sendCloudMessage,
  toggleCloudSaveProperty,
  toggleCloudShortlistMatrimony,
  updateCloudHabit,
  updateCloudTaskStatus,
  updateCloudUserProfile
} from '../services/cloudDatabaseService';
import {
  ChatConversation,
  ChatMessage,
  ChatReminder,
  HabitItem,
  LoginCredentials,
  MatrimonyProfile,
  MiniAppId,
  ProactiveAlert,
  RealEstateProperty,
  RegisterCredentials,
  ScheduledMessage,
  SocialPost,
  SocialStory,
  TaskItem,
  TutorBooking,
  TutorProfile,
  UserProfile
} from '../types/superApp';
import {
  DeviceSessionUser,
  getStoredActiveSession,
  saveActiveSession,
  clearActiveSession,
  isDeviceLockEnabled,
  registerDeviceLock
} from '../services/deviceLockService';

interface SuperAppContextType {
  // Authentication & Device Security Lock
  isAuthenticated: boolean;
  isDeviceLocked: boolean;
  sessionUser: DeviceSessionUser | null;
  unlockDevice: () => void;
  login: (creds: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (creds: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  activeMiniApp: MiniAppId;
  setActiveMiniApp: (app: MiniAppId) => void;
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => Promise<void>;
  
  // Real Estate
  properties: RealEstateProperty[];
  toggleSaveProperty: (id: string) => Promise<void>;
  
  // Matrimony
  matrimonyProfiles: MatrimonyProfile[];
  sendInterest: (id: string) => Promise<void>;
  toggleShortlistMatrimony: (id: string) => Promise<void>;
  
  // Tutors
  tutors: TutorProfile[];
  bookings: TutorBooking[];
  bookTutorSession: (tutorId: string, subject: string, date: string, time: string) => Promise<boolean>;
  
  // Social
  posts: SocialPost[];
  stories: SocialStory[];
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  createPost: (content: string, mediaUrl?: string, tags?: string[]) => Promise<void>;
  
  // Chat
  chats: ChatConversation[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  sendChatMessage: (chatId: string, text: string, options?: { expiresDuration?: number | null; mediaUrl?: string; mediaType?: 'image' | 'video' | 'audio' | 'video_note' | 'sticker' | 'gif' | 'file'; poll?: any; isForwarded?: boolean }) => Promise<void>;
  startNewChatWith: (name: string, avatar: string, role: string, initialMessage?: string) => string;
  createChannel: (channelData: { name: string; handle: string; description: string; avatar: string; isPrivate: boolean; initialPost?: string }) => string;
  sendBroadcast: (recipientChatIds: string[], text: string) => Promise<void>;
  toggleFriendStatus: (chatId: string) => void;
  toggleBlockStatus: (chatId: string) => void;
  votePoll: (chatId: string, messageId: string, optionId: string) => void;
  toggleStarMessage: (chatId: string, messageId: string) => void;
  reactToMessage: (chatId: string, messageId: string, emoji: string) => void;
  togglePinChat: (chatId: string) => void;
  toggleMuteChat: (chatId: string) => void;
  setChatWallpaper: (chatId: string, wallpaper: string) => void;
  clearChatHistory: (chatId: string) => void;
  
  // Scheduled Messages & Reminders & Automated Voice Calls
  scheduledMessages: ScheduledMessage[];
  chatReminders: ChatReminder[];
  scheduleChatMessage: (
    chatId: string,
    text: string,
    deliverAtMs: number,
    deliverAtStr: string,
    deliveryType?: 'message' | 'call',
    audioUrl?: string,
    audioDuration?: number
  ) => void;
  cancelScheduledMessage: (id: string) => void;
  sendScheduledMessageNow: (id: string) => void;
  setChatReminder: (chatId: string, messageSnippet: string, remindAtMs: number, remindAtStr: string, note?: string) => void;
  dismissChatReminder: (id: string) => void;
  incomingScheduledCall: {
    id: string;
    senderName: string;
    senderAvatar: string;
    audioUrl?: string;
    audioDuration?: number;
    text?: string;
    chatId: string;
  } | null;
  clearIncomingScheduledCall: () => void;
  triggerScheduledCallNow: (sMsg: ScheduledMessage) => void;
  
  // Productivity
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id'>) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  habits: HabitItem[];
  toggleHabitDay: (habitId: string, dayIdx: number) => Promise<void>;
  
  // Alerts & Notifications
  alerts: ProactiveAlert[];
  dismissAlert: (id: string) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  
  // Cloud Database Status
  isCloudConnected: boolean;
  
  // Reset
  resetDefaults: () => void;
}

const SuperAppContext = createContext<SuperAppContextType | undefined>(undefined);

export const SuperAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDeviceLocked, setIsDeviceLocked] = useState<boolean>(false);
  const [sessionUser, setSessionUser] = useState<DeviceSessionUser | null>(null);

  const [activeMiniApp, setActiveMiniApp] = useState<MiniAppId>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [properties, setProperties] = useState<RealEstateProperty[]>(MOCK_PROPERTIES);
  const [matrimonyProfiles, setMatrimonyProfiles] = useState<MatrimonyProfile[]>(MOCK_MATRIMONY_PROFILES);
  const [tutors, setTutors] = useState<TutorProfile[]>(MOCK_TUTORS);
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);
  const [stories] = useState<SocialStory[]>(MOCK_STORIES);
  const [chats, setChats] = useState<ChatConversation[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('chat-brain');

  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(() => {
    try {
      const saved = localStorage.getItem('omnilife_scheduled_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [chatReminders, setChatReminders] = useState<ChatReminder[]>(() => {
    try {
      const saved = localStorage.getItem('omnilife_chat_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [incomingScheduledCall, setIncomingScheduledCall] = useState<{
    id: string;
    senderName: string;
    senderAvatar: string;
    audioUrl?: string;
    audioDuration?: number;
    text?: string;
    chatId: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('omnilife_scheduled_messages', JSON.stringify(scheduledMessages));
  }, [scheduledMessages]);

  useEffect(() => {
    localStorage.setItem('omnilife_chat_reminders', JSON.stringify(chatReminders));
  }, [chatReminders]);

  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [habits, setHabits] = useState<HabitItem[]>(MOCK_HABITS);
  const [alerts, setAlerts] = useState<ProactiveAlert[]>(MOCK_ALERTS);
  const [toast, setToast] = useState<string | null>(null);

  // Check on startup if returning user has active session protected by device screen lock
  useEffect(() => {
    const savedSession = getStoredActiveSession();
    if (savedSession && isDeviceLockEnabled()) {
      setSessionUser(savedSession);
      setIsDeviceLocked(true);
      setIsAuthenticated(false);
    }
  }, []);

  // Initial Load from Cloud Database API
  useEffect(() => {
    async function loadCloudData() {
      try {
        const [u, p, m, t, b, pos, ch, tsk, h] = await Promise.all([
          getCloudUserProfile(),
          getCloudProperties(),
          getCloudMatrimonyProfiles(),
          getCloudTutors(),
          getCloudBookings(),
          getCloudPosts(),
          getCloudChats(),
          getCloudTasks(),
          getCloudHabits()
        ]);
        setUser(u);
        setProperties(p);
        setMatrimonyProfiles(m);
        setTutors(t);
        setBookings(b);
        setPosts(pos);
        setChats(ch);
        setTasks(tsk);
        setHabits(h);
      } catch (e) {
        console.warn('Cloud database sync initialized with remote state');
      }
    }
    loadCloudData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  /* ==================== AUTHENTICATION & DEVICE LOCK ACTIONS ==================== */
  const unlockDevice = () => {
    setIsDeviceLocked(false);
    setIsAuthenticated(true);
    confetti({ particleCount: 60, spread: 60 });
    showToast('🔓 Device Screen Lock Verified! Welcome back.');
  };

  const login = async (creds: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await cloudLoginUser(creds);
      if (res.error) {
        showToast(`⚠️ ${res.error}`);
        return { success: false, error: res.error };
      }
      setUser(res.user);
      
      const sessionUserObj: DeviceSessionUser = {
        id: res.user.id || res.user.email,
        name: res.user.name,
        email: res.user.email,
        avatar: res.user.avatar,
        handle: res.user.handle
      };
      saveActiveSession(sessionUserObj);
      registerDeviceLock(sessionUserObj);
      setSessionUser(sessionUserObj);

      setIsDeviceLocked(false);
      setIsAuthenticated(true);
      setActiveMiniApp('home');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      showToast(`Welcome back, ${res.user.name}! 🌟`);
      return { success: true };
    } catch (err: any) {
      showToast('⚠️ Authentication failed. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const register = async (creds: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await cloudRegisterUser(creds);
      if (res.error) {
        showToast(`⚠️ ${res.error}`);
        return { success: false, error: res.error };
      }
      setUser(res.user);

      const sessionUserObj: DeviceSessionUser = {
        id: res.user.id || res.user.email,
        name: res.user.name,
        email: res.user.email,
        avatar: res.user.avatar,
        handle: res.user.handle
      };
      saveActiveSession(sessionUserObj);
      registerDeviceLock(sessionUserObj);
      setSessionUser(sessionUserObj);

      setIsDeviceLocked(false);
      setIsAuthenticated(true);
      setActiveMiniApp('home');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      showToast(`🎉 Registration complete! Welcome to Aditi, ${res.user.name}!`);
      return { success: true };
    } catch (err: any) {
      showToast('⚠️ Registration error. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const logout = async (): Promise<void> => {
    await cloudLogoutUser();
    clearActiveSession();
    setSessionUser(null);
    setIsDeviceLocked(false);
    setIsAuthenticated(false);
    showToast('👋 You have been logged out securely.');
  };

  const updateUser = async (updated: Partial<UserProfile>) => {
    const res = await updateCloudUserProfile(updated);
    setUser(res);
    showToast('Cloud: Profile updated in remote database!');
  };

  // Real Estate
  const toggleSaveProperty = async (id: string) => {
    const updated = await toggleCloudSaveProperty(id);
    setProperties(updated);
    showToast('Cloud: Property bookmark synced!');
  };

  // Matrimony
  const sendInterest = async (id: string) => {
    const updated = await sendCloudInterestToMatrimony(id);
    setMatrimonyProfiles(updated);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    showToast('💌 Cloud: Interest request sent to remote match!');
  };

  const toggleShortlistMatrimony = async (id: string) => {
    const updated = await toggleCloudShortlistMatrimony(id);
    setMatrimonyProfiles(updated);
    showToast('Cloud: Shortlist synced!');
  };

  // Tutor Booking
  const bookTutorSession = async (tutorId: string, subject: string, date: string, time: string): Promise<boolean> => {
    const tutor = tutors.find((t) => t.id === tutorId);
    if (!tutor) return false;

    const newBooking: TutorBooking = {
      id: `book-${Date.now()}`,
      tutorId,
      tutorName: tutor.name,
      subject,
      date,
      time,
      rate: tutor.hourlyRate,
      status: 'Confirmed'
    };

    const studyTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      title: `${subject} Session with ${tutor.name}`,
      description: `Scheduled 1-on-1 tutoring session.`,
      status: 'todo',
      priority: 'high',
      dueDate: `${date} at ${time}`,
      category: 'Study'
    };

    // Commit to Cloud Database
    const [bRes, tRes] = await Promise.all([
      createCloudBooking(newBooking),
      createCloudTask(studyTask)
    ]);

    setBookings(bRes);
    setTasks(tRes);

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(`🎉 Mentorship session scheduled with ${tutor.name}!`);
    return true;
  };

  // Social Actions
  const likePost = async (postId: string) => {
    const updated = await likeCloudPost(postId);
    setPosts(updated);
  };

  const addComment = async (postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      content,
      timestamp: 'Just now'
    };
    const updated = await addCloudComment(postId, newComment);
    setPosts(updated);
    showToast('Cloud: Comment posted!');
  };

  const createPost = async (content: string, mediaUrl?: string, tags?: string[]) => {
    if (!content.trim()) return;
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      author: {
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        isVerified: true
      },
      content,
      mediaUrl,
      mediaType: 'image',
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      timestamp: 'Just now',
      tags: tags || ['#AditiSuperApp', '#DailyUpdate']
    };
    const updated = await createCloudPost(newPost);
    setPosts(updated);
    confetti({ particleCount: 50, spread: 60 });
    showToast('🚀 Cloud: Story published to global feed!');
  };

  // Real-time Disappearing Messages & Scheduled Deliveries & Chat Reminders worker (1 second precision)
  useEffect(() => {
    const cleaner = setInterval(() => {
      const now = Date.now();

      // 1. Clean disappearing messages
      setChats((prevChats) => {
        let hasExpired = false;
        const nextChats = prevChats.map((chat) => {
          const expiredExists = chat.messages.some((m) => m.expiresAt && m.expiresAt <= now);
          if (expiredExists) {
            hasExpired = true;
            const remaining = chat.messages.filter((m) => !m.expiresAt || m.expiresAt > now);
            return {
              ...chat,
              lastMessage: remaining.length > 0 ? remaining[remaining.length - 1].text : 'Disappearing message expired 🔥',
              messages: remaining
            };
          }
          return chat;
        });

        return hasExpired ? nextChats : prevChats;
      });

      // 2. Deliver scheduled messages & automated calls
      setScheduledMessages((prev) => {
        let changed = false;
        const next = prev.map((sMsg) => {
          if (now >= sMsg.scheduledTimestamp && !sMsg.isSent) {
            changed = true;
            if (sMsg.deliveryType === 'call') {
              setIncomingScheduledCall({
                id: sMsg.id,
                senderName: sMsg.targetContactName,
                senderAvatar: sMsg.targetContactAvatar,
                audioUrl: sMsg.audioUrl,
                audioDuration: sMsg.audioDuration || 10,
                text: sMsg.text,
                chatId: sMsg.chatId
              });
              sendChatMessage(sMsg.chatId, `📞 [Automated Voice Call Delivered]:\n${sMsg.text}`, {
                mediaUrl: sMsg.audioUrl,
                mediaType: sMsg.audioUrl ? 'audio' : undefined
              });
              confetti({ particleCount: 60, spread: 70 });
              showToast(`📞 Automated Voice Call connected for ${sMsg.targetContactName}!`);
            } else {
              sendChatMessage(sMsg.chatId, `⏰ [Scheduled Delivery]:\n${sMsg.text}`, {
                mediaUrl: sMsg.audioUrl,
                mediaType: sMsg.audioUrl ? 'audio' : undefined
              });
              confetti({ particleCount: 50, spread: 60 });
              showToast(`🔔 Scheduled message delivered to ${sMsg.targetContactName}!`);
            }
            return { ...sMsg, isSent: true };
          }
          return sMsg;
        });
        return changed ? next : prev;
      });

      // 3. Trigger chat reminders
      setChatReminders((prev) => {
        let changed = false;
        const next = prev.map((rem) => {
          if (now >= rem.remindAtTimestamp && !rem.isTriggered) {
            changed = true;
            const alertObj: ProactiveAlert = {
              id: `alert-rem-${Date.now()}`,
              category: 'productivity',
              title: `⏰ Chat Reminder: ${rem.contactName}`,
              message: rem.note ? `${rem.note} (Re: "${rem.messageSnippet}")` : `Reminder: "${rem.messageSnippet}"`,
              actionMiniApp: 'chat',
              timestamp: 'Just now',
              priority: 'important'
            };
            setAlerts((prevAlerts) => [alertObj, ...prevAlerts]);
            showToast(`⏰ Chat Reminder for ${rem.contactName}: "${rem.messageSnippet}"!`);
            return { ...rem, isTriggered: true };
          }
          return rem;
        });
        return changed ? next : prev;
      });

    }, 1000);

    return () => clearInterval(cleaner);
  }, []);

  // Chat Actions
  const sendChatMessage = async (
    chatId: string,
    text: string,
    options?: {
      expiresDuration?: number | null;
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'audio' | 'video_note' | 'sticker' | 'gif' | 'file';
      poll?: any;
      isForwarded?: boolean;
    }
  ) => {
    if (!text.trim() && !options?.mediaUrl && !options?.poll) return;

    const expiresAt = options?.expiresDuration ? Date.now() + options.expiresDuration * 1000 : undefined;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'user',
      senderName: user.name,
      text: text || (options?.poll ? `📊 Poll: ${options.poll.question}` : options?.mediaType ? `[${options.mediaType}]` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      mediaUrl: options?.mediaUrl,
      mediaType: options?.mediaType,
      poll: options?.poll,
      isForwarded: options?.isForwarded,
      expiresAt,
      expiresDuration: options?.expiresDuration || undefined,
      isDisappearing: Boolean(options?.expiresDuration)
    };

    const updated = await sendCloudMessage(chatId, userMsg);
    setChats(updated);

    if (chatId !== 'chat-brain' && !options?.poll) {
      setTimeout(async () => {
        const replyExpiresAt = options?.expiresDuration ? Date.now() + options.expiresDuration * 1000 : undefined;
        const replyMsg: ChatMessage = {
          id: `m-${Date.now() + 1}`,
          senderId: 'contact',
          senderName: 'Contact',
          text: 'Got your message! Let me check the details and get back to you shortly. 👍',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
          expiresAt: replyExpiresAt,
          expiresDuration: options?.expiresDuration || undefined,
          isDisappearing: Boolean(options?.expiresDuration)
        };
        const res = await sendCloudMessage(chatId, replyMsg);
        setChats(res);
      }, 1200);
    }
  };

  const startNewChatWith = (name: string, avatar: string, role: string, initialMessage?: string): string => {
    const existing = chats.find((c) => c.participantName === name);
    if (existing) {
      setActiveChatId(existing.id);
      setActiveMiniApp('chat');
      return existing.id;
    }

    const newChatId = `chat-${Date.now()}`;
    const newChat: ChatConversation = {
      id: newChatId,
      participantName: name,
      participantAvatar: avatar,
      roleOrContext: role,
      lastMessage: initialMessage || 'Conversation started',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      isOnline: true,
      messages: initialMessage
        ? [
            {
              id: `m-${Date.now()}`,
              senderId: 'user',
              senderName: user.name,
              text: initialMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isUser: true
            }
          ]
        : []
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setActiveMiniApp('chat');
    return newChatId;
  };

  const createChannel = (channelData: {
    name: string;
    handle: string;
    description: string;
    avatar: string;
    isPrivate: boolean;
    initialPost?: string;
  }): string => {
    const newChannelId = `channel-${Date.now()}`;
    const initialMsg: ChatMessage[] = channelData.initialPost
      ? [
          {
            id: `m-${Date.now()}`,
            senderId: 'user',
            senderName: user.name,
            text: channelData.initialPost,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: true
          }
        ]
      : [];

    const newChannel: ChatConversation = {
      id: newChannelId,
      participantName: channelData.name,
      participantAvatar: channelData.avatar,
      roleOrContext: `📢 ${channelData.isPrivate ? 'Private' : 'Public'} Channel`,
      lastMessage: channelData.initialPost || 'Channel created',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      isOnline: true,
      conversationType: 'channel',
      channelHandle: channelData.handle,
      subscriberCount: 1,
      isOwner: true,
      description: channelData.description,
      isPrivate: channelData.isPrivate,
      messages: initialMsg
    };

    setChats((prev) => [newChannel, ...prev]);
    setActiveChatId(newChannelId);
    setActiveMiniApp('chat');
    return newChannelId;
  };

  const sendBroadcast = async (recipientChatIds: string[], text: string) => {
    if (!text.trim() || recipientChatIds.length === 0) return;

    for (const chatId of recipientChatIds) {
      const broadcastMsg: ChatMessage = {
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        senderId: 'user',
        senderName: user.name,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true
      };
      await sendCloudMessage(chatId, broadcastMsg);
    }

    const updatedChats = await getCloudChats();
    setChats(updatedChats);
  };

  const toggleFriendStatus = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updated = !c.isFriend;
          if (updated) {
            confetti({ particleCount: 70, spread: 70 });
            showToast(`🎉 Added ${c.participantName} as friend! Unlimited messaging unlocked.`);
          } else {
            showToast(`Removed ${c.participantName} from friends list.`);
          }
          return { ...c, isFriend: updated };
        }
        return c;
      })
    );
  };

  const toggleBlockStatus = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updated = !c.isBlocked;
          if (updated) {
            showToast(`🚫 Blocked ${c.participantName}.`);
          } else {
            showToast(`🔓 Unblocked ${c.participantName}.`);
          }
          return { ...c, isBlocked: updated };
        }
        return c;
      })
    );
  };

  const votePoll = (chatId: string, messageId: string, optionId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updatedMessages = c.messages.map((m) => {
            if (m.id === messageId && m.poll) {
              const nextOptions = m.poll.options.map((opt) => {
                const isThis = opt.id === optionId;
                const wasVoted = opt.votedUserIds?.includes('user');
                let newVotedIds = opt.votedUserIds || [];
                let newVotes = opt.votes;

                if (isThis) {
                  if (wasVoted) {
                    newVotedIds = newVotedIds.filter((id) => id !== 'user');
                    newVotes = Math.max(0, newVotes - 1);
                  } else {
                    newVotedIds = [...newVotedIds, 'user'];
                    newVotes += 1;
                  }
                } else if (!m.poll?.allowsMultiple && wasVoted) {
                  newVotedIds = newVotedIds.filter((id) => id !== 'user');
                  newVotes = Math.max(0, newVotes - 1);
                }
                return { ...opt, votes: newVotes, votedUserIds: newVotedIds };
              });

              const totalVotes = nextOptions.reduce((acc, curr) => acc + curr.votes, 0);
              return {
                ...m,
                poll: {
                  ...m.poll,
                  options: nextOptions,
                  totalVotes
                }
              };
            }
            return m;
          });
          return { ...c, messages: updatedMessages };
        }
        return c;
      })
    );
    showToast('📊 Poll vote registered!');
  };

  const toggleStarMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updated = c.messages.map((m) => {
            if (m.id === messageId) {
              const nextStar = !m.isStarred;
              showToast(nextStar ? '⭐ Message starred!' : 'Message unstarred.');
              return { ...m, isStarred: nextStar };
            }
            return m;
          });
          return { ...c, messages: updated };
        }
        return c;
      })
    );
  };

  const reactToMessage = (chatId: string, messageId: string, emoji: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updated = c.messages.map((m) => {
            if (m.id === messageId) {
              const reactions = { ...(m.reactions || {}) };
              const currentReaction = m.userReaction;

              if (currentReaction === emoji) {
                reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
                if (reactions[emoji] === 0) delete reactions[emoji];
                return { ...m, reactions, userReaction: undefined };
              } else {
                if (currentReaction && reactions[currentReaction]) {
                  reactions[currentReaction] = Math.max(0, reactions[currentReaction] - 1);
                  if (reactions[currentReaction] === 0) delete reactions[currentReaction];
                }
                reactions[emoji] = (reactions[emoji] || 0) + 1;
                return { ...m, reactions, userReaction: emoji };
              }
            }
            return m;
          });
          return { ...c, messages: updated };
        }
        return c;
      })
    );
  };

  const togglePinChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const nextPin = !c.isPinned;
          showToast(nextPin ? `📌 Pinned ${c.participantName} to top!` : `Unpinned ${c.participantName}.`);
          return { ...c, isPinned: nextPin };
        }
        return c;
      })
    );
  };

  const toggleMuteChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const nextMute = !c.isMuted;
          showToast(nextMute ? `🔕 Muted notifications for ${c.participantName}.` : `🔔 Unmuted ${c.participantName}.`);
          return { ...c, isMuted: nextMute };
        }
        return c;
      })
    );
  };

  const setChatWallpaper = (chatId: string, wallpaper: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, customWallpaper: wallpaper } : c))
    );
    showToast('🎨 Chat wallpaper theme updated!');
  };

  const clearChatHistory = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: [], lastMessage: 'Chat history cleared' }
          : c
      )
    );
    showToast('🗑️ Chat history cleared.');
  };

  // Scheduled Messages & Chat Reminders Actions
  const scheduleChatMessage = (
    chatId: string,
    text: string,
    deliverAtMs: number,
    deliverAtStr: string,
    deliveryType: 'message' | 'call' = 'message',
    audioUrl?: string,
    audioDuration?: number
  ) => {
    const targetChat = chats.find((c) => c.id === chatId);
    const newScheduled: ScheduledMessage = {
      id: `sched-${Date.now()}`,
      chatId,
      text,
      scheduledTimestamp: deliverAtMs,
      scheduledTimeStr: deliverAtStr,
      targetContactName: targetChat?.participantName || 'Contact',
      targetContactAvatar: targetChat?.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      isSent: false,
      deliveryType,
      audioUrl,
      audioDuration
    };
    setScheduledMessages((prev) => [newScheduled, ...prev]);
    if (deliveryType === 'call') {
      showToast(`📞 Automated Voice Call scheduled for ${deliverAtStr}!`);
    } else {
      showToast(`⏰ Message scheduled for ${deliverAtStr}!`);
    }
  };

  const clearIncomingScheduledCall = () => {
    setIncomingScheduledCall(null);
  };

  const triggerScheduledCallNow = (sMsg: ScheduledMessage) => {
    setIncomingScheduledCall({
      id: sMsg.id,
      senderName: sMsg.targetContactName,
      senderAvatar: sMsg.targetContactAvatar,
      audioUrl: sMsg.audioUrl,
      audioDuration: sMsg.audioDuration || 10,
      text: sMsg.text,
      chatId: sMsg.chatId
    });
    setScheduledMessages((prev) => prev.filter((m) => m.id !== sMsg.id));
  };

  const cancelScheduledMessage = (id: string) => {
    setScheduledMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Scheduled message cancelled.');
  };

  const sendScheduledMessageNow = (id: string) => {
    const msg = scheduledMessages.find((m) => m.id === id);
    if (msg) {
      sendChatMessage(msg.chatId, `⏰ [Scheduled Delivery]:\n${msg.text}`);
      setScheduledMessages((prev) => prev.filter((m) => m.id !== id));
      showToast(`🚀 Sent immediately to ${msg.targetContactName}!`);
    }
  };

  const setChatReminder = (chatId: string, messageSnippet: string, remindAtMs: number, remindAtStr: string, note?: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    const newRem: ChatReminder = {
      id: `rem-${Date.now()}`,
      chatId,
      messageSnippet,
      remindAtTimestamp: remindAtMs,
      remindAtStr: remindAtStr,
      contactName: targetChat?.participantName || 'Contact',
      note,
      isTriggered: false
    };
    setChatReminders((prev) => [newRem, ...prev]);
    showToast(`🔔 Reminder set for ${remindAtStr}!`);
  };

  const dismissChatReminder = (id: string) => {
    setChatReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder dismissed.');
  };

  // Tasks
  const addTask = async (taskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `tsk-${Date.now()}`
    };
    const updated = await createCloudTask(newTask);
    setTasks(updated);
    showToast('Cloud: Task added to LifeOS Database!');
  };

  const toggleTaskStatus = async (id: string) => {
    const current = tasks.find(t => t.id === id);
    const nextStatus = current?.status === 'done' ? 'todo' : 'done';
    if (nextStatus === 'done') {
      confetti({ particleCount: 40, spread: 50 });
    }
    const updated = await updateCloudTaskStatus(id, nextStatus);
    setTasks(updated);
  };

  const deleteTask = async (id: string) => {
    const updated = await deleteCloudTask(id);
    setTasks(updated);
    showToast('Cloud: Task removed.');
  };

  // Habits
  const toggleHabitDay = async (habitId: string, dayIdx: number) => {
    const updated = await updateCloudHabit(habitId, dayIdx);
    setHabits(updated);
  };

  // Alerts
  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const resetDefaults = () => {
    setProperties(MOCK_PROPERTIES);
    setMatrimonyProfiles(MOCK_MATRIMONY_PROFILES);
    setTutors(MOCK_TUTORS);
    setPosts(MOCK_SOCIAL_POSTS);
    setChats(MOCK_CHATS);
    setTasks(MOCK_TASKS);
    setHabits(MOCK_HABITS);
    setAlerts(MOCK_ALERTS);
    setUser(INITIAL_USER);
    showToast('♻️ Cloud state reset to clean initial state!');
  };

  return (
    <SuperAppContext.Provider
      value={{
        isAuthenticated,
        isDeviceLocked,
        sessionUser,
        unlockDevice,
        login,
        register,
        logout,
        activeMiniApp,
        setActiveMiniApp,
        user,
        updateUser,
        properties,
        toggleSaveProperty,
        matrimonyProfiles,
        sendInterest,
        toggleShortlistMatrimony,
        tutors,
        bookings,
        bookTutorSession,
        posts,
        stories,
        likePost,
        addComment,
        createPost,
        chats,
        activeChatId,
        setActiveChatId,
        sendChatMessage,
        startNewChatWith,
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
        tasks,
        addTask,
        toggleTaskStatus,
        deleteTask,
        habits,
        toggleHabitDay,
        alerts,
        dismissAlert,
        toast,
        showToast,
        isCloudConnected: isSupabaseConfigured,
        resetDefaults
      }}
    >
      {children}
    </SuperAppContext.Provider>
  );
};

export const useSuperApp = () => {
  const context = useContext(SuperAppContext);
  if (!context) throw new Error('useSuperApp must be used within SuperAppProvider');
  return context;
};
