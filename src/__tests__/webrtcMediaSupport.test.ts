import { describe, it, expect } from 'vitest';
import { WebRTCManager } from '../services/webrtcService';

describe('WebRTC media support', () => {
  it('returns null instead of crashing when browser media APIs are unavailable', async () => {
    const manager = new WebRTCManager();
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
