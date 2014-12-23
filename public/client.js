var socket = io();


$(function(){

  $('.panel-modes').find('[data-mode="' + currentMode + '"]')
    .addClass('active');

  // mode updates
  $('.btn-mode').click(function(){
    var mode = $(this).data('mode');
    $('.panel-modes').find('.btn').removeClass('active');
    $(this).addClass('active');
    $('#current-mode').text(mode.charAt(0).toUpperCase() + mode.slice(1));
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
