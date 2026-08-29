import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  Plus, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobCategory, JobType, JobVacancy } from '../../types/superApp';
import { getSafeAvatarUrl } from '../../utils/avatarUtils';

interface PostJobVacancyModalProps {
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

const JOB_TYPES: JobType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Urgent / Gig',
  'Internship',
  'Remote'
];

export const PostJobVacancyModal: React.FC<PostJobVacancyModalProps> = ({ isOpen, onClose }) => {
  const { user, addJobVacancy, showToast } = useSuperApp();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<JobCategory>('Technology & IT');
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [location, setLocation] = useState('Cyberpark / Calicut Beach');
  const [city, setCity] = useState('Kozhikode');
  const [isRemote, setIsRemote] = useState(false);
  const [salaryFormatted, setSalaryFormatted] = useState('₹35,000 - ₹60,000 / mo');
  const [experienceRequired, setExperienceRequired] = useState('1-3 Years');
  const [qualificationRequired, setQualificationRequired] = useState('Graduate / Degree or Diploma');
  const [description, setDescription] = useState('');
  const [openingsCount, setOpeningsCount] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);

  // Skill Tags
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Communication', 'Punctuality']);

  // Recruiter Contact
  const [contactName, setContactName] = useState(user.name || '');
  const [contactPhone, setContactPhone] = useState(user.phone || '+91 98470 12345');
  const [contactEmail, setContactEmail] = useState(user.email || '');

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
    if (!title.trim() || !company.trim() || !contactPhone.trim()) {
      showToast('⚠️ Please fill in all required job fields.');
      return;
    }

    setLoading(true);
    try {
      const newJob: Omit<JobVacancy, 'id'> = {
        title: title.trim(),
        company: company.trim(),
        category,
        jobType,
        location: location.trim(),
        city: city.trim(),
        isRemote,
        salaryFormatted: salaryFormatted.trim(),
        experienceRequired: experienceRequired.trim(),
        qualificationRequired: qualificationRequired.trim(),
        description: description.trim() || 'Exciting opportunity to join our growing team with competitive pay and supportive work environment.',
        skills: skills.length > 0 ? skills : ['Required Skills'],
        contactName: contactName.trim() || user.name,
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        contactAvatar: getSafeAvatarUrl(user.avatar, contactName || user.name),
        openingsCount: Number(openingsCount) || 1,
        isUrgent,
        isFeatured,
        postedByUserId: user.id,
        createdAt: 'Just now',
        isSaved: false
      };

      await addJobVacancy(newJob);
      onClose();
    } catch (err: any) {
      showToast(`⚠️ Failed to post job: ${err?.message || 'Error'}`);
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg border border-white/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Post Job Vacancy</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Recruiter
                </span>
              </h2>
              <p className="text-xs text-slate-400">Publish your opening to verified candidates across Kerala & Pan-India</p>
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
          
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>Job Title / Designation *</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Developer / Site Supervisor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Company / Employer Name *</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Malabar Tech / Skyline Builders"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Category & Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Industry / Role Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary & Openings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Salary / Wage Range *</span>
              </label>
              <input
                type="text"
                value={salaryFormatted}
                onChange={(e) => setSalaryFormatted(e.target.value)}
                placeholder="e.g. ₹30,000 - ₹55,000 / mo or ₹800 / day"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Number of Openings</label>
              <input
                type="number"
                min={1}
                max={50}
                value={openingsCount}
                onChange={(e) => setOpeningsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Experience & Qualification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Experience Required</span>
              </label>
              <input
                type="text"
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.value)}
                placeholder="e.g. Freshers Welcome / 2-4 Years"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Qualification Required</span>
              </label>
              <input
                type="text"
                value={qualificationRequired}
                onChange={(e) => setQualificationRequired(e.target.value)}
                placeholder="e.g. Any Degree / ITI Certified / SSLC"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Location & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Work Location / Area</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mavoor Road / Cyberpark"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">City / District</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kozhikode / Kochi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Skills Required Tags */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Required Skills & Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type skill & press enter (e.g. React, 3-Phase Wiring, Tally)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 font-semibold text-[11px]"
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

          {/* Job Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Job Description & Key Responsibilities</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Outline daily responsibilities, working hours, benefits, and perks..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Flags: Urgent & Remote */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700"
              />
              <span className="font-bold text-rose-400">⚡ Mark as Urgent Hiring</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 bg-slate-900 border-slate-700"
              />
              <span className="font-bold text-cyan-300">🌐 Remote / Work from Home</span>
            </label>
          </div>

          {/* Recruiter Contact Information */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recruiter / HR Contact Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Person Name"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
                required
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone Number (+91)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
                required
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Official Email"
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Publish Job Vacancy</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
