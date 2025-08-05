import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon,
  CpuChipIcon,
  BoltIcon,
  EyeIcon,
  BeakerIcon,
  HeartIcon
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

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(animatedScore / 100) * circumference} ${circumference}`;

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-emerald-400 via-teal-500 to-cyan-600';
    if (score >= 80) return 'from-blue-400 via-indigo-500 to-purple-600';
    if (score >= 70) return 'from-yellow-400 via-orange-500 to-red-500';
    return 'from-red-400 via-pink-500 to-rose-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { status: 'Neural Optimal', description: 'Peak performance state' };
    if (score >= 80) return { status: 'Enhanced', description: 'Above baseline performance' };
    if (score >= 70) return { status: 'Balanced', description: 'Stable performance state' };
    return { status: 'Adaptive', description: 'Recovery optimization needed' };
  };

  const scoreInfo = getScoreStatus(animatedScore);
  const gradient = getScoreGradient(animatedScore);

  const neuralFactors = [
    { 
      name: 'Cardiac Neural', 
      value: 94, 
      impact: 'High',
      icon: HeartIcon,
      color: 'from-red-400 to-pink-500'
    },
    { 
      name: 'Recovery Neural', 
      value: 89, 
      impact: 'High',
      icon: BoltIcon,
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      name: 'Sleep Neural', 
      value: 92, 
      impact: 'Medium',
      icon: EyeIcon,
      color: 'from-indigo-400 to-purple-500'
    },
    { 
      name: 'Metabolic Neural', 
      value: 87, 
      impact: 'Medium',
      icon: BeakerIcon,
      color: 'from-emerald-400 to-teal-500'
    }
  ];

  return (
    <div className="card-ultra rounded-3xl p-8 relative overflow-hidden">
      {/* Neural background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl morphing-blob">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gradient-neural">Neural Readiness</h2>
              <p className="text-sm text-muted-foreground">AI-computed optimization score</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 glass-morphism rounded-xl text-sm font-semibold text-foreground hover:bg-white/10 transition-all duration-300"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Neural Score Ring */}
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                fill="none"
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
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 502" }}
                animate={{ strokeDasharray: `${(animatedScore / 100) * 502} 502` }}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                className="drop-shadow-2xl"
              />
              
              {/* Glow effect */}
              <motion.circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#scoreGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 502" }}
                animate={{ strokeDasharray: `${(animatedScore / 100) * 502} 502` }}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                className="opacity-50 blur-sm"
              />
            </svg>
            
            {/* Score Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  className="text-5xl font-black text-gradient-neural"
                >
                  {animatedScore}
                </motion.div>
                <div className="text-sm text-muted-foreground font-bold tracking-wider">
                  NEURAL SCORE
                </div>
              </div>
            </div>
            
            {/* Floating neural nodes */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                style={{
                  left: `${50 + 40 * Math.cos((i * 60) * Math.PI / 180)}%`,
                  top: `${50 + 40 * Math.sin((i * 60) * Math.PI / 180)}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Status & Breakdown */}
          <div className="space-y-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${gradient} text-white font-bold rounded-2xl shadow-2xl`}>
                {scoreInfo.status}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{scoreInfo.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {neuralFactors.map((factor, index) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  className="glass-morphism rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${factor.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <factor.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-black text-gradient-neural mb-1">
                    {factor.value}
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">
                    {factor.name}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-bold ${
                    factor.impact === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {factor.impact} Impact
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Neural Details Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 card-ultra rounded-2xl p-6"
            >
              <div className="space-y-4">
                <h4 className="font-bold text-foreground flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5 text-primary-400" />
                  <span>Neural Processing Details</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">Processing Layers</div>
                    <div className="space-y-2">
                      {['Biometric Fusion', 'Pattern Recognition', 'Predictive Modeling', 'Optimization Engine'].map((layer, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{layer}</span>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">Neural Confidence</div>
                    <div className="space-y-2">
                      {neuralFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{factor.name}</span>
                          <span className="text-sm font-bold text-gradient-neural">{factor.value}%</span>
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