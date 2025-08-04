import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PerformanceMonitor } from '../../lib/performanceMonitor';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024,
    totalJSHeapSize: 100 * 1024 * 1024,
    jsHeapSizeLimit: 200 * 1024 * 1024,
  },
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    vi.clearAllMocks();
    monitor = PerformanceMonitor.getInstance();
    monitor.clearMetrics();
  });

  it('measures component render time', () => {
    const renderFn = vi.fn(() => 'rendered');
    mockPerformance.now.mockReturnValueOnce(100).mockReturnValueOnce(150);

    const result = monitor.measureComponentRender('TestComponent', renderFn);

    expect(result).toBe('rendered');
    expect(renderFn).toHaveBeenCalled();
    
    const metrics = monitor.getMetrics('render');
    expect(metrics).toHaveLength(1);
    expect(metrics[0].name).toBe('component_render_TestComponent');
    expect(metrics[0].value).toBe(50);
  });

  it('measures async operations', async () => {
    const asyncOp = vi.fn().mockResolvedValue('success');
    mockPerformance.now.mockReturnValueOnce(100).mockReturnValueOnce(200);

    const result = await monitor.measureAsyncOperation('testOp', asyncOp);

    expect(result).toBe('success');
    expect(asyncOp).toHaveBeenCalled();
    
    const metrics = monitor.getMetrics('timing');
    expect(metrics).toHaveLength(1);
    expect(metrics[0].name).toBe('async_testOp');
    expect(metrics[0].value).toBe(100);
  });

  it('handles async operation errors', async () => {
    const error = new Error('Operation failed');
    const asyncOp = vi.fn().mockRejectedValue(error);
    mockPerformance.now.mockReturnValueOnce(100).mockReturnValueOnce(150);

    await expect(
      monitor.measureAsyncOperation('failingOp', asyncOp)
    ).rejects.toThrow('Operation failed');
    
    const metrics = monitor.getMetrics('timing');
    expect(metrics).toHaveLength(1);
    expect(metrics[0].metadata?.success).toBe(false);
    expect(metrics[0].metadata?.error).toBe('Operation failed');
  });

  it('calculates average metrics correctly', () => {
    // Add some test metrics
    monitor.measureComponentRender('TestComponent', () => {
      mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(100);
      return 'test';
    });
    
    monitor.measureComponentRender('TestComponent', () => {
      mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(200);
      return 'test';
    });

    const average = monitor.getAverageMetric('component_render_TestComponent');
    expect(average).toBeGreaterThan(0);
  });

  it('limits metrics storage', () => {
    // Add more metrics than the limit
    for (let i = 0; i < 1100; i++) {
      monitor.measureComponentRender(`Component${i}`, () => 'test');
    }

    const allMetrics = monitor.getMetrics();
    expect(allMetrics.length).toBeLessThanOrEqual(1000);
  });
});