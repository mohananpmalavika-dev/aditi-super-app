import { describe, it, expect } from 'vitest';
import {
  calculateAstrologicalChart,
  calculateAuthentic10Porutham,
  computeLivePanchangam,
  getJulianDay,
  getLahiriAyanamsha,
  NAKSHATRAS_METADATA,
  RASHIS_METADATA
} from '../services/ephemerisEngine';
import {
  generateKeralaRashiChakra,
  calculate10Porutham
} from '../services/keralaAstroEngine';
import { getLiveMalayalamPanchangam } from '../services/malayalamAstroService';

describe('Authentic Kerala Vedic Astrology & Ephemeris Engine', () => {
  it('computes accurate Julian Day and Lahiri Ayanamsha', () => {
    // Julian Day for J2000.0 epoch (2000-01-01 12:00 UTC)
    const jd2000 = getJulianDay(2000, 1, 1, 12, 0, 0);
    expect(jd2000).toBeCloseTo(2451545.0, 1);

    // Lahiri Ayanamsha at J2000 is ~23.858° (23° 51')
    const ayanamsha2000 = getLahiriAyanamsha(jd2000);
    expect(ayanamsha2000).toBeGreaterThan(23.8);
    expect(ayanamsha2000).toBeLessThan(23.9);

    // For 2026, Ayanamsha should be ~24.2°
    const jd2026 = getJulianDay(2026, 1, 1, 0, 0, 0);
    const ayanamsha2026 = getLahiriAyanamsha(jd2026);
    expect(ayanamsha2026).toBeGreaterThan(24.1);
  });

  it('computes real astronomical planetary chart, Lagna, and Nakshatras', () => {
    const chart = calculateAstrologicalChart('1998-08-15', '10:30', 'Kollam, Kerala');

    expect(chart.lagna).toBeDefined();
    expect(chart.lagna.longitude).toBeGreaterThanOrEqual(0);
    expect(chart.lagna.longitude).toBeLessThan(360);
    expect(chart.lagna.rashiIndex).toBeGreaterThanOrEqual(0);
    expect(chart.lagna.rashiIndex).toBeLessThanOrEqual(11);

    // Verify all 10 planets exist
    expect(chart.planets.length).toBe(10);
    const sun = chart.planets.find((p) => p.id === 'sun');
    const moon = chart.planets.find((p) => p.id === 'moon');
    const mars = chart.planets.find((p) => p.id === 'mars');

    expect(sun).toBeDefined();
    expect(moon).toBeDefined();
    expect(mars).toBeDefined();

    // On August 15, Sun is in Cancer or Leo (Karkkidakam / Chingam)
    expect([3, 4]).toContain(sun?.rashiIndex);

    // Moon Nakshatra & Pada
    expect(chart.moonNakshatra.index).toBeGreaterThanOrEqual(0);
    expect(chart.moonNakshatra.index).toBeLessThan(27);
    expect(chart.moonNakshatra.pada).toBeGreaterThanOrEqual(1);
    expect(chart.moonNakshatra.pada).toBeLessThanOrEqual(4);

    // Vimshottari Dasha balance
    expect(chart.vimshottariDasha.birthDashaLord).toBeTruthy();
    expect(chart.vimshottariDasha.balanceYears).toBeGreaterThanOrEqual(0);
    expect(chart.vimshottariDasha.currentMahadasha).toBeTruthy();
  });

  it('correctly calculates South Indian 12-Box Kerala Rashi Chakra Grid', () => {
    const chakra = generateKeralaRashiChakra('Malavika', '1998-08-15', '10:30', 'Kollam, Kerala');

    expect(chakra.grid.length).toBe(12);
    expect(chakra.navamshaGrid.length).toBe(12);

    // Box 0 is Meenam (Pisces)
    expect(chakra.grid[0].nameMalayalam).toBe('മീനം');
    // Box 1 is Medam (Aries)
    expect(chakra.grid[1].nameMalayalam).toBe('മേടം');
    // Box 2 is Edavam (Taurus)
    expect(chakra.grid[2].nameMalayalam).toBe('ഇടവം');
    // Box 3 is Mithunam (Gemini)
    expect(chakra.grid[3].nameMalayalam).toBe('മിഥുനം');
    // Box 4 is Karkkidakam (Cancer)
    expect(chakra.grid[4].nameMalayalam).toBe('കർക്കിടകം');
    // Box 5 is Chingam (Leo)
    expect(chakra.grid[5].nameMalayalam).toBe('ചിങ്ങം');
    // Box 6 is Kanni (Virgo)
    expect(chakra.grid[6].nameMalayalam).toBe('കന്നി');
    // Box 7 is Thulam (Libra)
    expect(chakra.grid[7].nameMalayalam).toBe('തുലാം');
    // Box 8 is Vrischikam (Scorpio)
    expect(chakra.grid[8].nameMalayalam).toBe('വൃശ്ചികം');
    // Box 9 is Dhanu (Sagittarius)
    expect(chakra.grid[9].nameMalayalam).toBe('ധനു');
    // Box 10 is Makaram (Capricorn)
    expect(chakra.grid[10].nameMalayalam).toBe('മകരം');
    // Box 11 is Kumbham (Aquarius)
    expect(chakra.grid[11].nameMalayalam).toBe('കുംഭം');

    // Lagna should be marked in exactly 1 box
    const lagnaBoxes = chakra.grid.filter((b) => b.isLagna);
    expect(lagnaBoxes.length).toBe(1);
  });

  describe('10-Porutham Matchmaking (പത്തു പൊരുത്തം)', () => {
    it('detects Rajju Dosha when both groom and bride share identical Rajju', () => {
      // Makayiram (4) and Chithira (13) are both in Siro Rajju (Head)
      const result = calculateAuthentic10Porutham(4, 13);
      expect(result.hasRajjuDosha).toBe(true);

      const rajjuItem = result.poruthams.find((p) => p.id === 'rajju');
      expect(rajjuItem?.points).toBe(0);
      expect(rajjuItem?.isAfflicted).toBe(true);
      expect(result.verdictMalayalam).toContain('രജ്ജുദോഷം');
    });

    it('detects Vedha Dosha when stars have mutual affliction', () => {
      // Ashwathi (0) and Thrikketta (17) have mutual Vedham
      const result = calculateAuthentic10Porutham(0, 17);
      expect(result.hasVedhaDosha).toBe(true);

      const vedhaItem = result.poruthams.find((p) => p.id === 'vedham');
      expect(vedhaItem?.points).toBe(0);
      expect(vedhaItem?.isAfflicted).toBe(true);
      expect(result.verdictMalayalam).toContain('വേധദോഷം');
    });

    it('evaluates hostile Yoni species (Maha Vaira Yoni) correctly', () => {
      // Uthram (11 - Cow) and Chithira (13 - Tiger) are enemy species
      const result = calculateAuthentic10Porutham(13, 11);
      const yoniItem = result.poruthams.find((p) => p.id === 'yoni');
      expect(yoniItem?.points).toBe(0);
      expect(yoniItem?.descriptionMalayalam).toContain('മഹാശത്രുത');
    });

    it('evaluates highly compatible star pairs favorably', () => {
      // Boy = Thiruvonam (21), Girl = Ashwathi (0)
      const result = calculate10Porutham('തിരുവോണം (Thiruvonam)', 'അശ്വതി (Ashwathi)');
      expect(result.totalScore).toBeGreaterThanOrEqual(7);
      expect(result.hasRajjuDosha).toBe(false);
      expect(result.hasVedhaDosha).toBe(false);
      expect(result.poruthams.length).toBe(10);
    });
  });

  it('computes live dynamic Malayalam Panchangam', () => {
    const panchangam = getLiveMalayalamPanchangam();

    expect(panchangam.dayMalayalam).toBeTruthy();
    expect(panchangam.kollamEra).toContain('കൊല്ലവർഷം');
    expect(panchangam.tithiMalayalam).toBeTruthy();
    expect(panchangam.nakshatraMalayalam).toBeTruthy();
    expect(panchangam.yogamMalayalam).toBeTruthy();
    expect(panchangam.karanamMalayalam).toBeTruthy();
    expect(panchangam.rahuKalamMalayalam).toBeTruthy();
    expect(panchangam.abhijithMuhurthamMalayalam).toBeTruthy();
  });
});
