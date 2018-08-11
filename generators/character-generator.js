"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var random_js_1 = require("random-js");
var data_1 = require("./data");
var CharacterGenerator = /** @class */ (function () {
    function CharacterGenerator(randomEngine) {
        if (randomEngine === void 0) { randomEngine = random_js_1.engines.mt19937(); }
        this.randomEngine = randomEngine;
        this.seed = Math.floor(Math.random() * Math.floor(5000));
    }
    CharacterGenerator.prototype.generate = function () {
        return {
            personality: this.pickAString(data_1.personalityTraits),
            motivation: {
                desires: this.pickAnObject(data_1.motivations.desires),
                fear: this.pickAnObject(data_1.motivations.fear),
                strength: this.pickAnObject(data_1.motivations.strength),
                flaw: this.pickAnObject(data_1.motivations.flaw)
            }
        };
    };
    CharacterGenerator.prototype.pickAString = function (values) {
        return values[this.getRandomInt(values.length)];
    };
    CharacterGenerator.prototype.pickAnObject = function (values) {
        return values[this.getRandomInt(values.length)];
    };
    CharacterGenerator.prototype.getRandomInt = function (max) {
        this.randomEngine.seed(this.seed++);
        var distribution = random_js_1.integer(0, max);
        return distribution(this.randomEngine);
    };
    return CharacterGenerator;
}());
exports.CharacterGenerator = CharacterGenerator;
//# sourceMappingURL=character-generator.js.map