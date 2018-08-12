import { ChatCommandBase } from './ChatCommandBase';
import { Message } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { HelpText } from './HelpText';
import { CharacterGenerator } from '../generators/character-generator';
import { RandomService } from '../generators/random-service';
import { AlienNamesGenerator } from '../generators/alien-names-generator';
import { NameGenerator } from '../generators/name-generator';
import { FormatUtility } from '../generators/format-utility';
import { motivations, personalityTraits } from '../../data';

export class GenerateCommand extends ChatCommandBase {
    protected supportedCommands = ['generate', 'gen', 'g'];
    private randomService: RandomService;
    public alienNamesGenerator = new AlienNamesGenerator(new FormatUtility());
    public nameGenerator: NameGenerator;
    constructor() {
        super();
        this.randomService = new RandomService();
        this.nameGenerator = new NameGenerator(this.randomService);
    }

    public handle(message: Message, commandArgs: CommandArgs) {
        let subCommand: string = null;
        if (commandArgs.args.length > 0) {
            subCommand = commandArgs.args[0];
        }

        // Custom seed
        if (commandArgs.argumentExists('seed')) {
            this.randomService.seed = parseInt(
                commandArgs.findArgumentValue('seed')
            );
        }
        const initialSeed = this.randomService.seed;

        // count
        let count = 1;
        if (commandArgs.argumentExists('count')) {
            count = parseInt(commandArgs.findArgumentValue('count'));
        }

        //const result = this.characterGenerator.generate(providedSeed);
        let json = '';
        const indent = 4;

        switch (subCommand) {
            case 'name':
                var names: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    names.push(this.generateName());
                }
                json = JSON.stringify(
                    this.withSeed(initialSeed, names),
                    null,
                    indent
                );
                break;
            case 'alienname':
                var names: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    names.push(this.generateAlienName());
                }
                json = JSON.stringify(names, null, indent);
                break;
            case 'motivation':
                var motivation = this.generateMotivation();
                json = JSON.stringify(
                    this.withSeed(initialSeed, motivation),
                    null,
                    indent
                );
                break;
            case 'personality':
                var personality = this.generatePersonality();
                json = JSON.stringify(
                    this.withSeed(initialSeed, personality),
                    null,
                    indent
                );
                break;
            case 'place':
                var places: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    places.push(this.generatePlace());
                }
                json = JSON.stringify(
                    this.withSeed(initialSeed, places),
                    null,
                    indent
                );
                break;
            default:
                json = JSON.stringify(
                    {
                        initialSeed,
                        name: this.generateAnyName(),
                        personality: this.generatePersonality(),
                        motivation: this.generateMotivation()
                    },
                    null,
                    indent
                );
                break;
        }
        message.author.createDM().then(c => {
            c.send(`\`\`\`json\n${json}\n\`\`\``);
        });
        if (message.deletable) {
            message.delete();
        }
    }

    private generatePlace() {
        return this.nameGenerator.place();
    }

    private generateName() {
        let name = this.nameGenerator.firstname();
        name += ' ';
        name += this.nameGenerator.surname();
        return name;
    }

    private generateAlienName() {
        return this.alienNamesGenerator.generate();
    }

    private generateAnyName() {
        const isAlien = this.randomService.pickOne([true, false]);
        return isAlien.value
            ? this.alienNamesGenerator.generate()
            : this.generateName();
    }

    private generateMotivation() {
        return {
            desires: this.randomService.pickOne(motivations.desires).value,
            fear: this.randomService.pickOne(motivations.fear).value,
            strength: this.randomService.pickOne(motivations.strength).value,
            flaw: this.randomService.pickOne(motivations.flaw).value
        };
    }

    private generatePersonality() {
        this.randomService.pickOne(personalityTraits).value;
    }

    private withSeed(initialSeed: number, value: any): any {
        //return Object.assign(value, initialSeed);
        return { value, initialSeed };
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
                    syntax: 'alienname',
                    description:
                        'Generate some alien names. Support the -count argument.'
                },
                {
                    syntax: 'name',
                    description:
                        'Generate some names. Support the -count argument.'
                },
                {
                    syntax: 'place',
                    description:
                        'Generate a place name. Support the -count argument.'
                },
                {
                    syntax: 'personality',
                    description: 'Generate a personality.'
                }
            ]
        };
    }
}
