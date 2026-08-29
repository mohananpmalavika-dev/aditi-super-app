import { describe, it, expect } from 'vitest';
import { 
  generatePersonalizedJathakamForecast, 
  askPersonalizedAstroOracle,
  generateKeralaRashiChakra,
  calculate10Porutham,
  generateDetailedJathakamInWords
} from '../services/keralaAstroEngine';

describe('Personalized Birth-Time Jathakam & Astro Oracle Engine', () => {
  const testBirth = {
    name: 'Ananthakrishnan',
    date: '1995-10-24',
    time: '06:45',
    place: 'Thrissur, Kerala, India'
  };

  it('computes full personalized multi-horizon forecasts based on birth time', () => {
    const forecast = generatePersonalizedJathakamForecast(
      testBirth.date,
      testBirth.time,
      testBirth.place,
      testBirth.name
    );

    expect(forecast.birthName).toBe(testBirth.name);
    expect(forecast.lagnaMalayalam).toBeDefined();
    expect(forecast.moonRashiMalayalam).toBeDefined();
    expect(forecast.nakshatraMalayalam).toBeDefined();
    expect(forecast.currentDasha).toBeDefined();

    // 1. Today
    expect(forecast.today.titleMalayalam).toContain('ജാതക ഫലം');
    expect(forecast.today.careerMalayalam).toBeDefined();
    expect(forecast.today.financeMalayalam).toBeDefined();
    expect(forecast.today.remedyMalayalam).toBeDefined();

    // 2. Tomorrow
    expect(forecast.tomorrow.titleMalayalam).toBeDefined();
    expect(forecast.tomorrow.favorableHoursMalayalam).toBeDefined();

    // 3. This Week
    expect(forecast.thisWeek.titleMalayalam).toBeDefined();
    expect(forecast.thisWeek.favorableDaysMalayalam).toBeDefined();

    // 4. This Month
    expect(forecast.thisMonth.titleMalayalam).toBeDefined();
    expect(forecast.thisMonth.wealthInvestmentsMalayalam).toBeDefined();

    // 5. This Year (2026)
    expect(forecast.thisYear.titleMalayalam).toContain('2026');
    expect(forecast.thisYear.guruTransitMalayalam).toBeDefined();
    expect(forecast.thisYear.saniTransitMalayalam).toBeDefined();
    expect(forecast.thisYear.grandPariharamsMalayalam).toBeDefined();

    // 6. Next 3 Years (2026-2028)
    expect(forecast.nextThreeYears.year2026.year).toBe('2026');
    expect(forecast.nextThreeYears.year2027.year).toBe('2027');
    expect(forecast.nextThreeYears.year2028.year).toBe('2028');
    expect(forecast.nextThreeYears.templePilgrimagesMalayalam.length).toBeGreaterThanOrEqual(3);
  });

  it('answers custom astrological questions with personalized Vedic analysis & remedies', () => {
    const jobQuestion = 'എനിക്ക് വിദേശത്ത് ജോലി എപ്പോൾ ലഭിക്കും?';
    const oracleResult = askPersonalizedAstroOracle(
      jobQuestion,
      testBirth.date,
      testBirth.time,
      testBirth.place,
      testBirth.name
    );

    expect(oracleResult.question).toBe(jobQuestion);
    expect(oracleResult.category).toBe('career');
    expect(oracleResult.outcomeScore).toBeGreaterThanOrEqual(75);
    expect(oracleResult.verdictMalayalam).toBeDefined();
    expect(oracleResult.detailedAnalysisMalayalam).toBeDefined();
    expect(oracleResult.manifestationTimelineMalayalam).toBeDefined();
    expect(oracleResult.templePariharamMalayalam).toBeDefined();
    expect(oracleResult.gemstoneMantraMalayalam).toBeDefined();
  });

  it('categorizes marriage and romance questions accurately', () => {
    const marriageQuestion = 'എന്റെ വിവാഹം എപ്പോഴാണ് നടക്കുക?';
    const oracleResult = askPersonalizedAstroOracle(
      marriageQuestion,
      testBirth.date,
      testBirth.time,
      testBirth.place,
      testBirth.name
    );

    expect(oracleResult.category).toBe('marriage');
    expect(oracleResult.verdictMalayalam).toContain('മംഗല്യ');
    expect(oracleResult.manifestationTimelineMalayalam).toBeDefined();
  });

  it('builds authentic 12-box South Indian Kerala Rashi Chakra grid', () => {
    const chakra = generateKeralaRashiChakra(
      testBirth.name,
      testBirth.date,
      testBirth.time,
      testBirth.place
    );

    expect(chakra.grid.length).toBe(12);
    expect(chakra.navamshaGrid.length).toBe(12);
    const lagnaBox = chakra.grid.find((b) => b.isLagna);
    expect(lagnaBox).toBeDefined();
  });

  it('generates exhaustive Detailed Jathakam in Words across all 6 chapters & 12 bhavas', () => {
    const detailedWords = generateDetailedJathakamInWords(
      testBirth.date,
      testBirth.time,
      testBirth.place,
      testBirth.name
    );

    expect(detailedWords.birthName).toBe(testBirth.name);
    expect(detailedWords.lagnaMalayalam).toBeDefined();
    expect(detailedWords.moonRashiMalayalam).toBeDefined();
    expect(detailedWords.nakshatraMalayalam).toBeDefined();

    // Executive Summary in Words
    expect(detailedWords.executiveSummaryMalayalam.length).toBeGreaterThan(100);
    expect(detailedWords.executiveSummaryEnglish.length).toBeGreaterThan(100);

    // Chapter 1: Personality & Demeanor
    expect(detailedWords.personalityReading.physiqueDemeanorMalayalam).toBeDefined();
    expect(detailedWords.personalityReading.intellectMindsetMalayalam).toBeDefined();
    expect(detailedWords.personalityReading.leadershipStrengthsMalayalam).toBeDefined();
    expect(detailedWords.personalityReading.socialNatureMalayalam).toBeDefined();

    // Chapter 2: All 12 Bhavas detailed reading in words
    expect(detailedWords.bhavasReading.length).toBe(12);
    detailedWords.bhavasReading.forEach((bhava, index) => {
      expect(bhava.houseNumber).toBe(index + 1);
      expect(bhava.detailedProseMalayalam.length).toBeGreaterThan(50);
      expect(bhava.detailedProseEnglish.length).toBeGreaterThan(50);
      expect(bhava.verdictScore).toBeGreaterThanOrEqual(70);
    });

    // Chapter 3: Special Yogas
    expect(detailedWords.yogasReading.yogasList.length).toBeGreaterThanOrEqual(2);
    expect(detailedWords.yogasReading.yogasList[0].lifeImpactMalayalam).toBeDefined();

    // Chapter 4: Doshas & Kerala Temple Remedies
    expect(detailedWords.doshasAndRemediesReading.kujaDoshaAnalysisMalayalam).toBeDefined();
    expect(detailedWords.doshasAndRemediesReading.templePilgrimagesMalayalam.length).toBeGreaterThanOrEqual(3);

    // Chapter 5: Dasha Analysis
    expect(detailedWords.dashaTimelineReading.currentDashaAnalysisMalayalam).toBeDefined();
    expect(detailedWords.dashaTimelineReading.currentBhuktiAnalysisMalayalam).toBeDefined();

    // Chapter 6: Strategic Guidance & Gemstones
    expect(detailedWords.strategicGuidanceReading.gemstoneGuidanceMalayalam).toBeDefined();
    expect(detailedWords.strategicGuidanceReading.idealCareerSectorsMalayalam.length).toBeGreaterThanOrEqual(3);
    expect(detailedWords.strategicGuidanceReading.luckyElements.number).toBeDefined();

    // Full text document
    expect(detailedWords.fullTextDocumentMalayalam).toContain('സമ്പൂർണ്ണ കേരള ജാതക ഫലവിവരണം');
    expect(detailedWords.fullTextDocumentEnglish).toContain('COMPLETE VEDIC JATHAKAM READING IN WORDS');
  });
});
