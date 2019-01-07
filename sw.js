var staticCacheName = 'mws-static-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(staticCacheName).then((cache) => {
    return cache.addAll(['./',
    'js/main.js', 'js/restaurant_info.js', 'js/indexController.js', 'js/dbhelper.js',
    'css/styles.css', 'css/responsive.css', 'css/restaurantDetails.css',
    'img/*',
    'data/restaurant.json',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
    ]);
  }));
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all (
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-static-') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return cache.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => {
    return response || fetch(event.request);
  })
  .catch(err => console.log(err, event.request))
  )
});


self.addEventListener('message', function (event) {
  if (event.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});
