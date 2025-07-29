import React from 'react';
import { motion } from 'framer-motion';
import { 
  MoonIcon, 
  HeartIcon, 
  BoltIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ReadinessScoreProps {
  score: number;
}

const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 120;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const factors = [
    {
      name: 'Sleep Quality',
      value: 68,
      icon: MoonIcon,
      description: '45m deep sleep (low)',
      trend: '-8%',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      name: 'HRV Recovery',
      value: 45,
      icon: HeartIcon,
      description: 'Poor recovery',
      trend: '-15%',
      color: 'from-red-500 to-rose-600',
    },
    {
      name: 'Strain Balance',
      value: 62,
      icon: BoltIcon,
      description: 'High training strain',
      trend: '+18%',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      name: 'Consistency',
      value: 71,
      icon: ArrowTrendingUpIcon,
      description: 'Moderate habits',
      trend: '+5%',
      color: 'from-emerald-500 to-green-600',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'rgb(34, 197, 94)'; // emerald-500
    if (score >= 70) return 'rgb(59, 130, 246)'; // blue-500
    if (score >= 55) return 'rgb(245, 158, 11)'; // amber-500
    return 'rgb(239, 68, 68)'; // red-500
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return { text: 'Optimal', variant: 'success' };
    if (score >= 70) return { text: 'Good', variant: 'success' };
    if (score >= 55) return { text: 'Fair', variant: 'warning' };
    return { text: 'Poor', variant: 'error' };
  };

  const status = getScoreStatus(score);

  return (
    <div className="card-premium p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-heading-xl text-foreground">Daily Readiness</h2>
              <p className="text-caption">AI-powered body preparation analysis</p>
            </div>
          </div>
        </div>
        <div className={`status-indicator status-${status.variant}`}>
          <CheckCircleIcon className="w-4 h-4" />
          {status.text}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
        {/* Readiness Ring */}
        <div className="relative flex justify-center">
          <div className="relative">
            <svg width="280" height="280" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="140"
                cy="140"
                r="120"
                stroke={getScoreColor(score)}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (score / 100) * circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 4px 8px ${getScoreColor(score)}40)`,
                }}
              />
            </svg>
            
            {/* Score display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  className="text-6xl font-bold text-foreground"
                >
                  {score}
                </motion.div>
                <div className="text-caption font-semibold uppercase tracking-wider">
                  Biowell Score
                </div>
                <div className="status-indicator status-success">
                  Wellness Optimized
                </div>
              </div>
            </div>

            {/* Floating indicators */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${25 + (i % 2) * 50}%`,
                  }}
                  animate={{
                    y: [-8, 8, -8],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <span>{status.text} Performance {status.emoji}</span>
            </div>
          </div>
        </div>

        {/* Factors */}
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card-premium p-6"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${factor.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <factor.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-body font-semibold text-foreground">{factor.name}</h3>
                    <div className="flex items-center space-x-3">
                      <div className="text-heading-lg font-bold text-foreground">
                        {factor.value}%
                      </div>
                      <div className="status-indicator status-success">
                        {factor.trend}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-caption mb-4">{factor.description}</p>
                  
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.value}%` }}
                      transition={{ delay: 0.8 + index * 0.2, duration: 1 }}
                      style={{
                        background: `linear-gradient(90deg, ${factor.color.split(' ')[1]}, ${factor.color.split(' ')[3]})`
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-12 card-premium p-6 bg-muted/30"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-body font-semibold text-foreground">AI Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { text: 'Optimal for high-intensity training', icon: '🔥', priority: 'high', variant: 'error' },
            { text: 'Consider pre-workout supplementation', icon: '💊', priority: 'medium', variant: 'warning' },
            { text: 'Maintain current sleep schedule', icon: '😴', priority: 'low', variant: 'success' },
          ].map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              className="card-premium p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{rec.icon}</div>
                <div className="flex-1 space-y-2">
                  <span className="text-body font-medium text-foreground">{rec.text}</span>
                  <div className={`status-indicator status-${rec.variant}`}>
                    {rec.priority.toUpperCase()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReadinessScore;