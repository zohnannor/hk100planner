import { PartialDeep } from 'type-fest';

import { ExactlyOne } from './util';

/** Name of the game, used to parameterize the checklist state. */
export type GameKey = 'hollow-knight' | 'silksong';

/** Represents a reward (updates to the state) a check can provide. */
export type CheckRewards<Game extends GameKey> = Partial<
    Omit<ChecklistState<Game>, 'checks'>
>;

/** Represents a single check in the checklist. */
export type Check<Game extends GameKey> = {
    /** Indicates whether the check is marked as completed. */
    checked?: boolean;
    /** An optional description of the check. */
    description?: string;
    /** A function that returns the reward for completing this check. */
    reward: CheckRewards<Game>;
    /** A function that returns the requirements for this check. */
    requires?: PartialDeep<ChecklistState<Game>>;
    // requires?:
    //     | PartialDeep<ChecklistState>
    //     | ((state: ChecklistState) => string | undefined);
};

/** Hollow Knight specific check keys */
type HollowKnightChecksKeys = {
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
    optionalBosses:
        | '[Absolute Radiance]'
        | '[Brothers Oro & Mato]'
        | '[Crystal Guardian]'
        | '[Enraged Guardian]'
        | '[Flukemarm]'
        | '[God Tamer]'
        | '[Great Nailsage Sly]'
        | '[Hollow Knight]'
        | '[Massive Moss Charger]'
        | '[Oblobbles]'
        | '[Paintmaster Sheo]'
        | '[Pure Vessel]'
        | '[Radiance]'
        | '[Sisters of Battle]'
        | '[Soul Warrior]'
        | '[Vengefly King]'
        | '[Winged Nosk]'
        | '[Zote]';
    equipment:
        | '[Crystal Heart]'
        | "[Isma's Tear]"
        | '[Mantis Claw]'
        | '[Monarch Wings]'
        | '[Mothwing Cloak]'
        | '[Shade Cloak]'
        | "[King's Brand]";
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
        | '[The Hive]'
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
        | '[Nightmare King Grimm] / [Banishment](Grimm Troupe (Quest))';
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
        | '[Pantheon of the Knight]'
        | '[Pantheon of the Hallownest] (no percent)';
    grubs:
        | '[Forgotten Crossroads] behind [Husk Guard]'
        | '[Forgotten Crossroads] [Fog Canyon] entrance'
        | '[Forgotten Crossroads] breakable wall'
        | '[Forgotten Crossroads] [Pogo](Nail#Nail-bouncing)'
        | '[Forgotten Crossroads] on a ledge'
        | '[Greenpath] with a moss block shortcut'
        | '[Greenpath] near acid'
        | '[Greenpath] behind [Moss Knight]'
        | '[Greenpath] in the middle of a [Durandoo] room'
        | '[Fungal Wastes] behind a line of [Fungling]s'
        | '[Fungal Wastes] near [Spore Shroom]'
        | '[City of Tears] on a ledge'
        | '[City of Tears] behind [Great Husk Sentry]'
        | '[City of Tears] in the [Desolate Dive] dive'
        | '[City of Tears] under the entrance to the [Tower of Love]'
        | '[City of Tears] room leading to [Watcher Knight]'
        | '[Crystal Peak] from [Dirtmouth]'
        | '[Crystal Peak] behind presses'
        | '[Crystal Peak] near [Crystal Heart]'
        | "[Crystal Peak] on the way to [Hallownest's Crown]"
        | '[Crystal Peak] vertical conveyor belts lever'
        | '[Crystal Peak] from the top room with presses'
        | '[Crystal Peak] in the [Crystallized Mound]'
        | '[Resting Grounds] [Crypts](Resting Grounds#Crypts)'
        | '[Royal Waterways] behind a wall near water'
        | "[Royal Waterways] from the [Kingdom's Edge]"
        | "[Royal Waterways] above [Isma's Tear]"
        | '[Howling Cliffs]'
        | "[Kingdom's Edge] under [Oro]'s hut"
        | "[Kingdom's Edge] behind a [Primal Aspid]"
        | '[Fog Canyon]'
        | "[Queen's Gardens] under the [Stag] station"
        | "[Queen's Gardens] above the spiky roof"
        | "[Queen's Gardens] near [White Lady]"
        | '[Deepnest] among [Grub Mimic]s'
        | '[Deepnest] above the spike pit'
        | '[Deepnest] on the way to [Nosk]'
        | "[Deepnest] near the [Weavers' Den]"
        | "[Deepnest] in the [Beast's Den]"
        | '[Ancient Basin] above [Broken Vessel]'
        | '[Ancient Basin] under [Cloth]'
        | '[The Hive] isolated room'
        | '[The Hive]'
        | '[Tower of Love] #1'
        | '[Tower of Love] #2'
        | '[Tower of Love] #3';
    items:
        | '[SIMPLE_KEY_(HOLLOW_KNIGHT)] [Simple Key] from [Sly]'
        | '[SIMPLE_KEY_(HOLLOW_KNIGHT)] [Simple Key] near [City Storerooms]'
        | '[SIMPLE_KEY_(HOLLOW_KNIGHT)] [Simple Key] in the [Ancient Basin]'
        | '[SIMPLE_KEY_(HOLLOW_KNIGHT)] [Simple Key] behind [Pale Lurker]'
        | '[ELEGANT_KEY] [Elegant Key]'
        | '[LOVE_KEY] [Love Key]'
        | "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]"
        | '[TRAM_PASS] [Tram Pass]'
        | '[Lumafly Lantern]'
        | '[Delicate Flower]'
        | '[PALE_ORE] [Pale Ore] in [Ancient Basin] below [Cloth]'
        | '[PALE_ORE] [Pale Ore] awarded by the [Seer]'
        | "[PALE_ORE] [Pale Ore] on the [Hallownest's Crown]"
        | '[PALE_ORE] [Pale Ore] behind [Nosk]s lair'
        | '[PALE_ORE] [Pale Ore] awarded by [Grubfather]'
        | '[PALE_ORE] [Pale Ore] reward in [Trial of the Conqueror]'
        | '[CHARM_NOTCH] [Charm Notch] from [Salubra] #1'
        | '[CHARM_NOTCH] [Charm Notch] from [Salubra] #2'
        | '[CHARM_NOTCH] [Charm Notch] from [Salubra] #3'
        | '[CHARM_NOTCH] [Charm Notch] from [Salubra] #4'
        | '[CHARM_NOTCH] [Charm Notch] in [Fog Canyon]'
        | '[CHARM_NOTCH] [Charm Notch] in [Fungal Wastes]'
        | '[CHARM_NOTCH] [Charm Notch] from [Colosseum of Fools]'
        | '[CHARM_NOTCH] [Charm Notch] from [Grimm]';
    relics:
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Greenpath] near a [Stag Station]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Greenpath] near [Fog Canyon] entrance"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Fungal Wastes] near [Shrumal Ogre]s"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] north of the [Mantis Village]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [City Storerooms]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] north of [King's Station]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Pleasure House]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Howling Cliffs]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Crystal Peak]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Crypts](Resting Grounds#Crypts)"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Royal Waterways]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] near [City of Tears] entrance"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] next to the [Cast-Off Shell] [Bench]"
        | "[WANDERER'S_JOURNAL] [Wanderer's Journal] near [Markoth]"
        | '[HALLOWNEST_SEAL] [Hallownest Seal] awarded by [Grubfather]'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] in the well to [Forgotten Crossroads]'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] near [Thorns of Agony]'
        | "[HALLOWNEST_SEAL] [Hallownest Seal] near [Queen's Station]"
        | '[HALLOWNEST_SEAL] [Hallownest Seal] in [Mantis Village]'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] at the [Willoh]'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] near [Overgrown Mound]'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] in [Forgotten Crossroads] in [Fog Canyon] entrance'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] in [Crypts](Resting Grounds#Crypts)'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] awarded by the [Seer]'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] near [Relic Seeker Lemm]'
        | "[HALLOWNEST_SEAL] [Hallownest Seal] above [King's Station] [Stag Station]"
        | '[HALLOWNEST_SEAL] [Hallownest Seal] near [Soul Master]'
        | '[HALLOWNEST_SEAL] [Hallownest Seal] behind [Watcher Knight]'
        | "[HALLOWNEST_SEAL] [Hallownest Seal] in [Beast's Den]"
        | '[HALLOWNEST_SEAL] [Hallownest Seal] in [Deepnest] near [Mantis Lords]'
        | "[HALLOWNEST_SEAL] [Hallownest Seal] in [Queen's Gardens]"
        | "[KING'S_IDOL] [King's Idol] awarded by [Grubfather]"
        | "[KING'S_IDOL] [King's Idol] in [Crystal Peak]"
        | "[KING'S_IDOL] [King's Idol] in [Spirits' Glade]"
        | "[KING'S_IDOL] [King's Idol] in [Dung Defender]'s secret room"
        | "[KING'S_IDOL] [King's Idol] in [Howling Cliffs]"
        | "[KING'S_IDOL] [King's Idol] under [Colosseum of Fools]"
        | "[KING'S_IDOL] [King's Idol] near [Pale Lurker]"
        | "[KING'S_IDOL] [King's Idol] in [Deepnest] near [Zote]"
        | '[ARCANE_EGG] [Arcane Egg] below [Lifeblood Core]'
        | '[ARCANE_EGG] [Arcane Egg] near [Shade Cloak]'
        | '[ARCANE_EGG] [Arcane Egg] in [Birthplace]'
        | '[ARCANE_EGG] [Arcane Egg] awarded by the [Seer]';
    whisperingRoots:
        | '[Ancestral Mound]'
        | '[City of Tears]'
        | '[Crystal Peak]'
        | '[Deepnest]'
        | '[Forgotten Crossroads]'
        | '[Fungal Wastes] (near [Fog Canyon])'
        | '[Fungal Wastes] (above [Mantis Village])'
        | '[Greenpath]'
        | '[The Hive]'
        | '[Howling Cliffs]'
        | "[Kingdom's Edge]"
        | "[Queen's Gardens]"
        | '[Resting Grounds]'
        | '[Royal Waterways]'
        | "[Spirits' Glade]";
    // endings:
    //     | '[The Hollow Knight](Endings (Hollow Knight)#Ending 1: The Hollow Knight)'
    //     | '[Sealed Siblings](Endings (Hollow Knight)#Ending 2: Sealed Siblings)'
    //     | '[Dream No More](Endings (Hollow Knight)#Ending 3: Dream No More)'
    //     | '[Embrace the Void](Endings (Hollow Knight)#Ending 4: Embrace the Void)'
    //     | 'Any ending';
};

