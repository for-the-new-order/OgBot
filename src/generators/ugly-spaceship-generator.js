"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UglySpaceshipGenerator = /** @class */ (function () {
    function UglySpaceshipGenerator(randomService) {
        this.randomService = randomService;
        var allUglyEngines = [
            new UglyEngine('Y-wing', 3, 2, 3, 0),
            new UglyEngine('TIE', 1, 2, 4, 0),
            new UglyEngine('Z-95', 3, 2, 3, 0),
            new UglyEngine('CloakShape', 2, 1, 3, 0),
            new UglyEngine('R-41', 2, 2, 3, 0),
            new UglyEngine('V-wing', 2, 1, 4, 0),
            new UglyEngine('Eta-2', 1, 1, 4, 1),
            new UglyEngine('C-73', 2, 1, 3, 0),
            new UglyEngine('Toscan 8-Q', 2, 2, 3, 0),
            new UglyEngine('ARC-170', 3, 2, 3, 0),
            new UglyEngine('Z-95 MK I', 1, 2, 3, 0),
            new UglyEngine('X-wing', 3, 2, 4, 0),
            new UglyEngine('Pinook', 2, 1, 3, -1)
        ];
        var allUglyWing = [
            new UglyWing('Y-wing', 2, 2, -1, 0, randomService, new UglyEngine('Y-wing', 3, 2, 3, 0)),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'TIE/LN', 2, 2, 1, 0, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'Z-95', 2, 2, 1, 2, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'CloakShape', 3, 2, -1, 2, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'R-41', 2, 2, 0, 2, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'V-wing', 2, 2, 0, 3, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'TIE/IN', 2, 3, 2, 3, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'TIE/D', 2, 3, 1, 4, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'Eta-2', 2, 2, 1, 1, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'C-73', 2, 2, 0, 2, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'Toscan 8-Q', 2, 2, 0, 1, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'ARC-170', 3, 2, 1, 4, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'Z-95 MK I', 2, 1, 0, 2, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'Z-95 MK I', 2, 1, 1, 2, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'X-wing', 2, 2, 1, 4, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'Tri-Fighter', 3, 2, -1, 3, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'Pinook ', 2, 1, 0, 1, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'T-16', 1, 1, 0, 0, randomService].concat(allUglyEngines)))(),
            new (UglyWing.bind.apply(UglyWing, [void 0, 'T-16', 1, 1, 1, 0, randomService].concat(allUglyEngines)))()
        ];
        this.uglyBodies = [
            new (UglyBody.bind.apply(UglyBody, [void 0, 'Y-wing', 6, 3, PlanetaryRange.Close, 1, 1, 0, 5, 3, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'TIE', 3, 2, PlanetaryRange.Close, 1, 0, 0, 2, 2, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'Z-95', 4, 2, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'CloakShape', 5, 2, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'R-41 ', 4, 2, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'V-wing', 3, 2, PlanetaryRange.Close, 1, 0, 0, 2, 2, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'Eta-2', 2, 2, PlanetaryRange.Close, 1, 0, 0, 3, 2, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'C-73', 3, 3, PlanetaryRange.Close, 1, 0, 0, 1, 2, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'Toscan 8-Q', 4, 3, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'ARC-170', 6, 3, PlanetaryRange.Close, 1, 0, 2, 3, 3, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'Z-95 MK I', 4, 2, PlanetaryRange.Close, 1, 0, 0, 3, 2, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'X-wing', 5, 3, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService].concat(allUglyWing)))(),
            new (UglyBody.bind.apply(UglyBody, [void 0, 'Pinook', 3, 2, PlanetaryRange.Close, 1, 0, 0, 2, 2, randomService].concat(allUglyWing)))()
        ];
        this.uglyWeaponGenerator = new UglyWeaponGenerator(randomService);
    }
    UglySpaceshipGenerator.prototype.generate = function () {
        var maxHandling = 2;
        var sheet = new VehicleSheet();
        var body = this.randomService.pickOne(this.uglyBodies).value;
        var wing = body.generateWings();
        var engine = wing.generateEngine();
        var description = this.makeUglyDescription(body, wing, engine);
        var weapons = this.uglyWeaponGenerator.generate(body.weaponPoints + wing.weaponPoints);
        sheet.name = this.makeUglyName(body, wing, engine);
        sheet.description.push(description);
        sheet.characteristics.silhouette = 3;
        sheet.characteristics.max_speed = engine.speed;
        sheet.characteristics.handling = Math.min(maxHandling, wing.handling + engine.handling);
        sheet.characteristics.hull_trauma.threshold = body.hullTrauma + wing.hullTrauma + engine.hullTrauma;
        sheet.characteristics.system_strain.threshold = body.systemStrain + wing.systemStrain + engine.systemStrain;
        sheet.characteristics.protection.armor = body.armor;
        sheet.characteristics.protection.defense = 0;
        sheet.skill = 'Piloting';
        sheet.complement = this.makeComplement(body);
        weapons.forEach(function (weapon) {
            sheet.weapons.push(new VehicleSheetWeapon(weapon.name, weapon.stats));
        });
        //this.addDebugInfo(sheet, body, wing, engine);
        return sheet;
    };
    UglySpaceshipGenerator.prototype.addDebugInfo = function (sheet, body, wing, engine) {
        sheet.sources = {
            weaponPoints: body.weaponPoints + wing.weaponPoints
        };
        // sheet.sources.body = Object.assign({} as any, body);
        // sheet.sources.wing = Object.assign({} as any, wing);
        // sheet.sources.engine = Object.assign({} as any, engine);
        // delete sheet.sources.body.wings;
        // delete sheet.sources.body.randomService;
        // delete sheet.sources.wing.engines;
        // delete sheet.sources.wing.randomService;
    };
    UglySpaceshipGenerator.prototype.makeUglyName = function (uglyBody, uglyWing, uglyEngine) {
        return "Ugly's " + uglyBody.name + " body & " + uglyWing.name + " wings & " + uglyEngine.name + " engine";
    };
    UglySpaceshipGenerator.prototype.makeUglyDescription = function (uglyBody, uglyWing, uglyEngine) {
        return "The ugly's is composed of a " + uglyBody.name + " body, " + uglyWing.name + " wings and what looks like a " + uglyEngine.name + " engine.";
    };
    UglySpaceshipGenerator.prototype.makeComplement = function (uglyBody) {
        var complement = uglyBody.pilots + " pilot(s)";
        complement += uglyBody.gunners > 0 ? ", " + uglyBody.gunners + " gunner(s)" : '';
        complement += uglyBody.others > 0 ? ", " + uglyBody.others + " others(s)" : '';
        return complement;
    };
    return UglySpaceshipGenerator;
}());
exports.UglySpaceshipGenerator = UglySpaceshipGenerator;
var VehicleSheet = /** @class */ (function () {
    function VehicleSheet() {
        this.image_path = '/assets/images/vehicles/250x250-generic.png';
        this.description = [];
        this.characteristics = new VehicleCharacteristics();
        this.complement = '';
        this.passenger_capacity = 'None';
        this.consumables = '';
        this.encumbrance_capacity = 0;
        this.cost = new ItemCost();
        this.weapons = [];
    }
    return VehicleSheet;
}());
exports.VehicleSheet = VehicleSheet;
var VehicleSheetWeapon = /** @class */ (function () {
    function VehicleSheetWeapon(name, specs) {
        this.name = name;
        this.specs = specs;
    }
    return VehicleSheetWeapon;
}());
exports.VehicleSheetWeapon = VehicleSheetWeapon;
var ItemCost = /** @class */ (function () {
    function ItemCost() {
        this.price = 0;
        this.rarity = 0;
    }
    return ItemCost;
}());
exports.ItemCost = ItemCost;
var VehicleCharacteristics = /** @class */ (function () {
    function VehicleCharacteristics() {
        this.silhouette = 0;
        this.max_speed = 0;
        this.handling = 0;
        this.hull_trauma = new VehiclePoint();
        this.system_strain = new VehiclePoint();
        this.protection = new VehicleProtection();
    }
    return VehicleCharacteristics;
}());
exports.VehicleCharacteristics = VehicleCharacteristics;
var VehiclePoint = /** @class */ (function () {
    function VehiclePoint() {
        this.threshold = 0;
        this.current = 0;
    }
    return VehiclePoint;
}());
exports.VehiclePoint = VehiclePoint;
var VehicleProtection = /** @class */ (function () {
    function VehicleProtection() {
        this.defense = 0;
        this.armor = 0;
    }
    return VehicleProtection;
}());
exports.VehicleProtection = VehicleProtection;
var PersonalRange;
(function (PersonalRange) {
    PersonalRange["Engaged"] = "Engaged";
    PersonalRange["Short"] = "Short ";
    PersonalRange["Medium"] = "Medium";
    PersonalRange["Long"] = "Long";
    PersonalRange["Extreme"] = "Extreme";
})(PersonalRange = exports.PersonalRange || (exports.PersonalRange = {}));
var PlanetaryRange;
(function (PlanetaryRange) {
    PlanetaryRange["Close"] = "Close";
    PlanetaryRange["Short"] = "Short ";
    PlanetaryRange["Medium"] = "Medium";
    PlanetaryRange["Long"] = "Long";
    PlanetaryRange["Extreme"] = "Extreme";
    PlanetaryRange["Strategic"] = "Strategic";
})(PlanetaryRange = exports.PlanetaryRange || (exports.PlanetaryRange = {}));
var UglyBody = /** @class */ (function () {
    function UglyBody(name, hullTrauma, systemStrain, sensorRange, pilots, gunners, others, weaponPoints, armor, randomService) {
        var wings = [];
        for (var _i = 10; _i < arguments.length; _i++) {
            wings[_i - 10] = arguments[_i];
        }
        this.name = name;
        this.hullTrauma = hullTrauma;
        this.systemStrain = systemStrain;
        this.sensorRange = sensorRange;
        this.pilots = pilots;
        this.gunners = gunners;
        this.others = others;
        this.weaponPoints = weaponPoints;
        this.armor = armor;
        this.randomService = randomService;
        this.wings = wings;
    }
    UglyBody.prototype.generateWings = function () {
        var wings = this.randomService.pickOne(this.wings);
        return wings.value;
    };
    return UglyBody;
}());
var UglyWing = /** @class */ (function () {
    function UglyWing(name, hullTrauma, systemStrain, handling, weaponPoints, randomService) {
        var engines = [];
        for (var _i = 6; _i < arguments.length; _i++) {
            engines[_i - 6] = arguments[_i];
        }
        this.name = name;
        this.hullTrauma = hullTrauma;
        this.systemStrain = systemStrain;
        this.handling = handling;
        this.weaponPoints = weaponPoints;
        this.randomService = randomService;
        this.engines = engines;
    }
    UglyWing.prototype.generateEngine = function () {
        var engine = this.randomService.pickOne(this.engines);
        return engine.value;
    };
    return UglyWing;
}());
var UglyEngine = /** @class */ (function () {
    function UglyEngine(name, hullTrauma, systemStrain, speed, handling) {
        this.name = name;
        this.hullTrauma = hullTrauma;
        this.systemStrain = systemStrain;
        this.speed = speed;
        this.handling = handling;
    }
    return UglyEngine;
}());
var UglyWeapon = /** @class */ (function () {
    function UglyWeapon(name, weaponCost, stats) {
        this.name = name;
        this.weaponCost = weaponCost;
        this.stats = stats;
    }
    return UglyWeapon;
}());
var UglyWeaponGenerator = /** @class */ (function () {
    function UglyWeaponGenerator(randomService) {
        this.randomService = randomService;
        this.laserWeapons = [
            new UglyWeapon('Autoblaster', 1.5, 'Fire Arc Forward; Damage 3; Critical 5; Range Close; Auto-Fire'),
            new UglyWeapon('Light Blaster Cannon', 1, 'Fire Arc Forward; Damage 4; Critical 4; Range Close;'),
            new UglyWeapon('Heavy blaster Cannon', 2, 'Fire Arc Forward; Damage 5; Critical 4; Range Close;'),
            new UglyWeapon('Light Ion Cannon', 2, 'Fire Arc Forward; Damage 5; Critical 4; Range Close; Ion'),
            new UglyWeapon('Medium Ion Cannon', 3, 'Fire Arc Forward; Damage 6; Critical 4; Range Short; Ion'),
            new UglyWeapon('Light Laser Cannon', 2, 'Fire Arc Forward; Damage 5; Critical 3; Range Close;'),
            new UglyWeapon('Twin Laser Cannons', 4, 'Fire Arc Forward; Damage 5; Critical 3; Range Close; Linked 1'),
            new UglyWeapon('Medium laser Cannon', 3, 'Fire Arc Forward; Damage 6; Critical 3; Range Close;'),
            new UglyWeapon('Quad laser cannon', 6, 'Fire Arc Forward; Damage 5; Critical 3; Range Close; Accurate, Linked 3') //6
        ];
        this.limitedAmmoWeapons = [
            new UglyWeapon('Concussion missile launcher', 3, 'Fire Arc Forward; Damage 6; Critical 3; Range Short; Blast 4, Breach 4, Guided 3, Limited Ammo 3, Slow-Firing 1'),
            new UglyWeapon('Proton Torpedo Launcher', 4, 'Fire Arc Forward; Damage 8; Critical 2; Range Short; Blast 6, Breach 6, Guided 2, Limited Ammo 3, Slow-Firing 1') //1.5
        ];
    }
    UglyWeaponGenerator.prototype.generate = function (weaponPoints) {
        var weapons = new Array();
        var remainingWeaponPoints = this.pickAGun(weaponPoints, weapons, this.laserWeapons);
        this.pickAGun(remainingWeaponPoints, weapons, this.limitedAmmoWeapons);
        return weapons;
    };
    UglyWeaponGenerator.prototype.pickAGun = function (weaponPoints, weapons, weaponsToPickFrom) {
        // console.log(`pickAGun(weaponPoints): ${weaponPoints}`);
        var min = Math.min.apply(Math, weaponsToPickFrom.map(function (x) { return x.weaponCost; }));
        // console.log(`pickAGun(min): ${min}`);
        var initialWeapons = weapons.length;
        while (weaponPoints && weaponPoints >= min && weapons.length == initialWeapons) {
            var weapon = this.randomService.pickOne(weaponsToPickFrom).value;
            if (weaponPoints >= weapon.weaponCost) {
                weapons.push(weapon);
                weaponPoints -= weapon.weaponCost;
            }
        }
        return weaponPoints;
    };
    return UglyWeaponGenerator;
}());
exports.UglyWeaponGenerator = UglyWeaponGenerator;
// ([a-zA-Z-0-9 ]+)\s*([0-9])\s*([0-9])\s*Close\s*(([0-9]) Pilot([,(12 a-z)]+)?)\s*([0-9])\s*([0-9])
// new UglyBody("$1", $2, $3, SensorRange.Close, $5, 0, 0, $7, $8, randomService, ...allUglyWing),
//
// ([a-zA-Z-0-9 /]+)\s*([0-9])\s*([0-9])\s*([-+][0-9])\s*([0-9])
// new UglyWing("$1", $2, $3, $4, $5, randomService, ...allUglyEngines),
//
// ([a-zA-Z-0-9 /]+)\s*([0-9])\s*([0-9])\s*([0-9])\s*([-+][0-9])
// new UglyEngine("$1", $2, $3, $4, $5),
//
// [a-zA-Z-0-9 /]+):\s*([0-9.]+)
// new UglyWeapon("$1", $2, "Fire Arc [Forward|Aft|Starboard|Port|All]; Damage 0; Critical 0; Range [Close|Medium|Long]; [Qualities]"),
// Linked 2
//# sourceMappingURL=ugly-spaceship-generator.js.map