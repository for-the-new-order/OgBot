"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpaceTrafficGenerator = /** @class */ (function () {
    function SpaceTrafficGenerator(randomService) {
        this.randomService = randomService;
        this.spaceshipGenerator = new SpaceshipGenerator(randomService);
    }
    SpaceTrafficGenerator.prototype.generate = function (options) {
        var amount = options.amount;
        if (amount == 0) {
            amount = this.randomService.getRandomInt(1, 10).value;
        }
        var density = this.randomService.pickOne(new Array('Light', 'Normal', 'Normal', 'Normal', 'Dense')).value;
        var result = { options: { amount: amount, options: options }, density: density, ships: new Array() };
        for (var i = 0; i < amount; i++) {
            var ship = this.spaceshipGenerator.generate();
            result.ships.push(ship);
        }
        return result;
    };
    return SpaceTrafficGenerator;
}());
exports.SpaceTrafficGenerator = SpaceTrafficGenerator;
// 866: Spacecraft
var SpaceshipGenerator = /** @class */ (function () {
    function SpaceshipGenerator(randomService) {
        var _this = this;
        this.randomService = randomService;
        // prettier-ignore
        this.spaceshipTypeGenerator = new BaseGenerator(this.randomService, [
            { weight: 3, generate: function () { return ({ name: 'Small fighter craft', description: 'One or two pilots are all this small military ship can carry.' }); } },
            { weight: 3, generate: function () { return ({ name: 'Scout ship', description: 'A small maneuverable craft capable of traversing space and exploring a planet.' }); } },
            { weight: 2, generate: function () { return ({ name: 'Small yacht', description: 'A small personal space craft.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Large yacht', description: 'A large private passenger craft.' }); } },
            { weight: 4, generate: function () { return ({ name: 'Small freighter', description: 'Designed to carry small amounts of goods.' }); } },
            { weight: 2, generate: function () { return ({ name: 'Large freighter', description: 'Designed to haul large quantities of goods.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Factory ship', description: 'A large, ungainly craft designed to process raw materials into usable form. Usually they are heavily automated with minimal crew.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Destroyer', description: 'A small, but well-armed military ship.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Passenger liner', description: 'Large luxury ship.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Colony ship', description: 'Carries colonists to new planets.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Battlewagon', description: 'Large, heavily armed military ship.' }); } }
        ]);
        // prettier-ignore
        this.spaceCapabilitiesGenerator = new BaseGenerator(this.randomService, [
            { weight: 1, generate: function () { return ({ name: 'Orbital Only', description: 'No interplanetary capability.' }); } },
            { weight: 1, generate: function () { return ({ name: 'No hyperdrive', description: 'Travel to nearby planets & moons, inside the star system.' }); } },
            { weight: 2, generate: function () { return ({ name: 'Basic hyperspace', description: "Travel to nearby systems" }); } },
            { weight: 12, generate: function () { return ({ name: 'Hyperspace capable', description: 'Can travel to anyplace in the galaxy.' }); } }
        ]);
        // prettier-ignore
        this.armamentGenerator = new BaseGenerator(this.randomService, [
            { weight: 5, generate: function () { return ({ name: 'None', description: 'Ship carries no weapons.' }); } },
            { weight: 6, generate: function () { return ({ name: 'Lightly-armed', description: "Carries a minimal of number of legal weaponry for defensive purposes. Doesn't belong in a fire-fight." }); } },
            { weight: 6, generate: function () { return ({ name: 'Well-armed', description: 'Carries enough weaponry to make others think twice before attacking it. Has a fair offensive strike capability.' }); } },
            { weight: 2, generate: function () { return ({ name: 'Heavily-armed', description: 'This is a battle ship, well protected and capable of massive amounts of offensive destruction.' }); } },
            { weight: 1, generate: function (spaceship) {
                    if (spaceship.type !== "Battlewagon") {
                        return _this.armamentGenerator.generate(spaceship);
                    }
                    return ({ name: 'Planet-buster', description: 'The unbelievable firepower in this spacecraft could level a planet' });
                } }
        ]);
        // prettier-ignore
        this.specialFeaturesGenerator = new RerollGenerator(new BaseGenerator(this.randomService, [
            { weight: 5, generate: function () { return ({ name: 'None', description: 'Nothing special.' }); } },
            { weight: 2, generate: function () {
                    // TODO: Develop a personality for it.
                    // Roll 6 times on Table 312A: Personality Trait.
                    // Check to select personality traits.
                    // Decide whether it is "male" or "female"
                    return { name: "Personalized ship's computer", description: '' };
                } },
            { weight: 1, generate: function () {
                    // TODO: Select this item on Table 855: Techno-Wonders.
                    return { name: 'Techno-wonder Installed', description: '' };
                } },
            { weight: 2, generate: function () { return ({ name: 'Large cargo area', description: 'The ship has extra cargo bay.' }); } },
            { weight: 3, generate: function () { return ({ name: 'Advanced computer', description: 'The computers are one step better (smarter, faster, more programs) than those found on similar ships.' }); } },
            { weight: 2, generate: function () { return ({ name: 'Special defenses', description: 'Defense systems are one step better than those found on similar ships.' }); } },
            { weight: 2, generate: function () {
                    // TODO: 
                    // If PC: Ship requires no crew other than the character to operate.
                    // If NPC: Ship requires no crew to operate.
                    return ({ name: 'No Crew', description: 'Ship requires no crew to operate.' });
                } },
            { weight: 1, generate: function () { return ({ name: 'Non-standard hyperdrive', description: 'Ship uses less fuel and jumps farther and faster than similar ships.' }); } },
            { weight: 2, generate: function () { return ({ name: 'Reroll', description: 'Reroll twice' }); } }
        ]));
        // prettier-ignore
        this.liabilitiesGenerator = new RerollGenerator(new BaseGenerator(this.randomService, [
            { weight: 3, generate: function () { return ({ name: 'None', description: 'Everything is fine.' }); } },
            { weight: 3, generate: function () { return ({ name: 'Alien manufacture', description: "Ship is not built to character's racial standards. Seats are wrong, controls labels are illegible and so on." }); } },
            { weight: 1, generate: function () { return ({ name: 'Clunky hyperspace', description: 'Drive may not always function when engaged. 75% chance of working.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Small cargo area', description: 'Has half the normal cargo space' }); } },
            { weight: 1, generate: function () { return ({ name: 'Interior unfinished', description: 'Walls lack paneling, floorsare raw metal, loose wiring hangs everywhere.' }); } },
            { weight: 1, generate: function () {
                    var extraConsumption = _this.randomService.getRandomInt(1, 100).value;
                    return ({ name: 'Fuel eater', description: "Inefficient hyperdrive consumes " + extraConsumption + "% more fuel than a similar ships." });
                } },
            { weight: 1, generate: function () {
                    // TODO: GM Only: See entry #866 on Table 967: GM's Specials
                    return ({ name: 'TODO', description: '...' });
                } },
            { weight: 1, generate: function () {
                    var amountOfShips = _this.randomService.getRandomInt(1, 6).value;
                    return ({ name: 'Junker', description: "Ship is built out of salvage. At least " + amountOfShips + " different ships went into her construction." });
                } },
            { weight: 1, generate: function () { return ({ name: 'Old ship', description: "Ship was playing the spaceways when the character's granddad was a boy." }); } },
            { weight: 1, generate: function () { return ({ name: 'Ancient ship', description: 'Ship is very old, possibly dating back to the beginning of star travel.' }); } },
            { weight: 1, generate: function () {
                    var extraCost = _this.randomService.getRandomInt(1, 100).value;
                    return ({ name: 'Custom job', description: "Most systems are nonstandard. Repairs are " + extraCost + "% more costly than normal." });
                } },
            { weight: 1, generate: function () { return ({ name: 'Recognizable ship', description: 'The ship stands out from other ships. Even common folk know her by name.' }); } },
            { weight: 1, generate: function () { return ({ name: 'Infested', description: 'The ship is overrun by parasites.' }); } },
            { weight: 1, generate: function () {
                    var extraCrew = _this.randomService.getRandomInt(2, 8).value * 50; // 50, 100, ..., 400%
                    return ({ name: 'Large Crew', description: "Ship requires a large crew to run, at least " + extraCrew + "% more crew than a similar ship." });
                } },
            { weight: 2, generate: function () { return ({ name: 'Reroll', description: 'Reroll twice' }); } }
        ]));
    }
    SpaceshipGenerator.prototype.generate = function () {
        var ship = new Spaceship();
        ship.type = this.spaceshipTypeGenerator.generate(ship);
        ship.spaceCapabilities = this.spaceCapabilitiesGenerator.generate(ship);
        ship.armament = this.armamentGenerator.generate(ship);
        ship.specialFeatures = this.specialFeaturesGenerator.generate(ship);
        ship.liabilities = this.liabilitiesGenerator.generate(ship);
        return ship;
    };
    return SpaceshipGenerator;
}());
var Spaceship = /** @class */ (function () {
    function Spaceship() {
    }
    return Spaceship;
}());
var BaseGenerator = /** @class */ (function () {
    function BaseGenerator(randomService, elements) {
        var _this = this;
        this.randomService = randomService;
        this.elements = new Array();
        elements.forEach(function (element) {
            for (var i = 0; i < element.weight; i++) {
                _this.elements.push(element);
            }
        });
    }
    BaseGenerator.prototype.generate = function (spaceship) {
        var result = this.randomService.pickOne(this.elements).value;
        return result.generate(spaceship);
    };
    return BaseGenerator;
}());
var RerollGenerator = /** @class */ (function () {
    function RerollGenerator(generator) {
        this.generator = generator;
    }
    RerollGenerator.prototype.generate = function (spaceship) {
        var result = new Array();
        var element = this.generator.generate(spaceship);
        if (element.name == 'Reroll') {
            var result1 = this.generate(spaceship);
            var result2 = this.generate(spaceship);
            result.push.apply(result, result1);
            result.push.apply(result, result2);
        }
        else {
            result.push(element);
        }
        return result;
    };
    return RerollGenerator;
}());
//# sourceMappingURL=space-traffic-generator.js.map