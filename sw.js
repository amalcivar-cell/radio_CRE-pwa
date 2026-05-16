const CACHE_NAME = 'radio-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y guardar la interfaz en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia de caché: Primero la Red, si falla, la Caché
self.addEventListener('fetch', (e) => {
  // Ignorar peticiones de audio streaming para que no rompa el caché
  if (e.request.url.includes('stream') || e.request.destination === 'audio') {
    return;
  }
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
