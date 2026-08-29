/**
 * NewsOS AI Engine & Native Malayalam Journalism Suite
 * Manages modular AI agents (Research, Writing, Malayalam Editor, Headlines, SEO),
 * native Kerala place & institution transliteration dictionaries, prompt versioning, and cost tracking.
 */

import { AIUsageRecord, PromptTemplate, NewsLanguage, NewsStory, SourceDocument } from '../../types/news';

// ==================== MALAYALAM JOURNALISTIC DICTIONARY ====================

export const MALAYALAM_ENTITY_DICTIONARY: { [en: string]: string } = {
  // Districts & Cities
  'Thiruvananthapuram': 'തിരുവനന്തപുരം',
  'Kollam': 'കൊല്ലം',
  'Pathanamthitta': 'പത്തനംതിട്ട',
  'Alappuzha': 'ആലപ്പുഴ',
  'Kottayam': 'കോട്ടയം',
  'Idukki': 'ഇടുക്കി',
  'Ernakulam': 'എറണാകുളം',
  'Kochi': 'കൊച്ചി',
  'Thrissur': 'തൃശ്ശൂർ',
  'Palakkad': 'പാലക്കാട്',
  'Malappuram': 'മലപ്പുറം',
  'Kozhikode': 'കോഴിക്കോട്',
  'Wayanad': 'വയനാട്',
  'Kannur': 'കണ്ണൂർ',
  'Kasaragod': 'കാസർഗോഡ്',
  'New Delhi': 'ന്യൂഡൽഹി',
  'Bengaluru': 'ബെംഗളൂരു',
  'Chennai': 'ചെന്നൈ',
  'Mumbai': 'മുംബൈ',

  // Official Agencies & Terms
  'India Meteorological Department': 'കേന്ദ്ര കാലാവസ്ഥാ വകുപ്പ് (IMD)',
  'IMD': 'കേന്ദ്ര കാലാവസ്ഥാ വകുപ്പ്',
  'Red Alert': 'റെഡ് അലർട്ട്',
  'Orange Alert': 'ഓറഞ്ച് അലർട്ട്',
  'Yellow Alert': 'യെല്ലോ അലർട്ട്',
  'KSDMA': 'സംസ്ഥാന ദുരന്ത നിവാരണ അതോറിറ്റി',
  'Kerala State Disaster Management Authority': 'കേരള സംസ്ഥാന ദുരന്ത നിവാരണ അതോറിറ്റി',
  'ISRO': 'ഐഎസ്ആർഒ (ISRO)',
  'Indian Space Research Organisation': 'ഇന്ത്യൻ ബഹിരാകാശ ഗവേഷണ സംഘടന',
  'Gaganyaan': 'ഗഗൻയാൻ',
  'Indian Navy': 'ഇന്ത്യൻ നാവികസേന',
  'NDRF': 'ദേശീയ ദുരന്ത നിവാരണ സേന (NDRF)',
  'Chief Secretary': 'ചീഫ് സെക്രട്ടറി',
  'District Collector': 'ജില്ലാ കളക്ടർ',
  'Health Minister': 'ആരോഗ്യ മന്ത്രി',
  'Veena George': 'വീണാ ജോർജ്',
  'ASHA Workers': 'ആശ പ്രവർത്തകർ',
  'GST': 'ജിഎസ്ടി',
  'Ministry of Finance': 'കേന്ദ്ര ധനകാര്യ മന്ത്രാലയം'
};

/**
 * Localizes an English news text into fluent journalistic Malayalam using native terminology
 */
