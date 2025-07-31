import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const TodaysGoals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete Morning Workout',
      description: '30 minutes strength training',
      completed: true,
      priority: 'high',
      category: 'Fitness'
    },
    {
      id: '2',
      title: 'Log Breakfast Nutrition',
      description: 'Track macros and glucose impact',
      completed: false,
      priority: 'medium',
      category: 'Nutrition'
    },
    {
      id: '3',
      title: 'Take Evening Supplements',
      description: 'Magnesium and melatonin stack',
      completed: false,
      priority: 'high',
      category: 'Supplements'
    },
    {
      id: '4',
      title: 'Review Sleep Data',
      description: 'Analyze last night\'s sleep quality',
      completed: false,
      priority: 'low',
      category: 'Recovery'
    }
  ]);

  const toggleGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercentage = (completedCount / goals.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <FlagIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Today's Goals</h2>
            <p className="text-sm text-gray-600">{completedCount} of {goals.length} completed</p>
          </div>
        </div>
        
        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              goal.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {goal.completed ? (
                  <CheckCircleSolidIcon className="w-6 h-6 text-green-500" />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  goal.completed ? 'text-green-700 line-through' : 'text-gray-900'
                }`}>
                  {goal.title}
                </h3>
                <p className={`text-sm ${
                  goal.completed ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {goal.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {goal.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {completedCount === goals.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center"
        >
          <CheckCircleSolidIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold text-green-700">All goals completed!</h3>
          <p className="text-sm text-green-600">Great job staying on track today.</p>
        </motion.div>
      )}
    </div>
  );
};

export default TodaysGoals;