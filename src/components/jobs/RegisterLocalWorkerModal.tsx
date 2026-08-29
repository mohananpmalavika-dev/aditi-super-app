import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Clock, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  Plus, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { LocalWorkerProfile, WorkerTrade } from '../../types/superApp';
import { getSafeAvatarUrl } from '../../utils/avatarUtils';

interface RegisterLocalWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKER_TRADES: WorkerTrade[] = [
  'Electrician',
  'Plumber',
  'Housemaid / Domestic Help',
  'Driver (Car / Heavy)',
  'Carpenter',
  'Painter',
  'Cook / Home Chef',
  'Appliance & AC Technician',
  'Mason / Construction',
  'Gardener / Landscaping',
  'Welder',
  'Tailor / Stitching',
  'Mechanic / Auto Repair'
];

export const RegisterLocalWorkerModal: React.FC<RegisterLocalWorkerModalProps> = ({ isOpen, onClose }) => {
  const { user, addLocalWorker, showToast } = useSuperApp();

  const [name, setName] = useState(user.name || '');
  const [trade, setTrade] = useState<WorkerTrade>('Electrician');
  const [experienceYears, setExperienceYears] = useState(8);
  const [dailyRateOrCharge, setDailyRateOrCharge] = useState('₹800 / day or ₹350 / visit');
  const [city, setCity] = useState('Kozhikode');
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [bio, setBio] = useState('');

  // Service Areas
  const [areaInput, setAreaInput] = useState('');
  const [serviceAreas, setServiceAreas] = useState<string[]>(['Mavoor Road', 'Palayam', 'Calicut Beach']);

  // Trade Skills
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Emergency Service', 'Licensed & Insured']);

  // Contact
  const [phone, setPhone] = useState(user.phone || '+91 98470 11223');
  const [whatsapp, setWhatsapp] = useState(user.phone || '+91 98470 11223');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddArea = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!areaInput.trim()) return;
    if (!serviceAreas.includes(areaInput.trim())) {
      setServiceAreas([...serviceAreas, areaInput.trim()]);
    }
    setAreaInput('');
  };

  const handleRemoveArea = (idx: number) => {
    setServiceAreas(serviceAreas.filter((_, i) => i !== idx));
  };

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
    if (!name.trim() || !dailyRateOrCharge.trim() || !phone.trim()) {
      showToast('⚠️ Please fill in all required worker details.');
      return;
    }

    setLoading(true);
    try {
      const newWorker: Omit<LocalWorkerProfile, 'id'> = {
        name: name.trim(),
        trade,
        experienceYears: Number(experienceYears) || 1,
        dailyRateOrCharge: dailyRateOrCharge.trim(),
        serviceAreas: serviceAreas.length > 0 ? serviceAreas : ['Local Town & Suburbs'],
        city: city.trim(),
        rating: 5.0,
        reviewCount: 1,
        isAvailableToday,
        verifiedBadge: true,
        skills: skills.length > 0 ? skills : [trade],
        bio: bio.trim() || `Experienced ${trade} providing dependable, high-quality local services with customer satisfaction guarantee.`,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        avatar: getSafeAvatarUrl(user.avatar, name),
        completedJobsCount: 10,
        isSaved: false,
        postedByUserId: user.id,
        createdAt: 'Just now'
      };

      await addLocalWorker(newWorker);
      onClose();
    } catch (err: any) {
      showToast(`⚠️ Failed to register worker: ${err?.message || 'Error'}`);
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg border border-white/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Register as Local Worker / Trade Pro</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Service</span>
                </span>
              </h2>
              <p className="text-xs text-slate-400">List your services for Electrician, Plumber, Housemaid, Driver, Carpenter, and more</p>
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
          
          {/* Worker Name & Trade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Your Full Name / Business Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. K. Balan / Saji Mathew"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Skill / Trade Specialization *</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as WorkerTrade)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {WORKER_TRADES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Daily Rate & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Wage / Service Visiting Charge *</span>
              </label>
              <input
                type="text"
                value={dailyRateOrCharge}
                onChange={(e) => setDailyRateOrCharge(e.target.value)}
                placeholder="e.g. ₹800 / day or ₹350 / service visit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Years of Hands-on Experience</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* City / Base District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Primary City / District</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kozhikode / Kochi / Thrissur"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAvailableToday}
                  onChange={(e) => setIsAvailableToday(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
                />
                <span className="font-bold text-emerald-400">🟢 Available for Work Today (Instant Call)</span>
              </label>
            </div>
          </div>

          {/* Service Locations / Neighborhoods */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Service Coverage Areas / Localities</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={handleAddArea}
                placeholder="Type area & press Enter (e.g. Mavoor Road, Palayam, Chevayur)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold text-[11px]"
                >
                  <span>{area}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(idx)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Specific Trade Specializations */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Specific Skills & Tasks Handled</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type skill (e.g. Pipe Leakage, Inverter Fitting, Jet Washing)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
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
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 font-semibold text-[11px]"
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

          {/* Bio / Work Philosophy */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">About Your Work & Experience</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell customers about your speed of service, warranty on repairs, and equipment tools..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Direct Contact & WhatsApp */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Customer Contact Numbers</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Calling Number (+91)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
                required
              />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp Number (+91)"
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Publish Service Profile</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
