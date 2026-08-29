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
    it('returns default initial vacancies when storage is empty', async () => {
      const vacancies = await getCloudJobVacancies();
      expect(vacancies.length).toBeGreaterThanOrEqual(4);
      expect(vacancies.some(j => j.category === 'Technology & IT')).toBe(true);
      expect(vacancies.some(j => j.category === 'Local Trades & Skilled Labor')).toBe(true);
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
    it('returns default candidate profiles with qualification & experience details', async () => {
      const seekers = await getCloudJobSeekers();
      expect(seekers.length).toBeGreaterThanOrEqual(3);
      
      const rahul = seekers.find(s => s.fullName === 'Rahul Krishnan');
      expect(rahul).toBeDefined();
      expect(rahul?.experienceYears).toBe(4);
      expect(rahul?.qualification).toContain('B.Tech');
      expect(rahul?.availability).toBe('Immediate');
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
      expect(updated.length).toBe(INITIAL_JOB_SEEKERS.length + 1);

      const added = updated.find(s => s.fullName === 'Kavya S. Menon');
      expect(added).toBeDefined();
      expect(added?.qualification).toContain('Chartered Accountant');
      expect(added?.availability).toBe('Immediate');
    });

    it('toggles candidate bookmark and deletes seeker profile', async () => {
      const seekers = await getCloudJobSeekers();
      const targetId = seekers[0].id;

      const toggled = await toggleCloudSaveJobSeeker(targetId);
      expect(toggled.find(s => s.id === targetId)?.isSaved).toBe(true);

      const removed = await deleteCloudJobSeeker(targetId);
      expect(removed.some(s => s.id === targetId)).toBe(false);
    });
  });

  describe('3. Local Workers & Home Services (Electricians, Plumbers, Housemaids, Drivers)', () => {
    it('returns verified local trade pros with daily rates and service areas', async () => {
      const workers = await getCloudLocalWorkers();
      expect(workers.length).toBeGreaterThanOrEqual(4);

      expect(workers.some(w => w.trade === 'Electrician')).toBe(true);
      expect(workers.some(w => w.trade === 'Plumber')).toBe(true);
      expect(workers.some(w => w.trade === 'Housemaid / Domestic Help')).toBe(true);
      expect(workers.some(w => w.trade === 'Driver (Car / Heavy)')).toBe(true);

      const electrician = workers.find(w => w.trade === 'Electrician');
      expect(electrician?.serviceAreas.length).toBeGreaterThan(0);
      expect(electrician?.rating).toBeGreaterThanOrEqual(4.5);
      expect(electrician?.verifiedBadge).toBe(true);
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
      expect(updated.length).toBe(INITIAL_LOCAL_WORKERS.length + 1);

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
      const workers = await getCloudLocalWorkers();
      const targetId = workers[0].id;

      const toggled = await toggleCloudSaveLocalWorker(targetId);
      expect(toggled.find(w => w.id === targetId)?.isSaved).toBe(true);

      const removed = await deleteCloudLocalWorker(targetId);
      expect(removed.some(w => w.id === targetId)).toBe(false);
    });
  });

  describe('4. Job Applications Pipeline & Candidate Tracking', () => {
    it('returns seed job applications and allows candidate submission', async () => {
      const apps = await getCloudJobApplications();
      expect(apps.length).toBeGreaterThanOrEqual(2);

      const newApp: Omit<JobApplication, 'id'> = {
        jobId: 'job-1',
        jobTitle: 'Senior React Developer',
        company: 'Malabar Innovations',
        candidateId: 'test-cand-123',
        candidateName: 'Adarsh S.',
        candidatePhone: '+91 98470 55667',
        qualification: 'BCA & MCA',
        experienceYears: 3,
        coverLetter: 'I have deep expertise with React and Vite apps.',
        status: 'Applied',
        appliedAt: 'Just now'
      };

      const updated = await createCloudJobApplication(newApp);
      expect(updated.length).toBe(INITIAL_JOB_APPLICATIONS.length + 1);

      const created = updated.find(a => a.candidateId === 'test-cand-123');
      expect(created).toBeDefined();
      expect(created?.status).toBe('Applied');
    });

    it('updates application status from Applied -> Shortlisted -> Selected', async () => {
      const apps = await getCloudJobApplications();
      const targetId = apps[0].id;

      const shortlisted = await updateCloudJobApplicationStatus(targetId, 'Shortlisted', 'Candidate cleared HR round.');
      expect(shortlisted.find(a => a.id === targetId)?.status).toBe('Shortlisted');
      expect(shortlisted.find(a => a.id === targetId)?.recruiterNotes).toContain('cleared HR round');

      const selected = await updateCloudJobApplicationStatus(targetId, 'Selected', 'Offer letter rolled out.');
      expect(selected.find(a => a.id === targetId)?.status).toBe('Selected');
    });

    it('allows candidate to withdraw application', async () => {
      const apps = await getCloudJobApplications();
      const targetId = apps[0].id;

      const withdrawn = await withdrawCloudJobApplication(targetId);
      expect(withdrawn.find(a => a.id === targetId)?.status).toBe('Withdrawn');
    });
  });

  describe('5. Service Booking Workflow & Worker Lifecycle', () => {
    it('returns initial service bookings and creates on-demand request', async () => {
      const bookings = await getCloudServiceBookings();
      expect(bookings.length).toBeGreaterThanOrEqual(2);

      const newBooking: Omit<ServiceBooking, 'id'> = {
        customerId: 'usr-guest',
        customerName: 'Dhanya R.',
        customerPhone: '+91 98470 12345',
        workerId: 'worker-1',
        workerName: 'K. Balan (Balan Chettan)',
        workerTrade: 'Electrician',
        serviceType: 'Inverter Battery & DB Rewiring',
        description: 'Need inverter bypass switch installation.',
        requestedDate: 'Today',
        requestedTime: '02:00 PM',
        address: 'PT Usha Road, Kozhikode',
        city: 'Kozhikode',
        estimatedPrice: '₹450 / visit',
        status: 'Requested',
        createdAt: 'Just now'
      };

      const updated = await createCloudServiceBooking(newBooking);
      expect(updated.length).toBe(INITIAL_SERVICE_BOOKINGS.length + 1);

      const created = updated.find(b => b.serviceType.includes('Inverter Battery'));
      expect(created).toBeDefined();
      expect(created?.status).toBe('Requested');
    });

    it('advances service booking through Requested -> Scheduled -> On The Way -> Completed', async () => {
      const bookings = await getCloudServiceBookings();
      const targetId = bookings[0].id;

      const scheduled = await updateCloudServiceBookingStatus(targetId, 'Scheduled', 'Worker accepted.');
      expect(scheduled.find(b => b.id === targetId)?.status).toBe('Scheduled');

      const onTheWay = await updateCloudServiceBookingStatus(targetId, 'On The Way', 'Arriving in 15 mins.');
      expect(onTheWay.find(b => b.id === targetId)?.status).toBe('On The Way');

      const completed = await updateCloudServiceBookingStatus(targetId, 'Completed', 'Work finished.');
      expect(completed.find(b => b.id === targetId)?.status).toBe('Completed');
    });

    it('cancels a booking with reason', async () => {
      const bookings = await getCloudServiceBookings();
      const targetId = bookings[0].id;

      const cancelled = await cancelCloudServiceBooking(targetId, 'Customer rescheduled travel.');
      expect(cancelled.find(b => b.id === targetId)?.status).toBe('Cancelled');
      expect(cancelled.find(b => b.id === targetId)?.workerNotes).toContain('Customer rescheduled');
    });
  });

  describe('6. Worker Reviews and Rating Recalculation', () => {
    it('creates review and automatically recalculates worker average rating', async () => {
      const newReview: Omit<WorkerReview, 'id'> = {
        workerId: 'worker-1',
        reviewerId: 'rev-user-99',
        reviewerName: 'Prasanth Nair',
        rating: 5,
        review: 'Prompt and very neat electrical wiring service. Cleaned up afterwards.',
        createdAt: 'Just now'
      };

      const { reviews, updatedWorkerList } = await createCloudWorkerReview(newReview);
      expect(reviews.some(r => r.reviewerName === 'Prasanth Nair')).toBe(true);

      const targetWorker = updatedWorkerList.find(w => w.id === 'worker-1');
      expect(targetWorker).toBeDefined();
      expect(targetWorker?.reviewCount).toBeGreaterThanOrEqual(2);
      expect(targetWorker?.rating).toBeGreaterThanOrEqual(4.5);
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
