"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var format_utility_1 = require("./format-utility");
var NameGenerator = /** @class */ (function () {
    function NameGenerator(randomService) {
        this.randomService = randomService;
        this.formatUtility = new format_utility_1.FormatUtility();
    }
    NameGenerator.prototype.firstname = function () {
        return this.randomService.pickOne(data_1.nameData.all.firstname).value;
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
//# sourceMappingURL=name-generator.js.map