import { 
  CAQuestion, 
  MockExamAttempt, 
  CurriculumVersionId, 
  PaperId 
} from '../types/caTutor';

export interface SubjectiveEvaluationResult {
  scoreObtained: number;
  maxMarks: number;
  provisionScore: number;
  factsAndApplicationScore: number;
  conclusionScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  feedbackEn: string;
  feedbackMl: string;
  suggestedAnswerImprovement: string;
}

export function evaluateLawAnswer(
  studentAnswer: string,
  question: CAQuestion
): SubjectiveEvaluationResult {
  const ans = (studentAnswer || '').toLowerCase();
  const maxMarks = question.marks || 6;

  // Rubric Keyword checks for Consideration / Contract
  const keyTerms = [
    { term: '2(d)', label: 'Section 2(d)', weight: 1.5 },
    { term: 'chinnaya', label: 'Chinnaya v. Ramayya', weight: 1.5 },
    { term: 'stranger to consideration', label: 'Stranger to Consideration', weight: 1.5 },
    { term: 'promisor', label: 'Desire of Promisor', weight: 0.5 },
    { term: 'quid pro quo', label: 'Quid Pro Quo', weight: 0.5 },
    { term: 'enforce', label: 'Enforceable / Valid', weight: 0.5 }
  ];

  let score = 0;
  const found: string[] = [];
  const missing: string[] = [];

  keyTerms.forEach((k) => {
    if (ans.includes(k.term)) {
      score += k.weight;
      found.push(k.label);
    } else {
      missing.push(k.label);
    }
  });

  // Base score for reasonable length & structure
  if (ans.length > 80) score += 1.0;
  if (ans.length > 200) score += 0.5;

  const finalScore = Math.min(maxMarks, Math.max(1, Math.round(score * 10) / 10));

  return {
    scoreObtained: finalScore,
    maxMarks,
    provisionScore: found.includes('Section 2(d)') ? 2 : 1,
    factsAndApplicationScore: found.includes('Stranger to Consideration') ? 2.5 : 1,
    conclusionScore: found.includes('Enforceable / Valid') ? 1.5 : 0.5,
    keywordsFound: found,
    keywordsMissing: missing,
    feedbackEn: `You scored ${finalScore}/${maxMarks}. Good legal reasoning. ${missing.length > 0 ? `To get full marks, cite: ${missing.join(', ')}.` : 'Excellent citation of relevant case laws.'}`,
    feedbackMl: `നിങ്ങൾക്ക് ${finalScore}/${maxMarks} മാർക്ക് ലഭിച്ചു. ${missing.length > 0 ? `കൂടുതൽ മാർക്ക് ലഭിക്കാൻ ഈ പോയിന്റുകൾ കൂടി ഉൾപ്പെടുത്തുക: ${missing.join(', ')}.` : 'മികച്ച പ്രസന്റേഷൻ!'}`,
    suggestedAnswerImprovement: 'Structure your answer strictly into: (1) Applicable Legal Provision & Section, (2) Relevant Landmark Precedent, (3) Application to Given Case Facts, (4) Final Clear Conclusion.'
  };
}

export function evaluateMockExamSubmission(params: {
  examTitle: string;
  curriculumVersionId: CurriculumVersionId;
  paperId?: PaperId;
  answers: Record<string, number | string>;
  questions: CAQuestion[];
  timeSpentSeconds: number;
  negativeMarkRate?: number; // default 0.25 for objective papers
}): MockExamAttempt {
  const { examTitle, curriculumVersionId, paperId, answers, questions, timeSpentSeconds, negativeMarkRate = 0.25 } = params;

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  let marksObtained = 0;
  let totalMarks = 0;
  let negativeMarksLost = 0;
  let easyQuestionsLost = 0;
  let carelessMistakesCount = 0;
  let conceptualMistakesCount = 0;

  questions.forEach((q) => {
    totalMarks += q.marks;
    const studentAns = answers[q.id];

    if (studentAns === undefined || studentAns === null || studentAns === '') {
      unattemptedCount++;
    } else if (q.type === 'mcq') {
      const selectedIndex = Number(studentAns);
      if (selectedIndex === q.correctOptionIndex) {
        correctCount++;
        marksObtained += q.marks;
      } else {
        wrongCount++;
        const penalty = q.marks * negativeMarkRate;
        negativeMarksLost += penalty;
        marksObtained -= penalty;

        if (q.difficulty <= 2) {
          easyQuestionsLost += q.marks;
          carelessMistakesCount++;
        } else {
          conceptualMistakesCount++;
        }
      }
    } else {
      // Numerical / subjective auto-credit simulation
      correctCount++;
      marksObtained += q.marks * 0.8;
    }
  });

  const finalMarks = Math.max(0, Math.round(marksObtained * 10) / 10);
  const percentage = Math.round((finalMarks / (totalMarks || 1)) * 100);

  const minPred = Math.max(160, Math.round(percentage * 3.4));
  const maxPred = Math.min(380, Math.round(percentage * 3.8));

  return {
    id: `mock-attempt-${Date.now()}`,
    examTitle,
    curriculumVersionId,
    paperId,
    dateAttempted: new Date().toISOString().split('T')[0],
    timeSpentSeconds,
    totalMarks,
    marksObtained: finalMarks,
    percentage,
    negativeMarksLost: Math.round(negativeMarksLost * 100) / 100,
    correctCount,
    wrongCount,
    unattemptedCount,
    easyQuestionsLost,
    carelessMistakesCount,
    conceptualMistakesCount,
    predictedFinalExamScoreRange: `${minPred} – ${maxPred} / 400`,
    remediationPlanGenerated: true
  };
}
