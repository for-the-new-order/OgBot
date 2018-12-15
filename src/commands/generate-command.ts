import { ChatCommandBase } from './ChatCommandBase';
import { Message } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { HelpText } from './HelpText';
import { RandomService } from '../generators/random-service';
import { AlienNamesGenerator } from '../generators/alien-names-generator';
import { NameGenerator, Gender } from '../generators/name-generator';
import { FormatUtility } from '../generators/format-utility';
import { motivations, personalityTraits, ranks, species } from '../../data';
import { EchoHelpService } from './EchoHelpService';
import { StarWarsAdventureGenerator, AdventureProperties } from '../generators/star-wars-adventure-generator';

export class GenerateCommand extends ChatCommandBase {
    protected supportedCommands = ['generate', 'gen', 'g'];
    private randomService: RandomService;
    private formatUtility: FormatUtility;
    private alienNamesGenerator: AlienNamesGenerator; // = new AlienNamesGenerator(new FormatUtility());
    private nameGenerator: NameGenerator;
    private echoHelpService = new EchoHelpService();
    private starWarsAdventureGenerator: StarWarsAdventureGenerator;
    constructor() {
        super();
        this.randomService = new RandomService();
        this.nameGenerator = new NameGenerator(this.randomService);
        this.formatUtility = new FormatUtility();
        this.alienNamesGenerator = new AlienNamesGenerator(this.formatUtility);
        this.starWarsAdventureGenerator = new StarWarsAdventureGenerator(this.randomService);
    }

    public handle(message: Message, commandArgs: CommandArgs) {
        let subCommand: string = null;
        if (commandArgs.args.length > 0) {
            subCommand = commandArgs.args[0];
        }

        if (commandArgs.argumentExists('seed')) {
            // Custom seed
            this.randomService.seed = parseInt(commandArgs.findArgumentValue('seed'));
        } else {
            // Re-randomize the random seed
            this.randomService.reseed();
        }
        const initialSeed = this.randomService.seed;

        // count
        let count = 1;
        if (commandArgs.argumentExists('count')) {
            count = parseInt(commandArgs.findArgumentValue('count'));
        }

        // Whisper
        const whisper = commandArgs.argumentExists('whisper') || commandArgs.argumentExists('w');

        let json = '';
        const indent = 2;
        let messageSent = false;
        switch (subCommand) {
            case 'adventure':
                const hasAdventureElement = commandArgs.argumentExists('element') || commandArgs.argumentExists('el');
                if (hasAdventureElement) {
                    const rawAdventureElement = commandArgs.findArgumentValue('element') || commandArgs.findArgumentValue('el');
                    const adventureElement = rawAdventureElement as AdventureProperties;
                    if (adventureElement) {
                        var distinct = commandArgs.argumentExists('distinct');
                        json = JSON.stringify(
                            this.starWarsAdventureGenerator.generateAdventureElement(adventureElement, count, distinct),
                            null,
                            indent
                        );
                    } else {
                        json = JSON.stringify({ error: `${rawAdventureElement} is not a valid adventure element.` }, null, indent);
                    }
                } else {
                    json = JSON.stringify(this.starWarsAdventureGenerator.generateAdventure(), null, indent);
                }
                break;
            case 'name':
                const names: Array<{ name: string; gender: Gender }> = [];
                for (let i = 0; i < count; i++) {
                    const gender = this.generateGender();
                    names.push(this.generateName(gender));
                }
                json = JSON.stringify(this.withSeed(initialSeed, names), null, indent);
                break;
            case 'alienname':
                var aliennames: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    aliennames.push(this.generateAlienName());
                }
                json = JSON.stringify(aliennames, null, indent);
                break;
            case 'motivation':
                var motivation = this.generateMotivation();
                json = JSON.stringify(this.withSeed(initialSeed, motivation), null, indent);
                break;
            case 'personality':
                var personality = this.generatePersonality();
                json = JSON.stringify(this.withSeed(initialSeed, personality), null, indent);
                break;
            case 'place':
                var places: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    places.push(this.generatePlace());
                }
                json = JSON.stringify(this.withSeed(initialSeed, places), null, indent);
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
                json = JSON.stringify(this.withSeed(initialSeed, generatedRanks), null, indent);
                break;
            case 'default':
                json = JSON.stringify(this.defaultValues, null, indent);
                break;
            case 'species':
                const species: Array<Species> = [];
                for (let i = 0; i < count; i++) {
                    species.push(this.generateSpecies());
                }
                json = JSON.stringify(species, null, indent);
                break;
            case 'help':
                const help = this.help(commandArgs);
                this.echoHelpService.echo(help, whisper, message);
                messageSent = true;
                break;
            default:
                const name = this.generateAnyName();
                const rank = this.generateRank(ranks.all);
                const type = this.getTypeBasedOnRank(rank);
                const obj: any = {};
                const generatedValues = {
                    initialSeed,
                    image_path: `/assets/images/npcs/250x250-${rank.clan}.png`,
                    type,
                    species: name.species,
                    rank: rank.name,
                    gender: name.gender,
                    clan: this.formatUtility.capitalize(rank.clan),
                    personality: this.generatePersonality(),
                    motivation: this.generateMotivation()
                };
                obj[name.name] = generatedValues;
                json = JSON.stringify(obj, null, indent);

