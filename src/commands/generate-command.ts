import { ChatCommandBase } from './ChatCommandBase';
import { Message } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { CommandHelpDescriptor } from './HelpText';
import { RandomService } from '../generators/random-service';
import { AlienNamesGenerator } from '../generators/alien-names-generator';
import { NameGenerator, Gender } from '../generators/name-generator';
import { FormatUtility } from '../generators/format-utility';
import { motivations, personalityTraits, ranks, species } from '../../data';
import { StarWarsAdventureGenerator, AdventureProperties } from '../generators/star-wars-adventure-generator';
import { Rank } from '../Models/Rank';
import { ImperialMissionGenerator } from '../generators/imperial-mission-generator';

export class GenerateCommand extends ChatCommandBase {
    protected supportedCommands = ['generate', 'gen', 'g'];
    private randomService: RandomService;
    private formatUtility: FormatUtility;
    private alienNamesGenerator: AlienNamesGenerator;
    private nameGenerator: NameGenerator;
    private starWarsAdventureGenerator: StarWarsAdventureGenerator;
    private imperialMissionGenerator: ImperialMissionGenerator;
    constructor() {
        super();
        this.randomService = new RandomService();
        this.nameGenerator = new NameGenerator(this.randomService);
        this.formatUtility = new FormatUtility();
        this.alienNamesGenerator = new AlienNamesGenerator(this.formatUtility);
        this.starWarsAdventureGenerator = new StarWarsAdventureGenerator(this.randomService);
        this.imperialMissionGenerator = new ImperialMissionGenerator(this.randomService);
    }

