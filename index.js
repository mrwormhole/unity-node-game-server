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
        x: parseFloat(Math.round(randomX * 100) / 100).toFixed(2),
        y: parseFloat(Math.round(randomY * 100) / 100).toFixed(2)
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
            x: (pos.x * 1000.0) / 1000.0,
            y: (pos.y * 1000.0) / 1000.0
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
        x: (pos.x * 1000.0) / 1000.0,
        y: (pos.y * 1000.0) / 1000.0
    };
}

async function test(){
    console.log(1);
    await sleep(1000);
    console.log(2);
    await sleep(1000);
    console.log(3);
}

function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve,ms)
    });
}

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


    var properPosition = findAproperPosition2(players);
    var player = new Player(properPosition.x,properPosition.y);
    player.username = "Jackson"; //this works

    var thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    socket.emit('register', {id: thisPlayerID});

    console.log(player.position.x + "," + player.position.y);
    socket.emit('spawn', player);
    socket.broadcast.emit('spawn', player);
    //io.emit('spawn',player); exits for 2 lines?

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