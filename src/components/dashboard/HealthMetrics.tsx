import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  BoltIcon, 
  MoonIcon, 
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CpuChipIcon,
  EyeIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const HealthMetrics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState(true);

  const metrics = [
    {
      id: 'heart_rate',
      name: 'Heart Rate',
      value: 68,
      unit: 'bpm',
      change: -3,
      trend: 'optimal',
      icon: HeartIcon,
      color: 'from-red-400 via-pink-500 to-rose-600',
      data: [72, 70, 69, 68, 67, 68, 68],
      neural: {
        pattern: 'Healthy rhythm',
        confidence: 97,
        prediction: 'Stable trend',
        anomalies: 0
      },
      description: 'Cardiovascular health tracking',
      target: 65,
      status: 'optimal'
    },
    {
      id: 'hrv',
      name: 'Recovery Score',
      value: 42,
      unit: 'ms',
      change: 8,
      trend: 'improving',
      icon: BoltIcon,
      color: 'from-blue-400 via-cyan-500 to-teal-600',
      data: [35, 38, 40, 39, 41, 42, 42],
      neural: {
        pattern: 'Good recovery',
        confidence: 94,
        prediction: 'Ready for training',
        anomalies: 0
      },
      description: 'Recovery and stress resilience',
      target: 40,
      status: 'excellent'
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      value: 94,
      unit: '/100',
      change: 5,
      trend: 'excellent',
      icon: MoonIcon,
      color: 'from-indigo-400 via-purple-500 to-violet-600',
      data: [85, 88, 90, 92, 91, 93, 94],
      neural: {
        pattern: 'Excellent quality',
        confidence: 96,
        prediction: 'Keep current routine',
        anomalies: 0
      },
      description: 'Sleep quality and patterns',
      target: 85,
      status: 'optimal'
    },
    {
      id: 'energy',
      name: 'Active Calories',
      value: 2341,
      unit: 'kcal',
      change: 12,
      trend: 'increasing',
      icon: FireIcon,
      color: 'from-orange-400 via-amber-500 to-yellow-600',
      data: [2100, 2200, 2150, 2300, 2250, 2400, 2341],
      neural: {
        pattern: 'High activity',
        confidence: 91,
        prediction: 'Peak energy at 3 PM',
        anomalies: 0
      },
      description: 'Daily energy expenditure',
      target: 2200,
      status: 'optimal'
    },
    {
      id: 'glucose',
      name: 'Blood Glucose',
      value: 94,
      unit: 'mg/dL',
      change: -2,
      trend: 'stable',
      icon: BeakerIcon,
      color: 'from-emerald-400 via-green-500 to-teal-600',
      data: [98, 96, 95, 94, 93, 94, 94],
      neural: {
        pattern: 'Stable levels',
        confidence: 99,
        prediction: 'Healthy response',
        anomalies: 0
      },
      description: 'Blood sugar monitoring',
      target: 90,
      status: 'excellent'
    },
    {
      id: 'stress',
      name: 'Stress Level',
      value: 23,
      unit: '/100',
      change: -15,
      trend: 'decreasing',
      icon: EyeIcon,
      color: 'from-purple-400 via-indigo-500 to-blue-600',
      data: [45, 38, 32, 28, 25, 24, 23],
      neural: {
        pattern: 'Low stress',
        confidence: 93,
        prediction: 'Continued improvement',
        anomalies: 0
      },
      description: 'Stress and mental wellness',
      target: 30,
      status: 'excellent'
    }
  ];

  const NeuralChart: React.FC<{ data: number[]; gradient: string; active: boolean }> = ({ data, gradient, active }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end space-x-1 h-20 w-40">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isLast = index === data.length - 1;
          return (
            <motion.div
              key={index}
              className={`bg-gradient-to-t ${gradient} rounded-lg shadow-lg relative overflow-hidden ${
                isLast ? 'opacity-100 shadow-2xl' : 'opacity-60'
              }`}
              style={{ width: '5px' }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 20)}%` }}
              transition={{ 
                delay: 0.5 + index * 0.1, 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              whileHover={{ scale: 1.2, opacity: 1 }}
            >
              {active && isLast && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-emerald-400';
      case 'excellent': return 'text-blue-400';
      case 'good': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-12 relative">
      {/* Neural Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl morphing-blob">
                <CpuChipIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-gradient-neural">
                  Health Dashboard
                </h2>
                <p className="text-lg text-muted-foreground font-light">
                  Real-time health tracking with intelligent insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-muted-foreground">Live Health Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="text-sm font-semibold text-muted-foreground">Smart Analysis Active</span>
              </div>
            </div>
          </div>
          
          <motion.button 
            className="btn-premium px-8 py-4 rounded-2xl text-white font-bold flex items-center space-x-3 shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>Health Analytics</span>
          </motion.button>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="metric-card-neural rounded-3xl p-8 cursor-pointer group"
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
            >
              <div className="space-y-6 relative">
                {/* Neural Activity Indicator */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse shadow-lg" />
                
                <div className="flex items-center justify-between">
                  <div className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl" />
                    <metric.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(metric.status)} bg-current/10`}>
                      {metric.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-black text-gradient-neural">
                      {metric.value.toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground font-semibold">
                      {metric.unit}
                    </span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
                      metric.change > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {metric.change > 0 ? (
                        <ArrowTrendingUpIcon className="w-3 h-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3 h-3" />
                      )}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xl font-bold text-foreground">{metric.name}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <NeuralChart 
                    data={metric.data} 
                    gradient={metric.color} 
                    active={selectedMetric === metric.id}
                  />
                  <div className="text-right space-y-1">
                    <div className="text-xs text-muted-foreground">Neural Confidence</div>
                    <div className="text-sm font-bold text-gradient-neural">
                      {metric.neural.confidence}%
                    </div>
                  </div>
                </div>
                
                {/* Neural Insights */}
                <AnimatePresence>
                  {selectedMetric === metric.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Pattern</div>
                          <div className="text-sm font-semibold text-foreground">{metric.neural.pattern}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Prediction</div>
                          <div className="text-sm font-semibold text-foreground">{metric.neural.prediction}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-xs text-muted-foreground">Neural processing active</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {metric.neural.anomalies} anomalies detected
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Neural Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="card-ultra rounded-3xl p-8 mt-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Smart Health Insights</h3>
                <p className="text-sm text-muted-foreground">AI-powered insights from your health data</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground">Processing</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Perfect Workout Time',
                insight: 'Your recovery data shows you\'ll have peak energy in 2 hours - ideal for your strength training.',
                confidence: 96,
                action: 'Schedule Workout',
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'Nutrition Timing',
                insight: 'Your glucose response is excellent today. Perfect time for that post-workout meal you planned.',
                confidence: 94,
                action: 'Optimize Nutrition',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Sleep Optimization',
                insight: 'Your sleep quality improved 15% this week. Consider adding magnesium for even better recovery.',
                confidence: 91,
                action: 'View Supplements',
                color: 'from-blue-500 to-purple-500'
              }
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                className="glass-morphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground">{insight.title}</h4>
                    <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                      {insight.confidence}%
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.insight}
                  </p>
                  
                  <button className={`w-full py-2 bg-gradient-to-r ${insight.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300`}>
                    {insight.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthMetrics;