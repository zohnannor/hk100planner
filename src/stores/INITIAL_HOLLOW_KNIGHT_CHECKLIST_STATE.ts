import { HollowKnightChecklistState } from '../types/checklist';

const nothing = {} as const;
const checked = { checked: true } as const;
const charms = 1 as const;
const grubs = { grubs: 1 } as const;
const maskShards = 1 as const;
const vesselFragments = 1 as const;
const percent = 1 as const;
const simpleKeys = 1 as const;
const simpleKeysReq = 1 as const;

const INITIAL_HOLLOW_KNIGHT_CHECKLIST_STATE: HollowKnightChecklistState = {
    game: 'hollow-knight',
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
                reward: { percent },
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            '[Brooding Mawlek]': { reward: { percent } },
            '[The Collector]': {
                reward: { percent },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': checked },
                        items: { '[LOVE_KEY] [Love Key]': checked },
                    },
                },
            },
            '[Dung Defender]': {
                reward: { percent, simpleKeysReq },
                requires: {
                    simpleKeys,
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[False Knight]': { reward: { percent, geo: 200 } },
            '[Grimm]': {
                reward: { percent },
                requires: {
                    checks: {
                        charms: {
                            '[Grimmchild] / [Carefree Melody]': checked,
                        },
                    },
                },
            },
            '[Gruz Mother]': { reward: { percent, geo: 50 } },
            '[Hive Knight]': {
                reward: { percent },
                requires: {
                    checks: {
                        items: { '[TRAM_PASS] [Tram Pass]': checked },
                    },
                },
            },
            '[Hornet Protector]': {
                reward: { percent },
                requires: {
                    checks: { spells: { '[Vengeful Spirit]': checked } },
                },
            },
            '[Hornet Sentinel]': {
                reward: { percent },
                requires: {
                    checks: { equipment: { '[Monarch Wings]': checked } },
                },
            },
            '[Mantis Lords]': {
                reward: { percent, geo: 620 },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Nosk]': {
                reward: { percent },
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            '[Soul Master]': {
                reward: { percent, geo: 380 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Traitor Lord]': {
                reward: { percent },
                requires: {
                    checks: { equipment: { '[Shade Cloak]': checked } },
                },
            },
            '[Uumuu]': {
                reward: { percent },
                requires: {
                    checks: { equipment: { "[Isma's Tear]": checked } },
                },
            },
            '[Watcher Knight]': {
                reward: { percent, geo: 655 },
                requires: {
                    checks: { equipment: { '[Monarch Wings]': checked } },
                },
            },
        },

        optionalBosses: {
            '[Absolute Radiance]': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: {
                            '[Pantheon of the Hallownest] (no percent)':
                                checked,
                        },
                    },
                },
            },
            '[Brothers Oro & Mato]': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: { '[Pantheon of the Master]': checked },
                    },
                },
            },
            '[Crystal Guardian]': {
                reward: { geo: 385 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Enraged Guardian]': {
                reward: { geo: 550 },
                requires: {
                    checks: {
                        optionalBosses: { '[Crystal Guardian]': checked },
                        equipment: { '[Monarch Wings]': checked },
                    },
                },
            },
            '[Flukemarm]': {
                reward: nothing,
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[God Tamer]': {
                reward: nothing,
                requires: {
                    checks: {
                        colosseum: { '[Trial of the Fool]': checked },
                    },
                },
            },
            '[Great Nailsage Sly]': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: { '[Pantheon of the Sage]': checked },
                    },
                },
            },
            '[Hollow Knight]': {
                reward: nothing,
                requires: {
                    checks: {
                        dreamers: {
                            '[Herra the Beast]': checked,
                            '[Lurien the Watcher]': checked,
                            '[Monomon the Teacher]': checked,
                        },
                    },
                },
            },
            '[Massive Moss Charger]': {
                reward: { geo: 300 },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Oblobbles]': {
                reward: nothing,
                requires: {
                    checks: {
                        colosseum: { '[Trial of the Conqueror]': checked },
                    },
                },
            },
            '[Paintmaster Sheo]': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: { '[Pantheon of the Artist]': checked },
                    },
                },
            },
            '[Pure Vessel]': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: { '[Pantheon of the Knight]': checked },
                    },
                },
            },
            '[Radiance]': {
                reward: nothing,
                requires: {
                    checks: {
                        charms: { '[Kingsoul] / [Void Heart]': checked },
                        optionalBosses: { '[Hollow Knight]': checked },
                        dreamNail: { '[Dream Nail]': checked },
                    },
                },
            },
            '[Sisters of Battle]': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: {
                            '[Pantheon of the Hallownest] (no percent)':
                                checked,
                        },
                    },
                },
            },
            '[Soul Warrior]': { reward: { geo: 200 } },
            '[Vengefly King]': {
                reward: { geo: 65 },
                requires: {
                    checks: { spells: { '[Vengeful Spirit]': checked } },
                },
            },
            '[Winged Nosk]': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: {
                            '[Pantheon of the Hallownest] (no percent)':
                                checked,
                        },
                    },
                },
            },
            '[Zote]': {
                reward: nothing,
                requires: {
                    checks: {
                        colosseum: { '[Trial of the Warrior]': checked },
                        optionalBosses: { '[Vengefly King]': checked },
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
                            '[Mantis Claw]': checked,
                            '[Mothwing Cloak]': checked,
                        },
                    },
                },
            },
            "[Isma's Tear]": {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        bosses: { '[Dung Defender]': checked },
                        equipment: { '[Crystal Heart]': checked },
                    },
                },
            },
            '[Mantis Claw]': {
                reward: { percent: 2 },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Monarch Wings]': {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        bosses: { '[Broken Vessel]': checked },
                        equipment: {
                            '[Crystal Heart]': checked,
                            '[Mantis Claw]': checked,
                        },
                    },
                },
            },
            '[Mothwing Cloak]': {
                reward: { percent: 2 },
                requires: {
                    checks: { bosses: { '[Hornet Protector]': checked } },
                },
            },
            '[Shade Cloak]': {
                reward: { percent: 2 },
                requires: {
                    checks: { equipment: { "[King's Brand]": checked } },
                },
            },
            "[King's Brand]": {
                reward: { percent: 2 },
                requires: {
                    checks: {
                        bosses: { '[Hornet Sentinel]': checked },
                        equipment: { '[Monarch Wings]': checked },
                    },
                },
            },
        },

        nail: {
            '[Sharpened Nail](Nail#Upgrades)': {
                reward: { percent, geoReq: 250 },
                requires: { geo: 250 },
            },
            '[Channelled Nail](Nail#Upgrades)': {
                reward: { percent, geoReq: 800, paleOreReq: 1 },
                requires: {
                    geo: 800,
                    paleOre: 1,
                    checks: {
                        nail: {
                            '[Sharpened Nail](Nail#Upgrades)': checked,
                        },
                    },
                },
            },
            '[Coiled Nail](Nail#Upgrades)': {
                reward: { percent, geoReq: 2000, paleOreReq: 2 },
                requires: {
                    geo: 2000,
                    paleOre: 2,
                    checks: {
                        nail: {
                            '[Channelled Nail](Nail#Upgrades)': checked,
                        },
                    },
                },
            },
            '[Pure Nail](Nail#Upgrades)': {
                reward: { percent, geoReq: 4000, paleOreReq: 3 },
                requires: {
                    geo: 4000,
                    paleOre: 3,
                    checks: {
                        nail: { '[Coiled Nail](Nail#Upgrades)': checked },
                    },
                },
            },
        },

        dreamNail: {
            '[Dream Nail]': {
                reward: { percent },
                requires: {
                    checks: { items: { '[Lumafly Lantern]': checked } },
                },
            },
            '[Awoken Dream Nail]': {
                reward: { percent, essenceReq: [1800] },
                requires: {
                    essence: 1800,
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        maskShards: { '[Seer]': checked },
                    },
                },
            },
            '[Ascension](Seer)': {
                reward: { percent, essenceReq: [2400] },
                requires: {
                    essence: 2400,
                    checks: {
                        dreamNail: { '[Awoken Dream Nail]': checked },
                    },
                },
            },
        },

        nailArts: {
            '[Cyclone Slash]': {
                reward: { percent },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Dash Slash]': {
                reward: { percent, geoReq: 800 },
                requires: { geo: 800 },
            },
            '[Great Slash]': {
                reward: { percent },
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
        },

        spells: {
            '[Desolate Dive]': {
                reward: { percent },
                requires: {
                    checks: { bosses: { '[Soul Master]': checked } },
                },
            },
            '[Descending Dark]': {
                reward: { percent },
                requires: {
                    checks: {
                        items: { '[Lumafly Lantern]': checked },
                        spells: { '[Desolate Dive]': checked },
                    },
                },
            },
            '[Howling Wraiths]': {
                reward: { percent },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Abyss Shriek]': {
                reward: { percent },
                requires: {
                    checks: {
                        equipment: { "[King's Brand]": checked },
                        spells: { '[Howling Wraiths]': checked },
                    },
                },
            },
            '[Vengeful Spirit]': {
                reward: { percent },
                requires: {
                    checks: { bosses: { '[False Knight]': checked } },
                },
            },
            '[Shade Soul]': {
                reward: { percent },
                requires: {
                    checks: {
                        items: { '[ELEGANT_KEY] [Elegant Key]': checked },
                    },
                },
            },
        },

        charms: {
            '[Wayward Compass]': {
                description:
                    'Bought from [Iselda] in [Dirtmouth] for [GEO] 220 after the first encounter with [Cornifer].',
                reward: { percent, charms, geoReq: 220 },
                requires: { geo: 220 },
            },
            '[Gathering Swarm]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 300.',
                reward: { percent, charms, geoReq: 300 },
                requires: { geo: 300 },
            },
            '[Stalwart Shell]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 200.',
                reward: { percent, charms, geoReq: 200 },
                requires: { geo: 200 },
            },
            '[Soul Catcher]': {
                description:
                    'Found at the very end of the [Ancestral Mound], after killing the [Elder Baldur].',
                reward: { percent, charms },
                requires: {
                    checks: { spells: { '[Vengeful Spirit]': checked } },
                },
            },
            '[Shaman Stone]': {
                description:
                    'Bought from [Salubra] for [GEO] 220 in the [Forgotten Crossroads].',
                reward: { percent, charms, geoReq: 220 },
                requires: {
                    geo: 220,
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Soul Eater]': {
                description:
                    'Found to the east side of the [Crypts](Resting Grounds#Crypts).',
                reward: { percent, charms },
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[Dashmaster]': {
                description:
                    'Found beneath a statue below the [Mantis Village] in the [Fungal Wastes], near the entrance to the [Royal Waterways].',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Sprintmaster]': {
                description:
                    "Bought from [Sly] in [Dirtmouth] after acquiring the [SHOPKEEPER'S_KEY] [Shopkeeper's Key] for [GEO] 400.",
                reward: { percent, charms, geoReq: 400 },
                requires: {
                    geo: 400,
                    checks: {
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": checked,
                        },
                    },
                },
            },
            '[Grubsong]': {
                description:
                    'Gifted by [Grubfather] after 10 [Grubs] have been freed.',
                reward: { percent, charms },
                requires: { grubs: 10 },
            },
            "[Grubberfly's Elegy]": {
                description:
                    'Gifted by [Grubfather] after freeing all 46 [Grubs].',
                reward: { percent, charms },
                requires: { grubs: 46 },
            },
            '[Fragile Heart] / [Unbreakable Heart]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 350.',
                reward: { percent, charms, geoReq: 350 },
                requires: { geo: 350 },
            },
            '[Fragile Greed] / [Unbreakable Greed]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 250.',
                reward: { percent, charms, geoReq: 250 },
                requires: { geo: 250 },
            },
            '[Fragile Strength] / [Unbreakable Strength]': {
                description:
                    'Bought from [Leg Eater] in [Fungal Wastes] for [GEO] 600.',
                reward: { percent, charms, geoReq: 600 },
                requires: { geo: 600 },
            },
            '[Spell Twister]': {
                description:
                    'A secret room on the top of the [Soul Sanctum], just before fighting [Soul Master].',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Steady Body]': {
                description:
                    'Bought from [Salubra] for [GEO] 120 in the [Forgotten Crossroads].',
                reward: { percent, charms, geoReq: 120 },
                requires: {
                    geo: 120,
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Heavy Blow]': {
                description:
                    "Bought from [Sly] in [Dirtmouth] after acquiring the [SHOPKEEPER'S_KEY] [Shopkeeper's Key] for [GEO] 350.",
                reward: { percent, charms, geoReq: 350 },
                requires: {
                    geo: 350,
                    checks: {
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": checked,
                        },
                    },
                },
            },
            '[Quick Slash]': {
                description:
                    'Located in [Kingdom\'s Edge], on a massive anvil in a hidden room in front of a massive corpse known as an "[Ancient Nailsmith]".',
                reward: { percent, charms },
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[Longnail]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 300.',
                reward: { percent, charms, geoReq: 300 },
                requires: {
                    geo: 300,
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Mark of Pride]': {
                description:
                    'In the [Mantis Village], in a chest in a room northeast of the [Mantis Lords] arena.',
                reward: { percent, charms },
                requires: {
                    checks: { bosses: { '[Mantis Lords]': checked } },
                },
            },
            '[Fury of the Fallen]': {
                description:
                    "Found in [King's Pass], the starting cavern, behind a spike-filled cavern.",
                reward: { percent, charms },
            },
            '[Thorns of Agony]': {
                description:
                    'Found in [Greenpath] in a maze of thorns featuring [Charged Lumaflies].',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Baldur Shell]': {
                description:
                    'Found in the southwest portion of the [Howling Cliffs], where there is a chest that drops only [GEO] 1.',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Flukenest]': {
                description:
                    'Dropped by [Flukemarm] in the [Royal Waterways] when defeated.',
                reward: { percent, charms },
                requires: {
                    checks: {
                        spells: { '[Desolate Dive]': checked },
                        optionalBosses: { '[Flukemarm]': checked },
                    },
                },
            },
            "[Defender's Crest]": {
                description:
                    'Reward from defeating [Dung Defender] in the [Royal Waterways].',
                reward: { percent, charms },
                requires: {
                    checks: { bosses: { '[Dung Defender]': checked } },
                },
            },
            '[Glowing Womb]': {
                description:
                    'Found in the [Aspid Nest](Forgotten Crossroads#Aspid_Nest) after completing [Aspid] arena.',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            '[Quick Focus]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 800.',
                reward: { percent, charms, geoReq: 800 },
                requires: {
                    geo: 800,
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Deep Focus]': {
                description:
                    'Found in [Crystal Peak] in a hidden cave made entirely of crystals.',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            '[Lifeblood Heart]': {
                description:
                    'Bought from [Salubra] in the [Forgotten Crossroads] for [GEO] 250.',
                reward: { percent, charms, geoReq: 250 },
                requires: {
                    geo: 250,
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Lifeblood Core]': {
                description:
                    'Behind the door in the [Abyss] that opens when you have 15 or more [Lifeblood Masks](Knight#Health).',
                reward: { percent, charms },
                requires: {
                    checks: {
                        equipment: { "[King's Brand]": checked },
                        charms: {
                            "[Joni's Blessing]": checked,
                            '[Fragile Heart] / [Unbreakable Heart]': checked,
                        },
                    },
                    maskShards: 8,
                },
            },
            "[Joni's Blessing]": {
                description:
                    "Found in [Joni's Repose] in the [Howling Cliffs].",
                reward: { percent, charms },
                requires: {
                    checks: {
                        equipment: { '[Mantis Claw]': checked },
                        items: { '[Lumafly Lantern]': checked },
                    },
                },
            },
            '[Hiveblood]': {
                description:
                    'Located in [the Hive], below the room where the [Hive Knight] is fought.',
                reward: { percent, charms },
                requires: {
                    checks: {
                        bosses: { '[Hive Knight]': checked },
                        items: { '[TRAM_PASS] [Tram Pass]': checked },
                    },
                },
            },
            '[Spore Shroom]': {
                description:
                    "Found in the [Fungal Wastes] near a pool of acid, close to the entrances to the Queen's Gardens and Deepnest.",
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Sharp Shadow]': {
                description:
                    'Located in [Deepnest], southeast of the Hot Spring behind a [Shade Gate].',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Shade Cloak]': checked } },
                },
            },
            '[Shape of Unn]': {
                description: 'Acquired from [Unn] beneath the [Lake of Unn].',
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { "[Isma's Tear]": checked } },
                },
            },
            "[Nailmaster's Glory]": {
                description:
                    'Given by [Sly] after receiving all 3 [Nail Arts] from the [Nailmasters].',
                reward: { percent, charms },
                requires: {
                    checks: {
                        nailArts: {
                            '[Cyclone Slash]': checked,
                            '[Dash Slash]': checked,
                            '[Great Slash]': checked,
                        },
                    },
                },
            },
            '[Weaversong]': {
                description: "Found in the upper part of [Weavers' Den].",
                reward: { percent, charms },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Dream Wielder]': {
                description:
                    'Given by the [Seer] after gathering [ESSENCE] 500.',
                reward: { percent, charms, essenceReq: [500] },
                requires: {
                    essence: 500,
                    checks: {
                        items: {
                            '[PALE_ORE] [Pale Ore] awarded by the [Seer]':
                                checked,
                        },
                    },
                },
            },
            '[Dreamshield]': {
                description:
                    "Found in a room in the [Resting Grounds], below [Seer]'s room.",
                reward: { percent, charms },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Grimmchild] / [Carefree Melody]': {
                description:
                    '[Grimmchild] is given by [Troupe Master Grimm] in Dirtmouth after [the Grimm Troupe] has been summoned. ' +
                    'After banishing the Grimm Troupe, the [Carefree Melody] charm can be acquired from [Nymm] by listening to him in [Dirtmouth].',
                reward: { percent, charms },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Kingsoul] / [Void Heart]': {
                description:
                    'Obtained after getting both [White Fragments]. ' +
                    'After obtaining the [Kingsoul], [Void Heart] can be found in [the Birthplace] at the bottom of [the Abyss].',
                reward: { percent, charms },
                requires: {
                    checks: {
                        bosses: { '[Traitor Lord]': checked },
                        equipment: { '[Monarch Wings]': checked },
                        dreamNail: { '[Awoken Dream Nail]': checked },
                    },
                },
            },
        },

        maskShards: {
            '[Sly] #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 150.',
                reward: { maskShards, geoReq: 150 },
                requires: { geo: 150 },
            },
            '[Sly] #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 500.',
                reward: { maskShards, geoReq: 500 },
                requires: {
                    geo: 500,
                    checks: { maskShards: { '[Sly] #1': checked } },
                },
            },
            '[Sly] #3': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 800.',
                reward: { maskShards, geoReq: 800 },
                requires: {
                    geo: 800,
                    checks: {
                        maskShards: { '[Sly] #2': checked },
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": checked,
                        },
                    },
                },
            },
            '[Sly] #4': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 1500.',
                reward: { maskShards, geoReq: 1500 },
                requires: {
                    geo: 1500,
                    checks: {
                        maskShards: { '[Sly] #3': checked },
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": checked,
                        },
                    },
                },
            },
            '[Forgotten Crossroads] [Brooding Mawlek]': {
                description: 'Reward for defeating [Brooding Mawlek].',
                reward: { maskShards },
                requires: {
                    checks: { bosses: { '[Brooding Mawlek]': checked } },
                },
            },
            '[Grubfather]': {
                description: 'Requires rescuing 5 [Grubs].',
                reward: { maskShards },
                requires: { grubs: 5 },
            },
            '[Forgotten Crossroads] [Goams]': {
                description:
                    'Behind a gauntlet of [Goams] in [Forgotten Crossroads].',
                reward: { maskShards },
                requires: {
                    checks: { equipment: { '[Monarch Wings]': checked } },
                },
            },
            "[Queen's Station]": {
                description: "Near east side of the [Queen's Station].",
                reward: { maskShards },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            "[Bretta]'s house": {
                description: 'Requires rescuing [Bretta] from [Fungal Wastes].',
                reward: { maskShards },
                requires: {
                    checks: {
                        equipment: {
                            '[Mothwing Cloak]': checked,
                            '[Mantis Claw]': checked,
                        },
                    },
                },
            },
            '[Stone Sanctuary]': {
                reward: { maskShards },
                requires: {
                    checks: { items: { '[Lumafly Lantern]': checked } },
                },
            },
            '[Royal Waterways]': {
                description:
                    'Northwest section of the Royal Waterways, swim west under main path.',
                reward: { maskShards },
                requires: { simpleKeys },
            },
            '[Deepnest] from [Fungal Core]': {
                reward: { maskShards },
                requires: {
                    checks: { equipment: { '[Monarch Wings]': checked } },
                },
            },
            '[Enraged Guardian]': {
                reward: { maskShards },
                requires: {
                    checks: {
                        equipment: { '[Monarch Wings]': checked },
                        optionalBosses: { '[Enraged Guardian]': checked },
                    },
                },
            },
            '[The Hive]': {
                description:
                    'Requires baiting a [Hive Guardian] into breaking a wall.',
                reward: { maskShards },
                requires: {
                    checks: {
                        items: { '[TRAM_PASS] [Tram Pass]': checked },
                    },
                },
            },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 1500.',
                reward: { maskShards, essenceReq: [1500] },
                requires: {
                    essence: 1500,
                    checks: {
                        relics: {
                            '[ARCANE_EGG] [Arcane Egg] awarded by the [Seer]':
                                checked,
                        },
                    },
                },
            },
            '[Grey Mourner]': {
                description: 'Requires completing the [Delicate Flower quest].',
                reward: { maskShards },
                requires: {
                    checks: {
                        items: { '[Delicate Flower]': checked },
                        equipment: { '[Mothwing Cloak]': checked },
                    },
                },
            },
        },

        vesselFragments: {
            '[Sly] #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 550.',
                reward: { vesselFragments, geoReq: 550 },
                requires: { geo: 550 },
            },
            '[Sly] #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 900.',
                reward: { vesselFragments, geoReq: 900 },
                requires: {
                    geo: 900,
                    checks: {
                        vesselFragments: { '[Sly] #1': checked },
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": checked,
                        },
                    },
                },
            },
            '[Greenpath]': {
                description:
                    "Near the inaccessible [Queen's Gardens] entrance.",
                reward: { vesselFragments },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            'Left of the lift in [Forgotten Crossroads]': {
                description:
                    'Accessible after unlocking the lift in the [City of Tears].',
                reward: { vesselFragments },
            },
            "Above [King's Station] near a lift": {
                description: 'Accessible after completing the arena.',
                reward: { vesselFragments },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Deepnest]': {
                description:
                    'At the end of the [Garpede] parkour section above the working [Tram].',
                reward: { vesselFragments },
            },
            '[Stag Nest]': { reward: { vesselFragments } },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 700.',
                reward: { vesselFragments, essenceReq: [700] },
                requires: {
                    essence: 700,
                    checks: { charms: { '[Dream Wielder]': checked } },
                },
            },
            '[Ancient Basin] fountain': {
                description: 'For dropping [GEO] 3000 into the fountain.',
                reward: { vesselFragments, geoReq: 3000 },
                requires: { geo: 3000 },
            },
        },

        dreamers: {
            '[Herra the Beast]': {
                reward: { percent },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        equipment: { '[Mantis Claw]': checked },
                        items: { '[Lumafly Lantern]': checked },
                    },
                },
            },
            '[Lurien the Watcher]': {
                reward: { percent },
                requires: {
                    checks: {
                        bosses: { '[Watcher Knight]': checked },
                        dreamNail: { '[Dream Nail]': checked },
                    },
                },
            },
            '[Monomon the Teacher]': {
                reward: { percent },
                requires: {
                    checks: {
                        bosses: { '[Uumuu]': checked },
                        dreamNail: { '[Dream Nail]': checked },
                    },
                },
            },
        },

        dreamWarriors: {
            '[Elder Hu]': {
                reward: { percent, essence: 100 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Galien]': {
                reward: { percent, essence: 200 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Gorb]': {
                reward: { percent, essence: 100 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Markoth]': {
                reward: { percent, essence: 250 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Marmu]': {
                reward: { percent, essence: 150 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[No Eyes]': {
                reward: { percent, essence: 200 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Xero]': {
                reward: { percent, essence: 100 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Nightmare King Grimm] / [Banishment](Grimm Troupe (Quest))': {
                reward: { percent },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        charms: {
                            '[Grimmchild] / [Carefree Melody]': checked,
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
                        dreamNail: { '[Dream Nail]': checked },
                        bosses: { '[False Knight]': checked },
                    },
                },
            },
            '[Grey Prince Zote]': {
                reward: { essence: 300 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        optionalBosses: { '[Zote]': checked },
                        equipment: { '[Monarch Wings]': checked },
                    },
                },
            },
            '[Lost Kin]': {
                reward: { essence: 400 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        bosses: { '[Broken Vessel]': checked },
                    },
                },
            },
            '[White Defender]': {
                reward: { essence: 300 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        bosses: { '[Dung Defender]': checked },
                    },
                },
            },
            '[Soul Tyrant]': {
                reward: { essence: 300 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        bosses: { '[Soul Master]': checked },
                    },
                },
            },
        },

        colosseum: {
            '[Trial of the Warrior]': {
                reward: { percent, geoReq: 100, geo: 1000 },
                requires: { geo: 100 },
            },
            '[Trial of the Conqueror]': {
                reward: { percent, geoReq: 450, geo: 2000 },
                requires: {
                    geo: 450,
                    checks: {
                        colosseum: { '[Trial of the Warrior]': checked },
                        optionalBosses: { '[Oblobbles]': checked },
                    },
                },
            },
            '[Trial of the Fool]': {
                reward: { percent, geoReq: 800, geo: 3000 },
                requires: {
                    geo: 800,
                    checks: {
                        colosseum: { '[Trial of the Conqueror]': checked },
                        optionalBosses: { '[God Tamer]': checked },
                    },
                },
            },
        },

        godhome: {
            '[Godtuner]': {
                reward: { percent, simpleKeysReq },
                requires: { simpleKeys },
            },
            '[Pantheon of the Master]': {
                reward: { percent },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        bosses: {
                            '[Gruz Mother]': checked,
                            '[False Knight]': checked,
                            '[Hornet Protector]': checked,
                            '[Dung Defender]': checked,
                            '[Brooding Mawlek]': checked,
                        },
                        dreamWarriors: { '[Gorb]': checked },
                        optionalBosses: {
                            '[Vengefly King]': checked,
                            '[Massive Moss Charger]': checked,
                            '[Soul Warrior]': checked,
                            '[Brothers Oro & Mato]': checked,
                        },
                    },
                },
            },
            '[Pantheon of the Artist]': {
                reward: { percent },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        bosses: {
                            '[Soul Master]': checked,
                            '[Mantis Lords]': checked,
                            '[Nosk]': checked,
                            '[Broken Vessel]': checked,
                        },
                        colosseum: { '[Trial of the Conqueror]': checked },
                        dreamWarriors: {
                            '[Xero]': checked,
                            '[Marmu]': checked,
                        },
                        optionalBosses: {
                            '[Crystal Guardian]': checked,
                            '[Oblobbles]': checked,
                            '[Flukemarm]': checked,
                            '[Paintmaster Sheo]': checked,
                        },
                    },
                },
            },
            '[Pantheon of the Sage]': {
                reward: { percent },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        bosses: {
                            '[Hive Knight]': checked,
                            '[The Collector]': checked,
                            '[Grimm]': checked,
                            '[Uumuu]': checked,
                            '[Hornet Sentinel]': checked,
                        },
                        dreamWarriors: {
                            '[Elder Hu]': checked,
                            '[Galien]': checked,
                        },
                        dreamBosses: {
                            /* TODO: make optional? // '[Grey Prince Zote]': checked, */
                        },
                        optionalBosses: { '[Great Nailsage Sly]': checked },
                    },
                },
            },
            '[Pantheon of the Knight]': {
                reward: { percent },
                requires: {
                    checks: {
                        godhome: {
                            '[Pantheon of the Master]': checked,
                            '[Pantheon of the Artist]': checked,
                            '[Pantheon of the Sage]': checked,
                        },
                        bosses: {
                            '[Traitor Lord]': checked,
                            '[Watcher Knight]': checked,
                        },
                        dreamWarriors: {
                            '[No Eyes]': checked,
                            '[Markoth]': checked,
                        },
                        optionalBosses: {
                            '[Enraged Guardian]': checked,
                            '[Pure Vessel]': checked,
                        },
                    },
                },
            },
            '[Pantheon of the Hallownest] (no percent)': {
                reward: nothing,
                requires: {
                    checks: {
                        godhome: { '[Pantheon of the Knight]': checked },
                        charms: { '[Kingsoul] / [Void Heart]': checked },
                        optionalBosses: {
                            '[Massive Moss Charger]': checked,
                            '[Soul Warrior]': checked,
                            '[Brothers Oro & Mato]': checked,
                            '[Crystal Guardian]': checked,
                            '[Oblobbles]': checked,
                            '[Sisters of Battle]': checked,
                            '[Flukemarm]': checked,
                            '[Paintmaster Sheo]': checked,
                            '[Winged Nosk]': checked,
                            '[Great Nailsage Sly]': checked,
                            '[Enraged Guardian]': checked,
                            '[Pure Vessel]': checked,
                        },
                        bosses: {
                            '[Gruz Mother]': checked,
                            '[Hornet Protector]': checked,
                            '[Dung Defender]': checked,
                            '[Brooding Mawlek]': checked,
                            '[Soul Master]': checked,
                            '[Broken Vessel]': checked,
                            '[Hive Knight]': checked,
                            '[The Collector]': checked,
                            '[Grimm]': checked,
                            '[Watcher Knight]': checked,
                            '[Uumuu]': checked,
                            '[Hornet Sentinel]': checked,
                            '[Traitor Lord]': checked,
                        },
                        dreamWarriors: {
                            '[Gorb]': checked,
                            '[Xero]': checked,
                            '[Marmu]': checked,
                            '[Galien]': checked,
                            '[Elder Hu]': checked,
                            '[No Eyes]': checked,
                            '[Markoth]': checked,
                        },
                        dreamBosses: {
                            /* TODO: make optional? // '[Grey Prince Zote]': checked, */
                        },
                    },
                },
            },
        },

        grubs: {
            '[Forgotten Crossroads] behind [Husk Guard]': { reward: grubs },
            '[Forgotten Crossroads] [Fog Canyon] entrance': {
                reward: grubs,
            },
            '[Forgotten Crossroads] breakable wall': { reward: grubs },
            '[Forgotten Crossroads] [Pogo](Nail#Nail-bouncing)': {
                reward: grubs,
            },
            '[Forgotten Crossroads] on a ledge': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Greenpath] with a moss block shortcut': { reward: grubs },
            '[Greenpath] near acid': { reward: grubs },
            '[Greenpath] behind [Moss Knight]': { reward: grubs },
            '[Greenpath] in the middle of a [Durandoo] room': {
                reward: grubs,
            },
            '[Fungal Wastes] behind a line of [Fungling]s': {
                reward: grubs,
            },
            '[Fungal Wastes] near [Spore Shroom]': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[City of Tears] on a ledge': { reward: grubs },
            '[City of Tears] behind [Great Husk Sentry]': { reward: grubs },
            '[City of Tears] in the [Desolate Dive] dive': {
                reward: grubs,
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[City of Tears] under the entrance to the [Tower of Love]': {
                reward: grubs,
            },
            '[City of Tears] room leading to [Watcher Knight]': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Crystal Peak] from [Dirtmouth]': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Crystal Heart]': checked,
                        },
                    },
                },
            },
            '[Crystal Peak] behind presses': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Mothwing Cloak]': checked,
                        },
                    },
                },
            },
            '[Crystal Peak] near [Crystal Heart]': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Crystal Heart]': checked,
                        },
                    },
                },
            },
            "[Crystal Peak] on the way to [Hallownest's Crown]": {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Crystal Peak] vertical conveyor belts lever': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Mothwing Cloak]': checked,
                        },
                    },
                },
            },
            '[Crystal Peak] from the top room with presses': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[Crystal Peak] in the [Crystallized Mound]': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Mothwing Cloak]': checked,
                        },
                        spells: { '[Desolate Dive]': checked },
                    },
                },
            },
            '[Resting Grounds] [Crypts](Resting Grounds#Crypts)': {
                reward: grubs,
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[Royal Waterways] behind a wall near water': { reward: grubs },
            "[Royal Waterways] from the [Kingdom's Edge]": {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Crystal Heart]': checked,
                            '[Monarch Wings]': checked,
                        },
                        items: { '[TRAM_PASS] [Tram Pass]': checked },
                    },
                },
            },
            "[Royal Waterways] above [Isma's Tear]": {
                reward: grubs,
                requires: {
                    checks: { equipment: { "[Isma's Tear]": checked } },
                },
            },
            '[Howling Cliffs]': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            "[Kingdom's Edge] under [Oro]'s hut": {
                reward: grubs,
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            "[Kingdom's Edge] behind a [Primal Aspid]": {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Fog Canyon]': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            "[Queen's Gardens] under the [Stag] station": { reward: grubs },
            "[Queen's Gardens] above the spiky roof": {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Mothwing Cloak]': checked,
                            '[Crystal Heart]': checked,
                        },
                    },
                },
            },
            "[Queen's Gardens] near [White Lady]": {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Deepnest] among [Grub Mimic]s': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Deepnest] above the spike pit': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Deepnest] on the way to [Nosk]': {
                reward: grubs,
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            "[Deepnest] near the [Weavers' Den]": {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Mothwing Cloak]': checked,
                        },
                    },
                },
            },
            "[Deepnest] in the [Beast's Den]": {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            '[Mothwing Cloak]': checked,
                        },
                    },
                },
            },
            '[Ancient Basin] above [Broken Vessel]': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Mothwing Cloak]': checked,
                            '[Monarch Wings]': checked,
                        },
                    },
                },
            },
            '[Ancient Basin] under [Cloth]': {
                reward: grubs,
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[The Hive] isolated room': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: { "[Isma's Tear]": checked },
                        spells: { '[Desolate Dive]': checked },
                        items: { '[TRAM_PASS] [Tram Pass]': checked },
                    },
                },
            },
            '[The Hive]': {
                reward: grubs,
                requires: {
                    checks: {
                        equipment: {
                            '[Crystal Heart]': checked,
                            '[Monarch Wings]': checked,
                        },
                        items: { '[TRAM_PASS] [Tram Pass]': checked },
                    },
                },
            },
            '[Tower of Love] #1': {
                reward: grubs,
                requires: {
                    checks: { bosses: { '[The Collector]': checked } },
                },
            },
            '[Tower of Love] #2': {
                reward: grubs,
                requires: {
                    checks: { bosses: { '[The Collector]': checked } },
                },
            },
            '[Tower of Love] #3': {
                reward: grubs,
                requires: {
                    checks: { bosses: { '[The Collector]': checked } },
                },
            },
        },

        items: {
            '[SIMPLE_KEY] [Simple Key] from [Sly]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 950.',
                reward: { simpleKeys, geoReq: 950 },
                requires: { geo: 950 },
            },
            '[SIMPLE_KEY] [Simple Key] near [City Storerooms]': {
                reward: { simpleKeys },
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            '[SIMPLE_KEY] [Simple Key] in the [Ancient Basin]': {
                description:
                    'In the [Mawlurk] area leading to [Broken Vessel].',
                reward: { simpleKeys },
                requires: {
                    checks: { equipment: { '[Crystal Heart]': checked } },
                },
            },
            '[SIMPLE_KEY] [Simple Key] behind [Pale Lurker]': {
                reward: { simpleKeys },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[ELEGANT_KEY] [Elegant Key]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 800.',
                reward: { geoReq: 800 },
                requires: {
                    geo: 800,
                    checks: {
                        items: {
                            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": checked,
                        },
                    },
                },
            },
            '[LOVE_KEY] [Love Key]': {
                reward: nothing,
                requires: {
                    checks: { equipment: { "[Isma's Tear]": checked } },
                },
            },
            "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]": {
                reward: nothing,
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[TRAM_PASS] [Tram Pass]': {
                reward: nothing,
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[Lumafly Lantern]': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 1800.',
                reward: { geoReq: 1800 },
                requires: { geo: 1800 },
            },
            '[Delicate Flower]': {
                reward: nothing,
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[PALE_ORE] [Pale Ore] in [Ancient Basin] below [Cloth]': {
                reward: { paleOre: 1 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[PALE_ORE] [Pale Ore] awarded by the [Seer]': {
                reward: { paleOre: 1, essenceReq: [300] },
                requires: {
                    essence: 300,
                    checks: {
                        relics: {
                            '[HALLOWNEST_SEAL] [Hallownest Seal] awarded by the [Seer]':
                                checked,
                        },
                    },
                },
            },
            "[PALE_ORE] [Pale Ore] on the [Hallownest's Crown]": {
                reward: { paleOre: 1 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[PALE_ORE] [Pale Ore] behind [Nosk]s lair': {
                reward: { paleOre: 1 },
                requires: { checks: { bosses: { '[Nosk]': checked } } },
            },
            '[PALE_ORE] [Pale Ore] awarded by [Grubfather]': {
                reward: { paleOre: 1 },
                requires: { grubs: 31 },
            },
            '[PALE_ORE] [Pale Ore] reward in [Trial of the Conqueror]': {
                reward: { paleOre: 1 },
                requires: {
                    checks: {
                        colosseum: { '[Trial of the Conqueror]': checked },
                    },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #1': {
                reward: nothing,
                requires: { charms: 5 },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #2': {
                reward: nothing,
                requires: { charms: 10 },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #3': {
                reward: nothing,
                requires: { charms: 18 },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Salubra] #4': {
                reward: nothing,
                requires: { charms: 25 },
            },
            '[CHARM_NOTCH] [Charm Notch] in [Fog Canyon]': {
                reward: nothing,
                requires: {
                    checks: { equipment: { "[Isma's Tear]": checked } },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] in [Fungal Wastes]': {
                reward: nothing,
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Colosseum of Fools]': {
                reward: nothing,
                requires: {
                    checks: {
                        colosseum: { '[Trial of the Warrior]': checked },
                    },
                },
            },
            '[CHARM_NOTCH] [Charm Notch] from [Grimm]': {
                reward: nothing,
                requires: { checks: { bosses: { '[Grimm]': checked } } },
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
                        checks: { equipment: { '[Mantis Claw]': checked } },
                    },
                },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [City Storerooms]": {
                reward: { geo: 200 },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] north of [King's Station]":
                { reward: { geo: 200 } },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Pleasure House]": {
                reward: { geo: 200, simpleKeysReq },
                requires: { simpleKeys },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Howling Cliffs]": {
                reward: { geo: 200 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Crystal Peak]": {
                reward: { geo: 200 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
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
                        checks: { equipment: { '[Mantis Claw]': checked } },
                    },
                },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] next to the [Cast-Off Shell] [Bench]":
                {
                    reward: { geo: 200 },
                    requires: {
                        checks: { equipment: { '[Mantis Claw]': checked } },
                    },
                },
            "[WANDERER'S_JOURNAL] [Wanderer's Journal] near [Markoth]": {
                reward: { geo: 200 },
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
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
                        checks: { equipment: { '[Mantis Claw]': checked } },
                    },
                },
            '[HALLOWNEST_SEAL] [Hallownest Seal] near [Thorns of Agony]': {
                reward: { geo: 450 },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            "[HALLOWNEST_SEAL] [Hallownest Seal] near [Queen's Station]": {
                reward: { geo: 450 },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Mantis Village]': {
                reward: { geo: 450 },
                requires: {
                    checks: { bosses: { '[Mantis Lords]': checked } },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] at the [Willoh]': {
                reward: { geo: 450 },
                requires: {
                    checks: { equipment: { '[Monarch Wings]': checked } },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] near [Overgrown Mound]': {
                reward: { geo: 450 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Forgotten Crossroads] in [Fog Canyon] entrance':
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: { equipment: { "[Isma's Tear]": checked } },
                    },
                },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Crypts](Resting Grounds#Crypts)':
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: { spells: { '[Desolate Dive]': checked } },
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
                        checks: { equipment: { '[Mantis Claw]': checked } },
                    },
                },
            '[HALLOWNEST_SEAL] [Hallownest Seal] near [Soul Master]': {
                reward: { geo: 450 },
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] behind [Watcher Knight]': {
                reward: { geo: 450 },
                requires: {
                    checks: { bosses: { '[Watcher Knight]': checked } },
                },
            },
            "[HALLOWNEST_SEAL] [Hallownest Seal] in [Beast's Den]": {
                reward: { geo: 450 },
                requires: {
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            '[HALLOWNEST_SEAL] [Hallownest Seal] in [Deepnest] near [Mantis Lords]':
                {
                    reward: { geo: 450 },
                    requires: {
                        checks: { equipment: { '[Mantis Claw]': checked } },
                    },
                },
            "[HALLOWNEST_SEAL] [Hallownest Seal] in [Queen's Gardens]": {
                reward: { geo: 450 },
                requires: {
                    checks: { equipment: { '[Monarch Wings]': checked } },
                },
            },
            "[KING'S_IDOL] [King's Idol] awarded by [Grubfather]": {
                reward: { geo: 800 },
                requires: { grubs: 38 },
            },
            "[KING'S_IDOL] [King's Idol] in [Crystal Peak]": {
                reward: { geo: 800 },
                requires: {
                    checks: { equipment: { '[Monarch Wings]': checked } },
                },
            },
            "[KING'S_IDOL] [King's Idol] in [Spirits' Glade]": {
                reward: { geo: 800, essenceReq: [200] },
                requires: {
                    essence: 200,
                    checks: { equipment: { '[Mothwing Cloak]': checked } },
                },
            },
            "[KING'S_IDOL] [King's Idol] in [Dung Defender]'s secret room": {
                reward: { geo: 800 },
                requires: {
                    checks: { spells: { '[Desolate Dive]': checked } },
                },
            },
            "[KING'S_IDOL] [King's Idol] in [Howling Cliffs]": {
                reward: { geo: 800 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            "[KING'S_IDOL] [King's Idol] under [Colosseum of Fools]": {
                reward: { geo: 800 },
                requires: {
                    checks: { equipment: { '[Mantis Claw]': checked } },
                },
            },
            "[KING'S_IDOL] [King's Idol] near [Pale Lurker]": {
                reward: { geo: 800 },
                requires: {
                    checks: {
                        equipment: {
                            '[Mantis Claw]': checked,
                            "[Isma's Tear]": checked,
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
                            "[King's Brand]": checked,
                            '[Crystal Heart]': checked,
                        },
                        charms: { "[Joni's Blessing]": checked },
                    },
                },
            },
            '[ARCANE_EGG] [Arcane Egg] near [Shade Cloak]': {
                reward: { geo: 1200 },
                requires: {
                    checks: { equipment: { '[Shade Cloak]': checked } },
                },
            },
            '[ARCANE_EGG] [Arcane Egg] in [Birthplace]': {
                reward: { geo: 1200 },
                requires: {
                    checks: {
                        charms: { '[Kingsoul] / [Void Heart]': checked },
                    },
                },
            },
            '[ARCANE_EGG] [Arcane Egg] awarded by the [Seer]': {
                reward: { geo: 1200, essenceReq: [1200] },
                requires: {
                    essence: 1200,
                    checks: { vesselFragments: { '[Seer]': checked } },
                },
            },
        },

        whisperingRoots: {
            '[Ancestral Mound]': {
                reward: { essence: 42 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        spells: { '[Vengeful Spirit]': checked },
                    },
                },
            },
            '[City of Tears]': {
                reward: { essence: 28 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Crystal Peak]': {
                reward: { essence: 21 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Deepnest]': {
                reward: { essence: 45 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Forgotten Crossroads]': {
                reward: { essence: 29 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Fungal Wastes] (near [Fog Canyon])': {
                reward: { essence: 20 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Fungal Wastes] (above [Mantis Village])': {
                reward: { essence: 18 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Greenpath]': {
                reward: { essence: 44 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[The Hive]': {
                reward: { essence: 20 },
                requires: {
                    checks: {
                        dreamNail: { '[Dream Nail]': checked },
                        items: { '[TRAM_PASS] [Tram Pass]': checked },
                    },
                },
            },
            '[Howling Cliffs]': {
                reward: { essence: 46 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            "[Kingdom's Edge]": {
                reward: { essence: 51 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            "[Queen's Gardens]": {
                reward: { essence: 29 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Resting Grounds]': {
                reward: { essence: 20 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            '[Royal Waterways]': {
                reward: { essence: 35 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
            "[Spirits' Glade]": {
                reward: { essence: 34 },
                requires: {
                    checks: { dreamNail: { '[Dream Nail]': checked } },
                },
            },
        },
    },
};

export default INITIAL_HOLLOW_KNIGHT_CHECKLIST_STATE;
