module.exports = class GameLobbySettings {
    constructor(gameMode = 'rip and tear', maxPlayers) {
        this.gameMode = gameMode;
        this.maxPlayers = maxPlayers;
    }
};