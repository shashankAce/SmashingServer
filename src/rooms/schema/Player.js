
const schema = require('@colyseus/schema');
const Hero = require('../schema/Hero').Hero;

class Player extends schema.Schema {
  constructor(sessionId, options) {
    super();

    this.sessionId = sessionId;
    this.herosMap = new schema.MapSchema();
    this.isBot = false;
    this.activeHeroIndex = 0;

    this.heroIdArray = [];
    this.heroCount = options.herosArray.length;

    for (let index = 0; index < options.herosArray.length; index++) {
      let hero = new Hero(options.herosArray[index]);
      hero.playerSessionId = this.sessionId;
      //
      this.herosMap.set(hero.id, hero);
      this.heroIdArray.push(hero.id);
    }
  }

  addHeros(data) {
    for (let index = 0; index < data.herosArray.length; index++) {
      let hero = new Hero(data.herosArray[index]);
      hero.playerSessionId = this.sessionId;
      //
      this.herosMap.set(hero.id, hero);
      this.heroIdArray.push(hero.id);
    }
  }

  updateHero(dataArray) {

    for (let index = 0; index < dataArray.length; index++) {
      const element = dataArray[index];
      const hero = this.herosMap.get(element.id);
      if (hero) {
        hero.updateFromClient(element);
      }
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
    this.herosMap.get(id).isActive = true;
  }
}

schema.defineTypes(Player, {
  name: 'string',
  isBot: 'boolean',
  sessionId: 'string',
  seat: 'number',
  herosMap: { map: Hero },
  heroCount: 'number',
  activeHeroIndex: 'number',
  heroIdArray: ['string']
});
exports.Player = Player;