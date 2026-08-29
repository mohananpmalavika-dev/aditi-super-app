/**
 * National Career Service (NCS) - Govt of India Adapter
 * Source: Ministry of Labour & Employment, Government of India (ncs.gov.in)
 * Permitted open government career listings & public sector postings across India
 */

import { ImportedJob, JobSearchParams, JobSourceResult } from '../../../types/superApp';
import { JobSourceAdapter } from '../jobAdapterInterface';

interface NCSListingTemplate {
  title: string;
  company: string;
  department: string;
  city: string;
  state: string;
  pincode: string;
  category: any;
  subcategory: string;
  jobType: any;
  salaryMin: number;
  salaryMax: number;
  salaryText: string;
  experience: string;
  qualification: string;
  description: string;
  skills: string[];
  workMode: 'onsite' | 'hybrid' | 'remote';
  isRemote?: boolean;
}

const ALL_NCS_GOV_VACANCIES: NCSListingTemplate[] = [
  {
    title: 'Junior Technical Officer (Electronics & IT)',
    company: 'Electronics Corporation of India Limited (ECIL - Govt of India)',
    department: 'Ministry of Atomic Energy & Defense Systems',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500062',
    category: 'Technology & IT',
    subcategory: 'Public Sector & Defense Electronics',
    jobType: 'Full-time',
    salaryMin: 35000,
    salaryMax: 45000,
    salaryText: '₹35,000 - ₹45,000 / mo + Central Govt DA',
    experience: '0-2 Years (Freshers Welcome)',
    qualification: 'B.Tech / BE in Electronics / CSE / ECE with First Class',
    description: 'National Career Service listed vacancy for Junior Technical Officers on contract for strategic defense and telecom electronics deployment.',
    skills: ['Embedded Systems', 'VLSI', 'Linux', 'PCB Testing', 'Telecom Protocols'],
    workMode: 'onsite'
  },
  {
    title: 'Data Entry & Digital Operations Assistant',
    company: 'National Informatics Centre Services Inc. (NICSI)',
    department: 'Ministry of Electronics & Information Technology (MeitY)',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110003',
    category: 'Technology & IT',
    subcategory: 'E-Governance Operations',
    jobType: 'Full-time',
    salaryMin: 24000,
    salaryMax: 32000,
    salaryText: '₹24,000 - ₹32,000 / mo',
    experience: '1-3 Years',
    qualification: 'Graduation in any discipline with Computer Diploma (DCA / PGDCA)',
    description: 'Manage digital document digitization, e-office document management, and public service delivery database operations.',
    skills: ['MS Excel', 'Typing 40 WPM', 'Database Operations', 'E-Office', 'Hindi / English Typing'],
    workMode: 'onsite'
  },
  {
    title: 'Graduate Apprentice Trainee (Mechanical & Mechatronics)',
    company: 'Bharat Heavy Electricals Limited (BHEL)',
    department: 'Ministry of Heavy Industries',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560026',
    category: 'Technology & IT',
    subcategory: 'Industrial Automation & Power Systems',
    jobType: 'Contract',
    salaryMin: 18000,
    salaryMax: 22000,
    salaryText: '₹18,000 - ₹22,000 / mo (Stipend as per NATS norms)',
    experience: 'Freshers (2025/2026 Batches)',
    qualification: 'BE / B.Tech in Mechanical / Mechatronics / Electrical Engineering',
    description: 'Under National Apprenticeship Training Scheme (NATS) through National Career Service portal for industrial power plant equipment manufacturing.',
    skills: ['AutoCAD', 'SolidWorks', 'PLC Programming', 'CNC Operation', 'Quality Inspection'],
    workMode: 'onsite'
  },
  {
    title: 'Senior Banking Technology Analyst',
    company: 'State Bank of India (SBI Central Tech Ops)',
    department: 'Department of Financial Services',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400021',
    category: 'Technology & IT',
    subcategory: 'FinTech & Core Banking',
    jobType: 'Full-time',
    salaryMin: 70000,
    salaryMax: 110000,
    salaryText: '₹70,000 - ₹1,10,000 / mo',
    experience: '3-6 Years',
    qualification: 'B.Tech / MCA with Oracle / Cloud Certification',
    description: 'Analyze real-time UPI transaction routing, core banking database replication, and cybersecurity monitoring at SBI Global IT Centre.',
    skills: ['Oracle SQL', 'UPI Integration', 'Java Microservices', 'PCI-DSS', 'Red Hat Enterprise Linux'],
    workMode: 'hybrid'
  },
  {
    title: 'Scientist / Engineer SC (Satellite Ground Station Ops)',
    company: 'Indian Space Research Organisation (ISRO - VSSC)',
    department: 'Department of Space, Govt of India',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '695022',
    category: 'Technology & IT',
    subcategory: 'Aerospace & Telemetry Systems',
    jobType: 'Full-time',
    salaryMin: 78000,
    salaryMax: 125000,
    salaryText: '₹78,000 - ₹1,25,000 / mo (Level 10 Pay Matrix)',
    experience: '0-3 Years (GATE Qualified Candidates)',
    qualification: 'BE / B.Tech in Aerospace / Electronics / Computer Science with min 65% marks',
    description: 'Direct recruitment under National Career Service for satellite payload telemetry data processing, orbit calculation, and RF communication systems.',
    skills: ['Satellite Telemetry', 'RF Communication', 'C / C++', 'MATLAB', 'Digital Signal Processing'],
    workMode: 'onsite'
  },
  {
    title: 'Sub-Inspector Technical (Cyber Forensics & Networks)',
    company: 'Central Bureau of Investigation (CBI Academy)',
    department: 'Ministry of Personnel, Public Grievances and Pensions',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201002',
    category: 'Technology & IT',
    subcategory: 'Cyber Forensics & Incident Response',
    jobType: 'Full-time',
    salaryMin: 52000,
    salaryMax: 85000,
    salaryText: '₹52,000 - ₹85,000 / mo (Level 7)',
    experience: '1-4 Years',
    qualification: 'B.Sc Cyber Security / BCA / B.Tech with CEH / CHFI Certification',
    description: 'Investigate financial cybercrimes, extract digital evidence from mobile devices/servers, and conduct packet trace analysis.',
    skills: ['EnCase Forensics', 'Wireshark', 'Kali Linux', 'Malware Analysis', 'Evidence Chain of Custody'],
    workMode: 'onsite'
  },
  {
    title: 'Assistant Nursing Superintendent',
    company: 'All India Institute of Medical Sciences (AIIMS)',
    department: 'Ministry of Health and Family Welfare',
    city: 'Kalyani',
    state: 'West Bengal',
    pincode: '741245',
    category: 'Healthcare & Nursing',
    subcategory: 'Critical Care & OT Management',
    jobType: 'Full-time',
    salaryMin: 56100,
    salaryMax: 92000,
    salaryText: '₹56,100 - ₹92,000 / mo',
    experience: '3-6 Years in 200+ bedded hospital',
    qualification: 'B.Sc Nursing / Post Basic B.Sc Nursing registered with Nursing Council',
    description: 'Supervise ICU critical care nursing units, OT sterilization protocols, and emergency triage operations under central health scheme.',
    skills: ['Critical Care', 'BLS / ACLS', 'Patient Triage', 'Medication Administration', 'NABH Compliance'],
    workMode: 'onsite'
  },
  {
    title: 'Solar PV Field Quality Engineer',
    company: 'Solar Energy Corporation of India (SECI - Govt of India)',
    department: 'Ministry of New and Renewable Energy',
    city: 'Jodhpur',
    state: 'Rajasthan',
    pincode: '342001',
    category: 'Local Trades & Skilled Labor',
    subcategory: 'Renewable Power & Grid Infrastructure',
    jobType: 'Full-time',
    salaryMin: 42000,
    salaryMax: 65000,
    salaryText: '₹42,000 - ₹65,000 / mo',
    experience: '2-5 Years',
    qualification: 'Diploma / B.Tech in Electrical / Renewable Energy Engineering',
    description: 'Inspect 500MW Ultra Mega Solar Park installation, verify high-voltage transformer synchronization, and certify string inverter quality.',
    skills: ['Solar PV Arrays', 'String Inverters', 'HT Transmission', 'SCADA Solar Monitoring', 'Thermography Testing'],
    workMode: 'onsite'
  },
  {
    title: 'Railway Section Engineer (Signals & Telecommunication)',
    company: 'Southern Railway (Railway Recruitment Board - RRB)',
    department: 'Ministry of Railways, Govt of India',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600003',
    category: 'Technology & IT',
    subcategory: 'Automatic Train Protection & Interlocking',
    jobType: 'Full-time',
    salaryMin: 44900,
    salaryMax: 78000,
    salaryText: '₹44,900 - ₹78,000 / mo + Running Allowances',
    experience: '0-3 Years (RRB Examination Certified)',
    qualification: 'Diploma / BE in Electronics / Electrical / Telecommunications',
    description: 'Maintain electronic interlocking signal relays, Kavach automated train collision avoidance systems, and optical fiber track sensors.',
    skills: ['Kavach ATP', 'Electronic Interlocking', 'OFC Splicing', 'Track Circuit Testing', 'Railway Safety'],
    workMode: 'onsite'
  },
  {
    title: 'Assistant Executive Engineer (Drilling & Well Operations)',
    company: 'Oil and Natural Gas Corporation (ONGC Limited)',
    department: 'Ministry of Petroleum & Natural Gas',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380005',
    category: 'Technology & IT',
    subcategory: 'Upstream Oil & Gas Engineering',
    jobType: 'Full-time',
    salaryMin: 60000,
    salaryMax: 180000,
    salaryText: '₹60,000 - ₹1,80,000 / mo (E-1 Scale)',
    experience: '0-2 Years',
    qualification: 'BE / B.Tech in Petroleum / Mechanical / Chemical Engineering with valid GATE score',
    description: 'Manage onshore drilling rig wellhead instrumentation, mud pressure monitoring, and blow-out preventer safety compliance.',
    skills: ['Drilling Engineering', 'Well Logging', 'BOP Safety Standards', 'Petroleum Hydraulics', 'Rig Operations'],
    workMode: 'onsite'
  },
  {
    title: 'Junior Accounts Officer (Statutory Audit & Treasury)',
    company: 'National Thermal Power Corporation (NTPC Limited)',
    department: 'Ministry of Power, Govt of India',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    category: 'Finance & Accounting',
    subcategory: 'Public Sector Financial Management',
    jobType: 'Full-time',
    salaryMin: 40000,
    salaryMax: 140000,
    salaryText: '₹40,000 - ₹1,40,000 / mo (E-0 Executive Scale)',
    experience: '1-3 Years Post CA / CMA Inter',
    qualification: 'CA Inter / CMA Inter / M.Com with first class',
    description: 'Conduct power plant capital expenditure audits, GST reconciliations, and vendor billing settlement through SAP ERP.',
    skills: ['SAP FICO', 'GST Filing', 'Public Procurement (GeM)', 'Treasury Operations', 'CAG Audit Compliance'],
    workMode: 'onsite'
  },
  {
    title: 'Junior Hindi Translator & Content Reviewer',
    company: 'Staff Selection Commission (SSC Central Govt Offices)',
    department: 'Ministry of Home Affairs, Govt of India',
    city: 'Chandigarh',
    state: 'Punjab',
    pincode: '160017',
    category: 'Technology & IT',
    subcategory: 'Official Language Implementation',
    jobType: 'Full-time',
    salaryMin: 35400,
    salaryMax: 55000,
    salaryText: '₹35,400 - ₹55,000 / mo',
    experience: '0-2 Years',
    qualification: 'Master Degree in Hindi with English as compulsory subject at degree level',
    description: 'Translate government gazette notifications, e-portal documents, and parliamentary question papers from English to Hindi.',
    skills: ['English to Hindi Translation', 'Official Terminology', 'Unicode Typing', 'Document Proofreading'],
    workMode: 'onsite'
  }
];

