self.addEventListener('install', (event) => {
  console.log('ServiceWorker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('ServiceWorker activating.');
  event.waitUntil(
    caches.keys().then((keyList) => {
      keyList.forEach((key) => {
        console.log('Cache delete:', key);
        caches.delete(key);
      });
    }),
  );
});
