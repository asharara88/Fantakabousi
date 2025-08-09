interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'memory' | 'network' | 'render';
  metadata?: Record<string, any>;
}

interface PerformanceThresholds {
  criticalTiming: number;
  warningTiming: number;
  maxMemoryUsage: number;
  maxBundleSize: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private thresholds: PerformanceThresholds = {
    criticalTiming: 15000, // 15 seconds for API calls
    warningTiming: 8000,   // 8 seconds warning
    maxMemoryUsage: 150 * 1024 * 1024, // 150MB
    maxBundleSize: 2 * 1024 * 1024,    // 2MB
  };

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private constructor() {
    this.initializeObservers();
    this.startMemoryMonitoring();
  }

  private initializeObservers(): void {
    try {
      // Navigation timing
      if ('PerformanceObserver' in window) {
        const navObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric({
                name: 'page_load',
                value: navEntry.loadEventEnd - navEntry.loadEventStart,
                timestamp: Date.now(),
                type: 'timing',
                metadata: {
                  domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                  firstPaint: navEntry.responseEnd - navEntry.requestStart,
                  transferSize: navEntry.transferSize
                }
              });
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric({
              name: 'largest_contentful_paint',
              value: entry.startTime,
              timestamp: Date.now(),
              type: 'render',
              metadata: {
                element: (entry as any).element?.tagName,
                url: (entry as any).url
              }
            });
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric({
              name: 'first_input_delay',
              value: (entry as any).processingStart - entry.startTime,
              timestamp: Date.now(),
              type: 'timing',
              metadata: {
                inputType: (entry as any).name
              }
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          
          if (clsValue > 0) {
            this.recordMetric({
              name: 'cumulative_layout_shift',
              value: clsValue,
              timestamp: Date.now(),
              type: 'render'
            });
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      }
    } catch (error) {
      console.warn('Performance observers not supported:', error);
    }
  }

  private startMemoryMonitoring(): void {
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.recordMetric({
          name: 'memory_usage',
          value: memory.usedJSHeapSize,
          timestamp: Date.now(),
          type: 'memory',
          metadata: {
            totalHeapSize: memory.totalJSHeapSize,
            heapSizeLimit: memory.jsHeapSizeLimit,
            usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
          }
        });

        // Alert if memory usage is too high
        if (memory.usedJSHeapSize > this.thresholds.maxMemoryUsage) {
          this.triggerMemoryCleanup();
        }
      }
    }, 10000); // Every 10 seconds
  }

  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Check thresholds and alert if needed
    this.checkThresholds(metric);
  }

  private checkThresholds(metric: PerformanceMetric): void {
    if (metric.type === 'timing') {
      if (metric.value > this.thresholds.criticalTiming) {
        console.error(`Critical performance issue: ${metric.name} took ${metric.value}ms`);
        this.reportPerformanceIssue(metric, 'critical');
      } else if (metric.value > this.thresholds.warningTiming) {
        console.warn(`Performance warning: ${metric.name} took ${metric.value}ms`);
        this.reportPerformanceIssue(metric, 'warning');
      }
    }
  }

  private reportPerformanceIssue(metric: PerformanceMetric, severity: 'warning' | 'critical'): void {
    // In production, this would send to analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance ${severity}:`, metric);
    }
  }

  private triggerMemoryCleanup(): void {
    // Trigger garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    // Clear old cache entries
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('biowell-cache-')
    );
    
    cacheKeys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (Date.now() - parsed.timestamp > 5 * 60 * 1000) { // 5 minutes old
            localStorage.removeItem(key);
          }
        }
      } catch {
        localStorage.removeItem(key);
      }
    });

    console.log('Memory cleanup triggered');
  }

  public measureComponentRender<T>(
    componentName: string,
    renderFunction: () => T
  ): T {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();

    this.recordMetric({
      name: `component_render_${componentName}`,
      value: endTime - startTime,
      timestamp: Date.now(),
      type: 'render',
      metadata: { component: componentName }
    });

    return result;
  }

  public measureAsyncOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    return operation().then(
      (result) => {
        const endTime = performance.now();
        this.recordMetric({
          name: `async_${operationName}`,
          value: endTime - startTime,
          timestamp: Date.now(),
          type: 'timing',
          metadata: { operation: operationName, success: true }
        });
        return result;
      },
      (error) => {
        const endTime = performance.now();
        this.recordMetric({
          name: `async_${operationName}`,
          value: endTime - startTime,
          timestamp: Date.now(),
          type: 'timing',
          metadata: { operation: operationName, success: false, error: error.message }
        });
        throw error;
      }
    );
  }

  public getMetrics(type?: string, limit = 100): PerformanceMetric[] {
    let filtered = this.metrics;
    
    if (type) {
      filtered = this.metrics.filter(m => m.type === type);
    }
    
    return filtered.slice(-limit);
  }

  public getAverageMetric(name: string, timeWindow = 5 * 60 * 1000): number {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(
      m => m.name === name && (now - m.timestamp) <= timeWindow
    );
    
    if (recentMetrics.length === 0) return 0;
    
    const sum = recentMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / recentMetrics.length;
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const measureRender = (componentName: string, renderFn: () => any) => {
    return performanceMonitor.measureComponentRender(componentName, renderFn);
  };

  const measureAsync = <T>(operationName: string, operation: () => Promise<T>) => {
    return performanceMonitor.measureAsyncOperation(operationName, operation);
  };

  return { measureRender, measureAsync };
};