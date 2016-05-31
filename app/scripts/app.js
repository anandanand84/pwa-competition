(function(document) {
  'use strict';

  window.generateUUID =  function () {
    var d = new Date().getTime();
    if (window && window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  var webComponentsSupported = ('registerElement' in document
  && 'import' in document.createElement('link')
  && 'content' in document.createElement('template'));

  if (!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoading;
    document.head.appendChild(script);
  } else {
    finishLazyLoading();
  }

  function finishLazyLoading() {
    // (Optional) Use native Shadow DOM if it's available in the browser.
    window.Polymer = window.Polymer || {dom: 'shadow'};

    // 6. Fade splash screen, then remove.
    var onImportLoaded = function() {
      console.log('imports loaded');
      document.querySelector('#splash').setAttribute('hidden', '');
      document.querySelector('#app').removeAttribute('hidden');
      //document.querySelector('#splash').setAttribute('hidden', '');
      //document.querySelector('#app').removeAttribute('hidden');
      // App is visible and ready to load some data!
    };

    var link = document.querySelector('#bundle');
    if ( link.import && (link.import.readyState === 'complete' || link.import.readyState === 'interactive')) {
      onImportLoaded();
    } else {
      link.addEventListener('load', onImportLoaded);
    }
  }

  var app = document.querySelector('#app');

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    console.log('web components ready');
    // imports are loaded and elements have been registered
  });

  app.getNewEditorUrl = function() {
    console.log('Getting new editor url');
    this.set('location.path', "/editor/"+this.generateUUID()+"/unsaved/code");
  }
})(document);
