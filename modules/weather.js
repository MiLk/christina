(function() {

  var http = require('http')
    , FeedParser = require('feedparser')
    , parser = new FeedParser()
    , util = require('util');

  exports.name = 'weather';

  exports.match = (function(client, from, to, message) {
    var match = message.match(/(meteo|weather|meteo\+|weather\+) (.*)/);
    if(match)
    {
      // http://developer.yahoo.com/geo/placefinder/guide/index.html
      http.get('http://where.yahooapis.com/geocode?flags=J&locale=fr_fr&count=1&q='+match[2].replace(' ','%20'), function(res) {
        var data = '';
        res.on('data', function(chunk) {
          data += chunk;
        }).on('error', function(err) {
          console.log('Search error: ' + err);
        });
        res.on('end', function(){
          var obj = JSON.parse(data);
          if(obj.ResultSet.Results && obj.ResultSet.Results.length >= 1)
          {
            var woeid = obj.ResultSet.Results[0].woeid
              , city = obj.ResultSet.Results[0].city
              , country = obj.ResultSet.Results[0].country;

            parser.parseUrl('http://weather.yahooapis.com/forecastrss?w='+woeid+'&u=c', {}, function(err, out, items){
              if(err) client.say(to, 'Meteo introuvable.');
              else if(items[0]['summary'].match(/Invalid/))
              {
                client.say(to, items[0]['title']);
              }
              else {
                var item = items[0];
                var astronomy = out['yweather:astronomy']['@']
                  , title = item['title']
                  , atmosphere = out['yweather:atmosphere']['@']
                  , wind = out['yweather:wind']['@']
                  , link = out['link'];
                link = link.substring(link.indexOf('*')+1);

                var tomorrow = item['yweather:forecast'][0]['@']
                  , aftertomorrow = item['yweather:forecast'][1]['@']
                  , today = item['yweather:condition']['@'];

              if(match[1] == 'meteo' || match[1] == 'weather') {
                /*client.say(to, title + 
                  ' (Humidité : '+atmosphere.humidity+'%)'+
                  ' '+astronomy.sunrise+' - '+astronomy.sunset);*/
                client.say(to, today['text']+' '+today['temp']+'°C - '+today['date'] + ' - ' + title);
                /*client.say(to, tomorrow['text']+' '+tomorrow['low']+'°C/'+tomorrow['high']+'°C - '+
                  tomorrow['day']+' '+tomorrow['date']);*/
              }
              else
                client.say(to, aftertomorrow['text']+' '+aftertomorrow['low']+'°C/'+aftertomorrow['high']+'°C - '+
                  aftertomorrow['day']+' '+aftertomorrow['date'] + ' - ' + title);
              }
            });
          }
          else
            client.say(to, 'Emplacement introuvable.');
        });
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
    }
  });

}).call(this);
