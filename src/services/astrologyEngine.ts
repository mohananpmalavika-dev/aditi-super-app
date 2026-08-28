import { KundaliHouse, TarotCardData, ZodiacSignInfo } from '../types/superApp';
import { calculateAstrologicalChart, RASHIS_METADATA } from './ephemerisEngine';

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    sign: 'Aries',
    symbol: '♈',
    element: 'Fire',
    dateRange: 'Mar 21 - Apr 19',
    luckyNumber: 9,
    luckyColor: 'Crimson Red',
    mood: 'Energetic & Driven',
    dailyHoroscope: {
      general: 'Your natural leadership instincts are in top gear today. A bold step taken in the afternoon yields immediate recognition.',
      love: 'Passionate conversations bring you closer to your partner. If single, high magnetic attraction is indicated.',
      career: 'Great day to present high-impact ideas to leadership. Focus on execution over debate.',
      wellness: 'High physical stamina today. Perfect time for an intense workout or cardio session.'
    }
  },
  {
    sign: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    dateRange: 'Apr 20 - May 20',
    luckyNumber: 6,
    luckyColor: 'Emerald Green',
    mood: 'Grounded & Practical',
    dailyHoroscope: {
      general: 'Financial stability and comfort are highlighted today. Take time to organize your surroundings and budget.',
      love: 'Warm, dependable affection strengthens bonds. Cook a cozy dinner or share a relaxing evening.',
      career: 'Long-term investments and meticulous planning pay off. Don’t rush decisions.',
      wellness: 'Focus on gentle stretching and hydration. Avoid overindulgence in heavy foods.'
    }
  },
  {
    sign: 'Gemini',
    symbol: '♊',
    element: 'Air',
    dateRange: 'May 21 - Jun 20',
    luckyNumber: 5,
    luckyColor: 'Vibrant Yellow',
    mood: 'Curious & Communicative',
    dailyHoroscope: {
      general: 'Your mind is buzzing with brilliant concepts. A chance conversation opens doors to exciting collaborations.',
      love: 'Witty banter and playful flirting brighten your day. Express your authentic feelings.',
      career: 'Networking yields strong dividends. Send those pending emails and schedule key meetings.',
      wellness: 'Mental stimulation is high; practice 10 minutes of breathwork before sleep.'
    }
  },
  {
    sign: 'Cancer',
    symbol: '♋',
    element: 'Water',
    dateRange: 'Jun 21 - Jul 22',
    luckyNumber: 2,
    luckyColor: 'Pearl Silver',
    mood: 'Intuitive & Empathetic',
    dailyHoroscope: {
      general: 'Trust your inner gut feeling today—it will guide you correctly in a tricky personal situation.',
      love: 'Deep emotional resonance with loved ones. An old memory brings warmth and gratitude.',
      career: 'Creative projects receive a boost from your empathetic intuition. Focus on quality.',
      wellness: 'Water therapy, a warm bath, or walking by nature restores your energy.'
    }
  },
  {
    sign: 'Leo',
    symbol: '♌',
    element: 'Fire',
    dateRange: 'Jul 23 - Aug 22',
    luckyNumber: 1,
    luckyColor: 'Sun Gold',
    mood: 'Radiant & Confident',
    dailyHoroscope: {
      general: 'You command attention effortlessly today. Shine your light and inspire those around you.',
      love: 'Grand romantic gestures will be received with enthusiasm. Celebrate your connection.',
      career: 'Take the stage! Your creative presentations and initiative will be rewarded.',
      wellness: 'Good vitality, but ensure you get adequate rest and protect your heart health.'
    }
  },
  {
    sign: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    dateRange: 'Aug 23 - Sep 22',
    luckyNumber: 3,
    luckyColor: 'Navy Blue',
    mood: 'Analytical & Focused',
    dailyHoroscope: {
      general: 'Detail-oriented tasks will be completed with surgical precision. Perfect day for decluttering.',
      love: 'Acts of service speak louder than words. Show care by helping out with practical tasks.',
      career: 'Efficiency is at an all-time high. You easily untangle complex logistics or code.',
      wellness: 'A balanced nutrition plan and mindful eating will boost your digestion.'
    }
  },
  {
    sign: 'Libra',
    symbol: '♎',
    element: 'Air',
    dateRange: 'Sep 23 - Oct 22',
    luckyNumber: 7,
    luckyColor: 'Pastel Rose',
    mood: 'Harmonious & Artistic',
    dailyHoroscope: {
      general: 'Balance is restored in your relationships. Beauty, aesthetics, and diplomacy are your allies.',
      love: 'Charming interactions and harmonious chemistry. A great day for romantic dates.',
      career: 'Negotiations go smoothly. You can bridge differences between conflicting stakeholders.',
      wellness: 'Engage in yoga, pilates, or light dance to maintain physical equilibrium.'
    }
  },
  {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    dateRange: 'Oct 23 - Nov 21',
    luckyNumber: 8,
    luckyColor: 'Deep Burgundy',
    mood: 'Transformative & Magnetic',
    dailyHoroscope: {
      general: 'Powerful insights into personal growth. You possess the determination to overcome any obstacle.',
      love: 'Intense chemistry and profound emotional connection. Be open to vulnerability.',
      career: 'Investigative work, research, and high-stakes problem solving succeed brilliantly.',
      wellness: 'Channel intense energy through high-intensity workouts or deep meditation.'
    }
  },
  {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    dateRange: 'Nov 22 - Dec 21',
    luckyNumber: 4,
    luckyColor: 'Royal Purple',
    mood: 'Adventurous & Optimistic',
    dailyHoroscope: {
      general: 'The horizon calls! New learning opportunities, travel plans, or big visions ignite your passion.',
      love: 'Spontaneous fun with someone special. Laugh freely and share your wildest dreams.',
      career: 'Broaden your scope. International collaborations or publishing ideas gain traction.',
      wellness: 'Outdoor activities and fresh air will invigorate your spirit and reduce stress.'
    }
  },
  {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    dateRange: 'Dec 22 - Jan 19',
    luckyNumber: 10,
    luckyColor: 'Charcoal Slate',
    mood: 'Ambitious & Disciplined',
    dailyHoroscope: {
      general: 'Your disciplined perseverance sets a benchmark. A major milestone is within reach.',
      love: 'Loyalty and mutual respect anchor your relationship. Discuss future goals together.',
      career: 'Executive leadership notices your reliability. Keep up the high standards.',
      wellness: 'Pay attention to your posture and joint health during long working hours.'
    }
  },
  {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    dateRange: 'Jan 20 - Feb 18',
    luckyNumber: 11,
    luckyColor: 'Electric Cyan',
    mood: 'Visionary & Innovative',
    dailyHoroscope: {
      general: 'Out-of-the-box thinking allows you to innovate where others see dead ends.',
      love: 'Valuing individuality and intellectual rapport makes your romantic life exciting.',
      career: 'Tech innovations, community initiatives, and collaborative brainstorming thrive.',
      wellness: 'Try sound therapy or mindfulness apps to calm your active, futuristic thoughts.'
    }
  },
  {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water',
    dateRange: 'Feb 19 - Mar 20',
    luckyNumber: 12,
    luckyColor: 'Aquamarine',
    mood: 'Dreamy & Compassionate',
    dailyHoroscope: {
      general: 'Your imagination is boundless today. Creative and artistic pursuits will be deeply rewarding.',
      love: 'Soulful empathy and magical moments. Listen closely to your partner’s unspoken words.',
      career: 'Art, design, music, and empathetic consulting yield wonderful breakthroughs.',
      wellness: 'Prioritize restorative sleep and express emotions through writing or art.'
    }
  }
];

