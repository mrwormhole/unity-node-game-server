let Connection = require('../Connection.js');
let Util = require('../Util.js'); //for logging

module.exports = class LobbyBase {
  constructor(id){
      this.id = id;
      this.connections = [];
  }

  onEnterLobby(connection = Connection){
    let lobby = this;
    let player = connection.player;

	  Util.logInfo('[LOBBY-INFO] Player ' + player.debugPlayerInformation() + ' has entered the lobby: '  + lobby.id);

    lobby.connections.push(connection);

    player.lobby = lobby.id;
    connection.lobby = lobby;
  }

  onLeaveLobby(connection = Connection){
      let lobby = this;
      let player = connection.player;

	    Util.logInfo('[LOBBY-INFO] Player ' + player.debugPlayerInformation() + ' has left the lobby: '  + lobby.id);

      connection.lobby = undefined;

      let index = lobby.connections.indexOf(connection);
      if(index > -1){
          lobby.connections.splice(index,1);
      }
  }
};
