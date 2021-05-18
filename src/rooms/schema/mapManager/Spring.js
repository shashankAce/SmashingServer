
const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;

class Spring extends GameMap {

    constructor(data, mapName) {
        super(data, mapName);

        this.leftEnabled = data.leftEnabled || false;
        this.rightEnabled = data.rightEnabled || false;

        this.topEnabled = data.topEnabled || false;
        this.bottomEnabled = data.bottomEnabled || false;

        this.centerEnabled = data.centerEnabled || false;
    }
}

schema.defineTypes(Spring, {
    leftEnabled: 'boolean',
    rightEnabled: 'boolean',
    topEnabled: 'boolean',
    bottomEnabled: 'boolean',
    centerEnabled: 'boolean',
});
exports.Spring = Spring;