var io = require('socket.io')(process.env.PORT || 4567);

var ClientInfo = require('./ClientInfo.js');
var Player = require('./Player.js');
var Food = require('./Food.js');

console.log('[SERVER-INFO] Server has started');

var players = [];
var sockets = [];
var foods = [];

io.on('connection', function (socket) {
    console.log('[SERVER-INFO] A player has connected');

    var info = new ClientInfo();

    socket.emit('checkVersion', info);
    socket.on('checkedVersion',(data) => {
        if(data.version != info.version) {
            console.log('[SERVER-INFO] A player\'s version is out of date ' + data.version
                + '| socket id: ' +socket.id);
            socket.disconnect();
        }
        else {
            console.log('[SERVER-INFO] A player\'s version is up to date ' + data.version
                + '| socket id: ' + socket.id);
        }
    });


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
        player.rotationZ = data.rotationZ; //do we really need this one here?
        //player.position = data.position; //try this one instead of first 2 lines?

        socket.broadcast.emit('updatePosition',player);
    });

    socket.on('spawnPizza',function (data) {
       var food = new Food();
       food.name = 'Food';
       food.position.x = data.position.x;
       food.position.y = data.position.y;

       foods.push(food);

       var returnData = {
           name: food.name,
           id: food.id,
           position: {
               x: food.position.x,
               y: food.position.y
           },
           type: food.type
       }

       socket.emit('serverSpawn',returnData);
       socket.broadcast.emit('serverSpawn',returnData);
    });

    socket.on('disconnect', function () {
       console.log('[SERVER-INFO] A player has disconnected');
       delete players[thisPlayerID];
       delete sockets[thisPlayerID];
       socket.broadcast.emit("disconnected",player);
    });
});