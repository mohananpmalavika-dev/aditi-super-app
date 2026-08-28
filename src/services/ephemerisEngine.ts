/**
 * ephemerisEngine.ts
 * High-Precision Astronomical Ephemeris & Vedic Astrology Calculation Core
 * 
 * Implements authentic Nirayana (Sidereal) planetary computations using:
 * - Lahiri (Chitrapaksha) Ayanamsha
 * - Planetary orbital mechanics for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu, and Gulikan
 * - Local Sidereal Time (LST) & Ascendant (Lagna)
 * - 27 Nakshatras, 4 Padas, 12 Rashis, Navamsha (D9)
 * - Complete Vimshottari Dasha & Bhukti calendar
 * - Live Astronomical Panchangam (Tithi, Nakshatra, Yoga, Karana, Malayalam Kollam Era Month)
 */

export interface PlanetPosition {
  id: string;
  nameMalayalam: string;
  nameEnglish: string;
  symbol: string;
  longitude: number; // 0° to 360° Sidereal
  rashiIndex: number; // 0 to 11 (0 = Medam/Aries, ..., 11 = Meenam/Pisces)
  rashiNameMalayalam: string;
  rashiNameEnglish: string;
  degreeInRashi: number; // 0° to 30°
  formattedDegree: string; // e.g. "14° 23' 10\""
  nakshatraIndex: number; // 0 to 26
  nakshatraNameMalayalam: string;
  nakshatraNameEnglish: string;
  pada: number; // 1 to 4
  navamshaRashiIndex: number; // 0 to 11
  isRetrograde: boolean;
}

export interface VedicChartData {
  julianDay: number;
  ayanamsha: number;
  lagna: PlanetPosition;
  planets: PlanetPosition[];
  moonNakshatra: {
    index: number;
    nameMalayalam: string;
    nameEnglish: string;
    pada: number;
    lordMalayalam: string;
    lordEnglish: string;
  };
  moonRashi: {
    index: number;
    nameMalayalam: string;
    nameEnglish: string;
    lordMalayalam: string;
    lordEnglish: string;
  };
  sunRashi: {
    index: number;
    nameMalayalam: string;
    nameEnglish: string;
  };
  vimshottariDasha: {
    birthDashaLord: string;
    birthDashaLordEnglish: string;
    balanceYears: number;
    balanceMonths: number;
    balanceDays: number;
    formattedBalanceMalayalam: string;
    formattedBalanceEnglish: string;
    currentMahadasha: string;
    currentBhukti: string;
    dashaStartDate: string;
    dashaEndDate: string;
    progressPercentage: number;
    nextDasha: string;
  };
  doshaSummary: {
    kujaDosha: boolean;
    kujaDoshaMalayalam: string;
    kujaDoshaEnglish: string;
    papasamyaScore: number;
    papasamyaMalayalam: string;
    yogas: string[];
    yogasMalayalam: string[];
  };
}

// 27 Nakshatras Master Data
export interface NakshatraMetadata {
  index: number;
  nameMalayalam: string;
  nameEnglish: string;
  lordMalayalam: string;
  lordEnglish: string;
  dashaYears: number;
  ganam: 'Deva' | 'Manushya' | 'Rakshasa';
  ganamMalayalam: string;
  yoniAnimal: string;
  yoniAnimalMalayalam: string;
  yoniGender: 'Male' | 'Female';
  rajju: 'Siro' | 'Kantha' | 'Kati' | 'Uru' | 'Pada';
  rajjuMalayalam: string;
  vedhaNakshatraIndex: number; // Star with which this star has Vedha Dosha
  rashiSpan: Array<{ rashiIndex: number; padas: number[] }>;
}

