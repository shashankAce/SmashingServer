const schema = require('@colyseus/schema');

class GameMap extends schema.Schema {

  constructor(data, mapName) {
    super();

    this.name = mapName;
    this.isReady = false;

    this.timer = data.timer || -1;
    this.damage = data.damage || -1;
  }

  pause() {
    this.isReady = false;
  }

  resume() {
    this.isReady = true;
  }

  stop() {
    this.isReady = false;
  }
}

schema.defineTypes(GameMap, {
  name: 'string',
  timer: 'number',
  damage: 'number',
});
exports.GameMap = GameMap;