var socket = require('./socket');
var spark = require('./spark');
var settings = require('./settings');
var utils = require('./utils');


var overrideTimeLeft = 0;
var interval = null;


var getScheduleState = function(){
  var now = utils.rightNow();
  var times = utils.getFormattedTimes();
  var state = 'normal';

  // in away mode
  if(now.hours >= times.awayStart.hours &&
     now.hours <= times.awayEnd.hours)
  {
    if(now.hours == times.awayStart.hours){
      if(now.minutes > times.awayStart.minutes)
        state = 'away';
    } else if(now.hours == times.awayEnd.hours){
      if(now.minutes < times.awayEnd.minutes)
        state = 'away';
    } else state = 'away';
  }

  // in sleep mode
  if(now.hours >= times.sleepStart.hours ||
     now.hours <= times.sleepEnd.hours)
  {
    if(now.hours == times.sleepStart.hours){
      if(now.minutes > times.sleepStart.minutes)
        state = 'sleep';
    } else if(now.hours == times.sleepEnd.hours){
      if(now.minutes < times.sleepEnd.minutes)
        state = 'sleep';
    } else state = 'sleep';
  }

  return state;
};


var procedure = function(){
  if(settings.mode == 'normal'){
    var scheduleState = getScheduleState();

    if(scheduleState != 'away'){
      var target = settings.temperatures.target;
      if(scheduleState == 'sleep') target = settings.temperatures.sleep;

      if(spark.getProperties().fahrenheit >
        (target + settings.temperatures.threshold))
      {
        spark.adjustRelay('off');
      } else if(spark.getProperties().fahrenheit <
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
    overrideTimeLeft--;
    if(overrideTimeLeft >= 0) spark.adjustRelay('on');
    else spark.adjustRelay('off');
  }
};


exports.getOverrideTimeLeft = function(){
  return overrideTimeLeft;
};


exports.updateSettings = function(opts){
  for(var key in opts){
    settings[key] = opts[key];
  }

  var threeHoursInSeconds = 10800;
  if(settings.mode == 'override')
    overrideTimeLeft = threeHoursInSeconds;

  console.log('updated settings: \n', settings);
  console.log('------------');
};


exports.run = function(){
  interval = setInterval(procedure, 1000);
};


exports.stop = function(){
  clearInterval(interval);
};
