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
        'Thr',
    ];
    private maleSuffix = ['aim', 'ain', 'ak', 'ar', 'i', 'im', 'in', 'o', 'or', 'ur'];
    private femaleSuffix = ['a', 'ala', 'ana', 'ip', 'ia', 'ila', 'ina', 'on', 'ola', 'ona'];
    private strongholdSuffix = [
        'ack',
        'hak',
        'arr',
        'hig',
        'bek',
        'jak',
        'dal',
        'kak',
        'duum',
        'lode',
        'dukr',
        'malk',
        'eft',
        'mek',
        'est',
        'rak',
        'fik',
        'tek',
        'gak',
        'zak',
    ];

    private spacerChars = ['', 'b', 'd', 'f', 'g', 'k', 'm', 't', 'v', 'z'];

    private formatUtility = new FormatUtility();
    constructor(private randomService: RandomService) {}

    public firstName(gender: Gender): DwarfName {
        const prefix = this.randomService.pickOne(this.prefixes).value;
        const suffixCollection = gender == Gender.Female ? this.femaleSuffix : this.maleSuffix;
        const suffix = this.randomService.pickOne(suffixCollection).value;
        return {
            names: this.spacerChars.map((spacer) => this.formatUtility.capitalize((prefix + spacer + suffix).toLowerCase())),
            gender,
            prefix,
            suffix,
        };
    }

    // public surname(): string {
    //     return this.formatUtility.capitalize(this.randomService.pickOne(nameData.all.surname).value.toLowerCase());
    // }
    public strongholdName(): StrongholdName {
        var strongholdName = new StrongholdName();
        strongholdName.suffix = this.randomService.pickOne(this.strongholdSuffix).value;
        var numberOfPrefixes = this.randomService.getRandomInt(1, 4);
        for (let i = 0; i < numberOfPrefixes.value; i++) {
            const prefix = this.randomService.pickOne(this.prefixes).value;
            strongholdName.prefixes.push(prefix);
        }

        var spacers1 = [
            '',
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
        ];
        var spacers2 = [
            '',
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
        ];
        var spacers3 = [
            '',
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
        ];
        var spacers4 = [
            '',
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
            this.randomService.pickOne(this.spacerChars).value,
        ];
        for (let i = 0; i < 5; i++) {
            strongholdName.names.push(this.genStrongholdName(strongholdName, [spacers1[i], spacers2[i], spacers3[i], spacers4[i]]));
        }
        return strongholdName;
    }

    private genStrongholdName(strongholdName: StrongholdName, spacers: string[]): string {
        var name = '';
        for (let i = 0; i < strongholdName.prefixes.length; i++) {
            name += strongholdName.prefixes[i] + spacers[i];
        }
        name += strongholdName.suffix;
        return this.formatUtility.capitalize(name.toLowerCase());
    }
}

export interface DwarfName {
    gender: Gender;
    prefix: string;
    suffix: string;
    names: string[];
}

export class Stronghold {
    names: StrongholdName;
}

export class StrongholdName {
    prefixes: string[] = [];
    suffix: string;
    names: string[] = [];
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

// !og g place -count 10
// !og g dwarfname
// !og g dwarfname -count 5
// !og g dwarfname -count 5 -gender f
// !og g dwarfname -gender f|m
// !og g dwarfstrongholdname
