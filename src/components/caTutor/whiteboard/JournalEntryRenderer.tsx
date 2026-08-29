import React from 'react';
import { JournalEntryData, LedgerAccountData } from '../../../types/caTutor';

interface JournalEntryRendererProps {
  entries?: JournalEntryData[];
  ledgerData?: LedgerAccountData;
  lang?: 'en' | 'ml' | 'ml-en';
}

export const JournalEntryRenderer: React.FC<JournalEntryRendererProps> = ({ entries, ledgerData, lang = 'ml-en' }) => {
  if (ledgerData) {
    return (
      <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 font-mono text-xs text-white">
        <div className="text-center font-bold border-b border-slate-700 pb-2 text-sm text-cyan-300 uppercase">
          Dr. {ledgerData.accountName} Cr.
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-700">
          {/* Debit Side */}
          <div className="pr-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-bold border-b border-slate-800 pb-1 flex justify-between">
              <span>Particulars</span>
              <span>Amount (₹)</span>
            </div>
            {ledgerData.debitEntries.map((d, i) => (
              <div key={i} className="flex justify-between text-[11px]">
                <span className="text-slate-300">To {d.particulars}</span>
                <span className="font-bold text-emerald-400">{d.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* Credit Side */}
          <div className="pl-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-bold border-b border-slate-800 pb-1 flex justify-between">
              <span>Particulars</span>
              <span>Amount (₹)</span>
            </div>
            {ledgerData.creditEntries.map((c, i) => (
              <div key={i} className="flex justify-between text-[11px]">
                <span className="text-slate-300">By {c.particulars}</span>
                <span className="font-bold text-rose-400">{c.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sampleEntries: JournalEntryData[] = entries && entries.length > 0 ? entries : [
    {
      date: '2026-03-31',
      debitAccount: 'Bank A/c',
      creditAccount: 'Cash A/c',
      amount: 25000,
      narration: '(Being cash deposited into bank for business operations)',
      narrationMalayalam: '(ബിസിനസ്സ് ആവശ്യത്തിനായി ബാങ്കിൽ പണം നിക്ഷേപിച്ചപ്പോൾ)'
    }
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400 font-bold uppercase">
        <span className="w-16">Date</span>
        <span className="flex-1 px-3">Particulars & Narration</span>
        <span className="w-10 text-center">L.F.</span>
        <span className="w-20 text-right">Debit (₹)</span>
        <span className="w-20 text-right">Credit (₹)</span>
      </div>

      {sampleEntries.map((entry, idx) => (
        <div key={idx} className="space-y-1 py-1 border-b border-slate-800/40 text-slate-200">
          <div className="flex items-center justify-between">
            <span className="w-16 text-slate-400 text-[10px]">{entry.date}</span>
            <span className="flex-1 px-3 font-bold text-white">
              {entry.debitAccount} <span className="text-cyan-400 font-black">Dr.</span>
            </span>
            <span className="w-10 text-center text-slate-500">-</span>
            <span className="w-20 text-right font-black text-emerald-400 font-mono">
              {entry.amount.toLocaleString('en-IN')}
            </span>
            <span className="w-20 text-right text-slate-600">-</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="w-16"></span>
            <span className="flex-1 px-3 pl-8 text-slate-300 font-semibold">
              To {entry.creditAccount}
            </span>
            <span className="w-10 text-center text-slate-500">-</span>
            <span className="w-20 text-right text-slate-600">-</span>
            <span className="w-20 text-right font-black text-rose-400 font-mono">
              {entry.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 italic pl-8 pt-0.5">
            {lang === 'ml' && entry.narrationMalayalam ? entry.narrationMalayalam : entry.narration}
          </div>
        </div>
      ))}
    </div>
  );
};
