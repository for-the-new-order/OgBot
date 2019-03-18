var Discord = require('discord.js');
var config = require('./config').configuration;
var bot = new Discord.Client();

var x = require('./src/commands/ChatCommandManager');
var y = require('./src/commands/ChatterService');
var z = require('./src/commands/EchoHelpService');

var echoHelpService = new z.EchoHelpService(y.ChatterService(z.defaultChatterOptions.mergeWith({ outputType: OutputType.YAML })));
var chatterService = new y.ChatterService();
var chatCommandManager = new x.ChatCommandManager(chatterService, echoHelpService);

bot.login(config.auth.token);

bot.on('ready', function(evt) {
    console.info('Connected');
    console.info('Logged in as: ');
    console.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', async message => {
    // Send the message to the command manager for handling
    chatCommandManager.Handle(message);
});
