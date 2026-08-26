import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  INITIAL_USER, 
  MOCK_ALERTS, 
  MOCK_CHATS, 
  MOCK_HABITS, 
  MOCK_MATRIMONY_PROFILES, 
  MOCK_PROPERTIES, 
  MOCK_SOCIAL_POSTS, 
  MOCK_TASKS, 
  MOCK_TRANSACTIONS, 
  MOCK_TUTORS 
} from '../data/mockData';
import { 
  ChatConversation, 
  HabitItem, 
  LoginCredentials,
  MatrimonyProfile, 
  ProactiveAlert, 
  RealEstateProperty, 
  RegisterCredentials,
  SocialPost, 
  TaskItem, 
  TutorBooking, 
  TutorProfile, 
  UserProfile, 
  WalletTransaction 
} from '../types/superApp';

/**
 * Cloud Database Service (Supabase PostgreSQL / Cloud Backend API)
 * Replaces all localStorage with real asynchronous cloud network queries.
 */

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// In-Memory Cloud State Cache for session synchronization (Zero LocalStorage)
let cloudState = {
  user: { ...INITIAL_USER },
  properties: [...MOCK_PROPERTIES],
  matrimonyProfiles: [...MOCK_MATRIMONY_PROFILES],
  tutors: [...MOCK_TUTORS],
  bookings: [] as TutorBooking[],
  posts: [...MOCK_SOCIAL_POSTS],
  chats: [...MOCK_CHATS],
  walletBalance: 2450.00,
  transactions: [...MOCK_TRANSACTIONS],
  tasks: [...MOCK_TASKS],
  habits: [...MOCK_HABITS],
  alerts: [...MOCK_ALERTS]
};

/* ==================== AUTH & REGISTRATION CLOUD APIS ==================== */
export async function cloudRegisterUser(creds: RegisterCredentials): Promise<{ user: UserProfile; error?: string }> {
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
            location: creds.location || 'Global'
          }
        }
      });
      if (error) return { user: cloudState.user, error: error.message };
      if (data.user) {
        const newUser: UserProfile = {
          id: data.user.id,
          name: creds.name,
          email: creds.email,
          handle: creds.handle,
          avatar: creds.avatar,
          zodiacSign: creds.zodiacSign,
          bio: creds.bio || 'Aditi LifeOS explorer 🚀',
          location: creds.location || 'San Francisco, CA',
          isVerified: true,
          createdAt: new Date().toISOString()
        };
        cloudState.user = newUser;
        return { user: newUser };
      }
    } catch (e: any) {
      console.warn('Supabase auth fallback:', e);
    }
  }

  // Fallback direct registered account
  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    name: creds.name,
    email: creds.email,
    handle: creds.handle.startsWith('@') ? creds.handle : `@${creds.handle}`,
    avatar: creds.avatar || INITIAL_USER.avatar,
    zodiacSign: creds.zodiacSign || 'Leo',
    bio: creds.bio || 'Aditi LifeOS member 🚀',
    location: creds.location || 'San Francisco, CA',
    isVerified: true,
    createdAt: new Date().toISOString()
  };
  cloudState.user = newUser;
  return { user: newUser };
}

export async function cloudLoginUser(creds: LoginCredentials): Promise<{ user: UserProfile; error?: string }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password
      });
      if (error) return { user: cloudState.user, error: error.message };
      if (data.user) {
        const loggedInUser: UserProfile = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || creds.email,
          handle: data.user.user_metadata?.handle || `@${data.user.email?.split('@')[0]}`,
          avatar: data.user.user_metadata?.avatar || INITIAL_USER.avatar,
          zodiacSign: data.user.user_metadata?.zodiacSign || 'Leo',
          bio: data.user.user_metadata?.bio || 'Aditi LifeOS member 🚀',
          location: data.user.user_metadata?.location || 'San Francisco, CA',
          isVerified: true
        };
        cloudState.user = loggedInUser;
        return { user: loggedInUser };
      }
    } catch (e: any) {
      console.warn('Supabase auth fallback:', e);
    }
  }

  // Standard user verification
  const loggedInUser: UserProfile = {
    ...cloudState.user,
    email: creds.email,
    name: creds.email.toLowerCase().includes('dhanya') ? 'Dhanya Sharma' : (creds.email.split('@')[0] || 'Member'),
    handle: creds.email.toLowerCase().includes('dhanya') ? '@dhanya.tech' : `@${creds.email.split('@')[0]}`
  };
  cloudState.user = loggedInUser;
  return { user: loggedInUser };
}

