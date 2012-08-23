(function(){

  exports.name = 'miam';

  exports.match = (function(client, from, to, message) {
    if(message.match(/miam/)) {
      client.say(to, 'Nap ' + from);
    }
  });

}).call(this);
