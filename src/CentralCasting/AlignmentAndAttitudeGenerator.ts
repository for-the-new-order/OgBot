import { RandomService } from '../generators/random-service';

// 312: Alignment & Attitude
export class AlignmentAndAttitudeGenerator implements Generator<PersonalityOptions, Personality> {
    private traitStrengthGenerator: WeightenGenerator<
        { personality: Personality; event: TraitDevelopedFromEvent },
        PersonalityStrength,
        WeightenElement<{ personality: Personality; event: TraitDevelopedFromEvent }, PersonalityStrength>
    >;
    private personalityTraitTypesGenerator: WeightenGenerator<Personality, TraitTypes, WeightenElement<Personality, TraitTypes>>;
    private traitAlignmentGenerator: TraitAlignmentGenerator;
    private attitudeGenerator: AttitudeGenerator;
    private personalityTraitGenerator: PersonalityTraitGenerator;
    private alignmentService: AlignmentService = new AlignmentService();

    constructor(randomService: RandomService) {
        this.traitStrengthGenerator = new WeightenGenerator(randomService, [
            { weight: 2, generate: () => PersonalityStrength.Trivial },
            { weight: 4, generate: () => PersonalityStrength.Weak },
            { weight: 10, generate: () => PersonalityStrength.Average },
            { weight: 4, generate: () => PersonalityStrength.Strong },
            { weight: 3, generate: () => PersonalityStrength.Driving },
            { weight: 1, generate: () => PersonalityStrength.Obsessive }
        ]);
        this.personalityTraitTypesGenerator = new WeightenGenerator(randomService, [
            { weight: 10, generate: () => TraitTypes.None },
            { weight: 3, generate: () => TraitTypes.Lightside },
            { weight: 3, generate: () => TraitTypes.Neutral },
            { weight: 3, generate: () => TraitTypes.Darkside },
            { weight: 1, generate: () => TraitTypes.Exotic }
        ]);
        this.traitAlignmentGenerator = new TraitAlignmentGenerator(randomService);
        this.attitudeGenerator = new AttitudeGenerator(randomService);
        this.personalityTraitGenerator = new PersonalityTraitGenerator(randomService);
    }

    generate(input: PersonalityOptions): Personality {
        const personality = new Personality();

        // Generate random event
        for (let i = 0; i < input.randomPersonalityTrait; i++) {
            const traitType = this.personalityTraitTypesGenerator.generate(personality);
            if (traitType == 'None') {
                continue;
            }
            input.events.push({
                name: `Random Event ${i + 1}`,
                alignment: EventAligment[traitType],
                strength: TraitStrength.Random
            });
        }

        // Generate the random PersonalityTrait strength and alignment based on past events
        input.events.forEach(event => {
            if (event.strength == TraitStrength.Random) {
                const strength = this.traitStrengthGenerator.generate({ personality, event });
                event.strength = TraitStrength[strength];
            }
            if (event.alignment == 'Random') {
                const alignment = this.traitAlignmentGenerator.generate({ personality, event });
                event.alignment = EventAligment[alignment];
            }
        });

        // Start by generating Exotic PersonalityTrait so one could flip Personality.hasSplitPersonality to true,
        // before generating the normal ones.
        input.events
            .sort(event => (event.alignment == 'Exotic' ? -1 : 0))
            .forEach(event => {
                var generated = this.personalityTraitGenerator.generate({ personality, event });
                personality.traits.push(...generated);
            });

        // Crunch the character's alignment numbers
        personality.alignment = this.alignmentService.createPersonalityAlignment(personality.traits, input);

        // Compute attitude
        personality.attitude = this.attitudeGenerator.generate(personality);

        // Filter for expected alignment
        if (input.expectedAlignment != null && input.expectedAlignment != personality.alignment.value) {
            input.events = new Array<TraitDevelopedFromEvent>();
            return this.generate(input);
        }

        // Return the personality
        return personality;
    }
}

export class AlignmentService {
    public createPersonalityAlignment(traits: Array<PersonalityTrait>, input: PersonalityOptions): PersonalityAlignment {
        const alignmentThreshold = input.alignmentThreshold;

        // Crunch the character's alignment numbers
        const metrics = this.computeAlignmentMetrics(traits, alignmentThreshold);

        // Decides on the character's alignment
        const value = this.findAlignmentValue(metrics);

        // Decides on the character's alignment "tend toward" value
        const tendToward = this.findAlignmentThendencies(metrics);

        // Return the computed values

        if (tendToward == null) {
            // Not adding tendToward makes a cleaner output
            return { value, metrics };
        }
        return { value, tendToward, metrics };
    }

