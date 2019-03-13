import { RandomService } from './random-service';

export class SpaceTrafficGenerator {
    private spaceshipGenerator: SpaceshipGenerator;
    constructor(private randomService: RandomService) {
        this.spaceshipGenerator = new SpaceshipGenerator(randomService);
    }
    public generate(options: SpaceTrafficOptions): SpaceTraffic {
        if (options.amount == null) {
            options.amount = this.randomService.getRandomInt(1, 10).value;
        }
        const density = this.randomService.pickOne(new Array<Dencity>('Light', 'Normal', 'Normal', 'Normal', 'Dense')).value;
        var result = { density: density, ships: new Array<Spaceship>() };
        for (let i = 0; i < options.amount; i++) {
            const ship = this.spaceshipGenerator.generate();
            result.ships.push(ship);
        }
        return result;
    }
}

// 866: Spacecraft
class SpaceshipGenerator {
    private spaceshipTypeGenerator: BaseGenerator<RandomElement>;
    private spaceCapabilitiesGenerator: BaseGenerator<RandomElement>;
    private armamentGenerator: BaseGenerator<RandomElement>;
    private specialFeaturesGenerator: RerollGenerator;
    private liabilitiesGenerator: RerollGenerator;
    constructor(private randomService: RandomService) {
        // prettier-ignore
        this.spaceshipTypeGenerator = new BaseGenerator<RandomElement>(this.randomService, [
            { weight: 3, generate: () => ({ name: 'Small fighter craft', description: 'One or two pilots are all this small military ship can carry.' }) },
            { weight: 3, generate: () => ({ name: 'Scout ship', description: 'A small maneuverable craft capable of traversing space and exploring a planet.' }) },
            { weight: 2, generate: () => ({ name: 'Small yacht', description: 'A small personal space craft.' }) },
            { weight: 1, generate: () => ({ name: 'Large yacht', description: 'A large private passenger craft.' }) },
            { weight: 4, generate: () => ({ name: 'Small freighter', description: 'Designed to carry small amounts of goods.' }) },
            { weight: 2, generate: () => ({ name: 'Large freighter', description: 'Designed to haul large quantities of goods.' }) },
            { weight: 1, generate: () => ({ name: 'Factory ship', description: 'A large, ungainly craft designed to process raw materials into usable form. Usually they are heavily automated with minimal crew.' }) },
            { weight: 1, generate: () => ({ name: 'Destroyer', description: 'A small, but well-armed military ship.' }) },
            { weight: 1, generate: () => ({ name: 'Passenger liner', description: 'Large luxury ship.' }) },
            { weight: 1, generate: () => ({ name: 'Colony ship', description: 'Carries colonists to new planets.' }) },
            { weight: 1, generate: () => ({ name: 'Battlewagon', description: 'Large, heavily armed military ship.' }) }
        ]);
        // prettier-ignore
        this.spaceCapabilitiesGenerator = new BaseGenerator<RandomElement>(this.randomService, [
            { weight: 1, generate: () => ({ name: 'Orbital Only', description: 'No interplanetary capability.' }) },
            { weight: 1, generate: () => ({ name: 'No hyperdrive', description: 'Travel to nearby planets & moons, inside the star system.' }) },
            { weight: 2, generate: () => ({ name: 'Basic hyperspace', description: "Travel to nearby systems" }) },
            { weight: 12, generate: () => ({ name: 'Hyperspace capable', description: 'Can travel to anyplace in the galaxy.' }) }
        ]);
        // prettier-ignore
        this.armamentGenerator = new BaseGenerator<RandomElement>(this.randomService, [
            { weight: 5, generate: () => ({ name: 'None', description: 'Ship carries no weapons.' }) },
            { weight: 6, generate: () => ({ name: 'Lightly-armed', description: "Carries a minimal of number of legal weaponry for defensive purposes. Doesn't belong in a fire-fight." }) },
            { weight: 6, generate: () => ({ name: 'Well-armed', description: 'Carries enough weaponry to make others think twice before attacking it. Has a fair offensive strike capability.' }) },
            { weight: 2, generate: () => ({ name: 'Heavily-armed', description: 'This is a battle ship, well protected and capable of massive amounts of offensive destruction.' }) },
            { weight: 1, generate: (spaceship) => {
                if (spaceship.type !== "Battlewagon"){
                    return this.armamentGenerator.generate(spaceship);
                }
                return ({ name: 'Planet-buster', description: 'The unbelievable firepower in this spacecraft could level a planet' });
            } }
        ]);
        // prettier-ignore
        this.specialFeaturesGenerator = new RerollGenerator(
            new BaseGenerator<RandomElement>(this.randomService, [
                { weight: 5, generate: () => ({ name: 'None', description: 'Nothing special.' }) },
                { weight: 2, generate: () => {
                        // TODO: Develop a personality for it.
                        // Roll 6 times on Table 312A: Personality Trait.
                        // Check to select personality traits.
                        // Decide whether it is "male" or "female"
                        return { name: "Personalized ship's computer", description: '' };
                } },
                { weight: 1, generate: () => {
                        // TODO: Select this item on Table 855: Techno-Wonders.
                        return { name: 'Techno-wonder Installed', description: '' };
                } },
                { weight: 2, generate: () => ({ name: 'Large cargo area', description: 'The ship has extra cargo bay.' }) },
                { weight: 3, generate: () => ({ name: 'Advanced computer', description: 'The computers are one step better (smarter, faster, more programs) than those found on similar ships.' }) },
                { weight: 2, generate: () => ({ name: 'Special defenses', description: 'Defense systems are one step better than those found on similar ships.' }) },
                { weight: 2, generate: () => {
                    // TODO: 
                    // If PC: Ship requires no crew other than the character to operate.
                    // If NPC: Ship requires no crew to operate.
                    return ({ name: 'No Crew', description: 'Ship requires no crew to operate.' });
                } },
                { weight: 1, generate: () => ({ name: 'Non-standard hyperdrive', description: 'Ship uses less fuel and jumps farther and faster than similar ships.' }) },
                { weight: 2, generate: () => ({ name: 'Reroll', description: 'Reroll twice' }) }
            ])
        );
        // prettier-ignore
        this.liabilitiesGenerator = new RerollGenerator(
            new BaseGenerator<RandomElement>(this.randomService, [
                { weight: 3, generate: () => ({ name: 'None', description: 'Everything is fine.' }) },
                { weight: 3, generate: () => ({ name: 'Alien manufacture', description: "Ship is not built to character's racial standards. Seats are wrong, controls labels are illegible and so on." }) },
                { weight: 1, generate: () => ({ name: 'Clunky hyperspace', description: 'Drive may not always function when engaged. 75% chance of working.' }) },
                { weight: 1, generate: () => ({ name: 'Small cargo area', description: 'Has half the normal cargo space' }) },
                { weight: 1, generate: () => ({ name: 'Interior unfinished', description: 'Walls lack paneling, floorsare raw metal, loose wiring hangs everywhere.' }) },
                { weight: 1, generate: () => {
                    const extraConsumption = this.randomService.getRandomInt(1, 100).value;
                    return ({ name: 'Fuel eater', description: `Inefficient hyperdrive consumes ${extraConsumption}% more fuel than a similar ships.` });
                } },
                { weight: 1, generate: () => {
                    // TODO: GM Only: See entry #866 on Table 967: GM's Specials
                    return ({ name: 'TODO', description: '...' });
                } },
                { weight: 1, generate: () => {
                    const amountOfShips = this.randomService.getRandomInt(1, 6).value;
                    return ({ name: 'Junker', description: `Ship is built out of salvage. At least ${amountOfShips} different ships went into her construction.` });
                } },
                { weight: 1, generate: () => ({ name: 'Old ship', description: "Ship was playing the spaceways when the character's granddad was a boy." }) },
                { weight: 1, generate: () => ({ name: 'Ancient ship', description: 'Ship is very old, possibly dating back to the beginning of star travel.' }) },
                { weight: 1, generate: () => {
                    const extraCost = this.randomService.getRandomInt(1, 100).value;
                    return ({ name: 'Custom job', description: `Most systems are nonstandard. Repairs are ${extraCost}% more costly than normal.` });
                } },
                { weight: 1, generate: () => ({ name: 'Recognizable ship', description: 'The ship stands out from other ships. Even common folk know her by name.' }) },
                { weight: 1, generate: () => ({ name: 'Infested', description: 'The ship is overrun by parasites.' }) },
                { weight: 1, generate: () => {
                    const extraCrew = this.randomService.getRandomInt(2, 8).value * 50; // 50, 100, ..., 400%
                    return ({ name: 'Large Crew', description: `Ship requires a large crew to run, at least ${extraCrew}% more crew than a similar ship.` });
                } },
                { weight: 2, generate: () => ({ name: 'Reroll', description: 'Reroll twice' }) }
            ])
        );
    }
    public generate(): Spaceship {
        var ship = new Spaceship();
        ship.type = this.spaceshipTypeGenerator.generate(ship);
        ship.spaceCapabilities = this.spaceCapabilitiesGenerator.generate(ship);
        ship.armament = this.armamentGenerator.generate(ship);
        ship.specialFeatures = this.specialFeaturesGenerator.generate(ship);
        ship.liabilities = this.liabilitiesGenerator.generate(ship);
        return ship;
    }
}