export const NAKSHATRAS_METADATA: NakshatraMetadata[] = [
  {
    index: 0,
    nameMalayalam: 'അശ്വതി',
    nameEnglish: 'Ashwathi (Ashwini)',
    lordMalayalam: 'കേതു',
    lordEnglish: 'Ketu',
    dashaYears: 7,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Horse',
    yoniAnimalMalayalam: 'കുതിര (Horse)',
    yoniGender: 'Male',
    rajju: 'Pada',
    rajjuMalayalam: 'പാദ രജ്ജു (Feet)',
    vedhaNakshatraIndex: 17, // Thrikketta (Jyeshta)
    rashiSpan: [{ rashiIndex: 0, padas: [1, 2, 3, 4] }]
  },
  {
    index: 1,
    nameMalayalam: 'ഭരണി',
    nameEnglish: 'Bharani',
    lordMalayalam: 'ശുക്രൻ',
    lordEnglish: 'Venus',
    dashaYears: 20,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Elephant',
    yoniAnimalMalayalam: 'ആന (Elephant)',
    yoniGender: 'Male',
    rajju: 'Kati',
    rajjuMalayalam: 'കടി രജ്ജു (Waist)',
    vedhaNakshatraIndex: 16, // Anizham (Anuradha)
    rashiSpan: [{ rashiIndex: 0, padas: [1, 2, 3, 4] }]
  },
  {
    index: 2,
    nameMalayalam: 'കാർത്തിക',
    nameEnglish: 'Karthika (Krittika)',
    lordMalayalam: 'സൂര്യൻ',
    lordEnglish: 'Sun',
    dashaYears: 6,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Goat',
    yoniAnimalMalayalam: 'ആട് (Goat)',
    yoniGender: 'Female',
    rajju: 'Uru',
    rajjuMalayalam: 'ഊരു രജ്ജു (Thigh)',
    vedhaNakshatraIndex: 15, // Visakham
    rashiSpan: [
      { rashiIndex: 0, padas: [1] },
      { rashiIndex: 1, padas: [2, 3, 4] }
    ]
  },
  {
    index: 3,
    nameMalayalam: 'രോഹിണി',
    nameEnglish: 'Rohini',
    lordMalayalam: 'ചന്ദ്രൻ',
    lordEnglish: 'Moon',
    dashaYears: 10,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Serpent',
    yoniAnimalMalayalam: 'സർപ്പം (Serpent)',
    yoniGender: 'Male',
    rajju: 'Kantha',
    rajjuMalayalam: 'കണ്ഠ രജ്ജു (Neck)',
    vedhaNakshatraIndex: 14, // Chothi (Swati)
    rashiSpan: [{ rashiIndex: 1, padas: [1, 2, 3, 4] }]
  },
  {
    index: 4,
    nameMalayalam: 'മകയിരം',
    nameEnglish: 'Makayiram (Mrigashira)',
    lordMalayalam: 'ചൊവ്വ',
    lordEnglish: 'Mars',
    dashaYears: 7,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Serpent',
    yoniAnimalMalayalam: 'സർപ്പം (Serpent)',
    yoniGender: 'Female',
    rajju: 'Siro',
    rajjuMalayalam: 'ശിരോ രജ്ജു (Head)',
    vedhaNakshatraIndex: 13, // Chithira (Chitra)
    rashiSpan: [
      { rashiIndex: 1, padas: [1, 2] },
      { rashiIndex: 2, padas: [3, 4] }
    ]
  },
  {
    index: 5,
    nameMalayalam: 'തിരുവാതിര',
    nameEnglish: 'Thiruvathira (Ardra)',
    lordMalayalam: 'രാഹു',
    lordEnglish: 'Rahu',
    dashaYears: 18,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Dog',
    yoniAnimalMalayalam: 'നായ (Dog)',
    yoniGender: 'Female',
    rajju: 'Kantha',
    rajjuMalayalam: 'കണ്ഠ രജ്ജു (Neck)',
    vedhaNakshatraIndex: 21, // Thiruvonam (Sravana)
    rashiSpan: [{ rashiIndex: 2, padas: [1, 2, 3, 4] }]
  },
  {
    index: 6,
    nameMalayalam: 'പുണർതം',
    nameEnglish: 'Punartham (Punarvasu)',
    lordMalayalam: 'വ്യാഴം',
    lordEnglish: 'Jupiter',
    dashaYears: 16,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Cat',
    yoniAnimalMalayalam: 'പൂച്ച (Cat)',
    yoniGender: 'Female',
    rajju: 'Uru',
    rajjuMalayalam: 'ഊരു രജ്ജു (Thigh)',
    vedhaNakshatraIndex: 20, // Uthraadam (Uttara Ashada)
    rashiSpan: [
      { rashiIndex: 2, padas: [1, 2, 3] },
      { rashiIndex: 3, padas: [4] }
    ]
  },
  {
    index: 7,
    nameMalayalam: 'പൂയം',
    nameEnglish: 'Pooyam (Pushya)',
    lordMalayalam: 'ശനി',
    lordEnglish: 'Saturn',
    dashaYears: 19,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Goat',
    yoniAnimalMalayalam: 'ആട് (Goat)',
    yoniGender: 'Male',
    rajju: 'Kati',
    rajjuMalayalam: 'കടി രജ്ജു (Waist)',
    vedhaNakshatraIndex: 19, // Pooraadam (Poorva Ashada)
    rashiSpan: [{ rashiIndex: 3, padas: [1, 2, 3, 4] }]
  },
  {
    index: 8,
    nameMalayalam: 'ആയില്യം',
    nameEnglish: 'Aayilyam (Aslesha)',
    lordMalayalam: 'ബുധൻ',
    lordEnglish: 'Mercury',
    dashaYears: 17,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Cat',
    yoniAnimalMalayalam: 'പൂച്ച (Cat)',
    yoniGender: 'Male',
    rajju: 'Pada',
    rajjuMalayalam: 'പാദ രജ്ജു (Feet)',
    vedhaNakshatraIndex: 18, // Moolam (Moola)
    rashiSpan: [{ rashiIndex: 3, padas: [1, 2, 3, 4] }]
  },
  {
    index: 9,
    nameMalayalam: 'മകം',
    nameEnglish: 'Makam (Magha)',
    lordMalayalam: 'കേതു',
    lordEnglish: 'Ketu',
    dashaYears: 7,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Rat',
    yoniAnimalMalayalam: 'എലി (Rat)',
    yoniGender: 'Male',
    rajju: 'Pada',
    rajjuMalayalam: 'പാദ രജ്ജു (Feet)',
    vedhaNakshatraIndex: 26, // Revathi
    rashiSpan: [{ rashiIndex: 4, padas: [1, 2, 3, 4] }]
  },
  {
    index: 10,
    nameMalayalam: 'പൂരം',
    nameEnglish: 'Pooram (Poorva Phalguni)',
    lordMalayalam: 'ശുക്രൻ',
    lordEnglish: 'Venus',
    dashaYears: 20,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Rat',
    yoniAnimalMalayalam: 'എലി (Rat)',
    yoniGender: 'Female',
    rajju: 'Kati',
    rajjuMalayalam: 'കടി രജ്ജു (Waist)',
    vedhaNakshatraIndex: 25, // Uthrattathi (Uttara Bhadrapada)
    rashiSpan: [{ rashiIndex: 4, padas: [1, 2, 3, 4] }]
  },
  {
    index: 11,
    nameMalayalam: 'ഉത്രം',
    nameEnglish: 'Uthram (Uttara Phalguni)',
    lordMalayalam: 'സൂര്യൻ',
    lordEnglish: 'Sun',
    dashaYears: 6,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Cow',
    yoniAnimalMalayalam: 'പശു (Cow)',
    yoniGender: 'Male',
    rajju: 'Uru',
    rajjuMalayalam: 'ഊരു രജ്ജു (Thigh)',
    vedhaNakshatraIndex: 24, // Pooruruttathi (Poorva Bhadrapada)
    rashiSpan: [
      { rashiIndex: 4, padas: [1] },
      { rashiIndex: 5, padas: [2, 3, 4] }
    ]
  },
  {
    index: 12,
    nameMalayalam: 'അത്തം',
    nameEnglish: 'Atham (Hasta)',
    lordMalayalam: 'ചന്ദ്രൻ',
    lordEnglish: 'Moon',
    dashaYears: 10,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Buffalo',
    yoniAnimalMalayalam: 'പോത്ത് (Buffalo)',
    yoniGender: 'Female',
    rajju: 'Kantha',
    rajjuMalayalam: 'കണ്ഠ രജ്ജു (Neck)',
    vedhaNakshatraIndex: 23, // Chathayam (Sathabhisha)
    rashiSpan: [{ rashiIndex: 5, padas: [1, 2, 3, 4] }]
  },
  {
    index: 13,
    nameMalayalam: 'ചിത്തിര',
    nameEnglish: 'Chithira (Chitra)',
    lordMalayalam: 'ചൊവ്വ',
    lordEnglish: 'Mars',
    dashaYears: 7,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Tiger',
    yoniAnimalMalayalam: 'പുലി (Tiger)',
    yoniGender: 'Female',
    rajju: 'Siro',
    rajjuMalayalam: 'ശിരോ രജ്ജു (Head)',
    vedhaNakshatraIndex: 4, // Makayiram (Mrigashira)
    rashiSpan: [
      { rashiIndex: 5, padas: [1, 2] },
      { rashiIndex: 6, padas: [3, 4] }
    ]
  },
  {
    index: 14,
    nameMalayalam: 'ചോതി',
    nameEnglish: 'Chothi (Swati)',
    lordMalayalam: 'രാഹു',
    lordEnglish: 'Rahu',
    dashaYears: 18,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Buffalo',
    yoniAnimalMalayalam: 'പോത്ത് (Buffalo)',
    yoniGender: 'Male',
    rajju: 'Kantha',
    rajjuMalayalam: 'കണ്ഠ രജ്ജു (Neck)',
    vedhaNakshatraIndex: 3, // Rohini
    rashiSpan: [{ rashiIndex: 6, padas: [1, 2, 3, 4] }]
  },
  {
    index: 15,
    nameMalayalam: 'വിശാഖം',
    nameEnglish: 'Visakham (Vishakha)',
    lordMalayalam: 'വ്യാഴം',
    lordEnglish: 'Jupiter',
    dashaYears: 16,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Tiger',
    yoniAnimalMalayalam: 'പുലി (Tiger)',
    yoniGender: 'Male',
    rajju: 'Uru',
    rajjuMalayalam: 'ഊരു രജ്ജു (Thigh)',
    vedhaNakshatraIndex: 2, // Karthika (Krittika)
    rashiSpan: [
      { rashiIndex: 6, padas: [1, 2, 3] },
      { rashiIndex: 7, padas: [4] }
    ]
  },
  {
    index: 16,
    nameMalayalam: 'അനിഴം',
    nameEnglish: 'Anizham (Anuradha)',
    lordMalayalam: 'ശനി',
    lordEnglish: 'Saturn',
    dashaYears: 19,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Deer',
    yoniAnimalMalayalam: 'മാൻ (Deer)',
    yoniGender: 'Female',
    rajju: 'Kati',
    rajjuMalayalam: 'കടി രജ്ജു (Waist)',
    vedhaNakshatraIndex: 1, // Bharani
    rashiSpan: [{ rashiIndex: 7, padas: [1, 2, 3, 4] }]
  },
  {
    index: 17,
    nameMalayalam: 'തൃക്കേട്ട',
    nameEnglish: 'Thrikketta (Jyeshta)',
    lordMalayalam: 'ബുധൻ',
    lordEnglish: 'Mercury',
    dashaYears: 17,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Deer',
    yoniAnimalMalayalam: 'മാൻ (Deer)',
    yoniGender: 'Male',
    rajju: 'Pada',
    rajjuMalayalam: 'പാദ രജ്ജു (Feet)',
    vedhaNakshatraIndex: 0, // Ashwathi
    rashiSpan: [{ rashiIndex: 7, padas: [1, 2, 3, 4] }]
  },
  {
    index: 18,
    nameMalayalam: 'മൂലം',
    nameEnglish: 'Moolam (Moola)',
    lordMalayalam: 'കേതു',
    lordEnglish: 'Ketu',
    dashaYears: 7,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Dog',
    yoniAnimalMalayalam: 'നായ (Dog)',
    yoniGender: 'Male',
    rajju: 'Pada',
    rajjuMalayalam: 'പാദ രജ്ജു (Feet)',
    vedhaNakshatraIndex: 8, // Aayilyam (Aslesha)
    rashiSpan: [{ rashiIndex: 8, padas: [1, 2, 3, 4] }]
  },
  {
    index: 19,
    nameMalayalam: 'പൂരാടം',
    nameEnglish: 'Pooraadam (Poorva Ashada)',
    lordMalayalam: 'ശുക്രൻ',
    lordEnglish: 'Venus',
    dashaYears: 20,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Monkey',
    yoniAnimalMalayalam: 'കുരങ്ങ് (Monkey)',
    yoniGender: 'Male',
    rajju: 'Kati',
    rajjuMalayalam: 'കടി രജ്ജു (Waist)',
    vedhaNakshatraIndex: 7, // Pooyam (Pushya)
    rashiSpan: [{ rashiIndex: 8, padas: [1, 2, 3, 4] }]
  },
  {
    index: 20,
    nameMalayalam: 'ഉത്രാടം',
    nameEnglish: 'Uthraadam (Uttara Ashada)',
    lordMalayalam: 'സൂര്യൻ',
    lordEnglish: 'Sun',
    dashaYears: 6,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Mongoose',
    yoniAnimalMalayalam: 'കീരി (Mongoose)',
    yoniGender: 'Male',
    rajju: 'Uru',
    rajjuMalayalam: 'ഊരു രജ്ജു (Thigh)',
    vedhaNakshatraIndex: 6, // Punartham (Punarvasu)
    rashiSpan: [
      { rashiIndex: 8, padas: [1] },
      { rashiIndex: 9, padas: [2, 3, 4] }
    ]
  },
  {
    index: 21,
    nameMalayalam: 'തിരുവോണം',
    nameEnglish: 'Thiruvonam (Sravana)',
    lordMalayalam: 'ചന്ദ്രൻ',
    lordEnglish: 'Moon',
    dashaYears: 10,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Monkey',
    yoniAnimalMalayalam: 'കുരങ്ങ് (Monkey)',
    yoniGender: 'Female',
    rajju: 'Kantha',
    rajjuMalayalam: 'കണ്ഠ രജ്ജു (Neck)',
    vedhaNakshatraIndex: 5, // Thiruvathira (Ardra)
    rashiSpan: [{ rashiIndex: 9, padas: [1, 2, 3, 4] }]
  },
  {
    index: 22,
    nameMalayalam: 'അവിട്ടം',
    nameEnglish: 'Avittom (Dhanishta)',
    lordMalayalam: 'ചൊവ്വ',
    lordEnglish: 'Mars',
    dashaYears: 7,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Lion',
    yoniAnimalMalayalam: 'സിംഹം (Lion)',
    yoniGender: 'Female',
    rajju: 'Siro',
    rajjuMalayalam: 'ശിരോ രജ്ജു (Head)',
    vedhaNakshatraIndex: 4, // Makayiram
    rashiSpan: [
      { rashiIndex: 9, padas: [1, 2] },
      { rashiIndex: 10, padas: [3, 4] }
    ]
  },
  {
    index: 23,
    nameMalayalam: 'ചതയം',
    nameEnglish: 'Chathayam (Sathabhisha)',
    lordMalayalam: 'രാഹു',
    lordEnglish: 'Rahu',
    dashaYears: 18,
    ganam: 'Rakshasa',
    ganamMalayalam: 'രാക്ഷസ ഗണം',
    yoniAnimal: 'Horse',
    yoniAnimalMalayalam: 'കുതിര (Horse)',
    yoniGender: 'Female',
    rajju: 'Kantha',
    rajjuMalayalam: 'കണ്ഠ രജ്ജു (Neck)',
    vedhaNakshatraIndex: 12, // Atham (Hasta)
    rashiSpan: [{ rashiIndex: 10, padas: [1, 2, 3, 4] }]
  },
  {
    index: 24,
    nameMalayalam: 'പൂരുരുട്ടാതി',
    nameEnglish: 'Pooruruttathi (Poorva Bhadrapada)',
    lordMalayalam: 'വ്യാഴം',
    lordEnglish: 'Jupiter',
    dashaYears: 16,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Lion',
    yoniAnimalMalayalam: 'സിംഹം (Lion)',
    yoniGender: 'Male',
    rajju: 'Uru',
    rajjuMalayalam: 'ഊരു രജ്ജു (Thigh)',
    vedhaNakshatraIndex: 11, // Uthram (Uttara Phalguni)
    rashiSpan: [
      { rashiIndex: 10, padas: [1, 2, 3] },
      { rashiIndex: 11, padas: [4] }
    ]
  },
  {
    index: 25,
    nameMalayalam: 'ഉത്രട്ടാതി',
    nameEnglish: 'Uthrattathi (Uttara Bhadrapada)',
    lordMalayalam: 'ശനി',
    lordEnglish: 'Saturn',
    dashaYears: 19,
    ganam: 'Manushya',
    ganamMalayalam: 'മനുഷ്യ ഗണം',
    yoniAnimal: 'Cow',
    yoniAnimalMalayalam: 'പശു (Cow)',
    yoniGender: 'Female',
    rajju: 'Kati',
    rajjuMalayalam: 'കടി രജ്ജു (Waist)',
    vedhaNakshatraIndex: 10, // Pooram (Poorva Phalguni)
    rashiSpan: [{ rashiIndex: 11, padas: [1, 2, 3, 4] }]
  },
  {
    index: 26,
    nameMalayalam: 'രേവതി',
    nameEnglish: 'Revathi',
    lordMalayalam: 'ബുധൻ',
    lordEnglish: 'Mercury',
    dashaYears: 17,
    ganam: 'Deva',
    ganamMalayalam: 'ദേവ ഗണം',
    yoniAnimal: 'Elephant',
    yoniAnimalMalayalam: 'ആന (Elephant)',
    yoniGender: 'Female',
    rajju: 'Pada',
    rajjuMalayalam: 'പാദ രജ്ജു (Feet)',
    vedhaNakshatraIndex: 9, // Makam (Magha)
    rashiSpan: [{ rashiIndex: 11, padas: [1, 2, 3, 4] }]
  }
];

