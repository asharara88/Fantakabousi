import { performanceMonitor } from './performanceMonitor';
import { memoryManager } from './memoryManager';
import { cacheManager } from './cacheManager';

interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enableMemoryManagement: boolean;
  enableCacheOptimization: boolean;
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private config: OptimizationConfig;
  private optimizationTasks: Map<string, () => void> = new Map();

  static getInstance(config?: Partial<OptimizationConfig>): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer(config);
    }
    return PerformanceOptimizer.instance;
  }

  private constructor(config?: Partial<OptimizationConfig>) {
    this.config = {
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableCodeSplitting: true,
      enableMemoryManagement: true,
      enableCacheOptimization: true,
      ...config
    };

    this.initializeOptimizations();
  }

  private initializeOptimizations(): void {
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }

    if (this.config.enableImageOptimization) {
      this.setupImageOptimization();
    }

    if (this.config.enableMemoryManagement) {
      this.setupMemoryManagement();
    }

    if (this.config.enableCacheOptimization) {
      this.setupCacheOptimization();
    }
  }

  private setupLazyLoading(): void {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Lazy load images
          if (element.tagName === 'IMG' && element.dataset.src) {
            (element as HTMLImageElement).src = element.dataset.src;
            element.removeAttribute('data-src');
            observer.unobserve(element);
          }

          // Lazy load components
          if (element.dataset.lazyComponent) {
            this.loadComponent(element.dataset.lazyComponent);
            observer.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    // Observe all lazy elements
    document.querySelectorAll('[data-src], [data-lazy-component]').forEach(el => {
      observer.observe(el);
    });
  }

  private setupImageOptimization(): void {
    // Preload critical images
    const criticalImages = [
      '/logo-light.png',
      '/logo-dark.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Optimize image loading
    document.addEventListener('DOMContentLoaded', () => {
      const images = document.querySelectorAll('img[data-optimize]');
      images.forEach(img => {
        const imageElement = img as HTMLImageElement;
        imageElement.loading = 'lazy';
        imageElement.decoding = 'async';
      });
    });
  }

  private setupMemoryManagement(): void {
    // Register cleanup tasks
    memoryManager.registerCleanupTask({
      name: 'component_cache_cleanup',
      priority: 1,
      cleanup: () => {
        // Clear component-specific caches
        const componentCaches = Object.keys(sessionStorage).filter(key => 
          key.startsWith('component-cache-')
        );
        componentCaches.forEach(key => sessionStorage.removeItem(key));
      },
      estimatedMemorySaved: 5 * 1024 * 1024 // 5MB
    });

    // Monitor memory usage
    setInterval(() => {
      const stats = memoryManager.getMemoryStats();
      if (stats && stats.usagePercentage > 85) {
        console.warn('High memory usage detected:', stats.usagePercentage.toFixed(1) + '%');
        this.triggerEmergencyCleanup();
      }
    }, 30000); // Check every 30 seconds
  }

  private setupCacheOptimization(): void {
    // Optimize cache based on usage patterns
    setInterval(() => {
      const stats = cacheManager.getStats();
      
      // If hit rate is low, clear cache to prevent memory waste
      if (stats.hitRate < 0.3 && stats.size > 100) {
        console.log('Low cache hit rate, clearing cache');
        cacheManager.clear();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private loadComponent(componentName: string): void {
    const loadTask = this.optimizationTasks.get(componentName);
    if (loadTask) {
      loadTask();
    }
  }

  private triggerEmergencyCleanup(): void {
    console.log('Triggering emergency cleanup...');
    
    // Clear all caches
    cacheManager.clear();
    
    // Force memory cleanup
    memoryManager.forceCleanup();
    
    // Clear old localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('biowell-cache-') || key.startsWith('temp-')) {
        localStorage.removeItem(key);
      }
    });

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  public registerComponentLoader(componentName: string, loader: () => void): void {
    this.optimizationTasks.set(componentName, loader);
  }

  public optimizeForMobile(): void {
    // Reduce animation complexity on mobile
    if (window.innerWidth < 768) {
      document.documentElement.style.setProperty('--animation-duration', '200ms');
      document.documentElement.style.setProperty('--transition-duration', '150ms');
    }

    // Optimize touch handling
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  }

  public getOptimizationStats() {
    return {
      config: this.config,
      registeredTasks: this.optimizationTasks.size,
      memoryStats: memoryManager.getMemoryStats(),
      cacheStats: cacheManager.getStats(),
      performanceMetrics: performanceMonitor.getMetrics('timing', 10)
    };
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Auto-optimize on load
if (typeof window !== 'undefined') {
  performanceOptimizer.optimizeForMobile();
}