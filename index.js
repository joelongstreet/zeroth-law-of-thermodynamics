var express = require('express');
var auth = require('http-auth');
var ejs = require('ejs');
var path = require('path');
var favicon = require('static-favicon');
var config = require('./config')();
var socket = require('./lib/socket');
var schedule = require('./lib/schedule');
var spark = require('./lib/spark');


var basic = auth.basic({}, function(username, password, next){
  next(username === config.USERNAME && password === config.PASSWORD);
});


var app = express();
app.engine('.ejs', require('ejs').__express);
app.set('views', __dirname);

app.use(auth.connect(basic));
app.use(favicon());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', function(req, res){
  res.render('index.ejs', { settings : schedule.getSettings() });
});

app.set('port', config.PORT || 3000);


var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

socket.init(server);
spark.connect(schedule.run);
