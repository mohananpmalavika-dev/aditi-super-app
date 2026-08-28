import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  FileText, 
  Link as LinkIcon, 
  Mic, 
  Star, 
  Download, 
  ExternalLink,
  Search,
  Music
} from 'lucide-react';
import { ChatMessage, ChatConversation } from '../../types/superApp';
import { extractSharedMediaVault } from '../../services/messagingEngine';

interface SharedMediaDrawerProps {
  isOpen: boolean;
  conversation: ChatConversation;
  onClose: () => void;
}

export const SharedMediaDrawer: React.FC<SharedMediaDrawerProps> = ({
  isOpen,
  conversation,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'links' | 'audio' | 'starred'>('media');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const vault = extractSharedMediaVault(conversation.messages || []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={conversation.participantAvatar}
              alt={conversation.participantName}
              className="w-10 h-10 rounded-2xl object-cover border border-indigo-500/40 shadow-md"
            />
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-white truncate">Shared Media & Vault</h3>
              <p className="text-[11px] text-slate-400 truncate">{conversation.participantName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-1 overflow-x-auto bg-slate-950/60 flex-shrink-0">
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media ({vault.media.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'docs'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Docs ({vault.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'links'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Links ({vault.links.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Audio ({vault.audio.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('starred')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'starred'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Starred ({vault.starred.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* MEDIA (PHOTOS / VIDEOS) */}
          {activeTab === 'media' && (
            <div>
              {vault.media.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto opacity-50" />
                  <p>No photos or videos shared in this chat yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {vault.media.map((item) => (
                    <a
                      key={item.id}
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group"
                    >
                      <img src={item.mediaUrl} alt="Shared" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Download className="w-4 h-4 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === 'docs' && (
            <div className="space-y-2">
              {vault.documents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <FileText className="w-8 h-8 mx-auto opacity-50" />
                  <p>No files or documents shared</p>
                </div>
              ) : (
                vault.documents.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 truncate">{item.fileName || 'Attachment Document'}</p>
                        <p className="text-[10px] text-slate-500">{item.fileSize || 'PDF Document'} • {item.timestamp}</p>
                      </div>
                    </div>

                    <a
                      href={item.mediaUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-2">
              {vault.links.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <LinkIcon className="w-8 h-8 mx-auto opacity-50" />
                  <p>No web links shared</p>
                </div>
              ) : (
                vault.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 flex items-start justify-between gap-3 group transition-all block"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-bold text-indigo-400 truncate group-hover:underline">{link.url}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{link.text}</p>
                      <p className="text-[10px] text-slate-500">{link.senderName} • {link.timestamp}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-1" />
                  </a>
                ))
              )}
            </div>
          )}

          {/* AUDIO & VOICE NOTES */}
          {activeTab === 'audio' && (
            <div className="space-y-2">
              {vault.audio.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Music className="w-8 h-8 mx-auto opacity-50" />
                  <p>No voice notes or audio messages</p>
                </div>
              ) : (
                vault.audio.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">Voice Note ({item.audioDuration ? `${item.audioDuration}s` : 'Voice'})</p>
                        <p className="text-[10px] text-slate-500">{item.senderName} • {item.timestamp}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-pink-400 font-bold">🎙️ Voice Note</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* STARRED MESSAGES */}
          {activeTab === 'starred' && (
            <div className="space-y-2">
              {vault.starred.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Star className="w-8 h-8 mx-auto opacity-50" />
                  <p>No starred messages in this chat</p>
                </div>
              ) : (
                vault.starred.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-300">{item.senderName}</span>
                      <span className="text-slate-500">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
