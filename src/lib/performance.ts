// Performance Optimization Utilities for Biowell

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
}

// Performance monitoring
export const performanceMonitor = {
  startTime: Date.now(),
  
  // Measure component render time
  measureRender: (componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
  },

  // Track memory usage
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  },

  // Monitor network requests
  trackNetworkRequest: (url: string, method: string) => {
    console.log(`Network request: ${method} ${url}`);
  },

  // Get performance metrics
  getMetrics: (): PerformanceMetrics => {
    return {
      loadTime: Date.now() - performanceMonitor.startTime,
      renderTime: 0,
      memoryUsage: performanceMonitor.getMemoryUsage(),
      networkRequests: 0,
    };
  }
};

// Image optimization
export const optimizeImage = (src: string, width?: number, quality = 80) => {
  if (!src) return '';
  
  // For Pexels images, add optimization parameters
  if (src.includes('pexels.com')) {
    const url = new URL(src);
    if (width) url.searchParams.set('w', width.toString());
    url.searchParams.set('auto', 'compress');
    return url.toString();
  }
  
  return src;
};

// Lazy loading utility
export const useLazyLoading = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  return observer;
};

// Bundle size optimization
export const loadComponentLazily = async (componentPath: string) => {
  try {
    const module = await import(componentPath);
    return module.default;
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return null;
  }
};

// Cache management
export const cacheManager = {
  set: (key: string, data: any, ttl = 3600000) => { // 1 hour default
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`biowell_${key}`, JSON.stringify(item));
  },

  get: (key: string) => {
    try {
      const item = localStorage.getItem(`biowell_${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`biowell_${key}`);
        return null;
      }
      
      return parsed.data;
    } catch {
      return null;
    }
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('biowell_'))
      .forEach(key => localStorage.removeItem(key));
  }
};