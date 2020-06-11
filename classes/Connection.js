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
            // a way of signing out
            if(data.version != server.version) {
                Util.logWarning('[SERVER-INFO] A player\'s version is out of date ' + data.version + '| socket id: ' +socket.id);                
            }
            else {
                Util.logSuccess('[SERVER-INFO] A player\'s version is up to date ' + data.version + '| socket id: ' + socket.id);
                connection.socket.emit('register', { id: connection.player.id});
            }
        });

        socket.on('disconnect', function () {
            // a way of signing in
            server.onDisconnected(connection);
        });

        socket.on('joinGame', function (data) {
            // joining the game after username and skin is picked
            connection.player.username = data.username;
            connection.player.skin = data.skin;
            connection.player.weapon = data.weapon;

            server.onAttemptToJoinGame(connection)
        });

        socket.on('updatePosition', function (data) {
            player.position = data.position;
            player.rotationZ = data.rotationZ;
            
            //hot bug fix after live test, issue #Corona Server Load
            if ( connection !== undefined) {
                socket.broadcast.to(connection.lobby.id).emit('updatePosition',player);
            }
        });

        socket.on('spawnPizza', function () {
            // spawn pizza
            if(connection !== undefined) {
                connection.lobby.onSpawnPizza(connection);
            }
        });

        socket.on('unspawnPizza', function (data) {
            // unspawn pizza
            if(connection !== undefined) {
                connection.lobby.onUnspawnPizza(connection, data);
            }
        });

        socket.on('collisionDestroy', function (data) {
            // collision destroy
            if(connection !== undefined) {
                connection.lobby.onCollisionDestroy(connection, data);
            }
        });
    }

    checkVersion(){
        // First call to get info from client after client is connected to me
        let connection = this;
        let server = connection.server;

        connection.socket.emit('checkVersion', { version: server.version});
    }

};