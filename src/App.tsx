import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Activity, 
  BeakerIcon, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  ChevronDownIcon,
  ChevronRightIcon,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const HealthMetrics: React.FC = () => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // Realistic health metrics with actual problems and solutions
  const metrics = [
    {
      id: 'heart',
      name: 'Resting Heart Rate',
      friendlyName: 'Your cardiovascular fitness indicator',
      value: '74',
      unit: 'bpm',
      detail: 'Above optimal range (60-70 bpm)',
      status: 'elevated',
      change: +3,
      trend: 'increasing trend',
      icon: Heart,
      color: 'from-red-500 to-rose-600',
      explanation: 'Your resting heart rate has increased from 71 to 74 bpm over the past week. This suggests your cardiovascular system is working harder than optimal.',
      target: '60-70 bpm',
      lastWeekAvg: '71 bpm',
      subMetrics: [
        { name: '7-Day Average', value: '74', unit: 'bpm', status: 'elevated', description: 'Above optimal 60-70 range', target: '65 bpm' },
        { name: 'Morning HR', value: '68', unit: 'bpm', status: 'good', description: 'Lowest reading of the day', target: '60 bpm' },
        { name: 'Evening HR', value: '78', unit: 'bpm', status: 'elevated', description: 'Higher than morning baseline', target: '70 bpm' },
        { name: 'Workout Recovery', value: '3.2', unit: 'min', status: 'slow', description: 'Time to return to baseline', target: '2 min' }
      ],
      protocol: {
        title: 'Cardiovascular Optimization Protocol',
        actions: [
          { type: 'exercise', text: 'Zone 2 cardio: 150-160 bpm for 30 minutes, 4x/week', button: 'Start Cardio Protocol' },
          { type: 'supplement', text: 'CoQ10 100mg + Magnesium 400mg + Hawthorn extract 500mg', button: 'Add Heart Stack' },
          { type: 'lifestyle', text: '4-7-8 breathing: 10 minutes every morning', button: 'Begin Breathing' },
          { type: 'monitoring', text: 'Track morning HR daily for 2 weeks', button: 'Set Reminders' }
        ]
      }
    },
    {
      id: 'recovery',
      name: 'Heart Rate Variability',
      friendlyName: 'Your stress resilience and recovery capacity',
      value: '28',
      unit: 'ms',
      detail: 'Below optimal range (35-50ms for your age)',
      status: 'low',
      change: -7,
      trend: 'declining from 35ms',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      explanation: 'Your HRV has dropped from 35ms to 28ms over the past week. This indicates elevated stress or inadequate recovery between training sessions.',
      target: '35-50 ms',
      lastWeekAvg: '35 ms',
      subMetrics: [
        { name: 'HRV (RMSSD)', value: '28', unit: 'ms', status: 'low', description: 'Below optimal range for your age' },
        { name: 'Recovery Score', value: '58', unit: '/100', status: 'fair', description: 'Room for improvement' },
        { name: 'Stress Index', value: '72', unit: '/100', status: 'high', description: 'Elevated stress levels detected' },
        { name: 'Training Load', value: 'Moderate', unit: '', status: 'balanced', description: 'Current training intensity' }
      ],
      protocol: {
        title: 'HRV Recovery Protocol',
        actions: [
          { type: 'supplement', text: 'Take Ashwagandha 600mg + L-Theanine 200mg before bed', button: 'Add to Stack' },
          { type: 'lifestyle', text: 'Complete 4-7-8 breathing protocol twice daily', button: 'Start Breathing' },
          { type: 'recovery', text: 'Reduce training intensity by 20% for 1 week', button: 'Adjust Training' }
        ]
      }
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
      subMetrics: [
        { name: 'Total Sleep', value: '6h 12m', unit: '', status: 'short', description: 'Below recommended 7-9 hours' },
        { name: 'Deep Sleep', value: '58', unit: 'min', status: 'low', description: 'Need more restorative sleep' },
        { name: 'REM Sleep', value: '72', unit: 'min', status: 'fair', description: 'Adequate but could improve' },
        { name: 'Sleep Efficiency', value: '78', unit: '%', status: 'fair', description: 'Time asleep vs time in bed' }
      ],
      protocol: {
        title: 'Sleep Extension Protocol',
        actions: [
          { type: 'schedule', text: 'Set bedtime to 10:30 PM (30 min earlier than current)', button: 'Set Sleep Schedule' },
          { type: 'supplement', text: 'Take Magnesium Glycinate 400mg + Melatonin 1mg at 10 PM', button: 'Add to Stack' },
          { type: 'environment', text: 'Enable blue light blocking on all devices after 9 PM', button: 'Setup Environment' }
        ]
      }
    },
    {
      id: 'glucose',
      name: 'Glucose Control',
      friendlyName: 'How stable your blood sugar is',
      value: 'Needs Work',
      detail: 'Avg 118 mg/dL',
      status: 'elevated',
      change: 8,
      trend: 'post-meal spikes',
      icon: BeakerIcon,
      color: 'from-amber-500 to-orange-600',
      explanation: 'Your glucose levels spike above 140mg/dL after meals, indicating insulin resistance. This affects energy and long-term health.',
      subMetrics: [
        { name: 'Avg Glucose', value: '118', unit: 'mg/dL', status: 'elevated', description: 'Above optimal 80-100 range' },
        { name: 'Time in Range', value: '52', unit: '%', status: 'low', description: 'Should be 70%+ in 70-180 range' },
        { name: 'Post-Meal Peak', value: '168', unit: 'mg/dL', status: 'high', description: 'Spikes above 140mg/dL threshold' },
        { name: 'Dawn Effect', value: '15', unit: 'mg/dL', status: 'mild', description: 'Morning glucose rise' }
      ],
      protocol: {
        title: 'Glucose Optimization Protocol',
        actions: [
          { type: 'nutrition', text: 'Limit meals to <30g net carbs, prioritize protein + fiber', button: 'Get Meal Plan' },
          { type: 'supplement', text: 'Take Berberine 500mg + Chromium 200mcg before meals', button: 'Add to Stack' },
          { type: 'activity', text: 'Walk 10 minutes after each meal (3x daily)', button: 'Set Reminders' }
        ]
      }
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

  const getSubMetricStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'normal':
      case 'balanced':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
      case 'fair':
      case 'mild':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'low':
      case 'short':
      case 'slow':
      case 'elevated':
      case 'high':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      default:
        return 'text-slate-600 bg-slate-50 dark:bg-slate-800';
    }
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
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-3xl p-8 border border-amber-200/50 dark:border-amber-800/50 text-center"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              67
            </div>
            <div className="text-xl font-semibold text-slate-900 dark:text-white">
              Room for Improvement
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Several areas could use attention
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
                  <button
                    onClick={() => setExpandedMetric(expandedMetric === metric.id ? null : metric.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {expandedMetric === metric.id ? (
                      <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Simple Explanation */}
              <div className="bg-slate-50/60 dark:bg-slate-800/60 rounded-xl p-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {metric.explanation}
                </p>
              </div>
              
              {/* Expandable Sub-Metrics */}
              {expandedMetric === metric.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Detailed Metrics:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {metric.subMetrics.map((subMetric, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/60 dark:bg-slate-800/60 rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {subMetric.name}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {subMetric.description}
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {subMetric.value} {subMetric.unit}
                            </div>
                            <div className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSubMetricStatusColor(subMetric.status)}`}>
                              {subMetric.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{metric.protocol.title}:</h4>
                    {metric.protocol.actions.map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg">
                        <span className="text-sm text-slate-700 dark:text-slate-300">{action.text}</span>
                        <button className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
                          {action.button}
                        </button>
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
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50"
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Priority Actions for Better Health
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <button
              className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group"
            >
              <BeakerIcon className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Start Glucose Protocol</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Reduce post-meal spikes</div>
            </button>
            
            <button
              className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group"
            >
              <Brain className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Sleep Extension Plan</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Get 7+ hours nightly</div>
            </button>
            
            <button
              className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group"
            >
              <Heart className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Heart Rate Protocol</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Lower to optimal range</div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthMetrics;