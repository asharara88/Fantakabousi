interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
  enableCompression: boolean;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private memoryUsage = 0;
  private maxMemoryUsage = 50 * 1024 * 1024; // 50MB

  static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config);
    }
    return CacheManager.instance;
  }

  private constructor(config?: Partial<CacheConfig>) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      enableCompression: true,
      ...config
    };

    this.startCleanupTimer();
    this.setupMemoryMonitoring();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private setupMemoryMonitoring(): void {
    // Monitor memory usage and trigger cleanup if needed
    setInterval(() => {
      if (this.memoryUsage > this.maxMemoryUsage) {
        this.aggressiveCleanup();
      }
    }, 30000); // Check every 30 seconds
  }

  public set<T>(key: string, data: T, ttl?: number): void {
    try {
      const now = Date.now();
      const itemTTL = ttl || this.config.defaultTTL;
      
      // Estimate memory usage
      const dataSize = this.estimateSize(data);
      
      // Remove old item if exists
      if (this.cache.has(key)) {
        const oldItem = this.cache.get(key)!;
        this.memoryUsage -= this.estimateSize(oldItem.data);
      }

      // Check if we need to make space
      if (this.cache.size >= this.config.maxSize) {
        this.evictLeastRecentlyUsed();
      }

      const item: CacheItem<T> = {
        data: this.config.enableCompression ? this.compress(data) : data,
        timestamp: now,
        ttl: itemTTL,
        accessCount: 0,
        lastAccessed: now
      };

      this.cache.set(key, item);
      this.memoryUsage += dataSize;

    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  public get<T>(key: string): T | null {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        return null;
      }

      const now = Date.now();
      
      // Check if expired
      if (now - item.timestamp > item.ttl) {
        this.delete(key);
        return null;
      }

      // Update access statistics
      item.accessCount++;
      item.lastAccessed = now;

      return this.config.enableCompression ? this.decompress(item.data) : item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  public delete(key: string): boolean {
    try {
      const item = this.cache.get(key);
      if (item) {
        this.memoryUsage -= this.estimateSize(item.data);
        return this.cache.delete(key);
      }
      return false;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  public clear(): void {
    try {
      this.cache.clear();
      this.memoryUsage = 0;
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  public has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  private cleanup(): void {
    try {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.delete(key));

      // Log cleanup stats in development
      if (process.env.NODE_ENV === 'development' && keysToDelete.length > 0) {
        console.log(`Cache cleanup: removed ${keysToDelete.length} expired items`);
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  private aggressiveCleanup(): void {
    try {
      // Remove least recently used items until memory usage is acceptable
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      const targetSize = this.maxMemoryUsage * 0.7; // Clean to 70% of max
      
      while (this.memoryUsage > targetSize && sortedEntries.length > 0) {
        const [key] = sortedEntries.shift()!;
        this.delete(key);
      }

      console.log(`Aggressive cleanup: memory usage reduced to ${this.memoryUsage} bytes`);
    } catch (error) {
      console.error('Aggressive cleanup error:', error);
    }
  }

  private evictLeastRecentlyUsed(): void {
    try {
      let oldestKey: string | null = null;
      let oldestTime = Date.now();

      for (const [key, item] of this.cache.entries()) {
        if (item.lastAccessed < oldestTime) {
          oldestTime = item.lastAccessed;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.delete(oldestKey);
      }
    } catch (error) {
      console.error('LRU eviction error:', error);
    }
  }

  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Rough estimate
    } catch {
      return 1024; // Default size if can't estimate
    }
  }

  private compress(data: any): any {
    // Simple compression - in production, use a proper compression library
    try {
      return JSON.stringify(data);
    } catch {
      return data;
    }
  }

  private decompress(data: any): any {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return data;
    }
  }

  public getStats() {
    return {
      size: this.cache.size,
      memoryUsage: this.memoryUsage,
      maxMemoryUsage: this.maxMemoryUsage,
      hitRate: this.calculateHitRate(),
      oldestItem: this.getOldestItemAge(),
      mostAccessed: this.getMostAccessedItems(5)
    };
  }

  private calculateHitRate(): number {
    let totalAccess = 0;
    for (const item of this.cache.values()) {
      totalAccess += item.accessCount;
    }
    return this.cache.size > 0 ? totalAccess / this.cache.size : 0;
  }

  private getOldestItemAge(): number {
    let oldest = 0;
    const now = Date.now();
    for (const item of this.cache.values()) {
      const age = now - item.timestamp;
      if (age > oldest) oldest = age;
    }
    return oldest;
  }

  private getMostAccessedItems(count: number): Array<{ key: string; accessCount: number }> {
    return Array.from(this.cache.entries())
      .map(([key, item]) => ({ key, accessCount: item.accessCount }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, count);
  }

  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
    // Reset instance to allow fresh creation
    if (CacheManager.instance === this) {
      CacheManager.instance = null as any;
    }
  }
}

// Singleton instance
export let cacheManager = CacheManager.getInstance();

// Specialized cache instances
export let apiCache = CacheManager.getInstance({
  maxSize: 500,
  defaultTTL: 2 * 60 * 1000, // 2 minutes for API responses
  cleanupInterval: 30 * 1000 // 30 seconds
});

export let imageCache = CacheManager.getInstance({
  maxSize: 200,
  defaultTTL: 10 * 60 * 1000, // 10 minutes for images
  cleanupInterval: 2 * 60 * 1000 // 2 minutes
});

export let userDataCache = CacheManager.getInstance({
  maxSize: 100,
  defaultTTL: 5 * 60 * 1000, // 5 minutes for user data
  cleanupInterval: 60 * 1000 // 1 minute
}
)