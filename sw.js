const CACHE_NAME = 'marina-malagana-v2';

const urlsToCache = [
  '/index.html',
  '/logo.jpg',
  '/banner.jpg',
  '/manifest.json'
];

// INSTALAR
self.addEventListener('install', event => {
  console.log('Service Worker instalado');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );

  self.skipWaiting(); // 🔥 fuerza actualización
});

// ACTIVAR
self.addEventListener('activate', event => {
  console.log('Service Worker activado');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim(); // 🔥 toma control inmediato
});

// FETCH
self.addEventListener('fetch', event => {

  const url = event.request.url;

  // ❌ NO cachear streaming ni API
  if (
    url.includes('/listen/') ||
    url.includes('/api/') ||
    url.includes('.mp3')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});