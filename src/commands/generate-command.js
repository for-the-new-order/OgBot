"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ChatCommandBase_1 = require("./ChatCommandBase");
var CommandArgs_1 = require("./CommandArgs");
var random_service_1 = require("../generators/random-service");
var alien_names_generator_1 = require("../generators/alien-names-generator");
var name_generator_1 = require("../generators/name-generator");
var format_utility_1 = require("../generators/format-utility");
var data_1 = require("../../data");
var EchoHelpService_1 = require("./EchoHelpService");
var star_wars_adventure_generator_1 = require("../generators/star-wars-adventure-generator");
var GenerateCommand = /** @class */ (function (_super) {
    __extends(GenerateCommand, _super);
    function GenerateCommand() {
        var _this = _super.call(this) || this;
        _this.supportedCommands = ['generate', 'gen', 'g'];
        _this.echoHelpService = new EchoHelpService_1.EchoHelpService();
        _this.randomService = new random_service_1.RandomService();
        _this.nameGenerator = new name_generator_1.NameGenerator(_this.randomService);
        _this.formatUtility = new format_utility_1.FormatUtility();
        _this.alienNamesGenerator = new alien_names_generator_1.AlienNamesGenerator(_this.formatUtility);
        _this.starWarsAdventureGenerator = new star_wars_adventure_generator_1.StarWarsAdventureGenerator(_this.randomService);
        return _this;
    }
    GenerateCommand.prototype.handle = function (message, commandArgs) {
        var subCommand = null;
        if (commandArgs.args.length > 0) {
            subCommand = commandArgs.args[0];
        }
        if (commandArgs.argumentExists('seed')) {
            // Custom seed
            this.randomService.seed = parseInt(commandArgs.findArgumentValue('seed'));
        }
        else {
            // Re-randomize the random seed
            this.randomService.reseed();
        }
        var initialSeed = this.randomService.seed;
        // count
        var count = 1;
        if (commandArgs.argumentExists('count')) {
            count = parseInt(commandArgs.findArgumentValue('count'));
        }
        // Whisper
        var whisper = commandArgs.argumentExists('whisper') || commandArgs.argumentExists('w');
        var json = '';
        var indent = 2;
        var messageSent = false;
        switch (subCommand) {
            case 'adventure':
                // Create sub-command object (this could become recursive to create a "command-tree" of sort)
                var adventureCommand = new CommandArgs_1.CommandArgs(commandArgs.args[0].toLowerCase(), commandArgs.args.length > 1 ? commandArgs.args[1].toLowerCase() : null, commandArgs.args.splice(2));
                // Execute command
                var adventureElement = adventureCommand.command;
                if (adventureElement) {
                    var distinct = adventureCommand.argumentExists('distinct');
                    json = JSON.stringify(this.starWarsAdventureGenerator.generateAdventureElement(adventureElement, count, distinct), null, indent);
                }
                else if (adventureCommand.command != null && !adventureCommand.command.startsWith('-')) {
                    json = JSON.stringify({ error: adventureCommand.command + " is not a valid adventure element." }, null, indent);
                }
                else {
                    json = JSON.stringify(this.starWarsAdventureGenerator.generateAdventure(), null, indent);
                }
                break;
            case 'name':
                var names = [];
                for (var i = 0; i < count; i++) {
                    var gender = this.generateGender();
                    names.push(this.generateName(gender));
                }
                json = JSON.stringify(this.withSeed(initialSeed, names), null, indent);
                break;
            case 'alienname':
                var aliennames = [];
                for (var i = 0; i < count; i++) {
                    aliennames.push(this.generateAlienName());
                }
                json = JSON.stringify(aliennames, null, indent);
                break;
            case 'motivation':
                var motivation = this.generateMotivations();
                json = JSON.stringify(this.withSeed(initialSeed, motivation), null, indent);
                break;
            case 'personality':
                var personality = this.generatePersonality();
                json = JSON.stringify(this.withSeed(initialSeed, personality), null, indent);
                break;
            case 'place':
                var places = [];
                for (var i = 0; i < count; i++) {
                    places.push(this.generatePlace());
                }
                json = JSON.stringify(this.withSeed(initialSeed, places), null, indent);
                break;
            case 'rank':
                // corp
                var corpName = void 0;
                if (commandArgs.argumentExists('corp')) {
                    corpName = commandArgs.findArgumentValue('corp');
                }
                // // Find rank level
                // let corpRanks: Array<{ level: number; name: string }>;
                // if (corpName && ranks.hasOwnProperty(corpName)) {
                //     corpRanks = ranks[corpName];
                // } else {
                var corpRanks = data_1.ranks.all;
                // }
                // Generate rank(s)
                var generatedRanks = [];
                for (var i = 0; i < count; i++) {
                    generatedRanks.push(this.generateRank(corpRanks));
                }
                json = JSON.stringify(this.withSeed(initialSeed, generatedRanks), null, indent);
                break;
            case 'default':
                json = JSON.stringify(this.defaultValues, null, indent);
                break;
            case 'species':
                var species_1 = [];
                for (var i = 0; i < count; i++) {
                    species_1.push(this.generateSpecies());
                }
                json = JSON.stringify(species_1, null, indent);
                break;
            default:
                var name_1 = this.generateAnyName();
                var rank = this.generateRank(data_1.ranks.all);
                var type = this.getTypeBasedOnRank(rank);
                var obj = {};
                var generatedValues = {
                    initialSeed: initialSeed,
                    image_path: "/assets/images/npcs/250x250-" + rank.clan + ".png",
                    type: type,
                    species: name_1.species,
                    rank: rank.name,
                    gender: name_1.gender,
                    clan: this.formatUtility.capitalize(rank.clan),
                    personality: this.generatePersonality(),
                    motivation: this.generateMotivations(type)
                };
                obj[name_1.name] = generatedValues;
                json = JSON.stringify(obj, null, indent);
                if (commandArgs.argumentExists('defaults')) {
                    var defaultsObj = {};
                    defaultsObj[name_1.name] = this.defaultValues;
                    var defaultsJson = JSON.stringify(defaultsObj, null, indent);
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
    };
    Object.defineProperty(GenerateCommand.prototype, "defaultValues", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    GenerateCommand.prototype.send = function (json, whisper, message) {
        var chatToSend = "```json\n" + json + "\n```";
        if (whisper) {
            message.author.createDM().then(function (c) {
                c.send(chatToSend);
            });
        }
        else {
            message.reply(chatToSend);
        }
    };
    GenerateCommand.prototype.generatePlace = function () {
        return this.nameGenerator.place();
    };
    GenerateCommand.prototype.generateName = function (gender) {
        var name = this.nameGenerator.firstname(gender);
        name += ' ';
        name += this.nameGenerator.surname();
        return { name: name, gender: gender };
    };
    GenerateCommand.prototype.generateAlienName = function () {
        return this.alienNamesGenerator.generate();
    };
    GenerateCommand.prototype.generateAnyName = function () {
        var isAlien = this.randomService.getRandomInt(0, 20).value == 20;
        if (isAlien) {
            var alienName = this.alienNamesGenerator.generate();
            return {
                isAlien: isAlien,
                name: alienName,
                species: this.generateSpecies(),
                gender: name_generator_1.Gender.Unknown
            };
        }
        var gender = this.generateGender();
        var humanName = this.generateName(gender);
        return {
            isAlien: isAlien,
            name: humanName.name,
            species: { name: 'Human' },
            gender: gender
        };
    };
    GenerateCommand.prototype.generateGender = function () {
        return this.randomService.pickOne([name_generator_1.Gender.Male, name_generator_1.Gender.Male, name_generator_1.Gender.Female]).value;
    };
    GenerateCommand.prototype.generateSpecies = function () {
        var specie = this.randomService.pickOne(data_1.species);
        return specie.value;
    };
    GenerateCommand.prototype.generateMotivations = function (type) {
        if (type === NpcType.Rival) {
            return {
                strength: this.randomService.pickOne(data_1.motivations.strength).value,
                flaw: this.randomService.pickOne(data_1.motivations.flaw).value
            };
        }
        return {
            desires: this.randomService.pickOne(data_1.motivations.desires).value,
            fear: this.randomService.pickOne(data_1.motivations.fear).value,
            strength: this.randomService.pickOne(data_1.motivations.strength).value,
            flaw: this.randomService.pickOne(data_1.motivations.flaw).value
        };
    };
    GenerateCommand.prototype.generatePersonality = function () {
        return this.randomService.pickOne(data_1.personalityTraits).value;
    };
    GenerateCommand.prototype.withSeed = function (initialSeed, value) {
        return { value: value, initialSeed: initialSeed };
    };
    GenerateCommand.prototype.generateRank = function (corpRanks, range) {
        var rndRanks = corpRanks;
        if (range !== undefined) {
            rndRanks = rndRanks.filter(function (x) { return x.level >= range.minLevel && x.level <= range.maxLevel; });
        }
        if (rndRanks.length === 0) {
            return this.generateRank(corpRanks);
        }
        return this.randomService.pickOne(rndRanks).value;
    };
    GenerateCommand.prototype.getTypeBasedOnRank = function (rank) {
        var findSteps = data_1.ranks[rank.clan].steps;
        var mid = Math.ceil(findSteps.length / 2);
        var step = findSteps[mid];
        var threshold = step[0];
        return rank.level > threshold ? NpcType.Nemesis : NpcType.Rival;
    };
    GenerateCommand.prototype.help = function (commandArgs) {
        var countOption = {
            command: '-count [some number]',
            description: 'Generate the specified number of result.'
        };
        var seedOption = {
            command: '-seed [some random seed]',
            description: 'Use the specified seed to generate the specified item. This can be used to replay random generation.'
        };
        var wisperOption = {
            command: '-whisper',
            alias: '-w',
            description: 'The bot will whisper you the results instead of relying in the current channel.'
        };
        var helpObject = {
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
                            command: '[contract|theme|location|macguffin|victimsAndNPCs|antagonistOrTarget|twistsOrComplications|dramaticReveal]',
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
                    command: 'motivation',
                    description: 'Generate a character motivation.',
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
                    options: [
                        countOption,
                        // {
                        //     command:
                        //         '-corp [navy|army|intelligence|COMPORN|governance|ancillary|appointments]',
                        //     description:
                        //         'Use a particular rank collectino to generate the rank in.'
                        // },
                        seedOption
                    ]
                },
                {
                    command: 'species',
                    description: 'Generate a species.',
                    options: [countOption, seedOption]
                },
                {
                    command: 'default',
                    description: 'Generate a default Jekyll formatted default values for NPCs.',
                    options: [seedOption]
                }
            ]
        };
        // Some sub-command filter; this should be extracted in some sort of sub-command (along with the sub-command themselves).
        if (commandArgs.args.length > 0) {
            var firsArg = commandArgs.args[0];
            for (var i = 0; i < helpObject.subcommands.length; i++) {
                var element = helpObject.subcommands[i];
                if (element.command === firsArg) {
                    helpObject.subcommands = [element];
                    break;
                }
            }
        }
        return helpObject;
    };
    return GenerateCommand;
}(ChatCommandBase_1.ChatCommandBase));
exports.GenerateCommand = GenerateCommand;
var NpcType;
(function (NpcType) {
    NpcType["Nemesis"] = "NEMESIS";
    NpcType["Rival"] = "RIVAL";
    NpcType["Minion"] = "MINION";
})(NpcType || (NpcType = {}));
//# sourceMappingURL=generate-command.js.map