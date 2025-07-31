import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, autoSyncTime, setAutoSyncTime } = useTheme();

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
      
      {/* Auto Time Sync Option */}
      <div className="p-4 bg-muted/30 rounded-xl border border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium text-foreground">Auto Day/Night Mode</h4>
            <p className="text-sm text-muted-foreground">
              Light theme during day (6 AM - 6 PM), dark theme at night
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSyncTime}
              onChange={(e) => setAutoSyncTime(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {themes.map((themeOption) => (
          <motion.button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            type="button"
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              theme === themeOption.value && !autoSyncTime
                ? 'border-blue-light bg-blue-light/10'
                : 'border-border hover:border-primary-300 bg-card'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={autoSyncTime}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === themeOption.value && !autoSyncTime
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white'
                  : autoSyncTime
                    ? 'bg-muted text-muted-foreground opacity-50'
                    : 'bg-muted text-muted-foreground'
              }`}>
                <themeOption.icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`font-semibold ${
                  theme === themeOption.value && !autoSyncTime 
                    ? 'text-blue-light' 
                    : autoSyncTime 
                      ? 'text-muted-foreground' 
                      : 'text-foreground'
                }`}>
                  {themeOption.label}
                  {autoSyncTime && ' (Disabled)'}
                </div>
                <div className={`text-sm ${autoSyncTime ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                  {themeOption.description}
                </div>
              </div>
              {theme === themeOption.value && !autoSyncTime && (
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