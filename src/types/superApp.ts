export type MiniAppId = 
  | 'home'
  | 'brain'
  | 'media_studio'
  | 'social'
  | 'astrology'
  | 'realestate'
  | 'matrimony'
  | 'tutor'
  | 'chat'
  | 'productivity'
  | 'utilities'
  | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  email: string;
  phone?: string;
  zodiacSign: string;
  bio: string;
  location: string;
  isVerified: boolean;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Other' | 'Prefer not to say';
  createdAt?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  handle?: string;
  zodiacSign?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Other' | 'Prefer not to say';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/* ==================== REAL ESTATE ==================== */
export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Studio' | 'Commercial' | 'Plot / Land' | 'Independent House' | 'Office Space' | 'Warehouse';
export type ListingType = 'Buy' | 'Rent';

export interface RealEstateProperty {
  id: string;
  title: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  priceFormatted: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  location: string;
  city: string;
  images: string[];
  features: string[];
  description: string;
  agent: {
    name: string;
    phone: string;
    avatar: string;
    rating: number;
  };
  isFeatured?: boolean;
  isSaved?: boolean;
  postedByUserId?: string;
  createdAt?: string;
}

export type PropertyRequirementType = 'Buy' | 'Rent';
export type PropertyNeedCategory = 'Apartment' | 'Villa' | 'Independent House' | 'Commercial' | 'Plot / Land' | 'Studio / 1RK' | 'Office Space' | 'Warehouse';
export type FurnishingPreference = 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Any';
export type PossessionTimeline = 'Immediate' | 'Within 1 Month' | 'Within 3 Months' | 'Flexible';

export interface PropertyRequirement {
  id: string;
  title: string;
  requirementType: PropertyRequirementType; // 'Buy' | 'Rent'
  propertyCategory: PropertyNeedCategory;
  preferredLocations: string[]; // e.g. ["Kozhikode Beach", "Mavoor Road"]
  city: string;
  minBudget: number;
  maxBudget: number;
  budgetFormatted: string; // e.g. "₹35 Lakhs - ₹60 Lakhs" or "₹15,000 - ₹25,000 / mo"
  bedrooms?: number | 'Any';
  bathrooms?: number | 'Any';
  minAreaSqFt?: number;
  furnishing?: FurnishingPreference;
  timeline?: PossessionTimeline;
  specificNeeds: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  contactAvatar?: string;
  isVerifiedBuyer?: boolean;
  createdAt: string;
  postedByUserId?: string;
  isSaved?: boolean;
}

/* ==================== MATRIMONY ==================== */
export type MatrimonyPostedFor = 'Self' | 'Son' | 'Daughter' | 'Brother' | 'Sister' | 'Relative / Friend';
export type MatrimonyMaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';

export interface MatrimonyProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  height: string;
  profession: string;
  education: string;
  city: string;
  state: string;
  religion: string;
  community: string;
  motherTongue: string;
  zodiac: string;
  nakshatra?: string;
  photos: string[];
  about: string;
  partnerPreferences: string;
  annualIncome: string;
  isVerified: boolean;
  postedFor?: MatrimonyPostedFor;
  maritalStatus?: MatrimonyMaritalStatus;
  familyDetails?: string;
  diet?: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  contactPhone?: string;
  contactEmail?: string;
  compatibilityScore?: number;
  interestSent?: boolean;
  isShortlisted?: boolean;
  postedByUserId?: string;
  createdAt?: string;
}

/* ==================== TUTOR & ACADEMY ==================== */
export type TutorCategory = 'Coding & Tech' | 'Math & Science' | 'Languages' | 'Music & Arts' | 'Business & Finance';

export interface TutorProfile {
  id: string;
  name: string;
  avatar: string;
  category: TutorCategory;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  education: string;
  bio: string;
  availableDays: string[];
  timeSlots: string[];
  verifiedBadge: boolean;
  studentsTaught: number;
}

