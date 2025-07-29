import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ReadinessScoreProps {
  score: number;
}

const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  const radius = 70;
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
    <div className="card-premium">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-heading-lg text-foreground">Biowell Score</h2>
            <p className="text-caption">Your daily wellness index</p>
          </div>
        </div>
        <div className={`status-indicator status-${score >= 70 ? 'success' : score >= 55 ? 'warning' : 'error'}`}>
          {getScoreStatus(score)}
        </div>
      </div>

      {/* Score Ring */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke={getScoreColor(score)}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 " + circumference }}
              animate={{ strokeDasharray: strokeDasharray }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold text-foreground"
              >
                {score}
              </motion.div>
              <div className="text-caption">Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid-premium grid-cols-4">
        {[
          { label: 'Sleep', value: 68, color: '#6366f1' },
          { label: 'Activity', value: 72, color: '#06b6d4' },
          { label: 'Nutrition', value: 58, color: '#f59e0b' },
          { label: 'Recovery', value: 52, color: '#ef4444' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="text-center"
          >
            <div 
              className="text-xl font-bold mb-1"
              style={{ color: item.color }}
            >
              {item.value}
            </div>
            <div className="text-caption">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReadinessScore;