module.exports = class Util{

    static generateRandomN(min,max){
        return Math.round(Math.random() * (max-min) + max);
    }

    static generateRandomXY(minX,maxX,minY,maxY){
        var randomX = Math.random() * (maxX - minX) + minX;
        var randomY = Math.random() * (maxY - minY) + minY;

        return {
            x: Math.round(randomX * 100) / 100,
            y: Math.round(randomY * 100) / 100
        };
    }

    static findAproperPosition(connections) {
        var tempPosition = this.generateRandomXY(-18,19,-10,11);
        var r = 4;
        var len = connections.length;
        if(len == 1){
            return {
                x: tempPosition.x,
                y: tempPosition.y
            };
        }
        var solutionFound = false;
        while(!solutionFound){
            var tempPosition = this.generateRandomXY(-18,19,-10,11);
            var len = connections.length;

            for(var i = 0; i < connections.length; i++){
                if(!connections[i].hasOwnProperty('player')){
                    continue;
                }
                len--;
                var a = connections[i].player.position.x;
                var b = connections[i].player.position.y;
                if(((tempPosition.x - a) ** 2 + (tempPosition.y - b) ** 2 < r ** 2)) {
                    break;
                }
                if(len == 1){
                    solutionFound = true;
                }
            }
        }
        return {
            x: tempPosition.x,
            y: tempPosition.y
        };
    }

    static findAproperPositionForFoods(foods){
        var tempPosition = this.generateRandomXY(-18,19,-10,11);
        var r = 1.2;
        var count = foods.length;
        if(count == 0){
            return {
                x: tempPosition.x,
                y: tempPosition.y
            };
        }
        var solutionFound = false;
        while(!solutionFound){
            var tempPosition = this.generateRandomXY(-18,19,-10,11);
            var count = foods.length;

            for(var i = 0; i < foods.length; i++){
                count--;
                var a = foods[i].position.x;
                var b = foods[i].position.y;
                if(((tempPosition.x - a) ** 2 + (tempPosition.y - b) ** 2 < r ** 2)) {
                    break;
                }
                if(count == 0){
                    solutionFound = true;
                }
            }
        }
        return {
            x: tempPosition.x,
            y: tempPosition.y
        };
    }

};