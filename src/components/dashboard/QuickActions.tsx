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
      color: 'var(--primary)',
      badge: 'New'
    },
    {
      id: 'health',
      title: 'View Analytics',
      icon: ChartBarIcon,
      color: 'var(--secondary)',
      badge: null
    },
    {
      id: 'workout',
      title: 'Log Workout',
      icon: PlusIcon,
      color: 'var(--warning)',
      badge: null
    },
    {
      id: 'scan',
      title: 'Scan Food',
      icon: CameraIcon,
      color: 'var(--success)',
      badge: 'Beta'
    },
    {
      id: 'vitals',
      title: 'Check Vitals',
      icon: HeartIcon,
      color: 'var(--error)',
      badge: null
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: CalendarIcon,
      color: 'var(--accent)',
      badge: null
    }
  ];

  return (
    <div className="stack stack-lg">
      {/* Header */}
      <div className="cluster justify-between">
        <h2 className="text-title">Quick Actions</h2>
        <button className="btn btn-ghost btn-sm">Customize</button>
      </div>
      
      {/* Actions Grid */}
      <div className="grid grid-3 grid-md">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActionClick?.(action.id)}
            className="card card-flat text-left relative"
          >
            {action.badge && (
              <div className="absolute top-3 right-3 status status-success">
                {action.badge}
              </div>
            )}
            
            <div className="stack stack-md">
              <div 
                className="avatar avatar-md"
                style={{ backgroundColor: action.color }}
              >
                <action.icon className="icon icon-lg" />
              </div>
              
              <div className="stack stack-sm">
                <span className="text-heading">{action.title}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;