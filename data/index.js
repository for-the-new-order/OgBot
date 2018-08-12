"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var motivation_1 = require("./motivation");
exports.motivations = motivation_1.motivations;
var personality_1 = require("./personality");
exports.personalityTraits = personality_1.personalityTraits;
var surnameData = require("./us-census/surname");
var femaleFirstname = require("./gutenberg/female-firstname");
var gutenbergLastname = require("./gutenberg/lastname");
var maleFirstname = require("./gutenberg/male-firstname");
var placesData = require("./gutenberg/places");
exports.nameData = {
    usCensus: {
        surname: surnameData.data
    },
    gutenberg: {
        firstname: {
            female: femaleFirstname.data,
            male: maleFirstname.data
        },
        surname: gutenbergLastname.data,
        places: placesData.data
    },
    all: {
        firstname: femaleFirstname.data.concat(maleFirstname.data),
        surname: gutenbergLastname.data.concat(surnameData.data),
        places: placesData.data
    }
};
//# sourceMappingURL=index.js.map