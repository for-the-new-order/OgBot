import { nameData } from '../../data';
import { RandomService } from './random-service';
import { FormatUtility } from './format-utility';

export class NameGenerator {
    private formatUtility = new FormatUtility();
    constructor(private randomService: RandomService) {}

    public firstname(): string {
        return this.randomService.pickOne(nameData.all.firstname).value;
    }

    public surname(): string {
        return this.formatUtility.capitalize(
            this.randomService.pickOne(nameData.all.surname).value.toLowerCase()
        );
    }

    public place(): string {
        return this.randomService.pickOne(nameData.all.places).value;
    }
}
