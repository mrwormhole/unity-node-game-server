var shortID = require('shortid');

var vec2 = require('./Vector2D.js');

module.exports = class Player {
    constructor(){
        this.username = "";
        this.id = shortID.generate();
        this.position = new vec2();
        this.rotationZ = 0;
    }
};