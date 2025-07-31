import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon,
  AdjustmentsHorizontalIcon,
  SpeakerWaveIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface AccessibilitySettingsProps {
  className?: string;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ className = "" }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    dyslexiaFriendly: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('biowell-accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion || prefersHighContrast) {
      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
      }));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Dyslexia friendly
    if (settings.dyslexiaFriendly) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Save settings
    localStorage.setItem('biowell-accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const accessibilityOptions = [
    {
      key: 'highContrast' as const,
      title: 'High Contrast',
      description: 'Increase color contrast for better visibility',
      icon: EyeIcon,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      key: 'largeText' as const,
      title: 'Large Text',
      description: 'Increase font size throughout the app',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-emerald-600',
    },
    {
      key: 'dyslexiaFriendly' as const,
      title: 'Dyslexia Friendly',
      description: 'Use dyslexia-friendly fonts and spacing',
      icon: AdjustmentsHorizontalIcon,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      key: 'reducedMotion' as const,
      title: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      icon: CursorArrowRaysIcon,
      color: 'from-amber-500 to-orange-600',
    },
    {
      key: 'screenReaderOptimized' as const,
      title: 'Screen Reader',
      description: 'Optimize for screen reader navigation',
      icon: SpeakerWaveIcon,
      color: 'from-red-500 to-pink-600',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <h3 className="text-heading-lg text-foreground">Accessibility Settings</h3>
        <p className="text-body text-muted-foreground">
          Customize the app to meet your accessibility needs
        </p>
      </div>

      <div className="space-y-4">
        {accessibilityOptions.map((option, index) => (
          <motion.div
            key={option.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-body font-semibold text-foreground">
                    {option.title}
                  </h4>
                  <p className="text-caption text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[option.key]}
                  onChange={(e) => updateSetting(option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
              </label>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reading Test */}
      <div className="card-premium bg-muted/30">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <h4 className="text-body font-semibold text-foreground">
              Readability Test
            </h4>
          </div>
          
          <div className={`prose ${settings.dyslexiaFriendly ? 'dyslexia-friendly' : ''}`}>
            <h3>Sample Health Content</h3>
            <p>
              Your heart rate variability (HRV) is a key indicator of your autonomic nervous system's 
              balance. Higher HRV generally indicates better cardiovascular fitness and stress resilience. 
              Today's reading of 42ms shows good recovery status.
            </p>
            <ul>
              <li>Optimal HRV range: 30-50ms for your age group</li>
              <li>Current trend: Improving over the last 7 days</li>
              <li>Recommendation: Maintain current sleep and stress management routine</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            setSettings({
              highContrast: true,
              largeText: true,
              dyslexiaFriendly: false,
              reducedMotion: true,
              screenReaderOptimized: false,
              keyboardNavigation: true,
            });
          }}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <EyeIcon className="w-4 h-4" />
          <span>Vision Optimized</span>
        </button>
        
        <button
          onClick={() => {
            setSettings({
              highContrast: false,
              largeText: false,
              dyslexiaFriendly: true,
              reducedMotion: true,
              screenReaderOptimized: false,
              keyboardNavigation: true,
            });
          }}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <DocumentTextIcon className="w-4 h-4" />
          <span>Reading Optimized</span>
        </button>
        
        <button
          onClick={() => {
            setSettings({
              highContrast: false,
              largeText: false,
              dyslexiaFriendly: false,
              reducedMotion: false,
              screenReaderOptimized: false,
              keyboardNavigation: true,
            });
          }}
          className="btn-ghost"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;