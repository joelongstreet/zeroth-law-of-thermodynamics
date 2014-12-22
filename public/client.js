var socket = io();


$(function(){

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

  // settings updates
  $('#save-thresholds').click(function(){
    var thresholds = {
      target      : $('#target-temp').val(),
      threshold   : $('#temp-threshold').val(),
      sleep       : $('#sleep-temp').val()
    };

    socket.emit('update-settings', { thresholds : thresholds });
  });
});
