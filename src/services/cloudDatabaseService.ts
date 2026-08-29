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
    id: 'job-1',
    title: 'Senior React & Full-Stack Developer',
    company: 'Malabar Tech Innovations',
    category: 'Technology & IT',
    jobType: 'Full-time',
    location: 'Cyberpark, Kozhikode / Hybrid',
    city: 'Kozhikode',
    isRemote: true,
    salaryMin: 50000,
    salaryMax: 90000,
    salaryFormatted: '₹50,000 - ₹90,000 / mo',
    experienceRequired: '2-4 Years',
    qualificationRequired: 'B.Tech / BCA / MCA / Self-taught',
    description: 'Looking for a passionate React.js, TypeScript, and Node.js developer to build scalable cloud SaaS portals and mobile-responsive dashboards.',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL'],
    contactName: 'Naveen Rajan (HR Head)',
    contactPhone: '+91 98471 99881',
    contactEmail: 'careers@malabartech.io',
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    openingsCount: 2,
    isUrgent: true,
    isFeatured: true,
    isSaved: false,
    createdAt: 'Today'
  },
  {
    id: 'job-2',
    title: 'Certified Electrician & Site Supervisor',
    company: 'Skyline Buildtech Kerala',
    category: 'Local Trades & Skilled Labor',
    jobType: 'Full-time',
    location: 'Marine Drive, Kochi',
    city: 'Kochi',
    isRemote: false,
    salaryMin: 28000,
    salaryMax: 42000,
    salaryFormatted: '₹28,000 - ₹42,000 / mo',
    experienceRequired: '3+ Years',
    qualificationRequired: 'ITI Electrical / Wireman License',
    description: 'Lead electrical installations, 3-phase wiring, distribution panels, and safety audits across luxury apartment construction projects.',
    skills: ['3-Phase Wiring', 'Panel Board Assembly', 'Safety Compliance', 'Site Supervision'],
    contactName: 'Sudheer Babu (Project Manager)',
    contactPhone: '+91 97450 11223',
    contactEmail: 'jobs@skylinekerala.com',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    openingsCount: 4,
    isUrgent: true,
    isFeatured: true,
    isSaved: false,
    createdAt: 'Yesterday'
  },
  {
    id: 'job-3',
    title: 'Full-time Resident Housemaid & Cook',
    company: 'Private Family (Doctor Residence)',
    category: 'Domestic & Housekeeping',
    jobType: 'Full-time',
    location: 'Chevayur, Kozhikode',
    city: 'Kozhikode',
    isRemote: false,
    salaryMin: 18000,
    salaryMax: 24000,
    salaryFormatted: '₹18,000 - ₹24,000 / mo + Room & Food',
    experienceRequired: '2+ Years Experience in Kerala Cooking',
    qualificationRequired: 'Trustworthy with clean background',
    description: 'Looking for a caring, hygiene-conscious housemaid and cook for traditional Kerala vegetarian & non-vegetarian meals and daily housekeeping. Private room with attached bath provided.',
    skills: ['Kerala Cooking', 'Housekeeping', 'Elderly Care', 'Kitchen Management'],
    contactName: 'Dr. Vineetha Nair',
    contactPhone: '+91 94471 55667',
    contactAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    openingsCount: 1,
    isUrgent: false,
    isFeatured: true,
    isSaved: false,
    createdAt: '2 days ago'
  },
  {
    id: 'job-4',
    title: 'Tourist & Personal Car Driver',
    company: 'Wayanad Green Trails Travel',
    category: 'Logistics & Driving',
    jobType: 'Full-time',
    location: 'Calicut & Wayanad Circuit',
    city: 'Kozhikode',
    isRemote: false,
    salaryMin: 22000,
    salaryMax: 32000,
    salaryFormatted: '₹22,000 - ₹32,000 / mo + Trip Bata',
    experienceRequired: '5+ Years with Hill Route Experience',
    qualificationRequired: 'Valid Light Motor Vehicle (LMV) Badge License',
    description: 'Drive Innova Crysta & SUV for domestic and international tourists across Wayanad, Calicut, and Munnar routes. Polite behavior and punctuality essential.',
    skills: ['Ghat Road Driving', 'Tourist Guidance', 'Vehicle Maintenance', 'Malayalam & English'],
    contactName: 'Shyam Prasath',
    contactPhone: '+91 98950 44332',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    openingsCount: 2,
    isUrgent: false,
    isFeatured: false,
    isSaved: false,
    createdAt: '3 days ago'
  },
  {
    id: 'job-5',
    title: 'Staff Nurse (ICU & Emergency Care)',
    company: 'Aster MediCity Health Campus',
    category: 'Healthcare & Nursing',
    jobType: 'Full-time',
    location: 'Edappally, Ernakulam',
    city: 'Kochi',
    isRemote: false,
    salaryMin: 32000,
    salaryMax: 48000,
    salaryFormatted: '₹32,000 - ₹48,000 / mo',
    experienceRequired: '1-3 Years',
    qualificationRequired: 'B.Sc Nursing / GNM with KNMC Registration',
    description: 'Provide compassionate patient care in advanced multi-speciality medical ICU. Rotating shifts with attractive benefits and health insurance.',
    skills: ['Critical Care', 'Patient Monitoring', 'BLS / ACLS', 'Medication Admin'],
    contactName: 'Sister Teresa Joseph (Nursing Supdt)',
    contactPhone: '+91 98460 77889',
    contactEmail: 'nursing.careers@asterhealth.com',
    contactAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    openingsCount: 5,
    isUrgent: true,
    isFeatured: true,
    isSaved: false,
    createdAt: '4 days ago'
  }
];

