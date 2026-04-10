const CACHE_NAME = 'marina-malagana-v3';

// INSTALAR
self.addEventListener('install', event => {
  self.skipWaiting();
});

// ACTIVAR
self.addEventListener('activate', event => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {

  const url = event.request.url;

  // ❌ NO tocar streaming ni metadata (CLAVE)
  if (
    url.includes('/listen/') ||
    url.includes('/api/') ||
    url.includes('.mp3') ||
    url.includes('nowplaying')
  ) {
    return;
  }

  // Solo fallback básico
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );

});