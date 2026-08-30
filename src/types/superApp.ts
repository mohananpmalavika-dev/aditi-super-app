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
  | 'jobs'
  | 'news'
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
  profileVersion?: number;
  consentVersion?: string;
  consentedAt?: string;
  status?: 'PENDING' | 'PROCESSING' | 'ACTIVE' | 'FAILED' | 'DISABLED' | 'DELETED';
}

export interface VoiceProfile {
  id: string;
  tenantId?: string;
  userId: string;
  displayName: string;
  provider: 'local_web_audio' | 'cloud_neural' | 'custom';
  status: 'PENDING' | 'PROCESSING' | 'ACTIVE' | 'FAILED' | 'DISABLED' | 'DELETED';
  profileVersion: number;
  isEnabled: boolean;
  languageHints: string[];
  pitch: number;
  rate: number;
  timbre: 'warm' | 'deep' | 'crisp' | 'energetic' | 'calm';
  consentVersion: string;
  consentedAt: string;
  sampleDurationSec: number;
  sampleAudioUrl?: string;
  talkingPhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceSafetyCheckResult {
  isAllowed: boolean;
  reason?: 'SENSITIVE_CONTENT_BLOCKED' | 'FINANCIAL_WARNING' | 'PROFILE_DISABLED' | 'CONSENT_MISSING' | 'USER_BLOCKED' | 'SENDER_DISALLOWED';
  warningMessage?: string;
  sanitizedSnippet?: string;
}

export interface VoiceSynthesisCacheItem {
  id: string;
  messageId: string;
  senderId: string;
  voiceProfileVersion: number;
  textHash: string;
  language: string;
  durationMs: number;
  audioUrl?: string;
  createdAt: number;
  expiresAt: number;
}

export interface IncomingLiveCall {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  isVideo: boolean;
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
  isPrivate?: boolean;
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
  fromUserAvatar?: string;
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

/* ==================== LEGAL INTELLIGENCE & CASE DOCKET ==================== */
export interface FIRSectionDetail {
  act: string;
  section: string;
  description: string;
  descriptionMalayalam?: string;
  bailable: boolean;
  cognizable: boolean;
  punishmentMaxYears: string;
}

export interface AccusedPerson {
  name: string;
  rank: number; // Accused No. 1 (A1), A2, etc.
  age?: number;
  role: string;
  bailStatus: 'Anticipatory Bail Granted' | 'Regular Bail Granted' | 'Remand / In Custody' | 'Notice Issued (Sec 41A CrPC)' | 'Discharged / Quashed' | 'Acquitted';
}

export interface CaseHistoryMilestone {
  stageNumber: number;
  stageName: 'FIR' | 'Investigation & 41A' | 'Bail / Remand' | 'Chargesheet (Sec 173)' | 'Cognizance & Summons' | 'Framing of Charges' | 'Evidence & Trial' | 'Section 482 HC Quash' | 'Final Judgment / Closure';
  stageNameMalayalam: string;
  title: string;
  titleMalayalam: string;
  date: string;
  courtOrAuthority: string;
  description: string;
  descriptionMalayalam: string;
  courtOrderExcerpt?: string;
  isCompleted: boolean;
  status: 'Completed' | 'Current Stage' | 'Upcoming';
}

export interface CourtCaseDocket {
  cnrNumber: string;
  courtName: string;
  courtNameMalayalam: string;
  caseType: string;
  caseNumber: string;
  filingDate: string;
  currentStage: string;
  currentStageMalayalam: string;
  nextHearingDate: string;
  purposeOfHearing: string;
  purposeOfHearingMalayalam: string;
  presidingJudge: string;
  courtRoomNumber: string;
  petitionerOrState: string;
  respondentOrAccused: string;
  caseStatus: 'Pending Trial' | 'Under Investigation' | 'Stayed by High Court' | 'Disposed / Acquitted' | 'Quashed under Sec 482 CrPC';
}

export interface MediaDiscrepancyReport {
  id: string;
  channelOrOutlet: string;
  outletLogo?: string;
  headline: string;
  headlineMalayalam?: string;
  publishedDate: string;
  mediaType: 'TV Channel Broadcast' | 'Online News Portal' | 'YouTube Video Report' | 'Print Newspaper';
  distortedClaims: string[];
  actualLegalFacts: string[];
  isDiscrepancy: boolean;
  libelSeverity: 'Severe / Actionable Defamation' | 'Sensationalized Distortion' | 'Fair & Factual';
  defamatoryQuotes: string[];
  impactOnAccused: string;
  suggestedAction: string;
}

export interface DefencePrecedent {
  citation: string;
  court: 'Supreme Court of India' | 'High Court of Kerala' | 'High Court of Delhi' | 'High Court of Bombay';
  title: string;
  year: number;
  ratioDecidendi: string;
  ratioDecidendiMalayalam: string;
  applicabilityToCase: string;
}

export interface FIRRecord {
  id: string;
  firNumber: string;
  crimeNumber: string;
  year: string;
  policeStation: string;
  policeStationMalayalam: string;
  district: string;
  districtMalayalam: string;
  state: string;
  dateOfRegistration: string;
  timeOfRegistration: string;
  complainantName: string;
  complainantAddress?: string;
  investigatingOfficer: string;
  investigatingOfficerRank: string;
  actsAndSections: FIRSectionDetail[];
  accusedList: AccusedPerson[];
  briefAllegation: string;
  briefAllegationMalayalam: string;
  firSummary: string;
  firSummaryMalayalam: string;
  courtDocket: CourtCaseDocket;
  timeline: CaseHistoryMilestone[];
  mediaReports: MediaDiscrepancyReport[];
  defencePrecedents: DefencePrecedent[];
  quashingGrounds: string[];
  quashingGroundsMalayalam: string[];
  evidenceChecklist: string[];
}

export interface LegalNoticeDraft {
  noticeDate: string;
  accusedName: string;
  accusedAddress: string;
  advocateName: string;
  advocateEnrollment: string;
  advocateOffice: string;
  targetMediaOutlets: string[];
  firNumber: string;
  claimedCompensationAmount: string;
  demandDeadlineDays: number;
  noticeTextEnglish: string;
  noticeTextMalayalam: string;
  criminalComplaintDraftEnglish: string;
  regulatoryComplaintNBDSA: string;
  quashingPetitionSec482Draft: string;
}

/* ==================== JOB PORTAL & LOCAL WORKERS ==================== */
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Urgent / Gig' | 'Internship' | 'Remote' | 'Freelance' | 'Temporary';

export type JobCategory = 
  | 'Technology & IT' 
  | 'Local Trades & Skilled Labor' 
  | 'Domestic & Housekeeping' 
  | 'Sales & Marketing' 
  | 'Healthcare & Nursing' 
  | 'Finance & Accounting' 
  | 'Education & Tutoring' 
  | 'Hospitality & Cooking' 
  | 'Logistics & Driving' 
  | 'Construction & Civil' 
  | 'Beauty & Wellness' 
  | 'Security & Facility' 
  | 'Other';

/* ==================== PAN-INDIA JOB AGGREGATION & MULTI-SOURCE TYPES ==================== */
export type JobSourceType = 
  | 'government'       // e.g. National Career Service (NCS), Employment News
  | 'state_portal'     // e.g. Kerala Niyukthi, Karnataka Kaushalkar, Mahaswayam
  | 'aggregator_api'   // e.g. Jooble, Adzuna
  | 'company_career'   // e.g. TCS, Infosys, Wipro, Accenture, HCLTech
  | 'ats'              // e.g. Greenhouse, Lever, Workday feeds
  | 'direct'           // Directly posted by recruiters on Aditi
  | 'aggregated';

export type JobApplyMode = 
  | 'in_app'              // 1-Click Apply within Aditi Super App
  | 'external_redirect'   // Canonical external redirect to official career portal / NCS
  | 'official_email';     // Direct email to corporate talent acquisition desk

export interface JobSourceAttribution {
  sourceId: string;
  sourceName: string;
  sourceType: JobSourceType;
  sourceUrl: string;
  externalJobId?: string;
  verified: boolean;
  discoveredAt: string;
}

export interface JobSource {
  id: string;
  name: string;
  type: JobSourceType;
  country: string;
  state?: string;
  baseUrl: string;
  apiUrl?: string;
  isActive: boolean;
  requiresApiKey: boolean;
  apiKeyEnvVar?: string;
  lastSyncAt?: string;
  nextSyncAt?: string;
  syncIntervalMinutes: number;
  totalImported: number;
  totalActive: number;
  statusMessage?: string;
}

export interface ImportedJob {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: JobSourceType;
  externalJobId?: string;
  externalUrl: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  isRemote?: boolean;
  workMode?: 'remote' | 'hybrid' | 'onsite';
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryText?: string;
  jobType?: JobType;
  category?: JobCategory;
  subcategory?: string;
  experience?: string;
  qualification?: string;
  skills?: string[];
  contactName?: string;
  contactEmail?: string;
  sourcePublishedAt?: string;
  importedAt: string;
  lastSeenAt: string;
  status: 'new' | 'active' | 'expired' | 'duplicate' | 'rejected';
  fingerprint: string;
}

export interface JobSyncConfig {
  pageSize: number;
  maxPagesPerRun: number;
  maxJobsPerRun: number;
  concurrency: number;
  staleAfterHours: number;
  expireAfterHours: number;
}

export interface JobSyncRun {
  id: string;
  sourceId: string;
  sourceName: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'partial' | 'failed';
  pagesScanned: number;
  jobsDiscovered: number;
  jobsInserted: number;
  jobsUpdated: number;
  jobsExpired: number;
  duplicates: number;
  errors: number;
  durationMs?: number;
  errorDetails?: string[];
}

export interface JobSearchParams {
  keywords?: string;
  state?: string;
  city?: string;
  district?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
  salaryMin?: number;
  workMode?: string;
  isRemote?: boolean;
}

export interface JobSourceResult {
  jobs: ImportedJob[];
  totalAvailable?: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  nextCursor?: string;
  totalPages?: number;
}

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  category: JobCategory;
  subcategory?: string;
  jobType: JobType;
  workMode?: 'remote' | 'hybrid' | 'onsite';
  location: string;
  city: string;
  district?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: 'hour' | 'day' | 'month' | 'year';
  salaryFormatted: string; // e.g. "₹25,000 - ₹40,000 / mo" or "₹800 / day"
  experienceRequired: string; // e.g. "1-3 Years", "Freshers Welcome", "5+ Years"
  qualificationRequired: string; // e.g. "B.Tech / BCA", "10th / 12th Pass", "ITI Certified", "None"
  description: string;
  responsibilities?: string[];
  skills: string[];
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAvatar?: string;
  openingsCount: number;
  isUrgent?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  applicationCount?: number;
  viewCount?: number;
  status?: 'active' | 'stale' | 'expired' | 'closed' | 'draft';
  isSaved?: boolean;
  postedByUserId?: string;
  createdAt?: string;
  updatedAt?: string;

