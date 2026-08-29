import React from 'react';
import { 
  X, 
  UserCheck, 
  GraduationCap, 
  Clock, 
  MapPin, 
  DollarSign, 
  Phone, 
  Mail, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobSeekerProfile } from '../../types/superApp';

interface JobSeekerDetailsViewProps {
  seeker: JobSeekerProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobSeekerDetailsView: React.FC<JobSeekerDetailsViewProps> = ({ seeker, isOpen, onClose }) => {
  const { toggleSaveJobSeeker, startNewChatWith, setActiveMiniApp, showToast } = useSuperApp();

  if (!isOpen || !seeker) return null;

  const handleStartChat = () => {
    startNewChatWith(
      seeker.fullName,
      seeker.avatar,
      `Candidate • ${seeker.desiredRole}`,
      `Hello ${seeker.fullName}, we saw your profile for "${seeker.desiredRole}" on Aditi Super App and would like to connect for an opportunity.`
    );
    setActiveMiniApp('chat');
    showToast(`Connecting with ${seeker.fullName}...`);
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${seeker.fullName} - ${seeker.desiredRole}`,
        text: `Check out ${seeker.fullName}'s talent profile on Aditi Super App: ${seeker.desiredRole} (${seeker.qualification})`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast('📋 Candidate link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl glass-sheet border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-slate-900/70">
          <div className="flex items-center gap-3.5">
            <img
              src={seeker.avatar}
              alt={seeker.fullName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h2 className="text-base sm:text-xl font-black text-white">{seeker.fullName}</h2>
                {seeker.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-bold text-cyan-400">{seeker.desiredRole}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{seeker.preferredLocation}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">⚡ {seeker.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSaveJobSeeker(seeker.id)}
              className={`p-2 rounded-2xl border transition-all ${
                seeker.isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Save Candidate"
            >
              <Bookmark className={`w-4 h-4 ${seeker.isSaved ? 'fill-amber-400' : ''}`} />
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
          
          {/* Headline & Overview */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-slate-200">
            <div className="font-extrabold text-xs text-cyan-300 mb-1">PROFESSIONAL HEADLINE</div>
            <p className="italic text-xs font-semibold leading-relaxed">
              "{seeker.resumeHeadline}"
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
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

          {/* Past Experience Details */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-white">Experience & Project History</h3>
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
              {seeker.experienceSummary}
            </p>
          </div>

          {/* Bio */}
          {seeker.bio && (
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-white">About Candidate</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                {seeker.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-white">Core Skills & Competencies</h3>
            <div className="flex flex-wrap gap-1.5">
              {seeker.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 font-semibold text-[11px] border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-xs">Direct Contact</div>
              <div className="text-slate-400 text-[11px]">Phone: {seeker.phone}</div>
              {seeker.email && <div className="text-cyan-400 text-[10px]">{seeker.email}</div>}
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
                onClick={handleStartChat}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message / Interview</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-end gap-2.5 bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
          >
            Close
          </button>
          <button
            onClick={handleStartChat}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold shadow-lg shadow-cyan-500/30 flex items-center gap-2 active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect & Hire Candidate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
