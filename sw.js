var staticCacheName = 'mws-static-v1';
/**
  * Installs service worker and caches content so it is available offline
  */
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(staticCacheName).then((cache) => {
    return cache.addAll(['/',
    'index.html', 'restaurant.html',
    'js/main.js', 'js/restaurant_info.js', 'js/indexController.js', 'js/dbhelper.js',
    'css/styles.css', 'css/responsive.css', 'css/restaurantDetails.css',
    'img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg', 'img/9.jpg', 'img/10.jpg',
    'data/restaurants.json',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
    ]);
  }));
});

/**
 * Activates service worker and deletes old caches
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all (
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-static-') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


/**
 * Fetches from the cache or makes a network request if there is no matching cache
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then((response) => {
    return response ||
    caches.open(staticCacheName).then((cache) => {
      return fetch(event.request).then((response) => {
        if (response.status === 404) {
          return new Response("Page not found")
        }
        if(event.request.url.indexOf('restaurant.html') != -1 || event.request.url.indexOf('leaflet') != -1){
          cache.put(event.request, response.clone());
        }
        return response;
      });
    });
  }).catch(function() {
    return new Response("You seem to be offline")
  })
  );
});

/**
 * Listens for input from the page to update the service worker
 */
self.addEventListener('message', function (event) {
  if (event.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});
