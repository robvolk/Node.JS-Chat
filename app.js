var express = require('express')
  , app = express();

// global list of users
var users = [];

// configure web server
app.configure(function () {
    app.use(express.bodyParser({
        keepExtensions: true,
        uploadDir: __dirname + '/tmp',
        limit: '20mb'
    }));
    app.use(app.router)
        .use(express.static(__dirname + '/js'))
        .use(express.static(__dirname + '/tmp'));
});


// start the web server
var server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
server.listen(4000);


// routes
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.post('/attach', function (req, res) {
    // file upload
    console.log('uploaded ' + req.files.attachment.path.replace(/^.*[\\\/]/, ''));
    res.send(req.files.attachment.path.replace(/^.*[\\\/]/, ''));
});



// sockets server
io.sockets.on('connection', function (socket) {
    // new user joined
    socket.on('join', function (user) {
        console.log(user.name + ' connected');

        // store the user object with this socket
        socket.set('user', user);
        socket.emit('message', { user: '', text: 'Hi ' + user.name + '!  Welcome to Chat Lingual.' });

        if (users.length == 0)
            socket.emit('message', { user: '', text: 'It\'s lonley in here.. Invite your friends to chat!' });

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

    socket.on('disconnect', function () {
        socket.get('user', function (err, user) {
            if (user != null) {
                console.log(user.name + ' disconnected');

                // remove the user from the list
                var index = users.indexOf(user);
                users.splice(index, 1);

                socket.broadcast.emit('disconnect', user);
            }
        });
    });
});