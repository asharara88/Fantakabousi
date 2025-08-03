import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import { 
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  PlusIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon
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
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Hydrate with Electrolytes',
      description: 'Get premium electrolyte supplements',
      completed: false,
      priority: 'high',
      category: 'Hydration',
      supplementShortcut: {
        products: ['LMNT', 'HUMANTRA'],
        category: 'electrolytes'
      }
    },
    {
      id: '2',
      title: 'Morning Supplements',
      description: 'Take your morning supplement stack',
      completed: false,
      priority: 'high',
      category: 'Supplements'
    },
    {
      id: '3',
      title: 'Get Sunlight Exposure',
      description: '10-15 mins outside (no sunglasses, avoid direct eye contact)',
      completed: false,
      priority: 'high',
      category: 'Circadian'
    },
    {
      id: '4',
      title: 'Evening Supplements',
      description: 'Magnesium + sleep stack',
      completed: false,
      priority: 'medium',
      category: 'Supplements'
    },
    {
      id: '5',
      title: 'Cognitive Training',
      description: '15min brain exercises',
      completed: false,
      priority: 'low',
      category: 'Cognition'
    },
    {
      id: '6',
      title: 'Meditation Session',
      description: '10min mindfulness',
      completed: false,
      priority: 'low',
      category: 'Recovery'
    }
  ]);
  const [streakCount, setStreakCount] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);

  const addNewGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: 'New Goal',
      description: 'Tap to edit',
      completed: false,
      priority: 'medium',
      category: 'Custom'
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const toggleGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCompleted = !goal.completed;
        
        // Dopamine reward system
        if (newCompleted) {
          triggerReward(goal);
        }
        
        return { ...goal, completed: newCompleted };
      }
      return goal;
    }));
  };

  const handleSupplementShortcut = (products: string[], category: string) => {
    // Navigate to supplement shop with pre-filtered products
    onQuickAction?.('shop');
    
    // Show toast with purchase shortcut
    toast({
      title: `🛒 ${products.join(' or ')} Available`,
      description: `Tap to view ${category} supplements in our shop`,
      action: {
        label: "Shop Now",
        onClick: () => onQuickAction?.('shop')
      }
    });
  };
  
  const triggerReward = (goal: Goal) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
    
    // Visual celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
    
    // Streak increment
    setStreakCount(prev => prev + 1);
    
    // Reward toast with category-specific messages
    const rewardMessages = {
      'Fitness': ['💪 Beast mode activated!', '🔥 Crushing those gains!', '⚡ Energy levels rising!'],
      'Hydration': ['💧 Hydration optimized!', '⚡ Electrolytes balanced!', '🌊 Cellular hydration complete!'],
      'Nutrition': ['🥗 Fueling excellence!', '🧠 Brain food consumed!', '💚 Nourishing your body!'],
      'Supplements': ['💊 Stack optimized!', '🧬 Cellular support active!', '⚗️ Biomarkers improving!'],
      'Circadian': ['☀️ Circadian rhythm activated!', '🌅 Light therapy complete!', '⏰ Biological clock synced!'],
      'Cognition': ['🧠 Neural pathways strengthened!', '🎯 Focus enhanced!', '🚀 Mental clarity boosted!'],
      'Recovery': ['😴 Recovery mode engaged!', '🧘 Stress melting away!', '💤 Sleep quality improving!']
    };
    
    const messages = rewardMessages[goal.category as keyof typeof rewardMessages] || ['✅ Goal completed!'];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    toast({
      title: randomMessage,
      description: `${goal.title} completed! Streak: ${streakCount + 1} days 🔥`,
    });
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
            {showCelebration ? (
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                <TrophyIcon className="w-5 h-5 text-yellow-300" />
              </motion.div>
            ) : (
              <FlagIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground font-inter">Today's Goals</h2>
            <div className="flex items-center space-x-3">
              <p className="text-sm text-muted-foreground">{completedCount} of {goals.length} completed</p>
              <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-950/20 rounded-full">
                <FireIcon className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-bold text-orange-600">{streakCount} day streak</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={addNewGoal}
          className="p-2 text-muted-foreground hover:text-[#48C6FF] hover:bg-muted rounded-lg transition-all duration-200 cursor-pointer"
          title="Add new goal"
        >
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`card transition-all duration-200 cursor-pointer touch-target ${
              goal.completed 
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                : ''
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="flex-shrink-0">
                {goal.completed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircleSolidIcon className="w-6 h-6 text-green-500 drop-shadow-sm" />
                  </motion.div>
                ) : (
                  <motion.div 
                    className="w-6 h-6 border-2 border-border rounded-full hover:border-[#48C6FF] hover:bg-[#48C6FF]/10 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-base lg:text-lg font-semibold font-inter ${
                  goal.completed ? 'text-green-700 dark:text-green-400 line-through opacity-75' : 'text-foreground'
                }`}>
                  {goal.title}
                  {goal.completed && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2 text-green-500"
                    >
                      ✨
                    </motion.span>
                  )}
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
            
            {/* Quick completion shortcut */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                {goal.supplementShortcut ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSupplementShortcut(goal.supplementShortcut.products, goal.supplementShortcut.category);
                    }}
                    className="text-xs text-blue-light hover:text-blue-medium font-medium flex items-center space-x-1"
                  >
                    <CubeIcon className="w-3 h-3" />
                    <span>Buy {goal.supplementShortcut.products.join(' or ')}</span>
                  </button>
                ) : (
                {goal.supplementShortcut ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSupplementShortcut(goal.supplementShortcut.products, goal.supplementShortcut.category);
                    }}
                    className="text-xs text-blue-light hover:text-blue-medium font-medium flex items-center space-x-1"
                  >
                    <CubeIcon className="w-3 h-3" />
                    <span>Buy {goal.supplementShortcut.products.join(' or ')}</span>
                  </button>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Tap anywhere to {goal.completed ? 'undo' : 'complete'}
                  </div>
                )}
                )}
                {!goal.completed && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGoal(goal.id);
                    }}
                    className="px-3 py-1 bg-[#48C6FF]/10 hover:bg-[#48C6FF]/20 text-[#48C6FF] text-xs font-bold rounded-full transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ⚡ Quick Complete
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {completedCount === goals.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 lg:mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl text-center relative overflow-hidden"
        >
          {/* Celebration particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: 3 }}
          >
            <TrophyIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          </motion.div>
          <h3 className="text-heading-md text-green-700 dark:text-green-400 mb-2">🎉 Perfect Day Achieved!</h3>
          <p className="text-body text-green-600 dark:text-green-500 mb-4">All goals completed! You're building incredible momentum.</p>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-950/20 rounded-full">
              <SparklesIcon className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-700">+50 XP Earned</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/20 rounded-full">
              <FireIcon className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-600">{streakCount} Day Streak</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TodaysGoals;