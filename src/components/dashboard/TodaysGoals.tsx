import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import {
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  FireIcon,
  HeartIcon,
  BeakerIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon
} from '@heroicons/react/24/solid';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'nutrition' | 'fitness' | 'wellness';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number; // in minutes
}

interface TodaysGoalsProps {
  onQuickAction?: (action: string) => void;
}

const TodaysGoals: React.FC<TodaysGoalsProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'health' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    estimatedTime: 30
  });

  // Default goals for new users
  const defaultGoals: Omit<Goal, 'id' | 'completed'>[] = [
    {
      title: 'Morning Hydration',
      description: 'Drink 16oz of water upon waking',
      category: 'health',
      priority: 'high',
      estimatedTime: 2
    },
    {
      title: 'Take Morning Supplements',
      description: 'Complete your supplement stack',
      category: 'nutrition',
      priority: 'high',
      estimatedTime: 5
    },
    {
      title: '10-Minute Walk',
      description: 'Get some fresh air and movement',
      category: 'fitness',
      priority: 'medium',
      estimatedTime: 10
    },
    {
      title: 'Mindful Breathing',
      description: '5 minutes of deep breathing',
      category: 'wellness',
      priority: 'medium',
      estimatedTime: 5
    },
    {
      title: 'Log Your Meals',
      description: 'Track breakfast, lunch, and dinner',
      category: 'nutrition',
      priority: 'medium',
      estimatedTime: 15
    }
  ];

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      // For demo purposes, we'll use localStorage to persist goals
      const savedGoals = localStorage.getItem(`goals_${user.id}`);
      
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        // Initialize with default goals
        const initialGoals = defaultGoals.map(goal => ({
          ...goal,
          id: Math.random().toString(36).substr(2, 9),
          completed: false
        }));
        setGoals(initialGoals);
        localStorage.setItem(`goals_${user.id}`, JSON.stringify(initialGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your goals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    if (!user) return;
    localStorage.setItem(`goals_${user.id}`, JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const toggleGoalCompletion = (goalId: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    saveGoals(updatedGoals);
    
    const goal = goals.find(g => g.id === goalId);
    if (goal && !goal.completed) {
      toast({
        title: 'Goal Completed! 🎉',
        description: `Great job completing "${goal.title}"`,
        variant: 'default'
      });
    }
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      ...newGoal,
      completed: false
    };

    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    
    setNewGoal({
      title: '',
      description: '',
      category: 'health',
      priority: 'medium',
      estimatedTime: 30
    });
    setShowAddGoal(false);
    
    toast({
      title: 'Goal Added',
      description: `"${goal.title}" has been added to your goals`,
      variant: 'default'
    });
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
    
    toast({
      title: 'Goal Removed',
      description: 'Goal has been deleted',
      variant: 'default'
    });
  };

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'health': return HeartIcon;
      case 'nutrition': return BeakerIcon;
      case 'fitness': return BoltIcon;
      case 'wellness': return FireIcon;
      default: return HeartIcon;
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'health': return 'from-red-500 to-pink-600';
      case 'nutrition': return 'from-green-500 to-emerald-600';
      case 'fitness': return 'from-blue-500 to-cyan-600';
      case 'wellness': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completionPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/20 shadow-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Today's Goals
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {completedGoals} of {totalGoals} completed
            </div>
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {Math.round(completionPercentage)}%
            </span>
          </div>
        </div>
        
        <motion.button
          onClick={() => setShowAddGoal(true)}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {goals.map((goal, index) => {
            const Icon = getCategoryIcon(goal.category);
            const isCompleted = goal.completed;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Category Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(goal.category)} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Goal Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`font-semibold text-lg ${
                            isCompleted 
                              ? 'text-emerald-700 dark:text-emerald-300 line-through' 
                              : 'text-slate-900 dark:text-white'
                          }`}>
                            {goal.title}
                          </h3>
                          
                          {/* Priority Badge */}
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            goal.priority === 'high' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : goal.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {goal.priority}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-3 ${
                          isCompleted 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {goal.description}
                        </p>
                        
                        {/* Time Estimate */}
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                          <ClockIcon className="w-4 h-4" />
                          <span>{goal.estimatedTime} min</span>
                          <span className="capitalize">{goal.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        onClick={() => toggleGoalCompletion(goal.id)}
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCompleted ? (
                          <CheckCircleSolidIcon className="w-5 h-5" />
                        ) : (
                          <CheckCircleIcon className="w-5 h-5" />
                        )}
                      </motion.button>
                      
                      <motion.button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Completion Animation */}
                {isCompleted && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 dark:border-slate-700/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Add New Goal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your goal..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    rows={3}
                    placeholder="Describe your goal..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="health">Health</option>
                      <option value="nutrition">Nutrition</option>
                      <option value="fitness">Fitness</option>
                      <option value="wellness">Wellness</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={newGoal.estimatedTime}
                    onChange={(e) => setNewGoal({ ...newGoal, estimatedTime: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    min="1"
                    max="480"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 p-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Add Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      {totalGoals > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onQuickAction?.('nutrition')}
              className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300 text-sm font-medium"
            >
              Log Food
            </button>
            <button
              onClick={() => onQuickAction?.('supplements')}
              className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all duration-300 text-sm font-medium"
            >
              Take Supplements
            </button>
            <button
              onClick={() => onQuickAction?.('fitness')}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300 text-sm font-medium"
            >
              Start Workout
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalGoals === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PlusIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No goals set for today
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Add your first goal to start tracking your progress
          </p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Add Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default TodaysGoals;