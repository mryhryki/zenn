const CacheVersion = '2019-01-07T12:53:02.514Z';
const UrlsToCache = [
  '/',
  '/blog/',
].concat(JSON.parse('["/assets/images/blog/portfolio/aws-route53.jpg","/assets/images/blog/portfolio/github.jpg","/assets/images/blog/portfolio/lets-encrypt.jpg","/assets/images/github.png","/assets/images/header_images/blog.jpg","/assets/images/header_images/home.jpg","/assets/images/header_images/laboratory.jpg","/assets/images/logo.jpg","/assets/images/mail.png","/assets/images/twitter.png","/assets/scripts/highlight.pack.js","/assets/styles/monokai-sublime.css"]'));

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
