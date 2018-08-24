const CacheName = 'v0.1.3';
const UrlsToCache = ['/', '/index.js', '/common.js', '/favicon.ico'];

self.addEventListener('install', (event) => {
  console.log('ServiceWorker installing.');
  event.waitUntil(
    caches
      .open(CacheName)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(UrlsToCache);
      }),
  );
});

self.addEventListener('activate', (event) => {
  console.log('ServiceWorker activating.');
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        keyList.forEach((key) => {
          if (CacheName !== key) {
            console.log('Cache delete:', key);
            caches.delete(key);
          }
        });
      }),
  );
});

self.addEventListener('message', (event) => {
  console.log('Message Received:', event);
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
          // const fetchRequest = event.request.clone();
          fetch(event.request).then((fetchResponse) => {
            resolve(fetchResponse);
            // if (!fetchResponse ||
            //     fetchResponse.status !== 200 ||
            //     fetchResponse.type !== 'basic') {
            //   resolve(fetchResponse);
            //   return;
            // }
            //
            // const responseToCache = fetchResponse.clone();
            // caches.open(CacheName).then((cache) => {
            //   cache.put(event.request, responseToCache);
            resolve(fetchResponse);
            // });
          });
        });
    },
  ));
});

self.addEventListener('push', (event) => {
  const dataText = event.data.text();
  console.log('[ServiceWorker] Push Received.');
  console.log(`[ServiceWorker] Push had this data: "${dataText}"`);

  const title = 'Push Test';
  const options = {
    body: dataText,
    icon: '/favicon.ico',
    // badge: 'badge.png', // Android only
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('sync', (event) => new Promise(() => {
  if (event != null && typeof event.tag === 'string') {
    const tag = event.tag;
    if (tag.match(/^background-sync:\d+$/)) {
      const id = parseInt(tag.substr(16), 10);
      console.log('sync:', id);
      //       const syncData = await getBackgroundSyncRow(id);
      // const { path, body, result } = syncData;
      //   if (result === '') {
      //     const response = await fetch(path, { method: 'POST', body });
      //     syncData.result = await response.text();
      //     await updateBackgroundSyncRow(id, syncData);
      //   }
    }
  }
}));
