import { Adventure } from './star-wars-adventure-generator';
import { RandomService } from './random-service';

export class StarWarsAdventureGenerator {
    private contractSelector: randomSelectionService;
    private themeSelector: randomSelectionService;
    private locationSelector: randomSelectionService;
    private macguffinSelector: randomSelectionService;
    private victimsAndNPCsSelector: randomSelectionService;
    private antagonistOrTargetSelector: randomSelectionService;
    private twistsOrComplicationsSelector: randomSelectionService;
    private dramaticRevealSelector: randomSelectionService;

    constructor(private randomService: RandomService) {
        this.contractSelector = new randomSelectionService(randomService, [
            'The Force (If a character is Force Sensitive they receive contact from either a force ghost or visions)',
            'Trade Guild (One of the many guilds of the Trade Federation has a job for you)',
            'Tech (Someone is looking to build or repair something)',
            "Friends & Family (Someone from one of the characters' background)",
            'Underworld (A crime lord or hutt is offering work)',
            'Locals (The locals of a planet need help)',
            'Happenstance (Sometimes you just get tangled up in things)',
            'Nobles (Some form of royalty or noble family is in need of your help)',
            'Jedi/Sith (A Jedi or Sith in hiding is offer a job, roll again to see what they are posing as if you roll 9 again they are open about who they are.)',
            "Rumor (You weren't hired, but there is a payday out there.)",
            'Rebel Alliance (The Rebels have contacted you for aid, if you are not a part of their ranks roll again to see who they are posing as.)',
            '/reroll 2',
            '/reroll 3'
        ]);
        this.themeSelector = new randomSelectionService(randomService, [
            'Escape/Survival (The adventure starts after things have already gone sour.)',
            'Hunt (You are searching for something… or someone)',
            'Violence (You are hired to harm or possibly kill someone)',
            'Kidnapping (Sometimes this is just a rescue in disguise)',
            'Prevent Something (The clock is already running)',
            'Protection (You are tasked with protecting something or someone.)',
            'Intel (You need to gather information on something)',
            "Rescue (It's time to be the cavalry.)",
            'Mystery (Little information is known or given.)',
            'Steal (You are tasked with stealing or destroying something.)',
            'Escort (All you have to do is get it there on time.)',
            'Discovery (Something new or long forgotten has surfaced and you are hired to check it out.)'
        ]);
        this.locationSelector = new randomSelectionService(randomService, [
            'Hutt Space or Crime Planet',
            'Wealthy Core World or Busy Trading Station',
            'Swamp Planet',
            'Fringe Planet',
            'Military Installation',
            'Desert Planet',
            'Forrest Moon',
            'City Planet or Space Station',
            'Asteroid or Barren Planet',
            'Imperial  Controlled Location or Detention Center',
            'Ocean Planet',
            'Open Space',
            '/reroll 2',
            '/reroll 3'
        ]);
        this.macguffinSelector = new randomSelectionService(randomService, [
            "Credits (Sometimes it's cold hard cash.)",
            'Information (The right info can be priceless)',
            'Rare / Dangerous Creature (Sometimes even your cargo wants you dead.)',
            'Jedi/Sith Artifact (Holocrons saber crystals ancient tech)',
            'Key (While not usually valuable on its own this item will lead to future riches and even possibly another Macguffin)',
            'Territory (Sometimes this is a planet, sometimes it’s a ship or station, either way this is something large enough for an entire group or community to use.)',
            'Medicine (More common in the outer rim, but sometimes simply getting the right medicine is valuable enough for a job.)',
            "Person (People aren't things, unless they are.)",
            'Owned (This is an item already in the possession of someone of power or might even be a fairly low value item worth a tremendous sum to a single character.)',
            "Secret (Sometimes what you've even looking for you don't full know what it is. This could be a seemingly normal item with a secret or something heavily protected)",
            'Tech (Cutting edge or experimental tech can always fetch a fair price.)',
            'Treasure (Something os valuable to even finding a buyer might be a job in itself, but always worth a heavy price.)'
        ]);
        this.victimsAndNPCsSelector = new randomSelectionService(randomService, [
            'Nobility (Someone of considerable wealth possibly dating back to pre-Imperial ties.)',
            'Child (Sometimes a kid gets sucked into the mix.)',
            "Family or Friend (Someone personal to a character's background.)",
            'Local Hero (Possibly a cameo from a more well-known character or just someone popular within the sector.)',
            'Jedi (Usually in hiding, but in possession of ancient knowledge.)',
            'Scavenger (Many in the galaxy are just scraping by reusing what others discard.)',
            'Refugee (The Empire in addition to Crime Lords and civil wars has laid waste many communities leaving refugees away from their home word al across the galaxy.)',
            'Rebel Alliance/ Imperial Officers (Always looking to help out the enemy of their enemy.)',
            'Explorers (For some in the galaxy staying in one place is just not enough.)',
            'Witness (Could be anyone, but they saw something useful to you.)',
            'The Force or Prerecording (For a force sensitive a force ghost or vision could be of aid, then again a simple holo recording could be found too.)',
            'Sith (They still lurk in the shadows and are likely never to reveal their true intensions, reroll for their cover identity.)'
        ]);
        this.antagonistOrTargetSelector = new randomSelectionService(randomService, [
            'Bounty Hunter (A common threat when working freelance.)',
            'Con Artist (Sometimes an enemy pretends to be a friend roll on the victim table for a cover identity.)',
            'Guild or Company (Even reputable businesses sometimes have darker sides.)',
            'Nobility (Usually fallen from power or under the influence of the Empire)',
            'Crime Lord (Usually a Hutt, but many other criminal organizations exist in the rim.)',
            'Force Sensitive (Roll again, but they also possess some power of the force.)',
            "Wanted Criminal (This isn't a normal threat, they are some of the baddest of the bad enough to be on Imperial radar.)",
            'Mercenary Group (An entire crew is far more deadly than a single threat.)',
            'Cult (Some say the Jedi and Sith fall into this, but many others in the galaxy has idealist or extremist views as well.)',
            'Force Sensitive Creature (The force can effect more than just the civilized races.)',
            "Dangerous Beast (Sometimes it's just about the hunt.)",
            "Assassins (Even worse than mercenaries these characters have one task and that's to kill.)"
        ]);
        this.twistsOrComplicationsSelector = new randomSelectionService(randomService, [
            "Ally with the Enemy (Sometimes it turns out the target isn't the real threat.)",
            "Betrayed by Contract (Sometimes it's a set up.)",
            'Disaster (Sometimes things just go wrong.)',
            "Diversion (Sometimes you aren't part of the REAL job.)",
            'Dodgy Ally (Sometimes you need help for less favorable sources.)',
            'False Contract (Your employer is an imposter and has no intension of paying.)',
            'Tech (Sometimes equipment or ships fail and other times the enemy gets their hands on far superior technology.)',
            'Old Enemy (A former enemy resurfaces)',
            'Old Friend (Sometimes in the end the target or enemy turns out to be a friend from your past.)',
            'On Two Fronts (Sometimes an entire third part gets involved complicating everything.)',
            'Time Limit (Sometimes a simple clock makes everything more difficult.)',
            'Trap (The entire job is a big complicated trap.)'
        ]);
        this.dramaticRevealSelector = new randomSelectionService(randomService, [
            'Destruction (Something about the final conflict will cause massive destruction.)',
            'Economic Disaster (Something about the outcome of this will most likely leave a lot of innocent people poor.)',
            'Environmental Damage (Something about the final conflict will cause massive damage to the surrounding environment.)',
            "Family / Friend (Completing the contract turns out to directly harm someone from a character's past.)",
            'Honor (Something during the final conflict will force the players to decide between completing the job or getting out alive.)',
            'Innocents (Some innocent NPCs will be potentially hurt during the final conflict, usually saving them may involve in failing to complete the job in the way intended.)',
            'Justice (Either a villain will escape or a character will be falsely blamed.)',
            "Loyalty (The final conflict puts a character's previous loyalties to the test.)",
            'Morality (To complete the job the characters will have to made a hard choice and do something morally wrong.)',
            'Reputation (The final conflict is going to make a lasting mark of the groups reputation for good or bad.)',
            'Truth (You will uncover some great or secret truth, possible lost jedi or sith knowledge.)',
            'Wealth (The final conflict reveals that not only will they be rewarded for the contract, but if they can make it back alive they may be bringing even greater wealth.'
        ]);
    }

