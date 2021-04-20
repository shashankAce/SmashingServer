

const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const State = require('./schema/State').State;
const Player = require('./schema/State').Player;
const MyRoomGameLogic = require('./MyRoomGameLogic').MyRoomGameLogic;
const Constants  = require('../Constants').Constants;

class MyRoom extends MyRoomGameLogic {

  onCreate(options) {

    let state = new State();
    state.phase = 'waiting';
    state.playerTurn = 1; // 1 or 2
    state.winningPlayer = -1;

    this.setState(state);
    console.log("Room created");

    this.activeListeners();
  }

  onJoin(client, options) {
    // options
    // it contains name password to login to server
    // will be used later

    console.log('client joined', client.sessionId);

    console.log(Constants.GAME_TIME_COUNT, "Do now know it will work");

    let player = new Player(options.herosArray);
    player.sessionId = client.sessionId;
    player.seat = this.playerCount + 1;
    player.name = options.name;

    this.state.players.set(client.sessionId, player);
    this.state.playersIdArray.push(client.sessionId);

    ++this.playerCount;

    if (this.playerCount == this.maxClients) {
      this.state.phase = 'started';


      this.state.players.forEach((plyr, key) => {
        let tmpArray = [];

        plyr.herosMap.forEach((hero, key) => {
          tmpArray.push(JSON.stringify({
            name: hero.name,
            mass: hero.mass,
            size: hero.size,
            rating: hero.rating,
            playerHitDamage: hero.playerHitDamage,
            playerHealth: hero.playerHealth,
            id: hero.id
          }));
        });

        // Both players broadcasting their details to opponent players
        this.broadcast("GameStarted", {
          name: plyr.name,
          id: plyr.sessionId,
          seatNo: plyr.seat,
          herosArray: tmpArray,
          playerTurnId: this.state.getActivePlayer().sessionId
        }, { except: this.getClientById(plyr.sessionId) });

      });
      this.lock();
    }

  }

  onLeave(client, consented) {
    if (this.state.players[client.sessionId]) {
      this.state.players.delete(client.sessionId);
      this.playerCount--;
      this.state = 'waiting';

      console.log('client left', client.sessionId);
    }
  }

  onDispose() {
    console.log('Room disposed');
  }

  chatMessage(client, message) {
    if (!message)
      return;
    if (!this.state.players[client.sessionId])
      return;
    let command = message['command'];
    //switch (command)

    this.broadcast("chatMessage", {
      clientId: client.sessionId,
      message: message
    });
  }

  activeListeners() {

    this.onMessage("touchLocation", (client, data) => {
      if (this.state.players[client.sessionId]) {
        //console.log(this.state.players[client.sessionId].name, data);
        this.broadcast("touchLocation", data, { except: client });
      }
    });

    this.onMessage("positionUpdate", (client, data) => {
      if (this.state.players[client.sessionId]) {
        this.broadcast("positionUpdate", data, { except: client });
      }
    });

    this.onMessage("shootUpdate", (client, data) => {
      // changing hero turn after a player has played
      this.state.getActivePlayer().changeHeroTurn();
      console.log("Shoot by " + this.state.getActivePlayer().name);

      this.broadcast("shootUpdate", { shooterId: client.sessionId }, { except: client });
    });

    this.onMessage("clientReady", (client, data) => {
      // Sending data to that client who is ready
      let otherClient = this.clients.find(element => element.sessionId != client.sessionId);

      let plyr = this.state.getActivePlayer();
      this.broadcast("clientReady", {
        name: plyr.name,
        playerTurnId: plyr.sessionId,
        heroId: plyr.getActiveHero().id,
      }, { except: otherClient });

    });

    this.onMessage("switchTurn", (client, data) => {
      this.switchPlayerTurn();
    });
  }

}

exports.MyRoom = MyRoom;