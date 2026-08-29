import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  UserCheck, 
  Wrench, 
  Search, 
  Plus, 
  MapPin, 
  Building2, 
  DollarSign, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  Phone, 
  Mail, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Filter, 
  Send,
  Zap,
  Users,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Navigation,
  ShieldAlert,
  User,
  CheckSquare,
  Globe2,
  Landmark,
  Layers
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { 
  JobCategory, 
  JobSeekerProfile, 
  JobType, 
  JobVacancy, 
  LocalWorkerProfile, 
  WorkerTrade 
} from '../../types/superApp';
import { calculateDistanceKm } from '../../services/cloudDatabaseService';

// Modals & Detail Views
import { PostJobVacancyModal } from './PostJobVacancyModal';
import { PostJobSeekerModal } from './PostJobSeekerModal';
import { RegisterLocalWorkerModal } from './RegisterLocalWorkerModal';
import { JobDetailsView } from './JobDetailsView';
import { JobSeekerDetailsView } from './JobSeekerDetailsView';
import { LocalWorkerDetailsView } from './LocalWorkerDetailsView';
import { JobApplicationModal } from './JobApplicationModal';
import { ServiceBookingModal } from './ServiceBookingModal';
import { JobReportModal } from './JobReportModal';

// Role Dashboards & Admin Sources
import { RecruiterDashboardView } from './RecruiterDashboardView';
import { CandidateDashboardView } from './CandidateDashboardView';
import { WorkerDashboardView } from './WorkerDashboardView';
import { AdminJobSourcesDashboard } from './AdminJobSourcesDashboard';

