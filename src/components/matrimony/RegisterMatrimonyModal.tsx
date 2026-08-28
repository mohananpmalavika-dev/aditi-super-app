import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Phone, 
  Mail, 
  Sparkles, 
  Check, 
  Camera, 
  Upload, 
  Moon, 
  Users, 
  FileText,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { 
  MatrimonyMaritalStatus, 
  MatrimonyPostedFor, 
  MatrimonyProfile 
} from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';

interface RegisterMatrimonyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KERALA_NAKSHATRAS = [
  'Ashwathi (അശ്വതി)',
  'Bharani (ഭരണി)',
  'Karthika (കാർത്തിക)',
  'Rohini (രോഹിണി)',
  'Makayiram (മകയിരം)',
  'Thiruvathira (തിരുവാതിര)',
  'Punartham (പുണർതം)',
  'Pooyam (പൂയം)',
  'Aayilyam (ആയില്യം)',
  'Makam (മകം)',
  'Pooram (പൂരം)',
  'Uthram (ഉത്രം)',
  'Atham (അത്തം)',
  'Chithira (ചിത്തിര)',
  'Chothi (ചോതി)',
  'Visakam (വിശാഖം)',
  'Anizham (അനിഴം)',
  'Thrikketta (തൃക്കേട്ട)',
  'Moolam (മൂലം)',
  'Pooradam (പൂരാടം)',
  'Uthradam (ഉത്രാടം)',
  'Thiruvonam (തിരുവോണം)',
  'Avittam (അവിട്ടം)',
  'Chathayam (ചതയം)',
  'Poororattathi (പൂരുരുട്ടാതി)',
  'Uthrattathi (ഉത്രട്ടാതി)',
  'Revathi (രേവതി)'
];

const ZODIAC_SIGNS = [
  'Aries (മേടം)',
  'Taurus (ഇടവം)',
  'Gemini (മിഥുനം)',
  'Cancer (കർക്കടകം)',
  'Leo (ചിങ്ങം)',
  'Virgo (കന്നി)',
  'Libra (തുലാം)',
  'Scorpio (വൃശ്ചികം)',
  'Sagittarius (ധനു)',
  'Capricorn (മകരം)',
  'Aquarius (കുംഭം)',
  'Pisces (മീനം)'
];

