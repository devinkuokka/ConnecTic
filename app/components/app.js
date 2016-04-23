'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', {
      templateUrl: 'views/home.html',
      controller: 'homeCtrl'
    }).
    when('/tictac', {
      templateUrl: 'views/ticTac.html',
      controller: 'ticTacCtrl'
    }).
    when('/connect4', {
      templateUrl: 'views/connect4.html',
      controller: 'connect4Ctrl'
    }).
    when('/battleship', {
      templateUrl: 'views/battleship.html',
      controller: 'battleshipCtrl'
    }).
    when('/leadersboard', {
      templateUrl: 'views/leadersboard.html',
      controller: 'leadersboardCtrl'
    }).
    otherwise({
      redirectTo: '/home'
    });
  
}]);

myApp.controller('homeCtrl', function($scope) {
  
});

myApp.controller('ticTacCtrl', function($scope) {
  
});

myApp.controller('connect4Ctrl', function($scope) {
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };
  
});

myApp.controller('battleshipCtrl', function($scope) {
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };
  
  $scope.xvalues = ["","A","B","C","D","E","F","G","H","I","J"];
  
});

myApp.controller('leadersboardCtrl', function($scope) {
  
});