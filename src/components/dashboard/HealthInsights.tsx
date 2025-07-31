import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const HealthInsights: React.FC = () => {
  const insights = [
    {
      id: 'glucose',
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Glucose Alert',
      message: 'Your glucose might spike after lunch. Consider a lighter meal or take a walk.',
      confidence: 94,
      color: 'from-red-500 to-pink-600',
      priority: 'high'
    },
    {
      id: 'workout',
      type: 'success',
      icon: SparklesIcon,
      title: 'Perfect Training Window',
      message: 'Your energy levels are high right now. Great time for a workout!',
      confidence: 89,
      color: 'from-green-500 to-emerald-600',
      priority: 'medium'
    },
    {
      id: 'sleep',
      type: 'info',
      icon: BeakerIcon,
      title: 'Sleep Optimization',
      message: 'Deep sleep at 45min vs 90min target. Consider magnesium supplementation.',
      confidence: 88,
      color: 'from-blue-500 to-cyan-600',
      priority: 'medium'
    }
  ];

  const getPriorityVariant = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
            <BeakerIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-inter">Health Insights</h2>
            <p className="text-muted-foreground font-inter">AI recommendations from your data</p>
          </div>
        </div>
        <button className="btn-ghost flex items-center space-x-2">
          <span>View All</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      {/* Insights Grid */}
      <div className="mobile-grid-1 lg:grid-cols-2 xl:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium hover:shadow-xl hover:border-[#48C6FF]/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${insight.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <insight.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground font-inter">
                      {insight.title}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityVariant(insight.priority)}`}>
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
              
              {/* Message */}
              <p className="text-base text-muted-foreground leading-relaxed font-inter">
                {insight.message}
              </p>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button className={`px-6 py-3 bg-gradient-to-r ${insight.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg font-inter`}>
                  Take Action
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

      {/* Status */}
      <div className="card bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#3BE6C5] rounded-full animate-pulse"></div>
            <span className="text-base font-medium text-foreground font-inter">
              Last updated: 2 minutes ago
            </span>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4" />
            <span>Get More Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;