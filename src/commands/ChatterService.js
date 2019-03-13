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
exports.defaultChatterOptions = {
    indent: 2,
    threshold: 1900,
    splitMessages: true,
    mergeWith: function (obj) {
        return Object.assign({}, this, obj);
    }
};
var ChatterService = /** @class */ (function () {
    function ChatterService(options) {
        if (options === void 0) { options = exports.defaultChatterOptions; }
        this.options = options;
    }
    ChatterService.prototype.send = function (objectToSend, whisper, message) {
        return __awaiter(this, void 0, void 0, function () {
            var json, blockCount, i, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = JSON.stringify(objectToSend, null, this.options.indent);
                        if (!this.options.splitMessages) return [3 /*break*/, 5];
                        blockCount = Math.ceil(json.length / this.options.threshold);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < blockCount)) return [3 /*break*/, 4];
                        block = json.substring(i * this.options.threshold, (i + 1) * this.options.threshold);
                        return [4 /*yield*/, this.sendToDiscord(block, whisper, message)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5: 
                    // Just send the message (probably from the web UI)
                    return [4 /*yield*/, this.sendToDiscord(json, whisper, message)];
                    case 6:
                        // Just send the message (probably from the web UI)
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChatterService.prototype.sendToDiscord = function (json, whisper, message) {
        return __awaiter(this, void 0, void 0, function () {
            var chatToSend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chatToSend = "```json\n" + json + "\n```";
                        if (!whisper) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.author.createDM().then(function (c) {
                                c.send(chatToSend);
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, message.reply(chatToSend)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ChatterService;
}());
exports.ChatterService = ChatterService;
//# sourceMappingURL=ChatterService.js.map