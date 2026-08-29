import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  RotateCcw, 
  ChevronRight,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { CA_FOUNDATION_QUESTION_BANK } from '../../../services/caCurriculumService';
import { evaluateMockExamSubmission } from '../../../services/caEvaluationEngine';
import { MockExamAttempt } from '../../../types/caTutor';
import confetti from 'canvas-confetti';

interface MockExamEngineProps {
  onRemediateMistakes: (examResult: MockExamAttempt) => void;
}

export const MockExamEngine: React.FC<MockExamEngineProps> = ({ onRemediateMistakes }) => {
  const [isExamActive, setIsExamActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 mins
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [examResult, setExamResult] = useState<MockExamAttempt | null>(null);

  const mockQuestions = CA_FOUNDATION_QUESTION_BANK;

  useEffect(() => {
    let timer: any;
    if (isExamActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isExamActive) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [isExamActive, secondsRemaining]);

  const handleStartExam = () => {
    setIsExamActive(true);
    setExamResult(null);
    setAnswers({});
    setFlagged({});
    setSecondsRemaining(1800);
    setCurrentQIndex(0);
  };

  const handleSelectAnswer = (qId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleToggleFlag = (qId: string) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitExam = () => {
    setIsExamActive(false);
    const result = evaluateMockExamSubmission({
      examTitle: 'CA Foundation September 2026 Full Model Mock',
      curriculumVersionId: 'CA_FOUNDATION_SEP_2026',
      answers,
      questions: mockQuestions,
      timeSpentSeconds: 1800 - secondsRemaining,
      negativeMarkRate: 0.25
    });

    setExamResult(result);
    confetti({ particleCount: 50, spread: 70 });
  };

  // Exam Result Dashboard View
  if (examResult) {
    return (
      <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 space-y-6 text-white font-sans animate-in fade-in shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-white">{examResult.examTitle}</h2>
              <p className="text-xs text-slate-400">ICAI Negative Marking Evaluated (-0.25 per wrong objective answer)</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
            {examResult.percentage}% Score
          </span>
        </div>

        {/* Score & Prediction Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Marks Obtained</span>
            <p className="font-black text-xl text-emerald-400">{examResult.marksObtained} / {examResult.totalMarks}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Negative Marks</span>
            <p className="font-black text-xl text-rose-400">-{examResult.negativeMarksLost}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Careless Mistakes</span>
            <p className="font-black text-xl text-amber-400">{examResult.carelessMistakesCount}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Predicted ICAI Range</span>
            <p className="font-black text-xs text-cyan-300 pt-1.5">{examResult.predictedFinalExamScoreRange}</p>
          </div>
        </div>

        {/* Action: 1-Click AI Mistake Fixer */}
        <div className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h4 className="font-extrabold text-sm text-white">AI Remediation: Fix Lost Marks</h4>
          </div>
          <p className="text-xs text-indigo-200">
            The tutor analyzed your attempt. You lost marks in high-weightage BRS and Consideration concepts. Click below to generate an automated remediation plan.
          </p>
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <button
              onClick={() => onRemediateMistakes(examResult)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95"
            >
              🚀 Fix My Mistakes with AI Tutor
            </button>
            <button
              onClick={handleStartExam}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs"
            >
              Retake Mock Exam
            </button>
          </div>
        </div>

      </div>
    );
  }

  // Pre-exam Landing Card
  if (!isExamActive) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 text-white font-sans shadow-2xl animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-amber-500/30">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-lg sm:text-2xl">CA Foundation Full Mock Exam Simulation</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Simulate real ICAI exam environment with strict countdown timer, negative marking (-0.25 marks), and instant analytics.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">DURATION</span>
            <span className="font-black text-amber-400">30 Mins</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">QUESTIONS</span>
            <span className="font-black text-cyan-400">{mockQuestions.length} Items</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">NEGATIVE MK</span>
            <span className="font-black text-rose-400">-0.25 M</span>
          </div>
        </div>

        <button
          onClick={handleStartExam}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition-all"
        >
          Start Mock Examination
        </button>
      </div>
    );
  }

  // Active Exam Interface
  const currentQ = mockQuestions[currentQIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-5 text-white font-sans animate-in fade-in">
      
      {/* Top Header with Timer and Submit */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span className="font-mono font-black text-base text-amber-400">
            {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleFlag(currentQ.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              flagged[currentQ.id]
                ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{flagged[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
          </button>

          <button
            onClick={handleSubmitExam}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
          >
            Finish & Submit
          </button>
        </div>
      </div>

      {/* Main Grid: Question View + Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Question Details (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-amber-400 uppercase">
              Question {currentQIndex + 1} of {mockQuestions.length} ({currentQ.marks} Marks)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">No tutor assistance in exam mode</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-sm sm:text-base text-white leading-relaxed whitespace-pre-line">
              {currentQ.questionEn}
            </h4>
            <p className="text-xs text-amber-200/80 leading-relaxed whitespace-pre-line">
              {currentQ.questionMl}
            </p>
          </div>

          {currentQ.options ? (
            <div className="space-y-2 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAnswer(currentQ.id, idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300">Your Exam Answer</label>
              <textarea
                rows={5}
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                placeholder="Write your legal reasoning or accounting working notes here..."
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={() => {
                if (currentQIndex + 1 < mockQuestions.length) {
                  setCurrentQIndex((prev) => prev + 1);
                } else {
                  handleSubmitExam();
                }
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
            >
              {currentQIndex + 1 < mockQuestions.length ? 'Next Question' : 'Save & Submit'}
            </button>
          </div>
        </div>

        {/* Right Column: Question Palette (4 Cols) */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
            Question Palette (OMR)
          </h4>

          <div className="grid grid-cols-4 gap-2">
            {mockQuestions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlag = flagged[q.id];
              const isCurrent = currentQIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`h-9 rounded-xl font-mono text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'border-amber-400 ring-2 ring-amber-400/40 text-amber-300 bg-amber-500/10'
                      : isFlag
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : isAnswered
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-500" />
              <span>Flagged for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
              <span>Unattempted</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
