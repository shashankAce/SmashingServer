const schema = require('@colyseus/schema');
const GameMap = require('./GameMap').GameMap;


class MapController extends schema.Schema {
    constructor() {
        super();
        this.timer = 0;
        this.timerActive = false;
        this.timerCount = 0;
        this.fireTimeInSec = 4;

        /* this.timer = setTimeout(() => {

        }, this.fireTimeInSec * 1000); */

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
        }
    }

    enableLeftFire() {
        // this.leftFireActivate = true;
        this.timer = setTimeout(() => {
            // if (this.timerActive)
            //     this.disableLeftFire();

            this.fireTimeInSec++;
        }, 1000);
    }

    disableLeftFire() {
        //clearTimeout(this.timer);
        this.timerActive = false;
        // this.leftFireActivate = false;
    }



}

schema.defineTypes(MapController, {
    map: GameMap,
    fireTimeInSec: 'number',
    leftFireActivate: 'boolean'
});
exports.MapController = MapController;
