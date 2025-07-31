import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon,
  BoltIcon,
  MoonIcon,
  BeakerIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ComponentType<{ className?: string }>;
  target: number;
}

const HealthSummary: React.FC = () => {
  const metrics: HealthMetric[] = [
    {
      name: 'Resting Heart Rate',
      value: 68,
      unit: 'bpm',
      change: -3,
      status: 'good',
      icon: HeartIcon,
      target: 65
    },
    {
      name: 'Daily Steps',
      value: 8234,
      unit: 'steps',
      change: -12,
      status: 'warning',
      icon: BoltIcon,
      target: 10000
    },
    {
      name: 'Sleep Quality',
      value: 68,
      unit: '/100',
      change: -5,
      status: 'warning',
      icon: MoonIcon,
      target: 85
    },
    {
      name: 'Avg Glucose',
      value: 142,
      unit: 'mg/dL',
      change: 8,
      status: 'critical',
      icon: BeakerIcon,
      target: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Optimal';
      case 'warning': return 'Needs Attention';
      case 'critical': return 'Action Required';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Health Summary</h2>
          <p className="text-sm text-gray-600">Key metrics overview</p>
        </div>
        
        <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
          View Trends
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <metric.icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{metric.name}</span>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                {getStatusText(metric.status)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600 ml-1">
                    {metric.unit}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Target: {metric.target.toLocaleString()}{metric.unit}
                </div>
              </div>
              
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change >= 0 ? (
                  <TrendingUpIcon className="w-4 h-4" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4" />
                )}
                <span>{metric.change >= 0 ? '+' : ''}{metric.change}%</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HealthSummary;