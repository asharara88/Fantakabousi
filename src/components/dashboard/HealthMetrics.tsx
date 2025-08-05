import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  BoltIcon, 
  CloudIcon, 
  FireIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChartBarIcon,
  EyeIcon,
  BeakerIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const HealthMetrics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      id: 'heart_rate',
      name: 'Resting Heart Rate',
      value: 68,
      unit: 'bpm',
      change: -3,
      trend: 'improving',
      icon: HeartIcon,
      color: 'from-red-500 to-rose-600',
      data: [72, 70, 69, 68, 67, 68, 68],
      insights: {
        status: 'Excellent',
        confidence: 97,
        recommendation: 'Cardiovascular fitness is optimal',
        nextCheck: '2 hours'
      },
      description: 'Cardiovascular health indicator',
      target: 65,
      range: { min: 60, max: 100, optimal: [60, 70] }
    },
    {
      id: 'hrv',
      name: 'Heart Rate Variability',
      value: 42,
      unit: 'ms',
      change: 8,
      trend: 'improving',
      icon: BoltIcon,
      color: 'from-emerald-500 to-teal-600',
      data: [35, 38, 40, 39, 41, 42, 42],
      insights: {
        status: 'Excellent',
        confidence: 94,
        recommendation: 'Recovery status is optimal for training',
        nextCheck: '12 hours'
      },
      description: 'Recovery and stress resilience',
      target: 40,
      range: { min: 20, max: 60, optimal: [35, 50] }
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      value: 94,
      unit: '/100',
      change: 5,
      trend: 'excellent',
      icon: CloudIcon,
      color: 'from-indigo-500 to-purple-600',
      data: [85, 88, 90, 92, 91, 93, 94],
      insights: {
        status: 'Excellent',
        confidence: 96,
        recommendation: 'Sleep patterns are optimized',
        nextCheck: '8 hours'
      },
      description: 'Sleep efficiency and recovery',
      target: 85,
      range: { min: 0, max: 100, optimal: [80, 95] }
    },
    {
      id: 'calories',
      name: 'Active Energy',
      value: 2341,
      unit: 'kcal',
      change: 12,
      trend: 'increasing',
      icon: FireIcon,
      color: 'from-orange-500 to-red-600',
      data: [2100, 2200, 2150, 2300, 2250, 2400, 2341],
      insights: {
        status: 'Active',
        confidence: 91,
        recommendation: 'Energy expenditure is above target',
        nextCheck: '1 hour'
      },
      description: 'Daily energy expenditure',
      target: 2200,
      range: { min: 1500, max: 3500, optimal: [2000, 2500] }
    },
    {
      id: 'glucose',
      name: 'Blood Glucose',
      value: 94,
      unit: 'mg/dL',
      change: -2,
      trend: 'stable',
      icon: BeakerIcon,
      color: 'from-blue-500 to-cyan-600',
      data: [98, 96, 95, 94, 93, 94, 94],
      insights: {
        status: 'Optimal',
        confidence: 99,
        recommendation: 'Glucose levels are well-controlled',
        nextCheck: '15 minutes'
      },
      description: 'Metabolic health tracking',
      target: 90,
      range: { min: 70, max: 140, optimal: [80, 100] }
    },
    {
      id: 'stress',
      name: 'Stress Index',
      value: 23,
      unit: '/100',
      change: -15,
      trend: 'improving',
      icon: EyeIcon,
      color: 'from-violet-500 to-purple-600',
      data: [45, 38, 32, 28, 25, 24, 23],
      insights: {
        status: 'Low',
        confidence: 93,
        recommendation: 'Stress management is effective',
        nextCheck: '4 hours'
      },
      description: 'Stress and mental wellness',
      target: 30,
      range: { min: 0, max: 100, optimal: [0, 30] }
    }
  ];

  const MiniChart: React.FC<{ data: number[]; gradient: string; active: boolean }> = ({ data, gradient, active }) => {
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
              className={`bg-gradient-to-t ${gradient} rounded-sm ${
                isLast ? 'opacity-100' : 'opacity-60'
              }`}
              style={{ width: '3px' }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 15)}%` }}
              transition={{ 
                delay: 0.3 + index * 0.05, 
                duration: 0.6, 
                ease: [0.4, 0, 0.2, 1] 
              }}
            />
          );
        })}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent': return 'text-emerald-600 dark:text-emerald-400';
      case 'optimal': return 'text-blue-600 dark:text-blue-400';
      case 'good': return 'text-amber-600 dark:text-amber-400';
      case 'active': return 'text-orange-600 dark:text-orange-400';
      case 'low': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
    if (change < 0) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    return 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-display-sm font-display text-slate-900 dark:text-slate-100 tracking-tight">
            Health Metrics
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
            Real-time health monitoring and analysis
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-professional-pulse" />
            <span className="font-medium">Live monitoring</span>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-professional px-3 py-2 text-sm rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="health-metric-professional rounded-2xl p-6 cursor-pointer group"
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(metric.insights.status)} bg-current/10`}>
                    {metric.insights.status}
                  </div>
                </div>
              </div>
              
              {/* Value */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                    {metric.unit}
                  </span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getChangeColor(metric.change)}`}>
                    {metric.change > 0 ? (
                      <TrendingUpIcon className="w-3 h-3" />
                    ) : (
                      <TrendingDownIcon className="w-3 h-3" />
                    )}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{metric.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{metric.description}</div>
                </div>
              </div>
              
              {/* Chart and Confidence */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <MiniChart 
                  data={metric.data} 
                  gradient={metric.color} 
                  active={selectedMetric === metric.id}
                />
                <div className="text-right space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {metric.insights.confidence}%
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              <AnimatePresence>
                {selectedMetric === metric.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recommendation</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">{metric.insights.recommendation}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Next Check</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">{metric.insights.nextCheck}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-professional-pulse" />
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Monitoring active</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        Target: {metric.target}{metric.unit}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Health Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="card-professional rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Health Insights</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Personalized recommendations from your data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <ClockIcon className="w-4 h-4" />
            <span className="font-medium">Updated 2 min ago</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Optimal Training Window',
              insight: 'Your recovery metrics indicate peak performance readiness in 2 hours. Ideal for strength training.',
              confidence: 96,
              action: 'Schedule Workout',
              color: 'from-emerald-500 to-teal-600',
              icon: BoltIcon
            },
            {
              title: 'Nutrition Timing',
              insight: 'Your glucose response is excellent today. Perfect timing for your planned post-workout meal.',
              confidence: 94,
              action: 'Plan Nutrition',
              color: 'from-blue-500 to-cyan-600',
              icon: BeakerIcon
            },
            {
              title: 'Recovery Protocol',
              insight: 'Sleep quality improved 15% this week. Consider maintaining your current evening routine.',
              confidence: 91,
              action: 'View Sleep Data',
              color: 'from-indigo-500 to-purple-600',
              icon: CloudIcon
            }
          ].map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
              className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
              whileHover={{ y: -2 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 bg-gradient-to-br ${insight.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <insight.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold rounded-full">
                    {insight.confidence}% confidence
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{insight.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {insight.insight}
                  </p>
                </div>
                
                <button className={`w-full py-2 bg-gradient-to-r ${insight.color} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm`}>
                  {insight.action}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Health Score Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Overall Health Score</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Based on comprehensive analysis of your health metrics
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              94
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Excellent</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Cardiovascular', score: 96, icon: HeartIcon },
            { label: 'Recovery', score: 89, icon: BoltIcon },
            { label: 'Sleep', score: 94, icon: CloudIcon },
            { label: 'Metabolic', score: 91, icon: BeakerIcon }
          ].map((category, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="w-8 h-8 bg-white/60 dark:bg-slate-800/60 rounded-lg flex items-center justify-center mx-auto">
                <category.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{category.score}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{category.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HealthMetrics;