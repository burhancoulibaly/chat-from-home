import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');

const  app: express.Application = express();
const server: any = require('http').createServer(app);

app.use(bodyParser.json());

server.listen(process.env.PORT || 3000);
console.log('Server running on port: ',process.env.PORT || 3000);

app.get('/', function(req,res){
  res.send("Success")
});
