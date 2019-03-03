"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RandomStringSelectionService = /** @class */ (function () {
    function RandomStringSelectionService(randomService, choices) {
        this.randomService = randomService;
        this.choices = choices;
    }
    RandomStringSelectionService.prototype.select = function (amount) {
        if (amount === void 0) { amount = 1; }
        var results = new Array();
        for (var i = 0; i < amount; i++) {
            var randomChoice = this.randomService.pickOne(this.choices).value;
            if (this.isReroll(randomChoice)) {
                var rerollAmount = this.parseReroll(randomChoice);
                var combinedSelection = this.select(rerollAmount);
                results = results.concat(combinedSelection);
                continue;
            }
            results.push(randomChoice);
        }
        return results;
    };
    RandomStringSelectionService.prototype.isReroll = function (value) {
        return value.startsWith('/reroll');
    };
    RandomStringSelectionService.prototype.parseReroll = function (value) {
        try {
            return parseInt(value.replace('/reroll ', ''));
        }
        catch (error) {
            return 1;
        }
    };
    return RandomStringSelectionService;
}());
exports.RandomStringSelectionService = RandomStringSelectionService;
//# sourceMappingURL=RandomSelectionService.js.map