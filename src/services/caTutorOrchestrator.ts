import { 
  TutorMode, 
  LanguageMode, 
  TutorResponse, 
  PaperId, 
  WhiteboardAction,
  StudentProfile 
} from '../types/caTutor';
import { CA_TERMINOLOGY_GLOSSARY } from './caTerminologyGlossary';
import { CA_FOUNDATION_QUESTION_BANK } from './caCurriculumService';

export interface AskTutorParams {
  query: string;
  tutorMode?: TutorMode;
  languageMode?: LanguageMode;
  currentSubjectId?: PaperId;
  currentChapterTitle?: string;
  currentLessonTitle?: string;
  videoTimestampSeconds?: number;
  studentProfile?: Partial<StudentProfile>;
  recentMistakeContext?: string;
}

export function orchestrateTutorResponse(params: AskTutorParams): TutorResponse {
  const mode = params.tutorMode || 'teachMe';
  const lang = params.languageMode || 'ml-en';
  const query = (params.query || '').trim().toLowerCase();
  const subjectId = params.currentSubjectId || 'paper-1';

  // 1. Check for specific accounting topics (BRS, Journal, Depreciation)
  if (query.includes('brs') || query.includes('bank reconciliation') || query.includes('cheque') || query.includes('pass book') || query.includes('cash book')) {
    return handleBRSQuery(query, mode, lang);
  }

  // 2. Check for Business Law topics (Consideration, Contract, Coercion)
  if (query.includes('consideration') || query.includes('contract') || query.includes('quid pro quo') || query.includes('chinnaya') || query.includes('privity')) {
    return handleContractLawQuery(query, mode, lang);
  }

  // 3. Check for Quantitative Aptitude / Math topics (Annuity, Time Value, Interest)
  if (query.includes('annuity') || query.includes('time value') || query.includes('future value') || query.includes('interest') || query.includes('compound')) {
    return handleMathAnnuityQuery(query, mode, lang);
  }

  // 4. Check for Economics topics (Elasticity, Demand, Supply, Market)
  if (query.includes('elasticity') || query.includes('demand') || query.includes('supply') || query.includes('monopoly') || query.includes('curve')) {
    return handleEconomicsQuery(query, mode, lang);
  }

  // 5. Default General Socratic / Bilingual Response for the selected subject
  return handleGeneralTutorQuery(params, mode, lang);
}

