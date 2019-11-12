let io = require('socket.io')(process.env.PORT || 4567);
let Server = require('./classes/Server.js');
let Util = require('./classes/Util.js');

let server = new Server('v1.0.0b');
Util.logSuccess('[SERVER-INFO] Server has started');

io.on('connection', function (socket) {
    let connection = server.onConnected(socket);
    connection.createEvents();
    connection.checkAndRegister();
});




