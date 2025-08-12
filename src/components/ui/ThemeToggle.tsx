import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  variant?: 'desktop' | 'mobile';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'desktop' }) => {
  const { theme, setTheme, autoSyncTime, setAutoSyncTime } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === 'mobile') {
    return (
      <div className="relative">
        {/* Auto Mode Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl p-2 border border-white/30 dark:border-slate-700/30 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-300"
          title="Theme settings"
        >
          <ComputerDesktopIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <ChevronDownIcon className={`w-3 h-3 text-slate-600 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Expanded Options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl p-2 border border-white/30 dark:border-slate-700/30 shadow-xl z-50 min-w-[160px]"
            >
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setAutoSyncTime(true);
                    setTheme('auto');
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    autoSyncTime
                      ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Auto</span>
                </button>
                
                <button
                  onClick={() => {
                    setAutoSyncTime(false);
                    setTheme('light');
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    theme === 'light' && !autoSyncTime
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <SunIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                
                <button
                  onClick={() => {
                    setAutoSyncTime(false);
                    setTheme('dark');
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark' && !autoSyncTime
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <MoonIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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