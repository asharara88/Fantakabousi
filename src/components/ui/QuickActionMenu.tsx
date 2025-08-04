import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  CubeIcon,
  XMarkIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  shortcut?: string;
  action: () => void;
}

interface QuickActionMenuProps {
  onQuickAction?: (action: string) => void;
  className?: string;
}

const QuickActionMenu: React.FC<QuickActionMenuProps> = ({ 
  onQuickAction, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'food',
      label: 'Log Food',
      icon: CameraIcon,
      color: 'from-green-500 to-emerald-600',
      shortcut: 'F',
      action: () => onQuickAction?.('nutrition')
    },
    {
      id: 'coach',
      label: 'Ask Coach',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-500 to-indigo-600',
      shortcut: 'C',
      action: () => onQuickAction?.('coach')
    },
    {
      id: 'workout',
      label: 'Start Workout',
      icon: PlayIcon,
      color: 'from-orange-500 to-red-600',
      shortcut: 'W',
      action: () => onQuickAction?.('fitness')
    },
    {
      id: 'supplement',
      label: 'Take Supplement',
      icon: CubeIcon,
      color: 'from-blue-500 to-cyan-600',
      shortcut: 'S',
      action: () => onQuickAction?.('supplements')
    },
    {
      id: 'plan',
      label: 'Plan Day',
      icon: CalendarIcon,
      color: 'from-indigo-500 to-purple-600',
      shortcut: 'P',
      action: () => onQuickAction?.('plan')
    },
    {
      id: 'search',
      label: 'Search',
      icon: MagnifyingGlassIcon,
      color: 'from-gray-500 to-slate-600',
      shortcut: '⌘K',
      action: () => onQuickAction?.('search')
    }
  ];

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const action = quickActions.find(a => 
          a.shortcut?.toLowerCase() === e.key.toLowerCase()
        );
        if (action) {
          e.preventDefault();
          action.action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleActionClick = (action: QuickAction) => {
    action.action();
    setIsExpanded(false);
  };

  return (
    <div className={`fixed bottom-32 lg:bottom-12 right-8 z-40 ${className}`}>
      <div className="relative">
        {/* Quick Action Items */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-xl -z-10"
                onClick={() => setIsExpanded(false)}
              />
              
              {/* Action Items */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-20 right-0 space-y-4"
              >
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 20, y: 10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleActionClick(action)}
                    className={`
                      flex items-center space-x-4 px-6 py-4 
                      bg-gradient-to-r ${action.color} text-white 
                      rounded-2xl shadow-2xl hover:shadow-premium 
                      transition-all duration-300 whitespace-nowrap
                      group backdrop-blur-xl border border-white/20
                    `}
                    whileHover={{ scale: 1.08, x: -8, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">{action.label}</span>
                    {action.shortcut && (
                      <span className="text-sm bg-white/30 px-3 py-1 rounded-lg font-mono font-bold">
                        {action.shortcut}
                      </span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 
            text-white rounded-2xl shadow-2xl hover:shadow-premium 
            transition-all duration-300 flex items-center justify-center
            backdrop-blur-xl border border-white/20 relative overflow-hidden
            ${isExpanded ? 'rotate-45' : ''} animate-pulse-glow
          `}
          whileHover={{ scale: 1.15, y: -4 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isExpanded ? "Close quick actions" : "Open quick actions"}
          aria-expanded={isExpanded}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          
          {isExpanded ? (
            <XMarkIcon className="w-7 h-7 relative z-10" />
          ) : (
            <PlusIcon className="w-7 h-7 relative z-10" />
          )}
        </motion.button>

        {/* Premium glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 blur-xl opacity-30 animate-pulse -z-10" />
      </div>
    </div>
  );
};

export default QuickActionMenu;