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
import { ImperialMissionGenerator, BaseGenerator } from '../generators/imperial-mission-generator';
import { SpaceTrafficGenerator } from '../generators/space-traffic-generator';
import { ChatterService, OutputType } from './ChatterService';
import {
    AlignmentAndAttitudeGenerator,
    PersonalityOptions,
    PersonalityAlignmentType,
} from '../CentralCasting/AlignmentAndAttitudeGenerator';
import { CentralCastingHeroesForTomorrowHub, CentralCastingFactory } from '../CentralCasting/CentralCastingHeroesForTomorrowHub';
import { isArray } from 'util';
import { UglySpaceshipGenerator } from '../generators/ugly-spaceship-generator';
import { DwarfNameGenerator } from '../generators/dwarf-name-generator';

export class GenerateCommand extends ChatCommandBase {
    protected supportedCommands = ['generate', 'gen', 'g'];
    private randomService: RandomService;
    private formatUtility: FormatUtility;
    private alienNamesGenerator: AlienNamesGenerator;
    private nameGenerator: NameGenerator;
    private starWarsAdventureGenerator: StarWarsAdventureGenerator;
    private imperialMissionGenerator: ImperialMissionGenerator;
    private spaceTrafficGenerator: SpaceTrafficGenerator;
    private centralCastingHub: CentralCastingHeroesForTomorrowHub;
    private uglySpaceshipGenerator: UglySpaceshipGenerator;
    private dwarfNameGenerator: DwarfNameGenerator;

