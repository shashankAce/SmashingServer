const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;

class Saw extends GameMap {

  constructor(data, mapName) {
    super(data, mapName);

    this.leftEnabled = data["mode"].leftEnabled || false;
    this.rightEnabled = data["mode"].rightEnabled || false;
  }
}

schema.defineTypes(Saw, {
  leftEnabled: 'boolean',
  rightEnabled: 'boolean',
});
exports.Saw = Saw;
