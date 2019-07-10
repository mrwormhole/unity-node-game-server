let io = require('socket.io')(process.env.PORT || 4567);
let Server = require('./classes/Server.js');

console.log('[SERVER-INFO] Server has started');

let server = new Server();

io.on('connection', function (socket) {
    let connection = server.onConnected(socket);
    connection.createEvents();
    connection.socket.emit('checkVersion', { version: 'v1.0.0b'});
    connection.socket.emit('register', { id: connection.player.id});
});




