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
//private DroidNameElements = "ghtfaz";
/*
---[ PATTERNS ]---
A-A-A (0-0-0)
---
A   -00
A   -0AA
AA  -AA
AA  -0
AA  -0A
AA  -00
AA  -0A0
AAA -000
AAAA-00
A0  -A0
A0  -A00
A0  -AA
0A0
0   -0A
0   -AAA
---[ DONE ]---
O-O-O (triple 0)

C  -21
R4 -P17
2  -1B
WAC-47
R2 -KT
QT -KT
EV -9D9
BB -8
BT -1 (Bee Tee)
T3 -M4
AZ -3
R2 -D2
C  -3PO
HK -47
R3 -S6
8D8
ASN-121
I  -5YQ
4  -LOM
IG -88
M5 -BZ
ZZ -4Z (nick named ZeeZee)
R5 -D2
R5 -G8
M  -3PO
EW -3
WA -7
R5 -D4
TC -14
FA -4
T3 -H8
TT -40
GH -7



*/
//# sourceMappingURL=name-generator.js.map