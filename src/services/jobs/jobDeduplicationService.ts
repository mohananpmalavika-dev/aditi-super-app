/**
 * Job Deduplication & Fingerprint Engine
 * Detects identical vacancies across multiple sources (e.g. Company Website + NCS + Jooble + Adzuna)
 * and collapses them into 1 unified record with multi-source attribution and official URL prioritization.
 * 
 * Safeguarded against over-deduplication: Preserves distinct roles across locations, seniority, and salaries.
 */

import { JobVacancy, JobSourceAttribution } from '../../types/superApp';

/**
 * Generates a high-precision multi-signal fingerprint.
 * Preserves distinct seniority levels (Senior vs Junior vs Lead) and distinct locations (Kochi vs Bengaluru).
 */
export function generateJobFingerprint(
  company: string, 
  title: string, 
  locationOrCity: string,
  externalJobId?: string,
  salaryMin?: number
): string {
  // Normalize company without removing distinguishing suffixes unless standard
  const cleanCompany = (company || '')
    .toLowerCase()
    .replace(/\b(pvt\.?|ltd\.?|limited|private|llp|inc\.?)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

  // Normalize title while explicitly PRESERVING seniority qualifiers (Senior, Junior, Lead, Trainee, Architect, Specialist)
  const cleanTitle = (title || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9]/g, '')
    .trim();

  // Clean location / city
  const cleanCity = (locationOrCity || 'india')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

  // Approximate salary bracket (to prevent merging different positions with the same title)
  const salaryBracket = salaryMin ? `_sal${Math.floor(salaryMin / 25000) * 25000}` : '';

  return `${cleanCompany}_${cleanTitle}_${cleanCity}${salaryBracket}`;
}

export function deduplicateAndMergeJobs(incomingJobs: JobVacancy[]): {
  unifiedJobs: JobVacancy[];
  mergedDuplicateCount: number;
} {
  const jobMap = new Map<string, JobVacancy>();
  let mergedDuplicateCount = 0;

  for (const job of incomingJobs) {
    const fingerprint = job.fingerprint || generateJobFingerprint(
      job.company, 
      job.title, 
      job.city || job.location,
      undefined,
      job.salaryMin
    );

    if (!jobMap.has(fingerprint)) {
      jobMap.set(fingerprint, {
        ...job,
        fingerprint,
        sources: job.sources || []
      });
    } else {
      mergedDuplicateCount++;
      const existing = jobMap.get(fingerprint)!;

      // Merge source attributions without duplicate URLs
      const existingSourceUrls = new Set(existing.sources?.map(s => s.sourceUrl) || []);
      const newSources: JobSourceAttribution[] = [...(existing.sources || [])];

      if (job.sources) {
        for (const s of job.sources) {
          if (!existingSourceUrls.has(s.sourceUrl)) {
            newSources.push(s);
            existingSourceUrls.add(s.sourceUrl);
          }
        }
      }

      // Canonical URL prioritization:
      // 1. Direct Recruiter / Official Company Career
      // 2. National Career Service (NCS)
      // 3. State Exchange
      // 4. Aggregator (Jooble / Adzuna)
      let preferredCanonicalUrl = existing.canonicalApplyUrl;
      let preferredApplyMode = existing.applyMode;
      let preferredPrimarySource = existing.primarySource;

      if (job.sourceType === 'company_career' || job.sourceType === 'direct') {
        preferredCanonicalUrl = job.canonicalApplyUrl || existing.canonicalApplyUrl;
        preferredApplyMode = job.applyMode || existing.applyMode;
        preferredPrimarySource = job.primarySource || existing.primarySource;
      } else if (job.sourceType === 'government' && existing.sourceType !== 'company_career' && existing.sourceType !== 'direct') {
        preferredCanonicalUrl = job.canonicalApplyUrl || existing.canonicalApplyUrl;
        preferredApplyMode = job.applyMode || existing.applyMode;
        preferredPrimarySource = job.primarySource || existing.primarySource;
      }

      jobMap.set(fingerprint, {
        ...existing,
        sources: newSources,
        canonicalApplyUrl: preferredCanonicalUrl,
        applyMode: preferredApplyMode,
        primarySource: preferredPrimarySource,
        lastSeenAt: job.lastSeenAt || new Date().toISOString()
      });
    }
  }

  return {
    unifiedJobs: Array.from(jobMap.values()),
    mergedDuplicateCount
  };
}
