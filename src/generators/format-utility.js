"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormatUtility = /** @class */ (function () {
    function FormatUtility() {
    }
    FormatUtility.prototype.capitalize = function (name) {
        var firstLetter = name.substr(0, 1).toUpperCase();
        var otherLetters = name.substr(1);
        var result = firstLetter + otherLetters;
        return result;
    };
    return FormatUtility;
}());
exports.FormatUtility = FormatUtility;
//# sourceMappingURL=format-utility.js.map