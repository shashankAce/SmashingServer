
const schema = require('@colyseus/schema');
const Hero = require('../schema/Hero').Hero;

class Player extends schema.Schema {
  constructor(sessionId, options) {
    super();

    this.sessionId = sessionId;
    this.herosMap = new schema.MapSchema();
    this.isBot = false;
    this.activeHeroIndex = 0;
    this.heroCount = options.herosArray.length;
    this.heroIdArray = [];

    for (let index = 0; index < options.herosArray.length; index++) {
      let hero = new Hero(options.herosArray[index]);
      hero.playerSessionId = this.sessionId;
      //
      this.herosMap.set(hero.id, hero);
      this.heroIdArray.push(hero.id);
    }
    //
    this.setActiveHero();
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

  setActiveHero() {

    let heroId = this.heroIdArray[this.activeHeroIndex];
    let hero = this.herosMap.get(heroId);
    if (hero.currentHealth > 0) {
      this.activeHeroId = heroId;
    }

  }

  changeHeroTurn() {

    let deadCount = 0;
    this.herosMap.forEach((hero, key) => {
      if (hero.currentHealth <= 0) {
        ++deadCount;
      }
    });

    let herosAlive = this.heroCount - deadCount;
    if (herosAlive < 1) {
      // Game Over
      this.activeHeroIndex = -1;
    } else {
      ++this.activeHeroIndex;
      if (this.activeHeroIndex >= herosAlive) {
        this.activeHeroIndex = 0;
      }
    }

    this.setActiveHero();
  }

  validateHeroTurn() {

    let heroId = this.heroIdArray[this.activeHeroIndex];
    let hero = this.herosMap.get(heroId);
    if (hero.currentHealth <= 0) {
      this.changeHeroTurn();
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
  // activeHeroIndex: 'number',
  activeHeroId: 'string',
  heroIdArray: ['string'],
  connected: 'boolean'
});
exports.Player = Player;