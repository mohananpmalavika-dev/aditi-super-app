/**
 * languageNormalizer.ts
 * Malayalam, Manglish & Authentic Regional Kerala Slang Normalization Engine
 * 
 * Features:
 * - Comprehensive Manglish & Colloquial Slang mapping to natural Malayalam
 * - Regional Accent & Slang Styling: Natural, Malabar, Kochi/Youth, Travancore, and Formal
 * - Prosodic pacing with rhythmic breath pauses for natural human cadence
 * - Number, time, currency, and unit speech expansions
 */

export type DetectedVoiceLanguage = 'ml' | 'en' | 'manglish' | 'mixed';
export type RegionalSlangStyle = 'natural' | 'malabar' | 'kochi' | 'travancore' | 'formal';

// Comprehensive colloquial Manglish & Kerala Slang Dictionary
const MANGLISH_SLANG_MAP: Record<string, string> = {
  // Pronouns & Addresses
  njan: 'ഞാൻ',
  njaan: 'ഞാൻ',
  ente: 'എന്റെ',
  ninakku: 'നിനക്ക്',
  enikku: 'എനിക്ക്',
  ninte: 'നിന്റെ',
  namukku: 'നമുക്ക്',
  nammude: 'നമ്മുടെ',
  ningalude: 'നിങ്ങളുടെ',
  njangalude: 'ഞങ്ങളുടെ',
  avan: 'അവൻ',
  aval: 'അവൾ',
  ivan: 'ഇവൻ',
  ival: 'ഇവൾ',
  avaru: 'അവർ',
  ivaru: 'ഇവർ',
  eda: 'എടാ',
  edaa: 'എടാ',
  edi: 'എടീ',
  edee: 'എടീ',
  machane: 'മച്ചാനേ',
  machaane: 'മച്ചാനേ',
  machan: 'മച്ചാൻ',
  aliyan: 'അളിയാ',
  aliyaa: 'അളിയാ',
  bro: 'ബ്രോ',
  chetta: 'ചേട്ടാ',
  chechi: 'ചേച്ചി',
  chango: 'ചങ്ങായീ',
  changayi: 'ചങ്ങായീ',
  muthu: 'മുത്തേ',
  muthane: 'മുത്താണ്',

  // Time & Days
  innu: 'ഇന്ന്',
  nale: 'നാളെ',
  naale: 'നാളെ',
  innale: 'ഇന്നലെ',
  mattennal: 'മറ്റന്നാൾ',
  vaikunneram: 'വൈകുന്നേരം',
  ravile: 'രാവിലെ',
  uchakku: 'ഉച്ചക്ക്',
  raathri: 'രാത്രി',
  manikku: 'മണിക്ക്',
  mani: 'മണി',
  ippol: 'ഇപ്പോൾ',
  ippo: 'ഇപ്പോ',
  neram: 'നേരം',
  vegam: 'വേഗം',
  pettannu: 'പെട്ടെന്ന്',

  // Verbs & Common Actions
  varam: 'വരാം',
  vaaram: 'വരാം',
  varum: 'വരും',
  vannu: 'വന്നു',
  varilla: 'വരില്ല',
  ethum: 'എത്തും',
  ethiyilla: 'എത്തിയില്ല',
  ethiyo: 'എത്തിയോ',
  poyi: 'പോയി',
  pokam: 'പോകാം',
  pokaam: 'പോകാം',
  pokilla: 'പോകില്ല',
  pokunnu: 'പോകുന്നു',
  nokkam: 'നോക്കാം',
  nokkaam: 'നോക്കാം',
  nokku: 'നോക്ക്',
  parayam: 'പറയാം',
  parayu: 'പറയൂ',
  parayeda: 'പറയെടാ',
  cheyyam: 'ചെയ്യാം',
  cheyyu: 'ചെയ്യ്',
  cheyyo: 'ചെയ്യോ',
  ariyo: 'അറിയോ',
  ariyam: 'അറിയാം',
  ariyilla: 'അറിയില്ല',
  kazhinju: 'കഴിഞ്ഞു',
  kazhinjo: 'കഴിഞ്ഞോ',
  undayo: 'ഉണ്ടായോ',
  kelkku: 'കേൾക്ക്',
  kelkkatte: 'കേൾക്കട്ടെ',
  tharam: 'തരാം',
  thaa: 'താ',

  // Conversational Slang & Expressions
  sukhamano: 'സുഖമാണോ',
  sugamano: 'സുഖമാണോ',
  sukham: 'സുഖം',
  enthokke: 'എന്തൊക്കെ',
  enthokkeyundu: 'എന്തൊക്കെയുണ്ട്',
  enthokkeya: 'എന്തൊക്കെയാ',
  vishesham: 'വിശേഷങ്ങൾ',
  evideya: 'എവിടെയാ',
  evide: 'എവിടെ',
  engane: 'എങ്ങനെ',
  aanu: 'ആണ്',
  alla: 'അല്ല',
  athe: 'അതെ',
  undu: 'ഉണ്ട്',
  illa: 'ഇല്ല',
  illaa: 'ഇല്ല',
  kollam: 'കൊള്ളാം',
  adipoli: 'അടിപൊളി',
  pwoli: 'പൊളി',
  poliyanu: 'പൊളിയാണ്',
  valare: 'വളരെ',
  nanni: 'നന്ദി',
  pinne: 'പിന്നെ',
  onnum: 'ഒന്നും',
  pinnallathe: 'പിന്നല്ലാതെ',
  sceneilla: 'സീനില്ല',
  scene: 'സീൻ',
  setaayi: 'സെറ്റായി',
  setaanu: 'സെറ്റാണ്',
  sheriyenna: 'ശരി എന്നാ',
  shari: 'ശരി',
  athrathe: 'അത്രയേ ഉള്ളൂ',
  aada: 'ആടാ',
  aadee: 'ആടീ',
  ketto: 'കേട്ടോ',
  chumma: 'ചുമ്മാ',
  thannilley: 'തന്നില്ലേ'
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
    if (MANGLISH_SLANG_MAP[cleanWord]) {
      manglishWordCount++;
    }
  }

  if (hasMalayalamUnicode) {
    const hasEnglishWords = /[a-zA-Z]{3,}/.test(text);
    return hasEnglishWords ? 'mixed' : 'ml';
  }

  if (manglishWordCount >= 1 || (words.length > 0 && manglishWordCount / words.length >= 0.15)) {
    return 'manglish';
  }

  return 'en';
}

