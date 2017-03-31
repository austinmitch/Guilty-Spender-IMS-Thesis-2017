// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var guiltySpender = angular.module('guiltySpender', ['ionic', 'ui.router', 'ngSanitize'])

.run(function($ionicPlatform,$rootScope,$location,$ionicModal) {

  //display date at top of every page
  function dateCount() {
    var now = new Date();
    var month = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    var today = new Date(now).getDate();
    console.log('day'+today);
    console.log('month '+month);
    $rootScope.month = month;
    $rootScope.day = today;
  }
  dateCount();


  $ionicModal.fromTemplateUrl('partials/nav.html',{
    scope:$rootScope,
    animation:'slide-in-up'
  }).then(function(modalNav){
    $rootScope.modalNav = modalNav;
  });
  $rootScope.openNav = function() {
    $rootScope.modalNav.show();
  };
  $rootScope.closeNav = function() {
    $rootScope.modalNav.hide();
  };

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

guiltySpender.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('login',
    {
      url: '/',
      controller: 'LoginController',
      templateUrl: 'partials/login.html'
    })
    .state('register',
      {
        url: '/register',
        controller: 'registerController',
        templateUrl: 'partials/register.html'
      })
  .state('profile',
    {
      url: '/profile',
      controller: 'UserController',
      templateUrl: 'partials/profile.html'
    })
  .state('home',
    {
      url: '/home',
      controller: 'HomeController',
      templateUrl: 'partials/home.html'
    })
  .state('/information',
    {
      url: '/information',
      controller: 'InfoController',
      templateUrl: 'partials/infoForm.html'
    })
  .state('purchase',
    {
      url: '/purchase',
      controller: 'PurchaseController',
      templateUrl: 'partials/newPurchase.html'
    })
  .state('achievements',
    {
      url: '/achievements',
      controller: 'AchieveController',
      templateUrl: 'partials/achievePage.html'
    })
  .state('details',
    {
      url: '/details',
      controller: 'DetailsController',
      templateUrl: 'partials/purchaseDetails.html'
    });
  $urlRouterProvider.otherwise('/home');
}]);

guiltySpender.controller('LoginController', ['$scope', '$ionicLoading', 'apiCalls', function($scope, $ionicLoading, apiCalls){
  console.log('Login Page');
}]);

guiltySpender.controller('registerController', ['$scope', '$ionicLoading', 'apiCalls', '$window', '$http', '$location', function($scope, $ionicLoading, apiCalls, $window, $http, $location){
  console.log('register Page');
}]);

guiltySpender.controller('UserController', ['$scope', '$ionicLoading', 'apiCalls', '$ionicModal', function($scope, $ionicLoading, apiCalls, $ionicModal){
   console.log('user page');
   apiCalls.getUserDetails('profile')
   .then(function(profileDetails) {
     console.log(profileDetails);
     $scope.profileDetails = profileDetails.data;
   });
   $ionicModal.fromTemplateUrl('partials/infoForm.html',{
     scope:$scope,
     animation:'slide-in-up'
   }).then(function(modal){
     $scope.modal = modal;
   });
   $scope.openModal = function() {
     $scope.modal.show();
   };
   $scope.closeModal = function() {
     $scope.modal.hide();
   };

}]);

