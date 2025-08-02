import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'coach',
      title: 'Smart Coach',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      badge: 'New',
      expandedData: [
        { label: 'Active Chats', value: '3' },
        { label: 'Insights Today', value: '7' },
        { label: 'Confidence', value: '94%' },
        { label: 'Response Time', value: '< 2s' }
      ]
    },
    {
      id: 'plan',
      title: 'Plan Your Day',
      icon: CalendarIcon,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      badge: null,
      expandedData: [
        { label: 'Tasks Today', value: '6' },
        { label: 'Completed', value: '4' },
        { label: 'Next Task', value: '2:30 PM' },
        { label: 'Efficiency', value: '87%' }
      ]
    },
    {
      id: 'health',
      title: 'View Analytics',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      badge: null,
      expandedData: [
        { label: 'Data Points', value: '1,247' },
        { label: 'Trends', value: '5 improving' },
        { label: 'Last Sync', value: '2m ago' },
        { label: 'Accuracy', value: '98%' }
      ]
    },
    {
      id: 'shop',
      title: 'Supplements',
      icon: CubeIcon,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      badge: null,
      expandedData: [
        { label: 'In Stack', value: '6 items' },
        { label: 'Monthly Cost', value: 'AED 267' },
        { label: 'Next Delivery', value: 'Feb 15' },
        { label: 'Savings', value: '20%' }
      ]
    },
    {
      id: 'food',
      title: 'Log Food',
      icon: CameraIcon,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      badge: null,
      expandedData: [
        { label: 'Meals Today', value: '3' },
        { label: 'Calories', value: '1,847' },
        { label: 'Protein', value: '142g' },
        { label: 'Health Score', value: '85/100' }
      ]
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: HeartIcon,
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      badge: null,
      expandedData: [
        { label: 'Profile', value: '95% complete' },
        { label: 'Goals', value: '4 active' },
        { label: 'Streak', value: '12 days' },
        { label: 'Level', value: 'Advanced' }
      ]
    },
    {
      id: 'recipes',
      title: 'Find Recipes',
      icon: MagnifyingGlassIcon,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      badge: null,
      expandedData: [
        { label: 'Saved Recipes', value: '23' },
        { label: 'Tried This Week', value: '4' },
        { label: 'Avg Rating', value: '4.8★' },
        { label: 'Health Score', value: '92/100' }
      ]
    }
  ];

  const toggleActionExpansion = (actionId: string) => {
    setExpandedAction(expandedAction === actionId ? null : actionId);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground font-inter">Quick Actions</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium">Customize</button>
      </div>
      
      {/* Actions Grid */}
      <div className="mobile-grid-2 lg:grid-cols-3 xl:grid-cols-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              if (expandedAction === action.id) {
                onActionClick?.(action.id);
              } else {
                toggleActionExpansion(action.id);
              }
            }}
            className={`relative p-4 lg:p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${expandedAction === action.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'} ${
              expandedAction === action.id ? 'lg:col-span-2' : 'min-h-[120px]'
            } flex flex-col items-center justify-center gap-3`}
          >
            {action.badge && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full border border-green-500/20">
                {action.badge}
              </div>
            )}
            
            <div className={`flex ${expandedAction === action.id ? 'flex-row items-start' : 'flex-col items-center'} gap-3 w-full`}>
              <div className={`w-12 h-12 lg:w-14 lg:h-14 ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <action.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              
              <div className={`${expandedAction === action.id ? 'flex-1' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm lg:text-base font-semibold text-foreground font-inter">{action.title}</span>
                  {expandedAction !== action.id && (
                    <div className="transform transition-transform duration-200">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <AnimatePresence>
                  {expandedAction === action.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 grid grid-cols-2 gap-3"
                    >
                      {action.expandedData.map((item, idx) => (
                        <div key={idx} className="text-center p-2 bg-muted/30 rounded-lg">
                          <div className="text-sm font-bold text-foreground">{item.value}</div>
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                        </div>
                      ))}
                      <div className="col-span-2 mt-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onActionClick?.(action.id);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-blue-light to-blue-medium text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Open {action.title} →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;