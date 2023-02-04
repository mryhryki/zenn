const CacheName = "v1";

// https://jakearchibald.com/2014/offline-cookbook/#network-falling-back-to-cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (event.request.method !== "GET") {
        return fetch(event.request);
      }
      const cache = await caches.open(CacheName);
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        return caches.match(event.request);
      }
    })(),
  );
});