function handleBRSQuery(query: string, mode: TutorMode, lang: LanguageMode): TutorResponse {
  const whiteboard: WhiteboardAction[] = [
    {
      id: 'wb-brs-1',
      type: 'workingNote',
      title: 'Bank Reconciliation Statement (BRS) Working Rule',
      data: {
        startingPoint: 'Balance as per Cash Book (Debit / Favorable)',
        rules: [
          { item: 'Cheques issued but not yet presented for payment', action: 'ADD (+)', reason: 'Cash book balance was reduced upon issuing, but bank balance remains higher.' },
          { item: 'Direct deposits made by customers into bank', action: 'ADD (+)', reason: 'Bank passbook increased, but cash book was unaware.' },
          { item: 'Cheques deposited/paid in but not cleared/credited', action: 'LESS (-)', reason: 'Cash book balance was increased, but bank has not yet credited.' },
          { item: 'Bank charges debited by bank', action: 'LESS (-)', reason: 'Bank passbook balance reduced, cash book unadjusted.' }
        ]
      }
    }
  ];

  if (mode === 'socratic') {
    return {
      answerEn: 'A cheque of ₹25,000 was issued to a supplier yesterday. The supplier has not yet gone to the bank to deposit it.\n\nBefore we write the BRS, think about this:\nDid you already reduce this amount in your Cash Book? And has the bank reduced it from your account yet? Which balance is higher right now?',
      answerMl: 'നാം 25,000 രൂപയുടെ ഒരു ചെക്ക് നൽകി. എന്നാൽ ആ വ്യക്തി ബാങ്കിൽ പോയി പണം ഇതുവരെ വാങ്ങിയിട്ടില്ല.\n\nBRS തയ്യാറാക്കുന്നതിന് മുൻപ് ആലോചിച്ചു നോക്കൂ:\nനമ്മുടെ ക്യാഷ് ബുക്കിൽ നാം ഈ തുക കുറച്ചിട്ടുണ്ടോ? ബാങ്ക് ഇത് അക്കൗണ്ടിൽ നിന്ന് കുറച്ചിട്ടുണ്ടോ? ഇപ്പോൾ ഏത് ബുക്കിലെ ബാലൻസ് ആണ് കൂടുതൽ ഉള്ളത്?',
      answerManglish: 'Cheque issue cheythappol nammal Cash Book il minus cheythu, pakshe bank il ninnu cash poyittilla. So ipol Pass Book balance aanu kooduthal. Therefore Cash Book il ninnu start cheythal ADD cheyyano LESS cheyyano?',
      spokenAudioText: 'Cheque issue cheythappol nammal Cash bookil minus cheythu. Pakshe bankil cash poyittilla. So Pass Book balance kooduthal aanu. Namukku ith BRS il ADD cheyyam.',
      tutorMode: 'socratic',
      conceptIds: ['c-acc-brs-timing'],
      whiteboardActions: whiteboard,
      suggestedFollowUps: ['Yes, Pass Book is higher -> So we ADD', 'Explain Overdraft BRS rules', 'Show me a full ICAI numerical example'],
      suggestedPracticeQuestionIds: ['q-acc-brs-1'],
      confidence: 0.99,
      sourceCitations: [{ title: 'ICAI Study Material Paper 1: Accounting', reference: 'Chapter 2: Bank Reconciliation Statement' }]
    };
  }

  if (mode === 'examTutor') {
    return {
      answerEn: '🎯 **ICAI Examination Presentation for BRS (5 to 10 Marks):**\n\n1. **Heading:** "Bank Reconciliation Statement as on [Date]"\n2. **Particulars Format:** Two-column (+ / -) or Inner/Outer Amount Column format.\n3. **Key Marks Rule:** Always mention whether the starting and final balances are Debit (Favorable) or Credit (Overdraft).\n4. **Common Trap:** Deducting bank charges twice or confusing Cash Book Dr with Pass Book Dr (which is Overdraft).',
      answerMl: '🎯 **BRS പരീക്ഷാ രീതി (5 മുതൽ 10 മാർക്ക്):**\n\n1. ശരിയായ ഹെഡിംഗും തീയതിയും എഴുതുക.\n2. ക്യാഷ് ബുക്കിലെ ഡെബിറ്റ് എന്നാൽ ഫേവറബിൾ ബാലൻസ് ആണ്, എന്നാൽ പാസ്സ് ബുക്കിലെ ഡെബിറ്റ് എന്നാൽ ഓവർഡ്രാഫ്റ്റ് (മൈനസ്) ആണ്.\n3. സ്റ്റെപ്പ് മാർക്കിംഗ് ഉള്ളതിനാൽ ഫോർമാറ്റും കാൽക്കുലേഷനും കൃത്യമായി ചെയ്യുക.',
      answerManglish: 'Examil BRS 10 marks nu vararundu. Cash book Dr = Favorable, Pass book Dr = Overdraft. Heading and format crct aayi ezhuthiyaal full marks score cheyyam.',
      spokenAudioText: 'BRS examination presentationil Cash book debit favorable balance aanu. Pass book debit overdraft aanu.',
      tutorMode: 'examTutor',
      conceptIds: ['c-acc-brs-timing'],
      whiteboardActions: whiteboard,
      suggestedFollowUps: ['Show step-by-step exam answer', 'Practice 10-mark BRS problem'],
      suggestedPracticeQuestionIds: ['q-acc-brs-1'],
      confidence: 0.98,
      sourceCitations: [{ title: 'ICAI Suggested Answers & Evaluation Rubric', reference: 'Accounting Paper 1' }]
    };
  }

  // Default bilingual/manglish explanation
  return {
    answerEn: 'Bank Reconciliation Statement (BRS) is prepared to reconcile the difference between the balance shown in the Cash Book (Bank Column) and the Bank Pass Book on a particular date.\n\nMain Causes of Difference:\n1. **Timing Differences:** Cheques issued but not presented; cheques deposited but not cleared.\n2. **Transactions Recorded by Bank Directly:** Bank interest credited, bank charges debited, direct customer transfers.\n3. **Errors & Omissions:** In Cash Book or Pass Book.',
    answerMl: 'ബാങ്ക് റികൺസിലിയേഷൻ സ്റ്റേറ്റ്‌മെന്റ് (BRS) എന്നത് നമ്മുടെ ക്യാഷ് ബുക്കിലെ ബാങ്ക് കോളവും ബാങ്ക് പാസ്സ് ബുക്കും തമ്മിലുള്ള ബാലൻസിലെ വ്യത്യാസങ്ങൾ കണ്ടെത്തി ഒത്തുനോക്കുന്നതിനായി തയ്യാറാക്കുന്ന പട്ടികയാണ്.\n\nപ്രധാന കാരണങ്ങൾ:\n1. **സമയവ്യത്യാസം:** നൽകിയ ചെക്കുകൾ ബാങ്കിൽ ഹാജരാക്കാത്തത്, നിക്ഷേപിച്ച ചെക്കുകൾ ക്രെഡിറ്റ് ആകാത്തത്.\n2. **ബാങ്ക് നേരിട്ട് ചെയ്ത ഇടപാടുകൾ:** ബാങ്ക് ചാർജുകൾ, പലിശ, കസ്റ്റമർ നേരിട്ട് അടച്ച പണം.',
    answerManglish: 'Simple aayi paranjaal, business-il nammal maintain cheyyunna Cash book-um bank records maintain cheyyunna Pass book-um thammil date and timing difference kaaranam balance difference varum. Aa difference reconcile cheyyanaanu BRS use cheyyunnath.',
    spokenAudioText: 'Bank Reconciliation Statement ennal Cash book-um Pass book-um thammilulla balance difference reconcile cheyyan prepare cheyyunna statement aanu.',
    tutorMode: mode,
    conceptIds: ['c-acc-brs-timing'],
    whiteboardActions: whiteboard,
    suggestedFollowUps: ['Explain with simple everyday example', 'Show Journal entry', 'Ask me a quiz question'],
    suggestedPracticeQuestionIds: ['q-acc-brs-1'],
    confidence: 0.99,
    sourceCitations: [{ title: 'ICAI Study Material Paper 1: Accounting', reference: 'Chapter 2: BRS' }]
  };
}

