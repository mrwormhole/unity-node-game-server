module.exports = class Vector2D{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    Magnitude(){
        // returns magnitude which is scalar
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    NormalizedVector(){
        // returns normalized vector object which is not scalar
        var mag = this.Magnitude();
        return new Vector2D(this.x/mag,this.y/mag);
    }

    Distance(O = Vector2D){
        // returns distance which is scalar
        var direction = new Vector2D();
        direction.x = O.x - this.x;
        direction.y = O.y - this.y;
        return new direction.Magnitude();
    }

    DebugPosition(){
        return "(" + this.x + "," + this.y + ")";
    }
};