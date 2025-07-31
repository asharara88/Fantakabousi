import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  PlusIcon,
  CameraIcon,
  HeartIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface QuickActionsProps {
  onActionClick?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'coach',
      title: 'Chat with Coach',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-gradient-blue-light',
      badge: 'New'
    },
    {
      id: 'health',
      title: 'View Analytics',
      icon: ChartBarIcon,
      color: 'bg-gradient-blue-medium',
      badge: null
    },
    {
      id: 'workout',
      title: 'Log Workout',
      icon: PlusIcon,
      color: 'bg-accent-neon',
      badge: null
    },
    {
      id: 'scan',
      title: 'Scan Food',
      icon: CameraIcon,
      color: 'bg-gradient-blue-deep',
      badge: 'Beta'
    },
    {
      id: 'vitals',
      title: 'Check Vitals',
      icon: HeartIcon,
      color: 'bg-gradient-blue-light',
      badge: null
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: CalendarIcon,
      color: 'bg-gradient-blue-medium',
      badge: null
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-lg lg:text-heading-xl text-foreground">Quick Actions</h2>
        <button className="btn-ghost text-body-sm cursor-pointer">Customize</button>
      </div>
      
      {/* Actions Grid */}
      <div className="mobile-grid-2 lg:grid-cols-3 xl:grid-cols-6">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActionClick?.(action.id)}
            className="card text-center relative cursor-pointer hover:shadow-md transition-all duration-200 touch-target-large"
          >
            {action.badge && (
              <div className="absolute top-2 right-2 status-indicator status-success text-xs">
                {action.badge}
              </div>
            )}
            
            <div className="space-y-3">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 ${action.color} rounded-xl flex items-center justify-center mx-auto`}>
                <action.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              
              <span className="text-body-sm lg:text-body font-medium text-foreground">{action.title}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;