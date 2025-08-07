interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: any) => string;
}

class RateLimiter {
  private requests = new Map<string, number[]>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Cleanup old entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  public isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get existing requests for this key
    const keyRequests = this.requests.get(key) || [];
    
    // Filter out old requests
    const recentRequests = keyRequests.filter(time => time > windowStart);
    
    // Check if under limit
    if (recentRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return true;
  }

  public getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const keyRequests = this.requests.get(key) || [];
    const recentRequests = keyRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.config.maxRequests - recentRequests.length);
  }

  public getResetTime(key: string): number {
    const keyRequests = this.requests.get(key) || [];
    if (keyRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...keyRequests);
    return oldestRequest + this.config.windowMs;
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.config.windowMs;
    
    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => time > cutoff);
      
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

// Rate limiters for different API endpoints
export const chatRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute
});

export const nutritionRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50, // 50 requests per minute
});

export const generalRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
});

// Middleware for API calls
export const withRateLimit = async <T>(
  rateLimiter: RateLimiter,
  key: string,
  operation: () => Promise<T>
): Promise<T> => {
  if (!rateLimiter.isAllowed(key)) {
    const resetTime = rateLimiter.getResetTime(key);
    const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
    
    throw new Error(`Rate limit exceeded. Try again in ${waitTime} seconds.`);
  }
  
  return operation();
};