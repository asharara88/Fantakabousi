import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../layout/NavigationProvider';

interface AdaptiveNavigationProps {
  userId?: string;
  className?: string;
}

// Hook to track user navigation patterns
const useNavigationAnalytics = (userId?: string) => {
  const [patterns, setPatterns] = useState<Record<string, number>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Load user navigation patterns from localStorage or API
    const savedPatterns = localStorage.getItem(`nav-patterns-${userId}`);
    if (savedPatterns) {
      setPatterns(JSON.parse(savedPatterns));
    }
  }, [userId]);

  const trackNavigation = (from: string, to: string) => {
    const key = `${from}->${to}`;
    setPatterns(prev => {
      const updated = { ...prev, [key]: (prev[key] || 0) + 1 };
      
      // Save to localStorage
      if (userId) {
        localStorage.setItem(`nav-patterns-${userId}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const generateSuggestions = (currentTab: string) => {
    // Find most common next destinations from current tab
    const relevantPatterns = Object.entries(patterns)
      .filter(([key]) => key.startsWith(`${currentTab}->`))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => key.split('->')[1]);
    
    setSuggestions(relevantPatterns);
  };

  return { patterns, suggestions, trackNavigation, generateSuggestions };
};

const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({ 
  userId, 
  className = "" 
}) => {
  const { state } = useNavigation();
  const { suggestions, trackNavigation, generateSuggestions } = useNavigationAnalytics(userId);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    generateSuggestions(state.activeTab);
  }, [state.activeTab]);

  useEffect(() => {
    // Track navigation changes
    if (state.previousTab && state.activeTab !== state.previousTab) {
      trackNavigation(state.previousTab, state.activeTab);
    }
  }, [state.activeTab, state.previousTab]);

  // Show suggestions after user has been on a page for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, [state.activeTab, suggestions]);

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`
        fixed bottom-32 lg:bottom-20 right-6 
        bg-card border border-border rounded-xl shadow-xl p-4
        max-w-xs z-30 ${className}
      `}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            You might want to...
          </h4>
          <button
            onClick={() => setShowSuggestions(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => {
                // Navigate to suggestion
                setShowSuggestions(false);
              }}
              className="
                w-full text-left p-2 rounded-lg 
                text-sm text-muted-foreground 
                hover:text-foreground hover:bg-muted 
                transition-colors
              "
            >
              Visit {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Based on your usage patterns
        </div>
      </div>
    </motion.div>
  );
};

export default AdaptiveNavigation;