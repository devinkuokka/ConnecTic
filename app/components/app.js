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
    when('/roomOption/:gameId', {
      templateUrl: 'views/roomOption.html',
      controller: 'roomOptionCtrl'
    }).
    when('/tictac/:roomId', {
      templateUrl: 'views/ticTac.html',
      controller: 'ticTacCtrl'
    }).
    when('/connect4/:roomId', {
      templateUrl: 'views/connect4.html',
      controller: 'connect4Ctrl'
    }).
    when('/battleship/:roomId', {
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
  $scope.games = [
    {'id': 'tictac',
      'name': 'Tic-Tac-Toe',
      'img': 'tictac.png'
    },
    {'id': 'connect4',
      'name': 'Connect 4',
      'img': 'connect4.png'
    },
    {'id': 'battleship',
      'name': 'Battleship',
      'img': 'battleship.png'
    }
  ];

  
});

myApp.controller('roomOptionCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.gameId = $routeParams.gameId;
  
  $scope.rooms = [
    {'id': '1',
      'name': 'Room1',
      'creator': 'user1',
      'gameId': 'tictac'
    },
    {'id': '2',
      'name': 'Roooooooooooooooooom2',
      'creator': 'user2',
      'gameId': 'tictac'
    },
    {'id': '3',
      'name': 'Room3',
      'creator': 'user3',
      'gameId': 'connect4'
    }
  ];
  
  $scope.createRoom = function(){
    
    
  };
  
}]);


myApp.controller('ticTacCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.roomId = $routeParams.roomId;

}]);


myApp.controller('connect4Ctrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.roomId = $routeParams.roomId;
  
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };
  
}]);


myApp.controller('battleshipCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.roomId = $routeParams.roomId;
  
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };
  
  $scope.xvalues = ["","A","B","C","D","E","F","G","H","I","J"];
  
}]);


myApp.controller('leadersboardCtrl', function($scope) {
  
});
