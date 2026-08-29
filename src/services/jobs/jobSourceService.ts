/**
 * Job Source Registry & Configuration Service
 * Manages official government sources, aggregator APIs, state portals, and corporate ATS feeds
 * Handles sync configurations and run history logs.
 */

import { JobSource, JobSyncConfig, JobSyncRun } from '../../types/superApp';

export const DEFAULT_JOB_SYNC_CONFIG: JobSyncConfig = {
  pageSize: 20,
  maxPagesPerRun: 10,
  maxJobsPerRun: 200,
  concurrency: 4,
  staleAfterHours: 48,
  expireAfterHours: 168 // 7 Days
};

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
    totalImported: 12,
    totalActive: 12,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Connected & syncing active government public sector vacancies across all Indian States'
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
    totalImported: 8,
    totalActive: 8,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Active API aggregator connection with multi-metro pagination'
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
    totalImported: 6,
    totalActive: 6,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Active API partner connection for classified Indian metropolitan sectors'
  },
  {
    id: 'src-state-portals',
    name: 'State Employment Portals & Exchanges',
    type: 'state_portal',
    country: 'India',
    baseUrl: 'https://employmentkerala.gov.in',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440, // 24 Hours
    totalImported: 10,
    totalActive: 10,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Multi-state exchange feeds active (Kerala, Karnataka, Maharashtra, TN, Telangana, Delhi, Gujarat)'
  },
  {
    id: 'src-corporate-careers',
    name: 'Corporate Career Portals (TCS, Infosys, Wipro, Accenture)',
    type: 'company_career',
    country: 'India',
    baseUrl: 'https://ibegin.tcs.com',
    isActive: true,
    requiresApiKey: false,
    syncIntervalMinutes: 1440,
    totalImported: 8,
    totalActive: 8,
    lastSyncAt: new Date().toISOString(),
    statusMessage: 'Official corporate ATS feeds active for top technology and banking employers'
  }
];

const JOB_SOURCES_STORAGE_KEY = 'aditi-job-sources';
const JOB_SYNC_CONFIG_STORAGE_KEY = 'aditi-job-sync-config';
const JOB_SYNC_RUNS_STORAGE_KEY = 'aditi-job-sync-runs';

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
      const nextSync = new Date(Date.now() + (s.syncIntervalMinutes || 360) * 60 * 1000).toISOString();
      return {
        ...s,
        totalImported: (s.totalImported || 0) + importedCount,
        totalActive: activeCount,
        lastSyncAt: now,
        nextSyncAt: nextSync
      };
    }
    return s;
  });
  saveJobSources(updated);
  return updated;
}

export function getJobSyncConfig(): JobSyncConfig {
  try {
    const saved = localStorage.getItem(JOB_SYNC_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_JOB_SYNC_CONFIG, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_JOB_SYNC_CONFIG };
}

export function saveJobSyncConfig(config: Partial<JobSyncConfig>): JobSyncConfig {
  const current = getJobSyncConfig();
  const updated: JobSyncConfig = { ...current, ...config };
  try {
    localStorage.setItem(JOB_SYNC_CONFIG_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

export function getJobSyncRuns(): JobSyncRun[] {
  try {
    const saved = localStorage.getItem(JOB_SYNC_RUNS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {}
  return [];
}

export function recordJobSyncRun(run: JobSyncRun): void {
  try {
    const runs = getJobSyncRuns();
    const updated = [run, ...runs.filter(r => r.id !== run.id)].slice(0, 50); // Keep last 50 runs
    localStorage.setItem(JOB_SYNC_RUNS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}
