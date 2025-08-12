// sw.js - Service Worker für maier-value.com
// Version: 1.0 - Performance & Offline Support
// WICHTIG: Diese Datei muss im /public/ Ordner liegen!

const CACHE_NAME = 'maier-value-v1.0';
const STATIC_CACHE = 'static-v1.0';
const DYNAMIC_CACHE = 'dynamic-v1.0';

// Dateien die sofort gecacht werden sollen
const STATIC_ASSETS = [
  '/',
  '/leistung/strategische-unternehmensentwicklung',
  '/leistung/vertriebsoptimierung', 
  '/leistung/marketing-strategien',
  '/leistung/wertanalyse',
  '/ueber-mich',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  // CSS und JavaScript werden automatisch erkannt
];

// URLs die nie gecacht werden sollen
const NEVER_CACHE = [
  '/api/',
  '/contact/send',
  '/admin/',
  '/_astro/',
  '.netlify'
];

// ===========================================
// SERVICE WORKER INSTALLATION
// ===========================================

self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting(); // Sofort aktivieren
      })
      .catch(error => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// ===========================================
// SERVICE WORKER ACTIVATION
// ===========================================

self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Alte Caches löschen
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        return self.clients.claim(); // Sofort alle Tabs übernehmen
      })
  );
});

// ===========================================
// FETCH EVENT HANDLER - CACHING STRATEGIEN
// ===========================================

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Nur GET-Requests cachen
  if (request.method !== 'GET') {
    return;
  }
  
  // Bestimmte URLs nie cachen
  if (NEVER_CACHE.some(pattern => url.pathname.startsWith(pattern))) {
    return;
  }
  
  // Verschiedene Caching-Strategien je nach Dateityp
  if (isStaticAsset(url)) {
    // STRATEGIE 1: Cache First für statische Assets
    event.respondWith(cacheFirst(request));
  } else if (isHTMLPage(url)) {
    // STRATEGIE 2: Network First für HTML-Seiten
    event.respondWith(networkFirst(request));
  } else if (isImage(url)) {
    // STRATEGIE 3: Cache First für Bilder mit Stale-While-Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // STRATEGIE 4: Network First als Fallback
    event.respondWith(networkFirst(request));
  }
});

// ===========================================
// CACHING STRATEGIES
// ===========================================

// Cache First - Für statische Assets (CSS, JS, Fonts)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Offline - Asset not available', { status: 503 });
  }
}

// Network First - Für HTML-Seiten und API-Calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Offline-Fallback für HTML-Seiten
    if (isHTMLPage(new URL(request.url))) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Offline - Dominik Maier</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
            .offline { max-width: 500px; margin: 0 auto; }
            .logo { color: #D2AE6C; font-size: 2rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <div class="offline">
            <div class="logo">⚡ Dominik Maier</div>
            <h1>Sie sind offline</h1>
            <p>Diese Seite ist derzeit nicht verfügbar. Bitte prüfen Sie Ihre Internetverbindung.</p>
            <button onclick="window.location.reload()">Erneut versuchen</button>
          </div>
        </body>
        </html>
      `, {
        status: 503,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate - Für Bilder
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function isStaticAsset(url) {
  return /\.(css|js|woff2?|ttf|eot)$/i.test(url.pathname);
}

function isHTMLPage(url) {
  return url.pathname.endsWith('/') || 
         url.pathname.endsWith('.html') || 
         !url.pathname.includes('.');
}

function isImage(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname);
}

// ===========================================
// BACKGROUND SYNC (für zukünftige Features)
// ===========================================

self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Hier könnten wir gespeicherte Formulardaten senden
  // wenn die Verbindung wieder da ist
  console.log('📡 Background Sync: Contact form data');
}