

const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;

class Fire extends GameMap {

    constructor(data, mapName) {
        super(data, mapName);

        this.leftEnabled = data.leftEnabled || false;
        this.rightEnabled = data.rightEnabled || false;

        this.leftTimer = 0;
        this.leftTimerCoolDown = 7;
        this.leftTimerActivateTimer = 10;

        this.rightTimer = 0;
        this.rightTimerCoolDown = 7;
        this.rightTimerActivateTimer = 12;

        this.rightFireActivate = false;
        this.leftFireActivate = false;

    }

    initMap() {
        this.leftEnabled && this.enableLeftFire();
        this.rightEnabled && this.enableRightFire();
    }

    enableLeftFire() {
        this.leftFireActivate = true;
        this.leftTimer = setTimeout(() => {
            this.disableLeftFire();
        }, this.leftTimerCoolDown * 1000);
    }

    disableLeftFire() {
        this.leftFireActivate = false;
        this.leftTimer = setTimeout(() => {
            this.enableLeftFire();
        }, this.leftTimerActivateTimer * 1000);
    }

    enableRightFire() {
        this.rightFireActivate = true;
        this.rightTimer = setTimeout(() => {
            this.disableRightFire();
        }, this.rightTimerCoolDown * 1000);
    }

    disableRightFire() {
        this.rightFireActivate = false;
        this.rightTimer = setTimeout(() => {
            this.enableRightFire();
        }, this.rightTimerActivateTimer * 1000);
    }

}

schema.defineTypes(Fire, {

    leftEnabled: 'boolean',
    rightEnabled: 'boolean',
    //
    leftFireActivate: 'boolean',
    rightFireActivate: 'boolean',

});
exports.Fire = Fire;