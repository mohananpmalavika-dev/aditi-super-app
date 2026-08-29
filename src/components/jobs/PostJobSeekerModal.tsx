import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  Phone, 
  Mail, 
  Plus,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobCategory, JobSeekerProfile, JobType } from '../../types/superApp';
import { getSafeAvatarUrl } from '../../utils/avatarUtils';

interface PostJobSeekerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JOB_CATEGORIES: JobCategory[] = [
  'Technology & IT',
  'Local Trades & Skilled Labor',
  'Domestic & Housekeeping',
  'Sales & Marketing',
  'Healthcare & Nursing',
  'Finance & Accounting',
  'Education & Tutoring',
  'Hospitality & Cooking',
  'Logistics & Driving',
  'Construction & Civil',
  'Other'
];

export const PostJobSeekerModal: React.FC<PostJobSeekerModalProps> = ({ isOpen, onClose }) => {
  const { user, addJobSeeker, showToast } = useSuperApp();

  const [fullName, setFullName] = useState(user.name || '');
  const [desiredRole, setDesiredRole] = useState('');
  const [category, setCategory] = useState<JobCategory>('Technology & IT');
  const [jobTypePreference, setJobTypePreference] = useState<JobType>('Full-time');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [experienceSummary, setExperienceSummary] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('₹35,000 / mo');
  const [preferredLocation, setPreferredLocation] = useState('Kozhikode, Kochi or Remote');
  const [city, setCity] = useState('Kozhikode');
  const [availability, setAvailability] = useState<'Immediate' | 'Within 15 Days' | 'Within 1 Month'>('Immediate');
  const [resumeHeadline, setResumeHeadline] = useState('');
  const [bio, setBio] = useState(user.bio || '');

  // Skills
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Quick Learner', 'Communication']);

  // Contact
  const [phone, setPhone] = useState(user.phone || '+91 98470 54321');
  const [email, setEmail] = useState(user.email || '');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !desiredRole.trim() || !qualification.trim() || !phone.trim()) {
      showToast('⚠️ Please fill in all required candidate fields.');
      return;
    }

    setLoading(true);
    try {
      const newSeeker: Omit<JobSeekerProfile, 'id'> = {
        fullName: fullName.trim(),
        desiredRole: desiredRole.trim(),
        category,
        jobTypePreference,
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears) || 0,
        experienceSummary: experienceSummary.trim() || 'Experienced in domain responsibilities with high attention to detail.',
        expectedSalary: expectedSalary.trim(),
        preferredLocation: preferredLocation.trim(),
        city: city.trim(),
        skills: skills.length > 0 ? skills : ['General Skills'],
        resumeHeadline: resumeHeadline.trim() || `${desiredRole.trim()} with ${experienceYears} years experience looking for new opportunities.`,
        bio: bio.trim() || 'Dedicated, punctual professional seeking impactful roles with growth potential.',
        phone: phone.trim(),
        email: email.trim(),
        avatar: getSafeAvatarUrl(user.avatar, fullName),
        availability,
        isVerified: true,
        isSaved: false,
        postedByUserId: user.id,
        createdAt: 'Just now'
      };

      await addJobSeeker(newSeeker);
      onClose();
    } catch (err: any) {
      showToast(`⚠️ Failed to post candidate profile: ${err?.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl glass-sheet border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg border border-white/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Post Job Seeker Profile</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Candidate
                </span>
              </h2>
              <p className="text-xs text-slate-400">Showcase your qualifications and experience to hiring companies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Candidate Name & Desired Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Your Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Krishnan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Desired Role / Title *</label>
              <input
                type="text"
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                placeholder="e.g. Senior Accountant / React Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Category & Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Availability to Join</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="Immediate">⚡ Immediate Joiner</option>
                <option value="Within 15 Days">Within 15 Days</option>
                <option value="Within 1 Month">Within 1 Month</option>
              </select>
            </div>
          </div>

          {/* Qualification & Experience Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Highest Qualification / Degree *</span>
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. B.Tech / M.Com, Tally / ITI Electrical"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Years of Experience</span>
              </label>
              <input
                type="number"
                min={0}
                max={45}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Expected Salary & Preferred Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Expected Salary / Wage</span>
              </label>
              <input
                type="text"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="e.g. ₹35,000 / mo or ₹850 / day"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Preferred Work Location</span>
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Kozhikode, Kochi / Remote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Resume Headline */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resume Headline / Bio Summary</span>
            </label>
            <input
              type="text"
              value={resumeHeadline}
              onChange={(e) => setResumeHeadline(e.target.value)}
              placeholder="e.g. Certified Accountant with 5 yrs experience in GST & Corporate audit"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Past Work Experience Details */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Past Experience & Major Accomplishments</label>
            <textarea
              value={experienceSummary}
              onChange={(e) => setExperienceSummary(e.target.value)}
              rows={3}
              placeholder="Describe your previous companies, projects, duties, and tools mastered..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Skills Tags */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Core Skills & Tools</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type skill & press Enter (e.g. GST Filing, React, Driving, Wiring)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 font-semibold text-[11px]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (+91)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold shadow-lg shadow-cyan-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Post Candidate Profile</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
