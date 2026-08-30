/**
 * malayalamPhoneticTransliteration.ts
 * Transliterates Malayalam Unicode script into Indian-English Phonetic representations
 * Ensures speech synthesis engines without native Malayalam voice packs can pronounce
 * Malayalam and Manglish text accurately and cleanly without silence.
 */

const MALAYALAM_VOWELS: Record<string, string> = {
  'അ': 'a',
  'ആ': 'aa',
  'ഇ': 'i',
  'ഈ': 'ee',
  'ഉ': 'u',
  'ഊ': 'oo',
  'ഋ': 'ri',
  'എ': 'e',
  'ഏ': 'ae',
  'ഐ': 'ai',
  'ഒ': 'o',
  'ഓ': 'oa',
  'ഔ': 'au'
};

const MALAYALAM_VOWEL_SIGNS: Record<string, string> = {
  'ാ': 'aa',
  'ി': 'i',
  'ീ': 'ee',
  'ു': 'u',
  'ൂ': 'oo',
  'ൃ': 'ri',
  'െ': 'e',
  'േ': 'ae',
  'ൈ': 'ai',
  'ൊ': 'o',
  'ോ': 'oa',
  'ൌ': 'au',
  'ൗ': 'au'
};

const MALAYALAM_CONSONANTS: Record<string, string> = {
  'ക': 'ka',
  'ഖ': 'kha',
  'ഗ': 'ga',
  'ഘ': 'gha',
  'ങ': 'nga',
  'ച': 'cha',
  'ഛ': 'chha',
  'ജ': 'ja',
  'ഝ': 'jha',
  'ഞ': 'nya',
  'ട': 'ta',
  'ഠ': 'tha',
  'ഡ': 'da',
  'ഢ': 'dha',
  'ണ': 'na',
  'ത': 'tha',
  'ഥ': 'thha',
  'ദ': 'da',
  'ധ': 'dha',
  'ന': 'na',
  'പ': 'pa',
  'ഫ': 'fa',
  'ബ': 'ba',
  'ഭ': 'bha',
  'മ': 'ma',
  'യ': 'ya',
  'ര': 'ra',
  'ല': 'la',
  'വ': 'va',
  'ശ': 'sha',
  'ഷ': 'sha',
  'സ': 'sa',
  'ഹ': 'ha',
  'ള': 'la',
  'ഴ': 'zha',
  'റ': 'ra',
  'ൺ': 'n',
  'ൻ': 'n',
  'ർ': 'r',
  'ൽ': 'l',
  'ൾ': 'l',
  'ൿ': 'k'
};

const CHILLU_MAP: Record<string, string> = {
  'ൺ': 'n',
  'ൻ': 'n',
  'ർ': 'r',
  'ൽ': 'l',
  'ൾ': 'l',
  'ൿ': 'k',
  'ം': 'm',
  'ഃ': 'h'
};

// Common word substitutions for better TTS pronunciation
const PHONETIC_WORD_REPLACEMENTS: Record<string, string> = {
  'ഞാൻ': 'Njaan',
  'നമസ്കാരം': 'Namaskaaram',
  'സുഖമാണോ': 'Sukhamano',
  'എവിടെയാ': 'Evideya',
  'എന്തൊക്കെയുണ്ട്': 'Enthokkeyundu',
  'എന്തൊക്കെ': 'Enthokke',
  'വരാം': 'Varaam',
  'എത്തും': 'Ethum',
  'നാളെ': 'Naale',
  'ഇന്ന്': 'Innu',
  'വൈകുന്നേരം': 'Vaikunneram',
  'രാവിലെ': 'Raavile',
  'ഉച്ചക്ക്': 'Uchakku',
  'മണിക്ക്': 'Manikku',
  'മണി': 'Mani',
  'രൂപ': 'Roopa',
  'നന്ദി': 'Nandi',
  'ശരി': 'Shari',
  'അതെ': 'Athe',
  'അല്ല': 'Alla',
  'ഉണ്ട്': 'Undu',
  'ഇല്ല': 'Illa',
  'പോയി': 'Poyi',
  'പോകാം': 'Pokaam',
  'നോക്കാം': 'Nokkaam',
  'ചെയ്യാം': 'Cheyyaam'
};

/**
 * Transliterates Malayalam Unicode script into phonetic English text.
 */
export function transliterateMalayalamToPhonetic(text: string): string {
  if (!text) return '';

  let output = text;

  // 1. Direct dictionary replacements
  for (const [ml, phonetic] of Object.entries(PHONETIC_WORD_REPLACEMENTS)) {
    output = output.split(ml).join(phonetic);
  }

  // 2. Transliterate remaining Malayalam characters
  let result = '';
  const len = output.length;
  let i = 0;

  while (i < len) {
    const char = output[i];
    const nextChar = i + 1 < len ? output[i + 1] : '';

    // Check Chillu / Anusvara
    if (CHILLU_MAP[char]) {
      result += CHILLU_MAP[char];
      i++;
      continue;
    }

    // Check independent vowel
    if (MALAYALAM_VOWELS[char]) {
      result += MALAYALAM_VOWELS[char];
      i++;
      continue;
    }

    // Check consonant
    if (MALAYALAM_CONSONANTS[char]) {
      let base = MALAYALAM_CONSONANTS[char];

      // If followed by Virama (്) -> drop the trailing 'a'
      if (nextChar === '്') {
        const afterVirama = i + 2 < len ? output[i + 2] : '';
        if (MALAYALAM_CONSONANTS[afterVirama]) {
          // Conjunct
          result += base.slice(0, -1);
          i += 2;
          continue;
        } else {
          // Half consonant at end of word or before vowel
          result += base.slice(0, -1) + 'u';
          i += 2;
          continue;
        }
      }

      // If followed by vowel sign
      if (MALAYALAM_VOWEL_SIGNS[nextChar]) {
        result += base.slice(0, -1) + MALAYALAM_VOWEL_SIGNS[nextChar];
        i += 2;
        continue;
      }

      result += base;
      i++;
      continue;
    }

    // Non-Malayalam character (English, punctuation, numbers, spaces)
    result += char;
    i++;
  }

  return result.replace(/\s+/g, ' ').trim();
}
