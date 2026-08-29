import React from 'react';
import { WhiteboardAction } from '../../../types/caTutor';
import { JournalEntryRenderer } from './JournalEntryRenderer';
import { BusinessLawRenderer } from './BusinessLawRenderer';
import { EconomicsGraphRenderer } from './EconomicsGraphRenderer';
import { BookOpen, Calculator, Scale, TrendingUp, Sparkles } from 'lucide-react';

interface TutorWhiteboardProps {
  actions: WhiteboardAction[];
  lang?: 'en' | 'ml' | 'ml-en';
}

export const TutorWhiteboard: React.FC<TutorWhiteboardProps> = ({ actions, lang = 'ml-en' }) => {
  if (!actions || actions.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 py-12">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-white">
            {lang === 'ml' ? 'ഇന്ററാക്ടീവ് വൈറ്റ്ബോർഡ്' : 'Interactive Tutor Whiteboard'}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm">
            {lang === 'ml'
              ? 'അക്കൗണ്ടിംഗ് ജേണൽ എൻട്രികൾ, ബിസിനസ്സ് നിയമ കേസുകൾ, മാത്സ് ഫോർമുലകൾ എന്നിവ ട്യൂട്ടർ ഇവിടെ നേരിട്ട് വരച്ചു കാണിക്കും.'
              : 'As your AI Tutor explains concepts, live calculations, double-entry journals, case law structures, and graphs will render here in real-time.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((act) => {
        if (act.type === 'journalEntry' || act.type === 'ledger') {
          return (
            <div key={act.id} className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{act.title}</span>
              </div>
              <JournalEntryRenderer entries={act.data?.entries} ledgerData={act.data?.ledger} lang={lang} />
            </div>
          );
        }

        if (act.type === 'lawProvisionMap') {
          return (
            <div key={act.id} className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Scale className="w-3.5 h-3.5" />
                <span>{act.title}</span>
              </div>
              <BusinessLawRenderer data={act.data} lang={lang} />
            </div>
          );
        }

        if (act.type === 'economicCurve') {
          return (
            <div key={act.id} className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{act.title}</span>
              </div>
              <EconomicsGraphRenderer data={act.data} lang={lang} />
            </div>
          );
        }

        if (act.type === 'formula') {
          return (
            <div key={act.id} className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
                <Calculator className="w-4 h-4" />
                <span>{act.title}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 font-mono text-emerald-300 font-bold text-center text-sm">
                {act.data?.fvRegularFormula || act.data?.pvRegularFormula || 'FV = A × [((1+i)^n - 1) / i]'}
              </div>
              {act.data?.calculatorShortcut && (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200">
                  <strong className="block text-[10px] uppercase font-bold text-emerald-400">Calculator Shortcut Trick:</strong>
                  {act.data.calculatorShortcut}
                </div>
              )}
            </div>
          );
        }

        if (act.type === 'workingNote') {
          return (
            <div key={act.id} className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-cyan-300 text-xs sm:text-sm">{act.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{act.data?.startingPoint}</span>
              </div>
              <div className="space-y-2">
                {act.data?.rules?.map((r: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="font-bold text-white text-xs">{r.item}</p>
                      <p className="text-[10px] text-slate-400">{r.reason}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-black font-mono flex-shrink-0 ${r.action.includes('ADD') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {r.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