/**
 * Expands numbers, times, currency and units into natural spoken Malayalam strings.
 */
export function expandSpeechUnitsAndNumbers(text: string, isMalayalamContext: boolean): string {
  let result = text;

  // 1. Time expansions with natural phrasing
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

  // 2. Currency expansions
  result = result.replace(/(?:₹|rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, (_match, amount) => {
    const cleanAmount = amount.replace(/,/g, '');
    return isMalayalamContext ? `${cleanAmount} രൂപ` : `${cleanAmount} rupees`;
  });

  // 3. Units
  result = result.replace(/(\d+)\s*(?:km|kms)\b/gi, '$1 കിലോമീറ്റർ');
  result = result.replace(/(\d+)\s*(?:kg|kgs)\b/gi, '$1 കിലോഗ്രാം');
  result = result.replace(/(\d+)\s*(?:min|mins|minutes)\b/gi, '$1 മിനിറ്റ്');

  return result;
}

/**
 * Applies regional Kerala conversational slang stylings and prosodic natural breath cadence.
 */
export function applyRegionalSlangStyle(
  text: string,
  style: RegionalSlangStyle = 'natural'
): string {
  let formatted = text;

  // Apply Regional Stylings
  if (style === 'malabar') {
    formatted = formatted
      .replace(/\b(സുഖമാണോ|സുഖം തന്നെയല്ലേ)\b/g, 'ന്റെ ചങ്ങായീ, എന്തൊക്കെണ്ട് വിശേഷം! സുഖമാണോ?')
      .replace(/\b(ശരി|ശരി എന്നാ)\b/g, 'എന്നാ ശരി മച്ചൂ')
      .replace(/\b(എന്തൊക്കെയുണ്ട്)\b/g, 'എന്തൊക്കെണ്ട് വിശേഷങ്ങൾ');
  } else if (style === 'kochi') {
    formatted = formatted
      .replace(/\b(സുഖമാണോ)\b/g, 'മച്ചാനേ സുഖമാണോ?')
      .replace(/\b(ശരി|ഓക്കെ)\b/g, 'സീനില്ല, സെറ്റാണ് മച്ചാനെ')
      .replace(/\b(നന്നായിട്ടുണ്ട്|കൊള്ളാം)\b/g, 'പൊളിയാണ് മച്ചാനേ');
  } else if (style === 'travancore') {
    formatted = formatted
      .replace(/\b(വരാം)\b/g, 'ഞാൻ വരാം കേട്ടോ')
      .replace(/\b(ശരി)\b/g, 'ശരി കേട്ടോ')
      .replace(/\b(സുഖമാണോ)\b/g, 'സുഖം തന്നെയല്ലേ?');
  }

  // Prosodic Pacing: Insert soft breath commas to prevent TTS rushing
  formatted = formatted
    .replace(/\s+(എന്നിട്ട്|പക്ഷേ|എന്നാൽ|അതുകൊണ്ട്|കേട്ടോ|അല്ലേ)\s+/g, ', $1 ')
    .replace(/\s+([.,!?;:])\s+/g, '$1 ')
    .trim();

  return formatted;
}

/**
 * Normalizes input text for natural, conversational speech synthesis.
 */
export function normalizeTextForSpeech(
  text: string,
  slangStyle: RegionalSlangStyle = 'natural'
): {
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

  // 2. Transliterate Manglish slang tokens to natural Malayalam script
  if (detectedLanguage === 'manglish' || isMalayalamContext) {
    const words = speechText.split(/(\s+|[.,!?;:])/);
    const replaced = words.map((token) => {
      const lower = token.toLowerCase();
      return MANGLISH_SLANG_MAP[lower] || token;
    });
    speechText = replaced.join('');
  }

  // 3. Apply regional slang and conversational prosody cadence
  if (isMalayalamContext) {
    speechText = applyRegionalSlangStyle(speechText, slangStyle);
  }

  // 4. Remove URLs, emojis, and unpronounceable bracket artifacts
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