interface SpaceTraffic {
    ships: Spaceship[];
    density: Dencity;
}

declare type Dencity = 'Light' | 'Normal' | 'Dense';

export interface SpaceTrafficOptions {
    amount?: number;
}

class Spaceship {
    type: SpaceshipType;
    spaceCapabilities: DescriptiveName;
    armament: DescriptiveName;
    specialFeatures: DescriptiveName[];
    liabilities: DescriptiveName[];
}

interface DescriptiveName {
    name: string;
    description: string;
}

interface SpaceshipType {}

interface Generator<T extends DescriptiveName> {
    generate(spaceship: Spaceship): T;
}

interface RandomElement extends Generator<DescriptiveName> {
    weight: number;
}

class BaseGenerator<TInput extends RandomElement> implements Generator<DescriptiveName> {
    protected elements: TInput[];

    constructor(protected randomService: RandomService, elements: TInput[]) {
        this.elements = new Array<TInput>();
        elements.forEach(element => {
            for (let i = 0; i < element.weight; i++) {
                this.elements.push(element);
            }
        });
    }
    generate(spaceship: Spaceship): DescriptiveName {
        const result = this.randomService.pickOne(this.elements).value;
        return result.generate(spaceship);
    }
}

class RerollGenerator {
    constructor(private generator: BaseGenerator<RandomElement>) {}
    generate(spaceship: Spaceship): DescriptiveName[] {
        var result = new Array<DescriptiveName>();
        const element = this.generator.generate(spaceship);
        if (element.name == 'Reroll') {
            var result1 = this.generate(spaceship);
            var result2 = this.generate(spaceship);
            result.push(...result1);
            result.push(...result2);
        } else {
            result.push(element);
        }
        return result;
    }
}
