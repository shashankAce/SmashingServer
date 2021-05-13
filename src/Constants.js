const Constants = {
  ROUND_DURATION: 100,
  MATCH_MAKING: 'matchmaking',
  WAITING: 'waiting',
  STARTED: 'started',
  map: {
    "random": {
      "isEnabled": false,
      "selectedMap": ["portalMode", "gravityMode", "snowMode", "sawMode", "fireMode", "springMode", "bombMode", "windMode", ]
    },
    "portalMode": {
      "isEnabled": false
    },
    "gravityMode": {
      "isEnabled": false
    },
    "snowMode": {
      "isEnabled": false
    },
    "sawMode": {
      "isEnabled": false,
      "damage": 100,
      "mode": {
        "leftEnabled": true,
        "rightEnabled": false
      }
    },
    "fireMode": {
      "isEnabled": false,
      "damage": 100,
      "mode": {
        "leftEnabled": true,
        "rightEnabled": true
      }
    },
    "springMode": {
      "isEnabled": false,
      "mode": {
        "leftEnabled": true,
        "rightEnabled": false,
        "topEnabled": true,
        "bottomEnabled": false,
        "centerEnabled": true
      }
    },
    "bombMode": {
      "isEnabled": true,
      "timer": 15,
      "damage": 100
    },
    "windMode": {
      "isEnabled": false,
      "mode": {
        "leftEnabled": true,
        "rightEnabled": true
      }
    },
  },

}
exports.Constants = Constants;
