import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  autoSyncTime: boolean;
  setAutoSyncTime: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('biowell-theme');
    return (saved as Theme) || 'auto';
  });
  const [autoSyncTime, setAutoSyncTime] = useState(() => {
    const saved = localStorage.getItem('biowell-auto-sync-time');
    return saved !== null ? saved === 'true' : true; // Default to true for auto sync
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      let newActualTheme: 'light' | 'dark';
      
      if (theme === 'auto' || autoSyncTime) {
        if (autoSyncTime) {
          // Auto-sync with time: light during day (6 AM - 6 PM), dark at night
          const hour = new Date().getHours();
          newActualTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        } else {
          // Follow system preference
          newActualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
      } else {
        newActualTheme = theme;
      }
      
      setActualTheme(newActualTheme);
      
      // Apply theme to document
      if (newActualTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      
      localStorage.setItem('biowell-theme', theme);
      localStorage.setItem('biowell-auto-sync-time', autoSyncTime.toString());
    };

    updateTheme();

    // Set up listeners for system preference changes
    if (theme === 'auto' && !autoSyncTime) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
    
    // Set up timer for time-based auto-sync
    if (autoSyncTime) {
      const interval = setInterval(updateTheme, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [theme, autoSyncTime]);

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, autoSyncTime, setAutoSyncTime }}>
      {children}
    </ThemeContext.Provider>
  );
};