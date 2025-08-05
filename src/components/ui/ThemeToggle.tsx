import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  variant?: 'desktop' | 'mobile';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'desktop' }) => {
  const { theme, setTheme, autoSyncTime, setAutoSyncTime } = useTheme();

  if (variant === 'mobile') {
    return (
      <div className="flex items-center space-x-1 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl p-1 border border-white/30 dark:border-slate-700/30">
        <button
          onClick={() => {
            setAutoSyncTime(false);
            setTheme('light');
          }}
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === 'light' && !autoSyncTime
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-700/20'
          }`}
          title="Light theme"
        >
          <SunIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setAutoSyncTime(true);
            setTheme('auto');
          }}
          className={`p-2 rounded-lg transition-all duration-300 ${
            autoSyncTime
              ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-700/20'
          }`}
          title="Auto theme"
        >
          <ComputerDesktopIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setAutoSyncTime(false);
            setTheme('dark');
          }}
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === 'dark' && !autoSyncTime
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-700/20'
          }`}
          title="Dark theme"
        >
          <MoonIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('light');
        }}
        className={`p-3 rounded-xl transition-all duration-300 ${
          theme === 'light' && !autoSyncTime
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-110'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title="Light theme"
      >
        <SunIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          setAutoSyncTime(true);
          setTheme('auto');
        }}
        className={`p-3 rounded-xl transition-all duration-300 ${
          autoSyncTime
            ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg scale-110'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title="Auto theme"
      >
        <ComputerDesktopIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('dark');
        }}
        className={`p-3 rounded-xl transition-all duration-300 ${
          theme === 'dark' && !autoSyncTime
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-110'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title="Dark theme"
      >
        <MoonIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ThemeToggle;