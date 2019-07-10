var shortID = require('shortid');

var vec2 = require('./Vector2D.js');

module.exports = class ServerObject{
    constructor(){
        this.name = "Server Object";
        this.id = shortID.generate();
        this.position = new vec2();
    }
};