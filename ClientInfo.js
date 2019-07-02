var reward = require('./Reward.js');

module.exports = class ClientInfo{
  constructor(){
      this.version = "v1.0.0";
      this.reward = new reward(100,null);
  }
};