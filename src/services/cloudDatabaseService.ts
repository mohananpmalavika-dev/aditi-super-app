import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  ChatConversation, 
  ChatMessage,
  FriendRequest,
  FriendshipStatus,
  HabitItem, 
  JobVacancy,
  JobSeekerProfile,
  LocalWorkerProfile,
  JobApplication,
  JobApplicationStatus,
  ServiceBooking,
  ServiceBookingStatus,
  WorkerReview,
  JobReport,
  LoginCredentials,
  MatrimonyProfile, 
  ProactiveAlert, 
  RealEstateProperty, 
  PropertyRequirement,
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

const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  (import.meta as any).env?.SUPABASE_URL || 
  'https://rbmcpyvxwfaccqxiywuk.supabase.co';

const SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || 
  (import.meta as any).env?.SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_LZ31wCBwSmQP1BUg96kDgA_LQAARz8e';

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

import { getSafeAvatarUrl, generateSvgAvatar } from '../utils/avatarUtils';

const isTestEnv = Boolean(
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.VITEST) ||
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'test')
);

// Initial Guest Profile template
const GUEST_USER: UserProfile = {
  id: 'usr-guest',
  name: 'Aditi Member',
  avatar: generateSvgAvatar('Aditi Member'),
  handle: '@aditi.user',
  email: '',
  zodiacSign: 'Leo',
  bio: 'Aditi LifeOS explorer 🚀',
  location: 'Kozhikode, Kerala, India',
  isVerified: false
};

const DEFAULT_INITIAL_PROPERTIES: RealEstateProperty[] = [
  {
    id: 'prop-1',
    title: 'Skyline Waterfront 3 BHK Luxury Apartment',
    type: 'Apartment',
    listingType: 'Buy',
    price: 8500000,
    priceFormatted: '₹85 Lakhs',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1850,
    location: 'Marine Drive',
    city: 'Kochi (Ernakulam)',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    features: ['Sea View Balcony', 'Infinity Pool', 'Covered Car Parking', '24/7 Security'],
    description: 'Ultra-modern 3 BHK apartment with unobstructed backwaters and sea view.',
    agent: {
      name: 'Priya Varma',
      phone: '+91 98471 22334',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      rating: 4.9
    },
    isFeatured: true,
    isSaved: false
  },
  {
    id: 'prop-2',
    title: 'Traditional Kerala Nalukettu Villa',
    type: 'Villa',
    listingType: 'Buy',
    price: 14000000,
    priceFormatted: '₹1.40 Cr',
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3400,
    location: 'Kowdiar',
    city: 'Thiruvananthapuram',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    features: ['Teak Wood Interiors', 'Courtyard (Nadumuttam)', 'Solar Power', 'Well Water'],
    description: 'Heritage styled eco-friendly luxury villa set in serene residential layout.',
    agent: {
      name: 'Arjun Menon',
      phone: '+91 98470 54321',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.8
    },
    isFeatured: true,
    isSaved: false
  }
];

// In-Memory state for active authenticated session
let cloudState = {
  user: { ...GUEST_USER },
  properties: [...DEFAULT_INITIAL_PROPERTIES],
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
const CUSTOM_CONTACTS_STORAGE_KEY = 'aditi-custom-contacts';

export const getLocalAccounts = (): Record<string, { password: string; user: UserProfile }> => {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveLocalAccount = (email: string, account: { password: string; user: UserProfile }) => {
  if (typeof localStorage === 'undefined') return;
  const accounts = getLocalAccounts();
  accounts[email] = account;
  localStorage.setItem(LOCAL_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
};

export const getCustomContacts = (): UserProfile[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_CONTACTS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveCustomContact = (contact: UserProfile): void => {
  if (typeof localStorage === 'undefined') return;
  const contacts = getCustomContacts();
  const index = contacts.findIndex(
    (c) =>
      c.id === contact.id ||
      (c.email && contact.email && c.email.toLowerCase() === contact.email.toLowerCase()) ||
      (c.name && contact.name && c.name.toLowerCase() === contact.name.toLowerCase())
  );
  if (index >= 0) {
    contacts[index] = { ...contacts[index], ...contact };
  } else {
    contacts.unshift(contact);
  }
  localStorage.setItem(CUSTOM_CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
};

export async function getCloudRegisteredUsers(): Promise<UserProfile[]> {
  const usersMap = new Map<string, UserProfile>();

  // 1. Fetch profiles from Supabase if configured
  if (supabase && !isTestEnv) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1200))
      ]);

      if (!error && data && Array.isArray(data)) {
        data.forEach((p: any) => {
          if (p && (p.id || p.email || p.name)) {
            const key = (p.email || p.id || p.name).toLowerCase();
            usersMap.set(key, {
              id: p.id,
              name: p.name || p.email?.split('@')[0] || 'User',
              email: p.email || '',
              handle: p.handle ? (p.handle.startsWith('@') ? p.handle : `@${p.handle}`) : `@${p.email?.split('@')[0] || 'user'}`,
              avatar: p.avatar_url || getSafeAvatarUrl(undefined, p.name || p.email?.split('@')[0]),
              zodiacSign: p.zodiac_sign || 'Leo',
              bio: p.bio || 'Aditi Verified Member 🚀',
              location: p.location || 'Kozhikode, Kerala, India',
              isVerified: p.is_verified ?? true,
              createdAt: p.created_at
            });
          }
        });
      }
    } catch (err) {
      console.warn('Error fetching Supabase registered profiles:', err);
    }
  }

  // 2. Merge registered local accounts
  const localAccounts = getLocalAccounts();
  Object.values(localAccounts).forEach((acc) => {
    if (acc.user && (acc.user.id || acc.user.email || acc.user.name)) {
      const key = (acc.user.email || acc.user.id || acc.user.name).toLowerCase();
      if (!usersMap.has(key)) {
        usersMap.set(key, acc.user);
      }
    }
  });

  // 3. Merge custom manually added contacts
  const customContacts = getCustomContacts();
  customContacts.forEach((contact) => {
    if (contact && (contact.id || contact.email || contact.name)) {
      const key = (contact.email || contact.id || contact.name).toLowerCase();
      if (!usersMap.has(key)) {
        usersMap.set(key, contact);
      }
    }
  });

  // 4. Merge matrimony profiles
  try {
    if (typeof localStorage !== 'undefined') {
      const savedMatrimony = localStorage.getItem('omnilife_matrimony_profiles');
      if (savedMatrimony) {
        const matProfiles: MatrimonyProfile[] = JSON.parse(savedMatrimony);
        matProfiles.forEach((m) => {
          if (m && m.name) {
            const key = m.name.toLowerCase();
            const photoAvatar = (m.photos && m.photos.length > 0) ? m.photos[0] : undefined;
            const locStr = [m.city, m.state].filter(Boolean).join(', ') || 'Kerala, India';
            if (!usersMap.has(key)) {
              usersMap.set(key, {
                id: m.id || `usr-mat-${Date.now()}`,
                name: m.name,
                email: m.contactEmail || '',
                handle: `@${m.name.toLowerCase().replace(/\s+/g, '')}`,
                avatar: photoAvatar || getSafeAvatarUrl(undefined, m.name),
                bio: `${m.profession || 'Aditi Member'} • ${locStr}`,
                location: locStr,
                zodiacSign: (m.zodiac as any) || 'Leo',
                isVerified: true
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn('Error loading matrimony profiles for discovery:', err);
  }

  // 5. Merge chat direct participants
  try {
    if (typeof localStorage !== 'undefined') {
      const savedChats = localStorage.getItem('omnilife_chats');
      if (savedChats) {
        const chatsList: ChatConversation[] = JSON.parse(savedChats);
        chatsList.forEach((c) => {
          const isDirect = !c.conversationType || c.conversationType === 'direct';
          if (isDirect && c.participantName) {
            const key = c.participantName.toLowerCase();
            if (!usersMap.has(key)) {
              usersMap.set(key, {
                id: c.id,
                name: c.participantName,
                email: '',
                handle: `@${c.participantName.toLowerCase().replace(/\s+/g, '')}`,
                avatar: c.participantAvatar || getSafeAvatarUrl(undefined, c.participantName),
                bio: c.roleOrContext || 'Aditi Member',
                location: 'Kerala, India',
                zodiacSign: 'Leo',
                isVerified: true
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn('Error loading chat contacts for discovery:', err);
  }

  return Array.from(usersMap.values());
}

/**
 * Irreversibly purges all registered accounts, custom contacts, and profiles from local database and storage.
 */
export async function deleteAllUsersFromDb(): Promise<{ success: boolean; message: string }> {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCAL_ACCOUNTS_STORAGE_KEY);
      localStorage.removeItem(CUSTOM_CONTACTS_STORAGE_KEY);
      localStorage.removeItem('aditi-user-profile');
      localStorage.removeItem('aditi-device-lock-credentials');
    }

    if (supabase && !isTestEnv) {
      try {
        await Promise.race([
          supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          new Promise((res) => setTimeout(res, 2000))
        ]);
      } catch (err) {
        console.warn('Supabase profiles delete warning:', err);
      }
    }

    cloudState.user = { ...GUEST_USER };

    return {
      success: true,
      message: 'All user accounts and contacts have been deleted from storage and database.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to delete users from database.'
    };
  }
}

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
      const redirectUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
        ? window.location.origin
        : 'https://malabarbazaar.shop';

      const userHandle = creds.handle
        ? (creds.handle.startsWith('@') ? creds.handle : `@${creds.handle}`)
        : `@${creds.email.split('@')[0]}`;
      const userAvatar = getSafeAvatarUrl(creds.avatar, creds.name);

      const { data, error } = await supabase.auth.signUp({
        email: creds.email,
        password: creds.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: creds.name,
            phone: creds.phone || '',
            handle: userHandle,
            avatar: userAvatar,
            zodiacSign: creds.zodiacSign || 'Leo',
            bio: creds.bio || '',
            location: creds.location || 'Kozhikode, Kerala, India'
          }
        }
      });
      if (error) return { user: cloudState.user, error: error.message };
      if (data.user) {
        const newUser: UserProfile = {
          id: data.user.id,
          name: creds.name,
          email: creds.email,
          phone: creds.phone,
          handle: userHandle,
          avatar: userAvatar,
          zodiacSign: creds.zodiacSign || 'Leo',
          bio: creds.bio || 'Aditi Verified Member 🚀',
          location: creds.location || 'Kozhikode, Kerala, India',
          isVerified: true,
          createdAt: new Date().toISOString()
        };
        saveLocalAccount(normalizedEmail(creds.email), { password: creds.password, user: newUser });
        cloudState.user = newUser;
        return { user: newUser };
      }
    } catch (e: any) {
      return { user: cloudState.user, error: e.message || 'Supabase authentication failed' };
    }
  }

  // Local development session
  const normalizedEmailAddress = normalizedEmail(creds.email);
  const userHandle = creds.handle
    ? (creds.handle.startsWith('@') ? creds.handle : `@${creds.handle}`)
    : `@${creds.email.split('@')[0]}`;
  const userAvatar = getSafeAvatarUrl(creds.avatar, creds.name);

  const localUser: UserProfile = {
    id: `usr-${crypto.randomUUID()}`,
    name: creds.name,
    email: creds.email,
    phone: creds.phone,
    handle: userHandle,
    avatar: userAvatar,
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
      const authPromise = supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password
      });

      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('❌ Account not found or authentication request timed out')), 2000)
      );

      const { data, error } = await Promise.race([authPromise, timeoutPromise]);
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
          avatar: getSafeAvatarUrl(profileData?.avatar_url || data.user.user_metadata?.avatar, profileData?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0]),
          zodiacSign: profileData?.zodiac_sign || data.user.user_metadata?.zodiacSign || 'Leo',
          bio: profileData?.bio || data.user.user_metadata?.bio || 'Aditi Verified Member 🚀',
          location: profileData?.location || data.user.user_metadata?.location || 'Kozhikode, Kerala, India',
          isVerified: true
        };
        cloudState.user = loggedInUser;
        return { user: loggedInUser };
      }
    } catch (e: any) {
      return { user: cloudState.user, error: e.message || '❌ Account not found. Please check your email and password.' };
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
    saveLocalAccount(cleanEmail, { password: '', user: userProfile });
    cloudState.user = userProfile;
    return { user: userProfile };
  }

  if (supabase) {
    try {
      const redirectUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
        ? window.location.origin
        : 'https://malabarbazaar.shop';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
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
      const redirectUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
        ? window.location.origin
        : 'https://malabarbazaar.shop';

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl
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
          avatar: getSafeAvatarUrl(data.avatar_url, data.name),
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
  if (supabase && !isTestEnv) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('properties').select('*').eq('status', 'published'),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1000))
      ]);
      if (!error && data && data.length > 0) return data;
    } catch {}
  }
  if (cloudState.properties.length === 0) {
    cloudState.properties = [...DEFAULT_INITIAL_PROPERTIES];
  }
  return [...cloudState.properties];
}

