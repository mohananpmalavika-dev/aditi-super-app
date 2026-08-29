/**
 * Pan-India Job Search & Multi-Faceted Filter Service
 * Provides full-text query search, Indian state/city/remote filtering, category filtering,
 * and paginated slicing.
 */

import { JobVacancy, JobCategory, JobType } from '../../types/superApp';

export interface PanIndiaJobFilterCriteria {
  searchQuery?: string;
  selectedState?: string;
  selectedCity?: string;
  selectedCategory?: JobCategory | 'All';
  selectedJobType?: JobType | 'All';
  selectedSourceType?: 'all' | 'government' | 'company_career' | 'state_portal' | 'aggregator_api' | 'direct';
  workMode?: 'all' | 'remote' | 'hybrid' | 'onsite';
  onlyVerified?: boolean;
  sortBy?: 'latest' | 'salary_high' | 'experience' | 'relevance';
}

export interface PaginatedJobResult {
  jobs: JobVacancy[];
  totalMatches: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function filterPanIndiaJobs(
  jobs: JobVacancy[],
  criteria: PanIndiaJobFilterCriteria
): JobVacancy[] {
  let filtered = [...jobs];

  // 1. Text Search (title, company, skills, description, city, state)
  if (criteria.searchQuery && criteria.searchQuery.trim().length > 0) {
    const q = criteria.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      (j.city && j.city.toLowerCase().includes(q)) ||
      (j.state && j.state.toLowerCase().includes(q)) ||
      j.skills.some(s => s.toLowerCase().includes(q)) ||
      j.description.toLowerCase().includes(q)
    );
  }

  // 2. State Filter
  if (criteria.selectedState && criteria.selectedState !== 'All India' && criteria.selectedState !== 'All') {
    const s = criteria.selectedState.toLowerCase();
    filtered = filtered.filter(j => 
      j.state?.toLowerCase() === s ||
      j.location.toLowerCase().includes(s) ||
      (j.isRemote && (s.includes('remote') || criteria.selectedState === 'Remote (All India)'))
    );
  }

  // 3. City Filter
  if (criteria.selectedCity && criteria.selectedCity !== 'All Cities' && criteria.selectedCity !== 'All' && criteria.selectedCity !== 'All India') {
    const c = criteria.selectedCity.toLowerCase();
    filtered = filtered.filter(j => 
      j.city?.toLowerCase() === c ||
      j.location.toLowerCase().includes(c) ||
      (j.isRemote && c === 'remote')
    );
  }

  // 4. Category Filter
  if (criteria.selectedCategory && criteria.selectedCategory !== 'All') {
    filtered = filtered.filter(j => j.category === criteria.selectedCategory);
  }

  // 5. Job Type Filter
  if (criteria.selectedJobType && criteria.selectedJobType !== 'All') {
    filtered = filtered.filter(j => j.jobType === criteria.selectedJobType);
  }

  // 6. Source Type Filter
  if (criteria.selectedSourceType && criteria.selectedSourceType !== 'all') {
    filtered = filtered.filter(j => j.sourceType === criteria.selectedSourceType);
  }

  // 7. Work Mode Filter
  if (criteria.workMode && criteria.workMode !== 'all') {
    filtered = filtered.filter(j => j.workMode === criteria.workMode || (criteria.workMode === 'remote' && j.isRemote));
  }

  // 8. Verified Only
  if (criteria.onlyVerified) {
    filtered = filtered.filter(j => j.isVerified);
  }

  // 9. Sorting
  if (criteria.sortBy === 'salary_high') {
    filtered.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
  } else if (criteria.sortBy === 'latest') {
    filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  return filtered;
}

export function paginateJobs(
  jobs: JobVacancy[],
  page: number = 1,
  pageSize: number = 20
): PaginatedJobResult {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const totalMatches = jobs.length;
  const totalPages = Math.ceil(totalMatches / safePageSize) || 1;
  const startIndex = (safePage - 1) * safePageSize;
  const pageJobs = jobs.slice(startIndex, startIndex + safePageSize);

  return {
    jobs: pageJobs,
    totalMatches,
    page: safePage,
    pageSize: safePageSize,
    totalPages
  };
}
