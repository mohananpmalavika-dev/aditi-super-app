import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFromLocal, saveToLocal } from '../services/storageService';

export type ThemeMode = 
  | 'dark' 
  | 'amethyst' 
  | 'cyberpunk' 
  | 'aurora' 
  | 'gold' 
  | 'crimson' 
  | 'nebula' 
  | 'ocean' 
  | 'titanium' 
  | 'light';

export interface ThemeMeta {
  id: ThemeMode;
  name: string;
  category: '3D Classic' | '4D Holographic' | '3D Luxe';
  badge: string;
  gradient: string;
  desc: string;
  accentColor: string;
}

export const THEME_PRESETS: ThemeMeta[] = [
  {
    id: 'dark',
    name: '3D Obsidian Sapphire',
    category: '3D Classic',
    badge: '3D Depth',
    gradient: 'from-indigo-600 via-blue-700 to-indigo-900',
    desc: 'Deep cosmic abyss with electric sapphire specular sheens',
    accentColor: '#6366f1'
  },
  {
    id: 'amethyst',
    name: '3D Royal Amethyst',
    category: '3D Classic',
    badge: '3D Bevel',
    gradient: 'from-purple-600 via-fuchsia-600 to-indigo-900',
    desc: 'Velvet royal purple with neon magenta prism bevels',
    accentColor: '#a855f7'
  },
  {
    id: 'cyberpunk',
    name: '4D Cyber Matrix',
    category: '4D Holographic',
    badge: '4D Holo',
    gradient: 'from-cyan-400 via-fuchsia-500 to-purple-600',
    desc: 'Holographic laser cyan, matrix grid & hyper hot pink glow',
    accentColor: '#00f0ff'
  },
  {
    id: 'aurora',
    name: '3D Emerald Aurora',
    category: '3D Classic',
    badge: '3D Jade',
    gradient: 'from-emerald-400 via-teal-600 to-slate-900',
    desc: 'Northern lights jade forest with crystalline mint reflections',
    accentColor: '#10b981'
  },
  {
    id: 'gold',
    name: '3D Golden Sunset',
    category: '3D Classic',
    badge: '3D Amber',
    gradient: 'from-amber-400 via-orange-600 to-red-700',
    desc: 'Warm 24K gold, molten copper & royal solar flare',
    accentColor: '#f59e0b'
  },
  {
    id: 'crimson',
    name: '4D Quantum Crimson',
    category: '4D Holographic',
    badge: '4D Plasma',
    gradient: 'from-rose-500 via-red-600 to-slate-950',
    desc: 'Volcanic scarlet, hyper ruby plasma & deep obsidian shadows',
    accentColor: '#f43f5e'
  },
  {
    id: 'nebula',
    name: '4D Galactic Nebula',
    category: '4D Holographic',
    badge: '4D Cosmic',
    gradient: 'from-violet-500 via-purple-700 to-indigo-950',
    desc: 'Cosmic deep space indigo with supernova violet refraction',
    accentColor: '#8b5cf6'
  },
  {
    id: 'ocean',
    name: '3D Ocean Abyss',
    category: '3D Classic',
    badge: '3D Oceanic',
    gradient: 'from-cyan-500 via-blue-600 to-slate-950',
    desc: 'Mariana trench navy with bioluminescent aquamarine glows',
    accentColor: '#06b6d4'
  },
  {
    id: 'titanium',
    name: '4D Chrono Titanium',
    category: '4D Holographic',
    badge: '4D Chrome',
    gradient: 'from-slate-300 via-slate-500 to-slate-800',
    desc: 'Brushed gunmetal, holographic silver & iridescent chrome',
    accentColor: '#94a3b8'
  },
  {
    id: 'light',
    name: '3D Solar Pearl',
    category: '3D Luxe',
    badge: '3D Opal',
    gradient: 'from-slate-100 via-indigo-100 to-sky-100',
    desc: 'Luminous liquid pearl, frosted 3D glass & diamond highlights',
    accentColor: '#6366f1'
  }
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => loadFromLocal<ThemeMode>('theme', 'dark'));

  useEffect(() => {
    saveToLocal('theme', theme);
    const root = document.documentElement;
    const allThemeClasses = ['dark', 'amethyst', 'cyberpunk', 'aurora', 'gold', 'crimson', 'nebula', 'ocean', 'titanium', 'light'];
    root.classList.remove(...allThemeClasses);
    root.classList.add(theme);

    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f4f6fb');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#eaeff8');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--accent', '#6366f1');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.08) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(236, 72, 153, 0.06) 0px, transparent 45%),
        radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.05) 0px, transparent 60%)
      `;
    } else if (theme === 'cyberpunk') {
      root.style.setProperty('--bg-primary', '#040612');
      root.style.setProperty('--bg-secondary', '#080d22');
      root.style.setProperty('--bg-card', '#0f1538');
      root.style.setProperty('--text-primary', '#00f0ff');
      root.style.setProperty('--text-secondary', '#ff007f');
      root.style.setProperty('--accent', '#00f0ff');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(0, 240, 255, 0.22) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(255, 0, 127, 0.22) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(139, 0, 255, 0.24) 0px, transparent 50%),
        radial-gradient(at 20% 70%, rgba(0, 240, 255, 0.12) 0px, transparent 40%)
      `;
    } else if (theme === 'amethyst') {
      root.style.setProperty('--bg-primary', '#0b0617');
      root.style.setProperty('--bg-secondary', '#140a2b');
      root.style.setProperty('--bg-card', '#201042');
      root.style.setProperty('--text-primary', '#faf5ff');
      root.style.setProperty('--text-secondary', '#c084fc');
      root.style.setProperty('--accent', '#a855f7');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(168, 85, 247, 0.22) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(236, 72, 153, 0.18) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(126, 34, 206, 0.24) 0px, transparent 50%)
      `;
    } else if (theme === 'aurora') {
      root.style.setProperty('--bg-primary', '#02120e');
      root.style.setProperty('--bg-secondary', '#061d17');
      root.style.setProperty('--bg-card', '#0a2a22');
      root.style.setProperty('--text-primary', '#f0fdfa');
      root.style.setProperty('--text-secondary', '#5eead4');
      root.style.setProperty('--accent', '#10b981');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(20, 184, 166, 0.24) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(16, 185, 129, 0.20) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(6, 182, 212, 0.22) 0px, transparent 50%)
      `;
    } else if (theme === 'gold') {
      root.style.setProperty('--bg-primary', '#140a02');
      root.style.setProperty('--bg-secondary', '#241406');
      root.style.setProperty('--bg-card', '#361e09');
      root.style.setProperty('--text-primary', '#fffbeb');
      root.style.setProperty('--text-secondary', '#fcd34d');
      root.style.setProperty('--accent', '#f59e0b');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(245, 158, 11, 0.24) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(239, 68, 68, 0.18) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(217, 119, 6, 0.22) 0px, transparent 50%)
      `;
    } else if (theme === 'crimson') {
      root.style.setProperty('--bg-primary', '#120406');
      root.style.setProperty('--bg-secondary', '#22080c');
      root.style.setProperty('--bg-card', '#350d14');
      root.style.setProperty('--text-primary', '#fff1f2');
      root.style.setProperty('--text-secondary', '#fda4af');
      root.style.setProperty('--accent', '#f43f5e');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(244, 63, 94, 0.24) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(225, 29, 72, 0.20) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(159, 18, 57, 0.24) 0px, transparent 50%),
        radial-gradient(at 20% 70%, rgba(251, 113, 133, 0.12) 0px, transparent 40%)
      `;
    } else if (theme === 'nebula') {
      root.style.setProperty('--bg-primary', '#070518');
      root.style.setProperty('--bg-secondary', '#100b2e');
      root.style.setProperty('--bg-card', '#1b1348');
      root.style.setProperty('--text-primary', '#f5f3ff');
      root.style.setProperty('--text-secondary', '#ddd6fe');
      root.style.setProperty('--accent', '#8b5cf6');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(139, 92, 246, 0.25) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(217, 70, 239, 0.20) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(99, 102, 241, 0.25) 0px, transparent 50%),
        radial-gradient(at 30% 70%, rgba(168, 85, 247, 0.15) 0px, transparent 40%)
      `;
    } else if (theme === 'ocean') {
      root.style.setProperty('--bg-primary', '#020d18');
      root.style.setProperty('--bg-secondary', '#051627');
      root.style.setProperty('--bg-card', '#09233e');
      root.style.setProperty('--text-primary', '#ecfeff');
      root.style.setProperty('--text-secondary', '#67e8f9');
      root.style.setProperty('--accent', '#06b6d4');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(6, 182, 212, 0.24) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(14, 165, 233, 0.20) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(3, 105, 161, 0.25) 0px, transparent 50%),
        radial-gradient(at 20% 70%, rgba(34, 211, 238, 0.12) 0px, transparent 40%)
      `;
    } else if (theme === 'titanium') {
      root.style.setProperty('--bg-primary', '#0d0f12');
      root.style.setProperty('--bg-secondary', '#16191f');
      root.style.setProperty('--bg-card', '#22262f');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--accent', '#94a3b8');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(148, 163, 184, 0.20) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(203, 213, 225, 0.15) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(71, 85, 105, 0.22) 0px, transparent 50%),
        radial-gradient(at 20% 70%, rgba(148, 163, 184, 0.10) 0px, transparent 40%)
      `;
    } else {
      // Default: 3D Obsidian & Electric Sapphire
      root.style.setProperty('--bg-primary', '#060713');
      root.style.setProperty('--bg-secondary', '#0d1024');
      root.style.setProperty('--bg-card', '#121733');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--accent', '#6366f1');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.18) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(236, 72, 153, 0.14) 0px, transparent 45%),
        radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.10) 0px, transparent 60%),
        radial-gradient(at 80% 90%, rgba(139, 92, 246, 0.18) 0px, transparent 50%),
        radial-gradient(at 20% 90%, rgba(16, 185, 129, 0.10) 0px, transparent 40%)
      `;
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => setThemeState(newTheme);

  const toggleTheme = () => {
    const modes: ThemeMode[] = [
      'dark', 
      'amethyst', 
      'cyberpunk', 
      'aurora', 
      'gold', 
      'crimson', 
      'nebula', 
      'ocean', 
      'titanium', 
      'light'
    ];
    const nextIdx = (modes.indexOf(theme) + 1) % modes.length;
    setThemeState(modes[nextIdx]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

