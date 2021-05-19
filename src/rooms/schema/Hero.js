
const schema = require('@colyseus/schema');
const { time } = require('uniqid');

class Hero extends schema.Schema {
    constructor(prop) {
        super();

        prop = JSON.parse(prop);

        this.x = 0;
        this.y = 0;

        this.name = prop.name;
        this.mass = prop.mass;
        this.restitution = prop.restitution;
        this.friction = prop.friction;
        this.size = prop.size;
        this.rating = prop.rating;
        this.playerHitDamage = prop.playerHitDamage;
        this.totalDamageDealth = 0;

        this.playerDamageRPSProbability = new schema.MapSchema();
        this.playerDamageRPSProbability.set("rock", prop.playerDamageRPSProbability.rock);
        this.playerDamageRPSProbability.set("paper", prop.playerDamageRPSProbability.paper);
        this.playerDamageRPSProbability.set("scissor", prop.playerDamageRPSProbability.scissor);

        this.playerLowestDamagePercentage = prop.playerLowestDamagePercentage;
        this.playerHighestDamagePercentage = prop.playerHighestDamagePercentage;
        this.playerHealth = prop.playerHealth;
        this.currentHealth = prop.playerHealth;
        this.specialPowerUp = prop.specialPowerUp;

        // Additonal properties
        this.isActive = false;
        this.isDead = false;
        this.isShieldActive = false;
        this.isRageActive = false;
        this.id = prop.id;
    }

    updateFromClient(dataObject) {
        this.isShieldActive = dataObject.isShieldActive;
        this.currentHealth = dataObject.currentHealth;
        this.totalDamageDealth = dataObject.totalDamageDealth;
        this.isMoving = dataObject.isMoving;

        this.x = dataObject.x;
        this.y = dataObject.y;

        // Logic after attribute update
        if (this.currentHealth <= 0) {
            this.isDead = true;
            this.isShieldActive = false;
            this.isRageActive = false;
            this.isActive = false;
        }
    }

    setPosition(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
}

schema.defineTypes(Hero, {
    // x: 'number',
    // y: 'number',
    name: 'string',
    mass: 'number',
    restitution: 'number',
    friction: 'number',
    size: 'number',
    rating: 'number',
    playerHitDamage: 'number',
    playerDamageRPSProbability: { map: 'boolean' },
    playerLowestDamagePercentage: 'number',
    playerHighestDamagePercentage: 'number',
    playerHealth: 'number',
    currentHealth: 'number',
    specialPowerUp: 'string',
    isDead: 'boolean',
    totalDamageDealth: 'number',

    // Additional properties
    isMoving: 'boolean',
    isActive: 'boolean',
    isShieldActive: 'boolean',
    isRageActive: 'boolean',
    id: 'string',
    playerSessionId: 'string',
});
exports.Hero = Hero;
