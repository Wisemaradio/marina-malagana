self.addEventListener('install', function(event) {
    console.log('Service Worker instalado');

    event.waitUntil(
        caches.open('radio-cache-v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/logo.jpg',
                '/banner.jpg'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activado');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== 'radio-cache-v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {

    // ❌ NO cachear el streaming
    if (event.request.url.includes('/listen/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});