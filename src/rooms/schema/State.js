
const schema = require('@colyseus/schema');
const Player = require('../schema/Player').Player;

// Our custom game state, an ArraySchema of type Player only at the moment

class State extends schema.Schema {
  constructor() {
    super();

    this.players = new schema.MapSchema();
    this.playersIdArray = [];
    this.playerTurn = 1;
    this.playerCount = 0;
    this.phase = 'waiting';
    this.winningPlayer = -1;
  }

  getPlayerTurnIndex() {
    return this.playerTurn;
  }

  changePlayerTurn() {
    this.playerTurn = this.playerTurn > 1 ? 1 : 2;
  }

  getActivePlayer() {
    return this.players[this.playersIdArray[this.playerTurn - 1]];
  }
}

schema.defineTypes(State, {
  players: { map: Player },
  playersIdArray: ['string'],
  playerTurn: 'number',
  playerCount: 'number',
  phase: 'string',
  winningPlayer: 'number'
});
exports.State = State;