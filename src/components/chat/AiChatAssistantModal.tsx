import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckSquare, 
  Calendar, 
  Wand2, 
  Languages, 
  FileText, 
  Check, 
  Copy,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ChatConversation, TaskItem } from '../../types/superApp';
import { generateUnreadSummary, extractTaskFromMessage } from '../../services/messagingEngine';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

interface AiChatAssistantModalProps {
  isOpen: boolean;
  conversation: ChatConversation;
  selectedMessage?: ChatMessage | null;
  onClose: () => void;
}

export const AiChatAssistantModal: React.FC<AiChatAssistantModalProps> = ({
  isOpen,
  conversation,
  selectedMessage,
  onClose
}) => {
  const { addTask, showToast } = useSuperApp();
  const [activeTab, setActiveTab] = useState<'summary' | 'task' | 'rewrite'>('summary');
  const [copied, setCopied] = useState(false);

  // Task form state
  const initialTask = selectedMessage
    ? extractTaskFromMessage(selectedMessage.text, selectedMessage.senderName)
    : {
        id: `task-chat-${Date.now()}`,
        title: `Follow-up on ${conversation.participantName}`,
        description: `Discussion action items from ${conversation.participantName}`,
        status: 'todo' as const,
        priority: 'medium' as const,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        category: 'Work' as const
      };

  const [taskTitle, setTaskTitle] = useState(initialTask.title);
  const [taskDueDate, setTaskDueDate] = useState(initialTask.dueDate);
  const [taskPriority, setTaskPriority] = useState(initialTask.priority);

  // Rewriter state
  const [inputRewriteText, setInputRewriteText] = useState(selectedMessage?.text || 'Can you please send me the property document agreement by tomorrow evening?');
  const [rewrittenResult, setRewrittenResult] = useState('');
  const [tone, setTone] = useState<'Professional' | 'Polite & Friendly' | 'Short & Crisp' | 'Malayalam Polite'>('Professional');

  if (!isOpen) return null;

  const summary = generateUnreadSummary(conversation.messages || [], conversation.participantName);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title: taskTitle.trim(),
      description: `Created via OmniBrain AI from chat with ${conversation.participantName}`,
      status: 'todo',
      priority: taskPriority,
      dueDate: taskDueDate,
      category: 'Work'
    });
    confetti({ particleCount: 50, spread: 60 });
    showToast('📝 Task added to LifeOS Todo list!');
    onClose();
  };

  const handleRewrite = () => {
    let result = inputRewriteText;
    if (tone === 'Professional') {
      result = `Dear ${conversation.participantName},\nKindly provide the requested documents and updates at your earliest convenience. Thank you.`;
    } else if (tone === 'Polite & Friendly') {
      result = `Hi ${conversation.participantName}! Hope you're doing great. Whenever you get a moment, could you please share the details? Thanks a lot! 😊`;
    } else if (tone === 'Short & Crisp') {
      result = `Please share the document by tomorrow. Thanks.`;
    } else if (tone === 'Malayalam Polite') {
      result = `നമസ്കാരം, ദയവായി നാളെ വൈകുന്നേരത്തിന് മുൻപായി ഡോക്യുമെന്റുകൾ അയച്ചു തരാൻ സാധിക്കുമോ? നന്ദി.`;
    }
    setRewrittenResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border-b border-indigo-500/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>OmniBrain AI Chat Assistant</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Smart Tools
                </span>
              </h3>
              <p className="text-xs text-slate-400">Contextual summaries, task extraction & writing assistance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-2.5 border-b border-slate-800 flex items-center gap-2 bg-slate-950/70 flex-shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'summary'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('task')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'task'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>

          <button
            onClick={() => setActiveTab('rewrite')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'rewrite'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Smart Rewrite</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: AI SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <span className="font-extrabold text-xs text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Conversation Highlights for {conversation.participantName}:</span>
                </span>
                <ul className="space-y-1.5 text-slate-200">
                  {summary.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {summary.actionItems.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Action Items & Commitments:</span>
                  </span>
                  <ul className="space-y-1 text-slate-200">
                    {summary.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE TASK FROM CHAT */}
          {activeTab === 'task' && (
            <form onSubmit={handleSaveTask} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md mt-2"
              >
                Save to Task Manager
              </button>
            </form>
          )}

          {/* TAB 3: SMART REWRITER */}
          {activeTab === 'rewrite' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Original Draft Text</label>
                <textarea
                  value={inputRewriteText}
                  onChange={(e) => setInputRewriteText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {(['Professional', 'Polite & Friendly', 'Short & Crisp', 'Malayalam Polite'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      tone === t
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleRewrite}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md"
              >
                ✨ Generate AI Tone
              </button>

              {rewrittenResult && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">Suggested Draft:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(rewrittenResult);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-slate-200 leading-relaxed italic">{rewrittenResult}</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
