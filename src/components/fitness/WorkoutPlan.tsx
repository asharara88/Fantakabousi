import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PlayIcon,
  PauseIcon,
  ClockIcon,
  FireIcon,
  TargetIcon,
  TrophyIcon,
  CalendarIcon,
  ChartBarIcon,
  BoltIcon,
  HeartIcon
} from 'lucide-react';

const WorkoutPlan: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('strength');
  const [currentWeek, setCurrentWeek] = useState(1);

  const workoutPlans = [
    {
      id: 'strength',
      name: 'Strength Building',
      description: 'Build muscle and increase strength',
      duration: '8 weeks',
      frequency: '4x per week',
      difficulty: 'Intermediate',
      color: 'from-red-500 to-orange-600',
      icon: BoltIcon
    },
    {
      id: 'cardio',
      name: 'Cardiovascular Health',
      description: 'Improve heart health and endurance',
      duration: '6 weeks',
      frequency: '5x per week',
      difficulty: 'Beginner',
      color: 'from-blue-500 to-cyan-600',
      icon: HeartIcon
    },
    {
      id: 'hiit',
      name: 'HIIT Training',
      description: 'High-intensity interval training',
      duration: '4 weeks',
      frequency: '3x per week',
      difficulty: 'Advanced',
      color: 'from-purple-500 to-pink-600',
      icon: FireIcon
    }
  ];

  const todaysWorkout = {
    name: 'Upper Body Strength',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Pull-ups', sets: 3, reps: '8-10', rest: '90s' },
      { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '45s' }
    ],
    estimatedTime: 45,
    targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms']
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BoltIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
              Workout Plans
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Personalized training programs for your goals
            </p>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workoutPlans.map((plan, index) => (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedPlan(plan.id)}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              selectedPlan === plan.id
                ? `border-transparent bg-gradient-to-br ${plan.color} text-white shadow-xl scale-105`
                : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            whileHover={{ scale: selectedPlan === plan.id ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedPlan === plan.id ? 'bg-white/20' : `bg-gradient-to-br ${plan.color}`
              }`}>
                <plan.icon className={`w-6 h-6 ${selectedPlan === plan.id ? 'text-white' : 'text-white'}`} />
              </div>
              
              <div>
                <h3 className={`text-lg font-bold ${selectedPlan === plan.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${selectedPlan === plan.id ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
                  {plan.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className={`font-medium ${selectedPlan === plan.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.duration}
                  </div>
                  <div className={`${selectedPlan === plan.id ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                    Duration
                  </div>
                </div>
                <div>
                  <div className={`font-medium ${selectedPlan === plan.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.frequency}
                  </div>
                  <div className={`${selectedPlan === plan.id ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                    Frequency
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Today's Workout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/20 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Today's Workout</h3>
              <p className="text-slate-600 dark:text-slate-400">{todaysWorkout.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{todaysWorkout.estimatedTime} min</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Estimated time</div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
              Start Workout
            </button>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {todaysWorkout.exercises.map((exercise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-50/60 dark:bg-slate-800/60 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{exercise.name}</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {exercise.sets} sets × {exercise.reps} reps
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900 dark:text-white">Rest: {exercise.rest}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Target Muscles */}
        <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Target Muscle Groups</h4>
          <div className="flex flex-wrap gap-2">
            {todaysWorkout.targetMuscles.map((muscle, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-medium rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Week {currentWeek} Progress</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className="p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg disabled:opacity-50"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Workouts Completed', value: '3/4', icon: CheckCircleIcon, color: 'text-emerald-600' },
            { label: 'Total Time', value: '2h 15m', icon: ClockIcon, color: 'text-blue-600' },
            { label: 'Calories Burned', value: '1,247', icon: FireIcon, color: 'text-orange-600' },
            { label: 'Strength Gains', value: '+8%', icon: TrophyIcon, color: 'text-purple-600' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
              <div className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}>
                <stat.icon className="w-full h-full" />
              </div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutPlan;