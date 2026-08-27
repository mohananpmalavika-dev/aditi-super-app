import { UserProfile, RegisterCredentials, LoginCredentials } from '../types/superApp';
import { INITIAL_USER } from '../data/mockData';

const DB_NAME = 'aditi_production_db';
const DB_VERSION = 1;
const USERS_STORE = 'users';

export interface DbUserRecord {
  id: string;
  name: string;
  email: string;
  handle: string;
  passwordHash: string;
  avatar: string;
  zodiacSign: string;
  bio: string;
  location: string;
  gender?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

/**
 * Computes cryptographically secure SHA-256 password hash using native Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = 'aditi_super_app_secure_salt_2026_';
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Opens or initializes the local IndexedDB instance with required object stores and unique indexes.
 */
function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'email' });
        userStore.createIndex('id', 'id', { unique: true });
        userStore.createIndex('handle', 'handle', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback Local Storage Registry for browser environments with restricted IndexedDB
const BACKUP_DB_KEY = 'aditi_production_users_db';

function getBackupUsers(): Record<string, DbUserRecord> {
  try {
    const saved = localStorage.getItem(BACKUP_DB_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveBackupUser(record: DbUserRecord): void {
  try {
    const users = getBackupUsers();
    users[record.email.toLowerCase()] = record;
    localStorage.setItem(BACKUP_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save to backup DB:', err);
  }
}

/**
 * Registers a new user into the Database with hashed credentials and duplicate check.
 */
export async function dbRegisterUser(
  creds: RegisterCredentials,
  passwordHash: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanEmail = creds.email.trim().toLowerCase();

  // 1. Check if user already exists in DB
  const existingUser = await dbFindUserByEmail(cleanEmail);
  if (existingUser) {
    return {
      success: false,
      error: `❌ An account with email "${cleanEmail}" already exists in the database. Please log in or use a different email.`
    };
  }

  const record: DbUserRecord = {
    id: `usr-${Date.now()}`,
    name: creds.name.trim(),
    email: cleanEmail,
    handle: creds.handle.startsWith('@') ? creds.handle : `@${creds.handle}`,
    passwordHash,
    avatar: creds.avatar || INITIAL_USER.avatar,
    zodiacSign: creds.zodiacSign || 'Leo',
    bio: creds.bio || 'Aditi Verified Member 🚀',
    location: creds.location || 'Kozhikode, Kerala, India',
    gender: creds.gender,
    dateOfBirth: creds.dateOfBirth,
    timeOfBirth: creds.timeOfBirth,
    placeOfBirth: creds.placeOfBirth,
    isVerified: true,
    createdAt: new Date().toISOString()
  };

  // Write to Backup Storage immediately
  saveBackupUser(record);

  // Write to IndexedDB
  try {
    const db = await openIndexedDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(USERS_STORE, 'readwrite');
      const store = tx.objectStore(USERS_STORE);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB write fallback to localStorage backup DB:', e);
  }

  const userProfile: UserProfile = {
    id: record.id,
    name: record.name,
    email: record.email,
    handle: record.handle,
    avatar: record.avatar,
    zodiacSign: record.zodiacSign,
    bio: record.bio,
    location: record.location,
    gender: record.gender as any,
    dateOfBirth: record.dateOfBirth,
    timeOfBirth: record.timeOfBirth,
    placeOfBirth: record.placeOfBirth,
    isVerified: true,
    createdAt: record.createdAt
  };

  return { success: true, user: userProfile };
}

/**
 * Searches for a user record in the Database by email.
 */
export async function dbFindUserByEmail(email: string): Promise<DbUserRecord | null> {
  const cleanEmail = email.trim().toLowerCase();

  // Try IndexedDB first
  try {
    const db = await openIndexedDb();
    const result = await new Promise<DbUserRecord | null>((resolve, reject) => {
      const tx = db.transaction(USERS_STORE, 'readonly');
      const store = tx.objectStore(USERS_STORE);
      const req = store.get(cleanEmail);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    if (result) return result;
  } catch (e) {
    // Fallback to local storage registry
  }

  const backupUsers = getBackupUsers();
  return backupUsers[cleanEmail] || null;
}

/**
 * Verifies user credentials strictly against the Database during login.
 */
export async function dbVerifyAndLoginUser(
  creds: LoginCredentials
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanEmail = creds.email.trim().toLowerCase();

  // 1. Query Database for user
  const dbUser = await dbFindUserByEmail(cleanEmail);
  if (!dbUser) {
    return {
      success: false,
      error: `❌ Account with email "${cleanEmail}" is not found in the database. Please create an account first.`
    };
  }

  // 2. Hash input password and verify against stored passwordHash
  const inputPasswordHash = await hashPassword(creds.password);
  if (dbUser.passwordHash !== inputPasswordHash) {
    return {
      success: false,
      error: '❌ Incorrect password. Database authentication verification failed.'
    };
  }

  // 3. Update last login timestamp in DB
  const updatedRecord: DbUserRecord = {
    ...dbUser,
    lastLoginAt: new Date().toISOString()
  };
  saveBackupUser(updatedRecord);

  try {
    const db = await openIndexedDb();
    const tx = db.transaction(USERS_STORE, 'readwrite');
    tx.objectStore(USERS_STORE).put(updatedRecord);
  } catch (e) {}

  const userProfile: UserProfile = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    handle: dbUser.handle,
    avatar: dbUser.avatar,
    zodiacSign: dbUser.zodiacSign,
    bio: dbUser.bio,
    location: dbUser.location,
    gender: dbUser.gender as any,
    dateOfBirth: dbUser.dateOfBirth,
    timeOfBirth: dbUser.timeOfBirth,
    placeOfBirth: dbUser.placeOfBirth,
    isVerified: true
  };

  return { success: true, user: userProfile };
}
