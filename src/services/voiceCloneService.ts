/**
 * voiceCloneService.ts
 * Unified façade export for Aditi Voice Clone & Synthesis System
 */

import { UserVoiceProfile } from '../types/superApp';
import { getActiveVoiceProfile, saveActiveVoiceProfile, DEFAULT_ENROLLED_VOICE, deleteVoiceProfile } from './voice/voiceProfileService';
import { playSyntheticVoice, voiceCacheManager } from './voice/voiceSynthesisEngine';
import { evaluateVoiceSafety, assertAntiImpersonation } from './voice/voiceSafetyPolicy';
import { normalizeTextForSpeech, detectVoiceLanguage } from './voice/languageNormalizer';

export const DEFAULT_VOICE_PROFILE: UserVoiceProfile = {
  id: DEFAULT_ENROLLED_VOICE.id,
  isEnrolled: DEFAULT_ENROLLED_VOICE.isEnabled,
  voiceName: DEFAULT_ENROLLED_VOICE.displayName,
  pitch: DEFAULT_ENROLLED_VOICE.pitch,
  rate: DEFAULT_ENROLLED_VOICE.rate,
  timbre: DEFAULT_ENROLLED_VOICE.timbre,
  language: 'ml-IN',
  enrolledDate: DEFAULT_ENROLLED_VOICE.createdAt
};

export const getUserVoiceProfile = (): UserVoiceProfile => {
  const active = getActiveVoiceProfile();
  if (active) {
    return {
      id: active.id,
      isEnrolled: active.isEnabled && active.status === 'ACTIVE',
      voiceName: active.displayName,
      pitch: active.pitch,
      rate: active.rate,
      timbre: active.timbre,
      language: (active.languageHints[0] as any) || 'ml-IN',
      enrolledDate: active.updatedAt,
      profileVersion: active.profileVersion,
      consentVersion: active.consentVersion,
      consentedAt: active.consentedAt,
      status: active.status
    };
  }
  return DEFAULT_VOICE_PROFILE;
};

export const saveUserVoiceProfile = (profile: UserVoiceProfile): void => {
  saveActiveVoiceProfile({
    id: profile.id,
    displayName: profile.voiceName,
    pitch: profile.pitch,
    rate: profile.rate,
    timbre: profile.timbre,
    languageHints: [profile.language || 'ml-IN']
  });
};

/**
 * Backward-compatible facade for playSyntheticVoice.
 */
export const playTextInSenderVoice = (
  text: string,
  voiceProfile?: Partial<UserVoiceProfile>,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): (() => void) => {
  return playSyntheticVoice(
    `msg-${Date.now()}`,
    text,
    {
      pitch: voiceProfile?.pitch,
      rate: voiceProfile?.rate,
      timbre: voiceProfile?.timbre,
      languageHints: voiceProfile?.language ? [voiceProfile.language] : ['ml-IN']
    },
    { onStart, onEnd, onError }
  );
};

export {
  getActiveVoiceProfile,
  saveActiveVoiceProfile,
  deleteVoiceProfile,
  playSyntheticVoice,
  voiceCacheManager,
  evaluateVoiceSafety,
  assertAntiImpersonation,
  normalizeTextForSpeech,
  detectVoiceLanguage
};
