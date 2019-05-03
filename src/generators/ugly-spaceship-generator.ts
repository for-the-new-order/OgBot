import { RandomService } from './random-service';

export class UglySpaceshipGenerator {
    private uglyBodies: Array<UglyBody>;
    private uglyWeaponGenerator: UglyWeaponGenerator;
    constructor(private randomService: RandomService) {
        const allUglyEngines = [
            new UglyEngine('Y-wing', 3, 2, 3, 0),
            new UglyEngine('TIE', 1, 2, 4, 0),
            new UglyEngine('Z-95', 3, 2, 3, 0),
            new UglyEngine('CloakShape', 2, 1, 3, 0),
            new UglyEngine('R-41', 2, 2, 3, 0),
            new UglyEngine('V-wing', 2, 1, 4, 0),
            new UglyEngine('Eta-2', 1, 1, 4, 1),
            new UglyEngine('C-73', 2, 1, 3, 0),
            new UglyEngine('Toscan 8-Q', 2, 2, 3, 0),
            new UglyEngine('ARC-170', 3, 2, 3, 0),
            new UglyEngine('Z-95 MK I', 1, 2, 3, 0),
            new UglyEngine('X-wing', 3, 2, 4, 0),
            new UglyEngine('Pinook', 2, 1, 3, -1)
        ];
        const allUglyWing = [
            new UglyWing('Y-wing', 2, 2, -1, 0, randomService, new UglyEngine('Y-wing', 3, 2, 3, 0)),
            new UglyWing('TIE/LN', 2, 2, 1, 0, randomService, ...allUglyEngines),
            new UglyWing('Z-95', 2, 2, 1, 2, randomService, ...allUglyEngines),
            new UglyWing('CloakShape', 3, 2, -1, 2, randomService, ...allUglyEngines),
            new UglyWing('R-41', 2, 2, 0, 2, randomService, ...allUglyEngines),
            new UglyWing('V-wing', 2, 2, 0, 3, randomService, ...allUglyEngines),
            new UglyWing('TIE/IN', 2, 3, 2, 3, randomService, ...allUglyEngines),
            new UglyWing('TIE/D', 2, 3, 1, 4, randomService, ...allUglyEngines),
            new UglyWing('Eta-2', 2, 2, 1, 1, randomService, ...allUglyEngines),
            new UglyWing('C-73', 2, 2, 0, 2, randomService, ...allUglyEngines),
            new UglyWing('Toscan 8-Q', 2, 2, 0, 1, randomService, ...allUglyEngines),
            new UglyWing('ARC-170', 3, 2, 1, 4, randomService, ...allUglyEngines),
            new UglyWing('Z-95 MK I', 2, 1, 0, 2, randomService, ...allUglyEngines),
            new UglyWing('Z-95 MK I', 2, 1, 1, 2, randomService, ...allUglyEngines),
            new UglyWing('X-wing', 2, 2, 1, 4, randomService, ...allUglyEngines),
            new UglyWing('Tri-Fighter', 3, 2, -1, 3, randomService, ...allUglyEngines),
            new UglyWing('Pinook ', 2, 1, 0, 1, randomService, ...allUglyEngines),
            new UglyWing('T-16', 1, 1, 0, 0, randomService, ...allUglyEngines),
            new UglyWing('T-16', 1, 1, 1, 0, randomService, ...allUglyEngines)
        ];
        this.uglyBodies = [
            new UglyBody('Y-wing', 6, 3, PlanetaryRange.Close, 1, 1, 0, 5, 3, randomService, ...allUglyWing),
            new UglyBody('TIE', 3, 2, PlanetaryRange.Close, 1, 0, 0, 2, 2, randomService, ...allUglyWing),
            new UglyBody('Z-95', 4, 2, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService, ...allUglyWing),
            new UglyBody('CloakShape', 5, 2, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService, ...allUglyWing),
            new UglyBody('R-41 ', 4, 2, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService, ...allUglyWing),
            new UglyBody('V-wing', 3, 2, PlanetaryRange.Close, 1, 0, 0, 2, 2, randomService, ...allUglyWing),
            new UglyBody('Eta-2', 2, 2, PlanetaryRange.Close, 1, 0, 0, 3, 2, randomService, ...allUglyWing),
            new UglyBody('C-73', 3, 3, PlanetaryRange.Close, 1, 0, 0, 1, 2, randomService, ...allUglyWing),
            new UglyBody('Toscan 8-Q', 4, 3, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService, ...allUglyWing),
            new UglyBody('ARC-170', 6, 3, PlanetaryRange.Close, 1, 0, 2, 3, 3, randomService, ...allUglyWing),
            new UglyBody('Z-95 MK I', 4, 2, PlanetaryRange.Close, 1, 0, 0, 3, 2, randomService, ...allUglyWing),
            new UglyBody('X-wing', 5, 3, PlanetaryRange.Close, 1, 0, 0, 3, 3, randomService, ...allUglyWing),
            new UglyBody('Pinook', 3, 2, PlanetaryRange.Close, 1, 0, 0, 2, 2, randomService, ...allUglyWing)
        ];
        this.uglyWeaponGenerator = new UglyWeaponGenerator(randomService);
    }
    public generate(): VehicleSheet {
        const maxHandling = 2;
        const sheet = new VehicleSheet();
        const body = this.randomService.pickOne(this.uglyBodies).value;
        const wing = body.generateWings();
        const engine = wing.generateEngine();
        const description = this.makeUglyDescription(body, wing, engine);
        const weapons = this.uglyWeaponGenerator.generate(body.weaponPoints + wing.weaponPoints);
        sheet.name = this.makeUglyName(body, wing, engine);
        sheet.description.push(description);
        sheet.characteristics.silhouette = 3;
        sheet.characteristics.max_speed = engine.speed;
        sheet.characteristics.handling = Math.min(maxHandling, wing.handling + engine.handling);
        sheet.characteristics.hull_trauma.threshold = body.hullTrauma + wing.hullTrauma + engine.hullTrauma;
        sheet.characteristics.system_strain.threshold = body.systemStrain + wing.systemStrain + engine.systemStrain;
        sheet.characteristics.protection.armor = body.armor;
        sheet.characteristics.protection.defense = 0;
        sheet.skill = 'Piloting';
        sheet.complement = this.makeComplement(body);
        weapons.forEach(weapon => {
            sheet.weapons.push(new VehicleSheetWeapon(weapon.name, weapon.stats));
        });
        //this.addDebugInfo(sheet, body, wing, engine);
        return sheet;
    }

