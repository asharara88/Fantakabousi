import { useEffect, useRef, useState } from 'react';
import { performanceMonitor } from '../lib/performanceMonitor';
import { memoryManager } from '../lib/memoryManager';

export const usePerformance = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - renderStartTime.current;
      setRenderTime(duration);
      
      performanceMonitor.measureComponentRender(componentName, () => duration);
    };
  });

  return { renderTime };
};

export const useMemoryMonitor = () => {
  const [memoryStats, setMemoryStats] = useState(memoryManager.getMemoryStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryStats(memoryManager.getMemoryStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryStats;
};

export const useAsyncPerformance = () => {
  const measureAsync = <T>(name: string, operation: () => Promise<T>) => {
    return performanceMonitor.measureAsyncOperation(name, operation);
  };

  return { measureAsync };
};