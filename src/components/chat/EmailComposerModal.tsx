import React, { useState } from 'react';
import { Mail, X, Send, Paperclip, Sparkles, CheckCheck } from 'lucide-react';

interface EmailComposerModalProps {
  isOpen: boolean;
  initialRecipientEmail?: string;
  initialSubject?: string;
  initialBody?: string;
  onClose: () => void;
  onSendEmail: (emailData: {
    to: string;
    cc?: string;
    subject: string;
    body: string;
    attachmentName?: string;
  }) => void;
}

export const EmailComposerModal: React.FC<EmailComposerModalProps> = ({
  isOpen,
  initialRecipientEmail = '',
  initialSubject = '',
  initialBody = '',
  onClose,
  onSendEmail
}) => {
  const [toEmail, setToEmail] = useState(initialRecipientEmail || 'partner@malabarbazaar.shop');
  const [ccEmail, setCcEmail] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(initialSubject || 'Aditi Super App Communication');
  const [body, setBody] = useState(initialBody || '');
  const [attachment, setAttachment] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail || !subject || !body) return;

    onSendEmail({
      to: toEmail,
      cc: ccEmail,
      subject,
      body,
      attachmentName: attachment ? attachment.name : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl p-5 sm:p-6 space-y-4 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>Direct SMTP Email</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SMTP Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Send chat or custom message directly as email</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Recipient To */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">To Email Address</label>
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  + Add CC
                </button>
              )}
            </div>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="recipient@domain.com"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="space-y-1">
              <label className="font-bold text-slate-300">CC Email (Optional)</label>
              <input
                type="email"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                placeholder="cc@domain.com"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Subject */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Email Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Conversation summary / inquiry"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Body */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Message Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Write your email content..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
              required
            />
          </div>

          {/* File Attachment */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300 truncate max-w-[200px]">
                {attachment ? attachment.name : 'No attachment selected'}
              </span>
            </div>
            <label className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold cursor-pointer transition-colors">
              <span>Browse</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send Outbound Email</span>
          </button>

        </form>

      </div>
    </div>
  );
};
