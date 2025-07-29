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
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Glucose Spikes Detected',
      message: 'Your CGM shows 8 glucose spikes this week averaging 185 mg/dL post-meal. This may impact fertility hormones and muscle recovery.',
      confidence: 94,
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
    },
    {
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Hydration Alert',
      message: 'Your morning weight indicates mild dehydration (-0.8% from baseline). Aim for 750ml of water in the next hour.',
      gradient: 'from-amber-500 to-orange-600',
      priority: 'high',
      action: 'Review Diet',
      gradient: 'from-red-500 to-pink-600',
      type: 'optimization',
      icon: BeakerIcon,
      title: 'Insulin Sensitivity Protocol',
      message: 'Your insulin resistance requires targeted intervention. Consider metformin consultation and time-restricted eating windows.',
      confidence: 88,
      message: 'Your heart rate variability has increased by 12% over the past week, indicating improved autonomic nervous system balance.',
      action: 'Protocol Plan',
      gradient: 'from-green-500 to-emerald-600',
      timestamp: '1 day ago',
      confidence: 94,
    },
      type: 'optimization',
      icon: CheckCircleIcon,
      title: 'Training Volume Optimization',
      message: 'Your current training strain of 16.8/21 may be hindering recovery. Consider reducing volume by 20% to optimize hormone production.',
      confidence: 86,
      priority: 'medium',
      action: 'Adjust Training',
      gradient: 'from-orange-500 to-red-600',
      variant: 'warning',
      variant: 'warning',
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
    <div className="glass-card rounded-3xl p-12 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BeakerIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-display text-white">Health Insights</h3>
            </div>
            <p className="text-xl text-white/70">
              AI-powered recommendations based on your biometric data
            </p>
          </div>
          <button className="px-6 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-semibold">
            View All Insights
          </button>
        </div>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className="insight-card group hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-start space-x-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${insight.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <insight.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-xl font-bold text-white">
                          {insight.title}
                        </h4>
                        {getPriorityIndicator(insight.priority)}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-white/60">
                          <ClockIcon className="w-4 h-4" />
                          <span>{insight.timestamp}</span>
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/80">
                          AI Confidence: {insight.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed">
                    {insight.message}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <InternalLink
                      href="/coach"
                      variant="primary"
                      className={`text-sm font-semibold bg-gradient-to-r ${insight.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                      analytics={{
                        event: 'insight_learn_more',
                        category: 'health_insights',
                        label: insight.title,
                      }}
                    >
                     Ask Coach →
                    </InternalLink>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-premium p-6 group hover:scale-[1.02] cursor-pointer"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white">
                  Ready to optimize further?
                </h4>
              </div>
              <p className="text-white/70">
                Chat with your AI wellness coach for personalized guidance and deeper insights
              </p>
            </div>
            <div className="flex space-x-4">
              <InternalLink
                href="/coach"
                className="btn-premium-ultra"
                analytics={{
                  event: 'start_ai_chat',
                  category: 'health_insights',
                  label: 'cta_button',
                }}
                onClick={() => {
                  // Navigate to coach tab if onActionClick is available
                  if (typeof window !== 'undefined') {
                    // Trigger navigation to coach
                    const event = new CustomEvent('navigateToCoach');
                    window.dispatchEvent(event);
                  }
                }}
              >
                <span>Start Chat</span>
              </InternalLink>
              <button className="px-6 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300">
                Schedule Call
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthInsights;