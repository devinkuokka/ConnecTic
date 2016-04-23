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
	console.log("connected");
	socket.on("new_player_to_server", function(data){
		var playerId = socket.id;
		players.push(
			{
				'id': playerId,
				'name': data,
				'gameId': null,
				'roomId': null
			}
		);
		socket.emit("new_player_to_client", playerId);
		console.log(players);
		
	});
	
	socket.on("new_room_to_server", function(data){
		rooms.push(
			{
				'id': uuid.v4(),
				'name': data.name,
				'gameId': data.gameId,
				'board': null,
				'player1': data.player1,
				'player2': null
			}
		);
		console.log(rooms);
	});
});