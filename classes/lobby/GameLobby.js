let LobbyBase = require('./LobbyBase.js');
let GameLobbySettings = require('./GameLobbySettings.js');
let Connection = require('../Connection.js');
let Util = require('../Util.js');
let Food = require('../Food.js');

var sizeof = require('object-sizeof');

module.exports = class GameLobby extends LobbyBase {
    constructor(id, settings = GameLobbySettings) {
        super(id);
        this.settings = settings;
        this.foods = []
    }

    canEnterLobby(connection = Connection){
       let lobby = this;
       let maxPlayerCount = lobby.settings.maxPlayers;
       let currentPlayerCount = lobby.connections.length;

       if(currentPlayerCount + 1 > maxPlayerCount){
           return false;
       }
       return true;
    }

    onEnterLobby(connection = Connection){
        let lobby = this;

        super.onEnterLobby(connection);
        lobby.addPlayer(connection);

        //Handle spawning any server spawned objects here
    }

    onLeaveLobby(connection = Connection){
        let lobby = this;

        super.onLeaveLobby(connection);
        lobby.removePlayer(connection);

        //Handle unspawning any server spawned objects here
    }

    onSpawnPizza(connection = Connection){
        let lobby = this;

        let food = new Food();
        food.name = 'Food';
        food.position = data.position;

        lobby.foods.push(food);

        var returnData = {
            name: food.name,
            id: food.id,
            position: {
                x: food.position.x,
                y: food.position.y
            },
            type: food.type
        };

        connection.socket.emit('serverSpawn',returnData);
        connection.socket.broadcast.to(lobby.id).emit('serverSpawn',returnData);
    }

    onCollisionDestroy(connection = Connection, data){
        console.log('[SERVER-INFO] Collision with sword happened. Player will die| player id: ' + data.id)
    }

    addPlayer(connection = Connection){
        let lobby = this;
        let connections = lobby.connections;
        let socket = connection.socket;

        var properPosition = Util.findAproperPosition(connections);
        var IDlyingPlayer = new Player(properPosition.x,properPosition.y,"Jackson");
        IDlyingPlayer.id = connection.player.id;

        console.log("Network is gonna get pumped this much: " + sizeof(IDlyingPlayer));

        socket.emit('spawn', IDlyingPlayer);
        socket.broadcast.to(lobby.id).emit('spawn',IDlyingPlayer);

        connections.forEach(c => {
            if(c.player.id != connection.player.id){
                socket.emit('spawn',c.player)
            }
        });
    }

    removePlayer(connection = Connection){
        let lobby = this;

        connection.socket.broadcast.to(lobby.id).emit('disconnected',{
            id: connection.player.id
        });
    }

};
