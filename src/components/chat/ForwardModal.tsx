import React, { useState } from 'react';
import { X, Search, Forward, Check, CheckCircle, Users } from 'lucide-react';
import { ChatConversation, ChatMessage } from '../../types/superApp';

interface ForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  chats: ChatConversation[];
  onForwardMessage: (targetChatIds: string[], message: ChatMessage) => void;
}

export const ForwardModal: React.FC<ForwardModalProps> = ({
  isOpen,
  onClose,
  message,
  chats,
  onForwardMessage
}) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen || !message) return null;

  const filtered = chats.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.roleOrContext.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleForward = () => {
    if (selectedIds.length === 0) return;
    onForwardMessage(selectedIds, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <Forward className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-white">Forward Message</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview */}
        <div className="p-3.5 bg-slate-950/80 border-b border-slate-800/80">
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300">
            <span className="font-bold text-indigo-300 block mb-0.5">
              From {message.senderName}:
            </span>
            <p className="truncate line-clamp-2">{message.text}</p>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts, channels, groups..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/30">
          {filtered.map((c) => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleSelect(c.id)}
                className={`w-full p-2.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all ${
                  isSelected ? 'bg-indigo-600/20 border border-indigo-500/40' : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={c.participantAvatar}
                    alt={c.participantName}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-800"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{c.participantName}</h4>
                    <p className="text-[11px] text-indigo-400 font-medium truncate">{c.roleOrContext}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'border-slate-700 bg-slate-950 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold">
            {selectedIds.length} contact{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <button
            type="button"
            onClick={handleForward}
            disabled={selectedIds.length === 0}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-40"
          >
            Forward ({selectedIds.length})
          </button>
        </div>

      </div>
    </div>
  );
};
