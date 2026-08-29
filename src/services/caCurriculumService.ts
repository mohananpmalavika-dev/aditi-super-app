import { 
  CurriculumVersion, 
  CurriculumVersionId, 
  CAPaper, 
  PaperId, 
  Chapter, 
  Lesson, 
  Concept, 
  CAQuestion, 
  Flashcard 
} from '../types/caTutor';

export const CA_FOUNDATION_CURRICULUM_VERSIONS: CurriculumVersion[] = [
  {
    id: 'CA_FOUNDATION_SEP_2026',
    name: 'CA Foundation — September 2026 Attempt',
    nameMalayalam: 'സി.എ ഫൗണ്ടേഷൻ — സെപ്റ്റംബർ 2026 പരീക്ഷ',
    examMonth: 'September',
    examYear: 2026,
    examDateTarget: '2026-09-15',
    status: 'Active',
    papers: [
      {
        id: 'paper-1',
        paperNumber: 1,
        title: 'Accounting',
        titleMalayalam: 'അക്കൗണ്ടിംഗ് (പേപ്പർ 1)',
        totalMarks: 100,
        isObjective: false,
        negativeMarkingPerWrong: 0,
        durationHours: 3,
        icon: 'BookOpen',
        color: 'from-blue-600 to-cyan-700',
        chapters: [
          {
            id: 'p1-ch1',
            chapterNumber: 1,
            title: 'Theoretical Framework & Accounting Process',
            titleMalayalam: 'അക്കൗണ്ടിംഗ് സിദ്ധാന്തങ്ങളും അടിസ്ഥാന പ്രക്രിയയും',
            subjectId: 'paper-1',
            weightageMarks: 15,
            estimatedHours: 8,
            lessons: [
              {
                id: 'p1-ch1-l1',
                title: 'Introduction to Accounting Concepts, Principles & Conventions',
                titleMalayalam: 'അക്കൗണ്ടിംഗ് ആശയങ്ങളും അടിസ്ഥാന തത്വങ്ങളും',
                chapterId: 'p1-ch1',
                subjectId: 'paper-1',
                durationMinutes: 45,
                facultyName: 'CA Praveen Kumar, FCA',
                facultyDesignation: 'Senior Faculty in Financial Accounting',
                conceptIds: ['c-acc-framework', 'c-acc-double-entry'],
                checkpoints: [
                  {
                    id: 'cp-p1-1',
                    timestampSeconds: 320,
                    question: 'Under which accounting convention are all anticipated losses recorded but anticipated profits ignored?',
                    questionMalayalam: 'പ്രതീക്ഷിക്കുന്ന നഷ്ടങ്ങൾ കണക്കിലെടുക്കുകയും എന്നാൽ ഭാവിയിലെ ലാഭം ഒഴിവാക്കുകയും ചെയ്യുന്ന അക്കൗണ്ടിംഗ് രീതി ഏതാണ്?',
                    options: ['Prudence / Conservatism Convention', 'Going Concern Concept', 'Matching Concept', 'Materiality Convention'],
                    correctOptionIndex: 0,
                    explanation: 'The Prudence/Conservatism convention mandates that profits should not be anticipated, but provision must be made for all known losses.',
                    explanationMalayalam: 'കൺസർവേറ്റിസം തത്വം അനുസരിച്ച് ബിസിനസ്സിൽ പ്രതീക്ഷിക്കുന്ന എല്ലാ നഷ്ടങ്ങൾക്കും മുൻകൂട്ടി കരുതലുകൾ ചെയ്യണം, എന്നാൽ ലാഭം ഉറപ്പാകുന്നതുവരെ രേഖപ്പെടുത്തരുത്.'
                  }
                ],
                notesEn: 'Accounting Concepts: Entity, Money Measurement, Going Concern, Periodicity, Accrual, Matching, Realisation.',
                notesMl: 'അക്കൗണ്ടിംഗ് തത്വങ്ങൾ: ബിസിനസ് എന്റിറ്റി, പണത്തിൽ അളക്കാവുന്ന കാര്യങ്ങൾ മാത്രം രേഖപ്പെടുത്തൽ, തുടർന്നുപോകുന്ന സ്ഥാപനം (Going Concern), അക്രൂവൽ രീതി.',
                notesManglish: 'Business Entity Concept prakaram owners and business separate entities aanu. Matching principle revenue and expenses match cheyyan use cheyyunnu.',
                transcript: []
              }
            ],
            concepts: [
              {
                id: 'c-acc-framework',
                name: 'Accounting Principles & Conventions',
                nameMalayalam: 'അക്കൗണ്ടിംഗ് തത്വങ്ങൾ',
                subjectId: 'paper-1',
                chapterId: 'p1-ch1',
                importanceWeight: 'Essential',
                examFrequency: 'Every Attempt',
                summaryEn: 'Core rules governing financial statement preparation (Going Concern, Consistency, Accrual).',
                summaryMl: 'സാമ്പത്തിക രേഖകൾ തയ്യാറാക്കുന്നതിനുള്ള അടിസ്ഥാന തത്വങ്ങൾ (തുടർച്ച, സ്ഥിരത, അക്രൂവൽ).',
                summaryManglish: 'Financial statements prepare cheyyan ulla base rules aanu Accounting principles.'
              }
            ]
          },
          {
            id: 'p1-ch2',
            chapterNumber: 2,
            title: 'Bank Reconciliation Statement (BRS)',
            titleMalayalam: 'ബാങ്ക് റികൺസിലിയേഷൻ സ്റ്റേറ്റ്‌മെന്റ് (BRS)',
            subjectId: 'paper-1',
            weightageMarks: 12,
            estimatedHours: 6,
            lessons: [
              {
                id: 'p1-ch2-l1',
                title: 'Causes of Differences between Cash Book and Pass Book',
                titleMalayalam: 'ക്യാഷ് ബുക്കും പാസ് ബുക്കും തമ്മിലുള്ള വ്യത്യാസങ്ങൾക്കുള്ള കാരണങ്ങൾ',
                chapterId: 'p1-ch2',
                subjectId: 'paper-1',
                durationMinutes: 50,
                facultyName: 'CA Harikrishnan Menon, ACA',
                facultyDesignation: 'Rankholder CA & Accounting Specialist',
                conceptIds: ['c-acc-brs-timing', 'c-acc-brs-errors'],
                checkpoints: [
                  {
                    id: 'cp-p1-2',
                    timestampSeconds: 450,
                    question: 'A cheque of ₹25,000 was issued but not yet presented. If we start from Cash Book debit balance, what is the adjustment in BRS?',
                    questionMalayalam: '25,000 രൂപയുടെ ചെക്ക് നൽകി, എന്നാൽ ബാങ്കിൽ ഹാജരാക്കിയില്ല. ക്യാഷ് ബുക്ക് ബാലൻസിൽ നിന്നാണ് തുടങ്ങുന്നതെങ്കിൽ BRS-ൽ എന്ത് ചെയ്യണം?',
                    options: ['Add ₹25,000', 'Deduct ₹25,000', 'No Adjustment', 'Deduct ₹50,000'],
                    correctOptionIndex: 0,
                    explanation: 'Since Cash Book was reduced upon issuance but Pass Book remains unreduced, to reach Pass Book balance, we must ADD ₹25,000.',
                    explanationMalayalam: 'ചെക്ക് നൽകിയപ്പോൾ ക്യാഷ് ബുക്കിൽ കുറച്ചിരുന്നു, എന്നാൽ ബാങ്കിൽ പണം കുറഞ്ഞിട്ടില്ല. അതിനാൽ പാസ്സ് ബുക്ക് ബാലൻസിലേക്ക് എത്താൻ 25,000 രൂപ കൂട്ടണം (ADD).'
                  }
                ],
                notesEn: 'BRS Rules:\n1. Cheques issued but not presented -> ADD (from favorable Cash Book).\n2. Cheques deposited but not collected -> LESS.\n3. Direct deposit by customer into bank -> ADD.\n4. Bank charges debited by bank -> LESS.\n5. Interest credited by bank -> ADD.',
                notesMl: 'BRS നിയമങ്ങൾ:\n1. നൽകിയതും എന്നാൽ ബാങ്കിൽ വരാത്തതുമായ ചെക്കുകൾ -> ADD (കൂട്ടുക).\n2. ബാങ്കിൽ നിക്ഷേപിച്ചതും ക്രെഡിറ്റ് ആകാത്തതുമായ ചെക്കുകൾ -> LESS (കുറയ്ക്കുക).\n3. കസ്റ്റമർ ബാങ്കിൽ നേരിട്ട് അടച്ച പണം -> ADD.\n4. ബാങ്ക് ചാർജുകൾ -> LESS.\n5. ബാങ്ക് പലിശ -> ADD.',
                notesManglish: 'Cash Book favorable balance il ninnu start cheythal, Pass book balance kooduthal aanel ADD cheyyuka, Pass book kuravanel LESS cheyyuka.',
                transcript: []
              }
            ],
            concepts: [
              {
                id: 'c-acc-brs-timing',
                name: 'Timing Differences in BRS',
                nameMalayalam: 'BRS-ലെ സമയവ്യത്യാസങ്ങൾ',
                subjectId: 'paper-1',
                chapterId: 'p1-ch2',
                importanceWeight: 'Essential',
                examFrequency: 'Every Attempt',
                summaryEn: 'Differences due to time gap between recording in Cash Book and recording by Bank in Pass Book.',
                summaryMl: 'ക്യാഷ് ബുക്കിൽ എഴുതുന്ന സമയവും ബാങ്ക് പാസ്സ് ബുക്കിൽ വരുന്ന സമയവും തമ്മിലുള്ള വ്യത്യാസം.',
                summaryManglish: 'Cheque issue cheythal udan Cash bookil minus cheyyum, pakshe bankil present cheyyumbol mathrame pass bookil minus aavu.'
              }
            ]
          },
          {
            id: 'p1-ch3',
            chapterNumber: 3,
            title: 'Depreciation and Amortization',
            titleMalayalam: 'തേയ്മാനവും മൂല്യനിർണ്ണയവും (Depreciation)',
            subjectId: 'paper-1',
            weightageMarks: 10,
            estimatedHours: 6,
            lessons: [],
            concepts: []
          },
          {
            id: 'p1-ch4',
            chapterNumber: 4,
            title: 'Preparation of Final Accounts of Sole Proprietors',
            titleMalayalam: 'ഫൈനൽ അക്കൗണ്ടുകൾ തയ്യാറാക്കൽ (Trading, P&L, Balance Sheet)',
            subjectId: 'paper-1',
            weightageMarks: 18,
            estimatedHours: 10,
            lessons: [],
            concepts: []
          },
          {
            id: 'p1-ch5',
            chapterNumber: 5,
            title: 'Partnership and LLP Accounts',
            titleMalayalam: 'പാർട്ണർഷിപ്പ് അക്കൗണ്ടുകൾ (Admission, Retirement, Death)',
            subjectId: 'paper-1',
            weightageMarks: 20,
            estimatedHours: 12,
            lessons: [],
            concepts: []
          },
          {
            id: 'p1-ch6',
            chapterNumber: 6,
            title: 'Company Accounts (Issue of Shares & Debentures)',
            titleMalayalam: 'കമ്പനി അക്കൗണ്ടുകൾ (ഓഹരികളും കടപ്പത്രങ്ങളും)',
            subjectId: 'paper-1',
            weightageMarks: 25,
            estimatedHours: 14,
            lessons: [],
            concepts: []
          }
        ]
      },
      {
        id: 'paper-2',
        paperNumber: 2,
        title: 'Business Laws',
        titleMalayalam: 'ബിസിനസ്സ് നിയമങ്ങൾ (പേപ്പർ 2)',
        totalMarks: 100,
        isObjective: false,
        negativeMarkingPerWrong: 0,
        durationHours: 3,
        icon: 'Scale',
        color: 'from-amber-600 to-orange-700',
        chapters: [
          {
            id: 'p2-ch1',
            chapterNumber: 1,
            title: 'Indian Regulatory Framework',
            titleMalayalam: 'ഇന്ത്യൻ നിയമ വ്യവസ്ഥയുടെ ഘടന',
            subjectId: 'paper-2',
            weightageMarks: 10,
            estimatedHours: 4,
            lessons: [],
            concepts: []
          },
          {
            id: 'p2-ch2',
            chapterNumber: 2,
            title: 'The Indian Contract Act, 1872',
            titleMalayalam: 'ഇന്ത്യൻ കരാർ നിയമം 1872 (Indian Contract Act)',
            subjectId: 'paper-2',
            weightageMarks: 30,
            estimatedHours: 16,
            lessons: [
              {
                id: 'p2-ch2-l1',
                title: 'Essentials of a Valid Contract & Consideration (Sec 2(d))',
                titleMalayalam: 'സാധുവായ ഒരു കരാറിന്റെ ഘടകങ്ങളും പ്രതിഫലവും (Consideration)',
                chapterId: 'p2-ch2',
                subjectId: 'paper-2',
                durationMinutes: 55,
                facultyName: 'Adv. S. Lakshmi, LL.M.',
                facultyDesignation: 'Corporate Law Advocate & CA Faculty',
                conceptIds: ['c-law-consideration', 'c-law-free-consent'],
                checkpoints: [
                  {
                    id: 'cp-p2-1',
                    timestampSeconds: 510,
                    question: 'Can consideration in a contract move from a third party stranger to the consideration in India?',
                    questionMalayalam: 'ഇന്ത്യൻ നിയമപ്രകാരം കരാറിലെ പ്രതിഫലം (Consideration) ഒരു മൂന്നാം കക്ഷിയിൽ നിന്ന് വരാമോ?',
                    options: ['Yes (Chinnaya v. Ramayya rule)', 'No, strictly illegal', 'Only with Court permission', 'Only if contract is above ₹1 Lakh'],
                    correctOptionIndex: 0,
                    explanation: 'Under Section 2(d) of Indian Contract Act, consideration may proceed from the promisee or ANY OTHER PERSON (Chinnaya v. Ramayya). Stranger to consideration CAN sue, but stranger to contract cannot.',
                    explanationMalayalam: 'ചിന്നയ്യ v. രാമയ്യ കേസ് വിധി പ്രകാരം പ്രതിഫലം വാഗ്ദാനം സ്വീകരിച്ച ആളിൽ നിന്നോ അല്ലെങ്കിൽ മൂന്നാമതൊരാളിൽ നിന്നോ വരാം.'
                  }
                ],
                notesEn: 'Section 10 Essentials: Offer & Acceptance, Free Consent, Capacity of Parties, Lawful Consideration, Lawful Object, Not expressly declared void.\nRule: Stranger to consideration can sue, but stranger to contract cannot (Privity of Contract).',
                notesMl: 'സാധുവായ കരാറിന്റെ ഘടകങ്ങൾ: ഓഫറും സ്വീകരണവും, സ്വതന്ത്ര സമ്മതം, കരാറിൽ ഏർപ്പെടാനുള്ള യോഗ്യത, നിയമപരമായ പ്രതിഫലം, നിയമപരമായ ഉദ്ദേശ്യം.',
                notesManglish: 'Contract valid aavan consideration (Quid pro quo) must aanu. Stranger to consideration case file cheyyam, pakshe stranger to contract nu case file cheyyan pattilla.',
                transcript: []
              }
            ],
            concepts: [
              {
                id: 'c-law-consideration',
                name: 'Consideration & Privity of Contract',
                nameMalayalam: 'പ്രതിഫലവും കരാറിലെ അവകാശങ്ങളും',
                subjectId: 'paper-2',
                chapterId: 'p2-ch2',
                importanceWeight: 'Essential',
                examFrequency: 'Every Attempt',
                summaryEn: 'Quid Pro Quo (Something in return) under Sec 2(d) and exceptions to "No consideration, no contract" (Sec 25).',
                summaryMl: 'സെക്ഷൻ 2(d) പ്രകാരമുള്ള പ്രതിഫലവും കരാറിലെ പങ്കാളിത്തവും.',
                summaryManglish: 'Section 25 exceptions: Natural love & affection, past voluntary services, time barred debt.'
              }
            ]
          },
          {
            id: 'p2-ch3',
            chapterNumber: 3,
            title: 'The Sale of Goods Act, 1930',
            titleMalayalam: 'വിൽപന നിയമം 1930 (Sale of Goods Act)',
            subjectId: 'paper-2',
            weightageMarks: 20,
            estimatedHours: 10,
            lessons: [],
            concepts: []
          },
          {
            id: 'p2-ch4',
            chapterNumber: 4,
            title: 'The Indian Partnership Act, 1932',
            titleMalayalam: 'ഇന്ത്യൻ പാർട്ണർഷിപ്പ് നിയമം 1932',
            subjectId: 'paper-2',
            weightageMarks: 15,
            estimatedHours: 8,
            lessons: [],
            concepts: []
          },
          {
            id: 'p2-ch5',
            chapterNumber: 5,
            title: 'The Limited Liability Partnership Act, 2008',
            titleMalayalam: 'എൽ.എൽ.പി നിയമം 2008 (LLP Act)',
            subjectId: 'paper-2',
            weightageMarks: 10,
            estimatedHours: 5,
            lessons: [],
            concepts: []
          },
          {
            id: 'p2-ch6',
            chapterNumber: 6,
            title: 'The Companies Act, 2013',
            titleMalayalam: 'കമ്പനി നിയമം 2013 (The Companies Act)',
            subjectId: 'paper-2',
            weightageMarks: 15,
            estimatedHours: 8,
            lessons: [],
            concepts: []
          }
        ]
      },
      {
        id: 'paper-3',
        paperNumber: 3,
        title: 'Quantitative Aptitude',
        titleMalayalam: 'ക്വാണ്ടിറ്റേറ്റീവ് ആപ്റ്റിറ്റ്യൂഡ് (ഗണിതവും സ്റ്റാറ്റിസ്റ്റിക്സും)',
        totalMarks: 100,
        isObjective: true,
        negativeMarkingPerWrong: 0.25,
        durationHours: 2,
        icon: 'Calculator',
        color: 'from-emerald-600 to-teal-700',
        chapters: [
          {
            id: 'p3-ch1',
            chapterNumber: 1,
            title: 'Ratio, Proportion, Indices & Logarithms',
            titleMalayalam: 'അംശബന്ധം, ഇൻഡിസെസ്, ലോഗരിതം',
            subjectId: 'paper-3',
            weightageMarks: 8,
            estimatedHours: 6,
            lessons: [],
            concepts: []
          },
          {
            id: 'p3-ch2',
            chapterNumber: 2,
            title: 'Mathematics of Finance (Time Value of Money)',
            titleMalayalam: 'ഫിനാൻഷ്യൽ കണക്കുകൾ (Time Value of Money - Annuity)',
            subjectId: 'paper-3',
            weightageMarks: 18,
            estimatedHours: 12,
            lessons: [
              {
                id: 'p3-ch2-l1',
                title: 'Simple & Compound Interest, Effective Rate & Annuity Future Value',
                titleMalayalam: 'കൂട്ടുപലിശയും ആന്വിറ്റിയും (Annuity Formulas & Shortcuts)',
                chapterId: 'p3-ch2',
                subjectId: 'paper-3',
                durationMinutes: 45,
                facultyName: 'Prof. K. Anandakrishnan, M.Sc. (Maths)',
                facultyDesignation: 'Quantitative Faculty & Speed Maths Trainer',
                conceptIds: ['c-qa-tvm-annuity'],
                checkpoints: [
                  {
                    id: 'cp-p3-1',
                    timestampSeconds: 380,
                    question: 'If ₹10,000 is invested annually at 10% compound interest per annum for 3 years, what is the Future Value of Annuity Regular?',
                    questionMalayalam: 'പ്രതിവർഷം 10,000 രൂപ വീതം 10% കൂട്ടുപലിശ നിരക്കിൽ 3 വർഷത്തേക്ക് നിക്ഷേപിച്ചാൽ ലഭിക്കുന്ന ആകെ തുക (FV) എത്ര?',
                    options: ['₹33,100', '₹30,000', '₹36,410', '₹31,000'],
                    correctOptionIndex: 0,
                    explanation: 'FV = A × [((1 + i)^n - 1) / i] = 10,000 × [(1.331 - 1) / 0.10] = 10,000 × 3.31 = ₹33,100.',
                    explanationMalayalam: 'സൂത്രവാക്യം: FV = A × [((1 + i)^n - 1) / i] = 10,000 × 3.31 = 33,100 രൂപ.'
                  }
                ],
                notesEn: 'Annuity Formulae:\n1. FV of Annuity Regular = A × [((1+i)^n - 1) / i]\n2. PV of Annuity Regular = A × [(1 - (1+i)^-n) / i]\nCalculator Shortcut: 1.10 × = = ... - 1 ÷ 0.10 × 10000 = 33100.',
                notesMl: 'സൂത്രവാക്യങ്ങൾ: ആന്വിറ്റിയുടെ ഫ്യൂച്ചർ വാല്യൂവും പ്രസന്റ് വാല്യൂവും കണക്കാക്കാൻ കാൽക്കുലേറ്റർ ഷോർട്ട്കട്ട് ഉപയോഗിക്കുക.',
                notesManglish: 'Examil calculator allow cheythittullathukond speed shortcut tricks practice cheyyuka.',
                transcript: []
              }
            ],
            concepts: [
              {
                id: 'c-qa-tvm-annuity',
                name: 'Annuity Regular & Present Value',
                nameMalayalam: 'ആന്വിറ്റി സൂത്രവാക്യങ്ങൾ',
                subjectId: 'paper-3',
                chapterId: 'p3-ch2',
                importanceWeight: 'Essential',
                examFrequency: 'Every Attempt',
                summaryEn: 'High-yield chapter contributing 12-16 marks in every CA Foundation attempt.',
                summaryMl: 'ഓരോ പരീക്ഷയിലും 12 മുതൽ 16 മാർക്ക് വരെ ചോദിക്കുന്ന പ്രധാന ഭാഗം.',
                summaryManglish: 'Time Value of Money paper 3 ile highest scoring chapter aanu.'
              }
            ]
          },
          {
            id: 'p3-ch3',
            chapterNumber: 3,
            title: 'Logical Reasoning (Series, Blood Relations, Seating)',
            titleMalayalam: 'ലോജിക്കൽ റീസണിംഗ് (Blood Relations, Seating Arrangement)',
            subjectId: 'paper-3',
            weightageMarks: 20,
            estimatedHours: 8,
            lessons: [],
            concepts: []
          },
          {
            id: 'p3-ch4',
            chapterNumber: 4,
            title: 'Statistics (Measures of Central Tendency & Dispersion)',
            titleMalayalam: 'സ്റ്റാറ്റിസ്റ്റിക്സ് (ശരാശരിയും വേരിയൻസും)',
            subjectId: 'paper-3',
            weightageMarks: 25,
            estimatedHours: 12,
            lessons: [],
            concepts: []
          }
        ]
      },
      {
        id: 'paper-4',
        paperNumber: 4,
        title: 'Business Economics',
        titleMalayalam: 'ബിസിനസ്സ് ഇക്കണോമിക്സ് (പേപ്പർ 4)',
        totalMarks: 100,
        isObjective: true,
        negativeMarkingPerWrong: 0.25,
        durationHours: 2,
        icon: 'TrendingUp',
        color: 'from-purple-600 to-indigo-700',
        chapters: [
          {
            id: 'p4-ch1',
            chapterNumber: 1,
            title: 'Introduction to Business Economics',
            titleMalayalam: 'ബിസിനസ്സ് ഇക്കണോമിക്സ് ആമുഖം',
            subjectId: 'paper-4',
            weightageMarks: 10,
            estimatedHours: 4,
            lessons: [],
            concepts: []
          },
          {
            id: 'p4-ch2',
            chapterNumber: 2,
            title: 'Theory of Demand and Supply',
            titleMalayalam: 'ഡിമാൻഡും സപ്ലൈയും (Price Elasticity & Consumer Equilibrium)',
            subjectId: 'paper-4',
            weightageMarks: 25,
            estimatedHours: 10,
            lessons: [
              {
                id: 'p4-ch2-l1',
                title: 'Law of Demand, Elasticity of Demand & Indifference Curve',
                titleMalayalam: 'ഡിമാൻഡ് നിയമവും ഇലാസ്തികതയും (Price Elasticity Analysis)',
                chapterId: 'p4-ch2',
                subjectId: 'paper-4',
                durationMinutes: 40,
                facultyName: 'Dr. Mathew Thomas, Ph.D.',
                facultyDesignation: 'Professor of Economics',
                conceptIds: ['c-eco-elasticity'],
                checkpoints: [
                  {
                    id: 'cp-p4-1',
                    timestampSeconds: 310,
                    question: 'When Price Elasticity of Demand (Ep) is greater than 1 (Elastic), what happens to Total Expenditure when price falls?',
                    questionMalayalam: 'ഡിമാൻഡ് ഇലാസ്റ്റിക് (Ep > 1) ആയിരിക്കുമ്പോൾ സാധനത്തിന്റെ വില കുറഞ്ഞാൽ ആകെ ചെലവ് (Total Revenue/Expenditure) എന്ത് സംഭവിക്കും?',
                    options: ['Total Expenditure Increases', 'Total Expenditure Decreases', 'Remains Constant', 'Becomes Zero'],
                    correctOptionIndex: 0,
                    explanation: 'For elastic demand (Ep > 1), percentage change in quantity demanded is greater than percentage change in price, so price reduction leads to higher Total Expenditure.',
                    explanationMalayalam: 'ഡിമാൻഡ് ഇലാസ്റ്റിക് ആയിരിക്കുമ്പോൾ വില കുറയുമ്പോൾ വിൽപ്പന ക്രമാതീതമായി കൂടുകയും ആകെ വരുമാനം വർദ്ധിക്കുകയും ചെയ്യുന്നു.'
                  }
                ],
                notesEn: 'Elasticity Types: Perfectly Inelastic (Ep=0), Inelastic (Ep<1), Unitary (Ep=1), Elastic (Ep>1), Perfectly Elastic (Ep=∞).\nTotal Outlay Method: Inverse relation between Price and Outlay = Elastic.',
                notesMl: 'ഇലാസ്തികത: വില കുറയുമ്പോൾ ആകെ ചെലവ് കൂടുകയാണെങ്കിൽ അത് ഇലാസ്റ്റിക് (Elastic) ആണ്.',
                notesManglish: 'Price kurayumbol Total Revenue koodukayanel demand elastic (Ep > 1) aanu.',
                transcript: []
              }
            ],
            concepts: [
              {
                id: 'c-eco-elasticity',
                name: 'Price Elasticity of Demand',
                nameMalayalam: 'ഡിമാൻഡിന്റെ വില ഇലാസ്തികത',
                subjectId: 'paper-4',
                chapterId: 'p4-ch2',
                importanceWeight: 'Essential',
                examFrequency: 'Every Attempt',
                summaryEn: 'Percentage responsiveness of quantity demanded to price change.',
                summaryMl: 'വിലയിലെ മാറ്റത്തിന് അനുസൃതമായി ഡിമാൻഡിൽ ഉണ്ടാകുന്ന മാറ്റം.',
                summaryManglish: 'Ep = (% change in Qty) / (% change in Price).'
              }
            ]
          },
          {
            id: 'p4-ch3',
            chapterNumber: 3,
            title: 'Theory of Production and Cost',
            titleMalayalam: 'ഉല്പാദനവും ചെലവ് സിദ്ധാന്തങ്ങളും (Short Run & Long Run Costs)',
            subjectId: 'paper-4',
            weightageMarks: 20,
            estimatedHours: 8,
            lessons: [],
            concepts: []
          },
          {
            id: 'p4-ch4',
            chapterNumber: 4,
            title: 'Price Determination in Different Markets',
            titleMalayalam: 'വിവിധ വിപണികളിലെ വില നിർണ്ണയം (Perfect, Monopoly, Oligopoly)',
            subjectId: 'paper-4',
            weightageMarks: 25,
            estimatedHours: 10,
            lessons: [],
            concepts: []
          },
          {
            id: 'p4-ch5',
            chapterNumber: 5,
            title: 'National Income & Business Cycles',
            titleMalayalam: 'ദേശീയ വരുമാനവും ബിസിനസ് സൈക്കിളും',
            subjectId: 'paper-4',
            weightageMarks: 20,
            estimatedHours: 8,
            lessons: [],
            concepts: []
          }
        ]
      }
    ]
  }
];

