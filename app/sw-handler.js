/**
 * Created by AAravindan on 5/24/16.
 */
function defaultHandler(request, values, options) {
  return new Promise(function(resolve, reject) {
    if (navigator.offline && request.method === 'GET' && ((request.headers.get('Accept').indexOf('text/html') != -1) || (request.headers.get('Accept').indexOf('application/xhtml+xml') != -1))) {
      console.log('Offline get request for html');
      caches.open(self.toolbox.options.cache.name).then(function(cache) {
        cache.match(request.url).then(function(response) {
          console.log('sending matched response from cache');
          resolve(response);
        },function() {
          console.log('sending index.html from cache for request '+ request.url);
          getIndexFromCache().then(function(result) {
            resolve(result);
          },reject);
        });
      })
    }
    else{
      fetch(request.clone()).then(function(response) {
        if (request.method === 'GET' &&
          ((request.headers.get('Accept').indexOf('text/html') != -1) || (request.headers.get('Accept').indexOf('application/xhtml+xml') != -1)) &&
          !(self.toolbox.options.successResponses.test(response.status))) {
          console.log('Invalid status code. sending index.html from cache for request '+ request.url);
          getIndexFromCache().then(function(result) {
            resolve(result);
          },reject);
        }else {
          console.log('sending response from network and adding it to cache for request '+request.url);;
          addToCache(request, response);
          resolve(response.clone())
        }
      }, function() {
        if (request.method === 'GET' &&
          ((request.headers.get('Accept').indexOf('text/html') != -1) || (request.headers.get('Accept').indexOf('application/xhtml+xml') != -1))) {
          console.log('Network request failed for '+request.url);
          getIndexFromCache().then(function(result) {
            resolve(result);
          },reject);
        }else {
          caches.open(self.toolbox.options.cache.name).then(function(cache) {
            cache.match(request.url).then(function(storedResposne) {
              console.log('sending matched response from cache');
              resolve(storedResposne);
            },reject);
          },reject)
        }
      });
    }
  });
}

function getIndexFromCache() {
  return new Promise(function(resolve, reject) {
    caches.open(self.toolbox.options.cache.name).then(function(cache) {
       var scopePage = cache.match(self.registration.scope);
       var indexPage = cache.match(self.registration.scope + 'index.html')
       Promise.all([scopePage, indexPage]).then(function(results) {
         resolve(results[0] || results[1])
       }, reject)
    }, reject);
  });
};

function addToCache(request, response) {
  return caches.open(self.toolbox.options.cache.name).then(function(cache) {
    return cache.put(request, response)
  });
}
