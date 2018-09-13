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
var ChatCommandBase_1 = require("./ChatCommandBase");
var InfoCommand = /** @class */ (function (_super) {
    __extends(InfoCommand, _super);
    function InfoCommand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.supportedCommands = ["info"];
        return _this;
    }
    InfoCommand.prototype.handle = function (message, commandArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var i, element, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(commandArgs.args.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.reply("You must specify the message type(s).")];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, Promise.reject()];
                    case 2:
                        i = 0;
                        _b.label = 3;
                    case 3:
                        if (!(i < commandArgs.args.length)) return [3 /*break*/, 13];
                        element = commandArgs.args[i];
                        _a = element;
                        switch (_a) {
                            case "channel": return [3 /*break*/, 4];
                            case "author": return [3 /*break*/, 6];
                            case "guild": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 4: return [4 /*yield*/, this.sendChannelInfo(message)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 6: return [4 /*yield*/, this.sendAuthorInfo(message)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 8: return [4 /*yield*/, this.sendGuildInfo(message)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, message.reply("Unknown info type: **" + element + "**. Supported types: `channel`, `author` and `guild`.")];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        i++;
                        return [3 /*break*/, 3];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    InfoCommand.prototype.help = function () {
        return {
            command: this.supportedCommands[0],
            description: "Get some information.",
            options: [{
                    syntax: "[information types]",
                    description: "The type of information that you want (channel, author, guild). You can pass more than one by separating types by a space, ex.: `!og info channel guild`"
                }]
            // ,
            // args: [{
            //     syntax: "-purge",
            //     description: "By using this switch, you will delete and recrete the channel. This is useful to purse older than 14 days messages."
            // }]
        };
    };
    InfoCommand.prototype.sendGuildInfo = function (message) {
        return message.channel.send("Guild (Server): **" + message.guild.name + "** (ID: " + message.guild.id + ")");
    };
    InfoCommand.prototype.sendChannelInfo = function (message) {
        var channel = message.channel;
        return message.channel.send("Channel: **" + channel.name + "** (ID: " + channel.id + ")");
    };
    InfoCommand.prototype.sendAuthorInfo = function (message) {
        return message.channel.send("Author: **" + message.author + "** (ID: " + message.author.id + ")");
    };
    return InfoCommand;
}(ChatCommandBase_1.ChatCommandBase));
exports.InfoCommand = InfoCommand;
//# sourceMappingURL=info-command.js.map