export const RegisterMatrimonyModal: React.FC<RegisterMatrimonyModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, addMatrimonyProfile, showToast } = useSuperApp();

  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [postedFor, setPostedFor] = useState<MatrimonyPostedFor>('Self');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(26);
  const [height, setHeight] = useState("5' 5\" (165 cm)");
  const [maritalStatus, setMaritalStatus] = useState<MatrimonyMaritalStatus>('Never Married');
  
  // Religion & Community
  const [religion, setReligion] = useState('Hindu');
  const [community, setCommunity] = useState('Nair');
  const [motherTongue, setMotherTongue] = useState('Malayalam');
  
  // Astrology
  const [nakshatra, setNakshatra] = useState('Rohini (രോഹിണി)');
  const [zodiac, setZodiac] = useState('Cancer (കർക്കടകം)');
  
  // Education & Career
  const [education, setEducation] = useState('B.Tech / M.Tech Computer Science');
  const [profession, setProfession] = useState('Senior Software Engineer');
  const [annualIncome, setAnnualIncome] = useState('₹18 Lakhs - ₹25 Lakhs');
  
  // Location
  const [city, setCity] = useState(user.location?.includes(',') ? user.location.split(',')[0].trim() : 'Kozhikode');
  const [state, setState] = useState('Kerala');
  
  // Family & Lifestyle
  const [familyDetails, setFamilyDetails] = useState('Nuclear family. Upper middle class background.');
  const [diet, setDiet] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan'>('Non-Vegetarian');
  
  // Bio & Expectations
  const [about, setAbout] = useState('');
  const [partnerPreferences, setPartnerPreferences] = useState('');
  
  // Contact Info
  const [contactPhone, setContactPhone] = useState('+91 98470 12345');
  const [contactEmail, setContactEmail] = useState(user.email || '');
  
  // Photo
  const [photoUrl, setPhotoUrl] = useState<string>(
    gender === 'Female' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
          showToast('📸 Profile photo uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('⚠️ Please enter the full name of the bride / groom.');
      return;
    }
    if (!contactPhone.trim()) {
      showToast('⚠️ Please provide a contact phone number for matrimonial communication.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newProfile: Omit<MatrimonyProfile, 'id'> = {
        name: name.trim(),
        age: Number(age),
        gender,
        height,
        profession: profession.trim() || 'Professional',
        education: education.trim() || 'Graduate',
        city: city.trim() || 'Kerala',
        state: state.trim() || 'Kerala',
        religion: religion.trim() || 'Hindu',
        community: community.trim() || 'General',
        motherTongue: motherTongue.trim() || 'Malayalam',
        zodiac: zodiac.split(' ')[0],
        nakshatra: nakshatra.split(' ')[0],
        photos: [photoUrl],
        about: about.trim() || `Profile registered for ${gender === 'Female' ? 'Bride' : 'Groom'}, working as ${profession} in ${city}. Looking for a compatible and loving life partner.`,
        partnerPreferences: partnerPreferences.trim() || 'Looking for an educated, well-mannered, and caring life partner from a good family background.',
        annualIncome: annualIncome.trim() || '₹10 Lakhs - ₹15 Lakhs',
        isVerified: true,
        postedFor,
        maritalStatus,
        familyDetails: familyDetails.trim(),
        diet,
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        compatibilityScore: 95,
        interestSent: false,
        isShortlisted: false,
        postedByUserId: user.id || 'current-user',
        createdAt: 'Just now'
      };

      await addMatrimonyProfile(newProfile);
      onClose();
    } catch (err) {
      showToast('⚠️ Could not register profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl p-5 sm:p-7 space-y-6 my-auto text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-red-600 text-white shadow-lg shadow-rose-500/30">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Register Matrimony Profile (വരൻ / വധു പ്രൊഫൈൽ)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-rose-400" />
                  <span>100% Verified Biodata</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enter complete details for bride or groom including education, profession, astrology, and family background.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* 1. Profile For & Gender (Bride vs Groom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            
            {/* Gender / Looking For */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-300 block">1. Registering for: (ആരുടെ പ്രൊഫൈൽ?)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGender('Female');
                    if (photoUrl.includes('1507003211169')) {
                      setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');
                    }
                  }}
                  className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                    gender === 'Female'
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👰 Bride (വധു - Female)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender('Male');
                    if (photoUrl.includes('1534528741775')) {
                      setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80');
                    }
                  }}
                  className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                    gender === 'Male'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🤵 Groom (വരൻ - Male)</span>
                </button>
              </div>
            </div>

            {/* Profile Created By / Relation */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-300 block">Profile Created By: (ആരാണ് ചേർക്കുന്നത്?)</label>
              <select
                value={postedFor}
                onChange={(e) => setPostedFor(e.target.value as MatrimonyPostedFor)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="Self">Self (സ്വന്തമായി)</option>
                <option value="Daughter">Parents for Daughter (മകൾക്കുവേണ്ടി)</option>
                <option value="Son">Parents for Son (മകനുവേണ്ടി)</option>
                <option value="Sister">Sibling for Sister (സഹോദരിക്കുവേണ്ടി)</option>
                <option value="Brother">Sibling for Brother (സഹോദരനുവേണ്ടി)</option>
                <option value="Relative / Friend">Relative / Friend (ബന്ധു / സുഹൃത്ത്)</option>
              </select>
            </div>

          </div>

          {/* 2. Personal Biodata (Name, Age, Height, Marital Status) */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <User className="w-4 h-4 text-rose-400" />
              <span>Personal Details (വ്യക്തിഗത വിവരങ്ങൾ)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-300">Full Name (മുഴുവൻ പേര്) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Malavika Mohan / Rahul Menon"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Age (വയസ്സ്)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={18}
                  max={70}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Height (ഉയരം)</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="5' 5&quot; (165 cm)"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Marital Status (വൈവാഹിക നില)</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as MatrimonyMaritalStatus)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Never Married">Never Married (അവിവാഹിതൻ/അവിവാഹിത)</option>
                  <option value="Divorced">Divorced (വിവാഹമോചിതൻ/വിവാഹമോചിത)</option>
                  <option value="Widowed">Widowed (വിധവ/വിധുരൻ)</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Diet Preference (ഭക്ഷണ ശീലം)</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Non-Vegetarian">Non-Vegetarian (മാംസാഹാരി)</option>
                  <option value="Vegetarian">Vegetarian (സസ്യാഹാരി)</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Mother Tongue (മാതൃഭാഷ)</label>
                <input
                  type="text"
                  value={motherTongue}
                  onChange={(e) => setMotherTongue(e.target.value)}
                  placeholder="Malayalam, Tamil, English..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Religion, Community & Astrology */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span>Religion, Community & Astrology (മതം, ജാതി, ജാതകം)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Religion (മതം)</label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Hindu">Hindu (ഹിന്ദു)</option>
                  <option value="Muslim">Muslim (മുസ്ലിം)</option>
                  <option value="Christian">Christian (ക്രിസ്ത്യൻ)</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Jain">Jain</option>
                  <option value="Inter-Religion / Other">No Religion / Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Community / Caste (ജാതി/സമൂഹം)</label>
                <input
                  type="text"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder="e.g. Nair, Ezhava, Sunni, RC, Menon..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Nakshatra / Birth Star (നക്ഷത്രം)</label>
                <select
                  value={nakshatra}
                  onChange={(e) => setNakshatra(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {KERALA_NAKSHATRAS.map((star) => (
                    <option key={star} value={star}>{star}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Zodiac Sign (രാശി)</label>
                <select
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {ZODIAC_SIGNS.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Education, Career & Income */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Education, Career & Income (വിദ്യാഭ്യാസം, തൊഴിൽ, വരുമാനം)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Highest Qualification (വിദ്യാഭ്യാസം)</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. MBBS, MD, B.Tech, MS, MBA, CA..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Profession / Occupation (തൊഴിൽ)</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Doctor, Software Architect, Professor..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Annual Income (വാർഷിക വരുമാനം)</label>
                <input
                  type="text"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="e.g. ₹18 Lakhs - ₹25 Lakhs / $120k"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Current City / District (നഗരം)</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kozhikode, Kochi, Dubai, Bengaluru..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">State / Country (സംസ്ഥാനം/രാജ്യം)</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Kerala, UAE, USA..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 5. Family Details & Photo */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Family Background & Profile Photo</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Photo Preview & Upload */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 block">Profile Photo (ഫോട്ടോ)</label>
                <div className="flex items-center gap-3">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40 shadow-md"
                  />
                  <div className="space-y-1 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors">
                      <Camera className="w-3.5 h-3.5 text-rose-400" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[9px] text-slate-500">JPG, PNG supported</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-300">Family Background (കുടുംബവിവരങ്ങൾ)</label>
                <textarea
                  value={familyDetails}
                  onChange={(e) => setFamilyDetails(e.target.value)}
                  rows={2}
                  placeholder="e.g. Father retired Govt. Officer, Mother Teacher, 1 younger brother doing B.Tech..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

            </div>
          </div>

          {/* 6. About & Partner Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">About the Candidate (വ്യക്തിവിവരണം)</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={2}
                placeholder="Passionate about career, music, travel, and spending time with family..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Partner Preferences (സങ്കല്പങ്ങൾ)</label>
              <textarea
                value={partnerPreferences}
                onChange={(e) => setPartnerPreferences(e.target.value)}
                rows={2}
                placeholder="Looking for an educated, caring, family-oriented life partner..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* 7. Contact Details for Matrimonial Communication */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-3">
            <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>Contact Information for Matches & Families</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">Contact Phone / WhatsApp *</span>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 Phone"
                  required
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">Contact Email Address</span>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering Profile...' : `Publish ${gender === 'Female' ? 'Bride' : 'Groom'} Profile (പ്രൊഫൈൽ പ്രസിദ്ധീകരിക്കുക)`}</span>
          </button>

        </form>
      </div>
    </div>
  );
};
