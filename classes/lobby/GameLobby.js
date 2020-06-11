let LobbyBase = require('./LobbyBase.js');
let GameLobbySettings = require('./GameLobbySettings.js');
let Connection = require('../Connection.js');
let Util = require('../Util.js');
let Player = require('../Player.js');
let Food = require('../Food.js');

var sizeof = require('object-sizeof'); // for measuring packet sizes

module.exports = class GameLobby extends LobbyBase {
    constructor(id, settings = GameLobbySettings) {
        super(id);
        this.settings = settings;
        this.foods = []
    }

    canEnterLobby(connection = Connection) {
       let lobby = this;
       let maxPlayerCount = lobby.settings.maxPlayers;
       let currentPlayerCount = lobby.connections.length;

       if(currentPlayerCount + 1 > maxPlayerCount){
           return false;
       }
       return true;
    }

    onEnterLobby(connection = Connection) {
        let lobby = this;

        super.onEnterLobby(connection);
        lobby.addPlayer(connection);

        //Handle spawning any server spawned objects here
        if(lobby.foods.length == 0){
            for(var i=0;i<20;i++) {
                let food = new Food("Pizza");
    
                var properPosition = Util.findAproperPositionForFoods(lobby.foods);
                food.position.x = properPosition.x;
                food.position.y = properPosition.y;
                food.rotationZ = Util.generateRandomN(0,360);

                lobby.foods.push(food);
                connection.socket.emit('serverSpawn',food);
				
				Util.logDebug('[DEBUG] Server spawned ' + food.name + ` on ( ${food.position.x} , ${food.position.y} )` + ` on socket id: ${connection.socket.id}`);
            }
        }
        else{
            lobby.foods.forEach(f => {
                connection.socket.emit('serverSpawn',f);
            });
        }
    }

    onLeaveLobby(connection = Connection) {
        let lobby = this;

        super.onLeaveLobby(connection);
        lobby.removePlayer(connection);
    }

    onSpawnPizza(connection = Connection) {
        let lobby = this;

        let food = new Food("Pizza");
        var properPosition = Util.findAproperPositionForFoods(lobby.foods);
        food.position.x = properPosition.x;
        food.position.y = properPosition.y;
        food.rotationZ = Util.generateRandomN(0,360);

        lobby.foods.push(food);
        console.log("[FOOD COUNT]: ", this.foods.length);

        connection.socket.emit('serverSpawn',food);
        connection.socket.broadcast.to(lobby.id).emit('serverSpawn',food);
    }

    onUnspawnPizza(connection = Connection,data) {
        let lobby = this;
		Util.logDebug('[DEBUG] Collision with food happened. Food will die| food id: ' + data.id);

        var returnData = { id:data.id };

        lobby.foods = lobby.foods.filter(f => f.id != data.id);

        connection.socket.emit('serverUnspawn',returnData);
        connection.socket.broadcast.to(lobby.id).emit('serverUnspawn',returnData);
    }

    onCollisionDestroy(connection = Connection, data) {
        let lobby = this;
		Util.logDebug('[DEBUG] Collision with sword happened. Player will die| player id: ' + data.id);

        var returnData = { id: data.id };

        connection.socket.emit('unspawn',returnData);
        connection.socket.broadcast.to(lobby.id).emit('unspawn',returnData);
    }

    addPlayer(connection = Connection) {
        let lobby = this;
        let connections = lobby.connections;
        let socket = connection.socket;

        var properPosition = Util.findAproperPosition(connections);
        var player = new Player(properPosition.x,properPosition.y);

        player.id = connection.player.id;
        player.username = connection.player.username;
        player.skin = connection.player.skin;
        player.weapon = connection.player.weapon;

        //console.log("[DEBUG]Network is gonna get pumped this much: " + sizeof(IDlyingPlayer));

        socket.emit('spawn', player);
        socket.broadcast.to(lobby.id).emit('spawn',player);

        connections.forEach(c => {
            if(c.player.id != connection.player.id){
                socket.emit('spawn',c.player)
            }
        });
    }

    removePlayer(connection = Connection) {
        let lobby = this;

        connection.socket.broadcast.to(lobby.id).emit('disconnected',{
            id: connection.player.id
        });
    }

};
