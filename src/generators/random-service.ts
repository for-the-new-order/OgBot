import { SeedableValue } from './random-service';
import { engines, integer } from 'random-js';

export class RandomService {
    private _seed: number;
    private randomEngine = engines.mt19937();

    constructor() {
        this.reseed();
    }

    public pickOne<T>(values: Array<T>): SeedableValue<T> {
        const rnd = this.getRandomInt(0, values.length - 1);
        return {
            seed: rnd.seed,
            value: values[rnd.value]
        };
    }

    public getRandomInt(min, max): SeedableValue<number> {
        const seed = this.seed++;
        this.randomEngine.seed(seed);
        const distribution = integer(min, max);
        return {
            seed: seed,
            value: distribution(this.randomEngine)
        };
    }

    public get seed(): number {
        return this._seed;
    }
    public set seed(value: number) {
        this._seed = value;
    }

    public reseed(): void {
        this.seed = Math.floor(Math.random() * Math.floor(500000));
    }
}

export interface SeedableValue<T> {
    seed: number;
    value: T;
}
