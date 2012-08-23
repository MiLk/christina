var irc = require('irc')
  , _ = require('underscore')._
  , fs = require('fs');
var client = new irc.Client(process.env.npm_package_config_server, process.env.npm_package_config_username, {
  debug: true,
  channels: [process.env.npm_package_config_channel],
  userName: process.env.npm_package_config_username,
  realName: 'Christina Node.js IRC Bot',
});
client.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

var mods = [];
fs.readdir('./modules', function(err, files){
  if(err) { console.log(err); return; }
  _.each(files,function(file) {
    console.log('Load module ' + file);
    mods.push(require('./modules/'+file));
  });
  client.addListener('message', function (from,to, message) {
    //console.log(from + ' => ' + to + ': ' + message);
    _.each(mods,function(mod){
      mod.match(client,from,to,message);
    });
  });
});

client.addListener('join', function(channel, who) {
    if(who != process.env.npm_package_config_username)
      client.say(channel, 'Hello ' + who + ' !');
    console.log('%s has joined %s', who, channel);
});
client.addListener('part', function(channel, who, reason) {
    client.say(channel, 'Bye ' + who + ' !');
    console.log('%s has left %s: %s', who, channel, reason);
});
client.addListener('kick', function(channel, who, by, reason) {
  client.say(channel, who + ' NO RAGE PLX !!!');
  console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});
