const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;


class MapController extends schema.Schema {
  constructor() {
    super();

    this.leftTimer = 0;
    this.leftTimerCoolDown = 7;
    this.leftTimerActivateTimer = 10;
    this.rightTimer = 0;
    this.rightTimerCoolDown = 7;
    this.rightTimerActivateTimer = 12;

    this.bombTimer = 0;
  }

  /**
   * @param {GameMap} map - Assign active GameMap
   */
  setMap(map) {
    this.map = map;

  }

  initMap() {
    if (this.map.name == 'fireMode') {
      if (this.map.mode.get('leftEnabled')) {
        this.enableLeftFire();
      }
      if (this.map.mode.get('rightEnabled')) {
        this.enableRightFire();
      }
    }
    if (this.map.name == 'bombMode') {
      this.timer = this.map.timer;
      this.bombTimerCountDown();
    }
  }

  bombTimerCountDown() {
    this.bombTimer = setInterval(() => {
      this.timer--;
      if (this.timer < 0)
        this.timer = this.map.timer;
    }, 1000);
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

schema.defineTypes(MapController, {
  map: GameMap,
  leftFireActivate: 'boolean',
  rightFireActivate: 'boolean',
  timer: 'number'
});
exports.MapController = MapController;
