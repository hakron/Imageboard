angular.module('myApp.nav', [])
.directive('spicedNav', function () {
  return {
    templateUrl: 'Angular/views/template/nav.html',
    restrict: 'E'
  }
});
