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
var GenerateCommand = /** @class */ (function (_super) {
    __extends(GenerateCommand, _super);
    function GenerateCommand() {
        var _this = _super.call(this) || this;
        _this.supportedCommands = ['generate', 'gen', 'g'];
        _this.alienNamesGenerator = new alien_names_generator_1.AlienNamesGenerator(new format_utility_1.FormatUtility());
        _this.randomService = new random_service_1.RandomService();
        _this.nameGenerator = new name_generator_1.NameGenerator(_this.randomService);
        return _this;
    }
    GenerateCommand.prototype.handle = function (message, commandArgs) {
        var subCommand = null;
        if (commandArgs.args.length > 0) {
            subCommand = commandArgs.args[0];
        }
        // Custom seed
        if (commandArgs.argumentExists('seed')) {
            this.randomService.seed = parseInt(commandArgs.findArgumentValue('seed'));
        }
        var initialSeed = this.randomService.seed;
        // count
        var count = 1;
        if (commandArgs.argumentExists('count')) {
            count = parseInt(commandArgs.findArgumentValue('count'));
        }
        //const result = this.characterGenerator.generate(providedSeed);
        var json = '';
        var indent = 4;
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
                json = JSON.stringify(this.withSeed(initialSeed, names), null, indent);
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
            default:
                json = JSON.stringify({
                    initialSeed: initialSeed,
                    name: this.generateAnyName(),
                    personality: this.generatePersonality(),
                    motivation: this.generateMotivation()
                }, null, indent);
                break;
        }
        message.author.createDM().then(function (c) {
            c.send("```json\n" + json + "\n```");
        });
        if (message.deletable) {
            message.delete();
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
        var isAlien = this.randomService.pickOne([true, false]);
        return isAlien.value
            ? this.alienNamesGenerator.generate()
            : this.generateName();
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
        this.randomService.pickOne(data_1.personalityTraits).value;
    };
    GenerateCommand.prototype.withSeed = function (initialSeed, value) {
        //return Object.assign(value, initialSeed);
        return { value: value, initialSeed: initialSeed };
    };
    GenerateCommand.prototype.help = function () {
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
                    description: 'Generate some alien names. Support the -count argument.'
                },
                {
                    syntax: 'name',
                    description: 'Generate some names. Support the -count argument.'
                },
                {
                    syntax: 'place',
                    description: 'Generate a place name. Support the -count argument.'
                },
                {
                    syntax: 'personality',
                    description: 'Generate a personality.'
                }
            ]
        };
    };
    return GenerateCommand;
}(ChatCommandBase_1.ChatCommandBase));
exports.GenerateCommand = GenerateCommand;
//# sourceMappingURL=generate-command.js.map