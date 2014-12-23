var socket = io();


var formatTime = function (timeInSeconds) {
  var sec_num = parseInt(timeInSeconds, 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) hours   = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  var time    = [
    hours, ':', minutes, ':', seconds
  ].join('');

  return time;
};


var updateTimeLeft = function(opts){
  console.log(opts.time);
  $('#override-time').text(formatTime(opts.time));
};


var updateMode = function(mode){
  $('#current-mode').text(mode.charAt(0).toUpperCase() + mode.slice(1));
  $('.panel-modes').find('.btn').removeClass('active');
  $('.panel-modes').find('[data-mode="' + mode + '"]').addClass('active');
};


var updateTimes = function(times){
  $('#away-start').val(times.awayStart);
  $('#away-end').val(times.awayEnd);
  $('#sleep-start').val(times.sleepStart);
  $('#sleep-end').val(times.sleepEnd);
};


var updateTemperatures = function(temperatures){
  $('#target-temp').val(temperatures.target);
  $('#temp-threshold').val(temperatures.threshold);
  $('#sleep-temp').val(temperatures.sleep);
};


var updateProps = function(data){
  $('#current-temp').text(data.fahrenheit);

  var relayState = 'Off';
  if(data.relayState == 1) relayState = 'On';

  $('#relay-state').text(relayState);
};


$(function(){

  // highlight the the selected button
  updateMode(currentMode);

  socket.on('override-time-left', updateTimeLeft);

  // show when someone else changes the settings
  socket.on('settings-update', function(data){
    if(data.mode) updateMode(data.mode);
    if(data.times) updateTimes(data.times);
    if(data.temperatures) updateTemperatures(data.temperatures);
  });

  // update the status on socket events
  socket.on('properties-update', updateProps);

  // mode updates
  $('.btn-mode').click(function(){
    var mode = $(this).data('mode');
    socket.emit('update-settings', { mode : mode });
  });

  // time updates
  $('#save-times').click(function(){
    var times = {
      awayStart   : $('#away-start').val(),
      awayEnd     : $('#away-end').val(),
      sleepStart  : $('#sleep-start').val(),
      sleepEnd    : $('#sleep-end').val()
    };

    socket.emit('update-settings', { times : times });
  });

  // temperatures updates
  $('#save-temperatures').click(function(){
    var temperatures = {
      target      : parseInt($('#target-temp').val()),
      threshold   : parseInt($('#temp-threshold').val()),
      sleep       : parseInt($('#sleep-temp').val())
    };

    socket.emit('update-settings', { temperatures : temperatures });
  });
});
