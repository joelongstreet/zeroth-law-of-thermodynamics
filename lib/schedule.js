var socket = require('./socket');
var interval = null;

var settings = {
  mode          : 'normal',
  temperatures  : {
    target        : 70,
    threshold     : 5,
    sleep         : 60
  },
  times         : {
    awayStart     : '08:00',
    awayEnd       : '17:00',
    sleepStart    : '23:00',
    sleepEnd      : '05:00'
  }
};


var checkTime = function(){

};


exports.getSettings = function(){
  return settings;
};


exports.updateSettings = function(opts){
  for(var key in opts){
    settings[key] = opts[key];
  }

  console.log('updated settings:', settings);
};


exports.run = function(){
  interval = setInterval(checkTime, 1000);
};


exports.stop = function(){
  clearInterval(interval);
};
