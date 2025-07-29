import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const HealthInsights: React.FC = () => {
  const insights = [
    {
      id: 'glucose',
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Glucose Spikes',
      message: 'CGM shows 8 spikes this week averaging 185 mg/dL post-meal.',
      confidence: 94,
      color: '#ef4444'
    },
    {
      id: 'workout',
      type: 'success',
      icon: SparklesIcon,
      title: 'Optimal Training',
      message: 'Readiness score of 87 suggests ideal conditions for high-intensity training.',
      confidence: 89,
      color: '#10b981'
    },
    {
      id: 'sleep',
      type: 'info',
      icon: BeakerIcon,
      title: 'Sleep Protocol',
      message: 'Deep sleep at 45min vs 90min target. Consider magnesium supplementation.',
      confidence: 88,
      color: '#3b82f6'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
            <BeakerIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-title">Health Insights</h2>
            <p className="text-caption">AI recommendations from your data</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm">View All</button>
      </div>
      
      {/* Insights Grid */}
      <div className="grid md:grid-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-compact"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: insight.color }}
                  >
                    <insight.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-heading">{insight.title}</span>
                </div>
                <div className="text-label">AI: {insight.confidence}%</div>
              </div>

              {/* Message */}
              <p className="text-body">{insight.message}</p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: insight.color }}
                >
                  Take Action
                </button>
                <button className="btn btn-ghost btn-sm">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Ask Coach
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status */}
      <div className="card card-compact">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-caption">Updated 2 minutes ago</span>
          </div>
          <button className="btn btn-primary btn-sm">
            <SparklesIcon className="w-4 h-4" />
            Chat with Coach
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;