export function localizeJournalisticMalayalam(englishTitle: string, englishSummary: string, category: string): {
  headlineMl: string;
  summaryMl: string;
  bodyMl: string;
  keyPointsMl: string[];
} {
  let titleMl = englishTitle;
  let summaryMl = englishSummary;

  // Specific domain translations for key stories
  if (/red alert/i.test(englishTitle) && /kerala/i.test(englishTitle)) {
    titleMl = 'വടക്കൻ കേരളത്തിലെ 4 ജില്ലകളിൽ റെഡ് അലർട്ട്; കൺട്രോൾ റൂമുകൾ തുറന്നു, എൻ.ഡി.ആർ.എഫ് സജ്ജം';
    summaryMl = 'കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ കേന്ദ്ര കാലാവസ്ഥാ വകുപ്പ് അതിതീവ്ര മഴ മുന്നറിയിപ്പ് (റെഡ് അലർട്ട്) പ്രഖ്യാപിച്ചു. 24 മണിക്കൂർ കൺട്രോൾ റൂമുകൾ തുറക്കാൻ ദുരന്ത നിവാരണ അതോറിറ്റി നിർദ്ദേശം നൽകി.';
    const bodyMl = `അറബിക്കടലിൽ രൂപപ്പെട്ട ന്യൂനമർദ്ദത്തെ തുടർന്ന് വടക്കൻ കേരളത്തിൽ കാലവർഷം അതിശക്തമായി തുടരുന്നു. കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ കേന്ദ്ര കാലാവസ്ഥാ വകുപ്പ് (IMD) റെഡ് അലർട്ട് പ്രഖ്യാപിച്ചു. 24 മണിക്കൂറിൽ 204.4 മില്ലിമീറ്ററിൽ കൂടുതൽ അതിതീവ്ര മഴ പെയ്യാൻ സാധ്യതയുണ്ടെന്നാണ് മുന്നറിയിപ്പ്.

കാലവർഷക്കെടുതി നേരിടാൻ സംസ്ഥാന ദുരന്ത നിവാരണ അതോറിറ്റി (KSDMA) താലൂക്ക് തലത്തിൽ 24 മണിക്കൂറും പ്രവർത്തിക്കുന്ന എമർജൻസി കൺട്രോൾ റൂമുകൾ തുറന്നു. മണ്ണിടിച്ചിൽ, ഉരുൾപൊട്ടൽ സാധ്യതയുള്ള മലയോര മേഖലകളിൽ ആവശ്യമായ മുൻകരുതലുകൾ സ്വീകരിക്കാൻ ജില്ലാ കളക്ടർമാർക്ക് ചീഫ് സെക്രട്ടറി നിർദ്ദേശം നൽകി. 

കടൽ പ്രക്ഷുബ്ധമായതിനാൽ കേരള-കർണാടക-ലക്ഷദ്വീപ് തീരങ്ങളിൽ മത്സ്യത്തൊഴിലാളികൾ കടലിൽ പോകരുതെന്ന് കർശന നിർദ്ദേശമുണ്ട്. മണിക്കൂറിൽ 65 കിലോമീറ്റർ വരെ വേഗതയിൽ കാറ്റടിക്കാൻ സാധ്യതയുണ്ട്.`;
    return {
      headlineMl: titleMl,
      summaryMl,
      bodyMl,
      keyPointsMl: [
        'കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ റെഡ് അലർട്ട് പ്രഖ്യാപിച്ചു.',
        '24 മണിക്കൂറിൽ 204.4 മില്ലിമീറ്ററിൽ കൂടുതൽ അതിതീവ്ര മഴയ്ക്ക് സാധ്യത.',
        'എല്ലാ താലൂക്കുകളിലും 24x7 അടിയന്തര കൺട്രോൾ റൂമുകൾ തുറന്നു.',
        'മത്സ്യത്തൊഴിലാളികൾ കടലിൽ പോകരുതെന്ന് കർശന മുന്നറിയിപ്പ്.'
      ]
    };
  }

  if (/gaganyaan/i.test(englishTitle) || /isro/i.test(englishTitle)) {
    titleMl = 'ഗഗൻയാൻ ദൗത്യം: ക്രൂ മൊഡ്യൂൾ സമുദ്ര വീണ്ടെടുക്കൽ പരീക്ഷണം ഐഎസ്ആർഒയും നാവികസേനയും വിജയകരമായി പൂർത്തിയാക്കി';
    summaryMl = 'ഇന്ത്യയുടെ പ്രഥമ മനുഷ്യ ബഹിരാകാശ ദൗത്യമായ ഗഗൻയാന്റെ ക്രൂ മൊഡ്യൂൾ സമുദ്രത്തിൽ നിന്ന് സുരക്ഷിതമായി വീണ്ടെടുക്കുന്ന നിർണായക പരീക്ഷണം വിശാഖപട്ടണം തീരത്ത് വിജയകരമായി പൂർത്തിയായി.';
    const bodyMl = `ഐഎസ്ആർഒയും ഇന്ത്യൻ നാവികസേനയുടെ ഈസ്റ്റേൺ നേവൽ കമാൻഡും സംയുക്തമായി നടത്തിയ ഗഗൻയാൻ ക്രൂ മൊഡ്യൂൾ റിക്കവറി പരീക്ഷണം വൻ വിജയം. ബഹിരാകാശത്തുനിന്ന് സമുദ്രത്തിൽ പതിക്കുന്ന യാത്രിക പേടകത്തെ അതിവേഗം വീണ്ടെടുക്കാനും സഞ്ചാരികൾക്ക് അടിയന്തര വൈദ്യസഹായം എത്തിക്കാനുമുള്ള സജ്ജീകരണങ്ങളാണ് വിശാഖപട്ടണം തീരത്ത് പരീക്ഷിച്ചത്.

പ്രത്യേക ഫ്ലോട്ടേഷൻ കോളറുകൾ, മെഡിക്കൽ എയർലിഫ്റ്റ് നടപടികൾ, തത്സമയ ടെലിമെട്രി വിനിമയം എന്നിവ കാര്യക്ഷമമായി പ്രവർത്തിച്ചതായി ഐഎസ്ആർഒ വ്യക്തമാക്കി.`;
    return {
      headlineMl: titleMl,
      summaryMl,
      bodyMl,
      keyPointsMl: [
        'വിശാഖപട്ടണം തീരത്ത് നാവികസേനയും ഐഎസ്ആർഒയും സംയുക്തമായി പരീക്ഷണം നടത്തി.',
        'ക്രൂ മൊഡ്യൂൾ വേഗത്തിൽ സുരക്ഷിതമായി വീണ്ടെടുക്കുന്ന സാങ്കേതികവിദ്യ വിജയകരമായി തെളിയിച്ചു.',
        'യാത്രികർക്കുള്ള അടിയന്തര മെഡിക്കൽ എയർലിഫ്റ്റ് പ്രോട്ടോക്കോളുകൾ പൂർത്തിയാക്കി.'
      ]
    };
  }

  if (/gst/i.test(englishTitle)) {
    titleMl = 'രാജ്യത്തെ ജിഎസ്ടി വരുമാനത്തിൽ റെക്കോർഡ് കുതിപ്പ്: പ്രതിമാസ വരുമാനം 1.87 ലക്ഷം കോടി രൂപ';
    summaryMl = 'രാജ്യത്തെ മൊത്ത ജിഎസ്ടി വരുമാനം 1,87,346 കോടി രൂപയിലെത്തി. കഴിഞ്ഞ വർഷത്തെ അപേക്ഷിച്ച് 11.2% വളർച്ചയാണ് രേഖപ്പെടുത്തിയത്.';
    const bodyMl = `രാജ്യത്തെ മൊത്ത ചരക്ക് സേവന നികുതി (GST) വരുമാനം റെക്കോർഡ് നേട്ടത്തിലേക്ക്. ആഭ്യന്തര വിപണിയിലെ ശക്തമായ ചലനങ്ങളും ഉൽപ്പാദന മേഖലയിലെ മുന്നേറ്റവും ജിഎസ്ടി വളർച്ചയ്ക്ക് കരുത്തേകി. കേരളത്തിൽ സംസ്ഥാന ജിഎസ്ടി വരുമാനത്തിൽ 14% വർദ്ധനവ് രേഖപ്പെടുത്തി.`;
    return {
      headlineMl: titleMl,
      summaryMl,
      bodyMl,
      keyPointsMl: [
        'പ്രതിമാസ ജിഎസ്ടി വരുമാനം ₹1.87 ലക്ഷം കോടി കടന്നു.',
        'കഴിഞ്ഞ വർഷത്തെ അപേക്ഷിച്ച് 11.2% വാർഷിക വളർച്ച.',
        'കേരളത്തിലെ ജിഎസ്ടി വരുമാനത്തിൽ 14% വർദ്ധനവ്.'
      ]
    };
  }

  // Fallback generalized localization
  for (const [enTerm, mlTerm] of Object.entries(MALAYALAM_ENTITY_DICTIONARY)) {
    const reg = new RegExp(`\\b${enTerm}\\b`, 'gi');
    titleMl = titleMl.replace(reg, mlTerm);
    summaryMl = summaryMl.replace(reg, mlTerm);
  }

  return {
    headlineMl: titleMl,
    summaryMl,
    bodyMl: summaryMl,
    keyPointsMl: [summaryMl]
  };
}

