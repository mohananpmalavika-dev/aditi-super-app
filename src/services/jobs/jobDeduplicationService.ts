/**
 * Job Deduplication & Fingerprint Engine
 * Detects identical vacancies across multiple sources (e.g. Company Website + NCS + Jooble + Adzuna)
 * and collapses them into 1 unified record with multi-source attribution and official URL prioritization.
 */

import { JobVacancy, JobSourceAttribution } from '../../types/superApp';

export function generateJobFingerprint(company: string, title: string, locationOrCity: string): string {
  const cleanCompany = company
    .toLowerCase()
    .replace(/\b(pvt|ltd|limited|private|llp|inc|corporation|corp|technologies|services)\b/gi, '')
    .replace(/[^a-z0-9]/g, '');

  const cleanTitle = title
    .toLowerCase()
    .replace(/\b(senior|junior|lead|expert|specialist|officer|associate|engineer|developer)\b/gi, '')
    .replace(/[^a-z0-9]/g, '');

  const cleanCity = locationOrCity
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  return `${cleanCompany}_${cleanTitle}_${cleanCity}`;
}

export function deduplicateAndMergeJobs(incomingJobs: JobVacancy[]): {
  unifiedJobs: JobVacancy[];
  mergedDuplicateCount: number;
} {
  const jobMap = new Map<string, JobVacancy>();
  let mergedDuplicateCount = 0;

  for (const job of incomingJobs) {
    const fingerprint = job.fingerprint || generateJobFingerprint(job.company, job.title, job.city || job.location);

    if (!jobMap.has(fingerprint)) {
      jobMap.set(fingerprint, {
        ...job,
        fingerprint,
        sources: job.sources || []
      });
    } else {
      mergedDuplicateCount++;
      const existing = jobMap.get(fingerprint)!;

      // Merge source attributions without duplication
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

      // Priority for canonical apply URL:
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