export async function toggleCloudSaveProperty(id: string): Promise<RealEstateProperty[]> {
  if (supabase && !isTestEnv) {
    try {
      const { data: authData } = await Promise.race([
        supabase.auth.getUser(),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: { user: null }, error: 'timeout' }), 1000))
      ]);
      if (authData?.user) {
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
    } catch {}
  }
  cloudState.properties = cloudState.properties.map(p =>
    p.id === id ? { ...p, isSaved: !p.isSaved } : p
  );
  return [...cloudState.properties];
}

export async function createCloudProperty(
  newProp: Omit<RealEstateProperty, 'id'> | RealEstateProperty
): Promise<RealEstateProperty[]> {
  const propertyId = ('id' in newProp && newProp.id) ? newProp.id : `prop-${Date.now()}`;
  const fullProperty: RealEstateProperty = {
    ...newProp,
    id: propertyId,
    isSaved: false
  };

  if (supabase && !isTestEnv) {
    try {
      await Promise.race([
        supabase.from('properties').insert({
          id: propertyId,
          title: fullProperty.title,
          type: fullProperty.type,
          listing_type: fullProperty.listingType,
          price: fullProperty.price,
          price_formatted: fullProperty.priceFormatted,
          bedrooms: fullProperty.bedrooms,
          bathrooms: fullProperty.bathrooms,
          area_sqft: fullProperty.areaSqFt,
          location: fullProperty.location,
          city: fullProperty.city,
          images: fullProperty.images,
          features: fullProperty.features,
          description: fullProperty.description,
          agent: fullProperty.agent,
          status: 'published'
        }),
        new Promise((res) => setTimeout(res, 1000))
      ]);
    } catch {
      // fallback to local memory state
    }
  }

  cloudState.properties = [fullProperty, ...cloudState.properties];
  return [...cloudState.properties];
}

export async function deleteCloudProperty(id: string): Promise<RealEstateProperty[]> {
  if (supabase && !isTestEnv) {
    try {
      await Promise.race([
        supabase.from('properties').delete().eq('id', id),
        new Promise((res) => setTimeout(res, 1000))
      ]);
    } catch {
      // fallback
    }
  }
  cloudState.properties = cloudState.properties.filter(p => p.id !== id);
  return [...cloudState.properties];
}

/* ==================== BUYER / TENANT REQUIREMENTS CLOUD APIS ==================== */
const PROPERTY_REQUIREMENTS_STORAGE_KEY = 'ADITI_SUPER_APP_PROPERTY_REQUIREMENTS';

const INITIAL_PROPERTY_REQUIREMENTS: PropertyRequirement[] = [
  {
    id: 'req-1',
    title: '3 BHK Luxury Villa Wanted near Beach',
    requirementType: 'Buy',
    propertyCategory: 'Villa',
    preferredLocations: ['Kozhikode Beach', 'Bhatt Road', 'Vellayil'],
    city: 'Kozhikode',
    minBudget: 7500000,
    maxBudget: 12000000,
    budgetFormatted: '₹75 Lakhs - ₹1.20 Cr',
    bedrooms: 3,
    bathrooms: 3,
    minAreaSqFt: 2200,
    furnishing: 'Semi-Furnished',
    timeline: 'Within 1 Month',
    specificNeeds: 'Looking for an independent or gated villa with dedicated car porch, well water & 24/7 security near beach road.',
    contactName: 'Dr. Rahul Nambiar',
    contactPhone: '+91 98471 22334',
    contactEmail: 'dr.rahul@example.com',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    isVerifiedBuyer: true,
    createdAt: '2 hours ago',
    isSaved: false
  },
  {
    id: 'req-2',
    title: 'Furnished 2 BHK Flat for IT Couple',
    requirementType: 'Rent',
    propertyCategory: 'Apartment',
    preferredLocations: ['Kakkanad', 'Infopark Road', 'Edachira'],
    city: 'Kochi',
    minBudget: 18000,
    maxBudget: 26000,
    budgetFormatted: '₹18,000 - ₹26,000 / mo',
    bedrooms: 2,
    bathrooms: 2,
    minAreaSqFt: 1100,
    furnishing: 'Fully Furnished',
    timeline: 'Immediate',
    specificNeeds: 'Need high-floor 2BHK with balcony, power backup, AC, washing machine, and covered 4-wheeler parking.',
    contactName: 'Ananya & Ashwin',
    contactPhone: '+91 97455 88990',
    contactEmail: 'ananya.tech@example.com',
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    isVerifiedBuyer: true,
    createdAt: 'Yesterday',
    isSaved: false
  },
  {
    id: 'req-3',
    title: '5 to 10 Cents Residential Plot for Construction',
    requirementType: 'Buy',
    propertyCategory: 'Plot / Land',
    preferredLocations: ['Kowdiar', 'Pattom', 'Sasthamangalam', 'Peroorkada'],
    city: 'Trivandrum',
    minBudget: 4000000,
    maxBudget: 8000000,
    budgetFormatted: '₹40 Lakhs - ₹80 Lakhs',
    timeline: 'Within 3 Months',
    specificNeeds: 'Level dry land with minimum 4-meter tar road access, clear title deed, and corporation water connection.',
    contactName: 'K. S. Balakrishnan',
    contactPhone: '+91 94470 55667',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    isVerifiedBuyer: true,
    createdAt: '3 days ago',
    isSaved: false
  },
  {
    id: 'req-4',
    title: 'Commercial Office Space for CA Firm',
    requirementType: 'Rent',
    propertyCategory: 'Office Space',
    preferredLocations: ['Mavoor Road', 'Link Road', 'Palayam'],
    city: 'Kozhikode',
    minBudget: 30000,
    maxBudget: 55000,
    budgetFormatted: '₹30,000 - ₹55,000 / mo',
    minAreaSqFt: 1200,
    furnishing: 'Semi-Furnished',
    timeline: 'Immediate',
    specificNeeds: 'First or second floor with elevator, road visibility, visitor parking, and partitioned cabins preferred.',
    contactName: 'Adv. Harish Kumar & Associates',
    contactPhone: '+91 98950 11223',
    contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    isVerifiedBuyer: true,
    createdAt: '4 days ago',
    isSaved: false
  }
];

