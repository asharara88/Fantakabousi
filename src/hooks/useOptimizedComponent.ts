import { useState, useEffect, useRef } from 'react';
import { performanceMonitor } from '../lib/performanceMonitor';
import { errorHandler } from '../lib/errorHandler';

interface OptimizedComponentOptions {
  enablePerformanceTracking?: boolean;
  enableErrorBoundary?: boolean;
  enableMemoryCleanup?: boolean;
  componentName?: string;
}

export const useOptimizedComponent = (options: OptimizedComponentOptions = {}) => {
  const {
    enablePerformanceTracking = true,
    enableErrorBoundary = true,
    enableMemoryCleanup = true,
    componentName = 'UnknownComponent'
  } = options;

  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(0);
  const mountTime = useRef(Date.now());
  const cleanupTasks = useRef<(() => void)[]>([]);

  // Performance tracking
  useEffect(() => {
    if (enablePerformanceTracking) {
      const startTime = performance.now();
      setRenderCount(prev => prev + 1);

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        setLastRenderTime(renderTime);
        
        performanceMonitor.measureComponentRender(componentName, () => renderTime);
        
        // Warn about slow renders
        if (renderTime > 100) {
          console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      };
    }
  });

  // Memory cleanup
  useEffect(() => {
    if (enableMemoryCleanup) {
      return () => {
        // Execute all cleanup tasks
        cleanupTasks.current.forEach(cleanup => {
          try {
            cleanup();
          } catch (error) {
            console.error('Cleanup task failed:', error);
          }
        });
        cleanupTasks.current = [];
      };
    }
  }, [enableMemoryCleanup]);

  // Error boundary hook
  const captureError = (error: Error, errorInfo?: any) => {
    if (enableErrorBoundary) {
      errorHandler.handleError(error, {
        component: componentName,
        action: 'component_error',
        metadata: {
          renderCount,
          lastRenderTime,
          mountTime: Date.now() - mountTime.current,
          errorInfo
        }
      });
    }
  };

  // Register cleanup task
  const registerCleanup = (cleanup: () => void) => {
    cleanupTasks.current.push(cleanup);
  };

  // Get component stats
  const getStats = () => ({
    componentName,
    renderCount,
    lastRenderTime,
    mountTime: Date.now() - mountTime.current,
    cleanupTasksCount: cleanupTasks.current.length
  });

  return {
    renderCount,
    lastRenderTime,
    captureError,
    registerCleanup,
    getStats
  };
};

export default useOptimizedComponent;