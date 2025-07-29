import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ReadinessScoreProps {
  score: number;
}

const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'var(--success)';
    if (score >= 70) return 'var(--info)';
    if (score >= 55) return 'var(--warning)';
    return 'var(--error)';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return 'Optimal';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="card">
      <div className="stack stack-lg">
        {/* Header */}
        <div className="cluster justify-between">
          <div className="cluster cluster-md">
            <div className="avatar avatar-md" style={{ backgroundColor: 'var(--primary)' }}>
              <SparklesIcon className="icon icon-lg" />
            </div>
            <div className="stack stack-sm">
              <h2 className="text-title">Biowell Score</h2>
              <p className="text-caption">AI wellness index</p>
            </div>
          </div>
          <div className={`status status-${score >= 70 ? 'success' : score >= 55 ? 'warning' : 'error'}`}>
            {getScoreStatus(score)}
          </div>
        </div>

        {/* Score Ring */}
        <div className="flex justify-center">
          <div className="relative">
            <svg width="140" height="140" className="transform -rotate-90">
              {/* Background */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="var(--bg-tertiary)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress */}
              <motion.circle
                cx="70"
                cy="70"
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
            
            {/* Score Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="text-display"
                >
                  {score}
                </motion.div>
                <div className="text-label mt-1">SCORE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-4 gap-4">
          {[
            { label: 'Sleep', value: '68%', color: 'var(--primary)' },
            { label: 'Activity', value: '72%', color: 'var(--secondary)' },
            { label: 'Nutrition', value: '58%', color: 'var(--warning)' },
            { label: 'Recovery', value: '52%', color: 'var(--error)' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-body font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadinessScore;