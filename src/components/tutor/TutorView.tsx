import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MessageSquare, 
  X 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { TutorCategory, TutorProfile } from '../../types/superApp';
import confetti from 'canvas-confetti';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

export const TutorView: React.FC = () => {
  const { tutors, bookings, bookTutorSession, startNewChatWith, showToast } = useSuperApp();
  
  const [selectedCategory, setSelectedCategory] = useState<TutorCategory | 'All'>('All');
  const [searchSubject, setSearchSubject] = useState('');
  
  // Booking modal state
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [bookingDate, setBookingDate] = useState('2026-08-29');
  const [bookingTime, setBookingTime] = useState('10:00 AM');

  const filteredTutors = tutors.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSubject = t.name.toLowerCase().includes(searchSubject.toLowerCase()) ||
                           t.subjects.some((s) => s.toLowerCase().includes(searchSubject.toLowerCase())) ||
                           t.bio.toLowerCase().includes(searchSubject.toLowerCase());
    return matchesCat && matchesSubject;
  });

  const handleOpenBooking = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
    setSelectedSubject(tutor.subjects[0]);
    setBookingTime(tutor.timeSlots[0] || '10:00 AM');
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor || !selectedSubject) return;
    const success = await bookTutorSession(selectedTutor.id, selectedSubject, bookingDate, bookingTime);
    if (success) {
      setSelectedTutor(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 font-sans">
      
      {/* Tutor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 flex-shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-extrabold text-white">Tutor & Skill Academy</h1>
              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                1-on-1 Mentorship
              </span>
            </div>
            <p className="text-xs text-slate-400">Book top certified mentors in AI, Coding, Mathematics, Languages & Music.</p>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs self-start sm:self-auto">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">My Scheduled Sessions</span>
            <span className="text-emerald-400 font-extrabold">{bookings.length} Active Booking{bookings.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Category Navigation & Search */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              placeholder="Search skill (e.g. Python, Calculus, French, Piano)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {(['All', 'Coding & Tech', 'Math & Science', 'Languages', 'Music & Arts', 'Business & Finance'] as Array<TutorCategory | 'All'>).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tutors Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredTutors.map((t) => (
          <div
            key={t.id}
            className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 shadow-xl group transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              
              {/* Tutor Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getSafeAvatarUrl(t.avatar, t.name)}
                    alt={t.name}
                    onError={(e) => handleAvatarError(e, t.name)}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors truncate">
                        {t.name}
                      </h3>
                      {t.verifiedBadge && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{t.education}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-400 mt-0.5 flex-wrap">
                      <span>⭐ {t.rating} ({t.reviewCount})</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{t.studentsTaught}+ taught</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-base sm:text-lg font-black text-emerald-400">${t.hourlyRate}</span>
                  <span className="text-[10px] text-slate-500 block">/ hour</span>
                </div>
              </div>

              {/* Bio & Subjects */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {t.bio}
              </p>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Specialized Subjects</span>
                <div className="flex flex-wrap gap-1.5">
                  {t.subjects.map((sub, i) => (
                    <span key={i} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Available: {t.availableDays.join(', ')}</span>
              </div>

            </div>

            {/* Action Bar */}
            <div className="pt-3.5 mt-3.5 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => handleOpenBooking(t)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Session</span>
              </button>

              <button
                onClick={() => {
                  startNewChatWith(
                    t.name,
                    t.avatar,
                    `Instructor - ${t.subjects[0]}`,
                    `Hi ${t.name}, I would love to learn more about your upcoming tutoring slots for ${t.subjects[0]}!`
                  );
                  showToast(`Opened chat with ${t.name}`);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition-colors"
                title="Direct Message"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Booking Schedule Modal / Bottom Sheet */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 pb-safe">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">Book Mentorship Session</h3>
              </div>
              <button
                onClick={() => setSelectedTutor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={getSafeAvatarUrl(selectedTutor.avatar, selectedTutor.name)}
                alt={selectedTutor.name}
                onError={(e) => handleAvatarError(e, selectedTutor.name)}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-white truncate">{selectedTutor.name}</h4>
                <p className="text-[11px] text-slate-400 truncate">{selectedTutor.education}</p>
                <p className="text-xs font-black text-emerald-400">${selectedTutor.hourlyRate} / hr</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Select Topic / Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {selectedTutor.subjects.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    {selectedTutor.timeSlots.map((slot, i) => (
                      <option key={i} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Session Rate Info */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Session Fee</span>
                  <span className="font-extrabold text-sm text-emerald-400">${selectedTutor.hourlyRate}.00 / hr</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Payment Method</span>
                  <span className="font-bold text-xs text-emerald-300">Direct Mentorship</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTutor(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/25"
                >
                  <span>Confirm Booking</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
