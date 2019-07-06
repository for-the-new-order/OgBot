import { Message } from 'discord.js';
import { GenerateCommand } from './generate-command';
import { ChatCommand } from './ChatCommand';
import { CommandArgs } from './CommandArgs';
import { CommandHelpDescriptor } from './HelpText';
import { EchoHelpService } from './EchoHelpService';
import { CleanChannelCommand } from './clean-channel-command';
import { InfoCommand } from './info-command';
import { VersionCommand } from './version-command';
import { ChatterService } from './ChatterService';

export class ChatCommandManager {
    private trigger = 'og';
    private helpSwitch = 'h';
    private commands: Array<ChatCommand>;
    constructor(private chatterService: ChatterService, private echoHelpService: EchoHelpService) {
        this.commands = new Array<ChatCommand>(
            new GenerateCommand(this.chatterService),
            new CleanChannelCommand(),
            new InfoCommand(),
            new VersionCommand(),
            //
            // Default (echo help)
            new DefaultChatCommand(async (message, commandArgs) => await this.echoHelp(message, commandArgs))
        );
    }

    public async Handle(message: Message): Promise<void> {
        const commandPrefix = '!';
        let commandPrefixLength = 1;

        // Ignore messages sent without the "command character"
        const startWithCommandPrefix = message.content.startsWith(commandPrefix);
        if (!startWithCommandPrefix) {
            return;
        }

        // Ignore messages sent by bots
        const startWithBotCommandPrefix = message.content.startsWith(commandPrefix + commandPrefix);
        if (message.author.bot) {
            if (!startWithBotCommandPrefix) {
                return;
            }
            commandPrefixLength = 2;
        }

        // Make sure there is at least one command
        const args = message.content.substring(commandPrefixLength).split(' ');
        if (args.length == 0) {
            return;
        }

        // Validate that the command is understood by the current bot (ex.: !og); in case there is only one argument.
        if (args.length == 1) {
            if (args[0] === this.trigger) {
                await this.echoHelp(message, new CommandArgs(args[0], null, null));
            }
            return;
        }

        // Transform the plain command arguments in a CommandArgs model
        const commandArgs = new CommandArgs(args[0].toLowerCase(), args[1].toLowerCase(), args.splice(2));

        // When the command (trigger) is not !og", exit.
        if (commandArgs.trigger !== this.trigger) {
            return;
        }

        // Try to find a command object that knows how to handle the request
        // If the help switch is specified, the help of that specific command will be displayed instead.
        const outputHelp = commandArgs.argumentExists(this.helpSwitch);
        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            if (command.canHandle(commandArgs)) {
                if (outputHelp) {
                    await this.echoHelpService.echoOne(command, commandArgs, false, message);
                } else {
                    command.handle(message, commandArgs);
                }
                break;
            }
        }
    }

    private async echoHelp(message: Message, commandArgs: CommandArgs) {
        // for (let i = 0; i < this.commands.length; i++) {
        //     const command = this.commands[i];
        //     const help = command.help(commandArgs);
        //     await this.echoHelpService.echo(help, false, message);
        // }
        await this.echoHelpService.echoMany(this.commands, commandArgs, false, message);
    }
}

class DefaultChatCommand implements ChatCommand {
    constructor(private callback: (message: Message, commandArgs: CommandArgs) => void) {}
    public handle(message: Message, commandArgs: CommandArgs) {
        this.callback(message, commandArgs);
    }
    public canHandle(commandArgs: CommandArgs): boolean {
        return true;
    }
    public help(commandArgs: CommandArgs): CommandHelpDescriptor {
        return {
            command: '!og [command] -h',
            description:
                'Shows the specified command help text ot the full help if no command is specified or if an invalid command is specified.'
        };
    }
}
