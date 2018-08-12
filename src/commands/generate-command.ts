import { ChatCommandBase } from './ChatCommandBase';
import { Message } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { HelpText } from './HelpText';
import { RandomService } from '../generators/random-service';
import { AlienNamesGenerator } from '../generators/alien-names-generator';
import { NameGenerator } from '../generators/name-generator';
import { FormatUtility } from '../generators/format-utility';
import { motivations, personalityTraits, ranks } from '../../data';

export class GenerateCommand extends ChatCommandBase {
    protected supportedCommands = ['generate', 'gen', 'g'];
    private randomService: RandomService;
    private formatUtility: FormatUtility;
    private alienNamesGenerator = new AlienNamesGenerator(new FormatUtility());
    private nameGenerator: NameGenerator;
    constructor() {
        super();
        this.randomService = new RandomService();
        this.nameGenerator = new NameGenerator(this.randomService);
        this.formatUtility = new FormatUtility();
        this.alienNamesGenerator = new AlienNamesGenerator(this.formatUtility);
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

        // Whisper
        const whisper =
            commandArgs.argumentExists('whisper') ||
            commandArgs.argumentExists('w');

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
            case 'rank':
                // corp
                let corpName: string;
                if (commandArgs.argumentExists('corp')) {
                    corpName = commandArgs.findArgumentValue('corp');
                }

                // // Find rank level
                // let corpRanks: Array<{ level: number; name: string }>;
                // if (corpName && ranks.hasOwnProperty(corpName)) {
                //     corpRanks = ranks[corpName];
                // } else {
                const corpRanks = ranks.all;
                // }

                // Generate rank(s)
                var generatedRanks: Array<{ level: number; name: string }> = [];
                for (let i = 0; i < count; i++) {
                    generatedRanks.push(this.generateRank(corpRanks));
                }
                json = JSON.stringify(
                    this.withSeed(initialSeed, generatedRanks),
                    null,
                    indent
                );
                break;
            case 'help':
                const help = this.help();
                json = JSON.stringify(help, null, indent);
                break;
            default:
                const name = this.generateAnyName();
                const rank = this.generateRank(ranks.all);
                const type = this.getTypeBasedOnRank(rank);
                var obj: any = {};
                obj[name] = {
                    initialSeed,
                    image_path: `/assets/images/npcs/${rank.clan}.png`,
                    type,
                    rank: rank.name,
                    clan: this.formatUtility.capitalize(rank.clan),
                    personality: this.generatePersonality(),
                    motivation: this.generateMotivation()
                };
                json = JSON.stringify(obj, null, indent);
                break;
        }
        var chatToSend = `\`\`\`json\n${json}\n\`\`\``;
        if (whisper) {
            message.author.createDM().then(c => {
                c.send(chatToSend);
            });
        } else {
            message.reply(chatToSend);
        }
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
        return this.randomService.pickOne(personalityTraits).value;
    }

    private withSeed(initialSeed: number, value: any): any {
        return { value, initialSeed };
    }

    private generateRank(
        corpRanks: Array<{ level: number; name: string; clan: string }>,
        range?: {
            minLevel: number;
            maxLevel: number;
        }
    ) {
        let rndRanks = corpRanks;
        if (range !== undefined) {
            rndRanks = rndRanks.filter(
                x => x.level >= range.minLevel && x.level <= range.maxLevel
            );
        }

        if (rndRanks.length === 0) {
            return this.generateRank(corpRanks);
        }
        return this.randomService.pickOne(rndRanks).value;
    }

    private getTypeBasedOnRank(rank: {
        level: number;
        name: string;
        clan: string;
    }): string {
        var findSteps = ranks[rank.clan].steps;
        var mid = Math.ceil(findSteps.length / 2);
        var step = findSteps[mid];
        var threshold = step[0];
        return rank.level > threshold ? 'NEMESIS' : 'RIVAL';
    }

    public help(): HelpText {
        return {
            command: this.supportedCommands[0],
            alias: this.supportedCommands.slice(1).join(', '),
            description:
                'Generate random stuff; by default a character. Add option -whisper or -w to get private results.',
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
                },
                {
                    syntax: 'rank',
                    description:
                        'Generate a rank. Support the -count argument. Support the -corp argument with value: navy|army|intelligence|COMPORN|governance|ancillary|appointments'
                }
            ]
        };
    }
}
