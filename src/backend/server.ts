import { app } from "./server-setup";

const server: any = require('http').createServer(app);

server.listen(process.env.PORT || 3000);

console.log('Server running on port: ',process.env.PORT || 3000);