"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var format_utility_1 = require("./format-utility");
var AlignmentAndAttitudeGenerator_1 = require("../CentralCasting/AlignmentAndAttitudeGenerator");
var NameGenerator = /** @class */ (function () {
    function NameGenerator(randomService) {
        this.randomService = randomService;
        this.formatUtility = new format_utility_1.FormatUtility();
        this.droidNameGenerator = new DroidNameGenerator(randomService);
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
    NameGenerator.prototype.droid = function () {
        return this.droidNameGenerator.generate();
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
var DroidNameGenerator = /** @class */ (function () {
    function DroidNameGenerator(randomService) {
        this.randomService = randomService;
        this.dashGenerator = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 1, generate: function () { return 0; } },
            { weight: 98, generate: function () { return 1; } },
            { weight: 1, generate: function () { return 2; } }
        ]);
        // Before first dash
        this.firstChar = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 10, generate: function () { return Type.Character; } },
            { weight: 1, generate: function () { return Type.Number; } }
        ]);
        this.secondChar = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 17, generate: function () { return Type.Character; } },
            { weight: 10, generate: function () { return Type.Number; } }
        ]);
        this.thirdChar = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 2, generate: function () { return Type.Character; } },
            { weight: 1, generate: function () { return Type.Number; } }
        ]);
        // Second part (after first dash)
        this.secFirstChar = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 3, generate: function () { return Type.Character; } },
            { weight: 5, generate: function () { return Type.Number; } }
        ]);
        this.secSecondChar = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 2, generate: function () { return Type.Character; } },
            { weight: 3, generate: function () { return Type.Number; } }
        ]);
        this.secThirdChar = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 4, generate: function () { return Type.Character; } },
            { weight: 3, generate: function () { return Type.Number; } }
        ]);
        // specChar
        this.specChar = new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
            { weight: 5, generate: function () { return Type.Character; } },
            { weight: 5, generate: function () { return Type.Number; } }
        ]);
    }
    DroidNameGenerator.prototype.generate = function () {
        var builder = new DroidNameBuilder();
        builder.dashAmount = this.dashGenerator.generate(builder);
        // gen block 1
        var blockGenerator = new BlockGenerator(this.randomService, this.firstChar, this.secondChar, this.thirdChar);
        var name = blockGenerator.generate(builder);
        if (builder.dashAmount > 0) {
            //gen block 2
            var blockGenerator_1 = new BlockGenerator(this.randomService, this.secFirstChar, this.secSecondChar, this.secThirdChar);
            name += '-';
            name += blockGenerator_1.generate(builder);
        }
        if (builder.dashAmount > 1) {
            // gen block 3
            var blockGenerator_2 = new BlockGenerator(this.randomService, this.specChar, this.specChar, this.specChar);
            name += '-';
            name += blockGenerator_2.generate(builder);
        }
        return name;
    };
    return DroidNameGenerator;
}());
exports.DroidNameGenerator = DroidNameGenerator;
var BlockGenerator = /** @class */ (function () {
    function BlockGenerator(randomService, firstChar, secondChar, thirdChar) {
        this.randomService = randomService;
        this.firstChar = firstChar;
        this.secondChar = secondChar;
        this.thirdChar = thirdChar;
        this.blockLengthGenerators = [
            new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
                { weight: 2, generate: function () { return 1; } },
                { weight: 8, generate: function () { return 2; } },
                { weight: 1, generate: function () { return 3; } }
            ]),
            new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
                { weight: 7, generate: function () { return 1; } },
                { weight: 18, generate: function () { return 2; } },
                { weight: 7, generate: function () { return 3; } }
            ]),
            new AlignmentAndAttitudeGenerator_1.WeightenGenerator(this.randomService, [
                { weight: 9, generate: function () { return 1; } },
                { weight: 26, generate: function () { return 2; } },
                { weight: 8, generate: function () { return 3; } }
            ])
        ];
        this.charGenerator = new CharGenerator(randomService);
    }
    BlockGenerator.prototype.generate = function (builder) {
        var length = this.blockLengthGenerators[builder.currentBlock++].generate(builder);
        var block = this.generateChar(builder, this.firstChar);
        if (length > 1) {
            block += this.generateChar(builder, this.secondChar);
        }
        if (length > 2) {
            block += this.generateChar(builder, this.thirdChar);
        }
        return block;
    };
    BlockGenerator.prototype.generateChar = function (builder, generator) {
        var type = generator.generate(builder);
        if (type == Type.Character) {
            return this.charGenerator.generateCharacter();
        }
        else {
            return this.charGenerator.generateNumber();
        }
    };
    return BlockGenerator;
}());
var CharGenerator = /** @class */ (function () {
    function CharGenerator(randomService) {
        this.randomService = randomService;
    }
    Object.defineProperty(CharGenerator, "A", {
        get: function () {
            return 'A'.charCodeAt(0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharGenerator, "Z", {
        get: function () {
            return 'Z'.charCodeAt(0);
        },
        enumerable: true,
        configurable: true
    });
    CharGenerator.prototype.generateCharacter = function () {
        return String.fromCharCode(this.randomService.getRandomInt(CharGenerator.A, CharGenerator.Z).value);
    };
    CharGenerator.prototype.generateNumber = function () {
        return this.randomService.getRandomInt(0, 9).value.toString();
    };
    return CharGenerator;
}());
var DroidNameBuilder = /** @class */ (function () {
    function DroidNameBuilder() {
        this.currentBlock = 0;
    }
    return DroidNameBuilder;
}());
var Type;
(function (Type) {
    Type["Character"] = "Character";
    Type["Number"] = "Number";
})(Type || (Type = {}));
//# sourceMappingURL=name-generator.js.map