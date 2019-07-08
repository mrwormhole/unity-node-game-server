var io = require('socket.io')(process.env.PORT || 4567);

var ClientInfo = require('./ClientInfo.js');
var Player = require('./Player.js');
var Food = require('./Food.js');

console.log('[SERVER-INFO] Server has started');

function generateRandomXY() {
    var minX = -18;
    var maxX = 18+1;
    var minY = -10;
    var maxY = 10+1;
    var randomX = Math.random() * (maxX - minX) + minX;
    var randomY = Math.random() * (maxY - minY) + minY;

    return {
        x: randomX.toFixed(2),
        y: randomY.toFixed(2)
    };
}

function findAproperPosition(players) {
    var pos = generateRandomXY();
    var r = 4;
    var c = Object.keys(players).length;
    if(c == 0){
        console.log('I have found a proper position: ' + pos.x + ' , ' + pos.y);
        return {
            x: pos.x,
            y: pos.y
        };
    }
    for(var playerID in players){
        c--;
        a = players[playerID].position.x;
        b= players[playerID].position.y;
        // (x-a) **2 + (x-b) ** 2 <= r ** 2
        if(((pos.x - a) ** 2 + (pos.y - b) ** 2 < r ** 2)){
            //this means start calculation over
            console.log('calculation failed');
            findAproperPosition(players);
            break;
        }
        if(c == 0){
            console.log('I have found a proper position: ' + pos.x + ' , ' + pos.y);
            return {
                x: pos.x,
                y: pos.y
            };
        }
    }
}

function findAproperPosition2(players) {
    var pos = generateRandomXY();
    var r = 4;
    var c = Object.keys(players).length;
    if(c == 0){
        console.log('I have found a proper position: ' + pos.x + ' , ' + pos.y);
        return {
            x: pos.x,
            y: pos.y
        };
    }
    var solutionFound = false;
    while(!solutionFound){
        var pos = generateRandomXY();
        var c = Object.keys(players).length;
        for(var playerID in players){
            c--;
            a = players[playerID].position.x;
            b= players[playerID].position.y;
            // (x-a) **2 + (x-b) ** 2 <= r ** 2
            if(((pos.x - a) ** 2 + (pos.y - b) ** 2 < r ** 2)) {
                //this means start calculation over
                console.log('calculation failed');
                break;
            }
            if(c == 0){
                console.log('I have found a proper position: ' + pos.x + ' , ' + pos.y);
                solutionFound = true;
            }
        }
    }
    return {
        x: pos.x,
        y: pos.y
    };
}

var players = [];
var sockets = [];
var foods = [];

var spawnPointsX = [-18,18,-18,18];
var spawnPointsY = [10,10,-10,-10];
var inc = -1;

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

    var properPosition = findAproperPosition2(players);
    var player = new Player(properPosition,properPosition);
    player.username = "Jackson"; //this works
    //player.position.x = properPosition.x; //this doesn't work
    //player.position.y = properPosition.y; //this doesn't work

    //during the proper position calculation
    //player is created
    //and player gets the properPosition but if calculation is not calculated yet
    //it gets to 0,0 how can i wait until calculation is done??

    var thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    socket.emit('register', {id: thisPlayerID});

    console.log(player.position.x + "," + player.position.y);
    socket.emit('spawn', player);
    socket.broadcast.emit('spawn', player);

    for(var playerID in players){
        if(playerID != thisPlayerID){
            socket.emit('spawn', players[playerID]);
        }
    }

    socket.on('updatePosition', function (data) {
        player.position = data.position;
        player.rotationZ = data.rotationZ;

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
       };

       socket.emit('serverSpawn',returnData);
       socket.broadcast.emit('serverSpawn',returnData);
    });

    socket.on('collisionDestroy', function(data) {
       console.log('[SERVER-INFO] Collision with sword happened. Player will die| player id: ' + data.id)
    });

    socket.on('disconnect', function () {
       console.log('[SERVER-INFO] A player has disconnected');
       delete players[thisPlayerID];
       delete sockets[thisPlayerID];
       socket.broadcast.emit("disconnected",player);
    });
});