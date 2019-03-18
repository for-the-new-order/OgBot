"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpaceshipGenerator_1 = require("./SpaceshipGenerator");
var random_service_1 = require("../generators/random-service");
var AlignmentAndAttitudeGenerator_1 = require("./AlignmentAndAttitudeGenerator");
var CentralCastingHeroesForTomorrowHub = /** @class */ (function () {
    /**
     * Create a Central Casting Heroes For Tomorrow Service Hub
     */
    function CentralCastingHeroesForTomorrowHub(_spaceship, _alignmentAndAttitude) {
        this._spaceship = _spaceship;
        this._alignmentAndAttitude = _alignmentAndAttitude;
    }
    Object.defineProperty(CentralCastingHeroesForTomorrowHub.prototype, "spaceship", {
        /**
         * Gets the 866 Spacecraft generator.
         *
         * @readonly
         * @type {SpaceshipGenerator}
         * @memberof CentralCastingHeroesForTomorrowHub
         */
        get: function () {
            return this._spaceship;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CentralCastingHeroesForTomorrowHub.prototype, "alignmentAndAttitude", {
        /**
         * Gets the 312 Alignment & Attitude generator.
         *
         * @readonly
         * @type {AlignmentAndAttitudeGenerator}
         * @memberof CentralCastingHeroesForTomorrowHub
         */
        get: function () {
            return this._alignmentAndAttitude;
        },
        enumerable: true,
        configurable: true
    });
    return CentralCastingHeroesForTomorrowHub;
}());
exports.CentralCastingHeroesForTomorrowHub = CentralCastingHeroesForTomorrowHub;
var CentralCastingFactory = /** @class */ (function () {
    function CentralCastingFactory() {
    }
    CentralCastingFactory.createHub = function (randomService) {
        if (randomService === void 0) { randomService = new random_service_1.RandomService(); }
        return new CentralCastingHeroesForTomorrowHub(new SpaceshipGenerator_1.SpaceshipGenerator(randomService), new AlignmentAndAttitudeGenerator_1.AlignmentAndAttitudeGenerator(randomService));
    };
    return CentralCastingFactory;
}());
exports.CentralCastingFactory = CentralCastingFactory;
// const tmp = new CentralCastingFactory();
// const hub = tmp.createHeroesForTomorrow();
// hub.alignmentAndAttitude.generate({
//     events: EventFromTraits[],
//     randomPersonalityTrait: 0
// })
//# sourceMappingURL=CentralCastingHeroesForTomorrowHub.js.map