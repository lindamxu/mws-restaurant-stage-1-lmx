var staticCacheName = 'mws-static-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(staticCacheName).then((cache) => {
    return cache.addAll(['./',
    'js/main.js', 'js/restaurant_info.js', 'js/indexController.js', 'js/dbhelper.js',
    'css/styles.css', 'css/responsive.css', 'css/restaurantDetails.css',
    'img/*',
    'data/restaurant.json',
    '//normalize-css.googlecode.com/svn/trunk/normalize.css',
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
          return cacheName.startsWith('wittr-') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return cache.delete(cacheName);
        })
      );
    })
  );
});



self.addEventListener('fetch', function(event) {
  console.log('hello');
  event.respondWith(
    caches.match(event.request)
    .then(function(response)) {
      if (response) {
        console.log('found previous cache!');
        return response;
      }
      return fetch(event.request)
        .then(function(response) {
          caches.open(staticCacheName)
          .then((cache) {
            cache.put(event.request, response.clone());
          }).catch(function() {
            console.log('oops');
            //return new Response("You appear to be offline, and we didn't any old cache to load.");
          });
        //return response;
      });
    });
});


self.addEventListener('message', function (event) {
  if (event.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});
