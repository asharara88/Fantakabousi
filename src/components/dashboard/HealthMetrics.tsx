import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  BoltIcon, 
  MoonIcon, 
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const HealthMetrics: React.FC = () => {
  const metrics = [
    {
      name: 'Heart Rate',
      value: 68,
      unit: 'bpm',
      change: -3,
      trend: 'down',
      icon: HeartIcon,
      color: 'from-red-500 to-rose-600',
      data: [72, 70, 69, 68, 67, 68, 68],
      optimal: true,
      description: 'Resting heart rate',
      target: 65,
    },
    {
      name: 'HRV',
      value: 42,
      unit: 'ms',
      change: 8,
      trend: 'up',
      icon: BoltIcon,
      color: 'from-blue-500 to-cyan-600',
      data: [35, 38, 40, 39, 41, 42, 42],
      optimal: true,
      description: 'Heart rate variability',
      target: 40,
    },
    {
      name: 'Sleep Score',
      value: 94,
      unit: '/100',
      change: 5,
      trend: 'up',
      icon: MoonIcon,
      color: 'from-indigo-500 to-purple-600',
      data: [85, 88, 90, 92, 91, 93, 94],
      optimal: true,
      description: '8h 23m quality sleep',
      target: 85,
    },
    {
      name: 'Active Calories',
      value: 2341,
      unit: 'kcal',
      change: 12,
      trend: 'up',
      icon: FireIcon,
      color: 'from-orange-500 to-red-600',
      data: [2100, 2200, 2150, 2300, 2250, 2400, 2341],
      optimal: true,
      description: 'Daily energy burn',
      target: 2200,
    },
  ];

  const MiniChart: React.FC<{ data: number[]; gradient: string }> = ({ data, gradient }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end space-x-1 h-12 w-24">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isLast = index === data.length - 1;
          return (
            <motion.div
              key={index}
              className={`bg-gradient-to-t ${gradient} rounded-sm ${isLast ? 'opacity-100' : 'opacity-60'}`}
              style={{ width: '3px' }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 15)}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-heading-xl text-foreground">Health Metrics</h2>
          <p className="text-caption">Real-time biometric tracking</p>
        </div>
        <button className="btn-ghost flex items-center space-x-2">
          <ChartBarIcon className="w-4 h-4" />
          <span>View Trends</span>
        </button>
      </div>
      
      <div className="grid-premium grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="metric-card group"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  {metric.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-blue-500" />
                  )}
                  <span className={`text-caption font-semibold ${
                    metric.trend === 'up' ? 'text-emerald-500' : 'text-blue-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-heading-lg font-bold text-foreground">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-caption">
                    {metric.unit}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-body font-semibold text-foreground">
                    {metric.name}
                  </div>
                  <div className="text-caption">
                    {metric.description}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <MiniChart data={metric.data} gradient={metric.color} />
                <div className={`status-dot ${metric.optimal ? 'success' : 'warning'}`} />
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-caption">
                  <span>Target: {metric.target}{metric.unit}</span>
                  <span className={metric.value >= metric.target ? 'text-emerald-500' : 'text-amber-500'}>
                    {Math.round((metric.value / metric.target) * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    transition={{ delay: 1 + index * 0.1, duration: 1.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HealthMetrics;