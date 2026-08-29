import React from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Star, 
  DollarSign, 
  Power, 
  Plus 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ServiceBooking, ServiceBookingStatus } from '../../types/superApp';

interface WorkerDashboardViewProps {
  onRegisterWorker: () => void;
}

export const WorkerDashboardView: React.FC<WorkerDashboardViewProps> = ({ onRegisterWorker }) => {
  const { 
    user, 
    localWorkers, 
    updateLocalWorker, 
    serviceBookings, 
    updateServiceBookingStatus, 
    startNewChatWith, 
    setActiveMiniApp, 
    showToast 
  } = useSuperApp();

  const myWorkerProfile = localWorkers.find(w => w.postedByUserId === user.id);
  const myBookings = serviceBookings.filter(b => 
    (myWorkerProfile && b.workerId === myWorkerProfile.id) || b.workerName.includes(user.name) || myWorkerProfile === undefined
  );

  const handleToggleAvailability = async () => {
    if (!myWorkerProfile) return;
    const nextState = !myWorkerProfile.isAvailableToday;
    await updateLocalWorker(myWorkerProfile.id, { isAvailableToday: nextState });
    showToast(nextState ? '🟢 Marked Available for work today!' : '⚪ Marked Unavailable for today.');
  };

  const handleBookingStatusChange = async (bookingId: string, status: ServiceBookingStatus) => {
    await updateServiceBookingStatus(bookingId, status);
  };

  const handleChatCustomer = (b: ServiceBooking) => {
    startNewChatWith(
      b.customerName,
      b.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      `Customer • ${b.serviceType}`,
      `Hello ${b.customerName}, regarding your ${b.serviceType} service request for ${b.requestedDate}: I have accepted and will arrive at ${b.requestedTime}.`
    );
    setActiveMiniApp('chat');
    showToast(`Opening chat with ${b.customerName}...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Worker Profile Status */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/60 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Service Partner Hub
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            {myWorkerProfile ? `${myWorkerProfile.name} (${myWorkerProfile.trade})` : 'Trade Service Dashboard'}
          </h2>
          <p className="text-xs text-slate-300">
            {myWorkerProfile 
              ? `${myWorkerProfile.dailyRateOrCharge} • Rating: ★ ${myWorkerProfile.rating.toFixed(1)} (${myWorkerProfile.reviewCount} reviews)`
              : 'Register as an Electrician, Plumber, Housemaid, Driver, or Carpenter to get service bookings.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          {myWorkerProfile && (
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md ${
                myWorkerProfile.isAvailableToday
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{myWorkerProfile.isAvailableToday ? 'Available Today (ON)' : 'Off-Duty (OFF)'}</span>
            </button>
          )}

          <button
            onClick={onRegisterWorker}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{myWorkerProfile ? 'Edit Listing' : '+ Register as Trade Pro'}</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-amber-400">{myBookings.length}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Total Bookings</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-cyan-400">
            {myBookings.filter(b => b.status === 'Requested' || b.status === 'Scheduled').length}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Pending / Scheduled</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-emerald-400">
            {myBookings.filter(b => b.status === 'Completed').length}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Completed Jobs</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl font-black text-purple-400">
            ★ {myWorkerProfile ? myWorkerProfile.rating.toFixed(1) : '5.0'}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Customer Rating</div>
        </div>
      </div>

      {/* Bookings Queue */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Service Requests & Work Queue ({myBookings.length})</span>
        </h3>

        {myBookings.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            No service booking requests currently. Make sure your availability is turned ON.
          </div>
        ) : (
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      b.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      b.status === 'Scheduled' || b.status === 'On The Way' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      b.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      Status: {b.status}
                    </span>
                    <span className="text-[10px] text-slate-400">Date: {b.requestedDate} at {b.requestedTime}</span>
                  </div>

                  <h4 className="font-black text-white text-sm">{b.serviceType}</h4>
                  <p className="text-xs text-slate-300">{b.description}</p>
                  
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span className="font-bold text-white">Customer: {b.customerName}</span>
                    <span>•</span>
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{b.address} ({b.city})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center flex-shrink-0">
                  {b.status === 'Requested' && (
                    <button
                      onClick={() => handleBookingStatusChange(b.id, 'Scheduled')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      Accept Booking
                    </button>
                  )}

                  {b.status === 'Scheduled' && (
                    <button
                      onClick={() => handleBookingStatusChange(b.id, 'On The Way')}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 active:scale-95"
                    >
                      On The Way
                    </button>
                  )}

                  {b.status === 'On The Way' && (
                    <button
                      onClick={() => handleBookingStatusChange(b.id, 'Completed')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      Mark Completed
                    </button>
                  )}

                  <a
                    href={`tel:${b.customerPhone || '+919847012345'}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleChatCustomer(b)}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
