var socket = io.connect('http://localhost');
var user;

// chat message received
socket.on('message', function (msg) {
    addMessage(msg);
});

// user list
socket.on('users', function (users) {
    for (var i = 0; i < users.length; i++)
        addUser(users[i]);
});

// new user joined
socket.on('new-user', function (user) {
    $('#chat-log').append('<li>' + user.name + ' joined</li>');
    addUser(user);
});

// disconnect
socket.on('disconnect', function (user) {
    if (user != null) {
        $('#chat-log').append('<li>' + user.name + ' left</li>');
        $('#user-' + user.name).fadeOut('fast');
    }
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
            sendMessage($(this).val());

            $('#msg').val('');
            return false;
        }
    });
});

function addUser(user) {
    $('#users').append('<li id="user-' + user.name + '">' + user.name + '</li>');
}

function sendMessage(text) {
    var msg = { user: user.name, text: text };
    socket.emit('message', msg);
    addMessage(msg);
}

function addMessage(msg) {
    console.log(msg);

    msg.text = linkifyUrls(msg.text);

    $('#chat-log').append('<li>' + msg.user + ': ' + msg.text + '</li>')
        .scrollTop($(this).height())
}

function linkifyUrls(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, '<a target="_blank" href="$1">$1</a>');
}