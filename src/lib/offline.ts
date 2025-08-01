// Offline Support and Network Management for Biowell

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
}

// Network status monitoring
export const useNetworkStatus = () => {
  const getNetworkStatus = (): NetworkStatus => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    return {
      isOnline: navigator.onLine,
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
    };
  };

  return getNetworkStatus();
};

// Offline data management
export const offlineManager = {
  // Queue for offline actions
  actionQueue: [] as Array<{ type: string; data: any; timestamp: number }>,

  // Add action to queue when offline
  queueAction: (type: string, data: any) => {
    offlineManager.actionQueue.push({
      type,
      data,
      timestamp: Date.now()
    });
    localStorage.setItem('biowell_offline_queue', JSON.stringify(offlineManager.actionQueue));
  },

  // Process queued actions when back online
  processQueue: async () => {
    const queue = offlineManager.actionQueue;
    offlineManager.actionQueue = [];
    localStorage.removeItem('biowell_offline_queue');

    for (const action of queue) {
      try {
        await offlineManager.processAction(action);
      } catch (error) {
        console.error('Failed to process offline action:', action, error);
      }
    }
  },

  // Process individual action
  processAction: async (action: { type: string; data: any }) => {
    switch (action.type) {
      case 'chat_message':
        // Process offline chat messages
        break;
      case 'health_metric':
        // Process offline health data
        break;
      case 'food_log':
        // Process offline food logs
        break;
      default:
        console.warn('Unknown offline action type:', action.type);
    }
  },

  // Load queue from storage
  loadQueue: () => {
    try {
      const stored = localStorage.getItem('biowell_offline_queue');
      if (stored) {
        offlineManager.actionQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  },

  // Initialize offline support
  init: () => {
    offlineManager.loadQueue();
    
    window.addEventListener('online', () => {
      console.log('Back online - processing queued actions');
      offlineManager.processQueue();
    });

    window.addEventListener('offline', () => {
      console.log('Gone offline - queuing actions');
    });
  }
};

// Offline storage for critical data
export const offlineStorage = {
  // Store user profile for offline access
  storeProfile: (profile: any) => {
    localStorage.setItem('biowell_offline_profile', JSON.stringify(profile));
  },

  getProfile: () => {
    try {
      const stored = localStorage.getItem('biowell_offline_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Store recent health metrics
  storeHealthMetrics: (metrics: any[]) => {
    localStorage.setItem('biowell_offline_metrics', JSON.stringify(metrics.slice(0, 50)));
  },

  getHealthMetrics: () => {
    try {
      const stored = localStorage.getItem('biowell_offline_metrics');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Store chat history
  storeChatHistory: (messages: any[]) => {
    localStorage.setItem('biowell_offline_chat', JSON.stringify(messages.slice(-100)));
  },

  getChatHistory: () => {
    try {
      const stored = localStorage.getItem('biowell_offline_chat');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Clear all offline data
  clear: () => {
    ['biowell_offline_profile', 'biowell_offline_metrics', 'biowell_offline_chat']
      .forEach(key => localStorage.removeItem(key));
  }
};

// Service Worker registration
export const registerServiceWorker = async () => {
  // Check if running in StackBlitz environment
  const isStackBlitz = window.self !== window.top || 
                      window.location.hostname.includes('stackblitz.io') ||
                      window.location.hostname.includes('webcontainer');
  
  if (isStackBlitz) {
    console.warn('Service Workers are not supported in StackBlitz environment');
    return null;
  }

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};