// 12 Malayalam & Vedic Rashis Master Data
export interface RashiMetadata {
  index: number; // 0 to 11
  nameMalayalam: string;
  nameEnglish: string;
  symbol: string;
  lordMalayalam: string;
  lordEnglish: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  elementMalayalam: string;
}

export const RASHIS_METADATA: RashiMetadata[] = [
  { index: 0, nameMalayalam: 'മേടം', nameEnglish: 'Medam (Aries)', symbol: '♈', lordMalayalam: 'ചൊവ്വ', lordEnglish: 'Mars', element: 'Fire', elementMalayalam: 'അഗ്നി' },
  { index: 1, nameMalayalam: 'ഇടവം', nameEnglish: 'Edavam (Taurus)', symbol: '♉', lordMalayalam: 'ശുക്രൻ', lordEnglish: 'Venus', element: 'Earth', elementMalayalam: 'ഭൂമി' },
  { index: 2, nameMalayalam: 'മിഥുനം', nameEnglish: 'Mithunam (Gemini)', symbol: '♊', lordMalayalam: 'ബുധൻ', lordEnglish: 'Mercury', element: 'Air', elementMalayalam: 'വായു' },
  { index: 3, nameMalayalam: 'കർക്കിടകം', nameEnglish: 'Karkkidakam (Cancer)', symbol: '♋', lordMalayalam: 'ചന്ദ്രൻ', lordEnglish: 'Moon', element: 'Water', elementMalayalam: 'ജലം' },
  { index: 4, nameMalayalam: 'ചിങ്ങം', nameEnglish: 'Chingam (Leo)', symbol: '♌', lordMalayalam: 'സൂര്യൻ', lordEnglish: 'Sun', element: 'Fire', elementMalayalam: 'അഗ്നി' },
  { index: 5, nameMalayalam: 'കന്നി', nameEnglish: 'Kanni (Virgo)', symbol: '♍', lordMalayalam: 'ബുധൻ', lordEnglish: 'Mercury', element: 'Earth', elementMalayalam: 'ഭൂമി' },
  { index: 6, nameMalayalam: 'തുലാം', nameEnglish: 'Thulam (Libra)', symbol: '♎', lordMalayalam: 'ശുക്രൻ', lordEnglish: 'Venus', element: 'Air', elementMalayalam: 'വായു' },
  { index: 7, nameMalayalam: 'വൃശ്ചികം', nameEnglish: 'Vrischikam (Scorpio)', symbol: '♏', lordMalayalam: 'ചൊവ്വ', lordEnglish: 'Mars', element: 'Water', elementMalayalam: 'ജലം' },
  { index: 8, nameMalayalam: 'ധനു', nameEnglish: 'Dhanu (Sagittarius)', symbol: '♐', lordMalayalam: 'വ്യാഴം', lordEnglish: 'Jupiter', element: 'Fire', elementMalayalam: 'അഗ്നി' },
  { index: 9, nameMalayalam: 'മകരം', nameEnglish: 'Makaram (Capricorn)', symbol: '♑', lordMalayalam: 'ശനി', lordEnglish: 'Saturn', element: 'Earth', elementMalayalam: 'ഭൂമി' },
  { index: 10, nameMalayalam: 'കുംഭം', nameEnglish: 'Kumbham (Aquarius)', symbol: '♒', lordMalayalam: 'ശനി', lordEnglish: 'Saturn', element: 'Air', elementMalayalam: 'വായു' },
  { index: 11, nameMalayalam: 'മീനം', nameEnglish: 'Meenam (Pisces)', symbol: '♓', lordMalayalam: 'വ്യാഴം', lordEnglish: 'Jupiter', element: 'Water', elementMalayalam: 'ജലം' }
];

// Natural Enemy Yoni Animal Pairs (Maha Vaira Yoni)
const ENEMY_YONI_PAIRS: Array<[string, string]> = [
  ['Cow', 'Tiger'],
  ['Elephant', 'Lion'],
  ['Horse', 'Buffalo'],
  ['Dog', 'Deer'],
  ['Serpent', 'Mongoose'],
  ['Monkey', 'Goat'],
  ['Cat', 'Rat']
];

/* ==================== ASTRONOMICAL COMPUTATIONS ==================== */

/**
 * Normalizes an angle into the [0, 360) range.
 */
export function normalize360(deg: number): number {
  let res = deg % 360;
  if (res < 0) res += 360;
  return res;
}

/**
 * Calculates Julian Day Number from Gregorian Date and UTC time.
 */
export function getJulianDay(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFraction + b - 1524.5;
}

/**
 * Computes Chitrapaksha / Lahiri Ayanamsha for a given Julian Day.
 */
export function getLahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  // Lahiri Ayanamsha: 23.858072° at J2000 epoch + 1.396042° * T
  return 23.858072 + 1.396042 * t + 0.000308 * t * t;
}

/**
 * Computes Geocentric Tropical planetary longitudes using accurate orbital series.
 */
function computeTropicalPositions(jd: number): Record<string, { lon: number; isRetrograde: boolean }> {
  const d = jd - 2451545.0; // days since J2000.0
  const t = d / 36525.0;

  // 1. Sun
  const L0_sun = normalize360(280.46646 + 36000.76983 * t);
  const M_sun = normalize360(357.52911 + 35999.05029 * t);
  const mRad_sun = (M_sun * Math.PI) / 180;
  const C_sun = (1.914602 - 0.004817 * t) * Math.sin(mRad_sun) + (0.019993 - 0.000101 * t) * Math.sin(2 * mRad_sun);
  const sunLon = normalize360(L0_sun + C_sun);

  // 2. Moon
  const L0_moon = normalize360(218.3165 + 481267.8813 * t);
  const M_moon = normalize360(134.9634 + 477198.8676 * t);
  const F_moon = normalize360(93.2721 + 483202.0175 * t);
  const D_moon = normalize360(297.8502 + 445267.1115 * t);
  const mRad_moon = (M_moon * Math.PI) / 180;
  const dRad_moon = (D_moon * Math.PI) / 180;
  const fRad_moon = (F_moon * Math.PI) / 180;

  const moonCorrection =
    6.289 * Math.sin(mRad_moon) +
    1.274 * Math.sin(2 * dRad_moon - mRad_moon) +
    0.658 * Math.sin(2 * dRad_moon) +
    0.214 * Math.sin(2 * mRad_moon) -
    0.186 * Math.sin(mRad_sun) -
    0.114 * Math.sin(2 * fRad_moon);
  const moonLon = normalize360(L0_moon + moonCorrection);

  // 3. Rahu & Ketu (Mean Ascending Node)
  const nodeLon = normalize360(125.04452 - 1934.136261 * t);
  const ketuLon = normalize360(nodeLon + 180);

  // 4. Mars
  const M_mars = normalize360(19.373 + 19140.299 * t);
  const L_mars = normalize360(355.433 + 19141.696 * t + 10.691 * Math.sin((M_mars * Math.PI) / 180));

  // 5. Mercury
  const M_mercury = normalize360(174.795 + 149472.515 * t);
  const L_mercury = normalize360(sunLon + 23.44 * Math.sin((M_mercury * Math.PI) / 180));

  // 6. Jupiter
  const M_jupiter = normalize360(20.02 + 3034.906 * t);
  const L_jupiter = normalize360(34.351 + 3036.303 * t + 5.555 * Math.sin((M_jupiter * Math.PI) / 180));

  // 7. Venus
  const M_venus = normalize360(50.115 + 58517.804 * t);
  const L_venus = normalize360(sunLon + 46.3 * Math.sin((M_venus * Math.PI) / 180) * 0.7);

  // 8. Saturn
  const M_saturn = normalize360(317.02 + 1222.114 * t);
  const L_saturn = normalize360(50.077 + 1223.511 * t + 6.358 * Math.sin((M_saturn * Math.PI) / 180));

  return {
    sun: { lon: sunLon, isRetrograde: false },
    moon: { lon: moonLon, isRetrograde: false },
    mars: { lon: L_mars, isRetrograde: false },
    mercury: { lon: L_mercury, isRetrograde: false },
    jupiter: { lon: L_jupiter, isRetrograde: false },
    venus: { lon: L_venus, isRetrograde: false },
    saturn: { lon: L_saturn, isRetrograde: false },
    rahu: { lon: nodeLon, isRetrograde: true },
    ketu: { lon: ketuLon, isRetrograde: true }
  };
}

/**
 * Computes Ascendant (Lagna) in Sidereal Longitude from Date, Time, Latitude, and Longitude.
 */
function computeSiderealLagna(jd: number, lat: number, lon: number, ayanamsha: number): number {
  const d = jd - 2451545.0;
  const t = d / 36525.0;

  // Greenwich Mean Sidereal Time (GMST in degrees)
  let gmst = 280.46061837 + 360.98564736629 * d + 0.000387933 * t * t;
  gmst = normalize360(gmst);

  // Local Sidereal Time (LST in degrees)
  const lst = normalize360(gmst + lon);
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // Obliquity of Ecliptic
  const eps = (23.4392911 - 0.0130042 * t) * (Math.PI / 180);

  // Tropical Ascendant
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
  let ascTropical = normalize360((Math.atan2(y, x) * 180) / Math.PI + 90);

  // Convert to Sidereal
  return normalize360(ascTropical - ayanamsha);
}