export async function getCloudPropertyRequirements(): Promise<PropertyRequirement[]> {
  try {
    const local = localStorage.getItem(PROPERTY_REQUIREMENTS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  if (supabase && !isTestEnv) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('property_requirements').select('*').order('created_at', { ascending: false }),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1000))
      ]);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }
  }

  // Save default initial requirements to localStorage
  try {
    localStorage.setItem(PROPERTY_REQUIREMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PROPERTY_REQUIREMENTS));
  } catch {}

  return [...INITIAL_PROPERTY_REQUIREMENTS];
}

export async function createCloudPropertyRequirement(
  newReq: Omit<PropertyRequirement, 'id'> | PropertyRequirement
): Promise<PropertyRequirement[]> {
  const reqId = ('id' in newReq && newReq.id) ? newReq.id : `req-${Date.now()}`;
  const fullReq: PropertyRequirement = {
    ...newReq,
    id: reqId,
    createdAt: newReq.createdAt || 'Just now',
    isSaved: false
  };

  let currentList = await getCloudPropertyRequirements();
  currentList = [fullReq, ...currentList.filter(r => r.id !== reqId)];

  try {
    localStorage.setItem(PROPERTY_REQUIREMENTS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await Promise.race([
        supabase.from('property_requirements').insert({
          id: reqId,
          title: fullReq.title,
          requirement_type: fullReq.requirementType,
          property_category: fullReq.propertyCategory,
          preferred_locations: fullReq.preferredLocations,
          city: fullReq.city,
          min_budget: fullReq.minBudget,
          max_budget: fullReq.maxBudget,
          budget_formatted: fullReq.budgetFormatted,
          bedrooms: fullReq.bedrooms,
          bathrooms: fullReq.bathrooms,
          min_area_sqft: fullReq.minAreaSqFt,
          furnishing: fullReq.furnishing,
          timeline: fullReq.timeline,
          specific_needs: fullReq.specificNeeds,
          contact_name: fullReq.contactName,
          contact_phone: fullReq.contactPhone,
          contact_email: fullReq.contactEmail,
          contact_avatar: fullReq.contactAvatar,
          is_verified_buyer: fullReq.isVerifiedBuyer,
          posted_by_user_id: fullReq.postedByUserId
        }),
        new Promise((res) => setTimeout(res, 1000))
      ]);
    } catch {}
  }

  return currentList;
}

export async function deleteCloudPropertyRequirement(id: string): Promise<PropertyRequirement[]> {
  let currentList = await getCloudPropertyRequirements();
  currentList = currentList.filter(r => r.id !== id);

  try {
    localStorage.setItem(PROPERTY_REQUIREMENTS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await Promise.race([
        supabase.from('property_requirements').delete().eq('id', id),
        new Promise((res) => setTimeout(res, 1000))
      ]);
    } catch {}
  }

  return currentList;
}

export async function toggleCloudSaveRequirement(id: string): Promise<PropertyRequirement[]> {
  let currentList = await getCloudPropertyRequirements();
  currentList = currentList.map(r => r.id === id ? { ...r, isSaved: !r.isSaved } : r);

  try {
    localStorage.setItem(PROPERTY_REQUIREMENTS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  return currentList;
}

/* ==================== MATRIMONY CLOUD APIS ==================== */
const MATRIMONY_PROFILES_STORAGE_KEY = 'ADITI_SUPER_APP_MATRIMONY_PROFILES';

const INITIAL_MATRIMONY_PROFILES: MatrimonyProfile[] = [
  {
    id: 'mat-1',
    name: 'Dr. Ananya Nair',
    age: 26,
    gender: 'Female',
    height: "5' 5\" (165 cm)",
    profession: 'Senior Resident Doctor (MBBS, MD)',
    education: 'MBBS, MD Pediatrics - Govt. Medical College Kozhikode',
    city: 'Kozhikode',
    state: 'Kerala',
    religion: 'Hindu',
    community: 'Nair',
    motherTongue: 'Malayalam',
    zodiac: 'Cancer (Karkidakam)',
    nakshatra: 'Rohini',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'],
    about: 'Doctor working at a multispecialty hospital in Calicut. Passionate about child healthcare, Carnatic music, and reading. Looking for an understanding, family-loving life partner.',
    partnerPreferences: 'Doctor, Engineer, or Civil Services professional from a good family background.',
    annualIncome: '₹18 Lakhs - ₹24 Lakhs',
    isVerified: true,
    postedFor: 'Self',
    maritalStatus: 'Never Married',
    familyDetails: 'Nuclear family. Father Retired Bank Manager, Mother High School Teacher, younger brother doing B.Tech.',
    diet: 'Vegetarian',
    contactPhone: '+91 98471 44556',
    contactEmail: 'dr.ananya.nair@example.com',
    compatibilityScore: 96,
    interestSent: false,
    isShortlisted: false
  },
  {
    id: 'mat-2',
    name: 'Rahul Menon',
    age: 29,
    gender: 'Male',
    height: "5' 11\" (180 cm)",
    profession: 'Lead Cloud Solutions Architect',
    education: 'B.Tech Computer Science (NIT Calicut), MS (TU Munich)',
    city: 'Kochi (Ernakulam)',
    state: 'Kerala',
    religion: 'Hindu',
    community: 'Menon',
    motherTongue: 'Malayalam',
    zodiac: 'Taurus (Edavam)',
    nakshatra: 'Makam',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'],
    about: 'Tech enthusiast leading cloud architecture at a global consulting firm in InfoPark Kochi. Enjoys badminton, long drives, photography, and weekend cooking.',
    partnerPreferences: 'Educated professional with progressive mindset, career aspirations, and good moral values.',
    annualIncome: '₹35 Lakhs - ₹45 Lakhs',
    isVerified: true,
    postedFor: 'Self',
    maritalStatus: 'Never Married',
    familyDetails: 'Upper Middle Class. Father Business, Mother Homemaker, Elder sister married and settled in UK.',
    diet: 'Non-Vegetarian',
    contactPhone: '+91 94470 88990',
    contactEmail: 'rahul.menon.tech@example.com',
    compatibilityScore: 92,
    interestSent: false,
    isShortlisted: false
  },
  {
    id: 'mat-3',
    name: 'Dr. Fathima Zahra',
    age: 27,
    gender: 'Female',
    height: "5' 4\" (162 cm)",
    profession: 'Dental Surgeon (BDS)',
    education: 'BDS - Yenepoya Dental College Mangalore',
    city: 'Kannur',
    state: 'Kerala',
    religion: 'Muslim',
    community: 'Sunni',
    motherTongue: 'Malayalam',
    zodiac: 'Virgo (Kanni)',
    nakshatra: 'Chithira',
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'],
    about: 'Practicing Dental Surgeon with own clinic in Kannur. Believes in simple living, Islamic values, travel, and spending quality time with family.',
    partnerPreferences: 'Doctor, Engineer, or well-settled Businessman in India or Gulf.',
    annualIncome: '₹14 Lakhs - ₹20 Lakhs',
    isVerified: true,
    postedFor: 'Son',
    maritalStatus: 'Never Married',
    familyDetails: 'Respected business family in Thalassery. Father Exporter, Mother Homemaker.',
    diet: 'Non-Vegetarian',
    contactPhone: '+91 97455 11223',
    contactEmail: 'fathima.zahra.dent@example.com',
    compatibilityScore: 89,
    interestSent: false,
    isShortlisted: false
  },
  {
    id: 'mat-4',
    name: 'Geevarghese Thomas',
    age: 30,
    gender: 'Male',
    height: "6' 0\" (183 cm)",
    profession: 'Product Manager',
    education: 'B.Tech (CET Trivandrum), MBA (IIM Kozhikode)',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    religion: 'Christian',
    community: 'Roman Catholic (Syrian)',
    motherTongue: 'Malayalam',
    zodiac: 'Leo (Chingam)',
    nakshatra: 'Uthram',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80'],
    about: 'Product leader at a high-growth fintech startup. Loves hiking in Western Ghats, playing violin, and reading economic history. Looking for an ambitious and cheerful partner.',
    partnerPreferences: 'Professionally qualified Christian bride (Tech, Management, Banking, Medicine).',
    annualIncome: '₹40 Lakhs - ₹50 Lakhs',
    isVerified: true,
    postedFor: 'Self',
    maritalStatus: 'Never Married',
    familyDetails: 'Traditional Syrian Catholic family settled in Trivandrum. Parents both retired Professors.',
    diet: 'Non-Vegetarian',
    contactPhone: '+91 98950 33445',
    contactEmail: 'geevarghese.thomas@example.com',
    compatibilityScore: 94,
    interestSent: false,
    isShortlisted: false
  }
];

export async function getCloudMatrimonyProfiles(): Promise<MatrimonyProfile[]> {
  try {
    const local = localStorage.getItem(MATRIMONY_PROFILES_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('matrimony_profiles').select('*').eq('is_active', true),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1000))
      ]);
      if (!error && data && data.length > 0) return data;
    } catch {}
  }

  try {
    localStorage.setItem(MATRIMONY_PROFILES_STORAGE_KEY, JSON.stringify(INITIAL_MATRIMONY_PROFILES));
  } catch {}

  return [...INITIAL_MATRIMONY_PROFILES];
}

