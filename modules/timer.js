(function(){

  var _ = require('underscore')._;

  exports.name = 'timer';

  var timers = {};

  exports.match = (function(client, from, to, message) {
    var match = message.match(/^timer\s([0-9]*)(s|m|h|d|w)+\s?(.*)$/);
    if(match) {
      var timer = match[1] * 1000;
      switch(match[2]) {
        case 'w': timer *= 7;
        case 'd': timer *= 24;
        case 'h': timer *= 60;
        case 'm': timer *= 60;
        case 's':
        default:
          break;
      }
      var txt = (match[3])?match[3]:"Elapsed timer " + match[1]+match[2];
      var date = new Date();
      timers[from+'_'+date.getTime()] = {
        start: date.getDate() + '/' + (date.getMonth()+1) + ' ' + date.getHours() + ':'+date.getMinutes(),
        from: from,
        timer:match[1]+match[2],
        message: txt
      };
      client.say(to, from + ": Timer added - " +match[1]+match[2]+ " " + txt);
      setTimeout(function () { client.say(to, from + ": " + txt); delete timers[from+'_'+date.getTime()]; }, timer);
      return;
    }
    match = message.match(/^timer all$/);
    if(match) {
      _.each(timers, function(timer, key) {
        client.say(to, timer.start + " - " + timer.timer + " - " + timer.message + " ("+timer.from+")");
      });
    }
  });

}).call(this);
