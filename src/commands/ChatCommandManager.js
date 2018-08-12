"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generate_command_1 = require("./generate-command");
var ChatCommandManager = /** @class */ (function () {
    function ChatCommandManager() {
        this.trigger = 'ogbot';
        this.commands = new Array(new generate_command_1.GenerateCommand(), 
        //
        // Default (echo help)
        new DefaultChatCommand(this.echoHelp));
    }
    ChatCommandManager.prototype.Handle = function (message) {
        var args = message.content.substring(1).split(' ');
        if (args.length == 0) {
            return;
        }
        if (args.length == 1) {
            if (args[0] === this.trigger) {
                this.echoHelp(message);
            }
            return;
        }
        var commandArgs = {
            trigger: args[0].toLowerCase(),
            command: args[1].toLowerCase(),
            arguments: args.splice(2)
        };
        if (commandArgs.trigger !== this.trigger) {
            this.echoHelp(message);
            return;
        }
        for (var i = 0; i < this.commands.length; i++) {
            var command = this.commands[i];
            if (command.canHandle(commandArgs)) {
                command.handle(message, commandArgs);
                break;
            }
        }
    };
    ChatCommandManager.prototype.echoHelp = function (message) {
        message.reply("Something went wrong; I may add some help some day... Stay tuned lol (or don't be wrong)");
    };
    return ChatCommandManager;
}());
exports.ChatCommandManager = ChatCommandManager;
var DefaultChatCommand = /** @class */ (function () {
    function DefaultChatCommand(callback) {
        this.callback = callback;
    }
    DefaultChatCommand.prototype.handle = function (message, commandArgs) {
        this.callback(message);
    };
    DefaultChatCommand.prototype.canHandle = function (commandArgs) {
        return true;
    };
    DefaultChatCommand.prototype.help = function () {
        return {
            command: 'anything',
            description: 'Show the current help text.'
        };
    };
    return DefaultChatCommand;
}());
//# sourceMappingURL=ChatCommandManager.js.map