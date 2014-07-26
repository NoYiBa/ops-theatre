ptApp.controller('ManifestCtrl', function ($scope, $routeParams, $http) {
  var filename = $routeParams.filename;

  $scope.aceLoaded = function (_editor) {
  };

  $scope.aceChanged = function (e) {
    console.log('changed');
  };

  $scope.resetEditor = function (e) {
    $scope.content = $scope.originalContent;
  };

  $http.get('manifests/' + filename).success(function (data) {
    $scope.originalContent = data.data;
    $scope.content = data.data;
  });
});
