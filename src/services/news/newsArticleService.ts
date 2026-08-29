/**
 * NewsOS Article Generation, Versioning & Publishing Service
 * Handles English and Malayalam article generation, immutable version histories,
 * reader-visible corrections, and formal retractions.
 */

import { NewsArticle, NewsStory, ArticleVersion, ArticleCorrection, ArticleRetraction, NewsLanguage, NewsCategory, KeralaDistrict } from '../../types/news';
import { localizeJournalisticMalayalam } from './newsAIEngine';
import { getNewsStories } from './newsClusteringService';

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  // 1. Monsoon Red Alert (English)
  {
    id: 'art-kerala-monsoon-red-alert-en',
    storyId: 'story-kerala-monsoon-red-alert-2026',
    language: 'en',
    headline: 'IMD Declares Red Alert for 4 Northern Kerala Districts; KSDMA Activates 24x7 Control Rooms and NDRF',
    subheadline: 'Extremely heavy rainfall exceeding 204 mm forecast across Kozhikode, Wayanad, Kannur, and Kasaragod; fishermen warned against venturing into sea.',
    slug: 'imd-red-alert-kerala-four-northern-districts-ksdma-control-rooms',
    summary: 'The India Meteorological Department (IMD) has issued a Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod districts on August 30 and 31. The State Disaster Management Authority has mobilized round-the-clock control rooms and positioned NDRF battalions.',
    body: `The India Meteorological Department (IMD) has upgraded its regional weather warning to a Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod districts for August 30 and 31, forecasting isolated extremely heavy rainfall exceeding 204.4 mm in 24 hours.

An active low-pressure trough over the Arabian Sea combined with strong westerly monsoon winds has intensified precipitation across northern Kerala and the Western Ghats. In response, the Kerala State Disaster Management Authority (KSDMA), following an emergency review chaired by the Chief Secretary, has directed district administrations to operationalize 24x7 taluk-level disaster control rooms.

National Disaster Response Force (NDRF) battalions have been prepositioned in Wayanad and Kozhikode to handle potential waterlogging or landslip contingencies in hilly terrains. District collectors have declared holidays for educational institutions in landslide-vulnerable taluks.

Fishermen have been strictly advised not to venture into the Kerala, Karnataka, and Lakshadweep coastal waters as squally winds reaching 45–55 kmph, gusting up to 65 kmph, continue to prevail.`,
    keyPoints: [
      'Red Alert issued for Kozhikode, Wayanad, Kannur, and Kasaragod for Aug 30–31.',
      'Rainfall exceeding 204.4 mm in 24 hours expected in isolated ghat locations.',
      '24x7 taluk emergency response control rooms operationalized across northern districts.',
      'NDRF search and rescue teams prepositioned in Wayanad and Kozhikode.',
      'Fishermen barred from venturing into sea due to squally winds up to 65 kmph.'
    ],
    category: 'Environment & Weather',
    district: 'Kozhikode',
    state: 'Kerala',
    tags: ['Kerala Monsoon', 'IMD Red Alert', 'KSDMA', 'Kozhikode', 'Wayanad', 'Emergency Updates'],
    authors: ['NewsOS Meteorological Desk', 'PRD Kerala Verified Feed'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1514632595-4944383f2737?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Dense monsoon clouds over the Western Ghats mountain range in northern Kerala',
    imageAlt: 'Monsoon clouds and rain over green mountains',
    aiGeneratedPercentage: 20,
    reviewedBy: 'Senior Editorial Desk',
    status: 'published',
    publishedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    versions: [
      {
        version: 1,
        headline: 'IMD Declares Red Alert for 4 Northern Kerala Districts; KSDMA Activates 24x7 Control Rooms and NDRF',
        summary: 'The India Meteorological Department (IMD) has issued a Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod districts on August 30 and 31.',
        body: 'Full verified initial report.',
        keyPoints: ['Red Alert issued for 4 districts.'],
        changedBy: 'Automated Ingestion Engine',
        changeReason: 'Initial verified publication',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      }
    ],
    corrections: [],
    seoTitle: 'IMD Red Alert for Kerala: 4 Northern Districts on High Alert | NewsOS',
    seoDescription: 'IMD issues Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod. 24x7 disaster control rooms opened and NDRF positioned.',
    canonicalUrl: 'https://news.aditi.app/kerala/imd-red-alert-four-districts',
    estimatedReadTimeMinutes: 2,
    audioDurationSeconds: 78
  },

  // 1b. Monsoon Red Alert (Malayalam)
  {
    id: 'art-kerala-monsoon-red-alert-ml',
    storyId: 'story-kerala-monsoon-red-alert-2026',
    language: 'ml',
    headline: 'വടക്കൻ കേരളത്തിലെ 4 ജില്ലകളിൽ റെഡ് അലർട്ട്; കൺട്രോൾ റൂമുകൾ തുറന്നു, എൻ.ഡി.ആർ.എഫ് സജ്ജം',
    subheadline: 'കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ അതിതീവ്ര മഴ മുന്നറിയിപ്പ്; മത്സ്യത്തൊഴിലാളികൾ കടലിൽ പോകരുതെന്ന് നിർദ്ദേശം.',
    slug: 'kerala-monsoon-red-alert-four-districts-ksdma-malayalam',
    summary: 'കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ കേന്ദ്ര കാലാവസ്ഥാ വകുപ്പ് അതിതീവ്ര മഴ മുന്നറിയിപ്പ് (റെഡ് അലർട്ട്) പ്രഖ്യാപിച്ചു. 24 മണിക്കൂർ കൺട്രോൾ റൂമുകൾ തുറക്കാൻ ദുരന്ത നിവാരണ അതോറിറ്റി നിർദ്ദേശം നൽകി.',
    body: `അറബിക്കടലിൽ രൂപപ്പെട്ട ന്യൂനമർദ്ദത്തെ തുടർന്ന് വടക്കൻ കേരളത്തിൽ കാലവർഷം അതിശക്തമായി തുടരുന്നു. കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ കേന്ദ്ര കാലാവസ്ഥാ വകുപ്പ് (IMD) റെഡ് അലർട്ട് പ്രഖ്യാപിച്ചു. 24 മണിക്കൂറിൽ 204.4 മില്ലിമീറ്ററിൽ കൂടുതൽ അതിതീവ്ര മഴ പെയ്യാൻ സാധ്യതയുണ്ടെന്നാണ് മുന്നറിയിപ്പ്.

കാലവർഷക്കെടുതി നേരിടാൻ സംസ്ഥാന ദുരന്ത നിവാരണ അതോറിറ്റി (KSDMA) താലൂക്ക് തലത്തിൽ 24 മണിക്കൂറും പ്രവർത്തിക്കുന്ന എമർജൻസി കൺട്രോൾ റൂമുകൾ തുറന്നു. മണ്ണിടിച്ചിൽ, ഉരുൾപൊട്ടൽ സാധ്യതയുള്ള മലയോര മേഖലകളിൽ ആവശ്യമായ മുൻകരുതലുകൾ സ്വീകരിക്കാൻ ജില്ലാ കളക്ടർമാർക്ക് ചീഫ് സെക്രട്ടറി നിർദ്ദേശം നൽകി.

വയനാട്, കോഴിക്കോട് ജില്ലകളിൽ ദേശീയ ദുരന്ത നിവാരണ സേനയെ (NDRF) വിന്യസിച്ചിട്ടുണ്ട്.

കടൽ പ്രക്ഷുബ്ധമായതിനാൽ കേരള-കർണാടക-ലക്ഷദ്വീപ് തീരങ്ങളിൽ മത്സ്യത്തൊഴിലാളികൾ കടലിൽ പോകരുതെന്ന് കർശന നിർദ്ദേശമുണ്ട്. മണിക്കൂറിൽ 65 കിലോമീറ്റർ വരെ വേഗതയിൽ കാറ്റടിക്കാൻ സാധ്യതയുണ്ട്.`,
    keyPoints: [
      'കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ റെഡ് അലർട്ട് പ്രഖ്യാപിച്ചു.',
      '24 മണിക്കൂറിൽ 204.4 മില്ലിമീറ്ററിൽ കൂടുതൽ അതിതീവ്ര മഴയ്ക്ക് സാധ്യത.',
      'എല്ലാ താലൂക്കുകളിലും 24x7 അടിയന്തര കൺട്രോൾ റൂമുകൾ തുറന്നു.',
      'വയനാട്ടിലും കോഴിക്കോടും എൻഡിആർഎഫ് സേനയെ വിന്യസിച്ചു.',
      'മത്സ്യത്തൊഴിലാളികൾ കടലിൽ പോകരുതെന്ന് കർശന മുന്നറിയിപ്പ്.'
    ],
    category: 'Environment & Weather',
    district: 'Kozhikode',
    state: 'Kerala',
    tags: ['കേരള മഴ', 'റെഡ് അലർട്ട്', 'കോഴിക്കോട്', 'വയനാട്', 'കാലാവസ്ഥ മുന്നറിയിപ്പ്'],
    authors: ['ന്യൂസ്ഒഎസ് മലയാളം ഡെസ്ക്'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1514632595-4944383f2737?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'വടക്കൻ കേരളത്തിലെ മലയോര മേഖലകളിൽ ശക്തമായ മഴമേഘങ്ങൾ',
    imageAlt: 'മഴക്കാറും മലനിരകളും',
    aiGeneratedPercentage: 20,
    reviewedBy: 'മലയാളം ചീഫ് എഡിറ്റർ',
    status: 'published',
    publishedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    versions: [],
    corrections: [],
    seoTitle: 'കേരളത്തിൽ റെഡ് അലർട്ട്: 4 ജില്ലകളിൽ അതിതീവ്ര മഴ മുന്നറിയിപ്പ് | NewsOS',
    seoDescription: 'കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ് ജില്ലകളിൽ റെഡ് അലർട്ട്. 24 മണിക്കൂർ കൺട്രോൾ റൂമുകൾ തുറന്നു.',
    canonicalUrl: 'https://news.aditi.app/ml/kerala-monsoon-red-alert',
    estimatedReadTimeMinutes: 2,
    audioDurationSeconds: 85
  },

  // 2. ISRO Gaganyaan (English)
  {
    id: 'art-isro-gaganyaan-recovery-en',
    storyId: 'story-isro-gaganyaan-recovery-2026',
    language: 'en',
    headline: 'ISRO and Indian Navy Successfully Conclude Deep-Sea Gaganyaan Crew Module Recovery Trials',
    subheadline: 'Key milestones achieved in astronaut extraction protocols and rapid ocean recovery off the coast of Visakhapatnam.',
    slug: 'isro-indian-navy-gaganyaan-crew-module-ocean-recovery-trials',
    summary: 'ISRO in partnership with the Indian Navy Eastern Naval Command has successfully completed integrated recovery trials for the Gaganyaan human spaceflight crew module off the coast of Visakhapatnam.',
    body: `The Indian Space Research Organisation (ISRO) in collaboration with the Eastern Naval Command of the Indian Navy successfully completed the comprehensive integrated crew module recovery trials off the coast of Visakhapatnam.

The complex trials validated the rapid-deployment inflatable flotation collars designed to stabilize the capsule upon ocean splashdown, emergency medical airlift procedures, and secure telemetry communications between naval recovery vessels and mission control in Bengaluru.

The milestone marks a decisive step towards India's first uncrewed orbital test flight under the Gaganyaan human spaceflight programme.`,
    keyPoints: [
      'Joint recovery operations conducted off Visakhapatnam coast by ISRO and Indian Navy.',
      'Flotation collar rapid-deployment and stability demonstrated.',
      'Helicopter medical evacuation and telemetry protocols validated.',
      'Paves the way for the upcoming uncrewed Gaganyaan orbital mission.'
    ],
    category: 'Technology & AI',
    state: 'India',
    tags: ['ISRO', 'Gaganyaan', 'Indian Navy', 'Space Tech', 'Human Spaceflight'],
    authors: ['NewsOS Space & Tech Desk'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1517976487588-4663b6528825?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Gaganyaan crew module ocean recovery test simulation',
    aiGeneratedPercentage: 25,
    reviewedBy: 'Tech Desk Lead',
    status: 'published',
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    versions: [],
    corrections: [],
    seoTitle: 'ISRO Gaganyaan Crew Module Ocean Recovery Trials Successful | NewsOS',
    seoDescription: 'ISRO and Indian Navy complete crucial Gaganyaan human spaceflight recovery trials in Visakhapatnam.',
    canonicalUrl: 'https://news.aditi.app/tech/isro-gaganyaan-recovery-trials',
    estimatedReadTimeMinutes: 2,
    audioDurationSeconds: 65
  },

  // 2b. ISRO Gaganyaan (Malayalam)
  {
    id: 'art-isro-gaganyaan-recovery-ml',
    storyId: 'story-isro-gaganyaan-recovery-2026',
    language: 'ml',
    headline: 'ഗഗൻയാൻ ദൗത്യം: ക്രൂ മൊഡ്യൂൾ സമുദ്ര വീണ്ടെടുക്കൽ പരീക്ഷണം ഐഎസ്ആർഒയും നാവികസേനയും വിജയകരമായി പൂർത്തിയാക്കി',
    subheadline: 'വിശാഖപട്ടണം തീരത്ത് മനുഷ്യ ബഹിരാകാശ ദൗത്യ പേടകത്തിന്റെ നിർണായക പരീക്ഷണം പൂർത്തിയായി.',
    slug: 'isro-gaganyaan-crew-module-ocean-recovery-malayalam',
    summary: 'ഇന്ത്യയുടെ പ്രഥമ മനുഷ്യ ബഹിരാകാശ ദൗത്യമായ ഗഗൻയാന്റെ ക്രൂ മൊഡ്യൂൾ സമുദ്രത്തിൽ നിന്ന് സുരക്ഷിതമായി വീണ്ടെടുക്കുന്ന നിർണായക പരീക്ഷണം വിശാഖപട്ടണം തീരത്ത് വിജയകരമായി പൂർത്തിയായി.',
    body: `ഐഎസ്ആർഒയും ഇന്ത്യൻ നാവികസേനയുടെ ഈസ്റ്റേൺ നേവൽ കമാൻഡും സംയുക്തമായി നടത്തിയ ഗഗൻയാൻ ക്രൂ മൊഡ്യൂൾ റിക്കവറി പരീക്ഷണം വൻ വിജയം. ബഹിരാകാശത്തുനിന്ന് സമുദ്രത്തിൽ പതിക്കുന്ന യാത്രിക പേടകത്തെ അതിവേഗം വീണ്ടെടുക്കാനും സഞ്ചാരികൾക്ക് അടിയന്തര വൈദ്യസഹായം എത്തിക്കാനുമുള്ള സജ്ജീകരണങ്ങളാണ് വിശാഖപട്ടണം തീരത്ത് പരീക്ഷിച്ചത്.

പ്രത്യേക ഫ്ലോട്ടേഷൻ കോളറുകൾ, മെഡിക്കൽ എയർലിഫ്റ്റ് നടപടികൾ, തത്സമയ ടെലിമെട്രി വിനിമയം എന്നിവ കാര്യക്ഷമമായി പ്രവർത്തിച്ചതായി ഐഎസ്ആർഒ വ്യക്തമാക്കി.`,
    keyPoints: [
      'വിശാഖപട്ടണം തീരത്ത് നാവികസേനയും ഐഎസ്ആർഒയും സംയുക്തമായി പരീക്ഷണം നടത്തി.',
      'ക്രൂ മൊഡ്യൂൾ വേഗത്തിൽ സുരക്ഷിതമായി വീണ്ടെടുക്കുന്ന സാങ്കേതികവിദ്യ തെളിയിച്ചു.',
      'യാത്രികർക്കുള്ള അടിയന്തര മെഡിക്കൽ എയർലിഫ്റ്റ് പ്രോട്ടോക്കോളുകൾ പൂർത്തിയാക്കി.'
    ],
    category: 'Technology & AI',
    state: 'India',
    tags: ['ഐഎസ്ആർഒ', 'ഗഗൻയാൻ', 'ബഹിരാകാശം', 'ഇന്ത്യൻ നാവികസേന'],
    authors: ['ന്യൂസ്ഒഎസ് സയൻസ് ഡെസ്ക്'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1517976487588-4663b6528825?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'ഗഗൻയാൻ പേടകം വീണ്ടെടുക്കുന്നതിനുള്ള പരീക്ഷണ വാഹനം',
    aiGeneratedPercentage: 25,
    reviewedBy: 'മലയാളം സയൻസ് എഡിറ്റർ',
    status: 'published',
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    versions: [],
    corrections: [],
    seoTitle: 'ഗഗൻയാൻ ക്രൂ മൊഡ്യൂൾ പരീക്ഷണം വൻ വിജയം | NewsOS',
    seoDescription: 'ഐഎസ്ആർഒയും ഇന്ത്യൻ നാവികസേനയും ഗഗൻയാൻ സമുദ്ര വീണ്ടെടുക്കൽ പരീക്ഷണം വിജയകരമായി പൂർത്തിയാക്കി.',
    canonicalUrl: 'https://news.aditi.app/ml/isro-gaganyaan-recovery',
    estimatedReadTimeMinutes: 2,
    audioDurationSeconds: 70
  }
];

const ARTICLES_STORAGE_KEY = 'aditi-news-articles';

export function getNewsArticles(): NewsArticle[] {
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...INITIAL_NEWS_ARTICLES];
}

export function saveNewsArticles(articles: NewsArticle[]): void {
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch {}
}

/**
 * Filter articles by language, category, district, search query, and importance
 */
export function filterArticles(
  articles: NewsArticle[],
  filters: {
    language?: NewsLanguage;
    category?: NewsCategory | 'All';
    district?: KeralaDistrict | 'All Districts';
    searchQuery?: string;
    onlyBreaking?: boolean;
  }
): NewsArticle[] {
  return articles.filter(art => {
    if (art.status === 'retracted') return false;
    if (filters.language && art.language !== filters.language) return false;
    if (filters.category && filters.category !== 'All' && art.category !== filters.category) return false;
    if (filters.district && filters.district !== 'All Districts' && art.district !== filters.district) return false;
    
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matches = 
        art.headline.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.tags.some(t => t.toLowerCase().includes(q)) ||
        (art.district && art.district.toLowerCase().includes(q));
      if (!matches) return false;
    }

    return true;
  });
}

/**
 * Generate dual English & Malayalam articles from a verified NewsStory
 */
export function generateArticlesFromStory(story: NewsStory): { enArticle: NewsArticle; mlArticle: NewsArticle } {
  const existingArticles = getNewsArticles();

  // English Article
  const enArticle: NewsArticle = {
    id: `art-${story.id}-en`,
    storyId: story.id,
    language: 'en',
    headline: story.primaryTitle,
    slug: story.slug,
    summary: `${story.primaryTitle}. Verified by official authorities in ${story.primaryLocation}.`,
    body: `${story.primaryTitle}.\n\nOfficial bulletins confirmed that authorities have activated response measures in ${story.primaryLocation}. Multiple verified government sources corroborated the developments.`,
    keyPoints: [story.primaryTitle, `Primary location: ${story.primaryLocation}`],
    category: story.categories[0] || 'Top Stories',
    district: story.district,
    state: story.state,
    tags: story.tags,
    authors: ['NewsOS Autonomous Agent', 'Editorial Desk'],
    primaryImageUrl: story.primaryImageUrl,
    imageCaption: story.imageCaption,
    aiGeneratedPercentage: story.aiGeneratedPercentage,
    status: story.status === 'PUBLISHED' ? 'published' : 'awaiting_review',
    publishedAt: story.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [],
    corrections: [],
    seoTitle: `${story.primaryTitle} | NewsOS`,
    seoDescription: `${story.primaryTitle} - Verified report from ${story.primaryLocation}.`,
    canonicalUrl: `https://news.aditi.app/story/${story.slug}`,
    estimatedReadTimeMinutes: 2,
    audioDurationSeconds: 60
  };

  // Malayalam Article using Native Transliteration & Journalistic Engine
  const mlContent = localizeJournalisticMalayalam(story.primaryTitle, enArticle.summary, story.categories[0] || 'Top Stories');
  const mlArticle: NewsArticle = {
    id: `art-${story.id}-ml`,
    storyId: story.id,
    language: 'ml',
    headline: mlContent.headlineMl,
    slug: `${story.slug}-malayalam`,
    summary: mlContent.summaryMl,
    body: mlContent.bodyMl,
    keyPoints: mlContent.keyPointsMl,
    category: story.categories[0] || 'Top Stories',
    district: story.district,
    state: story.state,
    tags: story.tags,
    authors: ['ന്യൂസ്ഒഎസ് മലയാളം എഡിറ്റോറിയൽ'],
    primaryImageUrl: story.primaryImageUrl,
    imageCaption: story.imageCaption,
    aiGeneratedPercentage: story.aiGeneratedPercentage,
    status: story.status === 'PUBLISHED' ? 'published' : 'awaiting_review',
    publishedAt: story.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [],
    corrections: [],
    seoTitle: `${mlContent.headlineMl} | NewsOS`,
    seoDescription: mlContent.summaryMl,
    canonicalUrl: `https://news.aditi.app/ml/${story.slug}`,
    estimatedReadTimeMinutes: 2,
    audioDurationSeconds: 75
  };

  // Persist articles
  const otherArticles = existingArticles.filter(a => a.storyId !== story.id);
  saveNewsArticles([...otherArticles, enArticle, mlArticle]);

  return { enArticle, mlArticle };
}

/**
 * Publish a reader-visible correction to an existing article with version snapshot
 */
export function recordArticleCorrection(
  articleId: string,
  oldText: string,
  newText: string,
  reason: string,
  initiatedBy: string,
  approvedBy: string
): NewsArticle | null {
  const articles = getNewsArticles();
  const target = articles.find(a => a.id === articleId);
  if (!target) return null;

  const newVersionNumber = (target.versions.length || 0) + 1;
  const versionSnapshot: ArticleVersion = {
    version: newVersionNumber,
    headline: target.headline,
    summary: target.summary,
    body: target.body,
    keyPoints: target.keyPoints,
    changedBy: approvedBy,
    changeReason: reason,
    timestamp: new Date().toISOString()
  };

  const correction: ArticleCorrection = {
    id: `corr-${Date.now()}`,
    articleId,
    version: newVersionNumber,
    oldText,
    newText,
    reason,
    initiatedBy,
    approvedBy,
    timestamp: new Date().toISOString()
  };

  // Replace text in body if present
  const updatedBody = target.body.includes(oldText) ? target.body.replace(oldText, newText) : target.body;

  const updatedArticle: NewsArticle = {
    ...target,
    body: updatedBody,
    status: 'corrected',
    updatedAt: new Date().toISOString(),
    versions: [versionSnapshot, ...target.versions],
    corrections: [correction, ...target.corrections]
  };

  const updatedList = articles.map(a => a.id === articleId ? updatedArticle : a);
  saveNewsArticles(updatedList);
  return updatedArticle;
}

/**
 * Retract an article with permanent audit explanation
 */
export function retractArticle(articleId: string, reason: string, retractedBy: string): NewsArticle | null {
  const articles = getNewsArticles();
  const target = articles.find(a => a.id === articleId);
  if (!target) return null;

  const retraction: ArticleRetraction = {
    id: `retract-${Date.now()}`,
    articleId,
    reason,
    retractedBy,
    retractedAt: new Date().toISOString()
  };

  const updatedArticle: NewsArticle = {
    ...target,
    status: 'retracted',
    retraction,
    updatedAt: new Date().toISOString()
  };

  const updatedList = articles.map(a => a.id === articleId ? updatedArticle : a);
  saveNewsArticles(updatedList);
  return updatedArticle;
}
