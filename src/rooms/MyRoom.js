const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const State = require('./schema/State').State;
const Player = require('./schema/Player').Player;
const Hero = require('./schema/Hero').Hero;
const MyRoomGameLogic = require('./MyRoomGameLogic').MyRoomGameLogic;
const {
  Constants
} = require('../Constants');

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
      this.state.currentTurn = this.state.playersIdArray[this.state.playerTurn - 1];
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
      this.state.phase = Constants.WAITING;


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
        this.state.touchLocation = {
          x: message.pos.x,
          y: message.pos.y
        };
        this.broadcast('TOUCH_LOCATION', message.pos, {
          except: client
        });
        break;

      case "BOMB_POSITION":
        this.broadcast('BOMB_POSITION', message.pos, {
          except: client
        });
        break;

      case "CLIENT_READY":
        let readyCount = 0;
        this.state.players.forEach((plyr, sessionId) => {
          if (plyr.isReady) {
            ++readyCount;
          } else {
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
        this.switchPlayerTurn();
        break;

      case "SHOOT":
        let player = this.state.getActivePlayer();
        if (player) {
          this.state.getActivePlayer().changeHeroTurn();
          this.setTimerActive(false);
          console.log("Shoot by " + this.state.getActivePlayer().name);
        }
        break;

      case "HERO_UPDATE":
        this.state.players.forEach((plyr, sessionId) => {
          plyr.updateHero(message.data[sessionId]);
        });
        // message.data is array of objects { hero data } seperated with client id
        // Broadcast hero data to other client
        this.broadcast('POS_CHANGE', message.data, {
          except: client
        });
        break;

      default:
        console.log("Command -" + command + " not found");
        break;
    }
  }


}
exports.MyRoom = MyRoom;
