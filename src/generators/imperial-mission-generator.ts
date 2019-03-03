import { RandomService } from './random-service';
import { StarWarsAdventureGenerator } from './star-wars-adventure-generator';

// Initial Data source: http://www.d20radio.com/main/holonet-uplink-old-school-chart-cool-imperial-mission-generator/
export class ImperialMissionGenerator {
    private missionSelector: RandomAdventureElementSelectionService<AdventureMission>;
    private locationSelector: RandomAdventureElementSelectionService<AdventureLocation>;
    private oppositionSelector: RandomAdventureElementSelectionService<AdventureOpposition>;
    private twistSelector: RandomAdventureElementSelectionService<AdventureTwist>;

    constructor(private randomService: RandomService, private starWarsAdventureGenerator: StarWarsAdventureGenerator) {
        this.missionSelector = new RandomAdventureElementSelectionService<AdventureMission>(randomService, [
            new RandomAdventureElementSelectionService<AdventureMission>(randomService, [
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
            new ElementGeneratorWrapper<AdventureMission>(() => {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('theme', 1, true);
                return {
                    name: swAdv.theme[0]
                };
            })
        ]);
        this.locationSelector = new RandomAdventureElementSelectionService<AdventureLocation>(randomService, [
            new RandomAdventureElementSelectionService<AdventureLocation>(randomService, [
                new BaseGenerator(() => 'Rebel Base', randomService),
                'Hutt Space',
                'Backwater Outer Rim world',
                'An Imperial Core World',
                'A Penal Colony',
                'A Mining World',
                'Factory',
                'Shipyard',
                'Imperial High Society',
                new BaseGenerator(() => 'Imperial Base', randomService)
            ]),
            new ElementGeneratorWrapper<AdventureLocation>(() => {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('location', 1, true);
                return {
                    name: swAdv.location[0]
                };
            })
        ]);
        this.oppositionSelector = new RandomAdventureElementSelectionService<AdventureOpposition>(randomService, [
            new RandomAdventureElementSelectionService<AdventureOpposition>(randomService, [
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
            new ElementGeneratorWrapper<AdventureOpposition>(() => {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('antagonistOrTarget', 1, true);
                return {
                    name: swAdv.antagonistOrTarget[0]
                };
            })
        ]);
        this.twistSelector = new RandomAdventureElementSelectionService<AdventureTwist>(randomService, [
            new RandomAdventureElementSelectionService<AdventureTwist>(randomService, [
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
            new ElementGeneratorWrapper<AdventureTwist>(() => {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('twistsOrComplications', 1, true);
                return {
                    name: swAdv.twistsOrComplications[0]
                };
            }),
            new ElementGeneratorWrapper<AdventureTwist>(() => {
                var swAdv = starWarsAdventureGenerator.generateAdventureElement('dramaticReveal', 1, true);
                return {
                    name: 'Dramatic Reveal',
                    dramaticReveal: swAdv.dramaticReveal[0]
                };
            }),
            new ElementGeneratorWrapper<AdventureTwist>(() => {
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

    public generate(): Adventure {
        var generated = {
            mission: this.missionSelector.select(),
            location: this.locationSelector.select(),
            opposition: this.oppositionSelector.select(),
            twist: this.twistSelector.select()
        };
        return generated;
    }
}

export interface Adventure {
    mission: AdventureMission;
    location: AdventureLocation;
    opposition: AdventureOpposition;
    twist: AdventureTwist;
}

export interface AdventureElement {
    name: string;
}

export interface AdventureMission extends AdventureElement {}
export interface AdventureLocation extends AdventureElement {}
export interface AdventureOpposition extends AdventureElement {}
export interface AdventureTwist extends AdventureElement {}

export class RandomAdventureElementSelectionService<T extends AdventureElement> implements ElementGenerator<T> {
    name: string;
    constructor(private randomService: RandomService, private choices: Array<T | string>) {}

    public generate(): T {
        return this.select();
    }

    public select(): T {
        const randomChoice = this.randomService.pickOne(this.choices).value;
        if (typeof randomChoice === 'string') {
            if (this.isReroll(randomChoice as string)) {
                return this.select();
            }
            return this.makeAdventureElementFrom(randomChoice as string);
        }
        return this.handlerTypedElement(randomChoice as T);
    }

    private makeAdventureElementFrom(choice: string): T {
        return {
            name: choice
        } as T;
    }

    private handlerTypedElement(generated: T): T {
        var generator = (generated as unknown) as ElementGenerator<T>;
        if (generator != null) {
            return generator.generate();
        }
        return generated;
    }

    public isReroll(value: string): boolean {
        return value.startsWith('/reroll');
    }
}

export interface ElementGenerator<T extends AdventureElement> extends AdventureElement {
    generate(): T;
}

export interface BasePurpose extends AdventureElement {}
export interface BaseLocation extends AdventureElement {}
export interface BaseStatus extends AdventureElement {}

export interface Base extends AdventureLocation {
    purpose: BasePurpose;
    location: BaseLocation;
    status: BaseStatus;
}

export class BaseGenerator implements ElementGenerator<AdventureLocation> {
    private purposeSelector: RandomAdventureElementSelectionService<BasePurpose>;
    private locationSelector: RandomAdventureElementSelectionService<BaseLocation>;
    private statusSelector: RandomAdventureElementSelectionService<BaseStatus>;

    public get name() {
        return this.nameGetter();
    }

    constructor(private nameGetter: NameGetter, private randomService: RandomService) {
        this.purposeSelector = new RandomAdventureElementSelectionService<BasePurpose>(randomService, [
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
        this.locationSelector = new RandomAdventureElementSelectionService<BaseLocation>(randomService, [
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
        this.statusSelector = new RandomAdventureElementSelectionService<BaseStatus>(randomService, [
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
    generate(): Base {
        return {
            name: this.name,
            purpose: this.purposeSelector.select(),
            location: this.locationSelector.select(),
            status: this.statusSelector.select()
        };
    }
}

interface NameGetter {
    (): string;
}

class ElementGeneratorWrapper<T extends AdventureElement> implements ElementGenerator<T> {
    public get name() {
        return 'ElementGeneratorWrapper';
    }
    constructor(private generateAction: GenerateAction<T>) {}
    generate(): T {
        return this.generateAction();
    }
}
interface GenerateAction<T extends AdventureElement> {
    (): T;
}