function handleContractLawQuery(query: string, mode: TutorMode, lang: LanguageMode): TutorResponse {
  const whiteboard: WhiteboardAction[] = [
    {
      id: 'wb-law-1',
      type: 'lawProvisionMap',
      title: 'Indian Contract Act, 1872 — Consideration (Sec 2(d)) & Privity Rules',
      data: {
        provision: 'Section 2(d) of Indian Contract Act, 1872',
        legalPrinciple: 'Consideration must move at the desire of the Promisor, but may move from Promisee or "Any other Person".',
        distinction: [
          { concept: 'Stranger to Consideration', rule: 'CAN SUE in India (Chinnaya v. Ramayya)', status: 'Valid' },
          { concept: 'Stranger to Contract (Privity)', rule: 'CANNOT SUE (Dunlop Pneumatic v. Selfridge)', status: 'General Rule' }
        ],
        exceptionsToNoConsideration: [
          'Natural Love and Affection (Sec 25(1)) in writing and registered between near relations.',
          'Compensation for Past Voluntary Services (Sec 25(2)).',
          'Promise to pay a Time-Barred Debt (Sec 25(3)) signed by debtor.'
        ]
      }
    }
  ];

  return {
    answerEn: 'In Contract Law, **Consideration** is defined under Section 2(d) as "Quid Pro Quo" (something in return). An agreement without consideration is void (Sec 25), with specific exceptions.\n\n**Key Rule for CA Exam:**\n1. **Stranger to Consideration CAN sue in India:** Consideration can proceed from a third party (Chinnaya v. Ramayya).\n2. **Stranger to Contract CANNOT sue:** Only parties to the contract have rights under the doctrine of Privity of Contract.',
    answerMl: 'ഇന്ത്യൻ കരാർ നിയമം 1872 സെക്ഷൻ 2(d) പ്രകാരം **പ്രതിഫലം (Consideration)** എന്നാൽ "Quid Pro Quo" (പകരമായി ലഭിക്കുന്ന മൂല്യമുള്ള എന്തെങ്കിലും) ആണ്. പ്രതിഫലമില്ലാത്ത കരാറുകൾ അസാധുവാണ് (Sec 25).\n\n**പ്രധാന പരീക്ഷാ പോയിന്റുകൾ:**\n1. **പ്രതിഫലത്തിലെ അപരിചിതന് കേസ് കൊടുക്കാം:** പ്രതിഫലം മൂന്നാമതൊരാളിൽ നിന്നും വരാം (ചിന്നയ്യ v. രാമയ്യ കേസ്).\n2. **കരാറിലെ അപരിചിതന് കേസ് കൊടുക്കാനാവില്ല:** കരാറിൽ ഒപ്പിട്ട കക്ഷികൾക്ക് മാത്രമേ അവകാശമുള്ളൂ (Doctrine of Privity of Contract).',
    answerManglish: 'Consideration ennal "Quid Pro Quo" (something in return). Contract valid aavan consideration must aanu. Stranger to consideration nu case kodukkam (Chinnaya v. Ramayya rule), pakshe stranger to contract nu case kodukkan pattilla.',
    spokenAudioText: 'Consideration ennal Quid Pro Quo aanu. Stranger to consideration can sue under Section 2 d of Indian Contract Act.',
    tutorMode: mode,
    conceptIds: ['c-law-consideration'],
    whiteboardActions: whiteboard,
    suggestedFollowUps: ['Explain Chinnaya v. Ramayya case facts', 'What are exceptions to Section 25?', 'Give me an exam case study problem'],
    suggestedPracticeQuestionIds: ['q-law-cont-1'],
    confidence: 0.98,
    sourceCitations: [{ title: 'ICAI Study Material Paper 2: Business Laws', reference: 'Chapter 2: Indian Contract Act, 1872' }]
  };
}

