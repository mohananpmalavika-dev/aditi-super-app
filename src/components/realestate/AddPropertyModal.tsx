import React, { useState, useRef } from 'react';
import { 
  X, 
  Building2, 
  Upload, 
  MapPin, 
  IndianRupee, 
  Bed, 
  Bath, 
  Maximize2, 
  Check, 
  Plus, 
  Sparkles, 
  Trash2, 
  Camera, 
  Phone, 
  User,
  ShieldCheck
} from 'lucide-react';
import { ListingType, PropertyType, RealEstateProperty } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';
import { readFileAsDataUrl } from '../../services/clientMediaAiEngine';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  'Kochi (Ernakulam)',
  'Thiruvananthapuram',
  'Kozhikode (Calicut)',
  'Thrissur',
  'Kottayam',
  'Alappuzha',
  'Bengaluru',
  'Chennai',
  'Mumbai',
  'Dubai'
];

const AMENITIES_LIST = [
  'Swimming Pool',
  '24/7 Gated Security',
  'Covered Car Parking',
  'Club House & Gym',
  'Solar Power Backup',
  'Private Garden',
  'Sea / Waterfront View',
  'High-Speed Elevators',
  'Children Play Area',
  'Smart Home Automation',
  'Modular Kitchen',
  'EV Charging Point'
];

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80'
];

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose }) => {
  const { addProperty, user, showToast } = useSuperApp();

  const [title, setTitle] = useState('');
  const [listingType, setListingType] = useState<ListingType>('Buy');
  const [type, setType] = useState<PropertyType>('Apartment');
  const [price, setPrice] = useState<number>(8500000); // 85 Lakhs
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [areaSqFt, setAreaSqFt] = useState<number>(1850);
  const [city, setCity] = useState('Kochi (Ernakulam)');
  const [location, setLocation] = useState('Marine Drive Waterfront');
  const [description, setDescription] = useState('Superb luxury residence with panoramic waterfront views, premium Italian marble flooring, and modular designer kitchen.');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Swimming Pool',
    '24/7 Gated Security',
    'Covered Car Parking',
    'Sea / Waterfront View'
  ]);
  const [images, setImages] = useState<string[]>([SAMPLE_PHOTO_PRESETS[0]]);
  const [agentName, setAgentName] = useState(user.name || 'Aditi Verified Agent');
  const [agentPhone, setAgentPhone] = useState('+91 98470 12345');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Format price into Indian Rupees (Crores / Lakhs / Thousands)
  const formatPriceIndian = (num: number, lType: ListingType) => {
    if (lType === 'Rent') {
      return `₹${num.toLocaleString('en-IN')}/mo`;
    }
    if (num >= 10000000) {
      const cr = (num / 10000000).toFixed(2);
      return `₹${cr.replace(/\.00$/, '')} Cr`;
    }
    if (num >= 100000) {
      const lk = (num / 100000).toFixed(2);
      return `₹${lk.replace(/\.00$/, '')} Lakhs`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await readFileAsDataUrl(files[i]);
        newUrls.push(dataUrl);
      }
      setImages((prev) => [...newUrls, ...prev]);
      showToast(`📸 ${newUrls.length} photo(s) added to property gallery!`);
    } catch {
      showToast('⚠️ Failed to load photo file.');
    }
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('⚠️ Please enter a property title.');
      return;
    }
    if (!location.trim() || !city.trim()) {
      showToast('⚠️ Please provide property location & city.');
      return;
    }
    if (price <= 0) {
      showToast('⚠️ Please enter a valid property price.');
      return;
    }
    if (images.length === 0) {
      showToast('⚠️ Please include at least one property image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const priceFormatted = formatPriceIndian(price, listingType);
      await addProperty({
        title: title.trim(),
        type,
        listingType,
        price,
        priceFormatted,
        bedrooms,
        bathrooms,
        areaSqFt,
        location: location.trim(),
        city: city.trim(),
        images: images.length > 0 ? images : [SAMPLE_PHOTO_PRESETS[0]],
        features: selectedFeatures.length > 0 ? selectedFeatures : ['24/7 Gated Security', 'Covered Car Parking'],
        description: description.trim(),
        agent: {
          name: agentName.trim() || user.name,
          phone: agentPhone.trim() || '+91 98470 12345',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          rating: 4.9
        },
        isFeatured: true
      });

      onClose();
    } catch (err: any) {
      showToast(`⚠️ Error adding property: ${err.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>List / Add New Property</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Free Listing
                </span>
              </h2>
              <p className="text-xs text-slate-400">Add complete details for your residential or commercial property.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Listing Type Switcher (Buy vs Rent) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">1. Listing Purpose</label>
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setListingType('Buy');
                  if (price < 100000) setPrice(8500000);
                }}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                  listingType === 'Buy'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏠 For Sale (വിൽപ്പനയ്ക്ക്)
              </button>
              <button
                type="button"
                onClick={() => {
                  setListingType('Rent');
                  if (price > 500000) setPrice(35000);
                }}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                  listingType === 'Rent'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔑 For Rent / Lease (വാടകയ്ക്ക്)
              </button>
            </div>
          </div>

          {/* Property Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">2. Property Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3 BHK Luxury Waterfront Villa in Marine Drive"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Property Type & Price Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Property Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">3. Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Apartment">Apartment / Flat (ഫ്ലാറ്റ്)</option>
                <option value="Villa">Independent Villa / House (വില്ല)</option>
                <option value="Penthouse">Luxury Penthouse (പെന്റ്ഹൗസ്)</option>
                <option value="Studio">Studio Apartment (സ്റ്റുഡിയോ)</option>
                <option value="Commercial">Commercial / Office Space (ഷോപ്പ്/ഓഫീസ്)</option>
              </select>
            </div>

            {/* Price with formatted indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">4. Price (₹)</label>
                <span className="text-xs font-extrabold text-amber-400">
                  {formatPriceIndian(price, listingType)}
                </span>
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  required
                  min={1000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Enter exact price in INR"
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

          </div>

          {/* Bedrooms, Bathrooms & Sq.Ft */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-amber-400" />
                <span>Bedrooms</span>
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              >
                {[1, 2, 3, 4, 5, 6].map((b) => (
                  <option key={b} value={b}>{b} BHK</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bathrooms</span>
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              >
                {[1, 2, 3, 4, 5].map((b) => (
                  <option key={b} value={b}>{b} Bath</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Area (Sq.Ft)</span>
              </label>
              <input
                type="number"
                min={100}
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* Location & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">City / District</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Neighborhood / Street</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kakkanad InfoPark / Kowdiar / Beach Road"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* Photos Upload & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Property Photos ({images.length})</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-amber-400 text-xs font-bold hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos from Device</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              multiple
              accept="image/*"
              className="hidden"
            />

            {/* Image Preview Strip */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 group">
                  <img src={imgUrl} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500 bg-slate-950 flex flex-col items-center justify-center text-slate-500 hover:text-amber-400 cursor-pointer flex-shrink-0 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-1">Add Photo</span>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Quick Presets:</span>
              {SAMPLE_PHOTO_PRESETS.slice(0, 3).map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImages((prev) => [preset, ...prev])}
                  className="text-amber-400 hover:underline"
                >
                  + Sample {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Key Features & Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = selectedFeatures.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleFeature(amenity)}
                    className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{amenity}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe neighborhood highlights, proximity to metro/airport, construction quality..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Agent / Seller Contact Details */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contact / Seller Verification</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Contact Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Phone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing Property...' : 'Publish Property Listing (പ്രോപ്പർട്ടി ലിസ്റ്റ് ചെയ്യുക)'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
