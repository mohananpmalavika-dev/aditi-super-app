import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Scale, 
  Calculator, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { CAQuestion, PaperId, MistakeRecord } from '../../../types/caTutor';
import { CA_FOUNDATION_QUESTION_BANK } from '../../../services/caCurriculumService';
import { evaluateLawAnswer } from '../../../services/caEvaluationEngine';
import confetti from 'canvas-confetti';

interface SmartPracticeEngineProps {
  initialQuestionId?: string;
  onLogMistake: (mistake: MistakeRecord) => void;
  onAskTutorAboutQuestion: (questionText: string) => void;
}

export const SmartPracticeEngine: React.FC<SmartPracticeEngineProps> = ({
  initialQuestionId,
  onLogMistake,
  onAskTutorAboutQuestion
}) => {
  const [selectedSubject, setSelectedSubject] = useState<PaperId | 'all'>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [subjectiveAnswer, setSubjectiveAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<any>(null);

  const filteredQuestions = CA_FOUNDATION_QUESTION_BANK.filter(
    (q) => selectedSubject === 'all' || q.subjectId === selectedSubject
  );

  const activeQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleSubmit = () => {
    setIsSubmitted(true);

    if (activeQuestion.type === 'caseScenario' || activeQuestion.type === 'theory') {
      const evalResult = evaluateLawAnswer(subjectiveAnswer, activeQuestion);
      setEvaluationFeedback(evalResult);

      if (evalResult.scoreObtained < 4) {
        onLogMistake({
          id: `mistake-${Date.now()}`,
          questionId: activeQuestion.id,
          questionText: activeQuestion.questionEn,
          subjectId: activeQuestion.subjectId,
          subjectTitle: 'Paper 2: Business Laws',
          chapterTitle: 'Indian Contract Act',
          conceptName: 'Consideration',
          studentAnswer: subjectiveAnswer,
          correctAnswer: activeQuestion.solutionEn,
          whyStudentFailed: 'Missing statutory section citation or landmark case precedent.',
          whyStudentFailedMalayalam: 'സെക്ഷൻ 2(d) അല്ലെങ്കിൽ ചിന്നയ്യ v. രാമയ്യ കേസ് ഉദ്ധരിക്കാത്തതിനാൽ മാർക്ക് കുറഞ്ഞു.',
          timestamp: 'Just now',
          remediated: false
        });
      } else {
        confetti({ particleCount: 30, spread: 60 });
      }
    } else if (activeQuestion.type === 'mcq') {
      const isCorrect = selectedOption === activeQuestion.correctOptionIndex;
      if (!isCorrect) {
        onLogMistake({
          id: `mistake-${Date.now()}`,
          questionId: activeQuestion.id,
          questionText: activeQuestion.questionEn,
          subjectId: activeQuestion.subjectId,
          subjectTitle: activeQuestion.subjectId === 'paper-3' ? 'Paper 3: Quantitative Aptitude' : 'Paper 4: Business Economics',
          chapterTitle: 'High-Yield Chapter',
          conceptName: 'Core Formula / Principle',
          studentAnswer: `Option ${selectedOption !== null ? selectedOption + 1 : 'None'}`,
          correctAnswer: `Option ${(activeQuestion.correctOptionIndex || 0) + 1}`,
          whyStudentFailed: activeQuestion.commonTraps[0] || 'Careless calculation or formula misconception.',
          whyStudentFailedMalayalam: 'ഫോർമുല പ്രയോഗിച്ചതിലെ പിഴവ്.',
          timestamp: 'Just now',
          remediated: false
        });
      } else {
        confetti({ particleCount: 35, spread: 60 });
      }
    }
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setSubjectiveAnswer('');
    setEvaluationFeedback(null);
    setCurrentQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white font-sans animate-in fade-in">
      
      {/* 1. Subject Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Subjects' },
          { id: 'paper-1', label: '1. Accounting' },
          { id: 'paper-2', label: '2. Business Laws' },
          { id: 'paper-3', label: '3. Quantitative Aptitude' },
          { id: 'paper-4', label: '4. Economics' }
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedSubject(s.id as any);
              setCurrentQuestionIndex(0);
              setIsSubmitted(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSubject === s.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 2. Active Question Container */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
        
        {/* Question Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">
              {activeQuestion.type.toUpperCase()} • {activeQuestion.marks} Marks
            </span>
            <span className="text-xs text-slate-400 font-medium">Difficulty {activeQuestion.difficulty}/5</span>
          </div>

          <button
            onClick={() => onAskTutorAboutQuestion(activeQuestion.questionEn)}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Tutor to Guide</span>
          </button>
        </div>

        {/* Question Text in English & Malayalam */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-sm sm:text-base text-white leading-relaxed whitespace-pre-line">
            {activeQuestion.questionEn}
          </h4>
          <p className="text-xs text-amber-200/80 leading-relaxed whitespace-pre-line">
            {activeQuestion.questionMl}
          </p>
        </div>

        {/* Question Inputs (MCQ vs Subjective) */}
        {activeQuestion.options ? (
          <div className="space-y-2 pt-2">
            {activeQuestion.options.map((opt, idx) => {
              const isCorrect = idx === activeQuestion.correctOptionIndex;
              const isChosen = selectedOption === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : isChosen
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                      : isChosen
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-300 block">Write Your Answer (Law Case / Working Notes)</label>
            <textarea
              rows={5}
              value={subjectiveAnswer}
              disabled={isSubmitted}
              onChange={(e) => setSubjectiveAnswer(e.target.value)}
              placeholder="Write legal provision, case reference, application to facts and final conclusion..."
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
            />
          </div>
        )}

        {/* Evaluation Output when Submitted */}
        {isSubmitted && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            {evaluationFeedback && (
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-400">
                    AI Rubric Score: {evaluationFeedback.scoreObtained} / {evaluationFeedback.maxMarks} Marks
                  </span>
                </div>
                <p className="text-xs text-slate-300">{evaluationFeedback.feedbackEn}</p>
                <p className="text-xs text-amber-200/80">{evaluationFeedback.feedbackMl}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Standard Solution & Examination Presentation:
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-line font-mono leading-relaxed">
                {activeQuestion.solutionEn}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </span>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <span>Next Practice Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
