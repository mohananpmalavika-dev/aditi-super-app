import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCloudJobVacancies,
  createCloudJobVacancy,
  updateCloudJobVacancy,
  deleteCloudJobVacancy,
  toggleCloudSaveJob,
  getCloudJobSeekers,
  createCloudJobSeeker,
  updateCloudJobSeeker,
  deleteCloudJobSeeker,
  toggleCloudSaveJobSeeker,
  getCloudLocalWorkers,
  createCloudLocalWorker,
  updateCloudLocalWorker,
  deleteCloudLocalWorker,
  toggleCloudSaveLocalWorker,
  getCloudJobApplications,
  createCloudJobApplication,
  updateCloudJobApplicationStatus,
  withdrawCloudJobApplication,
  getCloudServiceBookings,
  createCloudServiceBooking,
  updateCloudServiceBookingStatus,
  cancelCloudServiceBooking,
  getCloudWorkerReviews,
  createCloudWorkerReview,
  getCloudReports,
  createCloudReport,
  calculateDistanceKm,
  JOB_VACANCIES_STORAGE_KEY,
  JOB_SEEKERS_STORAGE_KEY,
  LOCAL_WORKERS_STORAGE_KEY,
  JOB_APPLICATIONS_STORAGE_KEY,
  SERVICE_BOOKINGS_STORAGE_KEY,
  WORKER_REVIEWS_STORAGE_KEY,
  INITIAL_JOB_VACANCIES,
  INITIAL_JOB_SEEKERS,
  INITIAL_LOCAL_WORKERS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_SERVICE_BOOKINGS
} from '../services/cloudDatabaseService';
import { 
  JobVacancy, 
  JobSeekerProfile, 
  LocalWorkerProfile, 
  JobApplication, 
  ServiceBooking, 
  WorkerReview,
  JobReport 
} from '../types/superApp';

