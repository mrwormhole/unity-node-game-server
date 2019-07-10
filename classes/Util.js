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
        var tempPosition = generateRandomXY();
        var r = 4;
        var len = connections.length;
        if(len == 0){
            console.log('I have found a proper position: ' + tempPosition.x + ' , ' + tempPosition.y);
            return {
                x: (tempPosition.x * 1000.0) / 1000.0,
                y: (tempPosition.y * 1000.0) / 1000.0
            };
        }
        var solutionFound = false;
        while(!solutionFound){
            var tempPosition = generateRandomXY();
            var len = connections.length;
            for(var c in connections){
                len--;
                var a = c.player.position.x;
                var b = c.player.position.y;
                if(((tempPosition.x - a) ** 2 + (tempPosition.y - b) ** 2 < r ** 2)) {
                    //this means start calculation over
                    console.log('calculation failed');
                    break;
                }
                if(len == 0){
                    console.log('I have found a proper position: ' + pos.x + ' , ' + pos.y);
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