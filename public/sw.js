// public/sw.js - Service Worker für Performance
// ✅ Aggressive Caching-Strategie
// ✅ Offline-Unterstützung für bessere UX

const CACHE_NAME = 'maier-value-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Dateien die sofort gecacht werden sollen
const STATIC_ASSETS = [
  '/',
  '/strategische-unternehmensentwicklung',
  '/vertriebsoptimierung', 
  '/marketing-strategien',
  '/wertanalyse',
  '/kontakt',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg'
];

// Assets die bei Bedarf gecacht werden
const DYNAMIC_ASSETS = [
  '/impressum',
  '/datenschutz'
];

// Installation - Static Assets cachen
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Aktivierung - Alte Caches löschen
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map(cacheName => {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch - Intelligent Caching Strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Nur GET-Requests cachen
  if (request.method !== 'GET') return;
  
  // Externe APIs nicht cachen
  if (!url.origin.includes('maier-value.com') && 
      !url.origin.includes('localhost')) {
    return;
  }
  
  event.respondWith(
    // 1. Cache-First für Static Assets
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Im Hintergrund aktualisieren
          updateCache(request);
          return cachedResponse;
        }
        
        // 2. Network-First für Dynamic Content
        return fetch(request)
          .then(networkResponse => {
            // Erfolgreiche Antwort cachen
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              
              caches.open(getDynamicCacheName(request))
                .then(cache => {
                  cache.put(request, responseClone);
                });
            }
            
            return networkResponse;
          })
          .catch(error => {
            console.log('SW: Network failed, trying cache:', error);
            
            // 3. Fallback für Offline
            return caches.match(request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                
                // Offline-Seite für Navigation
                if (request.destination === 'document') {
                  return caches.match('/offline.html');
                }
                
                // Fallback-Bild für Images
                if (request.destination === 'image') {
                  return new Response(
                    '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Bild offline</text></svg>',
                    { headers: { 'Content-Type': 'image/svg+xml' } }
                  );
                }
              });
          });
      })
  );
});

// Hilfsfunktionen
function updateCache(request) {
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        caches.open(getDynamicCacheName(request))
          .then(cache => {
            cache.put(request, response);
          });
      }
    })
    .catch(() => {
      // Stille Fehler bei Background-Updates
    });
}

function getDynamicCacheName(request) {
  const url = new URL(request.url);
  
  // CSS/JS Assets länger cachen
  if (url.pathname.includes('/_astro/') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js')) {
    return STATIC_CACHE;
  }
  
  // Bilder separater Cache
  if (request.destination === 'image') {
    return 'images-v1.0.0';
  }
  
  return DYNAMIC_CACHE;
}

// Background Sync für Kontaktformular (falls implementiert)
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Hier würdest du gespeicherte Formulardaten senden
      syncContactForm()
    );
  }
});

function syncContactForm() {
  // Implementation für Offline-Formulare
  return Promise.resolve();
}