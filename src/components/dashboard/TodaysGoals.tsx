import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlagIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'health' | 'fitness' | 'nutrition' | 'wellness';
  createdAt: string;
  completedAt?: string;
}

interface TodaysGoalsProps {
  onQuickAction?: (action: string) => void;
}

const TodaysGoals: React.FC<TodaysGoalsProps> = ({ onQuickAction }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'health' as const
  });

  useEffect(() => {
    try {
      loadGoals();
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  }, []);

  const loadGoals = () => {
    try {
      const today = new Date().toDateString();
      const savedGoals = localStorage.getItem(`biowell-goals-${today}`);
      
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        // Set default goals for new day
        const defaultGoals: Goal[] = [
          {
            id: '1',
            title: 'Take morning supplements',
            description: 'Berberine 500mg + Chromium 200mcg (glucose control)',
            completed: false,
            priority: 'high',
            category: 'health',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Take photo of breakfast',
            description: 'AI will calculate calories and glucose impact',
            completed: false,
            priority: 'medium',
            category: 'nutrition',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Post-lunch walk protocol',
            description: '10-minute walk to control glucose spike',
            completed: false,
            priority: 'high',
            category: 'health',
            createdAt: new Date().toISOString()
          }
        ];
        setGoals(defaultGoals);
        saveGoals(defaultGoals);
      }
    
    // Add time-based goals
    const hour = new Date().getHours();
    if (hour >= 18 && hour < 21) {
      const eveningGoals = [
        {
          id: 'evening-1',
          title: 'Take evening supplements',
          description: 'Ashwagandha 600mg + Magnesium 400mg (HRV recovery)',
          completed: false,
          priority: 'high',
          category: 'health',
          createdAt: new Date().toISOString()
        },
        {
          id: 'evening-2',
          title: '4-7-8 breathing protocol',
          description: '5 minutes to activate parasympathetic nervous system',
          completed: false,
          priority: 'medium',
          category: 'wellness',
          createdAt: new Date().toISOString()
        }
      ];
      
      const updatedGoals = [...defaultGoals, ...eveningGoals];
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
    }
    } catch (error) {
      console.error('Error loading goals:', error);
      setGoals([]); // Fallback to empty array
    }
  };

  const saveGoals = (goalsToSave: Goal[]) => {
    try {
      const today = new Date().toDateString();
      localStorage.setItem(`biowell-goals-${today}`, JSON.stringify(goalsToSave));
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };

  const addGoal = () => {
    try {
      if (!newGoal.title.trim()) return;

      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        completed: false,
        priority: newGoal.priority,
        category: newGoal.category,
        createdAt: new Date().toISOString()
      };

      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      
      setNewGoal({
        title: '',
        description: '',
        priority: 'medium',
        category: 'health'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  const toggleGoal = (goalId: string) => {
    try {
      const updatedGoals = goals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              completed: !goal.completed,
              completedAt: !goal.completed ? new Date().toISOString() : undefined
            }
          : goal
      );
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
    } catch (error) {
      console.error('Failed to toggle goal:', error);
    }
  };

  const deleteGoal = (goalId: string) => {
    try {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const completedCount = goals.filter(goal => goal.completed).length;
  const completionRate = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'low': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return FireIcon;
      case 'nutrition': return SparklesIcon;
      case 'wellness': return TrophyIcon;
      default: return FlagIcon;
    }
  };

  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FlagIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Today's Goals</h2>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {goals.length} completed ({Math.round(completionRate)}%)
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 bg-blue-light/10 hover:bg-blue-light/20 rounded-lg transition-colors"
          aria-label="Add new goal"
        >
          <PlusIcon className="w-5 h-5 text-blue-light" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-light to-blue-medium"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        <AnimatePresence>
          {goals.map((goal, index) => {
            const CategoryIcon = getCategoryIcon(goal.category);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  goal.completed 
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                    : 'bg-card border-border hover:border-blue-light/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-muted-foreground hover:border-blue-light'
                    }`}
                  >
                    {goal.completed && (
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold ${
                        goal.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-foreground'
                      }`}>
                        {goal.title}
                      </h3>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getPriorityColor(goal.priority)}`} />
                    </div>
                    
                    {goal.description && (
                      <p className={`text-sm mt-1 ${
                        goal.completed ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                      }`}>
                        {goal.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {goal.category}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {goal.priority} priority
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Delete goal"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-8">
          <FlagIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No goals set for today</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-3 btn-primary"
          >
            Add Your First Goal
          </button>
        </div>
      )}

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-muted/30 rounded-xl border border-border"
          >
            <div className="space-y-3">
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Goal title..."
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
              />
              
              <input
                type="text"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description (optional)..."
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as any }))}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="health">Health</option>
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      {completedCount === goals.length && goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="text-center space-y-3">
            <TrophyIcon className="w-8 h-8 text-green-600 mx-auto" />
            <div>
              <h3 className="font-bold text-green-700 dark:text-green-400">All Protocols Completed! 🎉</h3>
              <p className="text-sm text-green-600 dark:text-green-500">
                Excellent adherence to your health optimization protocols
              </p>
            </div>
            <button
              onClick={() => onQuickAction?.('coach')}
              className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600"
            >
              Get Tomorrow's Protocol Plan
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TodaysGoals;