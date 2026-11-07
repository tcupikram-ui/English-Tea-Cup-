/* Service worker — enables "Install app" for the Tea Cup hub.
   Network-first: it never caches content, so it can never serve stale
   icons or manifest. On activate it clears any old caches. */
var CACHE_VERSION = 'tea-cup-v2';

self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request).catch(function () { return Response.error(); }));
});
