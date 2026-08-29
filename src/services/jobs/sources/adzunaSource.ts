/**
 * Adzuna India Job Search API Adapter
 * Source: Adzuna Developer API (adzuna.in)
 * Structured categorized jobs across major Indian metropolitan areas
 */

import { ImportedJob } from '../../../types/superApp';

export interface AdzunaSearchParams {
  what?: string;
  where?: string;
  category?: string;
}

export async function fetchAdzunaJobs(params: AdzunaSearchParams = {}): Promise<ImportedJob[]> {
  const timestamp = new Date().toISOString();

  const sampleAdzunaFeed: Omit<ImportedJob, 'id' | 'sourceId' | 'sourceName' | 'sourceType' | 'importedAt' | 'lastSeenAt' | 'fingerprint'>[] = [
    {
      externalJobId: 'ADZUNA-IN-5501',
      externalUrl: 'https://www.adzuna.in/details/5501?utm_source=aditi_portal',
      title: 'Senior Chartered Accountant (Audit & Direct Tax)',
      company: 'Deloitte Touche Tohmatsu India LLP',
      location: 'Gurugram, Haryana / Delhi NCR',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      isRemote: false,
      workMode: 'hybrid',
      category: 'Finance & Accounting',
      subcategory: 'Statutory Audit & International Taxation',
      jobType: 'Full-time',
      salaryMin: 90000,
      salaryMax: 145000,
      salaryText: '₹11,00,000 - ₹17,50,000 / annum',
      experience: '3-6 Years Post-Qualification',
      qualification: 'Qualified CA (ICAI Member) / DISA / CISA',
      description: 'Lead statutory audits, Ind AS financial statements conversions, and transfer pricing assessments for multinational enterprises.',
      skills: ['Statutory Audit', 'Ind AS / IFRS', 'Direct Taxation', 'SAP ERP Audit', 'Transfer Pricing'],
      sourcePublishedAt: '2026-08-28',
      status: 'active'
    },
    {
      externalJobId: 'ADZUNA-IN-5502',
      externalUrl: 'https://www.adzuna.in/details/5502?utm_source=aditi_portal',
      title: 'Lead AI Prompt & LLM Evaluation Specialist',
      company: 'Zoho Corporation',
      location: 'Tenkasi / Chennai, Tamil Nadu',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600089',
      isRemote: false,
      workMode: 'onsite',
      category: 'Technology & IT',
      subcategory: 'Generative AI & Natural Language Processing',
      jobType: 'Full-time',
      salaryMin: 75000,
      salaryMax: 120000,
      salaryText: '₹9,00,000 - ₹14,50,000 / annum',
      experience: '2-5 Years',
      qualification: 'B.Tech / M.Tech in CS / Computational Linguistics',
      description: 'Design robust evaluation benchmarks for proprietary SaaS AI assistants, fine-tune small language models, and enhance context memory retrieval.',
      skills: ['LLM Evaluation', 'Python', 'Prompt Engineering', 'Vector Embeddings', 'NLP', 'PyTorch'],
      sourcePublishedAt: '2026-08-29',
      status: 'active'
    }
  ];

  return sampleAdzunaFeed.map((job, idx) => ({
    ...job,
    id: `imp-adzuna-${job.externalJobId || idx}`,
    sourceId: 'src-adzuna-in',
    sourceName: 'Adzuna Jobs India',
    sourceType: 'aggregator_api',
    importedAt: timestamp,
    lastSeenAt: timestamp,
    fingerprint: `${job.company.toLowerCase().trim()}_${job.title.toLowerCase().trim()}_${(job.city || '').toLowerCase().trim()}`
  }));
}
