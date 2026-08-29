import React from 'react';
import { Scale, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { LawCaseAnalysisData } from '../../../types/caTutor';

interface BusinessLawRendererProps {
  data?: Partial<LawCaseAnalysisData>;
  lang?: 'en' | 'ml' | 'ml-en';
}

export const BusinessLawRenderer: React.FC<BusinessLawRendererProps> = ({ data, lang = 'ml-en' }) => {
  const sampleData: LawCaseAnalysisData = {
    provision: data?.provision || 'Section 2(d) & Section 25 of the Indian Contract Act, 1872',
    relevantSection: data?.relevantSection || 'Doctrine of Consideration (Quid Pro Quo)',
    factsOfCase: data?.factsOfCase || 'A mother transferred property to her daughter on the express condition to pay annuity to maternal uncle.',
    legalPrinciples: data?.legalPrinciples || [
      'Consideration may move from Promisee or "Any other Person" (Chinnaya v. Ramayya).',
      'Stranger to Consideration can maintain a suit in India.',
      'Privity of Contract vs Privity of Consideration distinction.'
    ],
    applicationToFacts: data?.applicationToFacts || 'Although the uncle gave no consideration directly, consideration moved from his sister (the mother). Hence the promise is legally enforceable.',
    conclusion: data?.conclusion || 'The daughter is legally liable to pay the annuity to the uncle.',
    suggestedMarks: data?.suggestedMarks || 6
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3.5 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="font-extrabold text-amber-300 text-xs sm:text-sm">
            {lang === 'ml' ? 'ബിസിനസ്സ് നിയമം: കേസ് വിശകലന മാതൃക' : 'ICAI Business Law Case Solution Framework'}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
          {sampleData.suggestedMarks} Marks Presentation
        </span>
      </div>

      {/* Step 1: Legal Provision */}
      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold text-amber-400 uppercase block tracking-wider">
          1. {lang === 'ml' ? 'ബാധകമായ നിയമ വ്യവസ്ഥ (Applicable Legal Provision)' : 'Applicable Legal Provision & Section'}
        </span>
        <p className="font-bold text-white text-xs">{sampleData.provision}</p>
        <p className="text-[11px] text-slate-300">{sampleData.relevantSection}</p>
      </div>

      {/* Step 2: Legal Principles & Precedents */}
      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
        <span className="text-[10px] font-bold text-cyan-400 uppercase block tracking-wider">
          2. {lang === 'ml' ? 'പ്രധാന നിയമ തത്വങ്ങൾ & വിധിന്യായങ്ങൾ' : 'Core Legal Principles & Landmark Precedents'}
        </span>
        <ul className="space-y-1">
          {sampleData.legalPrinciples.map((p, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Step 3: Application to Facts */}
      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold text-indigo-400 uppercase block tracking-wider">
          3. {lang === 'ml' ? 'വസ്തുതകളുമായുള്ള താരതമ്യം (Application to Given Facts)' : 'Application of Law to the Case Facts'}
        </span>
        <p className="text-[11px] text-slate-300 leading-snug">{sampleData.applicationToFacts}</p>
      </div>

      {/* Step 4: Final Conclusion */}
      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
        <span className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">
          4. {lang === 'ml' ? 'അന്തിമ തീരുമാനം (Final Conclusion)' : 'Final Legal Conclusion'}
        </span>
        <p className="font-black text-white text-xs">{sampleData.conclusion}</p>
      </div>
    </div>
  );
};
