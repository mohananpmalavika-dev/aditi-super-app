/**
 * Aditi Super App — Production Service Worker
 * Multi-Strategy Caching Engine:
 * - HTML Navigation: NetworkFirst
 * - Bundled Hashed JS/CSS Assets: CacheFirst
 * - Images/Media: StaleWhileRevalidate
 * - Auth & Supabase APIs: NetworkOnly (NEVER cache private user data or credentials)
 */

const CACHE_NAME_STATIC = 'aditi-static-v2';
const CACHE_NAME_IMAGES = 'aditi-images-v2';
const CACHE_NAME_PAGES = 'aditi-pages-v2';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(STATIC_PRECACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME_STATIC, CACHE_NAME_IMAGES, CACHE_NAME_PAGES];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. RULE: NEVER cache Auth or Remote Supabase API requests (Strict NetworkOnly)
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/auth') ||
    event.request.headers.get('Authorization')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. RULE: Static Bundled Hashed Assets (JS, CSS, Web Fonts) -> CacheFirst
  if (
    url.pathname.startsWith('/assets/') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME_STATIC).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse || new Response('', { status: 408, statusText: 'Network Timeout' }));
        });
      })
    );
    return;
  }

  // 3. RULE: Images -> StaleWhileRevalidate
  if (
    event.request.destination === 'image' ||
    url.hostname.includes('images.unsplash.com') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME_IMAGES).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 4. RULE: HTML Navigation Requests -> NetworkFirst with offline cache fallback
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME_PAGES).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
