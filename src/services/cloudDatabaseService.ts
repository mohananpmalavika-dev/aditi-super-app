import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  ChatConversation, 
  ChatMessage,
  HabitItem, 
  LoginCredentials,
  MatrimonyProfile, 
  ProactiveAlert, 
  RealEstateProperty, 
  RegisterCredentials,
  SocialComment,
  SocialPost, 
  TaskItem, 
  TutorBooking, 
  TutorProfile, 
  UserProfile, 
  WalletTransaction 
} from '../types/superApp';
import { LoginSchema, RegisterSchema } from '../lib/validation/authSchemas';

/**
 * Cloud Database Service (Supabase PostgreSQL / Cloud Backend API)
 * Authoritative backend service for Aditi Super App.
 */

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Initial Guest Profile template
const GUEST_USER: UserProfile = {
  id: 'usr-guest',
  name: 'Aditi Member',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  handle: '@aditi.user',
  email: '',
  zodiacSign: 'Leo',
  bio: 'Aditi LifeOS explorer 🚀',
  location: 'Kozhikode, Kerala, India',
  isVerified: false
};

// In-Memory state for active authenticated session
let cloudState = {
  user: { ...GUEST_USER },
  properties: [] as RealEstateProperty[],
  matrimonyProfiles: [] as MatrimonyProfile[],
  tutors: [] as TutorProfile[],
  bookings: [] as TutorBooking[],
  posts: [] as SocialPost[],
  chats: [] as ChatConversation[],
  walletBalance: 0.00,
  transactions: [] as WalletTransaction[],
  tasks: [] as TaskItem[],
  habits: [] as HabitItem[],
  alerts: [] as ProactiveAlert[]
};

/* ==================== DUMMY ACCOUNT VALIDATION & BLOCK ENGINE ==================== */
const DUMMY_KEYWORDS = [
  'test', 'demo', 'dummy', 'fake', 'sample', 'temp', 'trashmail', 'mailinator',
  'guerrillamail', '10minutemail', 'sharklasers', 'yopmail', 'dispostable',
  'example.com', 'test.com', 'dummy.com', 'fake.com', 'sample.com', 'abc.com',
  'foo.com', '12345', 'admin@admin', 'user@user'
];

const GENERIC_PLACEHOLDER_LOCAL_PARTS = new Set([
  'abc', 'abcd', 'abc123', 'test', 'demo', 'dummy', 'fake', 'sample', 'user', 'admin',
  'guest', 'temp', 'example', 'placeholder', 'newuser', 'username', 'person', 'person1'
]);

const normalizedEmail = (email: string) => email.trim().toLowerCase();

const LOCAL_ACCOUNTS_STORAGE_KEY = 'aditi-local-accounts';

