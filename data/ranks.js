"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var tmp = {
    empire: {
        steps: [[1, 5], [6, 6], [7, 9], [10, 14], [15, 16]],
        navy: [
            { level: 1, name: 'Ensign' },
            { level: 2, name: 'Junior Lieutenant' },
            { level: 3, name: 'Second Lieutenant' },
            { level: 4, name: 'Lieutenant' },
            { level: 5, name: 'Senior Lieutenant' },
            { level: 6, name: 'Captain' },
            { level: 7, name: 'Senior Captain' },
            { level: 8, name: 'Lieutenant Commander' },
            { level: 9, name: 'Commander' },
            { level: 10, name: 'Commodore' },
            { level: 11, name: 'Senior Commodore' },
            { level: 12, name: 'Rear Admiral' },
            { level: 13, name: 'Vice Admiral' },
            { level: 14, name: 'Admiral' },
            { level: 15, name: 'Fleet Admiral' },
            { level: 16, name: 'Grand Admiral' }
        ],
        army: [
            { level: 1, name: 'Ensign' },
            { level: 2, name: 'Junior Lieutenant' },
            { level: 3, name: 'Second Lieutenant' },
            { level: 4, name: 'Lieutenant' },
            { level: 5, name: 'Senior Lieutenant' },
            { level: 6, name: 'Captain' },
            { level: 7, name: 'Senior Captain' },
            { level: 8, name: 'Lieutenant Commander' },
            { level: 9, name: 'Commander' },
            { level: 10, name: 'Colonel' },
            { level: 11, name: 'Senior Colonel' },
            { level: 12, name: 'Major Colonel' },
            { level: 13, name: 'Lieutenant General' },
            { level: 14, name: 'General' },
            { level: 15, name: 'Marshal' },
            { level: 16, name: 'Grand General' }
        ],
        intelligence: [
            { level: 1, name: 'Ensign' },
            { level: 2, name: 'Junior Lieutenant' },
            { level: 3, name: 'Second Lieutenant' },
            { level: 4, name: 'Lieutenant' },
            { level: 5, name: 'Senior Lieutenant' },
            { level: 6, name: 'Captain' },
            { level: 7, name: 'Senior Captain' },
            { level: 8, name: 'Lieutenant Commander' },
            { level: 9, name: 'Commander' },
            { level: 10, name: 'Commodore' },
            { level: 11, name: 'Senior Commodore' },
            { level: 12, name: 'Rear Admiral' },
            { level: 13, name: 'Vice Admiral' },
            { level: 14, name: 'Deputy Director' },
            { level: 15, name: 'Director' }
        ],
        compnor: [
            { level: 3, name: 'Junior Inspector' },
            { level: 4, name: 'Inspector' },
            { level: 5, name: 'Inspector General' },
            { level: 6, name: 'Agent' },
            { level: 7, name: 'Senior Agent' },
            { level: 8, name: 'Lieutenant Commander' },
            { level: 9, name: 'Commander' },
            { level: 10, name: 'Colonel' },
            { level: 11, name: 'Senior Colonel' },
            { level: 14, name: 'Deputy Director' },
            { level: 15, name: 'Director' }
        ],
        governance: [
            { level: 14, name: 'Governor' },
            { level: 14, name: 'Viceroy' },
            { level: 15, name: 'Moff' },
            { level: 16, name: 'Grand Moff' }
        ],
        ancillary: [
            { level: 1, name: 'Ensign' },
            { level: 2, name: 'Junior Lieutenant' },
            { level: 3, name: 'Second Lieutenant' },
            { level: 4, name: 'Lieutenant' },
            { level: 5, name: 'Senior Lieutenant' },
            { level: 6, name: 'Captain' },
            { level: 7, name: 'Senior Captain' },
            { level: 8, name: 'Lieutenant Commander' },
            { level: 9, name: 'Commander' },
            { level: 10, name: 'Colonel' },
            { level: 11, name: 'Senior Colonel' },
            { level: 12, name: 'Major Colonel' },
            { level: 13, name: 'Lieutenant General' },
            { level: 14, name: 'General' },
            { level: 15, name: 'Director' }
        ],
        appointments: [
            { level: 3, name: 'Supervisor' },
            { level: 3, name: 'Communication' },
            { level: 6, name: 'Navigator' },
            { level: 6, name: 'Chief of Department' },
            { level: 6, name: 'Lieutenant' },
            { level: 9, name: 'Captain' },
            { level: 9, name: 'Taskmaster' },
            { level: 9, name: 'Commander' },
            { level: 11, name: 'Commander of a Task Squadron' },
            { level: 14, name: 'Commander of a Task Force' },
            { level: 15, name: 'Commander of a Fleet' }
        ]
    },
    generic: {
        steps: [[1, 3], [3, 5], [5, 7], [8, 10], [11, 14]],
        army: [
            { level: 1, name: 'Private' },
            { level: 2, name: 'Corporal' },
            { level: 3, name: 'Master Corporal' },
            { level: 4, name: 'Sergeant' },
            { level: 5, name: 'Second Lieutenant' },
            { level: 6, name: 'Lieutenant' },
            { level: 7, name: 'Captain' },
            { level: 8, name: 'Major' },
            { level: 9, name: 'Lieutenant-Colonel' },
            { level: 10, name: 'Colonel' },
            { level: 11, name: 'Brigadier-General' },
            { level: 12, name: 'Major-General' },
            { level: 13, name: 'Lieutenant-General' },
            { level: 14, name: 'General' }
        ],
        navy: [
            { level: 1, name: 'Third Class' },
            { level: 2, name: 'Second Class' },
            { level: 3, name: 'First Class' },
            { level: 4, name: 'Sergeant' },
            { level: 5, name: 'Sergeant Major' },
            { level: 6, name: 'Second Lieutenant' },
            { level: 7, name: 'Lieutenant' },
            { level: 8, name: 'Lieutenant-Commander' },
            { level: 9, name: 'Commander' },
            { level: 10, name: 'Captain' },
            { level: 11, name: 'Commodore ' },
            { level: 12, name: 'Rear-Admiral' },
            { level: 13, name: 'Vice-Admiral' },
            { level: 14, name: 'Admiral' }
        ]
    },
    rebels: {
        steps: [[1, 2], [3, 4], [5, 6]],
        army: [
            { level: 1, name: 'Lieutenant' },
            { level: 2, name: 'Captain' },
            { level: 3, name: 'Major' },
            { level: 4, name: 'Commander' },
            { level: 5, name: 'Colonel' },
            { level: 6, name: 'General' }
        ],
        navy: [
            { level: 1, name: 'Lieutenant' },
            { level: 2, name: 'Captain' },
            { level: 3, name: 'Major' },
            { level: 4, name: 'Commander' },
            { level: 5, name: 'Colonel' },
            { level: 6, name: 'Admiral' }
        ]
    }
};
var allEmpire = tmp.empire.navy
    .map(function (x) { return addCorp(x, 'navy'); })
    .concat(tmp.empire.army.map(function (x) { return addCorp(x, 'army'); }), tmp.empire.compnor.map(function (x) { return addCorp(x, 'compnor'); }), tmp.empire.appointments.map(function (x) { return addCorp(x, 'appointments'); }), tmp.empire.ancillary.map(function (x) { return addCorp(x, 'ancillary'); }), tmp.empire.governance.map(function (x) { return addCorp(x, 'governance'); }), tmp.empire.intelligence.map(function (x) { return addCorp(x, 'intelligence'); }))
    .map(function (x) { return addClan(x, 'empire'); });
var allGeneric = tmp.generic.army
    .map(function (x) { return addCorp(x, 'army'); })
    .concat(tmp.generic.navy.map(function (x) { return addCorp(x, 'navy'); }))
    .map(function (x) { return addClan(x, 'generic'); });
var allRebels = tmp.rebels.army
    .map(function (x) { return addCorp(x, 'army'); })
    .concat(tmp.rebels.navy.map(function (x) { return addCorp(x, 'navy'); }))
    .map(function (x) { return addClan(x, 'rebels'); });
var all = allGeneric.concat(allEmpire, allRebels);
exports.ranks = __assign(__assign({}, tmp), { empire: __assign(__assign({}, tmp.empire), { all: allEmpire }), generic: __assign(__assign({}, tmp.generic), { all: allGeneric }), rebels: __assign(__assign({}, tmp.rebels), { all: allRebels }), all: all });
function addClan(ranks, clanName) {
    return __assign(__assign({}, ranks), { clan: clanName });
}
function addCorp(ranks, corpName) {
    return __assign(__assign({}, ranks), { corp: corpName });
}
//# sourceMappingURL=ranks.js.map