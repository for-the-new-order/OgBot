"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var random_js_1 = require("random-js");
var RandomService = /** @class */ (function () {
    function RandomService() {
        this.randomEngine = random_js_1.engines.mt19937();
        this.reseed();
    }
    RandomService.prototype.pickOne = function (values) {
        var rnd = this.getRandomInt(0, values.length - 1);
        return {
            seed: rnd.seed,
            value: values[rnd.value]
        };
    };
    RandomService.prototype.getRandomInt = function (min, max) {
        var seed = this.seed++;
        this.randomEngine.seed(seed);
        var distribution = random_js_1.integer(min, max);
        return {
            seed: seed,
            value: distribution(this.randomEngine)
        };
    };
    Object.defineProperty(RandomService.prototype, "seed", {
        get: function () {
            return this._seed;
        },
        set: function (value) {
            this._seed = value;
        },
        enumerable: true,
        configurable: true
    });
    RandomService.prototype.reseed = function () {
        this.seed = Math.floor(Math.random() * Math.floor(500000));
    };
    return RandomService;
}());
exports.RandomService = RandomService;
//# sourceMappingURL=random-service.js.map