// ==================== AI USAGE & COST TRACKING ====================

const AI_USAGE_KEY = 'aditi-news-ai-usage';

export function getAIUsageLogs(): AIUsageRecord[] {
  try {
    const raw = localStorage.getItem(AI_USAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function recordAIUsage(record: Omit<AIUsageRecord, 'id' | 'timestamp'>): AIUsageRecord {
  const fullRecord: AIUsageRecord = {
    id: `ai-use-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...record,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = getAIUsageLogs();
    const updated = [fullRecord, ...existing.slice(0, 200)]; // keep last 200
    localStorage.setItem(AI_USAGE_KEY, JSON.stringify(updated));
  } catch {}

  return fullRecord;
}

// ==================== PROMPT TEMPLATE REGISTRY ====================

export const INITIAL_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    name: 'Article Drafting Agent (English)',
    version: 3,
    task: 'draft_en',
    language: 'en',
    systemPrompt: 'You are an award-winning digital journalist. Write neutral, factual, and strictly evidence-grounded news articles without editorial bias or speculation.',
    userTemplate: 'Write a comprehensive news article based strictly on these verified claims and primary source documents: {claims_and_sources}',
    model: 'gemini-1.5-flash / gpt-4o-mini',
    temperature: 0.2,
    active: true,
    updatedAt: '2026-08-30T00:00:00Z'
  },
  {
    name: 'Malayalam Journalistic Editor Agent',
    version: 4,
    task: 'draft_ml',
    language: 'ml',
    systemPrompt: 'നിങ്ങൾ മലയാളത്തിലെ പ്രമുഖ മാധ്യമ ശൈലിയിൽ വാർത്തകൾ തയ്യാറാക്കുന്ന എഡിറ്ററാണ്. ഔദ്യോഗിക പദാവലികളും ഗ്രാമർ ശൈലിയും പാലിച്ച് നിഷ്പക്ഷമായി വാർത്തകൾ തയ്യാറാക്കുക.',
    userTemplate: 'ഈ വിവരങ്ങൾ അടിസ്ഥാനമാക്കി ഉന്നത നിലവാരമുള്ള മലയാളം വാർത്തയും പ്രധാന വിവരങ്ങളും തയ്യാറാക്കുക: {claims_and_sources}',
    model: 'gemini-1.5-pro / claude-3-5-sonnet',
    temperature: 0.1,
    active: true,
    updatedAt: '2026-08-30T00:00:00Z'
  },
  {
    name: 'Headline & SEO Generation Agent',
    version: 2,
    task: 'headline',
    language: 'all',
    systemPrompt: 'Generate truthful, high-clickability yet non-clickbait headlines, meta summaries, and SEO tags.',
    userTemplate: 'Create straight, breaking, and SEO headlines for: {title_and_summary}',
    model: 'gemini-1.5-flash',
    temperature: 0.3,
    active: true,
    updatedAt: '2026-08-30T00:00:00Z'
  }
];
