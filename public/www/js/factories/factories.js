var guiltySpender = angular.module('guiltySpender');
//math factory for various calculations
guiltySpender.factory('math', [function(){
  var math = {};
  //calculate percentage of total
  math.calcPercent = function(value,total) {
    var calculated = Math.floor((value / total) * 100);
    return calculated;
  }
  return math;
}]);

//api factory
guiltySpender.factory('apiCalls', ['$http','$stateParams', function($http, $stateParams) {
  var baseUrl = 'http://localhost:3000/api/';
  var userUrl = 'http://localhost:3000/users/api/'
  var apiCalls = {};

  apiCalls.getDetails = function(endPoint) {
    return $http.get(baseUrl+endPoint);
  }
  apiCalls.getUserDetails = function(endPoint) {
    return $http.get(userUrl+endPoint);
  }
  return apiCalls;
}]);