export const TAROT_DECK: TarotCardData[] = [
  {
    id: 'the-fool',
    name: '0 - The Fool',
    arcana: 'Major',
    keywords: ['New Beginnings', 'Innocence', 'Spontaneity', 'Free Spirit'],
    meaningUpright: 'A fresh adventure awaits! Take the leap of faith with an open heart and trust in the universe.',
    meaningReversed: 'Holding back due to fear or acting recklessly without considering consequences.',
    imageUrl: 'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-magician',
    name: 'I - The Magician',
    arcana: 'Major',
    keywords: ['Manifestation', 'Resourcefulness', 'Power', 'Inspired Action'],
    meaningUpright: 'You possess all the tools, skills, and resources to manifest your desires into tangible reality.',
    meaningReversed: 'Untapped potential, hesitation, or misdirection of powerful energy.',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-high-priestess',
    name: 'II - The High Priestess',
    arcana: 'Major',
    keywords: ['Intuition', 'Sacred Knowledge', 'Divine Feminine', 'Subconscious'],
    meaningUpright: 'Look beyond the surface. Your intuition holds the profound wisdom you are seeking.',
    meaningReversed: 'Ignoring your inner voice, secrets, or feeling disconnected from spiritual roots.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-empress',
    name: 'III - The Empress',
    arcana: 'Major',
    keywords: ['Abundance', 'Fertility', 'Creativity', 'Nurturing'],
    meaningUpright: 'A period of rich creativity, luxury, and flourishing growth in personal and professional realms.',
    meaningReversed: 'Creative block, dependency, or neglecting personal self-care.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-emperor',
    name: 'IV - The Emperor',
    arcana: 'Major',
    keywords: ['Authority', 'Structure', 'Control', 'Fatherhood'],
    meaningUpright: 'Establishing order, stable foundations, and disciplined leadership brings enduring success.',
    meaningReversed: 'Rigid dogmatism, micromanagement, or lack of structured discipline.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-lovers',
    name: 'VI - The Lovers',
    arcana: 'Major',
    keywords: ['Love', 'Harmony', 'Relationships', 'Values Alignment'],
    meaningUpright: 'Deep soul connection, harmonious partnership, and choices made with complete integrity.',
    meaningReversed: 'Misalignment of core values, inner conflict, or communication breakdown.',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-chariot',
    name: 'VII - The Chariot',
    arcana: 'Major',
    keywords: ['Control', 'Willpower', 'Victory', 'Determination'],
    meaningUpright: 'Triumph over adversity through unwavering focus, drive, and disciplined perseverance.',
    meaningReversed: 'Feeling out of control, lack of clear direction, or aggressive impatience.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-star',
    name: 'XVII - The Star',
    arcana: 'Major',
    keywords: ['Hope', 'Faith', 'Purpose', 'Inspiration', 'Renewal'],
    meaningUpright: 'Renewed hope, divine inspiration, and serene clarity after a storm. Your blessings are unfolding.',
    meaningReversed: 'Lack of faith, despair, or discouragement. Remember your inner light.',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-sun',
    name: 'XIX - The Sun',
    arcana: 'Major',
    keywords: ['Joy', 'Success', 'Celebration', 'Vitality'],
    meaningUpright: 'Unfiltered joy, vibrant health, abundance, and glowing optimism. Everything turns into gold.',
    meaningReversed: 'Temporary gloom or difficulty seeing the bright side of an otherwise fortunate situation.',
    imageUrl: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'the-world',
    name: 'XXI - The World',
    arcana: 'Major',
    keywords: ['Completion', 'Integration', 'Accomplishment', 'Travel'],
    meaningUpright: 'The successful completion of a major life cycle. Wholeness, achievement, and new horizons.',
    meaningReversed: 'Unfinished business or delaying a well-deserved closure.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80'
  }
];