export interface TutorBooking {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  rate: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

/* ==================== AI MEDIA STUDIO ==================== */
export type ImageStylePreset = 'Cyberpunk' | 'Photorealistic' | 'Anime / Manga' | '3D Render' | 'Oil Painting' | 'Cinematic Film' | 'Digital Art';
export type AspectRatioType = '1:1' | '16:9' | '9:16' | '4:3';

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  style: ImageStylePreset;
  aspectRatio: AspectRatioType;
  createdAt: string;
  likes: number;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  videoUrl: string;
  motionStyle: 'Cinematic Pan' | 'Drone Shot' | 'Slow Motion' | 'Hyperlapse' | 'Orbit 360';
  duration: number; // in seconds
  createdAt: string;
}

export interface VideoEditorClip {
  id: string;
  type: 'video' | 'text' | 'audio' | 'filter';
  name: string;
  startTime: number;
  endTime: number;
  content?: string;
  filterName?: 'None' | 'Vintage' | 'Cyber' | 'Warm Glow' | 'Noir' | 'Vibrant';
}

/* ==================== ASTROLOGY & TAROT ==================== */
export interface ZodiacSignInfo {
  sign: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dateRange: string;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  dailyHoroscope: {
    general: string;
    love: string;
    career: string;
    wellness: string;
  };
}

export interface KundaliHouse {
  houseNumber: number;
  sign: string;
  planets: string[];
  significance: string;
}

export interface TarotCardData {
  id: string;
  name: string;
  arcana: 'Major' | 'Minor';
  suit?: string;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
  imageUrl: string;
}

/* ==================== SOCIAL FEED ==================== */
export interface SocialStory {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  mediaUrl: string;
  hasUnseen: boolean;
}

export interface SocialComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: SocialComment[];
  sharesCount: number;
  timestamp: string;
  tags?: string[];
}

/* ==================== CHAT & MESSENGER ==================== */
export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedUserIds?: string[];
}

export interface ChatPoll {
  id: string;
  question: string;
  options: PollOption[];
  isAnonymous?: boolean;
  allowsMultiple?: boolean;
  totalVotes: number;
}

export type MessageDeliveryStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type ChatFolderType = 'all' | 'friends' | 'unread' | 'personal' | 'groups' | 'channels' | 'favorites';

export interface ChatMessage {
  id: string;
  clientMessageId?: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  status?: MessageDeliveryStatus;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'video_note' | 'sticker' | 'gif' | 'file';
  expiresAt?: number; // timestamp in milliseconds when message will permanently self-destruct
  expiresDuration?: number; // duration in seconds (5, 30, 60, 3600, etc.)
  isDisappearing?: boolean;
  isStarred?: boolean;
  isForwarded?: boolean;
  editedAt?: string;
  editCount?: number;
  isDeleted?: boolean;
  deletedForEveryone?: boolean;
  deletedAt?: string;
  replyToId?: string;
  replySnapshot?: {
    text: string;
    senderName: string;
    mediaType?: string;
  };
  reactions?: Record<string, number>; // e.g. { '❤️': 2, '👍': 1, '🔥': 3 }
  userReaction?: string; // current user's reaction
  poll?: ChatPoll;
  audioDuration?: number;
  fileName?: string;
  fileSize?: string;
  voiceCloneAvailable?: boolean;
  voiceProfile?: Partial<UserVoiceProfile>;
  talkingPhotoUrl?: string;
  deliveryReceipts?: Array<{
    userId: string;
    userName: string;
    deliveredAt: string;
    readAt?: string;
  }>;
  mentions?: string[];
  contextualAttachment?: {
    type: 'property' | 'tutor' | 'ride' | 'payment';
    title: string;
    subtitle: string;
    price?: string;
    actionUrl?: string;
    data?: any;
  };
}

