import * as socketio from "socket.io";
import { Server } from "http";
import { app } from "./server-setup";
import SocketConnection from "./SocketConnection"

const server: Server = require('http').createServer(app);

const io: any = SocketConnection.GetSocket(server);

server.listen(process.env.PORT || 3000);

console.log('Server running on port: ',process.env.PORT || 3000);

