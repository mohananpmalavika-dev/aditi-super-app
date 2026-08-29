import { 
  StudentProfile, 
  DailyStudyPlan, 
  DailyScheduleItem, 
  ConceptMasteryRecord, 
  MasteryStatus,
  PaperId 
} from '../types/caTutor';

export function calculateDaysRemaining(targetDateStr: string = '2026-09-15'): number {
  const target = new Date(targetDateStr);
  const now = new Date('2026-08-29'); // Consistent base date
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 74;
}

export function generateDailyStudyPlan(
  profile: Partial<StudentProfile>,
  masteryRecords: ConceptMasteryRecord[] = [],
  recalculateMissed: boolean = false
): DailyStudyPlan {
  const daysLeft = calculateDaysRemaining(profile.targetExamDate || '2026-09-15');
  const availableHours = profile.dailyAvailableHours || 3.5;
  const totalTargetMinutes = Math.round(availableHours * 60);

  // Find weak concepts that need priority revision
  const weakConcepts = masteryRecords.filter(
    (m) => m.status === 'WEAK' || m.status === 'LEARNING' || new Date(m.nextRevisionDate) <= new Date('2026-08-29')
  );

  const schedule: DailyScheduleItem[] = [
    {
      id: 'sch-1',
      timeSlot: '06:30 AM – 07:30 AM',
      subjectId: 'paper-1',
      subjectTitle: 'Paper 1: Accounting',
      chapterTitle: 'Bank Reconciliation Statement',
      lessonTitle: weakConcepts.length > 0 ? 'Fix BRS Timing Differences & Errors' : 'Causes of Differences & BRS Preparation',
      activityType: weakConcepts.length > 0 ? 'Revision' : 'Learn',
      durationMinutes: 60,
      completed: false
    },
    {
      id: 'sch-2',
      timeSlot: '07:45 AM – 08:30 AM',
      subjectId: 'paper-1',
      subjectTitle: 'Paper 1: Accounting',
      chapterTitle: 'Bank Reconciliation Statement',
      lessonTitle: 'Interactive Practice: 5 Past ICAI Exam Questions',
      activityType: 'Practice',
      durationMinutes: 45,
      completed: false
    },
    {
      id: 'sch-3',
      timeSlot: '05:30 PM – 06:30 PM',
      subjectId: 'paper-2',
      subjectTitle: 'Paper 2: Business Laws',
      chapterTitle: 'The Indian Contract Act, 1872',
      lessonTitle: 'Consideration & Chinnaya v. Ramayya Case Law',
      activityType: 'Learn',
      durationMinutes: 60,
      completed: false
    },
    {
      id: 'sch-4',
      timeSlot: '07:00 PM – 07:45 PM',
      subjectId: 'paper-3',
      subjectTitle: 'Paper 3: Quantitative Aptitude',
      chapterTitle: 'Mathematics of Finance',
      lessonTitle: 'Annuity Regular Calculator Speed Tricks',
      activityType: 'Practice',
      durationMinutes: 45,
      completed: false
    }
  ];

  return {
    date: '2026-08-29',
    totalTargetMinutes,
    completedMinutes: 0,
    motivationalMessage: recalculateMissed
      ? `Don't worry about missed hours! We recalibrated today's schedule for ${daysLeft} days remaining to ensure full syllabus coverage.`
      : `Good evening! You have ${daysLeft} days remaining for your CA Foundation examination. Today's target: ${Math.floor(totalTargetMinutes / 60)}h ${totalTargetMinutes % 60}m.`,
    motivationalMessageMalayalam: recalculateMissed
      ? `മുൻ ദിവസങ്ങളിലെ സമയം നഷ്ടപ്പെട്ടതിൽ വിഷമിക്കേണ്ടതില്ല. പരീക്ഷയ്ക്ക് ബാക്കിയുള്ള ${daysLeft} ദിവസങ്ങൾ കൃത്യമായി വിനിയോഗിക്കാൻ നിങ്ങളുടെ പഠന ഷെഡ്യൂൾ പുതുക്കിയിട്ടുണ്ട്.`
      : `നമസ്കാരം! സി.എ ഫൗണ്ടേഷൻ പരീക്ഷയ്ക്ക് ഇനി ${daysLeft} ദിവസങ്ങൾ ബാക്കി. ഇന്നത്തെ ലക്ഷ്യം: ${Math.floor(totalTargetMinutes / 60)} മണിക്കൂർ ${totalTargetMinutes % 60} മിനിറ്റ്.`,
    schedule,
    recalculatedDueToMissedDays: recalculateMissed
  };
}

export function calculateMasteryStatus(score: number): MasteryStatus {
  if (score >= 90) return 'MASTERED';
  if (score >= 75) return 'STRONG';
  if (score >= 60) return 'COMPETENT';
  if (score >= 40) return 'LEARNING';
  return 'WEAK';
}

export function calculateNextSpacedRepetitionDate(currentIntervalDays: number, isCorrect: boolean): { nextDate: string; nextInterval: number } {
  let nextInterval: number;
  if (!isCorrect) {
    nextInterval = 1; // Immediate recall tomorrow
  } else {
    if (currentIntervalDays <= 0) nextInterval = 1;
    else if (currentIntervalDays === 1) nextInterval = 3;
    else if (currentIntervalDays === 3) nextInterval = 7;
    else if (currentIntervalDays === 7) nextInterval = 14;
    else nextInterval = 30;
  }

  const date = new Date('2026-08-29');
  date.setDate(date.getDate() + nextInterval);
  return {
    nextDate: date.toISOString().split('T')[0],
    nextInterval
  };
}

export function calculateExamReadiness(masteryList: ConceptMasteryRecord[]): {
  overallScore: number;
  subjectScores: Record<PaperId, number>;
  predictedMarksRange: string;
} {
  const defaultScores = {
    'paper-1': 76,
    'paper-2': 68,
    'paper-3': 72,
    'paper-4': 80
  };

  if (masteryList.length === 0) {
    return {
      overallScore: 74,
      subjectScores: defaultScores,
      predictedMarksRange: '235 – 268 / 400'
    };
  }

  const sum = masteryList.reduce((acc, m) => acc + m.masteryScore, 0);
  const avg = Math.round(sum / masteryList.length);
  const minEst = Math.max(160, Math.round(avg * 3.2));
  const maxEst = Math.min(380, Math.round(avg * 3.8));

  return {
    overallScore: avg,
    subjectScores: defaultScores,
    predictedMarksRange: `${minEst} – ${maxEst} / 400`
  };
}