export const CA_FOUNDATION_QUESTION_BANK: CAQuestion[] = [
  {
    id: 'q-acc-brs-1',
    curriculumVersionId: 'CA_FOUNDATION_SEP_2026',
    subjectId: 'paper-1',
    chapterId: 'p1-ch2',
    conceptIds: ['c-acc-brs-timing'],
    type: 'numerical',
    difficulty: 3,
    marks: 5,
    questionEn: 'On 31st March 2026, the Cash Book of M/s Malabar Traders showed a debit balance of ₹1,45,000. On comparing with Pass Book:\n1. Cheques issued amounting to ₹34,000 had not been presented for payment.\n2. Cheques deposited of ₹28,000 were not credited by bank.\n3. Bank charges of ₹1,200 debited in passbook only.\n4. Direct deposit of ₹15,000 by a customer.\nPrepare Bank Reconciliation Statement and find Pass Book Balance.',
    questionMl: '2026 മാർച്ച് 31-ന് മലബാർ ട്രേഡേഴ്സിന്റെ ക്യാഷ് ബുക്ക് കാണിച്ച ഡെബിറ്റ് ബാലൻസ് ₹1,45,000 ആണ്. പാസ് ബുക്കുമായി ഒത്തുനോക്കിയപ്പോൾ:\n1. നൽകിയ ₹34,000 ന്റെ ചെക്ക് ബാങ്കിൽ ഹാജരാക്കിയിട്ടില്ല.\n2. ബാങ്കിൽ നിക്ഷേപിച്ച ₹28,000 ന്റെ ചെക്ക് ബാങ്ക് ക്രെഡിറ്റ് ചെയ്തിട്ടില്ല.\n3. ₹1,200 ബാങ്ക് ചാർജ്ജ് പാസ് ബുക്കിൽ മാത്രം രേഖപ്പെടുത്തിയിരിക്കുന്നു.\n4. ഒരു കസ്റ്റമർ ബാങ്കിൽ നേരിട്ട് ₹15,000 അടച്ചു.\nബാങ്ക് റികൺസിലിയേഷൻ സ്റ്റേറ്റ്‌മെന്റ് തയ്യാറാക്കി പാസ്സ് ബുക്ക് ബാലൻസ് കണ്ടെത്തുക.',
    solutionEn: 'Bank Reconciliation Statement as on 31st March 2026:\nBalance as per Cash Book (Dr): ₹1,45,000\nADD: Cheques issued but not presented: +₹34,000\nADD: Direct deposit by customer: +₹15,000\nSubtotal: ₹1,94,000\nLESS: Cheques deposited but not credited: -₹28,000\nLESS: Bank charges debited: -₹1,200\nBalance as per Pass Book (Credit / Favorable): ₹1,64,800',
    solutionMl: 'പാസ്സ് ബുക്ക് ബാലൻസ് = ₹1,64,800 (ഫേവറബിൾ ക്രെഡിറ്റ് ബാലൻസ്).',
    solutionManglish: 'Cash book balance 1,45,000 + 34,000 + 15,000 - 28,000 - 1,200 = 1,64,800 (Pass book favorable credit balance).',
    commonTraps: ['Adding bank charges instead of deducting', 'Confusing debit balance of Cash book with overdraft'],
    estimatedMinutes: 8,
    source: 'ICAI Study Material / RTP Practice'
  },
  {
    id: 'q-law-cont-1',
    curriculumVersionId: 'CA_FOUNDATION_SEP_2026',
    subjectId: 'paper-2',
    chapterId: 'p2-ch2',
    conceptIds: ['c-law-consideration'],
    type: 'caseScenario',
    difficulty: 3,
    marks: 6,
    questionEn: 'An elderly mother transferred her entire estate to her daughter with the condition that the daughter must pay an annual annuity of ₹60,000 to her maternal uncle (mother\'s brother). The daughter executed a formal agreement in favor of the uncle promising the annuity. Later, the daughter refused to pay claiming there was no consideration moving from the uncle to her. Decide with reference to the Indian Contract Act, 1872.',
    questionMl: 'ഒരു മാതാവ് തന്റെ സ്വത്തുക്കൾ മുഴുവൻ മകൾക്ക് എഴുതിക്കൊടുത്തു. എന്നാൽ മകൾ മാതൃസഹോദരന് (അമ്മാവന്) പ്രതിവർഷം ₹60,000 നൽകണമെന്ന് വ്യവസ്ഥ വെച്ചു. മകൾ അമ്മാവന് പണം നൽകാമെന്ന് സമ്മതിച്ച് കരാർ എഴുതി നൽകി. പിന്നീട് അമ്മാവനിൽ നിന്ന് തനിക്ക് യാതൊരു പ്രതിഫലവും (Consideration) ലഭിച്ചിട്ടില്ലെന്ന് പറഞ്ഞ് മകൾ പണം നൽകാൻ വിസമ്മതിച്ചു. ഇന്ത്യൻ കരാർ നിയമം 1872 പ്രകാരം അമ്മാവന് മകൾക്കെതിരെ കേസ് നൽകി പണം ഈടാക്കാൻ സാധിക്കുമോ?',
    solutionEn: 'Decision: Yes, the maternal uncle can enforce the agreement and recover the annuity from the daughter.\n\nLegal Principle: Under Section 2(d) of the Indian Contract Act, 1872, consideration may proceed from the promisee or "ANY OTHER PERSON". (Leading Case: Chinnaya v. Ramayya).\nAlthough the uncle did not provide consideration himself, the consideration moved from his sister (the mother) to the daughter. Therefore, a stranger to consideration can maintain a suit in India.',
    solutionMl: 'തീരുമാനം: അമ്മാവന് മകളിൽ നിന്ന് പണം ഈടാക്കാം.\n\nനിയമ തത്വം: സെക്ഷൻ 2(d) പ്രകാരം പ്രതിഫലം മൂന്നാമതൊരാളിൽ നിന്നും വരാം (ചിന്നയ്യ v. രാമയ്യ കേസ് വിധി). അമ്മാവൻ നേരിട്ട് പ്രതിഫലം നൽകിയില്ലെങ്കിലും മാതാവിൽ നിന്നും മകൾക്ക് സ്വത്ത് ലഭിച്ചിട്ടുള്ളതിനാൽ കരാർ സാധുവാണ്.',
    commonTraps: ['Confusing Stranger to Consideration with Stranger to Contract (Privity of Contract)'],
    estimatedMinutes: 10,
    source: 'ICAI Past Exam Benchmark Case'
  },
  {
    id: 'q-qa-tvm-1',
    curriculumVersionId: 'CA_FOUNDATION_SEP_2026',
    subjectId: 'paper-3',
    chapterId: 'p3-ch2',
    conceptIds: ['c-qa-tvm-annuity'],
    type: 'mcq',
    difficulty: 2,
    marks: 1,
    questionEn: 'A person deposits ₹5,000 at the end of each year for 4 years into a recurring account paying 8% compound interest per annum. What is the accumulated amount at the end of 4 years? (Given (1.08)^4 = 1.3605)',
    questionMl: 'പ്രതിവർഷം ₹5,000 വീതം ഓരോ വർഷാവസാനവും 8% കൂട്ടുപലിശ നിരക്കിൽ 4 വർഷത്തേക്ക് നിക്ഷേപിച്ചാൽ അവസാനം ലഭിക്കുന്ന തുക എത്ര?',
    options: ['₹22,531', '₹20,000', '₹25,120', '₹21,600'],
    correctOptionIndex: 0,
    solutionEn: 'FV = A × [((1+i)^n - 1) / i] = 5,000 × [(1.36049 - 1) / 0.08] = 5,000 × 4.5061 = ₹22,531.',
    solutionMl: 'FV = 5,000 × 4.5061 = ₹22,531.',
    commonTraps: ['Using Annuity Due formula instead of Annuity Regular'],
    estimatedMinutes: 2,
    source: 'ICAI Study Material Paper 3'
  },
  {
    id: 'q-eco-el-1',
    curriculumVersionId: 'CA_FOUNDATION_SEP_2026',
    subjectId: 'paper-4',
    chapterId: 'p4-ch2',
    conceptIds: ['c-eco-elasticity'],
    type: 'mcq',
    difficulty: 2,
    marks: 1,
    questionEn: 'When the price of a commodity increases by 20% and its quantity demanded decreases by 30%, what is the Price Elasticity of Demand (Ep)?',
    questionMl: 'ഒരു സാധനത്തിന്റെ വിലയിൽ 20% വർദ്ധനവുണ്ടാകുമ്പോൾ അതിന്റെ ഡിമാൻഡിൽ 30% കുറവുണ്ടാകുന്നുവെങ്കിൽ വില ഇലാസ്തികത (Price Elasticity) എത്ര?',
    options: ['1.5 (Elastic)', '0.67 (Inelastic)', '1.0 (Unitary)', '0.5'],
    correctOptionIndex: 0,
    solutionEn: 'Ep = (% change in Quantity Demanded) / (% change in Price) = 30% / 20% = 1.5. Since Ep > 1, demand is Elastic.',
    solutionMl: 'Ep = 30% / 20% = 1.5. ഇത് 1-ൽ കൂടുതലായതിനാൽ ഡിമാൻഡ് ഇലാസ്റ്റിക് (Elastic) ആണ്.',
    commonTraps: ['Dividing price by quantity instead of quantity by price'],
    estimatedMinutes: 1,
    source: 'ICAI Economics Question Bank'
  }
];

