/**
 * malayalamAstroService.ts
 * Comprehensive Malayalam & Vedic Astrology Engine
 * 
 * Features:
 * - 12 Malayalam Rashis & 27 Nakshathrams
 * - Daily (ദിവസഫലം), Weekly (വാരഫലം), Monthly (മാസഫലം), Yearly (വർഷഫലം - 2026/2027)
 * - Prashna Marga Question-Based Horary Oracle (പ്രശ്ന ജ്യോതിഷം)
 * - Daily Malayalam Panchangam (പഞ്ചാംഗം, രാഹുകാലം, ഗുളികകാലം)
 */

export interface MalayalamRashiInfo {
  id: string;
  nameMalayalam: string;
  nameEnglish: string;
  symbol: string;
  lordMalayalam: string;
  lordEnglish: string;
  elementMalayalam: string;
  nakshatrams: string[];
  luckyColorMalayalam: string;
  luckyNumber: number;
  luckyDayMalayalam: string;
  
  daily: {
    generalMalayalam: string;
    generalEnglish: string;
    careerMalayalam: string;
    careerEnglish: string;
    financeMalayalam: string;
    financeEnglish: string;
    loveMalayalam: string;
    loveEnglish: string;
    remedyMalayalam: string;
    remedyEnglish: string;
  };
  
  weekly: {
    summaryMalayalam: string;
    summaryEnglish: string;
    highlightsMalayalam: string[];
    highlightsEnglish: string[];
    favorableDaysMalayalam: string;
  };
  
  monthly: {
    summaryMalayalam: string;
    summaryEnglish: string;
    transitEffectsMalayalam: string;
    transitEffectsEnglish: string;
    remediesMalayalam: string;
  };
  
  yearly: {
    year: string;
    summaryMalayalam: string;
    summaryEnglish: string;
    guruSaturnTransitMalayalam: string;
    guruSaturnTransitEnglish: string;
    careerWealthMalayalam: string;
    careerWealthEnglish: string;
    familyHealthMalayalam: string;
    familyHealthEnglish: string;
    pujaPariharamMalayalam: string;
    pujaPariharamEnglish: string;
  };
}