  // Multi-source Pan-India Fields
  sourceType?: JobSourceType;
  primarySource?: string; // e.g. "National Career Service (NCS)" or "TCS Careers"
  sources?: JobSourceAttribution[];
  canonicalApplyUrl?: string;
  applyMode?: JobApplyMode;
  fingerprint?: string;
  lastSeenAt?: string;
  sourcePublishedAt?: string;
  sourceUpdatedAt?: string;
}

export interface JobSeekerProfile {
  id: string;
  fullName: string;
  desiredRole: string;
  category: JobCategory;
  jobTypePreference: JobType;
  qualification: string; // e.g. "B.Com, Tally Certified", "Diploma in Electrical", "10th Pass"
  specialization?: string;
  experienceYears: number;
  currentCompany?: string;
  experienceSummary: string; // Past projects, experience details
  expectedSalary: string; // e.g. "₹30,000 / month" or "₹850 / day"
  preferredLocation: string; // e.g. "Kozhikode, Kochi or Remote"
  city: string;
  skills: string[];
  languages?: string[];
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeHeadline: string;
  bio: string;
  phone: string;
  email?: string;
  avatar: string;
  availability: 'Immediate' | 'Within 15 Days' | 'Within 1 Month';
  isVerified?: boolean;
  isSaved?: boolean;
  postedByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WorkerTrade = 
  | 'Electrician' 
  | 'Plumber' 
  | 'Housemaid / Domestic Help' 
  | 'Driver (Car / Heavy)' 
  | 'Carpenter' 
  | 'Painter' 
  | 'Cook / Home Chef' 
  | 'Appliance & AC Technician' 
  | 'Mason / Construction' 
  | 'Gardener / Landscaping' 
  | 'Welder' 
  | 'Tailor / Stitching' 
  | 'Beautician & Hair Stylist' 
  | 'Cleaning Worker / Deep Cleaner' 
  | 'Security Guard' 
  | 'Delivery Worker' 
  | 'Mechanic / Auto Repair';

export interface LocalWorkerProfile {
  id: string;
  name: string;
  trade: WorkerTrade;
  subTrade?: string;
  experienceYears: number;
  dailyRateOrCharge: string; // e.g. "₹850 / day", "₹350 / visit"
  rateType?: 'hour' | 'visit' | 'day' | 'fixed' | 'negotiable';
  serviceAreas: string[]; // e.g. ["Mavoor Road", "Palayam", "Calicut Beach", "Feroke"]
  city: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  serviceRadiusKm?: number;
  rating: number; // e.g. 4.9
  reviewCount: number;
  isAvailableToday: boolean;
  verifiedBadge?: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  skills: string[];
  bio: string;
  phone: string;
  whatsapp?: string;
  avatar: string;
  completedJobsCount: number;
  isSaved?: boolean;
  postedByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ==================== JOB APPLICATION SYSTEM ==================== */
export type JobApplicationStatus = 
  | 'Applied' 
  | 'Under Review' 
  | 'Shortlisted' 
  | 'Interview' 
  | 'Selected' 
  | 'Rejected' 
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  candidatePhone?: string;
  candidateEmail?: string;
  recruiterId?: string;
  resumeUrl?: string;
  coverLetter?: string;
  qualification?: string;
  experienceYears?: number;
  status: JobApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
  recruiterNotes?: string;
  candidateNotes?: string;
}

/* ==================== SERVICE BOOKING SYSTEM ==================== */
export type ServiceBookingStatus = 
  | 'Requested' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Scheduled' 
  | 'On The Way' 
  | 'Started' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Disputed';

export interface ServiceBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAvatar?: string;
  workerId: string;
  workerName: string;
  workerTrade: string;
  workerAvatar?: string;
  serviceType: string;
  description: string;
  requestedDate: string;
  requestedTime: string;
  address: string;
  city: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  estimatedPrice: string;
  finalPrice?: string;
  status: ServiceBookingStatus;
  workerNotes?: string;
  customerNotes?: string;
  createdAt: string;
  completedAt?: string;
}

/* ==================== WORKER REVIEWS & RATINGS ==================== */
export interface WorkerReview {
  id: string;
  workerId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1 - 5
  review: string;
  bookingId?: string;
  createdAt: string;
}

/* ==================== MODERATION & ABUSE REPORTING ==================== */
export interface JobReport {
  id: string;
  targetType: 'job' | 'worker' | 'candidate';
  targetId: string;
  targetTitle: string;
  reporterId: string;
  reason: 'Fake Job / Scam' | 'Wrong Information' | 'Abusive Content' | 'Illegal Service' | 'Spam' | 'Impersonation' | 'Other';
  details?: string;
  status: 'Pending' | 'Reviewed' | 'Dismissed';
  createdAt: string;
}



