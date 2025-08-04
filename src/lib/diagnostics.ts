interface DiagnosticResult {
  category: string;
  test: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  value?: number;
  threshold?: number;
  recommendation?: string;
}

export class DiagnosticsManager {
  private static instance: DiagnosticsManager;

  static getInstance(): DiagnosticsManager {
    if (!DiagnosticsManager.instance) {
      DiagnosticsManager.instance = new DiagnosticsManager();
    }
    return DiagnosticsManager.instance;
  }

  public async runFullDiagnostics(): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = [];

    // Performance diagnostics
    results.push(...await this.runPerformanceDiagnostics());
    
    // Memory diagnostics
    results.push(...this.runMemoryDiagnostics());
    
    // Cache diagnostics
    results.push(...this.runCacheDiagnostics());
    
    // Network diagnostics
    results.push(...await this.runNetworkDiagnostics());
    
    // Browser compatibility diagnostics
    results.push(...this.runCompatibilityDiagnostics());

    return results;
  }

  private async runPerformanceDiagnostics(): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = [];

    // Check Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        const lcp = lcpEntries[lcpEntries.length - 1]?.startTime || 0;
        
        results.push({
          category: 'Performance',
          test: 'Largest Contentful Paint',
          status: lcp < 2500 ? 'pass' : lcp < 4000 ? 'warn' : 'fail',
          message: `LCP: ${lcp.toFixed(2)}ms`,
          value: lcp,
          threshold: 2500,
          recommendation: lcp > 2500 ? 'Optimize images and reduce render-blocking resources' : undefined
        });
      } catch (error) {
        results.push({
          category: 'Performance',
          test: 'Largest Contentful Paint',
          status: 'fail',
          message: 'Unable to measure LCP'
        });
      }
    }

    // Check JavaScript bundle size
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalBundleSize = 0;
    
    for (const script of scripts) {
      try {
        const response = await fetch((script as HTMLScriptElement).src, { method: 'HEAD' });
        const size = parseInt(response.headers.get('content-length') || '0');
        totalBundleSize += size;
      } catch {
        // Ignore errors for external scripts
      }
    }

    results.push({
      category: 'Performance',
      test: 'Bundle Size',
      status: totalBundleSize < 1024 * 1024 ? 'pass' : totalBundleSize < 2 * 1024 * 1024 ? 'warn' : 'fail',
      message: `Total bundle size: ${(totalBundleSize / 1024 / 1024).toFixed(2)}MB`,
      value: totalBundleSize,
      threshold: 1024 * 1024,
      recommendation: totalBundleSize > 1024 * 1024 ? 'Consider code splitting and tree shaking' : undefined
    });

    return results;
  }

  private runMemoryDiagnostics(): DiagnosticResult[] {
    const results: DiagnosticResult[] = [];

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      results.push({
        category: 'Memory',
        test: 'Heap Usage',
        status: usagePercentage < 50 ? 'pass' : usagePercentage < 80 ? 'warn' : 'fail',
        message: `Memory usage: ${usagePercentage.toFixed(1)}%`,
        value: usagePercentage,
        threshold: 50,
        recommendation: usagePercentage > 50 ? 'Consider reducing memory usage or implementing cleanup' : undefined
      });

      results.push({
        category: 'Memory',
        test: 'Heap Size',
        status: memory.usedJSHeapSize < 100 * 1024 * 1024 ? 'pass' : 'warn',
        message: `Used heap: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        value: memory.usedJSHeapSize,
        threshold: 100 * 1024 * 1024
      });
    }

    return results;
  }

  private runCacheDiagnostics(): DiagnosticResult[] {
    const results: DiagnosticResult[] = [];

    try {
      const stats = (window as any).cacheManager?.getStats();
      
      if (stats) {
        results.push({
          category: 'Cache',
          test: 'Cache Hit Rate',
          status: stats.hitRate > 0.7 ? 'pass' : stats.hitRate > 0.4 ? 'warn' : 'fail',
          message: `Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`,
          value: stats.hitRate,
          threshold: 0.7,
          recommendation: stats.hitRate < 0.7 ? 'Review caching strategy and TTL values' : undefined
        });

        results.push({
          category: 'Cache',
          test: 'Cache Size',
          status: stats.size < 500 ? 'pass' : stats.size < 1000 ? 'warn' : 'fail',
          message: `Cache items: ${stats.size}`,
          value: stats.size,
          threshold: 500
        });
      }
    } catch (error) {
      results.push({
        category: 'Cache',
        test: 'Cache System',
        status: 'fail',
        message: 'Cache system not available'
      });
    }

    return results;
  }

  private async runNetworkDiagnostics(): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = [];

    // Test network connectivity
    try {
      const startTime = performance.now();
      const response = await fetch('/favicon.ico', { method: 'HEAD' });
      const endTime = performance.now();
      const latency = endTime - startTime;

      results.push({
        category: 'Network',
        test: 'Connectivity',
        status: response.ok ? 'pass' : 'fail',
        message: response.ok ? `Connected (${latency.toFixed(2)}ms)` : 'Connection failed'
      });

      results.push({
        category: 'Network',
        test: 'Latency',
        status: latency < 100 ? 'pass' : latency < 300 ? 'warn' : 'fail',
        message: `Latency: ${latency.toFixed(2)}ms`,
        value: latency,
        threshold: 100,
        recommendation: latency > 100 ? 'Consider CDN or server optimization' : undefined
      });
    } catch (error) {
      results.push({
        category: 'Network',
        test: 'Connectivity',
        status: 'fail',
        message: 'Network test failed'
      });
    }

    return results;
  }

  private runCompatibilityDiagnostics(): DiagnosticResult[] {
    const results: DiagnosticResult[] = [];

    // Check required APIs
    const requiredAPIs = [
      'fetch',
      'localStorage',
      'sessionStorage',
      'IntersectionObserver',
      'ResizeObserver'
    ];

    requiredAPIs.forEach(api => {
      const available = api in window;
      results.push({
        category: 'Compatibility',
        test: `${api} API`,
        status: available ? 'pass' : 'fail',
        message: available ? 'Available' : 'Not supported',
        recommendation: !available ? `Polyfill required for ${api}` : undefined
      });
    });

    // Check modern features
    const modernFeatures = [
      { name: 'ES6 Modules', test: () => 'import' in document.createElement('script') },
      { name: 'CSS Grid', test: () => CSS.supports('display', 'grid') },
      { name: 'CSS Custom Properties', test: () => CSS.supports('--test', 'value') },
      { name: 'WebP Images', test: () => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }}
    ];

    modernFeatures.forEach(feature => {
      try {
        const supported = feature.test();
        results.push({
          category: 'Compatibility',
          test: feature.name,
          status: supported ? 'pass' : 'warn',
          message: supported ? 'Supported' : 'Not supported',
          recommendation: !supported ? `Consider fallback for ${feature.name}` : undefined
        });
      } catch (error) {
        results.push({
          category: 'Compatibility',
          test: feature.name,
          status: 'fail',
          message: 'Test failed'
        });
      }
    });

    return results;
  }

  public generateReport(results: DiagnosticResult[]): string {
    const categories = [...new Set(results.map(r => r.category))];
    let report = '# Biowell Performance Diagnostics Report\n\n';
    
    report += `Generated: ${new Date().toISOString()}\n\n`;

    categories.forEach(category => {
      const categoryResults = results.filter(r => r.category === category);
      const passCount = categoryResults.filter(r => r.status === 'pass').length;
      const warnCount = categoryResults.filter(r => r.status === 'warn').length;
      const failCount = categoryResults.filter(r => r.status === 'fail').length;

      report += `## ${category}\n`;
      report += `✅ Pass: ${passCount} | ⚠️ Warn: ${warnCount} | ❌ Fail: ${failCount}\n\n`;

      categoryResults.forEach(result => {
        const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
        report += `${icon} **${result.test}**: ${result.message}\n`;
        
        if (result.recommendation) {
          report += `   💡 ${result.recommendation}\n`;
        }
        report += '\n';
      });
    });

    return report;
  }
}

export const diagnosticsManager = DiagnosticsManager.getInstance();