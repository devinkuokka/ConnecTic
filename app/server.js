var express = require('express'),
	app = express(),
	http = require("http"),
	socketio = require("socket.io"),
	fs = require("fs"),
	uuid = require("uuid");

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
	res.redirect('index.html')
});

app.listen(8000);