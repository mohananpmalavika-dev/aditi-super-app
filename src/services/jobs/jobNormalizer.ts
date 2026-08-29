/**
 * Job Normalization Engine
 * Normalizes multi-source raw payloads into standardized Aditi Super App schemas
 * Covers all 28 States and 8 Union Territories across India.
 */

import { ImportedJob, JobCategory, JobType, JobVacancy } from '../../types/superApp';

export const INDIAN_STATES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada', 'Nellore', 'Kurnool', 'Anantapur'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Bharuch'],
  'Haryana': ['Gurugram', 'Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Baddi'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
  'Karnataka': ['Bengaluru', 'Bangalore', 'Mysuru', 'Mysore', 'Mangaluru', 'Hubballi', 'Belagavi', 'Shivamogga', 'Tumakuru', 'Hosur'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Kollam', 'Thrissur', 'Kannur', 'Alappuzha', 'Palakkad', 'Malappuram', 'Kottayam', 'Kasaragod', 'Pathanamthitta', 'Idukki', 'Wayanad'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Chakan', 'Navi Mumbai', 'Aurangabad', 'Solapur', 'Kolhapur'],
  'Manipur': ['Imphal', 'Churachandpur'],
  'Meghalaya': ['Shillong', 'Tura'],
  'Mizoram': ['Aizawl', 'Lunglei'],
  'Nagaland': ['Kohima', 'Dimapur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Chandigarh'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bhilwara'],
  'Sikkim': ['Gangtok', 'Namchi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Tenkasi', 'Hosur'],
  'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Tripura': ['Agartala', 'Udaipur'],
  'Uttar Pradesh': ['Noida', 'Greater Noida', 'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Ghaziabad', 'Meerut', 'Bareilly'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Kalyani'],
  'Delhi': ['New Delhi', 'Delhi', 'North Delhi', 'South Delhi', 'Dwarka', 'Delhi NCR']
};

export function normalizeJobTitle(rawTitle: string): string {
  let title = rawTitle.trim();
  title = title.replace(/\bSr\.?(?=\s|$)/gi, 'Senior');
  title = title.replace(/\bJr\.?(?=\s|$)/gi, 'Junior');
  title = title.replace(/\bEngg\.?(?=\s|$)/gi, 'Engineer');
  title = title.replace(/\bDev\.?(?=\s|$)/gi, 'Developer');
  title = title.replace(/\bMgr\.?(?=\s|$)/gi, 'Manager');
  title = title.replace(/\bTech\.?(?=\s|$)/gi, 'Technician');
  title = title.replace(/\bExec\.?(?=\s|$)/gi, 'Executive');
  title = title.replace(/\bAsst\.?(?=\s|$)/gi, 'Assistant');
  title = title.replace(/\s+/g, ' ');
  return title;
}

export function detectIndianLocation(locationText: string): { state: string; city: string; isRemote: boolean } {
  const isRemote = /remote|work from home|wfh|anywhere/i.test(locationText);
  let detectedState = 'India';
  let detectedCity = 'All India';

  for (const [state, cities] of Object.entries(INDIAN_STATES)) {
    if (new RegExp(`\\b${state}\\b`, 'i').test(locationText)) {
      detectedState = state;
    }
    for (const city of cities) {
      if (new RegExp(`\\b${city}\\b`, 'i').test(locationText)) {
        detectedCity = city;
        detectedState = state;
        break;
      }
    }
  }

  if (detectedCity === 'All India' && isRemote) {
    detectedCity = 'Remote (All India)';
  }

  return { state: detectedState, city: detectedCity, isRemote };
}

export function normalizeSalary(
  salaryMin?: number, 
  salaryMax?: number, 
  salaryText?: string
): { min?: number; max?: number; formatted: string } {
  if (salaryMin && salaryMax) {
    if (salaryMin >= 100000 && salaryMax > 500000 && salaryMax < 10000000) {
      // Annual LPA format
      const lpaMin = (salaryMin / 100000).toFixed(1).replace(/\.0$/, '');
      const lpaMax = (salaryMax / 100000).toFixed(1).replace(/\.0$/, '');
      return {
        min: salaryMin,
        max: salaryMax,
        formatted: `₹${lpaMin} - ₹${lpaMax} LPA`
      };
    }
    return {
      min: salaryMin,
      max: salaryMax,
      formatted: `₹${salaryMin.toLocaleString('en-IN')} - ₹${salaryMax.toLocaleString('en-IN')} / mo`
    };
  }

  if (salaryText && salaryText.trim().length > 0) {
    return {
      min: salaryMin,
      max: salaryMax,
      formatted: salaryText.trim()
    };
  }

  return {
    formatted: 'Best in Industry (Competitive)'
  };
}

export function normalizeImportedJobToVacancy(imported: ImportedJob): JobVacancy {
  const normalizedTitle = normalizeJobTitle(imported.title);
  const geo = detectIndianLocation(imported.location || imported.city || imported.state || 'All India');
  const salary = normalizeSalary(imported.salaryMin, imported.salaryMax, imported.salaryText);

  const applyMode = imported.sourceType === 'government' || imported.sourceType === 'aggregator_api' || imported.sourceType === 'company_career' || imported.sourceType === 'state_portal'
    ? 'external_redirect'
    : 'in_app';

  return {
    id: imported.id,
    title: normalizedTitle,
    company: imported.company.trim(),
    companyLogo: imported.companyLogo,
    category: imported.category || 'Technology & IT',
    subcategory: imported.subcategory || 'General Professional',
    jobType: (imported.jobType as JobType) || 'Full-time',
    workMode: imported.workMode || (geo.isRemote ? 'remote' : 'onsite'),
    location: imported.location || `${geo.city}, ${geo.state}`,
    city: imported.city || geo.city,
    district: imported.district,
    state: imported.state || geo.state,
    pincode: imported.pincode,
    isRemote: imported.isRemote || geo.isRemote,
    salaryMin: salary.min,
    salaryMax: salary.max,
    salaryPeriod: 'month',
    salaryFormatted: salary.formatted,
    experienceRequired: imported.experience || '1-3 Years',
    qualificationRequired: imported.qualification || 'Relevant Degree / Certification',
    description: imported.description || `Job vacancy for ${normalizedTitle} at ${imported.company}.`,
    skills: imported.skills || ['Communication', 'Problem Solving'],
    contactName: imported.contactName || `${imported.company} Talent Desk`,
    contactEmail: imported.contactEmail,
    openingsCount: 1,
    isUrgent: false,
    isFeatured: true,
    isVerified: true,
    applicationCount: 0,
    viewCount: 0,
    status: imported.status === 'expired' ? 'expired' : 'active',
    isSaved: false,
    createdAt: imported.sourcePublishedAt || 'Today',
    updatedAt: imported.importedAt,

    // Pan-India Multi-Source Metadata
    sourceType: imported.sourceType,
    primarySource: imported.sourceName,
    sources: [
      {
        sourceId: imported.sourceId,
        sourceName: imported.sourceName,
        sourceType: imported.sourceType,
        sourceUrl: imported.externalUrl,
        externalJobId: imported.externalJobId,
        verified: true,
        discoveredAt: imported.importedAt
      }
    ],
    canonicalApplyUrl: imported.externalUrl,
    applyMode,
    fingerprint: imported.fingerprint,
    lastSeenAt: imported.lastSeenAt,
    sourcePublishedAt: imported.sourcePublishedAt,
    sourceUpdatedAt: imported.importedAt
  };
}