    public findAlignmentThendencies(metrics: PersonalityAlignmentMetrics): PersonalityAlignmentType {
        var totals = metrics.totals;
        if (metrics.isEvil && totals.light + totals.neutral >= totals.dark) {
            return PersonalityAlignmentType.Neutral;
        }
        if (metrics.isGood && totals.dark + totals.neutral >= totals.light) {
            return PersonalityAlignmentType.Neutral;
        }
        if (metrics.isNeutral || metrics.isDefault) {
            const halfThreshold = metrics.threshold / 2.0;
            if (totals.light == 0 && totals.dark - halfThreshold >= 0) {
                return PersonalityAlignmentType.Darkside;
            }
            if (totals.dark == 0 && totals.light - halfThreshold >= 0) {
                return PersonalityAlignmentType.Lightside;
            }
            if (totals.light + totals.dark > totals.neutral) {
                const darkIsStrongerThanLight = totals.dark > totals.light;
                const darkIsStrongerThanLightAndNeutral = totals.dark > totals.neutral + totals.light;
                const lightIsStrongerThanDark = totals.light > totals.dark;
                const lightIsStrongerThanDarkAndNeutral = totals.light > totals.neutral + totals.dark;
                if (darkIsStrongerThanLight && darkIsStrongerThanLightAndNeutral) {
                    return PersonalityAlignmentType.Darkside;
                }
                if (lightIsStrongerThanDark && lightIsStrongerThanDarkAndNeutral) {
                    return PersonalityAlignmentType.Lightside;
                }
            }
        }
        return null;
    }

    public findAlignmentValue(metrics: PersonalityAlignmentMetrics): PersonalityAlignmentType {
        if (metrics.isEvil) {
            return PersonalityAlignmentType.Darkside;
        } else if (metrics.isGood) {
            return PersonalityAlignmentType.Lightside;
        }
        return PersonalityAlignmentType.Neutral;
    }

    public computeAlignmentMetrics(traits: Array<PersonalityTrait>, threshold: number): PersonalityAlignmentMetrics {
        // Takes the strength of traits into account to compute the character's alignment
        const neutral = this.computePersonalityAlignmentMetricsSide(traits, PersonalityAlignmentType.Neutral);
        const light = this.computePersonalityAlignmentMetricsSide(traits, PersonalityAlignmentType.Lightside);
        const dark = this.computePersonalityAlignmentMetricsSide(traits, PersonalityAlignmentType.Darkside);

        // Analyze thresholds to find out the alignment
        const validateThreshold: (
            value: PersonalityAlignmentMetricsSide,
            against1: PersonalityAlignmentMetricsSide,
            against2: PersonalityAlignmentMetricsSide
        ) => boolean = function(value, against1, against2) {
            return value.value - threshold >= against1.value && value.value - threshold >= against2.value;
        };
        const isEvil = validateThreshold(dark, light, neutral);
        const isGood = validateThreshold(light, dark, neutral);
        const isNeutral = validateThreshold(neutral, light, dark);
        const isDefault = !(isNeutral || isGood || isEvil);

        // Count amount of exotic traits
        const exotic = traits.filter(trait => trait.isExotic).length;

        // Return PersonalityAlignmentMetrics
        return Object.assign(new PersonalityAlignmentMetrics(), {
            threshold,
            light,
            neutral,
            dark,
            isGood,
            isNeutral,
            isEvil,
            isDefault,
            exotic
        });
    }

    public computePersonalityAlignmentMetricsSide(
        traits: Array<PersonalityTrait>,
        type: PersonalityAlignmentType
    ): PersonalityAlignmentMetricsSide {
        const computeContribution: (
            previousValue: number,
            currentValue: PersonalityTrait,
            currentIndex: number,
            array: PersonalityTrait[]
        ) => number = function(accumulator, currentValue) {
            return accumulator + currentValue.strength.weight;
        };
        const computeStrongContribution: (
            previousValue: number,
            currentValue: PersonalityTrait,
            currentIndex: number,
            array: PersonalityTrait[]
        ) => number = function(accumulator, currentValue) {
            return accumulator + (currentValue.stronglyAligned ? currentValue.strength.weight : 0);
        };
        const count = traits.filter(trait => trait.alignment == type).length;
        const strongCount = traits.filter(trait => trait.alignment == type && trait.stronglyAligned).length;
        const contribution = traits.filter(trait => trait.alignment == type).reduce(computeContribution, 0);
        const strongContribution = traits.filter(trait => trait.alignment == type).reduce(computeStrongContribution, 0);

        return {
            count,
            strongCount,
            contribution,
            strongContribution,
            value: contribution + strongContribution
        };
    }
}

// Input
export class PersonalityOptions {
    events: TraitDevelopedFromEvent[] = new Array<TraitDevelopedFromEvent>();
    randomPersonalityTrait: number = 0;
    alignmentThreshold: number = 2;
    expectedAlignment?: PersonalityAlignmentType;
}

// Output
export class Personality {
    traits: PersonalityTrait[] = new Array<PersonalityTrait>();
    alignment: PersonalityAlignment = new PersonalityAlignment();
    attitude: Descriptible;
    hasSplitPersonality: boolean;
}

