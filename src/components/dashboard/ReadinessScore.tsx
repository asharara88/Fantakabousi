import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon,
  BoltIcon,
  EyeIcon,
  BeakerIcon,
  HeartIcon,
  CloudIcon,
  TrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ReadinessScoreProps {
  score: number;
}

const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(animatedScore / 100) * circumference} ${circumference}`;

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { status: 'Optimal', description: 'Peak performance state', color: 'from-emerald-500 to-teal-600' };
    if (score >= 80) return { status: 'Excellent', description: 'Above baseline performance', color: 'from-blue-500 to-cyan-600' };
    if (score >= 70) return { status: 'Good', description: 'Stable performance state', color: 'from-amber-500 to-orange-600' };
    return { status: 'Recovery', description: 'Focus on restoration', color: 'from-red-500 to-pink-600' };
  };

  const scoreInfo = getScoreStatus(animatedScore);

  const healthFactors = [
    { 
      name: 'Cardiovascular', 
      value: 94, 
      impact: 'High',
      icon: HeartIcon,
      color: 'from-red-500 to-rose-600',
      description: 'Heart rate and circulation'
    },
    { 
      name: 'Recovery', 
      value: 89, 
      impact: 'High',
      icon: BoltIcon,
      color: 'from-emerald-500 to-teal-600',
      description: 'HRV and stress resilience'
    },
    { 
      name: 'Sleep Quality', 
      value: 92, 
      impact: 'Medium',
      icon: CloudIcon,
      color: 'from-indigo-500 to-purple-600',
      description: 'Sleep efficiency and recovery'
    },
    { 
      name: 'Metabolic', 
      value: 87, 
      impact: 'Medium',
      icon: BeakerIcon,
      color: 'from-blue-500 to-cyan-600',
      description: 'Glucose and energy levels'
    }
  ];

  return (
    <div className="card-professional rounded-2xl p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Readiness Score</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your daily optimization score</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Score Ring */}
          <div className="relative">
            <svg width="160" height="160" className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgb(226 232 240)"
                strokeWidth="6"
                fill="none"
                className="dark:stroke-slate-700"
              />
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              
              {/* Progress ring */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 440" }}
                animate={{ strokeDasharray: `${(animatedScore / 100) * 440} 440` }}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                className="drop-shadow-sm"
              />
            </svg>
            
            {/* Score Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  className="text-4xl font-bold text-slate-900 dark:text-slate-100"
                >
                  {animatedScore}
                </motion.div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
                  Readiness
                </div>
              </div>
            </div>
          </div>

          {/* Status & Factors */}
          <div className="space-y-4 flex-1 ml-8">
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${scoreInfo.color} text-white font-semibold rounded-xl shadow-lg`}>
                {scoreInfo.status}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{scoreInfo.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {healthFactors.map((factor, index) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 text-center hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
                  whileHover={{ y: -1 }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-br ${factor.color} rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    <factor.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {factor.value}
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {factor.name}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 ${
                    factor.impact === 'High' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {factor.impact} Impact
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <TrendingUpIcon className="w-5 h-5 text-blue-500" />
                  <span>Detailed Health Analysis</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Contributing Factors</div>
                    <div className="space-y-2">
                      {healthFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <factor.icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{factor.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{factor.value}%</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-professional-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Recommendations</div>
                    <div className="space-y-2">
                      {[
                        'Maintain current sleep schedule',
                        'Optimal time for strength training',
                        'Consider post-workout nutrition',
                        'Monitor stress levels today'
                      ].map((rec, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReadinessScore;