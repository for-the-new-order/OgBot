"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ChatCommandManager_1 = require("./src/commands/ChatCommandManager");
var express = require("express");
var path = require("path");
var discord_js_1 = require("discord.js");
var TypeMoq = require("typemoq");
var ChatterService_1 = require("./src/commands/ChatterService");
var EchoHelpService_1 = require("./src/commands/EchoHelpService");
var chatterOptions = ChatterService_1.defaultChatterOptions.mergeWith({ splitMessages: false });
var chatterService = new ChatterService_1.ChatterService(chatterOptions);
var echoHelpService = new EchoHelpService_1.EchoHelpService(new ChatterService_1.ChatterService(ChatterService_1.defaultChatterOptions.mergeWith({ splitMessages: false, outputType: ChatterService_1.OutputType.YAML })));
var chatCommandManager = new ChatCommandManager_1.ChatCommandManager(chatterService, echoHelpService);
var app = express();
app.use(express.urlencoded());
var listener = app.listen(8888, function () {
    console.log('Listening on port ' + listener.address().port);
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/command', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var chatCommand, output, messageMock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatCommand = req.body.chatCommand;
                    output = '';
                    messageMock = MakeMessage(chatCommand, function (chat) { return (output += chat); });
                    return [4 /*yield*/, chatCommandManager.Handle(messageMock.object)];
                case 1:
                    _a.sent();
                    output = cleanMarkdownCodeBreak(output, ChatterService_1.OutputType.JSON);
                    output = cleanMarkdownCodeBreak(output, ChatterService_1.OutputType.YAML);
                    res.send(output);
                    return [2 /*return*/];
            }
        });
    });
});
function cleanMarkdownCodeBreak(output, type) {
    var lineFeed = '\n';
    var spacerString = lineFeed + '``````' + type.toLowerCase() + lineFeed;
    do {
        output = output.replace(spacerString, '');
    } while (output.indexOf(spacerString) > -1);
    return output;
}
function MakeMessage(chatCommand, callback) {
    var messageMock = TypeMoq.Mock.ofType(discord_js_1.Message);
    var userMock = TypeMoq.Mock.ofType(discord_js_1.User);
    messageMock
        .setup(function (message) { return message.reply(TypeMoq.It.isAnyString()); })
        .callback(callback)
        .returns(function (message) { return Promise.resolve(message); });
    messageMock.object.author = userMock.object;
    messageMock.object.content = chatCommand;
    userMock.object.bot = false;
    return messageMock;
}
//# sourceMappingURL=index.js.map