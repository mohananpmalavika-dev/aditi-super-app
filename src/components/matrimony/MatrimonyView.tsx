import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Send, 
  Bookmark, 
  UserCheck, 
  X,
  MessageSquare,
  Plus,
  Phone,
  Moon,
  Users,
  ShieldCheck,
  Crown,
  Trash2,
  Filter
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { MatrimonyProfile } from '../../types/superApp';
import { RegisterMatrimonyModal } from './RegisterMatrimonyModal';

export const MatrimonyView: React.FC = () => {
  const { 
    matrimonyProfiles, 
    addMatrimonyProfile,
    deleteMatrimonyProfile,
    sendInterest, 
    toggleShortlistMatrimony, 
    startNewChatWith, 
    showToast,
    user 
  } = useSuperApp();
  
  const [activeTab, setActiveTab] = useState<'all' | 'brides' | 'grooms' | 'shortlisted' | 'myProfiles'>('all');
  const [professionSearch, setProfessionSearch] = useState('');
  const [religionFilter, setReligionFilter] = useState('All');
  
  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonyProfile | null>(null);

  const bridesCount = matrimonyProfiles.filter(m => m.gender === 'Female').length;
  const groomsCount = matrimonyProfiles.filter(m => m.gender === 'Male').length;
  const shortlistedCount = matrimonyProfiles.filter(m => m.isShortlisted).length;

  const filteredProfiles = matrimonyProfiles.filter((m) => {
    // Tab Filter
    if (activeTab === 'brides' && m.gender !== 'Female') return false;
    if (activeTab === 'grooms' && m.gender !== 'Male') return false;
    if (activeTab === 'shortlisted' && !m.isShortlisted) return false;
    if (activeTab === 'myProfiles' && m.postedByUserId !== (user.id || 'current-user')) return false;

    // Religion Filter
    if (religionFilter !== 'All' && m.religion !== religionFilter) return false;

    // Search Query
    const q = professionSearch.toLowerCase().trim();
    if (!q) return true;

    return (
      m.name.toLowerCase().includes(q) ||
      m.profession.toLowerCase().includes(q) ||
      m.education.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.motherTongue.toLowerCase().includes(q) ||
      m.community.toLowerCase().includes(q) ||
      (m.nakshatra && m.nakshatra.toLowerCase().includes(q)) ||
      (m.zodiac && m.zodiac.toLowerCase().includes(q))
    );
  });

  const handleStartIcebreaker = (profile: MatrimonyProfile) => {
    startNewChatWith(
      profile.name,
      profile.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      `Matrimony Match (${profile.compatibilityScore || 95}% Compatibility)`,
      `Namaste ${profile.name}! I came across your profile on Aditi Matrimony (${profile.profession} in ${profile.city}) and would love to connect with you and your family!`
    );
    showToast(`💬 Icebreaker chat opened with ${profile.name}!`);
    setSelectedProfile(null);
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      
      {/* Matrimony Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-red-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/25 shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Matrimony & Matchmaking</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-rose-400" />
                <span>100% Verified Profiles</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Discover compatible life partners with verified biodata, Malayalam Nakshatra & astrological harmony.
            </p>
          </div>
        </div>

        {/* Action Controls: Register Bride/Groom Profile */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Profile (വരൻ / വധു ചേർക്കുക)</span>
          </button>
        </div>
      </div>

      {/* Main Section Navigation Switcher */}
      <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 gap-1.5 overflow-x-auto shadow-md">
        
        {/* All Matches */}
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>All Matches ({matrimonyProfiles.length})</span>
        </button>

        {/* Brides */}
        <button
          onClick={() => setActiveTab('brides')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'brides'
              ? 'bg-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>👰 Brides (വധുക്കൾ - {bridesCount})</span>
        </button>

        {/* Grooms */}
        <button
          onClick={() => setActiveTab('grooms')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'grooms'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🤵 Grooms (വരന്മാർ - {groomsCount})</span>
        </button>

        {/* Shortlisted */}
        <button
          onClick={() => setActiveTab('shortlisted')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'shortlisted'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Shortlisted ({shortlistedCount})</span>
        </button>

        {/* My Registered Profiles */}
        <button
          onClick={() => setActiveTab('myProfiles')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'myProfiles'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Profiles</span>
        </button>

      </div>

      {/* Search Bar & Filters */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={professionSearch}
              onChange={(e) => setProfessionSearch(e.target.value)}
              placeholder="Search by name, profession (Doctor, Engineer...), city, star (Rohini, Makam...), or education..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Religion Filter */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['All', 'Hindu', 'Muslim', 'Christian'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setReligionFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  religionFilter === r
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Verified Matrimony Biodatas ({filteredProfiles.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Direct Family & Candidate Connect</span>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 opacity-70" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-200">No matrimony profiles found matching this filter</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try adjusting your search criteria or register a new bride / groom profile.
              </p>
            </div>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
            >
              + Register Bride / Groom Profile Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 shadow-xl overflow-hidden group transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Photo & Top Badges */}
                  <div 
                    onClick={() => setSelectedProfile(p)}
                    className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={p.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Compatibility Score */}
                    {p.compatibilityScore && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-rose-600/90 backdrop-blur-md text-[11px] font-black text-white shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        <span>{p.compatibilityScore}% Match</span>
                      </div>
                    )}

                    {/* Gender Tag */}
                    <div className={`absolute bottom-16 right-3 px-2 py-0.5 rounded-lg backdrop-blur-md text-[10px] font-extrabold border ${
                      p.gender === 'Female' 
                        ? 'bg-pink-500/80 text-white border-pink-400/40' 
                        : 'bg-indigo-500/80 text-white border-indigo-400/40'
                    }`}>
                      {p.gender === 'Female' ? '👰 Bride' : '🤵 Groom'}
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShortlistMatrimony(p.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                        p.isShortlisted
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-950/80 text-slate-400 hover:text-white'
                      }`}
                      title="Shortlist Profile"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    {/* Name & Age Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 pt-10">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-base text-white">{p.name}, {p.age}</h3>
                        {p.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                        )}
                      </div>
                      <p className="text-xs text-rose-200 font-semibold flex items-center gap-1.5">
                        <span>{p.height}</span>
                        <span>•</span>
                        <span>{p.nakshatra ? `${p.nakshatra} ⭐` : p.zodiac}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bio & Details */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-200 truncate">{p.profession}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400 truncate">{p.education}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400">{p.city}, {p.state}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 italic">
                      "{p.about}"
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {p.motherTongue}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {p.religion} - {p.community}
                      </span>
                      {p.annualIncome && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {p.annualIncome}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedProfile(p)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    View Biodata
                  </button>

                  <button
                    onClick={() => sendInterest(p.id)}
                    disabled={p.interestSent}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      p.interestSent
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white shadow-md shadow-rose-500/25'
                    }`}
                  >
                    {p.interestSent ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Interest Sent</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Interest</span>
                      </>
                    )}
                  </button>

                  {p.postedByUserId === (user.id || 'current-user') && (
                    <button
                      onClick={() => deleteMatrimonyProfile(p.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete My Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL BIODATA MODAL */}
      {/* ========================================================================= */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[92dvh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-7 overflow-y-auto space-y-6 my-auto text-slate-100 font-sans">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-extrabold text-base text-white">Full Matrimonial Profile & Biodata</h3>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Photo & Compatibility */}
              <div className="space-y-3">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={selectedProfile.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
                    alt={selectedProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-center">
                  <p className="text-xl font-black text-rose-400">{selectedProfile.compatibilityScore || 95}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Astrological & Lifestyle Match</p>
                </div>

                {selectedProfile.contactPhone && (
                  <a
                    href={`tel:${selectedProfile.contactPhone}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call: {selectedProfile.contactPhone}</span>
                  </a>
                )}
              </div>

              {/* Bio & Information Grid */}
              <div className="sm:col-span-2 space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-white">{selectedProfile.name}, {selectedProfile.age}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      selectedProfile.gender === 'Female'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {selectedProfile.gender === 'Female' ? 'Bride (വധു)' : 'Groom (വരൻ)'}
                    </span>
                  </div>
                  <p className="text-xs text-rose-300 font-semibold mt-0.5">
                    {selectedProfile.profession} • {selectedProfile.annualIncome}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Education</span>
                    <span className="font-semibold text-slate-200">{selectedProfile.education}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                    <span className="font-semibold text-slate-200">{selectedProfile.city}, {selectedProfile.state}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Community & Religion</span>
                    <span className="font-semibold text-slate-200">{selectedProfile.religion} ({selectedProfile.community})</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Star & Zodiac</span>
                    <span className="font-semibold text-slate-200">
                      {selectedProfile.nakshatra ? `${selectedProfile.nakshatra} (${selectedProfile.zodiac})` : selectedProfile.zodiac}
                    </span>
                  </div>

                  {selectedProfile.maritalStatus && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Marital Status</span>
                      <span className="font-semibold text-slate-200">{selectedProfile.maritalStatus}</span>
                    </div>
                  )}

                  {selectedProfile.diet && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Diet & Lifestyle</span>
                      <span className="font-semibold text-slate-200">{selectedProfile.diet}</span>
                    </div>
                  )}
                </div>

                {selectedProfile.familyDetails && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-300">Family Background</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                      {selectedProfile.familyDetails}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-300">About Me</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    {selectedProfile.about}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-300">Partner Expectations</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    {selectedProfile.partnerPreferences}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-2 pt-2 flex-wrap">
                  <button
                    onClick={() => handleStartIcebreaker(selectedProfile)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Start Chat with Candidate / Family</span>
                  </button>

                  <button
                    onClick={() => {
                      sendInterest(selectedProfile.id);
                      setSelectedProfile(null);
                    }}
                    disabled={selectedProfile.interestSent}
                    className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
                  >
                    {selectedProfile.interestSent ? 'Interest Sent' : 'Send Interest'}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REGISTER BRIDE / GROOM PROFILE MODAL */}
      {/* ========================================================================= */}
      <RegisterMatrimonyModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />

    </div>
  );
};
