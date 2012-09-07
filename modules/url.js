(function(){

  var http = require('http')

  exports.name = 'url';

  exports.match = (function(client, from, to, message) {
    var match = message.match(/http:\/\/(\S*)/);
    if(match) {
      http.get(match[0], function(res) {
        var match, data = '';
        res.on('data', function(chunk) {
          data += chunk;
          match = data.match(/\<title\>(.*)\<\/title\>/);
          if(match)
          {
            client.say(to, 'Title: ' + match[1]);
            res.pause();
          }
        }).on('error', function(err) {
          console.log('Error: ' + err);
        }).on('end', function(){
        });
      }).on('error', function(err){
        console.log(err);
      });
    }
  });

}).call(this);