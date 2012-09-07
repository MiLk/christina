(function(){

  exports.name = 'ask';

  exports.match = (function(client, from, to, message) {
    var match = message.match(/^\.ask (.*) or (.*)/);
    if(match) {
      var rand = (Math.floor(Math.random()*100)%2) + 1;
      client.say(to, from + ' : '+match[rand]);
    }
  });

}).call(this);