import { describe, it, expect } from 'vitest';
import {
  INDIAN_LANGUAGES,
  translateIndianLanguageToEnglish,
  detectIndianLanguageScript
} from '../services/indianLanguageTranslationService';

describe('Indian Language Voice Translation & Speech Engine', () => {
  it('contains all 11 major Indian languages with valid speech codes and flags', () => {
    expect(INDIAN_LANGUAGES.length).toBeGreaterThanOrEqual(11);

    const malayalam = INDIAN_LANGUAGES.find((l) => l.code === 'ml');
    const hindi = INDIAN_LANGUAGES.find((l) => l.code === 'hi');
    const tamil = INDIAN_LANGUAGES.find((l) => l.code === 'ta');
    const telugu = INDIAN_LANGUAGES.find((l) => l.code === 'te');
    const kannada = INDIAN_LANGUAGES.find((l) => l.code === 'kn');
    const bengali = INDIAN_LANGUAGES.find((l) => l.code === 'bn');

    expect(malayalam?.speechCode).toBe('ml-IN');
    expect(hindi?.speechCode).toBe('hi-IN');
    expect(tamil?.speechCode).toBe('ta-IN');
    expect(telugu?.speechCode).toBe('te-IN');
    expect(kannada?.speechCode).toBe('kn-IN');
    expect(bengali?.speechCode).toBe('bn-IN');
  });

  describe('Accurate Translation from Indian Languages to English', () => {
    it('translates Malayalam conversational speech to English', async () => {
      const res1 = await translateIndianLanguageToEnglish('സുഖമാണോ', 'ml', 'en');
      expect(res1.translatedText).toContain('How are you');

      const res2 = await translateIndianLanguageToEnglish('നന്ദി', 'ml', 'en');
      expect(res2.translatedText).toContain('Thank you');

      const res3 = await translateIndianLanguageToEnglish('നമസ്കാരം', 'ml', 'en');
      expect(res3.translatedText).toContain('Hello');
    });

    it('translates Hindi conversational speech to English', async () => {
      const res1 = await translateIndianLanguageToEnglish('नमस्ते', 'hi', 'en');
      expect(res1.translatedText).toContain('Hello');

      const res2 = await translateIndianLanguageToEnglish('धन्यवाद', 'hi', 'en');
      expect(res2.translatedText).toContain('Thank you');
    });

    it('translates Tamil conversational speech to English', async () => {
      const res1 = await translateIndianLanguageToEnglish('வணக்கம்', 'ta', 'en');
      expect(res1.translatedText).toContain('Hello');

      const res2 = await translateIndianLanguageToEnglish('நன்றி', 'ta', 'en');
      expect(res2.translatedText).toContain('Thank you');
    });

    it('translates Telugu conversational speech to English', async () => {
      const res1 = await translateIndianLanguageToEnglish('నమస్కారం', 'te', 'en');
      expect(res1.translatedText).toContain('Hello');

      const res2 = await translateIndianLanguageToEnglish('ధన్యవాదాలు', 'te', 'en');
      expect(res2.translatedText).toContain('Thank you');
    });

    it('translates Kannada conversational speech to English', async () => {
      const res1 = await translateIndianLanguageToEnglish('ನಮಸ್ಕಾರ', 'kn', 'en');
      expect(res1.translatedText).toContain('Hello');
    });

    it('handles empty input gracefully', async () => {
      const res = await translateIndianLanguageToEnglish('', 'ml', 'en');
      expect(res.translatedText).toBe('');
      expect(res.isSuccess).toBe(true);
    });
  });

  describe('Indian Language Unicode Script Detection', () => {
    it('detects Malayalam script', () => {
      const lang = detectIndianLanguageScript('സുഖമാണോ');
      expect(lang.code).toBe('ml');
    });

    it('detects Tamil script', () => {
      const lang = detectIndianLanguageScript('வணக்கம்');
      expect(lang.code).toBe('ta');
    });

    it('detects Devanagari (Hindi) script', () => {
      const lang = detectIndianLanguageScript('नमस्ते');
      expect(lang.code).toBe('hi');
    });

    it('detects Telugu script', () => {
      const lang = detectIndianLanguageScript('నమస్కారం');
      expect(lang.code).toBe('te');
    });

    it('detects Kannada script', () => {
      const lang = detectIndianLanguageScript('ನಮಸ್ಕಾರ');
      expect(lang.code).toBe('kn');
    });
  });
});
