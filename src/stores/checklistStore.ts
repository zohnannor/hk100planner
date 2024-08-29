import { merge as deepMerge } from 'object-deep-merge';
import { PartialDeep } from 'type-fest';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
    Action,
    AnyObject,
    Check,
    ChecklistState,
    CheckRewards,
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

    geoReq: 0,
    essenceReq: [0],
    paleOreReq: 0,
    simpleKeyGodseekerCocoonReq: false,
    simpleKeyRoyalWaterwaysReq: false,
    elegantKeyReq: false,
    loveKeyReq: false,
    shopkeepersKeyReq: false,

    checks: {
        bosses: {
            '[Broken Vessel]': { reward: () => ({ percent: 1 }) },
            '[Brooding Mawlek]': { reward: () => ({ percent: 1 }) },
            '[The Collector]': {
                reward: () => ({ percent: 1, loveKeyReq: true /* 3 grubs */ }),
            },
            '[Dung Defender]': {
                reward: () => ({
                    percent: 1,
                    simpleKeyRoyalWaterwaysReq: true,
                }),
            },
            '[False Knight]': { reward: () => ({ percent: 1, geo: 200 }) },
            '[Grimm]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        charms: {
                            '[Grimmchild] / [Carefree Melody]': {
                                checked: true,
                            },
                        },
                    },
                }),
            },
            '[Gruz Mother]': { reward: () => ({ percent: 1, geo: 50 }) },
            '[Hive Knight]': { reward: () => ({ percent: 1 }) },
            '[Hornet Protector]': { reward: () => ({ percent: 1 }) },
            '[Hornet Sentinel]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                }),
            },
            '[Mantis Lords]': {
                reward: () => ({ percent: 1, geo: 620 /* hallownest seal */ }),
            },
            '[Nosk]': { reward: () => ({ percent: 1, paleOre: 1 }) },
            '[Soul Master]': { reward: () => ({ percent: 1, geo: 380 }) },
            '[Traitor Lord]': { reward: () => ({ percent: 1 }) },
            '[Uumuu]': { reward: () => ({ percent: 1 }) },
            '[Watcher Knight]': {
                reward: () => ({ percent: 1, geo: 655 /* hallownest seal */ }),
                requires: () => ({
                    checks: {
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                }),
            },
        },

        equipment: {
            '[Crystal Heart]': {
                reward: () => ({ percent: 2 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Mothwing Cloak]': { checked: true },
                        },
                    },
                }),
            },
            "[Isma's Tear]": {
                reward: () => ({ percent: 2 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Dung Defender]': { checked: true } },
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                }),
            },
            '[Mantis Claw]': { reward: () => ({ percent: 2 }) },
            '[Monarch Wings]': {
                reward: () => ({ percent: 2 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Broken Vessel]': { checked: true } },
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                }),
            },
            '[Mothwing Cloak]': {
                reward: () => ({ percent: 2 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Hornet Protector]': { checked: true } },
                    },
                }),
            },
            '[Shade Cloak]': {
                reward: () => ({ percent: 2 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            "[King's Brand]": { checked: true },
                        },
                    },
                }),
            },
            "[King's Brand]": {
                reward: () => ({ percent: 2 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Hornet Sentinel]': { checked: true } },
                        equipment: { '[Monarch Wings]': { checked: true } },
                    },
                }),
            },
            '[Lumafly Lantern] (no percent)': {
                reward: () => ({ geoReq: 1800 }),
                requires: () => ({ geo: 1800 }),
            },
        },

        nail: {
            '[Sharpened Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1, geoReq: 250 }),
                requires: () => ({ geo: 250 }),
            },
            '[Channelled Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1, paleOreReq: 1 }),
                requires: () => ({
                    geo: 800,
                    paleOre: 1,
                    checks: {
                        nail: {
                            '[Sharpened Nail](Nail#Upgrades)': {
                                checked: true,
                            },
                        },
                    },
                }),
            },
            '[Coiled Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1, paleOreReq: 2 }),
                requires: () => ({
                    geo: 2000,
                    paleOre: 2,
                    checks: {
                        nail: {
                            '[Channelled Nail](Nail#Upgrades)': {
                                checked: true,
                            },
                        },
                    },
                }),
            },
            '[Pure Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1, paleOreReq: 3 }),
                requires: () => ({
                    geo: 4000,
                    paleOre: 3,
                    checks: {
                        nail: {
                            '[Coiled Nail](Nail#Upgrades)': { checked: true },
                        },
                    },
                }),
            },
        },

        dreamNail: {
            '[Dream Nail]': { reward: () => ({ percent: 1 }) },
            '[Awoken Dream Nail]': {
                reward: () => ({ percent: 1, essenceReq: [1800] }),
                requires: () => ({
                    essence: 1800,
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Ascension](Seer)': {
                reward: () => ({ percent: 1, essenceReq: [2400] }),
                requires: () => ({
                    essence: 2400,
                    checks: {
                        dreamNail: { '[Awoken Dream Nail]': { checked: true } },
                    },
                }),
            },
        },

        nailArts: {
            '[Cyclone Slash]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                }),
            },
            '[Dash Slash]': {
                reward: () => ({ percent: 1, geoReq: 800 }),
                requires: () => ({ geo: 800 }),
            },
            '[Great Slash]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                }),
            },
        },

        spells: {
            '[Desolate Dive]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Soul Master]': { checked: true } },
                    },
                }),
            },
            '[Descending Dark]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Lumafly Lantern] (no percent)': { checked: true },
                        },
                    },
                }),
            },
            '[Howling Wraiths]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                        },
                    },
                }),
            },
            '[Abyss Shriek]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            "[King's Brand]": { checked: true },
                        },
                    },
                }),
            },
            '[Vengeful Spirit]': { reward: () => ({ percent: 1 }) },
            '[Shade Soul]': {
                reward: () => ({ percent: 1, elegantKeyReq: true }),
            },
        },

        charms: {
            '[Wayward Compass]': {
                description:
                    'Bought from [Iselda] in [Dirtmouth] for [GEO] 220 after the first encounter with [Cornifer].',
                reward: () => ({ percent: 1, geoReq: 220 }),
                requires: () => ({ geo: 220 }),
            },
            '[Gathering Swarm]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 300.',
                reward: () => ({ percent: 1, geoReq: 300 }),
                requires: () => ({ geo: 300 }),
            },
            '[Stalwart Shell]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 200.',
                reward: () => ({ percent: 1, geoReq: 200 }),
                requires: () => ({ geo: 200 }),
            },
            '[Soul Catcher]': {
                description:
                    'Found at the very end of the [Ancestral Mound], after killing the [Elder Baldur].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        spells: {
                            '[Vengeful Spirit]': { checked: true },
                        },
                    },
                }),
            },
            '[Shaman Stone]': {
                description:
                    'Bought from [Salubra] for [GEO] 220 in the [Forgotten Crossroads].',
                reward: () => ({ percent: 1, geoReq: 220 }),
                requires: () => ({ geo: 220 }),
            },
            '[Soul Eater]': {
                description:
                    'Found to the east side of the [Crypts](Resting Grounds#Crypts).',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                }),
            },
            '[Dashmaster]': {
                description:
                    'Found beneath a statue below the [Mantis Village] in the [Fungal Wastes], near the entrance to the [Royal Waterways].',
                reward: () => ({ percent: 1 }),
            },
            '[Sprintmaster]': {
                description:
                    "Bought from [Sly] in [Dirtmouth] after acquiring the [SHOPKEEPER'S_KEY] [Shopkeeper's Key] for [GEO] 400.",
                reward: () => ({ percent: 1, shopkeepersKeyReq: true }),
            },
            '[Grubsong]': {
                description:
                    'Gifted by [Grubfather] after 10 [Grubs] have been freed.',
                reward: () => ({ percent: 1 }),
            },
            "[Grubberfly's Elegy]": {
                description:
                    'Gifted by [Grubfather] after freeing all 46 [Grubs].',
                reward: () => ({ percent: 1 }),
            },
            '[Fragile Heart] / [Unbreakable Heart]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 350.',
                reward: () => ({ percent: 1, geoReq: 350 }),
            },
            '[Fragile Greed] / [Unbreakable Greed]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 250.',
                reward: () => ({ percent: 1, geoReq: 250 }),
            },
            '[Fragile Strength] / [Unbreakable Strength]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 600.',
                reward: () => ({ percent: 1, geoReq: 600 }),
            },
            '[Spell Twister]': {
                description:
                    'A secret room on the top of the [Soul Sanctum], just before fighting [Soul Master].',
                reward: () => ({ percent: 1 }),
            },
            '[Steady Body]': {
                description:
                    'Bought from [Salubra] for [GEO] 120 in the [Forgotten Crossroads].',
                reward: () => ({ percent: 1, geoReq: 120 }),
            },
            '[Heavy Blow]': {
                description:
                    "Bought from [Sly] in [Dirtmouth] after acquiring the [SHOPKEEPER'S_KEY] [Shopkeeper's Key] for [GEO] 350.",
                reward: () => ({
                    percent: 1,
                    shopkeepersKeyReq: true,
                    geoReq: 350,
                }),
                requires: () => ({ geo: 350 }),
            },
            '[Quick Slash]': {
                description:
                    'Located in [Kingdom\'s Edge], on a massive anvil in a hidden room in front of a massive corpse known as an "[Ancient Nailsmith]".',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        spells: { '[Desolate Dive]': { checked: true } },
                    },
                }),
            },
            '[Longnail]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 300.',
                reward: () => ({ percent: 1, geoReq: 300 }),
                requires: () => ({ geo: 300 }),
            },
            '[Mark of Pride]': {
                description:
                    'In the [Mantis Village], in a chest in a room northeast of the [Mantis Lords] arena.',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Mantis Lords]': { checked: true } },
                    },
                }),
            },
            '[Fury of the Fallen]': {
                description:
                    "Found in [King's Pass], the starting cavern, behind a spike-filled cavern.",
                reward: () => ({ percent: 1 }),
            },
            '[Thorns of Agony]': {
                description:
                    'Found in [Greenpath] in a maze of thorns featuring [Charged Lumaflies].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Mothwing Cloak]': { checked: true } },
                    },
                }),
            },
            '[Baldur Shell]': {
                description:
                    'Found in the southwest portion of the [Howling Cliffs], where there is a chest that drops only [GEO] 1.',
                reward: () => ({ percent: 1 }),
            },
            '[Flukenest]': {
                description:
                    'Dropped by [Flukemarm] in the [Royal Waterways] when defeated.',
                reward: () => ({ percent: 1 }),
            },
            "[Defender's Crest]": {
                description:
                    'Reward from defeating [Dung Defender] in the [Royal Waterways].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Dung Defender]': { checked: true } },
                    },
                }),
            },
            '[Glowing Womb]': {
                description:
                    'Found in the [Aspid Nest](Forgotten Crossroads#Aspid Nest) after completing [Aspid] arena.',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                }),
            },
            '[Quick Focus]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 800.',
                reward: () => ({ percent: 1, geoReq: 800 }),
                requires: () => ({ geo: 800 }),
            },
            '[Deep Focus]': {
                description:
                    'Found in [Crystal Peak] in a hidden cave made entirely of crystals.',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Crystal Heart]': { checked: true } },
                    },
                }),
            },
            '[Lifeblood Heart]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 250.',
                reward: () => ({ percent: 1, geoReq: 250 }),
                requires: () => ({ geo: 250 }),
            },
            '[Lifeblood Core]': {
                description:
                    'Behind the door in the [Abyss] that opens when you have 15 or more [Lifeblood Masks](Knight#Health).',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            "[King's Brand]": { checked: true },
                        },
                        charms: { "[Joni's Blessing]": { checked: true } },
                    },
                }),
            },
            "[Joni's Blessing]": {
                description:
                    "Found in [Joni's Repose] in the [Howling Cliffs].",
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                            '[Lumafly Lantern] (no percent)': { checked: true },
                        },
                    },
                }),
            },
            '[Hiveblood]': {
                description:
                    'Located in [the Hive], below the room where the [Hive Knight] is fought.',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Hive Knight]': { checked: true } },
                    },
                }),
            },
            '[Spore Shroom]': {
                description:
                    "Found in the [Fungal Wastes] near a pool of acid, close to the entrances to the Queen's Gardens and Deepnest.",
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                }),
            },
            '[Sharp Shadow]': {
                description:
                    'Located in [Deepnest], southeast of the Hot Spring behind a [Shade Gate].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Shade Cloak]': { checked: true } },
                    },
                }),
            },
            '[Shape of Unn]': {
                description: 'Acquired from [Unn] beneath the [Lake of Unn].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            "[Isma's Tear]": { checked: true },
                        },
                    },
                }),
            },
            "[Nailmaster's Glory]": {
                description:
                    'Given by [Sly] after receiving all 3 [Nail Arts] from the [Nailmasters].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        nailArts: {
                            '[Cyclone Slash]': { checked: true },
                            '[Dash Slash]': { checked: true },
                            '[Great Slash]': { checked: true },
                        },
                    },
                }),
            },
            '[Weaversong]': {
                description: "Found in the upper part of [Weavers' Den].",
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        equipment: { '[Mantis Claw]': { checked: true } },
                    },
                }),
            },
            '[Dream Wielder]': {
                description: 'Given by [Seer] after gathering [ESSENCE] 500.',
                reward: () => ({ percent: 1, essenceReq: [500] }),
                requires: () => ({ essence: 500 }),
            },
            '[Dreamshield]': {
                description:
                    "Found in a room in the [Resting Grounds], below [Seer]'s room.",
                reward: () => ({ percent: 1 }),
            },
            '[Grimmchild] / [Carefree Melody]': {
                description:
                    '[Grimmchild] is given by [Troupe Master Grimm] in Dirtmouth after [the Grimm Troupe] has been summoned. ' +
                    'After banishing the Grimm Troupe, the [Carefree Melody] charm can be acquired from [Nymm] by listening to him in [Dirtmouth].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Kingsoul] / [Void Heart]': {
                description:
                    'Obtained after getting both [White Fragments]. ' +
                    'After obtaining the [Kingsoul], [Void Heart] can be found in [the Birthplace] at the bottom of [the Abyss].',
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Traitor Lord]': { checked: true } },
                        equipment: { '[Monarch Wings]': { checked: true } },
                        dreamNail: { '[Awoken Dream Nail]': { checked: true } },
                    },
                }),
            },
        },

        maskShards: {
            '[Sly] #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 150.',
                reward: () => ({ percent: 1 / 4, geoReq: 150 }),
                requires: () => ({ geo: 150 }),
            },
            '[Sly] #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 500.',
                reward: () => ({ percent: 1 / 4, geoReq: 500 }),
                requires: () => ({ geo: 500 }),
            },
            '[Sly] #3': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 800.',
                reward: () => ({ percent: 1 / 4, geoReq: 800 }),
                requires: () => ({ geo: 800 }),
            },
            '[Sly] #4': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 1500.',
                reward: () => ({ percent: 1 / 4, geoReq: 1500 }),
                requires: () => ({ geo: 1500 }),
            },
            '[Forgotten Crossroads] [Brooding Mawlek]': {
                description: 'Reward for defeating [Brooding Mawlek].',
                reward: () => ({ percent: 1 / 4 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Brooding Mawlek]': { checked: true } },
                    },
                }),
            },
            '[Grubfather]': {
                description: 'Requires rescuing 5 [Grubs].',
                reward: () => ({ percent: 1 / 4 }),
                /* 5 grubs */
            },
            '[Forgotten Crossroads] [Goams]': {
                description:
                    'Behind a gauntlet of [Goams] in [Forgotten Crossroads].',
                reward: () => ({ percent: 1 / 4 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Monarch Wings]': { checked: true },
                            '[Mantis Claw]': { checked: true },
                        },
                    },
                }),
            },
            "[Queen's Station]": {
                description: "Near east side of the [Queen's Station].",
                reward: () => ({ percent: 1 / 4 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Mantis Claw]': { checked: true },
                        },
                    },
                }),
            },
            "[Bretta]'s house": {
                description: 'Requires rescuing [Bretta] from [Fungal Wastes].',
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Stone Sanctuary]': {
                reward: () => ({ percent: 1 / 4 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Lumafly Lantern] (no percent)': { checked: true },
                        },
                    },
                }),
            },
            '[Royal Waterways]': {
                description:
                    'Northwest section of the Royal Waterways, swim west under main path.',
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Deepnest] from [Fungal Core]': {
                reward: () => ({ percent: 1 / 4 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Monarch Wings]': { checked: true },
                        },
                    },
                }),
            },
            '[Enraged Guardian]': {
                reward: () => ({ percent: 1 / 4 }),
                requires: () => ({
                    checks: {
                        equipment: {
                            '[Monarch Wings]': { checked: true },
                        },
                    },
                }),
            },
            '[Hive]': {
                description:
                    'Requires baiting a [Hive Guardian] into breaking a wall.',
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 1500.',
                reward: () => ({ percent: 1 / 4, essenceReq: [1500] }),
                requires: () => ({ essence: 1500 }),
            },
            '[Grey Mourner]': {
                description: 'Requires completing the [Delicate Flower quest].',
                reward: () => ({ percent: 1 / 4 }),
            },
        },

        vesselFragments: {
            '[Sly] #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 550.',
                reward: () => ({ percent: 1 / 3, geoReq: 550 }),
                requires: () => ({ geo: 550 }),
            },
            '[Sly] #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 900.',
                reward: () => ({ percent: 1 / 3, geoReq: 900 }),
                requires: () => ({ geo: 900 }),
            },
            '[Greenpath]': {
                description:
                    "Near the inaccessible [Queen's Gardens] entrance.",
                reward: () => ({ percent: 1 / 3 }),
            },
            'Left of the lift in [Forgotten Crossroads]': {
                description:
                    'Accessible after unlocking the lift in the [City of Tears].',
                reward: () => ({ percent: 1 / 3 }),
            },
            "Above [King's Station] near a lift": {
                description: 'Accessible after completing the arena.',
                reward: () => ({ percent: 1 / 3 }),
            },
            '[Deepnest]': {
                description:
                    'At the end of the [Garpede] parkour section above the working [Tram].',
                reward: () => ({ percent: 1 / 3 }),
            },
            '[Stag Nest]': { reward: () => ({ percent: 1 / 3 }) },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 700.',
                reward: () => ({ percent: 1 / 3, essenceReq: [700] }),
                requires: () => ({ essence: 700 }),
            },
            '[Ancient Basin] fountain': {
                description: 'For dropping [GEO] 3000 into the fountain.',
                reward: () => ({ percent: 1 / 3, geoReq: 3000 }),
                requires: () => ({ geo: 3000 }),
            },
        },

        dreamers: {
            '[Herra the Beast]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        equipment: {
                            '[Lumafly Lantern] (no percent)': { checked: true },
                            '[Mantis Claw]': { checked: true },
                        },
                    },
                }),
            },
            '[Lurien the Watcher]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Watcher Knight]': { checked: true } },
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Monomon the Teacher]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Uumuu]': { checked: true } },
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
        },

        dreamWarriors: {
            '[Elder Hu]': {
                reward: () => ({ percent: 1, essence: 100 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Galien]': {
                reward: () => ({ percent: 1, essence: 200 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Gorb]': {
                reward: () => ({ percent: 1, essence: 100 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Markoth]': {
                reward: () => ({ percent: 1, essence: 250 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Marmu]': {
                reward: () => ({ percent: 1, essence: 150 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[No Eyes]': {
                reward: () => ({ percent: 1, essence: 200 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Xero]': {
                reward: () => ({ percent: 1, essence: 100 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Nightmare King Grimm] / [Banishment]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        charms: {
                            '[Grimmchild] / [Carefree Melody]': {
                                checked: true,
                            },
                        },
                    },
                }),
            },
        },

        dreamBosses: {
            '[Failed Champion]': {
                reward: () => ({ essence: 300 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Grey Prince Zote]': {
                reward: () => ({ essence: 300 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Lost Kin]': {
                reward: () => ({ essence: 400 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[White Defender]': {
                reward: () => ({ essence: 300 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
            '[Soul Tyrant]': {
                reward: () => ({ essence: 300 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                    },
                }),
            },
        },

        colosseum: {
            '[Trial of the Warrior]': {
                reward: () => ({ percent: 1, geoReq: 100, geo: 1000 }),
                requires: () => ({ geo: 100 }),
            },
            '[Trial of the Conqueror]': {
                reward: () => ({
                    percent: 1,
                    geoReq: 450,
                    geo: 2000,
                    paleOre: 1,
                }),
                requires: () => ({
                    geo: 450,
                    checks: {
                        colosseum: {
                            '[Trial of the Warrior]': { checked: true },
                        },
                    },
                }),
            },
            '[Trial of the Fool]': {
                reward: () => ({ percent: 1, geoReq: 800, geo: 3000 }),
                requires: () => ({
                    geo: 800,
                    checks: {
                        colosseum: {
                            '[Trial of the Conqueror]': { checked: true },
                        },
                    },
                }),
            },
        },

        godhome: {
            '[Godtuner]': {
                reward: () => ({
                    percent: 1,
                    simpleKeyGodseekerCocoonReq: true,
                }),
            },
            '[Pantheon of the Master]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
                    checks: {
                        dreamNail: { '[Dream Nail]': { checked: true } },
                        bosses: {
                            '[Gruz Mother]': { checked: true },
                            '[False Knight]': { checked: true },
                            '[Hornet Protector]': { checked: true },
                            '[Dung Defender]': { checked: true },
                            '[Brooding Mawlek]': { checked: true },
                        },
                        dreamWarriors: {
                            '[Gorb]': { checked: true },
                        },
                    },
                }),
            },
            '[Pantheon of the Artist]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
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
                }),
            },
            '[Pantheon of the Sage]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
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
                }),
            },
            '[Pantheon of the Knight]': {
                reward: () => ({ percent: 1 }),
                requires: () => ({
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
                }),
            },
        },

        grubs: {},

        relicsAndItems: {},

        whisperingRoots: {},
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
            if (operation === 'add') {
                state[key].push(...value);
            } else if (operation === 'sub') {
                const index = state[key].indexOf(...value);
                if (index !== -1) {
                    state[key].splice(index, 1);
                }
            }
        } else if (typeof value === 'number') {
            if (operation === 'add') {
                state[key] += value;
            } else {
                state[key] -= value;
            }
        } else if (typeof value === 'boolean') {
            if (operation === 'add') {
                state[key] ||= value;
            } else {
                state[key] = (state[key] ? 1 : 0) - (value ? 1 : 0) === 1;
            }
        } else if (typeof value === 'object' && value !== null) {
            updateState(state[key], value, operation);
        }
    });
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

    Object.values(state).forEach(stateValue => {
        typeof stateValue === 'object' &&
            stateValue !== null &&
            Object.values(stateValue).forEach(section => {
                Object.entries(section).forEach(([checkName, check]) => {
                    const typedCheckName =
                        checkName as keyof ChecksSection<CheckSection>;
                    const requires = check.checked && check.requires?.();

                    if (
                        requires &&
                        !partialDeepEqual(state, requires, comparator)
                    ) {
                        errors[typedCheckName] = requires;
                    }
                });
            });
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

const useChecklistStore = create<ChecklistState & Action>()(
    persist(
        temporal(
            immer(set => ({
                ...INITIAL_CHECKLIST_STATE,

                reset: (sectionName?: CheckSection) => {
                    const handleCheck = (
                        state: ChecklistState,
                        check: Check
                    ) => {
                        if (check.checked) {
                            applyReward(state, check.reward(), false);
                        }
                        check.checked = false;
                    };

                    if (sectionName) {
                        set(state => {
                            Object.values(state.checks[sectionName]).forEach(
                                check => handleCheck(state, check)
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
                    const handleCheck = (
                        state: ChecklistState,
                        check: Check
                    ) => {
                        if (!check.checked) {
                            applyReward(state, check.reward(), true);
                        }
                        check.checked = true;
                    };

                    if (sectionName) {
                        set(state => {
                            Object.values(state.checks[sectionName]).forEach(
                                check => handleCheck(state, check)
                            );
                        });
                    } else {
                        set(state => {
                            Object.values(state.checks).forEach(section => {
                                Object.values(section).forEach(check =>
                                    handleCheck(state, check)
                                );
                            });
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
                        check.checked = willCheck;

                        const reward = check.reward();
                        applyReward(state, reward, willCheck);
                    });
                },

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