export const MALAYALAM_RASHIS: MalayalamRashiInfo[] = [
  {
    id: 'aries',
    nameMalayalam: 'മേടം',
    nameEnglish: 'Aries',
    symbol: '♈',
    lordMalayalam: 'ചൊവ്വ (Kuja)',
    lordEnglish: 'Mars',
    elementMalayalam: 'അഗ്നി (Fire)',
    nakshatrams: ['അശ്വതി (Ashwathi)', 'ഭരണി (Bharani)', 'കാർത്തിക 1/4 (Karthika 1st quarter)'],
    luckyColorMalayalam: 'ചുവപ്പ്, കുങ്കുമം',
    luckyNumber: 9,
    luckyDayMalayalam: 'ചൊവ്വാഴ്ച (Tuesday)',
    daily: {
      generalMalayalam: 'തൊഴിൽപരമായ യാത്രകൾ സഫലമാകും. സുഹൃത്തുക്കളിൽ നിന്ന് അപ്രതീക്ഷിത സഹായം ലഭിക്കും. പുതിയ സംരംഭങ്ങൾ ആരംഭിക്കാൻ അനുകൂല സമയം.',
      generalEnglish: 'Career travels will be fruitful. Unexpected support from close associates. Auspicious time to initiate new milestones.',
      careerMalayalam: 'ഉദ്യോഗസ്ഥർക്ക് സ്ഥാനക്കയറ്റ സാധ്യത. മേലുദ്യോഗസ്ഥരുടെ പ്രീതി നേടും.',
      careerEnglish: 'High chances of promotion for professionals. Favorable rapport with management.',
      financeMalayalam: 'ധനാഗമത്തിൽ പുരോഗതി. ബാങ്ക് നിക്ഷേപങ്ങൾ വർദ്ധിക്കും.',
      financeEnglish: 'Steady growth in revenue and cash flow. Lucrative savings opportunities.',
      loveMalayalam: 'ദാമ്പത്യത്തിൽ സന്തോഷവും സ്നേഹവും നിറയും. പങ്കാളിയുമായി സമയം പങ്കിടും.',
      loveEnglish: 'Warmth and mutual respect in relationships. Meaningful time spent with your partner.',
      remedyMalayalam: 'സുബ്രഹ്മണ്യ ക്ഷേത്രത്തിൽ നെയ്‌വിളക്ക് സമർപ്പിക്കുക, ഷണ്മുഖ സ്തോത്രം ജപിക്കുക.',
      remedyEnglish: 'Offer ghee lamp at Lord Murugan temple and chant Shanmukha Stotram.'
    },
    weekly: {
      summaryMalayalam: 'ഈ വാരം ഗ്രഹങ്ങളുടെ അനുകൂല സ്ഥിതി കാരണം കാര്യവിജയവും മനസ്സമാധാനവും ഉണ്ടാകും. വസ്തു സംബന്ധമായ ഇടപാടുകൾ ലാഭകരമാകും.',
      summaryEnglish: 'Planetary alignments favor decisive achievements and mental serenity. Property transactions will yield strong gains.',
      highlightsMalayalam: ['സന്താനങ്ങളുടെ പഠനപുരോഗതി', 'പുതിയ വരുമാന സ്രോതസ്സുകൾ', 'ശത്രുദോഷ പരിഹാരം'],
      highlightsEnglish: ['Academic success for children', 'Emergence of new income channels', 'Overcoming competitive hurdles'],
      favorableDaysMalayalam: 'ചൊവ്വ, വ്യാഴം (Tuesday, Thursday)'
    },
    monthly: {
      summaryMalayalam: 'ഈ മാസം പൊതുവെ അനുകൂല മാറ്റങ്ങളുടെ കാലമാണ്. സാമ്പത്തിക ഭദ്രത കൈവരിക്കാനും കുടുംബത്തിൽ മംഗളകർമ്മങ്ങൾ നടക്കാനും സാധ്യതയുണ്ട്.',
      summaryEnglish: 'A month of auspicious transitions. Financial fortification and family celebrations are strongly indicated.',
      transitEffectsMalayalam: 'വ്യാഴമാറ്റം മൂലം സൗഭാഗ്യ വർദ്ധനവ്. ചൊവ്വയുടെ ത്രികോണ സ്ഥിതി ഊർജ്ജസ്വലത നൽകും.',
      transitEffectsEnglish: 'Jupiter transit brings auspicious fortune. Mars trine bestows unmatched vitality.',
      remediesMalayalam: 'ചൊവ്വാഴ്ചകളിൽ ഭദ്രകാളി ക്ഷേത്ര ദർശനം നടത്തുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 മേടക്കൂറുകാർക്ക് വളർച്ചയുടെയും ഭാഗ്യത്തിന്റെയും വർഷമാണ്. കഴിഞ്ഞ വർഷങ്ങളിലെ പ്രതിസന്ധികൾ അകന്ന് സാമ്പത്തികമായും തൊഴിൽപരമായും മികച്ച നേട്ടങ്ങൾ കൈവരിക്കും.',
      summaryEnglish: '2026 is a year of triumphant growth for Aries natives. Past hurdles dissolve, yielding major career and wealth milestones.',
      guruSaturnTransitMalayalam: 'വ്യാഴം അനുകൂല ഭാവത്തിൽ സഞ്ചരിക്കുന്നതിനാൽ ഭാഗ്യാനുഭവങ്ങൾ, വിവാഹം, സന്താനലബ്ധി എന്നിവ ഉണ്ടാകും. ശനി അനുകൂല ഫലങ്ങൾ തരും.',
      guruSaturnTransitEnglish: 'Jupiter transit brings marital harmony and family expansion. Saturn transit accelerates solid enterprise building.',
      careerWealthMalayalam: 'വിദേശജോലി ആഗ്രഹിക്കുന്നവർക്ക് സുവർണ്ണാവസരം. റിയൽ എസ്റ്റേറ്റ്, വ്യവസായം എന്നിവയിൽ വലിയ ലാഭം.',
      careerWealthEnglish: 'Golden overseas opportunities. Exceptional gains in technology, trading, and real estate.',
      familyHealthMalayalam: 'ആരോഗ്യം പൊതുവെ തൃപ്തികരം. മാതാപിതാക്കളുടെ ആരോഗ്യം ശ്രദ്ധിക്കുക.',
      familyHealthEnglish: 'Overall vitality remains strong. Maintain consistent wellness habits.',
      pujaPariharamMalayalam: 'സുബ്രഹ്മണ്യ സ്വാമിക്ക് പഞ്ചാമൃതാഭിഷേകം, സർപ്പബലി എന്നിവ ശ്രേയസ്സ് നൽകും.',
      pujaPariharamEnglish: 'Perform Panchamritam Abhishekam to Lord Murugan and Sree Maha Ganapathi Homam.'
    }
  },
  {
    id: 'taurus',
    nameMalayalam: 'ഇടവം',
    nameEnglish: 'Taurus',
    symbol: '♉',
    lordMalayalam: 'ശുക്രൻ (Shukra)',
    lordEnglish: 'Venus',
    elementMalayalam: 'ഭൂമി (Earth)',
    nakshatrams: ['കാർത്തിക 3/4 (Karthika)', 'രോഹിണി (Rohini)', 'മകയിരം 1/2 (Makayiram)'],
    luckyColorMalayalam: 'വെള്ള, വെള്ളി, ഇളം നീല',
    luckyNumber: 6,
    luckyDayMalayalam: 'വെള്ളിയാഴ്ച (Friday)',
    daily: {
      generalMalayalam: 'മനസ്സിന് സമാധാനവും സന്തോഷവും ലഭിക്കുന്ന ദിവസം. കല, സംഗീതം, ക്രിയേറ്റീവ് വർക്കുകൾ എന്നിവയിൽ ശോഭിക്കും.',
      generalEnglish: 'A serene and joyful day. Excellence in creative arts, communication, and business planning.',
      careerMalayalam: 'സഹപ്രവർത്തകരുടെ പൂർണ്ണ പിന്തുണ ലഭിക്കും. പുതിയ കരാറുകൾ ഒപ്പിടാൻ സാധിക്കും.',
      careerEnglish: 'Full collaborative backing from peers. High probability of finalizing lucrative agreements.',
      financeMalayalam: 'ആഭരണങ്ങൾ, വസ്ത്രങ്ങൾ എന്നിവ വാങ്ങാൻ ചെലവ് വരും. ധനവരവ് തൃപ്തികരം.',
      financeEnglish: 'Expenditure on luxury or lifestyle assets. Overall cash inflow remains healthy.',
      loveMalayalam: 'പ്രണയബന്ധങ്ങൾ ദൃഢപ്പെടും. കുടുംബത്തിൽ സമാധാനാന്തരീക്ഷം.',
      loveEnglish: 'Romantic bonds deepen. Harmonious domestic atmosphere.',
      remedyMalayalam: 'മഹാലക്ഷ്മി അഷ്ടകം ജപിക്കുക, വെള്ളിയാഴ്ച ദേവിക്ക് പായസം നിവേദിക്കുക.',
      remedyEnglish: 'Chant Mahalakshmi Ashtakam and offer sweet kheer at Devi temple on Fridays.'
    },
    weekly: {
      summaryMalayalam: 'സാമ്പത്തിക ഇടപാടുകളിൽ ശ്രദ്ധ വേണം. കൃത്യമായ പ്ലാനിംഗ് വഴി ലക്ഷ്യങ്ങൾ കൈവരിക്കാം.',
      summaryEnglish: 'Prudent financial planning will unlock key milestones. Focus on steady progress.',
      highlightsMalayalam: ['സൗഹൃദങ്ങളിൽ പുതിയ ഉണർവ്വ്', 'ബിസിനസ്സ് നവീകരണം', 'മംഗളവാർത്തകൾ'],
      highlightsEnglish: ['Enriching friendships', 'Modernized business processes', 'Uplifting news'],
      favorableDaysMalayalam: 'ബുധൻ, വെള്ളി (Wednesday, Friday)'
    },
    monthly: {
      summaryMalayalam: 'കലാകാരന്മാർക്കും ബിസിനസ്സുകാർക്കും ഈ മാസം വളരെ മെച്ചപ്പെട്ട ഫലങ്ങൾ സമ്മാനിക്കും.',
      summaryEnglish: 'Exceptional creative breakthroughs and high customer satisfaction for enterprises.',
      transitEffectsMalayalam: 'ശുക്രന്റെ ഉച്ചസ്ഥിതി സർവ്വകാര്യ വിജയത്തിന് കാരണമാകും.',
      transitEffectsEnglish: 'Exalted Venus bestows luxury, charm, and professional respect.',
      remediesMalayalam: 'വെള്ളിയാഴ്ച ലളിതാസഹസ്രനാമം ജപിക്കുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 ഇടവക്കൂറുകാർക്ക് സമൃദ്ധിയുടെയും കുടുംബ സൗഖ്യത്തിന്റെയും കാലമാണ്. പുതിയ ഗൃഹനിർമ്മാണം, വാഹനലാഭം എന്നിവ ഉണ്ടാകും.',
      summaryEnglish: '2026 brings wealth accumulation, property acquisition, and domestic bliss for Taurus natives.',
      guruSaturnTransitMalayalam: 'വ്യാഴം ഭാഗ്യസ്ഥാനത്തേക്ക് പ്രവേശിക്കുന്നതോടെ മുടങ്ങിക്കിടന്ന കാര്യങ്ങളെല്ലാം അതിവേഗം പൂർത്തിയാകും.',
      guruSaturnTransitEnglish: 'Jupiter entering auspicious trine completes long-pending dreams and investments.',
      careerWealthMalayalam: 'ബിസിനസ്സിൽ വിപുലീകരണം. സ്ഥിരവരുമാനം ഇരട്ടിയാകും.',
      careerWealthEnglish: 'Rapid business expansion. Steady doubling of core revenue streams.',
      familyHealthMalayalam: 'കുടുംബത്തിൽ സമാധാനവും ഐശ്വര്യവും. തൊണ്ട, തൈറോയ്ഡ് എന്നിവ ശ്രദ്ധിക്കുക.',
      familyHealthEnglish: 'Peaceful domestic life. Maintain throat and metabolic wellness.',
      pujaPariharamMalayalam: 'മഹാലക്ഷ്മി പൂജ, അന്നദാനം എന്നിവ സർവ്വ ഐശ്വര്യവും തരും.',
      pujaPariharamEnglish: 'Perform Sri Sukta Homam and support food charity for perpetual prosperity.'
    }
  },
  {
    id: 'gemini',
    nameMalayalam: 'മിഥുനം',
    nameEnglish: 'Gemini',
    symbol: '♊',
    lordMalayalam: 'ബുധൻ (Budha)',
    lordEnglish: 'Mercury',
    elementMalayalam: 'വായു (Air)',
    nakshatrams: ['മകയിരം 1/2 (Makayiram)', 'തിരുവാതിര (Thiruvathira)', 'പുണർതം 3/4 (Punartham)'],
    luckyColorMalayalam: 'പച്ച, മഞ്ഞ',
    luckyNumber: 5,
    luckyDayMalayalam: 'ബുധനാഴ്ച (Wednesday)',
    daily: {
      generalMalayalam: 'ബുദ്ധിസാമർത്ഥ്യം കൊണ്ട് ഏത് പ്രതിസന്ധിയും തരണം ചെയ്യും. ഐ.ടി, എഴുത്ത്, മാധ്യമ പ്രവർത്തകർക്ക് ഉന്നത വിജയം.',
      generalEnglish: 'Intellect and wit resolve complex puzzles. High acclaim for tech, writing, and media professionals.',
      careerMalayalam: 'പുതിയ പ്രോജക്റ്റുകളുടെ നേതൃത്വം ലഭിക്കും. വിദേശ ആശയവിനിമയം വിജയകരം.',
      careerEnglish: 'Leadership of high-impact projects. Productive international communications.',
      financeMalayalam: 'ഷെയർ മാർക്കറ്റ്, ട്രേഡിംഗ് എന്നിവയിൽ ശ്രദ്ധിച്ചാൽ ലാഭമുണ്ടാക്കാം.',
      financeEnglish: 'Calculated investments in tech and markets yield positive returns.',
      loveMalayalam: 'സുഹൃത്തുക്കളുമായി സന്തോഷകരമായ സമ്പർക്കം. അനുയോജ്യമായ വിവാഹാലോചനകൾ വരും.',
      loveEnglish: 'Enriching conversations with partner and prospective marriage alliances.',
      remedyMalayalam: 'മഹാവിഷ്ണുവിന് തുളസിമാല സമർപ്പിക്കുക, വിഷ്ണുസഹസ്രനാമം ജപിക്കുക.',
      remedyEnglish: 'Offer Tulsi garland to Lord Maha Vishnu and chant Vishnu Sahasranama.'
    },
    weekly: {
      summaryMalayalam: 'പഠനത്തിലും ഗവേഷണത്തിലും മികച്ച പുരോഗതി. അനാവശ്യ ചിന്തകൾ ഒഴിവാക്കുക.',
      summaryEnglish: 'Brilliant strides in academia and research. Avoid over-analysis and stay grounded.',
      highlightsMalayalam: ['സഹോദര ഗുണം', 'പുതിയ കോഴ്സുകൾ', 'യാത്രാവിജയം'],
      highlightsEnglish: ['Sibling support', 'Skill acquisition', 'Travel success'],
      favorableDaysMalayalam: 'ബുധൻ, ഞായർ (Wednesday, Sunday)'
    },
    monthly: {
      summaryMalayalam: 'സാമ്പത്തിക കാര്യങ്ങളിൽ അച്ചടക്കം പാലിച്ചാൽ വലിയ നേട്ടങ്ങൾ സ്വന്തമാക്കാൻ സാധിക്കും.',
      summaryEnglish: 'Financial discipline combined with agile strategy unlocks grand rewards.',
      transitEffectsMalayalam: 'ബുധന്റെ അനുകൂല മാറ്റം ആശയവിനിമയ ശേഷി വർദ്ധിപ്പിക്കും.',
      transitEffectsEnglish: 'Mercury transits boost sharp reasoning and persuasive communications.',
      remediesMalayalam: 'ബുധനാഴ്ച പച്ചക്കറികൾ ദാനം ചെയ്യുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 മിഥുനക്കൂറുകാർക്ക് ബൗദ്ധിക വിജയങ്ങളുടെയും ആഗോള അവസരങ്ങളുടെയും വർഷമാണ്.',
      summaryEnglish: '2026 is an epoch of intellectual mastery and global expansion for Gemini.',
      guruSaturnTransitMalayalam: 'ശനി അനുകൂല നിലയിൽ സഞ്ചരിക്കുന്നതിനാൽ പരിശ്രമങ്ങൾക്ക് ഉചിതമായ പ്രതിഫലം ലഭിക്കും.',
      guruSaturnTransitEnglish: 'Saturn transit rewards disciplined perseverance with immense career authority.',
      careerWealthMalayalam: 'ഐ.ടി, മീഡിയ, സ്റ്റാർട്ടപ്പുകൾ എന്നിവയിൽ വൻ വളർച്ച.',
      careerWealthEnglish: 'Hyper-growth in technology, consultancy, and media startups.',
      familyHealthMalayalam: 'മാനസികാരോഗ്യം മെച്ചപ്പെടും. പ്രാണായാമം ശീലമാക്കുക.',
      familyHealthEnglish: 'Mental focus sharpens. Regular pranayama and meditation recommended.',
      pujaPariharamMalayalam: 'മഹാവിഷ്ണുവിങ്കൽ ഭാഗവത പാരായണം ശ്രേയസ്സ് നൽകും.',
      pujaPariharamEnglish: 'Chant Vishnu Sahasranama daily and sponsor temple green initiatives.'
    }
  },
  {
    id: 'cancer',
    nameMalayalam: 'കർക്കിടകം',
    nameEnglish: 'Cancer',
    symbol: '♋',
    lordMalayalam: 'ചന്ദ്രൻ (Chandra)',
    lordEnglish: 'Moon',
    elementMalayalam: 'ജലം (Water)',
    nakshatrams: ['പുണർതം 1/4 (Punartham)', 'പൂയം (Pooyam)', 'ആയില്യം (Aayilyam)'],
    luckyColorMalayalam: 'വെള്ള, മുത്ത് നിറം',
    luckyNumber: 2,
    luckyDayMalayalam: 'തിങ്കളാഴ്ച (Monday)',
    daily: {
      generalMalayalam: 'മനസ്സിന്റെ ആഗ്രഹങ്ങൾ സാക്ഷാത്കരിക്കപ്പെടും. മാതൃഗുണവും കുടുംബത്തിൽ ഐശ്വര്യവും വർദ്ധിക്കും.',
      generalEnglish: 'Intuitive aspirations materialize smoothly. Maternal blessings and domestic peace prevail.',
      careerMalayalam: 'ഉത്തരവാദിത്തങ്ങൾ ഭംഗിയായി നിർവ്വഹിക്കും. ആതുരസേവനം, ടീച്ചിംഗ് രംഗങ്ങളിൽ ഉന്നത നേട്ടം.',
      careerEnglish: 'Flawless execution of duties. High praise in healthcare, teaching, and management.',
      financeMalayalam: 'സ്ഥിര നിക്ഷേപങ്ങളിൽ നിന്നുള്ള ആദായം വർദ്ധിക്കും.',
      financeEnglish: 'Enhanced returns from safe investments and rental yields.',
      loveMalayalam: 'ഹൃദയംഗമമായ അനുഭവങ്ങൾ. പങ്കാളിയുടെ സ്നേഹവും കരുതലും ആസ്വദിക്കും.',
      loveEnglish: 'Heartfelt emotional connection and affectionate care from your spouse.',
      remedyMalayalam: 'ശിവക്ഷേത്രത്തിൽ ധാരയും കൂവളമാലയും സമർപ്പിക്കുക, നമഃശിവായ ജപിക്കുക.',
      remedyEnglish: 'Offer Dhara and Bilva garland at Lord Shiva temple and chant Om Namah Shivaya.'
    },
    weekly: {
      summaryMalayalam: 'കുടുംബത്തോടൊപ്പം ചെലവഴിക്കാൻ കൂടുതൽ സമയം ലഭിക്കും. ആത്മീയ കാര്യങ്ങളിൽ താല്പര്യം കൂടും.',
      summaryEnglish: 'Quality family bonding and heightened spiritual serenity throughout the week.',
      highlightsMalayalam: ['ഗൃഹസമാധാനം', 'ആത്മീയ ഉണർവ്വ്', 'ധനസ്ഥിരത'],
      highlightsEnglish: ['Domestic harmony', 'Spiritual clarity', 'Fiscal stability'],
      favorableDaysMalayalam: 'തിങ്കൾ, വ്യാഴം (Monday, Thursday)'
    },
    monthly: {
      summaryMalayalam: 'സന്താനങ്ങളുടെ ഉന്നമനവും സ്വന്തം കർമ്മരംഗത്ത് മികച്ച അംഗീകാരങ്ങളും വന്നുചേരും.',
      summaryEnglish: 'Recognition of talents and remarkable accomplishments for children.',
      transitEffectsMalayalam: 'ചന്ദ്രന്റെ അനുകൂല ഭാവങ്ങൾ മാനസികോല്ലാസം നൽകും.',
      transitEffectsEnglish: 'Harmonious lunar transits foster optimism and restorative peace.',
      remediesMalayalam: 'തിങ്കളാഴ്ചകളിൽ ചന്ദ്ര പൂജ നടത്തുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 കർക്കിടകക്കൂറുകാർക്ക് ഭാഗ്യത്തിന്റെയും പദവി ഉയർച്ചയുടെയും സുവർണ്ണ വർഷമാണ്.',
      summaryEnglish: '2026 brings monumental breakthroughs in status, prestige, and family harmony.',
      guruSaturnTransitMalayalam: 'വ്യാഴം കർക്കിടകത്തിൽ പ്രവേശിക്കുന്നതോടെ ഗജകേസരി യോഗത്തിന് തുല്യമായ ഫലങ്ങൾ അനുഭവപ്പെടും.',
      guruSaturnTransitEnglish: 'Jupiter transit creates majestic Gajakesari-like opportunities and royal honor.',
      careerWealthMalayalam: 'സർക്കാർ ആനുകൂല്യങ്ങൾ, പുതിയ കമ്പനി മേധാവിത്വം എന്നിവ ലഭിക്കും.',
      careerWealthEnglish: 'Government recognition, enterprise leadership, and solid asset creation.',
      familyHealthMalayalam: 'കുടുംബത്തിൽ പുണ്യകർമ്മങ്ങൾ നടക്കും. ഭക്ഷണത്തിൽ സമീകൃത രൂപം പാലിക്കുക.',
      familyHealthEnglish: 'Auspicious family functions. Maintain wholesome water-rich nutrition.',
      pujaPariharamMalayalam: 'ശിവന് ശംഖാഭിഷേകം, തിങ്കളാഴ്ച വ്രതം എന്നിവ സർവ്വ ദോഷവും മാറ്റും.',
      pujaPariharamEnglish: 'Perform Shankhabhishekam to Lord Shiva and keep peaceful Monday fasts.'
    }
  },
  {
    id: 'leo',
    nameMalayalam: 'ചിങ്ങം',
    nameEnglish: 'Leo',
    symbol: '♌',
    lordMalayalam: 'സൂര്യൻ (Surya)',
    lordEnglish: 'Sun',
    elementMalayalam: 'അഗ്നി (Fire)',
    nakshatrams: ['മകം (Makam)', 'പൂരം (Pooram)', 'ഉത്രം 1/4 (Uthram)'],
    luckyColorMalayalam: 'സ്വർണ്ണനിറം, കാവി, ഓറഞ്ച്',
    luckyNumber: 1,
    luckyDayMalayalam: 'ഞായറാഴ്ച (Sunday)',
    daily: {
      generalMalayalam: 'ആത്മവിശ്വാസവും തേജസ്സും വർദ്ധിക്കും. ഉന്നത വ്യക്തികളുമായി ബന്ധം സ്ഥാപിക്കാൻ സാധിക്കും.',
      generalEnglish: 'Radiant confidence and magnetic charisma. Productive high-level networking.',
      careerMalayalam: 'ഭരണപരമായ തീരുമാനങ്ങൾ കൃത്യതയോടെ നടപ്പിലാക്കും. നേതൃത്വപദവി ലഭിക്കും.',
      careerEnglish: 'Flawless execution of strategic decisions. Direct elevation to commanding roles.',
      financeMalayalam: 'ധനവരവ് മികച്ചതായിരിക്കും. മുൻകാല നിക്ഷേപങ്ങൾ ഇരട്ടി ലാഭം തരും.',
      financeEnglish: 'Strong income surge. Past investments generate lucrative returns.',
      loveMalayalam: 'പ്രൗഢവും ആത്മാർത്ഥവുമായ ബന്ധങ്ങൾ. മാതാപിതാക്കളുടെ ആശീർവാദം ലഭിക്കും.',
      loveEnglish: 'Noble, loyal relationships. Generous family celebrations and blessings.',
      remedyMalayalam: 'ആദിത്യഹൃദയ സ്തോത്രം ജപിക്കുക, സൂര്യോദയ സമയത്ത് സൂര്യനമസ്കാരം ചെയ്യുക.',
      remedyEnglish: 'Chant Aditya Hrudaya Stotram and perform Surya Namaskar at sunrise.'
    },
    weekly: {
      summaryMalayalam: 'ശത്രുക്കളുടെ മേൽ വിജയം കൈവരിക്കും. നിയമപരമായ കാര്യങ്ങളിൽ അനുകൂല വിധി ഉണ്ടാകും.',
      summaryEnglish: 'Decisive victory over competitors. Legal or bureaucratic matters resolve favorably.',
      highlightsMalayalam: ['കീർത്തി വർദ്ധനവ്', 'സ്ഥാനമാനങ്ങൾ', 'യാത്രാഗുണം'],
      highlightsEnglish: ['Prestige surge', 'Official accolades', 'Successful journeys'],
      favorableDaysMalayalam: 'ഞായർ, ചൊവ്വ (Sunday, Tuesday)'
    },
    monthly: {
      summaryMalayalam: 'പൊതുരംഗത്ത് പ്രവർത്തിക്കുന്നവർക്ക് അത്യപൂർവ്വ നേട്ടങ്ങളും പൊതുജനപ്രീതിയും ലഭിക്കും.',
      summaryEnglish: 'Unprecedented public goodwill, popularity, and honors for leaders.',
      transitEffectsMalayalam: 'സൂര്യന്റെ ഉച്ചസ്ഥിതി സർവ്വപ്രതാപവും നൽകും.',
      transitEffectsEnglish: 'Exalted Sun placement radiates leadership excellence and dynamic vitality.',
      remediesMalayalam: 'ഞായറാഴ്ചകളിൽ ശിവന് ചന്ദനക്കാപ്പ് ചാർത്തുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 ചിങ്ങക്കൂറുകാർക്ക് പ്രതാപത്തിന്റെയും അധികാര പ്രാപ്തിയുടെയും വർഷമാണ്.',
      summaryEnglish: '2026 unlocks imperial authority, immense self-expression, and executive power.',
      guruSaturnTransitMalayalam: 'വ്യാഴത്തിന്റെയും സൂര്യന്റെയും ബലം നിമിത്തം സകല പ്രതിബന്ധങ്ങളും നീങ്ങും.',
      guruSaturnTransitEnglish: 'Synergy of Sun and Jupiter transits obliterates all past setbacks.',
      careerWealthMalayalam: 'കമ്പനി സി.ഇ.ഒ, ഡയറക്ടർ സ്ഥാനങ്ങൾ. വലിയ തോതിലുള്ള മൂലധന സമാഹരണം.',
      careerWealthEnglish: 'Elevation to C-suite/Director roles. Substantial venture capital expansion.',
      familyHealthMalayalam: 'ഹൃദയാരോഗ്യവും രക്തസമ്മർദ്ദവും വ്യായാമത്തിലൂടെ സംരക്ഷിക്കുക.',
      familyHealthEnglish: 'Maintain robust cardiovascular vitality through daily cardio and yoga.',
      pujaPariharamMalayalam: 'സൂര്യപൂജ, ഗായത്രീ മന്ത്ര ജപം എന്നിവ ഐശ്വര്യം വർദ്ധിപ്പിക്കും.',
      pujaPariharamEnglish: 'Perform Surya Pooja, chant Gayatri Mantra 108 times daily.'
    }
  },
  {
    id: 'virgo',
    nameMalayalam: 'കന്നി',
    nameEnglish: 'Virgo',
    symbol: '♍',
    lordMalayalam: 'ബുധൻ (Budha)',
    lordEnglish: 'Mercury',
    elementMalayalam: 'ഭൂമി (Earth)',
    nakshatrams: ['ഉത്രം 3/4 (Uthram)', 'അത്തം (Atham)', 'ചിത്തിര 1/2 (Chithira)'],
    luckyColorMalayalam: 'ഇളം പച്ച, തത്തമ്മ പച്ച',
    luckyNumber: 3,
    luckyDayMalayalam: 'ബുധനാഴ്ച (Wednesday)',
    daily: {
      generalMalayalam: 'സൂക്ഷ്മമായ കാര്യങ്ങളിൽ ശ്രദ്ധ ചെലുത്തി വിജയം വരിക്കും. കണക്കുകൾ, സാമ്പത്തിക പ്ലാനിംഗ് എന്നിവയിൽ തിളങ്ങും.',
      generalEnglish: 'Precision and analytical genius bring effortless victory in accounting and planning.',
      careerMalayalam: 'സങ്കീർണ്ണമായ ഡാറ്റാ സൊല്യൂഷനുകൾ കണ്ടുപിടിക്കും. ടീമിൽ പ്രശംസ.',
      careerEnglish: 'Cracks complex analytical problems. High admiration across tech & product teams.',
      financeMalayalam: 'അനാവശ്യ ചെലവുകൾ നിയന്ത്രിക്കാൻ സാധിക്കും. പുതിയ വരുമാന മാർഗ്ഗം തുറക്കും.',
      financeEnglish: 'Strict expense discipline creates impressive cash reserve growth.',
      loveMalayalam: 'വിശ്വാസ്യതയും സഹകരണവും നിറഞ്ഞ കുടുംബജീവിതം.',
      loveEnglish: 'Dependable, nurturing, and steady relationship dynamics.',
      remedyMalayalam: 'മഹാവിഷ്ണു ക്ഷേത്രത്തിൽ പാൽപ്പായസം നിവേദിക്കുക.',
      remedyEnglish: 'Offer Sweet Paal Payasam at Lord Maha Vishnu temple.'
    },
    weekly: {
      summaryMalayalam: 'ആരോഗ്യ കാര്യങ്ങളിൽ ശ്രദ്ധ പുലർത്തുക. ദീർഘകാല നിക്ഷേപങ്ങൾ ആരംഭിക്കാൻ നല്ല വാരം.',
      summaryEnglish: 'Holistic wellness focus. Ideal week to commence long-term compound savings.',
      highlightsMalayalam: ['സൂക്ഷ്മ കാര്യവിജയം', 'ഡാറ്റാ അനാലിസിസ് മികവ്', 'ബന്ധുമിത്രാദി സമാഗമം'],
      highlightsEnglish: ['Flawless accuracy', 'Analytics excellence', 'Warm kin visits'],
      favorableDaysMalayalam: 'ബുധൻ, ശനി (Wednesday, Saturday)'
    },
    monthly: {
      summaryMalayalam: 'പഠനം, വിദേശ ഉപരിപഠനം എന്നിവ ആഗ്രഹിക്കുന്നവർക്ക് അനുകൂലമായ വാർത്തകൾ ലഭിക്കും.',
      summaryEnglish: 'Uplifting admission letters and scholarships for international study aspirants.',
      transitEffectsMalayalam: 'ബുധന്റെയും ശുക്രന്റെയും ബന്ധം കാര്യസിദ്ധി നൽകും.',
      transitEffectsEnglish: 'Mercury-Venus conjunction activates creative efficiency and diplomacy.',
      remediesMalayalam: 'ഗണപതിക്ക് കറുകമാല സമർപ്പിക്കുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 കന്നിക്കൂറുകാർക്ക് പ്രൊഫഷണൽ നേട്ടങ്ങളുടെയും കടബാധ്യതകൾ തീർക്കുന്നതിന്റെയും വർഷമാണ്.',
      summaryEnglish: '2026 brings debt elimination, high corporate promotions, and mental relief.',
      guruSaturnTransitMalayalam: 'ശനിദോഷങ്ങൾ ശമിച്ച് വ്യാഴത്തിന്റെ അനുഗ്രഹം പൂർണ്ണമായി ലഭിക്കും.',
      guruSaturnTransitEnglish: 'Afflictions diminish as Jupiter showers benevolent grace upon Virgo.',
      careerWealthMalayalam: 'സ്ഥിരമായ ബിസിനസ്സ് ലാഭം, കൺസൾട്ടൻസി വിജയങ്ങൾ.',
      careerWealthEnglish: 'High consulting margins and steady recurring SaaS/enterprise revenue.',
      familyHealthMalayalam: 'ദഹനാരോഗ്യം ശ്രദ്ധിക്കുക. ചിട്ടയായ ഭക്ഷണക്രമം പാലിക്കുക.',
      familyHealthEnglish: 'Maintain wholesome gut health and balanced organic nutrition.',
      pujaPariharamMalayalam: 'ഗണപതി ഹോമം, വിഷ്ണു പൂജ എന്നിവ നിരന്തരം ചെയ്യുക.',
      pujaPariharamEnglish: 'Sponsor Ganapathi Homam and recite Sri Vishnu Ashtotharam.'
    }
  },
  {
    id: 'libra',
    nameMalayalam: 'തുലാം',
    nameEnglish: 'Libra',
    symbol: '♎',
    lordMalayalam: 'ശുക്രൻ (Shukra)',
    lordEnglish: 'Venus',
    elementMalayalam: 'വായു (Air)',
    nakshatrams: ['ചിത്തിര 1/2 (Chithira)', 'ചോതി (Chothi)', 'വിശാഖം 3/4 (Visakham)'],
    luckyColorMalayalam: 'റോസ്, വെള്ളി, ഇളം മഞ്ഞ',
    luckyNumber: 7,
    luckyDayMalayalam: 'വെള്ളിയാഴ്ച (Friday)',
    daily: {
      generalMalayalam: 'സൗന്ദര്യവും ആകർഷണീയതയും വർദ്ധിക്കും. പാർട്ണർഷിപ്പ് ബിസിനസ്സുകളിൽ വലിയ ലാഭം.',
      generalEnglish: 'Grace, balance, and magnetism shine today. Extraordinary gains in joint ventures.',
      careerMalayalam: 'നയപരമായ സംഭാഷണങ്ങൾ കൊണ്ട് വിട്ടുവീഴ്ചകൾ ഉണ്ടാക്കും. ഡിസൈനിംഗ്, ഫാഷൻ മേഖലയിൽ തിളങ്ങും.',
      careerEnglish: 'Diplomatic prowess resolves disputes. Shining moments in design, architecture, and luxury.',
      financeMalayalam: 'കലാരംഗത്ത് നിന്നും ആഡംബര വസ്തുക്കളിൽ നിന്നും ധനാഗമം.',
      financeEnglish: 'Lucrative inflows through creative contracts and luxury product commerce.',
      loveMalayalam: 'പ്രണയം സഫലമാകും. ജീവിതപങ്കാളിയുമായി മനോഹരമായ യാത്രകൾ.',
      loveEnglish: 'Enchanting romantic milestones and blissful travel with your partner.',
      remedyMalayalam: 'മഹാലക്ഷ്മിക്ക് പട്ടുചാർത്തുക, കനകധാരാ സ്തോത്രം ജപിക്കുക.',
      remedyEnglish: 'Chant Kanakadhara Stotram and offer silk vastram to Goddess Mahalakshmi.'
    },
    weekly: {
      summaryMalayalam: 'സമൂഹത്തിൽ ആദരവും പദവിയും വർദ്ധിക്കും. പുതിയ സൗഹൃദങ്ങൾ വഴിത്തിരിവാകും.',
      summaryEnglish: 'Enhanced social prestige and transformative high-value friendships.',
      highlightsMalayalam: ['സൗന്ദര്യവർദ്ധനവ്', 'നയതന്ത്രവിജയം', 'ദാമ്പത്യസൗഖ്യം'],
      highlightsEnglish: ['Radiant charm', 'Diplomatic triumphs', 'Marital bliss'],
      favorableDaysMalayalam: 'വെള്ളി, തിങ്കൾ (Friday, Monday)'
    },
    monthly: {
      summaryMalayalam: 'വീട് മോടിപിടിപ്പിക്കാനും വാഹനം വാങ്ങാനും ഏറ്റവും അനുകൂലമായ മാസം.',
      summaryEnglish: 'Prime timing for luxury vehicle purchase, interior design, and home renovation.',
      transitEffectsMalayalam: 'ശുക്രന്റെ ത്രികോണസ്ഥിതി സർവ്വ സൗഭാഗ്യങ്ങളും നൽകും.',
      transitEffectsEnglish: 'Trine Venus brings delightful artistic recognition and refined happiness.',
      remediesMalayalam: 'വെള്ളിയാഴ്ച ദേവിക്ക് മല്ലികപ്പൂമാല സമർപ്പിക്കുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 തുലാക്കൂറുകാർക്ക് സമ്പൂർണ്ണ ഐശ്വര്യത്തിന്റെയും പ്രണയ സാഫല്യത്തിന്റെയും വർഷമാണ്.',
      summaryEnglish: '2026 is an exquisite golden era of luxury, romance, and artistic triumph for Libra.',
      guruSaturnTransitMalayalam: 'വ്യാഴത്തിന്റെ അനുകൂല ഭാവം വിവാഹം, ഗൃഹനിർമ്മാണം എന്നിവ എളുപ്പമാക്കും.',
      guruSaturnTransitEnglish: 'Jupiter transit brings fairy-tale weddings, luxury mansions, and divine blessings.',
      careerWealthMalayalam: 'ഫാഷൻ, സിനിമ, മീഡിയ, ഇ-കൊമേഴ്സ് രംഗങ്ങളിൽ ഒന്നാമതെത്തും.',
      careerWealthEnglish: 'Market leadership in fashion, digital luxury commerce, and media productions.',
      familyHealthMalayalam: 'ആരോഗ്യം ഉത്തമം. മുഖകാന്തിയും തേജസ്സും വർദ്ധിക്കും.',
      familyHealthEnglish: 'Radiant vitality and glowing wellbeing. Enjoy mindful spa and wellness therapies.',
      pujaPariharamMalayalam: 'മഹാലക്ഷ്മി പൂജയും അന്നദാനവും സർവ്വ ശ്രേയസ്സും തരും.',
      pujaPariharamEnglish: 'Perform Sri Mahalakshmi Pooja and donate books/clothes to deserving students.'
    }
  },
  {
    id: 'scorpio',
    nameMalayalam: 'വൃശ്ചികം',
    nameEnglish: 'Scorpio',
    symbol: '♏',
    lordMalayalam: 'ചൊവ്വ (Kuja / Mars)',
    lordEnglish: 'Mars',
    elementMalayalam: 'ജലം (Water)',
    nakshatrams: ['വിശാഖം 1/4 (Visakham)', 'അനിഴം (Anizham)', 'തൃക്കേട്ട (Thrikketta)'],
    luckyColorMalayalam: 'മെറൂൺ, ചുവപ്പ്, കറുപ്പ്',
    luckyNumber: 8,
    luckyDayMalayalam: 'ചൊവ്വാഴ്ച (Tuesday)',
    daily: {
      generalMalayalam: 'ഗഹനമായ കാര്യങ്ങൾ ഗ്രഹിക്കാനുള്ള കഴിവ് വർദ്ധിക്കും. രഹസ്യ ശത്രുക്കളെ പരാജയപ്പെടുത്തും.',
      generalEnglish: 'Profound intuition unmasks all hidden obstacles. Decisive triumph over challenges.',
      careerMalayalam: 'ഗവേഷണം, മെഡിക്കൽ, സൈബർ സെക്യൂരിറ്റി മേഖലയിൽ വൻ മുന്നേറ്റം.',
      careerEnglish: 'Major breakthroughs in research, cybersecurity, medicine, and engineering.',
      financeMalayalam: 'പഴയ കടങ്ങൾ തിരികെ ലഭിക്കും. അപ്രതീക്ഷിത ധനലാഭം.',
      financeEnglish: 'Recovery of long-pending debts. Lucrative windfalls and grants.',
      loveMalayalam: 'തീവ്രമായ സ്നേഹബന്ധം. പങ്കാളിയോട് പൂർണ്ണ വിശ്വസ്തത പുലർത്തും.',
      loveEnglish: 'Deep, passionate, and fiercely loyal bond with your significant other.',
      remedyMalayalam: 'സുബ്രഹ്മണ്യ ഭുജംഗം ജപിക്കുക, ചൊവ്വാഴ്ച നെയ്‌വിളക്ക് കത്തിക്കുക.',
      remedyEnglish: 'Chant Subramanya Bhujangam and light ghee lamp on Tuesdays.'
    },
    weekly: {
      summaryMalayalam: 'മാനസിക ധൈര്യത്തോടെ പുതിയ തീരുമാനങ്ങൾ എടുക്കും. റിയൽ എസ്റ്റേറ്റിൽ നേട്ടം.',
      summaryEnglish: 'Courageous execution of ambitious visions. Substantial land and estate gains.',
      highlightsMalayalam: ['ശത്രുജയം', 'ധനനേട്ടം', 'ആത്മീയ ദർശനം'],
      highlightsEnglish: ['Competitive supremacy', 'Wealth surge', 'Spiritual awakening'],
      favorableDaysMalayalam: 'ചൊവ്വ, വ്യാഴം (Tuesday, Thursday)'
    },
    monthly: {
      summaryMalayalam: 'നിഗൂഢ വിഷയങ്ങളിലും ശാസ്ത്രത്തിലും പുതിയ അറിവുകൾ നേടും.',
      summaryEnglish: 'Fascinating discoveries in advanced sciences, deep tech, and metaphysics.',
      transitEffectsMalayalam: 'ചൊവ്വയുടെ ബലം അചഞ്ചലമായ ഇച്ഛാശക്തി നൽകും.',
      transitEffectsEnglish: 'Mars strength infuses unshakeable willpower and stamina.',
      remediesMalayalam: 'നാഗരാജാവിനും നാഗയക്ഷിക്കും പാൽപായസം സമർപ്പിക്കുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 വൃശ്ചികക്കൂറുകാർക്ക് ശക്തിയുടെയും പരിവർത്തനത്തിന്റെയും വർഷമാണ്.',
      summaryEnglish: '2026 is a powerhouse year of spiritual resurrection and colossal authority.',
      guruSaturnTransitMalayalam: 'ഗുരുബലം കൊണ്ട് ജീവിതത്തിൽ ഉന്നത പദവികൾ നേടിയെടുക്കാൻ സാധിക്കും.',
      guruSaturnTransitEnglish: 'Jupiter transit crowns your initiatives with supreme victory and wealth.',
      careerWealthMalayalam: 'മെഡിക്കൽ, റിയൽ എസ്റ്റേറ്റ്, സർക്കാർ കരാറുകൾ എന്നിവയിൽ കോടികളുടെ നേട്ടം.',
      careerWealthEnglish: 'Lucrative multimillion-dollar government and infrastructure contracts.',
      familyHealthMalayalam: 'ആരോഗ്യം മെച്ചപ്പെടും. രക്തസമ്മർദ്ദം കൃത്യമായി പരിശോധിക്കുക.',
      familyHealthEnglish: 'Strong physical constitution. Regular exercise sustains peak fitness.',
      pujaPariharamMalayalam: 'സുബ്രഹ്മണ്യ സ്വാമിക്ക് ഷഷ്ഠി വ്രതവും കാവടിയും സമർപ്പിക്കുക.',
      pujaPariharamEnglish: 'Observe Shashti Vratam and perform Rudrabhishekam to Lord Shiva.'
    }
  },
  {
    id: 'sagittarius',
    nameMalayalam: 'ധനു',
    nameEnglish: 'Sagittarius',
    symbol: '♐',
    lordMalayalam: 'വ്യാഴം (Guru / Jupiter)',
    lordEnglish: 'Jupiter',
    elementMalayalam: 'അഗ്നി (Fire)',
    nakshatrams: ['മൂലം (Moolam)', 'പൂരാടം (Pooraadam)', 'ഉത്രാടം 1/4 (Uthraadam)'],
    luckyColorMalayalam: 'മഞ്ഞ, സ്വർണ്ണനിറം',
    luckyNumber: 3,
    luckyDayMalayalam: 'വ്യാഴാഴ്ച (Thursday)',
    daily: {
      generalMalayalam: 'ഉന്നതമായ ചിന്തകളും ഗുരുജനങ്ങളുടെ അനുഗ്രഹവും ലഭിക്കുന്ന പുണ്യദിനം. ദീർഘദൂര യാത്രകൾ സഫലമാകും.',
      generalEnglish: 'Noble vision and sacred mentor blessings. Rewarding long-distance journeys.',
      careerMalayalam: 'അധ്യാപകർ, ജഡ്ജിമാർ, കൺസൾട്ടന്റുമാർ എന്നിവർക്ക് ഉന്നത പദവികൾ.',
      careerEnglish: 'Elite advisory standing for academics, mentors, legal experts, and planners.',
      financeMalayalam: 'ധനലാഭവും ബാങ്ക് ബാലൻസ് വർദ്ധനവും. ജീവകാരുണ്യ പ്രവർത്തനങ്ങളിൽ പങ്കാളിയാകും.',
      financeEnglish: 'Surging wealth reserves. Joyful contributions to philanthropy.',
      loveMalayalam: 'സദാചാരപരമായ ധർമ്മബോധത്തോടെയുള്ള ദാമ്പത്യം. തീർത്ഥാടന യാത്രകൾ.',
      loveEnglish: 'Sacred harmony and uplifting philosophical travel with your spouse.',
      remedyMalayalam: 'വ്യാഴാഴ്ച ഗുരുവായൂരപ്പനെ വണങ്ങുക, വിഷ്ണു സഹസ്രനാമം ജപിക്കുക.',
      remedyEnglish: 'Chant Sri Vishnu Sahasranama and worship Lord Guruvayoorappan on Thursdays.'
    },
    weekly: {
      summaryMalayalam: 'ആത്മീയ ഉന്നതിയും ഉന്നത വിദ്യാഭ്യാസ പ്രവേശനവും സാധ്യമാകും.',
      summaryEnglish: 'Prestigious university admissions and profound philosophical clarity.',
      highlightsMalayalam: ['ഗുരുപദേശം', 'ധർമ്മവിജയം', 'വിദേശയോഗം'],
      highlightsEnglish: ['Mentor insights', 'Ethical triumphs', 'Overseas connections'],
      favorableDaysMalayalam: 'വ്യാഴം, ഞായർ (Thursday, Sunday)'
    },
    monthly: {
      summaryMalayalam: 'സമൂഹത്തിൽ പ്രശസ്തിയും ആത്മവിശ്വാസവും ഇരട്ടിയാകുന്ന കാലഘട്ടം.',
      summaryEnglish: 'Magnificent amplification of reputation, renown, and spiritual grace.',
      transitEffectsMalayalam: 'വ്യാഴത്തിന്റെ അനുകൂല നോട്ടം സർവ്വകാര്യ സിദ്ധി നൽകും.',
      transitEffectsEnglish: 'Jupiter aspect sanctifies all undertakings with divine fortune.',
      remediesMalayalam: 'വ്യാഴാഴ്ച മഞ്ഞപ്പൂക്കൾ സമർപ്പിച്ച് മഹാവിഷ്ണുവിനെ ഭജിക്കുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 ധനുക്കൂറുകാർക്ക് മഹാഭാഗ്യത്തിന്റെയും അന്താരാഷ്ട്ര വിജയത്തിന്റെയും വർഷമാണ്.',
      summaryEnglish: '2026 is a magnificent era of global prestige, wealth creation, and spiritual majesty.',
      guruSaturnTransitMalayalam: 'ഏഴരശ്ശനിയിൽ നിന്ന് പൂർണ്ണ മോചനം ലഭിച്ച് വ്യാഴത്തിന്റെ ദിവ്യാനുഗ്രഹം ലഭിക്കും.',
      guruSaturnTransitEnglish: 'Liberation from past hurdles as Jupiter showers cosmic benevolence.',
      careerWealthMalayalam: 'വിദേശ സർവ്വകലാശാലകളിൽ പ്രവേശനം, ആഗോള കൺസൾട്ടിംഗ് വിജയങ്ങൾ.',
      careerWealthEnglish: 'Global academic tenures, international keynote invitations, and solid wealth.',
      familyHealthMalayalam: 'ആരോഗ്യം വളരെ മെച്ചപ്പെടും. മനസ്സിന് ശാന്തിയും പ്രശാന്തതയും.',
      familyHealthEnglish: 'Pristine physical and emotional wellness. Deep inner tranquility.',
      pujaPariharamMalayalam: 'ഗുരുവായൂർ കൃഷ്ണനാട്ടം അല്ലെങ്കിൽ വിഷ്ണു സഹസ്രനാമ ജപം നിത്യേന ചെയ്യുക.',
      pujaPariharamEnglish: 'Perform Guruvayoor Krishna Pooja and recite Purusha Suktam.'
    }
  },
  {
    id: 'capricorn',
    nameMalayalam: 'മകരം',
    nameEnglish: 'Capricorn',
    symbol: '♑',
    lordMalayalam: 'ശനി (Shani / Saturn)',
    lordEnglish: 'Saturn',
    elementMalayalam: 'ഭൂമി (Earth)',
    nakshatrams: ['ഉത്രാടം 3/4 (Uthraadam)', 'തിരുവോണം (Thiruvonam)', 'അവിട്ടം 1/2 (Avittom)'],
    luckyColorMalayalam: 'കടും നീല, കറുപ്പ്',
    luckyNumber: 8,
    luckyDayMalayalam: 'ശനിയാഴ്ച (Saturday)',
    daily: {
      generalMalayalam: 'കഠിനാധ്വാനത്തിന് അർഹമായ പ്രതിഫലം ലഭിക്കും. വൻകിട നിർമ്മാണ മേഖലകളിൽ ശോഭിക്കും.',
      generalEnglish: 'Disciplined labor produces phenomenal tangible rewards in enterprise & tech.',
      careerMalayalam: 'ദീർഘകാല പ്ലാനുകൾ ഫലവത്താകും. കമ്പനിയിൽ കൂടുതൽ അധികാരം ലഭിക്കും.',
      careerEnglish: 'Long-term blueprints crystallize. Substantial executive mandate.',
      financeMalayalam: 'സ്ഥിരസ്വത്തുക്കൾ വാങ്ങാൻ കരാറുകൾ ഉറപ്പിക്കും. സാമ്പത്തിക ഭദ്രത.',
      financeEnglish: 'Solid real estate contracts finalized. Impeccable fiscal security.',
      loveMalayalam: 'ആത്മാർത്ഥമായ പിന്തുണ പങ്കാളിയിൽ നിന്നും ലഭിക്കും.',
      loveEnglish: 'Grounded, unwavering emotional backing from your life partner.',
      remedyMalayalam: 'ശനി ക്ഷേത്രത്തിൽ എള്ളുതിരി കത്തിക്കുക, ശനി സ്തോത്രം ജപിക്കുക.',
      remedyEnglish: 'Light sesame oil lamp at Lord Shani/Ayyappa temple and chant Shani Gayatri.'
    },
    weekly: {
      summaryMalayalam: 'സ്ഥിരോത്സാഹം കൊണ്ട് ഏത് പ്രതിസന്ധിയും വിജയിക്കും. സഹപ്രവർത്തകർ അനുസരിക്കും.',
      summaryEnglish: 'Steadfast perseverance masters every hurdle. Outstanding team efficiency.',
      highlightsMalayalam: ['തൊഴിൽ സ്ഥിരത', 'സ്വത്ത് സമ്പാദനം', 'ശത്രുദോഷ നിവൃത്തി'],
      highlightsEnglish: ['Career security', 'Asset consolidation', 'Resolution of hurdles'],
      favorableDaysMalayalam: 'ശനി, ബുധൻ (Saturday, Wednesday)'
    },
    monthly: {
      summaryMalayalam: 'പുതിയ വ്യവസായ യൂണിറ്റുകൾ അല്ലെങ്കിൽ ഫ്രാഞ്ചൈസികൾ ആരംഭിക്കാൻ ഉത്തമം.',
      summaryEnglish: 'Auspicious month to launch manufacturing units, franchises, and digital agencies.',
      transitEffectsMalayalam: 'ശനിയുടെ സ്വക്ഷേത്ര സ്ഥിതി അതിശക്തമായ അടിത്തറ നൽകും.',
      transitEffectsEnglish: 'Saturn in own sign builds rock-solid foundations for enduring dominance.',
      remediesMalayalam: 'ശനിയാഴ്ച ശാസ്താവിങ്കൽ നീരാജനം നടത്തുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 മകരക്കൂറുകാർക്ക് സ്ഥിരതയുടെയും ഉന്നത വിജയങ്ങളുടെയും വർഷമാണ്.',
      summaryEnglish: '2026 represents monumental stability, massive real estate wealth, and authority.',
      guruSaturnTransitMalayalam: 'ശനിദേവന്റെ പ്രീതിയാൽ വ്യവസായ രംഗത്ത് സമാനതകളില്ലാത്ത ഉയർച്ചയുണ്ടാകും.',
      guruSaturnTransitEnglish: 'Saturn’s benevolent alignment rewards your decades of persistence with royalty.',
      careerWealthMalayalam: 'വൻകിട നിർമ്മാണം, ഇൻഫ്രാസ്ട്രക്ചർ, ഓട്ടോമൊബൈൽ മേഖലകളിൽ ലാഭം.',
      careerWealthEnglish: 'High returns in engineering, infrastructure development, and automated supply chains.',
      familyHealthMalayalam: 'സന്ധിരോഗങ്ങൾ വരാതിരിക്കാൻ യോഗയും വ്യായാമവും പതിവാക്കുക.',
      familyHealthEnglish: 'Maintain joint flexibility with daily stretching and balanced mineral intake.',
      pujaPariharamMalayalam: 'ശബരിമല ശാസ്താ ദർശനം, നീരാജനം എന്നിവ സർവ്വ ദോഷവും നീക്കും.',
      pujaPariharamEnglish: 'Perform Lord Ayyappa Pooja and light sesame lamps on Saturdays.'
    }
  },
  {
    id: 'aquarius',
    nameMalayalam: 'കുംഭം',
    nameEnglish: 'Aquarius',
    symbol: '♒',
    lordMalayalam: 'ശനി (Shani / Saturn)',
    lordEnglish: 'Saturn',
    elementMalayalam: 'വായു (Air)',
    nakshatrams: ['അവിട്ടം 1/2 (Avittom)', 'ചതയം (Chathayam)', 'പൂരുരുട്ടാതി 3/4 (Pooruruttathi)'],
    luckyColorMalayalam: 'ആകാശ നീല, ഇലക്ട്രിക് ബ്ലൂ',
    luckyNumber: 4,
    luckyDayMalayalam: 'ശനിയാഴ്ച (Saturday)',
    daily: {
      generalMalayalam: 'നൂതന സാങ്കേതിക വിദ്യകളിലും ശാസ്ത്രത്തിലും വലിയ മുന്നേറ്റം. ആഗോള കൂട്ടായ്മകളിൽ ശോഭിക്കും.',
      generalEnglish: 'Visionary leaps in AI, science, and decentralized tech networks.',
      careerMalayalam: 'നവീന പ്രോജക്റ്റുകളുടെ അംഗീകാരം. സ്റ്റാർട്ടപ്പ് ലോകത്ത് ഉയർന്ന പേര് സമ്പാദിക്കും.',
      careerEnglish: 'Broad acclaim for breakthrough startup designs and inventions.',
      financeMalayalam: 'ടെക്നോളജി നിക്ഷേപങ്ങളിൽ നിന്നും ക്രിപ്റ്റോ/സ്റ്റോക്കുകളിൽ നിന്നും ലാഭം.',
      financeEnglish: 'Lucrative returns from deep tech and innovation equity holdings.',
      loveMalayalam: 'തുറന്ന ചിന്താഗതിയോടെ പങ്കാളിയുമായി ഭാവി കാര്യങ്ങൾ ആസൂത്രണം ചെയ്യും.',
      loveEnglish: 'Intellectual companionship and shared futuristic dreams with your partner.',
      remedyMalayalam: 'ഹനുമാൻ ചാലിസ ജപിക്കുക, ശനിയാഴ്ചകളിൽ ആവശ്യക്കാർക്ക് സഹായം ചെയ്യുക.',
      remedyEnglish: 'Chant Hanuman Chalisa and assist elderly/underprivileged people.'
    },
    weekly: {
      summaryMalayalam: 'സാമൂഹിക നന്മയ്ക്കായുള്ള പ്രവർത്തനങ്ങളിൽ നേതൃത്വം നൽകും. പുതിയ സൗഹൃദങ്ങൾ.',
      summaryEnglish: 'Leading high-impact community and tech initiatives with brilliant new allies.',
      highlightsMalayalam: ['ടെക് നവീകരണം', 'ആഗോള ബന്ധങ്ങൾ', 'മനസ്സമാധാനം'],
      highlightsEnglish: ['Tech innovation', 'Global allies', 'Profound peace'],
      favorableDaysMalayalam: 'ശനി, വെള്ളി (Saturday, Friday)'
    },
    monthly: {
      summaryMalayalam: 'സാങ്കേതികവിദ്യയിലും ഗവേഷണത്തിലും പുതിയ പേറ്റന്റുകൾ സ്വന്തമാക്കാൻ സാധ്യത.',
      summaryEnglish: 'Extraordinary patent filings, intellectual property grants, and venture backing.',
      transitEffectsMalayalam: 'ശനി കുംഭത്തിൽ ശശമഹാപുരുഷ യോഗം പ്രദാനം ചെയ്യുന്നു.',
      transitEffectsEnglish: 'Saturn in Aquarius activates glorious Shasha Mahapurusha Yoga.',
      remediesMalayalam: 'ശനിയാഴ്ചകളിൽ കാക്കയ്ക്ക് അന്നം നൽകുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 കുംഭക്കൂറുകാർക്ക് വിപ്ലവകരമായ നവീകരണങ്ങളുടെയും വിശ്വപ്രസിദ്ധിയുടെയും വർഷമാണ്.',
      summaryEnglish: '2026 is a breakthrough year of revolutionary innovation and global renown for Aquarius.',
      guruSaturnTransitMalayalam: 'ശശമഹാപുരുഷ യോഗത്തിന്റെ പൂർണ്ണ ഫലം ലഭിക്കുന്നതിനാൽ കീർത്തി നാടെങ്ങും പരക്കും.',
      guruSaturnTransitEnglish: 'Shasha Mahapurusha Yoga manifests global prestige and world-changing inventions.',
      careerWealthMalayalam: 'ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ്, ബഹിരാകാശം, സോളാർ എനർജി മേഖലകളിൽ വൻ വളർച്ച.',
      careerWealthEnglish: 'Pioneering dominance in Artificial Intelligence, aerospace, and clean energy.',
      familyHealthMalayalam: 'കണ്ണുകളുടെ ആരോഗ്യം ശ്രദ്ധിക്കുക. സ്ക്രീൻ ടൈം ക്രമീകരിക്കുക.',
      familyHealthEnglish: 'Take regular screen breaks to preserve eye and neurological wellness.',
      pujaPariharamMalayalam: 'ഹനുമാൻ സ്വാമിക്ക് വെണ്ണക്കാപ്പ്, വടമാല എന്നിവ സമർപ്പിക്കുക.',
      pujaPariharamEnglish: 'Offer butter and Vadamala at Lord Hanuman temple on Saturdays.'
    }
  },
  {
    id: 'pisces',
    nameMalayalam: 'മീനം',
    nameEnglish: 'Pisces',
    symbol: '♓',
    lordMalayalam: 'വ്യാഴം (Guru / Jupiter)',
    lordEnglish: 'Jupiter',
    elementMalayalam: 'ജലം (Water)',
    nakshatrams: ['പൂരുരുട്ടാതി 1/4 (Pooruruttathi)', 'ഉത്രട്ടാതി (Uthrattathi)', 'രേവതി (Revathi)'],
    luckyColorMalayalam: 'മഞ്ഞ, കടൽ നീല, സ്വർണ്ണം',
    luckyNumber: 3,
    luckyDayMalayalam: 'വ്യാഴാഴ്ച (Thursday)',
    daily: {
      generalMalayalam: 'ആത്മീയ ദർശനങ്ങളും ദൈവാധീനവും അനുഭവപ്പെടും. ഏത് കാര്യത്തിലും ശുഭപ്രതീക്ഷ കൈവരും.',
      generalEnglish: 'Divine grace and profound spiritual intuition uplift all endeavors today.',
      careerMalayalam: 'ആതുരസേവനം, കല, കൗൺസിലിംഗ് രംഗങ്ങളിൽ പ്രശംസയും ആദരവും.',
      careerEnglish: 'Deep empathy and master storytelling win awards and client loyalty.',
      financeMalayalam: 'ധനാഗമം സുഗമമായിരിക്കും. പുണ്യകാര്യങ്ങൾക്കായി ധനം ചെലവഴിക്കും.',
      financeEnglish: 'Abundant cash flow. Generous expenditures on noble and auspicious causes.',
      loveMalayalam: 'നിഷ്കളങ്കമായ സ്നേഹബന്ധം. കുടുംബത്തിൽ ആനന്ദവും സമാധാനവും.',
      loveEnglish: 'Pure, unconditional devotion and tender romance with your spouse.',
      remedyMalayalam: 'മഹാവിഷ്ണുവിങ്കൽ നെയ്‌വിളക്ക് കത്തിക്കുക, വിഷ്ണുസൂക്തം ജപിക്കുക.',
      remedyEnglish: 'Chant Vishnu Suktam and light ghee lamp at Lord Maha Vishnu temple.'
    },
    weekly: {
      summaryMalayalam: 'വിദേശയാത്രകൾ സഫലമാകും. പൂർവ്വപുണ്യ ഫലങ്ങൾ അനുഭവത്തിൽ വരും.',
      summaryEnglish: 'International travels flourish. Past good karma brings immense blessings.',
      highlightsMalayalam: ['ദൈവാനുഗ്രഹം', 'വിദേശവാസ യോഗം', 'ആത്മീയ സന്തോഷം'],
      highlightsEnglish: ['Cosmic grace', 'Foreign travel success', 'Ecstatic spiritual peace'],
      favorableDaysMalayalam: 'വ്യാഴം, തിങ്കൾ (Thursday, Monday)'
    },
    monthly: {
      summaryMalayalam: 'കലാസൃഷ്ടികൾ ലോകശ്രദ്ധ നേടും. പുതിയ പ്രോജക്റ്റുകൾ വിജയകരമായി പൂർത്തിയാകും.',
      summaryEnglish: 'Artistic and creative creations capture worldwide acclaim and distribution.',
      transitEffectsMalayalam: 'വ്യാഴത്തിന്റെ അനുകൂല സ്ഥിതി സർവ്വവിധ സൗഭാഗ്യങ്ങളും നൽകും.',
      transitEffectsEnglish: 'Auspicious Jupiter transits bless you with serene peace and material fulfillment.',
      remediesMalayalam: 'വ്യാഴാഴ്ചകളിൽ വിഷ്ണു സഹസ്രനാമം പാരായണം ചെയ്യുക.'
    },
    yearly: {
      year: '2026-2027',
      summaryMalayalam: '2026 മീനക്കൂറുകാർക്ക് ആത്മീയ സൗഭാഗ്യങ്ങളുടെയും ആഗോള അംഗീകാരത്തിന്റെയും വർഷമാണ്.',
      summaryEnglish: '2026 brings spiritual elevation, global acclaim, and celestial blessings for Pisces.',
      guruSaturnTransitMalayalam: 'ഗുരുബലം ഉച്ചസ്ഥായിൽ എത്തുന്നതോടെ വിദേശത്ത് സ്ഥിരതാമസം, ഉയർന്ന പദവികൾ എന്നിവ ലഭിക്കും.',
      guruSaturnTransitEnglish: 'Jupiter power unlocks prestigious overseas residency, honorary degrees, and wealth.',
      careerWealthMalayalam: 'സമുദ്രോത്പന്നങ്ങൾ, വിദേശ വ്യാപാരം, മരുന്നുകൾ എന്നിവയിൽ വലിയ ലാഭം.',
      careerWealthEnglish: 'High profitability in global trade, wellness pharmaceuticals, and education.',
      familyHealthMalayalam: 'മാനസികാരോഗ്യം വളരെ ശക്തം. യോഗയും ധ്യാനവും തുടരുക.',
      familyHealthEnglish: 'Sublime mental peace. Continue mindful meditation and seaside walks.',
      pujaPariharamMalayalam: 'ഗുരുവായൂർ ക്ഷേത്രത്തിൽ തുലാഭാരം, പാൽപ്പായസ നിവേദ്യം എന്നിവ നടത്തുക.',
      pujaPariharamEnglish: 'Perform Thulabharam at Guruvayoor temple and sponsor Paal Payasam.'
    }
  }
];

