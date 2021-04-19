
const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');
const monitor = require("@colyseus/monitor").monitor;
// const socialRoutes = require("@colyseus/social/express").default;

const MyRoom = require('./rooms/MyRoom').MyRoom;

const port = process.env.PORT || 2567;
const app = express()

app.use(cors());
app.use(express.json());

const gameServer = new colyseus.Server({
  server: http.createServer(app),
});

// register your room handlers
gameServer.define('my_room', MyRoom);

gameServer.onShutdown(function () {
  console.log('game server is down');
});

app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`)
