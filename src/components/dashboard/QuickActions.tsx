import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  PlusIcon,
  CameraIcon,
  HeartIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  Cog6ToothIcon
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
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      badge: 'New'
    },
    {
      id: 'health',
      title: 'View Analytics',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      badge: null
    },
    {
      id: 'workout',
      title: 'Log Workout',
      icon: PlusIcon,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      badge: null
    },
    {
      id: 'scan',
      title: 'Scan Food',
      icon: CameraIcon,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      badge: 'Beta'
    },
    {
      id: 'vitals',
      title: 'Check Vitals',
      icon: HeartIcon,
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      badge: null
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: CalendarIcon,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      badge: null
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground font-inter">Quick Actions</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium">Customize</button>
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
            className="bg-card border border-border rounded-xl p-4 text-center relative cursor-pointer hover:shadow-md hover:border-[#48C6FF]/20 hover:-translate-y-1 transition-all duration-200 min-h-[120px] flex flex-col items-center justify-center gap-3"
          >
            {action.badge && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full border border-green-500/20">
                {action.badge}
              </div>
            )}
            
            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <action.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              
              <span className="text-sm lg:text-base font-semibold text-foreground font-inter">{action.title}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;