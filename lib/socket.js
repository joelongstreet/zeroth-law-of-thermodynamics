var socketIo = require('socket.io');
var schedule = require('./schedule');
var spark = require('./spark');


exports.init = function(server){
  var io = socketIo(server);

  io.on('connection', function(socket){
    socket.on('update-settings', schedule.updateSettings);
  });

  spark.events().on('properties-update', function(data){
    io.sockets.emit('properties-update', data);
  });
};
