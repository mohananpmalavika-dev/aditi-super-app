import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getRegisteredJobSources, 
  toggleJobSourceStatus, 
  updateSourceSyncStats, 
  INITIAL_JOB_SOURCES 
} from '../services/jobs/jobSourceService';
import { 
  normalizeJobTitle, 
  detectIndianLocation, 
  normalizeSalary, 
  normalizeImportedJobToVacancy 
} from '../services/jobs/jobNormalizer';
import { 
  generateJobFingerprint, 
  deduplicateAndMergeJobs 
} from '../services/jobs/jobDeduplicationService';
import { filterPanIndiaJobs } from '../services/jobs/jobSearchService';
import { runJobAggregationSync } from '../services/jobs/jobAggregatorService';
import { fetchNCSJobs } from '../services/jobs/sources/ncsSource';
import { fetchJoobleJobs } from '../services/jobs/sources/joobleSource';
import { fetchAdzunaJobs } from '../services/jobs/sources/adzunaSource';
import { fetchStateEmploymentJobs } from '../services/jobs/sources/stateEmploymentSource';
import { fetchCorporateCareerJobs } from '../services/jobs/sources/companyCareerSource';
import { ImportedJob, JobVacancy } from '../types/superApp';

describe('Pan-India Multi-Source Job Aggregation Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Job Source Registry & Status Management', () => {
    it('initializes with official Indian data sources (NCS, State Portals, Aggregators, MNCs)', () => {
      const sources = getRegisteredJobSources();
      expect(sources.length).toBeGreaterThanOrEqual(9);
      expect(sources.some(s => s.id === 'src-ncs-india')).toBe(true);
      expect(sources.some(s => s.type === 'government')).toBe(true);
      expect(sources.some(s => s.type === 'aggregator_api')).toBe(true);
      expect(sources.some(s => s.type === 'company_career')).toBe(true);
      expect(sources.some(s => s.type === 'state_portal')).toBe(true);
    });

    it('toggles source active status correctly and persists to storage', () => {
      const updated = toggleJobSourceStatus('src-ncs-india', false);
      const ncs = updated.find(s => s.id === 'src-ncs-india');
      expect(ncs?.isActive).toBe(false);

      const reloaded = getRegisteredJobSources();
      expect(reloaded.find(s => s.id === 'src-ncs-india')?.isActive).toBe(false);
    });

    it('updates source sync metrics and timestamp', () => {
      const updated = updateSourceSyncStats('src-jooble-in', 5, 5);
      const jooble = updated.find(s => s.id === 'src-jooble-in');
      expect(jooble?.totalActive).toBe(5);
      expect(jooble?.lastSyncAt).toBeDefined();
    });
  });

  describe('2. Source Adapters Ingestion', () => {
    it('fetches verified vacancies from National Career Service (NCS - Govt of India)', async () => {
      const jobs = await fetchNCSJobs();
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].sourceType).toBe('government');
      expect(jobs[0].externalUrl).toContain('ncs.gov.in');
      expect(jobs[0].company).toBeDefined();
    });

    it('fetches aggregated vacancies from Jooble India API adapter', async () => {
      const jobs = await fetchJoobleJobs();
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].sourceType).toBe('aggregator_api');
      expect(jobs[0].externalUrl).toContain('jooble.org');
    });

    it('fetches aggregated vacancies from Adzuna India API adapter', async () => {
      const jobs = await fetchAdzunaJobs();
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].sourceType).toBe('aggregator_api');
      expect(jobs[0].externalUrl).toContain('adzuna.in');
    });

    it('fetches state employment exchange vacancies (Kerala, Karnataka, Maharashtra)', async () => {
      const jobs = await fetchStateEmploymentJobs({ state: 'Kerala' });
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].sourceType).toBe('state_portal');
      expect(jobs.some(j => j.state === 'Kerala')).toBe(true);
    });

    it('fetches corporate career ATS listings (TCS, Infosys, Wipro)', async () => {
      const jobs = await fetchCorporateCareerJobs();
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].sourceType).toBe('company_career');
      expect(jobs.some(j => j.company.includes('Tata Consultancy Services'))).toBe(true);
    });
  });

  describe('3. Normalization Engine', () => {
    it('normalizes abbreviated Indian job titles', () => {
      expect(normalizeJobTitle('Sr. React Dev.')).toBe('Senior React Developer');
      expect(normalizeJobTitle('Jr. Electrical Engg.')).toBe('Junior Electrical Engineer');
      expect(normalizeJobTitle('Tech. Asst. Mgr.')).toBe('Technician Assistant Manager');
    });

    it('detects Indian States, Cities, and Remote flags from location strings', () => {
      const loc1 = detectIndianLocation('Bengaluru, Karnataka');
      expect(loc1.state).toBe('Karnataka');
      expect(loc1.city).toBe('Bengaluru');
      expect(loc1.isRemote).toBe(false);

      const loc2 = detectIndianLocation('Kochi / Remote, Kerala');
      expect(loc2.state).toBe('Kerala');
      expect(loc2.city).toBe('Kochi');
      expect(loc2.isRemote).toBe(true);

      const loc3 = detectIndianLocation('Anywhere in India (Work From Home)');
      expect(loc3.isRemote).toBe(true);
    });

    it('normalizes salary figures into formatted LPA or monthly strings', () => {
      const salLPA = normalizeSalary(1200000, 1800000);
      expect(salLPA.formatted).toBe('₹12 - ₹18 LPA');

      const salMonthly = normalizeSalary(35000, 50000);
      expect(salMonthly.formatted).toBe('₹35,000 - ₹50,000 / mo');

      const salText = normalizeSalary(undefined, undefined, '₹45,000 / mo + Central DA');
      expect(salText.formatted).toBe('₹45,000 / mo + Central DA');
    });

    it('converts an ImportedJob into a unified JobVacancy with source attribution', () => {
      const imported: ImportedJob = {
        id: 'imp-ncs-test-1',
        sourceId: 'src-ncs-india',
        sourceName: 'National Career Service (NCS)',
        sourceType: 'government',
        externalJobId: 'NCS-999',
        externalUrl: 'https://www.ncs.gov.in/job/999',
        title: 'Sr. Cloud Architect',
        company: 'ECIL Govt of India',
        location: 'Hyderabad, Telangana',
        city: 'Hyderabad',
        state: 'Telangana',
        salaryMin: 60000,
        salaryMax: 90000,
        skills: ['AWS', 'Kubernetes'],
        importedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        status: 'active',
        fingerprint: 'ecilgovtofindia_cloudarchitect_hyderabad'
      };

      const vacancy = normalizeImportedJobToVacancy(imported);
      expect(vacancy.title).toBe('Senior Cloud Architect');
      expect(vacancy.applyMode).toBe('external_redirect');
      expect(vacancy.canonicalApplyUrl).toBe('https://www.ncs.gov.in/job/999');
      expect(vacancy.primarySource).toBe('National Career Service (NCS)');
      expect(vacancy.sources).toHaveLength(1);
    });
  });

  describe('4. Deduplication & Multi-Source Attribution Engine', () => {
    it('generates consistent deterministic fingerprints', () => {
      const fp1 = generateJobFingerprint('Tata Consultancy Services Pvt Ltd', 'Senior Software Engineer', 'Kochi');
      const fp2 = generateJobFingerprint('Tata Consultancy Services', 'Software Engineer', 'Kochi');
      expect(fp1).toBe(fp2);
    });

    it('collapses duplicates from multiple sources and merges attribution badges', () => {
      const jobFromCareerSite: JobVacancy = {
        id: 'job-tcs-corp',
        title: 'Software Engineer',
        company: 'Tata Consultancy Services',
        category: 'Technology & IT',
        jobType: 'Full-time',
        location: 'Kochi, Kerala',
        city: 'Kochi',
        state: 'Kerala',
        salaryFormatted: '₹8 - ₹12 LPA',
        experienceRequired: '2-4 Years',
        qualificationRequired: 'B.Tech',
        description: 'TCS direct listing',
        skills: ['Java', 'Spring Boot'],
        contactName: 'TCS Talent Desk',
        openingsCount: 5,
        sourceType: 'company_career',
        primarySource: 'TCS Official Careers',
        canonicalApplyUrl: 'https://ibegin.tcs.com/jobs/1',
        applyMode: 'external_redirect',
        fingerprint: 'tataconsultancy_softwareengineer_kochi',
        sources: [
          {
            sourceId: 'src-corp-tcs',
            sourceName: 'TCS Official Careers',
            sourceType: 'company_career',
            sourceUrl: 'https://ibegin.tcs.com/jobs/1',
            verified: true,
            discoveredAt: '2026-08-29'
          }
        ]
      };

      const jobFromJooble: JobVacancy = {
        id: 'job-tcs-jooble',
        title: 'Software Engineer',
        company: 'Tata Consultancy Services Ltd',
        category: 'Technology & IT',
        jobType: 'Full-time',
        location: 'Kochi, Kerala',
        city: 'Kochi',
        state: 'Kerala',
        salaryFormatted: '₹8 - ₹12 LPA',
        experienceRequired: '2-4 Years',
        qualificationRequired: 'B.Tech',
        description: 'TCS listing on Jooble',
        skills: ['Java', 'Spring Boot'],
        contactName: 'HR Recruiter',
        openingsCount: 1,
        sourceType: 'aggregator_api',
        primarySource: 'Jooble India',
        canonicalApplyUrl: 'https://in.jooble.org/desc/1',
        applyMode: 'external_redirect',
        fingerprint: 'tataconsultancy_softwareengineer_kochi',
        sources: [
          {
            sourceId: 'src-jooble-in',
            sourceName: 'Jooble Jobs India',
            sourceType: 'aggregator_api',
            sourceUrl: 'https://in.jooble.org/desc/1',
            verified: true,
            discoveredAt: '2026-08-29'
          }
        ]
      };

      const { unifiedJobs, mergedDuplicateCount } = deduplicateAndMergeJobs([jobFromCareerSite, jobFromJooble]);

      expect(unifiedJobs).toHaveLength(1);
      expect(mergedDuplicateCount).toBe(1);
      expect(unifiedJobs[0].sources).toHaveLength(2);
      // Corporate career apply URL is preferred over aggregator URL
      expect(unifiedJobs[0].canonicalApplyUrl).toBe('https://ibegin.tcs.com/jobs/1');
    });
  });

  describe('5. Pan-India Search & Multi-Faceted Filters', () => {
    const mockJobs: JobVacancy[] = [
      {
        id: '1',
        title: 'Senior React Developer',
        company: 'Razorpay',
        category: 'Technology & IT',
        jobType: 'Full-time',
        location: 'Bengaluru, Karnataka',
        city: 'Bengaluru',
        state: 'Karnataka',
        salaryMin: 1400000,
        salaryMax: 2000000,
        salaryFormatted: '₹14 - ₹20 LPA',
        experienceRequired: '3-5 Years',
        qualificationRequired: 'B.Tech',
        description: 'Fintech checkout SDK',
        skills: ['React', 'TypeScript', 'Node.js'],
        contactName: 'Talent Desk',
        openingsCount: 2,
        sourceType: 'company_career',
        isVerified: true
      },
      {
        id: '2',
        title: 'Junior Technical Officer',
        company: 'ECIL Govt of India',
        category: 'Technology & IT',
        jobType: 'Full-time',
        location: 'Hyderabad, Telangana',
        city: 'Hyderabad',
        state: 'Telangana',
        salaryMin: 35000,
        salaryMax: 45000,
        salaryFormatted: '₹35,000 - ₹45,000 / mo',
        experienceRequired: 'Freshers',
        qualificationRequired: 'B.Tech ECE',
        description: 'Defense electronics',
        skills: ['Embedded Systems', 'C++'],
        contactName: 'NCS Recruitment Cell',
        openingsCount: 10,
        sourceType: 'government',
        isVerified: true
      },
      {
        id: '3',
        title: 'Master Electrician',
        company: 'City Spark Repairs',
        category: 'Local Trades & Skilled Labor',
        jobType: 'Full-time',
        location: 'Kochi, Kerala',
        city: 'Kochi',
        state: 'Kerala',
        salaryFormatted: '₹30,000 / mo',
        experienceRequired: '3+ Years',
        qualificationRequired: 'ITI Electrical',
        description: 'House wiring and inverter repairs',
        skills: ['Wiring', 'Inverter'],
        contactName: 'Self Employed',
        openingsCount: 1,
        sourceType: 'direct',
        isVerified: true
      }
    ];

    it('filters vacancies by Pan-India state and city', () => {
      const karnatakaResults = filterPanIndiaJobs(mockJobs, { selectedState: 'Karnataka' });
      expect(karnatakaResults).toHaveLength(1);
      expect(karnatakaResults[0].company).toBe('Razorpay');

      const kochiResults = filterPanIndiaJobs(mockJobs, { selectedCity: 'Kochi' });
      expect(kochiResults).toHaveLength(1);
      expect(kochiResults[0].company).toBe('City Spark Repairs');
    });

    it('filters vacancies by source type (Govt NCS vs Corporate vs Direct)', () => {
      const govtResults = filterPanIndiaJobs(mockJobs, { selectedSourceType: 'government' });
      expect(govtResults).toHaveLength(1);
      expect(govtResults[0].company).toBe('ECIL Govt of India');

      const directResults = filterPanIndiaJobs(mockJobs, { selectedSourceType: 'direct' });
      expect(directResults).toHaveLength(1);
      expect(directResults[0].company).toBe('City Spark Repairs');
    });

    it('filters vacancies by keyword and skills search', () => {
      const searchResults = filterPanIndiaJobs(mockJobs, { searchQuery: 'typescript' });
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toBe('Senior React Developer');
    });

    it('sorts vacancies by highest salary', () => {
      const sorted = filterPanIndiaJobs(mockJobs, { sortBy: 'salary_high' });
      expect(sorted[0].company).toBe('Razorpay');
    });
  });

  describe('6. Aggregator Ingestion Pipeline Orchestration', () => {
    it('runs end-to-end sync across active Indian sources and produces deduplicated vacancies', async () => {
      const syncResult = await runJobAggregationSync();

      expect(syncResult.totalImported).toBeGreaterThan(0);
      expect(syncResult.unifiedJobs.length).toBeGreaterThan(0);
      expect(syncResult.sourcesSynced.length).toBeGreaterThanOrEqual(4);
      expect(syncResult.syncTimestamp).toBeDefined();

      // Check presence of diverse sources
      const sourcesPresent = new Set(syncResult.unifiedJobs.map(j => j.sourceType));
      expect(sourcesPresent.has('government')).toBe(true);
      expect(sourcesPresent.has('aggregator_api')).toBe(true);
      expect(sourcesPresent.has('company_career')).toBe(true);
      expect(sourcesPresent.has('state_portal')).toBe(true);
    });
  });
});
