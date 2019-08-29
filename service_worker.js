const CacheVersion = "2019-08-29T10:43:34+09:00";
const UrlsToCache = ["/"];

self.addEventListener("install", (event) => {
  console.log("ServiceWorker installing.");
  event.waitUntil(
    caches
      .open(CacheVersion)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(UrlsToCache);
      })
      .then(self.skipWaiting),
  );
});

self.addEventListener("activate", (event) => {
  console.log("ServiceWorker activating.");
  event.waitUntil(
    caches.keys().then((keyList) => {
      keyList.forEach((key) => {
        if (CacheVersion !== key) {
          caches.delete(key).then(() => {
            console.log("Cache deleted:", key);
          });
        }
      });
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    new Promise((resolve) => {
      const { request } = event;
      caches.match(request).then((cache) => {
        fetch(request)
          .then((response) => {
            if (response != null && response.status === 200 && response.type === "basic") {
              caches.open(CacheVersion).then((cache) => {
                cache.put(event.request, response.clone());
                resolve(response);
              });
            } else {
              resolve(cache);
            }
          })
          .catch((err) => {
            resolve(cache);
          });
      });
    }),
  );
});
