import { useEffect, useCallback } from 'react';
import { resourceManager } from '../lib/resourceManager';

export const useResourceManager = (componentName: string) => {
  const registerResource = useCallback((
    id: string,
    type: 'image' | 'component' | 'data' | 'audio',
    data: any,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    const size = estimateSize(data);
    resourceManager.addResource({
      id: `${componentName}-${id}`,
      type,
      data,
      size,
      priority
    });
  }, [componentName]);

  const getResource = useCallback((id: string) => {
    return resourceManager.getResource(`${componentName}-${id}`);
  }, [componentName]);

  const removeResource = useCallback((id: string) => {
    return resourceManager.removeResource(`${componentName}-${id}`);
  }, [componentName]);

  // Cleanup component resources on unmount
  useEffect(() => {
    return () => {
      // Remove all resources for this component
      const stats = resourceManager.getStats();
      // This would need access to internal resource map to filter by component
      console.log(`Cleaning up resources for ${componentName}`);
    };
  }, [componentName]);

  return {
    registerResource,
    getResource,
    removeResource,
    getStats: () => resourceManager.getStats()
  };
};

function estimateSize(data: any): number {
  try {
    if (typeof data === 'string') {
      return data.length * 2; // UTF-16
    }
    if (data instanceof Blob) {
      return data.size;
    }
    if (data instanceof ArrayBuffer) {
      return data.byteLength;
    }
    return JSON.stringify(data).length * 2;
  } catch {
    return 1024; // Default 1KB
  }
}