

const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;

class Bomb extends GameMap {

    constructor(data, mapName) {
        super(data, mapName);
        this.bombInterval = 0;
        this.isReady = false;

    }

    updateFromClient(pos) {
        this.position = pos;
    }

    initMap() {
        this.counter = this.timer;
        this.isReady = true;
        this.startBombTimer();
    }

    startBombTimer() {

        this.bombInterval = setInterval(() => {
            if (this.isReady) {

                this.counter--;
                if (this.counter < 0)
                    this.counter = this.timer;
            }
        }, 1000);
    }

    removeTimer() {
        clearInterval(this.bombInterval);
    }

    pause() {
        this.isReady = false;
    }

    resume() {
        this.isReady = true;
    }

    stop() {
        this.isReady = false;
        this.removeTimer();
    }
}

schema.defineTypes(Bomb, {
    counter: 'number',
});
exports.Bomb = Bomb;