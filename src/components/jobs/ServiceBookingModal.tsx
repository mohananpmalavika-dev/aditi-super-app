import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  FileText, 
  User, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { LocalWorkerProfile, ServiceBooking } from '../../types/superApp';
import { getSafeAvatarUrl } from '../../utils/avatarUtils';

interface ServiceBookingModalProps {
  worker: LocalWorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ worker, isOpen, onClose }) => {
  const { user, createServiceBooking, showToast } = useSuperApp();

  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '+91 98470 12345');
  const [serviceType, setServiceType] = useState(worker?.skills[0] || 'General Repair & Inspection');
  const [description, setDescription] = useState('');
  const [requestedDate, setRequestedDate] = useState('Today');
  const [requestedTime, setRequestedTime] = useState('11:00 AM - 01:00 PM');
  const [address, setAddress] = useState('Mavoor Road / Calicut Beach Area');
  const [city, setCity] = useState(worker?.city || 'Kozhikode');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !worker) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      showToast('⚠️ Please provide your name, phone number, and address.');
      return;
    }

    setLoading(true);
    try {
      const newBooking: Omit<ServiceBooking, 'id'> = {
        customerId: user.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAvatar: getSafeAvatarUrl(user.avatar, customerName),
        workerId: worker.id,
        workerName: worker.name,
        workerTrade: worker.trade,
        workerAvatar: worker.avatar,
        serviceType: serviceType.trim() || `${worker.trade} Visit`,
        description: description.trim() || `Inspection and service for ${worker.trade} requirements.`,
        requestedDate,
        requestedTime,
        address: address.trim(),
        city: city.trim(),
        estimatedPrice: worker.dailyRateOrCharge,
        status: 'Requested',
        createdAt: 'Just now'
      };

      await createServiceBooking(newBooking);
      onClose();
    } catch (err: any) {
      showToast(`⚠️ Booking request failed: ${err?.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg max-h-[92vh] rounded-3xl glass-sheet border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span>Book Trade Service</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {worker.trade}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">{worker.name} • {worker.dailyRateOrCharge}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
          
          {/* Worker Info Card */}
          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/40"
              />
              <div>
                <div className="font-extrabold text-white text-xs flex items-center gap-1">
                  <span>{worker.name}</span>
                  {worker.verifiedBadge && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-[11px] text-amber-300 font-semibold">{worker.trade} • {worker.experienceYears} Yrs Exp</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black text-emerald-400">{worker.dailyRateOrCharge}</div>
              <div className="text-[10px] text-slate-400">★ {worker.rating.toFixed(1)} ({worker.reviewCount})</div>
            </div>
          </div>

          {/* Service Task / Specific Issue */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Service Task / Issue</label>
            <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g. MCB Tripping / Tap Leakage / Deep House Cleaning"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Problem Details */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Problem Description & Specific Instructions</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe the issue, required spare parts, or special timings..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Preferred Date</span>
              </label>
              <select
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Today">⚡ Today (Urgent / Immediate)</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Weekend">This Weekend</option>
                <option value="Flexible Next Week">Flexible Next Week</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preferred Time Slot</span>
              </label>
              <select
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Morning (08:00 AM - 11:00 AM)">Morning (08:00 AM - 11:00 AM)</option>
                <option value="Mid-day (11:00 AM - 02:00 PM)">Mid-day (11:00 AM - 02:00 PM)</option>
                <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Your Name *</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phone Number *</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Service Address & Location */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Full Service Address / Landmark *</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No, Building, Street, Landmark"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Confirm Service Booking</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
