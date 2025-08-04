// Bundle size monitoring and optimization utilities
export class BundleOptimizer {
  private static loadedChunks = new Set<string>();
  private static chunkSizes = new Map<string, number>();

  static trackChunkLoad(chunkName: string, size: number): void {
    this.loadedChunks.add(chunkName);
    this.chunkSizes.set(chunkName, size);
    
    console.log(`Chunk loaded: ${chunkName} (${(size / 1024).toFixed(2)}KB)`);
    
    // Alert if chunk is too large
    if (size > 500 * 1024) { // 500KB
      console.warn(`Large chunk detected: ${chunkName} is ${(size / 1024 / 1024).toFixed(2)}MB`);
    }
  }

  static getTotalBundleSize(): number {
    return Array.from(this.chunkSizes.values()).reduce((total, size) => total + size, 0);
  }

  static getLoadedChunks(): string[] {
    return Array.from(this.loadedChunks);
  }

  static preloadCriticalChunks(): void {
    // Preload chunks that are likely to be needed soon
    const criticalChunks = [
      () => import('../components/dashboard/HealthMetrics'),
      () => import('../components/dashboard/AIInsights'),
    ];

    criticalChunks.forEach((importFn, index) => {
      setTimeout(() => {
        importFn().catch(error => {
          console.warn('Failed to preload chunk:', error);
        });
      }, index * 100); // Stagger preloading
    });
  }
}

// Lazy loading with performance tracking
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) => {
  return React.lazy(async () => {
    const startTime = performance.now();
    
    try {
      const module = await importFn();
      const endTime = performance.now();
      
      BundleOptimizer.trackChunkLoad(componentName, 0); // Size would be tracked by bundler
      
      console.log(`Component ${componentName} loaded in ${(endTime - startTime).toFixed(2)}ms`);
      
      return module;
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      throw error;
    }
  });
};

// Image optimization utilities
export const optimizeImage = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
} = {}): string => {
  // In a real implementation, this would use a service like Cloudinary
  // For now, return the original src
  return src;
};

// Preload critical resources
export const preloadCriticalResources = (): void => {
  const criticalResources = [
    '/fonts/inter-regular.woff2',
    // Add other critical resources
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.includes('.woff') ? 'font' : 'fetch';
    if (resource.includes('.woff')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};