import { SilksongChecklistState } from '../types/checklist';

export const nothing = {} as const;
export const checked = { checked: true } as const;
export const grubs = { grubs: 1 } as const;
const maskShards = 1 as const;
const percent = 1 as const;
const simpleKeys = 1 as const;
const spoolFragments = 1 as const;
const tools = 1 as const;
const memoryLockets = 1 as const;
const paleOil = 1 as const;
const simpleKeysReq = 1 as const;
const paleOilReq = 1 as const;

const REAPER_BASE_SLOTS = 4;
const WANDERER_BASE_SLOTS = 4;
const BEAST_BASE_SLOTS = 3;
const WITCH_CREST_BASE_SLOTS = 3;
const ARCHITECT_CREST_BASE_SLOTS = 3;
const SHAMAN_CREST_BASE_SLOTS = 3;

const INITIAL_SILKSONG_CHECKLIST_STATE: SilksongChecklistState = {
    game: 'silksong',
    percent: 0,

    rosaries: 0,
    simpleKeys: 0,
    memoryLockets: 0,
    paleOil: 0,

    tools: 0,
    fleas: 0,
    maskShards: 0,
    spoolFragments: 0,
    acts: 1,

    rosariesReq: 0,
    simpleKeysReq: 0,
    memoryLocketsReq: [0],
    paleOilReq: 0,

    checks: {
        bosses: {
            '[Moss Mother]': { reward: nothing },
            '[Bell Beast]': { reward: nothing },
            '[Fourth Chorus]': { reward: nothing },
            '[Sister Splinter]': { reward: nothing },
            '[Savage Beastfly]': { reward: nothing },
            '[Widow]': { reward: nothing },
            '[Last Judge] / [Phantom]': {
                reward: { acts: 1 },
                requires: {
                    checks: { ancestralArts: { '[Needolin]': checked } },
                },
            },
            '[Savage Beastfly 2](Savage Beastfly#Far_Fields)': {
                reward: nothing,
                requires: { acts: 2 },
            },
            '[Cogwork Dancers]': { reward: nothing, requires: { acts: 2 } },
            '[Trobbio]': { reward: nothing, requires: { acts: 2 } },
            '[The Unravelled]': { reward: nothing, requires: { acts: 2 } },
            '[First Sinner]': {
                reward: nothing,
                requires: {
                    checks: { items: { '[Key of Apostate]': checked } },
                    acts: 2,
                },
            },
            '[Lace 2](Lace#The_Cradle)': {
                reward: nothing,
                requires: {
                    checks: {
                        melodies: {
                            "[Conductor's Melody]": checked,
                            "[Architect's Melody]": checked,
                            "[Vaultkeeper's Melody]": checked,
                        },
                    },
                    acts: 2,
                },
            },
            '[Grand Mother Silk]': {
                reward: nothing,
                requires: {
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                    acts: 2,
                },
            },
        },

        melodies: {
            "[Conductor's Melody]": {
                reward: nothing,
                requires: {
                    checks: { ancestralArts: { '[Clawline]': checked } },
                    acts: 2,
                },
            },
            "[Architect's Melody]": {
                reward: nothing,
                requires: {
                    checks: { ancestralArts: { '[Clawline]': checked } },
                    acts: 2,
                },
            },
            "[Vaultkeeper's Melody]": {
                reward: nothing,
                requires: {
                    checks: { items: { '[Sacred Cylinder]': checked } },
                    acts: 2,
                },
            },
        },

        silkHearts: {
            '[Bell Beast]': {
                reward: { percent },
                requires: { checks: { bosses: { '[Bell Beast]': checked } } },
            },
            '[Lace 2](Lace#The_Cradle)': {
                reward: { percent },
                requires: {
                    checks: {
                        bosses: { '[Lace 2](Lace#The_Cradle)': checked },
                    },
                    acts: 2,
                },
            },
            '[The Unravelled]': {
                reward: { percent },
                requires: {
                    checks: { bosses: { '[The Unravelled]': checked } },
                    acts: 2,
                },
            },
        },

        tools: {
            '[Shard Pendant]': { reward: { percent, tools } },
            '[Compass]': { reward: { percent, tools } },
            "[Druid's Eye] / [Druid's Eyes]": { reward: { percent, tools } },
            '[Straight Pin]': { reward: { percent, tools } },
            '[Warding Bell]': { reward: { percent, tools } },
            '[Treefold Pin]': { reward: { percent, tools } },
            '[Flea Brew]': { reward: { percent, tools } },
            '[Sting Shard]': { reward: { percent, tools } },
            '[Longpin]': { reward: { percent, tools } },
            '[Pollip Pouch]': { reward: { percent, tools } },
            '[Weavelight]': { reward: { percent, tools } },
            "[Dead Bug's Purse] / [Shell Satchel]": {
                reward: { percent, tools },
            },
            '[Plasmium Phial]': { reward: { percent, tools } },
            '[Silkspeed Anklets]': { reward: { percent, tools } },
            '[Pimpillo]': { reward: { percent, tools } },
            '[Barbed Bracelet]': { reward: { percent, tools } },
            '[Tacks]': { reward: { percent, tools } },
            '[Flintslate]': { reward: { percent, tools } },
            '[Silkshot]': { reward: { percent, tools } },
            "[Delver's Drill]": { reward: { percent, tools } },
            '[Injector Band]': { reward: { percent, tools } },
            '[Cogwork Wheel]': { reward: { percent, tools } },
            '[Scuttlebrace]': { reward: { percent, tools } },
            '[Memory Crystal]': { reward: { percent, tools } },
            '[Multibinder]': { reward: { percent, tools } },
            '[Voltvessels]': { reward: { percent, tools } },
            '[Wreath of Purity]': { reward: { percent, tools } },
            '[Longclaw]': { reward: { percent, tools } },
            '[Conchcutter]': { reward: { percent, tools } },
            "[Thief's Mark]": { reward: { percent, tools } },
            '[Throwing ring]': { reward: { percent, tools } },
            '[Magnetite Brooch]': { reward: { percent, tools } },
            '[Magma Bell]': { reward: { percent, tools } },
            '[Claw Mirror]': { reward: { percent, tools } },
            '[Spider Strings]': { reward: { percent, tools } },
            '[Rosary Cannon]': { reward: { percent, tools } },
            '[Wispfire Lantern]': { reward: { percent, tools } },
            '[Magnetite Dice]': { reward: { percent, tools } },
            '[Volt Filament]': { reward: { percent, tools } },
            '[Weighted Belt]': { reward: { percent, tools } },
            '[Egg of Flealia]': { reward: { percent, tools } },
            '[Fractured Mask]': { reward: { percent, tools } },
            '[Curveclaw] / [Curvesickle]': { reward: { percent, tools } },
            '[Quick Sling]': { reward: { percent, tools } },
            '[Cogfly]': { reward: { percent, tools } },
            '[Reserve Bind]': { reward: { percent, tools } },
            '[Pin Badge]': { reward: { percent, tools } },
            '[Sawtooth Circlet]': { reward: { percent, tools } },
            '[Spool Extender]': { reward: { percent, tools } },
            "[Ascendant's Grip]": { reward: { percent, tools } },
            '[Snitch Pick]': { reward: { percent, tools } },
        },

        silkSkills: {
            '[Silkspear]': {
                reward: { percent },
                requires: { checks: { bosses: { '[Moss Mother]': checked } } },
            },
            '[Thread Storm]': {
                reward: { percent },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        items: { "[Drifter's Cloak]": checked },
                    },
                },
            },
            '[Cross Stitch]': {
                description: 'Of the two, requires [Phantom] to be defeated.',
                reward: { percent },
                requires: {
                    checks: {
                        bosses: { '[Last Judge] / [Phantom]': checked },
                        ancestralArts: { '[Cling Grip]': checked },
                    },
                },
            },
            '[Sharpdart]': {
                reward: { percent },
                requires: {
                    checks: {
                        ancestralArts: { '[Needolin]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    acts: 2,
                },
            },
            '[Rune Rage]': {
                reward: { percent },
                requires: {
                    checks: { bosses: { '[First Sinner]': checked } },
                    acts: 2,
                },
            },
            '[Pale Nails]': {
                reward: { percent },
                requires: {
                    checks: {
                        bosses: { '[Grand Mother Silk]': checked },
                        ancestralArts: { '[Silk Soar]': checked },
                    },
                    acts: 3,
                },
            },
        },

        ancestralArts: {
            '[Swift Step]': {
                reward: { percent },
                requires: { checks: { bosses: { '[Moss Mother]': checked } } },
            },
            '[Cling Grip]': {
                reward: { percent },
                requires: {
                    checks: {
                        ancestralArts: { '[Swift Step]': checked },
                        bosses: { '[Sister Splinter]': checked },
                    },
                },
            },
            '[Needolin]': {
                reward: { percent },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        bosses: { '[Widow]': checked },
                    },
                },
            },
            '[Clawline]': {
                description:
                    'Alternatively, there is a path in [Whiteward]. At the end of the day, both are required.',
                reward: { percent },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        bosses: { '[Trobbio]': checked },
                    },
                    acts: 2,
                },
            },
            '[Silk Soar]': {
                reward: { percent },
                requires: {
                    checks: {
                        ancestralArts: {
                            '[Swift Step]': checked,
                            '[Cling Grip]': checked,
                        },
                    },
                    acts: 3,
                },
            },
            '[Needle Strike]': {
                reward: { percent },
                requires: {
                    checks: {
                        ancestralArts: {
                            '[Swift Step]': checked,
                            '[Cling Grip]': checked,
                        },
                    },
                },
            },
            '[Sylphsong]': {
                reward: { percent, memoryLocketsReq: [32] },
                requires: {
                    memoryLockets: 32,
                    checks: {
                        eva: { 'Further evolved [Hunter Crest]': checked },
                    },
                },
            },
        },

        crests: {
            '[Reaper Crest]': {
                reward: { percent, memoryLockets: REAPER_BASE_SLOTS },
                requires: {
                    checks: { items: { "[Drifter's Cloak]": checked } },
                },
            },
            '[Wanderer Crest]': {
                description: 'Alternatively, there is a path in [Wormways].',
                reward: { percent, memoryLockets: WANDERER_BASE_SLOTS },
                requires: {
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                },
            },
            '[Beast Crest]': {
                reward: { percent, memoryLockets: BEAST_BASE_SLOTS },
                requires: {
                    checks: {
                        bosses: { '[Savage Beastfly]': checked },
                        items: { "[Drifter's Cloak]": checked },
                    },
                },
            },
            '[Witch Crest]': {
                reward: { percent, memoryLockets: WITCH_CREST_BASE_SLOTS },
                requires: {
                    checks: { wishes: { '[Infestation Operation]': checked } },
                },
            },
            '[Architect Crest]': {
                reward: { percent, memoryLockets: ARCHITECT_CREST_BASE_SLOTS },
                requires: { checks: { items: { '[Architect Key]': checked } } },
            },
            '[Shaman Crest]': {
                reward: { percent, memoryLockets: SHAMAN_CREST_BASE_SLOTS },
                requires: {
                    checks: { ancestralArts: { '[Silk Soar]': checked } },
                    acts: 3,
                },
            },
        },

        eva: {
            'Evolved [Hunter Crest]': {
                reward: nothing,
                requires: {
                    checks: { ancestralArts: { '[Needolin]': checked } },
                },
            },
            '[Vesticrest] yellow slot': {
                reward: { memoryLocketsReq: [12] },
                requires: {
                    checks: { eva: { 'Evolved [Hunter Crest]': checked } },
                    memoryLockets: 12,
                },
            },
            '[Vesticrest] blue slot': {
                reward: { memoryLocketsReq: [20] },
                requires: {
                    checks: { eva: { '[Vesticrest] yellow slot': checked } },
                    memoryLockets: 20,
                },
            },
            'Further evolved [Hunter Crest]': {
                reward: { memoryLocketsReq: [27] },
                requires: {
                    checks: { eva: { '[Vesticrest] blue slot': checked } },
                    memoryLockets: 27,
                },
            },
        },

        maskShards: {
            '[Pebb] from [Bone Bottom] for [ROSARY] 300': {
                description:
                    'Bought from [Pebb] in [Bone Bottom] for [ROSARY] 300 in [Acts] 1/2 or from [Grindle] in [Blasted Steps] for [ROSARY] 320 in [Act 3], also requiring [Faydown Cloak].',
                reward: { maskShards, rosariesReq: 300 },
                requires: {
                    rosaries: 300,
                    checks: { bosses: { '[Moss Mother]': checked } },
                },
            },
            '[Wormways]': {
                description:
                    'Breakable wall just before the door requiring [Simple Key], after a room with [Craggler], accessed from [Mosshome].',
                reward: { maskShards },
            },
            '[Deep Docks] entrance': {
                description: 'A top passageway accessed from [The Marrow].',
                reward: { maskShards },
                requires: {
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                },
            },
            '[Far Fields] [Seamstress]': {
                reward: { maskShards },
                requires: {
                    checks: { items: { "[Drifter's Cloak]": checked } },
                },
            },
            '[Shellwood]': { reward: { maskShards } },
            '[Weavenest Alta]': {
                description: 'Platforming challenge to the right of [Eva].',
                reward: { maskShards },
                requires: {
                    checks: {
                        ancestralArts: {
                            '[Needolin]': checked,
                            '[Cling Grip]': checked,
                        },
                    },
                },
            },
            '[Jubilana] from [Songclave] for [ROSARY] 750': {
                reward: { maskShards, rosariesReq: 750 },
                requires: {
                    rosaries: 750,
                    acts: 2,
                },
            },
            'West [Cogwork Core]': {
                reward: { maskShards },
                requires: {
                    checks: { bosses: { '[Cogwork Dancers]': checked } },
                    acts: 2,
                },
            },
            '[Whispering Vaults]': {
                reward: { maskShards },
                requires: {
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                    acts: 2,
                },
            },
            '[Savage Beastfly] [Wish]': {
                reward: { maskShards },
                requires: {
                    checks: {
                        wishes: {
                            '[Savage Beastfly](Wishes#Grand_Hunt_Wishes)':
                                checked,
                        },
                    },
                    acts: 2,
                },
            },
            '[Far Fields] rising lava escape sequence': {
                reward: { maskShards },
                requires: {
                    checks: {
                        ancestralArts: { '[Clawline]': checked },
                        items: { "[Drifter's Cloak]": checked },
                    },
                    acts: 2,
                },
            },
            'West [Mount Fay]': {
                reward: { maskShards },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    acts: 2,
                },
            },
            '[Slab]': {
                description:
                    'Northeast part of [The Slab], inaccessible when first captured.',
                reward: { maskShards },
                requires: {
                    checks: {
                        items: {
                            '[Faydown Cloak]': checked,
                            '[Key of Apostate]': checked,
                        },
                    },
                    acts: 2,
                },
            },
            '[Bilewater]': {
                description:
                    'At the end of a hallway filled with [Slubberlugs].',
                reward: { maskShards },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    acts: 2,
                },
            },
            '[Wisp Thicket]': {
                reward: { maskShards },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    acts: 2,
                },
            },
            '[Blasted Steps]': {
                description: 'Above the entrance to [Pharloom].',
                reward: { maskShards },
                requires: {
                    checks: {
                        ancestralArts: { '[Clawline]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    acts: 2,
                },
            },
            '[Mount Fay] [Brightvein]': {
                reward: { maskShards },
                requires: {
                    checks: {
                        ancestralArts: {
                            '[Clawline]': checked,
                            '[Silk Soar]': checked,
                        },
                    },
                    acts: 3,
                },
            },
            '[Fastest in Pharloom] [Wish]': {
                reward: { maskShards },
                requires: {
                    checks: {
                        wishes: {
                            '[Fastest in Pharloom]': checked,
                        },
                    },
                    acts: 3,
                },
            },
            '[Dark Hearts] [Wish]': {
                reward: { maskShards },
                requires: {
                    checks: { wishes: { '[Dark Hearts]': checked } },
                    acts: 3,
                },
            },
            '[The Hidden Hunter] [Wish]': {
                reward: { maskShards },
                requires: {
                    checks: { wishes: { '[The Hidden Hunter]': checked } },
                    acts: 3,
                },
            },
        },

        needle: {
            '[Sharpened Needle](Needle#Upgrades)': {
                reward: { percent },
                requires: { checks: { bosses: { '[Widow]': checked } } },
            },
            '[Shining Needle](Needle#Upgrades)': {
                reward: { percent, paleOilReq },
                requires: {
                    paleOil,
                    checks: {
                        needle: {
                            '[Sharpened Needle](Needle#Upgrades)': checked,
                        },
                    },
                },
            },
            '[Hivesteel Needle](Needle#Upgrades)': {
                reward: { percent, paleOilReq, rosariesReq: 450 },
                requires: {
                    paleOil,
                    rosaries: 450,
                    checks: {
                        needle: {
                            '[Shining Needle](Needle#Upgrades)': checked,
                        },
                    },
                },
            },
            '[Palesteel Needle](Needle#Upgrades)': {
                reward: { percent, paleOilReq, rosariesReq: 680 },
                requires: {
                    paleOil,
                    rosaries: 680,
                    checks: {
                        needle: {
                            '[Hivesteel Needle](Needle#Upgrades)': checked,
                        },
                    },
                    acts: 3,
                },
            },
        },

        spoolFragments: {
            '[Bone Bottom]': {
                description: 'In a shortcut below [Mosshome].',
                reward: { spoolFragments },
            },
            '[Deep Docks] hot floor': {
                reward: { spoolFragments },
            },
            '[Weavenest Alta]': {
                reward: { spoolFragments },
                requires: {
                    checks: {
                        ancestralArts: {
                            '[Needolin]': checked,
                            '[Cling Grip]': checked,
                        },
                    },
                },
            },
            '[Frey] from [Bellhart] for [ROSARY] 270': {
                reward: { spoolFragments, rosariesReq: 270 },
                requires: {
                    rosaries: 270,
                    checks: { wishes: { '[My Missing Courier]': checked } },
                },
            },
            '[Greymoor]': {
                reward: { spoolFragments },
                requires: {
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                },
            },
            '[Slab]': {
                reward: { spoolFragments },
                requires: {
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                },
            },
            '[Grand Gate]': {
                reward: { spoolFragments },
                requires: { acts: 2 },
            },
            '[Underworks]': {
                reward: { spoolFragments },
                requires: { acts: 2 },
            },
            'From [Mooshka] at [Grand Gate]': {
                description:
                    '[Last Judge] cannot be skipped by finding 10 [Fleas] and travelling with the caravan.',
                reward: { spoolFragments },
                requires: {
                    fleas: 12,
                    checks: { bosses: { '[Last Judge] / [Phantom]': checked } },
                    acts: 2,
                },
            },
            '[Whiteward]': {
                description: 'Under the elevator.',
                reward: { spoolFragments },
                requires: {
                    checks: { items: { '[White Key]': checked } },
                    acts: 2,
                },
            },
            '[Cogwork Core]': {
                reward: { spoolFragments },
                requires: {
                    checks: { bosses: { '[Cogwork Dancers]': checked } },
                    acts: 2,
                },
            },
            '[Underworks] near [The Cauldron]': {
                reward: { spoolFragments },
                requires: { acts: 2 },
            },
            '[Balm for the Wounded] [Wish]': {
                reward: { spoolFragments },
                requires: {
                    checks: { wishes: { '[Balm for the Wounded]': checked } },
                    acts: 2,
                },
            },
            '[Jubilana] from [Songclave] for [ROSARY] 500': {
                reward: { spoolFragments, rosariesReq: 500 },
                requires: {
                    rosaries: 500,
                    checks: { wishes: { '[The Lost Merchant]': checked } },
                    acts: 2,
                },
            },
            '[Deep Docks] behind [Simple Key]': {
                reward: { spoolFragments, simpleKeysReq },
                requires: {
                    simpleKeys,
                    checks: {
                        ancestralArts: {
                            '[Clawline]': checked,
                            '[Cling Grip]': checked,
                        },
                    },
                    acts: 2,
                },
            },
            '[High Halls]': {
                reward: { spoolFragments },
                requires: {
                    checks: {
                        ancestralArts: { '[Clawline]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    acts: 2,
                },
            },
            '[Memorium]': {
                reward: { spoolFragments },
                requires: {
                    checks: {
                        ancestralArts: { '[Clawline]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    acts: 2,
                },
            },
            '[Grindle] for [ROSARY] 680': {
                reward: { spoolFragments, rosariesReq: 680 },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                    rosaries: 680,
                    acts: 2,
                },
            },
        },

        toolPouch: {
            "[Mort] from [Pilgrim's Rest] for [ROSARY] 220": {
                description:
                    'Bought from [Mort] in [Far Fields] for [ROSARY] 220 in [Acts] 1/2 or from [Grindle] in [Blasted Steps] for [ROSARY] 220 in [Act 3], also requiring [Faydown Cloak].',
                reward: { percent, rosariesReq: 220 },
                requires: {
                    rosaries: 220,
                    checks: { items: { "[Drifter's Cloak]": checked } },
                },
            },
            "[Loddie]'s pin challenge": {
                reward: { percent },
                requires: { checks: { bosses: { '[Widow]': checked } } },
            },
            "[Nuu]'s wish": {
                reward: { percent },
                requires: {
                    checks: { wishes: { '[Bugs of Pharloom]': checked } },
                },
            },
            'From [Mooshka] in [Fleatopia]': {
                reward: { percent },
                requires: { fleas: 22, acts: 2 },
            },
            '[Forge Daughter] for [ROSARY] 180': {
                reward: { percent, rosariesReq: 180 },
                requires: { rosaries: 180 },
            },
            '[Crawbug Clearing] [Wish]': {
                reward: { percent },
                requires: {
                    checks: { wishes: { '[Crawbug Clearing]': checked } },
                },
            },
            '[Twelfth Architect] for [ROSARY] 450': {
                reward: { percent, rosariesReq: 450 },
                requires: {
                    rosaries: 450,
                    checks: { ancestralArts: { '[Clawline]': checked } },
                    acts: 2,
                },
            },
            '[Grindle] for [ROSARY] 700': {
                reward: { percent, rosariesReq: 700 },
                requires: {
                    rosaries: 700,
                    checks: { items: { '[Faydown Cloak]': checked } },
                    acts: 2,
                },
            },
        },

        items: {
            "[Drifter's Cloak]": { reward: nothing },
            '[Faydown Cloak]': { reward: nothing },
            '[White Key]': {
                description:
                    'If [The Wandering Merchant] wish has already been granted, it can be bought from [Jubilana] in [Songclave] for [ROSARY] 220.',
                reward: nothing,
            },
            '[Key of Apostate]': { reward: nothing },
            '[Sacred Cylinder]': {
                reward: nothing,
                requires: {
                    checks: {
                        bosses: { '[Trobbio]': checked },
                        ancestralArts: { '[Cling Grip]': checked },
                    },
                },
            },
            '[Twisted Bud]': { reward: nothing, requires: { acts: 2 } },
            '[Steel Spines]': {
                reward: { rosariesReq: 160 },
                requires: {
                    rosaries: 160,
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                },
            },
            '[Architect Key]': { reward: nothing, requires: { tools: 25 } },
            '[MEMORY_LOCKET] [Memory Locket] for [Volatile Flintbeetles] [Wish]':
                {
                    reward: { memoryLockets },
                    requires: {
                        checks: {
                            wishes: { '[Volatile Flintbeetles]': checked },
                        },
                    },
                },
            '[MEMORY_LOCKET] [Memory Locket] in [The Marrow]': {
                reward: { memoryLockets },
            },
            "[MEMORY_LOCKET] [Memory Locket] in [Hunter's March]": {
                reward: { memoryLockets },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Deep Docks] behind [Simple Key]':
                {
                    reward: { memoryLockets, simpleKeysReq },
                    requires: {
                        simpleKeys,
                        checks: { ancestralArts: { '[Clawline]': checked } },
                    },
                },
            '[MEMORY_LOCKET] [Memory Locket] from [Mort] in [Far Fields] for [ROSARY] 150':
                {
                    description:
                        'Bought from [Mort] in [Far Fields] for [ROSARY] 150 in [Acts] 1/2 or from [Grindle] in [Blasted Steps] for [ROSARY] 250 in [Act 3], also requiring [Faydown Cloak].',
                    reward: { memoryLockets, rosariesReq: 150 },
                    requires: { rosaries: 150 },
                },
            '[MEMORY_LOCKET] [Memory Locket] in [Far Fields] near [Skarrsinger Karmelita]':
                {
                    reward: { memoryLockets },
                    requires: {
                        checks: { ancestralArts: { '[Silk Soar]': checked } },
                        acts: 3,
                    },
                },
            '[MEMORY_LOCKET] [Memory Locket] in [Greymoor] near [Bellway]': {
                reward: { memoryLockets },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Greymoor] inside [Halfway Home]':
                {
                    reward: { memoryLockets },
                    requires: {
                        checks: { items: { '[Faydown Cloak]': checked } },
                    },
                },
            '[MEMORY_LOCKET] [Memory Locket] from [Frey] in [Bellhart] for [ROSARY] 330':
                {
                    reward: { memoryLockets, rosariesReq: 330 },
                    requires: {
                        rosaries: 330,
                        checks: {
                            bosses: { '[Widow]': checked },
                        },
                    },
                },
            "[MEMORY_LOCKET] [Memory Locket] in [Bellhart]'s ceiling": {
                reward: { memoryLockets },
                requires: {
                    checks: { ancestralArts: { '[Silk Soar]': checked } },
                    acts: 3,
                },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Blasted Steps]': {
                reward: { memoryLockets },
            },
            '[MEMORY_LOCKET] [Memory Locket] in the [Sands of Karak]': {
                reward: { memoryLockets },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Wormways]': {
                reward: { memoryLockets, simpleKeysReq },
                requires: { simpleKeys },
            },
            '[MEMORY_LOCKET] [Memory Locket] in the [Underworks]': {
                reward: { memoryLockets },
                requires: { acts: 2 },
            },
            '[MEMORY_LOCKET] [Memory Locket] at [Grand Bellway]': {
                reward: { memoryLockets },
                requires: { acts: 2 },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Memorium]': {
                reward: { memoryLockets },
                requires: {
                    checks: { items: { '[Faydown Cloak]': checked } },
                },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [The Slab]': {
                reward: { memoryLockets },
                requires: {
                    checks: { items: { '[Faydown Cloak]': checked } },
                },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Whispering Vaults]': {
                reward: { memoryLockets },
                requires: { acts: 2 },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Bilewater] secret room': {
                reward: { memoryLockets },
                requires: {
                    checks: {
                        ancestralArts: { '[Cling Grip]': checked },
                        items: { '[Faydown Cloak]': checked },
                    },
                },
            },
            '[MEMORY_LOCKET] [Memory Locket] in [Bilewater] near the bench shortcut':
                {
                    reward: { memoryLockets },
                    requires: {
                        checks: {
                            ancestralArts: { '[Cling Grip]': checked },
                            items: { '[Faydown Cloak]': checked },
                        },
                    },
                },
        },

        everbloom: { '[Everbloom]': { reward: { percent } } },

        wishes: {
            '[Rite of the Pollip]': { reward: nothing },
            '[My Missing Courier]': {
                reward: nothing,
                requires: { checks: { bosses: { '[Widow]': checked } } },
            },
            '[Volatile Flintbeetles]': {
                description:
                    'The actual requirement is discovering [Shellwood] after [Greymoor].',
                reward: nothing,
                requires: {
                    checks: { ancestralArts: { '[Cling Grip]': checked } },
                },
            },
            '[Bugs of Pharloom]': {
                reward: nothing,
                requires: {
                    checks: { items: { "[Drifter's Cloak]": checked } },
                },
            },
            '[The Threadspun Town]': {
                reward: nothing,
                requires: { checks: { bosses: { '[Widow]': checked } } },
            },
            '[Crawbug Clearing]': {
                reward: nothing,
                requires: {
                    checks: { wishes: { '[The Threadspun Town]': checked } },
                },
            },
            '[The Wandering Merchant]': {
                reward: nothing,
                requires: { acts: 2 },
            },
            '[Savage Beastfly](Wishes#Grand_Hunt_Wishes)': {
                reward: nothing,
                requires: {
                    checks: {
                        bosses: {
                            '[Fourth Chorus]': checked,
                            '[Savage Beastfly]': checked,
                            '[Savage Beastfly 2](Savage Beastfly#Far_Fields)':
                                checked,
                        },
                    },
                    acts: 2,
                },
            },
            '[Fine Pins]': { reward: nothing, requires: { acts: 2 } },
            '[Balm for the Wounded]': {
                reward: nothing,
                requires: {
                    checks: { items: { '[White Key]': checked } },
                    acts: 2,
                },
            },
            '[Building Up Songclave]': {
                reward: { rosariesReq: 300 },
                requires: { rosaries: 300, acts: 2 },
            },
            '[Cloaks of the Choir]': {
                reward: nothing,
                requires: {
                    checks: { wishes: { '[Building Up Songclave]': checked } },
                    acts: 2,
                },
            },
            '[Strengthening Songclave]': {
                reward: { rosariesReq: 500 },
                requires: {
                    rosaries: 500,
                    checks: {
                        wishes: {
                            '[Fine Pins]': checked,
                            '[Cloaks of the Choir]': checked,
                            '[Balm for the Wounded]': checked,
                            '[Building Up Songclave]': checked,
                        },
                    },
                    acts: 2,
                },
            },
            '[The Lost Merchant]': {
                reward: nothing,
                requires: {
                    checks: {
                        items: { '[Faydown Cloak]': checked },
                        wishes: {
                            '[The Wandering Merchant]': checked,
                            '[Strengthening Songclave]': checked,
                        },
                    },
                    acts: 2,
                },
            },
            '[Rite of Rebirth]': {
                reward: nothing,
                requires: { checks: { items: { '[Twisted Bud]': checked } } },
            },
            '[Infestation Operation]': {
                reward: nothing,
                requires: {
                    checks: {
                        items: { '[Steel Spines]': checked },
                        wishes: { '[Rite of Rebirth]': checked },
                    },
                    acts: 2,
                },
            },
            '[Fastest in Pharloom]': {
                reward: nothing,
                requires: {
                    checks: { ancestralArts: { '[Silk Soar]': checked } },
                    acts: 3,
                },
            },
            '[Dark Hearts]': { reward: nothing, requires: { acts: 3 } },
            '[The Hidden Hunter]': { reward: nothing, requires: { acts: 3 } },
        },

        relics: {},

        fleas: {},
    },
};

export default INITIAL_SILKSONG_CHECKLIST_STATE;