export async function createCloudMatrimonyProfile(
  newProfile: Omit<MatrimonyProfile, 'id'> | MatrimonyProfile
): Promise<MatrimonyProfile[]> {
  const profileId = ('id' in newProfile && newProfile.id) ? newProfile.id : `mat-${Date.now()}`;
  const fullProfile: MatrimonyProfile = {
    ...newProfile,
    id: profileId,
    compatibilityScore: newProfile.compatibilityScore || 90,
    interestSent: false,
    isShortlisted: false,
    createdAt: newProfile.createdAt || 'Just now',
    isVerified: newProfile.isVerified ?? true
  };

  let currentList = await getCloudMatrimonyProfiles();
  currentList = [fullProfile, ...currentList.filter(m => m.id !== profileId)];

  try {
    localStorage.setItem(MATRIMONY_PROFILES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await Promise.race([
        supabase.from('matrimony_profiles').insert({
          id: profileId,
          name: fullProfile.name,
          age: fullProfile.age,
          gender: fullProfile.gender,
          height: fullProfile.height,
          profession: fullProfile.profession,
          education: fullProfile.education,
          city: fullProfile.city,
          state: fullProfile.state,
          religion: fullProfile.religion,
          community: fullProfile.community,
          mother_tongue: fullProfile.motherTongue,
          zodiac: fullProfile.zodiac,
          photos: fullProfile.photos,
          about: fullProfile.about,
          partner_preferences: fullProfile.partnerPreferences,
          annual_income: fullProfile.annualIncome,
          is_verified: fullProfile.isVerified,
          is_active: true
        }),
        new Promise((res) => setTimeout(res, 1000))
      ]);
    } catch {}
  }

  return currentList;
}

export async function deleteCloudMatrimonyProfile(id: string): Promise<MatrimonyProfile[]> {
  let currentList = await getCloudMatrimonyProfiles();
  currentList = currentList.filter(m => m.id !== id);

  try {
    localStorage.setItem(MATRIMONY_PROFILES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await Promise.race([
        supabase.from('matrimony_profiles').delete().eq('id', id),
        new Promise((res) => setTimeout(res, 1000))
      ]);
    } catch {}
  }

  return currentList;
}

export async function sendCloudInterestToMatrimony(recipientUserId: string): Promise<MatrimonyProfile[]> {
  let currentList = await getCloudMatrimonyProfiles();
  currentList = currentList.map(m =>
    m.id === recipientUserId ? { ...m, interestSent: true } : m
  );

  try {
    localStorage.setItem(MATRIMONY_PROFILES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      const { data: authData } = await Promise.race([
        supabase.auth.getUser(),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: { user: null }, error: 'timeout' }), 1000))
      ]);
      if (authData?.user) {
        await supabase.from('matrimony_interests').insert({
          sender_id: authData.user.id,
          recipient_id: recipientUserId,
          status: 'sent'
        });
      }
    } catch {}
  }

  return currentList;
}

