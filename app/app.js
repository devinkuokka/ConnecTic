'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', {
      templateUrl: 'home.html',
      controller: 'homeCtrl'
    }).
    when('/home/tictac', {
      templateUrl: 'ticTac.html',
      controller: 'ticTacCtrl'
    }).
    when('/home/connect4', {
      templateUrl: 'connect4.html',
      controller: 'connect4Ctrl'
    }).
    when('/home/battleship', {
      templateUrl: 'battleship.html',
      controller: 'battleshipCtrl'
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