const getLocalAccounts = (): Record<string, { password: string; user: UserProfile }> => {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveLocalAccount = (email: string, account: { password: string; user: UserProfile }) => {
  if (typeof localStorage === 'undefined') return;
  const accounts = getLocalAccounts();
  accounts[email] = account;
  localStorage.setItem(LOCAL_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
};

export function isDummyOrDisposableAccount(email: string, name?: string, handle?: string): boolean {
  if (!email || typeof email !== 'string') return true;
  const cleanEmail = email.trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) return true;

  for (const keyword of DUMMY_KEYWORDS) {
    if (cleanEmail.includes(keyword)) return true;
    if (name && name.toLowerCase().includes(keyword)) return true;
    if (handle && handle.toLowerCase().includes(keyword)) return true;
  }

  const [localPart] = cleanEmail.split('@');
  if (!localPart || localPart.length < 3) return true;
  if (/^[0-9]+$/.test(localPart)) return true;
  if (GENERIC_PLACEHOLDER_LOCAL_PARTS.has(localPart)) return true;
  if (/^(asdf|qwerty|password|letmein|welcome|hello|world|user|admin|guest)$/i.test(localPart)) return true;
  if (/^(abc|test|demo|sample|user|admin|guest)(?:\d+)?$/i.test(localPart)) return true;

  return false;
}

/* ==================== AUTH & REGISTRATION CLOUD APIS ==================== */

export async function cloudRegisterUser(creds: RegisterCredentials): Promise<{ user: UserProfile; error?: string }> {
  const validation = RegisterSchema.safeParse(creds);
  if (!validation.success) {
    return {
      user: cloudState.user,
      error: validation.error.issues[0]?.message || 'Invalid registration details'
    };
  }

  if (isDummyOrDisposableAccount(creds.email, creds.name, creds.handle)) {
    return {
      user: cloudState.user,
      error: '❌ Dummy & Test account creation is strictly blocked. Please provide a genuine email address and real user details.'
    };
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: creds.email,
        password: creds.password,
        options: {
          data: {
            name: creds.name,
            handle: creds.handle,
            avatar: creds.avatar,
            zodiacSign: creds.zodiacSign,
            bio: creds.bio || '',
            location: creds.location || 'Kozhikode, Kerala, India'
          }
        }
      });
      if (error) return { user: cloudState.user, error: error.message };
      if (data.user) {
        if (!data.session) {
          return {
            user: cloudState.user,
            error: 'Registration successful. Please verify your email from the confirmation link before signing in.'
          };
        }

        const newUser: UserProfile = {
          id: data.user.id,
          name: creds.name,
          email: creds.email,
          handle: creds.handle.startsWith('@') ? creds.handle : `@${creds.handle}`,
          avatar: creds.avatar || GUEST_USER.avatar,
          zodiacSign: creds.zodiacSign || 'Leo',
          bio: creds.bio || 'Aditi Verified Member 🚀',
          location: creds.location || 'Kozhikode, Kerala, India',
          isVerified: true,
          createdAt: new Date().toISOString()
        };
        cloudState.user = newUser;
        return { user: newUser };
      }
    } catch (e: any) {
      return { user: cloudState.user, error: e.message || 'Supabase authentication failed' };
    }
  }

  // Local development session
  const normalizedEmailAddress = normalizedEmail(creds.email);
  const localUser: UserProfile = {
    id: `usr-${crypto.randomUUID()}`,
    name: creds.name,
    email: creds.email,
    handle: creds.handle.startsWith('@') ? creds.handle : `@${creds.handle}`,
    avatar: creds.avatar || GUEST_USER.avatar,
    zodiacSign: creds.zodiacSign || 'Leo',
    bio: creds.bio || 'Aditi Verified Member 🚀',
    location: creds.location || 'Kozhikode, Kerala, India',
    isVerified: true,
    createdAt: new Date().toISOString()
  };
  saveLocalAccount(normalizedEmailAddress, { password: creds.password, user: localUser });
  cloudState.user = localUser;
  return { user: localUser };
}

export async function cloudLoginUser(creds: LoginCredentials): Promise<{ user: UserProfile; error?: string }> {
  const validation = LoginSchema.safeParse(creds);
  if (!validation.success) {
    return {
      user: cloudState.user,
      error: validation.error.issues[0]?.message || 'Invalid login details'
    };
  }

  if (isDummyOrDisposableAccount(creds.email)) {
    return {
      user: cloudState.user,
      error: '❌ Dummy, Demo & Test account logins are strictly blocked. Please sign in with your verified real account.'
    };
  }

  const normalizedEmailAddress = normalizedEmail(creds.email);

  if (!supabase) {
    const localAccount = getLocalAccounts()[normalizedEmailAddress];
    if (!localAccount) {
      return {
        user: cloudState.user,
        error: '❌ Account not found. Please register before signing in.'
      };
    }

    if (localAccount.password !== creds.password) {
      return {
        user: cloudState.user,
        error: '❌ Invalid login credentials. Please check your email and password.'
      };
    }

    cloudState.user = localAccount.user;
    return { user: localAccount.user };
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password
      });
      if (error) return { user: cloudState.user, error: error.message };
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const loggedInUser: UserProfile = {
          id: data.user.id,
          name: profileData?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || creds.email,
          handle: profileData?.handle || data.user.user_metadata?.handle || `@${data.user.email?.split('@')[0]}`,
          avatar: profileData?.avatar_url || data.user.user_metadata?.avatar || GUEST_USER.avatar,
          zodiacSign: profileData?.zodiac_sign || data.user.user_metadata?.zodiacSign || 'Leo',
          bio: profileData?.bio || data.user.user_metadata?.bio || 'Aditi Verified Member 🚀',
          location: profileData?.location || data.user.user_metadata?.location || 'Kozhikode, Kerala, India',
          isVerified: true
        };
        cloudState.user = loggedInUser;
        return { user: loggedInUser };
      }
    } catch (e: any) {
      return { user: cloudState.user, error: e.message || 'Supabase authentication failed' };
    }
  }

  // Local development session
  const loggedInUser: UserProfile = {
    ...cloudState.user,
    email: creds.email,
    name: creds.email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    handle: `@${creds.email.split('@')[0]}`,
    isVerified: true
  };
  cloudState.user = loggedInUser;
  return { user: loggedInUser };
}

