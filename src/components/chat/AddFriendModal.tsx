import React, { useState } from 'react';
import { 
  UserPlus, 
  Share2, 
  Search, 
  Copy, 
  Check, 
  QrCode, 
  Mail, 
  MessageSquare, 
  X, 
  Sparkles, 
  Smartphone, 
  ExternalLink,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
}

// Global Discoverable Directory
const DISCOVERABLE_USERS = [
  {
    id: 'usr-malavika',
    name: 'Malavika Mohanan',
    handle: '@malavika',
    role: 'Lead UI/UX Designer • Kerala',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    online: true
  },
  {
    id: 'usr-rajesh',
    name: 'Dr. Rajesh Nair',
    handle: '@rajesh_nair',
    role: 'AI Researcher & Consultant • Kochi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    online: true
  },
  {
    id: 'usr-sarah',
    name: 'Sarah Chen',
    handle: '@sarah_chen',
    role: 'Senior Python & React Mentor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    online: false
  },
  {
    id: 'usr-rahul',
    name: 'Rahul Varma',
    handle: '@rahul_varma',
    role: 'Real Estate Developer • Trivandrum',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    online: true
  },
  {
    id: 'usr-ananya',
    name: 'Ananya Menon',
    handle: '@ananya_m',
    role: 'Full Stack Engineer & Astrologer • Kollam',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    online: true
  },
  {
    id: 'usr-elena',
    name: 'Elena Rostova',
    handle: '@elena_r',
    role: 'Creative Media Director • London',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    online: false
  }
];

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
  onSelectChat
}) => {
  const { user, startNewChatWith, showToast } = useSuperApp();
  const [activeTab, setActiveTab] = useState<'search' | 'invite' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Custom Contact Form State
  const [customName, setCustomName] = useState('');
  const [customContactInfo, setCustomContactInfo] = useState('');
  const [customRole, setCustomRole] = useState('Friend / Associate');
  const [customMessage, setCustomMessage] = useState('Hey! Connected via AditiChat.');

  if (!isOpen) return null;

  // App Invite URL
  const appBaseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'https://malabarbazaar.shop';

  const userInviteUrl = `${appBaseUrl}?invite=${encodeURIComponent(user.handle || user.name.toLowerCase().replace(/\s+/g, ''))}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(userInviteUrl)}&color=99-102-241&bgcolor=3-7-18&margin=1`;

  // Search filter
  const filteredUsers = DISCOVERABLE_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add friend from directory
  const handleAddFromDirectory = (targetUser: typeof DISCOVERABLE_USERS[0]) => {
    const chatId = startNewChatWith(
      targetUser.name,
      targetUser.avatar,
      targetUser.role,
      `Hello ${targetUser.name}! Added you as a friend on AditiChat 👋`
    );
    confetti({ particleCount: 50, spread: 60 });
    showToast(`✨ ${targetUser.name} added to your friends list!`);
    onSelectChat(chatId);
    onClose();
  };

  // Add custom manual contact
  const handleAddCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const randomAvatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=300&auto=format&fit=crop&q=80`;
    const chatId = startNewChatWith(
      customName.trim(),
      randomAvatar,
      `${customRole} • ${customContactInfo || 'Aditi Contact'}`,
      customMessage
    );

    confetti({ particleCount: 60, spread: 70 });
    showToast(`🎉 Friend "${customName}" added successfully!`);
    onSelectChat(chatId);
    onClose();
  };

  // Copy Invite Link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(userInviteUrl);
      setCopiedLink(true);
      showToast(`📋 Invite Link copied: ${userInviteUrl}`);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      showToast(`Invite Link: ${userInviteUrl}`);
    }
  };

  // WhatsApp Invite
  const handleWhatsAppInvite = () => {
    const text = encodeURIComponent(
      `Hey! Connect with me on AditiChat (The Boundless Super App with WebRTC Video Calls, GPS Location, and AI Studio). Click here to add me: ${userInviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Native Device Share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Connect with ${user.name} on AditiChat`,
          text: `Join me on AditiChat: Real-time P2P chat, HD Dual Video Calls, and Live Location sharing!`,
          url: userInviteUrl
        });
        showToast('🚀 Invite shared successfully!');
      } catch {
        // Share cancelled
      }
    } else {
      handleWhatsAppInvite();
    }
  };

  // Email Invite
  const handleEmailInvite = () => {
    const subject = encodeURIComponent(`Invitation to connect on AditiChat from ${user.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nI'm using Aditi Super App for real-time messaging, WebRTC video calling, and collaborative AI. Join and connect with me directly using this link:\n\n${userInviteUrl}\n\nSee you on Aditi!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl p-5 sm:p-6 space-y-5 my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Add & Invite Friends</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Global Network
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Search registered users or send 1-click invitations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Directory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'invite'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Link & QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SEARCH & ADD FROM DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'search' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, handle, or location (e.g. malavika, kochi)..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-800/60">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="pt-2 pb-2 first:pt-0 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                        />
                        {u.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-white truncate">{u.name}</h4>
                          <span className="text-[10px] text-indigo-400 font-mono">{u.handle}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{u.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddFromDirectory(u)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add & Chat</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center space-y-2 text-slate-400 text-xs">
                  <p>No user found matching "{searchQuery}".</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('invite')}
                    className="text-indigo-400 hover:underline font-bold"
                  >
                    Send an Invite Link to this friend instead →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 1-CLICK INVITE FRIENDS (WHATSAPP, SMS, QR, EMAIL) */}
        {/* ========================================================================= */}
        {activeTab === 'invite' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            
            {/* Invite Link Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-bold text-slate-300 block">Your Personal Referral & Invite Link</label>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700">
                <span className="text-[11px] text-indigo-300 font-mono truncate flex-1 select-all">
                  {userInviteUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Share Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppInvite}
                className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105"
              >
                <span className="text-xl">💬</span>
                <span className="text-[11px]">WhatsApp</span>
              </button>

              {/* Mobile SMS / Native Share */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="p-3 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 font-bold flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105"
              >
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <span className="text-[11px]">SMS / Share</span>
              </button>

              {/* Email Invite */}
              <button
                type="button"
                onClick={handleEmailInvite}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105"
              >
                <Mail className="w-5 h-5 text-purple-400" />
                <span className="text-[11px]">Email Invite</span>
              </button>

              {/* QR Code Toggle */}
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 ${
                  showQrCode
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-[11px]">Scan QR</span>
              </button>
            </div>

            {/* Live QR Code Box */}
            {showQrCode && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/50 text-center space-y-3 animate-in zoom-in-95">
                <span className="font-bold text-xs text-white block">Point Phone Camera to Connect</span>
                <img
                  src={qrCodeImageUrl}
                  alt="Invite QR"
                  className="w-40 h-40 rounded-xl object-contain mx-auto border border-slate-800 shadow-xl"
                />
                <p className="text-[10px] text-slate-400">
                  Anyone scanning this QR code will be redirected straight to your conversation.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MANUAL CUSTOM CONTACT ENTRY */}
        {/* ========================================================================= */}
        {activeTab === 'custom' && (
          <form onSubmit={handleAddCustomContact} className="space-y-3.5 animate-in fade-in text-xs">
            
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Friend's Full Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Arun Kumar"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Phone or Email (Optional)</label>
                <input
                  type="text"
                  value={customContactInfo}
                  onChange={(e) => setCustomContactInfo(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Role / Relationship</label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Friend">Friend</option>
                  <option value="Family">Family</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Business Associate">Business Associate</option>
                  <option value="Tutor / Mentor">Tutor / Mentor</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Initial Greeting Message</label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Hey! Connected via AditiChat."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Friend & Open Chat</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
