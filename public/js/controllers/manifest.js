ptApp.controller('ManifestCtrl', function ($scope, $routeParams, $http) {
    var filename = $routeParams.filename;

    $http.get('manifests/' + filename).success(function (data) {
        $scope.contents = data.data;
    });
});
