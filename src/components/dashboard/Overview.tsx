import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  Sparkles,
  BarChart3,
  Utensils,
  Pill
} from 'lucide-react';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const healthMetrics = [
    {
      id: 'heart_rate',
      name: 'Resting Heart Rate',
      value: 68,
      unit: 'bpm',
      change: -3,
      trend: 'improving',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      status: 'Excellent'
    },
    {
      id: 'hrv',
      name: 'Heart Rate Variability',
      value: 42,
      unit: 'ms',
      change: 8,
      trend: 'improving',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      status: 'Optimal'
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      value: 94,
      unit: '/100',
      change: 5,
      trend: 'excellent',
      icon: Brain,
      color: 'from-indigo-500 to-purple-600',
      status: 'Excellent'
    },
    {
      id: 'energy',
      name: 'Energy Level',
      value: 87,
      unit: '/100',
      change: 12,
      trend: 'increasing',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      status: 'High'
    }
  ];

  const insights = [
    {
      title: 'Optimal Training Window',
      description: 'Your recovery metrics indicate peak performance readiness. Ideal time for strength training.',
      confidence: 96,
      priority: 'high',
      action: 'Schedule Workout',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Nutrition Timing',
      description: 'Your glucose response is excellent today. Perfect timing for your planned post-workout meal.',
      confidence: 94,
      priority: 'medium',
      action: 'Plan Nutrition',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Sleep Optimization',
      description: 'Sleep quality improved 15% this week. Consider maintaining your current evening routine.',
      confidence: 91,
      priority: 'low',
      action: 'View Sleep Data',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-slate-900 dark:text-white">
              Good morning! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Here's your health overview for today
            </p>
          </div>
        </div>
      </motion.div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium hover:shadow-xl transition-all duration-500 cursor-pointer group card-interactive"
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              rotateY: 2,
              rotateX: 2
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  metric.change > 0 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                } group-hover:scale-105 transition-transform duration-300`}>
                  {metric.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-light text-slate-900 dark:text-white group-hover:text-blue-light transition-colors duration-300">
                  {metric.value}
                  <span className="text-lg text-slate-500 dark:text-slate-400 font-normal ml-1">
                    {metric.unit}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {metric.name}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 group-hover:text-emerald-500 transition-colors duration-300">
                  {metric.status}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-premium p-8 group hover:shadow-premium-xl"
        whileHover={{ scale: 1.01, y: -4 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300">AI Health Insights</h2>
            <p className="text-slate-600 dark:text-slate-400">Personalized recommendations from your data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="card-interactive bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg group"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                    insight.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  } group-hover:scale-105 transition-transform duration-300`}>
                    {insight.priority.toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {insight.confidence}% confidence
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-light transition-colors duration-300">{insight.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
                
                <motion.button 
                  className={`w-full py-2 bg-gradient-to-r ${insight.color} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {insight.action}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Log Food', icon: Utensils, color: 'from-green-500 to-emerald-600', path: '/dashboard/nutrition' },
          { label: 'Ask Coach', icon: Brain, color: 'from-purple-500 to-indigo-600', path: '/dashboard/coach' },
          { label: 'View Analytics', icon: BarChart3, color: 'from-blue-500 to-cyan-600', path: '/dashboard/health' },
          { label: 'Browse Supplements', icon: Pill, color: 'from-orange-500 to-red-600', path: '/dashboard/supplements' }
        ].map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ 
              scale: 1.08, 
              y: -6,
              rotateY: 5,
              rotateX: 5
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(action.path)}
            className="card-interactive bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl text-center space-y-3 group"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <div className="font-medium text-slate-900 dark:text-white group-hover:text-blue-light transition-colors duration-300">{action.label}</div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default Overview;