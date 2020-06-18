var shortID = require('shortid');
var sizeof = require('object-sizeof'); // for measuring packet sizes

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
    }

    debugPlayerInformation() {
        let player = this;
        return '(' + player.username + ' : ' + player.id + ')';
    }

    debugPlayerPacket() {
        console.log(`Username:${sizeof(this.username)}bytes, \n
                    Skin:${sizeof(this.skin)}bytes, \n
                    Weapon:${sizeof(this.weapon)}bytes, \n
                    Id:${sizeof(this.id)}bytes, \n
                    Position: ${sizeof(this.position)}bytes, \n
                    RotationZ: ${sizeof(this.rotationZ)}bytes, \n`);
    }
};