/**
 * Job Source Adapter Interface
 * Universal contract for all official Indian government sources, aggregator APIs,
 * state employment portals, and corporate ATS career feeds.
 */

import { ImportedJob, JobSearchParams, JobSourceResult, JobSourceType } from '../../types/superApp';

export interface JobSourceAdapter {
  getSourceId(): string;
  getSourceName(): string;
  getSourceType(): JobSourceType;
  
  /**
   * Search and retrieve paginated jobs from the source
   */
  searchJobs(params: JobSearchParams): Promise<JobSourceResult>;

  /**
   * Optional drilldown for full job details if teaser feed is returned
   */
  fetchJobDetails?(externalJobId: string): Promise<ImportedJob | null>;

  /**
   * Declares whether the source supports multi-page pagination
   */
  supportsPagination(): boolean;

  /**
   * Declares whether the source supports incremental sync via timestamps
   */
  supportsIncrementalSync(): boolean;
}