guiltySpender.controller('HomeController', ['$scope', '$rootScope', '$http', '$ionicLoading', 'apiCalls', 'math', '$window', '$ionicModal', function($scope, $rootScope, $http, $ionicLoading, apiCalls, math, $window, $ionicModal){
  console.log('Home Page');
  apiCalls.getDetails('home')
    .then(function(userDetails) {
      console.log(userDetails);
      $scope.userDetails = userDetails.data;
      $scope.userDetails;

      function calcIncome() {
        var incomes = $scope.userDetails.user_income;
        // console.log(incomes);
        var totalIncome;
        for(var i=0;i<incomes.length;i++) {
          var freq = incomes[i].income_frequency;
          // console.log(freq);
          var income = Math.floor(incomes[i].income_total * freq);
          // console.log(income);
          totalIncome =+ income;
        }
        $scope.totalIncome = totalIncome;
        // console.log('total income '+totalIncome);
        return totalIncome;
      }
      calcIncome();

      function calcSpent() {
        var expenses = $scope.userDetails.user_expenses;
        var spent = 0;
          for(var j=0;j<expenses.length;j++) {
            var purchases = expenses[j].expense_purchases;
            console.log('purchases '+purchases);
            for(var k=0;k<purchases.length;k++) {
              console.log(purchases[k].purchase_price);
              spent += purchases[k].purchase_price;
            }
          }
        $scope.spent = spent;
        console.log(spent);
        return spent;
      }
      calcSpent();
      function calcRemain() {
        var remaining = Math.floor($scope.totalIncome - $scope.spent);
        console.log(remaining);
        $scope.remaining = remaining;
        return remaining;
      }
      calcRemain();

      //calculate the percentage of the expense tat has been spent
      function calcPercent() {
        var barFill = document.getElementsByClassName("progressBarFill");
        console.log(barFill);
        var percExpense = $scope.userDetails.user_expenses;
        for(var l=0;l<percExpense.length;l++) {
          var percPurchase = percExpense[l].expense_purchases;
          var purchaseTotal = 0;
          for(var m=0;m<percPurchase.length;m++) {
            purchaseTotal += percPurchase[m].purchase_price;
            console.log('purch '+purchaseTotal);
          }
          console.log(purchaseTotal);
          var percent = math.calcPercent(purchaseTotal,percExpense[l].expense_price)
          // var percent = ((purchaseTotal / percExpense[l].expense_price)*100);
          console.log('percent '+percent);
          barFill[l].style.width = percent+'%';
        }
      }

      //first angry avi
      //if user is 25% into the month
      //and has spend 50% of one total budget
      function overspent() {
        var percentCheck;
        percentCheck = math.calcPercent($scope.spent,$scope.totalIncome);
        console.log('total% '+percentCheck);

        var dateCheck;
        dateCheck = math.calcPercent($rootScope.day,$rootScope.month)
        console.log('date% '+dateCheck);

        if(percentCheck >= 50 && dateCheck <= 25) {
          $rootScope.showAvi();
          console.log('spent too much too early');
        }
      }
      overspent();

      //run function after the page loads
      //otherwise the progress bar fill elements don
      angular.element(document).ready(function () {
        calcPercent();
      });
    });

    //modals
    $ionicModal.fromTemplateUrl('partials/newPurchase.html',{
      scope:$scope,
      animation:'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal =function() {
      $scope.modal.hide();
    };

    $ionicModal.fromTemplateUrl('partials/avatar.html',{
      scope:$rootScope,
      animation:'slide-in-up'
    }).then(function(modalAvi){
      $rootScope.modalAvi = modalAvi;
    });
    $rootScope.showAvi = function() {
      apiCalls.getDio('bad')
      .then(function(diologue){
        var randomPhrase = Math.floor(Math.random()*diologue.data.length);
        $rootScope.phrase = diologue.data[randomPhrase];
        console.log($rootScope.phrase);
      });
      apiCalls.getAvi('angry')
      .then(function(avatar){
        var randomAvi = Math.floor(Math.random()*avatar.data.length);
        $rootScope.avi = avatar.data[randomAvi];
        console.log($rootScope.avi);
      });
      $rootScope.modalAvi.show();
    };
    $rootScope.hideAvi = function() {
      $rootScope.modalAvi.hide();
    };

}]);

guiltySpender.controller('InfoController', ['$scope', '$ionicLoading', 'apiCalls', function($scope, $ionicLoading, apiCalls){
  console.log('Info Form Page');
}]);

guiltySpender.controller('PurchaseController', ['$scope', '$ionicLoading', 'apiCalls', function($scope, $ionicLoading, apiCalls){
  console.log('New Purchase Page');
}]);

guiltySpender.controller('AchieveController', ['$scope', '$ionicLoading', 'apiCalls', function($scope, $ionicLoading, apiCalls){
  console.log('Acheivements Page');
  apiCalls.getUserDetails('achievements')
  .then(function(achieveDetails) {
    console.log(achieveDetails);
    $scope.achieveDetails = achieveDetails.data;
  });
}]);

guiltySpender.controller('DetailsController', ['$scope', '$ionicLoading', 'apiCalls', '$http', function($scope, $ionicLoading, apiCalls, $http){

}]);
