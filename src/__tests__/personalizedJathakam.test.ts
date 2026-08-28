import { describe, it, expect } from 'vitest';
import { 
  generatePersonalizedJathakamForecast, 
  askPersonalizedAstroOracle,
  generateKeralaRashiChakra,
  calculate10Porutham
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
});