    public generateAdventure(): Adventure {
        return {
            contract: this.contractSelector.select(),
            theme: this.themeSelector.select(),
            location: this.locationSelector.select(),
            macguffin: this.macguffinSelector.select(),
            victimsAndNPCs: this.victimsAndNPCsSelector.select(),
            antagonistOrTarget: this.antagonistOrTargetSelector.select(),
            twistsOrComplications: this.twistsOrComplicationsSelector.select(),
            dramaticReveal: this.dramaticRevealSelector.select()
        };
    }

    public generateAdventureElement(elementName: AdventureProperties): AdventureElement {
        const property = elementName + 'Selector';
        if ((this as any)[property]) {
            const selectionService = (this as any)[property] as randomSelectionService;
            if (selectionService) {
                const value: AdventureElement = {};
                value[elementName] = selectionService.select();
                return value;
            }
        }
        throw new Error(`StarWarsAdventureGenerator has no "${property}" or "${property}" is undefined.`);
    }
}

class randomSelectionService {
    constructor(private randomService: RandomService, private choices: string[]) {}
    public select(amount: number = 1): string[] {
        let results = new Array<string>();
        for (let i = 0; i < amount; i++) {
            const randomChoice = this.randomService.pickOne(this.choices).value;
            if (this.isReroll(randomChoice)) {
                const rerollAmount = this.parseReroll(randomChoice);
                const combinedSelection = this.select(rerollAmount);
                results = results.concat(combinedSelection);
                continue;
            }
            results.push(randomChoice);
        }
        return results;
    }

    public isReroll(value: string): boolean {
        return value.startsWith('/reroll');
    }

    public parseReroll(value: string): number {
        try {
            return parseInt(value.replace('/reroll ', ''));
        } catch (error) {
            return 1;
        }
    }
}

export interface Adventure {
    contract: string[];
    theme: string[];
    location: string[];
    macguffin: string[];
    victimsAndNPCs: string[];
    antagonistOrTarget: string[];
    twistsOrComplications: string[];
    dramaticReveal: string[];
}

export interface GeneratedElement {
    name: string;
    value: string[];
}

export const AdventureLabels = {
    contract: 'Contract',
    theme: 'Theme',
    location: 'Location',
    macguffin: 'Macguffin',
    victimsAndNPCs: 'Victims & NPCs',
    antagonistOrTarget: 'Antagonist / Target',
    twistsOrComplications: 'Twists / Complications',
    dramaticReveal: 'Dramatic Reveal'
};

export type AdventureProperties =
    | 'contract'
    | 'theme'
    | 'location'
    | 'macguffin'
    | 'victimsAndNPCs'
    | 'antagonistOrTarget'
    | 'twistsOrComplications'
    | 'dramaticReveal';

type AdventureElement = { [k in AdventureProperties]?: string[] };
