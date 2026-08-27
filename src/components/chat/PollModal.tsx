import React, { useState } from 'react';
import { X, Plus, Trash2, BarChart2, CheckSquare } from 'lucide-react';
import { ChatPoll } from '../../types/superApp';

interface PollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (poll: ChatPoll) => void;
}

export const PollModal: React.FC<PollModalProps> = ({ isOpen, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['Yes', 'No']);
  const [allowsMultiple, setAllowsMultiple] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const validOptions = options.filter((opt) => opt.trim().length > 0);
    if (validOptions.length < 2) return;

    const newPoll: ChatPoll = {
      id: `poll-${Date.now()}`,
      question: question.trim(),
      options: validOptions.map((opt, idx) => ({
        id: `opt-${idx}-${Date.now()}`,
        text: opt.trim(),
        votes: 0,
        votedUserIds: []
      })),
      allowsMultiple,
      isAnonymous,
      totalVotes: 0
    };

    onCreatePoll(newPoll);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2 text-indigo-400">
            <BarChart2 className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-white">Create Live Poll</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Question Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Poll Question</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question (e.g., Which venue for our meetup?)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Options List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Options ({options.length}/8)</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 w-4">{idx + 1}.</span>
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 rounded-xl hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 8 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option</span>
              </button>
            )}
          </div>

          {/* Settings Toggles */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Multiple answers allowed</span>
              <input
                type="checkbox"
                checked={allowsMultiple}
                onChange={(e) => setAllowsMultiple(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Anonymous voting</span>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Send Poll
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
