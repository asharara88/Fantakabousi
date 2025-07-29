import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface BiometricData {
  date: string;
  heartRate: number;
  hrv: number;
  sleep: number;
  glucose: number;
  steps: number;
}

const BiometricChart: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('heartRate');
  const [timeRange, setTimeRange] = useState('7d');

  const data: BiometricData[] = [
    { date: 'Mon', heartRate: 65, hrv: 38, sleep: 85, glucose: 95, steps: 8500 },
    { date: 'Tue', heartRate: 63, hrv: 42, sleep: 88, glucose: 92, steps: 9200 },
    { date: 'Wed', heartRate: 67, hrv: 35, sleep: 82, glucose: 98, steps: 7800 },
    { date: 'Thu', heartRate: 61, hrv: 45, sleep: 91, glucose: 89, steps: 10500 },
    { date: 'Fri', heartRate: 64, hrv: 41, sleep: 87, glucose: 94, steps: 9800 },
    { date: 'Sat', heartRate: 59, hrv: 48, sleep: 94, glucose: 91, steps: 12000 },
    { date: 'Sun', heartRate: 62, hrv: 44, sleep: 89, glucose: 93, steps: 8900 },
  ];

  const metrics = [
    { 
      key: 'heartRate', 
      name: 'Heart Rate', 
      unit: 'bpm', 
      color: 'from-red-500 to-pink-600',
      trend: -4.8,
      optimal: '< 65 bpm'
    },
    { 
      key: 'hrv', 
      name: 'HRV', 
      unit: 'ms', 
      color: 'from-blue-500 to-cyan-600',
      trend: 15.8,
      optimal: '> 40 ms'
    },
    { 
      key: 'sleep', 
      name: 'Sleep Score', 
      unit: '/100', 
      color: 'from-indigo-500 to-purple-600',
      trend: 8.2,
      optimal: '> 85'
    },
    { 
      key: 'glucose', 
      name: 'Glucose', 
      unit: 'mg/dL', 
      color: 'from-green-500 to-emerald-600',
      trend: -2.1,
      optimal: '80-100 mg/dL'
    },
    { 
      key: 'steps', 
      name: 'Daily Steps', 
      unit: '', 
      color: 'from-orange-500 to-red-600',
      trend: 12.5,
      optimal: '> 10,000'
    },
  ];

  const selectedMetricData = metrics.find(m => m.key === selectedMetric)!;
  const chartData = data.map(d => d[selectedMetric as keyof BiometricData]);
  const maxValue = Math.max(...chartData as number[]);
  const minValue = Math.min(...chartData as number[]);
  const range = maxValue - minValue || 1;

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-display text-gradient-brand">Biometric Trends</h2>
            </div>
            <p className="text-white/70 text-lg">
              Track your health metrics over time
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {metrics.map((metric) => (
            <motion.button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`glass-ultra rounded-xl p-4 text-center transition-all duration-300 ${
                selectedMetric === metric.key 
                  ? 'border-2 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className={`text-lg font-bold ${
                  selectedMetric === metric.key ? 'text-blue-400' : 'text-white'
                }`}>
                  {data[data.length - 1][metric.key as keyof BiometricData]}{metric.unit}
                </div>
                <div className={`text-sm font-semibold ${
                  selectedMetric === metric.key ? 'text-blue-300' : 'text-white/70'
                }`}>
                  {metric.name}
                </div>
                <div className={`flex items-center justify-center space-x-1 text-xs ${
                  metric.trend > 0 ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {metric.trend > 0 ? (
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3" />
                  )}
                  <span>{Math.abs(metric.trend)}%</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-ultra rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                {selectedMetricData.name}
              </h3>
              <div className="text-sm text-white/60">
                Optimal range: {selectedMetricData.optimal}
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r ${selectedMetricData.color} text-white font-semibold`}>
              {selectedMetricData.trend > 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              <span>{Math.abs(selectedMetricData.trend)}% this week</span>
            </div>
          </div>
          
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between space-x-2">
              {data.map((point, index) => {
                const value = point[selectedMetric as keyof BiometricData] as number;
                const height = ((value - minValue) / range) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-3">
                    <motion.div
                      className={`w-full bg-gradient-to-t ${selectedMetricData.color} rounded-t-lg relative group cursor-pointer`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 10)}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {value}{selectedMetricData.unit}
                      </div>
                    </motion.div>
                    <div className="text-sm font-semibold text-white/70">
                      {point.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 glass-ultra rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <EyeIcon className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold text-white">AI Analysis</h3>
          </div>
          <div className="space-y-3">
            <p className="text-white/80">
              Your {selectedMetricData.name.toLowerCase()} shows a{' '}
              <span className={selectedMetricData.trend > 0 ? 'text-green-400' : 'text-blue-400'}>
                {selectedMetricData.trend > 0 ? 'positive' : 'improving'} trend
              </span>{' '}
              over the past week. This indicates excellent progress toward your health goals.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/60">Within optimal range</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/60">Consistent improvement</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BiometricChart;