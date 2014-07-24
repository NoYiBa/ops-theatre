ptApp.controller('HieraCtrl', function ($scope, $routeParams, $http) {
  $http.get('/hiera/hierarchies').success(function (data) {
    $scope.hieraArchitecture = '' + data;
  });
});
