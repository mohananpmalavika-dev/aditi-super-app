import React, { useState } from 'react';
import { Sparkles, RotateCw, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { CA_FOUNDATION_FLASHCARDS } from '../../../services/caCurriculumService';
import confetti from 'canvas-confetti';

export const FlashcardDeckView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const card = CA_FOUNDATION_FLASHCARDS[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkMastered = () => {
    setMasteredCount((prev) => prev + 1);
    confetti({ particleCount: 25, spread: 50 });
    handleNext();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % CA_FOUNDATION_FLASHCARDS.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : CA_FOUNDATION_FLASHCARDS.length - 1));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 text-white font-sans animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base">CA Foundation Revision Flashcards</h3>
          <p className="text-xs text-slate-400">Tap card to flip and reveal exam summary & legal sections.</p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
          {currentIndex + 1} / {CA_FOUNDATION_FLASHCARDS.length}
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="min-h-[280px] p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer shadow-2xl flex flex-col justify-between transition-all select-none"
      >
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>{isFlipped ? 'Answer & Legal Section' : 'Concept Question'}</span>
          <span className="text-amber-400 flex items-center gap-1">
            <RotateCw className="w-3 h-3" />
            <span>Click to Flip</span>
          </span>
        </div>

        <div className="my-auto text-center space-y-3 py-4">
          {!isFlipped ? (
            <>
              <h4 className="font-extrabold text-base sm:text-lg text-white leading-snug">
                {card.frontEn}
              </h4>
              <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
                {card.frontMl}
              </p>
            </>
          ) : (
            <div className="space-y-3 animate-in zoom-in-95">
              <p className="font-bold text-sm sm:text-base text-emerald-300 leading-snug whitespace-pre-line">
                {card.backEn}
              </p>
              <p className="text-xs text-slate-300">
                {card.backMl}
              </p>
              {card.keyFormulaOrSection && (
                <span className="inline-block px-3 py-1 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
                  {card.keyFormulaOrSection}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-500 font-mono">
          Card {card.id} • Spaced Repetition Active
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleMarkMastered}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark as Mastered</span>
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
