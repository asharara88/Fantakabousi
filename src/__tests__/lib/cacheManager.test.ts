import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CacheManager } from '../../lib/cacheManager';

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = CacheManager.getInstance({
      maxSize: 5,
      defaultTTL: 1000,
      cleanupInterval: 100,
    });
  });

  afterEach(() => {
    cacheManager.clear();
  });

  it('stores and retrieves data correctly', () => {
    const testData = { test: 'data' };
    cacheManager.set('test-key', testData);
    
    const retrieved = cacheManager.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('returns null for non-existent keys', () => {
    const result = cacheManager.get('non-existent');
    expect(result).toBeNull();
  });

  it('respects TTL expiration', async () => {
    cacheManager.set('test-key', 'test-data', 50); // 50ms TTL
    
    expect(cacheManager.get('test-key')).toBe('test-data');
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(cacheManager.get('test-key')).toBeNull();
  });

  it('evicts least recently used items when full', () => {
    // Fill cache to capacity
    for (let i = 0; i < 5; i++) {
      cacheManager.set(`key-${i}`, `data-${i}`);
    }

    // Access some items to update their last accessed time
    cacheManager.get('key-2');
    cacheManager.get('key-4');

    // Add one more item to trigger eviction
    cacheManager.set('key-new', 'new-data');

    // The least recently used items should be evicted
    expect(cacheManager.get('key-2')).toBe('data-2'); // Should still exist
    expect(cacheManager.get('key-4')).toBe('data-4'); // Should still exist
    expect(cacheManager.get('key-new')).toBe('new-data'); // Should exist
  });

  it('deletes items correctly', () => {
    cacheManager.set('test-key', 'test-data');
    expect(cacheManager.has('test-key')).toBe(true);
    
    const deleted = cacheManager.delete('test-key');
    expect(deleted).toBe(true);
    expect(cacheManager.has('test-key')).toBe(false);
  });

  it('clears all items', () => {
    cacheManager.set('key1', 'data1');
    cacheManager.set('key2', 'data2');
    
    cacheManager.clear();
    
    expect(cacheManager.get('key1')).toBeNull();
    expect(cacheManager.get('key2')).toBeNull();
  });

  it('provides accurate statistics', () => {
    cacheManager.set('key1', 'data1');
    cacheManager.set('key2', 'data2');
    cacheManager.get('key1'); // Increase access count
    
    const stats = cacheManager.getStats();
    expect(stats.size).toBe(2);
    expect(stats.hitRate).toBeGreaterThan(0);
  });
});