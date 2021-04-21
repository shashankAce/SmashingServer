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
        this.durationCount = Constants.ROUND_DURATION;
        this.durationTimer = 0;
        this.isReady = false;
        this.isTimerActive = false;

        //Todo later
        this.pendingActions = [];

        //
        this.clientsReadyCount = 0;
    }

    startGame() {
        this.isReady = true;
        this.isTimerActive = true;
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

            this.broadcast("onClockUpdate", {
                time: this.durationCount
            });

            if (this.durationCount <= 0) {
                //Switch Player Turn
                this.isTimerActive = false;
                this.switchPlayerTurn();
            }

            this.durationCount--;
        }
    }

    switchPlayerTurn() {
        // Switching turn to next player
        this.durationCount = Constants.ROUND_DURATION;
        this.state.changePlayerTurn();

        let plyr = this.state.getActivePlayer();
        this.broadcast("switchTurn", {
            name: plyr.name,
            playerTurnId: plyr.sessionId,
            heroId: plyr.getActiveHero().id
        });
        this.setTimerActive(true);
    }
}

schema.defineTypes(MyRoomGameLogic, {
    playerCount: 'number',
    durationCount: 'number',
    durationTimer: 'number'
});

exports.MyRoomGameLogic = MyRoomGameLogic;