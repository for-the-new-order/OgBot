var Discord = require('discord.js');
var config = require('./config').configuration;
var bot = new Discord.Client();

bot.login(config.auth.token);

bot.on('ready', function(evt) {
    console.info('Connected');
    console.info('Logged in as: ');
    console.info(bot.user.username + ' - (' + bot.user.id + ')');
});
var currentChannel = null; // : TextChannel
bot.on('message', async message => {
    // Ignore messages sent by bots
    if (message.author.bot) return;
    // Ignore messages sent without the "command character"
    if (message.content.substring(0, 1) !== '!') return;

    var args = message.content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
        case 'init':
            currentChannel = message.channel;
            message.channel.send('Web messages will now be send to this channel (ID: ' + message.channel.id + ')!');
            message.channel.send('Thanks');
        case 'whoami':
            sendCurrentUserInfo(message);
            break;
        case 'getchannelinfo':
            sendChannelInfo(message);
            break;
        case 'getguildinfo':
        case 'getserverinfo':
            sendGuildInfo(message);
            break;
        case 'getallinfo':
            sendCurrentUserInfo(message);
            sendChannelInfo(message);
            sendGuildInfo(message);
            break;
    }
});

// web
var express = require('express');
var app = express();
var listener = app.listen(8888, function() {
    console.log('Listening on port ' + listener.address().port);
});
app.get('/', function(req, res) {
    if (currentChannel) {
        currentChannel.send('Message from Node!');
        res.send('Message sent');
    } else {
        res.send('Channel not initialized!');
    }
});

app.get('/chat/:message', function(req, res) {
    var msg = req.params.message;
    if (currentChannel) {
        currentChannel.send(msg);
        res.send('**[WebMsg]** ' + msg);
    } else {
        res.send('Channel not initialized! ' + msg);
    }
});

app.get('/send/:channelKey/:message', function(req, res) {
    var channel = bot.channels.get(req.params.channelKey);
    channel.send(req.params.message);
    res.send('**[WebMsg]** ' + req.params.message);
});

function sendGuildInfo(message) {
    message.channel.send('Your current guild (or server) is **' + message.guild.name + '** (ID: ' + message.guild.id + ')');
}

function sendChannelInfo(message) {
    message.channel.send('The channel is **' + message.channel.name + '** (ID: ' + message.channel.id + ')');
}

function sendCurrentUserInfo(message) {
    message.channel.send('You are **' + message.author.username + '** (ID: ' + message.author.id + ')');
}
// Mentions: <@USER ID>
// Ex.:      <@123456789012345678>
