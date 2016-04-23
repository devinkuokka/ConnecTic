var express = require('express');
var server = require("http").Server(app);
var app = express();
var socketio = require('socket.io');
var io = socketio.listen(server);
var uuid = require("uuid");



app.listen(8000);
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
	console.log("connected");
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
    console.log("connected");
  });
});