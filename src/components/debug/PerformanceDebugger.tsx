import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { performanceMonitor } from '../../lib/performanceMonitor';
import { memoryManager } from '../../lib/memoryManager';
import { cacheManager } from '../../lib/cacheManager';
import { 
  ChartBarIcon,
  CpuChipIcon,
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface PerformanceDebuggerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerformanceDebugger: React.FC<PerformanceDebuggerProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [memoryStats, setMemoryStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMetrics(performanceMonitor.getMetrics('timing', 10));
        setMemoryStats(memoryManager.getMemoryStats());
        setCacheStats(cacheManager.getStats());
      }, 1000);

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Debugger</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
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
              <div className="space-y-2 text-sm">
                <div>Used: {formatBytes(memoryStats.usedJSHeapSize)}</div>
                <div>Total: {formatBytes(memoryStats.totalJSHeapSize)}</div>
                <div>Limit: {formatBytes(memoryStats.jsHeapSizeLimit)}</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        memoryStats.usagePercentage > 80 ? 'bg-red-500' :
                        memoryStats.usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(memoryStats.usagePercentage, 100)}%` }}
                    />
                  </div>
                  <span>{memoryStats.usagePercentage.toFixed(1)}%</span>
                </div>
                <button
                  onClick={() => memoryManager.forceCleanup()}
                  className="w-full mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
                >
                  Force Cleanup
                </button>
              </div>
            )}
          </div>

          {/* Cache Stats */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <ChartBarIcon className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Cache Stats</h3>
            </div>
            {cacheStats && (
              <div className="space-y-2 text-sm">
                <div>Items: {cacheStats.size}</div>
                <div>Memory: {formatBytes(cacheStats.memoryUsage)}</div>
                <div>Hit Rate: {cacheStats.hitRate.toFixed(2)}</div>
                <div>Oldest: {(cacheStats.oldestItem / 1000 / 60).toFixed(1)}m</div>
                <button
                  onClick={() => cacheManager.clear()}
                  className="w-full mt-2 px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600"
                >
                  Clear Cache
                </button>
              </div>
            )}
          </div>

          {/* Recent Metrics */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <ClockIcon className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Recent Metrics</h3>
            </div>
            <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {metrics.map((metric, index) => (
                <div key={index} className="flex justify-between">
                  <span className="truncate">{metric.name}</span>
                  <span className={`font-mono ${
                    metric.value > 1000 ? 'text-red-500' :
                    metric.value > 500 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {metric.value.toFixed(0)}ms
                  </span>
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
              cacheManager.clear();
              memoryManager.forceCleanup();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceDebugger;