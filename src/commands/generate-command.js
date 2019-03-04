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
var star_wars_adventure_generator_1 = require("../generators/star-wars-adventure-generator");
var imperial_mission_generator_1 = require("../generators/imperial-mission-generator");
var GenerateCommand = /** @class */ (function (_super) {
    __extends(GenerateCommand, _super);
    function GenerateCommand() {
        var _this = _super.call(this) || this;
        _this.supportedCommands = ['generate', 'gen', 'g'];
        _this.baseName = '';
        _this.baseNameAction = function () { return _this.baseName; };
        _this.randomService = new random_service_1.RandomService();
        _this.nameGenerator = new name_generator_1.NameGenerator(_this.randomService);
        _this.formatUtility = new format_utility_1.FormatUtility();
        _this.alienNamesGenerator = new alien_names_generator_1.AlienNamesGenerator(_this.formatUtility);
        _this.starWarsAdventureGenerator = new star_wars_adventure_generator_1.StarWarsAdventureGenerator(_this.randomService);
        _this.imperialMissionGenerator = new imperial_mission_generator_1.ImperialMissionGenerator(_this.randomService, _this.starWarsAdventureGenerator);
        _this.baseGenerator = new imperial_mission_generator_1.BaseGenerator(_this.baseNameAction, _this.randomService);
        return _this;
    }
    GenerateCommand.prototype.handle = function (message, commandArgs) {
        // Create sub-command object (this could become recursive to create a "command-tree" of sort)
        var subCommand = commandArgs.convertToSubCommand();
        // Set the random seed
        if (commandArgs.argumentExists('seed')) {
            this.randomService.seed = parseInt(commandArgs.findArgumentValue('seed'));
        }
        else {
            this.randomService.reseed();
        }
        var initialSeed = this.randomService.seed;
        // Count
        var count = 1;
        if (commandArgs.argumentExists('count')) {
            count = parseInt(commandArgs.findArgumentValue('count'));
        }
        // Whisper
        var whisper = commandArgs.argumentExists('whisper') || commandArgs.argumentExists('w');
        //
        // Apply faction/corp/rank filters
        //
        var factionName;
        if (commandArgs.argumentExists('clan')) {
            factionName = commandArgs.findArgumentValue('clan');
        }
        var corpName;
        if (commandArgs.argumentExists('corp')) {
            corpName = commandArgs.findArgumentValue('corp');
        }
        var range = {
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
        var factionRanks;
        if (factionName && data_1.ranks.hasOwnProperty(factionName)) {
            var faction = data_1.ranks[factionName];
            if (corpName && faction.hasOwnProperty(corpName)) {
                factionRanks = faction.all.filter(function (r) { return r.corp === corpName; });
            }
            else {
                factionRanks = faction.all;
            }
        }
        else {
            factionRanks = data_1.ranks.all;
        }
        if (range.hasMin && range.hasMax) {
            factionRanks = factionRanks.filter(function (r) { return r.level >= range.min && r.level <= range.max; });
        }
        else if (range.hasMin) {
            factionRanks = factionRanks.filter(function (r) { return r.level >= range.min; });
        }
        else if (range.hasMax) {
            factionRanks = factionRanks.filter(function (r) { return r.level <= range.max; });
        }
        // Gender
        var gender;
        if (commandArgs.argumentExists('gender')) {
            var tmpGender = commandArgs.findArgumentValue('gender');
            gender = tmpGender === 'f' ? name_generator_1.Gender.Female : tmpGender === 'm' ? name_generator_1.Gender.Male : name_generator_1.Gender.Unknown;
        }
        // Evaluate the command
        var json = '';
        var indent = 2;
        var messageSent = false;
        var switchCondition = subCommand ? subCommand.trigger : '';
        this.baseName = 'Base';
        switch (switchCondition) {
            case 'imperialmission':
                var mission = this.imperialMissionGenerator.generate();
                json = JSON.stringify(mission, null, indent);
                break;
            case 'imperialbase':
                this.baseName = 'Imperial Base';
                var imperialbase = this.baseGenerator.generate();
                json = JSON.stringify(imperialbase, null, indent);
                break;
            case 'rebelbase':
                this.baseName = 'Rebel Base';
                var rebelbase = this.baseGenerator.generate();
                json = JSON.stringify(rebelbase, null, indent);
                break;
            case 'base':
                if (commandArgs.argumentExists('name')) {
                    this.baseName = commandArgs.findArgumentValue('name');
                }
                var base = this.baseGenerator.generate();
                json = JSON.stringify(base, null, indent);
                break;
            case 'adventure':
                // Execute command
                var adventureElement = subCommand.command;
                if (adventureElement) {
                    var distinct = subCommand.argumentExists('distinct');
                    json = JSON.stringify(this.starWarsAdventureGenerator.generateAdventureElement(adventureElement, count, distinct), null, indent);
                }
                else if (subCommand.command) {
                    json = JSON.stringify({ error: subCommand.command + " is not a valid adventure element." }, null, indent);
                }
                else {
                    json = JSON.stringify(this.starWarsAdventureGenerator.generateAdventure(), null, indent);
                }
                break;
            case 'name':
                var names = [];
                var genderParam = gender;
                for (var i = 0; i < count; i++) {
                    if (!genderParam) {
                        gender = this.generateGender();
                    }
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
            case 'motivations':
                var motivationType = subCommand.command;
                if (!motivationType) {
                    motivationType = NpcType.Nemesis;
                }
                var motivation = this.generateMotivations(motivationType);
                json = JSON.stringify(this.withSeed(initialSeed, motivation), null, indent);
                break;
            case 'personality':
                var personalities = [];
                for (var i = 0; i < count; i++) {
                    personalities.push(this.generatePersonality());
                }
                json = JSON.stringify(this.withSeed(initialSeed, personalities), null, indent);
                break;
            case 'place':
                var places = [];
                for (var i = 0; i < count; i++) {
                    places.push(this.generatePlace());
                }
                json = JSON.stringify(this.withSeed(initialSeed, places), null, indent);
                break;
            case 'rank':
                // Generate rank(s)
                var generatedRanks = [];
                for (var i = 0; i < count; i++) {
                    generatedRanks.push(this.generateRank(factionRanks));
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
                var name_1 = this.generateAnyName(gender);
                var rank = this.generateRank(factionRanks);
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
                    corp: this.formatUtility.capitalize(rank.corp),
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
    GenerateCommand.prototype.generateAnyName = function (gender) {
        var isAlien = this.randomService.getRandomInt(0, 20).value == 20;
        if (!gender) {
            gender = this.generateGender();
        }
        if (gender === name_generator_1.Gender.Unknown) {
            isAlien = true;
        }
        if (isAlien) {
            var alienName = this.alienNamesGenerator.generate();
            return {
                isAlien: isAlien,
                name: alienName,
                species: this.generateSpecies(),
                gender: gender
            };
        }
        var humanName = this.generateName(gender);
        return {
            isAlien: isAlien,
            name: humanName.name,
            species: { name: 'Human' },
            gender: gender
        };
    };
    GenerateCommand.prototype.generateGender = function () {
        return this.randomService.pickOne([name_generator_1.Gender.Male, name_generator_1.Gender.Male, name_generator_1.Gender.Female, name_generator_1.Gender.Male]).value;
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
        if (corpRanks.length === 0) {
            return {
                level: 0,
                name: 'N/D',
                clan: 'N/D',
                corp: 'N/D'
            };
        }
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
        var allRanks = data_1.ranks[rank.clan];
        if (!allRanks) {
            return NpcType.Rival;
        }
        var findSteps = allRanks.steps;
        var mid = Math.ceil(findSteps.length / 2);
        var step = findSteps[mid];
        var threshold = step[0];
        return rank.level >= threshold ? NpcType.Nemesis : NpcType.Rival;
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
        var genderOption = {
            command: '-gender [f|m|...]',
            description: 'Generate a name based on the specified gender. Anything else than m or f will generate an alien with an unknown gender.'
        };
        var clanOption = {
            command: '-clan [empire|generic|rebels]',
            description: 'Generate the NPC based on the specified clan.',
            options: [
                {
                    command: '-corp [empire: {navy|army|compnor|appointments|ancillary|governance|intelligence}, generic: {army|navy}, rebels: {army|navy}]',
                    description: 'Generate the NPC based on the specified corp. This setting depends on the selected clan'
                }
            ]
        };
        var minOption = {
            command: '-min [number]',
            description: 'Select the minimum rank level (inclusive) for the generated NPC.'
        };
        var maxOption = {
            command: '-max [number]',
            description: 'Select the maximum rank level (inclusive) for the generated NPC.'
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
                    command: 'imperialmission',
                    description: 'Generate a Star Wars Imperial adventure.'
                },
                {
                    command: 'imperialbase',
                    description: 'Generate a Star Wars Imperial base.'
                },
                {
                    command: 'rebelbase',
                    description: 'Generate a Star Wars Rebel Alliance base.'
                },
                {
                    command: 'base',
                    description: 'Generate a generic Star Wars base.',
                    options: [
                        {
                            command: '-name [name of the base without space]',
                            description: 'The name of the generated base.'
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
    NpcType["Nemesis"] = "nemesis";
    NpcType["Rival"] = "rival";
    NpcType["Minion"] = "minion";
})(NpcType || (NpcType = {}));
//# sourceMappingURL=generate-command.js.map