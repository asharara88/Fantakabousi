import React from 'react';
import { motion } from 'framer-motion';
import { 
  MoonIcon, 
  BoltIcon, 
  HeartIcon, 
  BeakerIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

const MetricsGrid: React.FC = () => {
  const metrics = [
    {
      id: 'sleep',
      label: 'Sleep Score',
      value: 68,
      unit: '/100',
      change: -3,
      icon: MoonIcon,
      color: '#6366f1',
      target: 85
    },
    {
      id: 'steps',
      label: 'Daily Steps',
      value: 8234,
      unit: '',
      change: -12,
      icon: BoltIcon,
      color: '#06b6d4',
      target: 10000
    },
    {
      id: 'heart',
      label: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      change: 2,
      icon: HeartIcon,
      color: '#ef4444',
      target: 65
    },
    {
      id: 'glucose',
      label: 'Glucose',
      value: 142,
      unit: 'mg/dL',
      change: 8,
      icon: BeakerIcon,
      color: '#f59e0b',
      target: 100
    }
  ];

  return (
    <div className="grid grid-2 md:grid-4">
      {metrics.map((metric, index) => {
        const isPositive = metric.change >= 0;
        const progress = Math.min((metric.value / metric.target) * 100, 100);
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="metric-card"
          >
            {/* Header */}
            <div className="metric-header">
              <div 
                className="metric-icon"
                style={{ backgroundColor: metric.color }}
              >
                <metric.icon className="w-5 h-5" />
              </div>
              <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? (
                  <TrendingUpIcon className="w-3 h-3" />
                ) : (
                  <TrendingDownIcon className="w-3 h-3" />
                )}
                {isPositive ? '+' : ''}{metric.change}%
              </div>
            </div>

            {/* Value */}
            <div>
              <div className="flex items-baseline gap-1">
                <span className="metric-value">
                  {metric.value.toLocaleString()}
                </span>
                <span className="text-caption">{metric.unit}</span>
              </div>
              <div className="metric-label">{metric.label}</div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-label">
                <span>Target: {metric.target.toLocaleString()}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress">
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  style={{ backgroundColor: metric.color }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;