export class PersonalityAlignment {
    value: PersonalityAlignmentType = PersonalityAlignmentType.Neutral;
    tendToward?: PersonalityAlignmentType = PersonalityAlignmentType.Neutral;
    metrics: PersonalityAlignmentMetrics = new PersonalityAlignmentMetrics();
}

export class PersonalityAlignmentMetrics {
    threshold: number;

    light: PersonalityAlignmentMetricsSide;
    neutral: PersonalityAlignmentMetricsSide;
    dark: PersonalityAlignmentMetricsSide;

    public get totals(): PersonalityAlignmentMetricsTotals {
        var copy = Object.assign({}, this);
        return new PersonalityAlignmentMetricsTotals(copy);
    }

    exotic: number;

    isEvil: boolean;
    isGood: boolean;
    isNeutral: boolean;
    isDefault: boolean;
}
export class PersonalityAlignmentMetricsTotals {
    constructor(private owner: PersonalityAlignmentMetrics) {}
    public get light(): number {
        return this.owner.light.value;
    }
    public get neutral(): number {
        return this.owner.neutral.value;
    }
    public get dark(): number {
        return this.owner.dark.value;
    }
}

export class PersonalityAlignmentMetricsSide {
    count: number;
    strongCount: number;
    contribution: number;
    strongContribution: number;

    public get value(): number {
        return this.contribution + this.strongContribution;
    }
}

export class PersonalityTrait implements Descriptible {
    description: string;
    name: string;
    alignment: PersonalityAlignmentType;
    strength: PersonalityTraitStrength;
    stronglyAligned: boolean;
    isExotic: boolean;
    source?: Nameable;
}

export class PersonalityTraitStrength implements Descriptible {
    name: PersonalityStrength;
    description: PersonalityStrengthDescription;
    weight: number;
}

enum PersonalityStrength {
    Trivial = 'Trivial',
    Weak = 'Weak',
    Average = 'Average',
    Strong = 'Strong',
    Driving = 'Driving',
    Obsessive = 'Obsessive'
}
enum PersonalityStrengthDescription {
    Trivial = 'Feature is barely noticeable, even when actively af- fecting the character. Special circumstancesm ay have to exist for the feature to come into play.',
    Weak = 'Feature is easily sublimated, overcome, or ignored, but is noticable when actively affecting character.',
    Average = 'There is an uneasy balance. Feature is not active unless the character is caught off guard or is too fatigued to control himself.',
    Strong = 'Unless character consciously resists the feature, it manifests itself strongly.',
    Driving = "Feature dominates the character's life - character finds it difficult to resist its compulsions.",
    Obsessive = 'Character cannot rest or find peace unless actively pursuing the desires, needs or compulsions of the feature.'
}

export enum PersonalityAlignmentType {
    Lightside = 'Lightside',
    Neutral = 'Neutral',
    Darkside = 'Darkside'
}

//
// Generation models
//
enum TraitTypes {
    None = 'None',
    Lightside = 'Lightside',
    Neutral = 'Neutral',
    Darkside = 'Darkside',
    Exotic = 'Exotic'
}
enum TraitStrength {
    Trivial = 'Trivial',
    Weak = 'Weak',
    Average = 'Average',
    Strong = 'Strong',
    Driving = 'Driving',
    Obsessive = 'Obsessive',
    Random = 'Random'
}

export interface TraitDevelopedFromEvent extends Nameable {
    alignment: EventAligment;
    strength: TraitStrength;
}

export enum EventAligment {
    Lightside = 'Lightside',
    Neutral = 'Neutral',
    Darkside = 'Darkside',
    Exotic = 'Exotic',
    Random = 'Random'
}

//
// Generalized elements
// TODO: fine tune and replace other more specific implemetnations by those to uniformize the generators.
//
export interface Nameable {
    name: string;
}

export interface Descriptible extends Nameable {
    description: string;
}

export interface WeightenElement<TModel, TOuput> extends Generator<TModel, TOuput> {
    weight: number;
}
export interface Generator<TModel, TOuput> {
    generate(input: TModel): TOuput;
}

export class RandomGenerator<TModel, TOuput, TElement extends Generator<TModel, TOuput>> implements Generator<TModel, TOuput> {
    constructor(protected randomService: RandomService, private elements: TElement[]) {}

    generate(input: TModel): TOuput {
        const result = this.randomService.pickOne(this.elements).value;
        return result.generate(input);
    }
}

export class WeightenGenerator<TModel, TOuput, TElement extends WeightenElement<TModel, TOuput>> implements Generator<TModel, TOuput> {
    protected elements: TElement[];

    constructor(protected randomService: RandomService, elements: TElement[]) {
        this.elements = new Array<TElement>();
        elements.forEach(element => {
            for (let i = 0; i < element.weight; i++) {
                this.elements.push(element);
            }
        });
    }
    generate(input: TModel): TOuput {
        const result = this.randomService.pickOne(this.elements).value;
        return result.generate(input);
    }
}