/** Silksong specific check keys */
type SilksongChecksKeys = {
    bosses:
        | '[Moss Mother]'
        | '[Bell Beast]'
        | '[Fourth Chorus]'
        | '[Sister Splinter]'
        | '[Savage Beastfly]'
        | '[Widow]'
        | '[Last Judge] / [Phantom]'
        | '[Savage Beastfly 2](Savage Beastfly#Far_Fields)'
        | '[Cogwork Dancers]'
        | '[Trobbio]'
        | '[The Unravelled]'
        | '[First Sinner]'
        | '[Lace 2](Lace#The_Cradle)'
        | '[Grand Mother Silk]';
    melodies:
        | "[Conductor's Melody]"
        | "[Architect's Melody]"
        | "[Vaultkeeper's Melody]";
    silkHearts:
        | '[Bell Beast]'
        | '[Lace 2](Lace#The_Cradle)'
        | '[The Unravelled]';
    tools:
        | '[Shard Pendant]'
        | '[Compass]'
        | "[Druid's Eye] / [Druid's Eyes]"
        | '[Straight Pin]'
        | '[Warding Bell]'
        | '[Treefold Pin]'
        | '[Flea Brew]'
        | '[Sting Shard]'
        | '[Longpin]'
        | '[Pollip Pouch]'
        | '[Weavelight]'
        | "[Dead Bug's Purse] / [Shell Satchel]"
        | '[Plasmium Phial]'
        | '[Silkspeed Anklets]'
        | '[Pimpillo]'
        | '[Barbed Bracelet]'
        | '[Tacks]'
        | '[Flintslate]'
        | '[Silkshot]'
        | "[Delver's Drill]"
        | '[Injector Band]'
        | '[Cogwork Wheel]'
        | '[Scuttlebrace]'
        | '[Memory Crystal]'
        | '[Multibinder]'
        | '[Voltvessels]'
        | '[Wreath of Purity]'
        | '[Longclaw]'
        | '[Conchcutter]'
        | "[Thief's Mark]"
        | '[Throwing ring]'
        | '[Magnetite Brooch]'
        | '[Magma Bell]'
        | '[Claw Mirror]'
        | '[Spider Strings]'
        | '[Rosary Cannon]'
        | '[Wispfire Lantern]'
        | '[Magnetite Dice]'
        | '[Volt Filament]'
        | '[Weighted Belt]'
        | '[Egg of Flealia]'
        | '[Fractured Mask]'
        | '[Curveclaw] / [Curvesickle]'
        | '[Quick Sling]'
        | '[Cogfly]'
        | '[Reserve Bind]'
        | '[Pin Badge]'
        | '[Sawtooth Circlet]'
        | '[Spool Extender]'
        | "[Ascendant's Grip]"
        | '[Snitch Pick]';
    silkSkills:
        | '[Silkspear]'
        | '[Thread Storm]'
        | '[Cross Stitch]'
        | '[Sharpdart]'
        | '[Rune Rage]'
        | '[Pale Nails]';
    ancestralArts:
        | '[Swift Step]'
        | '[Cling Grip]'
        | '[Needolin]'
        | '[Clawline]'
        | '[Silk Soar]'
        | '[Needle Strike]'
        | '[Sylphsong]';
    crests:
        | '[Reaper Crest]'
        | '[Wanderer Crest]'
        | '[Beast Crest]'
        | '[Witch Crest]'
        | '[Architect Crest]'
        | '[Shaman Crest]';
    eva:
        | 'Evolved [Hunter Crest]'
        | '[Vesticrest] yellow slot'
        | '[Vesticrest] blue slot'
        | 'Further evolved [Hunter Crest]';
    maskShards:
        | '[Pebb] from [Bone Bottom] for [ROSARY] 300'
        | '[Wormways]'
        | '[Deep Docks] entrance'
        | '[Far Fields] [Seamstress]'
        | '[Shellwood]'
        | '[Weavenest Alta]'
        | '[Jubilana] from [Songclave] for [ROSARY] 750'
        | 'West [Cogwork Core]'
        | '[Whispering Vaults]'
        | '[Savage Beastfly] [Wish]'
        | '[Far Fields] rising lava escape sequence'
        | 'West [Mount Fay]'
        | '[Slab]'
        | '[Bilewater]'
        | '[Wisp Thicket]'
        | '[Blasted Steps]'
        | '[Mount Fay] [Brightvein]'
        | '[Fastest in Pharloom] [Wish]'
        | '[Dark Hearts] [Wish]'
        | '[The Hidden Hunter] [Wish]';
    needle:
        | '[Sharpened Needle](Needle#Upgrades)'
        | '[Shining Needle](Needle#Upgrades)'
        | '[Hivesteel Needle](Needle#Upgrades)'
        | '[Palesteel Needle](Needle#Upgrades)';
    spoolFragments:
        | '[Bone Bottom]'
        | '[Deep Docks] hot floor'
        | '[Weavenest Alta]'
        | '[Greymoor]'
        | '[Slab]'
        | '[Frey] from [Bellhart] for [ROSARY] 270'
        | '[Grand Gate]'
        | '[Underworks]'
        | 'From [Mooshka] at [Grand Gate]'
        | '[Whiteward]'
        | '[Cogwork Core]'
        | '[Underworks] near [The Cauldron]'
        | '[Balm for the Wounded] [Wish]'
        | '[Jubilana] from [Songclave] for [ROSARY] 500'
        | '[Deep Docks] behind [Simple Key]'
        | '[High Halls]'
        | '[Memorium]'
        | '[Spool Fragment Grindle]';
    toolPouch:
        | 'Tool Pouch Pin Challenge'
        | 'Tool Kit Crow Feathers'
        | 'Tool Kit Forge Daughter'
        | 'Tool Pouch Nuu'
        | "Tool Pouch Pilgrim's Rest"
        | 'Tool Pouch Mooshka'
        | 'Tool Kit Grindle'
        | 'Tool Kit Architect';
    items:
        | "[Drifter's Cloak]"
        | '[Faydown Cloak]'
        | '[White Key]'
        | '[Key of Apostate]'
        | '[MEMORY_LOCKET] [Memory Locket] for [Volatile Flintbeetles] [Wish]'
        | '[MEMORY_LOCKET] [Memory Locket] in [The Marrow]'
        | "[MEMORY_LOCKET] [Memory Locket] in [Hunter's March]"
        | '[MEMORY_LOCKET] [Memory Locket] in [Deep Docks] behind [Simple Key]'
        | '[MEMORY_LOCKET] [Memory Locket] from [Mort] in [Far Fields] for [ROSARY] 150'
        | '[MEMORY_LOCKET] [Memory Locket] in [Far Fields] near [Skarrsinger Karmelita]'
        | '[MEMORY_LOCKET] [Memory Locket] in [Greymoor] near [Bellway]'
        | '[MEMORY_LOCKET] [Memory Locket] in [Greymoor] inside [Halfway Home]'
        | '[MEMORY_LOCKET] [Memory Locket] from [Frey] in [Bellhart] for [ROSARY] 330'
        | "[MEMORY_LOCKET] [Memory Locket] in [Bellhart]'s ceiling"
        | '[MEMORY_LOCKET] [Memory Locket] in [Blasted Steps]'
        | '[MEMORY_LOCKET] [Memory Locket] in the [Sands of Karak]'
        | '[MEMORY_LOCKET] [Memory Locket] in [Wormways]'
        | '[MEMORY_LOCKET] [Memory Locket] in the [Underworks]'
        | '[MEMORY_LOCKET] [Memory Locket] at [Grand Bellway]'
        | '[MEMORY_LOCKET] [Memory Locket] in [Memorium]'
        | '[MEMORY_LOCKET] [Memory Locket] in [The Slab]'
        | '[MEMORY_LOCKET] [Memory Locket] in [Whispering Vaults]'
        | '[MEMORY_LOCKET] [Memory Locket] in [Bilewater] secret room'
        | '[MEMORY_LOCKET] [Memory Locket] in [Bilewater] near the bench shortcut';
    everbloom: '[Everbloom]';
    wishes:
        | '[My Missing Courier]'
        | '[Volatile Flintbeetles]'
        | '[The Wandering Merchant]'
        | '[Savage Beastfly](Wishes#Grand_Hunt_Wishes)'
        | '[Fine Pins]'
        | '[Balm for the Wounded]'
        | '[Building Up Songclave]'
        | '[Cloaks of the Choir]'
        | '[Strengthening Songclave]'
        | '[The Lost Merchant]'
        | '[Fastest in Pharloom]'
        | '[Dark Hearts]'
        | '[The Hidden Hunter]';
    fleas: never;
    relics: never;
};

