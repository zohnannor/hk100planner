import { merge as deepMerge } from 'object-deep-merge';
import { PartialDeep } from 'type-fest';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import partialDeepEqual, { Comparable } from './util/partialDeepEqual';

export type Check = {
    checked?: boolean;
    description?: string;
    reward: () => Partial<Omit<ChecklistState, 'checks'>>;
    requires?: () => PartialDeep<ChecklistState>;
};

export type ChecksKeys = {
    bosses:
        | '[Broken Vessel]'
        | '[Brooding Mawlek]'
        | '[The Collector]'
        | '[Dung Defender]'
        | '[False Knight]'
        | '[Grimm]'
        | '[Gruz Mother]'
        | '[Hive Knight]'
        | '[Hornet Protector]'
        | '[Hornet Sentinel]'
        | '[Mantis Lords]'
        | '[Nosk]'
        | '[Soul Master]'
        | '[Traitor Lord]'
        | '[Uumuu]'
        | '[Watcher Knight]';
    dreamNail: '[Dream Nail]' | '[Awoken Dream Nail]' | '[Ascension](Seer)';
    nail:
        | '[Sharpened Nail](Nail#Upgrades)'
        | '[Channelled Nail](Nail#Upgrades)'
        | '[Coiled Nail](Nail#Upgrades)'
        | '[Pure Nail](Nail#Upgrades)';
    nailArts: '[Cyclone Slash]' | '[Dash Slash]' | '[Great Slash]';
    charms:
        | '[Wayward Compass]'
        | '[Gathering Swarm]'
        | '[Stalwart Shell]'
        | '[Soul Catcher]'
        | '[Shaman Stone]'
        | '[Soul Eater]'
        | '[Dashmaster]'
        | '[Sprintmaster]'
        | '[Grubsong]'
        | "[Grubberfly's Elegy]"
        | '[Fragile Heart] / [Unbreakable Heart]'
        | '[Fragile Greed] / [Unbreakable Greed]'
        | '[Fragile Strength] / [Unbreakable Strength]'
        | '[Spell Twister]'
        | '[Steady Body]'
        | '[Heavy Blow]'
        | '[Quick Slash]'
        | '[Longnail]'
        | '[Mark of Pride]'
        | '[Fury of the Fallen]'
        | '[Thorns of Agony]'
        | '[Baldur Shell]'
        | '[Flukenest]'
        | "[Defender's Crest]"
        | '[Glowing Womb]'
        | '[Quick Focus]'
        | '[Deep Focus]'
        | '[Lifeblood Heart]'
        | '[Lifeblood Core]'
        | "[Joni's Blessing]"
        | '[Hiveblood]'
        | '[Spore Shroom]'
        | '[Sharp Shadow]'
        | '[Shape of Unn]'
        | "[Nailmaster's Glory]"
        | '[Weaversong]'
        | '[Dream Wielder]'
        | '[Dreamshield]'
        | '[Grimmchild] / [Carefree Melody]'
        | '[Kingsoul] / [Void Heart]';
    equipment:
        | '[Crystal Heart]'
        | "[Isma's Tear]"
        | '[Mantis Claw]'
        | '[Monarch Wings]'
        | '[Mothwing Cloak]'
        | '[Shade Cloak]'
        | "[King's Brand]";
    spells:
        | '[Desolate Dive]'
        | '[Descending Dark]'
        | '[Howling Wraiths]'
        | '[Abyss Shriek]'
        | '[Vengeful Spirit]'
        | '[Shade Soul]';
    maskShards:
        | 'Sly #1'
        | 'Sly #2'
        | 'Sly #3'
        | 'Sly #4'
        | '[Forgotten Crossroads]'
        | '[Grubfather]'
        | '[Goams]'
        | "[Queen's Station]"
        | '[Bretta]'
        | '[Stone Sanctuary]'
        | '[Royal Waterways]'
        | '[Deepnest] from [Fungal Core]'
        | '[Enraged Guardian]'
        | '[Hive]'
        | '[Seer]'
        | '[Grey Mourner]';
    vesselFragment:
        | 'Sly #1'
        | 'Sly #2'
        | '[Greenpath]'
        | 'Left of the lift in [Forgotten Crossroads]'
        | "Above [King's Station] near a lift"
        | '[Deepnest]'
        | '[Stag Nest]'
        | '[Seer]'
        | 'Ancient Basin fountain';
    colosseum:
        | '[Trial of the Warrior]'
        | '[Trial of the Conqueror]'
        | '[Trial of the Fool]';
    dreamers:
        | '[Herra the Beast]'
        | '[Lurien the Watcher]'
        | '[Monomon the Teacher]';
    dreamWarriors:
        | '[Elder Hu]'
        | '[Galien]'
        | '[Gorb]'
        | '[Markoth]'
        | '[Marmu]'
        | '[No Eyes]'
        | '[Xero]'
        | '[Nightmare King Grimm]';
    dreamBosses:
        | '[Failed Champion]'
        | '[Grey Prince Zote]'
        | '[Lost Kin]'
        | '[White Defender]'
        | '[Soul Tyrant]';
    godhome:
        | '[Godtuner]'
        | '[Pantheon of the Master]'
        | '[Pantheon of the Artist]'
        | '[Pantheon of the Sage]'
        | '[Pantheon of the Knight]';
};

