var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
server.listen(80);

// global list of users
var users = [];

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/client.js', function (req, res) {
    res.sendfile(__dirname + '/client.js');
});

io.sockets.on('connection', function (socket) {
    // new user joined
    socket.on('join', function (user) {
        socket.emit('message', { user: 'system', text: 'Hi ' + user.name + '!  Welcome to Chat Lingual.' });

        // send the list of users to the new person
        users.push(user);
        socket.emit('users', users);

        // notify all users about the new person in the room
        socket.broadcast.emit('new-user', user);
    });

    // broadcast chat messages
    socket.on('message', function (msg) {
        socket.broadcast.emit('message', msg);
    });
});