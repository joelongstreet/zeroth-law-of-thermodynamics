var socketIo = require('socket.io');
var schedule = require('./schedule');


exports.init = function(server){
  io = socketIo(server);

  io.on('connection', function(socket){
    socket.on('update-settings', schedule.updateSettings);
  });
};
