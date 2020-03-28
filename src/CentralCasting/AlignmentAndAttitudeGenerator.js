"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// 312: Alignment & Attitude
var AlignmentAndAttitudeGenerator = /** @class */ (function () {
    function AlignmentAndAttitudeGenerator(randomService) {
        this.alignmentService = new AlignmentService();
        this.traitStrengthGenerator = new WeightenGenerator(randomService, [
            { weight: 2, generate: function () { return PersonalityStrength.Trivial; } },
            { weight: 4, generate: function () { return PersonalityStrength.Weak; } },
            { weight: 10, generate: function () { return PersonalityStrength.Average; } },
            { weight: 4, generate: function () { return PersonalityStrength.Strong; } },
            { weight: 3, generate: function () { return PersonalityStrength.Driving; } },
            { weight: 1, generate: function () { return PersonalityStrength.Obsessive; } }
        ]);
        this.personalityTraitTypesGenerator = new WeightenGenerator(randomService, [
            { weight: 10, generate: function () { return TraitTypes.None; } },
            { weight: 3, generate: function () { return TraitTypes.Lightside; } },
            { weight: 3, generate: function () { return TraitTypes.Neutral; } },
            { weight: 3, generate: function () { return TraitTypes.Darkside; } },
            { weight: 1, generate: function () { return TraitTypes.Exotic; } }
        ]);
        this.traitAlignmentGenerator = new TraitAlignmentGenerator(randomService);
        this.attitudeGenerator = new AttitudeGenerator(randomService);
        this.personalityTraitGenerator = new PersonalityTraitGenerator(randomService);
    }
    AlignmentAndAttitudeGenerator.prototype.generate = function (input) {
        var _this = this;
        var personality = new Personality();
        // Generate random event
        for (var i = 0; i < input.randomPersonalityTrait; i++) {
            var traitType = this.personalityTraitTypesGenerator.generate(personality);
            if (traitType == 'None') {
                continue;
            }
            input.events.push({
                name: "Random Event " + (i + 1),
                alignment: EventAligment[traitType],
                strength: TraitStrength.Random
            });
        }
        // Generate the random PersonalityTrait strength and alignment based on past events
        input.events.forEach(function (event) {
            if (event.strength == TraitStrength.Random) {
                var strength = _this.traitStrengthGenerator.generate({ personality: personality, event: event });
                event.strength = TraitStrength[strength];
            }
            if (event.alignment == 'Random') {
                var alignment = _this.traitAlignmentGenerator.generate({ personality: personality, event: event });
                event.alignment = EventAligment[alignment];
            }
        });
        // Start by generating Exotic PersonalityTrait so one could flip Personality.hasSplitPersonality to true,
        // before generating the normal ones.
        input.events
            .sort(function (event) { return (event.alignment == 'Exotic' ? -1 : 0); })
            .forEach(function (event) {
            var _a;
            var generated = _this.personalityTraitGenerator.generate({ personality: personality, event: event });
            (_a = personality.traits).push.apply(_a, generated);
        });
        // Crunch the character's alignment numbers
        personality.alignment = this.alignmentService.createPersonalityAlignment(personality.traits, input);
        // Compute attitude
        personality.attitude = this.attitudeGenerator.generate(personality);
        // Filter for expected alignment
        if (input.expectedAlignment != null && input.expectedAlignment != personality.alignment.value) {
            input.events = new Array();
            return this.generate(input);
        }
        // Return the personality
        return personality;
    };
    return AlignmentAndAttitudeGenerator;
}());
exports.AlignmentAndAttitudeGenerator = AlignmentAndAttitudeGenerator;
var AlignmentService = /** @class */ (function () {
    function AlignmentService() {
    }
    AlignmentService.prototype.createPersonalityAlignment = function (traits, input) {
        var alignmentThreshold = input.alignmentThreshold;
        // Crunch the character's alignment numbers
        var metrics = this.computeAlignmentMetrics(traits, alignmentThreshold);
        // Decides on the character's alignment
        var value = this.findAlignmentValue(metrics);
        // Decides on the character's alignment "tend toward" value
        var tendToward = this.findAlignmentThendencies(metrics);
        // Return the computed values
        if (tendToward == null) {
            // Not adding tendToward makes a cleaner output
            return { value: value, metrics: metrics };
        }
        return { value: value, tendToward: tendToward, metrics: metrics };
    };
    AlignmentService.prototype.findAlignmentThendencies = function (metrics) {
        var totals = metrics.totals;
        if (metrics.isEvil && totals.light + totals.neutral >= totals.dark) {
            return PersonalityAlignmentType.Neutral;
        }
        if (metrics.isGood && totals.dark + totals.neutral >= totals.light) {
            return PersonalityAlignmentType.Neutral;
        }
        if (metrics.isNeutral || metrics.isDefault) {
            var halfThreshold = metrics.threshold / 2.0;
            if (totals.light == 0 && totals.dark - halfThreshold >= 0) {
                return PersonalityAlignmentType.Darkside;
            }
            if (totals.dark == 0 && totals.light - halfThreshold >= 0) {
                return PersonalityAlignmentType.Lightside;
            }
            if (totals.light + totals.dark > totals.neutral) {
                var darkIsStrongerThanLight = totals.dark > totals.light;
                var darkIsStrongerThanLightAndNeutral = totals.dark > totals.neutral + totals.light;
                var lightIsStrongerThanDark = totals.light > totals.dark;
                var lightIsStrongerThanDarkAndNeutral = totals.light > totals.neutral + totals.dark;
                if (darkIsStrongerThanLight && darkIsStrongerThanLightAndNeutral) {
                    return PersonalityAlignmentType.Darkside;
                }
                if (lightIsStrongerThanDark && lightIsStrongerThanDarkAndNeutral) {
                    return PersonalityAlignmentType.Lightside;
                }
            }
        }
        return null;
    };
    AlignmentService.prototype.findAlignmentValue = function (metrics) {
        if (metrics.isEvil) {
            return PersonalityAlignmentType.Darkside;
        }
        else if (metrics.isGood) {
            return PersonalityAlignmentType.Lightside;
        }
        return PersonalityAlignmentType.Neutral;
    };
    AlignmentService.prototype.computeAlignmentMetrics = function (traits, threshold) {
        // Takes the strength of traits into account to compute the character's alignment
        var neutral = this.computePersonalityAlignmentMetricsSide(traits, PersonalityAlignmentType.Neutral);
        var light = this.computePersonalityAlignmentMetricsSide(traits, PersonalityAlignmentType.Lightside);
        var dark = this.computePersonalityAlignmentMetricsSide(traits, PersonalityAlignmentType.Darkside);
        // Analyze thresholds to find out the alignment
        var validateThreshold = function (value, against1, against2) {
            return value.value - threshold >= against1.value && value.value - threshold >= against2.value;
        };
        var isEvil = validateThreshold(dark, light, neutral);
        var isGood = validateThreshold(light, dark, neutral);
        var isNeutral = validateThreshold(neutral, light, dark);
        var isDefault = !(isNeutral || isGood || isEvil);
        // Count amount of exotic traits
        var exotic = traits.filter(function (trait) { return trait.isExotic; }).length;
        // Return PersonalityAlignmentMetrics
        return Object.assign(new PersonalityAlignmentMetrics(), {
            threshold: threshold,
            light: light,
            neutral: neutral,
            dark: dark,
            isGood: isGood,
            isNeutral: isNeutral,
            isEvil: isEvil,
            isDefault: isDefault,
            exotic: exotic
        });
    };
    AlignmentService.prototype.computePersonalityAlignmentMetricsSide = function (traits, type) {
        var computeContribution = function (accumulator, currentValue) {
            return accumulator + currentValue.strength.weight;
        };
        var computeStrongContribution = function (accumulator, currentValue) {
            return accumulator + (currentValue.stronglyAligned ? currentValue.strength.weight : 0);
        };
        var count = traits.filter(function (trait) { return trait.alignment == type; }).length;
        var strongCount = traits.filter(function (trait) { return trait.alignment == type && trait.stronglyAligned; }).length;
        var contribution = traits.filter(function (trait) { return trait.alignment == type; }).reduce(computeContribution, 0);
        var strongContribution = traits.filter(function (trait) { return trait.alignment == type; }).reduce(computeStrongContribution, 0);
        return {
            count: count,
            strongCount: strongCount,
            contribution: contribution,
            strongContribution: strongContribution,
            value: contribution + strongContribution
        };
    };
    return AlignmentService;
}());
exports.AlignmentService = AlignmentService;
// Input
var PersonalityOptions = /** @class */ (function () {
    function PersonalityOptions() {
        this.events = new Array();
        this.randomPersonalityTrait = 0;
        this.alignmentThreshold = 2;
    }
    return PersonalityOptions;
}());
exports.PersonalityOptions = PersonalityOptions;
// Output
var Personality = /** @class */ (function () {
    function Personality() {
        this.traits = new Array();
        this.alignment = new PersonalityAlignment();
    }
    return Personality;
}());
exports.Personality = Personality;
var PersonalityAlignment = /** @class */ (function () {
    function PersonalityAlignment() {
        this.value = PersonalityAlignmentType.Neutral;
        this.tendToward = PersonalityAlignmentType.Neutral;
        this.metrics = new PersonalityAlignmentMetrics();
    }
    return PersonalityAlignment;
}());
exports.PersonalityAlignment = PersonalityAlignment;
var PersonalityAlignmentMetrics = /** @class */ (function () {
    function PersonalityAlignmentMetrics() {
    }
    Object.defineProperty(PersonalityAlignmentMetrics.prototype, "totals", {
        get: function () {
            var copy = Object.assign({}, this);
            return new PersonalityAlignmentMetricsTotals(copy);
        },
        enumerable: true,
        configurable: true
    });
    return PersonalityAlignmentMetrics;
}());
exports.PersonalityAlignmentMetrics = PersonalityAlignmentMetrics;
var PersonalityAlignmentMetricsTotals = /** @class */ (function () {
    function PersonalityAlignmentMetricsTotals(owner) {
        this.owner = owner;
    }
    Object.defineProperty(PersonalityAlignmentMetricsTotals.prototype, "light", {
        get: function () {
            return this.owner.light.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonalityAlignmentMetricsTotals.prototype, "neutral", {
        get: function () {
            return this.owner.neutral.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonalityAlignmentMetricsTotals.prototype, "dark", {
        get: function () {
            return this.owner.dark.value;
        },
        enumerable: true,
        configurable: true
    });
    return PersonalityAlignmentMetricsTotals;
}());
exports.PersonalityAlignmentMetricsTotals = PersonalityAlignmentMetricsTotals;
var PersonalityAlignmentMetricsSide = /** @class */ (function () {
    function PersonalityAlignmentMetricsSide() {
    }
    Object.defineProperty(PersonalityAlignmentMetricsSide.prototype, "value", {
        get: function () {
            return this.contribution + this.strongContribution;
        },
        enumerable: true,
        configurable: true
    });
    return PersonalityAlignmentMetricsSide;
}());
exports.PersonalityAlignmentMetricsSide = PersonalityAlignmentMetricsSide;
var PersonalityTrait = /** @class */ (function () {
    function PersonalityTrait() {
    }
    return PersonalityTrait;
}());
exports.PersonalityTrait = PersonalityTrait;
var PersonalityTraitStrength = /** @class */ (function () {
    function PersonalityTraitStrength() {
    }
    return PersonalityTraitStrength;
}());
exports.PersonalityTraitStrength = PersonalityTraitStrength;
var PersonalityStrength;
(function (PersonalityStrength) {
    PersonalityStrength["Trivial"] = "Trivial";
    PersonalityStrength["Weak"] = "Weak";
    PersonalityStrength["Average"] = "Average";
    PersonalityStrength["Strong"] = "Strong";
    PersonalityStrength["Driving"] = "Driving";
    PersonalityStrength["Obsessive"] = "Obsessive";
})(PersonalityStrength || (PersonalityStrength = {}));
var PersonalityStrengthDescription;
(function (PersonalityStrengthDescription) {
    PersonalityStrengthDescription["Trivial"] = "Feature is barely noticeable, even when actively af- fecting the character. Special circumstancesm ay have to exist for the feature to come into play.";
    PersonalityStrengthDescription["Weak"] = "Feature is easily sublimated, overcome, or ignored, but is noticable when actively affecting character.";
    PersonalityStrengthDescription["Average"] = "There is an uneasy balance. Feature is not active unless the character is caught off guard or is too fatigued to control himself.";
    PersonalityStrengthDescription["Strong"] = "Unless character consciously resists the feature, it manifests itself strongly.";
    PersonalityStrengthDescription["Driving"] = "Feature dominates the character's life - character finds it difficult to resist its compulsions.";
    PersonalityStrengthDescription["Obsessive"] = "Character cannot rest or find peace unless actively pursuing the desires, needs or compulsions of the feature.";
})(PersonalityStrengthDescription || (PersonalityStrengthDescription = {}));
var PersonalityAlignmentType;
(function (PersonalityAlignmentType) {
    PersonalityAlignmentType["Lightside"] = "Lightside";
    PersonalityAlignmentType["Neutral"] = "Neutral";
    PersonalityAlignmentType["Darkside"] = "Darkside";
})(PersonalityAlignmentType = exports.PersonalityAlignmentType || (exports.PersonalityAlignmentType = {}));
//
// Generation models
//
var TraitTypes;
(function (TraitTypes) {
    TraitTypes["None"] = "None";
    TraitTypes["Lightside"] = "Lightside";
    TraitTypes["Neutral"] = "Neutral";
    TraitTypes["Darkside"] = "Darkside";
    TraitTypes["Exotic"] = "Exotic";
})(TraitTypes || (TraitTypes = {}));
var TraitStrength;
(function (TraitStrength) {
    TraitStrength["Trivial"] = "Trivial";
    TraitStrength["Weak"] = "Weak";
    TraitStrength["Average"] = "Average";
    TraitStrength["Strong"] = "Strong";
    TraitStrength["Driving"] = "Driving";
    TraitStrength["Obsessive"] = "Obsessive";
    TraitStrength["Random"] = "Random";
})(TraitStrength || (TraitStrength = {}));
var EventAligment;
(function (EventAligment) {
    EventAligment["Lightside"] = "Lightside";
    EventAligment["Neutral"] = "Neutral";
    EventAligment["Darkside"] = "Darkside";
    EventAligment["Exotic"] = "Exotic";
    EventAligment["Random"] = "Random";
})(EventAligment = exports.EventAligment || (exports.EventAligment = {}));
var RandomGenerator = /** @class */ (function () {
    function RandomGenerator(randomService, elements) {
        this.randomService = randomService;
        this.elements = elements;
    }
    RandomGenerator.prototype.generate = function (input) {
        var result = this.randomService.pickOne(this.elements).value;
        return result.generate(input);
    };
    return RandomGenerator;
}());
exports.RandomGenerator = RandomGenerator;
var WeightenGenerator = /** @class */ (function () {
    function WeightenGenerator(randomService, elements) {
        var _this = this;
        this.randomService = randomService;
        this.elements = new Array();
        elements.forEach(function (element) {
            for (var i = 0; i < element.weight; i++) {
                _this.elements.push(element);
            }
        });
    }
    WeightenGenerator.prototype.generate = function (input) {
        var result = this.randomService.pickOne(this.elements).value;
        return result.generate(input);
    };
    return WeightenGenerator;
}());
exports.WeightenGenerator = WeightenGenerator;
var RerollDecorator = /** @class */ (function () {
    function RerollDecorator(generator) {
        this.generator = generator;
    }
    RerollDecorator.prototype.generate = function (input) {
        var result = new Array();
        var element = this.generator.generate(input);
        if (this.isReroll(element.name)) {
            var rerollAmount = this.parseReroll(element.name);
            for (var i = 0; i < rerollAmount + 1; i++) {
                var generated = this.generate(input);
                result.push.apply(result, generated);
            }
        }
        else {
            result.push(element);
        }
        return result;
    };
    RerollDecorator.prototype.isReroll = function (value) {
        return value.toLowerCase().startsWith('/reroll');
    };
    RerollDecorator.prototype.parseReroll = function (value) {
        try {
            var rerollCount = parseInt(value.replace('/reroll ', ''));
            if (isNaN(rerollCount)) {
                return 1;
            }
            return rerollCount;
        }
        catch (error) {
            return 1;
        }
    };
    return RerollDecorator;
}());
exports.RerollDecorator = RerollDecorator;
//
// Specific generators
//
var TraitAlignmentGenerator = /** @class */ (function (_super) {
    __extends(TraitAlignmentGenerator, _super);
    function TraitAlignmentGenerator(randomService) {
        return _super.call(this, randomService, [
            { weight: 3, generate: function () { return PersonalityAlignmentType.Lightside; } },
            { weight: 6, generate: function () { return PersonalityAlignmentType.Neutral; } },
            { weight: 3, generate: function () { return PersonalityAlignmentType.Darkside; } }
        ]) || this;
    }
    return TraitAlignmentGenerator;
}(WeightenGenerator));
exports.TraitAlignmentGenerator = TraitAlignmentGenerator;
var AttitudeGenerator = /** @class */ (function () {
    function AttitudeGenerator(randomService) {
        this.randomService = randomService;
        // prettier-ignore
        this.goodGenerator = new RandomGenerator(randomService, [
            { generate: function () { return ({ name: 'Ethical', description: '"What is true for one is true for all." is his watchword. He lives according to a strict, universal moral code of ethics. Values fair play and respects authority; does no evil to self or others; and works for the good of all.' }); } },
            { generate: function () { return ({ name: 'Conscientious', description: '"Each man knows his own \'good\' and defends it." sums up the conscientious character\'s beliefs. He lives according to a strict personalcode of ethics. He is often an indi- vidualist who works for the law and the good of the greatest num- ber of people, but who may distrust higher authority, living and working "outside the law." Includes vigilantes and "Robin Hood" type characters.' }); } },
            { generate: function () { return ({ name: 'Chivalrous', description: '"The strong are morally responsible to be the sheperds of the weak." is the chivalrous character\'s rule for life. Lives by the belief that the strong must protect the weak. This is often found among characters of Noble Social Status and knights.' }); } }
        ]);
        // prettier-ignore
        this.neutralGenerator = new RandomGenerator(randomService, [
            { generate: function () { return ({ name: 'Self-centered', description: '"What\'s in it for me?" is the watchword of the self-centered character. He tends to look out for his own interests above anything else, though there are limitsto what he willdo. Like the Lightside alignments, tends to have a high regard for life and freedom. He may be friendless, a mercenary who serves a cause only because it pays well, but once he gives his word or his loyalty, he does not go back on it. Nevertheless, there is no higher cause to him than self service and self preservation.' }); } },
            { generate: function () { return ({ name: 'Apathetic', description: '"What does it matter and who cares?" are his mottos. Such a character believes that nothing really matters in the end. He lives his life as if there were nothing to be accountable for often choosing to side with good or evil because he doesn\'t care which wins.' }); } },
            { generate: function () { return ({ name: 'Materialistic', description: '"He whodies with the most toys, wins!" Is this character\'s battle-cry. This greedy character puts great emphasis on material things, particularly ones he can own. He strives to own the best of everything and may compromlse other principles for self gain. Like the self-centered character, he takes the course of action that will best suit his desires for material gain.' }); } },
            { generate: function () { return ({ name: 'Anarchic', description: '"It\'s my life, I\'ll do as I please." Lives according to a loose personalcode of ethics, though he does not feel bound to tell the truth, keep his word or help others if there is nothing In it for him. An individualist who disrespects higher authority. Does what he pleases, when it pleases him.' }); } },
            { generate: function () { return ({ name: 'Egalitarian', description: '"Both sides have a right to their own views." He champions the underdog, regardless of whether that cause is good or evil. He believes in fairness and equality for all. He is like the chivalrous knight, in that he is dedicated to his code of honor. Un- fortunately, the causes that he champions may not be the best for society.' }); } },
            { generate: function () { return ({ name: 'Conformist', description: '"Don\'t make waves," "Don\'t stick your neckout" and "It\'s none of my business" are his quotable quotes. He\'s Joe-average and likes it that way. He goes with the flow. His values are the popular ones for his times and make no effort to side with or against good or evil.' }); } }
        ]);
        // prettier-ignore
        this.evilGenerator = new RandomGenerator(randomService, [
            { generate: function () { return ({ name: 'Depraved', description: 'Self-serving and unscrupulous. Like the Self- centered attitude (see above) seeks to fullfil personal desires, but unlike that attitude, this character will do anything to obtain his goals. Adepravedcharacter may even torture and killforthe sheer fun of it.' }); } },
            { generate: function () { return ({ name: 'Deviant', description: 'Like the Ethical attitude, this character lives by a strict andordered moral code. Butthiscode iscenteredaroundthe Deviant character\'s self-centered personal goals. He respects honor and self-discipline in others, and may even protect the innocent, but will not tolerate anyone who works to cross him. ' }); } },
            { generate: function () { return ({ name: 'Diabolical', description: 'The despicable Diabolical character has no code of ethics. He is unpredictable, helps others onlyto be able to hurt them later, despises all that is honorable, disciplined or that reminds him of authority.' }); } }
        ]);
    }
    AttitudeGenerator.prototype.generate = function (personality) {
        switch (personality.alignment.value) {
            case PersonalityAlignmentType.Lightside:
                return this.goodGenerator.generate(personality);
            case PersonalityAlignmentType.Neutral:
                return this.neutralGenerator.generate(personality);
            case PersonalityAlignmentType.Darkside:
                return this.evilGenerator.generate(personality);
        }
    };
    return AttitudeGenerator;
}());
exports.AttitudeGenerator = AttitudeGenerator;
// p.69-70
// 643: Personality Traits
var PersonalityTraitGenerator = /** @class */ (function () {
    function PersonalityTraitGenerator(randomService) {
        this.randomService = randomService;
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
    PersonalityTraitGenerator.prototype.generate = function (input) {
        var _this = this;
        var traits = new Array();
        // Make one
        var roller;
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
        var result = roller.generate(input).map(function (r) { return _this.createTraitFrom(input.event, r); });
        traits.push.apply(traits, result);
        return traits;
    };
    PersonalityTraitGenerator.prototype.createTraitFrom = function (event, description) {
        var custom = {
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
    };
    PersonalityTraitGenerator.prototype.weightTrait = function (event) {
        var trivialWeight = 0.5;
        var normalWeight = 1;
        var drivingWeight = 1.5;
        var obsessiveWeight = 2;
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
    };
    return PersonalityTraitGenerator;
}());
exports.PersonalityTraitGenerator = PersonalityTraitGenerator;
var DescriptibleAndAlignableGenerator = /** @class */ (function (_super) {
    __extends(DescriptibleAndAlignableGenerator, _super);
    function DescriptibleAndAlignableGenerator(randomService, elements) {
        return _super.call(this, randomService, elements.map(function (e) {
            return Object.assign(e, {
                generate: function () { return e; }
            });
        })) || this;
    }
    return DescriptibleAndAlignableGenerator;
}(RandomGenerator));
exports.DescriptibleAndAlignableGenerator = DescriptibleAndAlignableGenerator;
// p.71
// 644: Exotic Personality Traits
var ExoticPersonalityTraitGenerator = /** @class */ (function () {
    function ExoticPersonalityTraitGenerator(randomService) {
        this.traitAlignmentGenerator = new TraitAlignmentGenerator(randomService);
    }
    ExoticPersonalityTraitGenerator.prototype.generate = function (input) {
        var result = new Array();
        // TODO: implement this
        result.push(Object.assign(new ExoticPersonalityTrait(), input.event, {
            name: 'ExoticPersonalityTrait',
            description: 'TODO: implement this',
            alignment: this.traitAlignmentGenerator.generate(input),
            isExotic: true
        }));
        return result;
    };
    return ExoticPersonalityTraitGenerator;
}());
exports.ExoticPersonalityTraitGenerator = ExoticPersonalityTraitGenerator;
var ExoticPersonalityTrait = /** @class */ (function (_super) {
    __extends(ExoticPersonalityTrait, _super);
    function ExoticPersonalityTrait() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ExoticPersonalityTrait;
}(PersonalityTrait));
exports.ExoticPersonalityTrait = ExoticPersonalityTrait;
var ExoticFeature = /** @class */ (function () {
    function ExoticFeature() {
    }
    return ExoticFeature;
}());
exports.ExoticFeature = ExoticFeature;
//# sourceMappingURL=AlignmentAndAttitudeGenerator.js.map