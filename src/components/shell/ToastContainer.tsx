import React from 'react';
import { useSuperApp } from '../../context/SuperAppContext';
import { Sparkles } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toast } = useSuperApp();

  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-slate-100 shadow-2xl shadow-indigo-500/20 backdrop-blur-md">
        <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold">{toast}</span>
      </div>
    </div>
  );
};
