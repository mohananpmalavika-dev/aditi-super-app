/**
 * NewsOS Source Management & Trust Engine
 * Manages authorized Indian & International sources (Govt PRD, PIB, IMD, Police, Agencies, RSS)
 * Computes dynamic trust scores (0-100) based on official authority, verification history, and accuracy.
 */

import { NewsSource } from '../../types/news';

export const INITIAL_NEWS_SOURCES: NewsSource[] = [
  {
    id: 'src-kerala-prd',
    name: 'Information & Public Relations Dept (PRD Kerala Govt)',
    type: 'GOVERNMENT',
    url: 'https://prd.kerala.gov.in',
    country: 'India',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    language: 'both',
    category: 'Kerala',
    rssUrl: 'https://prd.kerala.gov.in/en/rss.xml',
    apiEndpoint: 'https://prd.kerala.gov.in/api/v1/press-releases',
    reliabilityScore: 98,
    ownershipMetadata: 'Government of Kerala Directorate of Information & PR',
    licenseStatus: 'official_gov',
    usagePolicy: {
      attributionRequired: true,
      commercialUseAllowed: false,
      imageUsageAllowed: true,
      canonicalUrlRequired: true
    },
    updateFrequencyMinutes: 30,
    failureCount: 0,
    active: true,
    createdAt: '2026-08-30T00:00:00Z',
    updatedAt: '2026-08-30T00:00:00Z'
  },
  {
    id: 'src-pib-india',
    name: 'Press Information Bureau (PIB - Govt of India)',
    type: 'GOVERNMENT',
    url: 'https://pib.gov.in',
    country: 'India',
    language: 'both',
    category: 'India',
    rssUrl: 'https://pib.gov.in/rss.aspx',
    apiEndpoint: 'https://pib.gov.in/api/releases',
    reliabilityScore: 97,
    ownershipMetadata: 'Ministry of Information and Broadcasting, Govt of India',
    licenseStatus: 'official_gov',
    usagePolicy: {
      attributionRequired: true,
      commercialUseAllowed: false,
      imageUsageAllowed: true,
      canonicalUrlRequired: true
    },
    updateFrequencyMinutes: 30,
    failureCount: 0,
    active: true,
    createdAt: '2026-08-30T00:00:00Z',
    updatedAt: '2026-08-30T00:00:00Z'
  },
  {
    id: 'src-imd-weather',
    name: 'India Meteorological Department (IMD Central & Regional)',
    type: 'GOVERNMENT',
    url: 'https://mausam.imd.gov.in',
    country: 'India',
    state: 'Kerala',
    language: 'both',
    category: 'Environment & Weather',
    apiEndpoint: 'https://mausam.imd.gov.in/api/weather-alerts',
    reliabilityScore: 99,
    ownershipMetadata: 'Ministry of Earth Sciences, Govt of India',
    licenseStatus: 'official_gov',
    usagePolicy: {
      attributionRequired: true,
      commercialUseAllowed: true,
      imageUsageAllowed: true,
      canonicalUrlRequired: true
    },
    updateFrequencyMinutes: 15,
    failureCount: 0,
    active: true,
    createdAt: '2026-08-30T00:00:00Z',
    updatedAt: '2026-08-30T00:00:00Z'
  },
  {
    id: 'src-kerala-police',
    name: 'Kerala Police State & Cyber Cell Official Notices',
    type: 'GOVERNMENT',
    url: 'https://keralapolice.gov.in',
    country: 'India',
    state: 'Kerala',
    language: 'both',
    category: 'Kerala',
    reliabilityScore: 96,
    ownershipMetadata: 'Kerala State Police Headquarters',
    licenseStatus: 'official_gov',
    usagePolicy: {
      attributionRequired: true,
      commercialUseAllowed: false,
      imageUsageAllowed: true,
      canonicalUrlRequired: true
    },
    updateFrequencyMinutes: 60,
    failureCount: 0,
    active: true,
    createdAt: '2026-08-30T00:00:00Z',
    updatedAt: '2026-08-30T00:00:00Z'
  },
  {
    id: 'src-pti-feed',
    name: 'Press Trust of India (PTI National Wire)',
    type: 'NEWS_AGENCY',
    url: 'https://ptinews.com',
    country: 'India',
    language: 'en',
    category: 'Top Stories',
    reliabilityScore: 94,
    ownershipMetadata: 'Non-profit cooperative news agency of India',
    licenseStatus: 'licensed',
    usagePolicy: {
      attributionRequired: true,
      commercialUseAllowed: true,
      imageUsageAllowed: true,
      canonicalUrlRequired: true
    },
    updateFrequencyMinutes: 15,
    failureCount: 0,
    active: true,
    createdAt: '2026-08-30T00:00:00Z',
    updatedAt: '2026-08-30T00:00:00Z'
  },
  {
    id: 'src-isro-official',
    name: 'ISRO (Indian Space Research Organisation Newsdesk)',
    type: 'GOVERNMENT',
    url: 'https://www.isro.gov.in',
    country: 'India',
    language: 'both',
    category: 'Technology & AI',
    reliabilityScore: 99,
    ownershipMetadata: 'Department of Space, Govt of India',
    licenseStatus: 'official_gov',
    usagePolicy: {
      attributionRequired: true,
      commercialUseAllowed: true,
      imageUsageAllowed: true,
      canonicalUrlRequired: true
    },
    updateFrequencyMinutes: 120,
    failureCount: 0,
    active: true,
    createdAt: '2026-08-30T00:00:00Z',
    updatedAt: '2026-08-30T00:00:00Z'
  }
];

const SOURCES_STORAGE_KEY = 'aditi-news-sources';

export function getRegisteredNewsSources(): NewsSource[] {
  try {
    const raw = localStorage.getItem(SOURCES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...INITIAL_NEWS_SOURCES];
}

export function saveNewsSources(sources: NewsSource[]): void {
  try {
    localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(sources));
  } catch {}
}

export function toggleNewsSource(sourceId: string, active: boolean): NewsSource[] {
  const sources = getRegisteredNewsSources();
  const updated = sources.map(s => s.id === sourceId ? { ...s, active, updatedAt: new Date().toISOString() } : s);
  saveNewsSources(updated);
  return updated;
}

export function updateSourceTrustScore(sourceId: string, newScore: number, reason: string): NewsSource[] {
  const clampedScore = Math.min(100, Math.max(0, newScore));
  const sources = getRegisteredNewsSources();
  const updated = sources.map(s => {
    if (s.id === sourceId) {
      return {
        ...s,
        reliabilityScore: clampedScore,
        updatedAt: new Date().toISOString()
      };
    }
    return s;
  });
  saveNewsSources(updated);
  return updated;
}
