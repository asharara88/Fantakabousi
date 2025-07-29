import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ReadinessRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const ReadinessRing: React.FC<ReadinessRingProps> = ({ score, size = 'lg' }) => {
  const sizes = {
    sm: { width: 120, height: 120, radius: 45, strokeWidth: 4, fontSize: 'text-2xl' },
    md: { width: 160, height: 160, radius: 60, strokeWidth: 5, fontSize: 'text-3xl' },
    lg: { width: 200, height: 200, radius: 75, strokeWidth: 6, fontSize: 'text-4xl' },
  };

  const config = sizes[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981'; // emerald-500
    if (score >= 70) return '#3b82f6'; // blue-500
    if (score >= 55) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return { text: 'Optimal', color: 'text-emerald-600' };
    if (score >= 70) return { text: 'Good', color: 'text-blue-600' };
    if (score >= 55) return { text: 'Fair', color: 'text-amber-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  const status = getScoreStatus(score);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={config.width} height={config.height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke={getScoreColor(score)}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 " + circumference }}
          animate={{ strokeDasharray: strokeDasharray }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="drop-shadow-lg"
        />
        
        {/* Glow effect */}
        <motion.circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke={getScoreColor(score)}
          strokeWidth={config.strokeWidth / 2}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 " + circumference }}
          animate={{ strokeDasharray: strokeDasharray }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="opacity-50 blur-sm"
        />
      </svg>
      
      {/* Score display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            className={`${config.fontSize} font-bold text-foreground`}
          >
            {score}
          </motion.div>
          <div className={`text-xs font-semibold ${status.color} bg-background/80 px-2 py-1 rounded-full`}>
            {status.text}
          </div>
          <div className="text-xs text-muted-foreground">
            Readiness
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${25 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-5, 5, -5],
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
  );
};

export default ReadinessRing;