export function calculateVedicKundali(
  name: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string
): {
  ascendant: string;
  moonSign: string;
  sunSign: string;
  houses: KundaliHouse[];
  doshaReport: string;
  lifeRecommendation: string;
} {
  const chart = calculateAstrologicalChart(birthDate, birthTime, birthPlace);

  const signs = [
    'Aries (Mesha)',
    'Taurus (Vrishabha)',
    'Gemini (Mithuna)',
    'Cancer (Karka)',
    'Leo (Simha)',
    'Virgo (Kanya)',
    'Libra (Tula)',
    'Scorpio (Vrischika)',
    'Sagittarius (Dhanu)',
    'Capricorn (Makara)',
    'Aquarius (Kumbha)',
    'Pisces (Meena)'
  ];

  const ascIdx = chart.lagna.rashiIndex;
  const moonIdx = chart.moonRashi.index;
  const sunIdx = chart.sunRashi.index;

  const houseSignificances = [
    '1st House (Lagna): Physical Self, Personality, Vitality',
    '2nd House (Dhana): Wealth, Family Lineage, Speech',
    '3rd House (Sahaja): Courage, Siblings, Communication',
    '4th House (Sukha): Mother, Real Estate, Emotional Peace',
    '5th House (Putra): Intellect, Creativity, Speculation',
    '6th House (Ari): Overcoming Obstacles, Health, Service',
    '7th House (Yuvati): Marriage, Business Partnerships, Public Image',
    '8th House (Randhra): Transformation, Longevity, Occult Wisdom',
    '9th House (Dharma): Higher Wisdom, Luck, Spiritual Guru',
    '10th House (Karma): Career Prominence, Status, Fame',
    '11th House (Labha): Huge Gains, Aspirations, Social Network',
    '12th House (Vyaya): Foreign Travel, Spiritual Liberation (Moksha)'
  ];

  const houses: KundaliHouse[] = Array.from({ length: 12 }, (_, i) => {
    const rashiForThisHouse = (ascIdx + i) % 12;
    const assignedSign = signs[rashiForThisHouse];

    // Find real planets residing in this Rashi
    const housePlanets: string[] = [];
    if (i === 0) {
      housePlanets.push(`Lagna 🕉️ (${chart.lagna.formattedDegree.split(' ')[0]})`);
    }

    chart.planets.forEach((p) => {
      if (p.rashiIndex === rashiForThisHouse) {
        housePlanets.push(`${p.nameEnglish} ${p.symbol} (${p.formattedDegree.split(' ')[0]})`);
      }
    });

    return {
      houseNumber: i + 1,
      sign: assignedSign,
      planets: housePlanets,
      significance: houseSignificances[i]
    };
  });

  const yogasReport = chart.doshaSummary.yogas.length > 0 
    ? chart.doshaSummary.yogas.join(' • ')
    : 'Auspicious planetary alignment supporting steady prosperity.';

  return {
    ascendant: signs[ascIdx],
    moonSign: signs[moonIdx],
    sunSign: signs[sunIdx],
    houses,
    doshaReport: `${chart.doshaSummary.kujaDoshaEnglish}. ${yogasReport}`,
    lifeRecommendation:
      `Your birth star is ${chart.moonNakshatra.nameEnglish} (Pada ${chart.moonNakshatra.pada}). Active Mahadasha is ${chart.vimshottariDasha.currentMahadasha} (${chart.vimshottariDasha.dashaStartDate}-${chart.vimshottariDasha.dashaEndDate}). Focus on knowledge expansion, property acquisitions, and spiritual discipline.`
  };
}
