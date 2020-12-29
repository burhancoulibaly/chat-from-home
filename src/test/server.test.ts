import {  app, adminApp, auth } from "../backend/server-setup";
import io from 'socket.io-client';
import SocketConnection from "../backend/SocketConnection"
import supertest from "supertest";
import { Server } from "http";

let socket: any;
let server: Server;
let serverAddr: any;
let ioServer: any;

// const request = supertest(app);

beforeAll((done) => {
    server = require('http').createServer(app).listen(process.env.PORT ? process.env.PORT + 1 : 3001);
    serverAddr = server.address();
    ioServer = SocketConnection.GetSocket(server);
    
    done();
})

afterAll((done) => {
    ioServer.close();
    SocketConnection.close();
    server.close();
    
    done();
});

beforeEach((done) => {
    // Setup
    // Do not hardcode server port and address, square brackets are used for IPv6
    const address = serverAddr.address
    const port = serverAddr.port
    console.log(address, port)
    socket = io.connect(`http://[::]:${port}`);
    console.log(socket)
    socket.on('connect', () => {
        done();
    });
})

afterEach((done) => {
    // Cleanup
    if (socket.connected) {
      socket.disconnect();
    }
    done();
});

describe("Test adminApp instance from server", () => {
    it("Creates a valid admin instance", async() => {
        expect(await adminApp.options.credential?.getAccessToken())
    })
});

describe("Test socket.io on server", () => {
    it("message event emits message that was input to the eventemitter", (done) => {
        socket.emit("message", "HELLO WORLD");

        socket.once('message', (message: any) => {
            // Check that the message matches
            expect(message).toBe('HELLO WORLD');

            done();
        });
    });

    it('should hold a connection waiting for socket.io handshakes', (done) => {
        // Use timeout to wait for socket.io server handshakes
        setTimeout(() => {
            socket.emit('message', `waited 50ms for this message`);

            socket.once('message', (message: any) => {
                // Check that the message matches
                expect(message).toBe(`waited 50ms for this message`);

                done();
            });
            
        }, 50);
    });
})