export const INITIAL_JOB_SEEKERS: JobSeekerProfile[] = [
  {
    id: 'seeker-1',
    fullName: 'Rahul Krishnan',
    desiredRole: 'MERN Stack & Mobile App Developer',
    category: 'Technology & IT',
    jobTypePreference: 'Full-time',
    qualification: 'B.Tech in Computer Science',
    experienceYears: 4,
    experienceSummary: 'Built 8+ production web apps and React Native mobile applications. Proficient in TypeScript, Next.js, Tailwind, GraphQL, and Supabase / Firebase.',
    expectedSalary: '₹65,000 / mo',
    preferredLocation: 'Kozhikode / Kochi / Remote',
    city: 'Kozhikode',
    skills: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    resumeHeadline: 'Passionate Full Stack Engineer with proven track record of shipping fast, modern web & mobile products.',
    bio: 'Dedicated developer looking for high-growth product companies or progressive remote roles. Available to join immediately.',
    phone: '+91 97441 23456',
    email: 'rahul.k.dev@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    availability: 'Immediate',
    isVerified: true,
    isSaved: false,
    createdAt: 'Today'
  },
  {
    id: 'seeker-2',
    fullName: 'Anjali S. Nair',
    desiredRole: 'Senior Accountant & GST / Tax Specialist',
    category: 'Finance & Accounting',
    jobTypePreference: 'Full-time',
    qualification: 'M.Com, Tally Prime Certified, GST Practitioner',
    experienceYears: 5,
    experienceSummary: 'Handled end-to-end company accounting, monthly GST GSTR-1 & 3B filings, TDS reconciliation, and audit preparation for trading & hospitality firms.',
    expectedSalary: '₹35,000 / mo',
    preferredLocation: 'Kochi / Kakkanad / Thrissur',
    city: 'Kochi',
    skills: ['Tally Prime', 'GST Filing', 'TDS & TCS', 'Balance Sheet Finalization', 'Excel'],
    resumeHeadline: 'Certified Accounts Professional with 5 years experience in commercial bookkeeping and taxation.',
    bio: 'Looking for a stable corporate or mid-sized firm where I can streamline financial processes and tax compliance.',
    phone: '+91 98470 65432',
    email: 'anjali.accounts@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
    availability: 'Within 15 Days',
    isVerified: true,
    isSaved: false,
    createdAt: 'Yesterday'
  },
  {
    id: 'seeker-3',
    fullName: 'Muhammed Jaseel',
    desiredRole: 'ITI Certified Electrician & Electrical Supervisor',
    category: 'Local Trades & Skilled Labor',
    jobTypePreference: 'Full-time',
    qualification: 'ITI Electrical (NCVT) + Wireman Permit',
    experienceYears: 6,
    experienceSummary: 'Extensive experience in residential & commercial wiring, inverter & solar setup, motor pumps, MCB/DB installations, and fault diagnosis.',
    expectedSalary: '₹30,000 / mo or ₹950 / day',
    preferredLocation: 'Kozhikode, Malappuram, Wayanad',
    city: 'Kozhikode',
    skills: ['Industrial Wiring', 'Solar Installation', 'CCTV Setup', 'Appliance Diagnosis'],
    resumeHeadline: 'Licensed Wireman and Electrical Technician with 6+ years hands-on site experience.',
    bio: 'Punctual, hardworking and dedicated to quality electrical work with 100% safety protocols.',
    phone: '+91 99461 88990',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    availability: 'Immediate',
    isVerified: true,
    isSaved: false,
    createdAt: '3 days ago'
  },
  {
    id: 'seeker-4',
    fullName: 'Suresh Babu K.',
    desiredRole: 'Commercial Heavy & Personal Chauffeur Driver',
    category: 'Logistics & Driving',
    jobTypePreference: 'Full-time',
    qualification: 'SSLC Pass, LMV & HMV Commercial Badge',
    experienceYears: 12,
    experienceSummary: '12 years driving experience with accident-free record. Driven luxury sedans, SUVs, and staff transport buses across South India.',
    expectedSalary: '₹25,000 / mo or ₹900 / day',
    preferredLocation: 'Kozhikode / Kannur / All Kerala',
    city: 'Kozhikode',
    skills: ['Luxury Car Driving', 'Night Driving', 'Vehicle Maintenance', 'Google Maps Navigation'],
    resumeHeadline: 'Professional, calm-mannered driver with spotless 12-year safety record.',
    bio: 'Seeking full-time chauffeur role for private family, corporate executives or reputed resort.',
    phone: '+91 94472 33445',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    availability: 'Immediate',
    isVerified: true,
    isSaved: false,
    createdAt: '4 days ago'
  }
];

