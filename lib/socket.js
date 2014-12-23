var socketIo = require('socket.io');
var schedule = require('./schedule');
var spark = require('./spark');
var io = null;


exports.init = function(server){
  io = socketIo(server);

  io.on('connection', function(socket){
    socket.on('update-settings', function(opts){
      schedule.updateSettings(opts);
      io.sockets.emit('settings-update', opts);
    });
  });

  spark.events().on('properties-update', function(data){
    io.sockets.emit('properties-update', data);
  });
};


exports.getIo = function(){
  return io;
};
