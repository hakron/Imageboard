var myApp = angular.module('myApp', ['myApp.nav','myApp.footer', 'myApp.routes']);
// <======= ender the imgs in the home page =========>
myApp.controller('picList', function($scope, $http) {
  $http.get('/home').then(function(resp) {
    $scope.images = resp.data;
  });
});
// <=========== upload the imgs to the db =========>
myApp.controller('uploadImgsCtrl', function($scope, $http){
  $scope.submit = function(img) {
    var file = $('input[type="file"]').get(0).files[0];

    var formData = new FormData();
    formData.append('file', file);
    formData.append('author', img.author);
    formData.append('title', img.title);
    formData.append('description', img.description);
    return $http({
      url: '/upload/img',
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': undefined },
      transformRequest: angular.identity

    });
  }
});
// <============ comments controller, get the comments in the db =============>
myApp.controller('commentCtrl', function($scope, $stateParams, $http){
  $scope.submit = function(comment) {
    $http({
      url: `/singleImg/${$stateParams.imageId}/data`,
      method: 'POST',
      data: $.param({
        body: $scope.comment.bodycomment,
        name: $scope.comment.name
      }) ,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(function(response){
      console.log("insertComment worked");
    }).catch(function(err){
      console.log(err);
    })
  }
});
// myApp.service('reload', function($http, $stateParams, $scope,){
//   this.myFunc = function () {
//
//
//   }
// })
// <===========single img controller with delete img and auto update comments ============>
myApp.controller('singleImageController', function($http, $stateParams, $scope, $interval, $state) {

  $scope.reload = function () {
    $http({
      url: `/singleImg/${$stateParams.imageId}/data`,
      method: 'GET',
      params : {id :$stateParams.imageId}
    }).then(function(resp){
      var imageInfo = resp.data;
      $scope.image = imageInfo;
    }).catch(function(e){
      console.log(e);
    });

  };
  $scope.reload();
  $interval($scope.reload, 5000);

  $scope.remove = function(){
    console.log("remove works");
    $http({
      method: 'post',
      url: `/singleImg/${$stateParams.imageId}/delete`,
      params : {id :$stateParams.imageId}
    }).then(function successCallback(response) {
      $state.go('home');
    });
  };

});
// <=========== search controller ===============>
myApp.controller("searchCtrl",function($scope, $http){
  $http.get('/home').success(function(resp, status, headers, config) {
    $scope.images = resp.data;
  }).error(function(resp, status, headers, config) {
    console.log("No data found..");
  });
});
myApp.filter('searchFor', function(){
  return function(arr, search){
    if(!search){
      return arr;
    }
    var result = [];
    search = search.toLowerCase();
    angular.forEach(arr, function(images){
      if(images.title.toLowerCase().indexOf(search) !== -1){
        result.push(images);
      }
      else if(images.username.toLowerCase().indexOf(search) !== -1){
        result.push(images);
      }
    });
    return result;
  };
});