export const INITIAL_LOCAL_WORKERS: LocalWorkerProfile[] = [
  {
    id: 'worker-1',
    name: 'K. Balan (Balan Chettan)',
    trade: 'Electrician',
    experienceYears: 16,
    dailyRateOrCharge: '₹800 / day or ₹350 / service visit',
    serviceAreas: ['Mavoor Road', 'Palayam', 'Calicut Beach', 'Nadakkavu', 'Chevayur', 'Medical College'],
    city: 'Kozhikode',
    rating: 4.9,
    reviewCount: 148,
    isAvailableToday: true,
    verifiedBadge: true,
    skills: ['Wiring Repairs', 'Ceiling Fan & Light Fitting', 'Inverter Battery Setup', 'Fuse & DB Replacement', 'Water Pump Repair'],
    bio: 'Government licensed master wireman with 16 years experience in Calicut town. Prompt arrival within 45 minutes for urgent electrical breakdowns.',
    phone: '+91 98471 22330',
    whatsapp: '+91 98471 22330',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    completedJobsCount: 420,
    isSaved: false,
    createdAt: 'Registered Partner'
  },
  {
    id: 'worker-2',
    name: 'Saji Mathew',
    trade: 'Plumber',
    experienceYears: 14,
    dailyRateOrCharge: '₹750 / day or ₹300 / service visit',
    serviceAreas: ['Kakkanad', 'Edappally', 'Palarivattom', 'Marine Drive', 'Aluva', 'Vytilla'],
    city: 'Kochi',
    rating: 4.8,
    reviewCount: 112,
    isAvailableToday: true,
    verifiedBadge: true,
    skills: ['Pipe Leakage Fix', 'Bathroom Fitting Replacement', 'Water Tank Cleaning', 'Drainage Block Clearing', 'Pressure Pump Setup'],
    bio: 'Expert plumber handling modern CPVC/PVC piping, Grohe/Jaguar fittings, and emergency pipeline leak repairs in Ernakulam.',
    phone: '+91 97455 33441',
    whatsapp: '+91 97455 33441',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    completedJobsCount: 310,
    isSaved: false,
    createdAt: 'Registered Partner'
  },
  {
    id: 'worker-3',
    name: 'Radha Amma',
    trade: 'Housemaid / Domestic Help',
    experienceYears: 9,
    dailyRateOrCharge: '₹550 / day or ₹14,000 / mo',
    serviceAreas: ['Chevayur', 'West Hill', 'Kottuli', 'Eranhipalam', 'Karaparamba'],
    city: 'Kozhikode',
    rating: 5.0,
    reviewCount: 84,
    isAvailableToday: true,
    verifiedBadge: true,
    skills: ['Kerala Home Cooking', 'Deep House Cleaning', 'Utensil Washing', 'Laundry & Ironing', 'Baby & Elderly Care'],
    bio: 'Honest, loving, and trustworthy domestic helper with verified police ID check. Expert in cooking healthy Malabar meals and keeping homes spotless.',
    phone: '+91 94473 11229',
    whatsapp: '+91 94473 11229',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    completedJobsCount: 95,
    isSaved: false,
    createdAt: 'Registered Partner'
  },
  {
    id: 'worker-4',
    name: 'Shiju V. (Cool Care Service)',
    trade: 'Appliance & AC Technician',
    experienceYears: 8,
    dailyRateOrCharge: '₹400 / service check + parts',
    serviceAreas: ['All Kochi & Ernakulam Suburbs', 'Kakkanad', 'Tripunithura'],
    city: 'Kochi',
    rating: 4.9,
    reviewCount: 220,
    isAvailableToday: true,
    verifiedBadge: true,
    skills: ['AC Jet Water Cleaning', 'Gas Refill', 'Washing Machine PCB Fix', 'Refrigerator Cooling Repair', 'Microwave Repair'],
    bio: 'Certified technician for Daikin, Voltas, LG, and Samsung air conditioners and washing machines. 30-day service warranty guaranteed.',
    phone: '+91 98952 77880',
    whatsapp: '+91 98952 77880',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    completedJobsCount: 540,
    isSaved: false,
    createdAt: 'Registered Partner'
  },
  {
    id: 'worker-5',
    name: 'Manoj Kumar',
    trade: 'Carpenter',
    experienceYears: 18,
    dailyRateOrCharge: '₹900 / day',
    serviceAreas: ['Palakkad', 'Thrissur', 'Kozhikode'],
    city: 'Kozhikode',
    rating: 4.8,
    reviewCount: 96,
    isAvailableToday: false,
    verifiedBadge: true,
    skills: ['Teak Furniture Making', 'Modular Kitchen Cabinets', 'Door Lock & Hinge Fix', 'Wardrobe Repair', 'Wood Polishing'],
    bio: 'Traditional Kerala wood craftsman and modern modular interior carpenter. High precision woodwork with flawless finishing.',
    phone: '+91 94470 99881',
    whatsapp: '+91 94470 99881',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    completedJobsCount: 180,
    isSaved: false,
    createdAt: 'Registered Partner'
  },
  {
    id: 'worker-6',
    name: 'Haridas P.',
    trade: 'Driver (Car / Heavy)',
    experienceYears: 20,
    dailyRateOrCharge: '₹850 / day + Food',
    serviceAreas: ['All Kerala', 'Airport Pickups (CCJ & COK)', 'Outstation Tours'],
    city: 'Kozhikode',
    rating: 4.9,
    reviewCount: 340,
    isAvailableToday: true,
    verifiedBadge: true,
    skills: ['Airport Transfers', 'Ghats & Hill Stations', 'Automatic & Manual Cars', 'Punctual & Polite'],
    bio: 'Professional senior chauffeur with 20 years experience. Non-smoker, non-drinker with comprehensive knowledge of all Kerala routes.',
    phone: '+91 98470 88771',
    whatsapp: '+91 98470 88771',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    completedJobsCount: 650,
    isSaved: false,
    createdAt: 'Registered Partner'
  }
];

