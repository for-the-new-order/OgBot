"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Utility function to create a K:V from a list of strings */
// Source: https://basarat.gitbooks.io/typescript/docs/types/literal-types.html
function strEnum(o) {
    return o.reduce(function (res, key) {
        res[key] = key;
        return res;
    }, Object.create(null));
}
exports.strEnum = strEnum;
//# sourceMappingURL=strEnum.js.map