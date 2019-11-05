import { CommandHelpDescriptor } from './HelpText';
import { Message } from 'discord.js';
import { ChatterService } from './ChatterService';
import { ChatCommand } from './ChatCommand';
import { CommandArgs } from './CommandArgs';

export class EchoHelpService {
    constructor(private sendChatService: ChatterService) {}

    public async echoOne(command: ChatCommand, commandArgs: CommandArgs, whisper: boolean, message: Message) {
        const help = command.help(commandArgs);
        const simplified = this.projectToSummary(help, 1);
        this.sendChatService.send(simplified, whisper, message);
    }

    public async echoMany(commands: ChatCommand[], commandArgs: CommandArgs, whisper: boolean, message: Message) {
        const summary = [];
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            const help = command.help(commandArgs);
            summary.push(this.projectToSummary(help, 1));
        }
        this.sendChatService.send(summary, whisper, message);
    }

    private projectToSummary(help: CommandHelpDescriptor, depth: number): any {
        let subcommands = undefined;
        if (help.subcommands && help.subcommands.length > 1) {
            subcommands = [];
            help.subcommands.forEach(subcommand => {
                subcommands.push(this.projectToSummary(subcommand, depth + 1));
            });
        } else if (depth < 2) {
            subcommands = help.subcommands;
        }
        return {
            command: help.command,
            description: help.description,
            alias: help.alias,
            subcommands,
            options: help.options
        };
    }

    public async echoX(help: CommandHelpDescriptor, whisper: boolean, message: Message) {
        this.sendChatService.send(help, whisper, message);
    }
}
