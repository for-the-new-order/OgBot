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
var character_generator_1 = require("../generators/character-generator");
var GenerateCommand = /** @class */ (function (_super) {
    __extends(GenerateCommand, _super);
    function GenerateCommand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.supportedCommands = ['generate', 'gen', 'g'];
        _this.characterGenerator = new character_generator_1.CharacterGenerator();
        return _this;
    }
    GenerateCommand.prototype.handle = function (message, commandArgs) {
        var subCommand = null;
        if (commandArgs.arguments.length > 0) {
            subCommand = commandArgs.arguments[0];
        }
        // Custom seed
        var seedArgIndex = commandArgs.arguments.indexOf('-seed');
        var providedSeed = null;
        if (seedArgIndex > -1) {
            providedSeed = parseInt(commandArgs.arguments[seedArgIndex + 1]);
        }
        var result = this.characterGenerator.generate(providedSeed);
        var json = '';
        var indent = 4;
        switch (subCommand) {
            case 'name':
                json = JSON.stringify(this.withSeed(result.initialSeed, result.names), null, indent);
                break;
            case 'motivation':
                json = JSON.stringify(this.withSeed(result.initialSeed, result.motivation), null, indent);
                break;
            case 'personality':
                json = JSON.stringify(this.withSeed(result.initialSeed, result.personality), null, indent);
                break;
            case 'place':
                json = JSON.stringify(this.withSeed(result.initialSeed, result.places), null, indent);
                break;
            default:
                json = JSON.stringify(result, null, indent);
                break;
        }
        message.author.createDM().then(function (c) {
            c.send("```json\n" + json + "\n```");
        });
        if (message.deletable) {
            message.delete();
        }
    };
    GenerateCommand.prototype.withSeed = function (initialSeed, value) {
        return {
            initialSeed: initialSeed,
            value: value
        };
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
                    syntax: 'name',
                    description: 'Generate some names.'
                },
                {
                    syntax: 'place',
                    description: 'Generate some names.'
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