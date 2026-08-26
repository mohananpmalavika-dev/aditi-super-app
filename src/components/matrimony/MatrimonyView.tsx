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
  MessageSquare
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { MatrimonyProfile } from '../../types/superApp';

export const MatrimonyView: React.FC = () => {
  const { matrimonyProfiles, sendInterest, toggleShortlistMatrimony, startNewChatWith, showToast } = useSuperApp();
  
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male'>('All');
  const [professionSearch, setProfessionSearch] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<MatrimonyProfile | null>(null);

  const filteredProfiles = matrimonyProfiles.filter((m) => {
    const matchesGender = genderFilter === 'All' || m.gender === genderFilter;
    const matchesSearch = m.name.toLowerCase().includes(professionSearch.toLowerCase()) ||
                          m.profession.toLowerCase().includes(professionSearch.toLowerCase()) ||
                          m.city.toLowerCase().includes(professionSearch.toLowerCase()) ||
                          m.motherTongue.toLowerCase().includes(professionSearch.toLowerCase());
    return matchesGender && matchesSearch;
  });

  const handleStartIcebreaker = (profile: MatrimonyProfile) => {
    startNewChatWith(
      profile.name,
      profile.photos[0],
      `Matrimony Match (${profile.compatibilityScore}% Compatibility)`,
      `Namaste ${profile.name}! I came across your profile on OmniLife Matrimony and loved your bio. Would love to connect and chat!`
    );
    showToast(`Icebreaker chat started with ${profile.name}!`);
    setSelectedProfile(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Matrimony Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Matrimony & Matchmaking</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                100% Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">Discover compatible life partners with verified biodata & astrological harmony.</p>
          </div>
        </div>

        {/* Gender Filter Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/70 border border-slate-800">
          {(['All', 'Female', 'Male'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                genderFilter === g
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {g === 'All' ? 'All Matches' : g === 'Female' ? 'Brides (Female)' : 'Grooms (Male)'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar & Quick Filters */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={professionSearch}
            onChange={(e) => setProfessionSearch(e.target.value)}
            placeholder="Search by profession, city, language (e.g. AI, Stanford, Seattle)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 shadow-xl overflow-hidden group transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & Match Badge */}
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <img
                  src={p.photos[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {p.compatibilityScore && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-rose-600/90 backdrop-blur-md text-xs font-black text-white shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span>{p.compatibilityScore}% Match</span>
                  </div>
                )}

                <button
                  onClick={() => toggleShortlistMatrimony(p.id)}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                    p.isShortlisted
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 pt-10">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base text-white">{p.name}, {p.age}</h3>
                    {p.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                    )}
                  </div>
                  <p className="text-xs text-rose-200 font-semibold">{p.height} • {p.zodiac} ♌</p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-4 space-y-3">
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-200 truncate">{p.profession}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-400 truncate">{p.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-400">{p.city}, {p.state}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 italic">
                  "{p.about}"
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {p.motherTongue}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {p.religion} - {p.community}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 pt-0 flex items-center gap-2">
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
            </div>

          </div>
        ))}
      </div>

      {/* Detailed Biodata Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90dvh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6 my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-extrabold text-base text-white">Full Profile & Biodata</h3>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="space-y-3">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={selectedProfile.photos[0]}
                    alt={selectedProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-center">
                  <p className="text-lg font-black text-rose-400">{selectedProfile.compatibilityScore}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Compatibility Score</p>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">{selectedProfile.name}, {selectedProfile.age}</h2>
                  <p className="text-xs text-rose-300 font-semibold">{selectedProfile.profession} • {selectedProfile.annualIncome}</p>
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
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Community</span>
                    <span className="font-semibold text-slate-200">{selectedProfile.religion} ({selectedProfile.community})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Zodiac Sign</span>
                    <span className="font-semibold text-slate-200">{selectedProfile.zodiac}</span>
                  </div>
                </div>

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

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleStartIcebreaker(selectedProfile)}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Start Icebreaker Chat</span>
                  </button>

                  <button
                    onClick={() => {
                      sendInterest(selectedProfile.id);
                      setSelectedProfile(null);
                    }}
                    disabled={selectedProfile.interestSent}
                    className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    {selectedProfile.interestSent ? 'Interest Sent' : 'Send Interest'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
