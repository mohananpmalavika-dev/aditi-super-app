import React, { useState, useMemo } from 'react';
import { Users, X, Check, Plus, UserPlus } from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: {
    name: string;
    description: string;
    members: string[];
    avatar: string;
  }) => void;
}

const GROUP_ICONS = ['👥', '🚀', '🌟', '💻', '🎨', '🏡', '📚', '⚡'];

export const GroupCreateModal: React.FC<GroupCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup
}) => {
  const { user, registeredUsers, chats } = useSuperApp();
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(GROUP_ICONS[0]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Dynamically compile available members from registered users and active contacts
  const availableMembers = useMemo(() => {
    const map = new Map<string, { id: string; name: string; role: string; avatar: string }>();

    // 1. From registered users
    registeredUsers.forEach((u) => {
      if (
        u &&
        u.name &&
        u.id !== user.id &&
        (u.email ? u.email.toLowerCase() !== user.email.toLowerCase() : true) &&
        u.name.toLowerCase() !== user.name.toLowerCase()
      ) {
        const key = u.id || u.email || u.name;
        map.set(key, {
          id: key,
          name: u.name,
          role: u.bio || u.location || 'Aditi Member',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
        });
      }
    });

    // 2. From existing chat contacts
    chats.forEach((c) => {
      if (
        c.conversationType !== 'channel' &&
        c.conversationType !== 'group' &&
        c.participantName &&
        c.participantName.toLowerCase() !== user.name.toLowerCase()
      ) {
        if (!map.has(c.id) && !map.has(c.participantName)) {
          map.set(c.id, {
            id: c.id,
            name: c.participantName,
            role: c.roleOrContext || 'Contact',
            avatar: c.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
          });
        }
      }
    });

    return Array.from(map.values());
  }, [registeredUsers, chats, user]);

  if (!isOpen) return null;

  const toggleMember = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((m) => m !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    onCreateGroup({
      name: groupName.trim(),
      description: groupDesc.trim() || 'Aditi Community Group Chat',
      members: selectedMemberIds,
      avatar: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='30' fill='%236366f1'/><text x='50%' y='65%' font-size='50' text-anchor='middle' fill='white'>${selectedIcon}</text></svg>`
    });
    setGroupName('');
    setGroupDesc('');
    setSelectedMemberIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl p-5 sm:p-6 space-y-4 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Create Group Chat</h3>
              <p className="text-[11px] text-slate-400">Multi-user conversation channel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Group Icon & Name */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Choose Group Icon</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {GROUP_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                    selectedIcon === icon
                      ? 'bg-purple-600 border-purple-400 scale-110 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Kerala Innovators Community"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Group Description</label>
            <input
              type="text"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              placeholder="Topic, purpose, or community guidelines..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Select Members */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">
                Select Members ({selectedMemberIds.length} of {availableMembers.length})
              </label>
              {availableMembers.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMemberIds.length === availableMembers.length) {
                      setSelectedMemberIds([]);
                    } else {
                      setSelectedMemberIds(availableMembers.map((m) => m.id));
                    }
                  }}
                  className="text-[10px] text-purple-400 hover:underline font-bold"
                >
                  {selectedMemberIds.length === availableMembers.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableMembers.length > 0 ? (
                availableMembers.map((mem) => {
                  const isSelected = selectedMemberIds.includes(mem.id);
                  return (
                    <button
                      key={mem.id}
                      type="button"
                      onClick={() => toggleMember(mem.id)}
                      className={`w-full p-2 rounded-xl text-left flex items-center justify-between border transition-colors ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/50 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={getSafeAvatarUrl(mem.avatar, mem.name)}
                          alt={mem.name}
                          onError={(e) => handleAvatarError(e, mem.name)}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs block text-white truncate">{mem.name}</span>
                          <span className="text-[10px] text-slate-400 truncate block">{mem.role}</span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 ml-2 ${
                        isSelected ? 'bg-purple-600 border-purple-400 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-400 space-y-1">
                  <p className="text-xs font-bold text-slate-300">No other users found yet</p>
                  <p className="text-[10px] text-slate-500">
                    You can create the group now and add friends later using the invite link.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Group Conversation</span>
          </button>

        </form>

      </div>
    </div>
  );
};
