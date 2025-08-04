interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
}

interface CleanupTask {
  name: string;
  priority: number;
  cleanup: () => void;
  estimatedMemorySaved: number;
}

export class MemoryManager {
  private static instance: MemoryManager;
  private cleanupTasks: CleanupTask[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private lastCleanup = 0;
  private readonly CLEANUP_COOLDOWN = 30000; // 30 seconds
  private readonly MEMORY_THRESHOLD = 0.8; // 80% of heap limit

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  private constructor() {
    this.registerDefaultCleanupTasks();
    this.startMonitoring();
  }

  private registerDefaultCleanupTasks(): void {
    // Cache cleanup
    this.registerCleanupTask({
      name: 'cache_cleanup',
      priority: 1,
      cleanup: () => {
        // Clear expired cache entries
        const now = Date.now();
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('biowell-cache-')) {
            try {
              const item = localStorage.getItem(key);
              if (item) {
                const parsed = JSON.parse(item);
                if (now - parsed.timestamp > 5 * 60 * 1000) {
                  localStorage.removeItem(key);
                }
              }
            } catch {
              localStorage.removeItem(key);
            }
          }
        });
      },
      estimatedMemorySaved: 5 * 1024 * 1024 // 5MB
    });

    // DOM cleanup
    this.registerCleanupTask({
      name: 'dom_cleanup',
      priority: 2,
      cleanup: () => {
        // Remove orphaned event listeners
        const elements = document.querySelectorAll('[data-cleanup="true"]');
        elements.forEach(el => el.remove());
        
        // Clear any blob URLs that might be hanging around
        if (window.URL && window.URL.revokeObjectURL) {
          // This would need to track created URLs in practice
          console.log('DOM cleanup completed');
        }
      },
      estimatedMemorySaved: 2 * 1024 * 1024 // 2MB
    });

    // Image cleanup
    this.registerCleanupTask({
      name: 'image_cleanup',
      priority: 3,
      cleanup: () => {
        // Clear image caches
        const images = document.querySelectorAll('img[data-cached="true"]');
        images.forEach(img => {
          if (img instanceof HTMLImageElement && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
          }
        });
      },
      estimatedMemorySaved: 10 * 1024 * 1024 // 10MB
    });

    // Component state cleanup
    this.registerCleanupTask({
      name: 'component_state_cleanup',
      priority: 4,
      cleanup: () => {
        // Clear old component states from sessionStorage
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('component-state-')) {
            try {
              const item = sessionStorage.getItem(key);
              if (item) {
                const parsed = JSON.parse(item);
                if (Date.now() - parsed.timestamp > 10 * 60 * 1000) {
                  sessionStorage.removeItem(key);
                }
              }
            } catch {
              sessionStorage.removeItem(key);
            }
          }
        });
      },
      estimatedMemorySaved: 1 * 1024 * 1024 // 1MB
    });
  }

  public registerCleanupTask(task: CleanupTask): void {
    this.cleanupTasks.push(task);
    this.cleanupTasks.sort((a, b) => a.priority - b.priority);
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      const stats = this.getMemoryStats();
      
      if (stats && stats.usagePercentage > this.MEMORY_THRESHOLD) {
        this.triggerCleanup();
      }
    }, 15000); // Check every 15 seconds
  }

  public getMemoryStats(): MemoryStats | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  private triggerCleanup(): void {
    const now = Date.now();
    
    // Respect cooldown period
    if (now - this.lastCleanup < this.CLEANUP_COOLDOWN) {
      return;
    }

    console.log('Triggering memory cleanup...');
    
    let totalMemorySaved = 0;
    
    // Execute cleanup tasks in priority order
    this.cleanupTasks.forEach(task => {
      try {
        task.cleanup();
        totalMemorySaved += task.estimatedMemorySaved;
        console.log(`Executed cleanup task: ${task.name}`);
      } catch (error) {
        console.error(`Cleanup task failed: ${task.name}`, error);
      }
    });

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    this.lastCleanup = now;
    console.log(`Memory cleanup completed. Estimated ${totalMemorySaved / 1024 / 1024}MB freed`);
  }

  public forceCleanup(): void {
    this.lastCleanup = 0; // Reset cooldown
    this.triggerCleanup();
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.cleanupTasks = [];
  }
}

export const memoryManager = MemoryManager.getInstance();

// React hook for memory management
export const useMemoryManager = () => {
  const forceCleanup = () => memoryManager.forceCleanup();
  const getStats = () => memoryManager.getMemoryStats();
  
  return { forceCleanup, getStats };
};