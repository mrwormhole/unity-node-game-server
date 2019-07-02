module.exports = class Reward{
    constructor(kryptoniteAmount = 0, skinID = null) {
        this.kryptonite = kryptoniteAmount;
        this.skin = skinID;
    }
};