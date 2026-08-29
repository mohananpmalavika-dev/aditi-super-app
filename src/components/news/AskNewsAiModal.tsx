/**
 * NewsOS Grounded Reader Assistant Drawer ("Ask News AI")
 * Interactive conversational assistant strictly answering based on published verified portal news.
 */

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, Newspaper } from 'lucide-react';
import { askNewsAI, NewsAIAnswer } from '../../services/news/newsAskAiService';
import { NewsArticle } from '../../types/news';

interface AskNewsAiModalProps {
  onClose: () => void;
  onOpenArticle: (articleId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citedArticles?: NewsAIAnswer['citedArticles'];
  timestamp: string;
}

export const AskNewsAiModal: React.FC<AskNewsAiModalProps> = ({ onClose, onOpenArticle }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your NewsOS Editorial Assistant. You can ask me any questions about today\'s verified news across Kerala, India, Technology, Economy, or Weather. I answer strictly from verified portal reports with source citations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const isMalayalam = /[\u0D00-\u0D7F]/.test(userText);
      const answer = await askNewsAI(userText, isMalayalam ? 'ml' : 'en');
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer.answer,
        citedArticles: answer.citedArticles,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Unable to process your question at this moment. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What is the latest Kerala rain alert in Kozhikode?',
    'Did ISRO complete the Gaganyaan recovery test?',
    'What is the current monthly GST revenue collection in India?'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-end">
      <div className="bg-slate-950 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Ask News AI</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Grounded
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Verified editorial Q&A assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-sm rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Citations Box */}
                {msg.citedArticles && msg.citedArticles.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Cited Verified Stories:</span>
                    </div>
                    {msg.citedArticles.map((cite) => (
                      <button
                        key={cite.id}
                        onClick={() => onOpenArticle(cite.id)}
                        className="w-full text-left p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:text-white flex items-center justify-between gap-2 group transition-all"
                      >
                        <span className="truncate font-medium">{cite.headline}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[9px] text-slate-400 text-right">{msg.timestamp}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span>Consulting verified portal news...</span>
            </div>
          )}
        </div>

        {/* Quick Sample Questions */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400">Sample Inquiries:</div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => { setQuery(q); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-700/60 transition-colors truncate max-w-full text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about today's news in English or മലയാളം..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
