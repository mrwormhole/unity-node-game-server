var io = require('socket.io')(process.env.PORT || 4567);

var ClientInfo = require('./ClientInfo.js');
var Player = require('./Player.js');

console.log('[SERVER-INFO] Server has started');

var players = [];
var sockets = [];

io.on('connection', function (socket) {
    console.log('[SERVER-INFO] A player has connected');

    var info = new ClientInfo();

    socket.emit('checkVersion', info);

    var player = new Player();
    var thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    socket.emit('register', {id: thisPlayerID});
    socket.emit('spawn', player);
    socket.broadcast.emit('spawn', player);

    for(var playerID in players){
        if(playerID != thisPlayerID){
            socket.emit('spawn', players[playerID]);
        }
    }

    socket.on('updatePosition', function (data) {
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        player.rotationZ = data.rotationZ;
        //player.position = data.position; try this one instead of 2 lines

        socket.broadcast.emit('updatePosition',player);
    });

    socket.on('disconnect', function () {
       console.log('[SERVER-INFO] A player has disconnected');
       delete players[thisPlayerID];
       delete sockets[thisPlayerID];
       socket.broadcast.emit("disconnected",player);
    });
});