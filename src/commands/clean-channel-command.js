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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var CleanChannelCommand = /** @class */ (function (_super) {
    __extends(CleanChannelCommand, _super);
    function CleanChannelCommand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.supportedCommands = ['clean'];
        return _this;
    }
    CleanChannelCommand.prototype.handle = function (message, commandArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, expectedChannelId, permissionOverwrites, newChannel, fourteenDaysAgo, messages, deletableMessages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(commandArgs.args.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.reply('You must specify the current channel ID.')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        channel = message.channel;
                        expectedChannelId = commandArgs.args[0];
                        if (!(channel.id !== expectedChannelId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, message.reply('The specified channel ID is not the same as the current channel ID.')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        if (!commandArgs.argumentExists('purge')) return [3 /*break*/, 10];
                        permissionOverwrites = channel.permissionOverwrites.array();
                        return [4 /*yield*/, message.guild.createChannel(channel.name, 'text', permissionOverwrites)];
                    case 5:
                        newChannel = (_a.sent());
                        return [4 /*yield*/, newChannel.setParent(channel.parent)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, newChannel.setPosition(channel.position)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, channel.delete('OgBot Chat Purge')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, newChannel.send("Channel " + newChannel.id + " created to replace deleted channel " + channel.id + ".")];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                    case 10:
                        fourteenDaysAgo = new Date();
                        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
                        _a.label = 11;
                    case 11: return [4 /*yield*/, channel.fetchMessages()];
                    case 12:
                        messages = _a.sent();
                        deletableMessages = messages.filter(function (x) { return x.deletable && x.createdAt > fourteenDaysAgo; });
                        return [4 /*yield*/, channel.bulkDelete(deletableMessages)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        if (deletableMessages.size > 0) return [3 /*break*/, 11];
                        _a.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    CleanChannelCommand.prototype.help = function () {
        return {
            command: this.supportedCommands[0],
            description: 'Delete all messages of the specified channel (14 days old max). Use with caution.',
            options: [
                {
                    command: '[Channel ID]',
                    description: 'The channel ID that you are in and that you want to clean.'
                }
            ],
            subcommands: [
                {
                    command: '-purge',
                    description: 'By using this switch, you will delete and recrete the channel. This is useful to purse older than 14 days messages.'
                }
            ]
        };
    };
    return CleanChannelCommand;
}(ChatCommandBase_1.ChatCommandBase));
exports.CleanChannelCommand = CleanChannelCommand;
//# sourceMappingURL=clean-channel-command.js.map