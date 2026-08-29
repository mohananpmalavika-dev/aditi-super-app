/**
 * Multi-Source Job Aggregator Service
 * Orchestrates ingestion across India's National Career Service (NCS), Jooble, Adzuna,
 * State Employment Exchanges, and Corporate ATS feeds with deduplication and normalization.
 */

import { JobVacancy, JobSource } from '../../types/superApp';
import { getRegisteredJobSources, updateSourceSyncStats } from './jobSourceService';
import { fetchNCSJobs } from './sources/ncsSource';
import { fetchJoobleJobs } from './sources/joobleSource';
import { fetchAdzunaJobs } from './sources/adzunaSource';
import { fetchStateEmploymentJobs } from './sources/stateEmploymentSource';
import { fetchCorporateCareerJobs } from './sources/companyCareerSource';
import { normalizeImportedJobToVacancy } from './jobNormalizer';
import { deduplicateAndMergeJobs } from './jobDeduplicationService';

export interface AggregationSyncResult {
  totalImported: number;
  mergedDuplicates: number;
  activeCount: number;
  unifiedJobs: JobVacancy[];
  sourcesSynced: string[];
  syncTimestamp: string;
}

export async function runJobAggregationSync(targetSourceId?: string): Promise<AggregationSyncResult> {
  const sources = getRegisteredJobSources();
  const activeSources = targetSourceId 
    ? sources.filter(s => s.id === targetSourceId)
    : sources.filter(s => s.isActive);

  const rawNormalizedJobs: JobVacancy[] = [];
  const sourcesSynced: string[] = [];

  for (const source of activeSources) {
    try {
      sourcesSynced.push(source.name);

      if (source.id === 'src-ncs-india') {
        const ncsJobs = await fetchNCSJobs();
        const normalized = ncsJobs.map(normalizeImportedJobToVacancy);
        rawNormalizedJobs.push(...normalized);
        updateSourceSyncStats(source.id, ncsJobs.length, ncsJobs.length);
      } else if (source.id === 'src-jooble-in') {
        const joobleJobs = await fetchJoobleJobs();
        const normalized = joobleJobs.map(normalizeImportedJobToVacancy);
        rawNormalizedJobs.push(...normalized);
        updateSourceSyncStats(source.id, joobleJobs.length, joobleJobs.length);
      } else if (source.id === 'src-adzuna-in') {
        const adzunaJobs = await fetchAdzunaJobs();
        const normalized = adzunaJobs.map(normalizeImportedJobToVacancy);
        rawNormalizedJobs.push(...normalized);
        updateSourceSyncStats(source.id, adzunaJobs.length, adzunaJobs.length);
      } else if (source.type === 'state_portal') {
        const stateJobs = await fetchStateEmploymentJobs({ state: source.state });
        const normalized = stateJobs.map(normalizeImportedJobToVacancy);
        rawNormalizedJobs.push(...normalized);
        updateSourceSyncStats(source.id, stateJobs.length, stateJobs.length);
      } else if (source.type === 'company_career') {
        const corpJobs = await fetchCorporateCareerJobs();
        const normalized = corpJobs.map(normalizeImportedJobToVacancy);
        rawNormalizedJobs.push(...normalized);
        updateSourceSyncStats(source.id, corpJobs.length, corpJobs.length);
      }
    } catch (err) {
      console.warn(`Failed to sync source ${source.name}:`, err);
    }
  }

  // Deduplicate and merge multi-source listings
  const { unifiedJobs, mergedDuplicateCount } = deduplicateAndMergeJobs(rawNormalizedJobs);

  return {
    totalImported: rawNormalizedJobs.length,
    mergedDuplicates: mergedDuplicateCount,
    activeCount: unifiedJobs.length,
    unifiedJobs,
    sourcesSynced,
    syncTimestamp: new Date().toISOString()
  };
}
