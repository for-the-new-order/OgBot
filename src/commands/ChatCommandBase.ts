import { Message } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { ChatCommand } from './ChatCommand';
import { HelpText } from './HelpText';

export abstract class ChatCommandBase implements ChatCommand {
    public abstract handle(message: Message, commandArgs: CommandArgs);
    public canHandle(commandArgs: CommandArgs): boolean {
        return this.supportedCommands.indexOf(commandArgs.command) > -1;
    }
    protected abstract get supportedCommands(): Array<string>;
    public abstract help(commandArgs: CommandArgs): HelpText;
}
