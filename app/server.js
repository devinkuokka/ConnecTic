var app = require('express')();
var server = require("http").Server(app);
var io = require('socket.io')(server);
var uuid = require("uuid");

console.log('Server running at port 8000');

app.listen(8000);


app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
	res.redirect('index.html')
});

io.on('connection', function (socket) {
	console.log("connected");
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
    console.log("connected");
  });
});