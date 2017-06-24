angular.module('myApp.footer', [])
.directive('spicedFooter', function () {
  return {
    templateUrl: 'Angular/views/template/footer.html',
    restrict: 'E'
  }
});