describe('Job Portal & Local Worker Marketplace Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Job Vacancies (Recruiter Openings)', () => {
    it('returns default initial vacancies including verified Infopark Kochi openings', async () => {
      const vacancies = await getCloudJobVacancies();
      expect(vacancies.length).toBeGreaterThanOrEqual(10);
      expect(vacancies.some(j => j.location.includes('Infopark') && j.city === 'Kochi')).toBe(true);
      expect(vacancies.some(j => j.company.includes('Thinkpalm') || j.company.includes('Experion'))).toBe(true);
      expect(vacancies.some(j => j.company.includes('Tecforz') || j.company.includes('AlignMinds'))).toBe(true);
      expect(vacancies.some(j => j.category === 'Technology & IT')).toBe(true);
    });

    it('allows a recruiter to post a new job vacancy', async () => {
      const newJob: Omit<JobVacancy, 'id'> = {
        title: 'Senior MERN Stack Architect',
        company: 'Aditi Cloud Systems',
        category: 'Technology & IT',
        jobType: 'Full-time',
        location: 'Cyberpark, Calicut',
        city: 'Kozhikode',
        isRemote: true,
        salaryFormatted: '₹80,000 - ₹1,20,000 / mo',
        experienceRequired: '5+ Years',
        qualificationRequired: 'B.Tech in Computer Science',
        description: 'Lead engineering teams building next-generation distributed super app microservices.',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        contactName: 'Anil Varma',
        contactPhone: '+91 98470 12345',
        contactEmail: 'anil@aditicloud.com',
        openingsCount: 3,
        isUrgent: true,
        isFeatured: true,
        createdAt: 'Just now'
      };

      const updatedList = await createCloudJobVacancy(newJob);
      expect(updatedList.length).toBe(INITIAL_JOB_VACANCIES.length + 1);
      
      const created = updatedList.find(j => j.title === 'Senior MERN Stack Architect');
      expect(created).toBeDefined();
      expect(created?.id).toMatch(/^job-/);
      expect(created?.openingsCount).toBe(3);
      expect(created?.isUrgent).toBe(true);
    });

    it('updates existing job vacancy', async () => {
      const vacancies = await getCloudJobVacancies();
      const targetId = vacancies[0].id;

      const updated = await updateCloudJobVacancy(targetId, {
        salaryFormatted: '₹60,000 - ₹90,000 / mo',
        openingsCount: 5
      });
      const item = updated.find(j => j.id === targetId);
      expect(item?.salaryFormatted).toBe('₹60,000 - ₹90,000 / mo');
      expect(item?.openingsCount).toBe(5);
    });

    it('toggles saved bookmark state and deletes a job vacancy', async () => {
      const vacancies = await getCloudJobVacancies();
      const targetId = vacancies[0].id;

      // Toggle Bookmark
      const savedList = await toggleCloudSaveJob(targetId);
      const savedItem = savedList.find(j => j.id === targetId);
      expect(savedItem?.isSaved).toBe(true);

      // Delete vacancy
      const afterDelete = await deleteCloudJobVacancy(targetId);
      expect(afterDelete.some(j => j.id === targetId)).toBe(false);
    });
  });

  describe('2. Job Seekers & Candidates (Talent Pool)', () => {
    it('returns empty list initially without dummy candidate profiles', async () => {
      const seekers = await getCloudJobSeekers();
      expect(seekers).toEqual([]);
    });

    it('allows a job seeker to post their qualification and experience profile', async () => {
      const newSeeker: Omit<JobSeekerProfile, 'id'> = {
        fullName: 'Kavya S. Menon',
        desiredRole: 'Senior Financial Analyst',
        category: 'Finance & Accounting',
        jobTypePreference: 'Full-time',
        qualification: 'Chartered Accountant (CA Inter) & B.Com',
        experienceYears: 4,
        experienceSummary: 'Handled corporate budgeting, financial modeling, and audits for manufacturing firms.',
        expectedSalary: '₹55,000 / mo',
        preferredLocation: 'Kochi / Ernakulam',
        city: 'Kochi',
        skills: ['Financial Modeling', 'GST Audit', 'SAP ERP', 'Excel Macro'],
        resumeHeadline: 'CA Inter qualified analyst with 4 years corporate finance expertise.',
        bio: 'Passionate about data-driven financial decision making and cash flow forecasting.',
        phone: '+91 97450 99887',
        email: 'kavya.menon@example.com',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
        availability: 'Immediate',
        isVerified: true
      };

      const updated = await createCloudJobSeeker(newSeeker);
      expect(updated.length).toBe(1);

      const added = updated.find(s => s.fullName === 'Kavya S. Menon');
      expect(added).toBeDefined();
      expect(added?.qualification).toContain('Chartered Accountant');
      expect(added?.availability).toBe('Immediate');
    });

    it('toggles candidate bookmark and deletes seeker profile', async () => {
      const newSeeker: Omit<JobSeekerProfile, 'id'> = {
        fullName: 'Test Candidate',
        desiredRole: 'Software Tester',
        category: 'Technology & IT',
        jobTypePreference: 'Full-time',
        qualification: 'B.Tech',
        experienceYears: 2,
        experienceSummary: 'Testing QA',
        expectedSalary: '₹30,000 / mo',
        preferredLocation: 'Kochi',
        city: 'Kochi',
        skills: ['QA'],
        resumeHeadline: 'Tester',
        bio: 'Bio',
        phone: '+91 98470 11111',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        availability: 'Immediate'
      };
      const createdList = await createCloudJobSeeker(newSeeker);
      const targetId = createdList[0].id;

      const toggled = await toggleCloudSaveJobSeeker(targetId);
      expect(toggled.find(s => s.id === targetId)?.isSaved).toBe(true);

      const removed = await deleteCloudJobSeeker(targetId);
      expect(removed.some(s => s.id === targetId)).toBe(false);
    });
  });

  describe('3. Local Workers & Home Services (Electricians, Plumbers, Housemaids, Drivers)', () => {
    it('returns empty list initially without dummy workers', async () => {
      const workers = await getCloudLocalWorkers();
      expect(workers).toEqual([]);
    });

    it('allows a local skilled worker to register their trade service', async () => {
      const newWorker: Omit<LocalWorkerProfile, 'id'> = {
        name: 'Gireesh Kumar (Gireesh Plumbers)',
        trade: 'Plumber',
        experienceYears: 11,
        dailyRateOrCharge: '₹750 / day or ₹300 / visit',
        serviceAreas: ['Chevayur', 'Medical College', 'Kovoor', 'Pottammal'],
        city: 'Kozhikode',
        rating: 5.0,
        reviewCount: 45,
        isAvailableToday: true,
        verifiedBadge: true,
        skills: ['Underground Pipe Leak Repair', 'Solar Water Heater Plumbing', 'CP Fitting'],
        bio: 'Fast and reliable plumbing repair service with 10-year experience across Kozhikode city.',
        phone: '+91 94471 22998',
        whatsapp: '+91 94471 22998',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        completedJobsCount: 120
      };

      const updated = await createCloudLocalWorker(newWorker);
      expect(updated.length).toBe(1);

      const registered = updated.find(w => w.name.includes('Gireesh Plumbers'));
      expect(registered).toBeDefined();
      expect(registered?.trade).toBe('Plumber');
      expect(registered?.isAvailableToday).toBe(true);
    });

    it('allows registering housemaids and cooks with daily or monthly charges', async () => {
      const housemaid: Omit<LocalWorkerProfile, 'id'> = {
        name: 'Leela Chechi',
        trade: 'Housemaid / Domestic Help',
        experienceYears: 12,
        dailyRateOrCharge: '₹500 / day or ₹15,000 / mo',
        serviceAreas: ['Kadavanthra', 'Palarivattom', 'Panampilly Nagar'],
        city: 'Kochi',
        rating: 5.0,
        reviewCount: 60,
        isAvailableToday: true,
        verifiedBadge: true,
        skills: ['Traditional Kerala Cooking', 'Deep Cleaning', 'Baby Sitting'],
        bio: 'Trustworthy domestic help with police verification and stellar references.',
        phone: '+91 98472 11002',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        completedJobsCount: 40
      };

      const list = await createCloudLocalWorker(housemaid);
      const found = list.find(w => w.name === 'Leela Chechi');
      expect(found).toBeDefined();
      expect(found?.trade).toBe('Housemaid / Domestic Help');
      expect(found?.dailyRateOrCharge).toContain('₹15,000 / mo');
    });

    it('toggles worker bookmark and deletes worker service profile', async () => {
      const newWorker: Omit<LocalWorkerProfile, 'id'> = {
        name: 'Test Electrician',
        trade: 'Electrician',
        experienceYears: 5,
        dailyRateOrCharge: '₹500 / visit',
        serviceAreas: ['Kochi'],
        city: 'Kochi',
        rating: 5.0,
        reviewCount: 1,
        isAvailableToday: true,
        completedJobsCount: 10,
        skills: ['Wiring'],
        bio: 'Electrician bio',
        phone: '+91 98470 22222',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      };
      const list = await createCloudLocalWorker(newWorker);
      const targetId = list[0].id;

      const toggled = await toggleCloudSaveLocalWorker(targetId);
      expect(toggled.find(w => w.id === targetId)?.isSaved).toBe(true);

      const removed = await deleteCloudLocalWorker(targetId);
      expect(removed.some(w => w.id === targetId)).toBe(false);
    });
  });

  describe('4. Job Applications Pipeline & Candidate Tracking', () => {
    it('returns empty list initially and allows candidate submission', async () => {
      const apps = await getCloudJobApplications();
      expect(apps).toEqual([]);

      const newApp: Omit<JobApplication, 'id'> = {
        jobId: 'job-infopark-1',
        jobTitle: 'DevOps & Cloud Infrastructure Lead',
        company: 'Thinkpalm Technologies',
        candidateId: 'test-cand-123',
        candidateName: 'Adarsh S.',
        candidatePhone: '+91 98470 55667',
        qualification: 'B.Tech CS',
        experienceYears: 5,
        coverLetter: 'I have deep expertise with AWS, Docker and Kubernetes.',
        status: 'Applied',
        appliedAt: 'Just now'
      };

      const updated = await createCloudJobApplication(newApp);
      expect(updated.length).toBe(1);

      const created = updated.find(a => a.candidateId === 'test-cand-123');
      expect(created).toBeDefined();
      expect(created?.status).toBe('Applied');
    });

    it('updates application status from Applied -> Shortlisted -> Selected', async () => {
      const newApp: Omit<JobApplication, 'id'> = {
        jobId: 'job-infopark-2',
        jobTitle: 'Senior Frontend Engineer',
        company: 'Tecforz Innovations',
        candidateId: 'cand-456',
        candidateName: 'Nisha K.',
        candidatePhone: '+91 98470 33333',
        status: 'Applied',
        appliedAt: 'Just now'
      };
      const createdList = await createCloudJobApplication(newApp);
      const targetId = createdList[0].id;

      const shortlisted = await updateCloudJobApplicationStatus(targetId, 'Shortlisted', 'Candidate cleared HR round.');
      expect(shortlisted.find(a => a.id === targetId)?.status).toBe('Shortlisted');
      expect(shortlisted.find(a => a.id === targetId)?.recruiterNotes).toContain('cleared HR round');

      const selected = await updateCloudJobApplicationStatus(targetId, 'Selected', 'Offer letter rolled out.');
      expect(selected.find(a => a.id === targetId)?.status).toBe('Selected');
    });

    it('allows candidate to withdraw application', async () => {
      const newApp: Omit<JobApplication, 'id'> = {
        jobId: 'job-infopark-3',
        jobTitle: 'Flutter Engineer',
        company: 'Panasa Technology',
        candidateId: 'cand-789',
        candidateName: 'Ajay V.',
        status: 'Applied',
        appliedAt: 'Just now'
      };
      const createdList = await createCloudJobApplication(newApp);
      const targetId = createdList[0].id;

      const withdrawn = await withdrawCloudJobApplication(targetId);
      expect(withdrawn.find(a => a.id === targetId)?.status).toBe('Withdrawn');
    });
  });

  describe('5. Service Booking Workflow & Worker Lifecycle', () => {
    it('returns empty bookings initially and creates on-demand request', async () => {
      const bookings = await getCloudServiceBookings();
      expect(bookings).toEqual([]);

      const newBooking: Omit<ServiceBooking, 'id'> = {
        customerId: 'usr-guest',
        customerName: 'Dhanya R.',
        customerPhone: '+91 98470 12345',
        workerId: 'worker-real-1',
        workerName: 'Gireesh Plumber',
        workerTrade: 'Plumber',
        serviceType: 'Pipe Leakage Repair',
        description: 'Need PVC pipe leakage repair.',
        requestedDate: 'Today',
        requestedTime: '02:00 PM',
        address: 'PT Usha Road, Kozhikode',
        city: 'Kozhikode',
        estimatedPrice: '₹350 / visit',
        status: 'Requested',
        createdAt: 'Just now'
      };

      const updated = await createCloudServiceBooking(newBooking);
      expect(updated.length).toBe(1);

      const created = updated.find(b => b.serviceType.includes('Pipe Leakage'));
      expect(created).toBeDefined();
      expect(created?.status).toBe('Requested');
    });

    it('advances service booking through Requested -> Scheduled -> On The Way -> Completed', async () => {
      const newBooking: Omit<ServiceBooking, 'id'> = {
        customerId: 'usr-1',
        customerName: 'Customer Test',
        workerId: 'w-1',
        workerName: 'Worker Test',
        workerTrade: 'Electrician',
        serviceType: 'Wiring Fix',
        description: 'Fix switch',
        requestedDate: 'Today',
        requestedTime: '10:00 AM',
        address: 'Kochi',
        city: 'Kochi',
        estimatedPrice: '₹300',
        status: 'Requested',
        createdAt: 'Just now'
      };
      const list = await createCloudServiceBooking(newBooking);
      const targetId = list[0].id;

      const scheduled = await updateCloudServiceBookingStatus(targetId, 'Scheduled', 'Worker accepted.');
      expect(scheduled.find(b => b.id === targetId)?.status).toBe('Scheduled');

      const onTheWay = await updateCloudServiceBookingStatus(targetId, 'On The Way', 'Arriving in 15 mins.');
      expect(onTheWay.find(b => b.id === targetId)?.status).toBe('On The Way');

      const completed = await updateCloudServiceBookingStatus(targetId, 'Completed', 'Work finished.');
      expect(completed.find(b => b.id === targetId)?.status).toBe('Completed');
    });

    it('cancels a booking with reason', async () => {
      const newBooking: Omit<ServiceBooking, 'id'> = {
        customerId: 'usr-1',
        customerName: 'Customer Test',
        workerId: 'w-1',
        workerName: 'Worker Test',
        workerTrade: 'Electrician',
        serviceType: 'Wiring Fix',
        description: 'Fix switch',
        requestedDate: 'Today',
        requestedTime: '10:00 AM',
        address: 'Kochi',
        city: 'Kochi',
        estimatedPrice: '₹300',
        status: 'Requested',
        createdAt: 'Just now'
      };
      const list = await createCloudServiceBooking(newBooking);
      const targetId = list[0].id;

      const cancelled = await cancelCloudServiceBooking(targetId, 'Customer rescheduled travel.');
      expect(cancelled.find(b => b.id === targetId)?.status).toBe('Cancelled');
      expect(cancelled.find(b => b.id === targetId)?.workerNotes).toContain('Customer rescheduled');
    });
  });

  describe('6. Worker Reviews and Rating Recalculation', () => {
    it('creates review and automatically recalculates worker average rating', async () => {
      // Register a real worker first
      const worker: Omit<LocalWorkerProfile, 'id'> = {
        name: 'Gireesh Kumar',
        trade: 'Plumber',
        experienceYears: 10,
        dailyRateOrCharge: '₹400 / visit',
        serviceAreas: ['Kochi'],
        city: 'Kochi',
        rating: 5.0,
        reviewCount: 0,
        isAvailableToday: true,
        completedJobsCount: 15,
        skills: ['Plumbing'],
        bio: 'Bio',
        phone: '+91 94471 22998',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      };
      const wList = await createCloudLocalWorker(worker);
      const workerId = wList[0].id;

      const newReview: Omit<WorkerReview, 'id'> = {
        workerId,
        reviewerId: 'rev-user-99',
        reviewerName: 'Prasanth Nair',
        rating: 5,
        review: 'Prompt and very neat plumbing service. Cleaned up afterwards.',
        createdAt: 'Just now'
      };

      const { reviews, updatedWorkerList } = await createCloudWorkerReview(newReview);
      expect(reviews.some(r => r.reviewerName === 'Prasanth Nair')).toBe(true);

      const targetWorker = updatedWorkerList.find(w => w.id === workerId);
      expect(targetWorker).toBeDefined();
      expect(targetWorker?.reviewCount).toBe(1);
      expect(targetWorker?.rating).toBe(5);
    });
  });

  describe('7. Moderation & Abuse Reporting', () => {
    it('creates abuse and scam reports for moderation team', async () => {
      const report: Omit<JobReport, 'id'> = {
        targetType: 'job',
        targetId: 'job-sample',
        targetTitle: 'Suspicious High Paying Data Entry Job',
        reporterId: 'usr-reporter',
        reason: 'Fake Job / Scam',
        details: 'Asking registration fee before giving work.',
        status: 'Pending',
        createdAt: 'Just now'
      };

      const reports = await createCloudReport(report);
      expect(reports.length).toBeGreaterThanOrEqual(1);

      const found = reports.find(r => r.targetTitle.includes('Data Entry'));
      expect(found).toBeDefined();
      expect(found?.status).toBe('Pending');
    });
  });

  describe('8. Geolocation Haversine Distance Helper', () => {
    it('calculates accurate distance in km between geographic coordinates', () => {
      // Kozhikode beach (11.2588, 75.7804) to Mavoor Road (11.2612, 75.7950) ~ 1.6 km
      const distance1 = calculateDistanceKm(11.2588, 75.7804, 11.2612, 75.7950);
      expect(distance1).toBeGreaterThan(1.0);
      expect(distance1).toBeLessThan(3.0);

      // Kozhikode (11.2588, 75.7804) to Kochi (9.9312, 76.2673) ~ 155-165 km
      const distance2 = calculateDistanceKm(11.2588, 75.7804, 9.9312, 76.2673);
      expect(distance2).toBeGreaterThan(140);
      expect(distance2).toBeLessThan(180);
    });
  });
});
