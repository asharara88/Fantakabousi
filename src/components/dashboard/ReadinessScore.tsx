import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ReadinessScoreProps {
  score: number;
}

const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 55) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return 'Optimal';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="glass-premium rounded-3xl p-8 shadow-premium hover:shadow-glow-blue transition-all duration-500 relative overflow-hidden">
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: getScoreColor(score) }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl" />
            <SparklesIcon className="w-7 h-7 text-white relative z-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Biowell Score</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Your daily wellness intelligence</p>
          </div>
        </div>
        <div className={`px-4 py-2 text-base font-bold rounded-2xl shadow-lg ${
          score >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 
          score >= 55 ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
        }`}>
          {getScoreStatus(score)}
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        {/* Score Ring */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" className="transform -rotate-90 drop-shadow-2xl">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="65"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="6"
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="65"
              stroke={getScoreColor(score)}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 408" }}
              animate={{ strokeDasharray: `${(score / 100) * 408} 408` }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="drop-shadow-lg"
            />
            
            {/* Glow effect */}
            <motion.circle
              cx="80"
              cy="80"
              r="65"
              stroke={getScoreColor(score)}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 408" }}
              animate={{ strokeDasharray: `${(score / 100) * 408} 408` }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="opacity-50 blur-sm"
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-2xl font-bold text-gray-900"
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                {score}
              </motion.div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-bold tracking-wider">SCORE</div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Sleep', value: 68, gradient: 'from-indigo-500 to-purple-600' },
            { label: 'Activity', value: 72, gradient: 'from-blue-500 to-cyan-600' },
            { label: 'Nutrition', value: 58, gradient: 'from-emerald-500 to-teal-600' },
            { label: 'Recovery', value: 52, gradient: 'from-orange-500 to-red-600' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-4 glass-premium rounded-2xl hover:scale-105 transition-all duration-300"
            >
              <div className={`text-2xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-2`}>
                {item.value}
              </div>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadinessScore;