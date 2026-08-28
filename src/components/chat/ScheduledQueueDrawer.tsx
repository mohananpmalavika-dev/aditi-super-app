import React from 'react';
import { X, Clock, Bell, Trash2, Send, Calendar, CheckCircle, Phone, Mic, Volume2 } from 'lucide-react';
import { ScheduledMessage, ChatReminder } from '../../types/superApp';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

interface ScheduledQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  scheduledMessages: ScheduledMessage[];
  chatReminders: ChatReminder[];
  onSendNow: (id: string) => void;
  onTriggerCallNow?: (sMsg: ScheduledMessage) => void;
  onCancelScheduled: (id: string) => void;
  onDismissReminder: (id: string) => void;
}

export const ScheduledQueueDrawer: React.FC<ScheduledQueueDrawerProps> = ({
  isOpen,
  onClose,
  chatId,
  scheduledMessages,
  chatReminders,
  onSendNow,
  onTriggerCallNow,
  onCancelScheduled,
  onDismissReminder
}) => {
  if (!isOpen) return null;

  const activeScheduled = scheduledMessages.filter((m) => !m.isSent);
  const activeReminders = chatReminders.filter((r) => !r.isTriggered);

  const totalCount = activeScheduled.length + activeReminders.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2 text-indigo-400">
              <Clock className="w-5 h-5" />
              <div>
                <h3 className="font-extrabold text-sm text-white">Scheduled Deliveries & Calls</h3>
                <p className="text-[10px] text-slate-400">{totalCount} active items in queue</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Queue Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            
            {/* Section 1: Pending Scheduled Messages & Voice Calls */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Clock className="w-3.5 h-3.5" />
                <span>Scheduled Messages & Voice Calls ({activeScheduled.length})</span>
              </div>

              {activeScheduled.length === 0 ? (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-center text-xs text-slate-500">
                  No pending scheduled deliveries or calls.
                </div>
              ) : (
                activeScheduled.map((sMsg) => (
                  <div
                    key={sMsg.id}
                    className={`p-3.5 rounded-2xl bg-slate-950 border space-y-2 transition-colors animate-in zoom-in-95 ${
                      sMsg.deliveryType === 'call'
                        ? 'border-emerald-500/40 hover:border-emerald-400'
                        : 'border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={getSafeAvatarUrl(sMsg.targetContactAvatar, sMsg.targetContactName)}
                          alt={sMsg.targetContactName}
                          onError={(e) => handleAvatarError(e, sMsg.targetContactName)}
                          className="w-6 h-6 rounded-lg object-cover"
                        />
                        <span className="text-xs font-bold text-white truncate">
                          To: {sMsg.targetContactName}
                        </span>
                      </div>
                      
                      {sMsg.deliveryType === 'call' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-extrabold flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>Voice Call</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-mono">
                          {sMsg.scheduledTimeStr}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed break-words flex items-center gap-1.5">
                      {sMsg.deliveryType === 'call' && <Mic className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      <span>{sMsg.text}</span>
                    </p>

                    {sMsg.deliveryType === 'call' && (
                      <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
                        <span>Delivery Time: {sMsg.scheduledTimeStr}</span>
                        <span className="text-emerald-400 font-mono">Audio: {sMsg.audioDuration || 10}s</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => onCancelScheduled(sMsg.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>

                      {sMsg.deliveryType === 'call' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onTriggerCallNow) {
                              onTriggerCallNow(sMsg);
                            } else {
                              onSendNow(sMsg.id);
                            }
                          }}
                          className="text-[11px] px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-1 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Now</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSendNow(sMsg.id)}
                          className="text-[11px] px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center gap-1 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Section 2: Active In-Chat Reminders */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400">
                <Bell className="w-3.5 h-3.5" />
                <span>Chat Reminders ({activeReminders.length})</span>
              </div>

              {activeReminders.length === 0 ? (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-center text-xs text-slate-500">
                  No active chat reminders.
                </div>
              ) : (
                activeReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-yellow-500/40 transition-colors animate-in zoom-in-95"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        Contact: {rem.contactName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-yellow-950/80 border border-yellow-500/30 text-yellow-300 font-mono">
                        {rem.remindAtStr}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed break-words">
                      "{rem.messageSnippet}"
                    </p>

                    {rem.note && (
                      <p className="text-[11px] text-yellow-300/80 italic px-1">
                        Note: {rem.note}
                      </p>
                    )}

                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => onDismissReminder(rem.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Dismiss Reminder</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
