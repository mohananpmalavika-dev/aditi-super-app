import { TerminologyGlossaryItem, PaperId } from '../types/caTutor';

export const CA_TERMINOLOGY_GLOSSARY: TerminologyGlossaryItem[] = [
  // Paper 1 - Accounting
  {
    id: 'term-acc-brs',
    englishTerm: 'Bank Reconciliation Statement (BRS)',
    malayalamTerm: 'ബാങ്ക് റികൺസിലിയേഷൻ സ്റ്റേറ്റ്‌മെന്റ്',
    manglishPhonetic: 'Bank Reconciliation Statement (BRS)',
    subjectId: 'paper-1',
    contextUsage: 'Reconciling differences between Cash Book and Pass Book balances.',
    doNotTranslate: true,
    definitionEn: 'A statement prepared on a particular date to reconcile the difference between the bank balance shown by the Cash Book and the balance shown by the Pass Book.',
    definitionMl: 'ക്യാഷ് ബുക്കിലെ ബാങ്ക് കോളവും ബാങ്ക് പാസ്സ് ബുക്കും തമ്മിലുള്ള ബാലൻസിലെ വ്യത്യാസങ്ങൾ കണ്ടെത്തി ഒത്തുനോക്കുന്നതിനായി തയ്യാറാക്കുന്ന പട്ടിക.'
  },
  {
    id: 'term-acc-outstanding-cheque',
    englishTerm: 'Cheques Issued but not yet Presented',
    malayalamTerm: 'നൽകിയതും എന്നാൽ ബാങ്കിൽ ഹാജരാക്കാത്തതുമായ ചെക്കുകൾ',
    manglishPhonetic: 'Cheques issued but not presented',
    subjectId: 'paper-1',
    contextUsage: 'BRS adjustment: Cash Book reduced immediately, but Pass Book not yet reduced.',
    doNotTranslate: false,
    definitionEn: 'Cheques given to creditors which have not yet been presented to the bank for payment.',
    definitionMl: 'നാം കടക്കാർക്ക് നൽകിയതും എന്നാൽ അവർ പണം പിൻവലിക്കാനായി ബാങ്കിൽ ഇതുവരെ സമർപ്പിക്കാത്തതുമായ ചെക്കുകൾ.'
  },
  {
    id: 'term-acc-uncredited-cheque',
    englishTerm: 'Cheques Deposited but not yet Cleared/Collected',
    malayalamTerm: 'ബാങ്കിൽ നിക്ഷേപിച്ചതും എന്നാൽ ക്രെഡിറ്റ് ആകാത്തതുമായ ചെക്കുകൾ',
    manglishPhonetic: 'Cheques deposited but not cleared',
    subjectId: 'paper-1',
    contextUsage: 'BRS adjustment: Cash Book increased, but Pass Book not yet increased.',
    doNotTranslate: false,
    definitionEn: 'Cheques received from debtors and paid into bank, but not yet credited in customer account by the bank.',
    definitionMl: 'ഉപഭോക്താക്കളിൽ നിന്ന് ലഭിച്ച് ബാങ്കിൽ അടച്ചതും എന്നാൽ ബാങ്ക് നമ്മുടെ അക്കൗണ്ടിലേക്ക് ഇതുവരെ പണം ക്രെഡിറ്റ് ചെയ്യാത്തതുമായ ചെക്കുകൾ.'
  },
  {
    id: 'term-acc-trial-balance',
    englishTerm: 'Trial Balance',
    malayalamTerm: 'ട്രയൽ ബാലൻസ്',
    manglishPhonetic: 'Trial Balance',
    subjectId: 'paper-1',
    contextUsage: 'A statement of debit and credit balances extracted from ledgers to verify arithmetical accuracy.',
    doNotTranslate: true,
    definitionEn: 'A statement containing the balances of all ledger accounts on a particular date to check arithmetic accuracy.',
    definitionMl: 'ലെഡ്ജറുകളിലെ ഡെബിറ്റ്, ക്രെഡിറ്റ് ബാലൻസുകൾ ഒത്തുനോക്കി കണക്കിലെ ഗണിതപരമായ കൃത്യത ഉറപ്പുവരുത്താൻ തയ്യാറാക്കുന്ന പട്ടിക.'
  },
  {
    id: 'term-acc-journal-entry',
    englishTerm: 'Journal Entry',
    malayalamTerm: 'ജേണൽ എൻട്രി (പ്രാഥമിക രേഖ)',
    manglishPhonetic: 'Journal Entry',
    subjectId: 'paper-1',
    contextUsage: 'Primary record of a business transaction according to double entry principles.',
    doNotTranslate: true,
    definitionEn: 'The recorded entry of transactions in chronological order showing accounts debited and credited with narration.',
    definitionMl: 'ഇരട്ടപ്പതിവ് സമ്പ്രദായം (Double Entry) അനുസരിച്ച് ഇടപാടുകൾ തീയതി ക്രമത്തിൽ ഡെബിറ്റും ക്രെഡിറ്റും രേഖപ്പെടുത്തുന്ന പ്രാഥമിക കണക്കുപുസ്തകം.'
  },
  {
    id: 'term-acc-depreciation',
    englishTerm: 'Depreciation (SLM / WDV)',
    malayalamTerm: 'തേയ്മാനം (ഡിപ്രിസിയേഷൻ)',
    manglishPhonetic: 'Depreciation',
    subjectId: 'paper-1',
    contextUsage: 'Systematic allocation of the depreciable amount of an asset over its useful life.',
    doNotTranslate: true,
    definitionEn: 'A gradual and permanent decrease in the book value of a fixed asset due to wear, tear, or obsolescence.',
    definitionMl: 'സ്ഥിര ആസ്തികൾ ഉപയോഗിക്കുമ്പോൾ ഉണ്ടാകുന്ന മൂല്യക്കുറവിനെയാണ് തേയ്മാനം (Depreciation) എന്ന് പറയുന്നത്.'
  },

  // Paper 2 - Business Laws
  {
    id: 'term-law-consideration',
    englishTerm: 'Consideration (Section 2(d))',
    malayalamTerm: 'പ്രതിഫലം (Consideration - Quid Pro Quo)',
    manglishPhonetic: 'Consideration (Quid Pro Quo)',
    subjectId: 'paper-2',
    contextUsage: 'Essential element of a valid contract under Indian Contract Act, 1872.',
    doNotTranslate: true,
    definitionEn: 'When, at the desire of the promisor, the promisee or any other person has done or abstained from doing something (Quid Pro Quo - something in return).',
    definitionMl: 'ഒരു കരാറിൽ ഒരു കക്ഷി മറ്റേ കക്ഷിക്ക് പകരമായി നൽകുന്ന മൂല്യമുള്ള എന്തെങ്കിലും (പ്രതിഫലം). ഒരു സാധനത്തിനോ സേവനത്തിനോ പകരമായി ലഭിക്കുന്നത്.'
  },
  {
    id: 'term-law-coercion',
    englishTerm: 'Coercion (Section 15)',
    malayalamTerm: 'ബലപ്രയോഗം / ഭീഷണിപ്പെടുത്തൽ (Coercion)',
    manglishPhonetic: 'Coercion',
    subjectId: 'paper-2',
    contextUsage: 'Committing or threatening to commit any act forbidden by IPC to induce a contract.',
    doNotTranslate: true,
    definitionEn: 'Committing or threatening to commit any act forbidden by the Indian Penal Code, or unlawful detaining of property to obtain consent.',
    definitionMl: 'നിയമവിരുദ്ധമായ കാര്യങ്ങൾ ചെയ്തോ ഭീഷണിപ്പെടുത്തിയോ ഒരാളുടെ സമ്മതം വാങ്ങി കരാറുണ്ടാക്കുന്നത്.'
  },
  {
    id: 'term-law-doctrine-indoor-management',
    englishTerm: 'Doctrine of Indoor Management (Turquand Rule)',
    malayalamTerm: 'ഡോക്ട്രിൻ ഓഫ് ഇൻഡോർ മാനേജ്‌മെന്റ് (ടർക്വാണ്ട് റൂൾ)',
    manglishPhonetic: 'Doctrine of Indoor Management',
    subjectId: 'paper-2',
    contextUsage: 'Protection to third parties dealing with a company in good faith.',
    doNotTranslate: true,
    definitionEn: 'Persons dealing with a company are presumed to know the public documents, but are entitled to assume internal proceedings are regular.',
    definitionMl: 'കമ്പനിയുമായി ഇടപാട് നടത്തുന്ന പുറത്തുനിന്നുള്ളവർക്ക് കമ്പനിയുടെ ആഭ്യന്തര നടപടിക്രമങ്ങൾ ശരിയായി നടന്നിട്ടുണ്ടാകുമെന്ന് വിശ്വസിക്കാനുള്ള നിയമപരമായ സംരക്ഷണം.'
  },

  // Paper 3 - Quantitative Aptitude
  {
    id: 'term-qa-annuity',
    englishTerm: 'Annuity (Regular vs Due)',
    malayalamTerm: 'ആന്വിറ്റി (സ്ഥിര ഗഡുക്കൾ)',
    manglishPhonetic: 'Annuity',
    subjectId: 'paper-3',
    contextUsage: 'Time Value of Money calculations for equal periodic payments.',
    doNotTranslate: true,
    definitionEn: 'A sequence of equal periodic payments made at equal intervals of time.',
    definitionMl: 'നിശ്ചിത കാലയളവിൽ തുല്യമായ ഇടവേളകളിൽ അടയ്ക്കുന്നതോ ലഭിക്കുന്നതോ ആയ സ്ഥിര തുകകൾ.'
  },
  {
    id: 'term-qa-standard-deviation',
    englishTerm: 'Standard Deviation (σ)',
    malayalamTerm: 'സ്റ്റാൻഡേർഡ് ഡീവിയേഷൻ (മാനക വ്യതിയാനം)',
    manglishPhonetic: 'Standard Deviation',
    subjectId: 'paper-3',
    contextUsage: 'Measure of dispersion in Statistics.',
    doNotTranslate: true,
    definitionEn: 'The positive square root of the arithmetic mean of the squares of deviations from arithmetic mean.',
    definitionMl: 'ഒരു കൂട്ടം വിവരങ്ങൾ (Data) അവയുടെ ശരാശരിയിൽ നിന്ന് എത്രത്തോളം വ്യതിചലിച്ചിരിക്കുന്നു എന്ന് അളക്കുന്ന രീതി.'
  },

  // Paper 4 - Business Economics
  {
    id: 'term-eco-elasticity-demand',
    englishTerm: 'Price Elasticity of Demand (Ep)',
    malayalamTerm: 'ഡിമാൻഡിന്റെ വില ഇലാസ്തികത (Price Elasticity)',
    manglishPhonetic: 'Price Elasticity of Demand',
    subjectId: 'paper-4',
    contextUsage: 'Responsiveness of quantity demanded to changes in price.',
    doNotTranslate: true,
    definitionEn: 'The percentage change in quantity demanded of a commodity divided by percentage change in its price.',
    definitionMl: 'ഒരു സാധനത്തിന്റെ വിലയിലുണ്ടാകുന്ന മാറ്റത്തിന് അനുസൃതമായി അതിന്റെ ഡിമാൻഡിൽ ഉണ്ടാകുന്ന മാറ്റത്തിന്റെ തോത്.'
  },
  {
    id: 'term-eco-opportunity-cost',
    englishTerm: 'Opportunity Cost',
    malayalamTerm: 'അവസര ചെലവ് (ഓപ്പർച്യുണിറ്റി കോസ്റ്റ്)',
    manglishPhonetic: 'Opportunity Cost',
    subjectId: 'paper-4',
    contextUsage: 'Cost of next best alternative foregone.',
    doNotTranslate: true,
    definitionEn: 'The value of the next best alternative given up in order to choose something else.',
    definitionMl: 'ഒരു പ്രത്യേക കാര്യം തെരഞ്ഞെടുക്കുമ്പോൾ ഉപേക്ഷിക്കേണ്ടി വരുന്ന ഏറ്റവും മികച്ച മറ്റൊരു അവസരത്തിന്റെ മൂല്യം.'
  }
];

export function getGlossaryTermsBySubject(subjectId: PaperId): TerminologyGlossaryItem[] {
  return CA_TERMINOLOGY_GLOSSARY.filter((t) => t.subjectId === subjectId);
}

export function searchGlossary(query: string): TerminologyGlossaryItem[] {
  const q = (query || '').toLowerCase().trim();
  if (!q) return CA_TERMINOLOGY_GLOSSARY;
  return CA_TERMINOLOGY_GLOSSARY.filter(
    (t) =>
      t.englishTerm.toLowerCase().includes(q) ||
      t.malayalamTerm.includes(q) ||
      t.manglishPhonetic.toLowerCase().includes(q) ||
      t.definitionEn.toLowerCase().includes(q) ||
      t.definitionMl.includes(q)
  );
}
