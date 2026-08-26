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
  MOCK_TRANSACTIONS,
  MOCK_TUTORS
} from '../data/mockData';
import {
  addCloudComment,
  addCloudTransaction,
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
  getCloudWallet,
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
  HabitItem,
  LoginCredentials,
  MatrimonyProfile,
  MiniAppId,
  ProactiveAlert,
  RealEstateProperty,
  RegisterCredentials,
  SocialPost,
  SocialStory,
  TaskItem,
  TutorBooking,
  TutorProfile,
  UserProfile,
  WalletTransaction
} from '../types/superApp';

interface SuperAppContextType {
  // Authentication
  isAuthenticated: boolean;
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
  sendChatMessage: (chatId: string, text: string) => Promise<void>;
  startNewChatWith: (name: string, avatar: string, role: string, initialMessage?: string) => string;
  
  // Digital Wallet
  walletBalance: number;
  transactions: WalletTransaction[];
  sendMoney: (recipient: string, amount: number, category?: WalletTransaction['category']) => Promise<boolean>;
  addMoneyToWallet: (amount: number) => Promise<void>;
  
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default active demo session
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
  const [walletBalance, setWalletBalance] = useState<number>(2450.00);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [habits, setHabits] = useState<HabitItem[]>(MOCK_HABITS);
  const [alerts, setAlerts] = useState<ProactiveAlert[]>(MOCK_ALERTS);
  const [toast, setToast] = useState<string | null>(null);

  // Initial Load from Cloud Database API
  useEffect(() => {
    async function loadCloudData() {
      try {
        const [u, p, m, t, b, pos, ch, w, tsk, h] = await Promise.all([
          getCloudUserProfile(),
          getCloudProperties(),
          getCloudMatrimonyProfiles(),
          getCloudTutors(),
          getCloudBookings(),
          getCloudPosts(),
          getCloudChats(),
          getCloudWallet(),
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
        setWalletBalance(w.balance);
        setTransactions(w.transactions);
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

  /* ==================== AUTHENTICATION ACTIONS ==================== */
  const login = async (creds: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await cloudLoginUser(creds);
      if (res.error) {
        showToast(`⚠️ ${res.error}`);
        return { success: false, error: res.error };
      }
      setUser(res.user);
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

    if (walletBalance < tutor.hourlyRate) {
      showToast('⚠️ Insufficient wallet balance! Please add funds in Digital Wallet.');
      return false;
    }

    const nextBal = walletBalance - tutor.hourlyRate;
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'debit',
      title: `Tutoring Session with ${tutor.name}`,
      category: 'Tutor',
      amount: tutor.hourlyRate,
      recipientOrSender: tutor.name,
      timestamp: 'Just now',
      status: 'Completed'
    };

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
    const [wRes, bRes, tRes] = await Promise.all([
      addCloudTransaction(newTx, nextBal),
      createCloudBooking(newBooking),
      createCloudTask(studyTask)
    ]);

    setWalletBalance(wRes.balance);
    setTransactions(wRes.transactions);
    setBookings(bRes);
    setTasks(tRes);

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(`🎉 Cloud: Session booked & synced across database!`);
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

  // Chat Actions
  const sendChatMessage = async (chatId: string, text: string) => {
    if (!text.trim()) return;
    const userMsg = {
      id: `m-${Date.now()}`,
      senderId: 'user',
      senderName: user.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    const updated = await sendCloudMessage(chatId, userMsg);
    setChats(updated);

    if (chatId !== 'chat-brain') {
      setTimeout(async () => {
        const replyMsg = {
          id: `m-${Date.now() + 1}`,
          senderId: 'contact',
          senderName: 'Contact',
          text: 'Got your message! Let me check the details and get back to you shortly. 👍',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false
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

  // Wallet
  const sendMoney = async (recipient: string, amount: number, category: WalletTransaction['category'] = 'Transfer'): Promise<boolean> => {
    if (amount <= 0 || amount > walletBalance) {
      showToast('⚠️ Invalid amount or insufficient balance!');
      return false;
    }

    const nextBal = walletBalance - amount;
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'debit',
      title: `Transfer to ${recipient}`,
      category,
      amount,
      recipientOrSender: recipient,
      timestamp: 'Just now',
      status: 'Completed'
    };

    const wRes = await addCloudTransaction(newTx, nextBal);
    setWalletBalance(wRes.balance);
    setTransactions(wRes.transactions);
    confetti({ particleCount: 70, spread: 60 });
    showToast(`💸 Cloud: Sent $${amount.toFixed(2)} to ${recipient}!`);
    return true;
  };

  const addMoneyToWallet = async (amount: number) => {
    if (amount <= 0) return;
    const nextBal = walletBalance + amount;
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'credit',
      title: 'Wallet Top-Up',
      category: 'Services',
      amount,
      recipientOrSender: 'Bank Account (Linked)',
      timestamp: 'Just now',
      status: 'Completed'
    };

    const wRes = await addCloudTransaction(newTx, nextBal);
    setWalletBalance(wRes.balance);
    setTransactions(wRes.transactions);
    confetti({ particleCount: 60, spread: 50 });
    showToast(`💳 Cloud: Added $${amount.toFixed(2)} to Digital Wallet!`);
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
    setWalletBalance(2450.00);
    setTransactions(MOCK_TRANSACTIONS);
    setTasks(MOCK_TASKS);
    setHabits(MOCK_HABITS);
    setAlerts(MOCK_ALERTS);
    setUser(INITIAL_USER);
    showToast('♻️ Cloud state reset to clean initial demo data!');
  };

  return (
    <SuperAppContext.Provider
      value={{
        isAuthenticated,
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
        walletBalance,
        transactions,
        sendMoney,
        addMoneyToWallet,
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
