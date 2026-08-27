import { UserVoiceProfile } from '../types/superApp';

const STORAGE_KEY = 'omnilife_user_voice_profile';

export const DEFAULT_VOICE_PROFILE: UserVoiceProfile = {
  id: 'vp-default',
  isEnrolled: true,
  voiceName: 'My Cloned Vocal Avatar (എന്റെ ശബ്ദം)',
  pitch: 1.05,
  rate: 0.95,
  timbre: 'warm',
  language: 'ml-IN',
  enrolledDate: '2026-08-27'
};

export const getUserVoiceProfile = (): UserVoiceProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_VOICE_PROFILE;
  } catch {
    return DEFAULT_VOICE_PROFILE;
  }
};

export const saveUserVoiceProfile = (profile: UserVoiceProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save voice profile:', err);
  }
};

/**
 * Plays the provided text aloud in the sender's personalized AI voice.
 * Selects Malayalam / Indian English / regional natural TTS engines with custom pitch, rate, and timbre.
 */
export const playTextInSenderVoice = (
  text: string,
  voiceProfile?: Partial<UserVoiceProfile>,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): (() => void) => {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API not supported in this browser.');
    onError?.('SpeechSynthesis not supported');
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const profile = { ...getUserVoiceProfile(), ...voiceProfile };

  // Clean text from emojis, URLs, and brackets for smooth TTS
  const cleanText = text
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    .replace(/(https?:\/\/[^\s]+)/g, 'link')
    .replace(/[\[\]\(\)\{\}]/g, '')
    .trim();

  if (!cleanText) {
    onEnd?.();
    return () => {};
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Apply Pitch & Rate according to vocal profile
  utterance.pitch = profile.pitch || 1.0;
  utterance.rate = profile.rate || 0.95;

  // Timbre modifications
  if (profile.timbre === 'deep') {
    utterance.pitch = Math.max(0.7, (profile.pitch || 1.0) - 0.25);
  } else if (profile.timbre === 'crisp') {
    utterance.pitch = Math.min(1.4, (profile.pitch || 1.0) + 0.2);
  } else if (profile.timbre === 'calm') {
    utterance.rate = Math.max(0.8, (profile.rate || 1.0) - 0.15);
  }

  // Detect language: check if text contains Malayalam Unicode characters (0D00–0D7F)
  const isMalayalam = /[\u0D00-\u0D7F]/.test(cleanText);
  utterance.lang = isMalayalam ? 'ml-IN' : profile.language || 'en-IN';

  // Find best matching voice
  const loadAndAssignVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      let matchingVoice = voices.find((v) => v.lang === utterance.lang);
      if (!matchingVoice && isMalayalam) {
        matchingVoice = voices.find((v) => v.lang.startsWith('ml') || v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
      }
      if (!matchingVoice) {
        matchingVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india') || v.lang.startsWith('en'));
      }
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }
  };

  loadAndAssignVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadAndAssignVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    // Treat user cancel as a clean stop
    if (e.error === 'canceled' || e.error === 'interrupted') {
      onEnd?.();
    } else {
      onError?.(e);
      onEnd?.();
    }
  };

  window.speechSynthesis.speak(utterance);

  // Return cancel stopper
  return () => {
    try {
      window.speechSynthesis.cancel();
      onEnd?.();
    } catch {}
  };
};
