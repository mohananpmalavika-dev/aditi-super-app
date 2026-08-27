import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Send, Bell, Sparkles, Check, Bookmark } from 'lucide-react';

interface SchedulerModalProps {
  isOpen: boolean;
  contactName: string;
  chatId: string;
  initialText?: string;
  initialMode?: 'schedule' | 'reminder';
  onClose: () => void;
  onScheduleMessage: (text: string, deliverAtMs: number, deliverAtStr: string) => void;
  onSetReminder: (messageSnippet: string, remindAtMs: number, remindAtStr: string, note?: string) => void;
}

export const SchedulerModal: React.FC<SchedulerModalProps> = ({
  isOpen,
  contactName,
  chatId,
  initialText = '',
  initialMode = 'schedule',
  onClose,
  onScheduleMessage,
  onSetReminder
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'reminder'>(initialMode);
  const [messageText, setMessageText] = useState(initialText);
  const [reminderNote, setReminderNote] = useState('');
  
  // Format default date & time to 1 hour from now
  const getDefaultDateTime = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return { dateStr, timeStr };
  };

  const defaults = getDefaultDateTime();
  const [scheduleDate, setScheduleDate] = useState(defaults.dateStr);
  const [scheduleTime, setScheduleTime] = useState(defaults.timeStr);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setMessageText(initialText);
      const def = getDefaultDateTime();
      setScheduleDate(def.dateStr);
      setScheduleTime(def.timeStr);
    }
  }, [isOpen, initialText, initialMode]);

  if (!isOpen) return null;

  const applyPreset = (minutesFromNow: number) => {
    const target = new Date(Date.now() + minutesFromNow * 60 * 1000);
    const dateStr = target.toISOString().split('T')[0];
    const timeStr = `${target.getHours().toString().padStart(2, '0')}:${target.getMinutes().toString().padStart(2, '0')}`;
    setScheduleDate(dateStr);
    setScheduleTime(timeStr);
  };

  const applyTomorrowMorning = () => {
    const target = new Date();
    target.setDate(target.getDate() + 1);
    target.setHours(9, 0, 0, 0);
    const dateStr = target.toISOString().split('T')[0];
    setScheduleDate(dateStr);
    setScheduleTime('09:00');
  };

  const applyTonight = () => {
    const target = new Date();
    target.setHours(20, 0, 0, 0);
    const dateStr = target.toISOString().split('T')[0];
    setScheduleDate(dateStr);
    setScheduleTime('20:00');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const [year, month, day] = scheduleDate.split('-').map(Number);
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const targetDate = new Date(year, month - 1, day, hours, minutes);
    const deliverAtMs = targetDate.getTime();
    
    const formattedStr = `${targetDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (activeTab === 'schedule') {
      onScheduleMessage(messageText.trim(), deliverAtMs, formattedStr);
    } else {
      onSetReminder(messageText.trim(), deliverAtMs, formattedStr, reminderNote.trim() || undefined);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              activeTab === 'schedule'
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              {activeTab === 'schedule' ? <Clock className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {activeTab === 'schedule' ? 'Schedule Message (Send Later)' : 'Set Chat Reminder'}
              </h3>
              <p className="text-[11px] text-slate-400">Target Contact: {contactName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Schedule Message</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reminder')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reminder'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Set Reminder</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Message / Snippet Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {activeTab === 'schedule' ? 'Message to Send Automatically' : 'Message Snippet to Remind About'}
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={3}
              placeholder={activeTab === 'schedule' ? 'Type message to send later...' : 'What do you want to be reminded about?'}
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Optional Note for Reminder */}
          {activeTab === 'reminder' && (
            <div className="space-y-1.5 animate-in fade-in">
              <label className="text-xs font-bold text-slate-300">Optional Reminder Note</label>
              <input
                type="text"
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                placeholder="e.g. Call back regarding quote, Follow-up..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
          )}

          {/* Quick Timing Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">Quick Presets</label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset(15)}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] border border-slate-700/60"
              >
                In 15m
              </button>
              <button
                type="button"
                onClick={() => applyPreset(60)}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] border border-slate-700/60"
              >
                In 1h
              </button>
              <button
                type="button"
                onClick={() => applyTonight()}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] border border-slate-700/60"
              >
                Tonight 8PM
              </button>
              <button
                type="button"
                onClick={() => applyTomorrowMorning()}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] border border-slate-700/60"
              >
                Tomorrow 9AM
              </button>
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-2xl text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 shadow-indigo-600/30'
                : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 shadow-amber-600/30'
            }`}
          >
            {activeTab === 'schedule' ? (
              <>
                <Send className="w-4 h-4" />
                <span>Schedule Message for Delivery</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Set Chat Reminder Alert</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
