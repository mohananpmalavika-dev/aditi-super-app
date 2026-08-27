import { describe, it, expect, beforeEach } from 'vitest';
import { 
  registerDeviceLock, 
  verifyDeviceLock, 
  isDeviceLockSupported, 
  clearActiveSession,
  isDeviceLockEnabled
} from '../services/deviceLockService';

describe('Device Lock & WebAuthn Security Verification', () => {
  beforeEach(() => {
    clearActiveSession();
  });

  it('fails registration strictly when WebAuthn is unavailable in environment', async () => {
    const user = {
      id: 'usr-test',
      name: 'Tester',
      email: 'tester@example.com',
      avatar: '',
      handle: '@tester'
    };
    const res = await registerDeviceLock(user);
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('fails verification strictly when no biometric passkey is enrolled', async () => {
    const res = await verifyDeviceLock();
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('reports device lock as disabled when no valid credential is saved', () => {
    expect(isDeviceLockEnabled()).toBe(false);
  });
});
