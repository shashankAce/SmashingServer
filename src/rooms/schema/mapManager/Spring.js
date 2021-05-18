const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;

class Spring extends GameMap {

  constructor(data, mapName) {
    super(data, mapName);

    this.leftEnabled = data["mode"].leftEnabled || false;
    this.rightEnabled = data["mode"].rightEnabled || false;

    this.topEnabled = data["mode"].topEnabled || false;
    this.bottomEnabled = data["mode"].bottomEnabled || false;

    this.centerEnabled = data["mode"].centerEnabled || false;
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
