var socket = io.connect('http://localhost');
var user;

// chat message received
socket.on('message', function (msg) {
    console.log(msg);
    addMessage(msg);
});

// new user joined
socket.on('new-user', function (user) {
    $('#chat-log').append('<li>' + user.name + ' joined</li>');
    addUser(user);
});

// user list
socket.on('users', function (users) {
    for (var i = 0; i < users.length; i++)
        addUser(users[i]);
});

$(function () {
    $('.modal').modal('show');

    // join the chat
    $('#connect').click(function () {
        user = { name: $('#name').val() };
        socket.emit('join', user);
    });

    // send a message
    $('#msg').keypress(function (event) {
        if (event.which == 13) {
            var msg = { user: user.name, text: $(this).val() };
            socket.emit('message', msg);
            addMessage(msg);

            $('#msg').val('');
            return false;
        }
    });
});

function addUser(user) {
    $('#users').append('<li>' + user.name + '</li>');
}

function addMessage(msg) {
    $('#chat-log').append('<li>' + msg.user + ': ' + msg.text + '</li>');
}