var socket = io();


$(function(){

  // mode updates
  $('.btn-mode').click(function(){
    var mode = $(this).data('mode');
    socket.emit('mode-update', { mode : mode });
  });

  // time updates
  $('#save-times').click(function(){
    var times = {
      awayStart   : $('#away-start').val(),
      awayEnd     : $('#away-end').val(),
      sleepStart  : $('#sleep-start').val(),
      sleepEnd    : $('#sleep-end').val()
    };

    socket.emit('time-update', times);
  });

  // settings updates
  $('#save-settings').click(function(){
    var settings = {
      target      : $('#target-temp').val(),
      threshold   : $('#temp-threshold').val(),
      sleep       : $('#sleep-temp').val()
    };

    socket.emit('settings-update', settings);
  });
});
