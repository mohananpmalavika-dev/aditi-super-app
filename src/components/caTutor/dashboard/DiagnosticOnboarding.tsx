import React, { useState } from 'react';
import { Sparkles, CheckCircle2, GraduationCap, ArrowRight, BookOpen, Clock, HeartHandshake } from 'lucide-react';
import { StudentProfile, CurriculumVersionId, LanguageMode } from '../../../types/caTutor';

interface DiagnosticOnboardingProps {
  onComplete: (profile: StudentProfile) => void;
}

export const DiagnosticOnboarding: React.FC<DiagnosticOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('Rahul Menon');
  const [curriculumVersionId, setCurriculumVersionId] = useState<CurriculumVersionId>('CA_FOUNDATION_SEP_2026');
  const [languagePreference, setLanguagePreference] = useState<LanguageMode>('ml-en');
  const [educationalStream, setEducationalStream] = useState<'Commerce' | 'Science' | 'Humanities'>('Commerce');
  const [accountingComfort, setAccountingComfort] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [mathComfort, setMathComfort] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [dailyAvailableHours, setDailyAvailableHours] = useState<number>(4);
  const [preferredStudyTime, setPreferredStudyTime] = useState<'Early Morning' | 'Afternoon' | 'Late Evening'>('Early Morning');
  const [preferredTutorStyle, setPreferredTutorStyle] = useState<'Friendly' | 'Strict Exam Coach' | 'Detailed Professor' | 'Quick Socratic'>('Friendly');

  // Diagnostic mini test answers
  const [q1Ans, setQ1Ans] = useState<number | null>(null);
  const [q2Ans, setQ2Ans] = useState<number | null>(null);

  const handleSubmit = () => {
    let score = 50;
    if (q1Ans === 0) score += 25;
    if (q2Ans === 0) score += 25;

    const profile: StudentProfile = {
      id: `student-${Date.now()}`,
      name: name.trim() || 'CA Aspirant',
      curriculumVersionId,
      targetExamDate: '2026-09-15',
      languagePreference,
      educationalStream,
      accountingComfort,
      mathComfort,
      dailyAvailableHours,
      preferredStudyTime,
      preferredTutorStyle,
      onboardingCompleted: true,
      diagnosticScorePercentage: score
    };

    onComplete(profile);
  };

  return (
    <div className="max-w-2xl mx-auto p-5 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-6 text-white font-sans animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 flex-shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black">
            Welcome to CA Foundation AI Tutor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Let's understand your background to build your personalized study schedule.
          </p>
        </div>
      </div>

      {/* Step 1: Exam Attempt & Language */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
              placeholder="e.g. Rahul Menon"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Target Examination Attempt</label>
            <select
              value={curriculumVersionId}
              onChange={(e) => setCurriculumVersionId(e.target.value as CurriculumVersionId)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
            >
              <option value="CA_FOUNDATION_SEP_2026">September 2026 Attempt (74 Days Left)</option>
              <option value="CA_FOUNDATION_JAN_2027">January 2027 Attempt</option>
              <option value="CA_FOUNDATION_MAY_2027">May 2027 Attempt</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Preferred Teaching Language</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'ml-en', title: 'Malayalam + English', subtitle: 'Manglish (Kerala Friendly)' },
                { id: 'ml', title: 'Malayalam (മലയാളം)', subtitle: 'Authentic Malayalam' },
                { id: 'en', title: 'English Only', subtitle: 'Standard Academic' }
              ].map((langOpt) => (
                <button
                  key={langOpt.id}
                  type="button"
                  onClick={() => setLanguagePreference(langOpt.id as LanguageMode)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    languagePreference === langOpt.id
                      ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-extrabold text-xs text-amber-300">{langOpt.title}</p>
                  <p className="text-[10px] text-slate-400">{langOpt.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all mt-4"
          >
            <span>Next: Background & Study Habits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Educational Stream & Comfort Levels */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Previous +2 Stream</label>
              <select
                value={educationalStream}
                onChange={(e) => setEducationalStream(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Commerce">Commerce (+2)</option>
                <option value="Science">Science (Non-Commerce)</option>
                <option value="Humanities">Humanities</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Daily Available Study Hours</label>
              <input
                type="number"
                min="1"
                max="12"
                value={dailyAvailableHours}
                onChange={(e) => setDailyAvailableHours(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Accounting Comfort</label>
              <select
                value={accountingComfort}
                onChange={(e) => setAccountingComfort(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Beginner">Beginner (Need step-by-step from zero)</option>
                <option value="Intermediate">Intermediate (Know debit/credit fundamentals)</option>
                <option value="Advanced">Advanced (Fast revision & ICAI problems)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Math / Quant Comfort</label>
              <select
                value={mathComfort}
                onChange={(e) => setMathComfort(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Beginner">Beginner (Need calculator shortcuts & derivations)</option>
                <option value="Intermediate">Intermediate (Basic algebra & arithmetic)</option>
                <option value="Advanced">Advanced (Strong quantitative skills)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-2/3 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
            >
              <span>Next: Quick 2-Minute Diagnostic Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Short Diagnostic Assessment */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            📝 <strong>Quick Diagnostic Check:</strong> Answer 2 quick baseline questions so the tutor can calibrate starting difficulty.
          </div>

          {/* Q1: Accounting Prudence */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <p className="font-bold text-xs text-white">
              1. Which accounting convention dictates that anticipated losses must be provided for, but anticipated profits should not be recorded?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Prudence / Conservatism', 'Going Concern', 'Matching Concept', 'Materiality'].map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ1Ans(idx)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q1Ans === idx
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Law Consideration */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <p className="font-bold text-xs text-white">
              2. In India, under Section 2(d) of Indian Contract Act, can consideration move from a stranger (third party)?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Yes (Chinnaya v. Ramayya)', 'No, strictly invalid', 'Only with High Court order', 'Only in Partnership'].map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ2Ans(idx)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q2Ans === idx
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all mt-4"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Generate My Personalized CA Study Plan</span>
          </button>
        </div>
      )}

    </div>
  );
};
