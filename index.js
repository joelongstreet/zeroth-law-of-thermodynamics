var express = require('express');
var ejs = require('ejs');
var path = require('path');
var favicon = require('static-favicon');
var socket = require('./lib/socket');
var schedule = require('./lib/schedule');


var app = express();
app.engine('.ejs', require('ejs').__express);
app.set('views', __dirname);


app.use(favicon());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', function(req, res){
  res.render('index.ejs', { settings : schedule.getSettings() });
});

app.set('port', process.env.PORT || 3000);


var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

socket.init(server);