    public handle(message: Message, commandArgs: CommandArgs) {
        // Create sub-command object (this could become recursive to create a "command-tree" of sort)
        var subCommand = commandArgs.convertToSubCommand();

        // Set the random seed
        if (commandArgs.argumentExists('seed')) {
            this.randomService.seed = parseInt(commandArgs.findArgumentValue('seed'));
        } else {
            this.randomService.reseed();
        }
        const initialSeed = this.randomService.seed;

        // Count
        let count = 1;
        if (commandArgs.argumentExists('count')) {
            count = parseInt(commandArgs.findArgumentValue('count'));
        }

        // Whisper
        const whisper = commandArgs.argumentExists('whisper') || commandArgs.argumentExists('w');

        //
        // Apply faction/corp/rank filters
        //
        let factionName: string;
        if (commandArgs.argumentExists('clan')) {
            factionName = commandArgs.findArgumentValue('clan');
        }
        let corpName: string;
        if (commandArgs.argumentExists('corp')) {
            corpName = commandArgs.findArgumentValue('corp');
        }
        const range = {
            min: 0,
            max: 0,
            hasMin: false,
            hasMax: false
        };
        if (commandArgs.argumentExists('min')) {
            range.min = parseInt(commandArgs.findArgumentValue('min'));
            range.hasMin = true;
        }
        if (commandArgs.argumentExists('max')) {
            range.max = parseInt(commandArgs.findArgumentValue('max'));
            range.hasMax = true;
        }

        // Find rank level
        let factionRanks: Array<Rank>;
        if (factionName && ranks.hasOwnProperty(factionName)) {
            const faction = ranks[factionName];
            if (corpName && faction.hasOwnProperty(corpName)) {
                factionRanks = faction.all.filter(r => r.corp === corpName);
            } else {
                factionRanks = faction.all;
            }
        } else {
            factionRanks = ranks.all;
        }

        if (range.hasMin && range.hasMax) {
            factionRanks = factionRanks.filter(r => r.level >= range.min && r.level <= range.max);
        } else if (range.hasMin) {
            factionRanks = factionRanks.filter(r => r.level >= range.min);
        } else if (range.hasMax) {
            factionRanks = factionRanks.filter(r => r.level <= range.max);
        }

        // Gender
        let gender: Gender;
        if (commandArgs.argumentExists('gender')) {
            const tmpGender = commandArgs.findArgumentValue('gender');
            gender = tmpGender === 'f' ? Gender.Female : tmpGender === 'm' ? Gender.Male : Gender.Unknown;
        }

        // Evaluate the command
        let json = '';
        const indent = 2;
        let messageSent = false;
        const switchCondition = subCommand ? subCommand.trigger : '';
        switch (switchCondition) {
            case 'imperialmission':
                const mission = this.imperialMissionGenerator.generate();
                json = JSON.stringify(mission, null, indent);
                break;
            case 'docker':
                json = JSON.stringify({ dockerified: true }, null, indent);
                break;
            case 'adventure':
                // Execute command
                var adventureElement = subCommand.command as AdventureProperties;
                if (adventureElement) {
                    var distinct = subCommand.argumentExists('distinct');
                    json = JSON.stringify(
                        this.starWarsAdventureGenerator.generateAdventureElement(adventureElement, count, distinct),
                        null,
                        indent
                    );
                } else if (subCommand.command) {
                    json = JSON.stringify({ error: `${subCommand.command} is not a valid adventure element.` }, null, indent);
                } else {
                    json = JSON.stringify(this.starWarsAdventureGenerator.generateAdventure(), null, indent);
                }
                break;
            case 'name':
                const names: Array<{ name: string; gender: Gender }> = [];
                const genderParam = gender;
                for (let i = 0; i < count; i++) {
                    if (!genderParam) {
                        gender = this.generateGender();
                    }
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
            case 'motivations':
                let motivationType = subCommand.command as NpcType;
                if (!motivationType) {
                    motivationType = NpcType.Nemesis;
                }
                const motivation = this.generateMotivations(motivationType);
                json = JSON.stringify(this.withSeed(initialSeed, motivation), null, indent);
                break;
            case 'personality':
                var personalities: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    personalities.push(this.generatePersonality());
                }
                json = JSON.stringify(this.withSeed(initialSeed, personalities), null, indent);
                break;
            case 'place':
                var places: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    places.push(this.generatePlace());
                }
                json = JSON.stringify(this.withSeed(initialSeed, places), null, indent);
                break;
            case 'rank':
                // Generate rank(s)
                var generatedRanks: Array<Rank> = [];
                for (let i = 0; i < count; i++) {
                    generatedRanks.push(this.generateRank(factionRanks));
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
            default:
                const name = this.generateAnyName(gender);
                const rank = this.generateRank(factionRanks);
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
                    corp: this.formatUtility.capitalize(rank.corp),
                    personality: this.generatePersonality(),
                    motivation: this.generateMotivations(type)
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

    private generateAnyName(
        gender?: Gender
    ): {
        name: string;
        isAlien: boolean;
        species: Species;
        gender: Gender;
    } {
        let isAlien = this.randomService.getRandomInt(0, 20).value == 20;
        if (!gender) {
            gender = this.generateGender();
        }
        if (gender === Gender.Unknown) {
            isAlien = true;
        }
        if (isAlien) {
            const alienName = this.alienNamesGenerator.generate();
            return {
                isAlien: isAlien,
                name: alienName,
                species: this.generateSpecies(),
                gender: gender
            };
        }
        const humanName = this.generateName(gender);
        return {
            isAlien: isAlien,
            name: humanName.name,
            species: { name: 'Human' },
            gender
        };
    }

    private generateGender() {
        return this.randomService.pickOne([Gender.Male, Gender.Male, Gender.Female, Gender.Male]).value;
    }

    private generateSpecies(): Species {
        const specie = this.randomService.pickOne(species);
        return specie.value;
    }

    private generateMotivations(type?: NpcType): Motivations {
        if (type === NpcType.Rival) {
            return {
                strength: this.randomService.pickOne(motivations.strength).value,
                flaw: this.randomService.pickOne(motivations.flaw).value
            };
        }
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
        corpRanks: Array<Rank>,
        range?: {
            minLevel: number;
            maxLevel: number;
        }
    ): Rank {
        if (corpRanks.length === 0) {
            return {
                level: 0,
                name: 'N/D',
                clan: 'N/D',
                corp: 'N/D'
            };
        }
        let rndRanks = corpRanks;
        if (range !== undefined) {
            rndRanks = rndRanks.filter(x => x.level >= range.minLevel && x.level <= range.maxLevel);
        }

        if (rndRanks.length === 0) {
            return this.generateRank(corpRanks);
        }
        return this.randomService.pickOne(rndRanks).value;
    }

    private getTypeBasedOnRank(rank: Rank): NpcType {
        var allRanks = ranks[rank.clan];
        if (!allRanks) {
            return NpcType.Rival;
        }
        var findSteps = allRanks.steps;
        var mid = Math.ceil(findSteps.length / 2);
        var step = findSteps[mid];
        var threshold = step[0];
        return rank.level >= threshold ? NpcType.Nemesis : NpcType.Rival;
    }

    public help(commandArgs: CommandArgs): CommandHelpDescriptor {
        const countOption = {
            command: '-count [some number]',
            description: 'Generate the specified number of result.'
        };
        const seedOption = {
            command: '-seed [some random seed]',
            description: 'Use the specified seed to generate the specified item. This can be used to replay random generation.'
        };
        const wisperOption = {
            command: '-whisper',
            alias: '-w',
            description: 'The bot will whisper you the results instead of relying in the current channel.'
        };
        const genderOption = {
            command: '-gender [f|m|...]',
            description:
                'Generate a name based on the specified gender. Anything else than m or f will generate an alien with an unknown gender.'
        };
        const clanOption = {
            command: '-clan [empire|generic|rebels]',
            description: 'Generate the NPC based on the specified clan.',
            options: [
                {
                    command:
                        '-corp [empire: {navy|army|compnor|appointments|ancillary|governance|intelligence}, generic: {army|navy}, rebels: {army|navy}]',
                    description: 'Generate the NPC based on the specified corp. This setting depends on the selected clan'
                }
            ]
        };
        const minOption = {
            command: '-min [number]',
            description: 'Select the minimum rank level (inclusive) for the generated NPC.'
        };
        const maxOption = {
            command: '-max [number]',
            description: 'Select the maximum rank level (inclusive) for the generated NPC.'
        };

        const helpObject: CommandHelpDescriptor = {
            command: this.supportedCommands[0],
            alias: this.supportedCommands.slice(1).join(', '),
            description: 'Generate random stuff; by default a character.',
            options: [wisperOption],
            subcommands: [
                {
                    command: 'adventure',
                    description: 'Generate a Star Wars adventure.',
                    subcommands: [
                        {
                            command:
                                '[contract|theme|location|macguffin|victimsAndNPCs|antagonistOrTarget|twistsOrComplications|dramaticReveal]',
                            description: '(optional) Generate only the specified adventure element.',
                            isOptional: true,
                            options: [
                                countOption,
                                {
                                    command: '-distinct',
                                    description: 'Remove duplicate entries.'
                                }
                            ]
                        }
                    ]
                },
                {
                    command: 'motivations',
                    description: "Generate a character's motivations.",
                    subcommands: [
                        {
                            command: '[rival|nemesis]',
                            description: "Indicate to generate a nemesis or a rival's motivations; default is nemesis."
                        }
                    ],
                    options: [seedOption]
                },
                {
                    command: 'alienname',
                    description: 'Generate some alien names.',
                    options: [countOption]
                },
                {
                    command: 'name',
                    description: 'Generate some names.',
                    options: [countOption, seedOption]
                },
                {
                    command: 'place',
                    description: 'Generate a place name.',
                    options: [countOption, seedOption]
                },
                {
                    command: 'personality',
                    description: 'Generate a personality.',
                    options: [seedOption]
                },
                {
                    command: 'rank',
                    description: 'Generate a rank.',
                    options: [countOption, seedOption, clanOption, minOption, maxOption]
                },
                {
                    command: 'species',
                    description: 'Generate a species.',
                    options: [countOption, seedOption]
                },
                {
                    command: 'default',
                    description: 'Generate a default Jekyll formatted default values for NPCs.',
                    options: [seedOption, genderOption, clanOption, minOption, maxOption]
                }
            ]
        };

        // Some sub-command filter; this should be extracted in some sort of sub-command (along with the sub-command themselves).
        if (commandArgs.args && commandArgs.args.length > 0) {
            const firsArg = commandArgs.args[0];
            for (let i = 0; i < helpObject.subcommands.length; i++) {
                const element = helpObject.subcommands[i];
                if (element.command === firsArg) {
                    helpObject.subcommands = [element];
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

enum NpcType {
    Nemesis = 'nemesis',
    Rival = 'rival',
    Minion = 'minion'
}

interface Motivations {
    desires?: Motivation;
    fear?: Motivation;
    strength: Motivation;
    flaw: Motivation;
}

interface Motivation {
    name: string;
    description: string;
}
