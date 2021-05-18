const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;

class Wind extends GameMap {

  constructor(data, mapName) {
    super(data, mapName);

    this.leftEnabled = data["mode"].leftEnabled || false;
    this.rightEnabled = data["mode"].rightEnabled || false;
  }
}

schema.defineTypes(Wind, {
  leftEnabled: 'boolean',
  rightEnabled: 'boolean',
});
exports.Wind = Wind;
