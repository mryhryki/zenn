self.addEventListener("install", (event) => {
  console.log("ServiceWorker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("ServiceWorker activating.");
});

self.addEventListener("message", (event) => {
  console.log("Message Received:", event);
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
