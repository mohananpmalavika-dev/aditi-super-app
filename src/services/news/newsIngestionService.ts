/**
 * NewsOS Source Ingestion Engine
 * Ingests raw feeds from official government portals, weather bureaus, police bulletins, and news agencies.
 * Performs clean text extraction, content hashing, and transforms feeds into structured SourceDocument records.
 */

import { SourceDocument, NewsSource, NewsCategory, KeralaDistrict } from '../../types/news';
import { getRegisteredNewsSources } from './newsSourceService';

/**
 * Generate a deterministic hash for deduplication and tamper verification
 */
export function generateContentHash(title: string, cleanContent: string, sourceUrl: string): string {
  const normalized = `${title.trim().toLowerCase()}_${cleanContent.slice(0, 200).trim().toLowerCase()}_${sourceUrl.trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Clean raw HTML, stripping ads, trackers, and excessive whitespace
 */
export function cleanRawArticleContent(rawHtmlOrText: string): string {
  if (!rawHtmlOrText) return '';
  return rawHtmlOrText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detect Indian states, Kerala districts, or metropolitan regions from text
 */
export function detectArticleLocation(text: string): { district?: KeralaDistrict; state?: string } {
  const lower = text.toLowerCase();
  
  const DISTRICT_MAP: { [key: string]: KeralaDistrict } = {
    'thiruvananthapuram': 'Thiruvananthapuram',
    'trivandrum': 'Thiruvananthapuram',
    'kollam': 'Kollam',
    'quilon': 'Kollam',
    'pathanamthitta': 'Pathanamthitta',
    'alappuzha': 'Alappuzha',
    'alleppey': 'Alappuzha',
    'kottayam': 'Kottayam',
    'idukki': 'Idukki',
    'ernakulam': 'Ernakulam',
    'kochi': 'Ernakulam',
    'cochin': 'Ernakulam',
    'thrissur': 'Thrissur',
    'trichur': 'Thrissur',
    'palakkad': 'Palakkad',
    'palghat': 'Palakkad',
    'malappuram': 'Malappuram',
    'kozhikode': 'Kozhikode',
    'calicut': 'Kozhikode',
    'wayanad': 'Wayanad',
    'kannur': 'Kannur',
    'cannore': 'Kannur',
    'kasaragod': 'Kasaragod'
  };

  for (const [key, dist] of Object.entries(DISTRICT_MAP)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(lower)) {
      return { district: dist, state: 'Kerala' };
    }
  }

  if (lower.includes('kerala')) return { state: 'Kerala' };
  if (lower.includes('delhi')) return { state: 'Delhi' };
  if (lower.includes('karnataka') || lower.includes('bengaluru')) return { state: 'Karnataka' };
  if (lower.includes('tamil nadu') || lower.includes('chennai')) return { state: 'Tamil Nadu' };
  if (lower.includes('maharashtra') || lower.includes('mumbai')) return { state: 'Maharashtra' };

  return {};
}

/**
 * Seed realistic official verified news feeds for initial ingestion
 */
export const INITIAL_INGESTED_DOCUMENTS: SourceDocument[] = [
  {
    id: 'doc-imd-red-alert-1',
    sourceId: 'src-imd-weather',
    sourceName: 'India Meteorological Department (IMD)',
    sourceType: 'GOVERNMENT',
    sourceUrl: 'https://mausam.imd.gov.in/kerala/bulletin-20260830-1',
    canonicalUrl: 'https://mausam.imd.gov.in/kerala/bulletin-20260830-1',
    title: 'IMD Issues Red Alert for 4 Northern Kerala Districts Due to Active Monsoon Surge',
    rawContent: 'The India Meteorological Department (IMD) has upgraded the weather warning to a Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod districts on August 30 and 31. An active low-pressure area over the Arabian Sea is bringing isolated extremely heavy rainfall exceeding 204.4 mm in 24 hours. Fishermen are strictly advised not to venture into Kerala-Karnataka-Lakshadweep coasts as squally winds reaching 45-55 kmph gusting to 65 kmph are prevailing.',
    cleanContent: 'The India Meteorological Department (IMD) has upgraded the weather warning to a Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod districts on August 30 and 31. An active low-pressure area over the Arabian Sea is bringing isolated extremely heavy rainfall exceeding 204.4 mm in 24 hours. Fishermen are strictly advised not to venture into Kerala-Karnataka-Lakshadweep coasts as squally winds reaching 45-55 kmph gusting to 65 kmph are prevailing.',
    summary: 'IMD declares Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod with heavy rainfall warnings and sea advisories.',
    author: 'Directorate of Weather Forecasting, IMD',
    publicationTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    retrievedAt: new Date().toISOString(),
    language: 'en',
    category: 'Environment & Weather',
    district: 'Kozhikode',
    state: 'Kerala',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1514632595-4944383f2737?w=1200&auto=format&fit=crop&q=80',
        type: 'image',
        caption: 'Heavy monsoon cloud cover over northern Kerala mountain range'
      }
    ],
    contentHash: 'hash_imd_red_alert_aug30',
    status: 'clustered'
  },
  {
    id: 'doc-kerala-prd-disaster-mgmt-1',
    sourceId: 'src-kerala-prd',
    sourceName: 'PRD Kerala Government',
    sourceType: 'GOVERNMENT',
    sourceUrl: 'https://prd.kerala.gov.in/press-release/sdma-alert-893',
    canonicalUrl: 'https://prd.kerala.gov.in/press-release/sdma-alert-893',
    title: 'Kerala State Disaster Management Authority Opens 24x7 Control Rooms in Northern Districts',
    rawContent: 'Following the Red Alert issued by IMD, the Kerala State Disaster Management Authority (KSDMA) chaired by the Chief Secretary has directed all district collectors of Kozhikode, Wayanad, Kannur, and Kasaragod to open 24x7 emergency taluk-level control rooms. NDRF teams have been prepositioned in Wayanad and Kozhikode. Educational institutions in disaster-prone hilly taluks have been declared a holiday by respective District Collectors.',
    cleanContent: 'Following the Red Alert issued by IMD, the Kerala State Disaster Management Authority (KSDMA) chaired by the Chief Secretary has directed all district collectors of Kozhikode, Wayanad, Kannur, and Kasaragod to open 24x7 emergency taluk-level control rooms. NDRF teams have been prepositioned in Wayanad and Kozhikode. Educational institutions in disaster-prone hilly taluks have been declared a holiday by respective District Collectors.',
    summary: 'KSDMA mobilizes 24x7 control rooms, positions NDRF teams, and collectors declare school holidays in hilly taluks of 4 northern districts.',
    author: 'KSDMA Official Spokesperson',
    publicationTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    retrievedAt: new Date().toISOString(),
    language: 'en',
    category: 'Kerala',
    district: 'Wayanad',
    state: 'Kerala',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=1200&auto=format&fit=crop&q=80',
        type: 'image',
        caption: 'Emergency disaster response monitoring center'
      }
    ],
    contentHash: 'hash_prd_ksdma_control_rooms',
    status: 'clustered'
  },
  {
    id: 'doc-isro-gaganyaan-1',
    sourceId: 'src-isro-official',
    sourceName: 'ISRO Official Newsdesk',
    sourceType: 'GOVERNMENT',
    sourceUrl: 'https://www.isro.gov.in/GaganyaanCrewModuleRecoveryTestSuccess.html',
    canonicalUrl: 'https://www.isro.gov.in/GaganyaanCrewModuleRecoveryTestSuccess.html',
    title: 'ISRO & Indian Navy Successfully Complete Crucial Gaganyaan Crew Module Ocean Recovery Trials',
    rawContent: 'The Indian Space Research Organisation (ISRO) in collaboration with the Eastern Naval Command of the Indian Navy successfully completed the comprehensive integrated crew module recovery trials off the coast of Visakhapatnam. The specialized recovery team demonstrated rapid-deployment flotation collars, medical airlift protocols, and secure telemetry handoff from sea to mission command center.',
    cleanContent: 'The Indian Space Research Organisation (ISRO) in collaboration with the Eastern Naval Command of the Indian Navy successfully completed the comprehensive integrated crew module recovery trials off the coast of Visakhapatnam. The specialized recovery team demonstrated rapid-deployment flotation collars, medical airlift protocols, and secure telemetry handoff from sea to mission command center.',
    summary: 'ISRO and Indian Navy successfully conduct joint recovery trials for Gaganyaan human spaceflight crew module with medical airlift protocols.',
    author: 'ISRO Media Bureau',
    publicationTime: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    retrievedAt: new Date().toISOString(),
    language: 'en',
    category: 'Technology & AI',
    state: 'All India',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1517976487588-4663b6528825?w=1200&auto=format&fit=crop&q=80',
        type: 'image',
        caption: 'Gaganyaan crew module ocean recovery testing apparatus'
      }
    ],
    contentHash: 'hash_isro_gaganyaan_trials',
    status: 'clustered'
  },
  {
    id: 'doc-pib-economy-gst-1',
    sourceId: 'src-pib-india',
    sourceName: 'Press Information Bureau (PIB)',
    sourceType: 'GOVERNMENT',
    sourceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2049182',
    canonicalUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2049182',
    title: 'India Gross GST Collections Reach Record ₹1.87 Lakh Crore in Current Month with 11.2% YoY Growth',
    rawContent: 'The gross GST revenue collected in the country touched ₹1,87,346 crore in the current month, marking an impressive 11.2% year-on-year growth according to the Ministry of Finance. Domestic transactions registered 12.1% growth, driven by sustained manufacturing activity and robust consumption in festive supply chains. Kerala recorded a healthy 14% growth in state GST collections.',
    cleanContent: 'The gross GST revenue collected in the country touched ₹1,87,346 crore in the current month, marking an impressive 11.2% year-on-year growth according to the Ministry of Finance. Domestic transactions registered 12.1% growth, driven by sustained manufacturing activity and robust consumption in festive supply chains. Kerala recorded a healthy 14% growth in state GST collections.',
    summary: 'Gross GST revenues hit ₹1.87 lakh crore with 11.2% YoY growth, with domestic transactions up 12.1% and Kerala logging 14% revenue surge.',
    author: 'Ministry of Finance, PIB New Delhi',
    publicationTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    retrievedAt: new Date().toISOString(),
    language: 'en',
    category: 'Business & Economy',
    state: 'All India',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
        type: 'image',
        caption: 'Indian fiscal revenue growth and trade indices'
      }
    ],
    contentHash: 'hash_pib_gst_growth_aug30',
    status: 'clustered'
  },
  {
    id: 'doc-kerala-health-vaccine-1',
    sourceId: 'src-kerala-prd',
    sourceName: 'PRD Kerala Government',
    sourceType: 'GOVERNMENT',
    sourceUrl: 'https://prd.kerala.gov.in/health-dept-dengue-drive',
    canonicalUrl: 'https://prd.kerala.gov.in/health-dept-dengue-drive',
    title: 'Kerala Health Minister Launches Statewide Arogya Jagratha Monsoon Vector-Borne Disease Prevention Drive',
    rawContent: 'Kerala Minister for Health Veena George inaugurated the comprehensive statewide monsoon prevention campaign "Arogya Jagratha 2026" at Ernakulam General Hospital. Over 28,000 ASHA workers and public health volunteers have been mobilized for door-to-door source reduction of mosquito breeding spots to prevent Dengue, Leptospirosis (Rat Fever), and seasonal viral fevers.',
    cleanContent: 'Kerala Minister for Health Veena George inaugurated the comprehensive statewide monsoon prevention campaign "Arogya Jagratha 2026" at Ernakulam General Hospital. Over 28,000 ASHA workers and public health volunteers have been mobilized for door-to-door source reduction of mosquito breeding spots to prevent Dengue, Leptospirosis (Rat Fever), and seasonal viral fevers.',
    summary: 'Health department initiates Arogya Jagratha vector-borne disease prevention drive deploying 28,000 ASHA workers across all 14 districts.',
    author: 'Directorate of Health Services, Kerala',
    publicationTime: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    retrievedAt: new Date().toISOString(),
    language: 'en',
    category: 'Health & Science',
    district: 'Ernakulam',
    state: 'Kerala',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
        type: 'image',
        caption: 'Community health worker outreach campaign in Kerala'
      }
    ],
    contentHash: 'hash_kerala_health_arogya_jagratha',
    status: 'clustered'
  }
];

const INGESTED_DOCS_KEY = 'aditi-news-source-docs';

export function getIngestedSourceDocuments(): SourceDocument[] {
  try {
    const raw = localStorage.getItem(INGESTED_DOCS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...INITIAL_INGESTED_DOCUMENTS];
}

export function saveIngestedSourceDocuments(docs: SourceDocument[]): void {
  try {
    localStorage.setItem(INGESTED_DOCS_KEY, JSON.stringify(docs));
  } catch {}
}

export function ingestNewDocument(
  source: NewsSource,
  title: string,
  rawContent: string,
  sourceUrl: string,
  options: {
    author?: string;
    publicationTime?: string;
    mediaUrl?: string;
    mediaCaption?: string;
    category?: NewsCategory;
    district?: KeralaDistrict;
  } = {}
): SourceDocument {
  const cleanContent = cleanRawArticleContent(rawContent);
  const detectedLocation = detectArticleLocation(`${title} ${cleanContent}`);
  const contentHash = generateContentHash(title, cleanContent, sourceUrl);
  
  const doc: SourceDocument = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sourceId: source.id,
    sourceName: source.name,
    sourceType: source.type,
    sourceUrl,
    canonicalUrl: sourceUrl,
    title: title.trim(),
    rawContent,
    cleanContent,
    summary: cleanContent.slice(0, 200) + '...',
    author: options.author || `${source.name} Newsdesk`,
    publicationTime: options.publicationTime || new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    language: source.language === 'ml' ? 'ml' : 'en',
    category: options.category || source.category || 'Top Stories',
    district: options.district || detectedLocation.district,
    state: detectedLocation.state || source.state || 'India',
    media: options.mediaUrl ? [
      {
        url: options.mediaUrl,
        type: 'image',
        caption: options.mediaCaption || title
      }
    ] : [],
    contentHash,
    status: 'raw'
  };

  const existing = getIngestedSourceDocuments();
  // Deduplicate by content hash
  if (!existing.some(d => d.contentHash === contentHash)) {
    const updated = [doc, ...existing];
    saveIngestedSourceDocuments(updated);
  }

  return doc;
}
