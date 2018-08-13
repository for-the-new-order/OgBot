"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EchoHelpService = /** @class */ (function () {
    function EchoHelpService(indent) {
        if (indent === void 0) { indent = 2; }
        this.indent = indent;
    }
    EchoHelpService.prototype.echo = function (help, whisper, message) {
        var json = JSON.stringify(help, null, this.indent);
        // Split the output when needed
        var threshold = 1980;
        var blockCount = Math.ceil(json.length / threshold);
        for (var i = 0; i < blockCount; i++) {
            var block = json.substr(i * threshold, (i + 1) * threshold);
            this.send(block, whisper, message);
        }
    };
    EchoHelpService.prototype.send = function (json, whisper, message) {
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
    return EchoHelpService;
}());
exports.EchoHelpService = EchoHelpService;
//# sourceMappingURL=EchoHelpService.js.map