/* ===== Job Vacancies CRUD ===== */
export async function getCloudJobVacancies(): Promise<JobVacancy[]> {
  try {
    const local = localStorage.getItem(JOB_VACANCIES_STORAGE_KEY);
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
        supabase.from('job_vacancies').select('*').order('created_at', { ascending: false }),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1000))
      ]);
      if (!error && data && data.length > 0) return data;
    } catch {}
  }

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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  if (supabase && !isTestEnv) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('job_seekers').select('*').order('created_at', { ascending: false }),
        new Promise<{ data: any; error: any }>((res) => setTimeout(() => res({ data: null, error: 'timeout' }), 1000))
      ]);
      if (!error && data && data.length > 0) return data;
    } catch {}
  }

  try {
    localStorage.setItem(JOB_SEEKERS_STORAGE_KEY, JSON.stringify(INITIAL_JOB_SEEKERS));
  } catch {}

  return [...INITIAL_JOB_SEEKERS];
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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

  return currentList;
}

/* ==================== APPLICATIONS, BOOKINGS, REVIEWS & MODERATION ==================== */
export const JOB_APPLICATIONS_STORAGE_KEY = 'aditi-job-applications';
export const SERVICE_BOOKINGS_STORAGE_KEY = 'aditi-service-bookings';
export const WORKER_REVIEWS_STORAGE_KEY = 'aditi-worker-reviews';
export const JOB_REPORTS_STORAGE_KEY = 'aditi-job-reports';

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior React & Full-Stack Developer',
    company: 'Malabar Tech Innovations',
    candidateId: 'seeker-1',
    candidateName: 'Rahul Krishnan',
    candidateAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    candidatePhone: '+91 97441 23456',
    candidateEmail: 'rahul.k.dev@gmail.com',
    recruiterId: 'usr-guest',
    coverLetter: 'I have 4 years experience building production React & Node systems with TypeScript and GraphQL.',
    qualification: 'B.Tech in Computer Science',
    experienceYears: 4,
    status: 'Shortlisted',
    appliedAt: 'Yesterday',
    recruiterNotes: 'Strong frontend portfolio. Ready for technical interview round.'
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Certified Electrician & Site Supervisor',
    company: 'Skyline Buildtech Kerala',
    candidateId: 'seeker-3',
    candidateName: 'Muhammed Jaseel',
    candidateAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    candidatePhone: '+91 99461 88990',
    coverLetter: 'Licensed Wireman with 6 years experience in 3-phase commercial building wiring.',
    qualification: 'ITI Electrical (NCVT)',
    experienceYears: 6,
    status: 'Applied',
    appliedAt: 'Today'
  }
];

