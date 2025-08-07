// Service Worker for offline functionality and caching
const CACHE_NAME = 'biowell-v1.0.0';
const STATIC_CACHE = 'biowell-static-v1.0.0';
const API_CACHE = 'biowell-api-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS and JS files
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/functions/v1/openai-chat',
  '/functions/v1/nutrition-analysis',
  '/functions/v1/spoonacular-recipes',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('biowell-') && 
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== API_CACHE
            )
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/functions/v1/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
  }
});

async function handleApiRequest(request: Request): Promise<Response> {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first for API requests
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for critical endpoints
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature requires an internet connection',
        cached: false
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleStaticRequest(request: Request): Promise<Response> {
  const cache = await caches.open(STATIC_CACHE);
  
  // Try cache first for static assets
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fetch from network
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Background sync for health data
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'health-data-sync') {
    event.waitUntil(syncHealthData());
  }
});

async function syncHealthData() {
  // Sync pending health data when connection is restored
  const pendingData = await getStoredHealthData();
  
  for (const data of pendingData) {
    try {
      await fetch('/functions/v1/health-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Remove from local storage after successful sync
      await removeStoredHealthData(data.id);
    } catch (error) {
      console.error('Failed to sync health data:', error);
    }
  }
}

async function getStoredHealthData(): Promise<any[]> {
  // Implementation would read from IndexedDB
  return [];
}

async function removeStoredHealthData(id: string): Promise<void> {
  // Implementation would remove from IndexedDB
}