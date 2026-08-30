import { describe, it, expect } from 'vitest';
import CallManager from '../services/webrtcCallService';

describe('WebRTC media support', () => {
  it('returns null instead of crashing when browser media APIs are unavailable', async () => {
    const manager = new CallManager();
    const originalMediaDevices = navigator.mediaDevices;

    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      configurable: true
    });

    await expect(manager.startLocalMedia(true, true)).resolves.toBeNull();

    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      configurable: true
    });
  });
});
