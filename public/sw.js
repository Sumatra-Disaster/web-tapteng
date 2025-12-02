// Service Worker for Info Bencana Tapteng PWA
// Cache version - Update this timestamp when deploying to invalidate cache
const CACHE_VERSION = '2025-01-15-v1';
const CACHE_NAME = `info-bencana-tapteng-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `info-bencana-data-${CACHE_VERSION}`;

// Install event - cache essential resources
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll([
          '/',
          '/favicon.ico',
          '/logo-tapteng.png',
          '/android-chrome-192x192.png',
          '/android-chrome-512x512.png',
        ]);
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            // Delete old caches that match our pattern
            if (
              (cacheName.startsWith('info-bencana-tapteng-') ||
                cacheName.startsWith('info-bencana-data-')) &&
              cacheName !== CACHE_NAME &&
              cacheName !== DATA_CACHE_NAME
            ) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle data API endpoints - network first with cache fallback
  if (url.pathname === '/api/data') {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(function (cache) {
        // Try network first for fresh data
        return fetch(event.request)
          .then(function (networkResponse) {
            // Cache successful responses
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(function () {
            // Network failed - return cached data if available
            return cache.match(event.request).then(function (cachedResponse) {
              if (cachedResponse) {
                // Add header to indicate it's cached data
                const headers = new Headers(cachedResponse.headers);
                headers.set('X-Cached-Data', 'true');
                return new Response(cachedResponse.body, {
                  status: cachedResponse.status,
                  statusText: cachedResponse.statusText,
                  headers: headers,
                });
              }
              // No cached data available
              return new Response(
                JSON.stringify({ error: 'No cached data available', offline: true }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' },
                },
              );
            });
          });
      }),
    );
    return;
  }

  // Handle HTML pages - stale-while-revalidate strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (cachedResponse) {
          // Try to fetch fresh version
          const fetchPromise = fetch(event.request)
            .then(function (networkResponse) {
              // Update cache with fresh HTML (which includes embedded data)
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(function () {
              // Network failed - return cached version if available
              if (cachedResponse) {
                return cachedResponse;
              }
              return new Response('Offline - Konten tidak tersedia', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
              });
            });

          // Return cached version immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      }),
    );
    return;
  }

  // For static assets (images, fonts, etc.) - cache first strategy
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$/i)) {
    event.respondWith(
      caches.match(event.request).then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(function (networkResponse) {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      }),
    );
    return;
  }

  // Default: network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Clone the response
        const responseToCache = response.clone();
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(function () {
        // Return from cache if network fails
        return caches.match(event.request).then(function (response) {
          if (response) {
            return response;
          }
          // Return offline message if no cache
          return new Response('Offline - Konten tidak tersedia', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      }),
  );
});

// Push notification event
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Notifikasi baru dari Info Bencana Tapteng',
      icon: data.icon || '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        url: data.url || '/',
      },
      tag: data.tag || 'info-bencana',
      requireInteraction: data.requireInteraction || false,
    };
    event.waitUntil(
      self.registration.showNotification(data.title || 'Info Bencana Tapteng', options),
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // Check if there is already a window/tab open with the target URL
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if ('focus' in client && client.url.includes(urlToOpen)) {
            return client.focus();
          }
        }
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

// Background sync for data refresh (when supported)
self.addEventListener('sync', function (event) {
  if (event.tag === 'refresh-data') {
    event.waitUntil(
      fetch('/api/data')
        .then(function (response) {
          if (response.ok) {
            return response.json().then(function (data) {
              // Update data cache
              return caches.open(DATA_CACHE_NAME).then(function (cache) {
                return cache.put(new Request('/api/data'), new Response(JSON.stringify(data)));
              });
            });
          }
        })
        .catch(function (error) {
          console.log('Background sync failed:', error);
        }),
    );
  }
});
