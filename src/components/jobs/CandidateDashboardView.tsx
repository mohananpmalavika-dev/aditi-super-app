import React from 'react';
import { 
  UserCheck, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Plus, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';

interface CandidateDashboardViewProps {
  onPostProfile: () => void;
}

export const CandidateDashboardView: React.FC<CandidateDashboardViewProps> = ({ onPostProfile }) => {
  const { 
    user, 
    jobSeekers, 
    jobApplications, 
    withdrawApplication, 
    startNewChatWith, 
    setActiveMiniApp, 
    showToast 
  } = useSuperApp();

  const myProfile = jobSeekers.find(s => s.postedByUserId === user.id);
  const myApplications = jobApplications.filter(a => a.candidateId === user.id || a.candidateName === user.name);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Profile Summary */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/60 border border-cyan-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Job Seeker Portal
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            {myProfile ? `Welcome, ${myProfile.fullName}` : 'Your Talent Profile'}
          </h2>
          <p className="text-xs text-slate-300">
            {myProfile 
              ? `${myProfile.desiredRole} • ${myProfile.qualification} • ${myProfile.experienceYears} Years Exp`
              : 'Post your resume profile to be discoverable by hiring companies across Kerala'}
          </p>
        </div>

        <button
          onClick={onPostProfile}
          className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{myProfile ? 'Update Talent Profile' : '+ Post Candidate Profile'}</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-cyan-400">{myApplications.length}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Applications Sent</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-amber-400">
            {myApplications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Interviews / Shortlisted</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-emerald-400">
            {myApplications.filter(a => a.status === 'Selected').length}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Offers / Selected</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-purple-400">
            {myProfile?.isVerified ? 'Verified' : 'Active'}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Profile Status</div>
        </div>
      </div>

      {/* Submitted Applications List */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          <span>My Job Applications ({myApplications.length})</span>
        </h3>

        {myApplications.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            You haven't submitted any job applications yet. Browse the Job Vacancies tab to apply!
          </div>
        ) : (
          <div className="space-y-3">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      app.status === 'Selected' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      app.status === 'Shortlisted' || app.status === 'Interview' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      Stage: {app.status}
                    </span>
                    <span className="text-[10px] text-slate-400">Applied: {app.appliedAt}</span>
                  </div>

                  <h4 className="font-black text-white text-sm">{app.jobTitle}</h4>
                  <div className="text-xs text-slate-300 font-semibold">{app.company}</div>

                  {app.recruiterNotes && (
                    <div className="mt-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-amber-300">
                      <strong>Recruiter Note:</strong> {app.recruiterNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {app.status !== 'Withdrawn' && app.status !== 'Rejected' && (
                    <button
                      onClick={() => withdrawApplication(app.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs font-bold transition-colors"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
