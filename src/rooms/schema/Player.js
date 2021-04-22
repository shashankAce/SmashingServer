
const schema = require('@colyseus/schema');
const Hero = require('../schema/Hero').Hero;

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