export class RerollDecorator<TModel, TOuput extends Nameable> implements Generator<TModel, TOuput[]> {
    constructor(private generator: Generator<TModel, TOuput>) {}
    generate(input: TModel): TOuput[] {
        const result = new Array<TOuput>();
        const element = this.generator.generate(input);
        if (this.isReroll(element.name)) {
            const rerollAmount = this.parseReroll(element.name);
            for (let i = 0; i < rerollAmount + 1; i++) {
                const generated = this.generate(input);
                result.push(...generated);
            }
        } else {
            result.push(element);
        }
        return result;
    }

    private isReroll(value: string): boolean {
        return value.toLowerCase().startsWith('/reroll');
    }

    private parseReroll(value: string): number {
        try {
            const rerollCount = parseInt(value.replace('/reroll ', ''));
            if (isNaN(rerollCount)) {
                return 1;
            }
            return rerollCount;
        } catch (error) {
            return 1;
        }
    }
}

//
// Specific generators
//
export class TraitAlignmentGenerator extends WeightenGenerator<
    { personality: Personality; event: TraitDevelopedFromEvent },
    PersonalityAlignmentType,
    WeightenElement<{ personality: Personality; event: TraitDevelopedFromEvent }, PersonalityAlignmentType>
> {
    constructor(randomService: RandomService) {
        super(randomService, [
            { weight: 3, generate: () => PersonalityAlignmentType.Lightside },
            { weight: 6, generate: () => PersonalityAlignmentType.Neutral },
            { weight: 3, generate: () => PersonalityAlignmentType.Darkside }
        ]);
    }
}

export class AttitudeGenerator implements Generator<Personality, Descriptible> {
    private goodGenerator: RandomGenerator<Personality, Descriptible, Generator<Personality, Descriptible>>;
    private neutralGenerator: RandomGenerator<Personality, Descriptible, Generator<Personality, Descriptible>>;
    private evilGenerator: RandomGenerator<Personality, Descriptible, Generator<Personality, Descriptible>>;

    constructor(private randomService: RandomService) {
        // prettier-ignore
        this.goodGenerator = new RandomGenerator(randomService, [
            { generate: () => ({ name: 'Ethical', description: '"What is true for one is true for all." is his watchword. He lives according to a strict, universal moral code of ethics. Values fair play and respects authority; does no evil to self or others; and works for the good of all.' }) },
            { generate: () => ({ name: 'Conscientious', description: '"Each man knows his own \'good\' and defends it." sums up the conscientious character\'s beliefs. He lives according to a strict personalcode of ethics. He is often an indi- vidualist who works for the law and the good of the greatest num- ber of people, but who may distrust higher authority, living and working "outside the law." Includes vigilantes and "Robin Hood" type characters.' }) },
            { generate: () => ({ name: 'Chivalrous', description: '"The strong are morally responsible to be the sheperds of the weak." is the chivalrous character\'s rule for life. Lives by the belief that the strong must protect the weak. This is often found among characters of Noble Social Status and knights.' }) }
        ]);
        // prettier-ignore
        this.neutralGenerator = new RandomGenerator(randomService, [
            { generate: () => ({ name: 'Self-centered', description: '"What\'s in it for me?" is the watchword of the self-centered character. He tends to look out for his own interests above anything else, though there are limitsto what he willdo. Like the Lightside alignments, tends to have a high regard for life and freedom. He may be friendless, a mercenary who serves a cause only because it pays well, but once he gives his word or his loyalty, he does not go back on it. Nevertheless, there is no higher cause to him than self service and self preservation.' }) },
            { generate: () => ({ name: 'Apathetic', description: '"What does it matter and who cares?" are his mottos. Such a character believes that nothing really matters in the end. He lives his life as if there were nothing to be accountable for often choosing to side with good or evil because he doesn\'t care which wins.' }) },
            { generate: () => ({ name: 'Materialistic', description: '"He whodies with the most toys, wins!" Is this character\'s battle-cry. This greedy character puts great emphasis on material things, particularly ones he can own. He strives to own the best of everything and may compromlse other principles for self gain. Like the self-centered character, he takes the course of action that will best suit his desires for material gain.' }) },
            { generate: () => ({ name: 'Anarchic', description: '"It\'s my life, I\'ll do as I please." Lives according to a loose personalcode of ethics, though he does not feel bound to tell the truth, keep his word or help others if there is nothing In it for him. An individualist who disrespects higher authority. Does what he pleases, when it pleases him.' }) },
            { generate: () => ({ name: 'Egalitarian', description: '"Both sides have a right to their own views." He champions the underdog, regardless of whether that cause is good or evil. He believes in fairness and equality for all. He is like the chivalrous knight, in that he is dedicated to his code of honor. Un- fortunately, the causes that he champions may not be the best for society.' }) },
            { generate: () => ({ name: 'Conformist', description: '"Don\'t make waves," "Don\'t stick your neckout" and "It\'s none of my business" are his quotable quotes. He\'s Joe-average and likes it that way. He goes with the flow. His values are the popular ones for his times and make no effort to side with or against good or evil.' }) }
        ]);
        // prettier-ignore
        this.evilGenerator = new RandomGenerator(randomService, [
            { generate: () => ({ name: 'Depraved', description: 'Self-serving and unscrupulous. Like the Self- centered attitude (see above) seeks to fullfil personal desires, but unlike that attitude, this character will do anything to obtain his goals. Adepravedcharacter may even torture and killforthe sheer fun of it.' }) },
            { generate: () => ({ name: 'Deviant', description: 'Like the Ethical attitude, this character lives by a strict andordered moral code. Butthiscode iscenteredaroundthe Deviant character\'s self-centered personal goals. He respects honor and self-discipline in others, and may even protect the innocent, but will not tolerate anyone who works to cross him. ' }) },
            { generate: () => ({ name: 'Diabolical', description: 'The despicable Diabolical character has no code of ethics. He is unpredictable, helps others onlyto be able to hurt them later, despises all that is honorable, disciplined or that reminds him of authority.' }) }
        ]);
    }

