var Discord = require('discord.js');
var config = require('./config').configuration;
var bot = new Discord.Client();

// var characterGen = require('./src/generators/character-generator.js');
// var characterGenerator = new characterGen.CharacterGenerator();

var x = require('./src/commands/ChatCommandManager');
var chatCommandManager = new x.ChatCommandManager();

bot.login(config.auth.token);

bot.on('ready', function (evt) {
    console.info('Connected');
    console.info('Logged in as: ');
    console.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', async message => {
    // Send the message to the command manager for handling
    chatCommandManager.Handle(message);
});

// // web
// var express = require('express');
// var app = express();
// var listener = app.listen(8888, function () {
//     console.log('Listening on port ' + listener.address().port);
// });
// app.get('/', function (req, res) {
//     if (currentChannel) {
//         currentChannel.send('Message from Node!');
//         res.send('Message sent');
//     } else {
//         res.send('Channel not initialized!');
//     }
// });

// app.get('/chat/:message', function (req, res) {
//     var msg = req.params.message;
//     if (currentChannel) {
//         currentChannel.send(msg);
//         res.send('**[WebMsg]** ' + msg);
//     } else {
//         res.send('Channel not initialized! ' + msg);
//     }
// });

// app.get('/send/:channelKey/:message', function (req, res) {
//     var channel = bot.channels.get(req.params.channelKey);
//     channel.send(req.params.message);
//     res.send('**[WebMsg]** ' + req.params.message);
// });

// Mentions: <@USER ID>
// Ex.:      <@123456789012345678>
