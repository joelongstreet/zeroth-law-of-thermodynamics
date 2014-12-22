var socket = require('./socket');
var spark = require('./spark');

var overrideTimeLeft = 0;
var overrideTimeout = null;
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


var rightNow = function(){
  var now = new Date();

  return {
    hours   : now.getHours(),
    minutes : now.getMinutes()
  };
};


var getFormattedTimes = function(){
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


var getTimeState = function(){
  var now = rightNow();
  var times = getFormattedTimes();
  var timeState = 'normal';

  // in away mode
  if(now.hours >= times.awayStart.hours &&
     now.hours <= times.awayEnd.hours)
  {
    if(now.hours == times.awayStart.hours){
      if(now.minutes > times.awayStart.minutes)
        timeState = 'away';
    } else if(now.hours == times.awayEnd.hours){
      if(now.minutes < times.awayEnd.minutes)
        timeState = 'away';
    } else timeState = 'away';
  }

  // in sleep mode
  if(now.hours >= times.sleepStart.hours ||
     now.hours <= times.sleepEnd.hours)
  {
    if(now.hours == times.sleepStart.hours){
      if(now.minutes > times.sleepStart.minutes)
        timeState = 'sleep';
    } else if(now.hours == times.sleepEnd.hours){
      if(now.minutes < times.sleepEnd.minutes)
        timeState = 'sleep';
    } else timeState = 'sleep';
  }

  return timeState;
};


var check = function(){
  if(settings.mode == 'normal'){
    var timeState = getTimeState();

    if(timeState != 'away'){
      var target = settings.temperatures.target;
      if(timeState == 'sleep') target = settings.temperatures.sleep;

      if(spark.getTemperature() >
        (target + settings.temperatures.threshold))
      {
        spark.adjustRelay('off');
      } else if(spark.getTemperature <
        (target - settings.temperatures.threshold))
      {
        spark.adjustRelay('on');
      }
    } else spark.adjustRelay('off');
  } else if(settings.mode == 'always'){
    spark.adjustRelay('on');
  } else if(settings.mode == 'off'){
    spark.adjustRelay('on');
  } else if(settings.mode == 'override'){
    if(overrideTimeLeft >= 0) spark.adjustRelay('on');
    else spark.adjustRelay('off');
  }
};


exports.getSettings = function(){
  return settings;
};


exports.getOverrideTimeLeft = function(){
  return overrideTimeLeft;
};


exports.updateSettings = function(opts){
  for(var key in opts){
    settings[key] = opts[key];
  }

  if(settings.mode == 'override'){
    overrideTimeLeft = 180000;
    clearTimeout(overrideTimeout);
    overrideTimeout = setTimeout(function(){
      overrideTimeLeft--;
      if(overrideTimeLeft <= 0) clearTimeout(overrideTimeout);
    }, overrideTimeLeft);
  } else overrideTimeLeft = 0;

  console.log('updated settings:', settings);
};


exports.run = function(){
  interval = setInterval(check, 1000);
};


exports.stop = function(){
  clearInterval(interval);
};
