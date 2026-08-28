import React from 'react';
import { 
  Home, 
  Palette, 
  Heart, 
  Building2, 
  CheckSquare, 
  MessageSquare,
  Grid 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { MiniAppId } from '../../types/superApp';

interface BottomNavBarProps {
  onOpenLauncher: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onOpenLauncher }) => {
  const { activeMiniApp, setActiveMiniApp } = useSuperApp();

  const navItems: Array<{ id: MiniAppId | 'launcher'; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'media_studio', label: 'Studio', icon: <Palette className="w-5 h-5" /> },
    { id: 'realestate', label: 'Property', icon: <Building2 className="w-5 h-5" /> },
    { id: 'matrimony', label: 'Match', icon: <Heart className="w-5 h-5" /> },
    { id: 'productivity', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'launcher', label: 'All Apps', icon: <Grid className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav px-1.5 sm:px-4 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] select-none">
      <div className="max-w-2xl mx-auto flex items-center justify-between sm:justify-around">
        {navItems.map((item) => {
          const isActive = activeMiniApp === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'launcher') {
                  onOpenLauncher();
                } else {
                  setActiveMiniApp(item.id as MiniAppId);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-1.5 sm:px-3 rounded-2xl transition-all duration-200 flex-1 max-w-[68px] min-h-[46px] group active:scale-95 ${
                isActive
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div 
                className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_4px_16px_rgba(99,102,241,0.6),inset_0_1px_1px_rgba(255,255,255,0.45)] scale-110 -translate-y-1 border border-white/20' 
                    : 'group-hover:bg-slate-800/80 group-hover:scale-105'
                }`}
              >
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]"></span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight leading-none mt-1 truncate w-full text-center ${isActive ? 'font-black text-indigo-200 drop-shadow' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
