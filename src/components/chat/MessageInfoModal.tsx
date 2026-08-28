import React from 'react';
import { X, CheckCheck, Clock, Check, Eye, User, FileText } from 'lucide-react';
import { ChatMessage } from '../../types/superApp';

interface MessageInfoModalProps {
  isOpen: boolean;
  message: ChatMessage | null;
  onClose: () => void;
}

export const MessageInfoModal: React.FC<MessageInfoModalProps> = ({
  isOpen,
  message,
  onClose
}) => {
  if (!isOpen || !message) return null;

  const receipts = message.deliveryReceipts || [
    {
      userId: message.senderId,
      userName: message.senderName,
      deliveredAt: message.timestamp,
      readAt: message.timestamp
    }
  ];

  const getStatusDisplay = () => {
    switch (message.status) {
      case 'read':
        return {
          label: 'Read by recipient (വായിച്ചു)',
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/20 border-cyan-500/30',
          icon: <CheckCheck className="w-4 h-4 text-cyan-400" />
        };
      case 'delivered':
        return {
          label: 'Delivered to device (എത്തിച്ചേർന്നു)',
          color: 'text-slate-300',
          bg: 'bg-slate-800 border-slate-700',
          icon: <CheckCheck className="w-4 h-4 text-slate-300" />
        };
      case 'sent':
        return {
          label: 'Sent to server (സെർവറിൽ അയച്ചു)',
          color: 'text-slate-400',
          bg: 'bg-slate-800 border-slate-700',
          icon: <Check className="w-4 h-4 text-slate-400" />
        };
      case 'sending':
      case 'queued':
        return {
          label: 'Sending in queue (അയച്ചുകൊണ്ടിരിക്കുന്നു...)',
          color: 'text-amber-400',
          bg: 'bg-amber-500/20 border-amber-500/30',
          icon: <Clock className="w-4 h-4 text-amber-400 animate-spin" />
        };
      default:
        return {
          label: 'Sent & Delivered',
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/20 border-cyan-500/30',
          icon: <CheckCheck className="w-4 h-4 text-cyan-400" />
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Message Info (വിവരങ്ങൾ)</h3>
              <p className="text-[10px] text-slate-400">Delivery & Read Receipts breakdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Snippet Card */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Content</span>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
            {message.mediaUrl && (
              <div className="mb-2 rounded-xl overflow-hidden max-h-36 bg-slate-950">
                <img src={message.mediaUrl} alt="Media" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="font-medium leading-relaxed">{message.text || `[${message.mediaType?.toUpperCase()}]`}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-800/60">
              <span>Sent by {message.senderName}</span>
              <span>{message.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className={`p-3 rounded-2xl border flex items-center justify-between ${statusInfo.bg}`}>
            <div className="flex items-center gap-2">
              {statusInfo.icon}
              <span className={`font-extrabold text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            <span className="text-[10px] text-slate-400">{message.timestamp}</span>
          </div>

          {/* Delivery & Read Receipts List */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Read By ({receipts.length})</span>
            </h4>

            <div className="space-y-2">
              {receipts.map((receipt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {receipt.userName[0]}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">{receipt.userName}</h5>
                      <span className="text-[10px] text-cyan-400">✓✓ Read</span>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400 space-y-0.5">
                    <p className="font-mono text-slate-200">Read: {receipt.readAt || message.timestamp}</p>
                    <p className="text-slate-500">Delivered: {receipt.deliveredAt || message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Meta Details */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Client Message ID:</span>
              <span className="font-mono text-slate-300 text-[10px]">{message.clientMessageId || message.id}</span>
            </div>
            {message.editedAt && (
              <div className="flex justify-between text-amber-300">
                <span>Edited:</span>
                <span>{message.editedAt} ({message.editCount} edits)</span>
              </div>
            )}
            {message.isDisappearing && (
              <div className="flex justify-between text-rose-300">
                <span>Disappearing Expiration:</span>
                <span>{message.expiresDuration}s timer</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
