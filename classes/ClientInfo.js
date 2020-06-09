var Reward = require('./Reward.js');

module.exports = class ClientInfo{
  constructor(){
      this.version = "v1.0.0b";
      this.reward = new Reward(100);
  }
};