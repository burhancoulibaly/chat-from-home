const express = require('express'),
      app = express(),
      path = require('path'),
      bodyParser = require('body-parser'),
      server = require('http').createServer(app);
      

const html = path.resolve('./frontend/html'),
      css = path.resolve('./frontend/css'),
      js = path.resolve('./frontend/js'),
      bootstrap = path.resolve('./node_modules/bootstrap/dist'),
      jquery = path.resolve('./node_modules/jquery'),
      images = path.resolve('./frontend/images');

//Creating static files located on localhost
app.use('/html', express.static(html));
app.use('/css', express.static(css));
app.use('/js', express.static(js));
app.use('/bootstrap', express.static(bootstrap));
app.use('/jquery', express.static(jquery));
app.use('/images', express.static(images));

app.use(bodyParser.json());

server.listen(process.env.PORT || 3000);
console.log('Server running on port: ',process.env.PORT || 3000);

app.get('/', function(req,res){
  res.sendFile(html+'/home.html');
});