export async function toggleCloudShortlistMatrimony(id: string): Promise<MatrimonyProfile[]> {
  let currentList = await getCloudMatrimonyProfiles();
  currentList = currentList.map(m =>
    m.id === id ? { ...m, isShortlisted: !m.isShortlisted } : m
  );

  try {
    localStorage.setItem(MATRIMONY_PROFILES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  return currentList;
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

export const FRIEND_REQUESTS_STORAGE_KEY = 'aditi-friend-requests';

export function getLocalFriendRequests(): FriendRequest[] {
  try {
    const raw = localStorage.getItem(FRIEND_REQUESTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalFriendRequest(req: FriendRequest): void {
  try {
    const existing = getLocalFriendRequests();
    const filtered = existing.filter((r) => r.id !== req.id);
    filtered.push(req);
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to save friend request to local storage:', err);
  }
}

export function updateLocalFriendRequestStatus(requestId: string, status: 'pending' | 'accepted' | 'declined'): void {
  try {
    const existing = getLocalFriendRequests();
    const updated = existing.map((r) => (r.id === requestId ? { ...r, status } : r));
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to update friend request in local storage:', err);
  }
}

export function removeLocalFriendRequest(filter: { id?: string; fromUserId?: string; toUserId?: string }): void {
  try {
    const existing = getLocalFriendRequests();
    const filtered = existing.filter((r) => {
      if (filter.id && r.id === filter.id) return false;
      if (
        filter.fromUserId &&
        filter.toUserId &&
        ((r.fromUserId === filter.fromUserId && r.toUserId === filter.toUserId) ||
         (r.fromUserId === filter.toUserId && r.toUserId === filter.fromUserId))
      ) {
        return false;
      }
      return true;
    });
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to remove friend request from local storage:', err);
  }
}

const FRIENDS_STORAGE_KEY = 'ADITI_SUPER_APP_FRIENDS_STORAGE';

export function getLocalFriends(): string[] {
  try {
    const raw = localStorage.getItem(FRIENDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isCloudFriend(friendId: string): boolean {
  const list = getLocalFriends();
  return list.includes(friendId);
}

export async function sendCloudFriendRequest(req: FriendRequest): Promise<void> {
  saveLocalFriendRequest(req);
  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('friendships').upsert({
        user_id: authData.user.id,
        friend_id: req.toUserId,
        status: 'pending'
      });
    }
  }
}

export async function acceptCloudFriendRequest(reqId: string, fromUserId: string, toUserId: string): Promise<void> {
  updateLocalFriendRequestStatus(reqId, 'accepted');
  await addCloudFriend(fromUserId);
  await addCloudFriend(toUserId);
  if (supabase) {
    await supabase.from('friendships')
      .update({ status: 'accepted' })
      .or(`and(user_id.eq.${fromUserId},friend_id.eq.${toUserId}),and(user_id.eq.${toUserId},friend_id.eq.${fromUserId})`);
  }
}

export async function declineCloudFriendRequest(reqId: string, fromUserId?: string, toUserId?: string): Promise<void> {
  updateLocalFriendRequestStatus(reqId, 'declined');
  if (fromUserId && toUserId) {
    removeLocalFriendRequest({ fromUserId, toUserId });
  }
  if (supabase) {
    await supabase.from('friendships')
      .delete()
      .or(`and(user_id.eq.${fromUserId},friend_id.eq.${toUserId}),and(user_id.eq.${toUserId},friend_id.eq.${fromUserId})`);
  }
}

export async function cancelCloudFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
  removeLocalFriendRequest({ fromUserId, toUserId });
  if (supabase) {
    await supabase.from('friendships')
      .delete()
      .match({ user_id: fromUserId, friend_id: toUserId, status: 'pending' });
  }
}

export async function addCloudFriend(friendId: string): Promise<void> {
  try {
    const list = getLocalFriends();
    if (!list.includes(friendId)) {
      list.push(friendId);
      localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.warn('Failed to save friend locally:', err);
  }

  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('friendships').upsert({
        user_id: authData.user.id,
        friend_id: friendId,
        status: 'accepted'
      });
    }
  }
}

export async function removeCloudFriend(friendId: string): Promise<void> {
  try {
    const list = getLocalFriends();
    const filtered = list.filter((id) => id !== friendId);
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to remove friend locally:', err);
  }

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

/* ==================== JOB PORTAL & LOCAL WORKER SERVICES ==================== */
export const JOB_VACANCIES_STORAGE_KEY = 'aditi-job-vacancies';
export const JOB_SEEKERS_STORAGE_KEY = 'aditi-job-seekers';
export const LOCAL_WORKERS_STORAGE_KEY = 'aditi-local-workers';

export const INITIAL_JOB_VACANCIES: JobVacancy[] = [
  {
    id: 'job-infopark-1',
    title: 'DevOps & Cloud Infrastructure Lead',
    company: 'Thinkpalm Technologies Pvt. Ltd',
    category: 'Technology & IT',
    subcategory: 'DevOps & Cloud',
    jobType: 'Full-time',
    workMode: 'hybrid',
    location: 'Athulya Building, Infopark Phase 1, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0104,
    longitude: 76.3639,
    isRemote: false,
    salaryMin: 90000,
    salaryMax: 150000,
    salaryPeriod: 'month',
    salaryFormatted: '₹90,000 - ₹1,50,000 / mo',
    experienceRequired: '5-8 Years',
    qualificationRequired: 'B.Tech / BE / MCA in Computer Science or IT',
    description: 'Lead enterprise cloud migration, CI/CD pipeline automation, containerization with Kubernetes/Docker, and Datadog/Prometheus monitoring for telecom and IoT products at Infopark Kochi.',
    responsibilities: [
      'Architect and maintain high-availability AWS and Azure cloud architectures',
      'Manage CI/CD automation pipelines with GitHub Actions and GitLab CI',
      'Oversee multi-node Kubernetes clusters and container orchestration',
      'Implement zero-trust security, Datadog observability, and cost optimization'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Datadog', 'Linux RHEL'],
    contactName: 'HR Talent Team',
    contactEmail: 'careers@thinkpalm.com',
    contactAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    openingsCount: 3,
    isUrgent: true,
    isFeatured: true,
    isVerified: true,
    applicationCount: 14,
    viewCount: 280,
    status: 'active',
    isSaved: false,
    createdAt: 'Today'
  },
  {
    id: 'job-infopark-2',
    title: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'Tecforz Innovations Pvt Ltd',
    category: 'Technology & IT',
    subcategory: 'Frontend Engineering',
    jobType: 'Full-time',
    workMode: 'hybrid',
    location: 'Carnival Infopark, Phase 2, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0125,
    longitude: 76.3685,
    isRemote: true,
    salaryMin: 80000,
    salaryMax: 130000,
    salaryPeriod: 'month',
    salaryFormatted: '₹80,000 - ₹1,30,000 / mo',
    experienceRequired: '4-7 Years',
    qualificationRequired: 'B.Tech / BCA / MCA / B.Sc Computer Science',
    description: 'Design and engineer mission-critical, high-performance web applications using React 18, TypeScript, TailwindCSS, and Next.js for global fintech and SaaS clients.',
    responsibilities: [
      'Develop pixel-perfect, accessible UI components with Tailwind CSS & Shadcn/UI',
      'Optimize web vitals, state management with Zustand/Redux Toolkit, and GraphQL client caching',
      'Write robust unit and integration tests using Vitest and React Testing Library'
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'GraphQL', 'Redux Toolkit', 'Vitest'],
    contactName: 'Talent Acquisition Team',
    contactEmail: 'hr@tecforz.com',
    contactAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    openingsCount: 2,
    isUrgent: true,
    isFeatured: true,
    isVerified: true,
    applicationCount: 19,
    viewCount: 310,
    status: 'active',
    isSaved: false,
    createdAt: 'Today'
  },
  {
    id: 'job-infopark-3',
    title: 'Flutter & Cross-Platform Mobile Engineer',
    company: 'Panasa Technology',
    category: 'Technology & IT',
    subcategory: 'Mobile App Development',
    jobType: 'Full-time',
    workMode: 'onsite',
    location: 'Thapasya Building, Infopark Phase 1, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0118,
    longitude: 76.3622,
    isRemote: false,
    salaryMin: 45000,
    salaryMax: 70000,
    salaryPeriod: 'month',
    salaryFormatted: '₹45,000 - ₹70,000 / mo',
    experienceRequired: '2-4 Years',
    qualificationRequired: 'B.Tech / BCA / MCA',
    description: 'Build native-feel iOS and Android consumer mobile applications using Flutter & Dart. Integrate with RESTful microservices, push notifications, and payment gateways.',
    responsibilities: [
      'Build reusable Flutter UI components with Bloc or Riverpod architecture',
      'Integrate Firebase Cloud Messaging, Razorpay/Stripe, and offline SQLite synchronization',
      'Manage end-to-end Google Play Console and Apple App Store deployment pipelines'
    ],
    skills: ['Flutter', 'Dart', 'Bloc', 'REST APIs', 'Firebase', 'App Store Deployment'],
    contactName: 'HR Operations',
    contactEmail: 'careers@panasatech.com',
    contactAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    openingsCount: 2,
    isUrgent: false,
    isFeatured: true,
    isVerified: true,
    applicationCount: 8,
    viewCount: 165,
    status: 'active',
    isSaved: false,
    createdAt: 'Yesterday'
  },
  {
    id: 'job-infopark-4',
    title: 'Lead Generative AI & Machine Learning Engineer',
    company: 'Experion Technologies',
    category: 'Technology & IT',
    subcategory: 'Artificial Intelligence & Data Science',
    jobType: 'Full-time',
    workMode: 'hybrid',
    location: 'Vismaya Building, Infopark Phase 1, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0131,
    longitude: 76.3644,
    isRemote: true,
    salaryMin: 110000,
    salaryMax: 180000,
    salaryPeriod: 'month',
    salaryFormatted: '₹1,10,000 - ₹1,80,000 / mo (₹14 - ₹22 LPA)',
    experienceRequired: '4-8 Years',
    qualificationRequired: 'B.Tech / M.Tech in Computer Science / AI & ML',
    description: 'Design generative AI agents, LLM orchestration pipelines (LangChain/LlamaIndex), RAG systems with vector databases, and fine-tune open-weight models for enterprise automation.',
    responsibilities: [
      'Develop Retrieval-Augmented Generation (RAG) applications using Pinecone and ChromaDB',
      'Build multi-agent AI workflows and evaluate LLM responses using benchmark suites',
      'Deploy low-latency AI inference endpoints on AWS SageMaker and GCP Vertex AI'
    ],
    skills: ['Python', 'LangChain', 'LlamaIndex', 'Vector Databases', 'PyTorch', 'FastAPI', 'AWS SageMaker'],
    contactName: 'Engineering Talent Team',
    contactEmail: 'talent@experionglobal.com',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    openingsCount: 3,
    isUrgent: true,
    isFeatured: true,
    isVerified: true,
    applicationCount: 22,
    viewCount: 420,
    status: 'active',
    isSaved: false,
    createdAt: 'Today'
  },
  {
    id: 'job-infopark-5',
    title: 'Full Stack .NET Core & Angular Engineer',
    company: 'AlignMinds Technologies',
    category: 'Technology & IT',
    subcategory: 'Enterprise Software',
    jobType: 'Full-time',
    workMode: 'hybrid',
    location: 'Lulu Cyber Tower 2, Infopark Phase 2, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0152,
    longitude: 76.3712,
    isRemote: false,
    salaryMin: 55000,
    salaryMax: 85000,
    salaryPeriod: 'month',
    salaryFormatted: '₹55,000 - ₹85,000 / mo',
    experienceRequired: '3-5 Years',
    qualificationRequired: 'B.Tech / MCA / M.Sc Computer Science',
    description: 'Build robust enterprise microservices using C#, ASP.NET Core Web API, Entity Framework, PostgreSQL/SQL Server, paired with reactive Angular 17+ frontends.',
    responsibilities: [
      'Develop modular ASP.NET Core REST APIs with clean architecture and CQRS patterns',
      'Implement responsive Angular standalone components with RxJS state streams',
      'Write automated integration tests and optimize database query plans'
    ],
    skills: ['C#', '.NET Core', 'Angular', 'SQL Server', 'Entity Framework', 'Azure', 'Microservices'],
    contactName: 'Talent Acquisition Team',
    contactEmail: 'careers@alignminds.com',
    contactAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
    openingsCount: 4,
    isUrgent: false,
    isFeatured: true,
    isVerified: true,
    applicationCount: 11,
    viewCount: 210,
    status: 'active',
    isSaved: false,
    createdAt: '2 days ago'
  },
  {
    id: 'job-infopark-6',
    title: 'Performance Marketing & Growth Specialist',
    company: 'Inspite Technologies Pvt. Ltd',
    category: 'Sales & Marketing',
    subcategory: 'Digital Growth & Ads',
    jobType: 'Full-time',
    workMode: 'onsite',
    location: 'Infopark Phase 1, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0108,
    longitude: 76.3631,
    isRemote: false,
    salaryMin: 35000,
    salaryMax: 55000,
    salaryPeriod: 'month',
    salaryFormatted: '₹35,000 - ₹55,000 / mo + Performance Bonus',
    experienceRequired: '2-4 Years',
    qualificationRequired: 'Any Graduate / BBA / MBA in Marketing',
    description: 'Drive multi-channel digital performance marketing campaigns across Meta Ads, Google Search & Display, LinkedIn Ads, and conversion rate optimization (CRO) for international B2B SaaS accounts.',
    responsibilities: [
      'Manage $50k+ monthly ad spend across Google Ads and Meta Ads Manager',
      'Run rigorous A/B experiments on landing pages and ad copy to lower customer acquisition cost (CAC)',
      'Analyze funnel analytics using GA4, Mixpanel, and Google Tag Manager'
    ],
    skills: ['Google Ads', 'Meta Ads', 'SEO', 'GA4 Analytics', 'Conversion Rate Optimization', 'Copywriting'],
    contactName: 'Growth Hiring Desk',
    contactEmail: 'jobs@inspitetech.com',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    openingsCount: 2,
    isUrgent: true,
    isFeatured: true,
    isVerified: true,
    applicationCount: 16,
    viewCount: 295,
    status: 'active',
    isSaved: false,
    createdAt: 'Today'
  },
  {
    id: 'job-infopark-7',
    title: 'Customer Experience & International Tech Support Associate',
    company: 'Speridian Technologies Pvt Ltd',
    category: 'Technology & IT',
    subcategory: 'Customer Support & Client Ops',
    jobType: 'Full-time',
    workMode: 'onsite',
    location: 'Infopark Phase 1, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0112,
    longitude: 76.3635,
    isRemote: false,
    salaryMin: 28000,
    salaryMax: 40000,
    salaryPeriod: 'month',
    salaryFormatted: '₹28,000 - ₹40,000 / mo + Night Shift Allowance',
    experienceRequired: '0-2 Years (Freshers with Excellent English Welcome)',
    qualificationRequired: 'Any Degree (B.Tech / B.Sc / BCA / B.Com / BA)',
    description: 'Provide tier-1 and tier-2 technical resolution, CRM ticket handling, and omnichannel customer communication (email, chat, phone) for North American enterprise clients.',
    responsibilities: [
      'Troubleshoot software application issues and escalate complex bugs with detailed reproduction steps',
      'Maintain >95% CSAT score and adherence to SLA response thresholds',
      'Document knowledge base articles and common troubleshooting workflows'
    ],
    skills: ['English Communication', 'Technical Support', 'CRM Ticketing', 'ITIL', 'Problem Solving'],
    contactName: 'HR Sourcing Team',
    contactEmail: 'careers.kochi@speridian.com',
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    openingsCount: 8,
    isUrgent: true,
    isFeatured: false,
    isVerified: true,
    applicationCount: 35,
    viewCount: 520,
    status: 'active',
    isSaved: false,
    createdAt: 'Yesterday'
  },
  {
    id: 'job-infopark-8',
    title: 'IT Talent Acquisition & HR Executive',
    company: 'Inspite Technologies Pvt. Ltd',
    category: 'Technology & IT',
    subcategory: 'Human Resources',
    jobType: 'Full-time',
    workMode: 'onsite',
    location: 'Infopark Phase 1, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0108,
    longitude: 76.3631,
    isRemote: false,
    salaryMin: 25000,
    salaryMax: 42000,
    salaryPeriod: 'month',
    salaryFormatted: '₹25,000 - ₹42,000 / mo',
    experienceRequired: '1-3 Years',
    qualificationRequired: 'MBA HR / MHRM / MSW / BBA',
    description: 'Manage full recruitment lifecycle for software developers, QA engineers, and cloud architects. Conduct preliminary HR rounds, coordinate technical evaluations, and manage onboarding.',
    responsibilities: [
      'Source tech talent via LinkedIn Recruiter, Naukri, and developer communities',
      'Conduct initial screening interviews and salary negotiations',
      'Drive employee engagement programs and performance appraisal cycles'
    ],
    skills: ['Technical Recruiting', 'LinkedIn Sourcing', 'HR Operations', 'Employee Onboarding', 'Payroll'],
    contactName: 'HR Recruitment Desk',
    contactEmail: 'hr@inspitetech.com',
    contactAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    openingsCount: 2,
    isUrgent: true,
    isFeatured: false,
    isVerified: true,
    applicationCount: 12,
    viewCount: 240,
    status: 'active',
    isSaved: false,
    createdAt: 'Today'
  },
  {
    id: 'job-infopark-9',
    title: 'Senior QA Automation Engineer (Playwright / Cypress)',
    company: 'Grapelime Innovations Private Limited',
    category: 'Technology & IT',
    subcategory: 'Quality Assurance',
    jobType: 'Full-time',
    workMode: 'hybrid',
    location: 'Infopark Phase 2, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0142,
    longitude: 76.3698,
    isRemote: true,
    salaryMin: 60000,
    salaryMax: 90000,
    salaryPeriod: 'month',
    salaryFormatted: '₹60,000 - ₹90,000 / mo',
    experienceRequired: '3-6 Years',
    qualificationRequired: 'B.Tech / BCA / MCA in Computer Science',
    description: 'Design and execute robust automated end-to-end and API testing suites using Playwright, Cypress, TypeScript, and Postman. Integrate test runs into CI/CD build gates.',
    responsibilities: [
      'Author scalable test automation frameworks in TypeScript with Playwright',
      'Execute REST and GraphQL API contract and security testing',
      'Perform load and stress testing using k6 / JMeter'
    ],
    skills: ['Playwright', 'Cypress', 'TypeScript', 'Postman API Testing', 'CI/CD Pipelines', 'k6 Load Testing'],
    contactName: 'QA Engineering Desk',
    contactEmail: 'careers@grapelime.in',
    contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    openingsCount: 3,
    isUrgent: false,
    isFeatured: true,
    isVerified: true,
    applicationCount: 15,
    viewCount: 290,
    status: 'active',
    isSaved: false,
    createdAt: 'Yesterday'
  },
  {
    id: 'job-infopark-10',
    title: 'Cloud Data Center & Network Security Lead',
    company: 'Penguin Data Centre Pvt. Ltd',
    category: 'Technology & IT',
    subcategory: 'IT Infrastructure & Security',
    jobType: 'Full-time',
    workMode: 'onsite',
    location: 'Infopark Phase 1, Kakkanad',
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682042',
    latitude: 10.0105,
    longitude: 76.3640,
    isRemote: false,
    salaryMin: 75000,
    salaryMax: 115000,
    salaryPeriod: 'month',
    salaryFormatted: '₹75,000 - ₹1,15,000 / mo',
    experienceRequired: '5-9 Years',
    qualificationRequired: 'B.Tech / BE Electronics / CS with CCNA / CCNP / CISSP',
    description: 'Manage mission-critical data center network infrastructure, Fortinet/Palo Alto enterprise firewalls, SAN/NAS storage arrays, and ISO 27001 cybersecurity compliance at Infopark Kochi.',
    responsibilities: [
      'Configure Cisco BGP routing, VLANs, spine-leaf switching, and VPN tunnels',
      'Manage next-gen enterprise firewalls and intrusion prevention systems (IPS)',
      'Conduct regular vulnerability assessments and incident response drills'
    ],
    skills: ['Cisco Routing & Switching', 'Fortinet Firewalls', 'Linux Server Admin', 'Network Security', 'ISO 27001'],
    contactName: 'Infrastructure HR Desk',
    contactEmail: 'noc.careers@penguindc.com',
    contactAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    openingsCount: 2,
    isUrgent: true,
    isFeatured: true,
    isVerified: true,
    applicationCount: 9,
    viewCount: 180,
    status: 'active',
    isSaved: false,
    createdAt: 'Today'
  }
];

export const INITIAL_JOB_SEEKERS: JobSeekerProfile[] = [];

export const INITIAL_LOCAL_WORKERS: LocalWorkerProfile[] = [];

/* ===== Job Vacancies CRUD ===== */
export async function getCloudJobVacancies(): Promise<JobVacancy[]> {
  try {
    const local = localStorage.getItem(JOB_VACANCIES_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        // Filter out legacy dummy entries
        const clean = parsed.filter((j: JobVacancy) => !['job-1', 'job-2', 'job-3', 'job-4', 'job-5'].includes(j.id));
        if (clean.length > 0) return clean;
      }
    }
  } catch {}

  try {
    localStorage.setItem(JOB_VACANCIES_STORAGE_KEY, JSON.stringify(INITIAL_JOB_VACANCIES));
  } catch {}

  return [...INITIAL_JOB_VACANCIES];
}

export async function createCloudJobVacancy(
  newJob: Omit<JobVacancy, 'id'> | JobVacancy
): Promise<JobVacancy[]> {
  const jobId = ('id' in newJob && newJob.id) ? newJob.id : `job-${Date.now()}`;
  const fullJob: JobVacancy = {
    ...newJob,
    id: jobId,
    createdAt: newJob.createdAt || 'Just now',
    isSaved: false
  };

  let currentList = await getCloudJobVacancies();
  currentList = [fullJob, ...currentList.filter(j => j.id !== jobId)];

  try {
    localStorage.setItem(JOB_VACANCIES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_vacancies').upsert([fullJob]);
    } catch {}
  }

  return currentList;
}

export async function deleteCloudJobVacancy(id: string): Promise<JobVacancy[]> {
  let currentList = await getCloudJobVacancies();
  currentList = currentList.filter(j => j.id !== id);

  try {
    localStorage.setItem(JOB_VACANCIES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_vacancies').delete().eq('id', id);
    } catch {}
  }

  return currentList;
}

export async function toggleCloudSaveJob(id: string): Promise<JobVacancy[]> {
  let currentList = await getCloudJobVacancies();
  currentList = currentList.map(j => j.id === id ? { ...j, isSaved: !j.isSaved } : j);

  try {
    localStorage.setItem(JOB_VACANCIES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  return currentList;
}

/* ===== Job Seekers CRUD ===== */
export async function getCloudJobSeekers(): Promise<JobSeekerProfile[]> {
  try {
    const local = localStorage.getItem(JOB_SEEKERS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        // Filter out legacy dummy seeker ids
        const clean = parsed.filter((s: JobSeekerProfile) => !['seeker-1', 'seeker-2', 'seeker-3', 'seeker-4'].includes(s.id));
        return clean;
      }
    }
  } catch {}

  return [];
}

export async function createCloudJobSeeker(
  newSeeker: Omit<JobSeekerProfile, 'id'> | JobSeekerProfile
): Promise<JobSeekerProfile[]> {
  const seekerId = ('id' in newSeeker && newSeeker.id) ? newSeeker.id : `seeker-${Date.now()}`;
  const fullSeeker: JobSeekerProfile = {
    ...newSeeker,
    id: seekerId,
    createdAt: newSeeker.createdAt || 'Just now',
    isSaved: false
  };

  let currentList = await getCloudJobSeekers();
  currentList = [fullSeeker, ...currentList.filter(s => s.id !== seekerId)];

  try {
    localStorage.setItem(JOB_SEEKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_seekers').upsert([fullSeeker]);
    } catch {}
  }

  return currentList;
}

export async function deleteCloudJobSeeker(id: string): Promise<JobSeekerProfile[]> {
  let currentList = await getCloudJobSeekers();
  currentList = currentList.filter(s => s.id !== id);

  try {
    localStorage.setItem(JOB_SEEKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_seekers').delete().eq('id', id);
    } catch {}
  }

  return currentList;
}

export async function toggleCloudSaveJobSeeker(id: string): Promise<JobSeekerProfile[]> {
  let currentList = await getCloudJobSeekers();
  currentList = currentList.map(s => s.id === id ? { ...s, isSaved: !s.isSaved } : s);

  try {
    localStorage.setItem(JOB_SEEKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  return currentList;
}

/* ===== Local Workers CRUD ===== */
export async function getCloudLocalWorkers(): Promise<LocalWorkerProfile[]> {
  try {
    const local = localStorage.getItem(LOCAL_WORKERS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        // Filter out legacy dummy worker ids
        const clean = parsed.filter((w: LocalWorkerProfile) => !['worker-1', 'worker-2', 'worker-3', 'worker-4', 'worker-5', 'worker-6'].includes(w.id));
        return clean;
      }
    }
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('local_workers').select('*').order('rating', { ascending: false }),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1000))
      ]);
      if (!error && data && data.length > 0) return data;
    } catch {}
  }

  try {
    localStorage.setItem(LOCAL_WORKERS_STORAGE_KEY, JSON.stringify(INITIAL_LOCAL_WORKERS));
  } catch {}

  return [...INITIAL_LOCAL_WORKERS];
}

export async function createCloudLocalWorker(
  newWorker: Omit<LocalWorkerProfile, 'id'> | LocalWorkerProfile
): Promise<LocalWorkerProfile[]> {
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

  let currentList = await getCloudLocalWorkers();
  currentList = [fullWorker, ...currentList.filter(w => w.id !== workerId)];

  try {
    localStorage.setItem(LOCAL_WORKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('local_workers').upsert([fullWorker]);
    } catch {}
  }

  return currentList;
}

export async function deleteCloudLocalWorker(id: string): Promise<LocalWorkerProfile[]> {
  let currentList = await getCloudLocalWorkers();
  currentList = currentList.filter(w => w.id !== id);

  try {
    localStorage.setItem(LOCAL_WORKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('local_workers').delete().eq('id', id);
    } catch {}
  }

  return currentList;
}

export async function toggleCloudSaveLocalWorker(id: string): Promise<LocalWorkerProfile[]> {
  let currentList = await getCloudLocalWorkers();
  currentList = currentList.map(w => w.id === id ? { ...w, isSaved: !w.isSaved } : w);

  try {
    localStorage.setItem(LOCAL_WORKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  return currentList;
}

export async function updateCloudJobVacancy(
  id: string, 
  updates: Partial<JobVacancy>
): Promise<JobVacancy[]> {
  let currentList = await getCloudJobVacancies();
  currentList = currentList.map(j => j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j);

  try {
    localStorage.setItem(JOB_VACANCIES_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_vacancies').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (err) {
      console.warn('Supabase job_vacancies update error:', err);
    }
  }

  return currentList;
}

export async function updateCloudJobSeeker(
  id: string, 
  updates: Partial<JobSeekerProfile>
): Promise<JobSeekerProfile[]> {
  let currentList = await getCloudJobSeekers();
  currentList = currentList.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s);

  try {
    localStorage.setItem(JOB_SEEKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_seekers').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (err) {
      console.warn('Supabase job_seekers update error:', err);
    }
  }

  return currentList;
}

export async function updateCloudLocalWorker(
  id: string, 
  updates: Partial<LocalWorkerProfile>
): Promise<LocalWorkerProfile[]> {
  let currentList = await getCloudLocalWorkers();
  currentList = currentList.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w);

  try {
    localStorage.setItem(LOCAL_WORKERS_STORAGE_KEY, JSON.stringify(currentList));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('local_workers').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (err) {
      console.warn('Supabase local_workers update error:', err);
    }
  }

  return currentList;
}

/* ==================== APPLICATIONS, BOOKINGS, REVIEWS & MODERATION ==================== */
export const JOB_APPLICATIONS_STORAGE_KEY = 'aditi-job-applications';
export const SERVICE_BOOKINGS_STORAGE_KEY = 'aditi-service-bookings';
export const WORKER_REVIEWS_STORAGE_KEY = 'aditi-worker-reviews';
export const JOB_REPORTS_STORAGE_KEY = 'aditi-job-reports';

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [];
export const INITIAL_SERVICE_BOOKINGS: ServiceBooking[] = [];
export const INITIAL_WORKER_REVIEWS: WorkerReview[] = [];
export const INITIAL_JOB_REPORTS: JobReport[] = [];

/* ===== Applications CRUD ===== */
export async function getCloudJobApplications(userId?: string): Promise<JobApplication[]> {
  let list: JobApplication[] = [];

  if (supabase && !isTestEnv) {
    try {
      let query = supabase.from('job_applications').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`candidateId.eq.${userId},recruiterId.eq.${userId}`);
      }
      const { data, error } = await Promise.race([
        query,
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1200))
      ]);
      if (!error && data) {
        list = data.filter((a: JobApplication) => !['app-1', 'app-2'].includes(a.id));
        try { localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(list)); } catch {}
        return list;
      }
    } catch (err) {
      console.warn('Supabase job_applications query error:', err);
    }
  }

  try {
    const local = localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        list = parsed.filter((a: JobApplication) => !['app-1', 'app-2'].includes(a.id));
      }
    }
  } catch {}

  if (userId) {
    return list.filter(a => a.candidateId === userId || a.recruiterId === userId);
  }
  return list;
}

