import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  Bookmark, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calculator, 
  Calendar, 
  MessageSquare, 
  Check, 
  Star,
  X
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ListingType, PropertyType, RealEstateProperty } from '../../types/superApp';
import confetti from 'canvas-confetti';

export const RealEstateView: React.FC = () => {
  const { properties, toggleSaveProperty, startNewChatWith, showToast } = useSuperApp();
  
  const [listingType, setListingType] = useState<ListingType>('Buy');
  const [selectedType, setSelectedType] = useState<PropertyType | 'All'>('All');
  const [selectedBHK, setSelectedBHK] = useState<number | 'All'>('All');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Selected Property for Details / Tour Modal
  const [selectedProperty, setSelectedProperty] = useState<RealEstateProperty | null>(null);
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourDate, setTourDate] = useState('2026-08-30');
  const [tourTime, setTourTime] = useState('14:00');
  const [tourType, setTourType] = useState<'In-Person' | 'Live 3D Virtual'>('In-Person');

  /* ========== MORTGAGE / EMI CALCULATOR STATE ========== */
  const [loanAmount, setLoanAmount] = useState<number>(650000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(30);

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = loanTenureYears * 12;
  const monthlyEMI = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const filteredProperties = properties.filter((p) => {
    const matchesListing = p.listingType === listingType;
    const matchesType = selectedType === 'All' || p.type === selectedType;
    const matchesBHK = selectedBHK === 'All' || p.bedrooms === selectedBHK;
    const matchesLoc = p.location.toLowerCase().includes(searchLocation.toLowerCase()) || 
                       p.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
                       p.title.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesListing && matchesType && matchesBHK && matchesLoc;
  });

  const handleBookTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    confetti({ particleCount: 60, spread: 60 });
    showToast(`🏡 ${tourType} tour booked for ${selectedProperty.title} on ${tourDate} at ${tourTime}!`);
    setShowTourModal(false);
  };

  const handleContactAgent = (property: RealEstateProperty) => {
    startNewChatWith(
      property.agent.name,
      property.agent.avatar,
      `Listing Agent - ${property.title}`,
      `Hi ${property.agent.name}, I am interested in inquiring about "${property.title}" (${property.priceFormatted}). Is it currently available for viewing?`
    );
    showToast(`Opened direct chat with ${property.agent.name}`);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Real Estate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Real Estate Portal</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Verified Listings
              </span>
            </div>
            <p className="text-xs text-slate-400">Discover premium residential, villas & penthouses with 3D virtual tours.</p>
          </div>
        </div>

        {/* Buy vs Rent Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/70 border border-slate-800">
          <button
            onClick={() => setListingType('Buy')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              listingType === 'Buy'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Buy Homes
          </button>
          <button
            onClick={() => setListingType('Rent')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              listingType === 'Rent'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rent Properties
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by city, neighborhood, or building..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['All', 'Apartment', 'Villa', 'Penthouse', 'Studio'] as Array<PropertyType | 'All'>).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedType === t
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 mr-1">BHK:</span>
            {(['All', 1, 2, 3, 4] as Array<number | 'All'>).map((b) => (
              <button
                key={b.toString()}
                onClick={() => setSelectedBHK(b)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedBHK === b
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {b === 'All' ? 'All BHK' : `${b} BHK`}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Listings Grid + Mortgage Calculator Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Properties Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">
              Available Properties ({filteredProperties.length})
            </h3>
            <span className="text-xs text-slate-400">Sorted by relevance</span>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <Building2 className="w-10 h-10 mx-auto text-slate-600" />
              <p className="font-bold text-sm text-slate-300">No properties match your filter criteria</p>
              <p className="text-xs text-slate-500">Try adjusting your BHK or location search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProperties.map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 shadow-xl overflow-hidden group transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Carousel / Hero Image */}
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
                        {p.type} • {p.listingType}
                      </div>
                      <button
                        onClick={() => toggleSaveProperty(p.id)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                          p.isSaved
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-950/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-amber-600 text-xs font-black text-white shadow-lg">
                        {p.priceFormatted}
                      </div>
                    </div>

                    {/* Property Specs */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">{p.location}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-[11px] font-bold text-slate-300">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.areaSqFt} sqft</span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1">
                        {p.features.slice(0, 3).map((feat, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProperty(p);
                        setShowTourModal(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Tour</span>
                    </button>
                    <button
                      onClick={() => handleContactAgent(p)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Direct Chat with Agent"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Interactive Mortgage Calculator */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 sticky top-24">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">Mortgage & EMI Estimator</h3>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-800/40 text-center space-y-1">
              <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Estimated Monthly Payment</p>
              <p className="text-3xl font-black text-white">${monthlyEMI.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></p>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Loan Amount</span>
                  <span className="text-amber-400">${loanAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={2000000}
                  step={25000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Interest Rate</span>
                  <span className="text-amber-400">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={12.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Loan Tenure</span>
                  <span className="text-amber-400">{loanTenureYears} Years</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 30].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setLoanTenureYears(yr)}
                      className={`py-1.5 rounded-lg font-bold border transition-colors ${
                        loanTenureYears === yr
                          ? 'bg-amber-600 border-amber-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <p className="text-[10px] text-slate-500 italic text-center">
              Estimates include principal & interest. Real rates may vary with property tax and insurance.
            </p>
          </div>
        </div>

      </div>

      {/* Tour Booking Modal */}
      {showTourModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Schedule Viewing Tour</span>
              </h3>
              <button
                onClick={() => setShowTourModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-white truncate">{selectedProperty.title}</h4>
                <p className="text-[11px] text-slate-400">{selectedProperty.location}</p>
                <p className="text-xs font-black text-amber-400">{selectedProperty.priceFormatted}</p>
              </div>
            </div>

            <form onSubmit={handleBookTour} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Tour Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['In-Person', 'Live 3D Virtual'] as const).map((fmt) => (
                    <button
                      type="button"
                      key={fmt}
                      onClick={() => setTourType(fmt)}
                      className={`p-2 rounded-xl font-bold border transition-colors ${
                        tourType === fmt
                          ? 'bg-amber-600 border-amber-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Preferred Date</label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Preferred Time</label>
                  <input
                    type="time"
                    value={tourTime}
                    onChange={(e) => setTourTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTourModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