function handleMathAnnuityQuery(query: string, mode: TutorMode, lang: LanguageMode): TutorResponse {
  const whiteboard: WhiteboardAction[] = [
    {
      id: 'wb-math-1',
      type: 'formula',
      title: 'Time Value of Money: Annuity Formulas & Calculator Trick',
      data: {
        fvRegularFormula: 'FV = A × [((1 + i)^n - 1) / i]',
        pvRegularFormula: 'PV = A × [(1 - (1 + i)^-n) / i]',
        calculatorShortcut: 'Example: FV for 3 years at 10% on ₹10,000 -> Step 1: 1.10 × = = (shows 1.331) -> Step 2: - 1 -> Step 3: ÷ 0.10 -> Step 4: × 10000 = ₹33,100.'
      }
    }
  ];

  return {
    answerEn: 'An **Annuity** is a series of equal periodic payments made at equal time intervals.\n\n1. **Annuity Regular (Ordinary):** Payment made at the END of each period (e.g. Loans, Recurring Deposits).\n2. **Annuity Due:** Payment made at the BEGINNING of each period (e.g. Rent, Lease).\n\n**Formula:** Future Value = A × [((1+i)^n - 1) / i]',
    answerMl: '**ആന്വിറ്റി (Annuity)** എന്നാൽ നിശ്ചിത ഇടവേളകളിൽ തുല്യമായ തുകകൾ അടയ്ക്കുന്നതോ ലഭിക്കുന്നതോ ആയ സമ്പ്രദായമാണ്.\n\n1. **ആന്വിറ്റി റെഗുലർ:** ഓരോ കാലയളവിന്റെയും അവസാനം അടയ്ക്കുന്നത് (ഉദാഹരണത്തിന് ലോൺ EMI, ബാങ്ക് നിക്ഷേപം).\n2. **ആന്വിറ്റി ഡ്യൂ:** കാലയളവിന്റെ തുടക്കത്തിൽ അടയ്ക്കുന്നത് (ഉദാഹരണത്തിന് വീട്ടുവാടക).\n\nസൂത്രവാക്യം: FV = A × [((1+i)^n - 1) / i]',
    answerManglish: 'Annuity ennal equal intervals il equal amount pay cheyyunnathaanu. Regular annuity period-inte end il aanu pay cheyyuka. Annuity Due start il aanu pay cheyyuka. Calculator shortcuts use cheythaal 30 seconds il answer kandupidikkaam.',
    spokenAudioText: 'Annuity ennal equal periodic payments aanu. Time Value of Money il Annuity regular and Annuity due formulas examil repeated aayi varum.',
    tutorMode: mode,
    conceptIds: ['c-qa-tvm-annuity'],
    whiteboardActions: whiteboard,
    suggestedFollowUps: ['Show calculator shortcut for Present Value', 'Practice 2-minute timed question', 'Explain Sinking Fund'],
    suggestedPracticeQuestionIds: ['q-qa-tvm-1'],
    confidence: 0.99,
    sourceCitations: [{ title: 'ICAI Study Material Paper 3: Quantitative Aptitude', reference: 'Chapter 2: Mathematics of Finance' }]
  };
}