export async function createCloudJobApplication(
  app: Omit<JobApplication, 'id'> | JobApplication
): Promise<JobApplication[]> {
  const appId = ('id' in app && app.id) ? app.id : `app-${Date.now()}`;
  const fullApp: JobApplication = {
    ...app,
    id: appId,
    appliedAt: app.appliedAt || 'Just now',
    status: app.status || 'Applied'
  };

  let list = await getCloudJobApplications();
  list = [fullApp, ...list.filter(a => a.id !== appId)];

  try {
    localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_applications').upsert([fullApp]);
    } catch (err) {
      console.warn('Supabase job_applications insert error:', err);
    }
  }

  return list;
}

export async function updateCloudJobApplicationStatus(
  id: string,
  status: JobApplicationStatus,
  notes?: string
): Promise<JobApplication[]> {
  let list = await getCloudJobApplications();
  list = list.map(a => {
    if (a.id === id) {
      return {
        ...a,
        status,
        recruiterNotes: notes !== undefined ? notes : a.recruiterNotes,
        updatedAt: 'Just now'
      };
    }
    return a;
  });

  try {
    localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_applications').update({ 
        status, 
        recruiterNotes: notes, 
        updated_at: new Date().toISOString() 
      }).eq('id', id);
    } catch (err) {
      console.warn('Supabase job_applications status update error:', err);
    }
  }

  return list;
}