export async function cloudGoogleAuthUser(googleUserData?: {
  name: string;
  email: string;
  avatar?: string;
}): Promise<{ user: UserProfile; error?: string }> {
  if (googleUserData) {
    const cleanEmail = googleUserData.email.trim().toLowerCase();
    const userProfile: UserProfile = {
      id: `usr-${crypto.randomUUID()}`,
      name: googleUserData.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      handle: `@${cleanEmail.split('@')[0]}`,
      avatar: googleUserData.avatar || GUEST_USER.avatar,
      zodiacSign: 'Leo',
      bio: 'Aditi Google-Verified Member 🌟',
      location: 'Kozhikode, Kerala, India',
      isVerified: true
    };
    cloudState.user = userProfile;
    return { user: userProfile };
  }

  if (supabase) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });
      if (error) return { user: cloudState.user, error: error.message };
      return { user: cloudState.user };
    } catch (e: any) {
      return { user: cloudState.user, error: e.message };
    }
  }

  return { user: cloudState.user };
}

export async function cloudResetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true };
}

export async function cloudLogoutUser(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  cloudState.user = { ...GUEST_USER };
}

/* ==================== USER PROFILE CLOUD APIS ==================== */
export async function getCloudUserProfile(): Promise<UserProfile> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          handle: data.handle,
          avatar: data.avatar_url,
          bio: data.bio,
          location: data.location,
          zodiacSign: data.zodiac_sign,
          gender: data.gender,
          isVerified: data.is_verified,
          createdAt: data.created_at
        };
      }
    }
  }
  return { ...cloudState.user };
}

export async function updateCloudUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.handle) dbUpdates.handle = updates.handle;
      if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
      if (updates.bio) dbUpdates.bio = updates.bio;
      if (updates.location) dbUpdates.location = updates.location;
      if (updates.zodiacSign) dbUpdates.zodiac_sign = updates.zodiacSign;
      if (updates.gender) dbUpdates.gender = updates.gender;

      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', authData.user.id)
        .select()
        .single();
      if (!error && data) {
        const updatedUser: UserProfile = {
          ...cloudState.user,
          ...updates,
          id: data.id
        };
        cloudState.user = updatedUser;
        return updatedUser;
      }
    }
  }
  cloudState.user = { ...cloudState.user, ...updates };
  return cloudState.user;
}

/* ==================== REAL ESTATE CLOUD APIS ==================== */
export async function getCloudProperties(): Promise<RealEstateProperty[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'published');
    if (!error && data && data.length > 0) return data;
  }
  return [...cloudState.properties];
}

export async function toggleCloudSaveProperty(id: string): Promise<RealEstateProperty[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data: existing } = await supabase
        .from('property_saves')
        .select('*')
        .eq('property_id', id)
        .eq('user_id', authData.user.id)
        .single();

      if (existing) {
        await supabase
          .from('property_saves')
          .delete()
          .eq('property_id', id)
          .eq('user_id', authData.user.id);
      } else {
        await supabase
          .from('property_saves')
          .insert({ property_id: id, user_id: authData.user.id });
      }
    }
  }
  cloudState.properties = cloudState.properties.map(p =>
    p.id === id ? { ...p, isSaved: !p.isSaved } : p
  );
  return [...cloudState.properties];
}

/* ==================== MATRIMONY CLOUD APIS ==================== */
export async function getCloudMatrimonyProfiles(): Promise<MatrimonyProfile[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('matrimony_profiles')
      .select('*, profiles(name, avatar_url)')
      .eq('is_active', true);
    if (!error && data && data.length > 0) return data;
  }
  return [...cloudState.matrimonyProfiles];
}

export async function sendCloudInterestToMatrimony(recipientUserId: string): Promise<MatrimonyProfile[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('matrimony_interests').insert({
        sender_id: authData.user.id,
        recipient_id: recipientUserId,
        status: 'sent'
      });
    }
  }
  cloudState.matrimonyProfiles = cloudState.matrimonyProfiles.map(m =>
    m.id === recipientUserId ? { ...m, interestSent: true } : m
  );
  return [...cloudState.matrimonyProfiles];
}

export async function toggleCloudShortlistMatrimony(id: string): Promise<MatrimonyProfile[]> {
  cloudState.matrimonyProfiles = cloudState.matrimonyProfiles.map(m =>
    m.id === id ? { ...m, isShortlisted: !m.isShortlisted } : m
  );
  return [...cloudState.matrimonyProfiles];
}

