import { RandomService } from './random-service';
import { SpaceshipGenerator, Spaceship } from '../CentralCasting/SpaceshipGenerator';

export class SpaceTrafficGenerator {
    private spaceshipGenerator: SpaceshipGenerator;
    constructor(private randomService: RandomService) {
        this.spaceshipGenerator = new SpaceshipGenerator(randomService);
    }
    public generate(options: SpaceTrafficOptions): SpaceTraffic {
        let amount = options.amount;
        if (amount == 0) {
            amount = this.randomService.getRandomInt(1, 5).value;
        }
        const density = this.randomService.pickOne(new Array<Density>('Light', 'Normal', 'Normal', 'Normal', 'Dense')).value;
        var result = { options: { amount }, density: density, ships: new Array<Spaceship>() };
        for (let i = 0; i < amount; i++) {
            const ship = this.spaceshipGenerator.generate();
            result.ships.push(ship);
        }
        return result;
    }
}

export declare type Density = 'Light' | 'Normal' | 'Dense';

export interface SpaceTraffic {
    ships: Spaceship[];
    density: Density;
}

export interface SpaceTrafficOptions {
    amount?: number;
}