/** Union type for all possible check keys */
type ChecksKeys<Game extends GameKey> = {
    'hollow-knight': HollowKnightChecksKeys;
    silksong: SilksongChecksKeys;
}[Game];

/** Names of the checks defined in ChecksKeys. */
export type CheckNames<
    Game extends GameKey,
    Section extends SectionNames<Game>
> = ChecksKeys<Game>[Section] & string;

/** Names of the sections of the checks defined in ChecksKeys. */
export type SectionNames<Game extends GameKey> = keyof ChecksKeys<Game> &
    string;

/**
 * Represents a section of checks for a specific category.
 *
 * @param Section - The section of checks to define.
 */
export type ChecksSection<
    Game extends GameKey,
    Section extends SectionNames<Game>
> = {
    [CheckName in CheckNames<Game, Section>]: Check<Game>;
};

/** Represents the entire checklist containing all sections of checks. */
export type Checks<Game extends GameKey> = {
    [Section in SectionNames<Game>]: ChecksSection<Game, Section>;
};

/** Base state properties common to both games. */
type CommonChecklistState<Game extends GameKey> = {
    /** The game discriminator. */
    game: Game;
    /** The percentage of completion for the checklist. */
    percent: number;
    /** The checks that make up the checklist. */
    checks: Checks<Game>;
    /** The amount of mask shards collected. */
    maskShards: number;
    /** The amount of simple keys collected. */
    simpleKeys: number;
    /** The required amount of simple keys. */
    simpleKeysReq: number;
};

