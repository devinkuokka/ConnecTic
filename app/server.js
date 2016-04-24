var express = require('express');
var app = express();
var server = require("http").Server(app);
var socketio = require('socket.io');
var io = socketio.listen(app.listen(8000));
var uuid = require("uuid");



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

// Players = [
//	{	id:
//		name:
//		score:
//		gameId:
//		roomId:
//	},
//];

// Rooms = [
//	{	id:
//		name:
//		gameId:
//		board:
//		player1:
//		player2:
//	},
//];

var players = [];
var rooms = [];


io.on('connection', function (socket) {
	socket.on("new_player_to_server", function(data){
		var playerId = socket.id;
		var playerName = data;
		players.push(
			{
				'id': playerId,
				'name': playerName,
				'score': 0
			}
		);
		socket.emit("new_player_to_client", {playerId:playerId, playerName:playerName});
	});
	
	socket.on("new_room_to_server", function(data) {
		var gameId = data.gameId;
		var roomId = uuid.v4();
		rooms.push(
			{
				'id': roomId,
				'name': data.name,
				'gameId': gameId,
				'board': null,
				'p1Id': data.p1Id,
				'p1Name': data.p1Name,
				'p2Id': null,
				'p2name': null
			}
		);
		socket.emit("new_room_to_client", {roomId:roomId, gameId:gameId});
		socket.emit("request_rooms_to_client", rooms);
		socket.join(roomId);
	});
	
	socket.on("request_rooms_to_server", function() {
		socket.emit("request_rooms_to_client", rooms);
	});
	
	
	
	
	
});