/* ==================== TUTORS & BOOKINGS CLOUD APIS ==================== */
export async function getCloudTutors(): Promise<TutorProfile[]> {
  if (supabase) {
    const { data, error } = await supabase.from('tutors').select('*').eq('status', 'active');
    if (!error && data && data.length > 0) return data;
  }
  return [...cloudState.tutors];
}

export async function getCloudBookings(): Promise<TutorBooking[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data, error } = await supabase
        .from('tutor_bookings')
        .select('*, tutors(name, avatar_url, hourly_rate)')
        .eq('student_id', authData.user.id);
      if (!error && data) return data;
    }
  }
  return [...cloudState.bookings];
}

export async function createCloudBooking(bookingData: {
  tutorId: string;
  subject: string;
  date: string;
  time: string;
}): Promise<TutorBooking[]> {
  const tutor = cloudState.tutors.find(t => t.id === bookingData.tutorId);
  const newBooking: TutorBooking = {
    id: `book-${crypto.randomUUID()}`,
    tutorId: bookingData.tutorId,
    tutorName: tutor?.name || 'Academic Tutor',
    subject: bookingData.subject,
    date: bookingData.date,
    time: bookingData.time,
    status: 'Confirmed',
    rate: tutor?.hourlyRate || 50
  };

  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const startTime = new Date(`${bookingData.date}T${bookingData.time}:00Z`).toISOString();
      const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();
      await supabase.from('tutor_bookings').insert({
        tutor_id: bookingData.tutorId,
        student_id: authData.user.id,
        subject: bookingData.subject,
        start_at: startTime,
        end_at: endTime,
        status: 'confirmed'
      });
    }
  }

  cloudState.bookings = [newBooking, ...cloudState.bookings];
  return [...cloudState.bookings];
}

/* ==================== SOCIAL FEED CLOUD APIS ==================== */
export async function getCloudPosts(): Promise<SocialPost[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(name, avatar_url, handle), post_likes(user_id), post_comments(*)')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  return [...cloudState.posts];
}

export async function createCloudPost(post: SocialPost): Promise<SocialPost[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('posts').insert({
        user_id: authData.user.id,
        content: post.content,
        media_url: post.mediaUrl,
        media_type: post.mediaType,
        tags: post.tags || []
      });
    }
  }

  cloudState.posts = [post, ...cloudState.posts];
  return [...cloudState.posts];
}

export async function likeCloudPost(postId: string): Promise<SocialPost[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', authData.user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', authData.user.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: authData.user.id });
      }
    }
  }

  cloudState.posts = cloudState.posts.map(p => {
    if (p.id === postId) {
      return {
        ...p,
        isLiked: !p.isLiked,
        likesCount: p.isLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1
      };
    }
    return p;
  });
  return [...cloudState.posts];
}

export async function addCloudComment(postId: string, comment: SocialComment): Promise<SocialPost[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('post_comments').insert({
        post_id: postId,
        user_id: authData.user.id,
        content: comment.content
      });
    }
  }

  cloudState.posts = cloudState.posts.map(p => {
    if (p.id === postId) {
      return {
        ...p,
        commentsCount: p.commentsCount + 1,
        comments: [...p.comments, comment]
      };
    }
    return p;
  });
  return [...cloudState.posts];
}

/* ==================== REALTIME CHAT CLOUD APIS ==================== */
export async function getCloudChats(): Promise<ChatConversation[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, messages(*), conversation_members(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((c: any) => {
          const sortedMessages = (c.messages || []).sort(
            (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          const lastMsg = sortedMessages[sortedMessages.length - 1];

          return {
            id: c.id,
            participantName: c.name || 'Community Member',
            participantAvatar: c.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
            roleOrContext: c.type === 'channel' ? '📢 Channel' : c.type === 'group' ? '👥 Group' : '💬 Direct Chat',
            lastMessage: lastMsg?.text || 'Conversation started',
            lastMessageTime: lastMsg?.created_at
              ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now',
            unreadCount: 0,
            isOnline: true,
            conversationType: c.type || 'direct',
            channelHandle: c.name ? `@${c.name.toLowerCase().replace(/\s+/g, '')}` : undefined,
            isFriend: true,
            messages: sortedMessages.map((m: any) => ({
              id: m.id,
              senderId: m.sender_id,
              senderName: m.sender_id === authData.user?.id ? 'You' : (c.name || 'Member'),
              text: m.text,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isUser: m.sender_id === authData.user?.id,
              mediaUrl: m.media_url,
              mediaType: m.media_type,
              isDisappearing: m.is_disappearing,
              expiresAt: m.expires_at ? new Date(m.expires_at).getTime() : undefined
            }))
          };
        });
      }
    }
  }
  return [...cloudState.chats];
}

