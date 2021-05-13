const schema = require('@colyseus/schema');

class GameMap extends schema.Schema {

  constructor(data, mapName) {
    super();

    this.name = mapName;
    this.isEnabled = false;
    this.timer = data.timer || -1;
    this.damage = data.damage || -1;
    //
    this.mode = new schema.MapSchema();
    if (data.mode) {
      this.mode.set('leftEnabled', data.mode.leftEnabled || false);
      this.mode.set('rightEnabled', data.mode.rightEnabled || false);
      this.mode.set('topEnabled', data.mode.topEnabled || false);
      this.mode.set('bottomEnabled', data.mode.bottomEnabled || false);
      this.mode.set('centerEnabled', data.mode.centerEnabled || false);
    } else {
      this.mode.set('leftEnabled', false);
      this.mode.set('rightEnabled', false);
      this.mode.set('topEnabled', false);
      this.mode.set('bottomEnabled', false);
      this.mode.set('centerEnabled', false);
    }

  }
}

schema.defineTypes(GameMap, {
  name: 'string',
  isEnabled: 'boolean',
  timer: 'number',
  damage: 'number',
  mode: {
    map: 'boolean'
  }
});
exports.GameMap = GameMap;
