angular.module('myApp.routes', ['ui.router'])
.config(function($stateProvider, $locationProvider) {

  $stateProvider
  .state('home', {
    url: '/',
    views: {
      'main': {
        templateUrl: 'Angular/views/home.html'
      }
    }
  })
  .state('single', {
    url: '/singleImg/:imageId',
    views: {
      'main': {
        templateUrl: 'Angular/views/image.html'
      }
    }
  })
  .state('upload', {
    url: '/upload',
    views: {
      'main': {
        templateUrl: 'Angular/views/upload.html'
      }
    }
  });
  $locationProvider.html5Mode(true);

});
