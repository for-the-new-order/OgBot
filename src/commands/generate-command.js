"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ChatCommandBase_1 = require("./ChatCommandBase");
var random_service_1 = require("../generators/random-service");
var alien_names_generator_1 = require("../generators/alien-names-generator");
var name_generator_1 = require("../generators/name-generator");
var format_utility_1 = require("../generators/format-utility");
var data_1 = require("../../data");
var star_wars_adventure_generator_1 = require("../generators/star-wars-adventure-generator");
var imperial_mission_generator_1 = require("../generators/imperial-mission-generator");
var space_traffic_generator_1 = require("../generators/space-traffic-generator");
var ChatterService_1 = require("./ChatterService");
var AlignmentAndAttitudeGenerator_1 = require("../CentralCasting/AlignmentAndAttitudeGenerator");
var CentralCastingHeroesForTomorrowHub_1 = require("../CentralCasting/CentralCastingHeroesForTomorrowHub");
var util_1 = require("util");
var ugly_spaceship_generator_1 = require("../generators/ugly-spaceship-generator");
var GenerateCommand = /** @class */ (function (_super) {
    __extends(GenerateCommand, _super);
    function GenerateCommand(chatterService) {
        var _this = _super.call(this) || this;
        _this.chatterService = chatterService;
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
        _this.spaceTrafficGenerator = new space_traffic_generator_1.SpaceTrafficGenerator(_this.randomService);
        _this.centralCastingHub = CentralCastingHeroesForTomorrowHub_1.CentralCastingFactory.createHub(_this.randomService);
        _this.uglySpaceshipGenerator = new ugly_spaceship_generator_1.UglySpaceshipGenerator(_this.randomService);
        return _this;
    }
    GenerateCommand.prototype.handle = function (message, commandArgs) {
        var _this = this;
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
        // Output type
        var outputType = this.chatterService.options.outputType;
        if (commandArgs.argumentExists('output')) {
            var tmpOutput = commandArgs.findArgumentValue('output');
            outputType = tmpOutput === ChatterService_1.OutputType.YAML ? ChatterService_1.OutputType.YAML : tmpOutput === ChatterService_1.OutputType.JSON ? ChatterService_1.OutputType.JSON : outputType;
        }
        var chatterOptions = this.chatterService.options.mergeWith({ outputType: outputType });
        var sendChat = function (objectToSend) {
            var objectToSendWithSeed = _this.withSeed(initialSeed, objectToSend);
            _this.chatterService.send(objectToSendWithSeed, whisper, message, chatterOptions);
        };
        // Evaluate the command
        var switchCondition = subCommand ? subCommand.trigger : '';
        this.baseName = 'Base';
        switch (switchCondition) {
            case 'uglyspaceship':
                var vehicleOutput = {};
                for (var i = 0; i < count; i++) {
                    var vehicle = this.uglySpaceshipGenerator.generate();
                    var vehicleObject = (vehicleOutput[vehicle.name] = {});
                    delete vehicle.name;
                    Object.assign(vehicleObject, vehicle);
                }
                sendChat(vehicleOutput);
                break;
            case 'alignmentandattitude':
            case 'personality2':
            case '312':
                var personalityOptions = Object.assign(new AlignmentAndAttitudeGenerator_1.PersonalityOptions(), {
                    randomPersonalityTrait: count
                });
                if (subCommand.argumentExists('threshold')) {
                    personalityOptions.alignmentThreshold = parseFloat(subCommand.findArgumentValue('threshold'));
                    personalityOptions.alignmentThreshold = isNaN(personalityOptions.alignmentThreshold)
                        ? 0
                        : personalityOptions.alignmentThreshold;
                }
                if (subCommand.argumentExists('alignment')) {
                    var allowed = [
                        AlignmentAndAttitudeGenerator_1.PersonalityAlignmentType.Lightside,
                        AlignmentAndAttitudeGenerator_1.PersonalityAlignmentType.Neutral,
                        AlignmentAndAttitudeGenerator_1.PersonalityAlignmentType.Darkside
                    ];
                    var alignment = subCommand.findArgumentValue('alignment');
                    if (allowed.indexOf(alignment) > -1) {
                        personalityOptions.expectedAlignment = alignment;
                    }
                }
                var personality = this.centralCastingHub.alignmentAndAttitude.generate(personalityOptions);
                sendChat(personality);
                break;
            case 'spacecraft':
            case '866':
            case 'spaceship':
                var ship = this.centralCastingHub.spaceship.generate();
                sendChat(ship);
                break;
            case 'spacetraffic':
                var traffic = this.spaceTrafficGenerator.generate({ amount: count });
                sendChat(traffic);
                break;
            case 'imperialmission':
                var mission = this.imperialMissionGenerator.generate();
                sendChat(mission);
                break;
            case 'imperialbase':
                this.baseName = 'Imperial Base';
                var imperialbase = this.baseGenerator.generate();
                sendChat(imperialbase);
                break;
            case 'rebelbase':
                this.baseName = 'Rebel Base';
                var rebelbase = this.baseGenerator.generate();
                sendChat(rebelbase);
                break;
            case 'base':
                if (commandArgs.argumentExists('name')) {
                    this.baseName = commandArgs.findArgumentValue('name');
                }
                var base = this.baseGenerator.generate();
                sendChat(base);
                break;
            case 'adventure':
                // Execute command
                var adventureElement = subCommand.command;
                if (adventureElement) {
                    var distinct = subCommand.argumentExists('distinct');
                    var result = this.starWarsAdventureGenerator.generateAdventureElement(adventureElement, count, distinct);
                    sendChat(result);
                }
                else if (subCommand.command) {
                    sendChat({ error: subCommand.command + " is not a valid adventure element." });
                }
                else {
                    var result = this.starWarsAdventureGenerator.generateAdventure();
                    sendChat(result);
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
                sendChat(names);
                break;
            case 'droidname':
                var droidNames = [];
                for (var i = 0; i < count; i++) {
                    droidNames.push(this.nameGenerator.droid());
                }
                sendChat(droidNames);
                break;
            case 'alienname':
                var aliennames = [];
                for (var i = 0; i < count; i++) {
                    aliennames.push(this.generateAlienName());
                }
                sendChat(aliennames);
                break;
            case 'motivations':
                var motivationType = subCommand.command;
                if (!motivationType) {
                    motivationType = NpcType.Nemesis;
                }
                var motivation = this.generateMotivations(motivationType);
                sendChat(motivation);
                break;
            case 'personality':
                var personalities = [];
                for (var i = 0; i < count; i++) {
                    personalities.push(this.generatePersonality());
                }
                sendChat(personalities);
                break;
            case 'place':
                var places = [];
                for (var i = 0; i < count; i++) {
                    places.push(this.generatePlace());
                }
                sendChat(places);
                break;
            case 'rank':
                // Generate rank(s)
                var generatedRanks = [];
                for (var i = 0; i < count; i++) {
                    generatedRanks.push(this.generateRank(factionRanks));
                }
                sendChat(generatedRanks);
                break;
            case 'default':
                sendChat(this.defaultValues);
                break;
            case 'species':
                var species_1 = [];
                for (var i = 0; i < count; i++) {
                    species_1.push(this.generateSpecies());
                }
                sendChat(species_1);
                break;
            default:
                var name_1 = this.generateAnyName(gender);
                var rank = this.generateRank(factionRanks);
                var type = this.getTypeBasedOnRank(rank);
                var obj = {};
                var character = (obj[name_1.name] = {});
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
        if (util_1.isArray(value)) {
            return { values: value, initialSeed: initialSeed };
        }
        else {
            return __assign(__assign({}, value), { initialSeed: initialSeed });
        }
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
        var outputOption = {
            command: '-output [JSON|YAML]',
            description: 'The selected output type (default: YAML)'
        };
        var helpObject = {
            command: this.supportedCommands[0],
            alias: this.supportedCommands.slice(1).join(', '),
            description: 'Generate random stuff; by default a character.',
            options: [wisperOption, outputOption],
            subcommands: [
                {
                    command: 'uglyspaceship',
                    description: 'Generate a spaceship that is composed from 2 or 3 other spaceships.',
                    options: [countOption]
                },
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
                    command: 'alignmentandattitude',
                    alias: '312, personality2',
                    description: 'Generate a character personality, alignment and attitude. The number of random traits are defined by the count option (default: 1).',
                    options: [
                        countOption,
                        {
                            command: '-threshold [some number]',
                            description: 'Change the alignment threshold needed to tell if a character is good, neutral or evil (default: 2).'
                        },
                        {
                            command: '-alignment [Lightside|Neutral|Darkside]',
                            description: 'Generate a personality of the specified alignment.'
                        }
                    ]
                },
                {
                    command: 'spacecraft',
                    alias: '866, spaceship',
                    description: 'Generate a spacecraft.'
                },
                {
                    command: 'spacetraffic',
                    description: 'Generate space traffic; the amount of ship generated is defined by the count option (default: 1).',
                    options: [countOption]
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
                    command: 'droidname',
                    description: 'Generate some droid names.',
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
                    options: [countOption, seedOption]
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