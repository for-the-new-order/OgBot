import { AlienNamesGenerator } from './alien-names-generator';
import { motivations, personalityTraits } from '../../data';
import { FormatUtility } from './format-utility';
import { RandomService } from './random-service';
import { NameGenerator } from './name-generator';

export class CharacterGenerator {
    private randomService: RandomService;
    private alienNamesGenerator = new AlienNamesGenerator(new FormatUtility());
    private nameGenerator: NameGenerator;
    constructor() {
        this.randomService = new RandomService();
        this.nameGenerator = new NameGenerator(this.randomService);
    }
    public generate(seed: number = null) {
        if (seed) {
            this.randomService.seed = seed;
        }
        const initialSeed = this.randomService.seed;
        const alienNames = [];
        const firstNames = [];
        const surnames = [];
        const places = [];
        for (let index = 0; index < 5; index++) {
            alienNames.push(this.alienNamesGenerator.generate());
            firstNames.push(this.nameGenerator.firstname());
            surnames.push(this.nameGenerator.surname());
            places.push(this.nameGenerator.place());
        }
        return {
            initialSeed: initialSeed,
            names: {
                aliens: alienNames,
                firstNames,
                surnames
            },
            places: places,
            personality: this.randomService.pickOne(personalityTraits).value,
            motivation: {
                desires: this.randomService.pickOne(motivations.desires).value,
                fear: this.randomService.pickOne(motivations.fear).value,
                strength: this.randomService.pickOne(motivations.strength)
                    .value,
                flaw: this.randomService.pickOne(motivations.flaw).value
            }
        };
    }
}
export interface Motivation {
    name: string;
    description: string;
}
