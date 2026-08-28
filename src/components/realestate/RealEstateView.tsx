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
  X,
  Plus,
  Phone,
  Share2,
  Eye,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Heart,
  FileText,
  UserCheck,
  Armchair,
  Home,
  Trash2
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ListingType, PropertyNeedCategory, PropertyRequirement, PropertyType, RealEstateProperty } from '../../types/superApp';
import { AddPropertyModal } from './AddPropertyModal';
import { PostRequirementModal } from './PostRequirementModal';
import confetti from 'canvas-confetti';

export const RealEstateView: React.FC = () => {
  const { 
    properties, 
    toggleSaveProperty, 
    propertyRequirements, 
    deletePropertyRequirement, 
    toggleSavePropertyRequirement, 
    startNewChatWith, 
    showToast,
    user
  } = useSuperApp();
  
  const [activeTab, setActiveTab] = useState<'properties' | 'demands' | 'saved'>('properties');
  const [listingType, setListingType] = useState<ListingType>('Buy');
  const [selectedType, setSelectedType] = useState<PropertyType | 'All'>('All');
  const [selectedBHK, setSelectedBHK] = useState<number | 'All'>('All');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Demands / Requirements Filters State
  const [demandFilterType, setDemandFilterType] = useState<'All' | 'Buy' | 'Rent'>('All');
  const [demandCategory, setDemandCategory] = useState<string>('All');
  const [demandSearchQuery, setDemandSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPostReqModal, setShowPostReqModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<RealEstateProperty | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Tour Booking Form
  const [tourDate, setTourDate] = useState('2026-08-30');
  const [tourTime, setTourTime] = useState('14:00');
  const [tourType, setTourType] = useState<'In-Person' | 'Live 3D Virtual'>('In-Person');

  /* ========== MORTGAGE / EMI CALCULATOR STATE ========== */
  const [loanAmount, setLoanAmount] = useState<number>(6500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);

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
    const matchesLoc = 
      p.location.toLowerCase().includes(searchLocation.toLowerCase()) || 
      p.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
      p.title.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesListing && matchesType && matchesBHK && matchesLoc;
  });

  const filteredRequirements = (propertyRequirements || []).filter((r) => {
    const matchesType = demandFilterType === 'All' || r.requirementType === demandFilterType;
    const matchesCat = demandCategory === 'All' || r.propertyCategory === demandCategory;
    const q = demandSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      r.title.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.preferredLocations.some(l => l.toLowerCase().includes(q)) ||
      r.specificNeeds.toLowerCase().includes(q) ||
      r.contactName.toLowerCase().includes(q);
    return matchesType && matchesCat && matchesSearch;
  });

  const handleBookTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    confetti({ particleCount: 60, spread: 60 });
    showToast(`🏡 ${tourType} tour booked for "${selectedProperty.title}" on ${tourDate} at ${tourTime}!`);
    setShowTourModal(false);
  };

  const handleContactAgent = (property: RealEstateProperty) => {
    startNewChatWith(
      property.agent.name,
      property.agent.avatar,
      `Listing Agent - ${property.title}`,
      `Hi ${property.agent.name}, I am inquiring about "${property.title}" (${property.priceFormatted}) in ${property.location}, ${property.city}. Could you share more details?`
    );
    showToast(`Opened direct chat with ${property.agent.name}`);
  };

  const handleContactBuyer = (req: PropertyRequirement) => {
    startNewChatWith(
      req.contactName,
      req.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      `Property Buyer/Tenant - ${req.title}`,
      `Hi ${req.contactName}, I noticed your requirement for "${req.title}" (${req.budgetFormatted}) in ${req.city}. I have matching properties available for you. Let's connect!`
    );
    showToast(`Opened direct chat with ${req.contactName}`);
  };

  const openPropertyDetails = (property: RealEstateProperty) => {
    setSelectedProperty(property);
    setActiveImageIdx(0);
    setShowDetailsModal(true);
  };

  const loadPropertyIntoEMI = (property: RealEstateProperty) => {
    setLoanAmount(Math.round(property.price * 0.8)); // 80% LTV
    showToast(`🧮 EMI calculator updated for ${property.title} (80% Loan)`);
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      
      {/* Real Estate Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Real Estate & Property Portal</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Verified Listings & Buyer Demands
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Discover properties for sale & rent, or post your specific buyer & tenant requirements.
            </p>
          </div>
        </div>

        {/* Action Controls: Add Property & Post Requirement */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Post Requirement Button */}
          <button
            onClick={() => setShowPostReqModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Post My Need (എനിക്ക് പ്രോപ്പർട്ടി വേണം)</span>
          </button>

          {/* Add / List Property Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>List Property (പ്രോപ്പർട്ടി ചേർക്കുക)</span>
          </button>
        </div>
      </div>

      {/* Main Section Navigation Switcher */}
      <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 gap-1.5 overflow-x-auto shadow-md">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'properties'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Available Properties ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('demands')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'demands'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-yellow-300" />
          <span>Buyer & Tenant Needs ({propertyRequirements.length})</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
            ആവശ്യക്കാർ
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: AVAILABLE PROPERTIES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'properties' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-300">Listing Purpose:</span>
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setListingType('Buy')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      listingType === 'Buy'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Buy Homes
                  </button>
                  <button
                    onClick={() => setListingType('Rent')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      listingType === 'Rent'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Rent Properties
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Box */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search by city (Kochi, Trivandrum, Calicut...), locality, or building..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Property Type Filter */}
              <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['All', 'Apartment', 'Villa', 'Penthouse', 'Studio', 'Commercial'] as Array<PropertyType | 'All'>).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedType === t
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* BHK Filter */}
              <div className="md:col-span-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-400 mr-1">BHK:</span>
                {(['All', 1, 2, 3, 4, 5] as Array<number | 'All'>).map((b) => (
                  <button
                    key={b.toString()}
                    onClick={() => setSelectedBHK(b)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedBHK === b
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {b === 'All' ? 'All' : `${b} BHK`}
                  </button>
                ))}
              </div>
            </div>
          </div>

      {/* Listings Grid + Mortgage Calculator Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Properties Listings */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Available Properties ({filteredProperties.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Verified Residential & Commercial</span>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 opacity-70" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-200">No properties match your filter criteria</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try adjusting your search location, BHK, or property type filter, or list a new property directly.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all"
              >
                + List Your Property Now
              </button>
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
                    <div 
                      onClick={() => openPropertyDetails(p)}
                      className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
                        {p.type} • {p.listingType}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveProperty(p.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                          p.isSaved
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-950/80 text-slate-400 hover:text-white'
                        }`}
                        title={p.isSaved ? 'Saved to Bookmarks' : 'Bookmark Property'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-amber-600 text-xs font-black text-white shadow-lg">
                        {p.priceFormatted}
                      </div>

                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>View Details</span>
                      </div>
                    </div>

                    {/* Property Specs */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 
                          onClick={() => openPropertyDetails(p)}
                          className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
                        >
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">{p.location}, {p.city}</span>
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
                        {p.features.length > 3 && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                            +{p.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => openPropertyDetails(p)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProperty(p);
                        setShowTourModal(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/30"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Tour</span>
                    </button>

                    <button
                      onClick={() => handleContactAgent(p)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Direct Chat with Agent / Seller"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Interactive Mortgage & EMI Calculator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 sticky top-24">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">Mortgage & EMI Estimator</h3>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-800/40 text-center space-y-1">
              <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Estimated Monthly Payment</p>
              <p className="text-3xl font-black text-white">₹{monthlyEMI.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span></p>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Loan Amount</span>
                  <span className="text-amber-400">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={30000000}
                  step={100000}
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
                  min={5.0}
                  max={15.0}
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
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 15, 20, 30].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setLoanTenureYears(yr)}
                      className={`py-1.5 rounded-lg font-bold border transition-colors ${
                        loanTenureYears === yr
                          ? 'bg-amber-600 border-amber-500 text-white shadow-sm'
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
    </div>
  )}

      {/* ========================================================================= */}
      {/* SECTION 2: BUYER & TENANT REQUIREMENTS (ആവശ്യക്കാർ - PROPERTY WANTED) */}
      {/* ========================================================================= */}
      {activeTab === 'demands' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Post Requirement Banner CTA */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 shrink-0">
                <FileText className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Looking to Buy or Rent a Property?</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    നിങ്ങളുടെ ആവശ്യം ചേർക്കുക
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Post your exact budget, preferred localities, BHK, and furnishing preferences. Property owners and verified brokers will contact you directly with matching options.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPostReqModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/30 whitespace-nowrap hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post My Requirement (ആവശ്യം പോസ്റ്റ് ചെയ്യുക)</span>
            </button>
          </div>

          {/* Demands Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-300">Requirement Type:</span>
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setDemandFilterType('All')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      demandFilterType === 'All'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Needs ({propertyRequirements.length})
                  </button>
                  <button
                    onClick={() => setDemandFilterType('Buy')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      demandFilterType === 'Buy'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Want to Buy ({propertyRequirements.filter(r => r.requirementType === 'Buy').length})
                  </button>
                  <button
                    onClick={() => setDemandFilterType('Rent')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      demandFilterType === 'Rent'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Want to Rent ({propertyRequirements.filter(r => r.requirementType === 'Rent').length})
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Box */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={demandSearchQuery}
                  onChange={(e) => setDemandSearchQuery(e.target.value)}
                  placeholder="Search buyer requirements (Kozhikode, Villa, 3 BHK, Kakkanad, Beach...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['All', 'Apartment', 'Villa', 'Independent House', 'Plot / Land', 'Commercial', 'Office Space'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDemandCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      demandCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demands Cards List / Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Buyer & Tenant Demand Listings ({filteredRequirements.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Direct Customer Inquiries</span>
            </div>

            {filteredRequirements.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 opacity-70" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-200">No buyer or tenant requirements match this filter</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Be the first to post your property requirement so sellers and agents can reach out to you!
                  </p>
                </div>
                <button
                  onClick={() => setShowPostReqModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  + Post Your Property Requirement
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredRequirements.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl space-y-4 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      
                      {/* Top Badges & Budget */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 border ${
                            req.requirementType === 'Buy'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          }`}>
                            {req.requirementType === 'Buy' ? '🏷️ Want to Buy (വാങ്ങാൻ)' : '🔑 Want to Rent (വാടകയ്ക്ക്)'}
                          </span>

                          <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-bold">
                            {req.propertyCategory}
                          </span>
                        </div>

                        <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-black text-xs">
                          {req.budgetFormatted}
                        </span>
                      </div>

                      {/* Title & City */}
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-white hover:text-indigo-300 transition-colors">
                          {req.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 flex-wrap">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-slate-300">{req.city}:</span>
                          <span>{req.preferredLocations.join(', ')}</span>
                        </div>
                      </div>

                      {/* Specs Tags */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        {req.bedrooms && req.bedrooms !== 'Any' && (
                          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{req.bedrooms} BHK</span>
                          </span>
                        )}
                        {req.furnishing && (
                          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                            <Armchair className="w-3.5 h-3.5 text-purple-400" />
                            <span>{req.furnishing}</span>
                          </span>
                        )}
                        {req.timeline && (
                          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{req.timeline}</span>
                          </span>
                        )}
                        {req.minAreaSqFt && (
                          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Min {req.minAreaSqFt} sq.ft</span>
                          </span>
                        )}
                      </div>

                      {/* Specific Needs Description */}
                      <p className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-slate-300 text-xs leading-relaxed">
                        "{req.specificNeeds}"
                      </p>

                    </div>

                    {/* Customer Profile & Direct Contact Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                          alt={req.contactName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-extrabold text-xs text-white truncate">{req.contactName}</span>
                            <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">{req.contactPhone}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleContactBuyer(req)}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat with Buyer</span>
                        </button>

                        <a
                          href={`tel:${req.contactPhone}`}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                          title="Call Buyer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => toggleSavePropertyRequirement(req.id)}
                          className={`p-2 rounded-xl transition-colors ${
                            req.isSaved ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Bookmark Requirement"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deletePropertyRequirement(req.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Requirement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PROPERTY DETAILS MODAL (FULL DETAILS, GALLERY & SELLER CONTACT) */}
      {/* ========================================================================= */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedProperty.location}, {selectedProperty.city}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveProperty(selectedProperty.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    selectedProperty.isSaved ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Photo Gallery & Thumbnail Carousel */}
              <div className="space-y-2">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={selectedProperty.images[activeImageIdx] || selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-xs font-black text-amber-300 border border-amber-500/30">
                    {selectedProperty.priceFormatted}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-slate-700">
                    {selectedProperty.type} • {selectedProperty.listingType}
                  </div>

                  {selectedProperty.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : selectedProperty.images.length - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveImageIdx((prev) => (prev < selectedProperty.images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedProperty.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {selectedProperty.images.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImageIdx(i)}
                        className={`w-16 h-12 rounded-xl overflow-hidden bg-slate-950 border cursor-pointer flex-shrink-0 transition-all ${
                          activeImageIdx === i ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-slate-800 opacity-60'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <Bed className="w-5 h-5 text-amber-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 block">Bedrooms</span>
                  <span className="text-sm font-extrabold text-white">{selectedProperty.bedrooms} BHK</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <Bath className="w-5 h-5 text-cyan-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 block">Bathrooms</span>
                  <span className="text-sm font-extrabold text-white">{selectedProperty.bathrooms} Baths</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <Maximize2 className="w-5 h-5 text-indigo-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 block">Carpet Area</span>
                  <span className="text-sm font-extrabold text-white">{selectedProperty.areaSqFt} Sq.Ft</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 block">Verification</span>
                  <span className="text-sm font-extrabold text-emerald-400">Verified</span>
                </div>
              </div>

              {/* Amenities & Features */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-slate-200">Amenities & Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3 h-3 text-amber-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Description */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-slate-200">About this Property</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Agent & Seller Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProperty.agent.avatar}
                    alt={selectedProperty.agent.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{selectedProperty.agent.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{selectedProperty.agent.rating} Rating • Verified Listing Agent</span>
                    </p>
                    <p className="text-xs text-amber-300 font-mono mt-0.5">{selectedProperty.agent.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleContactAgent(selectedProperty);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition-all hover:scale-105"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat with Agent</span>
                  </button>

                  <button
                    onClick={() => {
                      loadPropertyIntoEMI(selectedProperty);
                      setShowDetailsModal(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <Calculator className="w-3.5 h-3.5 text-amber-400" />
                    <span>Calculate EMI</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">Total Price</span>
                <span className="text-lg font-black text-amber-400">{selectedProperty.priceFormatted}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowTourModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Property Tour</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOUR BOOKING MODAL */}
      {/* ========================================================================= */}
      {showTourModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 my-auto">
            
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
                <p className="text-[11px] text-slate-400">{selectedProperty.location}, {selectedProperty.city}</p>
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30"
                >
                  Confirm Booking
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ADD / LIST PROPERTY MODAL */}
      {/* ========================================================================= */}
      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* ========================================================================= */}
      {/* 4. POST BUYER / TENANT REQUIREMENT MODAL */}
      {/* ========================================================================= */}
      <PostRequirementModal
        isOpen={showPostReqModal}
        onClose={() => setShowPostReqModal(false)}
      />

    </div>
  );
};
