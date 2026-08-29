import { describe, it, expect } from 'vitest';
import { 
  getCurriculumVersion, 
  getPaperById, 
  getQuestionsBySubject,
  CA_FOUNDATION_QUESTION_BANK,
  CA_FOUNDATION_FLASHCARDS 
} from '../services/caCurriculumService';
import { 
  CA_TERMINOLOGY_GLOSSARY, 
  getGlossaryTermsBySubject, 
  searchGlossary 
} from '../services/caTerminologyGlossary';
import { orchestrateTutorResponse } from '../services/caTutorOrchestrator';
import { 
  generateDailyStudyPlan, 
  calculateDaysRemaining, 
  calculateMasteryStatus, 
  calculateNextSpacedRepetitionDate,
  calculateExamReadiness 
} from '../services/caStudyPlanEngine';
import { 
  evaluateLawAnswer, 
  evaluateMockExamSubmission 
} from '../services/caEvaluationEngine';

describe('CA Foundation Bilingual AI Tutor Module', () => {
  
  it('loads authentic CA Foundation September 2026 curriculum with all 4 papers', () => {
    const curriculum = getCurriculumVersion('CA_FOUNDATION_SEP_2026');
    expect(curriculum).toBeDefined();
    expect(curriculum.papers.length).toBe(4);

    const paper1 = getPaperById('paper-1');
    expect(paper1?.title).toBe('Accounting');
    expect(paper1?.isObjective).toBe(false);

    const paper2 = getPaperById('paper-2');
    expect(paper2?.title).toBe('Business Laws');
    expect(paper2?.isObjective).toBe(false);

    const paper3 = getPaperById('paper-3');
    expect(paper3?.title).toBe('Quantitative Aptitude');
    expect(paper3?.isObjective).toBe(true);
    expect(paper3?.negativeMarkingPerWrong).toBe(0.25);

    const paper4 = getPaperById('paper-4');
    expect(paper4?.title).toBe('Business Economics');
    expect(paper4?.isObjective).toBe(true);
    expect(paper4?.negativeMarkingPerWrong).toBe(0.25);
  });

  it('maintains ICAI terminology glossary with bilingual definitions and do-not-translate safeguards', () => {
    expect(CA_TERMINOLOGY_GLOSSARY.length).toBeGreaterThanOrEqual(10);

    const brsTerm = CA_TERMINOLOGY_GLOSSARY.find((t) => t.id === 'term-acc-brs');
    expect(brsTerm).toBeDefined();
    expect(brsTerm?.doNotTranslate).toBe(true);
    expect(brsTerm?.malayalamTerm).toContain('ബാങ്ക് റികൺസിലിയേഷൻ');

    const considerationTerm = CA_TERMINOLOGY_GLOSSARY.find((t) => t.id === 'term-law-consideration');
    expect(considerationTerm?.definitionEn).toContain('Quid Pro Quo');

    const searchResults = searchGlossary('Consideration');
    expect(searchResults.length).toBeGreaterThanOrEqual(1);
  });

  it('orchestrates Socratic and bilingual responses for Bank Reconciliation Statement (BRS)', () => {
    const socraticResp = orchestrateTutorResponse({
      query: 'Why do we add outstanding cheques in BRS?',
      tutorMode: 'socratic',
      languageMode: 'ml-en',
      currentSubjectId: 'paper-1'
    });

    expect(socraticResp.tutorMode).toBe('socratic');
    expect(socraticResp.answerManglish).toContain('Cash Book');
    expect(socraticResp.whiteboardActions.length).toBeGreaterThanOrEqual(1);
    expect(socraticResp.whiteboardActions[0].type).toBe('workingNote');
  });

  it('orchestrates Business Law case analysis with Chinnaya v. Ramayya precedent on whiteboard', () => {
    const lawResp = orchestrateTutorResponse({
      query: 'Can a stranger to consideration sue under Indian Contract Act?',
      tutorMode: 'teachMe',
      languageMode: 'ml-en',
      currentSubjectId: 'paper-2'
    });

    expect(lawResp.conceptIds).toContain('c-law-consideration');
    expect(lawResp.answerEn).toContain('Chinnaya v. Ramayya');
    expect(lawResp.answerMl).toContain('ചിന്നയ്യ');
    expect(lawResp.whiteboardActions[0].type).toBe('lawProvisionMap');
  });

  it('evaluates subjective Business Law answers using rule-based rubric marking', () => {
    const lawQuestion = CA_FOUNDATION_QUESTION_BANK.find((q) => q.id === 'q-law-cont-1')!;
    
    // Good student answer citing Section 2(d) and Chinnaya case
    const goodAnswer = 'Under Section 2(d) of Indian Contract Act 1872, consideration can move from any other person as held in Chinnaya v. Ramayya. Therefore stranger to consideration can sue and the daughter must pay.';
    const evalGood = evaluateLawAnswer(goodAnswer, lawQuestion);
    expect(evalGood.scoreObtained).toBeGreaterThanOrEqual(5);
    expect(evalGood.keywordsFound).toContain('Section 2(d)');
    expect(evalGood.keywordsFound).toContain('Chinnaya v. Ramayya');

    // Poor answer missing citations
    const poorAnswer = 'Yes she has to pay money.';
    const evalPoor = evaluateLawAnswer(poorAnswer, lawQuestion);
    expect(evalPoor.scoreObtained).toBeLessThanOrEqual(2);
    expect(evalPoor.keywordsMissing.length).toBeGreaterThan(2);
  });

  it('evaluates mock exams with strict ICAI negative marking (-0.25 marks penalty)', () => {
    const mockQuestions = CA_FOUNDATION_QUESTION_BANK;
    
    // Student answers 1 correctly (q-eco-el-1 option 0) and 1 wrong (q-qa-tvm-1 option 1 instead of 0)
    const answers: Record<string, any> = {
      'q-eco-el-1': 0, // Correct (+1 mark)
      'q-qa-tvm-1': 1  // Wrong (-0.25 mark penalty)
    };

    const mockResult = evaluateMockExamSubmission({
      examTitle: 'Unit Test Mock',
      curriculumVersionId: 'CA_FOUNDATION_SEP_2026',
      answers,
      questions: mockQuestions,
      timeSpentSeconds: 600,
      negativeMarkRate: 0.25
    });

    expect(mockResult.correctCount).toBeGreaterThanOrEqual(1);
    expect(mockResult.wrongCount).toBeGreaterThanOrEqual(1);
    expect(mockResult.negativeMarksLost).toBe(0.25);
    expect(mockResult.predictedFinalExamScoreRange).toBeDefined();
  });

  it('calculates adaptive study plans, spaced repetition, and exam readiness scores', () => {
    const days = calculateDaysRemaining('2026-09-15');
    expect(days).toBeGreaterThan(0);

    const studyPlan = generateDailyStudyPlan({
      name: 'Test Student',
      targetExamDate: '2026-09-15',
      dailyAvailableHours: 4
    });

    expect(studyPlan.schedule.length).toBe(4);
    expect(studyPlan.totalTargetMinutes).toBe(240);

    // Spaced repetition progression: 0 -> 1 -> 3 -> 7 -> 14 -> 30 days
    const next1 = calculateNextSpacedRepetitionDate(0, true);
    expect(next1.nextInterval).toBe(1);

    const next2 = calculateNextSpacedRepetitionDate(1, true);
    expect(next2.nextInterval).toBe(3);

    const wrongRecall = calculateNextSpacedRepetitionDate(14, false);
    expect(wrongRecall.nextInterval).toBe(1); // resets to 1 day on error

    const readiness = calculateExamReadiness([]);
    expect(readiness.overallScore).toBeGreaterThanOrEqual(70);
    expect(readiness.predictedMarksRange).toContain('400');
  });

});
