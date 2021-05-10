const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const State = require('./schema/State').State;
const Player = require('./schema/State').Player;
const Constants = require('../Constants').Constants;

class MyRoomGameLogic extends colyseus.Room {

    constructor() {
        super();

        this.maxClients = 2;
        this.playerCount = 0;
        this.durationTimer = 0;
        this.isReady = false;
        this.isTimerActive = false;

        this.clientsReadyCount = 0;
    }

    startGame() {
        this.isReady = true;
        this.isTimerActive = true;

        this.state.startGame();
        this.state.timerCount = Constants.ROUND_DURATION;
        this.startTimer();
    }

    startTimer() {
        this.durationTimer = setInterval(() => {
            this.updateRoundTime();
        }, 1000);
    }

    removeTimer() {
        clearInterval(this.durationTimer);
    }

    setTimerActive(bool) {
        this.isTimerActive = bool;
    }

    getClientById(clientId) {
        for (let index = 0; index < this.clients.length; index++) {
            if (this.clients[index].id === clientId)
                return this.clients[index];
        }
    }

    updateRoundTime() {
        if (this.isTimerActive) {

            this.state.timerCount--;

            if (this.state.timerCount < 0) {
                //Switch Player Turn
                this.setTimerActive(false);
                this.switchPlayerTurn();
            }
        }
    }

    switchPlayerTurn() {
        // Switching turn to next player
        this.state.timerCount = Constants.ROUND_DURATION;
        this.state.changePlayerTurn();
        this.setTimerActive(true);
    }
}

schema.defineTypes(MyRoomGameLogic, {
    playerCount: 'number',
    durationTimer: 'number',
});
exports.MyRoomGameLogic = MyRoomGameLogic;