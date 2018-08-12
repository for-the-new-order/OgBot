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
    return CommandArgs;
}());
exports.CommandArgs = CommandArgs;
//# sourceMappingURL=CommandArgs.js.map