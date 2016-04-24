'use strict';

  var playerName = "";
  var playerId = "";
  var gameId = "";
  var roomId = "";
  var roomArray = [];

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

  $scope.newPlayer = function(username) {
    socket.emit("new_player_to_server", username);
    playerName = username;
    window.location = "#/home";
  };
  
  socket.on("new_player_to_client", function(data) {
    playerId = data.playerId;
    playerName = data.playerName;
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
    socket.emit("new_room_to_server", {name:roomname, gameId: $scope.gameId, p1Id:playerId, p1Name:playerName});
  };
  
  socket.on("new_room_to_client", function(data) {
    gameId = data.gameId
    roomId = data.roomId;
    window.location = "#/" + gameId + "/:" + roomId;
  });
  
  $scope.requestRooms = function() {
    socket.emit("request_rooms_to_server");
  };
  
  
  socket.on("request_rooms_to_client", function(data) {
    roomArray = data;
  });
  
  $scope.rooms = roomArray;
  
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };
  
  $scope.xvalues = ["","A","B","C","D","E","F","G","H","I","J"];
  
  $scope.joinRoom = function(data) {
    socket.emit("join_room_to_server", {playerId:playerId, playerName:playerName, roomId:data});	
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

