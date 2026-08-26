import React from 'react';
import { 
  X, 
  Image, 
  FileText, 
  MapPin, 
  Lock, 
  ShieldAlert, 
  Ban, 
  Bell, 
  Mail, 
  Phone, 
  Video 
} from 'lucide-react';
import { ChatConversation } from '../../types/superApp';

interface ChatDetailsDrawerProps {
  isOpen: boolean;
  chat: ChatConversation;
  onClose: () => void;
  onBlockUser: () => void;
  onReportUser: () => void;
  onOpenEmail: () => void;
  onStartCall: (video: boolean) => void;
}

export const ChatDetailsDrawer: React.FC<ChatDetailsDrawerProps> = ({
  isOpen,
  chat,
  onClose,
  onBlockUser,
  onReportUser,
  onOpenEmail,
  onStartCall
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <h3 className="font-extrabold text-sm text-white">Contact & Conversation Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* User Profile Card */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={chat.participantAvatar}
                  alt={chat.participantName}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-xl mx-auto"
                />
                {chat.isOnline && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">{chat.participantName}</h2>
                <p className="text-xs text-indigo-300 font-semibold">{chat.roleOrContext}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {chat.isOnline ? 'Online • WebRTC Ready' : 'Last seen today'}
                </p>
              </div>

              {/* Quick Actions Row */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => onStartCall(false)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onStartCall(true)}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenEmail}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400"
                  title="Send Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Shared Media & Files Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Shared Attachments & Media
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
                    alt="Shared Media"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80"
                    alt="Shared Media"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <FileText className="w-5 h-5 text-indigo-400 mb-1" />
                  <span>Docs (3)</span>
                </div>
              </div>
            </div>

            {/* Privacy & Disappearing Messages Info */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Lock className="w-4 h-4" />
                <span>End-to-End Encryption</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Messages and calls are secured with WebRTC direct peer-to-peer tunnels and server-enforced disappearing timers.
              </p>
            </div>

            {/* Security & Blocking Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={onBlockUser}
                className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <Ban className="w-4 h-4 text-amber-400" />
                <span>Block {chat.participantName}</span>
              </button>

              <button
                onClick={onReportUser}
                className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Report Contact</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
