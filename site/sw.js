const CacheName = "v1";

// https://jakearchibald.com/2014/offline-cookbook/#stale-while-revalidate
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (event.request.method !== "GET") {
        return fetch(event.request)
      }
      const cache = await caches.open(CacheName);
      const cachedResponse = await cache.match(event.request);
      const networkResponsePromise = fetch(event.request);
      event.waitUntil(
        (async () => {
          const networkResponse = await networkResponsePromise;
          await cache.put(event.request, networkResponse.clone());
        })()
      );
      return cachedResponse || networkResponsePromise;
    })()
  );
});