export interface UserVoiceProfile {
  id: string;
  isEnrolled: boolean;
  voiceName: string;
  pitch: number; // 0.5 to 2.0 (default 1.0)
  rate: number;  // 0.5 to 2.0 (default 1.0)
  timbre: 'warm' | 'deep' | 'crisp' | 'energetic' | 'calm';
  language: 'ml-IN' | 'en-IN' | 'hi-IN';
  sampleAudioUrl?: string;
  talkingPhotoUrl?: string;
  enrolledDate?: string;
}

export interface ScheduledMessage {
  id: string;
  chatId: string;
  text: string;
  scheduledTimestamp: number;
  scheduledTimeStr: string;
  targetContactName: string;
  targetContactAvatar: string;
  isSent: boolean;
  deliveryType?: 'message' | 'call';
  audioUrl?: string;
  audioDuration?: number;
}

export interface ChatReminder {
  id: string;
  chatId: string;
  messageId?: string;
  messageSnippet: string;
  remindAtTimestamp: number;
  remindAtStr: string;
  contactName: string;
  note?: string;
  isTriggered: boolean;
}

export interface PinnedMessageItem {
  messageId: string;
  text: string;
  senderName: string;
  pinnedBy: string;
  pinnedAt: string;
}

export interface GroupMemberItem {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  isOnline?: boolean;
}

export interface GroupPermissions {
  canSendMessages: boolean;
  canSendMedia: boolean;
  canPinMessages: boolean;
  canInviteMembers: boolean;
  canEditGroupInfo: boolean;
}

export interface ChatConversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  roleOrContext: string; // e.g., 'Real Estate Agent', 'Python Tutor', 'Matrimony Match', 'AI Brain'
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isOnline: boolean;
  lastSeen?: string;
  conversationType?: 'direct' | 'group' | 'channel' | 'broadcast';
  channelHandle?: string; // e.g., '@malabar_deals'
  subscriberCount?: number;
  isOwner?: boolean;
  description?: string;
  isFriend?: boolean;
  friendRequestSent?: boolean;
  friendRequestReceived?: boolean;
  friendshipStatus?: FriendshipStatus;
  isBlocked?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isFavorite?: boolean;
  isLocked?: boolean;
  customWallpaper?: string;
  pinnedMessages?: PinnedMessageItem[];
  members?: GroupMemberItem[];
  groupPermissions?: GroupPermissions;
  groupInviteToken?: string;
  groupInviteUrl?: string;
}

export type FriendshipStatus = 'none' | 'request_sent' | 'request_received' | 'friends';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserRole?: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
  createdAt: number;
}

/* ==================== DIGITAL WALLET ==================== */
export interface WalletTransaction {
  id: string;
  type: 'debit' | 'credit';
  title: string;
  category: 'Shopping' | 'Food' | 'Services' | 'Tutor' | 'Transfer' | 'Rent' | 'Bills';
  amount: number;
  recipientOrSender: string;
  timestamp: string;
  status: 'Completed' | 'Pending';
}

/* ==================== PRODUCTIVITY & LIFE OS ==================== */
export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  category: 'Work' | 'Personal' | 'Study' | 'Health';
}

export interface HabitItem {
  id: string;
  name: string;
  category: 'Health' | 'Mindset' | 'Productivity' | 'Fitness';
  streak: number;
  completedDays: boolean[]; // last 7 days
  color: string;
}

/* ==================== OMNIBRAIN AI CORE ==================== */
export interface BrainThoughtTrace {
  step: string;
  details: string;
  timestamp: string;
}

export interface BrainMessage {
  id: string;
  sender: 'user' | 'brain';
  text: string;
  timestamp: string;
  thoughtTraces?: BrainThoughtTrace[];
  actionDispatched?: {
    vertical: MiniAppId;
    actionSummary: string;
  };
  suggestedPrompts?: string[];
}

export interface ProactiveAlert {
  id: string;
  category: 'realestate' | 'matrimony' | 'tutor' | 'wallet' | 'astrology' | 'productivity';
  title: string;
  message: string;
  actionMiniApp: MiniAppId;
  timestamp: string;
  priority: 'info' | 'important' | 'warning';
}
