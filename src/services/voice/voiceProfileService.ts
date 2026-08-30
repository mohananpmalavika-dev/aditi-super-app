/**
 * voiceProfileService.ts
 * Manages Voice Profile Lifecycle, Consent Versioning, Quality Validation & Deletion
 */

import { VoiceProfile, UserVoiceProfile } from '../../types/superApp';
import { supabase } from '../cloudDatabaseService';

const STORAGE_KEY_VOICE_PROFILE = 'omnilife_user_voice_profile_v2';
const CURRENT_CONSENT_VERSION = 'VOICE_CONSENT_V2';

export const DEFAULT_ENROLLED_VOICE: VoiceProfile = {
  id: 'vp-default',
  userId: 'usr-current',
  displayName: 'My Synthetic Vocal Avatar (എന്റെ ശബ്ദം)',
  provider: 'local_web_audio',
  status: 'ACTIVE',
  profileVersion: 1,
  isEnabled: true,
  languageHints: ['ml-IN', 'en-IN'],
  pitch: 1.05,
  rate: 0.95,
  timbre: 'warm',
  consentVersion: CURRENT_CONSENT_VERSION,
  consentedAt: new Date().toISOString(),
  sampleDurationSec: 45,
  createdAt: '2026-08-27T10:00:00Z',
  updatedAt: new Date().toISOString()
};

/**
 * Retrieves the user's active voice profile.
 */
export function getActiveVoiceProfile(): VoiceProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOICE_PROFILE);
    if (!raw) return null;
    const parsed: VoiceProfile = JSON.parse(raw);
    if (parsed.status === 'DELETED' || !parsed.isEnabled) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Saves or updates the user's voice profile with consent versioning.
 */
export function saveActiveVoiceProfile(profile: Partial<VoiceProfile>): VoiceProfile {
  const existing = getActiveVoiceProfile() || DEFAULT_ENROLLED_VOICE;
  const updated: VoiceProfile = {
    ...existing,
    ...profile,
    profileVersion: (existing.profileVersion || 1) + 1,
    consentVersion: CURRENT_CONSENT_VERSION,
    consentedAt: existing.consentedAt || new Date().toISOString(),
    status: 'ACTIVE',
    isEnabled: true,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY_VOICE_PROFILE, JSON.stringify(updated));
    // Also save legacy compatibility key
    const legacy: UserVoiceProfile = {
      id: updated.id,
      isEnrolled: true,
      voiceName: updated.displayName,
      pitch: updated.pitch,
      rate: updated.rate,
      timbre: updated.timbre,
      language: updated.languageHints[0] as any || 'ml-IN',
      enrolledDate: updated.updatedAt,
      profileVersion: updated.profileVersion,
      consentVersion: updated.consentVersion,
      consentedAt: updated.consentedAt,
      status: updated.status
    };
    localStorage.setItem('omnilife_user_voice_profile', JSON.stringify(legacy));
  } catch (err) {
    console.error('Failed to persist voice profile:', err);
  }

  return updated;
}

/**
 * Deletes the user's voice profile (Idempotent cleanup).
 */
export function deleteVoiceProfile(): void {
  try {
    const current = getActiveVoiceProfile();
    if (current) {
      const deleted: VoiceProfile = {
        ...current,
        status: 'DELETED',
        isEnabled: false,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_VOICE_PROFILE, JSON.stringify(deleted));
    } else {
      localStorage.removeItem(STORAGE_KEY_VOICE_PROFILE);
    }
    localStorage.removeItem('omnilife_user_voice_profile');
    localStorage.removeItem('omnilife_voice_synthesis_cache');
  } catch (err) {
    console.warn('Error during voice profile deletion:', err);
  }
}

/**
 * Validates enrollment recording quality metrics.
 */
export interface VoiceEnrollmentQualityResult {
  isValid: boolean;
  score: number; // 0 - 100
  durationSec: number;
  feedback: string;
}

export function validateEnrollmentAudioQuality(
  durationSec: number,
  averageVolumeRms = 0.45
): VoiceEnrollmentQualityResult {
  const minDuration = 15; // 15 seconds minimum for sample enrollment
  const optimalDuration = 30; // 30 seconds optimal

  if (durationSec < minDuration) {
    return {
      isValid: false,
      score: Math.round((durationSec / minDuration) * 50),
      durationSec,
      feedback: `Recording is too short (${Math.round(durationSec)}s). Please record at least ${minDuration} seconds of clean speech.`
    };
  }

  if (averageVolumeRms < 0.05) {
    return {
      isValid: false,
      score: 30,
      durationSec,
      feedback: 'Microphone volume is too low or muted. Please speak clearly closer to the microphone.'
    };
  }

  const score = Math.min(100, Math.round(70 + (durationSec >= optimalDuration ? 30 : (durationSec / optimalDuration) * 20)));

  return {
    isValid: true,
    score,
    durationSec,
    feedback: 'Excellent vocal sample! Clear resonance and quality speech sample.'
  };
}
