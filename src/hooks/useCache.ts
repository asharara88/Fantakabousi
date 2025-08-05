import { useState, useEffect, useCallback } from 'react';
import { cacheManager } from '../lib/cacheManager';

interface CacheState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh?: () => Promise<void>;
  invalidate: () => void;
}

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    enabled?: boolean;
  }
): CacheState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first unless forcing refresh
      if (!forceRefresh) {
        const cachedData = cacheManager.get<T>(key);
        if (cachedData !== null) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // Fetch new data
      const result = await fetcher();
      
      // Store in cache
      cacheManager.set(key, result, options?.ttl);
      
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, options?.ttl]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    cacheManager.delete(key);
    setData(null);
    setError(null);
  }, [key]);

  useEffect(() => {
    if (options?.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options?.enabled]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  };
}