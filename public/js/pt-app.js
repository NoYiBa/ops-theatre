var ptApp = angular.module('ptApp', [ 'ngRoute', 'ui.bootstrap', 'ui.ace' ]);

ptApp.config([ '$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/hiera', { 
            templateUrl : 'partials/hiera.html',
            controller  : 'HieraCtrl'
        }).
        when('/manifest/:filename', {
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
} ]);