export type ChecksSection<Section extends keyof ChecksKeys> = Record<
    ChecksKeys[Section],
    Check
>;

export type Checks = {
    [Section in keyof ChecksKeys]: ChecksSection<Section>;
};

export type ChecklistState = {
    percent: number;

    geo: number;
    essence: number;
    paleOre: number;
    simpleKeys: 0 | 1 | 2 | 3 | 4;

    geoReq: number;
    essenceReq: number;
    paleOreReq: number;
    simpleKeysReq: 0 | 1 | 2 | 3 | 4;
    elegantKeyReq: boolean;
    loveKeyReq: boolean;
    shopkeepersKeyReq: boolean;

    checks: Checks;
};

export type Action = {
    toggle: <S extends keyof Checks>(
        section: S,
        name: keyof ChecksSection<S>
    ) => void;
    checkAll: () => void;
    reset: () => void;
    validateChecks: (state: ChecklistState) => RequirementCheckErrors;
};

export const INITIAL_CHECKLIST_STATE: ChecklistState = {
    percent: 0,

    geo: 0,
    essence: 0,
    paleOre: 0,
    simpleKeys: 0,

    geoReq: 0,
    essenceReq: 0,
    paleOreReq: 0,
    simpleKeysReq: 0,
    elegantKeyReq: false,
    loveKeyReq: false,
    shopkeepersKeyReq: false,

    checks: {
        bosses: {
            '[Broken Vessel]': {
                reward: () => ({ percent: 1 }),
            },
            '[Brooding Mawlek]': { reward: () => ({ percent: 1 }) },
            '[The Collector]': { reward: () => ({ percent: 1 }) },
            '[Dung Defender]': { reward: () => ({ percent: 1 }) },
            '[False Knight]': { reward: () => ({ percent: 1, geo: 200 }) },
            '[Grimm]': { reward: () => ({ percent: 1 }) },
            '[Gruz Mother]': { reward: () => ({ percent: 1 }) },
            '[Hive Knight]': { reward: () => ({ percent: 1 }) },
            '[Hornet Protector]': { reward: () => ({ percent: 1 }) },
            '[Hornet Sentinel]': { reward: () => ({ percent: 1 }) },
            '[Mantis Lords]': { reward: () => ({ percent: 1 }) },
            '[Nosk]': { reward: () => ({ percent: 1 }) },
            '[Soul Master]': { reward: () => ({ percent: 1 }) },
            '[Traitor Lord]': { reward: () => ({ percent: 1 }) },
            '[Uumuu]': { reward: () => ({ percent: 1 }) },
            '[Watcher Knight]': { reward: () => ({ percent: 1 }) },
        },

        dreamNail: {
            '[Dream Nail]': { reward: () => ({ percent: 1 }) },
            '[Awoken Dream Nail]': { reward: () => ({ percent: 1 }) },
            '[Ascension](Seer)': { reward: () => ({ percent: 1 }) },
        },

        nail: {
            '[Sharpened Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1, geoReq: 250 }),
                requires: () => ({ geo: 250 }),
            },
            '[Channelled Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1 }),
            },
            '[Coiled Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1 }),
            },
            '[Pure Nail](Nail#Upgrades)': {
                reward: () => ({ percent: 1 }),
            },
        },

        nailArts: {
            '[Cyclone Slash]': { reward: () => ({ percent: 1 }) },
            '[Dash Slash]': { reward: () => ({ percent: 1 }) },
            '[Great Slash]': { reward: () => ({ percent: 1 }) },
        },

        charms: {
            '[Wayward Compass]': { reward: () => ({ percent: 1 }) },
            '[Gathering Swarm]': { reward: () => ({ percent: 1 }) },
            '[Stalwart Shell]': { reward: () => ({ percent: 1 }) },
            '[Soul Catcher]': { reward: () => ({ percent: 1 }) },
            '[Shaman Stone]': { reward: () => ({ percent: 1 }) },
            '[Soul Eater]': { reward: () => ({ percent: 1 }) },
            '[Dashmaster]': { reward: () => ({ percent: 1 }) },
            '[Sprintmaster]': { reward: () => ({ percent: 1 }) },
            '[Grubsong]': { reward: () => ({ percent: 1 }) },
            "[Grubberfly's Elegy]": { reward: () => ({ percent: 1 }) },
            '[Fragile Heart] / [Unbreakable Heart]': {
                reward: () => ({ percent: 1 }),
            },
            '[Fragile Greed] / [Unbreakable Greed]': {
                reward: () => ({ percent: 1 }),
            },
            '[Fragile Strength] / [Unbreakable Strength]': {
                reward: () => ({ percent: 1 }),
            },
            '[Spell Twister]': { reward: () => ({ percent: 1 }) },
            '[Steady Body]': { reward: () => ({ percent: 1 }) },
            '[Heavy Blow]': { reward: () => ({ percent: 1 }) },
            '[Quick Slash]': { reward: () => ({ percent: 1 }) },
            '[Longnail]': { reward: () => ({ percent: 1 }) },
            '[Mark of Pride]': { reward: () => ({ percent: 1 }) },
            '[Fury of the Fallen]': { reward: () => ({ percent: 1 }) },
            '[Thorns of Agony]': { reward: () => ({ percent: 1 }) },
            '[Baldur Shell]': { reward: () => ({ percent: 1 }) },
            '[Flukenest]': { reward: () => ({ percent: 1 }) },
            "[Defender's Crest]": { reward: () => ({ percent: 1 }) },
            '[Glowing Womb]': { reward: () => ({ percent: 1 }) },
            '[Quick Focus]': { reward: () => ({ percent: 1 }) },
            '[Deep Focus]': { reward: () => ({ percent: 1 }) },
            '[Lifeblood Heart]': { reward: () => ({ percent: 1 }) },
            '[Lifeblood Core]': { reward: () => ({ percent: 1 }) },
            "[Joni's Blessing]": { reward: () => ({ percent: 1 }) },
            '[Hiveblood]': { reward: () => ({ percent: 1 }) },
            '[Spore Shroom]': { reward: () => ({ percent: 1 }) },
            '[Sharp Shadow]': { reward: () => ({ percent: 1 }) },
            '[Shape of Unn]': { reward: () => ({ percent: 1 }) },
            "[Nailmaster's Glory]": { reward: () => ({ percent: 1 }) },
            '[Weaversong]': { reward: () => ({ percent: 1 }) },
            '[Dream Wielder]': { reward: () => ({ percent: 1 }) },
            '[Dreamshield]': { reward: () => ({ percent: 1 }) },
            '[Grimmchild] / [Carefree Melody]': {
                reward: () => ({ percent: 1 }),
            },
            '[Kingsoul] / [Void Heart]': { reward: () => ({ percent: 1 }) },
        },

        equipment: {
            '[Crystal Heart]': { reward: () => ({ percent: 2 }) },
            "[Isma's Tear]": { reward: () => ({ percent: 2 }) },
            '[Mantis Claw]': { reward: () => ({ percent: 2 }) },
            '[Monarch Wings]': {
                reward: () => ({ percent: 2 }),
                requires: () => ({
                    checks: {
                        bosses: { '[Broken Vessel]': { checked: true } },
                    },
                }),
            },
            '[Mothwing Cloak]': { reward: () => ({ percent: 2 }) },
            '[Shade Cloak]': { reward: () => ({ percent: 2 }) },
            "[King's Brand]": { reward: () => ({ percent: 2 }) },
        },

        spells: {
            '[Desolate Dive]': { reward: () => ({ percent: 1 }) },
            '[Descending Dark]': { reward: () => ({ percent: 1 }) },
            '[Howling Wraiths]': { reward: () => ({ percent: 1 }) },
            '[Abyss Shriek]': { reward: () => ({ percent: 1 }) },
            '[Vengeful Spirit]': { reward: () => ({ percent: 1 }) },
            '[Shade Soul]': { reward: () => ({ percent: 1 }) },
        },

        maskShards: {
            'Sly #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 150',
                reward: () => ({ percent: 1 / 4 }),
            },
            'Sly #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 500',
                reward: () => ({ percent: 1 / 4 }),
            },
            'Sly #3': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 800',
                reward: () => ({ percent: 1 / 4 }),
            },
            'Sly #4': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 1500',
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Forgotten Crossroads]': {
                description: 'Reward for defeating [Brooding Mawlek]',
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Grubfather]': {
                description: 'Requires rescuing 5 [Grubs]',
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Goams]': {
                description:
                    'Behind a gauntlet of [Goams] in [Forgotten Crossroads]',
                reward: () => ({ percent: 1 / 4 }),
            },
            "[Queen's Station]": { reward: () => ({ percent: 1 / 4 }) },
            '[Bretta]': { reward: () => ({ percent: 1 / 4 }) },
            '[Stone Sanctuary]': { reward: () => ({ percent: 1 / 4 }) },
            '[Royal Waterways]': { reward: () => ({ percent: 1 / 4 }) },
            '[Deepnest] from [Fungal Core]': {
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Enraged Guardian]': { reward: () => ({ percent: 1 / 4 }) },
            '[Hive]': { reward: () => ({ percent: 1 / 4 }) },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 1500',
                reward: () => ({ percent: 1 / 4 }),
            },
            '[Grey Mourner]': { reward: () => ({ percent: 1 / 4 }) },
        },

        vesselFragment: {
            'Sly #1': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 550',
                reward: () => ({ percent: 1 / 3 }),
            },
            'Sly #2': {
                description: 'Bought from [Sly] in [Dirtmouth] for [GEO] 900',
                reward: () => ({ percent: 1 / 3 }),
            },
            '[Greenpath]': {
                description: "Near the inaccessible [Queen's Gardens] entrance",
                reward: () => ({ percent: 1 / 3 }),
            },
            'Left of the lift in [Forgotten Crossroads]': {
                reward: () => ({ percent: 1 / 3 }),
            },
            "Above [King's Station] near a lift": {
                reward: () => ({ percent: 1 / 3 }),
            },
            '[Deepnest]': {
                description: 'Above the working [Tram]',
                reward: () => ({ percent: 1 / 3 }),
            },
            '[Stag Nest]': { reward: () => ({ percent: 1 / 3 }) },
            '[Seer]': {
                description: 'For collecting [ESSENCE] 700',
                reward: () => ({ percent: 1 / 3 }),
            },
            'Ancient Basin fountain': {
                description: 'For dropping [GEO] 3000 into the fountain',
                reward: () => ({ percent: 1 / 3 }),
            },
        },

        colosseum: {
            '[Trial of the Warrior]': { reward: () => ({ percent: 1 }) },
            '[Trial of the Conqueror]': { reward: () => ({ percent: 1 }) },
            '[Trial of the Fool]': { reward: () => ({ percent: 1 }) },
        },

        dreamers: {
            '[Herra the Beast]': { reward: () => ({ percent: 1 }) },
            '[Lurien the Watcher]': { reward: () => ({ percent: 1 }) },
            '[Monomon the Teacher]': { reward: () => ({ percent: 1 }) },
        },

        dreamWarriors: {
            '[Elder Hu]': { reward: () => ({ percent: 1 }) },
            '[Galien]': { reward: () => ({ percent: 1 }) },
            '[Gorb]': { reward: () => ({ percent: 1 }) },
            '[Markoth]': { reward: () => ({ percent: 1 }) },
            '[Marmu]': { reward: () => ({ percent: 1 }) },
            '[No Eyes]': { reward: () => ({ percent: 1 }) },
            '[Xero]': { reward: () => ({ percent: 1 }) },
            '[Nightmare King Grimm]': { reward: () => ({ percent: 1 }) },
        },

        dreamBosses: {
            '[Failed Champion]': { reward: () => ({}) },
            '[Grey Prince Zote]': { reward: () => ({}) },
            '[Lost Kin]': { reward: () => ({}) },
            '[White Defender]': { reward: () => ({}) },
            '[Soul Tyrant]': { reward: () => ({}) },
        },

        godhome: {
            '[Godtuner]': { reward: () => ({ percent: 1 }) },
            '[Pantheon of the Master]': { reward: () => ({ percent: 1 }) },
            '[Pantheon of the Artist]': { reward: () => ({ percent: 1 }) },
            '[Pantheon of the Sage]': { reward: () => ({ percent: 1 }) },
            '[Pantheon of the Knight]': { reward: () => ({ percent: 1 }) },
        },
    },
};

