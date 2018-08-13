import { Message } from 'discord.js';
import { GenerateCommand } from './generate-command';
import { ChatCommand } from './ChatCommand';
import { CommandArgs } from './CommandArgs';
import { HelpText } from './HelpText';
import { EchoHelpService } from './EchoHelpService';

export class ChatCommandManager {
    private trigger = 'og';
    private commands: Array<ChatCommand>;
    private echoHelpService = new EchoHelpService();
    constructor() {
        this.commands = new Array<ChatCommand>(
            new GenerateCommand(),
            //
            // Default (echo help)
            new DefaultChatCommand((message: Message) => this.echoHelp(message))
        );
    }

    public Handle(message: Message): void {
        const args = message.content.substring(1).split(' ');
        if (args.length == 0) {
            return;
        }
        if (args.length == 1) {
            if (args[0] === this.trigger) {
                this.echoHelp(message);
            }
            return;
        }

        const commandArgs = new CommandArgs(
            args[0].toLowerCase(),
            args[1].toLowerCase(),
            args.splice(2)
        );

        if (commandArgs.trigger !== this.trigger) {
            this.echoHelp(message);
            return;
        }

        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            if (command.canHandle(commandArgs)) {
                command.handle(message, commandArgs);
                break;
            }
        }
    }
    private echoHelp(message: Message) {
        message.reply(
            'Something went wrong; I may add some more help some day... Stay tuned and do with the following until then!'
        );
        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            const help = command.help();
            this.echoHelpService.echo(help, false, message);
        }
    }
}

class DefaultChatCommand implements ChatCommand {
    constructor(private callback: (message: Message) => void) {}
    public handle(message: Message, commandArgs: CommandArgs) {
        this.callback(message);
    }
    public canHandle(commandArgs: CommandArgs): boolean {
        return true;
    }
    public help(): HelpText {
        return {
            command: 'anything',
            description: 'Show the current help text.'
        };
    }
}
