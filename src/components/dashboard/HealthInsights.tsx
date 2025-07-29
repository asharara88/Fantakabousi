import React from 'react';
import { motion } from 'framer-motion';
import InternalLink from '../ui/InternalLink';
import { 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const HealthInsights: React.FC = () => {
  const insights = [
    {
      type: 'achievement',
      icon: CheckCircleIcon,
      title: 'Sleep Streak Achievement',
      message: 'Your CGM shows 8 glucose spikes this week averaging 185 mg/dL post-meal. This may impact fertility hormones and muscle recovery.',
      gradient: 'from-green-500 to-emerald-600',
      priority: 'low',
      timestamp: '2 days ago',
      confidence: 94,
      action: 'View Trends'
    },
    {
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Glucose Spikes Detected',
      message: 'Your CGM shows 8 glucose spikes this week averaging 185 mg/dL post-meal. This may impact fertility hormones and muscle recovery.',
      gradient: 'from-red-500 to-pink-600',
      priority: 'high',
      timestamp: '6 hours ago',
      confidence: 94,
      action: 'Review Diet'
    },
    {
      type: 'optimization',
      icon: SparklesIcon,
      title: 'Pre-Workout Optimization',
      message: 'Your readiness score of 87 suggests optimal conditions for high-intensity training. Consider taking creatine 30 minutes before your workout.',
      gradient: 'from-blue-500 to-cyan-600',
      priority: 'medium',
      timestamp: '4 hours ago',
      confidence: 89,
      action: 'View Protocol'
    },
    {
      type: 'optimization',
      icon: BeakerIcon,
      title: 'Insulin Sensitivity Protocol',
      message: 'Your insulin resistance requires targeted intervention. Consider metformin consultation and time-restricted eating windows.',
      gradient: 'from-purple-500 to-indigo-600',
      priority: 'high',
      timestamp: '1 day ago',
      confidence: 88,
      action: 'Protocol Plan'
    },
    {
      type: 'optimization',
      icon: ArrowTrendingUpIcon,
      title: 'Training Volume Optimization',
      message: 'Your current training strain of 16.8/21 may be hindering recovery. Consider reducing volume by 20% to optimize hormone production.',
      gradient: 'from-orange-500 to-red-600',
      priority: 'medium',
      timestamp: '12 hours ago',
      confidence: 86,
      action: 'Adjust Training',
    }
  ];

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg" />;
      case 'medium':
        return <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg" />;
      default:
        return <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BeakerIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-heading-lg text-foreground">Health Insights</h2>
              <p className="text-caption">AI-powered recommendations</p>
            </div>
          </div>
        </div>
        <button className="btn-ghost flex items-center space-x-2">
          <span>View All</span>
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
            className="card-minimal p-6 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${insight.gradient} rounded-lg flex items-center justify-center`}>
                    <insight.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-body font-semibold text-foreground">
                      {insight.title}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div className={`status-indicator status-${getPriorityVariant(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </div>
                      <div className="text-caption">
                        AI: {insight.confidence}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-body text-muted-foreground leading-relaxed">
                {insight.message}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button className={`btn-primary bg-gradient-to-r ${insight.gradient} text-sm px-4 py-2`}>
                  {insight.action}
                </button>
                <InternalLink
                  href="/coach"
                  variant="ghost"
                  className="text-sm flex items-center space-x-1"
                  analytics={{
                    event: 'insight_ask_coach',
                    category: 'health_insights',
                    label: insight.title,
                  }}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>Ask Coach</span>
                </InternalLink>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="card-minimal p-6 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="status-dot success animate-pulse"></div>
            <div className="text-body font-medium text-foreground">
              Last updated: 2 minutes ago
            </div>
          </div>
          <InternalLink
            href="/coach"
            className="btn-primary flex items-center space-x-2"
            analytics={{
              event: 'start_ai_chat',
              category: 'health_insights',
              label: 'cta_button',
            }}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Chat with Coach</span>
          </InternalLink>
        </div>
      </div>
    </div>
            <div className="flex items-center space-x-3">
};

export default HealthInsights;