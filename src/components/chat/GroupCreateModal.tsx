import React, { useState } from 'react';
import { Users, X, Check, Sparkles, Plus } from 'lucide-react';

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

const AVAILABLE_MEMBERS: Array<{ id: string; name: string; role: string; avatar: string }> = [];

const GROUP_ICONS = ['👥', '🚀', '🌟', '💻', '🎨', '🏡', '📚', '⚡'];

export const GroupCreateModal: React.FC<GroupCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup
}) => {
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(GROUP_ICONS[0]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

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
    if (!groupName.trim() || selectedMemberIds.length === 0) return;

    onCreateGroup({
      name: groupName.trim(),
      description: groupDesc.trim() || 'Aditi Community Group Chat',
      members: selectedMemberIds,
      avatar: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='30' fill='%236366f1'/><text x='50%' y='65%' font-size='50' text-anchor='middle' fill='white'>${selectedIcon}</text></svg>`
    });
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
              placeholder="e.g. Kerala Tech Innovators"
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
              placeholder="Topic, rules, or purpose..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Select Members */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Select Initial Members ({selectedMemberIds.length})</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {AVAILABLE_MEMBERS.map((mem) => {
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
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mem.avatar}
                        alt={mem.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-bold text-xs block">{mem.name}</span>
                        <span className="text-[10px] text-slate-400">{mem.role}</span>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-purple-600 border-purple-400 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
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
