import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { 
  BoltIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
  HeartIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  PlusIcon,
  CalendarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface FitnessDashboardProps {
  onQuickAction?: (action: string) => void;
}

const FitnessDashboard: React.FC<FitnessDashboardProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('overview');
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'workouts', label: 'Workouts', icon: FireIcon },
    { id: 'programs', label: 'Programs', icon: CalendarIcon },
    { id: 'progress', label: 'Progress', icon: TrophyIcon },
  ];

  const workoutPrograms = [
    {
      id: 'strength',
      name: 'Strength Building',
      description: 'Build muscle and increase strength',
      duration: '45-60 min',
      frequency: '4x/week',
      level: 'Intermediate',
      color: 'from-red-500 to-pink-600',
      exercises: ['Squats', 'Deadlifts', 'Bench Press', 'Pull-ups']
    },
    {
      id: 'cardio',
      name: 'Cardio Conditioning',
      description: 'Improve cardiovascular health',
      duration: '30-45 min',
      frequency: '3x/week',
      level: 'Beginner',
      color: 'from-blue-500 to-cyan-600',
      exercises: ['Running', 'Cycling', 'HIIT', 'Swimming']
    },
    {
      id: 'flexibility',
      name: 'Flexibility & Mobility',
      description: 'Enhance range of motion',
      duration: '20-30 min',
      frequency: 'Daily',
      level: 'All Levels',
      color: 'from-green-500 to-emerald-600',
      exercises: ['Yoga', 'Stretching', 'Foam Rolling', 'Pilates']
    }
  ];

  const todaysWorkouts = [
    {
      id: 'morning',
      name: 'Morning Cardio',
      type: 'Cardio',
      duration: 30,
      calories: 250,
      completed: true,
      time: '07:00'
    },
    {
      id: 'evening',
      name: 'Upper Body Strength',
      type: 'Strength',
      duration: 45,
      calories: 180,
      completed: false,
      time: '18:00'
    }
  ];

  const fitnessStats = [
    { label: 'Workouts This Week', value: '4', target: '5', icon: FireIcon },
    { label: 'Total Calories Burned', value: '1,247', target: '1,500', icon: BoltIcon },
    { label: 'Active Minutes', value: '180', target: '150', icon: ClockIcon },
    { label: 'Strength Sessions', value: '2', target: '3', icon: TrophyIcon }
  ];

  const startWorkout = (workout: any) => {
    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
    
    toast({
      title: "Workout Started! 💪",
      description: `${workout.name} - Let's crush this session!`,
    });
  };

  const handleSupplementShortcut = (products: string[], category: string) => {
    onQuickAction?.('supplements');
    
    toast({
      title: `🛒 ${products.join(' or ')} Available`,
      description: `Premium ${category} supplements for better performance`,
      action: {
        label: "Shop Now",
        onClick: () => onQuickAction?.('supplements')
      }
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {fitnessStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card text-center"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">Target: {stat.target}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Workouts */}
      <div className="card-premium">
        <h2 className="text-xl font-bold text-foreground mb-4">Today's Workouts</h2>
        <div className="space-y-3">
          {todaysWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                workout.completed 
                  ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                  : 'border-border hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    workout.completed ? 'bg-green-500' : 'bg-gradient-to-br from-orange-500 to-red-600'
                  }`}>
                    {workout.completed ? (
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    ) : (
                      <FireIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workout.duration} min • {workout.calories} cal • {workout.time}
                    </p>
                  </div>
                </div>
                
                {!workout.completed && (
                  <button
                    onClick={() => startWorkout(workout)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                  >
                    Start Workout
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pre-Workout Supplements */}
      <div className="card-premium bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <BoltIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">
              Pre-Workout Optimization
            </h3>
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-4">
              Take creatine 30 minutes before your workout for optimal performance and muscle building.
            </p>
            <button
              onClick={() => handleSupplementShortcut(['Creatine Monohydrate', 'Creatine HCL'], 'performance')}
              className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <CubeIcon className="w-4 h-4" />
              <span>Shop Creatine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkouts = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {workoutPrograms.map((program, index) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-xl flex items-center justify-center mx-auto`}>
                <FireIcon className="w-8 h-8 text-white" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">{program.name}</h3>
                <p className="text-muted-foreground">{program.description}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{program.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium text-foreground">{program.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium text-foreground">{program.level}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key Exercises:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.exercises.map((exercise, idx) => (
                      <span key={idx} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full btn-primary">
                  Start Program
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
            <BoltIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Fitness & Training</h1>
            <p className="text-gray-600 dark:text-gray-300">Optimize your workouts and track progress</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              activeView === tab.id
                ? 'bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' ? renderOverview() : renderWorkouts()}
        </motion.div>
      </AnimatePresence>

      {/* Active Workout Timer */}
      {isWorkoutActive && currentWorkout && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 bg-card rounded-xl p-4 shadow-2xl border border-border z-40">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">{currentWorkout.name}</h3>
              <button
                onClick={() => setIsWorkoutActive(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground font-mono">
                {Math.floor(workoutTimer / 60)}:{(workoutTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground">Workout Time</div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 btn-secondary">
                <PauseIcon className="w-4 h-4" />
                <span>Pause</span>
              </button>
              <button 
                onClick={() => {
                  setIsWorkoutActive(false);
                  toast({
                    title: "Workout Complete! 🎉",
                    description: `Great job on ${currentWorkout.name}!`,
                  });
                }}
                className="flex-1 btn-primary"
              >
                <CheckCircleIcon className="w-4 h-4" />
                <span>Finish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessDashboard;