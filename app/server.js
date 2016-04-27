var express = require('express');
var app = express();
var server = require("http").Server(app);
var socketio = require('socket.io');
var io = socketio.listen(app.listen(8000));
var uuid = require("uuid");

var players = [];
var rooms = [];
var sockets = [];


//app.listen(8000);
console.log('Server running at port 8000');

app.use(express.static(__dirname + '/app'));
app.use('/components', express.static(__dirname + '/components'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/photos', express.static(__dirname + '/photos'));


app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('../node_modules', express.static(__dirname + '../node_modules'));


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
});


io.on('connection', function (socket) {
	socket.on("new_player_to_server", function(data){
		var playerId = socket.id;
		var playerName = data;
		players.push(
			{
				'id': playerId,
				'name': playerName,
				'score': 0,
				'roomId': "temp",
				'active': true
			}
		);
		socket.emit("new_player_to_client", {playerId:playerId, playerName:playerName});
		sockets[playerId] = socket;
		socket.join("temp");
	});
	
	socket.on("new_room_to_server", function(data) {
		var gameId = data.gameId;
		var roomId = uuid.v4();
		rooms.push({
				'id': roomId,
				'name': data.name,
				'gameId': gameId,
				'p1Id': data.p1Id,
				'p1Name': data.p1Name,
				'p2Id': null,
				'p2Name': null,
				'canJoin': true
		});
		socket.emit("new_room_to_client", {roomId:roomId, gameId:gameId});
		io.sockets.emit("request_rooms_to_client", rooms);
		socket.leave("temp");
		socket.join(roomId);
		
		for (var x in players) {
			var player = players[x];
			if (player.id == data.playerId) {
				player.roomId = roomId;
			};
		};
		
	});
	
	socket.on("request_rooms_to_server", function() {
		io.sockets.emit("request_rooms_to_client", rooms);
	});
	
	socket.on("join_room_to_server", function(data) {
		var gameId = "";
		socket.leave("temp");
		socket.join(data.roomId);
		for (var x in rooms) {
			var room = rooms[x];
			if (room.id == data.roomId) {
				room.p2Id = data.playerId;
				room.p2Name = data.playerName;
				room.canJoin = false;
				gameId = room.gameId;
			}
		};
		
		for (var x in players) {
			var player = players[x];
			if (player.id == data.playerId) {
				player.roomId = data.roomId;
			};
		};
		
		io.sockets.in(data.roomId).emit("join_room_to_client", {roomId:data.roomId, gameId:gameId});
		io.sockets.emit("request_rooms_to_client", rooms);
	});
	
	socket.on('msg_to_server', function(data) {
		for (var x in players) {
			var player = players[x];
			if (player.id == data.playerId) {
				
				if (player.roomId == "temp") {
					io.sockets.in("temp").emit("msg_to_client", {playerName:data.playerName, msg:data.msg});
				}
				else {
					io.sockets.in(player.roomId).emit("msg_to_client", {playerName:data.playerName, msg:data.msg});
				}
			}; 
		};	
	});
	
	socket.on('turn_to_server', function(data) {
		for (var x in rooms) {
			var room = rooms[x];
			if (room.id == data.roomId) {
				if (room.p1Id == data.playerId) {
					io.to(room.p2Id).emit("turn_to_client", {cellId:data.cellId, count:data.count});
				}
				else {
					io.to(room.p1Id).emit("turn_to_client", {cellId:data.cellId, count:data.count});
				}
			}; 
		};	
	});
	
	socket.on('game_over_to_server', function(data) {
		for (var x in rooms) {
			var room = rooms[x];
			if (room.id == data.roomId) {
				if (room.p1Id == data.playerId) {
					io.to(room.p1Id).emit("game_over_to_client", {win:true});
					io.to(room.p2Id).emit("game_over_to_client", {win:false});
					var msg = room.p1Name + " beat " + room.p2Name;
					io.sockets.emit("live_update_to_client", msg);
					for (var y in players) {
						var player = players[y];
						if (player.id == room.plId) {
							player.score = player.score + 10;
							console.log(player.score);
						}; 
					};	
				}
				else {
					io.to(room.p1Id).emit("game_over_to_client", {win:false});
					io.to(room.p2Id).emit("game_over_to_client", {win:true});
					var msg = room.p2Name + " beat " + room.p1Name;
					io.sockets.emit("live_update_to_client", msg);
					for (var y in players) {
						var player = players[y];
						if (player.id == room.p2Id) {
							player.score = player.score + 10;
						}; 
					};	
				}
			}; 
		};	
	});
	
	socket.on('tie_game_to_server', function(data) {
		for (var x in rooms) {
			var room = rooms[x];
			if (room.id == data.roomId) {
				io.to(room.id).emit("tie_game_to_client");
				var msg = room.p2Name + " tied " + room.p1Name;
				io.sockets.emit("live_update_to_client", msg);
			}; 
		};	
	});
	
	socket.on('rematch_to_server', function(data) {
		for (var x in rooms) {
			var room = rooms[x];
			if (room.id == data.roomId) {
				if (room.p1Id == data.playerId) {
					io.to(room.p2Id).emit("rematch_to_client");
				} else {
					io.to(room.p1Id).emit("rematch_to_client");
				}
			}; 
		};	
	});
	
	socket.on('accept_to_server', function(data) {
		for (var x in rooms) {
			var room = rooms[x];
			if (room.id == data) {
				io.to(room.id).emit("accept_to_client");
			}; 
		};	
	});
	
	socket.on('forfeit_to_server', function(data) {
		for (var x in players) {
			var player = players[x];
			if (player.id == data.playerId) {
				player.score = player.score - 10;
				io.to(player.id).emit("forfeit_to_client");
				var msg = player.name + " forfeited";
				io.sockets.emit("live_update_to_client", msg);
			}; 
		};	
	});
	
	socket.on('leave_to_server', function(data) {
		for (var x in rooms) {
			var room = rooms[x];
			if (room.id == data) {
				for (var y in players) {
					var player = players[y];
					if (player.id == room.p1Id || player.id == room.p2Id) {
						player.roomId = 'temp';
						io.to(player.id).emit("leave_to_client");
						sockets[player.id].leave(room.id);
					};
				};
				rooms.splice(x, 1);
			};
		};	
	});
	
	socket.on('leaders_to_server', function() {
		io.sockets.in("temp").emit("leaders_to_client", players);
	});
	
});