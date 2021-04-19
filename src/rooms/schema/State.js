
const schema = require('@colyseus/schema');

// Our custom game state, an ArraySchema of type Player only at the moment
class Hero extends schema.Schema {
  constructor(prop) {
    super();

    prop = JSON.parse(prop);
    this.name = prop.name;
    this.mass = prop.mass;
    this.size = prop.size;
    this.rating = prop.rating;
    this.playerHitDamage = prop.playerHitDamage;
    this.playerHealth = prop.playerHealth;
    this.isActive = false;
    this.isDead = false;
    // Additonal properties
    this.isShieldActive = false;
    this.isRageActive = false;
    this.id = prop.id;
  }
}
schema.defineTypes(Hero, {
  name: 'string',
  mass: 'number',
  size: 'number',
  rating: 'number',
  playerHitDamage: 'number',
  playerHealth: 'number',
  isActive: 'boolean',
  isDead: 'boolean',
  isShieldActive: 'boolean',
  isRageActive: 'boolean',
  id: 'string'
});
exports.Hero = Hero;

//-------------

class Player extends schema.Schema {
  constructor(heroData) {
    super();

    this.heroCount = heroData.length;
    this.herosMap = new schema.MapSchema();

    this.activeHeroIndex = 0;
    this.heroIdArray = [];

    for (let index = 0; index < heroData.length; index++) {
      let hero = new Hero(heroData[index]);
      this.herosMap.set(hero.id, hero);
      this.heroIdArray.push(hero.id);
    }
  }

  changeHeroTurn() {
    ++this.activeHeroIndex;
    if (this.activeHeroIndex >= this.heroCount) {
      this.activeHeroIndex = 0;
    }
  }

  getActiveHero() {
    return this.herosMap[this.heroIdArray[this.activeHeroIndex]];
  }

  setHeroActive(id) {
    this.herosMap.forEach((hero, key) => {
      hero.isActive = false;
    });
    this.herosMap[id].isActive = true;
  }
}
schema.defineTypes(Player, {
  name: 'string',
  sessionId: 'string',
  seat: 'number',
  herosMap: { map: Hero },
  heroCount: 'number',
  activeHeroIndex: 'number',
  heroIdArray: ['string']
});
exports.Player = Player;

//-------------

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