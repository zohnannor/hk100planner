import { CheckNames, SectionNames } from './types/checklist';
import { UnionToArray } from './types/util';

export const COLORS = {
    red: 'crimson',
    white: 'white',
    green: 'aquamarine',
    gray: 'silver',
} as const;

export const BREAKPOINTS = {
    mobile: 768,
    columns: 1024,
    laptop: 1440,
};

export const GRUB_REWARDS = [
    10, 20, 30, 40, 0, 50, 60, 70, 80, 0, 90, 100, 110, 120, 120, 0, 140, 150,
    160, 165, 170, 180, 0, 200, 200, 205, 210, 215, 220, 220, 0, 230, 235, 240,
    245, 250, 255, 0, 260, 265, 270, 280, 290, 295, 300, 0,
] as const;

export const HOLLOW_KNIGHT_SECTION_TITLES: Record<
    SectionNames<'hollow-knight'>,
    string
> = {
    bosses: '[Bosses](Bosses (Hollow Knight))',
    optionalBosses: '[Bosses](Bosses (Hollow Knight)) (no percents)',
    equipment: '[Equipment](Abilities)',
    spells: '[Spells]',
    nail: '[Nail]',
    dreamNail: '[Dream Nail]',
    nailArts: '[Nail Arts]',
    charms: '[Charms]',
    maskShards: '[Mask Shards]',
    vesselFragments: '[Vessel Fragments]',
    colosseum: '[Colosseum of Fools]',
    dreamers: '[Dreamers]',
    dreamWarriors: '[Warrior Dreams]',
    dreamBosses:
        '[Dream Bosses](Bosses (Hollow Knight)#Boss_Variants) (no percents)',
    godhome: '[Godhome]',
    grubs: '[Grubs](Grub#Rewards_and_locations) (no percents)',
    items: '[Items](Items (Hollow_Knight)) (no percents)',
    relics: '[Relics](Items (Hollow_Knight)#Tradables) (no percents)',
    whisperingRoots: '[Whispering Roots](Whispering Root) (no percents)',
    // endings: '[Endings](Endings (Hollow Knight))',
};

export const SILKSONG_SECTION_TITLES: Record<
    SectionNames<'silksong'>,
    string
> = {
    bosses: '[Bosses](Bosses (Silksong))',
    things: '[Things](Things (Silksong))',
};

export const HOLLOW_KNIGHT_DISTRIBUTED_SECTIONS = [
    [
        'bosses',
        'equipment',
        'spells',
        'dreamers',
        'charms',
        'items',
        'relics',
        // 'endings',
    ],
    [
        'nail',
        'dreamNail',
        'nailArts',
        'maskShards',
        'vesselFragments',
        'dreamWarriors',
        'dreamBosses',
        'colosseum',
        'godhome',
        'grubs',
        'whisperingRoots',
        'optionalBosses',
    ],
] as const satisfies SectionNames<'hollow-knight'>[][];

export const SILKSONG_DISTRIBUTED_SECTIONS = [
    ['bosses'],
    ['things'],
] as const satisfies SectionNames<'silksong'>[][];

type MissingHollowKnightSectionNames = UnionToArray<
    Exclude<
        SectionNames<'hollow-knight'>,
        (typeof HOLLOW_KNIGHT_DISTRIBUTED_SECTIONS)[number][number]
    >
>;

// Compile-time check to make sure all sections are used in
// `HOLLOW_KNIGHT_DISTRIBUTED_SECTIONS`.
const __missingHollowKnightSectionNames: MissingHollowKnightSectionNames = [];
void __missingHollowKnightSectionNames;

type MissingSilksongSectionNames = UnionToArray<
    Exclude<
        SectionNames<'silksong'>,
        (typeof SILKSONG_DISTRIBUTED_SECTIONS)[number][number]
    >
>;

// Compile-time check to make sure all sections are used in
// `SILKSONG_DISTRIBUTED_SECTIONS`.
const __missingSilksongSectionNames: MissingSilksongSectionNames = [];
void __missingSilksongSectionNames;

