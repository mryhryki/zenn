const CacheName = 'v1.0.0';
const UrlsToCache = ['/', '/index.js', '/common.js', '/favicon.ico'];

self.addEventListener('install', (event) => {
  console.log('ServiceWorker installing.');
  event.waitUntil(
    caches.open(CacheName)
          .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(UrlsToCache);
          }),
  );
});

self.addEventListener('activate', () => {
  console.log('ServiceWorker activating.');
});

self.addEventListener('message', (event) => {
  console.log('Message Received:', event);
});

self.addEventListener('fetch', (event) => {
  event.respondWith(new Promise((resolve) => {
      // キャッシュがあった場合は、キャッシュの内容を返す。
      caches.match(event.request)
            .then((cacheResponse) => {
              if (cacheResponse) {
                resolve(cacheResponse);
                return;
              }

              // 重要：リクエストを clone する。
              // リクエストは Stream なので一度しか処理できない。
              // ここではキャッシュ用、fetch 用と２回必要なので、リクエストは clone しないといけない。
              const fetchRequest = event.request.clone();
              fetch(fetchRequest).then((fetchResponse) => {
                // レスポンスが正しくない場合はそのまま返却
                if (!fetchResponse ||
                    fetchResponse.status !== 200 ||
                    fetchResponse.type !== 'basic') {
                  resolve(fetchResponse);
                  return;
                }

                // 重要：レスポンスを clone する。
                // レスポンスは Stream でブラウザ用とキャッシュ用の２回必要。
                // なので clone して２つの Stream があるようにする。
                const responseToCache = fetchResponse.clone();
                caches.open(CacheName).then((cache) => {
                  cache.put(event.request, responseToCache);
                  resolve(fetchResponse);
                });
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
    // icon: 'images/icon.png',
    // badge: 'images/badge.png', // Android only
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