export const JobPortalView: React.FC = () => {
  const { 
    user,
    jobVacancies, 
    toggleSaveJob, 
    deleteJobVacancy,
    jobSeekers, 
    toggleSaveJobSeeker, 
    deleteJobSeeker,
    localWorkers, 
    toggleSaveLocalWorker, 
    deleteLocalWorker,
    jobApplications,
    serviceBookings,
    syncJobSources,
    startNewChatWith,
    setActiveMiniApp,
    showToast 
  } = useSuperApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'vacancies' | 'seekers' | 'workers' | 'admin_sources' | 'recruiter_dash' | 'candidate_dash' | 'worker_dash' | 'my_posts'
  >('vacancies');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);
  const [nearMeRadiusKm, setNearMeRadiusKm] = useState<number | null>(null);

  // Modals state
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isPostSeekerModalOpen, setIsPostSeekerModalOpen] = useState(false);
  const [isRegisterWorkerModalOpen, setIsRegisterWorkerModalOpen] = useState(false);

  // Inspection Views state
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<JobSeekerProfile | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<LocalWorkerProfile | null>(null);

  // Action Modals state
  const [jobToApply, setJobToApply] = useState<JobVacancy | null>(null);
  const [workerToBook, setWorkerToBook] = useState<LocalWorkerProfile | null>(null);
  const [reportTarget, setReportTarget] = useState<{ type: 'job' | 'worker' | 'candidate'; id: string; title: string } | null>(null);

  // Pan-India Cities & States List
  const CITIES = [
    'All',
    'All India',
    'Bengaluru',
    'Kochi',
    'Hyderabad',
    'Mumbai',
    'Chennai',
    'New Delhi',
    'Pune',
    'Gurugram',
    'Noida',
    'Kozhikode',
    'Thiruvananthapuram',
    'Thrissur',
    'Mysuru',
    'Ahmedabad',
    'Kolkata',
    'Remote'
  ];

  // All Categories / Trades
  const ALL_CATEGORIES = [
    'All',
    'Technology & IT',
    'Local Trades & Skilled Labor',
    'Domestic & Housekeeping',
    'Sales & Marketing',
    'Healthcare & Nursing',
    'Finance & Accounting',
    'Logistics & Driving',
    'Beauty & Wellness',
    'Security & Facility'
  ];

  const WORKER_TRADE_CATEGORIES = [
    'All',
    'Electrician',
    'Plumber',
    'Housemaid / Domestic Help',
    'Driver (Car / Heavy)',
    'Carpenter',
    'Appliance & AC Technician',
    'Painter',
    'Cook / Home Chef',
    'Beautician & Hair Stylist',
    'Cleaning Worker / Deep Cleaner',
    'Security Guard',
    'Delivery Worker'
  ];

  // Filtered Job Vacancies
  const filteredVacancies = useMemo(() => {
    return jobVacancies.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = selectedCity === 'All' || selectedCity === 'All India' || 
        job.city.toLowerCase().includes(selectedCity.toLowerCase()) || 
        (job.state && job.state.toLowerCase().includes(selectedCity.toLowerCase())) ||
        (selectedCity === 'Remote' && job.isRemote);

      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesUrgent = !filterUrgentOnly || job.isUrgent;
      const matchesSource = selectedSourceType === 'all' || job.sourceType === selectedSourceType;

      return matchesSearch && matchesCity && matchesCategory && matchesUrgent && matchesSource;
    });
  }, [jobVacancies, searchQuery, selectedCity, selectedCategory, selectedSourceType, filterUrgentOnly]);

  // Filtered Job Seekers
  const filteredSeekers = useMemo(() => {
    return jobSeekers.filter(seeker => {
      const matchesSearch = 
        seeker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seeker.desiredRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seeker.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seeker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        seeker.preferredLocation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = selectedCity === 'All' || seeker.city.toLowerCase().includes(selectedCity.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || seeker.category === selectedCategory;
      const matchesUrgent = !filterUrgentOnly || seeker.availability === 'Immediate';

      return matchesSearch && matchesCity && matchesCategory && matchesUrgent;
    });
  }, [jobSeekers, searchQuery, selectedCity, selectedCategory, filterUrgentOnly]);

  // Filtered Local Workers
  const filteredWorkers = useMemo(() => {
    return localWorkers.filter(worker => {
      const matchesSearch = 
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.serviceAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        worker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCity = selectedCity === 'All' || worker.city.toLowerCase().includes(selectedCity.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || worker.trade === selectedCategory;
      const matchesUrgent = !filterUrgentOnly || worker.isAvailableToday;

      return matchesSearch && matchesCity && matchesCategory && matchesUrgent;
    });
  }, [localWorkers, searchQuery, selectedCity, selectedCategory, filterUrgentOnly]);

  // My Postings
  const myVacancies = useMemo(() => jobVacancies.filter(j => j.postedByUserId === user.id || j.isSaved), [jobVacancies, user.id]);
  const mySeekers = useMemo(() => jobSeekers.filter(s => s.postedByUserId === user.id || s.isSaved), [jobSeekers, user.id]);
  const myWorkers = useMemo(() => localWorkers.filter(w => w.postedByUserId === user.id || w.isSaved), [localWorkers, user.id]);

  // Direct AditiChat Initiator
  const handleStartChatWithContact = (name: string, avatar: string, roleTitle: string, defaultGreeting: string) => {
    startNewChatWith(name, avatar, roleTitle, defaultGreeting, true);
    setActiveMiniApp('chat');
    showToast(`💬 Connected with ${name}! Opening live messenger...`);
  };

  const handleToggleNearMe = () => {
    if (nearMeRadiusKm === null) {
      setNearMeRadiusKm(10);
      showToast('📍 Filtering verified local pros within 10 km of your location.');
    } else if (nearMeRadiusKm === 10) {
      setNearMeRadiusKm(25);
      showToast('📍 Extended search radius to 25 km.');
    } else {
      setNearMeRadiusKm(null);
      showToast('📍 Location radius filter cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 pt-2 px-3 sm:px-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* ==================== HERO BANNER & STATS ==================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-white/10 p-5 sm:p-8 shadow-2xl mb-6">
        
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>Pan-India Career Aggregation & Local Trade Services</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Aditi Jobs — India's Jobs & Career Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Connect directly with official vacancies across India (National Career Service, Top MNCs, State Exchanges) alongside on-demand local skilled trades (Electricians, Plumbers, Tech Pros & Artisans).
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md text-center">
                <div className="text-lg sm:text-xl font-black text-indigo-400">{jobVacancies.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vacancies</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md text-center">
                <div className="text-lg sm:text-xl font-black text-cyan-400">{jobSeekers.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Talent Profiles</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md text-center">
                <div className="text-lg sm:text-xl font-black text-amber-400">{localWorkers.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Pros</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md text-center">
                <div className="text-lg sm:text-xl font-black text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Direct Contact</div>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>+ Post Job Vacancy</span>
            </button>

            <button
              onClick={() => setIsPostSeekerModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>+ Post Candidate Profile</span>
            </button>

            <button
              onClick={() => setIsRegisterWorkerModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Wrench className="w-4 h-4" />
              <span>+ Register as Trade Pro</span>
            </button>
          </div>

        </div>

      </div>

      {/* ==================== TAB NAVIGATION ==================== */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl mb-5 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => { setActiveTab('vacancies'); setSelectedCategory('All'); }}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'vacancies'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Vacancies ({jobVacancies.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('seekers'); setSelectedCategory('All'); }}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'seekers'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Candidates ({jobSeekers.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('workers'); setSelectedCategory('All'); }}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'workers'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Local Workers ({localWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recruiter_dash')}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'recruiter_dash'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Recruiter Hub ({jobApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('candidate_dash')}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'candidate_dash'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>My Applications</span>
        </button>

        <button
          onClick={() => setActiveTab('worker_dash')}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'worker_dash'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Worker Hub ({serviceBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_posts')}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'my_posts'
              ? 'bg-slate-700 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Saved / Mine</span>
        </button>

        <button
          onClick={() => setActiveTab('admin_sources')}
          className={`py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'admin_sources'
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-indigo-400 hover:text-white hover:bg-indigo-950/40 border border-indigo-500/20'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Data Sources (NCS / APIs)</span>
        </button>

      </div>

      {/* ==================== SEARCH & FILTERS CONTROLS ==================== */}
      {activeTab !== 'my_posts' && activeTab !== 'recruiter_dash' && activeTab !== 'candidate_dash' && activeTab !== 'worker_dash' && activeTab !== 'admin_sources' && (
        <div className="space-y-3 mb-6">
          
          {/* Main Search Bar + City Selector + Near Me Button */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'vacancies'
                    ? "Search job title, company, skills (e.g. React, Electrician, Accountant)..."
                    : activeTab === 'seekers'
                    ? "Search candidates, desired role, degree (e.g. B.Tech, M.Com, Driver)..."
                    : "Search trade pros (e.g. Electrician, Plumber, Housemaid, Chevayur)..."
                }
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="sm:col-span-6 flex gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city === 'All' ? 'All Districts / Locations' : city}</option>
                  ))}
                </select>
              </div>

              {/* Near Me Geolocation Radius Filter */}
              <button
                onClick={handleToggleNearMe}
                className={`px-3.5 py-3 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all select-none ${
                  nearMeRadiusKm !== null
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Near Me Radius Filter"
              >
                <Navigation className={`w-3.5 h-3.5 ${nearMeRadiusKm !== null ? 'text-emerald-400 animate-spin' : ''}`} />
                <span>{nearMeRadiusKm ? `${nearMeRadiusKm} km` : 'Near Me'}</span>
              </button>

              <button
                onClick={() => setFilterUrgentOnly(!filterUrgentOnly)}
                className={`px-3.5 py-3 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all select-none ${
                  filterUrgentOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle Urgent Only"
              >
                <Zap className={`w-3.5 h-3.5 ${filterUrgentOnly ? 'text-rose-400 fill-rose-400' : ''}`} />
                <span className="hidden sm:inline">Urgent</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {(activeTab === 'workers' ? WORKER_TRADE_CATEGORIES : ALL_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pan-India Data Source Chips (when browsing vacancies) */}
          {activeTab === 'vacancies' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              <span className="text-slate-500 font-bold uppercase tracking-wider px-1">Source:</span>
              {[
                { id: 'all', label: 'All Sources', icon: <Layers className="w-3 h-3" /> },
                { id: 'government', label: '🏛️ Govt NCS', icon: <Landmark className="w-3 h-3 text-amber-400" /> },
                { id: 'company_career', label: '🏢 Top MNCs', icon: <Building2 className="w-3 h-3 text-indigo-400" /> },
                { id: 'state_portal', label: '🌐 State Portals', icon: <Globe2 className="w-3 h-3 text-emerald-400" /> },
                { id: 'aggregator_api', label: '⚡ Aggregators', icon: <Zap className="w-3 h-3 text-cyan-400" /> },
                { id: 'direct', label: '🎯 Direct Recruiter', icon: <User className="w-3 h-3 text-rose-400" /> }
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => setSelectedSourceType(src.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap transition-all ${
                    selectedSourceType === src.id
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
                  }`}
                >
                  {src.icon}
                  <span>{src.label}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ==================== TAB 1: JOB VACANCIES ==================== */}
      {activeTab === 'vacancies' && (
        <div>
          {filteredVacancies.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
              <Briefcase className="w-12 h-12 text-indigo-400 mx-auto" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">No Job Vacancies Found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No active vacancies match your current filters. You can sync live postings from National Career Service (NCS), State Portals, and MNCs, or post a new vacancy.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => syncJobSources()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Landmark className="w-4 h-4" />
                  <span>🔄 Sync Live Pan-India Jobs (NCS, Portals, MNCs)</span>
                </button>

                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 active:scale-95 transition-all"
                >
                  + Post a Direct Vacancy
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredVacancies.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/40 p-5 shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  
                  {/* Top Row: Title, Company, Category, Urgent Flag, Bookmark */}
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {job.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                            {job.jobType}
                          </span>
                          
                          {/* Pan-India Source Attribution Badge */}
                          {job.primarySource ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Landmark className="w-2.5 h-2.5" />
                              <span>{job.primarySource.split('(')[0].trim()}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" />
                              <span>Aditi Direct</span>
                            </span>
                          )}

                          {job.sources && job.sources.length > 1 && (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-indigo-900/60 text-indigo-300 border border-indigo-500/40">
                              +{job.sources.length} sources
                            </span>
                          )}

                          {job.isUrgent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                              <span>Urgent</span>
                            </span>
                          )}
                          {job.isRemote && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                              Remote OK
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{job.company}</span>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      {/* Bookmark / Delete */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`p-2 rounded-xl border transition-all ${
                            job.isSaved
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Bookmark Job"
                        >
                          <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-amber-400' : ''}`} />
                        </button>
                        {job.postedByUserId === user.id && (
                          <button
                            onClick={() => deleteJobVacancy(job.id)}
                            className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete My Posting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Salary & Openings Highlight */}
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs sm:text-sm">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salaryFormatted}</span>
                      </div>
                      <span className="text-slate-600">|</span>
                      <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{job.qualificationRequired}</span>
                      </div>
                      <span className="text-slate-600">|</span>
                      <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{job.experienceRequired}</span>
                      </div>
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recruiter Bar & Smart Action */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={job.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={job.contactName}
                        className="w-8 h-8 rounded-xl object-cover border border-indigo-500/30 shrink-0"
                      />
                      <div className="text-[11px] min-w-0">
                        <div className="font-bold text-white truncate">{job.contactName}</div>
                        <div className="text-slate-400 text-[10px] truncate">
                          {job.primarySource || job.contactEmail || job.contactPhone || 'Verified Posting'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {job.contactEmail && (
                        <a
                          href={`mailto:${job.contactEmail}?subject=Application for ${encodeURIComponent(job.title)}`}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                          title="Email Recruiter"
                        >
                          <Mail className="w-4 h-4 text-cyan-400" />
                        </a>
                      )}
                      {job.contactPhone && (
                        <a
                          href={`tel:${job.contactPhone}`}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                          title="Call Recruiter"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                        </a>
                      )}
                      {job.canonicalApplyUrl && job.applyMode === 'external_redirect' ? (
                        <a
                          href={job.canonicalApplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <span>Apply on Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          onClick={() => setJobToApply(job)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Apply Now</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: JOB SEEKERS & CANDIDATES ==================== */}
      {activeTab === 'seekers' && (
        <div>
          {filteredSeekers.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800">
              <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Candidate Profiles Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                No job seekers match your selected filters. Try broadening your search or post your profile!
              </p>
              <button
                onClick={() => setIsPostSeekerModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs"
              >
                + Post Candidate Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredSeekers.map((seeker) => (
                <div
                  key={seeker.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 p-5 shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                  onClick={() => setSelectedSeeker(seeker)}
                >
                  
                  {/* Top Candidate Profile & Badges */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={seeker.avatar}
                          alt={seeker.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-md"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                              {seeker.fullName}
                            </h3>
                            {seeker.isVerified && (
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-cyan-400">{seeker.desiredRole}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            <span>{seeker.preferredLocation}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark / Delete */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSaveJobSeeker(seeker.id)}
                          className={`p-2 rounded-xl border transition-all ${
                            seeker.isSaved
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Bookmark Candidate"
                        >
                          <Bookmark className={`w-4 h-4 ${seeker.isSaved ? 'fill-amber-400' : ''}`} />
                        </button>
                        {seeker.postedByUserId === user.id && (
                          <button
                            onClick={() => deleteJobSeeker(seeker.id)}
                            className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete My Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Highlights: Experience, Qualification, Expected Salary, Availability */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">QUALIFICATION</span>
                        <span className="font-extrabold text-slate-200">{seeker.qualification}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">EXPERIENCE</span>
                        <span className="font-extrabold text-amber-300">{seeker.experienceYears} Years</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">EXPECTED PAY</span>
                        <span className="font-extrabold text-emerald-400">{seeker.expectedSalary}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">AVAILABILITY</span>
                        <span className="font-extrabold text-cyan-300">{seeker.availability}</span>
                      </div>
                    </div>

                    {/* Headline & Summary */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-200 italic">
                        "{seeker.resumeHeadline}"
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {seeker.experienceSummary}
                      </p>
                    </div>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {seeker.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-cyan-950/60 text-cyan-200 text-[11px] font-semibold border border-cyan-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="text-[11px] text-slate-400">
                      <span>Phone: </span>
                      <span className="font-bold text-white">{seeker.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${seeker.phone}`}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                        title="Call Candidate"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleStartChatWithContact(
                          seeker.fullName,
                          seeker.avatar,
                          `Candidate • ${seeker.desiredRole}`,
                          `Hello ${seeker.fullName}, we saw your profile for "${seeker.desiredRole}" and would love to discuss an opportunity.`
                        )}
                        className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Hire / Chat</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: LOCAL GIG WORKERS & HOME SERVICES ==================== */}
      {activeTab === 'workers' && (
        <div>
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800">
              <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Local Workers Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                No local service pros registered under this trade or area yet. Be the first to list your service!
              </p>
              <button
                onClick={() => setIsRegisterWorkerModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
              >
                + Register as Trade Pro / Worker
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/40 p-5 shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                  onClick={() => setSelectedWorker(worker)}
                >
                  
                  {/* Top Worker Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                              {worker.name}
                            </h3>
                            {worker.verifiedBadge && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span>Verified Pro</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {worker.trade}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400 text-xs font-extrabold">
                              <Star className="w-3.5 h-3.5 fill-yellow-400" />
                              <span>{worker.rating.toFixed(1)}</span>
                              <span className="text-slate-400 text-[10px]">({worker.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark / Delete */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSaveLocalWorker(worker.id)}
                          className={`p-2 rounded-xl border transition-all ${
                            worker.isSaved
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Bookmark Worker"
                        >
                          <Bookmark className={`w-4 h-4 ${worker.isSaved ? 'fill-amber-400' : ''}`} />
                        </button>
                        {worker.postedByUserId === user.id && (
                          <button
                            onClick={() => deleteLocalWorker(worker.id)}
                            className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete My Service Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Daily Rate & Work Status Banner */}
                    <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
                        <DollarSign className="w-4 h-4" />
                        <span>{worker.dailyRateOrCharge}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        {worker.isAvailableToday ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>🟢 Available for Work Today</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">📅 Pre-booking Only</span>
                        )}
                      </div>
                    </div>

                    {/* Service Areas */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>Service Areas ({worker.city}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {worker.serviceAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio & Skills */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {worker.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {worker.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-amber-950/50 text-amber-200 text-[11px] font-semibold border border-amber-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Contact Buttons: Call, WhatsApp, Book */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="text-[11px]">
                      <span className="text-slate-400">Completed: </span>
                      <span className="font-bold text-emerald-400">{worker.completedJobsCount}+ Jobs</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${worker.phone}`}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                        title="Call Worker"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      {worker.whatsapp && (
                        <a
                          href={`https://wa.me/${worker.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(worker.name)},%20I%20saw%20your%20${encodeURIComponent(worker.trade)}%20profile%20on%20Aditi%20Super%20App.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs shadow-md shadow-green-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                          title="WhatsApp Direct"
                        >
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <button
                        onClick={() => setWorkerToBook(worker)}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== ROLE DASHBOARDS ==================== */}
      {activeTab === 'recruiter_dash' && (
        <RecruiterDashboardView
          onPostJob={() => setIsPostJobModalOpen(true)}
          onViewJob={(job) => setSelectedJob(job)}
        />
      )}

      {activeTab === 'candidate_dash' && (
        <CandidateDashboardView
          onPostProfile={() => setIsPostSeekerModalOpen(true)}
        />
      )}

      {activeTab === 'worker_dash' && (
        <WorkerDashboardView
          onRegisterWorker={() => setIsRegisterWorkerModalOpen(true)}
        />
      )}

      {/* ==================== TAB 4: MY POSTINGS & ACTIVITY ==================== */}
      {activeTab === 'my_posts' && (
        <div className="space-y-6">
          
          {/* User Job Vacancies */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>My Vacancies & Saved Jobs ({myVacancies.length})</span>
            </h3>
            {myVacancies.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                You have not posted or bookmarked any job vacancies yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myVacancies.map((job) => (
                  <div key={job.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">{job.title}</div>
                      <div className="text-[11px] text-slate-400">{job.company} • {job.salaryFormatted}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 rounded-xl bg-slate-800 text-amber-400"
                        title="Bookmark"
                      >
                        <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={() => deleteJobVacancy(job.id)}
                        className="p-2 rounded-xl bg-slate-800 text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Candidate Profiles */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>My Candidate Profiles & Saved Talent ({mySeekers.length})</span>
            </h3>
            {mySeekers.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                You have not posted or bookmarked any candidate profiles yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mySeekers.map((seeker) => (
                  <div key={seeker.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">{seeker.fullName}</div>
                      <div className="text-[11px] text-cyan-400">{seeker.desiredRole} • {seeker.qualification}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSaveJobSeeker(seeker.id)}
                        className="p-2 rounded-xl bg-slate-800 text-amber-400"
                        title="Bookmark"
                      >
                        <Bookmark className={`w-4 h-4 ${seeker.isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={() => deleteJobSeeker(seeker.id)}
                        className="p-2 rounded-xl bg-slate-800 text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Trade Listings */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>My Trade Service Listings & Saved Pros ({myWorkers.length})</span>
            </h3>
            {myWorkers.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                You have not registered or bookmarked any local service profiles yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myWorkers.map((worker) => (
                  <div key={worker.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">{worker.name}</div>
                      <div className="text-[11px] text-amber-400">{worker.trade} • {worker.dailyRateOrCharge}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSaveLocalWorker(worker.id)}
                        className="p-2 rounded-xl bg-slate-800 text-amber-400"
                        title="Bookmark"
                      >
                        <Bookmark className={`w-4 h-4 ${worker.isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={() => deleteLocalWorker(worker.id)}
                        className="p-2 rounded-xl bg-slate-800 text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==================== TAB 5: ADMIN JOB DATA SOURCES ==================== */}
      {activeTab === 'admin_sources' && (
        <AdminJobSourcesDashboard />
      )}

      {/* ==================== POSTING MODALS ==================== */}
      <PostJobVacancyModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
      />

      <PostJobSeekerModal
        isOpen={isPostSeekerModalOpen}
        onClose={() => setIsPostSeekerModalOpen(false)}
      />

      <RegisterLocalWorkerModal
        isOpen={isRegisterWorkerModalOpen}
        onClose={() => setIsRegisterWorkerModalOpen(false)}
      />

      {/* ==================== DETAIL VIEWS ==================== */}
      <JobDetailsView
        job={selectedJob}
        isOpen={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
        onApply={(job) => setJobToApply(job)}
        onReport={(job) => setReportTarget({ type: 'job', id: job.id, title: job.title })}
      />

      <JobSeekerDetailsView
        seeker={selectedSeeker}
        isOpen={selectedSeeker !== null}
        onClose={() => setSelectedSeeker(null)}
      />

      <LocalWorkerDetailsView
        worker={selectedWorker}
        isOpen={selectedWorker !== null}
        onClose={() => setSelectedWorker(null)}
        onBook={(worker) => setWorkerToBook(worker)}
      />

      {/* ==================== ACTION MODALS ==================== */}
      <JobApplicationModal
        job={jobToApply}
        isOpen={jobToApply !== null}
        onClose={() => setJobToApply(null)}
      />

      <ServiceBookingModal
        worker={workerToBook}
        isOpen={workerToBook !== null}
        onClose={() => setWorkerToBook(null)}
      />

      <JobReportModal
        target={reportTarget}
        isOpen={reportTarget !== null}
        onClose={() => setReportTarget(null)}
      />

    </div>
  );
};
