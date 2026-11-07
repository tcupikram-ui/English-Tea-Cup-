/* Service worker — enables "Install app" for the Tea Cup hub.
   Pre-caches only the versioned splash logo (immutable); everything else
   is network-first so it never serves stale icons or manifest.
   Version bumped to clear any old caches. */
var CACHE_VERSION = 'tea-cup-v3';
var PRECACHE = ['/images/splash-logo-v2.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (c) {
      return c.addAll(PRECACHE).catch(function () { return Promise.resolve(); });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var path = new URL(e.request.url).pathname;
  // Cache-first for the versioned splash logo (instant, and it never changes).
  if (PRECACHE.indexOf(path) !== -1) {
    e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
    return;
  }
  // Network-first for everything else.
  e.respondWith(fetch(e.request).catch(function () { return Response.error(); }));
});
