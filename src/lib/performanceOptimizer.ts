interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableVirtualization: boolean;
  enableMemoization: boolean;
  bundleSizeLimit: number;
  renderTimeLimit: number;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private config: PerformanceConfig;
  private renderTimes = new Map<string, number[]>();

  static getInstance(config?: Partial<PerformanceConfig>): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer(config);
    }
    return PerformanceOptimizer.instance;
  }

  private constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      enableLazyLoading: true,
      enableVirtualization: true,
      enableMemoization: true,
      bundleSizeLimit: 1.5 * 1024 * 1024, // 1.5MB
      renderTimeLimit: 16, // 60fps = 16ms per frame
      ...config
    };

    this.initializeOptimizations();
  }

  private initializeOptimizations(): void {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Set up intersection observer for lazy loading
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }
    
    // Monitor bundle size
    this.monitorBundleSize();
  }

  private preloadCriticalResources(): void {
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/images/logo-light.svg',
      '/images/logo-dark.svg'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.includes('.woff') ? 'font' : 'image';
      if (resource.includes('.woff')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  private setupLazyLoading(): void {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  private monitorBundleSize(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let totalSize = 0;

      resources.forEach(resource => {
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          totalSize += resource.transferSize || 0;
        }
      });

      if (totalSize > this.config.bundleSizeLimit) {
        console.warn(`Bundle size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds limit (${(this.config.bundleSizeLimit / 1024 / 1024).toFixed(2)}MB)`);
      }
    }
  }

  public optimizeComponent<T extends React.ComponentType<any>>(
    Component: T,
    options: {
      memo?: boolean;
      lazy?: boolean;
      preload?: boolean;
    } = {}
  ): T {
    let OptimizedComponent = Component;

    // Apply React.memo for memoization
    if (options.memo && this.config.enableMemoization) {
      OptimizedComponent = React.memo(OptimizedComponent) as T;
    }

    // Apply lazy loading
    if (options.lazy && this.config.enableLazyLoading) {
      OptimizedComponent = React.lazy(() => 
        Promise.resolve({ default: OptimizedComponent })
      ) as T;
    }

    return OptimizedComponent;
  }

  public measureRenderTime(componentName: string, renderTime: number): void {
    if (!this.renderTimes.has(componentName)) {
      this.renderTimes.set(componentName, []);
    }

    const times = this.renderTimes.get(componentName)!;
    times.push(renderTime);

    // Keep only last 10 measurements
    if (times.length > 10) {
      times.shift();
    }

    // Warn if render time exceeds limit
    const avgRenderTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    if (avgRenderTime > this.config.renderTimeLimit) {
      console.warn(`Component ${componentName} average render time (${avgRenderTime.toFixed(2)}ms) exceeds limit (${this.config.renderTimeLimit}ms)`);
    }
  }

  public getPerformanceReport(): {
    bundleSize: number;
    renderTimes: Record<string, number>;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    const renderTimes: Record<string, number> = {};

    // Calculate average render times
    for (const [component, times] of this.renderTimes.entries()) {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      renderTimes[component] = avgTime;

      if (avgTime > this.config.renderTimeLimit) {
        recommendations.push(`Optimize ${component} component (${avgTime.toFixed(2)}ms render time)`);
      }
    }

    // Bundle size recommendations
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const bundleSize = resources
      .filter(r => r.name.includes('.js'))
      .reduce((total, r) => total + (r.transferSize || 0), 0);

    if (bundleSize > this.config.bundleSizeLimit) {
      recommendations.push(`Reduce bundle size (current: ${(bundleSize / 1024 / 1024).toFixed(2)}MB)`);
    }

    return {
      bundleSize,
      renderTimes,
      recommendations
    };
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();

// React hook for performance optimization
export const usePerformanceOptimization = (componentName: string) => {
  const renderStartTime = React.useRef<number>(0);

  React.useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      performanceOptimizer.measureRenderTime(componentName, renderTime);
    };
  });

  return {
    optimizeComponent: performanceOptimizer.optimizeComponent,
    getReport: performanceOptimizer.getPerformanceReport
  };
};