# CA Foundation Bilingual AI Tutor — Architecture & System Design

## 1. Overview & Core Philosophy

The CA Foundation AI Tutor platform is engineered to function as an authentic **Personal CA Teacher** rather than a passive video catalog or generic chatbot. It provides comprehensive, synchronous, and asynchronous learning across:
- **Languages**: English, Malayalam (മലയാളം), and Manglish (Malayalam + English mixed teaching).
- **Course & Curriculum**: Dynamic versioning (`CA_FOUNDATION_SEP_2026`, extensible to CA Intermediate, Final, CMA, CS, ACCA).
- **Core Papers**:
  - **Paper 1: Accounting (100M)** — Subjective format, T-Accounts, BRS, Ledgers, Trial Balances.
  - **Paper 2: Business Laws (100M)** — Subjective format (`Provision → Facts → Application → Conclusion`).
  - **Paper 3: Quantitative Aptitude (100M)** — Objective format (MCQ) with ICAI 0.25 negative marking penalty.
  - **Paper 4: Business Economics (100M)** — Objective format (MCQ) with ICAI 0.25 negative marking penalty.

---

## 2. Core Architectural Components

```
Tutor Platform Architecture
│
├── Domain Model (src/types/caTutor.ts)
│   ├── CurriculumVersion, Paper, Chapter, Lesson, Concept
│   ├── StudentProfile, DailyStudyPlan, ConceptMasteryRecord, MistakeRecord
│   ├── WhiteboardAction, CAQuestion, MockExamAttempt
│
├── Deterministic Services (src/services/)
│   ├── caCurriculumService.ts      (4 Papers, ICAI Question Bank, Video Checkpoints, Flashcards)
│   ├── caTerminologyGlossary.ts    (Bilingual glossary with doNotTranslate technical safeguards)
│   ├── caTutorOrchestrator.ts      (10 Tutor Modes, Socratic dialogues, structured whiteboard actions)
│   ├── caStudyPlanEngine.ts        (Diagnostic assessment, adaptive replanning, spaced repetition)
│   ├── caEvaluationEngine.ts       (Law/Accountancy rubric marking, negative marking mock evaluation)
│
├── User Interface Layer (src/components/caTutor/)
│   ├── dashboard/                  (StudentHomeDashboard, DiagnosticOnboarding, DailyStudyPlanView)
│   ├── tutor/                      (InteractiveAITutorChat, VoiceTutorBar, CameraDoubtSolver, DailyVivaModal)
│   ├── whiteboard/                 (TutorWhiteboard, JournalEntryRenderer, BusinessLawRenderer, EconomicsGraphRenderer)
│   ├── lesson/                     (LessonViewer, AudioListenMode, FlashcardDeckView)
│   ├── practice/                   (SmartPracticeEngine, MockExamEngine, MistakeNotebookView)
│   ├── studio/                     (FacultyContentStudio)
│   └── CATutorPortal.tsx           (Master Container & Navigation Hub)
```

---

## 3. Authoritative System Principle (Point 100)

```
Platform Authoritative State =
  Curriculum Structure
  + Approved Academic Content
  + Student Learning State (Profile & History)
  + Deterministic Learning Engines (Evaluation, Replanning, Spaced Repetition)
  + AI Tutor (Pedagogical Explainer)
```

The AI acts as the **pedagogical explainer and interactive facilitator**, while deterministic engines strictly calculate examination scores, negative marking penalties, spaced repetition dates, and mastery scores.
