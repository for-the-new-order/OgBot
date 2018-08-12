import { ChatCommandBase } from './ChatCommandBase';
import { Message } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { HelpText } from './HelpText';
import { CharacterGenerator } from '../generators/character-generator';

export class GenerateCommand extends ChatCommandBase {
    protected supportedCommands = ['generate', 'gen', 'g'];
    private characterGenerator = new CharacterGenerator();
    public handle(message: Message, commandArgs: CommandArgs) {
        let subCommand: string = null;
        if (commandArgs.arguments.length > 0) {
            subCommand = commandArgs.arguments[0];
        }

        // Custom seed
        const seedArgIndex = commandArgs.arguments.indexOf('-seed');
        let providedSeed: number = null;
        if (seedArgIndex > -1) {
            providedSeed = parseInt(commandArgs.arguments[seedArgIndex + 1]);
        }

        const result = this.characterGenerator.generate(providedSeed);
        let json = '';
        const indent = 4;

        switch (subCommand) {
            case 'name':
                json = JSON.stringify(
                    this.withSeed(result.initialSeed, result.names),
                    null,
                    indent
                );
                break;
            case 'motivation':
                json = JSON.stringify(
                    this.withSeed(result.initialSeed, result.motivation),
                    null,
                    indent
                );
                break;
            case 'personality':
                json = JSON.stringify(
                    this.withSeed(result.initialSeed, result.personality),
                    null,
                    indent
                );
                break;
            case 'place':
                json = JSON.stringify(
                    this.withSeed(result.initialSeed, result.places),
                    null,
                    indent
                );
                break;
            default:
                json = JSON.stringify(result, null, indent);
                break;
        }
        message.author.createDM().then(c => {
            c.send(`\`\`\`json\n${json}\n\`\`\``);
        });
        if (message.deletable) {
            message.delete();
        }
    }

    private withSeed(
        initialSeed: number,
        value: any
    ): { initialSeed: number; value: any } {
        return {
            initialSeed,
            value
        };
    }

    public help(): HelpText {
        return {
            command: this.supportedCommands.join(', '),
            description: 'Generate a random character.',
            args: [
                {
                    syntax: 'motivation',
                    description: 'Generate a character motivation.'
                },
                {
                    syntax: 'name',
                    description: 'Generate some names.'
                },
                {
                    syntax: 'place',
                    description: 'Generate some names.'
                },
                {
                    syntax: 'personality',
                    description: 'Generate a personality.'
                }
            ]
        };
    }
}
