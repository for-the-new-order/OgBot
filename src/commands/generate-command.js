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
var random_service_1 = require("../generators/random-service");
var alien_names_generator_1 = require("../generators/alien-names-generator");
var name_generator_1 = require("../generators/name-generator");
var format_utility_1 = require("../generators/format-utility");
var data_1 = require("../../data");
var EchoHelpService_1 = require("./EchoHelpService");
var GenerateCommand = /** @class */ (function (_super) {
    __extends(GenerateCommand, _super);
    function GenerateCommand() {
        var _this = _super.call(this) || this;
        _this.supportedCommands = ['generate', 'gen', 'g'];
        _this.alienNamesGenerator = new alien_names_generator_1.AlienNamesGenerator(new format_utility_1.FormatUtility());
        _this.echoHelpService = new EchoHelpService_1.EchoHelpService();
        _this.randomService = new random_service_1.RandomService();
        _this.nameGenerator = new name_generator_1.NameGenerator(_this.randomService);
        _this.formatUtility = new format_utility_1.FormatUtility();
        _this.alienNamesGenerator = new alien_names_generator_1.AlienNamesGenerator(_this.formatUtility);
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
        var whisper = commandArgs.argumentExists('whisper') ||
            commandArgs.argumentExists('w');
        var json = '';
        var indent = 2;
        var messageSent = false;
        switch (subCommand) {
            case 'name':
                var names = [];
                for (var i = 0; i < count; i++) {
                    names.push(this.generateName());
                }
                json = JSON.stringify(this.withSeed(initialSeed, names), null, indent);
                break;
            case 'alienname':
                var names = [];
                for (var i = 0; i < count; i++) {
                    names.push(this.generateAlienName());
                }
                json = JSON.stringify(names, null, indent);
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
            case 'help':
                var help = this.help();
                this.echoHelpService.echo(help, whisper, message);
                messageSent = true;
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
                    clan: this.formatUtility.capitalize(rank.clan),
                    personality: this.generatePersonality(),
                    motivation: this.generateMotivation()
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
    GenerateCommand.prototype.generateName = function () {
        var name = this.nameGenerator.firstname();
        name += ' ';
        name += this.nameGenerator.surname();
        return name;
    };
    GenerateCommand.prototype.generateAlienName = function () {
        return this.alienNamesGenerator.generate();
    };
    GenerateCommand.prototype.generateAnyName = function () {
        var isAlien = this.randomService.getRandomInt(0, 20).value == 20;
        return {
            isAlien: isAlien,
            name: isAlien
                ? this.alienNamesGenerator.generate()
                : this.generateName(),
            species: isAlien ? this.generateSpecies() : { name: 'Human' }
        };
    };
    GenerateCommand.prototype.generateSpecies = function () {
        var specie = this.randomService.pickOne(data_1.species);
        return specie.value;
    };
    GenerateCommand.prototype.generateMotivation = function () {
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
        return rank.level > threshold ? 'NEMESIS' : 'RIVAL';
    };
    GenerateCommand.prototype.help = function () {
        var countOption = {
            syntax: '-count [some number]',
            description: 'Generate the specified number of result.'
        };
        var seedOption = {
            syntax: '-seed [some random seed]',
            description: 'Use the specified seed to generate the specified item. This can be used to replay random generation.'
        };
        var wisperOption = {
            syntax: '-whisper',
            alias: '-w',
            description: 'The bot will whisper you the results instead of relying in the current channel.'
        };
        return {
            command: this.supportedCommands[0],
            alias: this.supportedCommands.slice(1).join(', '),
            description: 'Generate random stuff; by default a character.',
            options: [wisperOption],
            args: [
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
    };
    return GenerateCommand;
}(ChatCommandBase_1.ChatCommandBase));
exports.GenerateCommand = GenerateCommand;
//# sourceMappingURL=generate-command.js.map