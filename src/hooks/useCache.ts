import { useState, useEffect, useCallback } from 'react';
import { cacheManager, apiCache, userDataCache } from '../lib/cacheManager';
import { errorHandler } from '../lib/errorHandler';

interface UseCacheOptions {
  ttl?: number;
  cacheInstance?: 'default' | 'api' | 'userData';
  enableRefresh?: boolean;
}

export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCacheOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    cacheInstance = 'default',
    enableRefresh = true
  } = options;

  const getCacheInstance = () => {
    switch (cacheInstance) {
      case 'api': return apiCache;
      case 'userData': return userDataCache;
      default: return cacheManager;
    }
  };

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const cache = getCacheInstance();
      
      // Try cache first unless forcing refresh
      if (!forceRefresh) {
        const cached = cache.get<T>(key);
        if (cached) {
          setData(cached);
          setLoading(false);
          return cached;
        }
      }

      // Fetch fresh data
      const freshData = await fetcher();
      
      // Cache the result
      cache.set(key, freshData, ttl);
      
      setData(freshData);
      return freshData;
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Cache fetch failed');
      setError(error);
      
      errorHandler.handleError(error, {
        component: 'useCache',
        action: 'fetchData',
        metadata: { key, cacheInstance, forceRefresh }
      });
      
      // Try to return stale data if available
      const cache = getCacheInstance();
      const staleData = cache.get<T>(key);
      if (staleData) {
        setData(staleData);
        return staleData;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, cacheInstance]);

  const refresh = useCallback(() => {
    if (enableRefresh) {
      return fetchData(true);
    }
  }, [fetchData, enableRefresh]);

  const invalidate = useCallback(() => {
    const cache = getCacheInstance();
    cache.delete(key);
    setData(null);
  }, [key, cacheInstance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    refetch: refresh
  };
};

export const useCacheStats = () => {
  const [stats, setStats] = useState({
    default: cacheManager.getStats(),
    api: apiCache.getStats(),
    userData: userDataCache.getStats()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        default: cacheManager.getStats(),
        api: apiCache.getStats(),
        userData: userDataCache.getStats()
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const clearAllCaches = useCallback(() => {
    try {
      cacheManager.clear();
      apiCache.clear();
      userDataCache.clear();
      
      setStats({
        default: cacheManager.getStats(),
        api: apiCache.getStats(),
        userData: userDataCache.getStats()
      });
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error('Failed to clear caches'),
        { component: 'useCacheStats', action: 'clearAllCaches' }
      );
    }
  }, []);

  return {
    stats,
    clearAllCaches,
    totalMemoryUsage: stats.default.memoryUsage + stats.api.memoryUsage + stats.userData.memoryUsage,
    totalItems: stats.default.size + stats.api.size + stats.userData.size
  };
};