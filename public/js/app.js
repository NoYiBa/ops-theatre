var app = angular.module('app', [ 'ngRoute', 'ui.bootstrap', 'ui.ace' ]);

app.config(function ($routeProvider) {
  app.routeProvider = $routeProvider;

  $routeProvider.
    when('/hiera', {
    templateUrl : 'partials/hiera.html',
    controller  : 'HieraCtrl'
  }).
    when('/manifests/:filename', {
    templateUrl : 'partials/manifest.html',
    controller  : 'ManifestCtrl'
  }).
    when('/login', {
    templateUrl : 'partials/login.html',
    controller  : 'LoginCtrl'
  }).
    otherwise({
    redirectTo : '/login'
  });
});
