ptApp.controller('MenuCtrl', function ($scope, hook) {
  hook.loadAll('menu');

  $scope.menu = [ 'Dashboard', 'Settings', 'Profile', 'Help' ];
});
