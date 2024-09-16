import { merge as deepMerge } from 'object-deep-merge';
import { PartialDeep } from 'type-fest';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { GRUB_REWARDS } from '../constants';
import {
    Action,
    AnyObject,
    Check,
    ChecklistState,
    CheckRewards,
    Checks,
    CheckSection,
    ChecksSection,
    RequirementCheckErrors,
} from '../types/checklist';
import partialDeepEqual, { Comparable } from '../util/partialDeepEqual';

const INITIAL_CHECKLIST_STATE: ChecklistState = {
    percent: 0,

    geo: 0,
    essence: 0,
    paleOre: 0,
    simpleKeys: 0,

    charms: 0,
    grubs: 0,
    maskShards: 0,
    vesselFragments: 0,

    geoReq: 0,
    essenceReq: [0],
    paleOreReq: 0,
    simpleKeysReq: 0,

    checks: {
        bosses: {
            '[Broken Vessel]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            '[Brooding Mawlek]': { reward: { percent: 1 } },
            '[The Collector]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                        items: { '[LOVE_KEY] [Love Key]': { checked: true } },
                    },
                },
            },
            '[Dung Defender]': {
                reward: { percent: 1, simpleKeysReq: 1 },
                requires: {
                    simpleKeys: 1,
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[False Knight]': { reward: { percent: 1, geo: 200 } },
            '[Grimm]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        charms: {
                            '[Grimmchild] / [Carefree Melody]': {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Gruz Mother]': { reward: { percent: 1, geo: 50 } },
            '[Hive Knight]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        items: { '[TRAM_PASS] [Tram Pass]': { checked: true } },
                    },
                },
            },
            '[Hornet Protector]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        spells: { '[Vengeful Spirit]': { checked: true } },
                    },
                },
            },
            '[Hornet Sentinel]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
            '[Mantis Lords]': {
                reward: { percent: 1, geo: 620 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Nosk]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            '[Soul Master]': {
                reward: { percent: 1, geo: 380 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Traitor Lord]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Shade Cloak]': { checked: true } },
                    },
                },
            },
            '[Uumuu]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { "[Isma's Tear]": { checked: true } },
                    },
                },
            },
            '[Watcher Knight]': {
                reward: { percent: 1, geo: 655 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
        },

        equipment: {
            '[Crystal Heart]': {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                        },
                    },
                },
            },
            "[Isma's Tear]": {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        bosses: { '[Dung Defender]': { checked: true } },
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            '[Mantis Claw]': {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Monarch Wings]': {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        bosses: { '[Broken Vessel]': { checked: true } },
                        equipment: {
                            '[Crystal Heart]': { checked: true },
                            '[Mantis Claw]': { checked: true },
                        },
                    },
                },
            },
            '[Mothwing Cloak]': {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        bosses: { '[Hornet Protector]': { checked: true } },
                    },
                },
            },
            '[Shade Cloak]': {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        equipment: { "[King's Brand]": { checked: true } },
                    },
                },
            },
            "[King's Brand]": {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        bosses: { '[Hornet Sentinel]': { checked: true } },
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
        },

        nail: {
            '[Sharpened Nail](Nail#Upgrades)': {
                reward: { percent: 1, geoReq: 250 },
                requires: { geo: 250 },
            },
            '[Channelled Nail](Nail#Upgrades)': {
                reward: { percent: 1, geoReq: 800, paleOreReq: 1 },
                requires: {
                    geo: 800,
                    paleOre: 1,
                    checks: {
                        nail: {
                            '[Sharpened Nail](Nail#Upgrades)': {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Coiled Nail](Nail#Upgrades)': {
                reward: { percent: 1, geoReq: 2000, paleOreReq: 2 },
                requires: {
                    geo: 2000,
                    paleOre: 2,
                    checks: {
                        nail: {
                            '[Channelled Nail](Nail#Upgrades)': {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Pure Nail](Nail#Upgrades)': {
                reward: { percent: 1, geoReq: 4000, paleOreReq: 3 },
                requires: {
                    geo: 4000,
                    paleOre: 3,
                    checks: {
                        nail: {
                            '[Coiled Nail](Nail#Upgrades)': { checked: true },
                        },
                    },
                },
            },
        },

        dreamNail: {
            '[Dream Nail]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        items: { '[Lumafly Lantern]': { checked: true } },
                    },
                },
            },
            '[Awoken Dream Nail]': {
                reward: { percent: 1, essenceReq: [1800] },
                requires: {
                    essence: 1800,
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        maskShards: { '[Seer]': { checked: true } },
                    },
                },
            },
            '[Ascension](Seer)': {
                reward: { percent: 1, essenceReq: [2400] },
                requires: {
                    essence: 2400,
                    checks: {
                        dreamNail: { '[Awoken Dream Nail]': { checked: true } },
                    },
                },
            },
        },

        nailArts: {
            '[Cyclone Slash]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Dash Slash]': {
                reward: { percent: 1, geoReq: 800 },
                requires: { geo: 800 },
            },
            '[Great Slash]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
        },

        spells: {
            '[Desolate Dive]': {
                reward: { percent: 1 },
                requires: {
                    checks: { bosses: { '[Soul Master]': { checked: true } } },
                },
            },
            '[Descending Dark]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        items: { '[Lumafly Lantern]': { checked: true } },
                    },
                },
            },
            '[Howling Wraiths]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Abyss Shriek]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        equipment: { "[King's Brand]": { checked: true } },
                    },
                },
            },
            '[Vengeful Spirit]': {
                reward: { percent: 1 },
                requires: {
                    checks: { bosses: { '[False Knight]': { checked: true } } },
                },
            },
            '[Shade Soul]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        items: {
                            '[ELEGANT_KEY] [Elegant Key]': { checked: true },
                        },
                    },
                },
            },
        },

        charms: {
            '[Wayward Compass]': {
                description:
                    'Bought from [Iselda] in [Dirtmouth] for [GEO] 220 after the first encounter with [Cornifer].',
                reward: { percent: 1, charms: 1, geoReq: 220 },
                requires: { geo: 220 },
            },
            '[Gathering Swarm]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 300.',
                reward: { percent: 1, charms: 1, geoReq: 300 },
                requires: { geo: 300 },
            },
            '[Stalwart Shell]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 200.',
                reward: { percent: 1, charms: 1, geoReq: 200 },
                requires: { geo: 200 },
            },
            '[Soul Catcher]': {
                description:
                    'Found at the very end of the [Ancestral Mound], after killing the [Elder Baldur].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        spells: { '[Vengeful Spirit]': { checked: true } },
                    },
                },
            },
            '[Shaman Stone]': {
                description:
                    'Bought from [Salubra] for [GEO] 220 in the [Forgotten Crossroads].',
                reward: { percent: 1, charms: 1, geoReq: 220 },
                requires: {
                    geo: 220,
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Soul Eater]': {
                description:
                    'Found to the east side of the [Crypts](Resting Grounds#Crypts).',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[Dashmaster]': {
                description:
                    'Found beneath a statue below the [Mantis Village] in the [Fungal Wastes], near the entrance to the [Royal Waterways].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Sprintmaster]': {
                description:
                    "Bought from [Sly] in [Dirtmouth] after acquiring the [SHOPKEEPER'S_KEY] [Shopkeeper's Key] for [GEO] 400.",
                reward: { percent: 1, charms: 1, geoReq: 400 },
                requires: {
                    geo: 400,
                    checks: {
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Grubsong]': {
                description:
                    'Gifted by [Grubfather] after 10 [Grubs] have been freed.',
                reward: { percent: 1, charms: 1 },
                requires: { grubs: 10 },
            },
            "[Grubberfly's Elegy]": {
                description:
                    'Gifted by [Grubfather] after freeing all 46 [Grubs].',
                reward: { percent: 1, charms: 1 },
                requires: { grubs: 46 },
            },
            '[Fragile Heart] / [Unbreakable Heart]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 350.',
                reward: { percent: 1, charms: 1, geoReq: 350 },
                requires: { geo: 350 },
            },
            '[Fragile Greed] / [Unbreakable Greed]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 250.',
                reward: { percent: 1, charms: 1, geoReq: 250 },
                requires: { geo: 250 },
            },
            '[Fragile Strength] / [Unbreakable Strength]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 600.',
                reward: { percent: 1, charms: 1, geoReq: 600 },
                requires: { geo: 600 },
            },
            '[Spell Twister]': {
                description:
                    'A secret room on the top of the [Soul Sanctum], just before fighting [Soul Master].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Steady Body]': {
                description:
                    'Bought from [Salubra] for [GEO] 120 in the [Forgotten Crossroads].',
                reward: { percent: 1, charms: 1, geoReq: 120 },
                requires: {
                    geo: 120,
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Heavy Blow]': {
                description:
                    "Bought from [Sly] in [Dirtmouth] after acquiring the [SHOPKEEPER'S_KEY] [Shopkeeper's Key] for [GEO] 350.",
                reward: { percent: 1, charms: 1, geoReq: 350 },
                requires: {
                    geo: 350,
                    checks: {
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Quick Slash]': {
                description:
                    'Located in [Kingdom\'s Edge], on a massive anvil in a hidden room in front of a massive corpse known as an "[Ancient Nailsmith]".',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[Longnail]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 300.',
                reward: { percent: 1, charms: 1, geoReq: 300 },
                requires: {
                    geo: 300,
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Mark of Pride]': {
                description:
                    'In the [Mantis Village], in a chest in a room northeast of the [Mantis Lords] arena.',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: { bosses: { '[Mantis Lords]': { checked: true } } },
                },
            },
            '[Fury of the Fallen]': {
                description:
                    "Found in [King's Pass], the starting cavern, behind a spike-filled cavern.",
                reward: { percent: 1, charms: 1 },
            },
            '[Thorns of Agony]': {
                description:
                    'Found in [Greenpath] in a maze of thorns featuring [Charged Lumaflies].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Baldur Shell]': {
                description:
                    'Found in the southwest portion of the [Howling Cliffs], where there is a chest that drops only [GEO] 1.',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Flukenest]': {
                description:
                    'Dropped by [Flukemarm] in the [Royal Waterways] when defeated.',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            "[Defender's Crest]": {
                description:
                    'Reward from defeating [Dung Defender] in the [Royal Waterways].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        bosses: { '[Dung Defender]': { checked: true } },
                    },
                },
            },
            '[Glowing Womb]': {
                description:
                    'Found in the [Aspid Nest](Forgotten Crossroads#Aspid Nest) after completing [Aspid] arena.',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            '[Quick Focus]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 800.',
                reward: { percent: 1, charms: 1, geoReq: 800 },
                requires: {
                    geo: 800,
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Deep Focus]': {
                description:
                    'Found in [Crystal Peak] in a hidden cave made entirely of crystals.',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            '[Lifeblood Heart]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 250.',
                reward: { percent: 1, charms: 1, geoReq: 250 },
                requires: {
                    geo: 250,
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Lifeblood Core]': {
                description:
                    'Behind the door in the [Abyss] that opens when you have 15 or more [Lifeblood Masks](Knight#Health).',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { "[King's Brand]": { checked: true } },
                        charms: {
                            "[Joni's Blessing]": { checked: true },
                            '[Fragile Heart] / [Unbreakable Heart]': {
                                checked: true,
                            },
                        },
                    },
                    maskShards: 8,
                },
            },
            "[Joni's Blessing]": {
                description:
                    "Found in [Joni's Repose] in the [Howling Cliffs].",
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                        items: { '[Lumafly Lantern]': { checked: true } },
                    },
                },
            },
            '[Hiveblood]': {
                description:
                    'Located in [the Hive], below the room where the [Hive Knight] is fought.',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        bosses: { '[Hive Knight]': { checked: true } },
                        items: { '[TRAM_PASS] [Tram Pass]': { checked: true } },
                    },
                },
            },
            '[Spore Shroom]': {
                description:
                    "Found in the [Fungal Wastes] near a pool of acid, close to the entrances to the Queen's Gardens and Deepnest.",
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Sharp Shadow]': {
                description:
                    'Located in [Deepnest], southeast of the Hot Spring behind a [Shade Gate].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Shade Cloak]': { checked: true } },
                    },
                },
            },
            '[Shape of Unn]': {
                description: 'Acquired from [Unn] beneath the [Lake of Unn].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { "[Isma's Tear]": { checked: true } },
                    },
                },
            },
            "[Nailmaster's Glory]": {
                description:
                    'Given by [Sly] after receiving all 3 [Nail Arts] from the [Nailmasters].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        nailArts: {
                            '[Cyclone Slash]': { checked: true },
                            '[Dash Slash]': { checked: true },
                            '[Great Slash]': { checked: true },
                        },
                    },
                },
            },
            '[Weaversong]': {
                description: "Found in the upper part of [Weavers' Den].",
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Dream Wielder]': {
                description:
                    'Given by the [Seer] after gathering [ESSENCE] 500.',
                reward: { percent: 1, charms: 1, essenceReq: [500] },
                requires: {
                    essence: 500,
                    checks: {
                        items: {
                            '[PALE_ORE] [Pale Ore] awarded by the [Seer]': {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Dreamshield]': {
                description:
                    "Found in a room in the [Resting Grounds], below [Seer]'s room.",
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Grimmchild] / [Carefree Melody]': {
                description:
                    '[Grimmchild] is given by [Troupe Master Grimm] in Dirtmouth after [the Grimm Troupe] has been summoned. ' +
                    'After banishing the Grimm Troupe, the [Carefree Melody] charm can be acquired from [Nymm] by listening to him in [Dirtmouth].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Kingsoul] / [Void Heart]': {
                description:
                    'Obtained after getting both [White Fragments]. ' +
                    'After obtaining the [Kingsoul], [Void Heart] can be found in [the Birthplace] at the bottom of [the Abyss].',
                reward: { percent: 1, charms: 1 },
                requires: {
                    checks: {
                        bosses: { '[Traitor Lord]': { checked: true } },
                        equipment: { '[Monarch Wings]': { checked: true } },
                        dreamNail: { '[Awoken Dream Nail]': { checked: true } },
                    },
                },
            },
        },

        maskShards: {
            '[Sly] #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 150.',
                reward: { maskShards: 1, geoReq: 150 },
                requires: { geo: 150 },
            },
            '[Sly] #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 500.',
                reward: { maskShards: 1, geoReq: 500 },
                requires: {
                    geo: 500,
                    checks: { maskShards: { '[Sly] #1': { checked: true } } },
                },
            },
            '[Sly] #3': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 800.',
                reward: { maskShards: 1, geoReq: 800 },
                requires: {
                    geo: 800,
                    checks: {
                        maskShards: { '[Sly] #2': { checked: true } },
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Sly] #4': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 1500.',
                reward: { maskShards: 1, geoReq: 1500 },
                requires: {
                    geo: 1500,
                    checks: {
                        maskShards: { '[Sly] #3': { checked: true } },
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Forgotten Crossroads] [Brooding Mawlek]': {
                description: 'Reward for defeating [Brooding Mawlek].',
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        bosses: { '[Brooding Mawlek]': { checked: true } },
                    },
                },
            },
            '[Grubfather]': {
                description: 'Requires rescuing 5 [Grubs].',
                reward: { maskShards: 1 },
                requires: { grubs: 5 },
            },
            '[Forgotten Crossroads] [Goams]': {
                description:
                    'Behind a gauntlet of [Goams] in [Forgotten Crossroads].',
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
            "[Queen's Station]": {
                description: "Near east side of the [Queen's Station].",
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            "[Bretta]'s house": {
                description: 'Requires rescuing [Bretta] from [Fungal Wastes].',
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mothwing Cloak]': { checked: true },
                            '[Mantis Claw]': { checked: true },
                        },
                    },
                },
            },
            '[Stone Sanctuary]': {
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        items: { '[Lumafly Lantern]': { checked: true } },
                    },
                },
            },
            '[Royal Waterways]': {
                description:
                    'Northwest section of the Royal Waterways, swim west under main path.',
                reward: { maskShards: 1, simpleKeysReq: 1 },
                requires: { simpleKeys: 1 },
            },
            '[Deepnest] from [Fungal Core]': {
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
            '[Enraged Guardian]': {
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
            '[The Hive]': {
                description:
                    'Requires baiting a [Hive Guardian] into breaking a wall.',
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        items: { '[TRAM_PASS] [Tram Pass]': { checked: true } },
                    },
                },
            },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 1500.',
                reward: { maskShards: 1, essenceReq: [1500] },
                requires: {
                    essence: 1500,
                    checks: {
                        relics: {
                            '[ARCANE_EGG] [Arcane Egg] awarded by the [Seer]': {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Grey Mourner]': {
                description: 'Requires completing the [Delicate Flower quest].',
                reward: { maskShards: 1 },
                requires: {
                    checks: {
                        items: { '[Delicate Flower]': { checked: true } },
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
        },

        vesselFragments: {
            '[Sly] #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 550.',
                reward: { vesselFragments: 1, geoReq: 550 },
                requires: { geo: 550 },
            },
            '[Sly] #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 900.',
                reward: { vesselFragments: 1, geoReq: 900 },
                requires: {
                    geo: 900,
                    checks: {
                        vesselFragments: { '[Sly] #1': { checked: true } },
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[Greenpath]': {
                description:
                    "Near the inaccessible [Queen's Gardens] entrance.",
                reward: { vesselFragments: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            'Left of the lift in [Forgotten Crossroads]': {
                description:
                    'Accessible after unlocking the lift in the [City of Tears].',
                reward: { vesselFragments: 1 },
            },
            "Above [King's Station] near a lift": {
                description: 'Accessible after completing the arena.',
                reward: { vesselFragments: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Deepnest]': {
                description:
                    'At the end of the [Garpede] parkour section above the working [Tram].',
                reward: { vesselFragments: 1 },
            },
            '[Stag Nest]': { reward: { vesselFragments: 1 } },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 700.',
                reward: { vesselFragments: 1, essenceReq: [700] },
                requires: {
                    essence: 700,
                    checks: {
                        charms: { '[Dream Wielder]': { checked: true } },
                    },
                },
            },
            '[Ancient Basin] fountain': {
                description: 'For dropping [GEO] 3000 into the fountain.',
                reward: { vesselFragments: 1, geoReq: 3000 },
                requires: { geo: 3000 },
            },
        },

        dreamers: {
            '[Herra the Beast]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        equipment: { '[Mantis Claw]': { checked: true } },
                        items: { '[Lumafly Lantern]': { checked: true } },
                    },
                },
            },
            '[Lurien the Watcher]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        bosses: { '[Watcher Knight]': { checked: true } },
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Monomon the Teacher]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        bosses: { '[Uumuu]': { checked: true } },
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
        },

        dreamWarriors: {
            '[Elder Hu]': {
                reward: { percent: 1, essence: 100 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Galien]': {
                reward: { percent: 1, essence: 200 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Gorb]': {
                reward: { percent: 1, essence: 100 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Markoth]': {
                reward: { percent: 1, essence: 250 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Marmu]': {
                reward: { percent: 1, essence: 150 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[No Eyes]': {
                reward: { percent: 1, essence: 200 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Xero]': {
                reward: { percent: 1, essence: 100 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Nightmare King Grimm] / [Banishment](Grimm Troupe (Quest))': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        charms: {
                            '[Grimmchild] / [Carefree Melody]': {
                                checked: true,
                            },
                        },
                    },
                },
            },
        },

        dreamBosses: {
            '[Failed Champion]': {
                reward: { essence: 300 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Grey Prince Zote]': {
                reward: { essence: 300 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Lost Kin]': {
                reward: { essence: 400 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[White Defender]': {
                reward: { essence: 300 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Soul Tyrant]': {
                reward: { essence: 300 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
        },

        colosseum: {
            '[Trial of the Warrior]': {
                reward: { percent: 1, geoReq: 100, geo: 1000 },
                requires: { geo: 100 },
            },
            '[Trial of the Conqueror]': {
                reward: { percent: 1, geoReq: 450, geo: 2000 },
                requires: {
                    geo: 450,
                    checks: {
                        colosseum: {
                            '[Trial of the Warrior]': { checked: true },
                        },
                    },
                },
            },
            '[Trial of the Fool]': {
                reward: { percent: 1, geoReq: 800, geo: 3000 },
                requires: {
                    geo: 800,
                    checks: {
                        colosseum: {
                            '[Trial of the Conqueror]': { checked: true },
                        },
                    },
                },
            },
        },

        godhome: {
            '[Godtuner]': {
                reward: { percent: 1, simpleKeysReq: 1 },
                requires: { simpleKeys: 1 },
            },
            '[Pantheon of the Master]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        bosses: {
                            '[Gruz Mother]': { checked: true },
                            '[False Knight]': { checked: true },
                            '[Hornet Protector]': { checked: true },
                            '[Dung Defender]': { checked: true },
                            '[Brooding Mawlek]': { checked: true },
                        },
                        dreamWarriors: { '[Gorb]': { checked: true } },
                    },
                },
            },
            '[Pantheon of the Artist]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        bosses: {
                            '[Soul Master]': { checked: true },
                            '[Mantis Lords]': { checked: true },
                            '[Nosk]': { checked: true },
                            '[Broken Vessel]': { checked: true },
                        },
                        colosseum: {
                            '[Trial of the Conqueror]': { checked: true },
                        },
                        dreamWarriors: {
                            '[Xero]': { checked: true },
                            '[Marmu]': { checked: true },
                        },
                    },
                },
            },
            '[Pantheon of the Sage]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        bosses: {
                            '[Hive Knight]': { checked: true },
                            '[The Collector]': { checked: true },
                            '[Grimm]': { checked: true },
                            '[Uumuu]': { checked: true },
                            '[Hornet Sentinel]': { checked: true },
                        },
                        dreamWarriors: {
                            '[Elder Hu]': { checked: true },
                            '[Galien]': { checked: true },
                        },
                        dreamBosses: {
                            '[Grey Prince Zote]': { checked: true },
                        },
                    },
                },
            },
            '[Pantheon of the Knight]': {
                reward: { percent: 1 },
                requires: {
                    checks: {
                        godhome: {
                            '[Pantheon of the Master]': { checked: true },
                            '[Pantheon of the Artist]': { checked: true },
                            '[Pantheon of the Sage]': { checked: true },
                        },
                        bosses: {
                            '[Traitor Lord]': { checked: true },
                            '[Watcher Knight]': { checked: true },
                        },
                        dreamWarriors: {
                            '[No Eyes]': { checked: true },
                            '[Markoth]': { checked: true },
                        },
                    },
                },
            },
        },

        grubs: {
            '[Forgotten Crossroads] behind [Husk Guard]': {
                reward: { grubs: 1 },
            },
            '[Forgotten Crossroads] [Fog Canyon] entrance': {
                reward: { grubs: 1 },
            },
            '[Forgotten Crossroads] breakable wall': { reward: { grubs: 1 } },
            '[Forgotten Crossroads] [Pogo](Nail#Nail-bouncing)': {
                reward: { grubs: 1 },
            },
            '[Forgotten Crossroads] on a ledge': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Greenpath] with a moss block shortcut': { reward: { grubs: 1 } },
            '[Greenpath] near acid': { reward: { grubs: 1 } },
            '[Greenpath] behind [Moss Knight]': { reward: { grubs: 1 } },
            '[Greenpath] in the middle of a [Durandoo] room': {
                reward: { grubs: 1 },
            },
            '[Fungal Wastes] behind a line of [Fungling]s': {
                reward: { grubs: 1 },
            },
            '[Fungal Wastes] near [Spore Shroom]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[City of Tears] on a ledge': { reward: { grubs: 1 } },
            '[City of Tears] behind [Great Husk Sentry': {
                reward: { grubs: 1 },
            },
            '[City of Tears] in the [Desolate Dive] dive': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[City of Tears] under the entrance to the [Tower of Love]': {
                reward: { grubs: 1 },
            },
            '[City of Tears] room leading to [Watcher Knight]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Crystal Peak] from [Dirtmouth]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Crystal Heart]': { checked: true },
                        },
                    },
                },
            },
            '[Crystal Peak] behind presses': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                        },
                    },
                },
            },
            '[Crystal Peak] near [Crystal Heart]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Crystal Heart]': { checked: true },
                        },
                    },
                },
            },
            "[Crystal Peak] on the way to [Hallownest's Crown]": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Crystal Peak] vertical conveyor belts lever': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                        },
                    },
                },
            },
            '[Crystal Peak] from the top room with presses': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[Crystal Peak] in the [Crystallized Mound]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                        },
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[Resting Grounds] [Crypts](Resting Grounds#Crypts)': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[Royal Waterways] behind a wall near water': {
                reward: { grubs: 1 },
            },
            "[Royal Waterways] from the [Kingdom's Edge]": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Crystal Heart]': { checked: true },
                            '[Monarch Wings]': { checked: true },
                        },
                        items: { '[TRAM_PASS] [Tram Pass]': { checked: true } },
                    },
                },
            },
            "[Royal Waterways] above [Isma's Tear]": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { "[Isma's Tear]": { checked: true } },
                    },
                },
            },
            '[Howling Cliffs]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            "[Kingdom's Edge] under [Oro]'s hut": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            "[Kingdom's Edge] behind a [Primal Aspid]": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Fog Canyon]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            "[Queen's Gardens] under the [Stag] station": {
                reward: { grubs: 1 },
            },
            "[Queen's Gardens] above the spiky roof": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                            '[Crystal Heart]': { checked: true },
                        },
                    },
                },
            },
            "[Queen's Gardens] near [White Lady]": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Deepnest] among [Grub Mimic]s': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Deepnest] above the spike pit': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Deepnest] on the way to [Nosk]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            "[Deepnest] near the [Weavers' Den]": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                        },
                    },
                },
            },
            "[Deepnest] in the [Beast's Den]": {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                        },
                    },
                },
            },
            '[Ancient Basin] above [Broken Vessel]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mothwing Cloak]': { checked: true },
                            '[Monarch Wings]': { checked: true },
                        },
                    },
                },
            },
            '[Ancient Basin] under [Cloth]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[The Hive] isolated room': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: { "[Isma's Tear]": { checked: true } },
                        spells: { '[Desolate Dive]': { checked: true } },
                        items: { '[TRAM_PASS] [Tram Pass]': { checked: true } },
                    },
                },
            },
            '[The Hive]': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        equipment: {
                            '[Crystal Heart]': { checked: true },
                            '[Monarch Wings]': { checked: true },
                        },
                        items: { '[TRAM_PASS] [Tram Pass]': { checked: true } },
                    },
                },
            },
            '[Tower of Love] #1': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        bosses: { '[The Collector]': { checked: true } },
                    },
                },
            },
            '[Tower of Love] #2': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        bosses: { '[The Collector]': { checked: true } },
                    },
                },
            },
            '[Tower of Love] #3': {
                reward: { grubs: 1 },
                requires: {
                    checks: {
                        bosses: { '[The Collector]': { checked: true } },
                    },
                },
            },
        },

        items: {
            '[SIMPLE_KEY] [Simple Key] from [Sly]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 950.',
                reward: { simpleKeys: 1, geoReq: 950 },
                requires: { geo: 950 },
            },
            '[SIMPLE_KEY] [Simple Key] near [City Storerooms]': {
                reward: { simpleKeys: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            '[SIMPLE_KEY] [Simple Key] in the [Ancient Basin]': {
                description:
                    'In the [Mawlurk] area leading to [Broken Vessel].',
                reward: { simpleKeys: 1 },
                requires: {
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                },
            },
            '[SIMPLE_KEY] [Simple Key] behind [Pale Lurker]': {
                reward: { simpleKeys: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[ELEGANT_KEY] [Elegant Key]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 800.',
                reward: { geoReq: 800 },
                requires: {
                    geo: 800,
                    checks: {
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                                checked: true,
                            },
                        },
                    },
                },
            },
            '[LOVE_KEY] [Love Key]': {
                reward: {},
                requires: {
                    checks: {
                        equipment: { "[Isma's Tear]": { checked: true } },
                    },
                },
            },
            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                reward: {},
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[TRAM_PASS] [Tram Pass]': {
                reward: {},
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[Lumafly Lantern]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 1800.',
                reward: { geoReq: 1800 },
                requires: { geo: 1800 },
            },
            '[Delicate Flower]': {
                reward: {},
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[PALE_ORE] [Pale Ore] in [Ancient Basin] below [Cloth]': {
                reward: { paleOre: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[PALE_ORE] [Pale Ore] awarded by the [Seer]': {
                reward: { paleOre: 1, essenceReq: [300] },
                requires: {
                    essence: 300,
                    checks: {
                        relics: {
                            '[HALLOWNEST_SEAL] [Hallownest Seal] awarded by the [Seer]':
                                { checked: true },
                        },
                    },
                },
            },
            "[PALE_ORE] [Pale Ore] on the [Hallownest's Crown]": {
                reward: { paleOre: 1 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[PALE_ORE] [Pale Ore] behind [Nosk]s lair': {
                reward: { paleOre: 1 },
                requires: {
                    checks: { bosses: { '[Nosk]': { checked: true } } },
                },
            },
            '[PALE_ORE] [Pale Ore] awarded by [Grubfather]': {
                reward: { paleOre: 1 },
                requires: { grubs: 31 },
            },
            '[PALE_ORE] [Pale Ore] reward in [Trial of the Conqueror]': {
                reward: { paleOre: 1 },
                requires: {
                    checks: {
                        colosseum: {
                            '[Trial of the Conqueror]': { checked: true },
                        },
                    },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #1': {
                reward: {},
                requires: { charms: 5 },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #2': {
                reward: {},
                requires: { charms: 10 },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #3': {
                reward: {},
                requires: { charms: 18 },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #4': {
                reward: {},
                requires: { charms: 25 },
            },
            '[CHARM_NOTCH] [Charm Notch] in [Fog Canyon]': {
                reward: {},
                requires: {
                    checks: {
                        equipment: { "[Isma's Tear]": { checked: true } },
                    },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] in [Fungal Wastes]': {
                reward: {},
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Colosseum of Fools]': {
                reward: {},
                requires: {
                    checks: {
                        colosseum: {
                            '[Trial of the Warrior]': { checked: true },
                        },
                    },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Grimm]': {
                reward: {},
                requires: {
                    checks: { bosses: { '[Grimm]': { checked: true } } },
                },
            },
        },

        relics: {
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Greenpath] near a [Stag Station]":
                { reward: { geo: 200 } },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Greenpath] near [Fog Canyon] entrance":
                { reward: { geo: 200 } },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Fungal Wastes] near [Shrumal Ogre]s":
                { reward: { geo: 200 } },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] north of the [Mantis Village]":
                {
                    reward: { geo: 200 },
                    requires: {
                        checks: {
                            equipment: { '[Mantis Claw]': { checked: true } },
                        },
                    },
                },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [City Storerooms]": {
                reward: { geo: 200 },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] north of [King's Station]":
                { reward: { geo: 200 } },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Pleasure House]": {
                reward: { geo: 200, simpleKeysReq: 1 },
                requires: { simpleKeys: 1 },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Howling Cliffs]": {
                reward: { geo: 200 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Crystal Peak]": {
                reward: { geo: 200 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Crypts](Resting Grounds#Crypts)":
                { reward: { geo: 200 } },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Royal Waterways]": {
                description:
                    'Near the spikes in a room which connects to the [Ancient Basin].',
                reward: { geo: 200 },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] near [City of Tears] entrance":
                {
                    reward: { geo: 200 },
                    requires: {
                        checks: {
                            equipment: { '[Mantis Claw]': { checked: true } },
                        },
                    },
                },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] next to the [Cast-Off Shell] [Bench]":
                {
                    reward: { geo: 200 },
                    requires: {
                        checks: {
                            equipment: { '[Mantis Claw]': { checked: true } },
                        },
                    },
                },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] near [Markoth]": {
                reward: { geo: 200 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] awarded by [Grubfather]': {
                reward: { geo: 450 },
                requires: { grubs: 23 },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in the well to [Forgotten Crossroads]':
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: {
                            equipment: { '[Mantis Claw]': { checked: true } },
                        },
                    },
                },
            '[HALLOWNEST_SEAL] [Hallownest Seal] near [Thorns of Agony]': {
                reward: { geo: 450 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            "[HALLOWNEST_SEAL] [Hallownest Seal] near [Queen's Station]": {
                reward: { geo: 450 },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Mantis Village]': {
                reward: { geo: 450 },
                requires: {
                    checks: { bosses: { '[Mantis Lords]': { checked: true } } },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] at the [Willoh]': {
                reward: { geo: 450 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] near [Overgrown Mound]': {
                reward: { geo: 450 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Forgotten Crossroads] in [Fog Canyon] entrance':
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: {
                            equipment: { "[Isma's Tear]": { checked: true } },
                        },
                    },
                },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Crypts](Resting Grounds#Crypts)':
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: {
                            spells: { '[Desolate Dive]': { checked: true } },
                        },
                    },
                },
            '[HALLOWNEST_SEAL] [Hallownest Seal] awarded by the [Seer]': {
                reward: { geo: 450, essenceReq: [100] },
                requires: { essence: 100 },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] near [Relic Seeker Lemm]': {
                reward: { geo: 450 },
            },
            "[HALLOWNEST_SEAL] [Hallownest Seal] above [King's Station] [Stag Station]":
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: {
                            equipment: { '[Mantis Claw]': { checked: true } },
                        },
                    },
                },
            '[HALLOWNEST_SEAL] [Hallownest Seal] near [Soul Master]': {
                reward: { geo: 450 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] behind [Watcher Knight]': {
                reward: { geo: 450 },
                requires: {
                    checks: {
                        bosses: { '[Watcher Knight]': { checked: true } },
                    },
                },
            },
            "[HALLOWNEST_SEAL] [Hallownest Seal] in [Beast's Den]": {
                reward: { geo: 450 },
                requires: {
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Deepnest] near [Mantis Lords]':
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: {
                            equipment: { '[Mantis Claw]': { checked: true } },
                        },
                    },
                },
            "[HALLOWNEST_SEAL] [Hallownest Seal] in [Queen's Gardens]": {
                reward: { geo: 450 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
            "[KING'S_IDOL] [King's Idol] awarded by [Grubfather]": {
                reward: { geo: 800 },
                requires: { grubs: 38 },
            },
            "[KING'S_IDOL] [King's Idol] in [Crystal Peak]": {
                reward: { geo: 800 },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                },
            },
            "[KING'S_IDOL] [King's Idol] in [Spirits' Glade]": {
                reward: { geo: 800, essenceReq: [200] },
                requires: {
                    essence: 200,
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                },
            },
            "[KING'S_IDOL] [King's Idol] in [Dung Defender]'s secret room": {
                reward: { geo: 800 },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                },
            },
            "[KING'S_IDOL] [King's Idol] in [Howling Cliffs]": {
                reward: { geo: 800 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            "[KING'S_IDOL] [King's Idol] under [Colosseum of Fools]": {
                reward: { geo: 800 },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                },
            },
            "[KING'S_IDOL] [King's Idol] near [Pale Lurker]": {
                reward: { geo: 800 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            "[Isma's Tear]": { checked: true },
                        },
                    },
                },
            },
            "[KING'S_IDOL] [King's Idol] in [Deepnest] near [Zote]": {
                reward: { geo: 800 },
            },
            '[ARCANE_EGG] [Arcane Egg] below [Lifeblood Core]': {
                reward: { geo: 1200 },
                requires: {
                    checks: {
                        equipment: {
                            "[King's Brand]": { checked: true },
                            '[Crystal Heart]': { checked: true },
                        },
                        charms: { "[Joni's Blessing]": { checked: true } },
                    },
                },
            },
            '[ARCANE_EGG] [Arcane Egg] near [Shade Cloak]': {
                reward: { geo: 1200 },
                requires: {
                    checks: {
                        equipment: { '[Shade Cloak]': { checked: true } },
                    },
                },
            },
            '[ARCANE_EGG] [Arcane Egg] in [Birthplace]': {
                reward: { geo: 1200 },
                requires: {
                    checks: {
                        charms: {
                            '[Kingsoul] / [Void Heart]': { checked: true },
                        },
                    },
                },
            },
            '[ARCANE_EGG] [Arcane Egg] awarded by the [Seer]': {
                reward: { geo: 1200, essenceReq: [1200] },
                requires: {
                    essence: 1200,
                    checks: {
                        vesselFragments: { '[Seer]': { checked: true } },
                    },
                },
            },
        },

        whisperingRoots: {
            '[Ancestral Mound]': {
                reward: { essence: 42 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        spells: { '[Vengeful Spirit]': { checked: true } },
                    },
                },
            },
            '[City of Tears]': {
                reward: { essence: 28 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Crystal Peak]': {
                reward: { essence: 21 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Deepnest]': {
                reward: { essence: 45 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Forgotten Crossroads]': {
                reward: { essence: 29 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Fungal Wastes] (near [Fog Canyon])': {
                reward: { essence: 20 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Fungal Wastes] (above [Mantis Village])': {
                reward: { essence: 18 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Greenpath]': {
                reward: { essence: 44 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[The Hive]': {
                reward: { essence: 20 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        items: { '[TRAM_PASS] [Tram Pass]': { checked: true } },
                    },
                },
            },
            '[Howling Cliffs]': {
                reward: { essence: 46 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            "[Kingdom's Edge]": {
                reward: { essence: 51 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            "[Queen's Gardens]": {
                reward: { essence: 29 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Resting Grounds]': {
                reward: { essence: 20 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            '[Royal Waterways]': {
                reward: { essence: 35 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
            "[Spirits' Glade]": {
                reward: { essence: 34 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                },
            },
        },
    },
};

/**
 * Recursively updates the state object based on the provided updates and operation.
 *
 * This function allows for updating numeric and boolean values within a state object.
 * It can either add or subtract values from the state based on the specified operation.
 * For nested objects, it recursively updates the state.
 *
 * @param {AnyObject} state - The state object to be updated. This object is
 * modified in place.
 * @param {PartialDeep<AnyObject>} updates - An object containing the updates to
 * apply to the state.
 * @param {'add' | 'sub'} operation - The operation to perform on the numeric
 * and boolean values. Use 'add' to increment values and 'sub' to decrement
 * them.
 *
 * @example
 * const state = { count: 10, active: false, nested: { value: 5 } };
 * const updates = { active: true, nested: { value: 3 } };
 *
 * updateState(state, updates, 'add');
 * console.log(state); // { count: 10, active: true, nested: { value: 8 } }
 *
 * updateState(state, updates, 'sub');
 * console.log(state); // { count: 10, active: false, nested: { value: 5 } }
 */
const updateState = (
    state: AnyObject,
    updates: PartialDeep<AnyObject>,
    operation: 'add' | 'sub'
) => {
    Object.entries(updates).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            const stateValue = state[key] as typeof value;
            if (operation === 'add') {
                stateValue.push(...value);
            } else if (operation === 'sub') {
                const [n] = value;
                const index = stateValue.indexOf(n);
                if (index !== -1) {
                    stateValue.splice(index, 1);
                }
            }
        } else if (typeof value === 'number') {
            if (operation === 'add') {
                (state[key] as typeof value) += value;
            } else {
                (state[key] as typeof value) -= value;
            }
        } else if (typeof value === 'boolean') {
            if (operation === 'add') {
                state[key] ||= value;
            } else {
                state[key] = (state[key] ? 1 : 0) - (value ? 1 : 0) === 1;
            }
        } else if (typeof value === 'object' && value !== null) {
            const stateValue = state[key] as typeof value as AnyObject;
            updateState(stateValue, value, operation);
        }
    });
};

const comparator = (
    left: Comparable[string],
    right: Comparable[string]
): boolean => {
    if (typeof left === 'boolean') {
        return left === right;
    } else if (typeof left === 'number' && typeof right === 'number') {
        return left >= right;
    }
    throw new Error(`Unsupported type ${typeof left}`);
};

const validateCheck = (state: ChecklistState, check: Check) => {
    const requires = check.requires;

    if (requires && !partialDeepEqual(state, requires, comparator)) {
        return requires;
    }
    return undefined;
};

/**
 * Validates the checks in the given checklist state.
 *
 * This function iterates through the state of a checklist, checking each
 * requirement against its corresponding conditions. If a requirement is not
 * met, it records an error for that check.
 *
 * @param state - The current state of the checklist, containing various
 * sections and checks.
 * @returns An object containing errors for any checks that failed validation.
 */
const validateChecks = (state: ChecklistState): RequirementCheckErrors => {
    const errors: RequirementCheckErrors = {};

    Object.values(state).forEach(stateValue => {
        typeof stateValue === 'object' &&
            stateValue !== null &&
            Object.entries(stateValue as Checks).forEach(
                ([sectionName, section]) => {
                    const typedSectionName = sectionName as CheckSection;
                    Object.entries(section).forEach(([checkName, check]) => {
                        const typedCheckName =
                            checkName as keyof ChecksSection<CheckSection>;

                        const error =
                            check.checked && validateCheck(state, check);

                        if (error) {
                            errors[`${typedSectionName} ${typedCheckName}`] =
                                error;
                        }
                    });
                }
            );
    });

    return errors;
};

const applyReward = (
    state: ChecklistState,
    reward: CheckRewards,
    willCheck: boolean
) => {
    if (willCheck) {
        updateState(state, reward, 'add');
    } else {
        updateState(state, reward, 'sub');
    }
};

const grubRewards = (state: ChecklistState, willCheck: boolean) => {
    const grubs = state.grubs;

    const grubReward = willCheck
        ? GRUB_REWARDS[grubs - 1]
        : GRUB_REWARDS[grubs];

    applyReward(state, { geo: grubReward }, willCheck);
};

const maskShardRewards = (state: ChecklistState, willCheck: boolean) => {
    const maskShards = state.maskShards;

    const percent = willCheck
        ? [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards - 1]
        : [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards];

    applyReward(state, { percent }, willCheck);
};

const vesselFragmentRewards = (state: ChecklistState, willCheck: boolean) => {
    const vesselFragments = state.vesselFragments;

    const percent = willCheck
        ? [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments - 1]
        : [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments];

    applyReward(state, { percent }, willCheck);
};

const handleCheck = (
    state: ChecklistState,
    sectionName: CheckSection,
    check: Check,
    willCheck: boolean
) => {
    if (check.checked === willCheck) {
        return;
    }
    applyReward(state, check.reward, willCheck);
    check.checked = willCheck;
    if (sectionName === 'grubs') {
        grubRewards(state, willCheck);
    }
    if (sectionName === 'maskShards') {
        maskShardRewards(state, willCheck);
    }
    if (sectionName === 'vesselFragments') {
        vesselFragmentRewards(state, willCheck);
    }
};

const useChecklistStore = create<ChecklistState & Action>()(
    persist(
        temporal(
            immer(set => ({
                ...INITIAL_CHECKLIST_STATE,

                reset: (sectionName?: CheckSection) => {
                    if (sectionName) {
                        set(state => {
                            Object.values(state.checks[sectionName]).forEach(
                                check =>
                                    handleCheck(
                                        state,
                                        sectionName,
                                        check,
                                        false
                                    )
                            );
                        });
                    } else {
                        // This doesn't need to give (or rather, take) rewards,
                        // because the state mutation doesn't depend on the
                        // checks being checked (we just set state to the
                        // initial, all-zero state).
                        set(INITIAL_CHECKLIST_STATE);
                    }
                },

                checkAll: (sectionName?: CheckSection) => {
                    if (sectionName) {
                        set(state => {
                            Object.values(state.checks[sectionName]).forEach(
                                check =>
                                    handleCheck(state, sectionName, check, true)
                            );
                        });
                    } else {
                        set(state => {
                            Object.entries(state.checks).forEach(
                                ([sectionName, section]) => {
                                    Object.values(section).forEach(check =>
                                        handleCheck(
                                            state,
                                            sectionName as CheckSection,
                                            check,
                                            true
                                        )
                                    );
                                }
                            );
                        });
                    }
                },

                toggle: <S extends CheckSection>(
                    section: S,
                    name: keyof ChecksSection<S>
                ) => {
                    set(state => {
                        // Update state after a check/uncheck

                        const check = (
                            state.checks[section] as ChecksSection<S>
                        )[name] as Check;

                        const willCheck = !check.checked;
                        handleCheck(state, section, check, willCheck);
                    });
                },

                validateCheck,

                validateChecks,
            }))
        ),
        {
            name: 'checklist-storage',
            merge: (persisted, current) =>
                deepMerge(current, persisted as ChecklistState & Action),
        }
    )
);

export default useChecklistStore;
