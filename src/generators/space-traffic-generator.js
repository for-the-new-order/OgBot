"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpaceshipGenerator_1 = require("../CentralCasting/SpaceshipGenerator");
var SpaceTrafficGenerator = /** @class */ (function () {
    function SpaceTrafficGenerator(randomService) {
        this.randomService = randomService;
        this.spaceshipGenerator = new SpaceshipGenerator_1.SpaceshipGenerator(randomService);
    }
    SpaceTrafficGenerator.prototype.generate = function (options) {
        var amount = options.amount;
        if (amount == 0) {
            amount = this.randomService.getRandomInt(1, 5).value;
        }
        var density = this.randomService.pickOne(new Array('Light', 'Normal', 'Normal', 'Normal', 'Dense')).value;
        var result = { options: { amount: amount }, density: density, ships: new Array() };
        for (var i = 0; i < amount; i++) {
            var ship = this.spaceshipGenerator.generate();
            result.ships.push(ship);
        }
        return result;
    };
    return SpaceTrafficGenerator;
}());
exports.SpaceTrafficGenerator = SpaceTrafficGenerator;
//# sourceMappingURL=space-traffic-generator.js.map