import React from 'react';
import { X, Star, Trash2, ArrowRight } from 'lucide-react';
import { ChatConversation, ChatMessage } from '../../types/superApp';

interface StarredMessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatConversation[];
  onSelectChat: (chatId: string) => void;
  onUnstarMessage: (chatId: string, messageId: string) => void;
}

export const StarredMessagesDrawer: React.FC<StarredMessagesDrawerProps> = ({
  isOpen,
  onClose,
  chats,
  onSelectChat,
  onUnstarMessage
}) => {
  if (!isOpen) return null;

  // Gather all starred messages across all chats
  const allStarred: { chat: ChatConversation; message: ChatMessage }[] = [];
  chats.forEach((chat) => {
    chat.messages.forEach((msg) => {
      if (msg.isStarred) {
        allStarred.push({ chat, message: msg });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <h3 className="font-extrabold text-sm text-white">Starred Messages & Bookmarks</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {allStarred.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto">
                  <Star className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-white">No Starred Messages</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Tap the star ⭐ icon next to any message to save it here for quick reference.
                </p>
              </div>
            ) : (
              allStarred.map(({ chat, message }) => (
                <div
                  key={message.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={chat.participantAvatar}
                        alt={chat.participantName}
                        className="w-6 h-6 rounded-lg object-cover"
                      />
                      <span className="text-xs font-bold text-slate-300 truncate">
                        {message.senderName} • {chat.participantName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{message.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed break-words bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    {message.text}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onUnstarMessage(chat.id, message.id)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Unstar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                    >
                      <span>Go to Chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
