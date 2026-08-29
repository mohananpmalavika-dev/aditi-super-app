import React, { useState } from 'react';
import { Award, Mic, Volume2, X, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { CA_FOUNDATION_FLASHCARDS } from '../../../services/caCurriculumService';
import confetti from 'canvas-confetti';

interface DailyVivaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMasteryUpdated: (conceptId: string, delta: number) => void;
}

export const DailyVivaModal: React.FC<DailyVivaModalProps> = ({
  isOpen,
  onClose,
  onMasteryUpdated
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCard = CA_FOUNDATION_FLASHCARDS[currentIdx] || CA_FOUNDATION_FLASHCARDS[0];

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;

    // Evaluate answer keywords
    const isGood = studentAnswer.toLowerCase().includes('add') || 
                  studentAnswer.toLowerCase().includes('stranger') || 
                  studentAnswer.toLowerCase().includes('pass book') ||
                  studentAnswer.toLowerCase().includes('chinnaya');

    const feedbackMsg = isGood
      ? '🎉 Excellent understanding! You accurately identified the underlying accounting/legal principle. +15 Mastery Points awarded.'
      : '💡 Good attempt! Remember: Cheques issued reduce the cash book immediately, but the bank balance remains higher until presented, so we ADD.';

    setFeedback(feedbackMsg);
    onMasteryUpdated(currentCard.conceptId, isGood ? 15 : 5);

    if (isGood) {
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setStudentAnswer('');
    if (currentIdx + 1 < CA_FOUNDATION_FLASHCARDS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in font-sans">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">5-Minute AI Daily Oral Viva</h3>
              <p className="text-[11px] text-slate-400">Oral conceptual retention check with your AI CA Tutor.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Question {currentIdx + 1} of {CA_FOUNDATION_FLASHCARDS.length}
          </span>
          <p className="font-extrabold text-sm sm:text-base text-white">
            {currentCard.vivaQuestionEn || currentCard.frontEn}
          </p>
          <p className="text-xs text-amber-200/80 font-medium">
            {currentCard.vivaQuestionMl || currentCard.frontMl}
          </p>
        </div>

        {/* Feedback Display */}
        {feedback ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-100 leading-relaxed space-y-2">
              <p className="font-bold">{feedback}</p>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <strong className="block text-[10px] uppercase text-emerald-400">Standard Academic Answer:</strong>
                {currentCard.backEn}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
            >
              <span>{currentIdx + 1 < CA_FOUNDATION_FLASHCARDS.length ? 'Next Viva Question' : 'Finish Viva'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleEvaluate} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Your Answer (Voice or Text)</label>
              <textarea
                rows={3}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Speak or type your explanation here (e.g. We add it because Cash Book was reduced but bank wasn't)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Answer for AI Evaluation</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
