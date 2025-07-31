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
      description: 'Black text on white background',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: MoonIcon,
      description: 'White text on black background',
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
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Appearance Theme</h3>
        <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {themes.map((themeOption) => (
          <motion.button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              theme === themeOption.value
                ? 'border-blue-light bg-blue-light/10'
                : 'border-border hover:border-primary-300 bg-card'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === themeOption.value
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <themeOption.icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`font-semibold ${
                  theme === themeOption.value ? 'text-blue-light' : 'text-foreground'
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
                  className="ml-auto w-2 h-2 bg-neon-green rounded-full"
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