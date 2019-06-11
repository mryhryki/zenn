const CacheVersion = "2019-06-11T11:29:17.395Z";
const UrlsToCache = ["./"];

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
          console.log("Cache delete:", key);
          caches.delete(key);
        }
      });
    }),
  );
});

self.addEventListener("message", (event) => {
  console.log("Message Received:", event);
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    new Promise((resolve) => {
      caches.match(event.request).then((cacheResponse) => {
        if (cacheResponse) {
          resolve(cacheResponse);
          return;
        }

        const fetchRequest = event.request.clone();
        fetch(fetchRequest)
          .then((fetchResponse) => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== "basic") {
              resolve(fetchResponse);
              return;
            }

            const responseToCache = fetchResponse.clone();
            caches.open(CacheVersion).then((cache) => {
              cache.put(event.request, responseToCache);
              resolve(fetchResponse);
            });
          })
          .catch(() => {
            resolve();
          });
      });
    }),
  );
});

self.addEventListener("push", (event) => {
  const dataText = event.data.text();
  console.log("[ServiceWorker] Push Received.");
  console.log(`[ServiceWorker] Push had this data: "${dataText}"`);

  const title = "Push Test";
  const options = {
    body: dataText,
    icon: "/favicon.ico",
    // badge: 'badge.png', // Android only
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("sync", (event) => {
  console.log("sync:", event);
  if (event == null || typeof event.tag !== "string" || !event.tag.match(/^background-sync:\d+$/)) {
    return;
  }

  const id = parseInt(event.tag.substr(16), 10);
  const dbOpenRequest = indexedDB.open("service_worker", 1);
  dbOpenRequest.onerror = (error) => console.error("Fail open DB:", error);

  dbOpenRequest.onsuccess = (dbOpenEvent) => {
    const db = dbOpenEvent.target.result;
    const transaction = db.transaction(["background_sync"], "readonly");
    transaction.onerror = (error) => console.error("Failed:", error);

    const getRequest = transaction.objectStore("background_sync").get(id);
    getRequest.onerror = (error) => console.error("Failed:", error);

    getRequest.onsuccess = (event) => {
      const syncData = event.target.result;
      const { path, result } = syncData;
      if (result !== "") {
        return;
      }

      fetch(path, { method: "GET" })
        .then((response) => response.text())
        .then((text) => {
          const transaction = db.transaction(["background_sync"], "readwrite");
          transaction.onerror = (error) => console.error("Failed:", error);

          syncData.result = text;
          const putRequest = transaction.objectStore("background_sync").put(syncData);
          putRequest.onerror = (error) => console.error("Failed:", error);
          putRequest.onsuccess = () => console.log("Complete sync:", syncData);
        });
    };
  };
});
