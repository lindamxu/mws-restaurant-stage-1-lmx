//sdafsadfs
function IndexController() {
  console.log('executed!');
  this._registerServiceWorker();
}
IndexController.prototype._registerServiceWorker = function () {
  //check if browser supports the service worker
  if (!navigator.serviceWorker) return;

  var indexController = this;

  //register new service worker
  navigator.serviceWorker.register('./sw.js').then(function(reg) {
    console.log('serviceWorker registration successful with scope: ', reg.scope);

    //If there is no controller means this page didn't load using service worker so the content is loaded from the network
    if (!navigator.serviceWorker.controller) {
      return;
    }
    //checks if there's a waiting service worker. if so, inform the user
    if (reg.waiting) {
      console.log('hello there is a new service worker waiting');
      indexController._updateReady(reg.waiting);
      return;
    }

    //check if there's a installing service worker. If there is one, then track its state
    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    //listens for a service worker that appears in reg.installing
    reg.addEventListener('updatefound', function() {
      indexController._trackInstalling(reg.installing);
    });
    //catch errors when registering service worker
  }).catch((err) => {
    console.log('ServiceWorker registration failed with: ', err);
  });

  //listen for the controlling service worker changing and reload the page
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

IndexController.prototype._trackInstalling = function (worker) {
  var indexController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      console.log('installed!');
      indexController._updateReady(worker);
    }
  });
};

IndexController.prototype._updateReady = function (worker) {
  var toast = this._toastsView.show("New version available", {
    buttons: ['refresh', 'dismiss']
  });

  toast.answer.then(function(answer) {
    if (answer != 'refresh') return;
    worker.postMessage({action: 'skipWaiting'});
  });

};
let controller = new IndexController();