const ALL_CHECKED_CHECKLIST_STATE: PartialDeep<ChecklistState> = {
    percent: 112,

    // geo: 0,
    // essence: 0,
    // paleOre: 0,

    // geoReq: 0,
    // essenceReq: 0,
    // paleOreReq: 0,

    checks: Object.fromEntries(
        Object.keys(INITIAL_CHECKLIST_STATE.checks).map(section => [
            section,
            Object.fromEntries(
                Object.keys(
                    INITIAL_CHECKLIST_STATE.checks[section as keyof Checks]
                ).map(name => [name, { checked: true }])
            ),
        ])
    ),
};

type Update = { [key: string]: any };

const updateState = (
    state: Update,
    updates: PartialDeep<Update>,
    operation: 'add' | 'sub'
) => {
    Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (typeof value === 'number') {
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

export type RequirementCheckErrors = {
    [CheckName in keyof ChecksSection<
        keyof Checks
    >]?: PartialDeep<ChecklistState>;
};

const validateChecks = (state: ChecklistState) => {
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
                    const typedCheckName = checkName as keyof ChecksSection<
                        keyof Checks
                    >;
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

const useChecklistStore = create<ChecklistState & Action>()(
    persist(
        temporal(
            immer((set, get) => ({
                ...INITIAL_CHECKLIST_STATE,

                reset: () => set(INITIAL_CHECKLIST_STATE),

                checkAll: () =>
                    set(deepMerge(get(), ALL_CHECKED_CHECKLIST_STATE)),

                toggle: <S extends keyof Checks>(
                    section: S,
                    name: keyof ChecksSection<S>
                ) => {
                    set(state => {
                        // Update state after a check/uncheck

                        const check = (
                            state.checks[section] as ChecksSection<S>
                        )[name] as Check; // ???????????
                        if (check) {
                            const willCheck = !check.checked;
                            check.checked = willCheck;

                            const reward = check.reward?.();

                            if (reward) {
                                if (willCheck) {
                                    updateState(state, reward, 'add');
                                } else {
                                    updateState(state, reward, 'sub');
                                }
                            }
                        }
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