/** Hollow Knight specific state properties. */
export type HollowKnightChecklistState =
    CommonChecklistState<'hollow-knight'> & {
        /** The amount of geo collected. */
        geo: number;
        /** The amount of essence collected. */
        essence: number;
        /** The amount of pale ore collected. */
        paleOre: number;
        /** The amount of charms collected. */
        charms: number;
        /** The amount of grubs freed. */
        grubs: number;
        /** The amount of vessel fragments collected. */
        vesselFragments: number;
        /** The required amount of geo. */
        geoReq: number;
        /** The required amount of essence (array to track history and compute max). */
        essenceReq: number[];
        /** The required amount of pale ore. */
        paleOreReq: number;
    };

/** Silksong specific state properties. */
export type SilksongChecklistState = CommonChecklistState<'silksong'> & {
    /** The amount of rosaries collected. */
    rosaries: number;
    /** The required amount of rosaries. */
    rosariesReq: number;
    /** The amount of Spool Fragments collected. */
    spoolFragments: number;
    /** The amount of Acts started. */
    acts: number;
    /** The amount of fleas found. */
    fleas: number;
    /** The amount of pail oil collected. */
    paleOil: number;
    /** The amount of memory lockets collected and used. */
    memoryLockets: number;
    /** The required amount of memory lockets. */
    memoryLocketsReq: number[];
    /** The required amount of pail oil. */
    paleOilReq: number;
};

