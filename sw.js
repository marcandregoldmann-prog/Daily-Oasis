const CACHE_NAME = 'daily-oasis-v2';
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
    './js/icon-detector.js',
    './manifest.json',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