function handleEconomicsQuery(query: string, mode: TutorMode, lang: LanguageMode): TutorResponse {
  const whiteboard: WhiteboardAction[] = [
    {
      id: 'wb-eco-1',
      type: 'economicCurve',
      title: 'Price Elasticity of Demand (Ep) Curve & Total Outlay Relation',
      data: {
        curveType: 'Demand',
        xLabel: 'Quantity Demanded (Q)',
        yLabel: 'Price (P)',
        elasticityCategories: [
          { ep: 'Ep = 0', name: 'Perfectely Inelastic (Vertical Curve)', example: 'Life-saving medicines' },
          { ep: 'Ep < 1', name: 'Relatively Inelastic (Steep Curve)', example: 'Necessities like Salt' },
          { ep: 'Ep = 1', name: 'Unitary Elastic (Rectangular Hyperbola)', example: 'Normal goods' },
          { ep: 'Ep > 1', name: 'Relatively Elastic (Flatter Curve)', example: 'Luxury goods' },
          { ep: 'Ep = ∞', name: 'Perfectely Elastic (Horizontal Curve)', example: 'Perfect Competition' }
        ]
      }
    }
  ];

  return {
    answerEn: '**Price Elasticity of Demand (Ep)** measures the responsiveness of the quantity demanded of a good to a change in its price.\n\nFormula: Ep = (% Change in Quantity Demanded) / (% Change in Price)\n\n**Total Outlay Rule for Exams:**\n- If Price and Total Outlay move in **opposite directions** -> Demand is Elastic (Ep > 1).\n- If Price and Total Outlay move in **same direction** -> Demand is Inelastic (Ep < 1).\n- If Total Outlay remains **constant** -> Demand is Unitary Elastic (Ep = 1).',
    answerMl: '**ഡിമാൻഡിന്റെ വില ഇലാസ്തികത (Price Elasticity)** എന്നാൽ ഒരു സാധനത്തിന്റെ വിലയിലുണ്ടാകുന്ന മാറ്റത്തിന് അനുസൃതമായി അതിന്റെ ഡിമാൻഡിൽ ഉണ്ടാകുന്ന മാറ്റത്തിന്റെ തോതാണ്.\n\nസൂത്രവാക്യം: Ep = (ഡിമാൻഡിലെ മാറ്റം %) / (വിലയിലെ മാറ്റം %)\n\n**പരീക്ഷാ കുറുക്കുവഴി:** വിലയും ആകെ ചെലവും പരസ്പരം വിപരീത ദിശയിൽ മാറുകയാണെങ്കിൽ ഡിമാൻഡ് ഇലാസ്റ്റിക് (Ep > 1) ആണ്.',
    answerManglish: 'Price kurayumbol Quantity demand koodum ennaanu Law of Demand parayunnath. Pakshe ethra percent koodum ennu measure cheyyunnathaanu Price Elasticity of Demand. Ep greater than 1 aanel demand elastic aanu.',
    spokenAudioText: 'Price Elasticity of Demand ennal priceil ulla changenu anusarichu quantity demanded ethra respond cheyyunnu ennullathaanu.',
    tutorMode: mode,
    conceptIds: ['c-eco-elasticity'],
    whiteboardActions: whiteboard,
    suggestedFollowUps: ['Explain Income Elasticity and Cross Elasticity', 'Show Total Outlay curve', 'Solve MCQ on Elasticity'],
    suggestedPracticeQuestionIds: ['q-eco-el-1'],
    confidence: 0.99,
    sourceCitations: [{ title: 'ICAI Study Material Paper 4: Business Economics', reference: 'Chapter 2: Theory of Demand & Supply' }]
  };
}

