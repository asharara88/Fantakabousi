// Analytics and tracking utilities

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;
  private enabled = true;

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private constructor() {
    this.setupGlobalTracking();
  }

  private setupGlobalTracking(): void {
    // Track page views
    if (typeof window !== 'undefined') {
      // Track initial page load
      this.track('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      });

      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        this.track('page_visibility_change', {
          visible: !document.hidden,
        });
      });
    }
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public track(eventName: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      },
      timestamp: Date.now(),
      userId: this.userId || undefined,
    };

    this.events.push(event);

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }

    // Send to external analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(event);
    }
  }

  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // In a real implementation, send to your analytics service
      // Example: Google Analytics, Mixpanel, Amplitude, etc.
      
      // For now, just log to console
      console.log('Would send to analytics:', event);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  // Convenience methods for common events
  public trackPageView(page: string, properties?: Record<string, any>): void {
    this.track('page_view', { page, ...properties });
  }

  public trackUserAction(action: string, properties?: Record<string, any>): void {
    this.track('user_action', { action, ...properties });
  }

  public trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  public trackPerformance(metric: string, value: number, properties?: Record<string, any>): void {
    this.track('performance', {
      metric,
      value,
      ...properties,
    });
  }

  public trackFeatureUsage(feature: string, properties?: Record<string, any>): void {
    this.track('feature_usage', { feature, ...properties });
  }

  public trackConversion(event: string, value?: number, properties?: Record<string, any>): void {
    this.track('conversion', {
      conversion_event: event,
      value,
      ...properties,
    });
  }
}

// Export singleton instance
export const analytics = AnalyticsManager.getInstance();

// React hook for analytics
export const useAnalytics = () => {
  const track = (eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, properties);
  };

  const trackPageView = (page: string, properties?: Record<string, any>) => {
    analytics.trackPageView(page, properties);
  };

  const trackUserAction = (action: string, properties?: Record<string, any>) => {
    analytics.trackUserAction(action, properties);
  };

  const trackFeatureUsage = (feature: string, properties?: Record<string, any>) => {
    analytics.trackFeatureUsage(feature, properties);
  };

  return {
    track,
    trackPageView,
    trackUserAction,
    trackFeatureUsage,
  };
};

// Predefined event tracking functions
export const trackHealthMetricLogged = (metricType: string, source: string): void => {
  analytics.track('health_metric_logged', {
    metric_type: metricType,
    source,
  });
};

export const trackFoodLogged = (mealType: string, calories?: number): void => {
  analytics.track('food_logged', {
    meal_type: mealType,
    calories,
  });
};

export const trackChatMessage = (messageLength: number, responseTime?: number): void => {
  analytics.track('chat_message_sent', {
    message_length: messageLength,
    response_time: responseTime,
  });
};

export const trackSupplementAdded = (supplementName: string, price: number): void => {
  analytics.track('supplement_added_to_cart', {
    supplement_name: supplementName,
    price,
  });
};

export const trackDeviceConnected = (deviceType: string, provider: string): void => {
  analytics.track('device_connected', {
    device_type: deviceType,
    provider,
  });
};

export const trackOnboardingStep = (step: number, completed: boolean): void => {
  analytics.track('onboarding_step', {
    step,
    completed,
  });
};

export const trackSearchQuery = (query: string, resultCount: number): void => {
  analytics.track('search_performed', {
    query,
    result_count: resultCount,
  });
};