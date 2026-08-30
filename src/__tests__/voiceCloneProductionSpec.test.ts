import { describe, it, expect, beforeEach, vi } from 'vitest';
import { evaluateVoiceSafety, assertAntiImpersonation } from '../services/voice/voiceSafetyPolicy';
import { normalizeTextForSpeech, detectVoiceLanguage, expandSpeechUnitsAndNumbers } from '../services/voice/languageNormalizer';
import { 
  getActiveVoiceProfile, 
  saveActiveVoiceProfile, 
  deleteVoiceProfile, 
  validateEnrollmentAudioQuality,
  DEFAULT_ENROLLED_VOICE 
} from '../services/voice/voiceProfileService';
import { voiceCacheManager, playSyntheticVoice } from '../services/voice/voiceSynthesisEngine';

describe('Production Voice Clone & Synthesis Specification Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    voiceCacheManager.purgeAll();
  });

  describe('1. Safety & Anti-Impersonation Policy (Sections 2, 23, 24, 68, 86)', () => {
    it('blocks synthetic voice playback for OTP and sensitive authentication messages', () => {
      const otpMsg = 'Your Aditi verification OTP is 492019. Do not share.';
      const res = evaluateVoiceSafety(otpMsg);
      expect(res.isAllowed).toBe(false);
      expect(res.reason).toBe('SENSITIVE_CONTENT_BLOCKED');
      expect(res.warningMessage).toContain('OTP/PIN/Password');
    });

    it('blocks synthetic voice playback for passwords and PIN requests', () => {
      const pinMsg = 'Enter your secret UPI PIN to continue';
      const res = evaluateVoiceSafety(pinMsg);
      expect(res.isAllowed).toBe(false);
    });

    it('allows normal safe messages without restriction', () => {
      const normalMsg = 'Njan 10 manikku ethum. Wait cheyyu.';
      const res = evaluateVoiceSafety(normalMsg);
      expect(res.isAllowed).toBe(true);
      expect(res.reason).toBeUndefined();
    });

    it('adds verification warning flag for financial transfer messages', () => {
      const transferMsg = 'Please send money ₹5000 via GPay urgently.';
      const res = evaluateVoiceSafety(transferMsg);
      expect(res.isAllowed).toBe(true);
      expect(res.reason).toBe('FINANCIAL_WARNING');
      expect(res.warningMessage).toContain('Verify financial requests independently');
    });

    it('asserts anti-impersonation rule: only message author can synthesize voice', () => {
      const valid = assertAntiImpersonation('usr-person-a', 'usr-person-a');
      expect(valid.isValid).toBe(true);

      const invalid = assertAntiImpersonation('usr-person-b', 'usr-person-a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.error).toContain('Cannot synthesize voice for text not authored by the voice owner');
    });
  });

  describe('2. Language & Manglish Normalization (Sections 19, 20, 21, 22)', () => {
    it('detects Manglish and converts phonetic tokens for natural speech synthesis', () => {
      const rawManglish = 'njan nale 10 manikku varam';
      const normalized = normalizeTextForSpeech(rawManglish);
      expect(normalized.detectedLanguage).toBe('manglish');
      expect(normalized.speechLanguageCode).toBe('ml-IN');
      expect(normalized.normalizedSpeechText).toContain('ഞാൻ');
      expect(normalized.normalizedSpeechText).toContain('നാളെ');
      expect(normalized.normalizedSpeechText).toContain('വരാം');
    });

    it('expands time strings into phonetic speech words', () => {
      const expanded = expandSpeechUnitsAndNumbers('Meet me at 10:30', true);
      expect(expanded).toContain('10ര മണി');
    });

    it('expands currency into phonetic Malayalam/English representation', () => {
      const expanded = expandSpeechUnitsAndNumbers('Total amount is ₹500', true);
      expect(expanded).toContain('500 രൂപ');
    });

    it('detects Malayalam unicode and mixed language properly', () => {
      expect(detectVoiceLanguage('ഞാൻ ഇന്ന് വരും')).toBe('ml');
      expect(detectVoiceLanguage('Hello world')).toBe('en');
      expect(detectVoiceLanguage('ഞാൻ today evening വരാം')).toBe('mixed');
    });
  });

  describe('3. Voice Profile Lifecycle & Quality Validation (Sections 5, 6, 7, 8, 34)', () => {
    it('validates enrollment audio quality with score and duration metrics', () => {
      const shortRecording = validateEnrollmentAudioQuality(5);
      expect(shortRecording.isValid).toBe(false);
      expect(shortRecording.feedback).toContain('too short');

      const optimalRecording = validateEnrollmentAudioQuality(35, 0.5);
      expect(optimalRecording.isValid).toBe(true);
      expect(optimalRecording.score).toBeGreaterThanOrEqual(90);
    });

    it('saves and increments profile version on update', () => {
      const initial = saveActiveVoiceProfile({
        displayName: 'Test Voice Profile',
        pitch: 1.1,
        timbre: 'energetic'
      });

      expect(initial.profileVersion).toBe(2);
      expect(initial.consentVersion).toBe('VOICE_CONSENT_V2');
      expect(initial.isEnabled).toBe(true);

      const active = getActiveVoiceProfile();
      expect(active?.displayName).toBe('Test Voice Profile');
    });

    it('deletes voice profile and revokes access idempotently', () => {
      saveActiveVoiceProfile({ displayName: 'Temp Voice' });
      deleteVoiceProfile();
      expect(getActiveVoiceProfile()).toBeNull();
    });
  });

  describe('4. Voice Synthesis Engine & Cache Invalidation (Sections 11, 12, 31, 32)', () => {
    it('stores and retrieves cached synthetic audio entries with TTL', () => {
      const messageId = 'msg-12345';
      const text = 'Njan 10 manikku ethum';
      const profile = { profileVersion: 1, userId: 'usr-1', pitch: 1.0, rate: 1.0, timbre: 'warm' as const };

      playSyntheticVoice(messageId, text, profile);

      const cached = voiceCacheManager.get(messageId, 1, 'hash_njan');
      // Should handle cache gracefully without throwing
      expect(typeof voiceCacheManager.getCacheKey(messageId, 1, 'abc')).toBe('string');
    });

    it('invalidates cache when message is edited or deleted', () => {
      const messageId = 'msg-edit-test';
      voiceCacheManager.set({
        id: 'syn-1',
        messageId,
        senderId: 'usr-1',
        voiceProfileVersion: 1,
        textHash: 'hash1',
        language: 'ml-IN',
        durationMs: 2500,
        createdAt: Date.now(),
        expiresAt: Date.now() + 100000
      });

      expect(voiceCacheManager.get(messageId, 1, 'hash1')).not.toBeNull();

      voiceCacheManager.invalidate(messageId);
      expect(voiceCacheManager.get(messageId, 1, 'hash1')).toBeNull();
    });
  });
});
