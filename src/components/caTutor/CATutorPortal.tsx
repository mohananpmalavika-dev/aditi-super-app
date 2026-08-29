import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Calculator, 
  TrendingUp, 
  Clock, 
  Award, 
  HelpCircle, 
  Headphones, 
  Layers, 
  AlertTriangle, 
  Building,
  RotateCw
} from 'lucide-react';
import { 
  StudentProfile, 
  DailyStudyPlan, 
  ConceptMasteryRecord, 
  MistakeRecord, 
  PaperId, 
  Lesson,
  MockExamAttempt 
} from '../../types/caTutor';
import { generateDailyStudyPlan } from '../../services/caStudyPlanEngine';
import { CA_FOUNDATION_CURRICULUM_VERSIONS } from '../../services/caCurriculumService';
import { StudentHomeDashboard } from './dashboard/StudentHomeDashboard';
import { DiagnosticOnboarding } from './dashboard/DiagnosticOnboarding';
import { InteractiveAITutorChat } from './tutor/InteractiveAITutorChat';
import { LessonViewer } from './lesson/LessonViewer';
import { AudioListenMode } from './lesson/AudioListenMode';
import { FlashcardDeckView } from './lesson/FlashcardDeckView';
import { SmartPracticeEngine } from './practice/SmartPracticeEngine';
import { MockExamEngine } from './practice/MockExamEngine';
import { MistakeNotebookView } from './practice/MistakeNotebookView';
import { FacultyContentStudio } from './studio/FacultyContentStudio';
import { CameraDoubtSolver } from './tutor/CameraDoubtSolver';
import { DailyVivaModal } from './tutor/DailyVivaModal';
import confetti from 'canvas-confetti';

