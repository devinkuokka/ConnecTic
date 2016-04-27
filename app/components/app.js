'use strict';

  var playerName = "";
  var playerId = "";
  var gameId = "";
  var roomId = "";
  var roomArray = [];
  var leaders = [];
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
    if (min < max) { 	 	 	
	  for (var i = min; i <= max; i += step) {
		  input.push(i);
	  };
	} else {
	  for (var i = min; i >= max; i -= step) {
		  input.push(i);
	  };
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
    roomId = data.roomId;
	gameId = data.gameId;
  });
  
  $scope.sendMsg = function(msg) {
    socket.emit("msg_to_server", {playerId:playerId, playerName:playerName, msg:msg});
  }
  
  socket.on("msg_to_client", function(data) {
    $("#chatlog").prepend("<hr>" + data.playerName + ": " + data.msg + "</hr>");
  });
  
  $scope.move = function(row, col){
    
    if (gameId == "tictac") { 	 	 	
	  var cell = ("#" + row + "" + col);
	  if (isTurn) {
		if ($(cell).html() == "") {	
		  count++;
		  socket.emit("turn_to_server", {playerId:playerId, roomId:roomId, cellId:cell, count:count});
		  isTurn = false;
		  if (isP1) {
			$(cell).html("X");
			$(cell).val(1);
		  } else {
			$(cell).html("O");
			$(cell).val(2);
		  };
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
	}; //close tictac
	
	if (gameId == "connect4") { 	 	 	
	  var rowId = ("#" + row);
	  if (isTurn) {
		if ($(rowId).attr("value") == "0") {
		  count++;
		  isTurn = false;
		  var cells = [];
		  var cellId = "";
		  for (var i = 6; i > 0; i--){
			cells.push("#" + i + row);
		  }
		  
		  for (var x in cells) {
			cellId = cells[x]
			if ($(cellId).attr("value") == "0") {
			  socket.emit("turn_to_server", {playerId:playerId, roomId:roomId, cellId:cellId, count:count});
			  if (isP1) {
				$(cellId).html('<img src="photos/red-circle.png" height=55; width=55;>');
				$(cellId).attr("value", "1");
			  } else {
				$(cellId).html('<img src="photos/yellow-circle.png" height=55; width=55;>');
				$(cellId).attr("value", "2");
			  };
			  break;
			} else {
			  $(rowId).attr("value") == "3"
			};
		  };
		};
	  };
	  
	  var checkVal = "";
	  if (isP1) {
		checkVal = '1111';
	  } else {
		checkVal = '2222';
	  };
	
	  var rows = [1,2,3,4,5,6];
	  var cols = [1,2,3,4,5,6,7];
	  
	  //check rows
	  for (var y in rows) {
		var str = "";
		var cell = "";
		for (var x in cols) {
		  cell = "#" + rows[y] + cols[x];
		  str = str + $(cell).attr("value");
		};
		var isWin = str.search(checkVal);
		if (isWin != -1) {
		  socket.emit("game_over_to_server", {playerId:playerId, roomId:roomId}); 
		};
	  };
	  
	  //check cols
	  for (var x in cols) {
		var str = "";
		var cell = "";
		for (var y in rows) {
		  cell = "#" + rows[y] + cols[x];
		  str = str + $(cell).attr("value");
		};
		var isWin = str.search(checkVal);
		if (isWin != -1) {
		  socket.emit("game_over_to_server", {playerId:playerId, roomId:roomId}); 
		};
	  };
	  
	  //check diagonals
	  //uphill diagonals
	  if (checkDiagonal(4,1,1,4) ||
		  checkDiagonal(5,1,1,5) ||
		  checkDiagonal(6,1,1,6) ||
		  checkDiagonal(6,2,1,7) ||
		  checkDiagonal(6,3,2,7) ||
		  checkDiagonal(6,4,3,7) ||
		  //downhill diagonals
		  checkDiagonal(1,4,4,7) ||
		  checkDiagonal(1,3,5,7) ||
		  checkDiagonal(1,2,6,7) ||
		  checkDiagonal(1,1,6,6) ||
		  checkDiagonal(2,1,6,5) ||
		  checkDiagonal(3,1,6,4)
		  )
	  {
		socket.emit("game_over_to_server", {playerId:playerId, roomId:roomId}); 
	  }

	  //check if tie
	  if (count == 42) {
		socket.emit("tie_game_to_server", {playerId:playerId, roomId:roomId});
	  };
	}; //close connect4
	
  };

  var checkDiagonal = function(rmin, cmin, rmax, cmax) {
	var checkVal = "";
	if (isP1) {
	  checkVal = '1111';
	} else {
	  checkVal = '2222';
	};

	var str = "";
	var rows = $scope.range(rmin, rmax);
	var cols = $scope.range(cmin, cmax);
	
	for (var x in rows) {
	  var cell = "#" + rows[x] + cols[x];
	  str = str + $(cell).attr("value");
	};
	var isWin = str.search(checkVal);
	if (isWin != -1) {
	  return true;
	};
	return false;
  };
  
  socket.on("turn_to_client", function(data) {
    count = data.count;
    isTurn = true;
		  
	if (gameId == "tictac") {
	  if (isP1) {
		$(data.cellId).html("O");
	  } else {
		$(data.cellId).html("X");
	  };
	};
	
	if (gameId == "connect4") {
	  if (isP1) {
		$(data.cellId).html('<img src="photos/yellow-circle.png" height=55; width=55;>');
		$(data.cellId).attr("value", "2");
	  } else {
		$(data.cellId).html('<img src="photos/red-circle.png" height=55; width=55;>');
		$(data.cellId).attr("value", "1");
	  };
	};
	
  });
  
  socket.on("game_over_to_client", function(data) {
    if (data.win) {
      $("#winModal").modal("show");
	} else {
      $("#loseModal").modal("show");
    }
  });
  
  socket.on("tie_game_to_client", function() {
    $("#tieModal").modal("show");
  });
  
  $scope.leave = function(){
	socket.emit("leave_to_server",  roomId); 
  };
  
  $scope.rematch = function() {
	socket.emit("rematch_to_server", {playerId:playerId, roomId:roomId});
  };
  
  socket.on("rematch_to_client", function() {
    $("#winModal").modal("hide");
	$("#rematchModal").modal("show");
  });
  
  $scope.accept = function(){
	socket.emit("accept_to_server", roomId); 
  };
  
  $scope.decline = function(){
	socket.emit("leave_to_server", roomId); 
  };
  
  socket.on("accept_to_client", function() {
	count = 0;
	if (gameId == "tictac") {
	  var cellIds = ["#11","#12","#13","#21","#22","#23","#31","#32","#33"];
	  for (var x in cellIds) {
		var cell = cellIds[x];
		$(cell).html("");
		$(cell).val(0);
	  };
	};
	
	if (gameId == "connect4") {
	  var rows = [1,2,3,4,5,6];
	  var cols = [1,2,3,4,5,6,7];
	  for (var y in rows) {
		for (var x in cols) {
		  var cell = "#" + rows[y] + cols[x];
		  $(cell).html('<img src="photos/black-circle.png" height=55; width=55;>');
		  $(cell).attr("value", "0");
		};
		var rowId = "#" + rows[y];
		$(rowId).attr("value","0");
	  };
	};
	
	$(".gameOverModal").modal("hide");
  });
  
  socket.on("leave_to_client", function() {
	$(".gameOverModal").modal("hide");
	window.location = "#/home";
  });
  
  $scope.forfeit = function(){
	socket.emit("forfeit_to_server", {playerId:playerId, roomId:roomId}); 
  };
  
  socket.on("forfeit_to_client", function() {
	socket.emit("leave_to_server", roomId); 
  });
  
  socket.on("live_update_to_client", function(data) {
	$("#liveUpdate").html(data); 
  });
  
  $scope.leaders = function() {
	socket.emit("leaders_to_server");
  };
  
  socket.on("leaders_to_client", function(data) {
	leaders = data;
	console.log(data);
  });
  
  $scope.leadersArray = leaders;
  
}]);


