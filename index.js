var express = require('express');
var auth = require('http-auth');
var path = require('path');
var config = require('./config')();


var basic = auth.basic({}, function(username, password, next){
  next(username === config.USERNAME && password === config.PASSWORD);
});


var app = express();
app.engine('.ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('port', config.PORT || 3000);
app.use(auth.connect(basic));
app.use(require('static-favicon')());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.render('index.ejs', { settings : require('./lib/settings') });
});


var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


require('./lib/socket').init(server);
require('./lib/spark').connect(require('./lib/schedule').run);
