"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var strEnum_1 = require("../utilities/strEnum");
// 312: Alignment & Attitude
var AlignmentAndAttitudeGenerator = /** @class */ (function () {
    function AlignmentAndAttitudeGenerator(randomService) {
        this.randomService = randomService;
        this.traitStrengthGenerator = new WeightenGenerator(randomService, [
            { weight: 2, generate: function () { return PersonalityStrength.Trivial; } },
            { weight: 4, generate: function () { return PersonalityStrength.Weak; } },
            { weight: 10, generate: function () { return PersonalityStrength.Average; } },
            { weight: 4, generate: function () { return PersonalityStrength.Strong; } },
            { weight: 3, generate: function () { return PersonalityStrength.Driving; } },
            { weight: 1, generate: function () { return PersonalityStrength.Obsessive; } }
        ]);
        this.personalityTraitTypesGenerator = new WeightenGenerator(randomService, [
            { weight: 10, generate: function () { return PersonalityTraitTypes.None; } },
            { weight: 3, generate: function () { return PersonalityTraitTypes.Lightside; } },
            { weight: 3, generate: function () { return PersonalityTraitTypes.Neutral; } },
            { weight: 3, generate: function () { return PersonalityTraitTypes.Darkside; } },
            { weight: 1, generate: function () { return PersonalityTraitTypes.Exotic; } }
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
                alignment: traitType,
                strength: TraitStrength.Random
            });
        }
        // Generate the random PersonalityTrait strength and alignment based on past events
        input.events.forEach(function (event) {
            if (event.strength == TraitStrength.Random) {
                event.strength = _this.traitStrengthGenerator.generate({ personality: personality, event: event });
            }
            if (event.alignment == 'Random') {
                event.alignment = _this.traitAlignmentGenerator.generate({ personality: personality, event: event });
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
        var alignmentThreshold = (personality.alignment.metrics.threshold = input.alignmentThreshold);
        var neutralSided = (personality.alignment.metrics.neutral = personality.traits.filter(function (trait) { return trait.alignment == 'Neutral'; }).length);
        var lightSided = (personality.alignment.metrics.light = personality.traits.filter(function (trait) { return trait.alignment == 'Lightside'; }).length);
        var darksided = (personality.alignment.metrics.dark = personality.traits.filter(function (trait) { return trait.alignment == 'Darkside'; }).length);
        var couldBeEvil = (personality.alignment.metrics.couldBeEvil =
            darksided - alignmentThreshold > lightSided || darksided - alignmentThreshold > neutralSided);
        var couldBeGood = (personality.alignment.metrics.couldBeGood =
            lightSided - alignmentThreshold > darksided || lightSided - alignmentThreshold > neutralSided);
        personality.alignment.metrics.exotic = personality.traits.filter(function (trait) { return trait.isExotic; }).length;
        //
        // TODO: take the strength of traits into account to compute the character's alignment
        // Maybe as simple as:
        // - 'Trivial' = -1
        // - 'Weak', 'Average', 'Strong' = 0
        // - 'Driving' = +1
        // - 'Obsessive' = +2
        //
        // Sets the character's alignment
        if (couldBeEvil && !couldBeGood) {
            personality.alignment.value = 'Darkside';
        }
        else if (!couldBeEvil && couldBeGood) {
            personality.alignment.value = 'Lightside';
        }
        else if (couldBeEvil && couldBeGood && lightSided != darksided) {
            personality.alignment.value = lightSided > darksided ? 'Lightside' : 'Darkside';
        }
        // Sets the character's alignment "tend toward" value
        if (darksided > lightSided && darksided > neutralSided && personality.alignment.value != 'Darkside') {
            personality.alignment.tendToward = 'Darkside';
        }
        if (lightSided > darksided && lightSided > neutralSided && personality.alignment.value != 'Lightside') {
            personality.alignment.tendToward = 'Lightside';
        }
        if (neutralSided > darksided && neutralSided > lightSided && personality.alignment.value != 'Neutral') {
            personality.alignment.tendToward = 'Neutral';
        }
        // Compute attitude
        personality.attitude = this.attitudeGenerator.generate(personality);
        // Return the personality
        return personality;
    };
    return AlignmentAndAttitudeGenerator;
}());
exports.AlignmentAndAttitudeGenerator = AlignmentAndAttitudeGenerator;
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
        this.value = 'Neutral';
        this.metrics = new PersonalityAlignmentMetrics();
    }
    return PersonalityAlignment;
}());
exports.PersonalityAlignment = PersonalityAlignment;
var PersonalityAlignmentMetrics = /** @class */ (function () {
    function PersonalityAlignmentMetrics() {
    }
    return PersonalityAlignmentMetrics;
}());
exports.PersonalityAlignmentMetrics = PersonalityAlignmentMetrics;
var PersonalityTrait = /** @class */ (function () {
    function PersonalityTrait() {
    }
    return PersonalityTrait;
}());
exports.PersonalityTrait = PersonalityTrait;
var PersonalityStrength = strEnum_1.strEnum(['Trivial', 'Weak', 'Average', 'Strong', 'Driving', 'Obsessive']);
//
// Generation models
//
var PersonalityAlignmentType = strEnum_1.strEnum(['Lightside', 'Neutral', 'Darkside']);
var PersonalityTraitTypes = strEnum_1.strEnum(['None', 'Lightside', 'Neutral', 'Darkside', 'Exotic']);
var TraitStrength = strEnum_1.strEnum(['Trivial', 'Weak', 'Average', 'Strong', 'Driving', 'Obsessive', 'Random']);
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
            return parseInt(value.replace('/reroll ', ''));
        }
        catch (error) {
            return 1;
        }
    };
    return RerollDecorator;
}());
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
var PersonalityTraitGenerator = /** @class */ (function () {
    function PersonalityTraitGenerator(randomService) {
        this.randomService = randomService;
        this.exoticGenerator = new ExoticPersonalityTraitGenerator(randomService);
        // prettier-ignore
        this.lightGenerator = new RerollDecorator(new DescriptibleAndAlignableGenerator(randomService, [
            { stronglyAligned: false, name: 'Optimist', description: 'always see the good side of things. ' },
            { stronglyAligned: true, name: 'Altruist', description: "selfless concern or others' welfare. " },
            { stronglyAligned: false, name: 'Helpful', description: 'helps others in need ' },
            { stronglyAligned: true, name: 'Kindly', description: 'warmhearted and friendly. ' },
            { stronglyAligned: false, name: 'Careful', description: 'cautious in thought and deed. ' },
            { stronglyAligned: false, name: 'Considerate', description: "thinks of others' feelings. " },
            { stronglyAligned: false, name: 'Sober', description: 'serious, plain-thinking, straightforward. ' },
            { stronglyAligned: false, name: 'Teetotaler', description: 'abstains from drinking alcohol. ' },
            { stronglyAligned: true, name: 'Trusting', description: 'trusts others to behave correctly. ' },
            { stronglyAligned: false, name: 'Peaceful', description: 'serene Of spirit. ' },
            { stronglyAligned: false, name: 'Peacemaker', description: 'attempts to calm others. ' },
            { stronglyAligned: false, name: 'Pious', description: 'reverently devoted to the worship of God. ' },
            { stronglyAligned: true, name: 'Honest', description: 'always gives what is due. ' },
            { stronglyAligned: false, name: 'Loving', description: 'affectionately concerned for others. ' },
            { stronglyAligned: false, name: 'Giving', description: 'gives of self and possessions. ' },
            { stronglyAligned: false, name: 'Organized', description: 'everything has a place ' },
            { stronglyAligned: false, name: 'Clean', description: 'practices good hygiene. ' },
            { stronglyAligned: false, name: 'Punctual', description: 'always on time ' },
            { stronglyAligned: false, name: 'Self-confident', description: 'sure Of self and abilities. ' },
            { stronglyAligned: false, name: 'Courageous', description: 'brave in the face of adversity. ' },
            { stronglyAligned: false, name: 'Respectful', description: 'shows respect for others. ' },
            { stronglyAligned: false, name: 'Calm', description: 'difficult to anger, a peaceful spirit. ' },
            { stronglyAligned: false, name: 'Patient', description: 'able to wait with calmness. ' },
            { stronglyAligned: false, name: 'Wise', description: 'understands what is true, or lasting. ' },
            { stronglyAligned: false, name: 'Generous', description: 'willing to give more than fairly. ' },
            { stronglyAligned: false, name: 'Imaginative', description: 'a clever, resourceful mind. ' },
            { stronglyAligned: true, name: 'Forgiving', description: 'able to pardon faults in others. ' },
            { stronglyAligned: true, name: 'Virtuous', description: 'chaste. pure, of excellent morals. ' },
            { stronglyAligned: false, name: 'Dependable', description: 'does duties reliably, responsibly. ' },
            { stronglyAligned: false, name: 'Well-mannered', description: 'polite, courteous. ' },
            { stronglyAligned: true, name: 'Benign', description: 'gentle, inoffensive. ' },
            { stronglyAligned: false, name: 'Friendly', description: 'warm and comforting. ' },
            { stronglyAligned: false, name: 'Humble', description: 'lack of pretense, not proud. ' },
            { stronglyAligned: false, name: 'Energetic', description: 'does things quickly, with verve. ' },
            { stronglyAligned: true, name: 'Truthful', description: 'always tells the truth. ' },
            { stronglyAligned: false, name: 'Cheerful', description: 'always happy and smiling. ' },
            { stronglyAligned: false, name: 'Enthusiastic', description: "excited, can't wait to act. " },
            { stronglyAligned: false, name: 'Thrifty', description: 'careful with money. ' },
            { stronglyAligned: false, name: 'Diplomatic', description: 'careful to say the right thing. ' },
            { stronglyAligned: false, name: 'Extra trait', description: 'roll twice more on this table ' }
        ]));
        // prettier-ignore
        this.neutralGenerator = new RerollDecorator(new DescriptibleAndAlignableGenerator(randomService, [
            { stronglyAligned: false, name: 'Curious', description: 'inquisitive, needs to know.' },
            { stronglyAligned: false, name: 'Hedonist', description: 'pleasure is the most important thing.' },
            { stronglyAligned: false, name: 'Precise', description: 'always exacting.' },
            { stronglyAligned: false, name: 'Studious', description: 'studios often, pays attention to detail.' },
            { stronglyAligned: false, name: 'Mysterious', description: 'has an air of mystery about him.' },
            { stronglyAligned: false, name: 'Loquacious', description: 'talks and talks and talks and ...' },
            { stronglyAligned: false, name: 'Silent', description: 'rarely talks.' },
            { stronglyAligned: false, name: 'Foppish', description: 'vain. preoccupied with appearance.' },
            { stronglyAligned: false, name: 'Immaculate', description: 'clean and orderly.' },
            { stronglyAligned: false, name: 'Rough', description: 'unpolished, unrefined.' },
            { stronglyAligned: false, name: 'Skeptic', description: 'disbelieving of things unproven.' },
            { stronglyAligned: false, name: 'Immature', description: 'acts younger than age.' },
            { stronglyAligned: false, name: 'Even-tempered', description: 'rarely angry or over joyous.' },
            { stronglyAligned: false, name: 'Rash', description: 'acts before thinking.' },
            { stronglyAligned: false, name: 'Extroverted', description: 'outgoing.' },
            { stronglyAligned: false, name: 'Introverted', description: "focus one's interests in oneself." },
            { stronglyAligned: false, name: 'Materialistic', description: 'puts emphasis on possessions.' },
            { stronglyAligned: false, name: 'Aesthetic', description: 'possessions are unnecessary.' },
            { stronglyAligned: false, name: 'Amoral', description: 'no care for right or wrong.' },
            { stronglyAligned: false, name: 'Dreamy', description: 'a distant daydreamer.' },
            { stronglyAligned: false, name: 'Creative', description: 'able to make something out of nothing.' },
            { stronglyAligned: false, name: 'Leader', description: 'takes initiative, can take command.' },
            { stronglyAligned: false, name: 'Follower', description: 'prefers to let others lead.' },
            { stronglyAligned: false, name: 'Emotional', description: 'rarely keeps emotions in check.' },
            { stronglyAligned: false, name: 'Emotionless', description: 'rarely shows emotions.' },
            { stronglyAligned: false, name: 'Humorous', description: 'appreciates humor and Ikes to joke.' },
            { stronglyAligned: false, name: 'Grim', description: 'unsmiling. humorless, stern of purpose.' },
            { stronglyAligned: false, name: 'Conservative', description: 'restrained, opposed to change.' },
            { stronglyAligned: false, name: 'Liberal', description: 'tolerant of Others, open to change.' },
            { stronglyAligned: false, name: 'Aggressive', description: 'assertive, bold, enterprising.' },
            { stronglyAligned: false, name: 'Passive', description: 'accepts things without resisting them.' },
            { stronglyAligned: false, name: 'Self-sufficient', description: 'does not need others.' },
            { stronglyAligned: false, name: 'Dependent', description: 'needs others around him.' },
            { stronglyAligned: false, name: 'Romantic', description: 'given to feelings of romance.' },
            { stronglyAligned: false, name: 'Logical', description: 'uses deductive reasoning.' },
            { stronglyAligned: false, name: 'Illogical', description: 'may not use reason to make decisions.' },
            { stronglyAligned: false, name: 'Frivolous', description: 'flighty. harebrained, rarely serious.' },
            { stronglyAligned: false, name: 'Aloof', description: 'distant from others, even cold.' },
            { stronglyAligned: false, name: 'Atheistic', description: 'denies the existence of the supernatural.' },
            { stronglyAligned: false, name: 'Extra trait', description: 'roll twice more on this table ' }
        ]));
        // prettier-ignore
        this.darkGenerator = new RerollDecorator(new DescriptibleAndAlignableGenerator(randomService, [
            { stronglyAligned: false, name: 'Pessimist', description: 'always see the bad side Of things.' },
            { stronglyAligned: false, name: 'Egoist', description: 'selfish concern for own welfare.' },
            { stronglyAligned: false, name: 'Obstructive', description: 'acts to block Others actions.' },
            { stronglyAligned: true, name: 'Cruel', description: 'coldhearted and hurtful.' },
            { stronglyAligned: false, name: 'Careless', description: 'incautious in thought and deed.' },
            { stronglyAligned: false, name: 'Thoughtless', description: "rarely thinks of others' feelings." },
            { stronglyAligned: false, name: 'Flippant', description: 'unable to be serious about anything.' },
            { stronglyAligned: false, name: 'Drunkard', description: 'constantly overindulges in alcohol.' },
            { stronglyAligned: false, name: 'Suspicious', description: 'trusts no one.' },
            { stronglyAligned: true, name: 'Violent', description: 'seeks physical conflict.' },
            { stronglyAligned: false, name: 'Argumentative', description: 'starts arguments and fights.' },
            { stronglyAligned: true, name: 'Irreverent', description: 'mocks religion and the gods.' },
            { stronglyAligned: true, name: 'Cheat', description: 'shortchanges others of their due.' },
            { stronglyAligned: true, name: 'Hateful', description: 'strongly dislikes others.' },
            { stronglyAligned: false, name: 'Selfish', description: 'unwilling to share time and possessions.' },
            { stronglyAligned: false, name: 'Slovenly', description: 'messy, nothing is ever put away.' },
            { stronglyAligned: false, name: 'Filthy', description: 'knows nothing of hygiene.' },
            { stronglyAligned: false, name: 'Tardy', description: 'always late.' },
            { stronglyAligned: false, name: 'Self-doubting', description: 'unsure Of self and abilities.' },
            { stronglyAligned: false, name: 'Cowardly', description: 'afraid to face adversity.' },
            { stronglyAligned: false, name: 'Disrespectful', description: 'does not show respect.' },
            { stronglyAligned: false, name: 'Angry', description: 'spirit always unsettled. never at peace.' },
            { stronglyAligned: false, name: 'Inpatient', description: 'unable to wait with calmness.' },
            { stronglyAligned: false, name: 'Foolish', description: 'unable to discern what is true or wise.' },
            { stronglyAligned: false, name: 'Greedy', description: 'hoards all for self.' },
            { stronglyAligned: false, name: 'Dull', description: 'a slow, uncreative mind.' },
            { stronglyAligned: false, name: 'Vengeful', description: 'revenge is the way to punish faults.' },
            { stronglyAligned: false, name: 'Immoral', description: 'lecherous, lawless, devoid of morals.' },
            { stronglyAligned: true, name: 'Untrustworthy', description: 'not worth trusting.' },
            { stronglyAligned: false, name: 'Rude', description: 'polite, courteous.' },
            { stronglyAligned: false, name: 'Harsh', description: 'ungentle, sharp-tongued.' },
            { stronglyAligned: false, name: 'Unfriendly', description: 'cold and distant.' },
            { stronglyAligned: false, name: 'Egotistic', description: 'proud and conceited.' },
            { stronglyAligned: false, name: 'Lazy', description: 'difficult to get motivated.' },
            { stronglyAligned: false, name: 'Liar', description: 'hardly ever tells the truth.' },
            { stronglyAligned: false, name: 'Morose', description: 'always gloomy and moody.' },
            { stronglyAligned: false, name: 'Unenthusiastic', description: 'get excited.' },
            { stronglyAligned: false, name: 'Spendthrift', description: 'spends money without thought.' },
            { stronglyAligned: false, name: 'Tactless', description: 'speaks before thinking.' },
            { stronglyAligned: false, name: 'Extra trait', description: 'roll twice more on this table ' }
        ]));
    }
    PersonalityTraitGenerator.prototype.generate = function (input) {
        var _this = this;
        var traits = new Array();
        // Make one
        var roller;
        switch (input.event.alignment) {
            // Lightside Trait: use Table 643A: Lightside Traits
            case PersonalityTraitTypes.Lightside:
                roller = this.lightGenerator;
                break;
            // Neutral Trait: use Table 643B: Neutral Traits
            case PersonalityTraitTypes.Neutral:
                roller = this.neutralGenerator;
                break;
            // Darkside Trait: use Table 643C: Darkside Traits
            case PersonalityTraitTypes.Darkside:
                roller = this.darkGenerator;
                break;
            // Exotic Personality Feature: use Table 644: Exotic Personality Traits
            case PersonalityTraitTypes.Exotic:
                roller = this.exoticGenerator;
                break;
        }
        var result = roller.generate(input).map(function (r) { return _this.createTraitFrom(input.event, r); });
        traits.push.apply(traits, result);
        return traits;
    };
    PersonalityTraitGenerator.prototype.createTraitFrom = function (event, description) {
        return Object.assign(new PersonalityTrait(), event, description, { source: { name: event.name } });
    };
    return PersonalityTraitGenerator;
}());
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
var ExoticPersonalityTrait = /** @class */ (function (_super) {
    __extends(ExoticPersonalityTrait, _super);
    function ExoticPersonalityTrait() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ExoticPersonalityTrait;
}(PersonalityTrait));
var ExoticFeature = /** @class */ (function () {
    function ExoticFeature() {
    }
    return ExoticFeature;
}());
//# sourceMappingURL=AlignmentAndAttitudeGenerator.js.map