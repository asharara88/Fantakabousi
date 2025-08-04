import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void;
}

interface FloatingActionButtonProps {
  onQuickAction?: (action: string) => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
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
      action: () => onQuickAction?.('nutrition')
    },
    {
      id: 'coach',
      label: 'Ask Coach',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-500 to-indigo-600',
      action: () => onQuickAction?.('coach')
    },
    {
      id: 'workout',
      label: 'Start Workout',
      icon: PlayIcon,
      color: 'from-orange-500 to-red-600',
      action: () => onQuickAction?.('fitness')
    },
    {
      id: 'supplement',
      label: 'Take Supplement',
      icon: CubeIcon,
      color: 'from-blue-500 to-cyan-600',
      action: () => onQuickAction?.('supplements')
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    action.action();
    setIsExpanded(false);
  };

  return (
    <div className={`fixed bottom-28 lg:bottom-8 right-6 z-40 ${className}`}>
      <div className="relative">
        {/* Quick Action Items */}
        <AnimatePresence>
          {isExpanded && (
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
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleActionClick(action)}
                  className={`flex items-center space-x-3 px-4 py-3 bg-gradient-to-r ${action.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap backdrop-blur-sm`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm ${
            isExpanded ? 'rotate-45' : ''
          }`}
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

        {/* Backdrop */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-20"
              onClick={() => setIsExpanded(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingActionButton;