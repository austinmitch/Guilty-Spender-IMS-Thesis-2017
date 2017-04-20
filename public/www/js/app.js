// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var guiltySpender = angular.module('guiltySpender', ['ionic', 'ui.router', 'ngSanitize'])

.run(function($ionicPlatform,$rootScope,$location,$ionicModal) {

  $rootScope.home = function() {
    $location.path('home');
  };
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
      templateUrl: 'partials/purchaseList.html'
    })
  .state('achievements',
    {
      url: '/achievements',
      controller: 'AchieveController',
      templateUrl: 'partials/achievePage.html'
    })
  .state('details',
    {
      url: '/details/:purchid',
      controller: 'DetailsController',
      templateUrl: 'partials/purchaseDetails.html'
    });
  $urlRouterProvider.otherwise('/home');
}]);

guiltySpender.controller('LoginController', ['$scope', '$ionicLoading', 'apiCalls', function($scope, $ionicLoading, apiCalls){
  console.log('Login Page');
  //all functionality handled by the form.
}]);

guiltySpender.controller('registerController', ['$scope', '$ionicLoading', 'apiCalls', '$window', '$http', '$location', function($scope, $ionicLoading, apiCalls, $window, $http, $location){
  console.log('register Page');
  //all functionality handled by the form.
}]);

guiltySpender.controller('UserController', ['$scope', '$ionicLoading', 'apiCalls', '$ionicModal', function($scope, $ionicLoading, apiCalls, $ionicModal){
   console.log('user page');
   apiCalls.getUserDetails('profile')
   .then(function(profileDetails) {
     console.log(profileDetails);
     $scope.profileDetails = profileDetails.data;

     //calculate total monthly income
     var freq = $scope.profileDetails.user_income[0].income_frequency;
     var income = $scope.profileDetails.user_income[0].income_total;
     var totalIncome = income * freq;
     //calculate estimated amount remaining from paycheck
     var expenses = $scope.profileDetails.user_expenses;
     $scope.expenses = expenses;
     var expenseTotal = 0;
     for(var i=0;i<expenses.length;i++){
       expenseTotal += expenses[i].expense_price;
     }
     console.log(expenseTotal);
     $scope.estimatedRemain = totalIncome - expenseTotal;
     console.log($scope.estimatedRemain);

     //delete an expense
     $scope.delete = function(id){
       apiCalls.deleteEx(id)
       .then(function(){
         console.log("deleted");
       });
     }

     //check all user data for empty fields
     //check username, email, expenses, image, income
     function dataGet() {
       var user = $scope.profileDetails;
       var infoFull;
       if(user.username && user.email && user.user_expenses[0] && user.user_image && user.user_income[0]) {
         infoFull = true;
       }else{
         infoFull = false;
       }
       return infoFull;
     }

     function dataCheck() {
       dataGet();
       if(dataGet()===true){
         console.log("you filled your account!!");
         apiCalls.getAch("58b8a72bc04954048117a0a2")
         .then(function(achieve){
           $scope.achieve = achieve.data;
           console.log(achieve);
         });
         apiCalls.postAch("58b8a72bc04954048117a0a2");
         $scope.openAchieve();
         return;
       }else{
         console.log("you havent filled your account");
       }
     }

     function infoAchieveCheck() {
       var achieves = $scope.profileDetails.user_achievements;
       console.log(achieves[0]);
       if(!achieves[0]){
         console.log("no achieves");
         dataCheck();
         return;
       }else{
           if(achieves.indexOf("58b8a72bc04954048117a0a2")!=-1){
             console.log("achievement already present");
             return;
           }else{
             dataCheck();
           }
       }

     }
     infoAchieveCheck();

     //second achievement
     //if the user has set up their cone click purchases
     function oneClickGet() {
       var user = $scope.profileDetails;
       var oneclick;
       if(user.user_oneclick[0]){
         oneclick = true;
       }else{
         oneclick = false;
       }
       return oneclick;
     }

     function oneClickCheck() {
       if(oneClickGet()===true){
         apiCalls.getAch("58eed5a8b348e797e3cb8a88")
         .then(function(achieve){
           $scope.achieve = achieve.data;
           console.log(achieve);
         });
         apiCalls.postAch("58eed5a8b348e797e3cb8a88");
         $scope.openAchieve();
         return;
       }else{
         console.log("no oneclicks yet");
       }
     }

     function oneClickAchieveCheck() {
       var achieves = $scope.profileDetails.user_achievements;
       console.log(achieves[0]);
       if(!achieves[0]){
         console.log("no achieves");
         oneClickCheck();
         return;
       }else{
         //indexOf return -1 if the element is not present otherwise it
         //returns the number of the element in the array
           if(achieves.indexOf("58eed5a8b348e797e3cb8a88")!=-1){
             console.log("achievement already present");
             return;
           }else{
             oneClickCheck();
           }
       }

     }
     oneClickAchieveCheck();

     var expenseNo = 0;
     $scope.appendEx = function() {
       expenseNo++;
       console.log(expenseNo);
       var element = document.querySelector("#expenses");
       var label = angular.element('<label for="expenseName'+expenseNo+'">expense '+expenseNo+'</label>');
       var name = angular.element('<input type="text" name="expenseName'+expenseNo+'" value="" placeholder="NAME">');
       var total = angular.element('<input type="text" name="expenseTotal'+expenseNo+'" value="" placeholder="$ MONTHLY TOTAL">');
       element.append(label[0]);
       element.append(name[0]);
       element.append(total[0]);
       $scope.expenseNo = expenseNo+1;
     }

     var oneclickNo = 0;
     $scope.appendOC = function() {
       oneclickNo++;
       console.log(oneclickNo);
       var element = document.querySelector("#oneclicks");
       var label = angular.element('<label for="oneClickName'+oneclickNo+'">one click purchases</label>');
       var name = angular.element('<input type="text" name="oneClickName'+oneclickNo+'" value="" placeholder="NAME">');
       var total = angular.element('<input type="text" name="oneClickTotal'+oneclickNo+'" value="" placeholder="$ PRICE">');
       var expenseOpen = angular.element('<select name="oneClickExpense'+oneclickNo+'">');
       var expenseOpts = "";
       for(var i=0;i<$scope.expenses.length;i++){
        expenseOpts  += '<option value="'+$scope.expenses[i]._id+'">'+$scope.expenses[i].expense_name+'</option>';
       }

       var expenseOptions = angular.element(expenseOpts);
       var expenseClose = angular.element('</select>');

       var expense = angular.element('<select name="oneClickExpense'+oneclickNo+'">'+expenseOpts+'</select>');
       element.append(label[0]);
       element.append(name[0]);
       element.append(total[0]);
       element.append(expense[0]);
       $scope.oneclickNo = oneclickNo+1;
     }

   });


//edit profile details
   $ionicModal.fromTemplateUrl('partials/infoForm.html',{
     scope:$scope,
     animation:'slide-in-up'
   }).then(function(modal){
     $scope.infoModal = modal;
   });
   $scope.openInfo = function() {
     $scope.infoModal.show();
   };
   $scope.closeInfo = function() {
     $scope.infoModal.hide();
   };

//achievement popup
  $ionicModal.fromTemplateUrl('partials/newAchieve.html',{
    scope:$scope,
    animation:'slide-in-up'
  }).then(function(modal){
    $scope.achieveModal = modal;
  });
  $scope.openAchieve = function() {
    $scope.achieveModal.show();
  };
  $scope.closeAchieve = function() {
    $scope.achieveModal.hide();
  };

}]);

