import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Trash2, 
  ArrowRight, 
  Activity, 
  Bot, 
  User, 
  Lightbulb 
} from 'lucide-react';
import { useOmniBrain } from '../../context/OmniBrainContext';
import { useSuperApp } from '../../context/SuperAppContext';

export const OmniBrainDrawer: React.FC = () => {
  const { 
    messages, 
    isThinking, 
    activeThoughtStream, 
    isAgentDrawerOpen, 
    closeAgentDrawer, 
    askBrain, 
    clearConversation 
  } = useOmniBrain();
  const { setActiveMiniApp } = useSuperApp();
  const [inputPrompt, setInputPrompt] = useState('');

  if (!isAgentDrawerOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isThinking) return;
    askBrain(inputPrompt);
    setInputPrompt('');
  };

  const handleChipClick = (prompt: string) => {
    askBrain(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">Aditi Brain AI Core</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Agent
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Autonomous multi-vertical coordinator</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={clearConversation}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeAgentDrawer}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thought Stream / Agentic Reasoning Status Banner */}
          {isThinking && (
            <div className="bg-indigo-950/60 border-b border-indigo-800/40 p-3 px-5 flex items-center gap-3 animate-pulse">
              <Activity className="w-4 h-4 text-indigo-400 animate-spin" />
              <div className="text-xs text-indigo-200">
                <span className="font-bold">Neural Reasoner Active:</span> Analyzing intent across 12 verticals...
              </div>
            </div>
          )}

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isBrain = msg.sender === 'brain';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isBrain ? 'justify-start' : 'justify-end'}`}
                >
                  {isBrain && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${isBrain ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isBrain
                          ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 shadow-md'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Action Dispatch Pill */}
                      {msg.actionDispatched && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-300 font-medium">
                            ⚡ {msg.actionDispatched.actionSummary}
                          </span>
                          <button
                            onClick={() => {
                              setActiveMiniApp(msg.actionDispatched!.vertical);
                              closeAgentDrawer();
                            }}
                            className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/20 px-2 py-1 rounded-lg border border-indigo-500/30"
                          >
                            <span>Open {msg.actionDispatched.vertical}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Thought traces expansion */}
                    {msg.thoughtTraces && msg.thoughtTraces.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                          <Activity className="w-3 h-3" />
                          <span>Agent Reasoning Trace</span>
                        </div>
                        {msg.thoughtTraces.map((t, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 pl-1 border-l-2 border-indigo-500/40">
                            <span className="text-slate-200 font-semibold">{t.step}:</span>
                            <span className="text-slate-400">{t.details}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested follow-up prompt chips */}
                    {msg.suggestedPrompts && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedPrompts.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChipClick(p)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-1 text-left"
                          >
                            <Lightbulb className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                            <span>{p}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-500 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isBrain && (
                    <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Input Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/90">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask anything (e.g. 'book python tutor', 'draw cyberpunk city')..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={isThinking}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isThinking}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
