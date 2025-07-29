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
      color: 'var(--error)'
    },
    {
      id: 'workout',
      type: 'success',
      icon: SparklesIcon,
      title: 'Optimal Training',
      message: 'Readiness score of 87 suggests ideal conditions for high-intensity training.',
      confidence: 89,
      color: 'var(--success)'
    },
    {
      id: 'sleep',
      type: 'info',
      icon: BeakerIcon,
      title: 'Sleep Protocol',
      message: 'Deep sleep at 45min vs 90min target. Consider magnesium supplementation.',
      confidence: 88,
      color: 'var(--info)'
    }
  ];

  return (
    <div className="stack stack-lg">
      {/* Header */}
      <div className="cluster justify-between">
        <div className="cluster cluster-md">
          <div className="avatar avatar-md" style={{ backgroundColor: 'var(--accent)' }}>
            <BeakerIcon className="icon icon-lg" />
          </div>
          <div className="stack stack-sm">
            <h2 className="text-title">Health Insights</h2>
            <p className="text-caption">AI recommendations from your data</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm">View All</button>
      </div>
      
      {/* Insights Grid */}
      <div className="grid grid-auto grid-md">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-flat"
          >
            <div className="stack stack-md">
              {/* Header */}
              <div className="cluster justify-between">
                <div className="cluster cluster-sm">
                  <div 
                    className="avatar avatar-sm"
                    style={{ backgroundColor: insight.color }}
                  >
                    <insight.icon className="icon icon-sm" />
                  </div>
                  <span className="text-heading">{insight.title}</span>
                </div>
                <div className="text-label">AI: {insight.confidence}%</div>
              </div>

              {/* Message */}
              <p className="text-body">{insight.message}</p>

              {/* Actions */}
              <div className="cluster justify-between">
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: insight.color }}
                >
                  Take Action
                </button>
                <button className="btn btn-ghost btn-sm cluster cluster-sm">
                  <ChatBubbleLeftRightIcon className="icon icon-sm" />
                  Ask Coach
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status */}
      <div className="card card-flat">
        <div className="cluster justify-between">
          <div className="cluster cluster-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-caption">Updated 2 minutes ago</span>
          </div>
          <button className="btn btn-primary btn-sm cluster cluster-sm">
            <SparklesIcon className="icon icon-sm" />
            Chat with Coach
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;