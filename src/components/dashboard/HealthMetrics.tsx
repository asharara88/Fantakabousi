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
      <div className="flex items-end space-x-1 h-16 w-32">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isLast = index === data.length - 1;
          return (
            <motion.div
              key={index}
              className={`bg-gradient-to-t ${gradient} rounded-lg shadow-lg ${
                isLast ? 'opacity-100 shadow-xl' : 'opacity-70'
              }`}
              style={{ width: '4px' }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 15)}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.1, opacity: 1 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 relative">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl -z-10" />
      
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Health Metrics
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Real-time biometric intelligence</p>
            </div>
          </div>
        </div>
        <motion.button 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChartBarIcon className="w-4 h-4" />
          <span>Advanced Analytics</span>
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="metric-card-premium rounded-3xl p-6 group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-6 relative">
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 rounded-3xl`} />
              
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl" />
                  <metric.icon className="w-7 h-7 text-white relative z-10" />
                </div>
                <div className="flex items-center space-x-2">
                  {metric.trend === 'up' ? (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-emerald-500/20 rounded-full">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-600">+{metric.change}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 rounded-full">
                      <ArrowTrendingDownIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-bold text-blue-600">{metric.change}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                    {metric.unit}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {metric.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {metric.description}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <MiniChart data={metric.data} gradient={metric.color} />
                <div className={`w-3 h-3 rounded-full ${
                  metric.optimal ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-amber-400 shadow-lg shadow-amber-400/50'
                } animate-pulse`} />
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Target: {metric.target}{metric.unit}</span>
                  <span className={`font-bold ${metric.value >= metric.target ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {Math.round((metric.value / metric.target) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full shadow-lg`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    transition={{ delay: 1 + index * 0.1, duration: 1.5, ease: "easeOut" }}
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