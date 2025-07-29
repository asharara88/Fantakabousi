import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: SunIcon,
      description: 'Clean and bright interface',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: MoonIcon,
      description: 'Easy on the eyes',
    },
    {
      value: 'auto' as const,
      label: 'Auto',
      icon: ComputerDesktopIcon,
      description: 'Follows system preference',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Theme</h3>
      <div className="grid grid-cols-1 gap-3">
        {themes.map((themeOption) => (
          <motion.button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              theme === themeOption.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50'
                : 'border-border hover:border-primary-300 bg-card'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === themeOption.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <themeOption.icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`font-semibold ${
                  theme === themeOption.value ? 'text-primary-700 dark:text-primary-300' : 'text-foreground'
                }`}>
                  {themeOption.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {themeOption.description}
                </div>
              </div>
              {theme === themeOption.value && (
                <motion.div
                  layoutId="selectedTheme"
                  className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;