/**
 * keralaAstroEngine.ts
 * Traditional Kerala Vedic Astrology & Kundali Engine
 * 
 * Features:
 * - South Indian 12-Box Kerala Rashi Chakra Grid (കട്ട ചാർട്ട്)
 * - Authentic 10-Porutham Matchmaker (പത്തു പൊരുത്തം) with Rajju & Vedha Dosha alerts
 * - Accurate Vimshottari Dasha / Bhukthi Periods (വിംശോത്തരി ദശാപഹാരങ്ങൾ)
 * - Kuja Dosha & Papasamya Comparison (ചൊവ്വാദോഷം & പാപസാമ്യം)
 * - Navamsha (D9) Chart Computation
 */

import {
  calculateAstrologicalChart,
  calculateAuthentic10Porutham,
  NAKSHATRAS_METADATA,
  RASHIS_METADATA,
  PoruthamScoreItem,
  VedicChartData
} from './ephemerisEngine';

export interface KeralaRashiBox {
  index: number; // 0 to 11 (0 = Meenam, 1 = Medam, 2 = Edavam, 3 = Mithunam, 4 = Karkkidakam, 5 = Chingam, 6 = Kanni, 7 = Thulam, 8 = Vrischikam, 9 = Dhanu, 10 = Makaram, 11 = Kumbham)
  rashiIndex: number; // 0 = Medam/Aries, 1 = Edavam, ..., 11 = Meenam
  nameMalayalam: string;
  nameEnglish: string;
  planets: string[];
  planetDetails: Array<{ name: string; symbol: string; formattedDegree: string; isRetrograde?: boolean }>;
  isLagna: boolean;
}

export interface PoruthamItem extends PoruthamScoreItem {}

export interface TenPoruthamResult {
  boyNakshatra: string;
  girlNakshatra: string;
  totalScore: number; // out of 10
  percentage: number;
  hasRajjuDosha: boolean;
  hasVedhaDosha: boolean;
  hasSashtashtakaDosha: boolean;
  verdictMalayalam: string;
  verdictEnglish: string;
  kujaDoshaMalayalam: string;
  papasamyaMalayalam: string;
  poruthams: PoruthamItem[];
}

export const KERALA_NAKSHATRAS = NAKSHATRAS_METADATA.map(
  (n) => `${n.nameMalayalam} (${n.nameEnglish.split(' ')[0]})`
);

/**
 * Standard South Indian 12-Box Grid Layout Mapping:
 * Box Index 0  -> Meenam (Pisces) - Rashi Index 11
 * Box Index 1  -> Medam (Aries) - Rashi Index 0
 * Box Index 2  -> Edavam (Taurus) - Rashi Index 1
 * Box Index 3  -> Mithunam (Gemini) - Rashi Index 2
 * Box Index 4  -> Karkkidakam (Cancer) - Rashi Index 3
 * Box Index 5  -> Chingam (Leo) - Rashi Index 4
 * Box Index 6  -> Kanni (Virgo) - Rashi Index 5
 * Box Index 7  -> Thulam (Libra) - Rashi Index 6
 * Box Index 8  -> Vrischikam (Scorpio) - Rashi Index 7
 * Box Index 9  -> Dhanu (Sagittarius) - Rashi Index 8
 * Box Index 10 -> Makaram (Capricorn) - Rashi Index 9
 * Box Index 11 -> Kumbham (Aquarius) - Rashi Index 10
 */
const BOX_TO_RASHI_MAP = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Computes Traditional Kerala 12-Box Grid Chart (കട്ട ചാർട്ട്) using Astronomical Ephemeris.
 */
