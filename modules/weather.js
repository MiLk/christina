(function() {

  var http = require('http'),
      xml2json = require('xml2json');

  exports.name = 'weather';

  exports.match = (function(client, from, to, message) {
    var match = message.match(/(meteo|weather) (.*)/);
    if(match)
    {
      http.get('http://www.google.com/ig/api?weather='+match[2].replace(' ','%20')+'&hl=fr', function(res) {
        var data = '';
        res.on('data', function(chunk) {
          data += chunk;
        }).on('error', function(err) {
          console.log('Search error: ' + err);
        });;
        res.on('end', function(){
          var obj;
          try {
            obj = xml2json.toJson(data);
          } catch(err) { client.say(to, 'Meteo introuvable.'); console.log(err); return; }
          obj = JSON.parse(obj);
          obj = obj.xml_api_reply.weather;
          if(!obj.problem_cause)
            client.say(to, 'Meteo du jour à '+obj.forecast_information.city.data+' : ' + obj.current_conditions.condition.data + ' - ' + obj.current_conditions.temp_c.data + '°C - ' + obj.current_conditions.humidity.data + ' - ' + obj.current_conditions.wind_condition.data + '');
          else
            client.say(to, 'Meteo introuvable.');
        });
      });
    }
  });

}).call(this);
