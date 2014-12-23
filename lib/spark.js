var spark = require('sparknode');
var events = require('events');
var schedule = require('./schedule');
var emitter = new events.EventEmitter();
var config = require('../config')();

// store the core properties
var properties = {};

var core = new spark.Core({
  accessToken : config.SPARK_ACCESS_TOKEN,
  id          : config.SPARK_CORE_ID
});


core.on('error', function(err){
  if(err) console.log(err);
});


exports.connect = function(next){
  core.on('connect', function(){
    if(next) next();

    core.on('update', function(props){
      properties = JSON.parse(props.data);
      emitter.emit('properties-update', properties);
      if(properties.motionDetected == 1)
        schedule.motionDetected();
    });
  });
};


exports.events = function(){
  return emitter;
};


exports.getProperties = function(){
  return properties;
};


exports.adjustRelay = function(state){
  var param = '1';
  if(state == 'off') param = '0';

  // send update only if necessary
  if(properties.relayState && properties.relayState != parseInt(param)){
    core.setRelay(param, function(err, data){
      if(err) console.log(err);
      else console.log('updated relay to', state);
    });
  }
};
