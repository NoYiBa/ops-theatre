'use strict';

ptApp.factory('hook', function ($http) {
  // load all hooks for a given type
  // TODO: support callbacks
  // TODO: cache hooks
  // TODO: load hooks at start of app configuration
  function loadAll(type) {
    var uri = '/ui/hooks/' + type;

    $http.get(uri).success(function (modules) {
      modules.forEach(loadHook);
    });
  }

  // load a specific type of hook
  function loadHook(module) {
    var uri = module.uri;

    // load the default controller
    loadController(uri + '/index.js');

    // load metadata
    loadMetadata(module);
  }

  function loadMetadata(module) {
    var metadata = module.uri + '/metadata.json';

    $http.get(metadata).success(function (response) {
      var data = {
        title : response.title,
        href  : '/'
      };

      // setup routes
      Object.each(response.routes, function (route, config) {
        var uri = ('/' + module.name + route).remove(/\/$/);

        ptApp.routeProvider.when(uri, {
          templateUrl : module.uri + '/templates/' + config.template,
          controller  : config.controller
        });
      });
    });
  }

  function loadController(controller) {
    $http.get(controller).success(function (response) {
      var script = document.createElement('script');
      script.src = 'data:text/javascript,' + encodeURI(response);
      script.onload = function () {
        // TODO: support deferred loading
      }

      document.body.appendChild(script);
    });
  }

  return {
    loadAll : loadAll
  };
});
