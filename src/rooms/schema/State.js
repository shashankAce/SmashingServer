const schema = require('@colyseus/schema');
const Player = require('../schema/Player').Player;
const GameMap = require('../schema/GameMap').GameMap;
const Constants = require('../../Constants').Constants;


class State extends schema.Schema {
  constructor() {
    super();

    this.players = new schema.MapSchema();
    this.playersIdArray = [];
    this.playerTurn = 1;
    //
    this.phase = Constants.MATCH_MAKING;
    this.winningPlayer = -1;
    //
    this.timerCount = Constants.ROUND_DURATION;
    this.touchLocation = {
      x: 0,
      y: 0
    };

    this.gameMap = new schema.MapSchema();
    for (const key in Constants.map) {
      if (key != 'random') {

        const map = new GameMap(Constants.map[key]);
        this.gameMap.set(key, map);
      }
    }

    this.generateGameMap();

  }

  generateGameMap() {

    let mapName;
    for (let name in Constants.map) {
      if (Constants.map[name].isEnabled == true) {

        if (name == 'random') {
          if (Constants.map[name].selectedMap.length < 1) {
            this.gameMap = 'blank';
            break;
          }
          mapName = Constants.map[name].selectedMap[Math.floor(Math.random() * Constants.map[name].selectedMap.length)];
          break;
        } else {
          mapName = name;
          break;
        }
      }
    }

    if (mapName != 'blank') {

      if (Constants.map['random'].isEnabled == true) {

        let map;
        switch (mapName) {
          case 'fireMode':
            map = this.gameMap.get(mapName);
            map.mode.get('leftEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            map.mode.get('rightEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            break;

          case 'springMode':
            map = this.gameMap.get(mapName);
            map.mode.get('leftEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            map.mode.get('rightEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            map.mode.get('topEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            map.mode.get('bottomEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            map.mode.get('centerEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            break;

          case 'windMode':
            map = this.gameMap.get(mapName);
            map.mode.get('leftEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            map.mode.get('rightEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            break;

          case 'sawMode':
            map = this.gameMap.get(mapName);
            map.mode.get('leftEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            map.mode.get('rightEnabled') = Math.floor(Math.random() * 2) == 0 ? true : false;
            break;

          default:
            console.log('Error');
            break;
        }

      }
    }
    this.gameMap.get(mapName).isEnabled = true;
    this.currentMap = mapName;
  }

  startGame() {
    this.phase = Constants.STARTED;
    this.currentTurn = this.playersIdArray[this.playerTurn - 1];
  }

  getPlayerTurnIndex() {
    return this.playerTurn;
  }

  changePlayerTurn() {
    // Change previous active player's hero turn
    this.getActivePlayer().changeHeroTurn();

    // Change player turn
    this.playerTurn = this.playerTurn > 1 ? 1 : 2;
    this.currentTurn = this.playersIdArray[this.playerTurn - 1];
  }

  getActivePlayer() {
    return this.players.get(this.currentTurn);
  }
}

schema.defineTypes(State, {
  players: {
    map: Player
  },
  playersIdArray: ['string'],
  playerTurn: 'number',
  currentTurn: 'string',
  phase: 'string',
  winningPlayer: 'number',
  timerCount: 'number',
  touchLocation: {
    map: 'number'
  },
  gameMap: {
    map: GameMap
  },
  currentMap: 'string'
});
exports.State = State;
