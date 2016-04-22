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
    when('/home/blackjack', {
      templateUrl: 'blackjack.html',
      controller: 'blackjackCtrl'
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
  
});

myApp.controller('blackjackCtrl', function($scope) {
  
});
