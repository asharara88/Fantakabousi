import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoonIcon, 
  BoltIcon, 
  HeartIcon, 
  FireIcon,
  BeakerIcon,
  ChevronDownIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

const MetricsGrid: React.FC = () => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const metrics = [
    {
      id: 'sleep',
      label: 'Sleep Score',
      value: 68,
      unit: '/100',
      change: -3,
      icon: MoonIcon,
      color: '#6366f1',
      target: 85,
      status: 'Below target'
    },
    {
      id: 'steps',
      label: 'Daily Steps',
      value: 8234,
      unit: '',
      change: -12,
      icon: BoltIcon,
      color: '#06b6d4',
      target: 10000,
      status: 'Below target'
    },
    {
      id: 'heart',
      label: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      change: 2,
      icon: HeartIcon,
      color: '#ef4444',
      target: 65,
      status: 'Elevated'
    },
    {
      id: 'glucose',
      label: 'Glucose',
      value: 142,
      unit: 'mg/dL',
      change: 8,
      icon: BeakerIcon,
      color: '#f59e0b',
      target: 100,
      status: 'High'
    }
  ];

  const toggleExpanded = (metricId: string) => {
    setExpandedMetric(expandedMetric === metricId ? null : metricId);
  };

  return (
    <div className="grid-premium grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const isExpanded = expandedMetric === metric.id;
        const isPositive = metric.change >= 0;
        const progress = Math.min((metric.value / metric.target) * 100, 100);
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="metric-card"
            onClick={() => toggleExpanded(metric.id)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: metric.color }}
              >
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`status-indicator ${isPositive ? 'status-success' : 'status-error'}`}>
                {isPositive ? (
                  <TrendingUpIcon className="w-3 h-3" />
                ) : (
                  <TrendingDownIcon className="w-3 h-3" />
                )}
                {isPositive ? '+' : ''}{metric.change}%
              </div>
            </div>

            {/* Value */}
            <div className="mb-3">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-foreground">
                  {metric.value.toLocaleString()}
                </span>
                <span className="text-caption">{metric.unit}</span>
              </div>
              <div className="text-body font-medium text-foreground mt-1">
                {metric.label}
              </div>
            </div>

            {/* Status */}
            <div className="text-caption mb-4">{metric.status}</div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-caption">
                <span>Target: {metric.target.toLocaleString()}{metric.unit}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  style={{ backgroundColor: metric.color }}
                />
              </div>
            </div>

            {/* Expand Indicator */}
            <div className="flex items-center justify-center mt-4">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-border"
                >
                  <div className="text-caption">
                    Detailed analytics and trends for {metric.label.toLowerCase()} coming soon.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;