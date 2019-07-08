var shortID = require('shortid');

var vec2 = require('./Vector2D.js');

module.exports = class Player {
    constructor(x, y){
        this.username = "";
        this.id = shortID.generate();
        this.position = new vec2(x,y);
        this.rotationZ = 0;
    }
};