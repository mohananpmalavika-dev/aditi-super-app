import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  Bot, 
  Sparkles,
  Phone,
  Video
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { useOmniBrain } from '../../context/OmniBrainContext';

export const LiveChatMessenger: React.FC = () => {
  const { chats, activeChatId, setActiveChatId, sendChatMessage, showToast, user } = useSuperApp();
  const { toggleAgentDrawer } = useOmniBrain();
  
  const [chatSearch, setChatSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const filteredChats = chats.filter((c) =>
    c.participantName.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.roleOrContext.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;
    sendChatMessage(activeChat.id, messageInput);
    setMessageInput('');
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden h-[75vh] flex flex-col md:flex-row pb-12 md:pb-0">
      
      {/* Left Sidebar: Conversations Directory */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/60 flex flex-col">
        
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Omni-Messenger</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Live Hub
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map((c) => {
            const isSelected = c.id === activeChatId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveChatId(c.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-indigo-600/20 border border-indigo-500/40'
                    : 'hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={c.participantAvatar}
                    alt={c.participantName}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                  />
                  {c.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                      {c.participantName}
                    </h4>
                    <span className="text-[10px] text-slate-500">{c.lastMessageTime}</span>
                  </div>
                  <p className="text-[10px] text-indigo-400 font-medium truncate">{c.roleOrContext}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Area: Active Conversation Screen */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-slate-900">
          
          {/* Active Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-3">
              <img
                src={activeChat.participantAvatar}
                alt={activeChat.participantName}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/40"
              />
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>{activeChat.participantName}</span>
                  {activeChat.id === 'chat-brain' && (
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">{activeChat.roleOrContext}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast(`Initiating simulated voice call with ${activeChat.participantName}...`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Voice Call"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={() => showToast(`Initiating simulated HD video conference with ${activeChat.participantName}...`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Video Call"
              >
                <Video className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-slate-950/40">
            {activeChat.messages.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-400" />
                Say hello to start the conversation!
              </div>
            ) : (
              activeChat.messages.map((m) => {
                const isMe = m.isUser;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMe ? 'text-indigo-200 justify-end' : 'text-slate-500 justify-start'}`}>
                        <span>{m.timestamp}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-300" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Simulating file attachment upload...')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${activeChat.participantName}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-500/25"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
          Select a chat to begin messaging
        </div>
      )}

    </div>
  );
};