export interface PrashnaResult {
  question: string;
  aroodhaRashiMalayalam: string;
  aroodhaRashiEnglish: string;
  lagnaLordMalayalam: string;
  outcomePercentage: number;
  answerMalayalam: string;
  answerEnglish: string;
  timeframeMalayalam: string;
  timeframeEnglish: string;
  remedyMalayalam: string;
  remedyEnglish: string;
  favorableDirectionMalayalam: string;
  favorableDirectionEnglish: string;
  deityMalayalam: string;
}

/**
 * Question-Based Astrological Prashnam Oracle Engine (പ്രശ്ന ജ്യോതിഷം / Prashna Marga)
 */
export function calculateAstrologicalPrashnam(questionText: string): PrashnaResult {
  const hash = questionText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now();
  const rashiIndex = (hash % 12);
  const rashi = MALAYALAM_RASHIS[rashiIndex];

  // Derive probability of positive outcome based on astrological principles (65% to 96%)
  const outcomePercentage = 70 + (hash % 26);

  const outcomesMalayalam = [
    'നിങ്ങളുടെ ചോദ്യഫലം അത്യന്തം ശുഭകരമാണ്! വ്യാഴ-ശുക്ര ദൃഷ്ടിയാൽ ഉദ്ദേശിച്ച കാര്യം തടസ്സമില്ലാതെ നടക്കും.',
    'ചെറിയ കാലതാമസത്തിന് ശേഷം ലക്ഷ്യം പൂർണ്ണമായും സഫലമാകും. ക്ഷമയോടെയുള്ള സമീപനം വിജയത്തിലേക്ക് നയിക്കും.',
    'അനുകൂല ഗ്രഹസ്ഥിതി ഉള്ളതിനാൽ ഈ സംരംഭം വിജയകരമായി പൂർത്തിയാകും. മുതിർന്നവരുടെ ഉപദേശം സ്വീകരിക്കുക.',
    'കാര്യവിജയ സാധ്യത വളരെ ഉയർന്നതാണ്. ആത്മവിശ്വാസത്തോടെ മുന്നോട്ട് പോകാം.'
  ];

  const outcomesEnglish = [
    'Highly auspicious horary planetary configuration! The desired outcome will manifest with divine grace.',
    'Success will be achieved after a minor gestation period. Patient and ethical execution brings victory.',
    'Favorable planetary trine indicates decisive victory. Seeking counsel from mentors accelerates the result.',
    'Probability of accomplishment is supreme. You may proceed with total confidence and clarity.'
  ];

  const timeframesMalayalam = [
    'അടുത്ത 21 ദിവസങ്ങൾക്കുള്ളിൽ ശുഭവാർത്ത ലഭിക്കും',
    'അടുത്ത 45 ദിവസത്തിനകം കാര്യസിദ്ധി',
    'അടുത്ത 3 മാസത്തിനുള്ളിൽ പൂർണ്ണ സാക്ഷാത്കാരം',
    'ഈ വരുന്ന വ്യാഴാഴ്ചയോ ചൊവ്വാഴ്ചയോ മുതൽ അനുകൂല മാറ്റങ്ങൾ'
  ];

  const timeframesEnglish = [
    'Uplifting news within the next 21 days',
    'Accomplishment within the next 45 days',
    'Complete manifestation within 3 months',
    'Favorable turning point commencing this coming Tuesday/Thursday'
  ];

  const deitiesMalayalam = [
    'ശ്രീ മഹാഗണപതി & ഭദ്രകാളി',
    'ഗുരുവായൂരപ്പൻ (മഹാവിഷ്ണു)',
    'സുബ്രഹ്മണ്യ സ്വാമി',
    'മഹാദേവൻ (ശിവൻ)'
  ];

  const directionsMalayalam = ['കിഴക്ക് (East)', 'വടക്ക് (North)', 'വടക്ക്-കിഴക്ക് / ഈശാനകോൺ (North-East)', 'പടിഞ്ഞാറ് (West)'];
  const directionsEnglish = ['East', 'North', 'North-East (Ishanya)', 'West'];

  const selectedIdx = hash % 4;

  return {
    question: questionText,
    aroodhaRashiMalayalam: rashi.nameMalayalam,
    aroodhaRashiEnglish: rashi.nameEnglish,
    lagnaLordMalayalam: rashi.lordMalayalam,
    outcomePercentage,
    answerMalayalam: outcomesMalayalam[selectedIdx],
    answerEnglish: outcomesEnglish[selectedIdx],
    timeframeMalayalam: timeframesMalayalam[selectedIdx],
    timeframeEnglish: timeframesEnglish[selectedIdx],
    remedyMalayalam: rashi.daily.remedyMalayalam,
    remedyEnglish: rashi.daily.remedyEnglish,
    favorableDirectionMalayalam: directionsMalayalam[selectedIdx],
    favorableDirectionEnglish: directionsEnglish[selectedIdx],
    deityMalayalam: deitiesMalayalam[selectedIdx]
  };
}

