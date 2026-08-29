import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Phone, 
  FileText, 
  Trash2, 
  Plus, 
  Sparkles, 
  Filter,
  Eye
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobApplication, JobApplicationStatus, JobVacancy } from '../../types/superApp';

interface RecruiterDashboardViewProps {
  onPostJob: () => void;
  onViewJob: (job: JobVacancy) => void;
}

export const RecruiterDashboardView: React.FC<RecruiterDashboardViewProps> = ({ onPostJob, onViewJob }) => {
  const { 
    user, 
    jobVacancies, 
    deleteJobVacancy, 
    jobApplications, 
    updateApplicationStatus, 
    startNewChatWith, 
    setActiveMiniApp, 
    showToast 
  } = useSuperApp();

  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Recruiter's jobs
  const myVacancies = jobVacancies.filter(j => j.postedByUserId === user.id || j.contactName === user.name);

  // Applications for recruiter's jobs or demo recruiter apps
  const relevantApplications = jobApplications.filter(app => 
    myVacancies.some(j => j.id === app.jobId) || app.recruiterId === user.id || myVacancies.length === 0
  );

  const filteredApps = relevantApplications.filter(app => {
    const matchesJob = selectedJobFilter === 'All' || app.jobId === selectedJobFilter;
    const matchesStatus = selectedStatusFilter === 'All' || app.status === selectedStatusFilter;
    return matchesJob && matchesStatus;
  });

  const handleStatusChange = async (appId: string, status: JobApplicationStatus) => {
    await updateApplicationStatus(appId, status);
  };

  const handleChatCandidate = (app: JobApplication) => {
    startNewChatWith(
      app.candidateName,
      app.candidateAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      `Applicant • ${app.jobTitle}`,
      `Hello ${app.candidateName}, regarding your application for "${app.jobTitle}" at ${app.company}: We would like to take your profile forward.`
    );
    setActiveMiniApp('chat');
    showToast(`Opening chat with ${app.candidateName}...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner & Quick Metrics */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Recruiter & Employer Hub
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">Manage Vacancies & Candidate Pipeline</h2>
          <p className="text-xs text-slate-300">Track incoming applications, shortlist top candidates, and schedule interviews</p>
        </div>

        <button
          onClick={onPostJob}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Post New Vacancy</span>
        </button>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-indigo-400">{myVacancies.length}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">My Vacancies</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-cyan-400">{relevantApplications.length}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Total Applicants</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-amber-400">
            {relevantApplications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">In Interview / Shortlist</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-emerald-400">
            {relevantApplications.filter(a => a.status === 'Selected').length}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Selected / Hired</div>
        </div>
      </div>

      {/* Applications Pipeline Table / Cards */}
      <div className="space-y-3">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Candidate Applications ({filteredApps.length})</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* List of Applications */}
        {filteredApps.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            No candidate applications found for the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Candidate Info */}
                <div className="flex items-start gap-3">
                  <img
                    src={app.candidateAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={app.candidateName}
                    className="w-11 h-11 rounded-2xl object-cover border border-indigo-500/30 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-xs sm:text-sm">{app.candidateName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        app.status === 'Selected' ? 'bg-emerald-500/20 text-emerald-300' :
                        app.status === 'Shortlisted' || app.status === 'Interview' ? 'bg-amber-500/20 text-amber-300' :
                        app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-indigo-300 font-semibold mt-0.5">
                      Applied for: <span className="text-white">{app.jobTitle}</span> ({app.company})
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {app.qualification} • {app.experienceYears} Yrs Exp • Phone: {app.candidatePhone}
                    </div>
                    {app.coverLetter && (
                      <p className="text-[11px] text-slate-300 italic mt-1 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        "{app.coverLetter}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Stage Controls & Chat */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center flex-shrink-0">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as JobApplicationStatus)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <a
                    href={`tel:${app.candidatePhone}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                    title="Call Candidate"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleChatCandidate(app)}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
