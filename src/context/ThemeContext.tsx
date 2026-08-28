import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFromLocal, saveToLocal } from '../services/storageService';

export type ThemeMode = 'dark' | 'light' | 'cyberpunk' | 'amethyst' | 'aurora' | 'gold';

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
    root.classList.remove('dark', 'light', 'cyberpunk', 'amethyst', 'aurora', 'gold');
    root.classList.add(theme);

    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.08) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(236, 72, 153, 0.06) 0px, transparent 45%),
        radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.05) 0px, transparent 60%)
      `;
    } else if (theme === 'cyberpunk') {
      root.style.setProperty('--bg-primary', '#06060f');
      root.style.setProperty('--bg-secondary', '#0d0d1f');
      root.style.setProperty('--bg-card', '#141432');
      root.style.setProperty('--text-primary', '#00f0ff');
      root.style.setProperty('--text-secondary', '#ff007f');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(0, 240, 255, 0.18) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(255, 0, 127, 0.18) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(139, 0, 255, 0.18) 0px, transparent 50%)
      `;
    } else if (theme === 'amethyst') {
      root.style.setProperty('--bg-primary', '#0b0617');
      root.style.setProperty('--bg-secondary', '#140a2b');
      root.style.setProperty('--bg-card', '#201042');
      root.style.setProperty('--text-primary', '#faf5ff');
      root.style.setProperty('--text-secondary', '#c084fc');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(168, 85, 247, 0.20) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(236, 72, 153, 0.16) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(126, 34, 206, 0.22) 0px, transparent 50%)
      `;
    } else if (theme === 'aurora') {
      root.style.setProperty('--bg-primary', '#041014');
      root.style.setProperty('--bg-secondary', '#081c24');
      root.style.setProperty('--bg-card', '#0e2b38');
      root.style.setProperty('--text-primary', '#f0fdfa');
      root.style.setProperty('--text-secondary', '#5eead4');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(20, 184, 166, 0.22) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(16, 185, 129, 0.18) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(6, 182, 212, 0.20) 0px, transparent 50%)
      `;
    } else if (theme === 'gold') {
      root.style.setProperty('--bg-primary', '#120b04');
      root.style.setProperty('--bg-secondary', '#211408');
      root.style.setProperty('--bg-card', '#341f0a');
      root.style.setProperty('--text-primary', '#fffbeb');
      root.style.setProperty('--text-secondary', '#fcd34d');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(245, 158, 11, 0.22) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(239, 68, 68, 0.16) 0px, transparent 45%),
        radial-gradient(at 50% 90%, rgba(217, 119, 6, 0.20) 0px, transparent 50%)
      `;
    } else {
      // Default: 3D Obsidian & Electric Sapphire
      root.style.setProperty('--bg-primary', '#060713');
      root.style.setProperty('--bg-secondary', '#0d1024');
      root.style.setProperty('--bg-card', '#121733');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      document.body.style.backgroundImage = `
        radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(236, 72, 153, 0.12) 0px, transparent 45%),
        radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.08) 0px, transparent 60%),
        radial-gradient(at 80% 90%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
        radial-gradient(at 20% 90%, rgba(16, 185, 129, 0.08) 0px, transparent 40%)
      `;
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => setThemeState(newTheme);

  const toggleTheme = () => {
    const modes: ThemeMode[] = ['dark', 'amethyst', 'cyberpunk', 'aurora', 'gold', 'light'];
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
