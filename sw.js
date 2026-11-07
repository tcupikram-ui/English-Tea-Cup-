/* Minimal service worker — enables "Install app" for the Tea Cup hub.
   Network-first: it never serves stale content. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request).catch(function () { return Response.error(); }));
});
