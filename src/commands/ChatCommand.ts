import { HelpText } from './HelpText';

import { Message } from 'discord.js';
import { CommandArgs } from './CommandArgs';

export interface ChatCommand {
    handle(message: Message, commandArgs: CommandArgs);
    canHandle(commandArgs: CommandArgs): boolean;
    help(): HelpText;
}
