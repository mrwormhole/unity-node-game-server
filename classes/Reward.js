module.exports = class Reward {
    constructor(kryptoniteAmount = 0, skinID = null, weaponID = null) {
        this.kryptonite = kryptoniteAmount;
        this.skin = skinID;
        this.weapon = weaponID;
    }
};