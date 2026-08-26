import React from 'react';
import { 
  Home, 
  Sparkles, 
  Palette, 
  Heart, 
  Building2, 
  Wallet, 
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
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'media_studio', label: 'Studio', icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'realestate', label: 'Property', icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'matrimony', label: 'Match', icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'productivity', label: 'Tasks', icon: <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'launcher', label: 'All Apps', icon: <Grid className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 sm:py-2">
      <div className="max-w-xl mx-auto flex items-center justify-between sm:justify-around overflow-x-auto no-scrollbar">
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
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all flex-shrink-0 min-w-[48px] ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-500/20 text-indigo-400 shadow-sm shadow-indigo-500/30' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
