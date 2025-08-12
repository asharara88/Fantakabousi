import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MuscleGroupVisualizer from './MuscleGroupVisualizer';
import { FileIcon as FireIcon, ClockIcon, TrophyIcon, ChartBarIcon, PlayIcon, PauseIcon, TargetIcon } from 'lucide-react';

const FitnessTracker: React.FC = () => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);

  const workoutStats = [
    {
      label: 'This Week',
      value: '4',
      unit: 'workouts',
      icon: FireIcon,
      color: 'from-orange-500 to-red-600'
    },
    {
      label: 'Total Time',
      value: '3h 45m',
      unit: 'active',
      icon: ClockIcon,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Streak',
      value: '12',
      unit: 'days',
      icon: TrophyIcon,
      color: 'from-amber-500 to-yellow-600'
    },
    {
      label: 'Progress',
      value: '87%',
      unit: 'goal',
      icon: ChartBarIcon,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const handleMuscleSelect = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FireIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
              Fitness & Training
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Smart muscle readiness and workout optimization
            </p>
          </div>
        </div>
      </div>

      {/* Workout Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {workoutStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{stat.unit}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D Muscle Visualizer */}
      <MuscleGroupVisualizer 
        selectedMuscleGroup={selectedMuscleGroup}
        onMuscleSelect={handleMuscleSelect}
      />

      {/* Quick Workout Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50"
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Ready to Train?
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Based on your muscle readiness analysis
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <button className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group">
              <TargetIcon className="w-8 h-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Upper Body Focus</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Chest, shoulders, arms ready</div>
            </button>
            
            <button className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group">
              <PlayIcon className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Core Activation</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">92% readiness score</div>
            </button>
            
            <button className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group">
              <ClockIcon className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Recovery Session</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Light movement & stretching</div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FitnessTracker;