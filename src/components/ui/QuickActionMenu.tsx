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
    <div className={`fixed bottom-24 lg:bottom-8 right-6 z-40 ${className}`}>
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
                className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                onClick={() => setIsExpanded(false)}
              />
              
              {/* Action Items */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-16 right-0 space-y-3"
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
                      flex items-center space-x-3 px-4 py-3 
                      bg-gradient-to-r ${action.color} text-white 
                      rounded-xl shadow-lg hover:shadow-xl 
                      transition-all duration-200 whitespace-nowrap
                      group
                    `}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="font-medium">{action.label}</span>
                    {action.shortcut && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-md font-mono">
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
            w-14 h-14 bg-gradient-to-r from-blue-light to-blue-medium 
            text-white rounded-full shadow-lg hover:shadow-xl 
            transition-all duration-200 flex items-center justify-center
            ${isExpanded ? 'rotate-45' : ''}
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isExpanded ? "Close quick actions" : "Open quick actions"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <PlusIcon className="w-6 h-6" />
          )}
        </motion.button>

        {/* Pulse animation when closed */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-light to-blue-medium animate-ping opacity-20" />
        )}
      </div>
    </div>
  );
};

export default QuickActionMenu;