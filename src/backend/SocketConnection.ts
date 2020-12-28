import * as socketio from "socket.io";

export default class SocketConnection {
    private static _instance: SocketConnection | null;
    server: any;

    private constructor(server: any) {
        this.server = server;
    }
    public static GetSocket(server: any) {
        if(this._instance){
          return this._instance;
        }

        const io = require("socket.io")(server);

        io.on("connection", (socket: any) => {
          console.log("user connected");
          
          socket.on("message", (message: any) => {
            console.log(message);
            // echo the message back down the
            // websocket connection
            socket.emit("message", message);
          });
      
          socket.on("disconnect", () => {
              console.log('user disconnected')
          })
        });
        
        this._instance = io;

        return this._instance;
    }

    public static Close() {
        this._instance = null;
    }
}