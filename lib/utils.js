var settings = require('./settings');


exports.rightNow = function(){
  var now = new Date();

  return {
    hours   : now.getHours(),
    minutes : now.getMinutes()
  };
};


exports.getFormattedTimes = function(){
  return {
    awayStart : {
      hours   : parseInt(settings.times.awayStart.split(':')[0]),
      minutes : parseInt(settings.times.awayStart.split(':')[1])
    },
    awayEnd : {
      hours   : parseInt(settings.times.awayEnd.split(':')[0]),
      minutes : parseInt(settings.times.awayEnd.split(':')[1])
    },
    sleepStart : {
      hours   : parseInt(settings.times.sleepStart.split(':')[0]),
      minutes : parseInt(settings.times.sleepStart.split(':')[1])
    },
    sleepEnd : {
      hours   : parseInt(settings.times.sleepEnd.split(':')[0]),
      minutes : parseInt(settings.times.sleepEnd.split(':')[1])
    }
  };
};
