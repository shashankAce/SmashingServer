
const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const State = require('./schema/State').State;
const Player = require('./schema/Player').Player;
const Hero = require('./schema/Hero').Hero;
const MyRoomGameLogic = require('./MyRoomGameLogic').MyRoomGameLogic;
const { Constants } = require('../Constants');

class MyRoom extends MyRoomGameLogic {

  onCreate(options) {

    this.setState(new State());
    console.log("Room created");

    this.onMessage("action", (client, message) => this.playerAction(client, message));

  }

  onJoin(client, options) {
    // options
    // it contains name password to login to server
    // will be used later

    console.log('client joined', client.sessionId);

    let player = new Player(client.sessionId, options);
    player.seat = this.playerCount + 1;
    player.name = options.name;

    this.state.players.set(client.sessionId, player);
    this.state.playersIdArray.push(client.sessionId);

    ++this.playerCount;

    if (this.playerCount == this.maxClients) {
      this.state.phase = Constants.WAITING;

      this.lock();
    }

  }

  onLeave(client, consented) {
    if (this.state.players.get(client.sessionId)) {

      this.state.players.delete(client.sessionId);
      // Game Logic
      this.playerCount--;
      this.clientsReadyCount--;
      this.isReady = false;
      this.isTimerActive = false;
      this.state = 'waiting';

      console.log('client left', client.sessionId);
    }
  }

  onDispose() {
    console.log('Room disposed');
  }

  playerAction(client, message) {

    if (!message) return;
    let player = this.state.players.get(client.sessionId);
    if (!player) return;

    let command = message.command;

    switch (command) {
      case "TOUCH_LOCATION":
        this.state.touchLocation = message["pos"];
        break;

      case "CLIENT_READY":
        let readyCount = 0;
        this.state.players.forEach((plyr, sessionId) => {
          if (plyr.isReady) {
            ++readyCount;
          }
          else {
            if (sessionId == client.sessionId) {
              plyr.isReady = true;
              ++readyCount;
            }
          }
        });
        if (readyCount == this.maxClients) {
          this.startGame();
        }
        break;

      case "TURN_OVER":
        // this.switchPlayerTurn();
        break;

      case "SHOOT":
        this.state.getActivePlayer().changeHeroTurn();
        console.log("Shoot by " + this.state.getActivePlayer().name);
        this.setTimerActive(false);
        break;

      case "HERO_UPDATE":
        this.state.players.forEach((plyr, sessionId) => {
          plyr.updateHero(message.data);
        });
        break;

      default:
        console.log("Command -" + command + " not found");
        break;
    }
  }


}
exports.MyRoom = MyRoom;