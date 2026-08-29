import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Send } from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobReport } from '../../types/superApp';

interface JobReportModalProps {
  target: {
    type: 'job' | 'worker' | 'candidate';
    id: string;
    title: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobReportModal: React.FC<JobReportModalProps> = ({ target, isOpen, onClose }) => {
  const { user, reportListing, showToast } = useSuperApp();
  const [reason, setReason] = useState<JobReport['reason']>('Fake Job / Scam');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportListing({
        targetType: target.type,
        targetId: target.id,
        targetTitle: target.title,
        reporterId: user.id,
        reason,
        details: details.trim(),
        status: 'Pending',
        createdAt: 'Just now'
      });
      onClose();
    } catch (err: any) {
      showToast(`⚠️ Report submission failed: ${err?.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl glass-sheet border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">Report Listing</h2>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{target.title}</p>
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
          
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="Fake Job / Scam">🚨 Fake Job / Scam / Asking Money</option>
              <option value="Wrong Information">Wrong / Misleading Information</option>
              <option value="Abusive Content">Abusive or Inappropriate Content</option>
              <option value="Illegal Service">Unregistered / Illegal Service</option>
              <option value="Spam">Spam / Duplicate Posting</option>
              <option value="Impersonation">Impersonation / Fake Identity</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Additional Details (Optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Please provide any context or proof to help our moderation team..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-lg shadow-rose-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