    private baseGenerator: BaseGenerator;
    private baseName = '';
    private baseNameAction = () => this.baseName;
    constructor(private chatterService: ChatterService) {
        super();
        this.randomService = new RandomService();
        this.nameGenerator = new NameGenerator(this.randomService);
        this.formatUtility = new FormatUtility();
        this.alienNamesGenerator = new AlienNamesGenerator(this.formatUtility);
        this.starWarsAdventureGenerator = new StarWarsAdventureGenerator(this.randomService);
        this.imperialMissionGenerator = new ImperialMissionGenerator(this.randomService, this.starWarsAdventureGenerator);
        this.baseGenerator = new BaseGenerator(this.baseNameAction, this.randomService);
        this.spaceTrafficGenerator = new SpaceTrafficGenerator(this.randomService);
        this.centralCastingHub = CentralCastingFactory.createHub(this.randomService);
        this.uglySpaceshipGenerator = new UglySpaceshipGenerator(this.randomService);
        this.dwarfNameGenerator = new DwarfNameGenerator(this.randomService);
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
            hasMax: false,
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
                factionRanks = faction.all.filter((r) => r.corp === corpName);
            } else {
                factionRanks = faction.all;
            }
        } else {
            factionRanks = ranks.all;
        }

        if (range.hasMin && range.hasMax) {
            factionRanks = factionRanks.filter((r) => r.level >= range.min && r.level <= range.max);
        } else if (range.hasMin) {
            factionRanks = factionRanks.filter((r) => r.level >= range.min);
        } else if (range.hasMax) {
            factionRanks = factionRanks.filter((r) => r.level <= range.max);
        }

        // Gender
        let gender: Gender;
        if (commandArgs.argumentExists('gender')) {
            const tmpGender = commandArgs.findArgumentValue('gender');
            gender = tmpGender === 'f' ? Gender.Female : tmpGender === 'm' ? Gender.Male : Gender.Unknown;
        }

        // Output type
        let outputType: OutputType = this.chatterService.options.outputType;
        if (commandArgs.argumentExists('output')) {
            const tmpOutput = commandArgs.findArgumentValue('output');
            outputType = tmpOutput === OutputType.YAML ? OutputType.YAML : tmpOutput === OutputType.JSON ? OutputType.JSON : outputType;
        }
        var chatterOptions = this.chatterService.options.mergeWith({ outputType });
        const sendChat = (objectToSend: any) => {
            const objectToSendWithSeed = this.withSeed(initialSeed, objectToSend);
            this.chatterService.send(objectToSendWithSeed, whisper, message, chatterOptions);
        };

        // Evaluate the command
        const switchCondition = subCommand ? subCommand.trigger : '';
        this.baseName = 'Base';
        switch (switchCondition) {
            case 'dwarfname':
                const dwarfnameOutput = [];
                for (let i = 0; i < count; i++) {
                    if (!gender) {
                        gender = this.generateGender();
                    }
                    var dwarfNameResult = this.dwarfNameGenerator.firstName(gender);
                    dwarfnameOutput.push(dwarfNameResult);
                }
                sendChat(dwarfnameOutput);
                break;
            case 'dwarfstrongholdname':
                var dwarfstrongholdNameResult = this.dwarfNameGenerator.strongholdName();
                sendChat(dwarfstrongholdNameResult);
                break;
            case 'uglyspaceship':
                const vehicleOutput: any = {};
                for (let i = 0; i < count; i++) {
                    const vehicle = this.uglySpaceshipGenerator.generate();
                    let vehicleObject = (vehicleOutput[vehicle.name] = {});
                    delete vehicle.name;
                    Object.assign(vehicleObject, vehicle);
                }
                sendChat(vehicleOutput);
                break;
            case 'alignmentandattitude':
            case 'personality2':
            case '312':
                const personalityOptions = Object.assign(new PersonalityOptions(), {
                    randomPersonalityTrait: count,
                });
                if (subCommand.argumentExists('threshold')) {
                    personalityOptions.alignmentThreshold = parseFloat(subCommand.findArgumentValue('threshold'));
                    personalityOptions.alignmentThreshold = isNaN(personalityOptions.alignmentThreshold)
                        ? 0
                        : personalityOptions.alignmentThreshold;
                }
                if (subCommand.argumentExists('alignment')) {
                    const allowed = [
                        PersonalityAlignmentType.Lightside,
                        PersonalityAlignmentType.Neutral,
                        PersonalityAlignmentType.Darkside,
                    ];
                    const alignment = subCommand.findArgumentValue('alignment') as PersonalityAlignmentType;
                    if (allowed.indexOf(alignment) > -1) {
                        personalityOptions.expectedAlignment = alignment;
                    }
                }
                const personality = this.centralCastingHub.alignmentAndAttitude.generate(personalityOptions);
                sendChat(personality);
                break;
            case 'spacecraft':
            case '866':
            case 'spaceship':
                const ship = this.centralCastingHub.spaceship.generate();
                sendChat(ship);
                break;
            case 'spacetraffic':
                const traffic = this.spaceTrafficGenerator.generate({ amount: count });
                sendChat(traffic);
                break;
            case 'imperialmission':
                const mission = this.imperialMissionGenerator.generate();
                sendChat(mission);
                break;
            case 'imperialbase':
                this.baseName = 'Imperial Base';
                const imperialbase = this.baseGenerator.generate();
                sendChat(imperialbase);
                break;
            case 'rebelbase':
                this.baseName = 'Rebel Base';
                const rebelbase = this.baseGenerator.generate();
                sendChat(rebelbase);
                break;
            case 'base':
                if (commandArgs.argumentExists('name')) {
                    this.baseName = commandArgs.findArgumentValue('name');
                }
                const base = this.baseGenerator.generate();
                sendChat(base);
                break;
            case 'adventure':
                // Execute command
                var adventureElement = subCommand.command as AdventureProperties;
                if (adventureElement) {
                    var distinct = subCommand.argumentExists('distinct');
                    const result = this.starWarsAdventureGenerator.generateAdventureElement(adventureElement, count, distinct);
                    sendChat(result);
                } else if (subCommand.command) {
                    sendChat({ error: `${subCommand.command} is not a valid adventure element.` });
                } else {
                    const result = this.starWarsAdventureGenerator.generateAdventure();
                    sendChat(result);
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
                sendChat(names);
                break;
            case 'droidname':
                const droidNames: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    droidNames.push(this.nameGenerator.droid());
                }
                sendChat(droidNames);
                break;
            case 'alienname':
                var aliennames: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    aliennames.push(this.generateAlienName());
                }
                sendChat(aliennames);
                break;
            case 'motivations':
                let motivationType = subCommand.command as NpcType;
                if (!motivationType) {
                    motivationType = NpcType.Nemesis;
                }
                const motivation = this.generateMotivations(motivationType);
                sendChat(motivation);
                break;
            case 'personality':
                var personalities: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    personalities.push(this.generatePersonality());
                }
                sendChat(personalities);
                break;
            case 'place':
                var places: Array<string> = [];
                for (let i = 0; i < count; i++) {
                    places.push(this.generatePlace());
                }
                sendChat(places);
                break;
            case 'rank':
                // Generate rank(s)
                var generatedRanks: Array<Rank> = [];
                for (let i = 0; i < count; i++) {
                    generatedRanks.push(this.generateRank(factionRanks));
                }
                sendChat(generatedRanks);
                break;
            case 'default':
                sendChat(this.defaultValues);
                break;
            case 'species':
                const species: Array<Species> = [];
                for (let i = 0; i < count; i++) {
                    species.push(this.generateSpecies());
                }
                sendChat(species);
                break;
            default:
                const name = this.generateAnyName(gender);
                const rank = this.generateRank(factionRanks);
                const type = this.getTypeBasedOnRank(rank);
                const obj: any = {};
                let character = (obj[name.name] = {});

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
                    motivation: this.generateMotivations(type),
                };
                Object.assign(character, generatedValues);

                if (commandArgs.argumentExists('defaults')) {
                    Object.assign(character, this.defaultValues);
                }

                sendChat(obj);
                break;
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
                    ranged: 0,
                },
                soak: 2,
                strain: 12,
            },
            characteristics: {
                brawn: 2,
                agility: 2,
                intellect: 2,
                cunning: 2,
                willpower: 2,
                presence: 2,
            },
            skills: [],
            talents: [],
            abilities: [],
            equipment: [],
            description: ['TODO: describe the NPC here...'],
        };
    }

    private send(json: string, whisper: boolean, message: Message) {
        const chatToSend = `\`\`\`json\n${json}\n\`\`\``;
        if (whisper) {
            message.author.createDM().then((c) => {
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

    private generateAnyName(gender?: Gender): {
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
                gender: gender,
            };
        }
        const humanName = this.generateName(gender);
        return {
            isAlien: isAlien,
            name: humanName.name,
            species: { name: 'Human' },
            gender,
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
                flaw: this.randomService.pickOne(motivations.flaw).value,
            };
        }
        return {
            desires: this.randomService.pickOne(motivations.desires).value,
            fear: this.randomService.pickOne(motivations.fear).value,
            strength: this.randomService.pickOne(motivations.strength).value,
            flaw: this.randomService.pickOne(motivations.flaw).value,
        };
    }

    private generatePersonality() {
        return this.randomService.pickOne(personalityTraits).value;
    }

    private withSeed(initialSeed: number, value: any): any {
        if (isArray(value)) {
            return { values: value, initialSeed };
        } else {
            return { ...value, initialSeed };
        }
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
                corp: 'N/D',
            };
        }
        let rndRanks = corpRanks;
        if (range !== undefined) {
            rndRanks = rndRanks.filter((x) => x.level >= range.minLevel && x.level <= range.maxLevel);
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
            description: 'Generate the specified number of result.',
        };
        const seedOption = {
            command: '-seed [some random seed]',
            description: 'Use the specified seed to generate the specified item. This can be used to replay random generation.',
        };
        const wisperOption = {
            command: '-whisper',
            alias: '-w',
            description: 'The bot will whisper you the results instead of relying in the current channel.',
        };
        const genderOption = {
            command: '-gender [f|m|...]',
            description:
                'Generate a name based on the specified gender. Anything else than m or f will generate an alien with an unknown gender.',
        };
        const clanOption = {
            command: '-clan [empire|generic|rebels]',
            description: 'Generate the NPC based on the specified clan.',
            options: [
                {
                    command:
                        '-corp [empire: {navy|army|compnor|appointments|ancillary|governance|intelligence}, generic: {army|navy}, rebels: {army|navy}]',
                    description: 'Generate the NPC based on the specified corp. This setting depends on the selected clan',
                },
            ],
        };
        const minOption = {
            command: '-min [number]',
            description: 'Select the minimum rank level (inclusive) for the generated NPC.',
        };
        const maxOption = {
            command: '-max [number]',
            description: 'Select the maximum rank level (inclusive) for the generated NPC.',
        };

        const outputOption = {
            command: '-output [JSON|YAML]',
            description: 'The selected output type (default: YAML)',
        };

        const helpObject: CommandHelpDescriptor = {
            command: this.supportedCommands[0],
            alias: this.supportedCommands.slice(1).join(', '),
            description: 'Generate random stuff; by default a character.',
            options: [wisperOption, outputOption],
            subcommands: [
                {
                    command: 'dwarfname',
                    description:
                        'Generate a dwarf name (and a few options) based on AD&D 2e The Complete Book of Dwarves name generator tables.',
                    options: [seedOption, genderOption, countOption],
                },
                {
                    command: 'dwarfstrongholdname',
                    description:
                        'Generate a dwarf stronghold name (and a few options) based on AD&D 2e The Complete Book of Dwarves name generator tables.',
                    options: [seedOption],
                },
                {
                    command: 'uglyspaceship',
                    description: 'Generate a spaceship that is composed from 2 or 3 other spaceships.',
                    options: [countOption],
                },
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
                                    description: 'Remove duplicate entries.',
                                },
                            ],
                        },
                    ],
                },
                {
                    command: 'alignmentandattitude',
                    alias: '312, personality2',
                    description:
                        'Generate a character personality, alignment and attitude. The number of random traits are defined by the count option (default: 1).',
                    options: [
                        countOption,
                        {
                            command: '-threshold [some number]',
                            description:
                                'Change the alignment threshold needed to tell if a character is good, neutral or evil (default: 2).',
                        },
                        {
                            command: '-alignment [Lightside|Neutral|Darkside]',
                            description: 'Generate a personality of the specified alignment.',
                        },
                    ],
                },
                {
                    command: 'spacecraft',
                    alias: '866, spaceship',
                    description: 'Generate a spacecraft.',
                },
                {
                    command: 'spacetraffic',
                    description: 'Generate space traffic; the amount of ship generated is defined by the count option (default: 1).',
                    options: [countOption],
                },
                {
                    command: 'imperialmission',
                    description: 'Generate a Star Wars Imperial adventure.',
                },
                {
                    command: 'imperialbase',
                    description: 'Generate a Star Wars Imperial base.',
                },
                {
                    command: 'rebelbase',
                    description: 'Generate a Star Wars Rebel Alliance base.',
                },
                {
                    command: 'base',
                    description: 'Generate a generic Star Wars base.',
                    options: [
                        {
                            command: '-name [name of the base without space]',
                            description: 'The name of the generated base.',
                        },
                    ],
                },
                {
                    command: 'motivations',
                    description: "Generate a character's motivations.",
                    subcommands: [
                        {
                            command: '[rival|nemesis]',
                            description: "Indicate to generate a nemesis or a rival's motivations; default is nemesis.",
                        },
                    ],
                    options: [seedOption],
                },
                {
                    command: 'alienname',
                    description: 'Generate some alien names.',
                    options: [countOption],
                },
                {
                    command: 'name',
                    description: 'Generate some names.',
                    options: [countOption, seedOption, genderOption],
                },
                {
                    command: 'droidname',
                    description: 'Generate some droid names.',
                    options: [countOption, seedOption],
                },
                {
                    command: 'place',
                    description: 'Generate a place name.',
                    options: [countOption, seedOption],
                },
                {
                    command: 'personality',
                    description: 'Generate a personality.',
                    options: [countOption, seedOption],
                },
                {
                    command: 'rank',
                    description: 'Generate a rank.',
                    options: [countOption, seedOption, clanOption, minOption, maxOption],
                },
                {
                    command: 'species',
                    description: 'Generate a species.',
                    options: [countOption, seedOption],
                },
                {
                    command: 'default',
                    description: 'Generate a default Jekyll formatted default values for NPCs.',
                    options: [seedOption, genderOption, clanOption, minOption, maxOption],
                },
            ],
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
    Minion = 'minion',
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
