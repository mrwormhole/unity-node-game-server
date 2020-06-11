var shortID = require('shortid');

var vec2 = require('./Vector2D.js');

module.exports = class Player {
    constructor(x, y, u = 'notdefined', s = '800', weapon= '800'){
        this.username = u; //customizable
        this.skin = 800; //customizable
        this.weapon = 800; //customizable
        this.id = shortID.generate();
        this.lobby = 0;
        this.position = new vec2(x,y);
        this.rotationZ = 0;
        this.isDead = false;
    }

    debugPlayerInformation(){
        let player = this;
        return '(' + player.username + ' : ' + player.id + ')';
    }
};