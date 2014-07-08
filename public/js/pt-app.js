var ptApp = angular.module('ptApp', [ 'ngRoute', 'ui.bootstrap', 'ui.ace' ]);

ptApp.config([ '$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/hiera', {
            templateUrl : 'partials/hiera.html',
            controller  : 'HieraCtrl'
        }).
        when('/manifests/:filename', {
            templateUrl : 'partials/manifest.html',
            controller  : 'ManifestCtrl'
        }).
        when('/dashboard', {
            templateUrl : 'partials/sample.html',
            // controller  : 'LoginCtrl'
        }).
        when('/login', {
            templateUrl : 'partials/login.html',
            controller  : 'LoginCtrl'
        }).
        otherwise({
            redirectTo : '/login'
        });
} ]);