export async function withdrawCloudJobApplication(id: string): Promise<JobApplication[]> {
  return updateCloudJobApplicationStatus(id, 'Withdrawn', 'Candidate withdrew application.');
}

/* ===== Service Bookings CRUD ===== */
export async function getCloudServiceBookings(userId?: string): Promise<ServiceBooking[]> {
  let list: ServiceBooking[] = [];

  if (supabase && !isTestEnv) {
    try {
      let query = supabase.from('service_bookings').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`customerId.eq.${userId},workerId.eq.${userId}`);
      }
      const { data, error } = await Promise.race([
        query,
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1200))
      ]);
      if (!error && data) {
        list = data.filter((b: ServiceBooking) => !['booking-1', 'booking-2'].includes(b.id));
        try { localStorage.setItem(SERVICE_BOOKINGS_STORAGE_KEY, JSON.stringify(list)); } catch {}
        return list;
      }
    } catch (err) {
      console.warn('Supabase service_bookings query error:', err);
    }
  }

  try {
    const local = localStorage.getItem(SERVICE_BOOKINGS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        list = parsed.filter((b: ServiceBooking) => !['booking-1', 'booking-2'].includes(b.id));
      }
    }
  } catch {}

  if (userId) {
    return list.filter(b => b.customerId === userId || b.workerId === userId);
  }
  return list;
}

