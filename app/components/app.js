'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'homeCtrl'
    }).
    when('/home', {
      templateUrl: 'views/home.html',
      controller: 'homeCtrl'
    }).
    when('/leadersboard', {
      templateUrl: 'views/leadersboard.html',
      controller: 'homeCtrl'
    }).
    when('/roomOption/:gameId', {
      templateUrl: 'views/roomOption.html',
      controller: 'homeCtrl'
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
    otherwise({
      redirectTo: '/login'
    });
  
}]);

myApp.controller('homeCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {

  var socket = io.connect();
  var playerName;
  var playerId;
  
  $scope.newPlayer = function(username) {
    socket.emit("new_player_to_server", username);
    playerName = username;
    window.location = "#/home";
  };
  
  socket.on("new_player_to_client", function(data){
    playerId = data;
  });
  
  
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
  
  $scope.gameId = $routeParams.gameId;
  
  $scope.newRoom = function(roomname) {
    console.log($scope.playerId);
    socket.emit("new_room_to_server", {name:roomname, gameId: $scope.gameId, player1:$scope.playerId});
    console.log({name:roomname, gameId: $scope.gameId, player1:playerId});

  };
  
  
  
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };
  
  $scope.xvalues = ["","A","B","C","D","E","F","G","H","I","J"];
  
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

