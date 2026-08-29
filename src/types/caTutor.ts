export type CurriculumVersionId = 
  | 'CA_FOUNDATION_SEP_2026'
  | 'CA_FOUNDATION_JAN_2027'
  | 'CA_FOUNDATION_MAY_2027'
  | 'CA_INTERMEDIATE_NOV_2026'
  | 'CA_FINAL_MAY_2027'
  | 'CMA_FOUNDATION_DEC_2026'
  | 'CS_EXECUTIVE_DEC_2026';

export type PaperId = 'paper-1' | 'paper-2' | 'paper-3' | 'paper-4';

export type LanguageMode = 'en' | 'ml' | 'ml-en'; // English, Malayalam, Manglish/Mixed

export type TutorMode = 
  | 'teachMe'         // Step-by-step from beginner level
  | 'explainSimply'    // Layman's terms & everyday analogies
  | 'malayalam'        // Authentic Malayalam tutoring
  | 'manglish'         // Natural Mixed Malayalam + English (Kerala student friendly)
  | 'doubtSolver'      // Instant contextual doubt clearing
  | 'socratic'         // Guiding questions rather than direct spoon-feeding
  | 'examTutor'        // Strict ICAI examination format & marking focus
  | 'revisionTutor'    // Ultra-compressed high-yield points
  | 'quizTutor'        // Interactive 1-by-1 oral/written quiz
  | 'problemSolving';  // Step-by-step whiteboard calculations

export type MasteryStatus = 'WEAK' | 'LEARNING' | 'COMPETENT' | 'STRONG' | 'MASTERED';

export type QuestionType = 'mcq' | 'numerical' | 'theory' | 'caseScenario' | 'trueFalse';

export interface Concept {
  id: string;
  name: string;
  nameMalayalam: string;
  subjectId: PaperId;
  chapterId: string;
  importanceWeight: 'High' | 'Medium' | 'Essential';
  examFrequency: 'Every Attempt' | 'Frequent' | 'Periodic';
  summaryEn: string;
  summaryMl: string;
  summaryManglish: string;
  keyFormulas?: string[];
  keyLegalSections?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  titleMalayalam: string;
  chapterId: string;
  subjectId: PaperId;
  durationMinutes: number;
  videoUrl?: string;
  audioUrl?: string;
  facultyName: string;
  facultyDesignation: string;
  conceptIds: string[];
  checkpoints: LessonCheckpoint[];
  notesEn: string;
  notesMl: string;
  notesManglish: string;
  transcript: TranscriptSegment[];
}

export interface LessonCheckpoint {
  id: string;
  timestampSeconds: number;
  question: string;
  questionMalayalam: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  explanationMalayalam: string;
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  textEn: string;
  textMl: string;
  conceptId?: string;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  titleMalayalam: string;
  subjectId: PaperId;
  weightageMarks: number;
  estimatedHours: number;
  lessons: Lesson[];
  concepts: Concept[];
  prerequisites?: string[];
}

