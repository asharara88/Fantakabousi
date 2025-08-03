import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import FoodLogger from '../nutrition/FoodLogger';
import RecipeSearch from '../recipes/RecipeSearch';
import AdvancedCharts from '../health/AdvancedCharts';
import RealDeviceIntegration from '../devices/RealDeviceIntegration';
import DeviceConnection from '../devices/DeviceConnection';
import HealthMetricsTable from '../health/HealthMetricsTable';
import FoodLogsTable from '../nutrition/FoodLogsTable';
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
  CameraIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const HealthDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('metrics');
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [timeRange, setTimeRange] = useState('7d');
  const [showDeviceConnection, setShowDeviceConnection] = useState(false);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  
  const { metrics, loading, getLatestMetric, getMetricTrend } = useHealthMetrics();

  const metricTypes = [
    { 
      key: 'heart_rate', 
      name: 'Heart Rate', 
      unit: 'bpm', 
      icon: HeartIcon,
      color: 'bg-gradient-blue-light',
      target: 65,
      deviceType: 'Apple Watch'
    },
    { 
      key: 'steps', 
      name: 'Steps', 
      unit: 'steps', 
      icon: BoltIcon,
      color: 'bg-gradient-blue-medium',
      target: 10000,
      deviceType: 'Fitness Tracker'
    },
    { 
      key: 'sleep', 
      name: 'Sleep Score', 
      unit: '/100', 
      icon: MoonIcon,
      color: 'bg-gradient-blue-deep',
      target: 85,
      deviceType: 'Sleep Tracker'
    },
    { 
      key: 'glucose', 
      name: 'Glucose', 
      unit: 'mg/dL', 
      icon: BeakerIcon,
      color: 'bg-accent-neon',
      target: 100,
      deviceType: 'CGM'
    },
  ];

  const tabs = [
    { id: 'metrics', label: 'Health Metrics', icon: HeartIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'data', label: 'Data Tables', icon: ChartBarIcon },
    { id: 'devices', label: 'Devices', icon: WifiIcon },
    { id: 'food', label: 'Food Logging', icon: BeakerIcon },
    { id: 'recipes', label: 'Find Recipes', icon: MagnifyingGlassIcon },
  ];

  const ConnectDeviceCard: React.FC<{ metric: any }> = ({ metric }) => (
    <div className="card text-center border-2 border-dashed border-border">
      <div className={`w-16 h-16 ${metric.color} rounded-xl flex items-center justify-center mx-auto mb-4 opacity-50`}>
        <metric.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-heading-md text-foreground mb-2">{metric.name}</h3>
      <p className="text-body-sm text-muted-foreground mb-4">Connect your {metric.deviceType} to track this metric</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDeviceConnection(true)}
        className="btn-primary cursor-pointer mx-auto"
      >
        <PlusIcon className="w-4 h-4" />
        <span>Connect Device</span>
      </motion.button>
    </div>
  );

  const MetricCard: React.FC<{ metric: any; value: number; trend: number }> = ({ metric, value, trend }) => {
    const isExpanded = expandedMetric === metric.key;
    
    const getExpandedData = (metricKey: string) => {
      switch (metricKey) {
        case 'heart_rate':
          return [
            { label: 'Resting HR', value: '68 bpm' },
            { label: 'Max HR Today', value: '142 bpm' },
            { label: 'HR Variability', value: '42 ms' },
            { label: 'Recovery Time', value: '2h 15m' }
          ];
        case 'steps':
          return [
            { label: 'Distance', value: '6.2 km' },
            { label: 'Flights Climbed', value: '12 flights' },
            { label: 'Avg Pace', value: '8:45 /km' },
            { label: 'Active Calories', value: '342 kcal' }
          ];
        case 'sleep':
          return [
            { label: 'Deep Sleep', value: '1h 45m' },
            { label: 'REM Sleep', value: '2h 12m' },
            { label: 'Sleep Efficiency', value: '89%' },
            { label: 'Bedtime', value: '10:45 PM' }
          ];
        case 'glucose':
          return [
            { label: 'Time in Range', value: '78%' },
            { label: 'Avg Glucose', value: '142 mg/dL' },
            { label: 'Peak Today', value: '186 mg/dL' },
            { label: 'Variability', value: 'Moderate' }
          ];
        default:
          return [];
      }
    };

    return (
    <div 
      className={`bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isExpanded ? 'md:col-span-2' : ''
      }`}
      onClick={() => setExpandedMetric(isExpanded ? null : metric.key)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
          <metric.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-2">
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
          <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-heading-2xl font-bold text-foreground">
            {value.toLocaleString()}
          </span>
          <span className="text-body-sm text-muted-foreground">{metric.unit}</span>
        </div>
        <div className="text-body font-semibold text-foreground">{metric.name}</div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-caption">
            <span>Target: {metric.target.toLocaleString()}{metric.unit}</span>
            <span>{Math.round((value / metric.target) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((value / metric.target) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border pt-4 mt-4"
          >
            <div className="grid grid-cols-2 gap-3">
              {getExpandedData(metric.key).map((item, idx) => (
                <div key={idx} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm font-bold text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  )};

  const renderContent = () => {
    switch (activeView) {
      case 'analytics':
        return <AdvancedCharts />;
      case 'data':
        return (
          <div className="space-y-8">
            <HealthMetricsTable />
            <FoodLogsTable />
          </div>
        );
      case 'devices':
        return <RealDeviceIntegration />;
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
        <div className="flex items-center justify-center h-64 card">
          <LoadingSpinner size="xl" />
        </div>
      );
    }

    return (
      <div className="space-y-6 lg:space-y-8">
        {/* Metrics Grid */}
        <div className="mobile-grid-2 lg:grid-cols-4">
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

        {/* Chart Section */}
        <div className="card-premium">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <h2 className="text-heading-xl text-foreground">Health Trends</h2>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input cursor-pointer"
              >
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
              </select>
            </div>
          </div>
          
          <div className="mobile-grid-2 lg:grid-cols-4 mb-6">
            {metricTypes.map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`card text-center transition-all duration-200 cursor-pointer touch-target ${
                  selectedMetric === metric.key 
                    ? 'border-[#48C6FF] bg-[#48C6FF]/10' 
                    : ''
                }`}
              >
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedMetric === metric.key ? 'text-blue-light' : 'text-muted-foreground'
                }`} />
                <div className="text-body-sm font-medium text-foreground">{metric.name}</div>
              </button>
            ))}
          </div>
          
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl">
            <div className="text-center space-y-3">
              <ChartBarIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="text-muted-foreground text-body">
                Chart visualization for {metricTypes.find(m => m.key === selectedMetric)?.name}
              </div>
              <div className="text-caption">
                {metrics.length} data points available
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-premium">
          <h2 className="text-heading-xl text-foreground mb-6">Recent Activity</h2>
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
                  <div className="w-10 h-10 bg-gradient-blue-light rounded-lg flex items-center justify-center">
                    <BeakerIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-body font-medium text-foreground capitalize">
                      {metric.metric_type.replace('_', ' ')}
                    </div>
                    <div className="text-body-sm text-muted-foreground">
                      {new Date(metric.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-body font-bold text-foreground">
                    {metric.value} {metric.unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-20 rounded-t-2xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Health Analytics</h1>
              <p className="text-gray-600 dark:text-gray-300">Deep dive into your health data and trends</p>
            </div>
          </div>
          {/* View Toggle */}
          <div className="flex rounded-xl p-1 bg-gray-100 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex-1 px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowDeviceConnection(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
          >
            <WifiIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Connect Device</span>
            <span className="sm:hidden">Connect</span>
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

      {/* Device Connection Modal */}
      <DeviceConnection 
        isOpen={showDeviceConnection}
        onClose={() => setShowDeviceConnection(false)}
      />
    </div>
  );
};

export default HealthDashboard;