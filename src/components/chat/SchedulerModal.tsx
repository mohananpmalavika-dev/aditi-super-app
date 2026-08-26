import React, { useState } from 'react';
import { Calendar, Clock, X, Send, Bell } from 'lucide-react';

interface SchedulerModalProps {
  isOpen: boolean;
  contactName: string;
  onClose: () => void;
  onScheduleMessage: (text: string, date: string, time: string) => void;
}

export const SchedulerModal: React.FC<SchedulerModalProps> = ({
  isOpen,
  contactName,
  onClose,
  onScheduleMessage
}) => {
  const [scheduledText, setScheduledText] = useState('');
  const [scheduleDate, setScheduleDate] = useState('2026-08-28');
  const [scheduleTime, setScheduleTime] = useState('09:00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledText.trim()) return;
    onScheduleMessage(scheduledText.trim(), scheduleDate, scheduleTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Schedule Message</h3>
              <p className="text-[11px] text-slate-400">Deliver automatically to {contactName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Message Content</label>
            <textarea
              value={scheduledText}
              onChange={(e) => setScheduledText(e.target.value)}
              rows={3}
              placeholder="Type your scheduled message or reminder..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Delivery Date</span>
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Delivery Time</span>
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Confirm Scheduled Delivery</span>
          </button>

        </form>

      </div>
    </div>
  );
};
