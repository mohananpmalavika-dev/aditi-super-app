import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Bed, 
  Bath, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  FileText, 
  Check, 
  Home, 
  Armchair,
  Maximize2
} from 'lucide-react';
import { 
  FurnishingPreference, 
  PossessionTimeline, 
  PropertyNeedCategory, 
  PropertyRequirement, 
  PropertyRequirementType 
} from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, addPropertyRequirement, showToast } = useSuperApp();

  const [reqType, setReqType] = useState<PropertyRequirementType>('Buy');
  const [category, setCategory] = useState<PropertyNeedCategory>('Apartment');
  const [city, setCity] = useState(user.location?.includes(',') ? user.location.split(',')[0].trim() : 'Kozhikode');
  const [locationsInput, setLocationsInput] = useState('Beach Road, Mavoor Road, Palayam');
  
  // Budget
  const [minBudget, setMinBudget] = useState<number>(4000000);
  const [maxBudget, setMaxBudget] = useState<number>(8000000);
  
  // Specs
  const [bedrooms, setBedrooms] = useState<number | 'Any'>(3);
  const [bathrooms, setBathrooms] = useState<number | 'Any'>(2);
  const [minAreaSqFt, setMinAreaSqFt] = useState<number>(1400);
  const [furnishing, setFurnishing] = useState<FurnishingPreference>('Semi-Furnished');
  const [timeline, setTimeline] = useState<PossessionTimeline>('Within 1 Month');
  const [specificNeeds, setSpecificNeeds] = useState('');
  
  // Contact
  const [contactName, setContactName] = useState(user.name || '');
  const [contactPhone, setContactPhone] = useState('+91 98470 12345');
  const [contactEmail, setContactEmail] = useState(user.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatPriceINR = (val: number, isRent: boolean): string => {
    if (isRent) {
      if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh / mo`;
      return `₹${val.toLocaleString('en-IN')} / mo`;
    }
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const budgetDisplay = `${formatPriceINR(minBudget, reqType === 'Rent')} - ${formatPriceINR(maxBudget, reqType === 'Rent')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      showToast('⚠️ Please enter your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const locations = locationsInput
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      const generatedTitle = `${bedrooms !== 'Any' ? `${bedrooms} BHK ` : ''}${category} Wanted for ${reqType === 'Buy' ? 'Purchase' : 'Rent'} in ${city}`;

      const newRequirement: Omit<PropertyRequirement, 'id'> = {
        title: generatedTitle,
        requirementType: reqType,
        propertyCategory: category,
        preferredLocations: locations.length > 0 ? locations : [city],
        city: city.trim() || 'Kerala',
        minBudget,
        maxBudget,
        budgetFormatted: budgetDisplay,
        bedrooms,
        bathrooms,
        minAreaSqFt: minAreaSqFt || undefined,
        furnishing,
        timeline,
        specificNeeds: specificNeeds.trim() || `Looking for a verified ${category.toLowerCase()} in ${city} matching the specified budget and preferences.`,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        contactAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        isVerifiedBuyer: true,
        createdAt: 'Just now',
        postedByUserId: user.id || 'current-user'
      };

      await addPropertyRequirement(newRequirement);
      onClose();
    } catch (err) {
      showToast('⚠️ Failed to post requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-5 sm:p-7 space-y-6 my-auto text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">Post Buyer / Tenant Requirement</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ആവശ്യമുണ്ട്
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enter your property needs and preferences. Verified sellers and agents will reach out directly.
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

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* 1. Requirement Type (Buy vs Rent) */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-300 block">1. I am looking to: (എനിക്ക് ആവശ്യമുള്ളത്)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setReqType('Buy');
                  setMinBudget(4000000);
                  setMaxBudget(9000000);
                }}
                className={`py-3 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-all ${
                  reqType === 'Buy'
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Want to Buy / Purchase (വാങ്ങാൻ)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReqType('Rent');
                  setMinBudget(15000);
                  setMaxBudget(30000);
                }}
                className={`py-3 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-all ${
                  reqType === 'Rent'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Want to Rent / Lease (വാടകയ്ക്ക്)</span>
              </button>
            </div>
          </div>

          {/* 2. Property Category */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-300 block">2. Property Category (ഏത് തരം പ്രോപ്പർട്ടി?)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  'Apartment',
                  'Villa',
                  'Independent House',
                  'Plot / Land',
                  'Commercial',
                  'Office Space',
                  'Studio / 1RK',
                  'Warehouse'
                ] as PropertyNeedCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2.5 rounded-xl text-center font-bold text-[11px] border transition-all truncate ${
                    category === cat
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Location & Preferred Neighborhoods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>City / District (ജില്ല / നഗരം)</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kozhikode, Kochi, Trivandrum..."
                required
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Preferred Localities (സ്ഥലങ്ങൾ)</span>
              </label>
              <input
                type="text"
                value={locationsInput}
                onChange={(e) => setLocationsInput(e.target.value)}
                placeholder="e.g. Beach Road, Mavoor Road, Palayam (comma separated)"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 4. Budget Range */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Budget Range (ബജറ്റ്)</span>
              </span>
              <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                {budgetDisplay}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">Min Budget</span>
                <input
                  type="number"
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  step={reqType === 'Rent' ? 1000 : 100000}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">Max Budget</span>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  step={reqType === 'Rent' ? 1000 : 100000}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 5. Bedrooms, Bathrooms, Furnishing & Timeline */}
          {category !== 'Plot / Land' && category !== 'Commercial' && category !== 'Warehouse' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* BHK */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Bed className="w-3 h-3 text-indigo-400" />
                  <span>Bedrooms</span>
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value === 'Any' ? 'Any' : Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                  <option value="Any">Any BHK</option>
                </select>
              </div>

              {/* Furnishing */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Armchair className="w-3 h-3 text-purple-400" />
                  <span>Furnishing</span>
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as FurnishingPreference)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Any">Any Furnishing</option>
                </select>
              </div>

              {/* Move-in Timeline */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>Possession</span>
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value as PossessionTimeline)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Immediate">Immediate Move-in</option>
                  <option value="Within 1 Month">Within 1 Month</option>
                  <option value="Within 3 Months">Within 3 Months</option>
                  <option value="Flexible">Flexible Timeline</option>
                </select>
              </div>

              {/* Min Area Sq.Ft */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  <span>Min Area (Sq.Ft)</span>
                </label>
                <input
                  type="number"
                  value={minAreaSqFt}
                  onChange={(e) => setMinAreaSqFt(Number(e.target.value))}
                  placeholder="e.g. 1500"
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

            </div>
          )}

          {/* 6. Specific Preferences & Notes */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-300 flex items-center justify-between">
              <span>Specific Requirements / Amenities (പ്രത്യേക താല്പര്യങ്ങൾ)</span>
              <span className="text-slate-500 text-[10px]">Optional details</span>
            </label>
            <textarea
              value={specificNeeds}
              onChange={(e) => setSpecificNeeds(e.target.value)}
              rows={2}
              placeholder="e.g. Gated community, 24/7 security, covered car parking, east facing, good well water supply..."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 7. Contact Details */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800">
            <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Contact Information for Sellers / Agents</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">Your Full Name</span>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Name"
                  required
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">Phone / Mobile Number</span>
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
                <span className="text-[10px] text-slate-400 font-bold">Email Address</span>
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
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting Requirement...' : 'Publish Requirement (ആവശ്യം പ്രസിദ്ധീകരിക്കുക)'}</span>
          </button>

        </form>
      </div>
    </div>
  );
};