    private addDebugInfo(sheet: VehicleSheet, body: UglyBody, wing: UglyWing, engine: UglyEngine) {
        sheet.sources = {
            weaponPoints: body.weaponPoints + wing.weaponPoints
        };

        // sheet.sources.body = Object.assign({} as any, body);
        // sheet.sources.wing = Object.assign({} as any, wing);
        // sheet.sources.engine = Object.assign({} as any, engine);
        // delete sheet.sources.body.wings;
        // delete sheet.sources.body.randomService;
        // delete sheet.sources.wing.engines;
        // delete sheet.sources.wing.randomService;
    }

    private makeUglyName(uglyBody: UglyBody, uglyWing: UglyWing, uglyEngine: UglyEngine): string {
        return `Ugly's ${uglyBody.name} body & ${uglyWing.name} wings & ${uglyEngine.name} engine`;
    }

    private makeUglyDescription(uglyBody: UglyBody, uglyWing: UglyWing, uglyEngine: UglyEngine): string {
        return `The ugly's is composed of a ${uglyBody.name} body, ${uglyWing.name} wings and what looks like a ${uglyEngine.name} engine.`;
    }

    private makeComplement(uglyBody: UglyBody): string {
        let complement = `${uglyBody.pilots} pilot(s)`;
        complement += uglyBody.gunners > 0 ? `, ${uglyBody.gunners} gunner(s)` : '';
        complement += uglyBody.others > 0 ? `, ${uglyBody.others} others(s)` : '';
        return complement;
    }
}

export class VehicleSheet {
    name: string;
    image_path: string = '/assets/images/vehicles/250x250-generic.png';
    description: Array<string> = [];
    characteristics: VehicleCharacteristics = new VehicleCharacteristics();
    skill: 'Driving' | 'Piloting' | 'Operating';
    complement: string = '';
    passenger_capacity: string = 'None';
    consumables: string = '';
    encumbrance_capacity: number = 0;
    cost: ItemCost = new ItemCost();
    weapons: Array<VehicleSheetWeapon> = [];
    sources: any;
}
export class VehicleSheetWeapon {
    constructor(public name: string, public specs: string) {}
}
export class ItemCost {
    price: number = 0;
    rarity: number = 0;
}
export class VehicleCharacteristics {
    silhouette: number = 0;
    max_speed: number = 0;
    handling: number = 0;
    hull_trauma: VehiclePoint = new VehiclePoint();
    system_strain: VehiclePoint = new VehiclePoint();
    protection: VehicleProtection = new VehicleProtection();
}
export class VehiclePoint {
    threshold: number = 0;
    current: number = 0;
}
export class VehicleProtection {
    defense: number = 0;
    armor: number = 0;
}

export enum PersonalRange {
    Engaged = 'Engaged',
    Short = 'Short ',
    Medium = 'Medium',
    Long = 'Long',
    Extreme = 'Extreme'
}

export enum PlanetaryRange {
    Close = 'Close',
    Short = 'Short ',
    Medium = 'Medium',
    Long = 'Long',
    Extreme = 'Extreme',
    Strategic = 'Strategic'
}

class UglyBody {
    private wings: Array<UglyWing>;
    constructor(
        public name: string,
        public hullTrauma: number,
        public systemStrain: number,
        public sensorRange: PlanetaryRange,
        public pilots: number,
        public gunners: number,
        public others: number,
        public weaponPoints: number,
        public armor: number,
        private randomService: RandomService,
        ...wings: UglyWing[]
    ) {
        this.wings = wings;
    }

    generateWings(): UglyWing {
        const wings = this.randomService.pickOne(this.wings);
        return wings.value;
    }
}

