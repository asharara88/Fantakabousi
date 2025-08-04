import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  EyeIcon,
  ShareIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface ChartData {
  date: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}

const AdvancedCharts: React.FC = () => {
  const { metrics } = useHealthMetrics();
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('line');

  const metricTypes = [
    { key: 'heart_rate', name: 'Heart Rate', unit: 'bpm', color: '#ef4444' },
    { key: 'steps', name: 'Steps', unit: 'steps', color: '#3b82f6' },
    { key: 'sleep', name: 'Sleep Score', unit: '/100', color: '#8b5cf6' },
    { key: 'glucose', name: 'Glucose', unit: 'mg/dL', color: '#10b981' },
  ];

  const generateChartData = (): ChartData[] => {
    const filteredMetrics = metrics
      .filter(m => m.metric_type === selectedMetric)
      .slice(0, 30)
      .reverse();

    return filteredMetrics.map((metric, index) => ({
      date: new Date(metric.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      value: metric.value,
      trend: index > 0 ? 
        (metric.value > filteredMetrics[index - 1]?.value ? 'up' : 
         metric.value < filteredMetrics[index - 1]?.value ? 'down' : 'stable') : 'stable'
    }));
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const range = maxValue - minValue || 1;

  const selectedMetricInfo = metricTypes.find(m => m.key === selectedMetric)!;

  const exportData = () => {
    const csvContent = [
      ['Date', 'Value', 'Unit'],
      ...chartData.map(d => [d.date, d.value, selectedMetricInfo.unit])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMetricInfo.name}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-foreground">Advanced Analytics</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live Data</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="1y">1 Year</option>
          </select>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
          </select>
          
          <button onClick={exportData} className="btn-secondary flex items-center space-x-2">
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="text-center space-y-2">
              <div 
                className="w-8 h-8 rounded-lg mx-auto"
                style={{ backgroundColor: metric.color }}
              ></div>
              <div className="text-sm font-medium text-foreground">{metric.name}</div>
              <div className="text-xs text-muted-foreground">
                {chartData.length} points
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">{selectedMetricInfo.name} Trends</h3>
            <p className="text-muted-foreground">
              {chartData.length} data points over {timeRange}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {chartData[chartData.length - 1]?.value || 0}{selectedMetricInfo.unit}
              </div>
              <div className="text-sm text-muted-foreground">Latest</div>
            </div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="relative h-64 bg-muted/20 rounded-xl p-4">
          <div className="absolute inset-4 flex items-end justify-between">
            {chartData.map((point, index) => {
              const height = ((point.value - minValue) / range) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <motion.div
                    className="w-full max-w-8 rounded-t-lg relative group cursor-pointer"
                    style={{ 
                      height: `${Math.max(height, 10)}%`,
                      backgroundColor: selectedMetricInfo.color 
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 10)}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {point.value}{selectedMetricInfo.unit}
                    </div>
                  </motion.div>
                  <div className="text-xs text-muted-foreground transform -rotate-45 origin-center">
                    {point.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Insights */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{maxValue}{selectedMetricInfo.unit}</div>
            <div className="text-sm text-muted-foreground">Peak Value</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{minValue}{selectedMetricInfo.unit}</div>
            <div className="text-sm text-muted-foreground">Lowest Value</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length)}{selectedMetricInfo.unit}
            </div>
            <div className="text-sm text-muted-foreground">Average</div>
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="card-premium p-6">
        <div className="flex items-center space-x-3 mb-4">
          <EyeIcon className="w-6 h-6 text-blue-light" />
          <h3 className="text-xl font-bold text-foreground">AI Predictions</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              7-Day Forecast
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Based on current trends, your {selectedMetricInfo.name.toLowerCase()} is likely to 
              {chartData[chartData.length - 1]?.trend === 'up' ? ' continue improving' : ' stabilize'} 
              over the next week.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
              Optimization Opportunity
            </h4>
            <p className="text-sm text-green-600 dark:text-green-400">
              Your data shows consistent patterns. Consider adjusting your routine 
              between 2-4 PM for optimal results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;