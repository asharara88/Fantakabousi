import React, { useState } from 'react';
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
  MessageCircle,
  Utensils,
  ShoppingBag,
  Plus,
  ArrowRight,
  Sun,
  Moon,
  Coffee,
  Sunset
} from 'lucide-react';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime] = useState(new Date());
  
  const firstName = user?.email?.split('@')[0] || 'there';
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return { text: 'Good morning', icon: Sun, color: 'from-yellow-400 to-orange-500' };
    if (hour < 17) return { text: 'Good afternoon', icon: Coffee, color: 'from-blue-400 to-cyan-500' };
    if (hour < 20) return { text: 'Good evening', icon: Sunset, color: 'from-orange-400 to-red-500' };
    return { text: 'Good night', icon: Moon, color: 'from-indigo-400 to-purple-500' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Simplified health metrics with friendly names
  const healthMetrics = [
    {
      id: 'heart',
      name: 'Heart Health',
      value: 'Great',
      detail: '68 bpm',
      change: 'improving',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      description: 'Your heart is strong and healthy'
    },
    {
      id: 'energy',
      name: 'Energy Level',
      value: 'High',
      detail: '87/100',
      change: 'up',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      description: 'You have great energy today'
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      value: 'Excellent',
      detail: '8h 23m',
      change: 'improving',
      icon: Brain,
      color: 'from-indigo-500 to-purple-600',
      description: 'You slept really well last night'
    },
    {
      id: 'activity',
      name: 'Daily Activity',
      value: 'Active',
      detail: '8,247 steps',
      change: 'on track',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      description: 'You\'re moving well today'
    }
  ];

  // Simple, actionable insights
  const todaysInsights = [
    {
      title: 'Perfect time for a workout! 💪',
      description: 'Your energy is high and your body is ready for exercise.',
      action: 'Start Workout',
      color: 'from-emerald-500 to-teal-600',
      priority: 'high'
    },
    {
      title: 'Great sleep last night! 😴',
      description: 'You got quality rest. Keep up your bedtime routine.',
      action: 'View Sleep Tips',
      color: 'from-indigo-500 to-purple-600',
      priority: 'low'
    }
  ];

  // Quick actions - most common tasks
  const quickActions = [
    {
      id: 'coach',
      title: 'Ask Your Coach',
      description: 'Get personalized health advice',
      icon: MessageCircle,
      color: 'from-purple-500 to-indigo-600',
      path: '/dashboard/coach'
    },
    {
      id: 'food',
      title: 'Log a Meal',
      description: 'Track what you ate',
      icon: Utensils,
      color: 'from-green-500 to-emerald-600',
      path: '/dashboard/nutrition'
    },
    {
      id: 'health',
      title: 'Check My Health',
      description: 'See your progress',
      icon: Activity,
      color: 'from-blue-500 to-cyan-600',
      path: '/dashboard/health'
    },
    {
      id: 'shop',
      title: 'Browse Supplements',
      description: 'Find what you need',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-600',
      path: '/dashboard/supplements'
    }
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Friendly Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${greeting.color} rounded-2xl flex items-center justify-center shadow-lg`}>
            <GreetingIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
              {greeting.text}, {firstName}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Let's check how you're doing today
            </p>
          </div>
        </div>
      </motion.div>

      {/* Health Status - Simple Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/health')}
          >
            <div className="space-y-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              
              <div>
                <div className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {metric.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {metric.detail}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Insights - Friendly Language */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">How You're Doing</h2>
            <p className="text-slate-600 dark:text-slate-400">Based on your health data</p>
          </div>
        </div>

        <div className="space-y-4">
          {todaysInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                  {insight.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {insight.description}
                </p>
                <button className={`px-4 py-2 bg-gradient-to-r ${insight.color} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm`}>
                  {insight.action}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions - Big, Clear Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">What would you like to do?</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              onClick={() => navigate(action.path)}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 text-left group"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Goal - Simple and Motivating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Goal</h3>
              <p className="text-slate-600 dark:text-slate-400">Take your evening supplements</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Mark Done
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;