/** Represents the state of the checklist, including progress and requirements. */
export type ChecklistState<Game extends GameKey> = {
    'hollow-knight': HollowKnightChecklistState;
    silksong: SilksongChecklistState;
}[Game];

/** Actions that can be performed on the checklist. */
export type Action<Game extends GameKey> = {
    /**
     * Toggles the checked state of a specific check.
     *
     * @param section - The section of the checklist.
     * @param name - The name of the check to toggle.
     */
    toggle: <S extends SectionNames<Game>>(
        section: S,
        name: CheckNames<Game, S>
    ) => void;

    /** Checks all items in the checklist or the specific section. */
    checkAll: (sectionName?: SectionNames<Game>) => void;

    /** Resets the checklist or the specific section to its initial state. */
    reset: (sectionName?: SectionNames<Game>) => void;

    /** Validates a specific check in the checklist. */
    validateCheck: (
        state: ChecklistState<Game>,
        check: Check<Game>
    ) => PartialDeep<ChecklistState<Game>> | undefined;

    /**
     * Validates the current state of the checklist against its requirements.
     *
     * @param state - The current state of the checklist.
     * @returns An object containing any errors found during validation.
     */
    validateChecks: (state: ChecklistState<Game>) => RequirementCheckErrors;

    /**
     * Sets the checklist state from a save file.
     *
     * @param savefile - The save file to set the checklist state from.
     */
    setFromSaveFile: (savefile: SaveFile) => void;
};

/** Represents any errors found during the validation of checklist requirements. */
export type RequirementCheckErrors = {
    [Game in GameKey]?: {
        [Section in SectionNames<Game>]?: {
            [CheckName in CheckNames<Game, Section>]?: PartialDeep<
                ChecklistState<Game> // | string
            >;
        };
    };
};

/** Represents a generic object with string keys and any type of values. */
export type AnyObject = Record<string, unknown>;

export type SaveFileData<Game extends GameKey> = {
    [Section in SectionNames<Game> | string]: Section extends SectionNames<Game>
        ? Map<CheckNames<Game, Section>, boolean>
        : Map<string, boolean>;
};

/** A save file serialized by webasm savefile parser. */
export type SaveFile = ExactlyOne<{
    'hollow-knight': SaveFileData<'hollow-knight'>;
    silksong: SaveFileData<'silksong'>;
}>;
