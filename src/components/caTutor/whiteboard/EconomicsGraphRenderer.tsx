import React, { useState } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { EconomicCurveData } from '../../../types/caTutor';

interface EconomicsGraphRendererProps {
  data?: Partial<EconomicCurveData>;
  lang?: 'en' | 'ml' | 'ml-en';
}

export const EconomicsGraphRenderer: React.FC<EconomicsGraphRendererProps> = ({ data, lang = 'ml-en' }) => {
  const [isShifted, setIsShifted] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3.5 text-xs text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="font-extrabold text-purple-300 text-xs sm:text-sm">
            {lang === 'ml' ? 'ഇക്കണോമിക്സ് ഗ്രാഫ്: ഡിമാൻഡ് & ഇലാസ്തികത' : 'Interactive Economics Curve & Elasticity Diagram'}
          </span>
        </div>
        <button
          onClick={() => setIsShifted(!isShifted)}
          className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-[10px] font-bold flex items-center gap-1 transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{isShifted ? 'Reset Base Curve' : 'Simulate Demand Shift (D₁)'}</span>
        </button>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-center">
        <svg viewBox="0 0 320 200" className="w-full max-w-sm h-44 select-none">
          {/* Axes */}
          <line x1="40" y1="20" x2="40" y2="170" stroke="#94a3b8" strokeWidth="2" />
          <line x1="40" y1="170" x2="300" y2="170" stroke="#94a3b8" strokeWidth="2" />

          {/* Axis Labels */}
          <text x="15" y="25" fill="#f59e0b" fontSize="10" fontWeight="bold">Price (P)</text>
          <text x="210" y="190" fill="#38bdf8" fontSize="10" fontWeight="bold">Quantity (Q)</text>
          <text x="30" y="180" fill="#94a3b8" fontSize="9">0</text>

          {/* Base Demand Curve D0 */}
          <line x1="60" y1="40" x2="260" y2="160" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
          <text x="265" y="165" fill="#a855f7" fontSize="11" fontWeight="bold">D₀</text>

          {/* Shifted Demand Curve D1 */}
          {isShifted && (
            <>
              <line x1="100" y1="40" x2="300" y2="160" stroke="#ec4899" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
              <text x="295" y="155" fill="#ec4899" fontSize="11" fontWeight="bold">D₁ (Right Shift)</text>
            </>
          )}

          {/* Supply Curve S */}
          <line x1="60" y1="160" x2="260" y2="40" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <text x="265" y="45" fill="#10b981" fontSize="11" fontWeight="bold">S</text>

          {/* Equilibrium Point E0 */}
          <circle cx="160" cy="100" r="4" fill="#fbbf24" />
          <text x="165" y="95" fill="#fbbf24" fontSize="10" fontWeight="bold">E₀ (P*, Q*)</text>
          <line x1="40" y1="100" x2="160" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="160" y1="100" x2="160" y2="170" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
          {lang === 'ml' ? 'ഗ്രാഫ് വിശകലനം' : 'Economic Concept Summary'}
        </span>
        <p>
          {isShifted
            ? (lang === 'ml'
                ? 'ഡിമാൻഡ് വർദ്ധിക്കുമ്പോൾ (Rightward Shift D₁), സന്തുലിത വിലയും (Equilibrium Price) അളവും (Quantity) വർദ്ധിക്കുന്നു.'
                : 'Rightward shift from D₀ to D₁ increases both equilibrium price and equilibrium quantity.')
            : (lang === 'ml'
                ? 'ഡിമാൻഡ് കർവ് (D) താഴേക്ക് ചെരിഞ്ഞിരിക്കുന്നു (Negative Slope). വില കുറയുമ്പോൾ ഡിമാൻഡ് കൂടുന്നു.'
                : 'Downward sloping demand curve illustrates inverse relationship between Price and Quantity Demanded.')}
        </p>
      </div>
    </div>
  );
};