export const CATutorPortal: React.FC = () => {
  // 1. Persistent Student Profile & Onboarding State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('ca_tutor_student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'student-default',
      name: 'Rahul Menon',
      curriculumVersionId: 'CA_FOUNDATION_SEP_2026',
      targetExamDate: '2026-09-15',
      languagePreference: 'ml-en',
      educationalStream: 'Commerce',
      accountingComfort: 'Intermediate',
      mathComfort: 'Beginner',
      dailyAvailableHours: 3.5,
      preferredStudyTime: 'Early Morning',
      preferredTutorStyle: 'Friendly',
      onboardingCompleted: true,
      diagnosticScorePercentage: 75
    };
  });

  // Active Tab: dashboard, tutor, lesson, listen, flashcards, practice, mock, mistakes, studio
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSubjectId, setActiveSubjectId] = useState<PaperId>('paper-1');
  const [tutorQueryPrompt, setTutorQueryPrompt] = useState<string>('');

  // Modals
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);

  // Daily Study Plan
  const [dailyPlan, setDailyPlan] = useState<DailyStudyPlan>(() => generateDailyStudyPlan(profile));

  // Mastery Records & Mistakes
  const [masteryRecords, setMasteryRecords] = useState<ConceptMasteryRecord[]>([
    {
      conceptId: 'c-acc-brs-timing',
      conceptName: 'BRS Timing Differences',
      subjectId: 'paper-1',
      masteryScore: 76,
      status: 'STRONG',
      timesPracticed: 6,
      accuracyRate: 83,
      lastPracticedDate: '2026-08-28',
      nextRevisionDate: '2026-09-02',
      spacedRepetitionIntervalDays: 7
    },
    {
      conceptId: 'c-law-consideration',
      conceptName: 'Consideration & Chinnaya Rule',
      subjectId: 'paper-2',
      masteryScore: 68,
      status: 'COMPETENT',
      timesPracticed: 4,
      accuracyRate: 75,
      lastPracticedDate: '2026-08-27',
      nextRevisionDate: '2026-08-30',
      spacedRepetitionIntervalDays: 3
    }
  ]);

  const [mistakes, setMistakes] = useState<MistakeRecord[]>([
    {
      id: 'mistake-1',
      questionId: 'q-acc-brs-1',
      questionText: 'Cheques issued but not presented: adjustment when starting from Cash Book favorable balance?',
      subjectId: 'paper-1',
      subjectTitle: 'Paper 1: Accounting',
      chapterTitle: 'Bank Reconciliation Statement',
      conceptName: 'BRS Timing Differences',
      studentAnswer: 'Deducted from Cash Book',
      correctAnswer: 'ADD to Cash Book Balance (+₹34,000)',
      whyStudentFailed: 'Careless confusion: deducted because cheques were given, but bank passbook balance was higher.',
      whyStudentFailedMalayalam: 'ചെക്ക് നൽകിയപ്പോൾ കുറച്ചു എന്ന് കരുതി മൈനസ് ചെയ്തു, എന്നാൽ പാസ്സ് ബുക്ക് ബാലൻസിലേക്ക് എത്താൻ കൂട്ടണം.',
      timestamp: 'Yesterday',
      remediated: false
    }
  ]);

  // Persist Profile changes
  useEffect(() => {
    localStorage.setItem('ca_tutor_student_profile', JSON.stringify(profile));
  }, [profile]);

  const handleOnboardingComplete = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setDailyPlan(generateDailyStudyPlan(newProfile));
    confetti({ particleCount: 50, spread: 70 });
  };

  const handleTriggerReplan = () => {
    const recalculated = generateDailyStudyPlan(profile, masteryRecords, true);
    setDailyPlan(recalculated);
    confetti({ particleCount: 30, spread: 60 });
  };

  const handleStartLesson = (paperId: PaperId, chapterId?: string) => {
    setActiveSubjectId(paperId);
    setActiveTab('lesson');
  };

  const handleAskDoubtAtTimestamp = (lesson: Lesson, timestampSec: number) => {
    const prompt = `I am at timestamp ${Math.floor(timestampSec / 60)}:${String(timestampSec % 60).padStart(2, '0')} in "${lesson.title}". Please explain what the faculty just taught here.`;
    setTutorQueryPrompt(prompt);
    setActiveTab('tutor');
  };

  const handleLogMistake = (newMistake: MistakeRecord) => {
    setMistakes((prev) => [newMistake, ...prev]);
  };

  const handleRemediateMistake = (m: MistakeRecord) => {
    setTutorQueryPrompt(`I made a mistake in: "${m.questionText}". My wrong answer was: "${m.studentAnswer}". Why is the correct answer "${m.correctAnswer}"? Please explain step-by-step.`);
    setActiveTab('tutor');
  };

  const handleRemediateMockMistakes = (examResult: MockExamAttempt) => {
    setTutorQueryPrompt(`I scored ${examResult.marksObtained}/${examResult.totalMarks} in the full mock exam and lost ${examResult.negativeMarksLost} negative marks. Please guide me through my weakest concepts in BRS and Contract Law.`);
    setActiveTab('tutor');
  };

  const handleUpdateMastery = (conceptId: string, delta: number) => {
    setMasteryRecords((prev) =>
      prev.map((rec) => {
        if (rec.conceptId === conceptId) {
          const newScore = Math.min(100, Math.max(0, rec.masteryScore + delta));
          return {
            ...rec,
            masteryScore: newScore,
            status: newScore >= 90 ? 'MASTERED' : newScore >= 75 ? 'STRONG' : 'COMPETENT'
          };
        }
        return rec;
      })
    );
  };

  // If onboarding not completed, show Diagnostic Assessment
  if (!profile.onboardingCompleted) {
    return <DiagnosticOnboarding onComplete={handleOnboardingComplete} />;
  }

  const activePaper = CA_FOUNDATION_CURRICULUM_VERSIONS[0].papers.find((p) => p.id === activeSubjectId) || CA_FOUNDATION_CURRICULUM_VERSIONS[0].papers[0];
  const activeLesson = activePaper.chapters[0]?.lessons[0] || CA_FOUNDATION_CURRICULUM_VERSIONS[0].papers[0].chapters[1].lessons[0];

  return (
    <div className="space-y-6 pb-12 font-sans text-white">
      
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 flex-shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-white">CA Foundation AI Academy</h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                Bilingual AI Tutor
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized CA Foundation coaching in English, Malayalam & Manglish with synchronized whiteboard.
            </p>
          </div>
        </div>

        {/* Quick Modal Triggers */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <button
            onClick={() => setIsVivaModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span>5-Min Oral Viva</span>
          </button>

          <button
            onClick={() => setIsCameraModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Photo Doubt</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar shadow-lg">
        {[
          { id: 'dashboard', label: '1. Dashboard', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'tutor', label: '2. AI Tutor & Whiteboard', icon: <Layers className="w-4 h-4" /> },
          { id: 'lesson', label: '3. Video Lessons', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'practice', label: '4. Smart Practice', icon: <Calculator className="w-4 h-4" /> },
          { id: 'mock', label: '5. Mock Exam', icon: <Award className="w-4 h-4" /> },
          { id: 'mistakes', label: `6. Mistakes (${mistakes.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'listen', label: '7. Audio Mode', icon: <Headphones className="w-4 h-4" /> },
          { id: 'flashcards', label: '8. Flashcards', icon: <RotateCw className="w-4 h-4" /> },
          { id: 'studio', label: '9. Faculty CMS', icon: <Building className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-950/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Render Active Tab */}
      {activeTab === 'dashboard' && (
        <StudentHomeDashboard
          profile={profile}
          dailyPlan={dailyPlan}
          masteryRecords={masteryRecords}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onStartLesson={handleStartLesson}
          onTriggerReplan={handleTriggerReplan}
        />
      )}

      {activeTab === 'tutor' && (
        <InteractiveAITutorChat
          profile={profile}
          initialQuery={tutorQueryPrompt}
          activeSubjectId={activeSubjectId}
          onOpenPracticeQuestion={(qId) => setActiveTab('practice')}
          onOpenCameraDoubt={() => setIsCameraModalOpen(true)}
        />
      )}

      {activeTab === 'lesson' && (
        <LessonViewer
          lesson={activeLesson}
          paperTitle={activePaper.title}
          lang={profile.languagePreference}
          onAskDoubtAtTimestamp={handleAskDoubtAtTimestamp}
          onLessonCompleted={(lessonId) => {
            handleUpdateMastery('c-acc-brs-timing', 10);
            confetti({ particleCount: 40, spread: 60 });
          }}
        />
      )}

      {activeTab === 'practice' && (
        <SmartPracticeEngine
          onLogMistake={handleLogMistake}
          onAskTutorAboutQuestion={(qText) => {
            setTutorQueryPrompt(`Please explain how to solve this question step-by-step: "${qText}"`);
            setActiveTab('tutor');
          }}
        />
      )}

      {activeTab === 'mock' && (
        <MockExamEngine
          onRemediateMistakes={handleRemediateMockMistakes}
        />
      )}

      {activeTab === 'mistakes' && (
        <MistakeNotebookView
          mistakes={mistakes}
          onRemediateWithTutor={handleRemediateMistake}
          onClearMistake={(mId) => setMistakes((prev) => prev.filter((x) => x.id !== mId))}
        />
      )}

      {activeTab === 'listen' && <AudioListenMode />}

      {activeTab === 'flashcards' && <FlashcardDeckView />}

      {activeTab === 'studio' && <FacultyContentStudio />}

      {/* Camera Doubt Solver Modal */}
      <CameraDoubtSolver
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onSubmitDoubt={(prompt, img) => {
          setTutorQueryPrompt(`[Image Uploaded]: ${prompt}`);
          setActiveTab('tutor');
        }}
        lang={profile.languagePreference}
      />

      {/* Daily Viva Modal */}
      <DailyVivaModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
        onMasteryUpdated={handleUpdateMastery}
      />

    </div>
  );
};
