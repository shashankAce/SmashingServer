const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const State = require('./schema/State').State;
const Player = require('./schema/State').Player;

class MyRoomGameLogic extends colyseus.Room {

    constructor() {
        super();
        this.maxClients = 2;
        this.playerCount = 0;
        this.gameTimeCount = 5;
        this.gameTimer = 0;
    }

    #authorName = "Shashank";

    startGame() {

        this.startTimer();

    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            this.updateGameTime();
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.gameTimer);
    }

    getAutherName() {
        return this.#authorName;
    }

    getClientById(clientId) {
        for (let index = 0; index < this.clients.length; index++) {
            if (this.clients[index].id === clientId)
                return this.clients[index];
        }
    }

    updateGameTime() {

        if (this.gameTimeCount <= 0) {
            //Switch Player Turn
            this.switchPlayerTurn();

            this.gameTimeCount = GAME_TIME_COUNT;
        } else {
            this.broadcast("gameTimerUpdate", {
                timerCount: this.gameTimeCount
            });
        }
        this.gameTimeCount--;
    }

    switchPlayerTurn() {
        // Switching turn to next player
        this.state.changePlayerTurn();

        let plyr = this.state.getActivePlayer();
        this.broadcast("switchTurn", {
            name: plyr.name,
            playerTurnId: plyr.sessionId,
            heroId: plyr.getActiveHero().id
        });
    }
}

schema.defineTypes(MyRoomGameLogic, {
    playerCount: 'number',
    gameTimeCount: 'number',
    gameTimer: 'number'
});

exports.MyRoomGameLogic = MyRoomGameLogic;