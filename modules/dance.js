(function(){

  exports.name = 'dance';

  exports.match = (function(client, from, to, message) {
    if(message.match(/^(.*\s)*dance(\s.*)*$/)) {
      setTimeout(function () { client.say(to, "\u0001ACTION dances: :D\\-<\u0001") }, 1000);
      setTimeout(function () { client.say(to, "\u0001ACTION dances: :D|-<\u0001")  }, 2000);
      setTimeout(function () { client.say(to, "\u0001ACTION dances: :D/-<\u0001")  }, 3000);
      setTimeout(function () { client.say(to, "\u0001ACTION dances: :D|-<\u0001")  }, 4000);
    }
  });

}).call(this);
