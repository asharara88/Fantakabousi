import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import FoodLogger from '../nutrition/FoodLogger';
import RecipeSearch from '../recipes/RecipeSearch';
import { 
  HeartIcon,
  BoltIcon,
  MoonIcon,
  FireIcon,
  ScaleIcon,
  BeakerIcon,
  ChartBarIcon,
  PlusIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const HealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [timeRange, setTimeRange] = useState('7d');
  const [activeView, setActiveView] = useState('metrics');

  const metricTypes = [
    { 
      key: 'heart_rate', 
      name: 'Heart Rate', 
      unit: 'bpm', 
      icon: HeartIcon,
      color: 'from-red-500 to-rose-600',
      value: 68,
      change: -3,
      target: 65
    },
    { 
      key: 'steps', 
      name: 'Steps', 
      unit: 'steps', 
      icon: BoltIcon,
      color: 'from-blue-500 to-cyan-600',
      value: 8234,
      change: -12,
      target: 10000
    },
    { 
      key: 'sleep', 
      name: 'Sleep Score', 
      unit: '/100', 
      icon: MoonIcon,
      color: 'from-indigo-500 to-purple-600',
      value: 68,
      change: -5,
      target: 85
    },
    { 
      key: 'glucose', 
      name: 'Glucose', 
      unit: 'mg/dL', 
      icon: BeakerIcon,
      color: 'from-green-500 to-emerald-600',
      value: 142,
      change: 8,
      target: 100
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'food':
        return <FoodLogger />;
      case 'recipes':
        return <RecipeSearch />;
      default:
        return renderMetricsView();
    }
  };

  const renderMetricsView = () => (
    <>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricTypes.map((metric, index) => {
          const isPositive = metric.change >= 0;
          
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMetric(metric.key)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    <span>{isPositive ? '+' : ''}{metric.change}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.value.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="text-base font-medium text-gray-900">
                    {metric.name}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Target: {metric.target.toLocaleString()}{metric.unit}</span>
                    <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Health Trends</h2>
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metricTypes.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                selectedMetric === metric.key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <metric.icon className={`w-6 h-6 mx-auto mb-2 ${
                selectedMetric === metric.key ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <div className="text-sm font-medium text-gray-900">{metric.name}</div>
            </button>
          ))}
        </div>
        
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center space-y-3">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <div className="text-gray-600">
              Chart visualization for {metricTypes.find(m => m.key === selectedMetric)?.name}
            </div>
            <div className="text-sm text-gray-500">
              Historical data will be displayed here
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { type: 'Heart Rate', value: '68 bpm', time: '30m ago', icon: HeartIcon, color: 'bg-red-500' },
            { type: 'Steps', value: '8,234', time: '1h ago', icon: BoltIcon, color: 'bg-blue-500' },
            { type: 'Sleep', value: '7h 23m', time: '8h ago', icon: MoonIcon, color: 'bg-indigo-500' },
            { type: 'Glucose', value: '142 mg/dL', time: '2h ago', icon: BeakerIcon, color: 'bg-green-500' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{activity.type}</div>
                  <div className="text-sm text-gray-600">{activity.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{activity.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
              <p className="text-gray-600">Track your health metrics in real-time</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-xl p-1 bg-gray-100">
            <button
              onClick={() => setActiveView('metrics')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'metrics'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setActiveView('food')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'food'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Food Log
            </button>
            <button
              onClick={() => setActiveView('recipes')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'recipes'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recipes
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default HealthDashboard;