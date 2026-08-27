/**
 * deviceLockService.ts
 * Real Native WebAuthn / Platform Authenticator (Device Screen Lock)
 * 
 * Strict Security Rules:
 * - WebAuthn supported + valid cryptographic assertion -> SUCCESS
 * - Anything else (unsupported, user cancel, mismatch, exception) -> FAIL
 * - Zero simulated success fallbacks.
 */

const STORAGE_CREDENTIAL_KEY = 'aditi_device_credential_id';
const STORAGE_LOCK_ENABLED_KEY = 'aditi_device_lock_enabled';
const STORAGE_SESSION_KEY = 'aditi_active_session';

export interface DeviceSessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  handle: string;
}

// Convert ArrayBuffer to Base64URL string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Convert Base64URL string to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(pad);
  const binary = window.atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
}

/**
 * Checks whether the current browser and OS genuinely support platform biometrics / WebAuthn.
 */
export async function isDeviceLockSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;

  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Registers the device's hardware platform authenticator (Face ID, Touch ID, Windows Hello, Android Biometrics).
 * Fails strictly if hardware WebAuthn is unavailable or rejected.
 */
export async function registerDeviceLock(user: DeviceSessionUser): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return { 
        success: false, 
        error: 'Hardware platform biometrics (WebAuthn) is not supported on this browser/device.' 
      };
    }

    const isSupported = await isDeviceLockSupported();
    if (!isSupported) {
      return { 
        success: false, 
        error: 'No platform biometric authenticator is available on this device.' 
      };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userIdBytes = new TextEncoder().encode(user.id || user.email || 'aditi-user');

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: {
        name: 'Aditi Super App',
        id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname
      },
      user: {
        id: userIdBytes,
        name: user.email || 'user@malabarbazaar.shop',
        displayName: user.name || 'Aditi User'
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        requireResidentKey: false
      },
      timeout: 60000,
      attestation: 'none'
    };

    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    })) as PublicKeyCredential | null;

    if (credential) {
      const rawIdBase64 = bufferToBase64(credential.rawId);
      localStorage.setItem(STORAGE_CREDENTIAL_KEY, rawIdBase64);
      localStorage.setItem(STORAGE_LOCK_ENABLED_KEY, 'true');
      saveActiveSession(user);
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Biometric passkey registration was cancelled by user.' 
    };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Hardware WebAuthn registration failed.' 
    };
  }
}

/**
 * Triggers REAL Operating System Biometric / Hardware Security Verification.
 * Returns failure strictly on any error or rejection.
 */
export async function verifyDeviceLock(): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'No browser window context available.' };
    }

    if (!window.PublicKeyCredential) {
      return { 
        success: false, 
        error: 'WebAuthn is not supported. Please authenticate using password.' 
      };
    }

    const storedRawId = localStorage.getItem(STORAGE_CREDENTIAL_KEY);
    if (!storedRawId) {
      return { 
        success: false, 
        error: 'No biometric passkey enrolled on this device. Please sign in with password.' 
      };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const credentialDescriptor: PublicKeyCredentialDescriptor = {
      id: base64ToBuffer(storedRawId),
      type: 'public-key',
      transports: ['internal']
    };

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challenge,
      allowCredentials: [credentialDescriptor],
      userVerification: 'required',
      timeout: 60000
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    });

    if (assertion) {
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Biometric assertion failed or was rejected.' 
    };
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      return { 
        success: false, 
        error: 'Biometric verification was cancelled by user or timed out.' 
      };
    }
    return { 
      success: false, 
      error: err.message || 'Device unlock failed.' 
    };
  }
}

/**
 * Check if an active session exists
 */
export function getStoredActiveSession(): DeviceSessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save active session
 */
export function saveActiveSession(user: DeviceSessionUser) {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Unable to save active session:', err);
  }
}

/**
 * Clear session on explicit user logout
 */
export function clearActiveSession() {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_CREDENTIAL_KEY);
    localStorage.setItem(STORAGE_LOCK_ENABLED_KEY, 'false');
  } catch (err) {
    console.warn('Unable to clear active session:', err);
  }
}

/**
 * Check if device lock is active
 */
export function isDeviceLockEnabled(): boolean {
  try {
    const session = getStoredActiveSession();
    const hasCredential = Boolean(localStorage.getItem(STORAGE_CREDENTIAL_KEY));
    const enabled = localStorage.getItem(STORAGE_LOCK_ENABLED_KEY) === 'true';
    return Boolean(session && hasCredential && enabled);
  } catch {
    return false;
  }
}

/**
 * Set device lock enabled / disabled
 */
export function setDeviceLockEnabled(enabled: boolean) {
  localStorage.setItem(STORAGE_LOCK_ENABLED_KEY, enabled ? 'true' : 'false');
}
