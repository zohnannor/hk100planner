import { PartialDeep } from 'type-fest';

/**
 * Represents a reward (updates to the state) a check can provide.
 */
export type CheckRewards = Partial<Omit<ChecklistState, 'checks'>>;

/**
 * Represents a single check in the checklist.
 */
export type Check = {
    /**
     * Indicates whether the check is marked as completed.
     */
    checked?: boolean;
    /**
     * An optional description of the check.
     */
    description?: string;
    /**
     * A function that returns the reward for completing this check.
     */
    reward: () => CheckRewards;
    /**
     * A function that returns the requirements for this check.
     */
    requires?: () => PartialDeep<ChecklistState>;
};

/**
 * Defines the keys for various checks in the checklist.
 */
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
    equipment:
        | '[Crystal Heart]'
        | "[Isma's Tear]"
        | '[Mantis Claw]'
        | '[Monarch Wings]'
        | '[Mothwing Cloak]'
        | '[Shade Cloak]'
        | "[King's Brand]"
        | '[Lumafly Lantern] (no percent)';
    nail:
        | '[Sharpened Nail](Nail#Upgrades)'
        | '[Channelled Nail](Nail#Upgrades)'
        | '[Coiled Nail](Nail#Upgrades)'
        | '[Pure Nail](Nail#Upgrades)';
    dreamNail: '[Dream Nail]' | '[Awoken Dream Nail]' | '[Ascension](Seer)';
    nailArts: '[Cyclone Slash]' | '[Dash Slash]' | '[Great Slash]';
    spells:
        | '[Desolate Dive]'
        | '[Descending Dark]'
        | '[Howling Wraiths]'
        | '[Abyss Shriek]'
        | '[Vengeful Spirit]'
        | '[Shade Soul]';
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
    maskShards:
        | '[Sly] #1'
        | '[Sly] #2'
        | '[Sly] #3'
        | '[Sly] #4'
        | '[Forgotten Crossroads] [Brooding Mawlek]'
        | '[Grubfather]'
        | '[Forgotten Crossroads] [Goams]'
        | "[Queen's Station]"
        | "[Bretta]'s house"
        | '[Stone Sanctuary]'
        | '[Royal Waterways]'
        | '[Deepnest] from [Fungal Core]'
        | '[Enraged Guardian]'
        | '[Hive]'
        | '[Seer]'
        | '[Grey Mourner]';
    vesselFragments:
        | '[Sly] #1'
        | '[Sly] #2'
        | '[Greenpath]'
        | 'Left of the lift in [Forgotten Crossroads]'
        | "Above [King's Station] near a lift"
        | '[Deepnest]'
        | '[Stag Nest]'
        | '[Seer]'
        | '[Ancient Basin] fountain';
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
        | '[Nightmare King Grimm] / [Banishment]';
    dreamBosses:
        | '[Failed Champion]'
        | '[Grey Prince Zote]'
        | '[Lost Kin]'
        | '[White Defender]'
        | '[Soul Tyrant]';
    colosseum:
        | '[Trial of the Warrior]'
        | '[Trial of the Conqueror]'
        | '[Trial of the Fool]';
    godhome:
        | '[Godtuner]'
        | '[Pantheon of the Master]'
        | '[Pantheon of the Artist]'
        | '[Pantheon of the Sage]'
        | '[Pantheon of the Knight]';
    grubs: never;
    relicsAndItems: never;
    whisperingRoots: never;
};

/**
 * Names of the sections of the checks defined in ChecksKeys.
 */
export type CheckSection = keyof ChecksKeys;

/**
 * Represents a section of checks for a specific category.
 *
 * @param Section - The section of checks to define.
 */
export type ChecksSection<Section extends CheckSection> = Record<
    ChecksKeys[Section],
    Check
>;

/**
 * Represents the entire checklist containing all sections of checks.
 */
export type Checks = {
    [Section in CheckSection]: ChecksSection<Section>;
};

/**
 * Represents the state of the checklist, including progress and requirements.
 */
export type ChecklistState = {
    /**
     * The percentage of completion for the checklist.
     */
    percent: number;
    /**
     * The amount of geo collected.
     */
    geo: number;
    /**
     * The amount of essence collected.
     */
    essence: number;
    /**
     * The amount of pale ore collected.
     */
    paleOre: number;
    /**
     * The required amount of geo.
     */
    geoReq: number;
    /**
     * The required amount of essence (array to track history and compute max).
     */
    essenceReq: [number];
    /**
     * The required amount of pale ore.
     */
    paleOreReq: number;
    /**
     * Indicates if a simple key is required to open the Royal Waterways.
     */
    simpleKeyRoyalWaterwaysReq: boolean;
    /**
     * Indicates if a simple key is required to open the Godseeker Cocoon.
     */
    simpleKeyGodseekerCocoonReq: boolean;
    /**
     * Indicates if an elegant key is required.
     */
    elegantKeyReq: boolean;
    /**
     * Indicates if a love key is required.
     */
    loveKeyReq: boolean;
    /**
     * Indicates if a shopkeeper's key is required.
     */
    shopkeepersKeyReq: boolean;
    /**
     * The checks that make up the checklist.
     */
    checks: Checks;
};

/**
 * Represents actions that can be performed on the checklist.
 */
export type Action = {
    /**
     * Toggles the checked state of a specific check.
     *
     * @param section - The section of the checklist.
     * @param name - The name of the check to toggle.
     */
    toggle: <S extends CheckSection>(
        section: S,
        name: keyof ChecksSection<S>
    ) => void;
    /**
     * Checks all items in the checklist or the specific section.
     */
    checkAll: (sectionName?: CheckSection) => void;
    /**
     * Resets the checklist or the specific section to its initial state.
     */
    reset: (sectionName?: CheckSection) => void;
    /**
     * Validates the current state of the checklist against its requirements.
     *
     * @param state - The current state of the checklist.
     * @returns An object containing any errors found during validation.
     */
    validateChecks: (state: ChecklistState) => RequirementCheckErrors;
};

/**
 * Represents any errors found during the validation of checklist requirements.
 */
export type RequirementCheckErrors = {
    [CheckName in keyof ChecksSection<
        keyof Checks
    >]?: PartialDeep<ChecklistState>;
};

/**
 * Represents a generic object with string keys and any type of values.
 */
export type AnyObject = { [key: string]: any };
