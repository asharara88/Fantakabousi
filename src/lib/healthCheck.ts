interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: string;
  timestamp: string;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: HealthCheckResult[];
  uptime: number;
  version: string;
}

class HealthChecker {
  private static instance: HealthChecker;
  private startTime = Date.now();

  static getInstance(): HealthChecker {
    if (!HealthChecker.instance) {
      HealthChecker.instance = new HealthChecker();
    }
    return HealthChecker.instance;
  }

  async checkSystemHealth(): Promise<SystemHealth> {
    const services = await Promise.all([
      this.checkSupabase(),
      this.checkOpenAI(),
      this.checkElevenLabs(),
      this.checkSpoonacular(),
      this.checkFrontend(),
    ]);

    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyServices > 0) {
      overall = 'unhealthy';
    } else if (degradedServices > 1) {
      overall = 'degraded';
    }

    return {
      overall,
      services,
      uptime: Date.now() - this.startTime,
      version: '1.0.0',
    };
  }

  private async checkSupabase(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });

      const responseTime = performance.now() - startTime;
      
      return {
        service: 'Supabase',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime,
        details: response.ok ? 'Database connection successful' : `HTTP ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: 'Supabase',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        details: error instanceof Error ? error.message : 'Connection failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkOpenAI(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      // Check if API key is configured
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        return {
          service: 'OpenAI',
          status: 'degraded',
          responseTime: 0,
          details: 'API key not configured',
          timestamp: new Date().toISOString(),
        };
      }

      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
      });

      const responseTime = performance.now() - startTime;
      
      return {
        service: 'OpenAI',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime,
        details: response.ok ? 'AI service available' : `HTTP ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: 'OpenAI',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        details: 'Service unavailable',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkElevenLabs(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      if (!import.meta.env.VITE_ELEVENLABS_API_KEY) {
        return {
          service: 'ElevenLabs',
          status: 'degraded',
          responseTime: 0,
          details: 'API key not configured',
          timestamp: new Date().toISOString(),
        };
      }

      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
        },
      });

      const responseTime = performance.now() - startTime;
      
      return {
        service: 'ElevenLabs',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime,
        details: response.ok ? 'TTS service available' : `HTTP ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: 'ElevenLabs',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        details: 'Service unavailable',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkSpoonacular(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      if (!import.meta.env.VITE_SPOONACULAR_API_KEY) {
        return {
          service: 'Spoonacular',
          status: 'degraded',
          responseTime: 0,
          details: 'API key not configured',
          timestamp: new Date().toISOString(),
        };
      }

      const response = await fetch(
        `https://api.spoonacular.com/recipes/random?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&number=1`
      );

      const responseTime = performance.now() - startTime;
      
      return {
        service: 'Spoonacular',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime,
        details: response.ok ? 'Recipe service available' : `HTTP ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: 'Spoonacular',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        details: 'Service unavailable',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkFrontend(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      // Check if critical resources are loaded
      const criticalResources = [
        'react',
        'react-dom',
        '@supabase/supabase-js'
      ];

      const missingResources = criticalResources.filter(resource => {
        try {
          require.resolve(resource);
          return false;
        } catch {
          return true;
        }
      });

      const responseTime = performance.now() - startTime;
      
      return {
        service: 'Frontend',
        status: missingResources.length === 0 ? 'healthy' : 'degraded',
        responseTime,
        details: missingResources.length === 0 
          ? 'All critical resources loaded' 
          : `Missing: ${missingResources.join(', ')}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: 'Frontend',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        details: 'Critical resources failed to load',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const healthChecker = HealthChecker.getInstance();

// React hook for health monitoring
export const useHealthCheck = () => {
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await healthChecker.checkSystemHealth();
        setHealth(result);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { health, loading };
};