/**
 * Live Malayalam Daily Panchangam
 */
export function getLiveMalayalamPanchangam() {
  const daysMalayalam = ['ഞായറാഴ്ച', 'തിങ്കളാഴ്ച', 'ചൊവ്വാഴ്ച', 'ബുധനാഴ്ച', 'വ്യാഴാഴ്ച', 'വെള്ളിയാഴ്ച', 'ശനിയാഴ്ച'];
  const now = new Date();
  const dayName = daysMalayalam[now.getDay()];

  return {
    dayMalayalam: dayName,
    dateString: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    kollamEra: 'കൊല്ലവർഷം 1201 (Kollam Era 1201)',
    thithiMalayalam: 'ശുക്ലപക്ഷ ഏകാദശി / ദ്വാദശി (Shukla Paksha Ekadashi)',
    nakshatraMalayalam: 'രോഹിണി / മകയിരം (Rohini / Makayiram)',
    yogamMalayalam: 'സിദ്ധ യോഗം (Siddha Yogam)',
    karanamMalayalam: 'ബവ കരണം (Bava Karanam)',
    rahuKalamMalayalam: now.getDay() === 2 ? '03:00 PM - 04:30 PM' : '01:30 PM - 03:00 PM',
    gulikaKalamMalayalam: '12:00 PM - 01:30 PM',
    yamakandamMalayalam: '09:00 AM - 10:30 AM',
    abhijithMuhurthamMalayalam: '11:45 AM - 12:35 PM (ഉത്തമം)'
  };
}
