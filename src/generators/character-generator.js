"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alien_names_generator_1 = require("./alien-names-generator");
var data_1 = require("../../data");
var format_utility_1 = require("./format-utility");
var random_service_1 = require("./random-service");
var name_generator_1 = require("./name-generator");
var CharacterGenerator = /** @class */ (function () {
    function CharacterGenerator() {
        this.alienNamesGenerator = new alien_names_generator_1.AlienNamesGenerator(new format_utility_1.FormatUtility());
        this.randomService = new random_service_1.RandomService();
        this.nameGenerator = new name_generator_1.NameGenerator(this.randomService);
    }
    CharacterGenerator.prototype.generate = function (seed) {
        if (seed === void 0) { seed = null; }
        if (seed) {
            this.randomService.seed = seed;
        }
        var initialSeed = this.randomService.seed;
        var isAlien = this.randomService.pickOne([true, false]);
        var name;
        if (isAlien.value) {
            name = this.alienNamesGenerator.generate();
        }
        else {
            name = this.nameGenerator.firstname();
            name += ' ';
            name += this.nameGenerator.surname();
        }
        var someImportantPlace = [this.nameGenerator.place()];
        // const alienNames = [];
        // const firstNames = [];
        // const surnames = [];
        // const places = [];
        // for (let index = 0; index < 5; index++) {
        //     alienNames.push(this.alienNamesGenerator.generate());
        //     firstNames.push(this.nameGenerator.firstname());
        //     surnames.push(this.nameGenerator.surname());
        //     places.push(this.nameGenerator.place());
        // }
        return {
            initialSeed: initialSeed,
            name: name,
            someImportantPlace: someImportantPlace,
            personality: this.randomService.pickOne(data_1.personalityTraits).value,
            motivation: {
                desires: this.randomService.pickOne(data_1.motivations.desires).value,
                fear: this.randomService.pickOne(data_1.motivations.fear).value,
                strength: this.randomService.pickOne(data_1.motivations.strength)
                    .value,
                flaw: this.randomService.pickOne(data_1.motivations.flaw).value
            }
        };
    };
    return CharacterGenerator;
}());
exports.CharacterGenerator = CharacterGenerator;
//# sourceMappingURL=character-generator.js.map