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
  Video,
  UserCheck,
  UserPlus,
  UserMinus,
  ShieldCheck,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { ChatConversation } from '../../types/superApp';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

interface ChatDetailsDrawerProps {
  isOpen: boolean;
  chat: ChatConversation;
  onClose: () => void;
  onBlockUser: () => void;
  onReportUser: () => void;
  onOpenEmail: () => void;
  onStartCall: (video: boolean) => void;
  onToggleFriend?: () => void;
  onClearHistory?: () => void;
  onDeleteConversation?: () => void;
}

export const ChatDetailsDrawer: React.FC<ChatDetailsDrawerProps> = ({
  isOpen,
  chat,
  onClose,
  onBlockUser,
  onReportUser,
  onOpenEmail,
  onStartCall,
  onToggleFriend,
  onClearHistory,
  onDeleteConversation
}) => {
  if (!isOpen) return null;

  const isDirect = !chat.conversationType || chat.conversationType === 'direct';
  const isFriend = chat.isFriend ?? false;
  const isBlocked = chat.isBlocked ?? false;

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
                  src={getSafeAvatarUrl(chat.participantAvatar, chat.participantName)}
                  alt={chat.participantName}
                  onError={(e) => handleAvatarError(e, chat.participantName)}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-xl mx-auto"
                />
                {chat.isOnline && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">{chat.participantName}</h2>
                <p className="text-xs text-indigo-300 font-semibold">{chat.roleOrContext}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  {isDirect && (
                    isFriend ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <UserCheck className="w-3 h-3" />
                        <span>Friend (Unlimited Chat)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <UserPlus className="w-3 h-3" />
                        <span>Non-Friend (3 Daily Messages)</span>
                      </span>
                    )
                  )}

                  {isBlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <Ban className="w-3 h-3" />
                      <span>Blocked</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => onStartCall(false)}
                  disabled={isBlocked}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 disabled:opacity-40"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onStartCall(true)}
                  disabled={isBlocked}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md disabled:opacity-40"
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

            {/* Friend Management Section */}
            {isDirect && onToggleFriend && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Friend Status & Privileges
                </span>
                
                {isFriend ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400">
                      You are friends with {chat.participantName}. You have unlimited daily messaging.
                    </p>
                    <button
                      onClick={onToggleFriend}
                      className="w-full py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Unfriend {chat.participantName}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Add {chat.participantName} as friend to unlock unlimited messaging without the 3-message daily limit.
                    </p>
                    <button
                      onClick={onToggleFriend}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add as Friend (Unlimited)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

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

            {/* Chat History & Conversation Management */}
            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2.5">
              <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider block">
                Chat & History Management
              </span>

              {onClearHistory && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-amber-400" />
                  <span>Clear Chat Message History</span>
                </button>
              )}

              {onDeleteConversation && (
                <button
                  type="button"
                  onClick={onDeleteConversation}
                  className="w-full p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-left text-xs font-bold text-rose-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Delete Entire Conversation</span>
                </button>
              )}
            </div>

            {/* Security, Block & Unblock Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={onBlockUser}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                  isBlocked
                    ? 'text-emerald-400 hover:bg-emerald-950/30'
                    : 'text-amber-400 hover:bg-amber-950/30'
                }`}
              >
                {isBlocked ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Unblock {chat.participantName}</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 text-amber-400" />
                    <span>Block {chat.participantName}</span>
                  </>
                )}
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
