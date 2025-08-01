import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cacheManager } from '../../lib/performance';
import { offlineStorage } from '../../lib/offline';
import { 
  TrashIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const MemoryOptimizer: React.FC = () => {
  const [memoryStats, setMemoryStats] = useState({
    cacheSize: 0,
    storageSize: 0,
    totalMemory: 0
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  const updateStats = () => {
    const cacheSize = cacheManager.getSize();
    const storageSize = offlineStorage.getStorageSize();
    const totalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    setMemoryStats({ cacheSize, storageSize, totalMemory });
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const optimizeMemory = async () => {
    setIsOptimizing(true);
    
    try {
      // Clear expired cache
      cacheManager.clearExpired();
      
      // Optimize cache
      cacheManager.optimize();
      
      // Clear old offline data
      if (memoryStats.storageSize > 500000) { // If over 500KB
        offlineStorage.clear();
      }
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      // Update stats
      setTimeout(() => {
        updateStats();
        setIsOptimizing(false);
      }, 1000);
      
    } catch (error) {
      console.error('Memory optimization failed:', error);
      setIsOptimizing(false);
    }
  };

  const getMemoryStatus = () => {
    const totalSize = memoryStats.cacheSize + memoryStats.storageSize;
    if (totalSize > 2000000) return { color: 'text-red-500', status: 'High' };
    if (totalSize > 1000000) return { color: 'text-yellow-500', status: 'Medium' };
    return { color: 'text-green-500', status: 'Good' };
  };

  const status = getMemoryStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl p-4 shadow-lg max-w-sm"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Memory Usage</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              status.color === 'text-red-500' ? 'bg-red-100 text-red-700' :
              status.color === 'text-yellow-500' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {status.status}
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Cache:</span>
              <span>{formatBytes(memoryStats.cacheSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>Storage:</span>
              <span>{formatBytes(memoryStats.storageSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>Heap:</span>
              <span>{formatBytes(memoryStats.totalMemory)}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={optimizeMemory}
            disabled={isOptimizing}
            className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                <span>Optimize Memory</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MemoryOptimizer;