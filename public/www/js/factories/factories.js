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
  var userUrl = 'http://localhost:3000/users/api/';
  var aviUrl = 'http://localhost:3000/avatar/api/';
  var dioUrl = 'http://localhost:3000/diologue/api/';
  var purchUrl = 'http://localhost:3000/purchases/api/';
  var expUrl = 'http://localhost:3000/expenses/api/';
  var apiCalls = {};

  apiCalls.getDetails = function(endPoint) {
    return $http.get(baseUrl+endPoint);
  }
  apiCalls.getUserDetails = function(endPoint) {
    return $http.get(userUrl+endPoint);
  }
  apiCalls.getAvi = function(endPoint) {
    return $http.get(aviUrl+endPoint);
  }
  apiCalls.getDio = function(endPoint) {
    return $http.get(dioUrl+endPoint);
  }
  apiCalls.getPurch = function(endPoint) {
    return $http.get(purchUrl+endPoint);
  }
  apiCalls.getAch = function(endPoint) {
    return $http.get(userUrl+endPoint);
  }
  apiCalls.postAch = function(endPoint) {
    return $http.post(userUrl+"ach/"+endPoint);
  }
  apiCalls.deleteEx = function(endPoint) {
    return $http.post(expUrl+"delete/"+endPoint);
  }
  return apiCalls;
}]);
