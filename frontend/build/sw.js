const CACHE_NAME = 'agromind-v1.0.0';
const STATIC_CACHE = 'agromind-static-v1.0.0';
const DYNAMIC_CACHE = 'agromind-dynamic-v1.0.0';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/weather/',
  '/api/market/',
  '/api/crops/',
  '/api/diseases/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and chrome extensions
  if (!url.origin.includes(self.location.origin) || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request));
  }
});

// Handle GET requests with appropriate caching strategy
async function handleGetRequest(request) {
  const url = new URL(request.url);
  
  // API requests - Network First strategy with offline fallback
  if (isApiRequest(url.pathname)) {
    return handleApiRequest(request);
  }
  
  // Static assets - Cache First strategy
  if (isStaticAsset(url.pathname)) {
    return handleStaticAsset(request);
  }
  
  // HTML pages - Network First with cache fallback
  if (isHtmlRequest(request)) {
    return handleHtmlRequest(request);
  }
  
  // Default - try network first, then cache
  return handleDefaultRequest(request);
}

// Network First strategy for API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for API request, trying cache...');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Add offline indicator to response headers
      const response = cachedResponse.clone();
      response.headers.set('X-Served-From', 'cache');
      return response;
    }
    
    // Return offline fallback for specific endpoints
    return getOfflineFallback(request);
  }
}

// Cache First strategy for static assets
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch and cache
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static asset:', error);
    throw error;
  }
}

// Network First for HTML pages
async function handleHtmlRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cached version
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/');
  }
}

// Default request handler
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isApiRequest(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pathname.includes(pattern));
}

function isStaticAsset(pathname) {
  return pathname.includes('/static/') || 
         pathname.endsWith('.js') || 
         pathname.endsWith('.css') || 
         pathname.endsWith('.png') || 
         pathname.endsWith('.jpg') || 
         pathname.endsWith('.ico');
}

function isHtmlRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Offline fallbacks for different API endpoints
function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  if (url.pathname.includes('/api/weather/')) {
    return new Response(JSON.stringify({
      success: true,
      data: {
        location: 'Offline Mode',
        temperature: 25,
        humidity: 60,
        condition: 'offline',
        forecast: []
      },
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname.includes('/api/market/')) {
    return new Response(JSON.stringify({
      success: true,
      data: [],
      offline: true,
      message: 'Market data unavailable offline'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname.includes('/api/crops/')) {
    return new Response(JSON.stringify({
      success: true,
      data: [],
      offline: true,
      message: 'Crop data unavailable offline'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Generic offline response
  return new Response(JSON.stringify({
    success: false,
    message: 'This feature requires internet connection',
    offline: true
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Performing background sync...');
  
  try {
    // Sync cached data when connection is restored
    // You can implement specific sync logic here
    
    // Notify clients that sync is complete
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          message: 'Data synchronized successfully'
        });
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/favicon.ico',
    tag: data.tag || 'agromind-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_DATA':
      cacheData(data);
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

// Cache specific data
async function cacheData(data) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Cache weather data
  if (data.weather) {
    await cache.put('/api/weather/current', new Response(JSON.stringify(data.weather)));
  }
  
  // Cache market data
  if (data.market) {
    await cache.put('/api/market/prices', new Response(JSON.stringify(data.market)));
  }
}

console.log('AgroMind Service Worker loaded successfully!');