    generate(personality: Personality): Descriptible {
        switch (personality.alignment.value) {
            case PersonalityAlignmentType.Lightside:
                return this.goodGenerator.generate(personality);
            case PersonalityAlignmentType.Neutral:
                return this.neutralGenerator.generate(personality);
            case PersonalityAlignmentType.Darkside:
                return this.evilGenerator.generate(personality);
        }
    }
}

// p.69-70
// 643: Personality Traits
export class PersonalityTraitGenerator
    implements Generator<{ personality: Personality; event: TraitDevelopedFromEvent }, PersonalityTrait[]> {
    private lightGenerator: RerollDecorator<{ personality: Personality; event: TraitDevelopedFromEvent }, GeneratedPersonalityTrait>;
    private neutralGenerator: RerollDecorator<{ personality: Personality; event: TraitDevelopedFromEvent }, GeneratedPersonalityTrait>;
    private darkGenerator: RerollDecorator<{ personality: Personality; event: TraitDevelopedFromEvent }, GeneratedPersonalityTrait>;
    private exoticGenerator: ExoticPersonalityTraitGenerator;

    constructor(private randomService: RandomService) {
        this.exoticGenerator = new ExoticPersonalityTraitGenerator(randomService);
        // prettier-ignore
        this.lightGenerator = new RerollDecorator(new DescriptibleAndAlignableGenerator(randomService, [
            { name: 'Optimist', description: 'always see the good side of things. ', stronglyAligned: false, isExotic: false },
            { name: 'Altruist', description: "selfless concern or others' welfare. ", stronglyAligned: true, isExotic: false },
            { name: 'Helpful', description: 'helps others in need ', stronglyAligned: false, isExotic: false },
            { name: 'Kindly', description: 'warmhearted and friendly. ', stronglyAligned: true, isExotic: false },
            { name: 'Careful', description: 'cautious in thought and deed. ', stronglyAligned: false, isExotic: false },
            { name: 'Considerate', description: "thinks of others' feelings. ", stronglyAligned: false, isExotic: false },
            { name: 'Sober', description: 'serious, plain-thinking, straightforward. ', stronglyAligned: false, isExotic: false },
            { name: 'Teetotaler', description: 'abstains from drinking alcohol. ', stronglyAligned: false, isExotic: false },
            { name: 'Trusting', description: 'trusts others to behave correctly. ', stronglyAligned: true, isExotic: false },
            { name: 'Peaceful', description: 'serene Of spirit. ', stronglyAligned: false, isExotic: false },
            { name: 'Peacemaker', description: 'attempts to calm others. ', stronglyAligned: false, isExotic: false },
            { name: 'Pious', description: 'reverently devoted to the worship of God. ', stronglyAligned: false, isExotic: false },
            { name: 'Honest', description: 'always gives what is due. ', stronglyAligned: true, isExotic: false },
            { name: 'Loving', description: 'affectionately concerned for others. ', stronglyAligned: false, isExotic: false },
            { name: 'Giving', description: 'gives of self and possessions. ', stronglyAligned: false, isExotic: false },
            { name: 'Organized', description: 'everything has a place ', stronglyAligned: false, isExotic: false },
            { name: 'Clean', description: 'practices good hygiene. ', stronglyAligned: false, isExotic: false },
            { name: 'Punctual', description: 'always on time ', stronglyAligned: false, isExotic: false },
            { name: 'Self-confident', description: 'sure Of self and abilities. ', stronglyAligned: false, isExotic: false },
            { name: 'Courageous', description: 'brave in the face of adversity. ', stronglyAligned: false, isExotic: false },
            { name: 'Respectful', description: 'shows respect for others. ', stronglyAligned: false, isExotic: false },
            { name: 'Calm', description: 'difficult to anger, a peaceful spirit. ', stronglyAligned: false, isExotic: false },
            { name: 'Patient', description: 'able to wait with calmness. ', stronglyAligned: false, isExotic: false },
            { name: 'Wise', description: 'understands what is true, or lasting. ', stronglyAligned: false, isExotic: false },
            { name: 'Generous', description: 'willing to give more than fairly. ', stronglyAligned: false, isExotic: false },
            { name: 'Imaginative', description: 'a clever, resourceful mind. ', stronglyAligned: false, isExotic: false },
            { name: 'Forgiving', description: 'able to pardon faults in others. ', stronglyAligned: true, isExotic: false },
            { name: 'Virtuous', description: 'chaste. pure, of excellent morals. ', stronglyAligned: true, isExotic: false },
            { name: 'Dependable', description: 'does duties reliably, responsibly. ', stronglyAligned: false, isExotic: false },
            { name: 'Well-mannered', description: 'polite, courteous. ', stronglyAligned: false, isExotic: false },
            { name: 'Benign', description: 'gentle, inoffensive. ', stronglyAligned: true, isExotic: false },
            { name: 'Friendly', description: 'warm and comforting. ', stronglyAligned: false, isExotic: false },
            { name: 'Humble', description: 'lack of pretense, not proud. ', stronglyAligned: false, isExotic: false },
            { name: 'Energetic', description: 'does things quickly, with verve. ', stronglyAligned: false, isExotic: false },
            { name: 'Truthful', description: 'always tells the truth. ', stronglyAligned: true, isExotic: false },
            { name: 'Cheerful', description: 'always happy and smiling. ', stronglyAligned: false, isExotic: false },
            { name: 'Enthusiastic', description: "excited, can't wait to act. ", stronglyAligned: false, isExotic: false },
            { name: 'Thrifty', description: 'careful with money. ', stronglyAligned: false, isExotic: false },
            { name: 'Diplomatic', description: 'careful to say the right thing. ', stronglyAligned: false, isExotic: false },
            { name: '/reroll', description: 'roll twice more on this table', stronglyAligned: false, isExotic: false }
        ]));
        // prettier-ignore
        this.neutralGenerator = new RerollDecorator(new DescriptibleAndAlignableGenerator(randomService, [
            { name: 'Curious', description: 'inquisitive, needs to know.', stronglyAligned: false, isExotic: false },
            { name: 'Hedonist', description: 'pleasure is the most important thing.', stronglyAligned: false, isExotic: false },
            { name: 'Precise', description: 'always exacting.', stronglyAligned: false, isExotic: false },
            { name: 'Studious', description: 'studios often, pays attention to detail.', stronglyAligned: false, isExotic: false },
            { name: 'Mysterious', description: 'has an air of mystery about him.', stronglyAligned: false, isExotic: false },
            { name: 'Loquacious', description: 'talks and talks and talks and ...', stronglyAligned: false, isExotic: false },
            { name: 'Silent', description: 'rarely talks.', stronglyAligned: false, isExotic: false },
            { name: 'Foppish', description: 'vain. preoccupied with appearance.', stronglyAligned: false, isExotic: false },
            { name: 'Immaculate', description: 'clean and orderly.', stronglyAligned: false, isExotic: false },
            { name: 'Rough', description: 'unpolished, unrefined.', stronglyAligned: false, isExotic: false },
            { name: 'Skeptic', description: 'disbelieving of things unproven.', stronglyAligned: false, isExotic: false },
            { name: 'Immature', description: 'acts younger than age.', stronglyAligned: false, isExotic: false },
            { name: 'Even-tempered', description: 'rarely angry or over joyous.', stronglyAligned: false, isExotic: false },
            { name: 'Rash', description: 'acts before thinking.', stronglyAligned: false, isExotic: false },
            { name: 'Extroverted', description: 'outgoing.', stronglyAligned: false, isExotic: false },
            { name: 'Introverted', description: "focus one's interests in oneself.", stronglyAligned: false, isExotic: false },
            { name: 'Materialistic', description: 'puts emphasis on possessions.', stronglyAligned: false, isExotic: false },
            { name: 'Aesthetic', description: 'possessions are unnecessary.', stronglyAligned: false, isExotic: false },
            { name: 'Amoral', description: 'no care for right or wrong.', stronglyAligned: false, isExotic: false },
            { name: 'Dreamy', description: 'a distant daydreamer.', stronglyAligned: false, isExotic: false },
            { name: 'Creative', description: 'able to make something out of nothing.', stronglyAligned: false, isExotic: false },
            { name: 'Leader', description: 'takes initiative, can take command.', stronglyAligned: false, isExotic: false },
            { name: 'Follower', description: 'prefers to let others lead.', stronglyAligned: false, isExotic: false },
            { name: 'Emotional', description: 'rarely keeps emotions in check.', stronglyAligned: false, isExotic: false },
            { name: 'Emotionless', description: 'rarely shows emotions.', stronglyAligned: false, isExotic: false },
            { name: 'Humorous', description: 'appreciates humor and Ikes to joke.', stronglyAligned: false, isExotic: false },
            { name: 'Grim', description: 'unsmiling. humorless, stern of purpose.', stronglyAligned: false, isExotic: false },
            { name: 'Conservative', description: 'restrained, opposed to change.', stronglyAligned: false, isExotic: false },
            { name: 'Liberal', description: 'tolerant of Others, open to change.', stronglyAligned: false, isExotic: false },
            { name: 'Aggressive', description: 'assertive, bold, enterprising.', stronglyAligned: false, isExotic: false },
            { name: 'Passive', description: 'accepts things without resisting them.', stronglyAligned: false, isExotic: false },
            { name: 'Self-sufficient', description: 'does not need others.', stronglyAligned: false, isExotic: false },
            { name: 'Dependent', description: 'needs others around him.', stronglyAligned: false, isExotic: false },
            { name: 'Romantic', description: 'given to feelings of romance.', stronglyAligned: false, isExotic: false },
            { name: 'Logical', description: 'uses deductive reasoning.', stronglyAligned: false, isExotic: false },
            { name: 'Illogical', description: 'may not use reason to make decisions.', stronglyAligned: false, isExotic: false },
            { name: 'Frivolous', description: 'flighty. harebrained, rarely serious.', stronglyAligned: false, isExotic: false },
            { name: 'Aloof', description: 'distant from others, even cold.', stronglyAligned: false, isExotic: false },
            { name: 'Atheistic', description: 'denies the existence of the supernatural.', stronglyAligned: false, isExotic: false },
            { name: '/reroll', description: 'roll twice more on this table ', stronglyAligned: false, isExotic: false }
        ]));
        // prettier-ignore
        this.darkGenerator = new RerollDecorator(new DescriptibleAndAlignableGenerator(randomService, [
            { name: 'Pessimist', description: 'always see the bad side Of things.', stronglyAligned: false, isExotic: false },
            { name: 'Egoist', description: 'selfish concern for own welfare.', stronglyAligned: false, isExotic: false },
            { name: 'Obstructive', description: 'acts to block Others actions.', stronglyAligned: false, isExotic: false },
            { name: 'Cruel', description: 'coldhearted and hurtful.', stronglyAligned: true, isExotic: false },
            { name: 'Careless', description: 'incautious in thought and deed.', stronglyAligned: false, isExotic: false },
            { name: 'Thoughtless', description: "rarely thinks of others' feelings.", stronglyAligned: false, isExotic: false },
            { name: 'Flippant', description: 'unable to be serious about anything.', stronglyAligned: false, isExotic: false },
            { name: 'Drunkard', description: 'constantly overindulges in alcohol.', stronglyAligned: false, isExotic: false },
            { name: 'Suspicious', description: 'trusts no one.', stronglyAligned: false, isExotic: false },
            { name: 'Violent', description: 'seeks physical conflict.', stronglyAligned: true, isExotic: false },
            { name: 'Argumentative', description: 'starts arguments and fights.', stronglyAligned: false, isExotic: false },
            { name: 'Irreverent', description: 'mocks religion and the gods.', stronglyAligned: true, isExotic: false },
            { name: 'Cheat', description: 'shortchanges others of their due.', stronglyAligned: true, isExotic: false },
            { name: 'Hateful', description: 'strongly dislikes others.', stronglyAligned: true, isExotic: false },
            { name: 'Selfish', description: 'unwilling to share time and possessions.', stronglyAligned: false, isExotic: false },
            { name: 'Slovenly', description: 'messy, nothing is ever put away.', stronglyAligned: false, isExotic: false },
            { name: 'Filthy', description: 'knows nothing of hygiene.', stronglyAligned: false, isExotic: false },
            { name: 'Tardy', description: 'always late.', stronglyAligned: false, isExotic: false },
            { name: 'Self-doubting', description: 'unsure Of self and abilities.', stronglyAligned: false, isExotic: false },
            { name: 'Cowardly', description: 'afraid to face adversity.', stronglyAligned: false, isExotic: false },
            { name: 'Disrespectful', description: 'does not show respect.', stronglyAligned: false, isExotic: false },
            { name: 'Angry', description: 'spirit always unsettled. never at peace.', stronglyAligned: false, isExotic: false },
            { name: 'Inpatient', description: 'unable to wait with calmness.', stronglyAligned: false, isExotic: false },
            { name: 'Foolish', description: 'unable to discern what is true or wise.', stronglyAligned: false, isExotic: false },
            { name: 'Greedy', description: 'hoards all for self.', stronglyAligned: false, isExotic: false },
            { name: 'Dull', description: 'a slow, uncreative mind.', stronglyAligned: false, isExotic: false },
            { name: 'Vengeful', description: 'revenge is the way to punish faults.', stronglyAligned: false, isExotic: false },
            { name: 'Immoral', description: 'lecherous, lawless, devoid of morals.', stronglyAligned: false, isExotic: false },
            { name: 'Untrustworthy', description: 'not worth trusting.', stronglyAligned: true, isExotic: false },
            { name: 'Rude', description: 'polite, courteous.', stronglyAligned: false, isExotic: false },
            { name: 'Harsh', description: 'ungentle, sharp-tongued.', stronglyAligned: false, isExotic: false },
            { name: 'Unfriendly', description: 'cold and distant.', stronglyAligned: false, isExotic: false },
            { name: 'Egotistic', description: 'proud and conceited.', stronglyAligned: false, isExotic: false },
            { name: 'Lazy', description: 'difficult to get motivated.', stronglyAligned: false, isExotic: false },
            { name: 'Liar', description: 'hardly ever tells the truth.', stronglyAligned: false, isExotic: false },
            { name: 'Morose', description: 'always gloomy and moody.', stronglyAligned: false, isExotic: false },
            { name: 'Unenthusiastic', description: 'get excited.', stronglyAligned: false, isExotic: false },
            { name: 'Spendthrift', description: 'spends money without thought.', stronglyAligned: false, isExotic: false },
            { name: 'Tactless', description: 'speaks before thinking.', stronglyAligned: false, isExotic: false },
            { name: '/reroll', description: 'roll twice more on this table ', stronglyAligned: false, isExotic: false }
        ]));
    }
    generate(input: { personality: Personality; event: TraitDevelopedFromEvent }): PersonalityTrait[] {
        const traits = new Array<PersonalityTrait>();
        // Make one
        let roller: Generator<{ personality: Personality; event: TraitDevelopedFromEvent }, GeneratedPersonalityTrait[]>;
        switch (input.event.alignment) {
            // Lightside Trait: use Table 643A: Lightside Traits
            case EventAligment.Lightside:
                roller = this.lightGenerator;
                break;
            // Neutral Trait: use Table 643B: Neutral Traits
            case EventAligment.Neutral:
                roller = this.neutralGenerator;
                break;
            // Darkside Trait: use Table 643C: Darkside Traits
            case EventAligment.Darkside:
                roller = this.darkGenerator;
                break;
            // Exotic Personality Feature: use Table 644: Exotic Personality Traits
            case EventAligment.Exotic:
                roller = this.exoticGenerator;
                break;
        }
        const result = roller.generate(input).map(r => this.createTraitFrom(input.event, r));
        traits.push(...result);
        return traits;
    }
    private createTraitFrom(event: TraitDevelopedFromEvent, description: GeneratedPersonalityTrait): PersonalityTrait {
        const custom: PersonalityTrait = {
            name: description.name,
            description: description.description,
            stronglyAligned: description.stronglyAligned,
            alignment: PersonalityAlignmentType[event.alignment],
            isExotic: description.isExotic,
            source: {
                name: event.name
            },
            strength: {
                name: PersonalityStrength[event.strength],
                description: PersonalityStrengthDescription[event.strength],
                weight: this.weightTrait(event)
            }
        };
        return custom;
    }
    private weightTrait(event: TraitDevelopedFromEvent): number {
        const trivialWeight = 0.5;
        const normalWeight = 1;
        const drivingWeight = 1.5;
        const obsessiveWeight = 2;

        switch (event.strength) {
            case TraitStrength.Trivial:
                return trivialWeight;
            case TraitStrength.Driving:
                return drivingWeight;
            case TraitStrength.Obsessive:
                return obsessiveWeight;
            default:
                return normalWeight;
        }
    }
}

