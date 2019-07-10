let io = require('socket.io')(process.env.PORT || 4567);
let Server = require('./classes/Server.js');

console.log('[SERVER-INFO] Server has started');

var ClientInfo = require('./classes/ClientInfo.js'); //do i really need this here?

let server = new Server();

io.on('connection', function (socket) {
    var info = new ClientInfo(); //?
    let connection = server.onConnected(socket);
    connection.createEvents();
    connection.socket.emit('checkVersion', info); //?
    connection.socket.emit('register', {'id': connection.player.id}); //this might remove checkVersion??
});




