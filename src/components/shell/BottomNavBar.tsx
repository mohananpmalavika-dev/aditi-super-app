import React from 'react';
import { 
  MessageSquare,
  MoonStar
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { MiniAppId } from '../../types/superApp';

interface BottomNavBarProps {
  onOpenLauncher: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onOpenLauncher: _onOpenLauncher }) => {
  const { activeMiniApp, setActiveMiniApp } = useSuperApp();

  // All other mini-app navigation items are preserved in code but hidden from menu as requested
  const navItems: Array<{ id: MiniAppId; label: string; icon: React.ReactNode }> = [
    { id: 'chat', label: 'Chat & Messenger', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'astrology', label: 'Astrology & Tarot', icon: <MoonStar className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav px-3 sm:px-6 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] select-none border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="max-w-md mx-auto flex items-center justify-center gap-3 sm:gap-6">
        {navItems.map((item) => {
          const isActive = activeMiniApp === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveMiniApp(item.id);
              }}
              className={`flex items-center justify-center gap-2.5 py-2 px-5 sm:px-7 rounded-2xl transition-all duration-300 flex-1 max-w-[200px] min-h-[48px] group active:scale-95 border ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-indigo-600/20 text-indigo-200 font-bold border-indigo-400/40 shadow-[0_4px_20px_rgba(99,102,241,0.25)]'
                  : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 font-medium hover:bg-slate-800/60 border-slate-800/60'
              }`}
            >
              <div 
                className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_4px_16px_rgba(99,102,241,0.6),inset_0_1px_1px_rgba(255,255,255,0.45)] scale-110 border border-white/20' 
                    : 'group-hover:bg-slate-800/80 group-hover:scale-105'
                }`}
              >
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]"></span>
                )}
              </div>
              <span className={`text-xs tracking-tight leading-none truncate ${isActive ? 'font-black text-indigo-100 drop-shadow' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
