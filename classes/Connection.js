let Util = require('./Util.js'); //for logging

module.exports = class Connection {

    constructor(){
        this.socket;
        this.player;
        this.server;
        this.lobby;
    }

    createEvents(){
        let connection = this;
        let socket = connection.socket;
        let server = connection.server;
        let player = connection.player;

        socket.on('checkedVersion', function (data) {
            if(data.version != server.version) {
                Util.logWarning('[SERVER-INFO] A player\'s version is out of date ' + data.version + '| socket id: ' +socket.id);
                socket.disconnect();
            }
            else {
                Util.logSuccess('[SERVER-INFO] A player\'s version is up to date ' + data.version + '| socket id: ' + socket.id);
                connection.socket.emit('register', { id: connection.player.id});
            }
        });

        socket.on('disconnect', function () {
            server.onDisconnected(connection)
        });

        socket.on('joinGame', function (data) {
            connection.player.username = data.username;
            server.onAttemptToJoinGame(connection)
        });

        socket.on('updatePosition', function (data) {
            player.position = data.position;
            player.rotationZ = data.rotationZ;

            socket.broadcast.to(connection.lobby.id).emit('updatePosition',player);
        });

        socket.on('spawnPizza', function () {
            connection.lobby.onSpawnPizza(connection);
        });

        socket.on('unspawnPizza', function (data) {
            connection.lobby.onUnspawnPizza(connection, data);
        });

        socket.on('collisionDestroy', function (data) {
            connection.lobby.onCollisionDestroy(connection, data);
        });
    }

    checkVersion(){
        let connection = this;
        let server = connection.server;

        connection.socket.emit('checkVersion', { version: server.version});
    }
};