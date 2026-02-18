/* ============================================
   Daily Oasis - Service Worker
   ============================================ */

const CACHE_NAME = 'daily-oasis-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './css/dark-mode.css',
    './css/responsive.css',
    './js/app.js',
    './js/storage.js',
    './js/colors.js',
    './js/search.js',
    './js/dragdrop.js',
    './js/ui.js',
    './js/settings.js',
    './manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS).catch((error) => {
                    console.warn('[Service Worker] Failed to cache some assets:', error);
                    // Continue even if some assets fail to cache
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests (e.g., Font Awesome CDN)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }

                // Otherwise, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cache successful responses
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        console.warn('[Service Worker] Fetch failed for:', event.request.url);
                        // Return offline page or cached version if available
                        return caches.match('./index.html');
                    });
            })
    );
});

// Background sync (optional - for future features)
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
});

// Push notifications (optional - for future features)
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push notification received');
});

console.log('[Service Worker] Loaded');
