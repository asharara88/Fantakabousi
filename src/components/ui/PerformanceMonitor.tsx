import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { performanceMonitor } from '../../lib/performanceMonitor';
import { memoryManager } from '../../lib/memoryManager';
import { performanceOptimizer } from '../../lib/performanceOptimizer';
import { 
  ChartBarIcon,
  CpuChipIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PerformanceMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [memoryStats, setMemoryStats] = useState<any>(null);
  const [performanceReport, setPerformanceReport] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const updateStats = () => {
        setMetrics(performanceMonitor.getMetrics('timing', 10));
        setMemoryStats(memoryManager.getMemoryStats());
        setPerformanceReport(performanceOptimizer.getPerformanceReport());
      };

      updateStats();
      const interval = setInterval(updateStats, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPerformanceStatus = (value: number, threshold: number) => {
    if (value <= threshold) return 'good';
    if (value <= threshold * 1.5) return 'warning';
    return 'critical';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Monitor</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time performance metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Memory Stats */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <CpuChipIcon className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Memory Usage</h3>
            </div>
            {memoryStats && (
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Used:</span>
                    <span>{formatBytes(memoryStats.usedJSHeapSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{formatBytes(memoryStats.totalJSHeapSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limit:</span>
                    <span>{formatBytes(memoryStats.jsHeapSizeLimit)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Usage</span>
                    <span>{memoryStats.usagePercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        memoryStats.usagePercentage > 80 ? 'bg-red-500' :
                        memoryStats.usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(memoryStats.usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => memoryManager.forceCleanup()}
                  className="w-full mt-3 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Force Cleanup
                </button>
              </div>
            )}
          </div>

          {/* Performance Report */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <ClockIcon className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Performance</h3>
            </div>
            {performanceReport && (
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bundle Size:</span>
                    <span className={
                      performanceReport.bundleSize > 1.5 * 1024 * 1024 ? 'text-red-500' : 'text-green-500'
                    }>
                      {formatBytes(performanceReport.bundleSize)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Component Render Times</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {Object.entries(performanceReport.renderTimes).map(([component, time]) => (
                      <div key={component} className="flex justify-between text-xs">
                        <span className="truncate">{component}</span>
                        <span className={
                          (time as number) > 16 ? 'text-red-500' : 'text-green-500'
                        }>
                          {(time as number).toFixed(1)}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {performanceReport.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center space-x-1">
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                      <span>Recommendations</span>
                    </h4>
                    <div className="space-y-1">
                      {performanceReport.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="text-xs text-yellow-700 dark:text-yellow-400">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Metrics */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <ChartBarIcon className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Recent Operations</h3>
            </div>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
              {metrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="truncate text-xs">{metric.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-mono text-xs ${
                      metric.value > 1000 ? 'text-red-500' :
                      metric.value > 500 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {metric.value.toFixed(0)}ms
                    </span>
                    {getPerformanceStatus(metric.value, 500) === 'good' ? (
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                    ) : getPerformanceStatus(metric.value, 500) === 'warning' ? (
                      <ExclamationTriangleIcon className="w-3 h-3 text-yellow-500" />
                    ) : (
                      <XCircleIcon className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => {
              performanceMonitor.clearMetrics();
              memoryManager.forceCleanup();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear Metrics
          </button>
          
          <button
            onClick={() => {
              const report = performanceOptimizer.getPerformanceReport();
              console.log('Performance Report:', report);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Export Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceMonitor;