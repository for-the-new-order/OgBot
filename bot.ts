import * as Discord from 'discord.js';
import { OutputType, ChatterService, ChatterServiceOptions } from './src/commands/ChatterService';
import { EchoHelpService } from './src/commands/EchoHelpService';
import { ChatCommandManager } from './src/commands/ChatCommandManager';

const config = require('./config').configuration;
const bot = new Discord.Client();

//const chatterJSON = new ChatterServiceOptions();
const chatterYAML = new ChatterServiceOptions().mergeWith({ outputType: OutputType.YAML });

const echoHelpService = new EchoHelpService(new ChatterService(chatterYAML));
const chatterService = new ChatterService(chatterYAML);
const chatCommandManager = new ChatCommandManager(chatterService, echoHelpService);

bot.login(config.auth.token);

bot.on('ready', function (evt: any) {
    console.info('Connected');
    console.info('Logged in as: ');
    console.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', async (message: any) => {
    // Send the message to the command manager for handling
    chatCommandManager.Handle(message);
});