export const INITIAL_SERVICE_BOOKINGS: ServiceBooking[] = [
  {
    id: 'booking-1',
    customerId: 'usr-guest',
    customerName: 'Aditi User',
    customerPhone: '+91 98470 12345',
    workerId: 'worker-1',
    workerName: 'K. Balan (Balan Chettan)',
    workerTrade: 'Electrician',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    serviceType: 'Main Switch Board & MCB Replacement',
    description: 'Frequent tripping in bedroom circuit breaker. Need urgent inspection and DB check.',
    requestedDate: 'Today',
    requestedTime: '11:00 AM',
    address: 'Near Baby Memorial Hospital, Arayidathupalam',
    city: 'Kozhikode',
    estimatedPrice: '₹450 / visit + parts',
    status: 'Scheduled',
    createdAt: 'Yesterday'
  },
  {
    id: 'booking-2',
    customerId: 'usr-guest',
    customerName: 'Aditi User',
    customerPhone: '+91 98470 12345',
    workerId: 'worker-2',
    workerName: 'Saji Mathew',
    workerTrade: 'Plumber',
    workerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    serviceType: 'Kitchen Sink Pipeline Block & Leakage Fix',
    description: 'Under-sink PVC drainage pipe leakage repair.',
    requestedDate: 'Tomorrow',
    requestedTime: '03:30 PM',
    address: 'Seaport-Airport Road, Kakkanad',
    city: 'Kochi',
    estimatedPrice: '₹350 / visit',
    status: 'Requested',
    createdAt: 'Today'
  }
];

export const INITIAL_WORKER_REVIEWS: WorkerReview[] = [
  {
    id: 'rev-1',
    workerId: 'worker-1',
    reviewerId: 'user-sample-1',
    reviewerName: 'Deepak Varma',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 5,
    review: 'Balan Chettan arrived in 30 minutes! Diagnosed inverter wiring fault quickly and fixed it at reasonable charge. Highly recommended in Calicut.',
    bookingId: 'booking-seed-1',
    createdAt: '3 days ago'
  },
  {
    id: 'rev-2',
    workerId: 'worker-2',
    reviewerId: 'user-sample-2',
    reviewerName: 'Sneha Menon',
    reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5,
    review: 'Very professional plumbing service. Fixed bathroom concealed pipe leakage with clean tile cut. Punctual and polite.',
    bookingId: 'booking-seed-2',
    createdAt: '1 week ago'
  }
];

export const INITIAL_JOB_REPORTS: JobReport[] = [];

/* ===== Applications CRUD ===== */
export async function getCloudJobApplications(userId?: string): Promise<JobApplication[]> {
  let list: JobApplication[] = [];
  try {
    const local = localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch {}

  if (list.length === 0) {
    list = [...INITIAL_JOB_APPLICATIONS];
    try {
      localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

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

  return list;
}

export async function withdrawCloudJobApplication(id: string): Promise<JobApplication[]> {
  return updateCloudJobApplicationStatus(id, 'Withdrawn', 'Candidate withdrew application.');
}

/* ===== Service Bookings CRUD ===== */
export async function getCloudServiceBookings(userId?: string): Promise<ServiceBooking[]> {
  let list: ServiceBooking[] = [];
  try {
    const local = localStorage.getItem(SERVICE_BOOKINGS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch {}

  if (list.length === 0) {
    list = [...INITIAL_SERVICE_BOOKINGS];
    try {
      localStorage.setItem(SERVICE_BOOKINGS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

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

  return list;
}

export async function cancelCloudServiceBooking(id: string, reason?: string): Promise<ServiceBooking[]> {
  return updateCloudServiceBookingStatus(id, 'Cancelled', reason || 'Booking cancelled by customer.');
}

/* ===== Worker Reviews CRUD ===== */
export async function getCloudWorkerReviews(workerId?: string): Promise<WorkerReview[]> {
  let list: WorkerReview[] = [];
  try {
    const local = localStorage.getItem(WORKER_REVIEWS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch {}

  if (list.length === 0) {
    list = [...INITIAL_WORKER_REVIEWS];
    try {
      localStorage.setItem(WORKER_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

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


