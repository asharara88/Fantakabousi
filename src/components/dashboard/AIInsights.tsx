import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const AIInsights: React.FC = () => {
  const insights = [
    {
      type: 'success',
      icon: CheckCircleIcon,
      title: 'Perfect Recovery Window',
      message: 'Your HRV is 12% above baseline. Ideal conditions for high-intensity training today.',
      confidence: 96,
      priority: 'high',
      action: 'Start Workout',
      gradient: 'from-emerald-500 to-green-600',
      variant: 'success',
    },
    {
      type: 'optimization',
      icon: LightBulbIcon,
      title: 'Supplement Timing',
      message: 'Take creatine 30 minutes before your workout for optimal absorption and performance.',
      confidence: 89,
      priority: 'medium',
      action: 'Set Reminder',
      gradient: 'from-blue-500 to-cyan-600',
      variant: 'success',
    },
    {
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Hydration Alert',
      message: 'Morning weight suggests mild dehydration. Aim for 750ml water in the next hour.',
      confidence: 92,
      priority: 'high',
      action: 'Track Water',
      gradient: 'from-amber-500 to-orange-600',
      variant: 'warning',
    },
    {
      type: 'insight',
      icon: BeakerIcon,
      title: 'Sleep Pattern Analysis',
      message: 'Your deep sleep increased 15% this week. Consider maintaining current bedtime routine.',
      confidence: 94,
      priority: 'low',
      action: 'View Trends',
      gradient: 'from-purple-500 to-indigo-600',
      variant: 'success',
    },
  ];

  const getPriorityVariant = (priority: string) => {
    const variants = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    };
    return variants[priority as keyof typeof variants];
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-heading-xl text-foreground">AI Health Insights</h2>
              <p className="text-caption">Personalized recommendations from your data</p>
            </div>
          </div>
        </div>
        <button className="btn-ghost flex items-center space-x-2">
          <span>View All Insights</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid-premium grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="card-premium p-6 group hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${insight.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <insight.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-body font-semibold text-foreground">
                      {insight.title}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div className={`status-indicator status-${getPriorityVariant(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </div>
                      <div className="flex items-center space-x-2 text-caption">
                        <ClockIcon className="w-3 h-3" />
                        <span>AI Confidence: {insight.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-body text-muted-foreground leading-relaxed">
                Chat with your Coach for personalized guidance and deeper insights
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button className={`btn-primary bg-gradient-to-r ${insight.gradient}`}>
                  {insight.action}
                </button>
                <button className="btn-ghost flex items-center space-x-2">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                 <span>Ask Coach</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="card-premium p-6 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="status-dot success animate-pulse"></div>
            <div className="text-body font-medium text-foreground">
              Last updated: 2 minutes ago
            </div>
          </div>
          <button className="btn-ghost flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4" />
            <span>Get More Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;