export async function sendCloudMessage(
  chatId: string, 
  messageOrText: string | ChatMessage, 
  options?: any
): Promise<ChatConversation[]> {
  const text = typeof messageOrText === 'string' ? messageOrText : messageOrText.text;
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('messages').insert({
        id: crypto.randomUUID(),
        conversation_id: chatId,
        sender_id: authData.user.id,
        text: text,
        media_url: options?.mediaUrl || null,
        media_type: options?.mediaType || null,
        is_disappearing: Boolean(options?.expiresDuration),
        expires_at: options?.expiresDuration 
          ? new Date(Date.now() + options.expiresDuration * 1000).toISOString() 
          : null
      });
    }
  }
  return [...cloudState.chats];
}

export async function addCloudFriend(friendId: string): Promise<void> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('friendships').insert({
        user_id: authData.user.id,
        friend_id: friendId,
        status: 'accepted'
      });
    }
  }
}

export async function removeCloudFriend(friendId: string): Promise<void> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('friendships')
        .delete()
        .or(`and(user_id.eq.${authData.user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${authData.user.id})`);
    }
  }
}

export async function blockCloudUser(targetUserId: string): Promise<void> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('user_blocks').insert({
        blocker_id: authData.user.id,
        blocked_id: targetUserId
      });
    }
  }
}

export async function unblockCloudUser(targetUserId: string): Promise<void> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('user_blocks')
        .delete()
        .eq('blocker_id', authData.user.id)
        .eq('blocked_id', targetUserId);
    }
  }
}

export async function createCloudConversation(params: {
  name?: string;
  type: 'direct' | 'group' | 'channel';
  memberIds: string[];
}): Promise<string> {
  const conversationId = crypto.randomUUID();
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('conversations').insert({
        id: conversationId,
        type: params.type,
        name: params.name || null,
        created_by: authData.user.id
      });

      const memberInserts = [authData.user.id, ...params.memberIds].map(uid => ({
        conversation_id: conversationId,
        user_id: uid,
        role: uid === authData.user.id ? 'admin' : 'member'
      }));

      await supabase.from('conversation_members').insert(memberInserts);
    }
  }
  return conversationId;
}

/* ==================== PRODUCTIVITY: TASKS & HABITS ==================== */
export async function getCloudTasks(): Promise<TaskItem[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
  }
  return [...cloudState.tasks];
}

export async function createCloudTask(taskData: TaskItem): Promise<TaskItem[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('tasks').insert({
        user_id: authData.user.id,
        title: taskData.title,
        priority: taskData.priority,
        due_date: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        completed: taskData.status === 'done',
        category: taskData.category || 'Personal'
      });
    }
  }

  cloudState.tasks = [taskData, ...cloudState.tasks];
  return [...cloudState.tasks];
}

export async function updateCloudTaskStatus(id: string, status: 'todo' | 'in_progress' | 'done'): Promise<TaskItem[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase
        .from('tasks')
        .update({ completed: status === 'done' })
        .eq('id', id)
        .eq('user_id', authData.user.id);
    }
  }
  cloudState.tasks = cloudState.tasks.map(t => t.id === id ? { ...t, status } : t);
  return [...cloudState.tasks];
}

export async function deleteCloudTask(id: string): Promise<TaskItem[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', authData.user.id);
    }
  }
  cloudState.tasks = cloudState.tasks.filter(t => t.id !== id);
  return [...cloudState.tasks];
}

export async function getCloudHabits(): Promise<HabitItem[]> {
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data, error } = await supabase
        .from('habits')
        .select('*, habit_entries(*)')
        .eq('user_id', authData.user.id);
      if (!error && data) return data;
    }
  }
  return [...cloudState.habits];
}

export async function updateCloudHabit(id: string, dayIndex: number): Promise<HabitItem[]> {
  cloudState.habits = cloudState.habits.map(h => {
    if (h.id === id) {
      const nextDays = [...h.completedDays];
      nextDays[dayIndex] = !nextDays[dayIndex];
      return { ...h, completedDays: nextDays };
    }
    return h;
  });
  return [...cloudState.habits];
}
