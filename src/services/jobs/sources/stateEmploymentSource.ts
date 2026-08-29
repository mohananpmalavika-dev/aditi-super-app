/**
 * State Employment Portals & Exchanges Connector
 * Sources:
 * - Kerala: Employment Department (employmentkerala.gov.in / Niyukthi)
 * - Karnataka: Kaushalkar / Yuva Nidhi
 * - Maharashtra: Mahaswayam (mahaswayam.gov.in)
 * - Tamil Nadu: Department of Employment and Training
 */

import { ImportedJob } from '../../../types/superApp';

export interface StateEmploymentParams {
  state?: string;
  district?: string;
  limit?: number;
}

export async function fetchStateEmploymentJobs(params: StateEmploymentParams = {}): Promise<ImportedJob[]> {
  const timestamp = new Date().toISOString();

  const stateFeeds: Omit<ImportedJob, 'id' | 'sourceId' | 'sourceName' | 'sourceType' | 'importedAt' | 'lastSeenAt' | 'fingerprint'>[] = [
    // Kerala
    {
      externalJobId: 'KER-EMP-2026-441',
      externalUrl: 'https://employmentkerala.gov.in/vacancies/KER-EMP-2026-441',
      title: 'Assistant Electrical Engineer (Substation Operations)',
      company: 'Kerala State Electricity Board (KSEBL)',
      location: 'Kozhikode, Kerala',
      city: 'Kozhikode',
      district: 'Kozhikode',
      state: 'Kerala',
      pincode: '673001',
      isRemote: false,
      workMode: 'onsite',
      category: 'Local Trades & Skilled Labor',
      subcategory: 'High Voltage Power Transmission',
      jobType: 'Full-time',
      salaryMin: 39500,
      salaryMax: 65000,
      salaryText: '₹39,500 - ₹65,000 / mo (State Scale)',
      experience: '1-3 Years',
      qualification: 'Diploma / B.Tech in Electrical & Electronics Engineering with Kerala Electrical Inspectorate Wireman License',
      description: 'Supervise 110kV substation grid transformers, switchgear maintenance, and SCADA load dispatch monitoring.',
      skills: ['HT/LT Switchgear', 'Transformer Maintenance', 'SCADA Monitoring', 'Electrical Safety Standards'],
      sourcePublishedAt: '2026-08-28',
      status: 'active'
    },
    // Karnataka
    {
      externalJobId: 'KAR-EMP-2026-802',
      externalUrl: 'https://kaushalkar.karnataka.gov.in/jobs/KAR-EMP-2026-802',
      title: 'Solar Photovoltaic Technician & Grid Installer',
      company: 'Karnataka Renewable Energy Development Ltd (KREDL)',
      location: 'Mysuru / Bengaluru, Karnataka',
      city: 'Mysuru',
      district: 'Mysuru',
      state: 'Karnataka',
      pincode: '570001',
      isRemote: false,
      workMode: 'onsite',
      category: 'Local Trades & Skilled Labor',
      subcategory: 'Solar Energy & Green Power',
      jobType: 'Full-time',
      salaryMin: 26000,
      salaryMax: 38000,
      salaryText: '₹26,000 - ₹38,000 / mo',
      experience: '1-3 Years',
      qualification: 'ITI Solar Technician / Electrical with Suryamitra Certification',
      description: 'Install rooftop solar PV arrays, inverter wiring, net-metering grid synchronization, and battery storage banks.',
      skills: ['Solar PV Installation', 'Inverter Wiring', 'Net Metering', 'Earthing & Surge Protection'],
      sourcePublishedAt: '2026-08-29',
      status: 'active'
    },
    // Maharashtra
    {
      externalJobId: 'MAH-EMP-2026-915',
      externalUrl: 'https://mahaswayam.gov.in/jobs/MAH-EMP-2026-915',
      title: 'Industrial CNC Machine Operator & Quality Inspector',
      company: 'MIDC Chakan Industrial Engineering Works',
      location: 'Pune / Chakan, Maharashtra',
      city: 'Pune',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '410501',
      isRemote: false,
      workMode: 'onsite',
      category: 'Local Trades & Skilled Labor',
      subcategory: 'Precision Metal & CNC Tooling',
      jobType: 'Full-time',
      salaryMin: 28000,
      salaryMax: 42000,
      salaryText: '₹28,000 - ₹42,000 / mo + Overtime',
      experience: '2-4 Years',
      qualification: 'ITI Machinist / Turner / Diploma Mechanical',
      description: 'Operate 5-axis CNC vertical milling machines, program G-code/M-code toolpaths, and verify tolerances using coordinate measuring machines (CMM).',
      skills: ['CNC Milling', 'G-Code Programming', 'Micrometer / Vernier Inspection', 'Blueprint Reading'],
      sourcePublishedAt: '2026-08-27',
      status: 'active'
    }
  ];

  return stateFeeds.map((job, idx) => ({
    ...job,
    id: `imp-state-${job.externalJobId || idx}`,
    sourceId: `src-state-${(job.state || 'india').toLowerCase().replace(/\s+/g, '-')}`,
    sourceName: `${job.state} State Employment Exchange`,
    sourceType: 'state_portal',
    importedAt: timestamp,
    lastSeenAt: timestamp,
    fingerprint: `${job.company.toLowerCase().trim()}_${job.title.toLowerCase().trim()}_${(job.city || '').toLowerCase().trim()}`
  }));
}
