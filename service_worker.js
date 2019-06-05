const CacheVersion = '2019-06-05T11:49:17.856Z';
const UrlsToCache = [
  '/',
  '/blog/',
  '/assets/fonts/MPLUS1p-Regular.woff',
  '/assets/fonts/SourceCodePro-Regular.woff',
  '/assets/fonts/Ubuntu-Regular.woff',
];

self.addEventListener('install', (event) => {
  console.log('ServiceWorker installing.');
  event.waitUntil(
    caches
      .open(CacheVersion)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(UrlsToCache);
      })
      .then(self.skipWaiting),
  );
});

self.addEventListener('activate', (event) => {
  console.log('ServiceWorker activating.');
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        keyList.forEach((key) => {
          if (CacheVersion !== key) {
            console.log('Cache delete:', key);
            caches.delete(key);
          }
        });
      }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(new Promise((resolve) => {
      caches
        .match(event.request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            resolve(cacheResponse);
            return;
          }

          const fetchRequest = event.request.clone();
          fetch(fetchRequest).then((fetchResponse) => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              resolve(fetchResponse);
              return;
            }

            const responseToCache = fetchResponse.clone();
            caches.open(CacheVersion).then((cache) => {
              cache.put(event.request, responseToCache);
              resolve(fetchResponse);
            });
          }).catch(() => {
            resolve();
          });
        });
    },
  ));
});
