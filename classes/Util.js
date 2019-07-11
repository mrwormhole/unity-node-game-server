module.exports = class Util{
    constructor(){
        console.log("Util is working");
    }
    static generateRandomXY() {
        var minX = -18;
        var maxX = 18+1;
        var minY = -10;
        var maxY = 10+1;
        var randomX = Math.random() * (maxX - minX) + minX;
        var randomY = Math.random() * (maxY - minY) + minY;

        return {
            x : parseFloat(Math.round(randomX * 100) / 100).toFixed(2),
            y : parseFloat(Math.round(randomY * 100) / 100).toFixed(2)
        };
    }

    static findAproperPosition(connections) {
        for(var i = 0; i < connections.length; i++){
            console.log(connections[i].player);
        }
        var tempPosition = this.generateRandomXY();
        var r = 4;
        var len = connections.length;
        if(len == 1){
            console.log('I have found a proper position: ' + tempPosition.x + ' , ' + tempPosition.y);
            return {
                x: (tempPosition.x * 1000.0) / 1000.0,
                y: (tempPosition.y * 1000.0) / 1000.0
            };
        }
        var solutionFound = false;
        while(!solutionFound){
            var tempPosition = this.generateRandomXY();
            var len = connections.length;

            for(var i = 0; i < connections.length; i++){
                //console.log('c: ' + c.player); //len is always 2;
                if(!connections[i].hasOwnProperty('player')){
                    //console.log('BOOOM');
                    continue;
                }
                len--;
                var a = connections[i].player.position.x;
                var b = connections[i].player.position.y;
                if(((tempPosition.x - a) ** 2 + (tempPosition.y - b) ** 2 < r ** 2)) {
                    //this means start calculation over
                    console.log('calculation failed');
                    break;
                }
                if(len == 1){
                    console.log('I have found a proper position: ' + tempPosition.x + ' , ' + tempPosition.y);
                    solutionFound = true;
                }
            }
        }
        return {
            x: (tempPosition.x * 1000.0) / 1000.0,
            y: (tempPosition.y * 1000.0) / 1000.0
        };
    }

};