export const DESCRIPTION_TEXT =
    'This is a tool to help you plan your Hollow Knight ["Speed Completion"](Achievements (Hollow Knight)#Challenges) achievement checklist. ' +
    'For it, you need to achieve 100% completion in under 20 hours. ' +
    "As the game with all DLCs has a maximum of 112% completion, you can skip some of the checks from the base game you don't want to do, and do some from the DLC instead. " +
    'Additionally, [not everything counts as a percent](Completion (Hollow Knight)). ' +
    'So what should you do? ' +
    'Check the boxes and the tool will tell you what things depend on other things. ' +
    'Also helpful for ["Steel Heart"](Achievements (Hollow Knight)#Challenges) achievement!';

export const ABOUT_TEXT =
    'Made by [me](https://github.com/zohnannor) (mostly logic) and [my friend](https://github.com/swbuwk) (mostly design). ' +
    'Check out [the repo](https://github.com/zohnannor/hk100planner) and leave a star if you like it! :)';

export const OFFICIAL_TM_GRUB_NAMES: Record<
    CheckNames<'hollow-knight', 'grubs'>,
    string
> = {
    '[Forgotten Crossroads] behind [Husk Guard]': 'Stefan',
    '[Forgotten Crossroads] [Fog Canyon] entrance': 'Andy',
    '[Forgotten Crossroads] breakable wall': 'Jasper',
    '[Forgotten Crossroads] [Pogo](Nail#Nail-bouncing)': 'Pogo',
    '[Forgotten Crossroads] on a ledge': 'AAAA',
    '[Greenpath] with a moss block shortcut': 'Grassy',
    '[Greenpath] near acid': 'Mossy',
    '[Greenpath] behind [Moss Knight]': 'Leaf',
    '[Greenpath] in the middle of a [Durandoo] room': 'Pete',
    '[Fungal Wastes] behind a line of [Fungling]s': 'Blimpy',
    '[Fungal Wastes] near [Spore Shroom]': 'Thornando',
    '[City of Tears] on a ledge': 'Betty',
    '[City of Tears] behind [Great Husk Sentry]': 'Danger',
    '[City of Tears] in the [Desolate Dive] dive': 'Saul',
    '[City of Tears] under the entrance to the [Tower of Love]': 'Ricky',
    '[City of Tears] room leading to [Watcher Knight]': 'Zelda',
    '[Crystal Peak] from [Dirtmouth]': 'Christian',
    '[Crystal Peak] behind presses': 'Chris',
    '[Crystal Peak] near [Crystal Heart]': 'Christopher',
    "[Crystal Peak] on the way to [Hallownest's Crown]": 'Crissy',
    '[Crystal Peak] vertical conveyor belts lever': 'Crystal',
    '[Crystal Peak] from the top room with presses': 'Crimble',
    '[Crystal Peak] in the [Crystallized Mound]': 'Crispy Q.',
    '[Resting Grounds] [Crypts](Resting Grounds#Crypts)': 'Cataquack',
    '[Royal Waterways] behind a wall near water': 'Walter Ways',
    "[Royal Waterways] from the [Kingdom's Edge]": 'Hwurmples',
    "[Royal Waterways] above [Isma's Tear]": 'Ismoil',
    '[Howling Cliffs]': 'Stella',
    "[Kingdom's Edge] under [Oro]'s hut": 'Hoppita',
    "[Kingdom's Edge] behind a [Primal Aspid]": 'Perogi',
    '[Fog Canyon]': 'Jellifer',
    "[Queen's Gardens] under the [Stag] station": 'Frodo',
    "[Queen's Gardens] above the spiky roof": 'Smeagol',
    "[Queen's Gardens] near [White Lady]": 'Bilbo',
    '[Deepnest] among [Grub Mimic]s': 'Mimi',
    '[Deepnest] above the spike pit': 'Ben',
    '[Deepnest] on the way to [Nosk]': 'Elon Mosk',
    "[Deepnest] near the [Weavers' Den]": 'Sauron',
    "[Deepnest] in the [Beast's Den]": 'Leggy',
    '[Ancient Basin] above [Broken Vessel]': 'Wingothy',
    '[Ancient Basin] under [Cloth]': 'Grubetheus',
    '[The Hive] isolated room': 'Bimble',
    '[The Hive]': 'Honey',
    '[Tower of Love] #1': 'Grubly',
    '[Tower of Love] #2': 'Grubles',
    '[Tower of Love] #3': 'Grubathy',
};
