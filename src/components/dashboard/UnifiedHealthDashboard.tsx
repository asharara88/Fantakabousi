import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import FoodLogger from '../nutrition/FoodLogger';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  HeartIcon,
  BoltIcon,
  MoonIcon,
  BeakerIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  WifiIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CameraIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const UnifiedHealthDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'nutrition'>('overview');
  const { metrics, loading, getLatestMetric, getMetricTrend } = useHealthMetrics();

  const metricTypes = [
    { 
      key: 'heart_rate', 
      name: 'Heart Rate', 
      unit: 'bpm', 
      icon: HeartIcon,
      color: 'from-red-500 to-rose-600',
      target: 65,
      deviceType: 'Apple Watch'
    },
    { 
      key: 'steps', 
      name: 'Daily Steps', 
      unit: 'steps', 
      icon: BoltIcon,
      color: 'from-blue-500 to-cyan-600',
      target: 10000,
      deviceType: 'Fitness Tracker'
    },
    { 
      key: 'sleep', 
      name: 'Sleep Score', 
      unit: '/100', 
      icon: MoonIcon,
      color: 'from-indigo-500 to-purple-600',
      target: 85,
      deviceType: 'Sleep Tracker'
    },
    { 
      key: 'glucose', 
      name: 'Glucose', 
      unit: 'mg/dL', 
      icon: BeakerIcon,
      color: 'from-green-500 to-emerald-600',
      target: 100,
      deviceType: 'CGM'
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'metrics', label: 'Metrics', icon: HeartIcon },
    { id: 'nutrition', label: 'Nutrition', icon: BeakerIcon },
  ];

  const ConnectDeviceCard: React.FC<{ metric: any }> = ({ metric }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300 text-center">
      <div className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mx-auto mb-4 opacity-50`}>
        <metric.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.name}</h3>
      <p className="text-sm text-gray-600 mb-4">Connect your {metric.deviceType} to track this metric</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
      >
        <PlusIcon className="w-4 h-4" />
        <span>Connect Device</span>
      </motion.button>
    </div>
  );

  const MetricCard: React.FC<{ metric: any; value: number; trend: number }> = ({ metric, value, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
          <metric.icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-semibold ${
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend >= 0 ? (
            <ArrowTrendingUpIcon className="w-4 h-4" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4" />
          )}
          <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">{metric.unit}</span>
        </div>
        <div className="text-base font-semibold text-gray-900">{metric.name}</div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Target: {metric.target.toLocaleString()}{metric.unit}</span>
            <span>{Math.round((value / metric.target) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((value / metric.target) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Today's Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Wellness Score</h2>
              <p className="text-lg text-gray-600">Based on your latest health data</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                72
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  Good Progress
                </div>
                <div className="text-xs text-gray-500">Updated 5 minutes ago</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 283" }}
                  animate={{ strokeDasharray: "203 283" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">72</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Heart Rate', value: '68 bpm', icon: HeartIcon, color: 'from-red-500 to-pink-600' },
          { label: 'Steps', value: '8,234', icon: BoltIcon, color: 'from-blue-500 to-cyan-600' },
          { label: 'Sleep', value: '7h 23m', icon: MoonIcon, color: 'from-indigo-500 to-purple-600' },
          { label: 'Glucose', value: '142 mg/dL', icon: BeakerIcon, color: 'from-green-500 to-emerald-600' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Goals */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Goals</h3>
        <div className="space-y-3">
          {[
            { task: 'Complete morning workout', completed: true },
            { task: 'Log breakfast nutrition', completed: false },
            { task: 'Take evening supplements', completed: false },
          ].map((goal, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-5 h-5 rounded-full border-2 ${
                goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}>
                {goal.completed && <CheckCircleIcon className="w-5 h-5 text-white" />}
              </div>
              <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {goal.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricTypes.map((metric, index) => {
          const latestMetric = getLatestMetric(metric.key);
          const trend = getMetricTrend(metric.key);
          const value = latestMetric?.value || 0;
          
          if (value === 0) {
            return <ConnectDeviceCard key={metric.key} metric={metric} />;
          }
          
          return <MetricCard key={metric.key} metric={metric} value={value} trend={trend} />;
        })}
      </div>

      {/* Detailed Chart Section */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Health Trends</h2>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center space-y-3">
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto" />
            <div className="text-gray-600 text-lg font-medium">Health Trends Visualization</div>
            <div className="text-sm text-gray-500">{metrics.length} data points available</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-6">
      <FoodLogger />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Health Dashboard</h1>
          <p className="text-xl text-gray-600">Track your wellness journey in real-time</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'metrics' && renderMetrics()}
          {activeTab === 'nutrition' && renderNutrition()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UnifiedHealthDashboard;