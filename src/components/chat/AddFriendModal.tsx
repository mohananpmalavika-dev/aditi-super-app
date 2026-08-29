import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Share2, 
  Search, 
  Copy, 
  Check, 
  QrCode, 
  Mail, 
  X, 
  Smartphone, 
  Plus,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  MapPin,
  Sparkles,
  Users
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { getCloudRegisteredUsers, saveCustomContact } from '../../services/cloudDatabaseService';
import { UserProfile } from '../../types/superApp';
import confetti from 'canvas-confetti';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
  onSelectChat
}) => {
  const { user, chats, registeredUsers, refreshRegisteredUsers, startNewChatWith, showToast } = useSuperApp();
  
  // Default to 'search' (Discover Directory) so users can immediately see and add everyone
  const [activeTab, setActiveTab] = useState<'search' | 'friends' | 'invite' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);

  // Custom Contact Form State
  const [customName, setCustomName] = useState('');
  const [customContactInfo, setCustomContactInfo] = useState('');
  const [customRole, setCustomRole] = useState('Friend');
  const [customMessage, setCustomMessage] = useState('Hey! Connected via AditiChat.');

  // Fetch available users on modal open & merge all directory sources
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersList = await getCloudRegisteredUsers();
      const usersMap = new Map<string, UserProfile>();

      // 1. Add cloud & local registered users
      usersList.forEach((u) => {
        if (u && (u.id || u.email || u.name)) {
          const key = (u.email || u.id || u.name).toLowerCase();
          usersMap.set(key, u);
        }
      });

      // 2. Merge registeredUsers from context
      registeredUsers.forEach((u) => {
        if (u && (u.id || u.email || u.name)) {
          const key = (u.email || u.id || u.name).toLowerCase();
          if (!usersMap.has(key)) {
            usersMap.set(key, u);
          }
        }
      });

      // 3. Merge all chat contacts & direct participants
      chats.forEach((c) => {
        const isDirect = !c.conversationType || c.conversationType === 'direct';
        if (isDirect && c.participantName) {
          const key = c.participantName.toLowerCase();
          if (!usersMap.has(key)) {
            usersMap.set(key, {
              id: c.id,
              name: c.participantName,
              email: '',
              handle: `@${c.participantName.toLowerCase().replace(/\s+/g, '')}`,
              avatar: c.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
              bio: c.roleOrContext || 'Aditi Member',
              location: 'Kerala, India',
              zodiacSign: 'Leo',
              isVerified: true
            });
          }
        }
      });

      setAvailableUsers(Array.from(usersMap.values()));
    } catch (err) {
      console.warn('Could not fetch discoverable users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchUsers();
  }, [isOpen, registeredUsers, chats]);

  if (!isOpen) return null;

  // App Invite URL
  const appBaseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'https://malabarbazaar.shop';

  const userInviteUrl = `${appBaseUrl}?invite=${encodeURIComponent(user.handle || user.name.toLowerCase().replace(/\s+/g, ''))}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(userInviteUrl)}&color=99-102-241&bgcolor=3-7-18&margin=1`;

  // Filter out ONLY the actual current user (safe ID/Email matching that does not block shared generic names)
  const otherUsers = availableUsers.filter((u) => {
    if (!u) return false;
    const isSelfId = Boolean(u.id && user.id && u.id === user.id && u.id !== 'usr-guest');
    const isSelfEmail = Boolean(u.email && user.email && u.email.trim().toLowerCase() === user.email.trim().toLowerCase());
    return !isSelfId && !isSelfEmail;
  });

  // Check if a user is already in chats / friends
  const getExistingChat = (targetUser: UserProfile) => {
    return chats.find(
      (c) =>
        c.participantName.toLowerCase() === targetUser.name.toLowerCase() ||
        (targetUser.id && c.id === targetUser.id)
    );
  };

  // Group into Added Friends
  const myAddedFriends = otherUsers.filter((u) => {
    const existing = getExistingChat(u);
    return Boolean(existing && (existing.isFriend !== false));
  });

  // Dynamic Search filter across name, handle, email, location, bio
  const query = searchQuery.trim().toLowerCase();
  const filteredUsers = otherUsers.filter((u) => {
    if (!query) return true;
    const matchName = u.name?.toLowerCase().includes(query);
    const matchHandle = u.handle?.toLowerCase().includes(query);
    const matchEmail = u.email?.toLowerCase().includes(query);
    const matchLocation = u.location?.toLowerCase().includes(query);
    const matchBio = u.bio?.toLowerCase().includes(query);
    return matchName || matchHandle || matchEmail || matchLocation || matchBio;
  });

  const filteredFriends = myAddedFriends.filter((u) => {
    if (!query) return true;
    const matchName = u.name?.toLowerCase().includes(query);
    const matchHandle = u.handle?.toLowerCase().includes(query);
    return matchName || matchHandle;
  });

  // Add friend from directory
  const handleAddFromDirectory = (targetUser: UserProfile) => {
    const existing = getExistingChat(targetUser);
    const chatId = startNewChatWith(
      targetUser.name,
      targetUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      targetUser.bio || targetUser.location || 'Aditi Friend',
      existing ? undefined : `Hello ${targetUser.name}! Added you as a friend on AditiChat 👋`
    );

    // Save to permanent custom contacts directory
    saveCustomContact({
      id: targetUser.id || chatId,
      name: targetUser.name,
      email: targetUser.email || '',
      handle: targetUser.handle || `@${targetUser.name.toLowerCase().replace(/\s+/g, '')}`,
      avatar: targetUser.avatar,
      bio: targetUser.bio || 'Aditi Friend',
      location: targetUser.location || 'Kerala, India',
      zodiacSign: targetUser.zodiacSign || 'Leo',
      isVerified: true
    });

    refreshRegisteredUsers();
    confetti({ particleCount: 60, spread: 60 });
    showToast(`✨ ${targetUser.name} added to your friends list!`);
    onSelectChat(chatId);
    onClose();
  };

  // Add custom manual contact
  const handleAddCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const randomAvatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=300&auto=format&fit=crop&q=80`;
    const newContact: UserProfile = {
      id: `usr-custom-${Date.now()}`,
      name: customName.trim(),
      email: customContactInfo.includes('@') ? customContactInfo.trim() : '',
      handle: `@${customName.trim().toLowerCase().replace(/\s+/g, '')}`,
      avatar: randomAvatar,
      bio: `${customRole} • ${customContactInfo || 'Aditi Contact'}`,
      location: 'Custom Contact',
      zodiacSign: 'Leo',
      isVerified: true
    };

    saveCustomContact(newContact);
    refreshRegisteredUsers();

    const chatId = startNewChatWith(
      newContact.name,
      newContact.avatar,
      newContact.bio || 'Aditi Contact',
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
        
        {/* Top Header with Manual Refresh Sync Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Add & Discover Friends
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Global Directory
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Discover all registered users or send direct invitations</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                fetchUsers();
                refreshRegisteredUsers();
                showToast('🔄 Directory synced with latest database users!');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
              title="Sync Directory"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Discover Users ({otherUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('friends')}
            className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'friends'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Friends ({myAddedFriends.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'invite'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite & QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
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
        {/* TAB 1: DISCOVER ALL REGISTERED USERS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'search' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, handle, email, or city..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {loadingUsers ? (
                <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />
              ) : (
                searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                  >
                    Clear
                  </button>
                )
              )}
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-800/60">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const existingChat = getExistingChat(u);
                  const isFriend = Boolean(existingChat && existingChat.isFriend !== false);

                  return (
                    <div
                      key={u.id || u.email || u.name}
                      className="pt-2.5 pb-2.5 first:pt-0 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                            alt={u.name}
                            className={`w-10 h-10 rounded-2xl object-cover ring-2 ${
                              isFriend ? 'ring-emerald-500/40' : 'ring-indigo-500/30'
                            }`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-xs text-white truncate">{u.name}</h4>
                            {u.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            )}
                            {isFriend && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                <span>Friend</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                            {u.handle && (
                              <span className="text-indigo-400/80 font-mono">{u.handle}</span>
                            )}
                            {u.location && (
                              <span className="flex items-center gap-0.5 text-slate-400 truncate">
                                <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                <span className="truncate">{u.location}</span>
                              </span>
                            )}
                            {u.bio && !u.location && (
                              <span className="truncate">{u.bio}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isFriend && existingChat) {
                            onSelectChat(existingChat.id);
                            onClose();
                          } else {
                            handleAddFromDirectory(u);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all flex-shrink-0 ${
                          isFriend
                            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isFriend ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Friend</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center space-y-3 text-slate-400 text-xs">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-300">
                      {searchQuery ? `No user found matching "${searchQuery}"` : 'No other users found in the directory yet'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      You can send an instant invite link or manually add your friend's contact.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('invite')}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
                    >
                      Send Invite Link →
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('custom')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
                    >
                      Manual Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY ADDED FRIENDS (എന്റെ സുഹൃത്തുക്കൾ) */}
        {/* ========================================================================= */}
        {activeTab === 'friends' && (
          <div className="space-y-3.5 animate-in fade-in">
            {myAddedFriends.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search among your friends..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-800/60">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((u) => {
                  const existingChat = getExistingChat(u);
                  return (
                    <div
                      key={u.id || u.email || u.name}
                      className="pt-2.5 pb-2.5 first:pt-0 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                            alt={u.name}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-xs text-white truncate">{u.name}</h4>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" />
                              <span>Added Friend</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {existingChat?.lastMessage || u.bio || u.location || 'Connected on AditiChat'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (existingChat) {
                            onSelectChat(existingChat.id);
                            onClose();
                          } else {
                            handleAddFromDirectory(u);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Open Chat</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center space-y-3 text-slate-400 text-xs">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-300">
                      {searchQuery ? `No friend found matching "${searchQuery}"` : 'No friends added yet'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Discover other registered members in the directory or send an instant invite link!
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('search')}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
                    >
                      Discover Users ({otherUsers.length}) →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 1-CLICK INVITE FRIENDS (WHATSAPP, SMS, QR, EMAIL) */}
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
        {/* TAB 4: MANUAL CUSTOM CONTACT ENTRY */}
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
