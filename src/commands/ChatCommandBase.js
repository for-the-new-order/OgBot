"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatCommandBase = /** @class */ (function () {
    function ChatCommandBase() {
    }
    ChatCommandBase.prototype.canHandle = function (commandArgs) {
        return this.supportedCommands.indexOf(commandArgs.command) > -1;
    };
    return ChatCommandBase;
}());
exports.ChatCommandBase = ChatCommandBase;
//# sourceMappingURL=ChatCommandBase.js.map