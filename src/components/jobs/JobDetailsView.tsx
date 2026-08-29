import React from 'react';
import { 
  X, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Mail,
  MessageSquare, 
  Bookmark, 
  Share2, 
  ShieldAlert, 
  Zap, 
  Users, 
  Send,
  ExternalLink,
  Landmark,
  Globe2,
  Layers
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobVacancy } from '../../types/superApp';

interface JobDetailsViewProps {
  job: JobVacancy | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: JobVacancy) => void;
  onReport: (job: JobVacancy) => void;
}

export const JobDetailsView: React.FC<JobDetailsViewProps> = ({ 
  job, 
  isOpen, 
  onClose, 
  onApply,
  onReport
}) => {
  const { 
    user, 
    toggleSaveJob, 
    startNewChatWith, 
    setActiveMiniApp, 
    jobApplications,
    showToast 
  } = useSuperApp();

  if (!isOpen || !job) return null;

  const existingApp = jobApplications.find(a => a.jobId === job.id && a.candidateId === user.id);

  const handleStartChat = () => {
    startNewChatWith(
      job.contactName,
      job.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      `Recruiter • ${job.company}`,
      `Hello ${job.contactName}, I saw your opening for "${job.title}" at ${job.company} on Aditi Super App. I would like to discuss this opportunity.`
    );
    setActiveMiniApp('chat');
    showToast(`Opening chat with ${job.contactName}...`);
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this opening for ${job.title} at ${job.company} on Aditi Super App: ${job.salaryFormatted}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast('📋 Job link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl glass-sheet border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95">
        
        {/* Header Banner */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-slate-900/70">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl flex-shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {job.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  {job.jobType}
                </span>
                {job.isUrgent && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                    <span>Urgent</span>
                  </span>
                )}
                {existingApp && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ Applied: {existingApp.status}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-black text-white">{job.title}</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{job.company}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-2 rounded-2xl border transition-all ${
                job.isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Save Job"
            >
              <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">SALARY / WAGE</span>
              <span className="font-extrabold text-emerald-400 text-xs sm:text-sm">{job.salaryFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">EXPERIENCE</span>
              <span className="font-extrabold text-amber-300 text-xs sm:text-sm">{job.experienceRequired}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">QUALIFICATION</span>
              <span className="font-extrabold text-cyan-300 text-xs sm:text-sm">{job.qualificationRequired}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">OPENINGS</span>
              <span className="font-extrabold text-purple-300 text-xs sm:text-sm">{job.openingsCount} Position(s)</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-white">About the Job</h3>
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-white">Key Responsibilities</h3>
              <ul className="space-y-1 text-slate-300">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-white">Required Skills & Tools</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 font-semibold text-[11px] border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Pan-India Multi-Source Provenance */}
          {job.sources && job.sources.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Landmark className="w-4 h-4" />
                <span>Verified Multi-Source Ingestion & Attribution</span>
              </div>
              <p className="text-[11px] text-slate-400">
                This vacancy was aggregated and validated through Aditi's Pan-India Job Engine across permitted official feeds:
              </p>
              <div className="space-y-1.5 pt-1">
                {job.sources.map((src, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-200 truncate">{src.sourceName}</span>
                    </div>
                    {src.sourceUrl && (
                      <a
                        href={src.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 shrink-0"
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter Details */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={job.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={job.contactName}
                className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-white text-xs truncate">{job.contactName}</div>
                <div className="text-slate-400 text-[11px] truncate">Hiring Desk • {job.company}</div>
                {job.contactEmail ? (
                  <div className="text-indigo-400 text-[10px] font-semibold truncate">{job.contactEmail}</div>
                ) : job.contactPhone ? (
                  <div className="text-indigo-400 text-[10px] font-semibold truncate">{job.contactPhone}</div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {job.contactEmail && (
                <a
                  href={`mailto:${job.contactEmail}?subject=Application for ${encodeURIComponent(job.title)}`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                  title="Email Official HR"
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
              <button
                onClick={handleStartChat}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-colors flex items-center gap-1.5 px-3 font-bold text-xs"
                title="Message Recruiter"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between gap-3 bg-slate-900/60">
          <button
            onClick={() => onReport(job)}
            className="text-[11px] font-bold text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Job</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
            >
              Close
            </button>
            
            {existingApp ? (
              <div className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                Applied ({existingApp.status})
              </div>
            ) : job.canonicalApplyUrl && job.applyMode === 'external_redirect' ? (
              <a
                href={job.canonicalApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={() => { onClose(); onApply(job); }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>1-Click Apply Now</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
