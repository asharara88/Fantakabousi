import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoonIcon, 
  BoltIcon, 
  HeartIcon, 
  FireIcon,
  ScaleIcon,
  ClockIcon,
  BeakerIcon,
  ChevronDownIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

const MetricsGrid: React.FC = () => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const metrics = [
    {
      id: 'sleep',
      label: 'Sleep',
      value: 68,
      unit: '/100',
      change: -3,
      icon: MoonIcon,
      color: 'var(--primary)',
      data: [72, 70, 69, 68, 67, 68, 68],
      target: 85,
      details: {
        deep: '45m',
        rem: '1h 20m',
        efficiency: '78%'
      }
    },
    {
      id: 'steps',
      label: 'Steps',
      value: 8234,
      unit: '',
      change: -12,
      icon: BoltIcon,
      color: 'var(--secondary)',
      data: [9200, 8800, 7900, 8500, 8100, 8400, 8234],
      target: 10000,
      details: {
        distance: '6.1km',
        active: '52min',
        calories: '312'
      }
    },
    {
      id: 'heart',
      label: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      change: 2,
      icon: HeartIcon,
      color: 'var(--error)',
      data: [70, 71, 73, 72, 74, 71, 72],
      target: 65,
      details: {
        max: '182',
        hrv: '28ms',
        zones: '4'
      }
    },
    {
      id: 'glucose',
      label: 'Glucose',
      value: 142,
      unit: 'mg/dL',
      change: 8,
      icon: BeakerIcon,
      color: 'var(--warning)',
      data: [138, 145, 140, 148, 142, 146, 142],
      target: 100,
      details: {
        fasting: '108',
        spikes: '8',
        range: '62%'
      }
    }
  ];

  const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end gap-1 h-8 w-16">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="w-1 rounded-sm opacity-60 last:opacity-100"
              style={{ 
                height: `${Math.max(height, 10)}%`,
                backgroundColor: color
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-auto grid-md">
      {metrics.map((metric, index) => {
        const isExpanded = expandedMetric === metric.id;
        const isPositive = metric.change >= 0;
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card cursor-pointer"
            onClick={() => setExpandedMetric(isExpanded ? null : metric.id)}
          >
            <div className="stack stack-md">
              {/* Header */}
              <div className="cluster justify-between">
                <div className="cluster cluster-sm">
                  <div 
                    className="avatar avatar-sm"
                    style={{ backgroundColor: metric.color }}
                  >
                    <metric.icon className="icon icon-sm" />
                  </div>
                  <span className="text-caption">{metric.label}</span>
                </div>
                
                <div className="cluster cluster-sm">
                  <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{metric.change}%
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="icon icon-sm" style={{ color: 'var(--text-tertiary)' }} />
                  </motion.div>
                </div>
              </div>

              {/* Value */}
              <div className="metric">
                <div className="metric-value">
                  {metric.value.toLocaleString()}{metric.unit}
                </div>
              </div>

              {/* Progress */}
              <div className="progress">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  style={{ backgroundColor: metric.color }}
                />
              </div>

              {/* Chart */}
              <div className="cluster justify-between items-end">
                <MiniChart data={metric.data} color={metric.color} />
                <span className="text-label">7D</span>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="stack stack-sm pt-4 border-t"
                    style={{ borderColor: 'var(--border-secondary)' }}
                  >
                    <div className="grid grid-3 gap-3">
                      {Object.entries(metric.details).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-body font-semibold">{value}</div>
                          <div className="text-label">{key}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;