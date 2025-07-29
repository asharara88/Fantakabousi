import React from 'react';
import { motion } from 'framer-motion';
import InternalLink from '../ui/InternalLink';
import { 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  PlusIcon,
  CalendarIcon,
  CameraIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface QuickActionsProps {
  onActionClick?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
     title: 'Chat with Coach',
      description: 'Get personalized health guidance',
      icon: ChatBubbleLeftRightIcon,
      gradient: 'from-blue-500 to-cyan-600',
      badge: 'New insights',
      href: '/coach',
      tabId: 'coach',
      action: 'Start Chat'
    },
    {
      title: 'View Analytics',
      description: 'Deep dive into your health trends',
      icon: ChartBarIcon,
      gradient: 'from-emerald-500 to-green-600',
      badge: null,
      href: '/health',
      tabId: 'health',
      action: 'Explore Data'
    },
    {
      title: 'Log Workout',
      description: 'Track your fitness session',
      icon: PlusIcon,
      gradient: 'from-orange-500 to-red-600',
      badge: null,
      href: '/health',
      tabId: 'health',
      action: 'Add Workout',
    },
    {
      title: 'Schedule Check-in',
      description: 'Book a wellness consultation',
      icon: CalendarIcon,
      gradient: 'from-purple-500 to-indigo-600',
      badge: null,
      href: '/coach',
      tabId: 'coach',
      action: 'Book Now',
    },
    {
      title: 'Scan Food',
      description: 'AI-powered nutrition tracking',
      icon: CameraIcon,
      gradient: 'from-green-500 to-emerald-600',
      badge: 'Beta',
      href: '/health',
      tabId: 'health',
      action: 'Scan Now',
    },
    {
      title: 'Health Check',
      description: 'Quick vitals assessment',
      icon: HeartIcon,
      gradient: 'from-rose-500 to-pink-600',
      badge: null,
      href: '/health',
      tabId: 'health',
      action: 'Start Check',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-heading-xl text-foreground">Quick Actions</h2>
          <p className="text-caption">Fast access to key features</p>
        </div>
        <button className="btn-ghost flex items-center space-x-2">
          <span>Customize</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid-premium grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <InternalLink
              href={action.href}
              className="card-premium p-6 h-full text-left group hover:scale-[1.02] transition-all duration-300 block"
              variant="ghost"
              onClick={() => {
                if (onActionClick && action.tabId) {
                  onActionClick(action.tabId);
                }
              }}
              analytics={{
                event: 'quick_action_click',
                category: 'dashboard_navigation',
                label: action.title,
              }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  {action.badge && (
                    <div className="status-indicator status-success">
                      {action.badge}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-body font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-caption leading-relaxed">
                    {action.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-body font-semibold text-primary group-hover:text-primary/80 transition-colors">
                      {action.action}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </InternalLink>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;