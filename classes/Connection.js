module.exports = class Connection{

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
          if(data.version != 'v1.0.0b') {
              console.log('[SERVER-INFO] A player\'s version is out of date ' + data.version
                  + '| socket id: ' +socket.id);
              socket.disconnect();
          }
          else {
              console.log('[SERVER-INFO] A player\'s version is up to date ' + data.version
                  + '| socket id: ' + socket.id);
          }
      });

    socket.on('disconnect', function () {
        server.onDisconnected(connection)
    });

    socket.on('joinGame', function () {
        server.onAttemptToJoinGame(connection)
    });

    socket.on('updatePosition', function (data) {
        player.position = data.position;
        player.rotationZ = data.rotationZ;

        socket.broadcast.to(connection.lobby.id).emit('updatePosition',player);
    });

    socket.on('spawnPizza', function (data) {
        connection.lobby.onSpawnPizza(connection,data);
    });

    socket.on('collisionDestroy', function (data) {
        connection.lobby.onCollisionDestroy(connection, data);
    });


  }
};