'use strict';

ptApp.factory('hook', function ($http) {
  // load all hooks for a given type
  // TODO: support callbacks
  // TODO: cache hooks
  // TODO: load hooks at start of app configuration
  function loadAll(type) {
    var uri = '/ui/hooks/' + type;

    $http.get(uri).success(function (modules) {
      modules.forEach(function (module) {
        loadHook(type, module, name);
      });
    });
  }

  // load a specific type of hook
  function loadHook(type, module, name) {
    var hookUri = '/js/hooks/' + type + '/' + name;

    // load metadata
    loadMetadata(module + '/metadata.json');

    // load the default controller
    loadController(module + '/index.js');
  }

  function loadMetadata(metadata) {
    $http.get(metadata).success(function (response) {
      var data = {
        title : response.title,
        href  : '/'
      };

      // setup routes
      ptApp.routeProvider.when('/dashboard', {
        templateUrl : '/js/hooks/menu/dashboard/templates/dashboard.html',
        // controller : 'DashboardCtrl'
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
