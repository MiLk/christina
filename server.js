var irc = require('irc')
  , _ = require('underscore')._
  , fs = require('fs');
var client = new irc.Client(process.env.npm_package_config_server, process.env.npm_package_config_username, {
  debug: false,
  showErrors: true,
  autoRejoin: true,
  autoConnect: true,
  channels: [process.env.npm_package_config_channel],
  userName: process.env.npm_package_config_username,
  realName: 'Christina Node.js IRC Bot',
});
client.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

var mods = [];
var reload = (function(){
  fs.readdir('./modules', function(err, files){
    if(err) { console.log(err); return; }
    _.each(files,function(file) {
      console.log('Load module ' + file);
      mods.push(require('./modules/'+file));
    });
    client.addListener('message', function (from,to, message) {
      _.each(mods,function(mod){
        mod.match(client,from,to,message);
      });
    });
  });
})();


var ignore_nicknames = [process.env.npm_package_config_username,"GithubBot"];

client.addListener('join', function(channel, who) {
  if(who && !_.include(ignore_nicknames,who))
    client.say(channel, 'Hello ' + who + ' !');
  console.log('%s has joined %s', who, channel);
});
client.addListener('part', function(channel, who, reason) {
  if(who && !_.include(ignore_nicknames,who))
    client.say(channel, 'Bye ' + who + ' !');
  console.log('%s has left %s: %s', who, channel, reason);
});
client.addListener('kick', function(channel, who, by, reason) {
  if(who && !_.include(ignore_nicknames,who))
    client.say(channel, who + ' NO RAGE PLX !!!');
  console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});
client.addListener('invite', function(channel, from, message) {
  client.join(channel);
  console.log(from + ' invite me to join '+channel);
});
client.addListener('ping', function(data) {
  console.log('PING received. '+data);
});
client.addListener('ctcp', function(from,to,text,type) {
  console.log('CTCP from '+from+' to '+to+': '+text+' ('+type+')');
  var parts = text.split(' ');
  if(type == 'privmsg') {
    switch(parts[0]) {
      case 'TIME':
        var date = new Date();
        client.ctcp(from,'notice',date.toDateString() + ' ' + date.toLocaleTimeString());
        break;
    }
  }
});