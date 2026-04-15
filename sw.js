const CACHE_NAME = 'datvex-prompt-lab-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png'
];

// Install — precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('SW install: failed to cache static assets', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for static, network-first for JSON data
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Static assets — cache first
  if (STATIC_ASSETS.some((url) => request.url.endsWith(url.replace('/', ''))) ||
      request.url.includes('cdn.tailwindcss.com') ||
      request.url.includes('fonts.googleapis.com') ||
      request.url.includes('fonts.gstatic.com') ||
      request.url.includes('unpkg.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // JSON data (prompts, categories, tags) — network first, fallback to cache
  if (request.url.includes('raw.githubusercontent.com') && request.url.endsWith('.json')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Everything else — network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
