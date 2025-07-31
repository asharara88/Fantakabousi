import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import FoodLogger from '../nutrition/FoodLogger';
import RecipeSearch from '../recipes/RecipeSearch';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  HeartIcon,
  BoltIcon,
  MoonIcon,
  FireIcon,
  BeakerIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const HealthDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('metrics');
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [timeRange, setTimeRange] = useState('7d');
  
  const { metrics, loading, getLatestMetric, getMetricTrend } = useHealthMetrics();

  const metricTypes = [
    { 
      key: 'heart_rate', 
      name: 'Heart Rate', 
      unit: 'bpm', 
      icon: HeartIcon,
      color: 'from-blue-light to-blue-medium',
      target: 65
    },
    { 
      key: 'steps', 
      name: 'Steps', 
      unit: 'steps', 
      icon: BoltIcon,
      color: 'from-blue-medium to-blue-deep',
      target: 10000
    },
    { 
      key: 'sleep', 
      name: 'Sleep Score', 
      unit: '/100', 
      icon: MoonIcon,
      color: 'from-blue-deep to-blue-light',
      target: 85
    },
    { 
      key: 'glucose', 
      name: 'Glucose', 
      unit: 'mg/dL', 
      icon: BeakerIcon,
      color: 'from-neon-green to-blue-light',
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

  const renderMetricsView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 bg-card rounded-xl">
          <LoadingSpinner size="xl" />
        </div>
      );
    }

    return (
      <>
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricTypes.map((metric, index) => {
            const latestMetric = getLatestMetric(metric.key);
            const trend = getMetricTrend(metric.key);
            const value = latestMetric?.value || 0;
            
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedMetric(metric.key)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      trend >= 0 ? 'text-neon-green' : 'text-red-500'
                    }`}>
                      {trend >= 0 ? (
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                      )}
                      <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-foreground">
                        {value.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {metric.unit}
                      </span>
                    </div>
                    <div className="text-base font-medium text-foreground">
                      {metric.name}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Target: {metric.target.toLocaleString()}{metric.unit}</span>
                      <span>{Math.round((value / metric.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((value / metric.target) * 100, 100)}%` }}
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
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Health Trends</h2>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
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
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMetric === metric.key 
                    ? 'border-blue-light bg-blue-light/10' 
                    : 'border-border hover:border-blue-light/50'
                }`}
              >
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedMetric === metric.key ? 'text-blue-light' : 'text-muted-foreground'
                }`} />
                <div className="text-sm font-medium text-foreground">{metric.name}</div>
              </button>
            ))}
          </div>
          
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl">
            <div className="text-center space-y-3">
              <ChartBarIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="text-muted-foreground">
                Chart visualization for {metricTypes.find(m => m.key === selectedMetric)?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {metrics.length} data points available
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {metrics.slice(0, 4).map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-light to-blue-medium rounded-lg flex items-center justify-center">
                    <BeakerIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground capitalize">
                      {metric.metric_type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(metric.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground">
                    {metric.value} {metric.unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-light to-blue-medium rounded-xl flex items-center justify-center shadow-lg">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
              <p className="text-muted-foreground">Track your health metrics in real-time</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-xl p-1 bg-muted">
            <button
              onClick={() => setActiveView('metrics')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'metrics'
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setActiveView('food')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'food'
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Food Log
            </button>
            <button
              onClick={() => setActiveView('recipes')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'recipes'
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
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