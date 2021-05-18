const schema = require('@colyseus/schema');
const Player = require('../schema/Player').Player;
const Constants = require('../../Constants').Constants;

const Bomb = require('./mapManager/Bomb').Bomb;
const Fire = require('./mapManager/Fire').Fire;
const Saw = require('./mapManager/Saw').Saw;
const Wind = require('./mapManager/Wind').Wind;
const Spring = require('./mapManager/Spring').Spring;
const GameMap = require('./mapManager/GameMap').GameMap;

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

    this.generateGameMap();

  }

  generateGameMap() {

    let mapName = 'blank';
    for (let name in Constants.map) {
      if (Constants.map[name].isEnabled == true) {

        if (name == 'random') {
          if (Constants.map[name].selectedMap.length < 1) {
            mapName = 'blank';
            this.gameMap = mapName;
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

    switch (mapName) {
      case 'fireMode':
        this.gameMap = new Fire(Constants.map[mapName], mapName);
        break;
      case 'bombMode':
        this.gameMap = new Bomb(Constants.map[mapName], mapName);
        break;
      case 'sawMode':
        this.gameMap = new Saw(Constants.map[mapName], mapName);
        break;
      case 'springMode':
        this.gameMap = new Spring(Constants.map[mapName], mapName);
        break;
      case 'windMode':
        this.gameMap = new Wind(Constants.map[mapName], mapName);
        break;
      default:
        this.gameMap = new GameMap(Constants.map[mapName], mapName);
        break;
    }


    if (mapName != 'blank' && Constants.map['random'].isEnabled == true) {

      if (mapName == 'fireMode' || mapName == 'windMode' || mapName == 'sawMode' || mapName == 'springMode') {
        this.gameMap.leftEnabled = Math.floor(Math.random() * 2) == 0 ? true : false;
        this.gameMap.rightEnabled = Math.floor(Math.random() * 2) == 0 ? true : false;
      }

      if (mapName == 'springMode') {
        this.gameMap.topEnabled = Math.floor(Math.random() * 2) == 0 ? true : false;
        this.gameMap.bottomEnabled = Math.floor(Math.random() * 2) == 0 ? true : false;
        this.gameMap.centerEnabled = Math.floor(Math.random() * 2) == 0 ? true : false;
      }
    }

    this.currentMap = mapName;
  }

  startGame() {
    this.phase = Constants.STARTED;
    this.currentTurn = this.playersIdArray[this.playerTurn - 1];
    // this.mapController.initMap();
    this.activeMap.initMap();
  }

  pauseGame() {
    this.activeMap.pause();
    this.phase = Constants.WAITING;
  }

  stopGame() {
    this.activeMap.stop();
    this.phase = Constants.WAITING;
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
  gameMap: GameMap,
  currentMap: 'string',
});
exports.State = State;
