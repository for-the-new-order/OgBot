import { Message } from 'discord.js';
import { GenerateCommand } from './generate-command';
import { ChatCommand } from './ChatCommand';
import { CommandArgs } from './CommandArgs';
import { HelpText } from './HelpText';
import { EchoHelpService } from './EchoHelpService';
import { CleanChannelCommand } from './clean-channel-command';
import { InfoCommand } from './info-command';

export class ChatCommandManager {
    private trigger = 'og';
    private helpSwitch = 'h';
    private commands: Array<ChatCommand>;
    private echoHelpService = new EchoHelpService();
    constructor() {
        this.commands = new Array<ChatCommand>(
            new GenerateCommand(),
            new CleanChannelCommand(),
            new InfoCommand(),
            //
            // Default (echo help)
            new DefaultChatCommand(async (message: Message) => await this.echoHelp(message))
        );
    }

    public async Handle(message: Message): Promise<void> {
        // Ignore messages sent by bots
        if (message.author.bot) {
            return;
        }

        // Ignore messages sent without the "command character"
        if (message.content.substring(0, 1) !== '!') {
            return;
        }

        // Make sure there is at least one command
        const args = message.content.substring(1).split(' ');
        if (args.length == 0) {
            return;
        }

        // Validate that the command is understood by the current bot (ex.: !og); in case there is only one argument.
        if (args.length == 1) {
            if (args[0] === this.trigger) {
                await this.echoHelp(message);
            }
            return;
        }

        // Transform the plain command arguments in a CommandArgs model
        const commandArgs = new CommandArgs(
            args[0].toLowerCase(),
            args[1].toLowerCase(),
            args.splice(2)
        );

        // Validate that the command is understood by the current bot (ex.: !og); in case there is more than one arguments.
        if (commandArgs.trigger !== this.trigger) {
            await this.echoHelp(message);
            return;
        }

        // Try to find a command object that knows how to handle the request
        // If the help switch is specified, the help of that specific command will be displayed instead.
        const outputHelp = commandArgs.argumentExists(this.helpSwitch);
        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            if (command.canHandle(commandArgs)) {
                if (outputHelp) {
                    const help = command.help();
                    await this.echoHelpService.echo(help, false, message);
                } else {
                    command.handle(message, commandArgs);
                }
                break;
            }
        }
    }

    private async echoHelp(message: Message) {
        message.reply(
            'Something went wrong; I may add some more help some day... Stay tuned and do with the following until then!'
        );
        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            const help = command.help();
            await this.echoHelpService.echo(help, false, message);
        }
    }
}

class DefaultChatCommand implements ChatCommand {
    constructor(private callback: (message: Message) => void) { }
    public handle(message: Message, commandArgs: CommandArgs) {
        this.callback(message);
    }
    public canHandle(commandArgs: CommandArgs): boolean {
        return true;
    }
    public help(): HelpText {
        return {
            command: '!og [command] -h',
            description: 'Shows the specified command help text ot the full help if no command is specified or if an invalid command is specified.'
        };
    }
}
