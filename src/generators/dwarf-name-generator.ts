import { RandomService } from './random-service';
import { FormatUtility } from './format-utility';
import { Gender } from './name-generator';

export class DwarfNameGenerator {
    private prefixes = [
        'B',
        'Gil',
        'Bal',
        'Gim',
        'Bel',
        'Kil',
        'Bof',
        'Mor',
        'Bol',
        'Nal',
        'D',
        'Nor',
        'Dal',
        'Ov',
        'Dor',
        'Th',
        'Dw',
        'Thor',
        'Far',
        'Thr ',
    ];
    private maleSuffix = ['aim', 'ain', 'ak', 'ar', 'i', 'im', 'in', 'o', 'or', 'ur'];
    private femaleSuffix = ['a', 'ala', 'ana', 'ip', 'ia', 'ila', 'ina', 'on', 'ola', 'ona'];

    private spacerChars = ['', 'b', 'd', 'f', 'g', 'k', 'm', 't', 'v', 'z'];

    private formatUtility = new FormatUtility();
    constructor(private randomService: RandomService) {}

    public firstName(gender: Gender): string[] {
        const prefix = this.randomService.pickOne(this.prefixes).value;
        const suffixCollection = gender == Gender.Female ? this.femaleSuffix : this.maleSuffix;
        const suffix = this.randomService.pickOne(suffixCollection).value;
        return this.spacerChars.map((spacer) => prefix + spacer + suffix);
    }

    // public surname(): string {
    //     return this.formatUtility.capitalize(this.randomService.pickOne(nameData.all.surname).value.toLowerCase());
    // }
    // public strongholdName(): StrongholdName {
    //     //...
    // }
}

export class Stronghold {
    names: StrongholdName;
}

export class StrongholdName {
    prefixes: string[];
    suffix: string;
    names: string[];
}

// TODO: generate
enum StrongholdType {
    Major = 'Major',
    Secondary = 'Secondary',
    Outpost = 'Outpost',
    Ghetto = 'Ghetto',
    TradeEnclave = 'Trade Enclave',
    Family = 'Family',
}
