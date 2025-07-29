import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoonIcon, 
  HeartIcon, 
  BoltIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrophyIcon,
  FireIcon,
  ScaleIcon,
  BeakerIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface ReadinessScoreProps {
  score: number;
}

const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mobile-optimized dimensions
  const isMobile = window.innerWidth < 768;
  const ringSize = isMobile ? 120 : 160;
  const radius = isMobile ? 45 : 60;
  const strokeWidth = isMobile ? 4 : 6;
  
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  // Biowell Score KPIs
  const kpis = [
    {
      name: 'Sleep Quality',
      value: 68,
      weight: 25,
      icon: MoonIcon,
      description: '45m deep sleep (low)',
      trend: '-8%',
      color: 'from-indigo-500 to-purple-600',
      details: {
        deepSleep: '45 min',
        remSleep: '1h 20m',
        efficiency: '78%',
        consistency: 'Poor'
      }
    },
    {
      name: 'Activity Level',
      value: 72,
      weight: 20,
      icon: BoltIcon,
      description: '8,234 steps, 75min workout',
      trend: '+5%',
      color: 'from-blue-500 to-cyan-600',
      details: {
        steps: '8,234',
        activeMinutes: '75 min',
        intensity: 'High',
        consistency: 'Good'
      }
    },
    {
      name: 'Nutrition',
      value: 58,
      weight: 20,
      icon: FireIcon,
      description: 'High glucose spikes',
      trend: '-12%',
      color: 'from-green-500 to-emerald-600',
      details: {
        calories: '2,890 kcal',
        protein: '165g',
        glucoseSpikes: '8 events',
        hydration: 'Low'
      }
    },
    {
      name: 'Metabolism',
      value: 45,
      weight: 15,
      icon: BeakerIcon,
      description: 'Insulin resistance',
      trend: '-15%',
      color: 'from-red-500 to-pink-600',
      details: {
        glucose: '142 mg/dL',
        insulin: 'Resistant',
        metabolicAge: '42 years',
        efficiency: 'Poor'
      }
    },
    {
      name: 'Recovery',
      value: 52,
      weight: 10,
      icon: HeartIcon,
      description: 'High strain, poor HRV',
      trend: '-18%',
      color: 'from-orange-500 to-red-600',
      details: {
        hrv: '28 ms',
        restingHR: '72 bpm',
        strain: '16.8/21',
        recovery: 'Poor'
      }
    },
    {
      name: 'Goals Progress',
      value: 65,
      weight: 10,
      icon: TrophyIcon,
      description: 'Moderate progress',
      trend: '+3%',
      color: 'from-purple-500 to-indigo-600',
      details: {
        fertility: '40%',
        muscle: '70%',
        sleep: '35%',
        overall: '48%'
      }
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981'; // emerald-500
    if (score >= 70) return '#3b82f6'; // blue-500
    if (score >= 55) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return { text: 'Optimal', variant: 'success' };
    if (score >= 70) return { text: 'Good', variant: 'success' };
    if (score >= 55) return { text: 'Fair', variant: 'warning' };
    return { text: 'Needs Focus', variant: 'error' };
  };

  const status = getScoreStatus(score);

  // Calculate weighted score
  const calculateWeightedScore = () => {
    return kpis.reduce((total, kpi) => total + (kpi.value * kpi.weight / 100), 0);
  };

  return (
    <div className="card-minimal p-4 lg:p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="space-y-2 lg:space-y-3">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base lg:text-heading-lg text-foreground">Biowell Score</h2>
              <p className="text-xs lg:text-caption">AI-powered wellness index</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`status-indicator status-${status.variant}`}>
            {status.text}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
        {/* Biowell Score Ring - Mobile Optimized */}
        <div className="relative flex justify-center">
          <div className="relative">
            <svg width={ringSize} height={ringSize} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke={getScoreColor(score)}
                strokeWidth={strokeWidth}
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
            
            {/* Score display - Mobile Optimized */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  className="text-2xl lg:text-4xl font-bold text-foreground"
                >
                  {score}
                </motion.div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Biowell Score
                </div>
              </div>
            </div>

            {/* Floating indicators - Reduced for mobile */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(isMobile ? 2 : 3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
                  style={{
                    left: `${30 + i * (isMobile ? 30 : 20)}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [-2, 2, -2],
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
            </div>
          </div>
        </div>

        {/* KPI Summary - Always Visible */}
        <div className="space-y-3">
          {kpis.slice(0, isExpanded ? kpis.length : 4).map((kpi, index) => (
            <motion.div
              key={kpi.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card-minimal p-3"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">{kpi.name}</h3>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="text-lg font-bold text-foreground">
                        {kpi.value}%
                      </div>
                      <div className="text-xs text-green-400 font-medium">
                        {kpi.trend}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs mb-2 text-muted-foreground line-clamp-1">{kpi.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="progress-bar flex-1 mr-3">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${kpi.value}%` }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 1 }}
                        style={{
                          background: `linear-gradient(90deg, ${kpi.color.split(' ')[1]}, ${kpi.color.split(' ')[3]})`
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {kpi.weight}% weight
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-border space-y-6"
          >
            {/* Score Calculation Breakdown */}
            <div className="card-minimal p-4 bg-muted/20">
              <div className="flex items-center space-x-3 mb-4">
                <ChartBarIcon className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Score Calculation</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-caption text-muted-foreground">
                  Your Biowell Score is calculated using weighted KPIs based on your health goals:
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {kpis.map((kpi, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <kpi.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{kpi.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">
                          {(kpi.value * kpi.weight / 100).toFixed(1)} pts
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {kpi.value}% × {kpi.weight}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">Total Biowell Score</span>
                  <span className="text-lg font-bold text-primary">{score}/100</span>
                </div>
              </div>
            </div>

            {/* Detailed KPI Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {kpis.map((kpi, index) => (
                <motion.div
                  key={kpi.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-minimal p-3"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-8 h-8 bg-gradient-to-br ${kpi.color} rounded-lg flex items-center justify-center`}>
                      <kpi.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{kpi.name}</h4>
                      <div className="text-caption">Weight: {kpi.weight}% of total score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(kpi.details).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Improvement Recommendations */}
            <div className="card-minimal p-4 bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center space-x-3 mb-4">
                <SparklesIcon className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-semibold text-foreground">Score Improvement Plan</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-caption text-muted-foreground mb-4">
                  Focus on these areas to improve your Biowell Score:
                </div>
                
                {[
                  { priority: 1, area: 'Metabolism', impact: '+15 pts', action: 'Implement CGM-guided meal timing and low-carb approach' },
                  { priority: 2, area: 'Sleep Quality', impact: '+12 pts', action: 'Optimize sleep hygiene for 90min+ deep sleep' },
                  { priority: 3, area: 'Recovery', impact: '+8 pts', action: 'Reduce training strain and focus on HRV improvement' },
                ].map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {rec.priority}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">{rec.area}</span>
                        <span className="text-sm font-bold text-green-500">{rec.impact}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{rec.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadinessScore;