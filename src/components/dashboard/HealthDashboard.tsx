import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateHealthInsights } from '../../lib/api';
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
  TrendingUpIcon
} from '@heroicons/react/24/outline';

interface HealthMetric {
  id: string;
  metric_type: string;
  value: number;
  unit: string;
  timestamp: string;
  source: string;
}

const HealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [timeRange, setTimeRange] = useState('7d');
  const [activeView, setActiveView] = useState('metrics');

  useEffect(() => {
    fetchHealthMetrics();
    loadHealthInsights();
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMetric = async (type: string, value: number, unit: string) => {
    try {
      const { error } = await supabase
        .from('health_metrics')
        .insert({
          user_id: user?.id,
          metric_type: type,
          value,
          unit,
          source: 'manual',
        });

      if (error) throw error;
      fetchHealthMetrics();
    } catch (error) {
      console.error('Error adding metric:', error);
    }
  };

  const loadHealthInsights = async () => {
    try {
      const insights = await generateHealthInsights(user?.id || '');
      console.log('Health insights:', insights);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const metricTypes = [
    { 
      key: 'heart_rate', 
      name: 'Heart Rate', 
      unit: 'bpm', 
      icon: HeartIcon,
      color: 'from-red-500 to-rose-600',
      target: 65
    },
    { 
      key: 'steps', 
      name: 'Steps', 
      unit: 'steps', 
      icon: BoltIcon,
      color: 'from-blue-500 to-cyan-600',
      target: 10000
    },
    { 
      key: 'sleep', 
      name: 'Sleep Score', 
      unit: '/100', 
      icon: MoonIcon,
      color: 'from-indigo-500 to-purple-600',
      target: 85
    },
    { 
      key: 'glucose', 
      name: 'Glucose', 
      unit: 'mg/dL', 
      icon: BeakerIcon,
      color: 'from-green-500 to-emerald-600',
      target: 95
    },
  ];

  const getLatestValue = (type: string) => {
    const latest = metrics.find(m => m.metric_type === type);
    return latest?.value || 0;
  };

  const getMetricTrend = (type: string) => {
    const typeMetrics = metrics.filter(m => m.metric_type === type).slice(0, 7);
    if (typeMetrics.length < 2) return 0;
    
    const latest = typeMetrics[0].value;
    const previous = typeMetrics[typeMetrics.length - 1].value;
    return ((latest - previous) / previous) * 100;
  };

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
      <div className="grid-premium grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {metricTypes.map((metric, index) => {
          const latestValue = getLatestValue(metric.key);
          const trend = getMetricTrend(metric.key);
          
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="metric-card group cursor-pointer"
              onClick={() => setSelectedMetric(metric.key)}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`status-indicator ${trend >= 0 ? 'status-success' : 'status-warning'}`}>
                    {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-heading-lg font-bold text-foreground">
                      {latestValue.toLocaleString()}
                    </span>
                    <span className="text-caption">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="text-body font-semibold text-foreground">
                    {metric.name}
                  </div>
                </div>
                
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((latestValue / metric.target) * 100, 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    style={{
                      background: `linear-gradient(90deg, ${metric.color.split(' ')[1]}, ${metric.color.split(' ')[3]})`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="card-premium p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-lg text-foreground">Trends</h2>
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-premium"
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
              className={`card-premium p-4 text-center transition-all duration-200 ${
                selectedMetric === metric.key 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-muted/30'
              }`}
            >
              <metric.icon className={`w-6 h-6 mx-auto mb-2 ${
                selectedMetric === metric.key ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <div className="text-body font-medium text-foreground">{metric.name}</div>
            </button>
          ))}
        </div>
        
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl">
          <div className="text-center space-y-3">
            <ChartBarIcon className="w-12 h-12 text-muted-foreground mx-auto" />
            <div className="text-body text-muted-foreground">
              Chart visualization for {metricTypes.find(m => m.key === selectedMetric)?.name}
            </div>
            <div className="text-caption">
              {metrics.filter(m => m.metric_type === selectedMetric).length} data points
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-premium p-8">
        <h2 className="text-heading-lg text-foreground mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {metrics.slice(0, 5).map((metric, index) => {
            const metricType = metricTypes.find(m => m.key === metric.metric_type);
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-muted/20 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  {metricType && (
                    <div className={`w-10 h-10 bg-gradient-to-br ${metricType.color} rounded-lg flex items-center justify-center`}>
                      <metricType.icon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="text-body font-medium text-foreground">
                      {metricType?.name || metric.metric_type}
                    </div>
                    <div className="text-caption">
                      {new Date(metric.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-body font-bold text-foreground">
                    {metric.value} {metric.unit}
                  </div>
                  <div className="text-caption">
                    {metric.source}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" variant="premium" />
      </div>
    );
  }

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
              <h1 className="text-heading-xl text-foreground">Health Dashboard</h1>
              <p className="text-caption">Real-time biometric monitoring</p>
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
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setActiveView('food')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'food'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Food Log
            </button>
            <button
              onClick={() => setActiveView('recipes')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'recipes'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Recipes
            </button>
          </div>
          
          <button 
            onClick={() => {
              const type = prompt('Metric type (heart_rate, steps, sleep, glucose):');
              const value = prompt('Value:');
              const unit = prompt('Unit:');
              if (type && value && unit) {
                addMetric(type, parseFloat(value), unit);
              }
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Metric</span>
          </button>
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