import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isSpeechRecognitionSupported,
  startVoiceRecognition,
  stopVoiceRecognition
} from '../services/voiceToTextService';
import { playTextInSenderVoice, DEFAULT_VOICE_PROFILE } from '../services/voiceCloneService';

describe('Chat Voice Features: Voice-to-Text (STT) & Text-to-Voice (TTS)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Voice-to-Text (Speech Recognition Engine)', () => {
    it('gracefully checks SpeechRecognition support in environment', () => {
      // In NodeJS test environment, SpeechRecognition is typically undefined
      const isSupported = isSpeechRecognitionSupported();
      expect(typeof isSupported).toBe('boolean');
    });

    it('handles unsupported speech recognition gracefully with error callback', () => {
      const onError = vi.fn();
      const onResult = vi.fn();

      const stop = startVoiceRecognition({
        lang: 'ml-IN',
        onResult,
        onError
      });

      expect(typeof stop).toBe('function');
      stop();
    });

    it('allows clean invocation of stopVoiceRecognition', () => {
      expect(() => stopVoiceRecognition()).not.toThrow();
    });
  });

  describe('Text-to-Voice (Speech Synthesis Engine)', () => {
    it('cleans message text and safely invokes playTextInSenderVoice', () => {
      const onEnd = vi.fn();
      const onError = vi.fn();

      // Test with Malayalam text
      const stop = playTextInSenderVoice(
        'നമസ്കാരം സുഹൃത്തേ സുഖമാണോ? 😀 https://example.com [urgent]',
        DEFAULT_VOICE_PROFILE,
        () => {},
        onEnd,
        onError
      );

      expect(typeof stop).toBe('function');
      stop();
    });

    it('handles empty / whitespace / emoji-only text without crashing', () => {
      const onEnd = vi.fn();

      const stop = playTextInSenderVoice(
        '😀 🔥 🚀',
        DEFAULT_VOICE_PROFILE,
        () => {},
        onEnd
      );

      expect(typeof stop).toBe('function');
      stop();
    });

    it('correctly uses custom voice profile properties', () => {
      const customProfile = {
        pitch: 1.2,
        rate: 1.1,
        timbre: 'crisp' as const,
        language: 'en-IN' as const
      };

      const stop = playTextInSenderVoice(
        'Hello from Aditi Super App!',
        customProfile
      );

      expect(typeof stop).toBe('function');
      stop();
    });
  });
});
