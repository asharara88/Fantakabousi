import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performanceMonitor } from '../../lib/performanceMonitor';
import { memoryManager } from '../../lib/memoryManager';
import { cacheManager } from '../../lib/cacheManager';

describe('Performance Load Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceMonitor.clearMetrics();
    cacheManager.clear();
  });

  it('handles high component render load', async () => {
    const componentCount = 100;

    // Simulate rendering many components
    for (let i = 0; i < componentCount; i++) {
      performanceMonitor.measureComponentRender(
        `TestComponent${i}`,
        () => {
          // Simulate component work
          const start = performance.now();
          while (performance.now() - start < Math.random() * 10) {
            // Busy wait
          }
          return `rendered-${i}`;
        }
      );
    }

    const metrics = performanceMonitor.getMetrics('render');
    const avgRenderTime = metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;

    expect(metrics.length).toBe(componentCount);
    expect(avgRenderTime).toBeLessThan(50); // Should be under 50ms average
  });

  it('handles cache pressure under load', () => {
    const itemCount = 1000;
    
    // Fill cache with many items
    for (let i = 0; i < itemCount; i++) {
      cacheManager.set(`test-item-${i}`, { data: `test-data-${i}` }, 60000);
    }

    const stats = cacheManager.getStats();
    expect(stats.size).toBeLessThanOrEqual(1000); // Should respect max size
    
    // Test cache retrieval performance
    const startTime = performance.now();
    for (let i = 0; i < 100; i++) {
      cacheManager.get(`test-item-${i}`);
    }
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should be fast
  });

  it('manages memory under stress', async () => {
    const initialStats = memoryManager.getMemoryStats();
    
    // Simulate memory pressure
    const largeData = new Array(10000).fill(0).map((_, i) => ({
      id: i,
      data: new Array(1000).fill(`data-${i}`).join('')
    }));

    // Force memory cleanup
    memoryManager.forceCleanup();
    
    const finalStats = memoryManager.getMemoryStats();
    
    // Memory should be managed effectively
    if (initialStats && finalStats) {
      expect(finalStats.usagePercentage).toBeLessThanOrEqual(initialStats.usagePercentage + 10);
    }
  });

  it('handles concurrent async operations', async () => {
    const operationCount = 50;
    const operations: Promise<any>[] = [];

    // Create many concurrent operations
    for (let i = 0; i < operationCount; i++) {
      const operation = performanceMonitor.measureAsyncOperation(
        `AsyncOp${i}`,
        async () => {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
          return `result-${i}`;
        }
      );
      operations.push(operation);
    }

    const results = await Promise.all(operations);
    const metrics = performanceMonitor.getMetrics('timing');

    expect(results.length).toBe(operationCount);
    expect(metrics.length).toBe(operationCount);
    
    // All operations should complete reasonably fast
    const avgDuration = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    expect(avgDuration).toBeLessThan(200); // Under 200ms average
  });

  it('maintains performance under error conditions', async () => {
    const errorCount = 20;
    const successCount = 80;
    
    // Mix of successful and failing operations
    const operations = [
      ...Array(successCount).fill(0).map((_, i) => 
        performanceMonitor.measureAsyncOperation(`Success${i}`, async () => `success-${i}`)
      ),
      ...Array(errorCount).fill(0).map((_, i) => 
        performanceMonitor.measureAsyncOperation(`Error${i}`, async () => {
          throw new Error(`Test error ${i}`);
        }).catch(() => `error-handled-${i}`)
      )
    ];

    const results = await Promise.all(operations);
    const metrics = performanceMonitor.getMetrics('timing');

    expect(results.length).toBe(100);
    expect(metrics.length).toBe(100);
    
    // Performance should remain stable despite errors
    const avgDuration = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    expect(avgDuration).toBeLessThan(100);
  });
});