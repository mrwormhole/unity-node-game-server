module.exports = class GameLobbySettings {
    constructor(gameMode = 'rip and tear', maxPlayers, maxFoods) {
        this.gameMode = gameMode;
        this.maxPlayers = maxPlayers;
        this.maxFoods = maxFoods;
    }
};