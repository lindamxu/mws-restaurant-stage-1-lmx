let userConsent = false;

function IndexController() {
  this._registerServiceWorker();
}
  /**
   * Registers service worker, installs the service worker, check if there's a waiting service worker, etc
   */
IndexController.prototype._registerServiceWorker = function () {
  //check if the browser supports this service worker
  if (!navigator.serviceWorker) return;

  var indexController = this;

  //register new service worker
  navigator.serviceWorker.register('./sw.js').then(function(reg) {
    console.log('serviceWorker registration successful with scope: ', reg.scope);

    //If there is no controller means this page didn't load using service worker so the content is loaded from the network
    if (!navigator.serviceWorker.controller) {
      return;
    }
    //checks if there's a waiting service worker
    if (reg.waiting) {
      indexController._updateReady(reg.waiting);
      return;
    }

    //check if there's a installing service worker. If there is one, then track its state
    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    //listens for a service worker that has been installed
    reg.addEventListener('updatefound', function() {
      indexController._trackInstalling(reg.installing);
    });
    //log out errors during service worker registration
  }).catch((err) => {
    console.log('ServiceWorker registration failed with: ', err);
  });

  //listen for the controlling service worker changing and reload the page
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}
/**
 * Tracks installation status of a service worker
 */

IndexController.prototype._trackInstalling = function (worker) {
  var indexController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      indexController._updateReady(worker);
    }
  });
};

/**
 * Asks the user if he/she wish to update to the new service worker
 */
IndexController.prototype._updateReady = function(worker) {
  userConsent = confirm ("New version available. Do you wish to update?");

  if (!userConsent) return;
  worker.postMessage({ action: 'skipWaiting' });

};
let controller = new IndexController();