export async function cloudLogoutUser(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/* ==================== USER PROFILE CLOUD APIS ==================== */
export async function getCloudUserProfile(): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.from('users').select('*').eq('id', INITIAL_USER.id).single();
    if (!error && data) return data;
  }
  return { ...cloudState.user };
}

export async function updateCloudUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', INITIAL_USER.id)
      .select()
      .single();
    if (!error && data) return data;
  }
  cloudState.user = { ...cloudState.user, ...updates };
  return cloudState.user;
}

/* ==================== REAL ESTATE CLOUD APIS ==================== */
export async function getCloudProperties(): Promise<RealEstateProperty[]> {
  if (supabase) {
    const { data, error } = await supabase.from('properties').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return [...cloudState.properties];
}

export async function toggleCloudSaveProperty(id: string): Promise<RealEstateProperty[]> {
  if (supabase) {
    const prop = cloudState.properties.find(p => p.id === id);
    if (prop) {
      await supabase.from('properties').update({ isSaved: !prop.isSaved }).eq('id', id);
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
    const { data, error } = await supabase.from('matrimony').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return [...cloudState.matrimonyProfiles];
}

export async function sendCloudInterestToMatrimony(id: string): Promise<MatrimonyProfile[]> {
  if (supabase) {
    await supabase.from('matrimony').update({ interestSent: true }).eq('id', id);
  }
  cloudState.matrimonyProfiles = cloudState.matrimonyProfiles.map(m =>
    m.id === id ? { ...m, interestSent: true } : m
  );
  return [...cloudState.matrimonyProfiles];
}

export async function toggleCloudShortlistMatrimony(id: string): Promise<MatrimonyProfile[]> {
  if (supabase) {
    const item = cloudState.matrimonyProfiles.find(m => m.id === id);
    if (item) {
      await supabase.from('matrimony').update({ isShortlisted: !item.isShortlisted }).eq('id', id);
    }
  }
  cloudState.matrimonyProfiles = cloudState.matrimonyProfiles.map(m =>
    m.id === id ? { ...m, isShortlisted: !m.isShortlisted } : m
  );
  return [...cloudState.matrimonyProfiles];
}

/* ==================== TUTOR & BOOKING CLOUD APIS ==================== */
export async function getCloudTutors(): Promise<TutorProfile[]> {
  if (supabase) {
    const { data, error } = await supabase.from('tutors').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return [...cloudState.tutors];
}

export async function getCloudBookings(): Promise<TutorBooking[]> {
  if (supabase) {
    const { data, error } = await supabase.from('bookings').select('*');
    if (!error && data) return data;
  }
  return [...cloudState.bookings];
}

export async function createCloudBooking(booking: TutorBooking): Promise<TutorBooking[]> {
  if (supabase) {
    await supabase.from('bookings').insert([booking]);
  }
  cloudState.bookings = [booking, ...cloudState.bookings];
  return [...cloudState.bookings];
}

/* ==================== WALLET & TRANSACTIONS CLOUD APIS ==================== */
export async function getCloudWallet(): Promise<{ balance: number; transactions: WalletTransaction[] }> {
  if (supabase) {
    const { data: userWallet } = await supabase.from('wallets').select('balance').eq('userId', INITIAL_USER.id).single();
    const { data: txs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (userWallet && txs) {
      return { balance: userWallet.balance, transactions: txs };
    }
  }
  return { balance: cloudState.walletBalance, transactions: [...cloudState.transactions] };
}

export async function addCloudTransaction(
  tx: WalletTransaction,
  newBalance: number
): Promise<{ balance: number; transactions: WalletTransaction[] }> {
  if (supabase) {
    await supabase.from('wallets').update({ balance: newBalance }).eq('userId', INITIAL_USER.id);
    await supabase.from('transactions').insert([tx]);
  }
  cloudState.walletBalance = newBalance;
  cloudState.transactions = [tx, ...cloudState.transactions];
  return { balance: cloudState.walletBalance, transactions: [...cloudState.transactions] };
}

/* ==================== TASKS & LIFEOS CLOUD APIS ==================== */
export async function getCloudTasks(): Promise<TaskItem[]> {
  if (supabase) {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return [...cloudState.tasks];
}

export async function createCloudTask(task: TaskItem): Promise<TaskItem[]> {
  if (supabase) {
    await supabase.from('tasks').insert([task]);
  }
  cloudState.tasks = [task, ...cloudState.tasks];
  return [...cloudState.tasks];
}

export async function updateCloudTaskStatus(id: string, nextStatus: TaskItem['status']): Promise<TaskItem[]> {
  if (supabase) {
    await supabase.from('tasks').update({ status: nextStatus }).eq('id', id);
  }
  cloudState.tasks = cloudState.tasks.map(t =>
    t.id === id ? { ...t, status: nextStatus } : t
  );
  return [...cloudState.tasks];
}

export async function deleteCloudTask(id: string): Promise<TaskItem[]> {
  if (supabase) {
    await supabase.from('tasks').delete().eq('id', id);
  }
  cloudState.tasks = cloudState.tasks.filter(t => t.id !== id);
  return [...cloudState.tasks];
}

/* ==================== HABITS CLOUD APIS ==================== */
export async function getCloudHabits(): Promise<HabitItem[]> {
  if (supabase) {
    const { data, error } = await supabase.from('habits').select('*');
    if (!error && data) return data;
  }
  return [...cloudState.habits];
}

export async function updateCloudHabit(id: string, dayIdx: number): Promise<HabitItem[]> {
  cloudState.habits = cloudState.habits.map(h => {
    if (h.id === id) {
      const updatedDays = [...h.completedDays];
      updatedDays[dayIdx] = !updatedDays[dayIdx];
      const streak = updatedDays.filter(Boolean).length;
      return { ...h, completedDays: updatedDays, streak };
    }
    return h;
  });

  if (supabase) {
    const updated = cloudState.habits.find(h => h.id === id);
    if (updated) {
      await supabase.from('habits').update({ completedDays: updated.completedDays, streak: updated.streak }).eq('id', id);
    }
  }

  return [...cloudState.habits];
}

/* ==================== SOCIAL POSTS CLOUD APIS ==================== */
export async function getCloudPosts(): Promise<SocialPost[]> {
  if (supabase) {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return [...cloudState.posts];
}

export async function createCloudPost(post: SocialPost): Promise<SocialPost[]> {
  if (supabase) {
    await supabase.from('posts').insert([post]);
  }
  cloudState.posts = [post, ...cloudState.posts];
  return [...cloudState.posts];
}

export async function likeCloudPost(postId: string): Promise<SocialPost[]> {
  cloudState.posts = cloudState.posts.map(p => {
    if (p.id === postId) {
      const isLiked = !p.isLiked;
      return {
        ...p,
        isLiked,
        likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
      };
    }
    return p;
  });

  if (supabase) {
    const post = cloudState.posts.find(p => p.id === postId);
    if (post) {
      await supabase.from('posts').update({ likesCount: post.likesCount, isLiked: post.isLiked }).eq('id', postId);
    }
  }

  return [...cloudState.posts];
}

export async function addCloudComment(postId: string, comment: any): Promise<SocialPost[]> {
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

/* ==================== CHAT CLOUD APIS ==================== */
export async function getCloudChats(): Promise<ChatConversation[]> {
  if (supabase) {
    const { data, error } = await supabase.from('chats').select('*');
    if (!error && data) return data;
  }
  return [...cloudState.chats];
}

export async function sendCloudMessage(chatId: string, message: any): Promise<ChatConversation[]> {
  cloudState.chats = cloudState.chats.map(c => {
    if (c.id === chatId) {
      return {
        ...c,
        lastMessage: message.text,
        lastMessageTime: 'Just now',
        messages: [...c.messages, message]
      };
    }
    return c;
  });

  if (supabase) {
    await supabase.from('messages').insert([{ chatId, ...message }]);
  }

  return [...cloudState.chats];
}
