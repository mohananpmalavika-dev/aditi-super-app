import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFromLocal, saveToLocal } from '../services/storageService';

export type ThemeMode = 'dark' | 'light' | 'cyberpunk' | 'midnight';

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
    root.classList.remove('dark', 'light', 'cyberpunk', 'midnight');
    root.classList.add(theme);

    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
    } else if (theme === 'cyberpunk') {
      root.style.setProperty('--bg-primary', '#080811');
      root.style.setProperty('--bg-secondary', '#0f0f23');
      root.style.setProperty('--bg-card', '#181836');
      root.style.setProperty('--text-primary', '#00f0ff');
      root.style.setProperty('--text-secondary', '#ff007f');
    } else {
      root.style.setProperty('--bg-primary', '#030712');
      root.style.setProperty('--bg-secondary', '#0f172a');
      root.style.setProperty('--bg-card', '#1e293b');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => setThemeState(newTheme);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'cyberpunk' : prev === 'cyberpunk' ? 'light' : 'dark'));
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
