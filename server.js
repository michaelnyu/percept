var express = require('express');
var app = express();
var flickrRoute = require('./routes/flickr');
var microsoftRoute = require('./routes/microsoft');
var autocomplete = require('./routes/autocomplete')
var bodyParser = require('body-parser');
var port = process.env.port || 3000;
var path = require('path');

app.use(express.static(path.join(__dirname, '/static')));

app.use(function(req, res, next){
  console.log("URL requested : " + req.url);
  next();
});

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index');
});

app.post('/microsoft', microsoftRoute);

app.post('/autocomplete', autocomplete.autocomplete);

app.post('/getlocation', autocomplete.getlocation);

app.use('/feed',flickrRoute);


app.listen(port, function(){
    console.log("listening in on port " + port);
});
