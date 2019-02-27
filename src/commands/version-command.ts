import { ChatCommandBase } from './ChatCommandBase';
import { Message, TextChannel } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { CommandHelpDescriptor } from './HelpText';
var botName = require('./../../package.json').name;
var botVersion = require('./../../package.json').version;

export class VersionCommand extends ChatCommandBase {
    protected supportedCommands: string[] = ['version'];
    public async handle(message: Message, commandArgs: CommandArgs) {
        await message.channel.send(`${botName}: ${botVersion}`);
    }
    public help(): CommandHelpDescriptor {
        return {
            command: this.supportedCommands[0],
            description: 'Return the bot version number.'
        };
    }
}
