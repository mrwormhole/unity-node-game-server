var ServerObject = require('./ServerObject.js');
//var vec2 = require('./Vector2D.js');

module.exports = class Food extends ServerObject{
    constructor(){
        super();
        this.name = "Pizza";
    }
};