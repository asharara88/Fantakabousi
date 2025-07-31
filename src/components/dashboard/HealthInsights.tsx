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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: insight.color }}
                  >
                    <insight.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{insight.title}</span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  AI: {insight.confidence}%
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 leading-relaxed">{insight.message}</p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button 
                  className="px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: insight.color }}
                >
                  Take Action
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>Ask Coach</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-gray-600">Updated 2 minutes ago</span>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4" />
            <span>Chat with Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;