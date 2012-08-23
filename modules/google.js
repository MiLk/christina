(function(){

  var http = require('http');

  exports.name = 'google';

  exports.match = (function(client, from, to, message) {
    var match = message.match(/\.(g|w|wiki|mat|ldlc|gh)\s/);
    if(match && match.index == 0)
    {
      var prefix = ''; 
      switch(match[1])
      {   
        case 'wiki': prefix = 'site:fr.wikipedia.org '; break;
        case 'w': prefix = 'site:fr.wiktionary.org '; break;
        case 'mat': prefix = 'site:www.materiel.net '; break;
        case 'ldlc': prefix = 'site:www.ldlc.com '; break;
        case 'gh': prefix = 'site:github.com '; break;
      }   
      message = prefix + message.substr(3);
      var dest = 0, pos = message.search(' > ');
      if(pos > 0)
      {   
        dest = message.substr(pos + 3); 
        message = message.substring(0,pos);
      }   
      var url = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&safe=off&gl=fr&hl=fr&lr=lang_fr&q=' + message;
      http.get(url, function (res) {
        var data = ''; 
        res.on('data', function(chunk) {
          data += chunk;
        }).on('error', function(err) {
          console.log('Search error: ' + err);
        });;
        res.on('end', function(){
          var obj = JSON.parse(data);
          var results = obj.responseData.results;
          if(results.length > 0)
          {   
            client.say(to, ((dest != 0) ? dest + ': ' : '') + results[0].titleNoFormatting + ' - ' + results[0].unescapedUrl);
            //client.say(to, results[0].content);
          }   
          else
            client.say(to, 'No results.');
        }); 
      }).on('error', function(e) {
        console.log("Got error on url "+url+" : " + e.message);
      }); 
    }     
});

}).call(this);
