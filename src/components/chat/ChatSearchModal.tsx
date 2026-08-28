import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Image as ImageIcon, 
  FileText, 
  Link as LinkIcon, 
  Mic, 
  ArrowRight,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { ChatMessage, ChatConversation } from '../../types/superApp';
import { searchMessagesInConversation } from '../../services/messagingEngine';

interface ChatSearchModalProps {
  isOpen: boolean;
  conversation: ChatConversation;
  onSelectMessage: (messageId: string) => void;
  onClose: () => void;
}

export const ChatSearchModal: React.FC<ChatSearchModalProps> = ({
  isOpen,
  conversation,
  onSelectMessage,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'media' | 'docs' | 'links' | 'audio'>('all');

  if (!isOpen) return null;

  const results = searchMessagesInConversation(conversation.messages || [], query, filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header & Search Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Search in {conversation.participantName}</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search messages, files, links..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
            {[
              { id: 'all', label: 'All Messages', icon: <MessageSquare className="w-3 h-3" /> },
              { id: 'media', label: 'Photos/Videos', icon: <ImageIcon className="w-3 h-3" /> },
              { id: 'docs', label: 'Documents', icon: <FileText className="w-3 h-3" /> },
              { id: 'links', label: 'Links', icon: <LinkIcon className="w-3 h-3" /> },
              { id: 'audio', label: 'Voice Notes', icon: <Mic className="w-3 h-3" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
            <span>Results ({results.length})</span>
            {query && <span>Filtered by "{query}"</span>}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-50" />
              <p>No messages match your search query</p>
            </div>
          ) : (
            results.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectMessage(m.id);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer space-y-1 group transition-all"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-indigo-300">{m.senderName}</span>
                  <span className="text-slate-500">{m.timestamp}</span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {m.text || `[${m.mediaType?.toUpperCase()}] ${m.fileName || ''}`}
                </p>

                <div className="flex items-center justify-end text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                  <span>Jump to message</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