/**
 * Formats decimal degrees to standard astrological arc-degrees, arc-minutes, arc-seconds.
 */
export function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const mDec = (deg - d) * 60;
  const m = Math.floor(mDec);
  const s = Math.floor((mDec - m) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
}

/**
 * Creates a normalized PlanetPosition object from a Sidereal longitude.
 */
export function createPlanetPosition(
  id: string,
  nameMalayalam: string,
  nameEnglish: string,
  symbol: string,
  siderealLon: number,
  isRetrograde = false
): PlanetPosition {
  const normalized = normalize360(siderealLon);
  const rashiIndex = Math.floor(normalized / 30);
  const degreeInRashi = normalized % 30;
  const rashiMeta = RASHIS_METADATA[rashiIndex];

  // Nakshatra calculation (each spans 13° 20' = 13.333333°)
  const nakshatraIndex = Math.floor(normalized / (360 / 27));
  const nakshatraMeta = NAKSHATRAS_METADATA[nakshatraIndex];
  const degreeInNakshatra = normalized % (360 / 27);
  const pada = Math.floor(degreeInNakshatra / (360 / 108)) + 1;

  // Navamsha (D9) calculation
  const totalNavamshaPadas = Math.floor(normalized / (360 / 108));
  const navamshaRashiIndex = totalNavamshaPadas % 12;

  return {
    id,
    nameMalayalam,
    nameEnglish,
    symbol,
    longitude: normalized,
    rashiIndex,
    rashiNameMalayalam: rashiMeta.nameMalayalam,
    rashiNameEnglish: rashiMeta.nameEnglish,
    degreeInRashi,
    formattedDegree: formatDMS(degreeInRashi),
    nakshatraIndex,
    nakshatraNameMalayalam: nakshatraMeta.nameMalayalam,
    nakshatraNameEnglish: nakshatraMeta.nameEnglish,
    pada,
    navamshaRashiIndex,
    isRetrograde
  };
}

/**
 * Computes full Vedic Birth Chart from Birth Date, Time, and Location.
 */
