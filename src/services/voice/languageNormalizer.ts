/**
 * languageNormalizer.ts
 * Malayalam, Manglish & Regional Speech Normalization Engine for Voice Synthesis
 * 
 * Features:
 * - Phonetic Manglish to Malayalam speech normalizer
 * - Number, time, currency, and unit speech expansions
 * - Language classification (Malayalam / English / Manglish / Mixed)
 * - Safe sanitization preserving original display text unchanged
 */

export type DetectedVoiceLanguage = 'ml' | 'en' | 'manglish' | 'mixed';

// Common phonetic Manglish dictionary mappings for natural vocal synthesis
const MANGLISH_PHONETIC_MAP: Record<string, string> = {
  njan: 'ഞാൻ',
  njaan: 'ഞാൻ',
  ente: 'എന്റെ',
  ninakku: 'നിനക്ക്',
  enikku: 'എനിക്ക്',
  innu: 'ഇന്ന്',
  nale: 'നാളെ',
  naale: 'നാളെ',
  varam: 'വരാം',
  vaaram: 'വരാം',
  varum: 'വരും',
  ethum: 'എത്തും',
  poyi: 'പോയി',
  pokam: 'പോകാം',
  manikku: 'മണിക്ക്',
  enthokke: 'എന്തൊക്കെ',
  sukhamano: 'സുഖമാണോ',
  sukham: 'സുഖം',
  vaikunneram: 'വൈകുന്നേരം',
  ravile: 'രാവിലെ',
  uchakku: 'ഉച്ചക്ക്',
  evideya: 'എവിടെയാ',
  evide: 'എവിടെ',
  engane: 'എങ്ങനെ',
  aanu: 'ആണ്',
  alla: 'അല്ല',
  athe: 'അതെ',
  undu: 'ഉണ്ട്',
  illa: 'ഇല്ല',
  nokkam: 'നോക്കാം',
  parayam: 'പറയാം',
  cheyyam: 'ചെയ്യാം',
  ariyo: 'അറിയോ',
  ariyilla: 'അറിയില്ല',
  chechi: 'ചേച്ചി',
  chetta: 'ചേട്ടാ',
  aliyan: 'അളിയാ',
  eda: 'എടാ',
  edi: 'എടീ',
  machane: 'മച്ചാനേ',
  kollam: 'കൊള്ളാം',
  valare: 'വളരെ',
  nanni: 'നന്ദി',
  pinne: 'പിന്നെ',
  onnum: 'ഒന്നും',
  ippol: 'ഇപ്പോൾ',
  ippo: 'ഇപ്പോ',
  neram: 'നേരം',
  vegam: 'വേഗം',
  kazhinju: 'കഴിഞ്ഞു'
};

/**
 * Detects the language composition of the input text.
 */
export function detectVoiceLanguage(text: string): DetectedVoiceLanguage {
  if (!text) return 'en';

  const hasMalayalamUnicode = /[\u0D00-\u0D7F]/.test(text);
  const words = text.toLowerCase().split(/\s+/);
  
  let manglishWordCount = 0;
  for (const w of words) {
    const cleanWord = w.replace(/[^a-z]/g, '');
    if (MANGLISH_PHONETIC_MAP[cleanWord]) {
      manglishWordCount++;
    }
  }

  if (hasMalayalamUnicode) {
    const hasEnglishWords = /[a-zA-Z]{3,}/.test(text);
    return hasEnglishWords ? 'mixed' : 'ml';
  }

  if (manglishWordCount >= 1 || (words.length > 0 && manglishWordCount / words.length >= 0.2)) {
    return 'manglish';
  }

  return 'en';
}

/**
 * Expands numbers, times, currency and units into phonetic speech strings.
 */
export function expandSpeechUnitsAndNumbers(text: string, isMalayalamContext: boolean): string {
  let result = text;

  // 1. Time expansions e.g. 10:30, 5:00 PM, 10:30 AM
  result = result.replace(/(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)?/g, (_match, h, m, meridiem) => {
    const hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    const period = meridiem ? (meridiem.toLowerCase() === 'pm' ? (isMalayalamContext ? 'വൈകുന്നേരം' : 'PM') : (isMalayalamContext ? 'രാവിലെ' : 'AM')) : '';
    
    if (isMalayalamContext) {
      if (minute === 0) return `${period} ${hour} മണി`;
      if (minute === 30) return `${period} ${hour}ര മണി`;
      return `${period} ${hour} മണി ${minute} മിനിറ്റ്`;
    }
    return `${hour}:${minute} ${period}`;
  });

  // 2. Currency expansions e.g. ₹500, Rs. 1000, 500 രൂപ
  result = result.replace(/(?:₹|rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, (_match, amount) => {
    const cleanAmount = amount.replace(/,/g, '');
    return isMalayalamContext ? `${cleanAmount} രൂപ` : `${cleanAmount} rupees`;
  });

  // 3. Distance & Unit expansions e.g. 2 km, 5 kg, 10 min
  result = result.replace(/(\d+)\s*(?:km|kms)\b/gi, '$1 കിലോമീറ്റർ');
  result = result.replace(/(\d+)\s*(?:kg|kgs)\b/gi, '$1 കിലോഗ്രാം');
  result = result.replace(/(\d+)\s*(?:min|mins|minutes)\b/gi, '$1 മിനിറ്റ്');

  return result;
}

/**
 * Normalizes input text for natural speech synthesis without mutating original text.
 * Generates an optimized phonetic representation for text-to-speech engines.
 */
export function normalizeTextForSpeech(text: string): {
  normalizedSpeechText: string;
  detectedLanguage: DetectedVoiceLanguage;
  speechLanguageCode: string;
} {
  if (!text || !text.trim()) {
    return { normalizedSpeechText: '', detectedLanguage: 'en', speechLanguageCode: 'en-IN' };
  }

  const detectedLanguage = detectVoiceLanguage(text);
  const isMalayalamContext = detectedLanguage === 'ml' || detectedLanguage === 'manglish' || detectedLanguage === 'mixed';

  // 1. Expand currency, time, numbers
  let speechText = expandSpeechUnitsAndNumbers(text, isMalayalamContext);

  // 2. If Manglish, translate common phonetic tokens to Malayalam script for native voice engines
  if (detectedLanguage === 'manglish') {
    const words = speechText.split(/(\s+|[.,!?;:])/);
    const replaced = words.map((token) => {
      const lower = token.toLowerCase();
      return MANGLISH_PHONETIC_MAP[lower] || token;
    });
    speechText = replaced.join('');
  }

  // 3. Remove URLs, emojis, and unpronounceable bracket artifacts
  speechText = speechText
    .replace(/(https?:\/\/[^\s]+)/g, isMalayalamContext ? 'ലിങ്ക്' : 'link')
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    .replace(/[\[\]\(\)\{\}<>#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const speechLanguageCode = isMalayalamContext ? 'ml-IN' : 'en-IN';

  return {
    normalizedSpeechText: speechText,
    detectedLanguage,
    speechLanguageCode
  };
}