export interface CAPaper {
  id: PaperId;
  paperNumber: number;
  title: string;
  titleMalayalam: string;
  totalMarks: number;
  isObjective: boolean; // True for Papers 3 & 4 (negative marking applies)
  negativeMarkingPerWrong: number; // 0.25 for objective papers
  durationHours: number;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export interface CurriculumVersion {
  id: CurriculumVersionId;
  name: string;
  nameMalayalam: string;
  examMonth: string;
  examYear: number;
  examDateTarget: string;
  status: 'Active' | 'Upcoming' | 'Archived';
  papers: CAPaper[];
}

export interface WhiteboardAction {
  id: string;
  type: 
    | 'journalEntry' 
    | 'ledger' 
    | 'trialBalance' 
    | 'formula' 
    | 'lawProvisionMap' 
    | 'economicCurve' 
    | 'workingNote'
    | 'textAnnotation';
  title: string;
  data: any;
}

export interface JournalEntryData {
  date: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  narration: string;
  narrationMalayalam?: string;
  workingNoteRef?: string;
}

export interface LedgerAccountData {
  accountName: string;
  debitEntries: Array<{ date: string; particulars: string; amount: number; jf?: string }>;
  creditEntries: Array<{ date: string; particulars: string; amount: number; jf?: string }>;
  balanceCd: number;
  totalDebit: number;
  totalCredit: number;
}

export interface LawCaseAnalysisData {
  provision: string;
  relevantSection: string;
  factsOfCase: string;
  legalPrinciples: string[];
  applicationToFacts: string;
  conclusion: string;
  suggestedMarks: number;
}

export interface EconomicCurveData {
  curveType: 'Demand' | 'Supply' | 'Cost' | 'Revenue' | 'MarketEquilibrium';
  title: string;
  xLabel: string;
  yLabel: string;
  equilibriumPrice?: number;
  equilibriumQuantity?: number;
  shiftDirection?: 'Left' | 'Right' | 'None';
  explanation: string;
  explanationMalayalam: string;
}

export interface TutorResponse {
  answerEn: string;
  answerMl: string;
  answerManglish: string;
  spokenAudioText: string;
  tutorMode: TutorMode;
  conceptIds: string[];
  whiteboardActions: WhiteboardAction[];
  suggestedFollowUps: string[];
  suggestedPracticeQuestionIds?: string[];
  confidence: number;
  sourceCitations: Array<{ title: string; reference: string }>;
}

export interface StudentProfile {
  id: string;
  name: string;
  curriculumVersionId: CurriculumVersionId;
  targetExamDate: string; // e.g. "2026-09-15"
  languagePreference: LanguageMode;
  educationalStream: 'Commerce' | 'Science' | 'Humanities';
  accountingComfort: 'Beginner' | 'Intermediate' | 'Advanced';
  mathComfort: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyAvailableHours: number;
  preferredStudyTime: 'Early Morning' | 'Afternoon' | 'Late Evening';
  preferredTutorStyle: 'Friendly' | 'Strict Exam Coach' | 'Detailed Professor' | 'Quick Socratic';
  onboardingCompleted: boolean;
  diagnosticScorePercentage: number;
}

export interface DailyScheduleItem {
  id: string;
  timeSlot: string;
  subjectId: PaperId;
  subjectTitle: string;
  chapterTitle: string;
  lessonTitle: string;
  activityType: 'Learn' | 'Practice' | 'Revision' | 'Doubt Session';
  durationMinutes: number;
  completed: boolean;
}

export interface DailyStudyPlan {
  date: string;
  totalTargetMinutes: number;
  completedMinutes: number;
  motivationalMessage: string;
  motivationalMessageMalayalam: string;
  schedule: DailyScheduleItem[];
  recalculatedDueToMissedDays?: boolean;
}

export interface ConceptMasteryRecord {
  conceptId: string;
  conceptName: string;
  subjectId: PaperId;
  masteryScore: number; // 0 to 100
  status: MasteryStatus;
  timesPracticed: number;
  accuracyRate: number;
  lastPracticedDate: string;
  nextRevisionDate: string;
  spacedRepetitionIntervalDays: number;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  questionText: string;
  subjectId: PaperId;
  subjectTitle: string;
  chapterTitle: string;
  conceptName: string;
  studentAnswer: string;
  correctAnswer: string;
  whyStudentFailed: string;
  whyStudentFailedMalayalam: string;
  timestamp: string;
  remediated: boolean;
}

export interface CAQuestion {
  id: string;
  curriculumVersionId: CurriculumVersionId;
  subjectId: PaperId;
  chapterId: string;
  conceptIds: string[];
  type: QuestionType;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 Basic, 3 Exam, 5 Advanced
  marks: number;
  questionEn: string;
  questionMl: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswerText?: string;
  solutionEn: string;
  solutionMl: string;
  solutionManglish?: string;
  commonTraps: string[];
  whiteboardSolution?: WhiteboardAction;
  estimatedMinutes: number;
  source: string; // e.g. "ICAI Study Material / RTP"
}

export interface MockExamAttempt {
  id: string;
  examTitle: string;
  curriculumVersionId: CurriculumVersionId;
  paperId?: PaperId; // null for full mock (all 4 papers)
  dateAttempted: string;
  timeSpentSeconds: number;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  negativeMarksLost: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  easyQuestionsLost: number;
  carelessMistakesCount: number;
  conceptualMistakesCount: number;
  predictedFinalExamScoreRange: string;
  remediationPlanGenerated: boolean;
}

export interface Flashcard {
  id: string;
  subjectId: PaperId;
  chapterId: string;
  conceptId: string;
  frontEn: string;
  frontMl: string;
  backEn: string;
  backMl: string;
  keyFormulaOrSection?: string;
  vivaQuestionEn?: string;
  vivaQuestionMl?: string;
  mastered: boolean;
}

export interface TerminologyGlossaryItem {
  id: string;
  englishTerm: string;
  malayalamTerm: string;
  manglishPhonetic: string;
  subjectId: PaperId;
  contextUsage: string;
  doNotTranslate: boolean; // Keep as English term for ICAI exam scoring
  definitionEn: string;
  definitionMl: string;
}
