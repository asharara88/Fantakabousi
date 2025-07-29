import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  BeakerIcon,
  CubeIcon,
  FireIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const TodaysPlan: React.FC = () => {
  const schedule = [
    {
      time: '7:00 AM',
      title: 'Morning Stack',
      description: 'Vitamin D3, Omega-3, Magnesium',
      type: 'supplement',
      status: 'completed',
      icon: CubeIcon,
      color: 'from-green-500 to-emerald-600',
    },
    {
      time: '8:30 AM',
      title: 'Workout Session',
      description: 'Upper body strength training',
      type: 'exercise',
      status: 'active',
      icon: FireIcon,
      color: 'from-orange-500 to-red-600',
    },
    {
      time: '12:00 PM',
      title: 'Lunch & Glucose Check',
      description: 'Mediterranean bowl + CGM reading',
      type: 'nutrition',
      status: 'upcoming',
      icon: BeakerIcon,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      time: '3:00 PM',
      title: 'Afternoon Stack',
      description: 'B-Complex, Adaptogenic blend',
      type: 'supplement',
      status: 'upcoming',
      icon: CubeIcon,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      time: '6:00 PM',
      title: 'Evening Cardio',
      description: '30min zone 2 training',
      type: 'exercise',
      status: 'upcoming',
      icon: FireIcon,
      color: 'from-pink-500 to-rose-600',
    },
    {
      time: '10:00 PM',
      title: 'Sleep Prep',
      description: 'Melatonin, blue light filter',
      type: 'sleep',
      status: 'upcoming',
      icon: MoonIcon,
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircleIcon;
      case 'active':
        return PlayIcon;
      default:
        return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'active':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-display text-gradient-brand">Today's Plan</h2>
            </div>
            <p className="text-white/70 text-lg">
              Your personalized wellness schedule
            </p>
          </div>
          
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-white">4/6</div>
            <div className="text-sm text-white/60">Tasks remaining</div>
          </div>
        </div>

        <div className="space-y-4">
          {schedule.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-ultra rounded-2xl p-6 border transition-all duration-300 ${
                  item.status === 'active' 
                    ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className="text-center space-y-1 flex-shrink-0">
                    <div className="text-white/60 text-sm font-semibold">
                      {item.time}
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-white/70">
                      {item.description}
                    </p>
                  </div>
                  
                  {item.status === 'upcoming' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 flex-shrink-0"
                    >
                      Start
                    </motion.button>
                  )}
                  
                  {item.status === 'active' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 flex-shrink-0"
                    >
                      Continue
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 glass-ultra rounded-2xl p-6 text-center"
        >
          <div className="space-y-4">
            <div className="text-lg font-bold text-white">
              You're on track for an amazing day! 🎯
            </div>
            <div className="text-white/70">
              Complete 2 more tasks to unlock your daily achievement
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: '67%' }}
                transition={{ delay: 1, duration: 1.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TodaysPlan;