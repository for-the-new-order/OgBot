import { engines, integer } from 'random-js';
import { motivations, personalityTraits } from './data';

export class CharacterGenerator {
    private seed: number;
    constructor(private randomEngine = engines.mt19937()) {
        this.seed = Math.floor(Math.random() * Math.floor(5000));
    }
    public generate() {
        return {
            personality: this.pickAString(personalityTraits),
            motivation: {
                desires: this.pickAnObject(motivations.desires),
                fear: this.pickAnObject(motivations.fear),
                strength: this.pickAnObject(motivations.strength),
                flaw: this.pickAnObject(motivations.flaw)
            }
        };
    }
    private pickAString(values: Array<string>): string {
        return values[this.getRandomInt(values.length)];
    }
    private pickAnObject(values: Array<Motivation>): Motivation {
        return values[this.getRandomInt(values.length)];
    }

    private getRandomInt(max) {
        this.randomEngine.seed(this.seed++);
        var distribution = integer(0, max);
        return distribution(this.randomEngine);
    }
}
export interface Motivation {
    name: string;
    description: string;
}
