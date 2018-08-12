"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var motivation_1 = require("./motivation");
exports.motivations = motivation_1.motivations;
var personality_1 = require("./personality");
exports.personalityTraits = personality_1.personalityTraits;
var ranks_1 = require("./ranks");
exports.ranks = ranks_1.ranks;
var surname_1 = require("./us-census/surname");
var female_firstname_1 = require("./gutenberg/female-firstname");
var lastname_1 = require("./gutenberg/lastname");
var male_firstname_1 = require("./gutenberg/male-firstname");
var places_1 = require("./gutenberg/places");
exports.nameData = {
    usCensus: {
        surname: surname_1.data
    },
    gutenberg: {
        firstname: {
            female: female_firstname_1.data,
            male: male_firstname_1.data
        },
        surname: lastname_1.data,
        places: places_1.data
    },
    all: {
        firstname: female_firstname_1.data.concat(male_firstname_1.data),
        surname: lastname_1.data.concat(surname_1.data),
        places: places_1.data
    }
};
//# sourceMappingURL=index.js.map