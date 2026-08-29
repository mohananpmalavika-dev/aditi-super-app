import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  ChatConversation, 
  ChatMessage,
  FriendRequest,
  FriendshipStatus,
  HabitItem, 
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
