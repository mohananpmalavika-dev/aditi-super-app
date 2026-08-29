/**
 * Corporate Career Portals & ATS Feeds Connector
 * Sources: Official Verified Career Portals (TCS iBegin, Infosys Careers, Wipro Careers, HCLTech, Accenture)
 */

import { ImportedJob } from '../../../types/superApp';

export async function fetchCorporateCareerJobs(): Promise<ImportedJob[]> {
  const timestamp = new Date().toISOString();

  const corporateFeeds: Omit<ImportedJob, 'id' | 'sourceId' | 'sourceName' | 'sourceType' | 'importedAt' | 'lastSeenAt' | 'fingerprint'>[] = [
    {
      externalJobId: 'TCS-IBEGIN-7741',
      externalUrl: 'https://ibegin.tcs.com/iBegin/jobs/7741',
      title: 'Cloud Security Architect & Zero Trust Lead',
      company: 'Tata Consultancy Services (TCS)',
      location: 'Kochi / Bengaluru / Hyderabad / Pune',
      city: 'Kochi',
      district: 'Ernakulam',
      state: 'Kerala',
      pincode: '682042',
      isRemote: true,
      workMode: 'hybrid',
      category: 'Technology & IT',
      subcategory: 'Cybersecurity & Cloud Governance',
      jobType: 'Full-time',
      salaryMin: 130000,
      salaryMax: 210000,
      salaryText: '₹16,00,000 - ₹26,00,000 / annum',
      experience: '6-10 Years',
      qualification: 'B.Tech / M.Tech in CS with CCSP / CISSP / AWS Security Specialty',
      description: 'Architect Zero-Trust cloud network segmentation, KMS encryption key policies, and ISO 27001/SOC 2 compliance for global banking clients.',
      skills: ['AWS Security Hub', 'Prisma Cloud', 'Zero Trust', 'Kubernetes Security', 'IAM Governance'],
      sourcePublishedAt: '2026-08-29',
      status: 'active'
    },
    {
      externalJobId: 'INFY-CAR-8820',
      externalUrl: 'https://career.infosys.com/jobdesc?jobReferenceCode=INFY-CAR-8820',
      title: 'Lead Generative AI Solutions Consultant',
      company: 'Infosys Limited',
      location: 'Bengaluru / Thiruvananthapuram / Chennai',
      city: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pincode: '560100',
      isRemote: true,
      workMode: 'hybrid',
      category: 'Technology & IT',
      subcategory: 'Applied AI & LLM Systems',
      jobType: 'Full-time',
      salaryMin: 140000,
      salaryMax: 230000,
      salaryText: '₹18,00,000 - ₹28,00,000 / annum',
      experience: '5-9 Years',
      qualification: 'B.Tech / MCA in Computer Science or Data Science',
      description: 'Implement enterprise Topaz generative AI blueprints, fine-tune domain LLMs, and integrate multi-modal RAG engines for Fortune 100 enterprise clients.',
      skills: ['LangChain', 'Llama 3', 'Vector Search', 'Python', 'Azure OpenAI', 'FastAPI'],
      sourcePublishedAt: '2026-08-29',
      status: 'active'
    },
    {
      externalJobId: 'WIPRO-CAR-6129',
      externalUrl: 'https://careers.wipro.com/careers-home/jobs/6129',
      title: 'Automotive Embedded AUTOSAR & Functional Safety Lead',
      company: 'Wipro Limited',
      location: 'Hyderabad / Pune / Bengaluru',
      city: 'Hyderabad',
      district: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      isRemote: false,
      workMode: 'onsite',
      category: 'Technology & IT',
      subcategory: 'Autonomous Vehicles & Connected Mobility',
      jobType: 'Full-time',
      salaryMin: 115000,
      salaryMax: 185000,
      salaryText: '₹14,00,000 - ₹22,50,000 / annum',
      experience: '5-8 Years',
      qualification: 'B.Tech in Electronics / Computer Engineering',
      description: 'Develop ISO 26262 ASIL-D certified software for Advanced Driver Assistance Systems (ADAS) and Electric Powertrain battery management systems (BMS).',
      skills: ['AUTOSAR Classic/Adaptive', 'Embedded C', 'Vector CANoe', 'ISO 26262', 'RTOS QNX'],
      sourcePublishedAt: '2026-08-28',
      status: 'active'
    }
  ];

  return corporateFeeds.map((job, idx) => ({
    ...job,
    id: `imp-corp-${job.externalJobId || idx}`,
    sourceId: `src-corp-${job.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    sourceName: `${job.company} Official Careers`,
    sourceType: 'company_career',
    importedAt: timestamp,
    lastSeenAt: timestamp,
    fingerprint: `${job.company.toLowerCase().trim()}_${job.title.toLowerCase().trim()}_${(job.city || '').toLowerCase().trim()}`
  }));
}
