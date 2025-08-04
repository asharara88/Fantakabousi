import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  HeartIcon,
  MoonIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

interface WellnessScoreProps {
  score: number;
  breakdown: {
    sleep: number;
    nutrition: number;
    exercise: number;
    stress: number;
    recovery: number;
  };
}

const WellnessScore: React.FC<WellnessScoreProps> = ({ score, breakdown }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-green-600';
    if (score >= 80) return 'from-blue-500 to-cyan-600';
    if (score >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { text: 'Exceptional', emoji: '🏆' };
    if (score >= 80) return { text: 'Excellent', emoji: '⭐' };
    if (score >= 70) return { text: 'Good', emoji: '👍' };
    return { text: 'Needs Focus', emoji: '💪' };
  };

  const status = getScoreStatus(score);
  const categories = [
    { name: 'Sleep', value: breakdown.sleep, icon: MoonIcon, color: 'from-indigo-500 to-purple-600' },
    { name: 'Nutrition', value: breakdown.nutrition, icon: FireIcon, color: 'from-green-500 to-emerald-600' },
    { name: 'Exercise', value: breakdown.exercise, icon: BoltIcon, color: 'from-orange-500 to-red-600' },
    { name: 'Stress', value: breakdown.stress, icon: HeartIcon, color: 'from-rose-500 to-pink-600' },
    { name: 'Recovery', value: breakdown.recovery, icon: SparklesIcon, color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getScoreColor(score)} flex items-center justify-center shadow-lg`}>
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-display text-gradient-brand">Wellness Score</h2>
          </div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="text-8xl font-display text-gradient-brand">
                {score}
              </div>
              <div className="text-xl text-white/60 font-semibold">
                {status.text} {status.emoji}
              </div>
            </motion.div>
            
            <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${getScoreColor(score)} text-white font-bold shadow-lg`}>
              <SparklesIcon className="w-5 h-5" />
              <span>Wellness Optimized</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="glass-ultra rounded-2xl p-6 text-center space-y-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto shadow-lg`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {category.value}
                </div>
                <div className="text-sm font-semibold text-white/70">
                  {category.name}
                </div>
              </div>
              
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${category.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.value}%` }}
                  transition={{ delay: 1 + index * 0.1, duration: 1.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WellnessScore;