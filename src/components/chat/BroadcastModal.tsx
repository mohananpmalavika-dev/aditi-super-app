import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  CheckSquare, 
  Square, 
  X, 
  Users, 
  Sparkles, 
  Check, 
  Flame, 
  Search,
  MessageSquare
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { ChatConversation } from '../../types/superApp';
import confetti from 'canvas-confetti';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatConversation[];
  onSendBroadcast: (selectedChatIds: string[], messageText: string) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  chats,
  onSendBroadcast
}) => {
  const { showToast } = useSuperApp();

  // Filter out brain or self
  const directChats = chats.filter(
    (c) => c.id !== 'chat-brain' && c.conversationType !== 'channel'
  );

  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [broadcastText, setBroadcastText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = directChats.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected = filtered.length > 0 && filtered.every((c) => selectedChatIds.includes(c.id));

  const handleToggleSelect = (id: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedChatIds((prev) => prev.filter((id) => !filtered.some((c) => c.id === id)));
    } else {
      const allFilteredIds = filtered.map((c) => c.id);
      setSelectedChatIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChatIds.length === 0) {
      showToast('⚠️ Please select at least one recipient for broadcast.');
      return;
    }
    if (!broadcastText.trim()) {
      showToast('⚠️ Please write your broadcast message.');
      return;
    }

    onSendBroadcast(selectedChatIds, `📡 [Broadcast Announcement]\n${broadcastText.trim()}`);
    confetti({ particleCount: 70, spread: 80 });
    showToast(`📡 Broadcast dispatched to ${selectedChatIds.length} recipients!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl p-5 sm:p-6 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>New Broadcast Message</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  1-to-Many
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Send an instant announcement to multiple individual contacts at once</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="space-y-4 text-xs">
          
          {/* Recipient Selection Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Select Recipients ({selectedChatIds.length} selected)</span>
              </label>

              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Contacts Checkbox List */}
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-800/40">
              {filtered.map((chat) => {
                const isSelected = selectedChatIds.includes(chat.id);
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => handleToggleSelect(chat.id)}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between gap-3 transition-colors ${
                      isSelected ? 'bg-emerald-950/40 border border-emerald-500/30' : 'hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={chat.participantAvatar}
                        alt={chat.participantName}
                        className="w-7 h-7 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block text-xs truncate">
                          {chat.participantName}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {chat.roleOrContext}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-lg border border-slate-700 bg-slate-950" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Broadcast Message Body */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Broadcast Announcement Message</span>
            </label>
            <textarea
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Type announcement to be sent privately to all selected contacts..."
              rows={4}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Notice */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong>Privacy Note:</strong> Each contact will receive this broadcast as a direct, private 1-to-1 message from you. They will not see each other's details.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={selectedChatIds.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send Broadcast to {selectedChatIds.length} Recipients</span>
          </button>

        </form>

      </div>
    </div>
  );
};