export const CA_FOUNDATION_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subjectId: 'paper-1',
    chapterId: 'p1-ch2',
    conceptId: 'c-acc-brs-timing',
    frontEn: 'What is the BRS adjustment for "Cheques issued but not yet presented for payment" starting from Cash Book favorable balance?',
    frontMl: 'ക്യാഷ് ബുക്ക് ഫേവറബിൾ ബാലൻസിൽ നിന്നും തുടങ്ങുമ്പോൾ "നൽകിയതും എന്നാൽ ബാങ്കിൽ വരാത്തതുമായ ചെക്ക്" BRS-ൽ എന്ത് ചെയ്യണം?',
    backEn: 'ADD to Cash Book Balance. (Because Cash Book was reduced immediately, but Pass Book balance is higher).',
    backMl: 'ADD ചെയ്യുക (കൂട്ടുക). കാരണം ക്യാഷ് ബുക്കിൽ കുറച്ചിരുന്നു, എന്നാൽ ബാങ്കിൽ പണം കുറഞ്ഞിട്ടില്ല.',
    keyFormulaOrSection: 'Rule: Cash Book Dr -> ADD to reach Pass Book Cr.',
    vivaQuestionEn: 'Why do we add outstanding cheques when starting from Cash Book?',
    vivaQuestionMl: 'ക്യാഷ് ബുക്കിൽ നിന്നും തുടങ്ങുമ്പോൾ ഹാജരാക്കാത്ത ചെക്കുകൾ എന്തുകൊണ്ട് കൂട്ടുന്നു?',
    mastered: false
  },
  {
    id: 'fc-2',
    subjectId: 'paper-2',
    chapterId: 'p2-ch2',
    conceptId: 'c-law-consideration',
    frontEn: 'Can a stranger to a contract sue in India? What about a stranger to consideration?',
    frontMl: 'ഇന്ത്യൻ നിയമപ്രകാരം കരാറിലെ അപരിചിതന് (Stranger to Contract) കേസ് കൊടുക്കാമോ? പ്രതിഫലത്തിലെ അപരിചിതനോ (Stranger to Consideration)?',
    backEn: 'Stranger to Contract: CANNOT sue (Doctrine of Privity of Contract).\nStranger to Consideration: CAN sue (Section 2(d) & Chinnaya v. Ramayya).',
    backMl: 'കരാറിലെ അപരിചിതന് കേസ് നൽകാനാവില്ല. എന്നാൽ പ്രതിഫലത്തിലെ അപരിചിതന് കേസ് നൽകാം (ചിന്നയ്യ v. രാമയ്യ).',
    keyFormulaOrSection: 'Section 2(d) Indian Contract Act, 1872',
    mastered: false
  },
  {
    id: 'fc-3',
    subjectId: 'paper-3',
    chapterId: 'p3-ch2',
    conceptId: 'c-qa-tvm-annuity',
    frontEn: 'What is the formula for the Future Value of Annuity Regular?',
    frontMl: 'ആന്വിറ്റി റെഗുലറിന്റെ ഫ്യൂച്ചർ വാല്യൂ (FV) സൂത്രവാക്യം എന്താണ്?',
    backEn: 'FV = A × [((1 + i)^n - 1) / i]\nwhere A = Periodic Payment, i = Interest rate per period, n = number of periods.',
    backMl: 'FV = A × [((1 + i)^n - 1) / i]',
    keyFormulaOrSection: 'FV = A [((1+i)^n - 1) / i]',
    mastered: false
  },
  {
    id: 'fc-4',
    subjectId: 'paper-4',
    chapterId: 'p4-ch2',
    conceptId: 'c-eco-elasticity',
    frontEn: 'What does Ep > 1 indicate about Price Elasticity of Demand?',
    frontMl: 'Ep > 1 എന്നാൽ ഡിമാൻഡ് ഇലാസ്തികതയെക്കുറിച്ച് എന്ത് വ്യക്തമാക്കുന്നു?',
    backEn: 'It indicates Elastic Demand — percentage change in quantity demanded is greater than percentage change in price.',
    backMl: 'ഇലാസ്റ്റിക് ഡിമാൻഡ് (Elastic Demand) — വിലയിലുണ്ടാകുന്ന മാറ്റത്തേക്കാൾ കൂടുതൽ അളവിൽ ഡിമാൻഡിൽ മാറ്റമുണ്ടാകുന്നു.',
    keyFormulaOrSection: 'Ep = (% Δ Q) / (% Δ P) > 1',
    mastered: false
  }
];

export function getCurriculumVersion(versionId: CurriculumVersionId = 'CA_FOUNDATION_SEP_2026'): CurriculumVersion {
  return (
    CA_FOUNDATION_CURRICULUM_VERSIONS.find((v) => v.id === versionId) ||
    CA_FOUNDATION_CURRICULUM_VERSIONS[0]
  );
}

export function getPaperById(paperId: PaperId, versionId: CurriculumVersionId = 'CA_FOUNDATION_SEP_2026'): CAPaper | undefined {
  const version = getCurriculumVersion(versionId);
  return version.papers.find((p) => p.id === paperId);
}

export function getQuestionsBySubject(subjectId: PaperId): CAQuestion[] {
  return CA_FOUNDATION_QUESTION_BANK.filter((q) => q.subjectId === subjectId);
}
