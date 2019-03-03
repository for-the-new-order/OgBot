"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Initial Data source: http://www.d20radio.com/main/holonet-uplink-old-school-chart-cool-imperial-mission-generator/
var ImperialMissionGenerator = /** @class */ (function () {
    function ImperialMissionGenerator(randomService) {
        this.randomService = randomService;
        this.missionSelector = new RandomAdventureElementSelectionService(randomService, [
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
        ]);
        this.locationSelector = new RandomAdventureElementSelectionService(randomService, [
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
        ]);
        this.oppositionSelector = new RandomAdventureElementSelectionService(randomService, [
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
        ]);
        this.twistSelector = new RandomAdventureElementSelectionService(randomService, [
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
    RandomAdventureElementSelectionService.prototype.select = function () {
        var randomChoice = this.randomService.pickOne(this.choices).value;
        if (typeof randomChoice === 'string') {
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
//# sourceMappingURL=imperial-mission-generator.js.map