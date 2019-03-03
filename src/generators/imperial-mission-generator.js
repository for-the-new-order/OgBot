"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Initial Data source: http://www.d20radio.com/main/holonet-uplink-old-school-chart-cool-imperial-mission-generator/
var ImperialMissionGenerator = /** @class */ (function () {
    function ImperialMissionGenerator(randomService, starWarsAdventureGenerator) {
        this.randomService = randomService;
        this.starWarsAdventureGenerator = starWarsAdventureGenerator;
        this.missionSelector = new RandomAdventureElementSelectionService(randomService, [
            new RandomAdventureElementSelectionService(randomService, [
                'Capture Leader',
                'Protect Leader',
                'Rescue',
                'Restore Order',
                'Make an Example',
                'Destroy Military Target',
                'Counter-Espionage',
                'Protect Secret Weapon',
                'Gather Intelligence',
                'Coercive Diplomacy'
            ]),
            new ElementGeneratorWrapper(function () {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('theme', 1, true);
                return {
                    name: swAdv.theme[0]
                };
            })
        ]);
        this.locationSelector = new RandomAdventureElementSelectionService(randomService, [
            new RandomAdventureElementSelectionService(randomService, [
                new BaseGenerator(function () { return 'Rebel Base'; }, randomService),
                'Hutt Space',
                'Backwater Outer Rim world',
                'An Imperial Core World',
                'A Penal Colony',
                'A Mining World',
                'Factory',
                'Shipyard',
                'Imperial High Society',
                new BaseGenerator(function () { return 'Imperial Base'; }, randomService)
            ]),
            new ElementGeneratorWrapper(function () {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('location', 1, true);
                return {
                    name: swAdv.location[0]
                };
            })
        ]);
        this.oppositionSelector = new RandomAdventureElementSelectionService(randomService, [
            new RandomAdventureElementSelectionService(randomService, [
                'Rebel Alliance Soldiers',
                'Rebel Alliance Fleet',
                'Smugglers',
                'Neutral System Forces',
                'Rebel Aligned Senators',
                'Underworld Consortium',
                'Separatist Holdouts',
                "The Partisans (Saw Gerrera's rebels)",
                'Hidden Rebel Cell',
                'Exiled Force Users',
                'Pirates'
            ]),
            new ElementGeneratorWrapper(function () {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('antagonistOrTarget', 1, true);
                return {
                    name: swAdv.antagonistOrTarget[0]
                };
            })
        ]);
        this.twistSelector = new RandomAdventureElementSelectionService(randomService, [
            new RandomAdventureElementSelectionService(randomService, [
                'Defectors',
                'Bad Intelligence',
                'All a Test',
                'A Third Side Appears',
                'Public Opinion Shifts',
                'Comms Failure',
                'Overconfidence',
                'Unexpected Enemies',
                'Reinforcements Arrive',
                'Unexpected Reversal'
            ]),
            new ElementGeneratorWrapper(function () {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('twistsOrComplications', 1, true);
                return {
                    name: swAdv.twistsOrComplications[0]
                };
            }),
            new ElementGeneratorWrapper(function () {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('dramaticReveal', 1, true);
                return {
                    name: 'Dramatic Reveal',
                    dramaticReveal: swAdv.dramaticReveal[0]
                };
            }),
            new ElementGeneratorWrapper(function () {
                var twistsOrComplications = starWarsAdventureGenerator.generateAdventureElement('twistsOrComplications', 1, true);
                var dramaticReveal = starWarsAdventureGenerator.generateAdventureElement('dramaticReveal', 1, true);
                return {
                    name: 'A twist with a dramatic reveal',
                    dramaticReveal: dramaticReveal.dramaticReveal[0],
                    twistOrComplication: twistsOrComplications.twistsOrComplications[0]
                };
            })
        ]);
    }
    ImperialMissionGenerator.prototype.generate = function () {
        var generated = {
            mission: this.missionSelector.select(),
            location: this.locationSelector.select(),
            opposition: this.oppositionSelector.select(),
            twist: this.twistSelector.select()
        };
        return generated;
    };
    return ImperialMissionGenerator;
}());
exports.ImperialMissionGenerator = ImperialMissionGenerator;
var RandomAdventureElementSelectionService = /** @class */ (function () {
    function RandomAdventureElementSelectionService(randomService, choices) {
        this.randomService = randomService;
        this.choices = choices;
    }
    RandomAdventureElementSelectionService.prototype.generate = function () {
        return this.select();
    };
    RandomAdventureElementSelectionService.prototype.select = function () {
        var randomChoice = this.randomService.pickOne(this.choices).value;
        if (typeof randomChoice === 'string') {
            if (this.isReroll(randomChoice)) {
                return this.select();
            }
            return this.makeAdventureElementFrom(randomChoice);
        }
        return this.handlerTypedElement(randomChoice);
    };
    RandomAdventureElementSelectionService.prototype.makeAdventureElementFrom = function (choice) {
        return {
            name: choice
        };
    };
    RandomAdventureElementSelectionService.prototype.handlerTypedElement = function (generated) {
        var generator = generated;
        if (generator != null) {
            return generator.generate();
        }
        return generated;
    };
    RandomAdventureElementSelectionService.prototype.isReroll = function (value) {
        return value.startsWith('/reroll');
    };
    return RandomAdventureElementSelectionService;
}());
exports.RandomAdventureElementSelectionService = RandomAdventureElementSelectionService;
var BaseGenerator = /** @class */ (function () {
    function BaseGenerator(nameGetter, randomService) {
        this.nameGetter = nameGetter;
        this.randomService = randomService;
        this.purposeSelector = new RandomAdventureElementSelectionService(randomService, [
            'Data Vault',
            'Propaganda Broadcast Facility',
            'Shipyard / Repair Facility',
            'Garrison / Barracks',
            'Academy',
            'Supply Depot',
            'Hangar / Vehicle Bays',
            'Research Facility',
            'Headquarters',
            'Detention Centre'
        ]);
        this.locationSelector = new RandomAdventureElementSelectionService(randomService, [
            'Asteroid Base',
            'Repulsorpad in gas giant atmosphere',
            'Within an urban center',
            'Space Station',
            'Underground / cave network',
            'Underwater',
            'Ice base',
            'Deep in the jungle',
            'Sea side',
            'Volcano base'
        ]);
        this.statusSelector = new RandomAdventureElementSelectionService(randomService, [
            'Abandoned',
            'Taken over by criminals',
            'Taken over by Rebels',
            'Fully operational',
            'Fully operational',
            'Fully operational',
            'Short staffed',
            'Over staffed (regular personnel + trainees)',
            'Under construction',
            'Commander is corrupt'
        ]);
    }
    Object.defineProperty(BaseGenerator.prototype, "name", {
        get: function () {
            return this.nameGetter();
        },
        enumerable: true,
        configurable: true
    });
    BaseGenerator.prototype.generate = function () {
        return {
            name: this.name,
            purpose: this.purposeSelector.select(),
            location: this.locationSelector.select(),
            status: this.statusSelector.select()
        };
    };
    return BaseGenerator;
}());
exports.BaseGenerator = BaseGenerator;
var ElementGeneratorWrapper = /** @class */ (function () {
    function ElementGeneratorWrapper(generateAction) {
        this.generateAction = generateAction;
    }
    Object.defineProperty(ElementGeneratorWrapper.prototype, "name", {
        get: function () {
            return 'ElementGeneratorWrapper';
        },
        enumerable: true,
        configurable: true
    });
    ElementGeneratorWrapper.prototype.generate = function () {
        return this.generateAction();
    };
    return ElementGeneratorWrapper;
}());
//# sourceMappingURL=imperial-mission-generator.js.map