export interface Alignable {
    stronglyAligned: boolean;
}

export interface GeneratedPersonalityTrait extends Descriptible, Alignable {
    isExotic: boolean;
}

export class DescriptibleAndAlignableGenerator extends RandomGenerator<
    any,
    GeneratedPersonalityTrait,
    Generator<any, GeneratedPersonalityTrait>
> {
    constructor(randomService: RandomService, elements: GeneratedPersonalityTrait[]) {
        super(
            randomService,
            elements.map(e =>
                Object.assign(e, {
                    generate: () => e
                })
            )
        );
    }
}

// p.71
// 644: Exotic Personality Traits
export class ExoticPersonalityTraitGenerator
    implements Generator<{ personality: Personality; event: TraitDevelopedFromEvent }, ExoticPersonalityTrait[]> {
    private traitAlignmentGenerator: TraitAlignmentGenerator;
    constructor(randomService: RandomService) {
        this.traitAlignmentGenerator = new TraitAlignmentGenerator(randomService);
    }

    generate(input: { personality: Personality; event: TraitDevelopedFromEvent }): ExoticPersonalityTrait[] {
        const result = new Array<ExoticPersonalityTrait>();
        // TODO: implement this
        result.push(
            Object.assign(new ExoticPersonalityTrait(), input.event, {
                name: 'ExoticPersonalityTrait',
                description: 'TODO: implement this',
                alignment: this.traitAlignmentGenerator.generate(input),
                isExotic: true
            })
        );
        return result;
    }
}

export class ExoticPersonalityTrait extends PersonalityTrait {
    features: ExoticFeature[];
}
export class ExoticFeature {
    // TODO: design this
}
