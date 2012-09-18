(function(){

  exports.name = 'timer';

  exports.match = (function(client, from, to, message) {
    var match = message.match(/^timer\s([0-9]*)(s|m|h|d|w)+\s?(.*)$/);
    if(match) {
      console.log(match);
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
      setTimeout(function () { client.say(to, from + ": " + txt); }, timer);
    }
  });

}).call(this);
