'use strict';

  var playerName = "";
  var playerId = "";
  var gameId = "";
  var roomId = "";
  var roomArray = [];
  var isP1 = true;
  var isTurn = true;
  var count = 0;

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
      controller: 'homeCtrl'
    }).
    when('/connect4/:roomId', {
      templateUrl: 'views/connect4.html',
      controller: 'homeCtrl'
    }).
    when('/battleship/:roomId', {
      templateUrl: 'views/battleship.html',
      controller: 'homeCtrl'
    }).
    otherwise({
      redirectTo: '/home'
    });
  
}]);

myApp.controller('homeCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {

  var socket = io.connect();

  $(window).load(function(){
    if (playerId == "") {
      $('#loginModal').modal('show');
	};  
  });
  
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
    window.location = "#/" + gameId + "/:" + roomId
    $("#waitingModal").modal("show");
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
    isP1 = false;
    isTurn = false;
  };
  
  socket.on("join_room_to_client", function(data) {
    $("#waitingModal").modal("hide");
    roomId = data;
  });
  
  $scope.leave = function(){
  
  };
  
  $scope.sendMsg = function(msg) {
    socket.emit("msg_to_server", {playerId:playerId, playerName:playerName, msg:msg});
  }
  
  socket.on("msg_to_client", function(data) {
    $("#chatlog").append("<hr>" + data.playerName + ": " + data.msg + "</hr>");
  });
  
  $scope.tictacMove = function(row, col){
    var cell = ("#" + row + "" + col);
    count++;
    
    if (isTurn) {
      socket.emit("turn_to_server", {playerId:playerId, roomId:roomId, cellId:cell, count:count});
      isTurn = false;
      if (isP1) {
        $(cell).append("X");
        $(cell).val(1);
      } else {
        $(cell).append("O");
        $(cell).val(2);
      };
    };
    
    var checkVal = "";
    if (isP1) {
      checkVal = '111';
    } else {
      checkVal = '222';
    };
  
    // check if win
    if (
      //check rows
      (($("#11").val() + $("#12").val() + $("#13").val()) == checkVal) ||
      (($("#21").val() + $("#22").val() + $("#23").val()) == checkVal) ||
      (($("#31").val() + $("#32").val() + $("#33").val()) == checkVal) ||
      
      //check cols
      (($("#11").val() + $("#21").val() + $("#31").val()) == checkVal) ||
      (($("#12").val() + $("#22").val() + $("#32").val()) == checkVal) ||
      (($("#13").val() + $("#23").val() + $("#33").val()) == checkVal)||
      
      //check diagonals
      (($("#11").val() + $("#22").val() + $("#33").val()) == checkVal) ||
      (($("#13").val() + $("#22").val() + $("#31").val()) == checkVal)
    ) {
      socket.emit("game_over_to_server", {playerId:playerId, roomId:roomId}); 
    }
    
    //check if tie
    else if (count == 9) {
      socket.emit("tie_game_to_server", {playerId:playerId, roomId:roomId});
    };
    
  };

  socket.on("turn_to_client", function(data) {
    count = data.count;
    isTurn = true;
    if (isP1) {
      $(data.cell).append("O");
    } else {
      $(data.cell).append("X");
    };
  });
  
  socket.on("game_over_to_client", function(data) {
    if (data.win) {
      $("#result").append("<h4>Congrats, you won!</h4>");
      $("#gameOverModal").modal("show");
	} else {
      $("#result").append("<h4>Sadface, you lost.</h4>");
      $("#gameOverModal").modal("show");
    }
  });
  
  socket.on("tie_game_to_client", function(data) {
    $("#result").append("<h4>It's a Draw!</h4>");
    $("#gameOverModal").modal("show");
  });
  
}]);



myApp.controller('ticTacCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {

  
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

