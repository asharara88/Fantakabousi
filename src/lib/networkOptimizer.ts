interface NetworkRequest {
  url: string;
  method: string;
  timestamp: number;
  duration: number;
  size: number;
  cached: boolean;
  retries: number;
}

export class NetworkOptimizer {
  private static instance: NetworkOptimizer;
  private requestHistory: NetworkRequest[] = [];
  private pendingRequests = new Map<string, Promise<Response>>();
  private retryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000
  };

  static getInstance(): NetworkOptimizer {
    if (!NetworkOptimizer.instance) {
      NetworkOptimizer.instance = new NetworkOptimizer();
    }
    return NetworkOptimizer.instance;
  }

  private constructor() {
    this.setupRequestInterception();
    this.startNetworkMonitoring();
  }

  private setupRequestInterception(): void {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input.toString();
      const method = init?.method || 'GET';
      const requestKey = `${method}:${url}`;

      // Deduplicate identical requests
      if (this.pendingRequests.has(requestKey)) {
        return this.pendingRequests.get(requestKey)!;
      }

      const startTime = performance.now();
      
      const requestPromise = this.executeWithRetry(
        () => originalFetch(input, init),
        url
      );

      this.pendingRequests.set(requestKey, requestPromise);

      try {
        const response = await requestPromise;
        const endTime = performance.now();
        
        // Record request metrics
        this.recordRequest({
          url,
          method,
          timestamp: Date.now(),
          duration: endTime - startTime,
          size: parseInt(response.headers.get('content-length') || '0'),
          cached: response.headers.get('x-cache') === 'HIT',
          retries: 0
        });

        return response;
      } finally {
        this.pendingRequests.delete(requestKey);
      }
    };
  }

  private async executeWithRetry(
    requestFn: () => Promise<Response>,
    url: string,
    retryCount = 0
  ): Promise<Response> {
    try {
      const response = await requestFn();
      
      // Retry on server errors
      if (response.status >= 500 && retryCount < this.retryConfig.maxRetries) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (retryCount < this.retryConfig.maxRetries) {
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, retryCount),
          this.retryConfig.maxDelay
        );
        
        console.log(`Retrying request to ${url} in ${delay}ms (attempt ${retryCount + 1})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(requestFn, url, retryCount + 1);
      }
      
      throw error;
    }
  }

  private recordRequest(request: NetworkRequest): void {
    this.requestHistory.push(request);
    
    // Keep only last 1000 requests
    if (this.requestHistory.length > 1000) {
      this.requestHistory = this.requestHistory.slice(-1000);
    }

    // Alert on slow requests
    if (request.duration > 5000) {
      console.warn(`Slow network request: ${request.url} took ${request.duration.toFixed(2)}ms`);
    }
  }

  private startNetworkMonitoring(): void {
    setInterval(() => {
      const recentRequests = this.getRecentRequests(60000); // Last minute
      const avgDuration = recentRequests.reduce((sum, req) => sum + req.duration, 0) / recentRequests.length;
      
      if (avgDuration > 3000) {
        console.warn(`High average network latency: ${avgDuration.toFixed(2)}ms`);
      }
    }, 60000); // Check every minute
  }

  public getRecentRequests(timeWindow: number): NetworkRequest[] {
    const now = Date.now();
    return this.requestHistory.filter(req => now - req.timestamp <= timeWindow);
  }

  public getNetworkStats() {
    const recent = this.getRecentRequests(5 * 60 * 1000); // Last 5 minutes
    
    return {
      totalRequests: this.requestHistory.length,
      recentRequests: recent.length,
      averageDuration: recent.reduce((sum, req) => sum + req.duration, 0) / recent.length || 0,
      cacheHitRate: recent.filter(req => req.cached).length / recent.length || 0,
      errorRate: recent.filter(req => req.retries > 0).length / recent.length || 0,
      totalDataTransferred: recent.reduce((sum, req) => sum + req.size, 0)
    };
  }

  public preloadCriticalResources(urls: string[]): void {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requestHistory = [];
    this.pendingRequests.clear();
  }
}

export const networkOptimizer = NetworkOptimizer.getInstance();