export function generateKeralaRashiChakra(
  name: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string
): {
  grid: KeralaRashiBox[];
  navamshaGrid: KeralaRashiBox[];
  lagnaRashiMalayalam: string;
  lagnaRashiEnglish: string;
  moonRashiMalayalam: string;
  moonRashiEnglish: string;
  nakshatraMalayalam: string;
  nakshatraEnglish: string;
  currentDasha: string;
  currentBhukti: string;
  nextDasha: string;
  dashaBalanceMalayalam: string;
  dashaBalanceEnglish: string;
  dashaProgressPercentage: number;
  doshaSummary: VedicChartData['doshaSummary'];
  chartData: VedicChartData;
} {
  const chart = calculateAstrologicalChart(birthDate, birthTime, birthPlace);

  // Build the 12-Box South Indian Rashi Chakra Grid (കട്ട ചാർട്ട്)
  const grid: KeralaRashiBox[] = BOX_TO_RASHI_MAP.map((rashiIdx, boxIdx) => {
    const rashiMeta = RASHIS_METADATA[rashiIdx];
    const isLagna = chart.lagna.rashiIndex === rashiIdx;

    const boxPlanets: string[] = [];
    const planetDetails: Array<{ name: string; symbol: string; formattedDegree: string; isRetrograde?: boolean }> = [];

    if (isLagna) {
      boxPlanets.push(`ല (${chart.lagna.formattedDegree.split(' ')[0]})`);
      planetDetails.push({
        name: 'ലഗ്നം (Lagna)',
        symbol: 'Asc',
        formattedDegree: chart.lagna.formattedDegree
      });
    }

    chart.planets.forEach((p) => {
      if (p.rashiIndex === rashiIdx) {
        const shortName = p.nameMalayalam.slice(0, 2);
        boxPlanets.push(`${p.symbol} ${shortName} (${p.formattedDegree.split(' ')[0]})`);
        planetDetails.push({
          name: `${p.nameMalayalam} (${p.nameEnglish})`,
          symbol: p.symbol,
          formattedDegree: p.formattedDegree,
          isRetrograde: p.isRetrograde
        });
      }
    });

    return {
      index: boxIdx,
      rashiIndex: rashiIdx,
      nameMalayalam: rashiMeta.nameMalayalam,
      nameEnglish: rashiMeta.nameEnglish,
      planets: boxPlanets,
      planetDetails,
      isLagna
    };
  });

  // Build the Navamsha (D9) Chart Grid
  const navamshaGrid: KeralaRashiBox[] = BOX_TO_RASHI_MAP.map((rashiIdx, boxIdx) => {
    const rashiMeta = RASHIS_METADATA[rashiIdx];
    const isNavamshaLagna = chart.lagna.navamshaRashiIndex === rashiIdx;

    const boxPlanets: string[] = [];
    const planetDetails: Array<{ name: string; symbol: string; formattedDegree: string }> = [];

    if (isNavamshaLagna) {
      boxPlanets.push('ലഗ്നം (Lagna)');
      planetDetails.push({
        name: 'നവാംശ ലഗ്നം',
        symbol: 'Asc',
        formattedDegree: ''
      });
    }

    chart.planets.forEach((p) => {
      if (p.navamshaRashiIndex === rashiIdx) {
        const shortName = p.nameMalayalam.slice(0, 2);
        boxPlanets.push(`${p.symbol} ${shortName}`);
        planetDetails.push({
          name: `${p.nameMalayalam} (${p.nameEnglish})`,
          symbol: p.symbol,
          formattedDegree: ''
        });
      }
    });

    return {
      index: boxIdx,
      rashiIndex: rashiIdx,
      nameMalayalam: rashiMeta.nameMalayalam,
      nameEnglish: rashiMeta.nameEnglish,
      planets: boxPlanets,
      planetDetails,
      isLagna: isNavamshaLagna
    };
  });

  return {
    grid,
    navamshaGrid,
    lagnaRashiMalayalam: chart.lagna.rashiNameMalayalam,
    lagnaRashiEnglish: chart.lagna.rashiNameEnglish,
    moonRashiMalayalam: chart.moonRashi.nameMalayalam,
    moonRashiEnglish: chart.moonRashi.nameEnglish,
    nakshatraMalayalam: `${chart.moonNakshatra.nameMalayalam} (${chart.moonNakshatra.pada}-ാം പാദം)`,
    nakshatraEnglish: `${chart.moonNakshatra.nameEnglish} (Pada ${chart.moonNakshatra.pada})`,
    currentDasha: chart.vimshottariDasha.currentMahadasha,
    currentBhukti: chart.vimshottariDasha.currentBhukti,
    nextDasha: chart.vimshottariDasha.nextDasha,
    dashaBalanceMalayalam: chart.vimshottariDasha.formattedBalanceMalayalam,
    dashaBalanceEnglish: chart.vimshottariDasha.formattedBalanceEnglish,
    dashaProgressPercentage: chart.vimshottariDasha.progressPercentage,
    doshaSummary: chart.doshaSummary,
    chartData: chart
  };
}

/**
 * Finds Nakshatra index from user selection string (e.g. "അശ്വതി (Ashwathi)" -> 0).
 */
function parseNakshatraIndex(starString: string): number {
  const clean = starString.trim().toLowerCase();
  const foundIdx = NAKSHATRAS_METADATA.findIndex(
    (n) =>
      clean.includes(n.nameMalayalam.toLowerCase()) ||
      clean.includes(n.nameEnglish.toLowerCase().split(' ')[0])
  );
  return foundIdx >= 0 ? foundIdx : 0;
}

/**
 * Authentic Kerala 10-Porutham Matchmaking Algorithm (പത്തു പൊരുത്തം)
 */
export function calculate10Porutham(boyStar: string, girlStar: string): TenPoruthamResult {
  const boyIdx = parseNakshatraIndex(boyStar);
  const girlIdx = parseNakshatraIndex(girlStar);

  const result = calculateAuthentic10Porutham(boyIdx, girlIdx);

  return {
    boyNakshatra: boyStar,
    girlNakshatra: girlStar,
    totalScore: result.totalScore,
    percentage: result.percentage,
    hasRajjuDosha: result.hasRajjuDosha,
    hasVedhaDosha: result.hasVedhaDosha,
    hasSashtashtakaDosha: result.hasSashtashtakaDosha,
    verdictMalayalam: result.verdictMalayalam,
    verdictEnglish: result.verdictEnglish,
    kujaDoshaMalayalam: result.hasRajjuDosha
      ? 'രജ്ജുദോഷം: ഉണ്ട് (വിദഗ്ദ്ധ ജ്യോതിഷോപദേശം തേടുക)'
      : 'രജ്ജുദോഷം: ഇല്ല (ഉത്തമം)',
    papasamyaMalayalam: result.hasVedhaDosha
      ? 'വേധദോഷം: ഉണ്ട് (ശ്രദ്ധിക്കുക)'
      : 'വേധദോഷം: ഇല്ല (അതീവ ശുഭം)',
    poruthams: result.poruthams
  };
}
