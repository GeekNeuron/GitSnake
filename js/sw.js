self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('gitsnake-v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/style.css',
      '/script.js',
      '/js/engine.js',
      '/js/controls.js',
      '/js/ui.js',
      '/js/powerups.js',
      '/js/particles.js',
      '/favicon.ico',
      '/manifest.json'
    ]))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