export async function createCloudServiceBooking(
  booking: Omit<ServiceBooking, 'id'> | ServiceBooking
): Promise<ServiceBooking[]> {
  const bookingId = ('id' in booking && booking.id) ? booking.id : `booking-${Date.now()}`;
  const fullBooking: ServiceBooking = {
    ...booking,
    id: bookingId,
    status: booking.status || 'Requested',
    createdAt: booking.createdAt || 'Just now'
  };

  let list = await getCloudServiceBookings();
  list = [fullBooking, ...list.filter(b => b.id !== bookingId)];

  try {
    localStorage.setItem(SERVICE_BOOKINGS_STORAGE_KEY, JSON.stringify(list));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('service_bookings').upsert([fullBooking]);
    } catch (err) {
      console.warn('Supabase service_bookings insert error:', err);
    }
  }

  return list;
}

export async function updateCloudServiceBookingStatus(
  id: string,
  status: ServiceBookingStatus,
  notes?: string
): Promise<ServiceBooking[]> {
  let list = await getCloudServiceBookings();
  list = list.map(b => {
    if (b.id === id) {
      return {
        ...b,
        status,
        workerNotes: notes !== undefined ? notes : b.workerNotes,
        completedAt: status === 'Completed' ? 'Just now' : b.completedAt
      };
    }
    return b;
  });

  try {
    localStorage.setItem(SERVICE_BOOKINGS_STORAGE_KEY, JSON.stringify(list));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('service_bookings').update({
        status,
        workerNotes: notes,
        completedAt: status === 'Completed' ? new Date().toISOString() : undefined
      }).eq('id', id);
    } catch (err) {
      console.warn('Supabase service_bookings status update error:', err);
    }
  }

  return list;
}

export async function cancelCloudServiceBooking(id: string, reason?: string): Promise<ServiceBooking[]> {
  return updateCloudServiceBookingStatus(id, 'Cancelled', reason || 'Booking cancelled by customer.');
}

/* ===== Worker Reviews CRUD ===== */
export async function getCloudWorkerReviews(workerId?: string): Promise<WorkerReview[]> {
  let list: WorkerReview[] = [];

  if (supabase && !isTestEnv) {
    try {
      let query = supabase.from('worker_reviews').select('*').order('created_at', { ascending: false });
      if (workerId) {
        query = query.eq('workerId', workerId);
      }
      const { data, error } = await Promise.race([
        query,
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1200))
      ]);
      if (!error && data) {
        list = data.filter((r: WorkerReview) => !['rev-1', 'rev-2'].includes(r.id));
        try { localStorage.setItem(WORKER_REVIEWS_STORAGE_KEY, JSON.stringify(list)); } catch {}
        return list;
      }
    } catch (err) {
      console.warn('Supabase worker_reviews query error:', err);
    }
  }

  try {
    const local = localStorage.getItem(WORKER_REVIEWS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        list = parsed.filter((r: WorkerReview) => !['rev-1', 'rev-2'].includes(r.id));
      }
    }
  } catch {}

  if (workerId) {
    return list.filter(r => r.workerId === workerId);
  }
  return list;
}

export async function createCloudWorkerReview(
  review: Omit<WorkerReview, 'id'> | WorkerReview
): Promise<{ reviews: WorkerReview[]; updatedWorkerList: LocalWorkerProfile[] }> {
  const revId = ('id' in review && review.id) ? review.id : `rev-${Date.now()}`;
  const fullRev: WorkerReview = {
    ...review,
    id: revId,
    createdAt: review.createdAt || 'Just now'
  };

  let list = await getCloudWorkerReviews();
  list = [fullRev, ...list.filter(r => r.id !== revId)];

  try {
    localStorage.setItem(WORKER_REVIEWS_STORAGE_KEY, JSON.stringify(list));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('worker_reviews').upsert([fullRev]);
    } catch (err) {
      console.warn('Supabase worker_reviews insert error:', err);
    }
  }

  // Recalculate average rating for target worker
  const workerReviews = list.filter(r => r.workerId === review.workerId);
  const avgRating = workerReviews.length > 0 
    ? workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length 
    : 5.0;

  const updatedWorkerList = await updateCloudLocalWorker(review.workerId, {
    rating: Number(avgRating.toFixed(1)),
    reviewCount: workerReviews.length
  });

  return { reviews: list, updatedWorkerList };
}

/* ===== Reports / Moderation ===== */
export async function getCloudReports(): Promise<JobReport[]> {
  if (supabase && !isTestEnv) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('job_reports').select('*').order('created_at', { ascending: false }),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1200))
      ]);
      if (!error && data) {
        try { localStorage.setItem(JOB_REPORTS_STORAGE_KEY, JSON.stringify(data)); } catch {}
        return data;
      }
    } catch (err) {
      console.warn('Supabase job_reports query error:', err);
    }
  }

  try {
    const local = localStorage.getItem(JOB_REPORTS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [...INITIAL_JOB_REPORTS];
}

export async function createCloudReport(
  report: Omit<JobReport, 'id'> | JobReport
): Promise<JobReport[]> {
  const reportId = ('id' in report && report.id) ? report.id : `report-${Date.now()}`;
  const fullReport: JobReport = {
    ...report,
    id: reportId,
    status: 'Pending',
    createdAt: 'Just now'
  };

  let list = await getCloudReports();
  list = [fullReport, ...list.filter(r => r.id !== reportId)];

  try {
    localStorage.setItem(JOB_REPORTS_STORAGE_KEY, JSON.stringify(list));
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      await supabase.from('job_reports').upsert([fullReport]);
    } catch (err) {
      console.warn('Supabase job_reports insert error:', err);
    }
  }

  return list;
}

/* ===== Distance / Haversine Helper for Nearby Workers ===== */
export function calculateDistanceKm(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/* ===== Realtime Database Subscription for Multi-Device Runtime Sync ===== */
export function subscribeToJobPortalRealtime(onSync: () => void) {
  if (!supabase || isTestEnv) return () => {};

  const channel = supabase
    .channel('aditi-job-portal-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'job_vacancies' }, () => onSync())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'job_seekers' }, () => onSync())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'local_workers' }, () => onSync())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications' }, () => onSync())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'service_bookings' }, () => onSync())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'worker_reviews' }, () => onSync())
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}


