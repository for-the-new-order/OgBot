import { RandomService } from './random-service';

export class RandomStringSelectionService {
    constructor(private randomService: RandomService, private choices: string[]) {}

    public select(amount: number = 1): string[] {
        let results = new Array<string>();
        for (let i = 0; i < amount; i++) {
            const randomChoice = this.randomService.pickOne(this.choices).value;
            if (this.isReroll(randomChoice)) {
                const rerollAmount = this.parseReroll(randomChoice);
                const combinedSelection = this.select(rerollAmount);
                results = results.concat(combinedSelection);
                continue;
            }
            results.push(randomChoice);
        }
        return results;
    }

    public isReroll(value: string): boolean {
        return value.startsWith('/reroll');
    }

    public parseReroll(value: string): number {
        try {
            return parseInt(value.replace('/reroll ', ''));
        } catch (error) {
            return 1;
        }
    }
}
