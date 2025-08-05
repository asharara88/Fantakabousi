import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCache } from '../../hooks/useCache';
import { cacheManager, apiCache, userDataCache } from '../../lib/cacheManager';

const mockFetcher = vi.fn();

describe('useCache Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear all cache instances
    cacheManager.clear();
    apiCache.clear();
    userDataCache.clear();
    mockFetcher.mockResolvedValue('test-data');
  });

  afterEach(() => {
    // Destroy cache instances to stop timers
    cacheManager.destroy();
    apiCache.destroy();
    userDataCache.destroy();
  });

  it('fetches data on first call', async () => {
    const { result } = renderHook(() => 
      useCache('test-key', mockFetcher)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe('test-data');
      expect(mockFetcher).toHaveBeenCalledTimes(1);
    });
  });

  it('returns cached data on subsequent calls', async () => {
    // First call
    const { result: result1 } = renderHook(() => 
      useCache('test-key', mockFetcher)
    );

    await waitFor(() => {
      expect(result1.current.data).toBe('test-data');
    });

    // Second call with same key
    const { result: result2 } = renderHook(() => 
      useCache('test-key', mockFetcher)
    );

    await waitFor(() => {
      expect(result2.current.data).toBe('test-data');
      expect(mockFetcher).toHaveBeenCalledTimes(1); // Should not fetch again
    });
  });

  it('handles fetch errors gracefully', async () => {
    const error = new Error('Fetch failed');
    mockFetcher.mockRejectedValue(error);

    const { result } = renderHook(() => 
      useCache('test-key', mockFetcher)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeNull();
    });
  });

  it('refreshes data when requested', async () => {
    const { result } = renderHook(() => 
      useCache('test-key', mockFetcher)
    );

    await waitFor(() => {
      expect(result.current.data).toBe('test-data');
    });

    mockFetcher.mockResolvedValue('updated-data');
    
    await result.current.refresh?.();

    await waitFor(() => {
      expect(result.current.data).toBe('updated-data');
      expect(mockFetcher).toHaveBeenCalledTimes(2);
    });
  });

  it('invalidates cache correctly', async () => {
    const { result } = renderHook(() => 
      useCache('test-key', mockFetcher)
    );

    await waitFor(() => {
      expect(result.current.data).toBe('test-data');
    });

    result.current.invalidate();

    expect(result.current.data).toBeNull();
  });
});