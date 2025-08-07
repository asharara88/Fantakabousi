import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const HealthMetrics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Simplified metrics with friendly explanations
  const metrics = [
    {
      id: 'heart',
      name: 'Heart Health',
      friendlyName: 'How your heart is doing',
      value: 'Good',
      detail: '74 beats per minute',
      status: 'good',
      change: -2,
      trend: 'slightly elevated',
      icon: Heart,
      color: 'from-red-500 to-rose-600',
      explanation: 'Your resting heart rate is a bit high. Regular cardio exercise could help bring it down to the optimal 60-70 range.',
      tips: [
        'Add 20 minutes of cardio 3x per week',
        'Try morning walks to lower resting HR',
        'Monitor stress levels - they affect heart rate'
      ]
    },
    {
      id: 'recovery',
      name: 'Recovery',
      friendlyName: 'How well you recover from stress',
      value: 'Fair',
      detail: '28 milliseconds',
      status: 'needs_work',
      change: -5,
      trend: 'declining',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      explanation: 'Your heart rate variability is lower than ideal, suggesting your body is under stress or not recovering well.',
      tips: [
        'Focus on stress management techniques',
        'Ensure you\'re getting quality sleep',
        'Consider lighter workouts until HRV improves'
      ]
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      friendlyName: 'How well you slept',
      value: 'Needs Work',
      detail: '6 hours 12 minutes',
      status: 'poor',
      change: -8,
      trend: 'inconsistent',
      icon: Brain,
      color: 'from-indigo-500 to-purple-600',
      explanation: 'You\'re not getting enough sleep. Most adults need 7-9 hours for proper recovery and health.',
      tips: [
        'Try going to bed 30 minutes earlier',
        'Create a consistent bedtime routine',
        'Avoid screens 1 hour before bed'
      ]
    },
    {
      id: 'energy',
      name: 'Energy Level',
      friendlyName: 'How energetic you feel',
      value: 'Variable',
      detail: '58 out of 100',
      status: 'fair',
      change: -3,
      trend: 'afternoon crashes',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      explanation: 'Your energy levels fluctuate throughout the day, with notable crashes in the afternoon.',
      tips: [
        'Eat protein-rich breakfast to stabilize energy',
        'Take short walks during energy dips',
        'Consider your caffeine timing'
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'optimal':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'great':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
    if (change < 0) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    return 'text-slate-600 bg-slate-50 dark:bg-slate-800';
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Simple Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          Your Health Today
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Here's how your body is doing right now
        </p>
      </div>

      {/* Overall Health Score - Big and Clear */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/50 text-center"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              94
            </div>
            <div className="text-xl font-semibold text-slate-900 dark:text-white">
              Excellent Health!
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              You're doing amazing. Keep it up!
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Health Metrics - Friendly Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {metric.name}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(metric.change)}`}>
                    {metric.change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{metric.trend}</span>
                  </div>
                </div>
              </div>
              
              {/* Simple Explanation */}
              <div className="bg-slate-50/60 dark:bg-slate-800/60 rounded-xl p-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {metric.explanation}
                </p>
              </div>
              
              {/* Expandable Details */}
              {selectedMetric === metric.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">What this means for you:</h4>
                    {metric.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{tip}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg p-3">
                    <strong>Technical detail:</strong> {metric.detail}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Simple Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            What should you do next?
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/dashboard/coach')}
              className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group"
            >
              <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Ask Your Coach</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Get personalized advice</div>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/nutrition')}
              className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group"
            >
              <Utensils className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Log Your Food</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Track what you eat</div>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/supplements')}
              className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group"
            >
              <ShoppingBag className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Browse Shop</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Find supplements</div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthMetrics;