import { SilksongChecklistState } from '../types/checklist';

export const nothing = {} as const;
export const checked = { checked: true } as const;
export const grubs = { grubs: 1 } as const;
const maskShards = 1 as const;
const percent = 1 as const;
const simpleKeys = 1 as const;
const simpleKeysReq = 1 as const;
const spoolFragments = 1 as const;

const INITIAL_SILKSONG_CHECKLIST_STATE: SilksongChecklistState = {
    game: 'silksong',
    percent: 0,

    rosaries: 0,
    simpleKeys: 0,

    fleas: 0,
    maskShards: 0,
    spoolFragments: 0,
    acts: 1,

    rosariesReq: 0,
    simpleKeysReq: 0,

    checks: {
        bosses: {
            '[Moss Mother]': { reward: nothing },
            '[Bell Beast]': { reward: nothing },
            '[Fourth Chorus]': { reward: nothing },
            '[Savage Beastfly]': { reward: nothing },
            '[Widow]': { reward: nothing },
            '[Last Judge] / [Phantom]': { reward: { acts: 1 } },
            '[Savage Beastfly 2](Savage Beastfly#Far_Fields)': {
                reward: nothing,
                requires: { acts: 2 },
            },
            '[Cogwork Dancers]': { reward: nothing, requires: { acts: 2 } },
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
            "[Conductor's Melody]": { reward: nothing, requires: { acts: 2 } },
            "[Architect's Melody]": { reward: nothing, requires: { acts: 2 } },
            "[Vaultkeeper's Melody]": {
                reward: nothing,
                requires: { acts: 2 },
            },
        },

        silkHearts: {
            '[Bell Beast]': {
                reward: { percent },
                requires: { checks: { bosses: { '[Bell Beast]': checked } } },
            },
            '[Lace Tower]': {
                reward: { percent },
                requires: {
                    checks: {
                        bosses: { '[Lace 2](Lace#The_Cradle)': checked },
                    },
                },
            },
            '[The Unravelled]': {
                reward: { percent },
                requires: {
                    checks: { bosses: { '[The Unravelled]': checked } },
                },
            },
        },

        tools: {
            '[Shard Pendant]': { reward: { percent } },
            '[Compass]': { reward: { percent } },
            "[Druid's Eye] / [Druid's Eyes]": { reward: { percent } },
            '[Straight Pin]': { reward: { percent } },
            '[Warding Bell]': { reward: { percent } },
            '[Treefold Pin]': { reward: { percent } },
            '[Flea Brew]': { reward: { percent } },
            '[Sting Shard]': { reward: { percent } },
            '[Longpin]': { reward: { percent } },
            '[Pollip Pouch]': { reward: { percent } },
            '[Weavelight]': { reward: { percent } },
            "[Dead Bug's Purse] / [Shell Satchel]": { reward: { percent } },
            '[Plasmium Phial]': { reward: { percent } },
            '[Silkspeed Anklets]': { reward: { percent } },
            '[Pimpillo]': { reward: { percent } },
            '[Barbed Bracelet]': { reward: { percent } },
            '[Tacks]': { reward: { percent } },
            '[Flintslate]': { reward: { percent } },
            '[Silkshot]': { reward: { percent } },
            "[Delver's Drill]": { reward: { percent } },
            '[Injector Band]': { reward: { percent } },
            '[Cogwork Wheel]': { reward: { percent } },
            '[Scuttlebrace]': { reward: { percent } },
            '[Memory Crystal]': { reward: { percent } },
            '[Multibinder]': { reward: { percent } },
            '[Voltvessels]': { reward: { percent } },
            '[Wreath of Purity]': { reward: { percent } },
            '[Longclaw]': { reward: { percent } },
            '[Conchcutter]': { reward: { percent } },
            "[Thief's Mark]": { reward: { percent } },
            '[Throwing ring]': { reward: { percent } },
            '[Magnetite Brooch]': { reward: { percent } },
            '[Magma Bell]': { reward: { percent } },
            '[Claw Mirror]': { reward: { percent } },
            '[Spider Strings]': { reward: { percent } },
            '[Rosary Cannon]': { reward: { percent } },
            '[Wispfire Lantern]': { reward: { percent } },
            '[Magnetite Dice]': { reward: { percent } },
            '[Volt Filament]': { reward: { percent } },
            '[Weighted Belt]': { reward: { percent } },
            '[Egg of Flealia]': { reward: { percent } },
            '[Fractured Mask]': { reward: { percent } },
            '[Curveclaw] / [Curvesickle]': { reward: { percent } },
            '[Quick Sling]': { reward: { percent } },
            '[Cogfly]': { reward: { percent } },
            '[Reserve Bind]': { reward: { percent } },
            '[Pin Badge]': { reward: { percent } },
            '[Sawtooth Circlet]': { reward: { percent } },
            '[Spool Extender]': { reward: { percent } },
            "[Ascendant's Grip]": { reward: { percent } },
            '[Snitch Pick]': { reward: { percent } },
        },

        silkSkills: {
            '[Silkspear]': {
                reward: { percent },
                requires: { checks: { bosses: { '[Moss Mother]': checked } } },
            },
            '[Thread Storm]': {
                reward: { percent },
                requires: {
                    checks: { items: { "[Drifter's Cloak]": checked } },
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
                },
            },
            '[Rune Rage]': {
                reward: { percent },
                requires: { checks: { bosses: { '[First Sinner]': checked } } },
            },
            '[Pale Nails]': {
                reward: { percent },
                requires: {
                    checks: {
                        bosses: { '[Grand Mother Silk]': checked },
                        ancestralArts: { '[Silk Soar]': checked },
                    },
                },
            },
        },

        ancestralArts: {
            '[Swift Step]': { reward: { percent } },
            '[Cling Grip]': { reward: { percent } },
            '[Needolin]': { reward: { percent } },
            '[Clawline]': { reward: { percent } },
            '[Needle Strike]': { reward: { percent } },
            '[Silk Soar]': { reward: { percent } },
            '[Sylphsong]': { reward: { percent } },
        },

        crests: {
            '[Reaper Crest]': { reward: { percent } },
            '[Beast Crest]': { reward: { percent } },
            '[Wanderer Crest]': { reward: { percent } },
            '[Architect Crest]': { reward: { percent } },
            '[Witch Crest]': { reward: { percent } },
            '[Shaman Crest]': { reward: { percent } },
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
            '[Sharpened Needle](Needle#Upgrades)': { reward: { percent } },
            '[Shining Needle](Needle#Upgrades)': { reward: { percent } },
            '[Hivesteel Needle](Needle#Upgrades)': { reward: { percent } },
            '[Palesteel Needle](Needle#Upgrades)': { reward: { percent } },
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
            '[Spool Fragment Grindle]': {
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
            'Tool Pouch Pin Challenge': { reward: { percent } },
            'Tool Kit Crow Feathers': { reward: { percent } },
            'Tool Kit Forge Daughter': { reward: { percent } },
            'Tool Pouch Nuu': { reward: { percent } },
            "Tool Pouch Pilgrim's Rest": { reward: { percent } },
            'Tool Pouch Mooshka': { reward: { percent } },
            'Tool Kit Grindle': { reward: { percent } },
            'Tool Kit Architect': { reward: { percent } },
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
        },

        everbloom: { '[Everbloom]': { reward: { percent } } },

        wishes: {
            '[My Missing Courier]': {
                reward: nothing,
                requires: { checks: { bosses: { '[Widow]': checked } } },
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
