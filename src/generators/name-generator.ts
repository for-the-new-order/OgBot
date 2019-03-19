import { nameData } from '../../data';
import { RandomService } from './random-service';
import { FormatUtility } from './format-utility';
import { WeightenGenerator, WeightenElement } from '../CentralCasting/AlignmentAndAttitudeGenerator';
import { stringify } from 'querystring';

export class NameGenerator {
    private formatUtility = new FormatUtility();
    private droidNameGenerator: DroidNameGenerator;
    constructor(private randomService: RandomService) {
        this.droidNameGenerator = new DroidNameGenerator(randomService);
    }

    public firstname(gender: Gender): string {
        const names = gender == Gender.Female ? nameData.gutenberg.firstname.female : nameData.gutenberg.firstname.male;
        return this.randomService.pickOne(names).value;
    }

    public surname(): string {
        return this.formatUtility.capitalize(this.randomService.pickOne(nameData.all.surname).value.toLowerCase());
    }

    public place(): string {
        return this.randomService.pickOne(nameData.all.places).value;
    }

    public droid(): string {
        return this.droidNameGenerator.generate();
    }
}

export enum Gender {
    Female = 'Female',
    Male = 'Male',
    Unknown = 'Unknown'
}

export class DroidNameGenerator {
    private dashGenerator: WeightenGenerator<DroidNameBuilder, number, WeightenElement<DroidNameBuilder, number>>;

    private firstChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>;
    private secondChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>;
    private thirdChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>;

    private secFirstChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>;
    private secSecondChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>;
    private secThirdChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>;

    private specChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>;

    constructor(private randomService: RandomService) {
        this.dashGenerator = new WeightenGenerator(this.randomService, [
            { weight: 1, generate: () => 0 },
            { weight: 98, generate: () => 1 },
            { weight: 1, generate: () => 2 }
        ]);

        // Before first dash
        this.firstChar = new WeightenGenerator(this.randomService, [
            { weight: 10, generate: () => Type.Character },
            { weight: 1, generate: () => Type.Number }
        ]);
        this.secondChar = new WeightenGenerator(this.randomService, [
            { weight: 17, generate: () => Type.Character },
            { weight: 10, generate: () => Type.Number }
        ]);
        this.thirdChar = new WeightenGenerator(this.randomService, [
            { weight: 2, generate: () => Type.Character },
            { weight: 1, generate: () => Type.Number }
        ]);

        // Second part (after first dash)
        this.secFirstChar = new WeightenGenerator(this.randomService, [
            { weight: 3, generate: () => Type.Character },
            { weight: 5, generate: () => Type.Number }
        ]);
        this.secSecondChar = new WeightenGenerator(this.randomService, [
            { weight: 2, generate: () => Type.Character },
            { weight: 3, generate: () => Type.Number }
        ]);
        this.secThirdChar = new WeightenGenerator(this.randomService, [
            { weight: 4, generate: () => Type.Character },
            { weight: 3, generate: () => Type.Number }
        ]);

        // specChar
        this.specChar = new WeightenGenerator(this.randomService, [
            { weight: 5, generate: () => Type.Character },
            { weight: 5, generate: () => Type.Number }
        ]);
    }

    generate(): string {
        const builder = new DroidNameBuilder();
        builder.dashAmount = this.dashGenerator.generate(builder);
        // gen block 1
        const blockGenerator = new BlockGenerator(this.randomService, this.firstChar, this.secondChar, this.thirdChar);
        let name = blockGenerator.generate(builder);
        if (builder.dashAmount > 0) {
            //gen block 2
            const blockGenerator = new BlockGenerator(this.randomService, this.secFirstChar, this.secSecondChar, this.secThirdChar);
            name += '-';
            name += blockGenerator.generate(builder);
        }
        if (builder.dashAmount > 1) {
            // gen block 3
            const blockGenerator = new BlockGenerator(this.randomService, this.specChar, this.specChar, this.specChar);
            name += '-';
            name += blockGenerator.generate(builder);
        }
        return name;
    }
}

class BlockGenerator {
    private blockLengthGenerators: Array<WeightenGenerator<DroidNameBuilder, number, WeightenElement<DroidNameBuilder, number>>>;
    private charGenerator: CharGenerator;
    constructor(
        private randomService: RandomService,
        private firstChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>,
        private secondChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>,
        private thirdChar: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>
    ) {
        this.blockLengthGenerators = [
            new WeightenGenerator(this.randomService, [
                { weight: 2, generate: () => 1 },
                { weight: 8, generate: () => 2 },
                { weight: 1, generate: () => 3 }
            ]),
            new WeightenGenerator(this.randomService, [
                { weight: 7, generate: () => 1 },
                { weight: 18, generate: () => 2 },
                { weight: 7, generate: () => 3 }
            ]),
            new WeightenGenerator(this.randomService, [
                { weight: 9, generate: () => 1 },
                { weight: 26, generate: () => 2 },
                { weight: 8, generate: () => 3 }
            ])
        ];
        this.charGenerator = new CharGenerator(randomService);
    }

    generate(builder: DroidNameBuilder): string {
        const length = this.blockLengthGenerators[builder.currentBlock++].generate(builder);
        let block = this.generateChar(builder, this.firstChar);
        if (length > 1) {
            block += this.generateChar(builder, this.secondChar);
        }
        if (length > 2) {
            block += this.generateChar(builder, this.thirdChar);
        }
        return block;
    }

    private generateChar(
        builder: DroidNameBuilder,
        generator: WeightenGenerator<DroidNameBuilder, Type, WeightenElement<DroidNameBuilder, Type>>
    ): string {
        const type = generator.generate(builder);
        if (type == Type.Character) {
            return this.charGenerator.generateCharacter();
        } else {
            return this.charGenerator.generateNumber();
        }
    }
}

class CharGenerator {
    constructor(private randomService: RandomService) {}

    public static get A(): number {
        return 'A'.charCodeAt(0);
    }
    public static get Z(): number {
        return 'Z'.charCodeAt(0);
    }

    public generateCharacter(): string {
        return String.fromCharCode(this.randomService.getRandomInt(CharGenerator.A, CharGenerator.Z).value);
    }
    public generateNumber(): string {
        return this.randomService.getRandomInt(0, 9).value.toString();
    }
}
class DroidNameBuilder {
    dashAmount: number;
    currentBlock: number = 0;
}

enum Type {
    Character = 'Character',
    Number = 'Number'
}
//private DroidNameElements = "ghtfaz";
/*
---[ PATTERNS ]---
A-A-A (0-0-0)
---
A   -00
A   -0AA
AA  -AA
AA  -0
AA  -0A
AA  -00
AA  -0A0
AAA -000
AAAA-00
A0  -A0
A0  -A00
A0  -AA
0A0
0   -0A
0   -AAA
---[ DONE ]---
O-O-O (triple 0)

C  -21
R4 -P17
2  -1B
WAC-47
R2 -KT
QT -KT
EV -9D9
BB -8
BT -1 (Bee Tee)
T3 -M4
AZ -3
R2 -D2
C  -3PO
HK -47
R3 -S6
8D8
ASN-121
I  -5YQ
4  -LOM
IG -88
M5 -BZ
ZZ -4Z (nick named ZeeZee)
R5 -D2
R5 -G8
M  -3PO
EW -3
WA -7
R5 -D4
TC -14
FA -4
T3 -H8
TT -40
GH -7 



*/
