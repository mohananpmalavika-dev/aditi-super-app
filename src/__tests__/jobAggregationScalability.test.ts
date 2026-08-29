import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getRegisteredJobSources, 
  getJobSyncConfig, 
  saveJobSyncConfig, 
  getJobSyncRuns,
  recordJobSyncRun
} from '../services/jobs/jobSourceService';
import { runJobAggregationSync } from '../services/jobs/jobAggregatorService';
import { NCSSourceAdapter } from '../services/jobs/sources/ncsSource';
import { JoobleSourceAdapter } from '../services/jobs/sources/joobleSource';
import { AdzunaSourceAdapter } from '../services/jobs/sources/adzunaSource';
import { StateEmploymentSourceAdapter } from '../services/jobs/sources/stateEmploymentSource';
import { CompanyCareerSourceAdapter } from '../services/jobs/sources/companyCareerSource';
import { generateJobFingerprint, deduplicateAndMergeJobs } from '../services/jobs/jobDeduplicationService';
import { paginateJobs, filterPanIndiaJobs } from '../services/jobs/jobSearchService';
import { JobVacancy, JobSyncRun } from '../types/superApp';

describe('Scalable Pan-India Job Aggregation & Pagination Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Multi-Page Source Adapter Pagination Contracts', () => {
    it('NCSSourceAdapter supports multi-page pagination and returns hasNextPage', async () => {
      const adapter = new NCSSourceAdapter();
      expect(adapter.supportsPagination()).toBe(true);

      const page1 = await adapter.searchJobs({ page: 1, pageSize: 4 });
      expect(page1.jobs.length).toBe(4);
      expect(page1.hasNextPage).toBe(true);
      expect(page1.totalAvailable).toBeGreaterThan(4);

      const page2 = await adapter.searchJobs({ page: 2, pageSize: 4 });
      expect(page2.jobs.length).toBe(4);
      expect(page2.jobs[0].id).not.toBe(page1.jobs[0].id);
    });

    it('JoobleSourceAdapter paginates across multi-metro India tech hubs', async () => {
      const adapter = new JoobleSourceAdapter();
      expect(adapter.supportsPagination()).toBe(true);

      const page1 = await adapter.searchJobs({ page: 1, pageSize: 3 });
      expect(page1.jobs.length).toBe(3);
      expect(page1.hasNextPage).toBe(true);

      const page2 = await adapter.searchJobs({ page: 2, pageSize: 3 });
      expect(page2.jobs.length).toBe(3);
      expect(page2.jobs[0].id).not.toBe(page1.jobs[0].id);
    });

    it('AdzunaSourceAdapter paginates across Finance, AI, and Engineering categories', async () => {
      const adapter = new AdzunaSourceAdapter();
      const page1 = await adapter.searchJobs({ page: 1, pageSize: 2 });
      expect(page1.jobs.length).toBe(2);
      expect(page1.hasNextPage).toBe(true);

      const page2 = await adapter.searchJobs({ page: 2, pageSize: 2 });
      expect(page2.jobs.length).toBe(2);
    });

    it('StateEmploymentSourceAdapter paginates across all Indian state exchanges', async () => {
      const adapter = new StateEmploymentSourceAdapter();
      const page1 = await adapter.searchJobs({ page: 1, pageSize: 3 });
      expect(page1.jobs.length).toBe(3);
      expect(page1.hasNextPage).toBe(true);
      expect(page1.totalAvailable).toBeGreaterThanOrEqual(10);
    });

    it('CompanyCareerSourceAdapter paginates across top corporate ATS feeds', async () => {
      const adapter = new CompanyCareerSourceAdapter();
      const page1 = await adapter.searchJobs({ page: 1, pageSize: 3 });
      expect(page1.jobs.length).toBe(3);
      expect(page1.hasNextPage).toBe(true);
      expect(page1.totalAvailable).toBeGreaterThanOrEqual(8);
    });
  });

  describe('2. Multi-Signal Deduplication Safeguards (No Over-Deduplication)', () => {
    it('does NOT merge jobs with the same title in different cities', () => {
      const fpKochi = generateJobFingerprint('ABC Technologies', 'Software Engineer', 'Kochi');
      const fpBangalore = generateJobFingerprint('ABC Technologies', 'Software Engineer', 'Bengaluru');
      expect(fpKochi).not.toBe(fpBangalore);
    });

    it('does NOT merge jobs with different seniority levels at the same company and city', () => {
      const fpSenior = generateJobFingerprint('Infosys', 'Senior React Developer', 'Bengaluru');
      const fpJunior = generateJobFingerprint('Infosys', 'Junior React Developer', 'Bengaluru');
      const fpLead = generateJobFingerprint('Infosys', 'Lead React Developer', 'Bengaluru');

      expect(fpSenior).not.toBe(fpJunior);
      expect(fpSenior).not.toBe(fpLead);
      expect(fpJunior).not.toBe(fpLead);
    });

    it('does NOT merge vacancies with drastically different salary brackets', () => {
      const fpLow = generateJobFingerprint('TCS', 'Cloud Architect', 'Kochi', undefined, 35000);
      const fpHigh = generateJobFingerprint('TCS', 'Cloud Architect', 'Kochi', undefined, 150000);
      expect(fpLow).not.toBe(fpHigh);
    });
  });

  describe('3. End-to-End Aggregation Pipeline with Configurable Limits', () => {
    it('runs multi-page harvest discovering substantial vacancies across all active sources', async () => {
      const syncResult = await runJobAggregationSync({
        overrideConfig: {
          pageSize: 4,
          maxPagesPerRun: 5,
          maxJobsPerRun: 100
        }
      });

      expect(syncResult.pagesScannedTotal).toBeGreaterThan(5);
      expect(syncResult.totalImported).toBeGreaterThanOrEqual(25);
      expect(syncResult.activeCount).toBeGreaterThanOrEqual(20);
      expect(syncResult.runs.length).toBeGreaterThanOrEqual(5);

      // Verify sync runs have zero fatal unhandled errors
      syncResult.runs.forEach(run => {
        expect(['completed', 'partial']).toContain(run.status);
        expect(run.pagesScanned).toBeGreaterThan(0);
        expect(run.jobsDiscovered).toBeGreaterThan(0);
        expect(run.durationMs).toBeGreaterThanOrEqual(0);
      });
    });

    it('persists and retrieves configurable sync limits', () => {
      const updated = saveJobSyncConfig({
        pageSize: 50,
        maxPagesPerRun: 20,
        maxJobsPerRun: 1000
      });
      expect(updated.pageSize).toBe(50);
      expect(updated.maxPagesPerRun).toBe(20);
      expect(updated.maxJobsPerRun).toBe(1000);

      const reloaded = getJobSyncConfig();
      expect(reloaded.pageSize).toBe(50);
      expect(reloaded.maxJobsPerRun).toBe(1000);
    });
  });

  describe('4. Pan-India State, Sector, and Remote Coverage', () => {
    it('covers all major Indian States and sectors in aggregated listings', async () => {
      const syncResult = await runJobAggregationSync({ isFullSync: true });
      const statesDiscovered = new Set(syncResult.unifiedJobs.map(j => j.state).filter(Boolean));

      expect(statesDiscovered.has('Kerala')).toBe(true);
      expect(statesDiscovered.has('Karnataka')).toBe(true);
      expect(statesDiscovered.has('Tamil Nadu')).toBe(true);
      expect(statesDiscovered.has('Maharashtra')).toBe(true);
      expect(statesDiscovered.has('Telangana')).toBe(true);
      expect(statesDiscovered.has('Delhi')).toBe(true);

      const remoteJobs = syncResult.unifiedJobs.filter(j => j.isRemote || j.workMode === 'remote');
      expect(remoteJobs.length).toBeGreaterThan(0);

      const categories = new Set(syncResult.unifiedJobs.map(j => j.category));
      expect(categories.has('Technology & IT')).toBe(true);
      expect(categories.has('Healthcare & Nursing')).toBe(true);
      expect(categories.has('Finance & Accounting')).toBe(true);
      expect(categories.has('Local Trades & Skilled Labor')).toBe(true);
    });
  });

  describe('5. Frontend Pagination Helper', () => {
    it('slices large job databases into clean paginated chunks', () => {
      const dummyJobs: JobVacancy[] = Array.from({ length: 45 }, (_, i) => ({
        id: `job-${i}`,
        title: `Job ${i}`,
        company: 'Company',
        category: 'Technology & IT',
        jobType: 'Full-time',
        location: 'Bengaluru, Karnataka',
        city: 'Bengaluru',
        salaryFormatted: '₹10 LPA',
        experienceRequired: '1 Year',
        qualificationRequired: 'B.Tech',
        description: 'Test',
        skills: ['JS'],
        contactName: 'HR',
        openingsCount: 1
      }));

      const page1 = paginateJobs(dummyJobs, 1, 10);
      expect(page1.jobs).toHaveLength(10);
      expect(page1.totalMatches).toBe(45);
      expect(page1.totalPages).toBe(5);
      expect(page1.page).toBe(1);

      const page5 = paginateJobs(dummyJobs, 5, 10);
      expect(page5.jobs).toHaveLength(5);
      expect(page5.page).toBe(5);
    });
  });
});
