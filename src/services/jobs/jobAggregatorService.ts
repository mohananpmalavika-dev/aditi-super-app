/**
 * Multi-Source Job Aggregator Service
 * Orchestrates high-throughput, paginated ingestion across India's National Career Service (NCS),
 * Jooble, Adzuna, State Employment Portals, and Corporate ATS feeds with deduplication, normalization,
 * and sync run logging.
 */

import { JobVacancy, ImportedJob, JobSyncRun, JobSyncConfig } from '../../types/superApp';
import { 
  getRegisteredJobSources, 
  updateSourceSyncStats, 
  getJobSyncConfig, 
  recordJobSyncRun 
} from './jobSourceService';
import { NCSSourceAdapter } from './sources/ncsSource';
import { JoobleSourceAdapter } from './sources/joobleSource';
import { AdzunaSourceAdapter } from './sources/adzunaSource';
import { StateEmploymentSourceAdapter } from './sources/stateEmploymentSource';
import { CompanyCareerSourceAdapter } from './sources/companyCareerSource';
import { JobSourceAdapter } from './jobAdapterInterface';
import { normalizeImportedJobToVacancy } from './jobNormalizer';
import { deduplicateAndMergeJobs } from './jobDeduplicationService';

export interface AggregationSyncResult {
  totalImported: number;
  mergedDuplicates: number;
  activeCount: number;
  pagesScannedTotal: number;
  unifiedJobs: JobVacancy[];
  sourcesSynced: string[];
  syncTimestamp: string;
  runs: JobSyncRun[];
}

export interface SyncOptions {
  targetSourceId?: string;
  isFullSync?: boolean;
  overrideConfig?: Partial<JobSyncConfig>;
}

/**
 * Returns registered adapter for a given source ID or source type
 */
export function getAdapterForSource(sourceId: string, sourceType?: string): JobSourceAdapter | null {
  if (sourceId === 'src-ncs-india' || sourceType === 'government') {
    return new NCSSourceAdapter();
  }
  if (sourceId === 'src-jooble-in') {
    return new JoobleSourceAdapter();
  }
  if (sourceId === 'src-adzuna-in') {
    return new AdzunaSourceAdapter();
  }
  if (sourceId === 'src-state-portals' || sourceType === 'state_portal' || sourceId.startsWith('src-state-')) {
    return new StateEmploymentSourceAdapter();
  }
  if (sourceId === 'src-corporate-careers' || sourceType === 'company_career' || sourceId.startsWith('src-corp-')) {
    return new CompanyCareerSourceAdapter();
  }
  return null;
}

/**
 * Runs multi-source job ingestion with full pagination loops and queue-based processing
 */
export async function runJobAggregationSync(options: SyncOptions = {}): Promise<AggregationSyncResult> {
  const config = { ...getJobSyncConfig(), ...options.overrideConfig };
  const sources = getRegisteredJobSources();
  const activeSources = options.targetSourceId 
    ? sources.filter(s => s.id === options.targetSourceId)
    : sources.filter(s => s.isActive);

  const rawDiscoveredJobs: ImportedJob[] = [];
  const sourcesSynced: string[] = [];
  const syncRuns: JobSyncRun[] = [];
  let totalPagesScannedAcrossAll = 0;

  for (const source of activeSources) {
    const runStartTime = Date.now();
    const runId = `run-${source.id}-${Date.now()}`;
    const adapter = getAdapterForSource(source.id, source.type);

    if (!adapter) {
      continue;
    }

    sourcesSynced.push(source.name);

    let pagesScanned = 0;
    let sourceJobsDiscovered = 0;
    let errorsCount = 0;
    const errorDetails: string[] = [];
    const sourceDiscoveredJobs: ImportedJob[] = [];

    let currentPage = 1;
    const maxPages = options.isFullSync ? (config.maxPagesPerRun * 2) : config.maxPagesPerRun;
    const maxJobs = options.isFullSync ? (config.maxJobsPerRun * 2) : config.maxJobsPerRun;

    // Multi-page harvest loop
    while (currentPage <= maxPages && sourceDiscoveredJobs.length < maxJobs) {
      try {
        const pageResult = await adapter.searchJobs({
          page: currentPage,
          pageSize: config.pageSize
        });

        pagesScanned++;
        totalPagesScannedAcrossAll++;

        if (Array.isArray(pageResult.jobs) && pageResult.jobs.length > 0) {
          sourceDiscoveredJobs.push(...pageResult.jobs);
          sourceJobsDiscovered += pageResult.jobs.length;
        }

        if (!pageResult.hasNextPage || pageResult.jobs.length === 0) {
          break;
        }

        currentPage++;
      } catch (err: any) {
        errorsCount++;
        errorDetails.push(`Page ${currentPage} failed: ${err?.message || 'Network error'}`);
        // Resilient: increment and continue to next page unless 3 consecutive errors
        if (errorsCount >= 3) {
          break;
        }
        currentPage++;
      }
    }

    rawDiscoveredJobs.push(...sourceDiscoveredJobs);
    updateSourceSyncStats(source.id, sourceDiscoveredJobs.length, sourceDiscoveredJobs.length);

    const completedTime = Date.now();
    const syncRun: JobSyncRun = {
      id: runId,
      sourceId: source.id,
      sourceName: source.name,
      startedAt: new Date(runStartTime).toISOString(),
      completedAt: new Date(completedTime).toISOString(),
      status: errorsCount === 0 ? 'completed' : (sourceJobsDiscovered > 0 ? 'partial' : 'failed'),
      pagesScanned,
      jobsDiscovered: sourceJobsDiscovered,
      jobsInserted: sourceJobsDiscovered,
      jobsUpdated: 0,
      jobsExpired: 0,
      duplicates: 0,
      errors: errorsCount,
      durationMs: completedTime - runStartTime,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined
    };

    syncRuns.push(syncRun);
    recordJobSyncRun(syncRun);
  }

  // 1. Normalization Queue
  const normalizedJobs = rawDiscoveredJobs.map(normalizeImportedJobToVacancy);

  // 2. Deduplication Queue (Preserves seniority, location, and salary distinctions)
  const { unifiedJobs, mergedDuplicateCount } = deduplicateAndMergeJobs(normalizedJobs);

  return {
    totalImported: rawDiscoveredJobs.length,
    mergedDuplicates: mergedDuplicateCount,
    activeCount: unifiedJobs.length,
    pagesScannedTotal: totalPagesScannedAcrossAll,
    unifiedJobs,
    sourcesSynced,
    syncTimestamp: new Date().toISOString(),
    runs: syncRuns
  };
}