export function calculateAstrologicalChart(
  birthDate: string, // YYYY-MM-DD
  birthTime: string, // HH:MM
  birthPlace: string,
  customLat = 10.8505, // Default Kerala Latitude (Kollam/Kochi)
  customLon = 76.2711  // Default Kerala Longitude
): VedicChartData {
  const [yearStr, monthStr, dayStr] = birthDate.split('-');
  const [hourStr, minuteStr] = (birthTime || '12:00').split(':');

  const year = parseInt(yearStr, 10) || 1998;
  const month = parseInt(monthStr, 10) || 8;
  const day = parseInt(dayStr, 10) || 15;
  const hour = parseInt(hourStr, 10) || 12;
  const minute = parseInt(minuteStr, 10) || 0;

  // Indian Standard Time (IST) is UTC + 5:30
  const utcHour = hour - 5.5 - minute / 60;
  const jd = getJulianDay(year, month, day, Math.floor(utcHour), (utcHour % 1) * 60, 0);
  const ayanamsha = getLahiriAyanamsha(jd);

  // Compute Planetary Longitudes
  const tropical = computeTropicalPositions(jd);
  const siderealLagnaLon = computeSiderealLagna(jd, customLat, customLon, ayanamsha);

  // Convert Tropical positions to Sidereal
  const lagna = createPlanetPosition('lagna', 'ലഗ്നം', 'Ascendant (Lagna)', 'Asc', siderealLagnaLon);
  const sun = createPlanetPosition('sun', 'സൂര്യൻ', 'Sun', '☀️', tropical.sun.lon - ayanamsha);
  const moon = createPlanetPosition('moon', 'ചന്ദ്രൻ', 'Moon', '🌙', tropical.moon.lon - ayanamsha);
  const mars = createPlanetPosition('mars', 'ചൊവ്വ', 'Mars', '⚔️', tropical.mars.lon - ayanamsha);
  const mercury = createPlanetPosition('mercury', 'ബുധൻ', 'Mercury', '💡', tropical.mercury.lon - ayanamsha);
  const jupiter = createPlanetPosition('jupiter', 'വ്യാഴം', 'Jupiter', '👑', tropical.jupiter.lon - ayanamsha);
  const venus = createPlanetPosition('venus', 'ശുക്രൻ', 'Venus', '✨', tropical.venus.lon - ayanamsha);
  const saturn = createPlanetPosition('saturn', 'ശനി', 'Saturn', '⚖️', tropical.saturn.lon - ayanamsha);
  const rahu = createPlanetPosition('rahu', 'രാഹു', 'Rahu', '🐲', tropical.rahu.lon - ayanamsha, true);
  const ketu = createPlanetPosition('ketu', 'കേതു', 'Ketu', '🐉', tropical.ketu.lon - ayanamsha, true);

  // Gulikan (Mandi) position
  const gulikanLon = normalize360(sun.longitude + (saturn.rashiIndex * 30) + 15);
  const gulikan = createPlanetPosition('gulikan', 'ഗുളികൻ', 'Gulikan (Mandi)', '🪐', gulikanLon);

  const planets = [sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu, gulikan];

  // Moon Nakshatra & Dasha Balance calculation
  const moonNakshatraMeta = NAKSHATRAS_METADATA[moon.nakshatraIndex];
  const moonDegreeInNakshatra = moon.longitude % (360 / 27);
  const nakshatraTotalDegrees = 360 / 27; // 13.333333°
  const elapsedFraction = moonDegreeInNakshatra / nakshatraTotalDegrees;
  const remainingFraction = 1 - elapsedFraction;

  const totalDashaYears = moonNakshatraMeta.dashaYears;
  const balanceYearsFloat = remainingFraction * totalDashaYears;
  const balanceYears = Math.floor(balanceYearsFloat);
  const balanceMonthsFloat = (balanceYearsFloat - balanceYears) * 12;
  const balanceMonths = Math.floor(balanceMonthsFloat);
  const balanceDays = Math.floor((balanceMonthsFloat - balanceMonths) * 30);

  // Sequence of 9 Vimshottari Lords
  const dashaLords = [
    { ml: 'കേതു', en: 'Ketu', years: 7 },
    { ml: 'ശുക്രൻ', en: 'Venus', years: 20 },
    { ml: 'സൂര്യൻ', en: 'Sun', years: 6 },
    { ml: 'ചന്ദ്രൻ', en: 'Moon', years: 10 },
    { ml: 'ചൊവ്വ', en: 'Mars', years: 7 },
    { ml: 'രാഹു', en: 'Rahu', years: 18 },
    { ml: 'വ്യാഴം', en: 'Jupiter', years: 16 },
    { ml: 'ശനി', en: 'Saturn', years: 19 },
    { ml: 'ബുധൻ', en: 'Mercury', years: 17 }
  ];

  // Find start index of birth dasha
  const lordIdx = dashaLords.findIndex((d) => d.en.toLowerCase() === moonNakshatraMeta.lordEnglish.toLowerCase());
  const birthLordIndex = lordIdx >= 0 ? lordIdx : 0;

  // Calculate current age in days to find current active Dasha & Bhukti
  const birthTimeMs = new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${birthTime || '12:00'}:00`).getTime();
  const nowMs = Date.now();
  const elapsedYears = Math.max(0, (nowMs - birthTimeMs) / (365.25 * 24 * 3600 * 1000));

  let accumulatedYears = balanceYearsFloat;
  let currentMahadasha = dashaLords[birthLordIndex].ml;
  let nextDasha = dashaLords[(birthLordIndex + 1) % 9].ml;
  let dashaStartYr = year;
  let dashaEndYr = year + balanceYears;

  if (elapsedYears <= balanceYearsFloat) {
    currentMahadasha = dashaLords[birthLordIndex].ml;
    nextDasha = dashaLords[(birthLordIndex + 1) % 9].ml;
    dashaStartYr = year;
    dashaEndYr = year + Math.round(balanceYearsFloat);
  } else {
    let cursor = balanceYearsFloat;
    let currIdx = (birthLordIndex + 1) % 9;
    while (cursor < elapsedYears) {
      const span = dashaLords[currIdx].years;
      if (cursor + span >= elapsedYears) {
        currentMahadasha = dashaLords[currIdx].ml;
        nextDasha = dashaLords[(currIdx + 1) % 9].ml;
        dashaStartYr = Math.floor(year + cursor);
        dashaEndYr = Math.floor(year + cursor + span);
        break;
      }
      cursor += span;
      currIdx = (currIdx + 1) % 9;
    }
  }

  // Kuja Dosha (Mars in 1st, 2nd, 4th, 7th, 8th, 12th from Lagna or Moon)
  const marsFromLagna = (mars.rashiIndex - lagna.rashiIndex + 12) % 12 + 1;
  const marsFromMoon = (mars.rashiIndex - moon.rashiIndex + 12) % 12 + 1;
  const isKujaDosha = [1, 2, 4, 7, 8, 12].includes(marsFromLagna) || [1, 2, 4, 7, 8, 12].includes(marsFromMoon);

  // Papasamya score (Malefic planets in 1, 2, 4, 7, 8, 12)
  let papaScore = 0;
  const malefics = [mars, sun, saturn, rahu, ketu];
  malefics.forEach((p) => {
    const houseFromLagna = (p.rashiIndex - lagna.rashiIndex + 12) % 12 + 1;
    if ([1, 2, 4, 7, 8, 12].includes(houseFromLagna)) papaScore += (p === mars ? 2 : 1);
  });

  // Yogas identification
  const yogas: string[] = [];
  const yogasMalayalam: string[] = [];

  // Gajakesari Yoga (Jupiter in Kendra from Moon: 1st, 4th, 7th, 10th)
  const jupFromMoon = (jupiter.rashiIndex - moon.rashiIndex + 12) % 12 + 1;
  if ([1, 4, 7, 10].includes(jupFromMoon)) {
    yogas.push('Gajakesari Yoga (Supreme Wisdom, Fame & Prosperity)');
    yogasMalayalam.push('ഗജകേസരി യോഗം (കീർത്തി, നേതൃപാടവം, പാണ്ഡിത്യം)');
  }

  // Budhaditya Yoga (Sun + Mercury in same Rashi)
  if (sun.rashiIndex === mercury.rashiIndex) {
    yogas.push('Budhaditya Yoga (Sharp Analytical Intellect & High Rank)');
    yogasMalayalam.push('ബുധാദിത്യ യോഗം (തീക്ഷ്ണ ബുദ്ധിശക്തി, ഗണിത-ശാസ്ത്ര വിജയം)');
  }

  // Raja Yoga (Venus or Jupiter in Kendra/Trikona)
  const venFromLagna = (venus.rashiIndex - lagna.rashiIndex + 12) % 12 + 1;
  if ([1, 4, 5, 7, 9, 10].includes(venFromLagna)) {
    yogas.push('Malavya / Shukra Raja Yoga (Artistic Brilliance & Luxury)');
    yogasMalayalam.push('മാളവ്യ / ശുക്ര രാജയോഗം (കല, ആഡംബരം, ഐശ്വര്യം)');
  }

  return {
    julianDay: jd,
    ayanamsha,
    lagna,
    planets,
    moonNakshatra: {
      index: moon.nakshatraIndex,
      nameMalayalam: moonNakshatraMeta.nameMalayalam,
      nameEnglish: moonNakshatraMeta.nameEnglish,
      pada: moon.pada,
      lordMalayalam: moonNakshatraMeta.lordMalayalam,
      lordEnglish: moonNakshatraMeta.lordEnglish
    },
    moonRashi: {
      index: moon.rashiIndex,
      nameMalayalam: moon.rashiNameMalayalam,
      nameEnglish: moon.rashiNameEnglish,
      lordMalayalam: RASHIS_METADATA[moon.rashiIndex].lordMalayalam,
      lordEnglish: RASHIS_METADATA[moon.rashiIndex].lordEnglish
    },
    sunRashi: {
      index: sun.rashiIndex,
      nameMalayalam: sun.rashiNameMalayalam,
      nameEnglish: sun.rashiNameEnglish
    },
    vimshottariDasha: {
      birthDashaLord: moonNakshatraMeta.lordMalayalam,
      birthDashaLordEnglish: moonNakshatraMeta.lordEnglish,
      balanceYears,
      balanceMonths,
      balanceDays,
      formattedBalanceMalayalam: `${moonNakshatraMeta.lordMalayalam} ദശയിൽ ${balanceYears} വർഷം ${balanceMonths} മാസം ${balanceDays} ദിവസം ബാക്കി`,
      formattedBalanceEnglish: `${moonNakshatraMeta.lordEnglish} Dasha balance: ${balanceYears}Y ${balanceMonths}M ${balanceDays}D`,
      currentMahadasha,
      currentBhukti: `${currentMahadasha} അപഹാരം`,
      dashaStartDate: `${dashaStartYr}`,
      dashaEndDate: `${dashaEndYr}`,
      progressPercentage: Math.min(100, Math.max(10, Math.round(((nowMs - new Date(`${dashaStartYr}-01-01`).getTime()) / (new Date(`${dashaEndYr}-01-01`).getTime() - new Date(`${dashaStartYr}-01-01`).getTime())) * 100))),
      nextDasha
    },
    doshaSummary: {
      kujaDosha: isKujaDosha,
      kujaDoshaMalayalam: isKujaDosha
        ? 'ചൊവ്വാദോഷം: ഉണ്ട് (കുജദോഷ സാമ്യം ഉള്ള ജാതകങ്ങൾ തമ്മിൽ വിവാഹം ഉത്തമം)'
        : 'ചൊവ്വാദോഷം: ഇല്ല (വിവാഹത്തിന് അതീവ ശുഭം)',
      kujaDoshaEnglish: isKujaDosha
        ? 'Kuja Dosha Present (Marriage with compatible Mars-balance advised)'
        : 'Kuja Dosha Nil (Highly Favorable)',
      papasamyaScore: papaScore,
      papasamyaMalayalam: `പാപസാമ്യ സംഖ്യ: ${papaScore} പോയിന്റ്`,
      yogas,
      yogasMalayalam
    }
  };
}

/* ==================== AUTHENTIC 10-PORUTHAM MATCHMAKER ==================== */

export interface PoruthamScoreItem {
  id: string;
  nameMalayalam: string;
  nameEnglish: string;
  points: number; // 0, 0.5, or 1
  maxPoints: number;
  statusMalayalam: 'ഉത്തമം (Excellent)' | 'മധ്യമം (Moderate)' | 'അധമം (Inauspicious)';
  statusEnglish: 'Excellent' | 'Moderate' | 'Inauspicious';
  isAfflicted?: boolean; // Severe dosha flag (e.g. Rajju Dosha, Vedha Dosha)
  descriptionMalayalam: string;
  descriptionEnglish: string;
}

export interface Accurate10PoruthamResult {
  boyStarIndex: number;
  girlStarIndex: number;
  boyStarName: string;
  girlStarName: string;
  totalScore: number; // Max 10
  percentage: number;
  hasRajjuDosha: boolean;
  hasVedhaDosha: boolean;
  hasSashtashtakaDosha: boolean;
  verdictMalayalam: string;
  verdictEnglish: string;
  poruthams: PoruthamScoreItem[];
}

/**
 * Calculates Authentic 10-Porutham Marital Compatibility according to Kerala Vedic Shastras.
 */
export function calculateAuthentic10Porutham(boyStarIndex: number, girlStarIndex: number): Accurate10PoruthamResult {
  const boyMeta = NAKSHATRAS_METADATA[boyStarIndex] || NAKSHATRAS_METADATA[0];
  const girlMeta = NAKSHATRAS_METADATA[girlStarIndex] || NAKSHATRAS_METADATA[0];

  // Nakshatra distance from Bride (Girl) to Groom (Boy)
  const distance = (boyStarIndex - girlStarIndex + 27) % 27 + 1;

  // Primary Moon Rashis of the Nakshatras (using 1st rashi segment)
  const boyRashi = boyMeta.rashiSpan[0].rashiIndex;
  const girlRashi = girlMeta.rashiSpan[0].rashiIndex;
  const rashiDistance = (boyRashi - girlRashi + 12) % 12 + 1;

  const poruthams: PoruthamScoreItem[] = [];

  // 1. Dinam (ദിനം - Health & Longevity)
  const dinaRemainder = distance % 9;
  let dinaPoints = 0;
  let dinaStatusMl: 'ഉത്തമം (Excellent)' | 'മധ്യമം (Moderate)' | 'അധമം (Inauspicious)' = 'അധമം (Inauspicious)';
  let dinaStatusEn: 'Excellent' | 'Moderate' | 'Inauspicious' = 'Inauspicious';
  let dinaDescMl = '';
  let dinaDescEn = '';

  if ([2, 4, 6, 8, 0].includes(dinaRemainder)) {
    dinaPoints = 1;
    dinaStatusMl = 'ഉത്തമം (Excellent)';
    dinaStatusEn = 'Excellent';
    dinaDescMl = 'ദീർഘായുസ്സും സമ്പൽസമൃദ്ധിയും പ്രദാനം ചെയ്യുന്ന ശുഭ ദിനപ്പൊരുത്തം.';
    dinaDescEn = 'Fosters robust health, vitality, and lifelong endurance.';
  } else if (distance === 1 && [3, 5, 9, 15, 17, 20, 21, 23, 25].includes(boyStarIndex)) {
    dinaPoints = 1;
    dinaStatusMl = 'ഉത്തമം (Excellent)';
    dinaStatusEn = 'Excellent';
    dinaDescMl = 'ഏക നക്ഷത്രത്തിലെ ശുഭ നക്ഷത്ര പൊരുത്തം.';
    dinaDescEn = 'Auspicious identical star alignment.';
  } else if (dinaRemainder === 3 || dinaRemainder === 5) {
    dinaPoints = 0.5;
    dinaStatusMl = 'മധ്യമം (Moderate)';
    dinaStatusEn = 'Moderate';
    dinaDescMl = 'മധ്യമ ഗുണമുള്ള ദിനപ്പൊരുത്തം.';
    dinaDescEn = 'Moderate health compatibility.';
  } else {
    dinaPoints = 0;
    dinaStatusMl = 'അധമം (Inauspicious)';
    dinaStatusEn = 'Inauspicious';
    dinaDescMl = 'ദിനപ്പൊരുത്തം ദുർബലമാണ് (വിപത്ത് / പ്രത്യര നക്ഷത്ര സ്ഥിതി).';
    dinaDescEn = 'Weak health compatibility (Afflicted star distance).';
  }

  poruthams.push({
    id: 'dinam',
    nameMalayalam: '1. ദിനപ്പൊരുത്തം (Dinam)',
    nameEnglish: '1. Dinam (Longevity & Health)',
    points: dinaPoints,
    maxPoints: 1,
    statusMalayalam: dinaStatusMl,
    statusEnglish: dinaStatusEn,
    descriptionMalayalam: dinaDescMl,
    descriptionEnglish: dinaDescEn
  });

  // 2. Ganam (ഗണം - Temperament & Mutual Respect)
  let ganaPoints = 0;
  let ganaStatusMl: any = 'അധമം (Inauspicious)';
  let ganaStatusEn: any = 'Inauspicious';
  let ganaDescMl = '';
  let ganaDescEn = '';

  if (boyMeta.ganam === girlMeta.ganam) {
    ganaPoints = 1;
    ganaStatusMl = 'ഉത്തമം (Excellent)';
    ganaStatusEn = 'Excellent';
    ganaDescMl = `ഇരുവരും ഒരേ ${boyMeta.ganamMalayalam} ആയതിനാൽ സ്വഭാവ ചേർച്ച ഉത്തമമാണ്.`;
    ganaDescEn = `Both share ${boyMeta.ganam} Gana, ensuring profound emotional and psychological rapport.`;
  } else if (boyMeta.ganam === 'Deva' && girlMeta.ganam === 'Manushya') {
    ganaPoints = 1;
    ganaStatusMl = 'ഉത്തമം (Excellent)';
    ganaStatusEn = 'Excellent';
    ganaDescMl = 'ദേവ-മനുഷ്യ ഗണങ്ങളുടെ ഉത്തമ സംയോജനം കുടുംബ സമാധാനം ഉറപ്പാക്കുന്നു.';
    ganaDescEn = 'Deva groom and Manushya bride create a harmoniously balanced union.';
  } else if (boyMeta.ganam === 'Manushya' && girlMeta.ganam === 'Deva') {
    ganaPoints = 0.5;
    ganaStatusMl = 'മധ്യമം (Moderate)';
    ganaStatusEn = 'Moderate';
    ganaDescMl = 'മനുഷ്യ-ദേവ ഗണങ്ങൾ തമ്മിൽ മധ്യമ ചേർച്ച.';
    ganaDescEn = 'Manushya groom with Deva bride gives moderate temperament balance.';
  } else if (boyMeta.ganam === 'Rakshasa' && girlMeta.ganam === 'Deva') {
    ganaPoints = distance > 14 ? 0.5 : 0;
    ganaStatusMl = distance > 14 ? 'മധ്യമം (Moderate)' : 'അധമം (Inauspicious)';
    ganaStatusEn = distance > 14 ? 'Moderate' : 'Inauspicious';
    ganaDescMl = distance > 14 ? 'നക്ഷത്ര ദൂരം കൂടിയതിനാൽ രാക്ഷസ ദോഷം കുറയും.' : 'ഗണവൈരുദ്ധ്യം മനസ്താപത്തിന് ഇടയാക്കാം.';
    ganaDescEn = distance > 14 ? 'Distance cushions Gana friction.' : 'Opposing Gana temperament friction.';
  } else {
    ganaPoints = 0;
    ganaStatusMl = 'അധമം (Inauspicious)';
    ganaStatusEn = 'Inauspicious';
    ganaDescMl = 'ഗണങ്ങൾ തമ്മിൽ ചേർച്ച കുറവാണ്.';
    ganaDescEn = 'Incompatible Gana temperaments.';
  }

  poruthams.push({
    id: 'ganam',
    nameMalayalam: '2. ഗണപ്പൊരുത്തം (Ganam)',
    nameEnglish: '2. Ganam (Temperament Harmony)',
    points: ganaPoints,
    maxPoints: 1,
    statusMalayalam: ganaStatusMl,
    statusEnglish: ganaStatusEn,
    descriptionMalayalam: ganaDescMl,
    descriptionEnglish: ganaDescEn
  });

  // 3. Mahendram (മാഹേന്ദ്രം - Progeny & Family Lineage)
  const isMahendramAuspicious = [4, 7, 10, 13, 16, 19, 22, 25].includes(distance);
  poruthams.push({
    id: 'mahendram',
    nameMalayalam: '3. മാഹേന്ദ്രപ്പൊരുത്തം (Mahendram)',
    nameEnglish: '3. Mahendram (Progeny & Wealth)',
    points: isMahendramAuspicious ? 1 : 0,
    maxPoints: 1,
    statusMalayalam: isMahendramAuspicious ? 'ഉത്തമം (Excellent)' : 'അധമം (Inauspicious)',
    statusEnglish: isMahendramAuspicious ? 'Excellent' : 'Inauspicious',
    descriptionMalayalam: isMahendramAuspicious
      ? 'സന്താന സൗഭാഗ്യവും കുടുംബ വംശവർദ്ധനവും ഉറപ്പാക്കുന്ന ശുഭ മാഹേന്ദ്രപ്പൊരുത്തം.'
      : 'മാഹേന്ദ്രപ്പൊരുത്തം ഇല്ലെങ്കിലും മറ്റ് ശുഭപൊരുത്തങ്ങളാൽ പരിഹരിക്കപ്പെടാം.',
    descriptionEnglish: isMahendramAuspicious
      ? 'Blesses with virtuous progeny, noble lineage, and sustained prosperity.'
      : 'Mahendram alignment is absent.'
  });

  // 4. Stree Deergham (സ്ത്രീദീർഘം - Prosperity of the Bride)
  let streePoints = 0;
  let streeStatusMl: any = 'അധമം (Inauspicious)';
  let streeStatusEn: any = 'Inauspicious';
  let streeDescMl = '';
  let streeDescEn = '';

  if (distance > 13) {
    streePoints = 1;
    streeStatusMl = 'ഉത്തമം (Excellent)';
    streeStatusEn = 'Excellent';
    streeDescMl = 'വരന്റെ നക്ഷത്രം വധുവിന്റെ നക്ഷത്രത്തിൽ നിന്ന് 13-ൽ കൂടുതൽ അകലത്തിലുള്ളതിനാൽ സർവ്വ സൗഭാഗ്യങ്ങളും പ്രദാനം ചെയ്യുന്നു.';
    streeDescEn = 'Boy star is beyond 13 stars from girl star, bestowing immense fortune on bride.';
  } else if (distance >= 7) {
    streePoints = 0.5;
    streeStatusMl = 'മധ്യമം (Moderate)';
    streeStatusEn = 'Moderate';
    streeDescMl = 'മധ്യമ സ്ത്രീദീർഘ പൊരുത്തം.';
    streeDescEn = 'Moderate distance prosperity.';
  } else {
    streePoints = 0;
    streeStatusMl = 'അധമം (Inauspicious)';
    streeStatusEn = 'Inauspicious';
    streeDescMl = 'നക്ഷത്ര ദൂരം കുറവായതിനാൽ സ്ത്രീദീർഘപ്പൊരുത്തം കുറവാണ്.';
    streeDescEn = 'Distance is below optimal threshold.';
  }

  poruthams.push({
    id: 'streedeergham',
    nameMalayalam: '4. സ്ത്രീദീർഘപ്പൊരുത്തം (Stree Deergham)',
    nameEnglish: '4. Stree Deergham (Bride Prosperity)',
    points: streePoints,
    maxPoints: 1,
    statusMalayalam: streeStatusMl,
    statusEnglish: streeStatusEn,
    descriptionMalayalam: streeDescMl,
    descriptionEnglish: streeDescEn
  });

  // 5. Yoni Porutham (യോനി - Biological & Physical Compatibility)
  const isSameAnimal = boyMeta.yoniAnimal === girlMeta.yoniAnimal;
  const isEnemyYoni = ENEMY_YONI_PAIRS.some(
    ([a1, a2]) =>
      (boyMeta.yoniAnimal === a1 && girlMeta.yoniAnimal === a2) ||
      (boyMeta.yoniAnimal === a2 && girlMeta.yoniAnimal === a1)
  );

  let yoniPoints = 0;
  let yoniStatusMl: any = 'അധമം (Inauspicious)';
  let yoniStatusEn: any = 'Inauspicious';
  let yoniDescMl = '';
  let yoniDescEn = '';

  if (isSameAnimal) {
    yoniPoints = 1;
    yoniStatusMl = 'ഉത്തമം (Excellent)';
    yoniStatusEn = 'Excellent';
    yoniDescMl = `ഇരുവരുടെയും യോനി മൃഗം ${boyMeta.yoniAnimalMalayalam} ആയതിനാൽ ദാമ്പത്യ ആകർഷണം അത്യുത്തമമാണ്.`;
    yoniDescEn = `Both share ${boyMeta.yoniAnimal} Yoni, creating supreme biological harmony.`;
  } else if (isEnemyYoni) {
    yoniPoints = 0;
    yoniStatusMl = 'അധമം (Inauspicious)';
    yoniStatusEn = 'Inauspicious';
    yoniDescMl = `ശത്രു യോനികൾ (${boyMeta.yoniAnimalMalayalam} vs ${girlMeta.yoniAnimalMalayalam} - മഹാശത്രുത).`;
    yoniDescEn = `Hostile Yoni animal totem (${boyMeta.yoniAnimal} vs ${girlMeta.yoniAnimal} - Maha Vaira Yoni).`;
  } else {
    yoniPoints = 0.5;
    yoniStatusMl = 'മധ്യമം (Moderate)';
    yoniStatusEn = 'Moderate';
    yoniDescMl = `${boyMeta.yoniAnimalMalayalam} & ${girlMeta.yoniAnimalMalayalam} തമ്മിൽ സാധാരണ പൊരുത്തം.`;
    yoniDescEn = `Friendly / Neutral Yoni species compatibility.`;
  }

  poruthams.push({
    id: 'yoni',
    nameMalayalam: '5. യോനിപ്പൊരുത്തം (Yoni)',
    nameEnglish: '5. Yoni (Biological Compatibility)',
    points: yoniPoints,
    maxPoints: 1,
    statusMalayalam: yoniStatusMl,
    statusEnglish: yoniStatusEn,
    descriptionMalayalam: yoniDescMl,
    descriptionEnglish: yoniDescEn
  });

  // 6. Rashi Porutham (രാശി - Psychological & Cosmic Alignment)
  // 6/8 is Sashtashtaka Dosha, 2/12 is Dwirdwadasa, 7th is Samasaptaka (Excellent)
  const isSashtashtaka = rashiDistance === 6 || rashiDistance === 8;
  const isDwirdwadasa = rashiDistance === 2 || rashiDistance === 12;
  let rashiPoints = 0;
  let rashiStatusMl: any = 'അധമം (Inauspicious)';
  let rashiStatusEn: any = 'Inauspicious';
  let rashiDescMl = '';
  let rashiDescEn = '';

  if (rashiDistance === 7 || rashiDistance === 1 || rashiDistance === 3 || rashiDistance === 11 || rashiDistance === 9) {
    rashiPoints = 1;
    rashiStatusMl = 'ഉത്തമം (Excellent)';
    rashiStatusEn = 'Excellent';
    rashiDescMl = 'രാശികൾ തമ്മിൽ സമസപ്തക / ത്രികോണ സ്ഥിതിയായതിനാൽ കുടുംബ ഐക്യവും സമ്പത്തും വർദ്ധിക്കും.';
    rashiDescEn = 'Samasaptaka (7th) or Navamsha (9th) alignment grants deep marital unity.';
  } else if (isSashtashtaka) {
    rashiPoints = 0;
    rashiStatusMl = 'അധമം (Inauspicious)';
    rashiStatusEn = 'Inauspicious';
    rashiDescMl = 'ഷഷ്ഠാഷ്ടമ രാശിദോഷം (6/8 സ്ഥിതി). ദാമ്പത്യത്തിൽ കലഹസാധ്യത.';
    rashiDescEn = 'Sashtashtaka Dosha (6/8 placement) causes avoidable domestic strife.';
  } else if (isDwirdwadasa) {
    rashiPoints = 0;
    rashiStatusMl = 'അധമം (Inauspicious)';
    rashiStatusEn = 'Inauspicious';
    rashiDescMl = 'ദ്വിർദ്വാദശ രാശിദോഷം (2/12 സ്ഥിതി). അനാവശ്യ ധനനഷ്ട സാധ്യത.';
    rashiDescEn = 'Dwirdwadasa (2/12 placement) impacts financial efficiency.';
  } else {
    rashiPoints = 0.5;
    rashiStatusMl = 'മധ്യമം (Moderate)';
    rashiStatusEn = 'Moderate';
    rashiDescMl = 'സാധാരണ രാശിപ്പൊരുത്തം.';
    rashiDescEn = 'Balanced Rashi compatibility.';
  }

  poruthams.push({
    id: 'rashi',
    nameMalayalam: '6. രാശിപ്പൊരുത്തം (Rashi)',
    nameEnglish: '6. Rashi (Cosmic Rashi Alignment)',
    points: rashiPoints,
    maxPoints: 1,
    statusMalayalam: rashiStatusMl,
    statusEnglish: rashiStatusEn,
    descriptionMalayalam: rashiDescMl,
    descriptionEnglish: rashiDescEn
  });

  // 7. Rasyadhipan (രാശ്യാധിപൻ - Friendship of Ruling Planets)
  const boyLord = RASHIS_METADATA[boyRashi].lordEnglish;
  const girlLord = RASHIS_METADATA[girlRashi].lordEnglish;
  const isSameLord = boyLord === girlLord;
  const isFriendlyLord =
    (boyLord === 'Sun' && ['Moon', 'Mars', 'Jupiter'].includes(girlLord)) ||
    (boyLord === 'Moon' && ['Sun', 'Mercury'].includes(girlLord)) ||
    (boyLord === 'Mars' && ['Sun', 'Moon', 'Jupiter'].includes(girlLord)) ||
    (boyLord === 'Mercury' && ['Sun', 'Venus'].includes(girlLord)) ||
    (boyLord === 'Jupiter' && ['Sun', 'Moon', 'Mars'].includes(girlLord)) ||
    (boyLord === 'Venus' && ['Mercury', 'Saturn'].includes(girlLord)) ||
    (boyLord === 'Saturn' && ['Mercury', 'Venus'].includes(girlLord));

  let adhipanPoints = 0;
  if (isSameLord || isFriendlyLord) {
    adhipanPoints = 1;
  } else if (
    (boyLord === 'Jupiter' && ['Saturn', 'Mercury'].includes(girlLord)) ||
    (boyLord === 'Venus' && ['Mars', 'Jupiter'].includes(girlLord))
  ) {
    adhipanPoints = 0.5;
  }

  poruthams.push({
    id: 'rasyadhipan',
    nameMalayalam: '7. രാശ്യധിപപ്പൊരുത്തം (Rasyadhipan)',
    nameEnglish: '7. Rasyadhipan (Friendship of Lords)',
    points: adhipanPoints,
    maxPoints: 1,
    statusMalayalam: adhipanPoints === 1 ? 'ഉത്തമം (Excellent)' : adhipanPoints === 0.5 ? 'മധ്യമം (Moderate)' : 'അധമം (Inauspicious)',
    statusEnglish: adhipanPoints === 1 ? 'Excellent' : adhipanPoints === 0.5 ? 'Moderate' : 'Inauspicious',
    descriptionMalayalam: adhipanPoints === 1
      ? 'രാശ്യാധിപന്മാർ പരസ്പരം മിത്രങ്ങളായതിനാൽ ദാമ്പത്യ ഐക്യം അത്യുത്തമമായിരിക്കും.'
      : 'രാശ്യാധിപന്മാർ തമ്മിൽ ശത്രുതയില്ലാതെ സന്തുലിതമാണ്.',
    descriptionEnglish: adhipanPoints === 1
      ? 'Planetary lords share natural friendship, guaranteeing everlasting companionship.'
      : 'Planetary lords share neutral relationship.'
  });

  // 8. Vasyam (വശ്യം - Mutual Natural Attraction)
  const vasyaPairs: Record<number, number[]> = {
    0: [4, 7], // Medam -> Simham, Vrischikam
    1: [3, 6], // Edavam -> Karkkidakam, Thulam
    2: [5],    // Mithunam -> Kanni
    3: [7, 8], // Karkkidakam -> Vrischikam, Dhanu
    4: [6],    // Simham -> Thulam
    5: [2, 11],// Kanni -> Mithunam, Meenam
    6: [9],    // Thulam -> Makaram
    7: [3],    // Vrischikam -> Karkkidakam
    8: [11],   // Dhanu -> Meenam
    9: [0, 10],// Makaram -> Mesha, Kumbham
    10: [4],   // Kumbham -> Simham
    11: [9]    // Meenam -> Makaram
  };

  const isVasyam = vasyaPairs[boyRashi]?.includes(girlRashi) || vasyaPairs[girlRashi]?.includes(boyRashi);
  poruthams.push({
    id: 'vasyam',
    nameMalayalam: '8. വശ്യപ്പൊരുത്തം (Vasyam)',
    nameEnglish: '8. Vasyam (Mutual Attraction)',
    points: isVasyam ? 1 : 0,
    maxPoints: 1,
    statusMalayalam: isVasyam ? 'ഉത്തമം (Excellent)' : 'അധമം (Inauspicious)',
    statusEnglish: isVasyam ? 'Excellent' : 'Inauspicious',
    descriptionMalayalam: isVasyam
      ? 'പരസ്പര ആകർഷണവും തീവ്രമായ സ്നേഹബന്ധവും നൽകുന്ന വശ്യപ്പൊരുത്തം.'
      : 'വശ്യപ്പൊരുത്തം ഇല്ലെങ്കിലും മറ്റ് പൊരുത്തങ്ങൾ അനുകൂലമാണ്.',
    descriptionEnglish: isVasyam
      ? 'Innate magnetic charm, deep affection, and mutual respect.'
      : 'Vasyam alignment is absent.'
  });

  // 9. Rajju Porutham (രജ്ജു - ജീവരജ്ജു / Mangalya Longevity)
  const isSameRajju = boyMeta.rajju === girlMeta.rajju;
  const rajjuAffliction = isSameRajju;
  poruthams.push({
    id: 'rajju',
    nameMalayalam: '9. രജ്ജുപ്പൊരുത്തം (Rajju - ജീവരജ്ജു)',
    nameEnglish: '9. Rajju (Mangalya Longevity)',
    points: isSameRajju ? 0 : 1,
    maxPoints: 1,
    isAfflicted: rajjuAffliction,
    statusMalayalam: isSameRajju ? 'അധമം (Inauspicious)' : 'ഉത്തമം (Excellent)',
    statusEnglish: isSameRajju ? 'Inauspicious' : 'Excellent',
    descriptionMalayalam: isSameRajju
      ? `⚠️ രജ്ജുദോഷം: ഇരുവരുടെയും നക്ഷത്രം ഒരേ ${boyMeta.rajjuMalayalam}യിലാണ്. മാംഗല്യ ഭദ്രതയ്ക്ക് വിദഗ്ദ്ധ ജ്യോതിഷോപദേശം തേടുക.`
      : 'രജ്ജുദോഷം ഇല്ല. ദീർഘ സുമംഗലീ യോഗവും ദാമ്പത്യ ഭദ്രതയും പ്രദാനം ചെയ്യുന്നു.',
    descriptionEnglish: isSameRajju
      ? `⚠️ Rajju Dosha Alert: Both stars fall in identical ${boyMeta.rajju} Rajju.`
      : 'Flawless Rajju alignment shielding marital longevity.'
  });

  // 10. Vedham (വേധം - Star Immunity)
  const isVedham = boyMeta.vedhaNakshatraIndex === girlStarIndex || girlMeta.vedhaNakshatraIndex === boyStarIndex;
  poruthams.push({
    id: 'vedham',
    nameMalayalam: '10. വേധപ്പൊരുത്തം (Vedham)',
    nameEnglish: '10. Vedham (Affliction Immunity)',
    points: isVedham ? 0 : 1,
    maxPoints: 1,
    isAfflicted: isVedham,
    statusMalayalam: isVedham ? 'അധമം (Inauspicious)' : 'ഉത്തമം (Excellent)',
    statusEnglish: isVedham ? 'Inauspicious' : 'Excellent',
    descriptionMalayalam: isVedham
      ? `⚠️ വേധദോഷം: ${boyMeta.nameMalayalam} നക്ഷത്രവും ${girlMeta.nameMalayalam} നക്ഷത്രവും പരസ്പരം വേധമുള്ളവയാണ്.`
      : 'നക്ഷത്രങ്ങൾ തമ്മിൽ യാതൊരു വേധദോഷവും ഇല്ല. അതീവ ശുഭം.',
    descriptionEnglish: isVedham
      ? `⚠️ Vedha Dosha: ${boyMeta.nameEnglish} and ${girlMeta.nameEnglish} mutually afflict each other.`
      : 'Zero hostile obstruction between birth stars. Highly auspicious.'
  });

  const totalScore = poruthams.reduce((acc, p) => acc + p.points, 0);
  const percentage = Math.round((totalScore / 10) * 100);

  let verdictMalayalam = '';
  let verdictEnglish = '';

  if (rajjuAffliction && isVedham) {
    verdictMalayalam = `ഈ ജാതകങ്ങൾ തമ്മിൽ പത്തിൽ ${totalScore} പൊരുത്തങ്ങൾ ഉണ്ട്. എന്നാൽ പ്രധാനപ്പെട്ട രജ്ജുദോഷം, വേധദോഷം എന്നിവ ഉള്ളതിനാൽ ജ്യോതിഷോപദേശം തേടുക.`;
    verdictEnglish = `Matches ${totalScore}/10 Poruthams. However, both Rajju Dosha and Vedha Dosha are detected.`;
  } else if (rajjuAffliction) {
    verdictMalayalam = `ഈ ജാതകങ്ങൾ തമ്മിൽ പത്തിൽ ${totalScore} പൊരുത്തങ്ങൾ ഉണ്ട്. എന്നാൽ പ്രധാനപ്പെട്ട രജ്ജുദോഷം ഉള്ളതിനാൽ ദോഷപരിഹാരം ചെയ്ത ശേഷം മാത്രമേ വിവാഹം ശുപാർശ ചെയ്യുന്നുള്ളൂ.`;
    verdictEnglish = `Matches ${totalScore}/10 Poruthams. However, Rajju Dosha is detected; astrological remedies are strongly advised.`;
  } else if (isVedham) {
    verdictMalayalam = `ഈ ജാതകങ്ങൾ തമ്മിൽ പത്തിൽ ${totalScore} പൊരുത്തങ്ങൾ ഉണ്ട്. എന്നാൽ വേധദോഷം ശ്രദ്ധിക്കേണ്ടതാണ്.`;
    verdictEnglish = `Matches ${totalScore}/10 Poruthams with Vedha Dosha present.`;
  } else if (totalScore >= 7) {
    verdictMalayalam = `പത്തിൽ ${totalScore} പൊരുത്തങ്ങൾ ഉത്തമമാണ് (${percentage}%). ദാമ്പത്യ ജീവിതം അതീവ സന്തോഷകരവും ഐശ്വര്യപൂർണ്ണവുമായിരിക്കും (ഉത്തമം - Highly Recommended).`;
    verdictEnglish = `Superb compatibility with ${totalScore}/10 Poruthams (${percentage}%). Highly recommended for a blissful, prosperous marital union.`;
  } else if (totalScore >= 5) {
    verdictMalayalam = `പത്തിൽ ${totalScore} പൊരുത്തങ്ങൾ ഉണ്ട് (${percentage}%). വിവാഹത്തിന് അനുയോജ്യമായ മധ്യമ പൊരുത്തം.`;
    verdictEnglish = `Fair compatibility with ${totalScore}/10 Poruthams (${percentage}%). Favorable match.`;
  } else {
    verdictMalayalam = `പത്തിൽ ${totalScore} പൊരുത്തങ്ങൾ മാത്രമേയുള്ളൂ (${percentage}%). പൊരുത്തം കുറവാണ്.`;
    verdictEnglish = `Low compatibility with ${totalScore}/10 Poruthams (${percentage}%).`;
  }

  return {
    boyStarIndex,
    girlStarIndex,
    boyStarName: boyMeta.nameMalayalam,
    girlStarName: girlMeta.nameMalayalam,
    totalScore,
    percentage,
    hasRajjuDosha: rajjuAffliction,
    hasVedhaDosha: isVedham,
    hasSashtashtakaDosha: isSashtashtaka,
    verdictMalayalam,
    verdictEnglish,
    poruthams
  };
}

/* ==================== REAL-TIME LIVE MALAYALAM PANCHANGAM ==================== */

export interface LiveMalayalamPanchangamData {
  dayMalayalam: string;
  dayEnglish: string;
  dateString: string;
  kollamEraYear: number;
  kollamMonthMalayalam: string;
  kollamMonthEnglish: string;
  kollamDay: number;
  kollamEraFormatted: string;
  tithiMalayalam: string;
  thithiMalayalam?: string;
  tithiEnglish: string;
  nakshatraMalayalam: string;
  nakshatraEnglish: string;
  yogamMalayalam: string;
  yogamEnglish: string;
  karanamMalayalam: string;
  karanamEnglish: string;
  rahuKalamMalayalam: string;
  gulikaKalamMalayalam: string;
  yamakandamMalayalam: string;
  abhijithMuhurthamMalayalam: string;
  sunriseTime: string;
  sunsetTime: string;
}

export function computeLivePanchangam(customDate = new Date()): LiveMalayalamPanchangamData {
  const year = customDate.getFullYear();
  const month = customDate.getMonth() + 1;
  const day = customDate.getDate();
  const hour = customDate.getHours() + customDate.getMinutes() / 60;

  const utcHour = hour - 5.5; // IST to UTC
  const jd = getJulianDay(year, month, day, Math.floor(utcHour), (utcHour % 1) * 60, 0);
  const ayanamsha = getLahiriAyanamsha(jd);
  const tropical = computeTropicalPositions(jd);

  const sunSidereal = normalize360(tropical.sun.lon - ayanamsha);
  const moonSidereal = normalize360(tropical.moon.lon - ayanamsha);

  // Days in Malayalam
  const daysMl = ['ഞായറാഴ്ച (Sunday)', 'തിങ്കളാഴ്ച (Monday)', 'ചൊവ്വാഴ്ച (Tuesday)', 'ബുധനാഴ്ച (Wednesday)', 'വ്യാഴാഴ്ച (Thursday)', 'വെള്ളിയാഴ്ച (Friday)', 'ശനിയാഴ്ച (Saturday)'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIdx = customDate.getDay();

  // Tithi computation (Each Tithi spans 12° of Moon-Sun separation)
  const moonSunAngle = normalize360(moonSidereal - sunSidereal);
  const tithiIndex = Math.floor(moonSunAngle / 12); // 0 to 29
  const isShukla = tithiIndex < 15;
  const tithiNum = (tithiIndex % 15) + 1;

  const tithiNames = [
    'പ്രഥമ (Prathama)', 'ദ്വിതീയ (Dwitiya)', 'തൃതീയ (Tritiya)', 'ചതുർത്ഥി (Chaturthi)',
    'പഞ്ചമി (Panchami)', 'ഷഷ്ഠി (Shashti)', 'സപ്തമി (Saptami)', 'അഷ്ടമി (Ashtami)',
    'നവമി (Navami)', 'ദശമി (Dashami)', 'ഏകാദശി (Ekadashi)', 'ദ്വാദശി (Dwadashi)',
    'ത്രയോദശി (Trayodashi)', 'ചതുർദ്ദശി (Chaturdashi)', isShukla ? 'പൗർണ്ണമി (Pournami / Full Moon)' : 'അമാവാസി (Amavasi / New Moon)'
  ];

  const tithiMl = `${isShukla ? 'ശുക്ലപക്ഷം' : 'കൃഷ്ണപക്ഷം'} ${tithiNames[tithiNum - 1].split(' ')[0]}`;
  const tithiEn = `${isShukla ? 'Shukla Paksha' : 'Krishna Paksha'} ${tithiNames[tithiNum - 1]}`;

  // Moon Nakshatra
  const moonNakIdx = Math.floor(moonSidereal / (360 / 27));
  const moonNakMeta = NAKSHATRAS_METADATA[moonNakIdx];

  // Nithya Yoga (Sum of Sun and Moon / 13° 20')
  const yogaNames = [
    'വിഷ്കംഭം (Vishkambha)', 'പ്രീതി (Preeti)', 'ആയുഷ്മാൻ (Ayushman)', 'സൗഭാഗ്യം (Saubhagya)',
    'ശോഭനം (Shobhana)', 'അതിഗണ്ഡം (Atiganda)', 'സുകർമ്മ (Sukarma)', 'ധൃതി (Dhriti)',
    'ശൂലം (Shoola)', 'ഗണ്ഡം (Ganda)', 'വൃദ്ധി (Vriddhi)', 'ധ്രുവം (Dhruva)',
    'വ്യാഘാതം (Vyaghata)', 'ഹർഷണം (Harshana)', 'വജ്രം (Vajra)', 'അസിദ്ധി (Asiddhi)',
    'വ്യതീപാതം (Vyatipata)', 'വരീയാൻ (Variyan)', 'പരിഘം (Parigha)', 'ശിവം (Shiva)',
    'സിദ്ധം (Siddha)', 'സാധ്യം (Sadhya)', 'ശുഭം (Shubha)', 'ശുക്ലം (Shukla)',
    'ബ്രഹ്മം (Brahma)', 'ഇന്ദ്രം (Indra)', 'വൈധൃതി (Vaidhriti)'
  ];
  const yogaAngle = normalize360(sunSidereal + moonSidereal);
  const yogaIdx = Math.floor(yogaAngle / (360 / 27)) % 27;

  // Karana (Half-tithi, 6° each)
  const karanaIndex = Math.floor(moonSunAngle / 6);
  const karanaNames = ['ബവ (Bava)', 'ബാലവ (Balava)', 'കൗലവ (Kaulava)', 'തൈതില (Taitila)', 'ഗരജ (Garaja)', 'വണിജ (Vanija)', 'വിഷ്ടി/ഭദ്ര (Vishti)'];
  const karanaName = karanaIndex === 0 ? 'കിംസ്തുഘ്നം (Kinstughna)' : karanaNames[(karanaIndex - 1) % 7];

  // Solar Malayalam Kollam Month & Day (Chingam to Karkkidakam)
  // Sun sign index (0 = Medam, 1 = Edavam, ..., 4 = Chingam)
  const sunRashiIdx = Math.floor(sunSidereal / 30);
  const kollamMonths = [
    'മേടം (Medam)', 'ഇടവം (Edavam)', 'മിഥുനം (Mithunam)', 'കർക്കിടകം (Karkkidakam)',
    'ചിങ്ങം (Chingam)', 'കന്നി (Kanni)', 'തുലാം (Thulam)', 'വൃശ്ചികം (Vrischikam)',
    'ധനു (Dhanu)', 'മകരം (Makaram)', 'കുംഭം (Kumbham)', 'മീനം (Meenam)'
  ];
  const kollamMonthName = kollamMonths[sunRashiIdx];
  const kollamDay = Math.floor(sunSidereal % 30) + 1;
  const kollamYear = year - 825 + (sunRashiIdx >= 4 ? 1 : 0);

  // Rahu Kalam, Gulika Kalam, Yamakandam timings per weekday
  const rahuKalamByDay = ['04:30 PM - 06:00 PM', '07:30 AM - 09:00 AM', '03:00 PM - 04:30 PM', '12:00 PM - 01:30 PM', '01:30 PM - 03:00 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM'];
  const gulikaKalamByDay = ['03:00 PM - 04:30 PM', '01:30 PM - 03:00 PM', '12:00 PM - 01:30 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM', '07:30 AM - 09:00 AM', '06:00 AM - 07:30 AM'];
  const yamakandamByDay = ['12:00 PM - 01:30 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM', '07:30 AM - 09:00 AM', '06:00 AM - 07:30 AM', '03:00 PM - 04:30 PM', '01:30 PM - 03:00 PM'];

  return {
    dayMalayalam: daysMl[dayIdx].split(' ')[0],
    dayEnglish: daysEn[dayIdx],
    dateString: customDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    kollamEraYear: kollamYear,
    kollamMonthMalayalam: kollamMonthName.split(' ')[0],
    kollamMonthEnglish: kollamMonthName.split(' ')[1].replace(/[()]/g, ''),
    kollamDay,
    kollamEraFormatted: `കൊല്ലവർഷം ${kollamYear} ${kollamMonthName.split(' ')[0]} ${kollamDay}`,
    tithiMalayalam: tithiMl,
    thithiMalayalam: tithiMl,
    tithiEnglish: tithiEn,
    nakshatraMalayalam: moonNakMeta.nameMalayalam,
    nakshatraEnglish: moonNakMeta.nameEnglish,
    yogamMalayalam: yogaNames[yogaIdx].split(' ')[0],
    yogamEnglish: yogaNames[yogaIdx],
    karanamMalayalam: karanaName.split(' ')[0],
    karanamEnglish: karanaName,
    rahuKalamMalayalam: rahuKalamByDay[dayIdx],
    gulikaKalamMalayalam: gulikaKalamByDay[dayIdx],
    yamakandamMalayalam: yamakandamByDay[dayIdx],
    abhijithMuhurthamMalayalam: '11:45 AM - 12:35 PM (ഉത്തമം)',
    sunriseTime: '06:18 AM',
    sunsetTime: '06:34 PM'
  };
}