                if (commandArgs.argumentExists('defaults')) {
                    const defaultsObj: any = {};
                    defaultsObj[name.name] = this.defaultValues;
                    const defaultsJson = JSON.stringify(defaultsObj, null, indent);
                    this.send(json, whisper, message);
                    this.send(defaultsJson, whisper, message);
                    messageSent = true;
                }
                break;
        }

        if (!messageSent) {
            this.send(json, whisper, message);
        }
        if (message.deletable) {
            message.delete();
        }
    }

    public get defaultValues() {
        return {
            attributes: {
                wounds: 12,
                defense: {
                    melee: 0,
                    ranged: 0
                },
                soak: 2,
                strain: 12
            },
            characteristics: {
                brawn: 2,
                agility: 2,
                intellect: 2,
                cunning: 2,
                willpower: 2,
                presence: 2
            },
            skills: [],
            talents: [],
            abilities: [],
            equipment: [],
            description: ['TODO: describe the NPC here...']
        };
    }

    private send(json: string, whisper: boolean, message: Message) {
        const chatToSend = `\`\`\`json\n${json}\n\`\`\``;
        if (whisper) {
            message.author.createDM().then(c => {
                c.send(chatToSend);
            });
        } else {
            message.reply(chatToSend);
        }
    }

    private generatePlace() {
        return this.nameGenerator.place();
    }

    private generateName(gender: Gender): { name: string; gender: Gender } {
        let name = this.nameGenerator.firstname(gender);
        name += ' ';
        name += this.nameGenerator.surname();
        return { name, gender };
    }

    private generateAlienName() {
        return this.alienNamesGenerator.generate();
    }

    private generateAnyName(): {
        name: string;
        isAlien: boolean;
        species: Species;
        gender: Gender;
    } {
        const isAlien = this.randomService.getRandomInt(0, 20).value == 20;
        if (isAlien) {
            const alienName = this.alienNamesGenerator.generate();
            return {
                isAlien: isAlien,
                name: alienName,
                species: this.generateSpecies(),
                gender: Gender.Unknown
            };
        }
        const gender = this.generateGender();
        const humanName = this.generateName(gender);
        return {
            isAlien: isAlien,
            name: humanName.name,
            species: { name: 'Human' },
            gender
        };
    }

    private generateGender() {
        return this.randomService.pickOne([Gender.Male, Gender.Male, Gender.Female]).value;
    }

    private generateSpecies(): Species {
        const specie = this.randomService.pickOne(species);
        return specie.value;
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
            rndRanks = rndRanks.filter(x => x.level >= range.minLevel && x.level <= range.maxLevel);
        }

        if (rndRanks.length === 0) {
            return this.generateRank(corpRanks);
        }
        return this.randomService.pickOne(rndRanks).value;
    }

    private getTypeBasedOnRank(rank: { level: number; name: string; clan: string }): string {
        var findSteps = ranks[rank.clan].steps;
        var mid = Math.ceil(findSteps.length / 2);
        var step = findSteps[mid];
        var threshold = step[0];
        return rank.level > threshold ? 'NEMESIS' : 'RIVAL';
    }

    public help(commandArgs: CommandArgs): HelpText {
        const countOption = {
            syntax: '-count [some number]',
            description: 'Generate the specified number of result.'
        };
        const seedOption = {
            syntax: '-seed [some random seed]',
            description: 'Use the specified seed to generate the specified item. This can be used to replay random generation.'
        };
        const wisperOption = {
            syntax: '-whisper',
            alias: '-w',
            description: 'The bot will whisper you the results instead of relying in the current channel.'
        };
        const helpObject = {
            command: this.supportedCommands[0],
            alias: this.supportedCommands.slice(1).join(', '),
            description: 'Generate random stuff; by default a character.',
            options: [wisperOption],
            args: [
                {
                    syntax: 'adventure',
                    description: 'Generate a Star Wars adventure.',
                    options: [
                        {
                            syntax:
                                "-element ['contract' | 'theme' | 'location' | 'macguffin' | 'victimsAndNPCs' | 'antagonistOrTarget' | 'twistsOrComplications' | 'dramaticReveal']",
                            alias: '-el',
                            description: 'Generate only the specified adventure element (optionally: the specified the number of time).',
                            options: [
                                countOption,
                                {
                                    syntax: '-distinct',
                                    description: 'Remove duplicate entries.'
                                }
                            ]
                        }
                    ]
                },
                {
                    syntax: 'motivation',
                    description: 'Generate a character motivation.',
                    options: [seedOption]
                },
                {
                    syntax: 'alienname',
                    description: 'Generate some alien names.',
                    options: [countOption]
                },
                {
                    syntax: 'name',
                    description: 'Generate some names.',
                    options: [countOption, seedOption]
                },
                {
                    syntax: 'place',
                    description: 'Generate a place name.',
                    options: [countOption, seedOption]
                },
                {
                    syntax: 'personality',
                    description: 'Generate a personality.',
                    options: [seedOption]
                },
                {
                    syntax: 'rank',
                    description: 'Generate a rank.',
                    options: [
                        countOption,
                        // {
                        //     syntax:
                        //         '-corp [navy|army|intelligence|COMPORN|governance|ancillary|appointments]',
                        //     description:
                        //         'Use a particular rank collectino to generate the rank in.'
                        // },
                        seedOption
                    ]
                },
                {
                    syntax: 'species',
                    description: 'Generate a species.',
                    options: [countOption, seedOption]
                },
                {
                    syntax: 'default',
                    description: 'Generate a default Jekyll formatted default values for NPCs.',
                    options: [seedOption]
                },
                {
                    syntax: 'help',
                    description: 'Display the generate command help.'
                }
            ]
        };

        // Some sub-command filter; this should be extracted in some sort of sub-command (along with the sub-command themselves).
        if (commandArgs.args.length > 0) {
            const firsArg = commandArgs.args[0];
            for (let i = 0; i < helpObject.args.length; i++) {
                const element = helpObject.args[i];
                if (element.syntax === firsArg) {
                    helpObject.args = [element];
                    break;
                }
            }
        }
        return helpObject;
    }
}

interface Species {
    name: string;
}
