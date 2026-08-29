import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Briefcase, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobApplication, JobVacancy } from '../../types/superApp';
import { getSafeAvatarUrl } from '../../utils/avatarUtils';

interface JobApplicationModalProps {
  job: JobVacancy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ job, isOpen, onClose }) => {
  const { user, applyForJob, jobSeekers, showToast } = useSuperApp();

  // Pre-fill candidate data from user profile / existing candidate profile
  const userSeekerProfile = jobSeekers.find(s => s.postedByUserId === user.id);

  const [candidateName, setCandidateName] = useState(user.name || '');
  const [candidatePhone, setCandidatePhone] = useState(user.phone || '+91 98470 12345');
  const [candidateEmail, setCandidateEmail] = useState(user.email || '');
  const [qualification, setQualification] = useState(userSeekerProfile?.qualification || 'Graduate Degree / Diploma');
  const [experienceYears, setExperienceYears] = useState(userSeekerProfile?.experienceYears || 2);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidatePhone.trim()) {
      showToast('⚠️ Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    try {
      const newApp: Omit<JobApplication, 'id'> = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        candidateId: user.id,
        candidateName: candidateName.trim(),
        candidateAvatar: getSafeAvatarUrl(user.avatar, candidateName),
        candidatePhone: candidatePhone.trim(),
        candidateEmail: candidateEmail.trim(),
        recruiterId: job.postedByUserId,
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears) || 0,
        coverLetter: coverLetter.trim() || `I am applying for the ${job.title} position at ${job.company}. My background aligns with your requirements.`,
        status: 'Applied',
        appliedAt: 'Just now'
      };

      await applyForJob(newApp);
      onClose();
    } catch (err: any) {
      showToast(`⚠️ Application submission failed: ${err?.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg max-h-[92vh] rounded-3xl glass-sheet border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">1-Click Job Application</h2>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px] sm:max-w-xs">{job.title} • {job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
          
          {/* Job Summary Banner */}
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-white text-xs">{job.title}</div>
              <div className="text-[11px] text-indigo-300 font-semibold">{job.company} • {job.location}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black text-emerald-400">{job.salaryFormatted}</div>
              <div className="text-[10px] text-slate-400">{job.jobType}</div>
            </div>
          </div>

          {/* Candidate Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Phone (+91) *</span>
              </label>
              <input
                type="tel"
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Qualification & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Highest Qualification</span>
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. B.Tech / M.Com / ITI"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Years of Experience</span>
              </label>
              <input
                type="number"
                min={0}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Short Note / Cover Letter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cover Note to Recruiter (Optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={3}
              placeholder="Highlight your key achievements, relevant experience, and reason for applying..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
