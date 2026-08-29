/**
 * Job Source Registry Service
 * Manages official government sources, aggregator APIs, state portals, and corporate ATS feeds
 */

import { JobSource } from '../../types/superApp';

export const INITIAL_JOB_SOURCES: JobSource[] = [
  {
    id: 'src-ncs-india',
    name: 'National Career Service (NCS - Govt of India)',
    type: 'government',
    country: 'India',
    baseUrl: 'https://www.ncs.gov.in',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 360, // 6 Hours
    totalImported: 4,
    totalActive: 4,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Connected & syncing active government public sector vacancies'
  },
  {
    id: 'src-jooble-in',
    name: 'Jooble Jobs India',
    type: 'aggregator_api',
    country: 'India',
    baseUrl: 'https://in.jooble.org',
    apiUrl: 'https://jooble.org/api/',
    isActive: true,
    requiresApiKey: true,
    apiKeyEnvVar: 'VITE_JOOBLE_API_KEY',
    syncIntervalMinutes: 720, // 12 Hours
    totalImported: 3,
    totalActive: 3,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Active API aggregator connection'
  },
  {
    id: 'src-adzuna-in',
    name: 'Adzuna Jobs India',
    type: 'aggregator_api',
    country: 'India',
    baseUrl: 'https://www.adzuna.in',
    apiUrl: 'https://api.adzuna.com/v1/api/jobs/in',
    isActive: true,
    requiresApiKey: true,
    apiKeyEnvVar: 'VITE_ADZUNA_API_KEY',
    syncIntervalMinutes: 720,
    totalImported: 2,
    totalActive: 2,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Active API partner connection'
  },
  {
    id: 'src-state-kerala',
    name: 'Kerala State Employment Department (Niyukthi)',
    type: 'state_portal',
    country: 'India',
    state: 'Kerala',
    baseUrl: 'https://employmentkerala.gov.in',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440, // 24 Hours
    totalImported: 1,
    totalActive: 1,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'State exchange feed online'
  },
  {
    id: 'src-state-karnataka',
    name: 'Karnataka Kaushalkar / Employment Exchange',
    type: 'state_portal',
    country: 'India',
    state: 'Karnataka',
    baseUrl: 'https://kaushalkar.karnataka.gov.in',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440,
    totalImported: 1,
    totalActive: 1,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'State exchange feed online'
  },
  {
    id: 'src-state-maharashtra',
    name: 'Maharashtra Mahaswayam Employment Exchange',
    type: 'state_portal',
    country: 'India',
    state: 'Maharashtra',
    baseUrl: 'https://mahaswayam.gov.in',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440,
    totalImported: 1,
    totalActive: 1,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'State exchange feed online'
  },
  {
    id: 'src-corp-tcs',
    name: 'Tata Consultancy Services (TCS iBegin)',
    type: 'company_career',
    country: 'India',
    baseUrl: 'https://ibegin.tcs.com',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440,
    totalImported: 1,
    totalActive: 1,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Official corporate career feed active'
  },
  {
    id: 'src-corp-infosys',
    name: 'Infosys Careers Portal',
    type: 'company_career',
    country: 'India',
    baseUrl: 'https://career.infosys.com',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440,
    totalImported: 1,
    totalActive: 1,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Official corporate career feed active'
  },
  {
    id: 'src-corp-wipro',
    name: 'Wipro Careers Portal',
    type: 'company_career',
    country: 'India',
    baseUrl: 'https://careers.wipro.com',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440,
    totalImported: 1,
    totalActive: 1,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Official corporate career feed active'
  }
];

const JOB_SOURCES_STORAGE_KEY = 'aditi-job-sources';

export function getRegisteredJobSources(): JobSource[] {
  try {
    const saved = localStorage.getItem(JOB_SOURCES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...INITIAL_JOB_SOURCES];
}

export function saveJobSources(sources: JobSource[]): void {
  try {
    localStorage.setItem(JOB_SOURCES_STORAGE_KEY, JSON.stringify(sources));
  } catch {}
}

export function toggleJobSourceStatus(sourceId: string, isActive: boolean): JobSource[] {
  const sources = getRegisteredJobSources();
  const updated = sources.map(s => s.id === sourceId ? { ...s, isActive } : s);
  saveJobSources(updated);
  return updated;
}

export function updateSourceSyncStats(sourceId: string, importedCount: number, activeCount: number): JobSource[] {
  const sources = getRegisteredJobSources();
  const now = new Date().toISOString();
  const updated = sources.map(s => {
    if (s.id === sourceId) {
      return {
        ...s,
        totalImported: s.totalImported + importedCount,
        totalActive: activeCount,
        lastSyncAt: now
      };
    }
    return s;
  });
  saveJobSources(updated);
  return updated;
}
