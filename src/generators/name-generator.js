"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var format_utility_1 = require("./format-utility");
var NameGenerator = /** @class */ (function () {
    function NameGenerator(randomService) {
        this.randomService = randomService;
        this.formatUtility = new format_utility_1.FormatUtility();
    }
    NameGenerator.prototype.firstname = function (gender) {
        var names = gender == Gender.Female ? data_1.nameData.gutenberg.firstname.female : data_1.nameData.gutenberg.firstname.male;
        return this.randomService.pickOne(names).value;
    };
    NameGenerator.prototype.surname = function () {
        return this.formatUtility.capitalize(this.randomService.pickOne(data_1.nameData.all.surname).value.toLowerCase());
    };
    NameGenerator.prototype.place = function () {
        return this.randomService.pickOne(data_1.nameData.all.places).value;
    };
    return NameGenerator;
}());
exports.NameGenerator = NameGenerator;
var Gender;
(function (Gender) {
    Gender["Female"] = "Female";
    Gender["Male"] = "Male";
    Gender["Unknown"] = "Unknown";
})(Gender = exports.Gender || (exports.Gender = {}));
//# sourceMappingURL=name-generator.js.map