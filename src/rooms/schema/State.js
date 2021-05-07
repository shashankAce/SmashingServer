
const schema = require('@colyseus/schema');
const Player = require('../schema/Player').Player;
const Constants = require('../../Constants').Constants;

// Our custom game state, an ArraySchema of type Player only at the moment

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
    this.touchLocation = { x: 0, y: 0 };
  }

  startGame(){
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
  players: { map: Player },
  playersIdArray: ['string'],
  playerTurn: 'number',
  currentTurn: 'string',
  phase: 'string',
  winningPlayer: 'number',
  timerCount: 'number',
});
exports.State = State;