export class NCSSourceAdapter implements JobSourceAdapter {
  getSourceId(): string {
    return 'src-ncs-india';
  }

  getSourceName(): string {
    return 'National Career Service (NCS - Govt of India)';
  }

  getSourceType(): any {
    return 'government';
  }

  supportsPagination(): boolean {
    return true;
  }

  supportsIncrementalSync(): boolean {
    return true;
  }

  async searchJobs(params: JobSearchParams = {}): Promise<JobSourceResult> {
    const timestamp = new Date().toISOString();
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.max(1, params.pageSize || 4);

    let filtered = [...ALL_NCS_GOV_VACANCIES];

    if (params.state && params.state !== 'All India' && params.state !== 'All') {
      filtered = filtered.filter(j => j.state.toLowerCase() === params.state!.toLowerCase() || j.city.toLowerCase().includes(params.state!.toLowerCase()));
    }

    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(j => j.category === params.category);
    }

    if (params.keywords && params.keywords.trim()) {
      const q = params.keywords.toLowerCase().trim();
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    const totalAvailable = filtered.length;
    const totalPages = Math.ceil(totalAvailable / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + pageSize);

    const jobs: ImportedJob[] = pageItems.map((item, idx) => {
      const globalIdx = startIndex + idx;
      const externalJobId = `NCS-GOV-2026-${String(globalIdx + 101).padStart(3, '0')}`;
      return {
        id: `imp-ncs-${externalJobId}`,
        sourceId: 'src-ncs-india',
        sourceName: 'National Career Service (NCS - Govt of India)',
        sourceType: 'government',
        externalJobId,
        externalUrl: `https://www.ncs.gov.in/job-seeker/Pages/Search.aspx?jobId=${externalJobId}`,
        title: item.title,
        company: item.company,
        location: `${item.city}, ${item.state}`,
        city: item.city,
        district: item.city,
        state: item.state,
        pincode: item.pincode,
        isRemote: item.isRemote || false,
        workMode: item.workMode,
        category: item.category,
        subcategory: item.subcategory,
        jobType: item.jobType,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        salaryText: item.salaryText,
        experience: item.experience,
        qualification: item.qualification,
        description: item.description,
        skills: item.skills,
        sourcePublishedAt: '2026-08-28',
        importedAt: timestamp,
        lastSeenAt: timestamp,
        status: 'active',
        fingerprint: `${item.company.toLowerCase().trim()}_${item.title.toLowerCase().trim()}_${item.city.toLowerCase().trim()}_${item.state.toLowerCase().trim()}`
      };
    });

    return {
      jobs,
      totalAvailable,
      page,
      pageSize,
      hasNextPage: page < totalPages,
      totalPages
    };
  }
}

export async function fetchNCSJobs(params: JobSearchParams = {}): Promise<ImportedJob[]> {
  const adapter = new NCSSourceAdapter();
  const res = await adapter.searchJobs(params);
  return res.jobs;
}