function handleGeneralTutorQuery(params: AskTutorParams, mode: TutorMode, lang: LanguageMode): TutorResponse {
  return {
    answerEn: `Hello! I am your AI CA Foundation Tutor. I am here to guide you step-by-step through Paper 1 (Accounting), Paper 2 (Business Laws), Paper 3 (Quantitative Aptitude), and Paper 4 (Business Economics).\n\nHow can I help you today? You can ask a concept, request a whiteboard explanation, or try a practice problem.`,
    answerMl: `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ സി.എ ഫൗണ്ടേഷൻ എ.ഐ ട്യൂട്ടറാണ്. അക്കൗണ്ടിംഗ്, ബിസിനസ്സ് നിയമങ്ങൾ, ഗണിതം, ഇക്കണോമിക്സ് എന്നീ വിഷയങ്ങളിൽ നിങ്ങളെ സഹായിക്കാൻ ഞാൻ സദാ സന്നദ്ധനാണ്.\n\nഎന്താണ് ഇന്ന് നാം പഠിക്കാൻ ആഗ്രഹിക്കുന്നത്? സംശയങ്ങൾ ചോദിക്കാനും വൈറ്റ്ബോർഡിൽ കണക്കുകൾ ചെയ്തു പഠിക്കാനും സാധിക്കും.`,
    answerManglish: `Namaskaram! Njan ningalude personal CA Foundation AI Tutor aanu. Accounting, Law, Maths, Economics topics enikku English-lum Malayalam-lum Manglish-lum explain cheyyan sadhikkum. What would you like to learn today?`,
    spokenAudioText: 'Namaskaram! Njan ningalude CA Foundation AI Tutor aanu. Enthekilum doubt undo? Njan ippol thanne explain cheyyaam.',
    tutorMode: mode,
    conceptIds: [],
    whiteboardActions: [],
    suggestedFollowUps: ['Teach me Bank Reconciliation Statement', 'Explain Consideration in Contract Law', 'Give me Quantitative Aptitude shortcuts', 'Take a 5-minute Oral Viva'],
    confidence: 0.95,
    sourceCitations: [{ title: 'ICAI Official CA Foundation Study Material', reference: '2026 Edition' }]
  };
}
