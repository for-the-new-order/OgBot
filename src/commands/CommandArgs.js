"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandArgs = /** @class */ (function () {
    function CommandArgs(trigger, command, args) {
        this.trigger = trigger;
        this.command = command;
        this.args = args;
    }
    CommandArgs.prototype.findArgumentValue = function (name) {
        if (!this.argumentExists(name)) {
            return null;
        }
        var seedArgIndex = this.findArgumentIndex(name);
        return this.args[seedArgIndex + 1];
    };
    CommandArgs.prototype.argumentExists = function (name) {
        return this.findArgumentIndex(name) > -1;
    };
    CommandArgs.prototype.findArgumentIndex = function (name) {
        var seedArgIndex = this.args.indexOf('-' + name);
        return seedArgIndex;
    };
    CommandArgs.prototype.convertToSubCommand = function () {
        if (this.args.length === 0) {
            return null;
        }
        var trigger = this.args[0].toLowerCase();
        if (trigger.startsWith('-')) {
            return null;
        }
        var command = this.args.length > 1 ? this.args[1] : '';
        var sliceIndex = 2;
        // Avoid splitted options
        if (command.startsWith('-')) {
            sliceIndex = 1;
            command = '';
        }
        var args = this.args.slice(sliceIndex);
        return new CommandArgs(trigger, command, args);
    };
    return CommandArgs;
}());
exports.CommandArgs = CommandArgs;
//# sourceMappingURL=CommandArgs.js.map