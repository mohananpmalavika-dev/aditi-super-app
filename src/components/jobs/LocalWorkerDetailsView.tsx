import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Star, 
  MapPin, 
  DollarSign, 
  Phone, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Send 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { LocalWorkerProfile } from '../../types/superApp';
import { getSafeAvatarUrl } from '../../utils/avatarUtils';

interface LocalWorkerDetailsViewProps {
  worker: LocalWorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (worker: LocalWorkerProfile) => void;
}

export const LocalWorkerDetailsView: React.FC<LocalWorkerDetailsViewProps> = ({ 
  worker, 
  isOpen, 
  onClose, 
  onBook 
}) => {
  const { 
    user, 
    toggleSaveLocalWorker, 
    startNewChatWith, 
    setActiveMiniApp, 
    workerReviews, 
    addWorkerReview,
    showToast 
  } = useSuperApp();

  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);

  if (!isOpen || !worker) return null;

  const reviewsForWorker = workerReviews.filter(r => r.workerId === worker.id);

  const handleStartChat = () => {
    startNewChatWith(
      worker.name,
      worker.avatar,
      `Service Pro • ${worker.trade}`,
      `Hello ${worker.name}, I need your ${worker.trade} services in ${worker.city}. When are you available to inspect?`
    );
    setActiveMiniApp('chat');
    showToast(`Opening chat with ${worker.name}...`);
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${worker.name} (${worker.trade})`,
        text: `Book verified ${worker.trade} ${worker.name} on Aditi Super App: ${worker.dailyRateOrCharge}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast('📋 Service profile link copied!');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    await addWorkerReview({
      workerId: worker.id,
      reviewerId: user.id,
      reviewerName: user.name || 'Aditi User',
      reviewerAvatar: getSafeAvatarUrl(user.avatar, user.name),
      rating: newRating,
      review: newReviewText.trim(),
      createdAt: 'Just now'
    });

    setNewReviewText('');
    setIsAddingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl glass-sheet border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-slate-900/70">
          <div className="flex items-center gap-3.5">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h2 className="text-base sm:text-xl font-black text-white">{worker.name}</h2>
                {worker.verifiedBadge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified Pro</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {worker.trade}
                </span>
                <div className="flex items-center gap-1 text-yellow-400 text-xs font-extrabold">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span>{worker.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-[10px]">({reviewsForWorker.length} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSaveLocalWorker(worker.id)}
              className={`p-2 rounded-2xl border transition-all ${
                worker.isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Save Worker"
            >
              <Bookmark className={`w-4 h-4 ${worker.isSaved ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Rate & Status Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">RATE / CHARGES</span>
              <span className="font-extrabold text-emerald-400 text-xs sm:text-sm">{worker.dailyRateOrCharge}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">EXPERIENCE</span>
              <span className="font-extrabold text-amber-300 text-xs sm:text-sm">{worker.experienceYears} Years</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">STATUS TODAY</span>
              <span className={`font-extrabold text-xs sm:text-sm ${worker.isAvailableToday ? 'text-emerald-400' : 'text-slate-400'}`}>
                {worker.isAvailableToday ? '🟢 Available Today' : '📅 Pre-booking'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">COMPLETED JOBS</span>
              <span className="font-extrabold text-purple-300 text-xs sm:text-sm">{worker.completedJobsCount}+ Jobs</span>
            </div>
          </div>

          {/* Service Areas */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Service Locations ({worker.city}):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {worker.serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-semibold border border-slate-700"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-white">About Experience & Guarantee</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {worker.bio}
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-white">Tasks & Services Handled</h3>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-amber-950/40 text-amber-200 font-semibold text-[11px] border border-amber-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews & Feedback Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Verified Customer Reviews ({reviewsForWorker.length})</span>
              </h3>
              <button
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold transition-colors"
              >
                {isAddingReview ? 'Cancel' : '+ Write Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {isAddingReview && (
              <form onSubmit={handleSubmitReview} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 text-yellow-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-yellow-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  rows={2}
                  placeholder="Share your experience regarding punctuality, quality of work, and pricing..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold shadow-md shadow-amber-500/20 text-xs flex items-center gap-1.5 ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Review</span>
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviewsForWorker.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-slate-400 text-xs">
                No customer reviews yet. Be the first to review after service!
              </div>
            ) : (
              <div className="space-y-2">
                {reviewsForWorker.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.reviewerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={rev.reviewerName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-white text-xs">{rev.reviewerName}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-yellow-400 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{rev.review}</p>
                    <span className="text-[10px] text-slate-500">{rev.createdAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${worker.phone}`}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
              title="Call Worker"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            {worker.whatsapp && (
              <a
                href={`https://wa.me/${worker.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(worker.name)},%20I%20saw%20your%20${encodeURIComponent(worker.trade)}%20profile%20on%20Aditi%20Super%20App.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs shadow-md shadow-green-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                title="WhatsApp Direct"
              >
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={handleStartChat}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
              title="AditiChat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
            >
              Close
            </button>
            <button
              onClick={() => { onClose(); onBook(worker); }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Wrench className="w-4 h-4" />
              <span>Book Service Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