class UglyWing {
    private engines: Array<UglyEngine>;
    constructor(
        public name: string,
        public hullTrauma: number,
        public systemStrain: number,
        public handling: number,
        public weaponPoints: number,
        private randomService: RandomService,
        ...engines: UglyEngine[]
    ) {
        this.engines = engines;
    }

    generateEngine(): UglyEngine {
        const engine = this.randomService.pickOne(this.engines);
        return engine.value;
    }
}

class UglyEngine {
    constructor(
        public name: string,
        public hullTrauma: number,
        public systemStrain: number,
        public speed: number,
        public handling: number
    ) {}
}

class UglyWeapon {
    constructor(public name: string, public weaponCost: number, public stats: string) {}
}

export class UglyWeaponGenerator {
    private laserWeapons: Array<UglyWeapon>;
    private limitedAmmoWeapons: Array<UglyWeapon>;
    constructor(private randomService: RandomService) {
        this.laserWeapons = [
            new UglyWeapon('Autoblaster', 1.5, 'Fire Arc Forward; Damage 3; Critical 5; Range Close; Auto-Fire'), //1.5
            new UglyWeapon('Light Blaster Cannon', 1, 'Fire Arc Forward; Damage 4; Critical 4; Range Close;'), //1
            new UglyWeapon('Heavy blaster Cannon', 2, 'Fire Arc Forward; Damage 5; Critical 4; Range Close;'), //1.5
            new UglyWeapon('Light Ion Cannon', 2, 'Fire Arc Forward; Damage 5; Critical 4; Range Close; Ion'), //1
            new UglyWeapon('Medium Ion Cannon', 3, 'Fire Arc Forward; Damage 6; Critical 4; Range Short; Ion'), //2
            new UglyWeapon('Light Laser Cannon', 2, 'Fire Arc Forward; Damage 5; Critical 3; Range Close;'), //1
            new UglyWeapon('Twin Laser Cannons', 4, 'Fire Arc Forward; Damage 5; Critical 3; Range Close; Linked 1'), //2
            new UglyWeapon('Medium laser Cannon', 3, 'Fire Arc Forward; Damage 6; Critical 3; Range Close;'), //1
            new UglyWeapon('Quad laser cannon', 6, 'Fire Arc Forward; Damage 5; Critical 3; Range Close; Accurate, Linked 3') //6
        ];
        this.limitedAmmoWeapons = [
            new UglyWeapon(
                'Concussion missile launcher',
                3,
                'Fire Arc Forward; Damage 6; Critical 3; Range Short; Blast 4, Breach 4, Guided 3, Limited Ammo 3, Slow-Firing 1'
            ), //1.5
            new UglyWeapon(
                'Proton Torpedo Launcher',
                4,
                'Fire Arc Forward; Damage 8; Critical 2; Range Short; Blast 6, Breach 6, Guided 2, Limited Ammo 3, Slow-Firing 1'
            ) //1.5
        ];
    }

    generate(weaponPoints: number): Array<UglyWeapon> {
        const weapons = new Array<UglyWeapon>();
        const remainingWeaponPoints = this.pickAGun(weaponPoints, weapons, this.laserWeapons);
        this.pickAGun(remainingWeaponPoints, weapons, this.limitedAmmoWeapons);
        return weapons;
    }

    private pickAGun(weaponPoints: number, weapons: UglyWeapon[], weaponsToPickFrom: UglyWeapon[]) {
        // console.log(`pickAGun(weaponPoints): ${weaponPoints}`);
        const min = Math.min(...weaponsToPickFrom.map(x => x.weaponCost));
        // console.log(`pickAGun(min): ${min}`);
        const initialWeapons = weapons.length;
        while (weaponPoints && weaponPoints >= min && weapons.length == initialWeapons) {
            var weapon = this.randomService.pickOne(weaponsToPickFrom).value;
            if (weaponPoints >= weapon.weaponCost) {
                weapons.push(weapon);
                weaponPoints -= weapon.weaponCost;
            }
        }
        return weaponPoints;
    }
}

// ([a-zA-Z-0-9 ]+)\s*([0-9])\s*([0-9])\s*Close\s*(([0-9]) Pilot([,(12 a-z)]+)?)\s*([0-9])\s*([0-9])
// new UglyBody("$1", $2, $3, SensorRange.Close, $5, 0, 0, $7, $8, randomService, ...allUglyWing),
//
// ([a-zA-Z-0-9 /]+)\s*([0-9])\s*([0-9])\s*([-+][0-9])\s*([0-9])
// new UglyWing("$1", $2, $3, $4, $5, randomService, ...allUglyEngines),
//
// ([a-zA-Z-0-9 /]+)\s*([0-9])\s*([0-9])\s*([0-9])\s*([-+][0-9])
// new UglyEngine("$1", $2, $3, $4, $5),
//
// [a-zA-Z-0-9 /]+):\s*([0-9.]+)
// new UglyWeapon("$1", $2, "Fire Arc [Forward|Aft|Starboard|Port|All]; Damage 0; Critical 0; Range [Close|Medium|Long]; [Qualities]"),
// Linked 2
