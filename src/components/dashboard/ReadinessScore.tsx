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
    <div className="card-premium">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: getScoreColor(score) }}
          >
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Biowell Score</h2>
            <p className="text-sm text-muted-foreground">Your daily wellness index</p>
          </div>
        </div>
        <div className={`px-3 py-1 text-sm font-medium rounded-full ${
          score >= 70 ? 'bg-green-100 text-green-700' : 
          score >= 55 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        }`}>
          {getScoreStatus(score)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Score Ring */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgb(var(--muted))"
              strokeWidth="4"
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              stroke={getScoreColor(score)}
              strokeWidth="4"
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
                className="text-2xl font-bold text-gray-900"
                className="text-2xl font-bold text-foreground"
              >
                {score}
              </motion.div>
              <div className="text-xs text-muted-foreground font-medium">SCORE</div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Sleep', value: 68, color: '#48C6FF' },
            { label: 'Activity', value: 72, color: '#2A7FFF' },
            { label: 'Nutrition', value: 58, color: '#3BE6C5' },
            { label: 'Recovery', value: 52, color: '#0026CC' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div 
                className="text-lg font-bold mb-1"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadinessScore;