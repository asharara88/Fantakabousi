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
      color: '#8b5cf6',
      badge: 'New'
    },
    {
      id: 'health',
      title: 'View Analytics',
      icon: ChartBarIcon,
      color: '#06b6d4',
      badge: null
    },
    {
      id: 'workout',
      title: 'Log Workout',
      icon: PlusIcon,
      color: '#f59e0b',
      badge: null
    },
    {
      id: 'scan',
      title: 'Scan Food',
      icon: CameraIcon,
      color: '#10b981',
      badge: 'Beta'
    },
    {
      id: 'vitals',
      title: 'Check Vitals',
      icon: HeartIcon,
      color: '#ef4444',
      badge: null
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: CalendarIcon,
      color: '#6366f1',
      badge: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-title">Quick Actions</h2>
        <button className="btn btn-ghost btn-sm">Customize</button>
      </div>
      
      {/* Actions Grid */}
      <div className="grid grid-3 md:grid-6 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActionClick?.(action.id)}
            className="card card-compact text-center relative cursor-pointer"
          >
            {action.badge && (
              <div className="absolute top-2 right-2 status status-success text-xs">
                {action.badge}
              </div>
            )}
            
            <div className="space-y-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: action.color }}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>
              
              <span className="text-body font-medium">{action.title}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;