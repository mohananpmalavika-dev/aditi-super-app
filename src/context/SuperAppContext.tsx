import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_USER
} from '../data/mockData';
import { getSafeAvatarUrl } from '../utils/avatarUtils';
import {
  addCloudComment,
  addCloudFriend,
  removeCloudFriend,
  blockCloudUser,
  unblockCloudUser,
  createCloudConversation,
  cloudLoginUser,
  cloudLogoutUser,
  cloudRegisterUser,
  cloudGoogleAuthUser,
  createCloudBooking,
  createCloudPost,
  createCloudTask,
  deleteCloudTask,
  getCloudBookings,
  getCloudChats,
  getCloudHabits,
  getCloudMatrimonyProfiles,
  createCloudMatrimonyProfile,
  deleteCloudMatrimonyProfile,
  getCloudPosts,
  getCloudProperties,
  getCloudTasks,
  getCloudTutors,
  getCloudUserProfile,
  getCloudRegisteredUsers,
  saveCustomContact,
  isSupabaseConfigured,
  likeCloudPost,
  sendCloudInterestToMatrimony,
  sendCloudMessage,
  supabase,
  toggleCloudSaveProperty,
  createCloudProperty,
  deleteCloudProperty,
  getCloudPropertyRequirements,
  createCloudPropertyRequirement,
  deleteCloudPropertyRequirement,
  toggleCloudSaveRequirement,
  toggleCloudShortlistMatrimony,
  updateCloudHabit,
  updateCloudTaskStatus,
  updateCloudUserProfile,
  getLocalFriendRequests,
  FRIEND_REQUESTS_STORAGE_KEY,
  sendCloudFriendRequest,
  acceptCloudFriendRequest,
  declineCloudFriendRequest,
  cancelCloudFriendRequest,
  getCloudJobSources,
  updateCloudJobSource,
  syncAllCloudJobSources,
  getCloudJobVacancies,
  createCloudJobVacancy,
  updateCloudJobVacancy,
  deleteCloudJobVacancy,
  clearAllCloudJobVacancies,
  toggleCloudSaveJob,
  getCloudJobSeekers,
  createCloudJobSeeker,
  updateCloudJobSeeker,
  deleteCloudJobSeeker,
  toggleCloudSaveJobSeeker,
  getCloudLocalWorkers,
  createCloudLocalWorker,
  updateCloudLocalWorker,
  deleteCloudLocalWorker,
  toggleCloudSaveLocalWorker,
  getCloudJobApplications,
  createCloudJobApplication,
  updateCloudJobApplicationStatus,
  withdrawCloudJobApplication,
  getCloudServiceBookings,
  createCloudServiceBooking,
  updateCloudServiceBookingStatus,
  cancelCloudServiceBooking,
  getCloudWorkerReviews,
  createCloudWorkerReview,
  getCloudReports,
  createCloudReport,
  subscribeToJobPortalRealtime
} from '../services/cloudDatabaseService';
import {
  ChatConversation,
  ChatMessage,
  ChatPoll,
  ChatReminder,
  FriendRequest,
  FriendshipStatus,
  JobVacancy,
  JobSource,
  JobSeekerProfile,
  LocalWorkerProfile,
  JobApplication,
  JobApplicationStatus,
  ServiceBooking,
  ServiceBookingStatus,
  WorkerReview,
  JobReport,
  HabitItem,
  LoginCredentials,
  MatrimonyProfile,
  MiniAppId,
  ProactiveAlert,
  RealEstateProperty,
  PropertyRequirement,
  RegisterCredentials,
  ScheduledMessage,
  SocialPost,
  SocialStory,
  TaskItem,
  TutorBooking,
  TutorProfile,
  UserProfile,
  WalletTransaction
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
  loginWithGoogle: (googleUser?: { name: string; email: string; avatar?: string }) => Promise<{ success: boolean; error?: string }>;
  register: (creds: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  activeMiniApp: MiniAppId;
  setActiveMiniApp: (app: MiniAppId) => void;
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => Promise<void>;
  
  // Real Estate
  properties: RealEstateProperty[];
  toggleSaveProperty: (id: string) => Promise<void>;
  addProperty: (newProperty: Omit<RealEstateProperty, 'id' | 'isSaved'> | RealEstateProperty) => Promise<RealEstateProperty>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Buyer / Tenant Requirements (Property Wanted)
  propertyRequirements: PropertyRequirement[];
  addPropertyRequirement: (newReq: Omit<PropertyRequirement, 'id'> | PropertyRequirement) => Promise<PropertyRequirement>;
  deletePropertyRequirement: (id: string) => Promise<void>;
  toggleSavePropertyRequirement: (id: string) => Promise<void>;
  
  // Matrimony
  matrimonyProfiles: MatrimonyProfile[];
  addMatrimonyProfile: (newProfile: Omit<MatrimonyProfile, 'id'> | MatrimonyProfile) => Promise<MatrimonyProfile>;
  deleteMatrimonyProfile: (id: string) => Promise<void>;
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
  
  // Job Portal & Local Workers
  jobVacancies: JobVacancy[];
  jobSources: JobSource[];
  toggleJobSource: (id: string, isActive: boolean) => Promise<void>;
  syncJobSources: (targetSourceId?: string) => Promise<{ totalImported: number; mergedDuplicates: number; activeCount: number }>;
  addJobVacancy: (newJob: Omit<JobVacancy, 'id'> | JobVacancy) => Promise<JobVacancy>;
  updateJobVacancy: (id: string, updates: Partial<JobVacancy>) => Promise<void>;
  deleteJobVacancy: (id: string) => Promise<void>;
  clearAllJobVacancies: () => Promise<void>;
  toggleSaveJob: (id: string) => Promise<void>;
  
  jobSeekers: JobSeekerProfile[];
  addJobSeeker: (newSeeker: Omit<JobSeekerProfile, 'id'> | JobSeekerProfile) => Promise<JobSeekerProfile>;
  updateJobSeeker: (id: string, updates: Partial<JobSeekerProfile>) => Promise<void>;
  deleteJobSeeker: (id: string) => Promise<void>;
  toggleSaveJobSeeker: (id: string) => Promise<void>;
  
  localWorkers: LocalWorkerProfile[];
  addLocalWorker: (newWorker: Omit<LocalWorkerProfile, 'id'> | LocalWorkerProfile) => Promise<LocalWorkerProfile>;
  updateLocalWorker: (id: string, updates: Partial<LocalWorkerProfile>) => Promise<void>;
  deleteLocalWorker: (id: string) => Promise<void>;
  toggleSaveLocalWorker: (id: string) => Promise<void>;

  // Job Applications
  jobApplications: JobApplication[];
  applyForJob: (newApp: Omit<JobApplication, 'id'> | JobApplication) => Promise<JobApplication>;
  updateApplicationStatus: (id: string, status: JobApplicationStatus, notes?: string) => Promise<void>;
  withdrawApplication: (id: string) => Promise<void>;

  // Service Bookings
  serviceBookings: ServiceBooking[];
  createServiceBooking: (newBooking: Omit<ServiceBooking, 'id'> | ServiceBooking) => Promise<ServiceBooking>;
  updateServiceBookingStatus: (id: string, status: ServiceBookingStatus, notes?: string) => Promise<void>;
  cancelServiceBooking: (id: string, reason?: string) => Promise<void>;

  // Worker Reviews
  workerReviews: WorkerReview[];
  addWorkerReview: (newRev: Omit<WorkerReview, 'id'> | WorkerReview) => Promise<void>;

  // Reports & Moderation
  jobReports: JobReport[];
  reportListing: (report: Omit<JobReport, 'id'> | JobReport) => Promise<void>;

  // Chat
  chats: ChatConversation[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  sendChatMessage: (chatId: string, text: string, options?: { expiresDuration?: number | null; mediaUrl?: string; mediaType?: 'image' | 'video' | 'audio' | 'video_note' | 'sticker' | 'gif' | 'file'; poll?: any; isForwarded?: boolean }) => Promise<void>;
  startNewChatWith: (name: string, avatar: string, role: string, initialMessage?: string, autoFriend?: boolean) => string;
  createGroup: (groupData: { name: string; description: string; members: string[]; avatar: string }) => string;
  createChannel: (channelData: { name: string; handle: string; description: string; avatar: string; isPrivate: boolean; initialPost?: string }) => string;
  sendBroadcast: (recipientChatIds: string[], text: string) => Promise<void>;
  toggleFriendStatus: (chatId: string) => void;
  toggleBlockStatus: (chatId: string) => void;
  friendRequests: FriendRequest[];
  sendFriendRequest: (targetUserIdOrChatId: string, targetName?: string, targetAvatar?: string, role?: string) => Promise<void>;
  acceptFriendRequest: (requestIdOrChatId: string) => Promise<void>;
  declineFriendRequest: (requestIdOrChatId: string) => Promise<void>;
  cancelFriendRequest: (requestIdOrChatId: string) => Promise<void>;
  unfriendContact: (chatId: string) => Promise<void>;
  votePoll: (chatId: string, messageId: string, optionId: string) => void;
  toggleStarMessage: (chatId: string, messageId: string) => void;
  reactToMessage: (chatId: string, messageId: string, emoji: string) => void;
  togglePinChat: (chatId: string) => void;
  toggleMuteChat: (chatId: string) => void;
  setChatWallpaper: (chatId: string, wallpaper: string) => void;
  clearChatHistory: (chatId: string) => void;
  editChatMessage: (chatId: string, messageId: string, newText: string) => void;
  deleteChatMessage: (chatId: string, messageId: string, forEveryone: boolean) => void;
  pinMessageToChat: (chatId: string, message: ChatMessage) => void;
  unpinMessageFromChat: (chatId: string, messageId: string) => void;
  
  // Discoverable Registered Users & Contacts Directory
  registeredUsers: UserProfile[];
  refreshRegisteredUsers: () => Promise<UserProfile[]>;
  
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

  const [activeMiniApp, setActiveMiniApp] = useState<MiniAppId>('chat');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [propertyRequirements, setPropertyRequirements] = useState<PropertyRequirement[]>([]);
  const [matrimonyProfiles, setMatrimonyProfiles] = useState<MatrimonyProfile[]>([]);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [jobVacancies, setJobVacancies] = useState<JobVacancy[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [jobSeekers, setJobSeekers] = useState<JobSeekerProfile[]>([]);
  const [localWorkers, setLocalWorkers] = useState<LocalWorkerProfile[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [workerReviews, setWorkerReviews] = useState<WorkerReview[]>([]);
  const [jobReports, setJobReports] = useState<JobReport[]>([]);
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stories] = useState<SocialStory[]>([]);
  const [chats, setChats] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('omnilife_chats');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    return getLocalFriendRequests();
  });

  useEffect(() => {
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem('omnilife_chats', JSON.stringify(chats));
  }, [chats]);

  const refreshRegisteredUsers = async (): Promise<UserProfile[]> => {
    try {
      const usersList = await getCloudRegisteredUsers();
      setRegisteredUsers(usersList);
      return usersList;
    } catch (err) {
      console.warn('Failed to fetch registered users:', err);
      return [];
    }
  };

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

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Authoritative Startup Session & Device Lock Verification
  useEffect(() => {
    async function initAuthSession() {
      if (supabase) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userData.user.id)
                .single();

              const verifiedUser: UserProfile = {
                id: userData.user.id,
                name: profile?.name || userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
                email: userData.user.email || '',
                handle: profile?.handle || userData.user.user_metadata?.handle || `@${userData.user.email?.split('@')[0]}`,
                avatar: getSafeAvatarUrl(profile?.avatar_url || userData.user.user_metadata?.avatar, profile?.name || userData.user.user_metadata?.name || userData.user.email?.split('@')[0]),
                zodiacSign: profile?.zodiac_sign || userData.user.user_metadata?.zodiacSign || 'Leo',
                bio: profile?.bio || userData.user.user_metadata?.bio || 'Aditi Verified Member 🚀',
                location: profile?.location || userData.user.user_metadata?.location || 'Kozhikode, Kerala, India',
                isVerified: true
              };

              setUser(verifiedUser);
              const sessionUserObj: DeviceSessionUser = {
                id: verifiedUser.id,
                name: verifiedUser.name,
                email: verifiedUser.email,
                avatar: verifiedUser.avatar,
                handle: verifiedUser.handle
              };
              setSessionUser(sessionUserObj);

              if (isDeviceLockEnabled()) {
                setIsDeviceLocked(true);
                setIsAuthenticated(false);
              } else {
                setIsDeviceLocked(false);
                setIsAuthenticated(true);
              }
              return;
            }
          } else {
            // No valid remote session exists -> clear local session state
            clearActiveSession();
            setSessionUser(null);
            setIsAuthenticated(false);
            setIsDeviceLocked(false);
          }
        } catch (err) {
          console.warn('Supabase startup session verification error:', err);
        }
      } else {
        // Fallback for local development without Supabase credentials
        const savedSession = getStoredActiveSession();
        if (savedSession && isDeviceLockEnabled()) {
          setSessionUser(savedSession);
          setIsDeviceLocked(true);
          setIsAuthenticated(false);
        }
      }
    }

    initAuthSession();
  }, []);

  // Initial Load from Cloud Database API
  useEffect(() => {
    async function loadCloudData() {
      try {
        const [u, p, reqs, m, t, b, pos, ch, tsk, h, regUsers, sources, jv, js, lw, apps, sbs, wrs, rps] = await Promise.all([
          getCloudUserProfile(),
          getCloudProperties(),
          getCloudPropertyRequirements(),
          getCloudMatrimonyProfiles(),
          getCloudTutors(),
          getCloudBookings(),
          getCloudPosts(),
          getCloudChats(),
          getCloudTasks(),
          getCloudHabits(),
          getCloudRegisteredUsers(),
          getCloudJobSources(),
          getCloudJobVacancies(),
          getCloudJobSeekers(),
          getCloudLocalWorkers(),
          getCloudJobApplications(),
          getCloudServiceBookings(),
          getCloudWorkerReviews(),
          getCloudReports()
        ]);
        if (u && u.email) setUser(u);
        if (p && p.length > 0) setProperties(p);
        if (reqs && reqs.length > 0) setPropertyRequirements(reqs);
        if (m && m.length > 0) setMatrimonyProfiles(m);
        if (t && t.length > 0) setTutors(t);
        if (b && b.length > 0) setBookings(b);
        if (pos && pos.length > 0) setPosts(pos);
        if (ch && ch.length > 0) setChats(ch);
        if (tsk && tsk.length > 0) setTasks(tsk);
        if (h && h.length > 0) setHabits(h);
        if (regUsers && regUsers.length > 0) setRegisteredUsers(regUsers);
        if (sources && sources.length > 0) setJobSources(sources);
        if (jv) setJobVacancies(jv);
        if (js) setJobSeekers(js);
        if (lw) setLocalWorkers(lw);
        if (apps) setJobApplications(apps);
        if (sbs) setServiceBookings(sbs);
        if (wrs) setWorkerReviews(wrs);
        if (rps) setJobReports(rps);
      } catch (e) {
        console.warn('Cloud database sync initialized with remote state');
      }
    }
    loadCloudData();

    // Multi-device runtime realtime sync subscription
    const unsubscribeJobRealtime = subscribeToJobPortalRealtime(async () => {
      try {
        const [sources, jv, js, lw, apps, sbs, wrs] = await Promise.all([
          getCloudJobSources(),
          getCloudJobVacancies(),
          getCloudJobSeekers(),
          getCloudLocalWorkers(),
          getCloudJobApplications(),
          getCloudServiceBookings(),
          getCloudWorkerReviews()
        ]);
        if (sources && sources.length > 0) setJobSources(sources);
        if (jv) setJobVacancies(jv);
        if (js) setJobSeekers(js);
        if (lw) setLocalWorkers(lw);
        if (apps) setJobApplications(apps);
        if (sbs) setServiceBookings(sbs);
        if (wrs) setWorkerReviews(wrs);
      } catch (err) {
        console.warn('Realtime sync payload refresh error:', err);
      }
    });

    return () => {
      unsubscribeJobRealtime();
    };
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
      setActiveMiniApp('chat');
      refreshRegisteredUsers();
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
      setActiveMiniApp('chat');
      refreshRegisteredUsers();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      showToast(`🎉 Registration complete! Welcome to Aditi, ${res.user.name}!`);
      return { success: true };
    } catch (err: any) {
      showToast('⚠️ Registration error. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const loginWithGoogle = async (googleUser?: { name: string; email: string; avatar?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await cloudGoogleAuthUser(googleUser);
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
      setActiveMiniApp('chat');
      refreshRegisteredUsers();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      showToast(`🎉 Welcome to Aditi, ${res.user.name}! Signed in via Google.`);
      return { success: true };
    } catch (err: any) {
      showToast('⚠️ Google Sign-In error. Please try again.');
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

  const addProperty = async (newProperty: Omit<RealEstateProperty, 'id' | 'isSaved'> | RealEstateProperty): Promise<RealEstateProperty> => {
    const propertyId = ('id' in newProperty && newProperty.id) ? newProperty.id : `prop-${Date.now()}`;
    const fullProp: RealEstateProperty = {
      ...newProperty,
      id: propertyId,
      isSaved: false
    };
    const updated = await createCloudProperty(fullProp);
    setProperties(updated);
    confetti({ particleCount: 70, spread: 70 });
    showToast(`🏡 Property "${fullProp.title}" listed successfully!`);
    return fullProp;
  };

  const deleteProperty = async (id: string) => {
    const updated = await deleteCloudProperty(id);
    setProperties(updated);
    showToast('🗑️ Property listing removed.');
  };

  // Buyer & Tenant Requirements (Property Wanted)
  const toggleSavePropertyRequirement = async (id: string) => {
    const updated = await toggleCloudSaveRequirement(id);
    setPropertyRequirements(updated);
    showToast('Requirement bookmark updated!');
  };

  const addPropertyRequirement = async (newReq: Omit<PropertyRequirement, 'id'> | PropertyRequirement): Promise<PropertyRequirement> => {
    const reqId = ('id' in newReq && newReq.id) ? newReq.id : `req-${Date.now()}`;
    const fullReq: PropertyRequirement = {
      ...newReq,
      id: reqId,
      createdAt: newReq.createdAt || 'Just now',
      isSaved: false
    };
    const updated = await createCloudPropertyRequirement(fullReq);
    setPropertyRequirements(updated);
    confetti({ particleCount: 70, spread: 70 });
    showToast(`📋 Your property requirement "${fullReq.title}" posted successfully!`);
    return fullReq;
  };

  const deletePropertyRequirement = async (id: string) => {
    const updated = await deleteCloudPropertyRequirement(id);
    setPropertyRequirements(updated);
    showToast('🗑️ Property requirement removed.');
  };

  // Matrimony
  const addMatrimonyProfile = async (newProfile: Omit<MatrimonyProfile, 'id'> | MatrimonyProfile): Promise<MatrimonyProfile> => {
    const profileId = ('id' in newProfile && newProfile.id) ? newProfile.id : `mat-${Date.now()}`;
    const fullProfile: MatrimonyProfile = {
      ...newProfile,
      id: profileId,
      compatibilityScore: newProfile.compatibilityScore || 92,
      interestSent: false,
      isShortlisted: false,
      createdAt: newProfile.createdAt || 'Just now',
      isVerified: true
    };
    const updated = await createCloudMatrimonyProfile(fullProfile);
    setMatrimonyProfiles(updated);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    showToast(`👰 Matrimony profile for "${fullProfile.name}" registered successfully!`);
    return fullProfile;
  };

  const deleteMatrimonyProfile = async (id: string) => {
    const updated = await deleteCloudMatrimonyProfile(id);
    setMatrimonyProfiles(updated);
    showToast('🗑️ Matrimony profile removed.');
  };

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

  // Job Portal Actions
  const addJobVacancy = async (newJob: Omit<JobVacancy, 'id'> | JobVacancy): Promise<JobVacancy> => {
    const jobId = ('id' in newJob && newJob.id) ? newJob.id : `job-${Date.now()}`;
    const fullJob: JobVacancy = {
      ...newJob,
      id: jobId,
      createdAt: newJob.createdAt || 'Just now',
      isSaved: false
    };
    const updated = await createCloudJobVacancy(fullJob);
    setJobVacancies(updated);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    showToast(`💼 Vacancy "${fullJob.title}" published successfully!`);
    return fullJob;
  };

  const deleteJobVacancy = async (id: string) => {
    const updated = await deleteCloudJobVacancy(id);
    setJobVacancies(updated);
    showToast('🗑️ Job vacancy removed.');
  };

  const clearAllJobVacancies = async () => {
    const updated = await clearAllCloudJobVacancies();
    setJobVacancies(updated);
    showToast('🗑️ All job vacancies deleted.');
  };

  const toggleSaveJob = async (id: string) => {
    const updated = await toggleCloudSaveJob(id);
    setJobVacancies(updated);
    showToast('Bookmark updated!');
  };

  const toggleJobSource = async (id: string, isActive: boolean) => {
    const updated = await updateCloudJobSource(id, isActive);
    setJobSources(updated);
    showToast(`Data source status updated.`);
  };

  const syncJobSources = async (targetSourceId?: string) => {
    showToast('🔄 Synchronizing Pan-India Job Data Sources...');
    const result = await syncAllCloudJobSources(targetSourceId);
    setJobSources(result.sources);
    setJobVacancies(result.vacancies);
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });
    showToast(`✅ Synced ${result.stats.totalImported} listings (${result.stats.mergedDuplicates} duplicates merged). Active: ${result.stats.activeCount} jobs`);
    return result.stats;
  };

  const addJobSeeker = async (newSeeker: Omit<JobSeekerProfile, 'id'> | JobSeekerProfile): Promise<JobSeekerProfile> => {
    const seekerId = ('id' in newSeeker && newSeeker.id) ? newSeeker.id : `seeker-${Date.now()}`;
    const fullSeeker: JobSeekerProfile = {
      ...newSeeker,
      id: seekerId,
      createdAt: newSeeker.createdAt || 'Just now',
      isSaved: false
    };
    const updated = await createCloudJobSeeker(fullSeeker);
    setJobSeekers(updated);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    showToast(`🎯 Profile for "${fullSeeker.fullName}" posted to talent pool!`);
    return fullSeeker;
  };

  const deleteJobSeeker = async (id: string) => {
    const updated = await deleteCloudJobSeeker(id);
    setJobSeekers(updated);
    showToast('🗑️ Candidate profile removed.');
  };

  const toggleSaveJobSeeker = async (id: string) => {
    const updated = await toggleCloudSaveJobSeeker(id);
    setJobSeekers(updated);
    showToast('Candidate bookmark updated!');
  };

  const addLocalWorker = async (newWorker: Omit<LocalWorkerProfile, 'id'> | LocalWorkerProfile): Promise<LocalWorkerProfile> => {
    const workerId = ('id' in newWorker && newWorker.id) ? newWorker.id : `worker-${Date.now()}`;
    const fullWorker: LocalWorkerProfile = {
      ...newWorker,
      id: workerId,
      rating: newWorker.rating || 5.0,
      reviewCount: newWorker.reviewCount || 1,
      completedJobsCount: newWorker.completedJobsCount || 1,
      createdAt: newWorker.createdAt || 'Just now',
      isSaved: false
    };
    const updated = await createCloudLocalWorker(fullWorker);
    setLocalWorkers(updated);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    showToast(`🛠️ Service listing for "${fullWorker.name} (${fullWorker.trade})" published!`);
    return fullWorker;
  };

  const deleteLocalWorker = async (id: string) => {
    const updated = await deleteCloudLocalWorker(id);
    setLocalWorkers(updated);
    showToast('🗑️ Service listing removed.');
  };

  const toggleSaveLocalWorker = async (id: string) => {
    const updated = await toggleCloudSaveLocalWorker(id);
    setLocalWorkers(updated);
    showToast('Service partner bookmark updated!');
  };

  const updateJobVacancy = async (id: string, updates: Partial<JobVacancy>) => {
    const updated = await updateCloudJobVacancy(id, updates);
    setJobVacancies(updated);
    showToast('Job vacancy updated.');
  };

  const updateJobSeeker = async (id: string, updates: Partial<JobSeekerProfile>) => {
    const updated = await updateCloudJobSeeker(id, updates);
    setJobSeekers(updated);
    showToast('Candidate profile updated.');
  };

  const updateLocalWorker = async (id: string, updates: Partial<LocalWorkerProfile>) => {
    const updated = await updateCloudLocalWorker(id, updates);
    setLocalWorkers(updated);
    showToast('Worker profile updated.');
  };

  // Job Applications
  const applyForJob = async (newApp: Omit<JobApplication, 'id'> | JobApplication): Promise<JobApplication> => {
    const appId = ('id' in newApp && newApp.id) ? newApp.id : `app-${Date.now()}`;
    const fullApp: JobApplication = {
      ...newApp,
      id: appId,
      appliedAt: newApp.appliedAt || 'Just now',
      status: 'Applied'
    };
    const updated = await createCloudJobApplication(fullApp);
    setJobApplications(updated);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    showToast(`🎉 Application submitted for "${fullApp.jobTitle}"!`);
    return fullApp;
  };

  const updateApplicationStatus = async (id: string, status: JobApplicationStatus, notes?: string) => {
    const updated = await updateCloudJobApplicationStatus(id, status, notes);
    setJobApplications(updated);
    showToast(`Application status moved to "${status}".`);
  };

  const withdrawApplication = async (id: string) => {
    const updated = await withdrawCloudJobApplication(id);
    setJobApplications(updated);
    showToast('Application withdrawn.');
  };

  // Service Bookings
  const createServiceBooking = async (newBooking: Omit<ServiceBooking, 'id'> | ServiceBooking): Promise<ServiceBooking> => {
    const bookingId = ('id' in newBooking && newBooking.id) ? newBooking.id : `booking-${Date.now()}`;
    const fullBooking: ServiceBooking = {
      ...newBooking,
      id: bookingId,
      status: 'Requested',
      createdAt: 'Just now'
    };
    const updated = await createCloudServiceBooking(fullBooking);
    setServiceBookings(updated);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    showToast(`🛠️ Service requested from ${fullBooking.workerName}! Worker will confirm shortly.`);
    return fullBooking;
  };

  const updateServiceBookingStatus = async (id: string, status: ServiceBookingStatus, notes?: string) => {
    const updated = await updateCloudServiceBookingStatus(id, status, notes);
    setServiceBookings(updated);
    showToast(`Booking updated to "${status}".`);
  };

  const cancelServiceBooking = async (id: string, reason?: string) => {
    const updated = await cancelCloudServiceBooking(id, reason);
    setServiceBookings(updated);
    showToast('Booking cancelled.');
  };

  // Worker Reviews
  const addWorkerReview = async (newRev: Omit<WorkerReview, 'id'> | WorkerReview) => {
    const { reviews, updatedWorkerList } = await createCloudWorkerReview(newRev);
    setWorkerReviews(reviews);
    setLocalWorkers(updatedWorkerList);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    showToast('⭐ Thank you! Your review and rating have been posted.');
  };

  // Reports
  const reportListing = async (report: Omit<JobReport, 'id'> | JobReport) => {
    const updated = await createCloudReport(report);
    setJobReports(updated);
    showToast('🛡️ Thank you for your report. Our moderation team is reviewing this item.');
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

  // Real-time Supabase Database Message Replication Subscription
  useEffect(() => {
    if (supabase && user.id) {
      const channel = supabase
        .channel('public:messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload: any) => {
            const newMsg = payload.new;
            if (newMsg && newMsg.sender_id !== user.id) {
              setChats((prevChats) =>
                prevChats.map((chat) => {
                  if (chat.id === newMsg.conversation_id) {
                    const mapped: ChatMessage = {
                      id: newMsg.id,
                      senderId: newMsg.sender_id,
                      senderName: chat.participantName,
                      text: newMsg.text,
                      timestamp: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isUser: false,
                      mediaUrl: newMsg.media_url,
                      mediaType: newMsg.media_type,
                      isDisappearing: newMsg.is_disappearing,
                      expiresAt: newMsg.expires_at ? new Date(newMsg.expires_at).getTime() : undefined
                    };
                    return {
                      ...chat,
                      lastMessage: mapped.text,
                      lastMessageTime: 'Just now',
                      unreadCount: chat.unreadCount + 1,
                      messages: [...chat.messages, mapped]
                    };
                  }
                  return chat;
                })
              );
            }
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [user.id]);

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
      id: crypto.randomUUID(),
      senderId: user.id || 'user',
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

    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: userMsg.text,
              lastMessageTime: 'Just now',
              messages: [...c.messages, userMsg]
            }
          : c
      )
    );

    // Persist to server backend
    await sendCloudMessage(chatId, userMsg.text, {
      mediaUrl: options?.mediaUrl,
      mediaType: options?.mediaType,
      expiresDuration: options?.expiresDuration
    });
  };

  const startNewChatWith = (name: string, avatar: string, role: string, initialMessage?: string, autoFriend = false): string => {
    const existing = chats.find((c) => c.participantName.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (autoFriend && !existing.isFriend) {
        setChats((prev) => prev.map((c) => (c.id === existing.id ? { ...c, isFriend: true, friendshipStatus: 'friends' } : c)));
        addCloudFriend(existing.id);
      }
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
      isFriend: autoFriend,
      friendshipStatus: autoFriend ? 'friends' : 'none',
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
    if (autoFriend) {
      addCloudFriend(newChatId);
    }
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

  const createGroup = (groupData: {
    name: string;
    description: string;
    members: string[];
    avatar: string;
  }): string => {
    const newGroupId = `group-${Date.now()}`;
    const newGroup: ChatConversation = {
      id: newGroupId,
      participantName: groupData.name,
      participantAvatar: groupData.avatar,
      roleOrContext: `👥 Group • ${groupData.members.length + 1} members`,
      lastMessage: `Group created: "${groupData.name}"`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      isOnline: true,
      conversationType: 'group',
      description: groupData.description,
      isFriend: true,
      friendshipStatus: 'friends',
      messages: [
        {
          id: `m-${Date.now()}`,
          senderId: 'user',
          senderName: user.name,
          text: `🎉 Created group "${groupData.name}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: true
        }
      ]
    };

    setChats((prev) => [newGroup, ...prev]);
    createCloudConversation({
      name: groupData.name,
      type: 'group',
      memberIds: groupData.members
    });
    setActiveChatId(newGroupId);
    setActiveMiniApp('chat');
    return newGroupId;
  };

  const sendBroadcast = async (recipientChatIds: string[], text: string) => {
    if (!text.trim() || recipientChatIds.length === 0) return;

    for (const chatId of recipientChatIds) {
      const broadcastMsg: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: user.id || 'user',
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

  const sendFriendRequest = async (targetUserIdOrChatId: string, targetName?: string, targetAvatar?: string, role?: string) => {
    const targetChat = chats.find(
      (c) => c.id === targetUserIdOrChatId || (targetName && c.participantName.toLowerCase() === targetName.toLowerCase())
    );
    const resolvedName = targetName || targetChat?.participantName || 'Contact';
    const resolvedAvatar = targetAvatar || targetChat?.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
    const resolvedRole = role || targetChat?.roleOrContext || 'Aditi Contact';
    const targetId = targetChat?.id || targetUserIdOrChatId;

    const newReqId = `freq-${Date.now()}`;
    const newRequest: FriendRequest = {
      id: newReqId,
      fromUserId: user.id || 'user',
      fromUserName: user.name,
      fromUserAvatar: user.avatar,
      fromUserRole: user.bio || 'Aditi Member',
      toUserId: targetId,
      toUserName: resolvedName,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now()
    };

    setFriendRequests((prev) => [
      ...prev.filter((r) => !(r.toUserId === targetId && r.fromUserId === (user.id || 'user'))),
      newRequest
    ]);
    await sendCloudFriendRequest(newRequest);

    if (targetChat) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetChat.id
            ? {
                ...c,
                isFriend: false,
                friendRequestSent: true,
                friendRequestReceived: false,
                friendshipStatus: 'request_sent'
              }
            : c
        )
      );
    } else {
      const newChatId = targetUserIdOrChatId.startsWith('chat-') ? targetUserIdOrChatId : `chat-${Date.now()}`;
      const newChat: ChatConversation = {
        id: newChatId,
        participantName: resolvedName,
        participantAvatar: resolvedAvatar,
        roleOrContext: resolvedRole,
        lastMessage: 'Friend request sent 📩',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        isOnline: true,
        isFriend: false,
        friendRequestSent: true,
        friendRequestReceived: false,
        friendshipStatus: 'request_sent',
        messages: [
          {
            id: `m-${Date.now()}`,
            senderId: 'user',
            senderName: user.name,
            text: `📩 Sent friend request to ${resolvedName}. Unlimited messaging will unlock once they accept!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: true
          }
        ]
      };
      setChats((prev) => [newChat, ...prev]);
    }

    showToast(`📩 Friend request sent to ${resolvedName}! Awaiting acceptance.`);
  };

  const acceptFriendRequest = async (requestIdOrChatId: string) => {
    const req = friendRequests.find(
      (r) => r.id === requestIdOrChatId || r.fromUserId === requestIdOrChatId || r.toUserId === requestIdOrChatId
    );

    const fromName = req ? req.fromUserName : (chats.find((c) => c.id === requestIdOrChatId)?.participantName || 'Contact');
    const fromId = req ? req.fromUserId : requestIdOrChatId;
    const toId = req ? req.toUserId : (user.id || 'user');

    setFriendRequests((prev) =>
      prev.map((r) =>
        r.id === req?.id || r.fromUserId === fromId
          ? { ...r, status: 'accepted' }
          : r
      )
    );

    if (req) {
      await acceptCloudFriendRequest(req.id, fromId, toId);
    } else {
      await addCloudFriend(fromId);
    }

    setChats((prev) =>
      prev.map((c) => {
        const matches =
          c.id === requestIdOrChatId ||
          c.participantName.toLowerCase() === fromName.toLowerCase() ||
          (req && (c.id === req.fromUserId || c.id === req.toUserId));

        if (matches) {
          const sysMsg: ChatMessage = {
            id: `m-accept-${Date.now()}`,
            senderId: 'system',
            senderName: 'System',
            text: `🎉 You and ${c.participantName} are now friends! Unlimited messaging unlocked.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: false
          };
          return {
            ...c,
            isFriend: true,
            friendRequestSent: false,
            friendRequestReceived: false,
            friendshipStatus: 'friends',
            messages: [...c.messages, sysMsg]
          };
        }
        return c;
      })
    );

    confetti({ particleCount: 80, spread: 80 });
    showToast(`🎉 You accepted ${fromName}'s friend request! You are now friends.`);
  };

  const declineFriendRequest = async (requestIdOrChatId: string) => {
    const req = friendRequests.find(
      (r) => r.id === requestIdOrChatId || r.fromUserId === requestIdOrChatId || r.toUserId === requestIdOrChatId
    );
    const targetName = req ? req.fromUserName : (chats.find((c) => c.id === requestIdOrChatId)?.participantName || 'Contact');

    setFriendRequests((prev) => prev.filter((r) => r.id !== req?.id && r.fromUserId !== requestIdOrChatId));
    if (req) {
      await declineCloudFriendRequest(req.id, req.fromUserId, req.toUserId);
    }

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === requestIdOrChatId || c.participantName.toLowerCase() === targetName.toLowerCase()) {
          return {
            ...c,
            isFriend: false,
            friendRequestReceived: false,
            friendRequestSent: false,
            friendshipStatus: 'none'
          };
        }
        return c;
      })
    );

    showToast(`Declined friend request from ${targetName}.`);
  };

  const cancelFriendRequest = async (requestIdOrChatId: string) => {
    const req = friendRequests.find(
      (r) => r.id === requestIdOrChatId || r.toUserId === requestIdOrChatId || r.fromUserId === requestIdOrChatId
    );
    const targetName = req ? req.toUserName : (chats.find((c) => c.id === requestIdOrChatId)?.participantName || 'Contact');

    setFriendRequests((prev) => prev.filter((r) => r.id !== req?.id && r.toUserId !== requestIdOrChatId));
    if (req) {
      await cancelCloudFriendRequest(req.fromUserId, req.toUserId);
    }

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === requestIdOrChatId || c.participantName.toLowerCase() === targetName.toLowerCase()) {
          return {
            ...c,
            isFriend: false,
            friendRequestSent: false,
            friendRequestReceived: false,
            friendshipStatus: 'none'
          };
        }
        return c;
      })
    );

    showToast(`Cancelled friend request to ${targetName}.`);
  };

  const unfriendContact = async (chatId: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    const name = targetChat?.participantName || 'Contact';

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              isFriend: false,
              friendRequestSent: false,
              friendRequestReceived: false,
              friendshipStatus: 'none'
            }
          : c
      )
    );

    setFriendRequests((prev) => prev.filter((r) => r.fromUserId !== chatId && r.toUserId !== chatId));
    await removeCloudFriend(chatId);
    showToast(`Removed ${name} from friends list.`);
  };

  const toggleFriendStatus = async (chatId: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    if (targetChat?.isFriend) {
      await unfriendContact(chatId);
    } else if (targetChat?.friendRequestReceived) {
      await acceptFriendRequest(chatId);
    } else if (targetChat?.friendRequestSent) {
      await cancelFriendRequest(chatId);
    } else {
      await sendFriendRequest(chatId);
    }
  };

  const toggleBlockStatus = async (chatId: string) => {
    const targetChat = chats.find(c => c.id === chatId);
    const willBeBlocked = targetChat ? !targetChat.isBlocked : true;

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          if (willBeBlocked) {
            showToast(`🚫 Blocked ${c.participantName}.`);
          } else {
            showToast(`🔓 Unblocked ${c.participantName}.`);
          }
          return { ...c, isBlocked: willBeBlocked };
        }
        return c;
      })
    );

    if (willBeBlocked) {
      await blockCloudUser(chatId);
    } else {
      await unblockCloudUser(chatId);
    }
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

  const editChatMessage = (chatId: string, messageId: string, newText: string) => {
    if (!newText.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updatedMessages = c.messages.map((m) => {
            if (m.id === messageId || m.clientMessageId === messageId) {
              return {
                ...m,
                text: newText.trim(),
                editedAt: timeStr,
                editCount: (m.editCount || 0) + 1
              };
            }
            return m;
          });
          const last = updatedMessages[updatedMessages.length - 1];
          return {
            ...c,
            lastMessage: last ? last.text : c.lastMessage,
            messages: updatedMessages
          };
        }
        return c;
      })
    );
    showToast('✏️ Message edited successfully!');
  };

  const deleteChatMessage = (chatId: string, messageId: string, forEveryone: boolean) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          let updatedMessages: ChatMessage[];
          if (forEveryone) {
            updatedMessages = c.messages.map((m) => {
              if (m.id === messageId || m.clientMessageId === messageId) {
                return {
                  ...m,
                  text: '🚫 This message was deleted',
                  isDeleted: true,
                  deletedForEveryone: true,
                  deletedAt: timeStr,
                  mediaUrl: undefined,
                  mediaType: undefined,
                  poll: undefined
                };
              }
              return m;
            });
          } else {
            updatedMessages = c.messages.filter((m) => m.id !== messageId && m.clientMessageId !== messageId);
          }

          const last = updatedMessages[updatedMessages.length - 1];
          return {
            ...c,
            lastMessage: last ? last.text : 'No messages',
            messages: updatedMessages
          };
        }
        return c;
      })
    );
    showToast(forEveryone ? '🗑️ Message deleted for everyone.' : '🗑️ Message deleted for you.');
  };

  const pinMessageToChat = (chatId: string, message: ChatMessage) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const currentPins = c.pinnedMessages || [];
          if (currentPins.some((p) => p.messageId === message.id)) return c;
          const newPin = {
            messageId: message.id,
            text: message.text || `[${message.mediaType?.toUpperCase() || 'Attachment'}]`,
            senderName: message.senderName,
            pinnedBy: user.name,
            pinnedAt: timeStr
          };
          return {
            ...c,
            isPinned: true,
            pinnedMessages: [newPin, ...currentPins]
          };
        }
        return c;
      })
    );
    showToast(`📌 Message pinned to ${chatId}!`);
  };

  const unpinMessageFromChat = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const remaining = (c.pinnedMessages || []).filter((p) => p.messageId !== messageId);
          return {
            ...c,
            pinnedMessages: remaining
          };
        }
        return c;
      })
    );
    showToast('📌 Message unpinned.');
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
    setProperties([]);
    setMatrimonyProfiles([]);
    setTutors([]);
    setPosts([]);
    setChats([]);
    setTasks([]);
    setHabits([]);
    setAlerts([]);
    setUser(INITIAL_USER);
    setActiveChatId('');
    showToast('♻️ Cloud state reset to a clean production state.');
  };

  return (
    <SuperAppContext.Provider
      value={{
        isAuthenticated,
        isDeviceLocked,
        sessionUser,
        unlockDevice,
        login,
        loginWithGoogle,
        register,
        logout,
        activeMiniApp,
        setActiveMiniApp,
        user,
        updateUser,
        properties,
        toggleSaveProperty,
        addProperty,
        deleteProperty,
        propertyRequirements,
        addPropertyRequirement,
        deletePropertyRequirement,
        toggleSavePropertyRequirement,
        matrimonyProfiles,
        addMatrimonyProfile,
        deleteMatrimonyProfile,
        sendInterest,
        toggleShortlistMatrimony,
        tutors,
        bookings,
        bookTutorSession,
        jobVacancies,
        jobSources,
        toggleJobSource,
        syncJobSources,
        addJobVacancy,
        updateJobVacancy,
        deleteJobVacancy,
        clearAllJobVacancies,
        toggleSaveJob,
        jobSeekers,
        addJobSeeker,
        updateJobSeeker,
        deleteJobSeeker,
        toggleSaveJobSeeker,
        localWorkers,
        addLocalWorker,
        updateLocalWorker,
        deleteLocalWorker,
        toggleSaveLocalWorker,
        jobApplications,
        applyForJob,
        updateApplicationStatus,
        withdrawApplication,
        serviceBookings,
        createServiceBooking,
        updateServiceBookingStatus,
        cancelServiceBooking,
        workerReviews,
        addWorkerReview,
        jobReports,
        reportListing,
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
        editChatMessage,
        deleteChatMessage,
        pinMessageToChat,
        unpinMessageFromChat,
        registeredUsers,
        refreshRegisteredUsers,
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
