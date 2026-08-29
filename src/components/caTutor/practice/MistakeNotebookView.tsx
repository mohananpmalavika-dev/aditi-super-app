import React, { useState } from 'react';
import { AlertTriangle, BookOpen, Sparkles, CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';
import { MistakeRecord } from '../../../types/caTutor';

interface MistakeNotebookViewProps {
  mistakes: MistakeRecord[];
  onRemediateWithTutor: (mistake: MistakeRecord) => void;
  onClearMistake: (mistakeId: string) => void;
}

export const MistakeNotebookView: React.FC<MistakeNotebookViewProps> = ({
  mistakes,
  onRemediateWithTutor,
  onClearMistake
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = mistakes.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.subjectId === activeFilter;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white font-sans animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">My Mistakes Notebook (തെറ്റുകൾ തിരുത്തൽ)</h3>
            <p className="text-xs text-slate-400">
              Auto-tracked exam traps & conceptual misconceptions with 1-click AI remediation.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
          {mistakes.length} Active Mistakes
        </span>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Subjects' },
          { id: 'paper-1', label: 'Accounting' },
          { id: 'paper-2', label: 'Business Laws' },
          { id: 'paper-3', label: 'Quantitative' },
          { id: 'paper-4', label: 'Economics' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mistakes List */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-2 py-12">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="font-bold text-sm text-white">No Unresolved Mistakes!</h4>
          <p className="text-xs text-slate-400">
            Great job! You have remediated all previous errors. Take a mock exam to challenge yourself.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                    {m.subjectTitle}
                  </span>
                  <span className="text-xs font-bold text-white">{m.chapterTitle}</span>
                </div>
                <span className="text-[10px] text-slate-500">{m.timestamp}</span>
              </div>

              {/* Question Text */}
              <p className="font-extrabold text-xs sm:text-sm text-white leading-relaxed">
                {m.questionText}
              </p>

              {/* Error comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                  <span className="text-[10px] text-rose-400 font-bold uppercase block">Your Answer:</span>
                  <p className="font-mono text-slate-200">{m.studentAnswer}</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Correct Answer:</span>
                  <p className="font-mono text-slate-200">{m.correctAnswer}</p>
                </div>
              </div>

              {/* Why Failed Explanation */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-amber-200 leading-snug space-y-0.5">
                <strong className="block text-[10px] uppercase text-amber-400 font-bold">Why This Happened:</strong>
                <p>{m.whyStudentFailed}</p>
                <p className="text-[11px] text-slate-400">{m.whyStudentFailedMalayalam}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => onClearMistake(m.id)}
                  className="text-xs text-slate-400 hover:text-slate-200 font-bold"
                >
                  Dismiss
                </button>

                <button
                  onClick={() => onRemediateWithTutor(m)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fix with AI Tutor</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
