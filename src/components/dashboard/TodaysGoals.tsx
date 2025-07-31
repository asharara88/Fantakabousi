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
      title: 'Log Breakfast',
      description: 'Track your morning meal',
      completed: false,
      priority: 'medium',
      category: 'Nutrition'
    },
    {
      id: '3',
      title: 'Take Evening Supplements',
      description: 'Magnesium and sleep support',
      completed: false,
      priority: 'high',
      category: 'Supplements'
    },
    {
      id: '4',
      title: 'Review Sleep Data',
      description: 'Check last night\'s sleep quality',
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
      case 'high': return 'status-error';
      case 'medium': return 'status-warning';
      case 'low': return 'status-success';
      default: return 'status-success';
    }
  };

  return (
    <div id="todays-goals" className="card-premium">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
            <FlagIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground font-inter">Today's Goals</h2>
            <p className="text-sm text-muted-foreground">{completedCount} of {goals.length} completed</p>
          </div>
        </div>
        
        <button className="p-2 text-muted-foreground hover:text-[#48C6FF] hover:bg-muted rounded-lg transition-all duration-200 cursor-pointer">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] rounded-full"
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
            className={`p-3 lg:p-4 rounded-xl border transition-all duration-200 cursor-pointer touch-target ${
              goal.completed 
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 shadow-sm' 
                : 'bg-card border-border hover:border-[#48C6FF]/30 hover:shadow-sm'
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="flex-shrink-0">
                {goal.completed ? (
                  <CheckCircleSolidIcon className="w-6 h-6 text-green-500" />
                ) : (
                  <div className="w-6 h-6 border-2 border-border rounded-full hover:border-[#48C6FF] transition-colors"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-base lg:text-lg font-semibold font-inter ${
                  goal.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-foreground'
                }`}>
                  {goal.title}
                </h3>
                <p className={`text-sm ${
                  goal.completed ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                }`}>
                  {goal.description}
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row items-end lg:items-center space-y-1 lg:space-y-0 lg:space-x-2">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                  'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {goal.priority}
                </span>
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground font-medium">
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
          className="mt-4 lg:mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl text-center"
        >
          <CheckCircleSolidIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-heading-sm text-green-700 dark:text-green-400">All goals completed!</h3>
          <p className="text-body-sm text-green-600 dark:text-green-500">Great job staying on track today.</p>
        </motion.div>
      )}
    </div>
  );
};

export default TodaysGoals;