guiltySpender.controller('HomeController', ['$scope', '$rootScope', '$http', '$ionicLoading', 'apiCalls', 'math', '$window', '$ionicModal', function($scope, $rootScope, $http, $ionicLoading, apiCalls, math, $window, $ionicModal){
  console.log('Home Page');
  apiCalls.getDetails('home')
    .then(function(userDetails) {
      console.log(userDetails);
      $scope.userDetails = userDetails.data;
      $scope.userDetails;
      $scope.oneClicks = $scope.userDetails.user_oneclick;
      console.log($scope.oneClicks);

      function calcIncome() {
        var incomes = $scope.userDetails.user_income;
        var totalIncome;
        for(var i=0;i<incomes.length;i++) {
          var freq = incomes[i].income_frequency;
          var income = Math.floor(incomes[i].income_total * freq);
          totalIncome =+ income;
        }
        $scope.totalIncome = totalIncome;
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
        $scope.spent = Math.round(spent*100)/100; //round to 2 decimal places
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

      //calculate the percentage of the expense that has been spent
      function calcPercent() {
        var array = [];//will contain percent values

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
          var percent = math.calcPercent(purchaseTotal,percExpense[l].expense_price);
          array.push(percent);//to be checked by avatar display function
          console.log('percent '+percent);
          barFill[l].style.width = percent+'%';
        }
        $scope.array = array;
      }

      function aviCheck() {
        //criteria variables

        //check return percetn values for the total amoutn spent
        //against the total monthly income and for the length of time
        //into the current month
        var percentCheck = math.calcPercent($scope.spent,$scope.totalIncome);
        console.log('total% '+percentCheck);
        var dateCheck = math.calcPercent($rootScope.day, $rootScope.month);
        console.log('date% '+dateCheck);

        //check if any combined purchase totals exceed the amount
        //alotted for that expense

        //check for mistakes one at a time
        if(percentCheck>=50 && dateCheck<=25){
          $rootScope.mistake = 'Spent too much money too early in the month';
          $rootScope.showAviBad();
          console.log('spent too much too early');
          return;
        }else{
          for(var a=0;a<$scope.array.length;a++){
            if($scope.array[a]>100){
              $rootScope.mistake = 'Exceded the set amount for an expense';
              $rootScope.showAviBad();
              console.log('overspent on an expense');
              return;
            }
          }
          if(percentCheck<=50 && dateCheck>=75){
            $rootScope.mistake = "haven't spent much this month!"
            $rootScope.showAviGood();
            console.log('spent less than half income 3/4ths into the month');
            return;
          }else{
            for(var b=0;b<$scope.array.length;b++){
              if($scope.array[b]<100 && dateCheck===100){
                $rootScope.mistake = 'Spent less than intended for a certain expense';
                $rootScope.showAviGood();
                console.log('month end and you spent underbudget on a certain expense');
                return;
              }
            }
          }
        }
      }

      //run function after the page loads
      //otherwise the progress bar fill elements don
      angular.element(document).ready(function () {
        calcPercent();
        //mistake check requires data generated fomr calcPercent();
        aviCheck();
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
    $rootScope.showAviBad = function() {
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

    $rootScope.showAviGood = function() {
      apiCalls.getDio('good')
      .then(function(diologue){
        var randomPhrase = Math.floor(Math.random()*diologue.data.length);
        $rootScope.phrase = diologue.data[randomPhrase];
        console.log($rootScope.phrase);
      });
      apiCalls.getAvi('happy')
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

  var expenseNo = 0;
  $scope.appendEx = function() {
    expenseNo++;
    console.log(expenseNo);
    var element = document.querySelector("#expenses");
    var label = angular.element('<label for="expenseName'+expenseNo+'">expense '+expenseNo+'</label>');
    var name = angular.element('<input type="text" name="expenseName'+expenseNo+'" value="" placeholder="NAME">');
    var total = angular.element('<input type="text" name="expenseTotal'+expenseNo+'" value="" placeholder="$ MONTHLY TOTAL">');
    element.append(label[0]);
    element.append(name[0]);
    element.append(total[0]);
    $scope.expenseNo = expenseNo+1;
  }

  var oneclickNo = 0;
  $scope.appendOC = function() {
    oneclickNo++;
    console.log(oneclickNo);
    var element = document.querySelector("#oneclicks");
    var label = angular.element('<label for="oneClickName'+oneclickNo+'">one click purchases</label>');
    var name = angular.element('<input type="text" name="oneClickName'+oneclickNo+'" value="" placeholder="NAME">');
    var total = angular.element('<input type="text" name="oneClickTotal'+oneclickNo+'" value="" placeholder="$ PRICE">');
    var expenseOpen = angular.element('<select name="oneClickExpense'+oneclickNo+'">');
    var expenseOpts = "";
    for(var i=0;i<$scope.expenses.length;i++){
     expenseOpts  += '<option value="'+$scope.expenses[i]._id+'">'+$scope.expenses[i].expense_name+'</option>';
    }

    var expenseOptions = angular.element(expenseOpts);
    var expenseClose = angular.element('</select>');

    var expense = angular.element('<select name="oneClickExpense'+oneclickNo+'">'+expenseOpts+'</select>');
    element.append(label[0]);
    element.append(name[0]);
    element.append(total[0]);
    element.append(expense[0]);
    $scope.oneclickNo = oneclickNo+1;
  }

}]);

guiltySpender.controller('PurchaseController', ['$scope', '$ionicLoading', 'apiCalls', function($scope, $ionicLoading, apiCalls){
  console.log('New Purchase Page');
  apiCalls.getPurch('list')
  .then(function(purchases) {
    console.log(purchases);
    $scope.purchases = purchases.data;
  });
}]);

guiltySpender.controller('AchieveController', ['$scope', '$ionicLoading', 'apiCalls', function($scope, $ionicLoading, apiCalls){
  console.log('Acheivements Page');
  apiCalls.getUserDetails('achievements')
  .then(function(achieveDetails) {
    console.log(achieveDetails);
    $scope.achieveDetails = achieveDetails.data;
  });
}]);

guiltySpender.controller('DetailsController', ['$scope', '$ionicLoading', 'apiCalls', '$http', '$stateParams', function($scope, $ionicLoading, apiCalls, $http, $stateParams){
  console.log('Details page');
  apiCalls.getPurch($stateParams.purchid)
  .then(function(purchDetails){
    $scope.purchDetails = purchDetails.data;
    console.log($scope.purchDetails);
    var month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var monthNo = purchDetails.data.purchase_month-1;
    $scope.month = month[monthNo];
  });
}]);
