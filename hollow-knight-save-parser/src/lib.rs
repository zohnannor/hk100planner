#[cfg(not(target_arch = "wasm32"))]
use std::str::FromStr;

use aes::{
    Aes256,
    cipher::{BlockDecryptMut, KeyInit, block_padding::Pkcs7},
};
use base64::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::{JsValue, prelude::*};

const KEY: &[u8; 32] = b"UKu52ePUBwetZ9wNX88o54dnfKRu0T1l";
const CSHARP_HEADER: [u8; 22] = [
    0x00, 0x01, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x06, 0x01, 0x00, 0x00, 0x00,
];

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub struct Parser {
    map: GameSer,
}

#[cfg(not(target_arch = "wasm32"))]
type Error = String;

#[cfg(target_arch = "wasm32")]
type Error = JsValue;

#[cfg(not(target_arch = "wasm32"))]
type Map = GameSer;

#[cfg(target_arch = "wasm32")]
type Map = JsValue;

#[cfg(not(target_arch = "wasm32"))]
fn error(msg: &str) -> Error {
    let Ok(msg) = Error::from_str(msg);
    msg
}

#[cfg(target_arch = "wasm32")]
fn error(msg: &str) -> Error {
    Error::from_str(msg)
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
impl Parser {
    #[allow(clippy::new_without_default)]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(constructor))]
    #[must_use]
    pub fn new() -> Self {
        Self {
            map: GameSer::HollowKnight(HollowKnightChecks::default()),
        }
    }

    #[allow(clippy::too_many_lines, clippy::missing_errors_doc)]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
    pub fn parse_save_file(&mut self, data: &[u8]) -> Result<(), Error> {
        // Remove C# header and last useless byte 0x11
        let dat = &data[CSHARP_HEADER.len()..data.len() - 1];
        // Remove length header
        let length = dat.iter().take_while(|&x| !x.is_ascii()).count();
        let dat = &dat[length + 1..];

        let dat = BASE64_STANDARD
            .decode(dat)
            .map_err(|e| error(&format!("Base64 decode error: {e}")))?;

        // Decrypt
        let v = ecb::Decryptor::<Aes256>::new(KEY.into())
            .decrypt_padded_vec_mut::<Pkcs7>(&dat)
            .map_err(|e| error(&format!("Decryption error: {e}")))?;

        #[cfg(not(target_arch = "wasm32"))]
        {
            use std::fs;

            let val: serde_json::Value =
                serde_json::from_slice(&v).map_err(|e| error(&format!("JSON parse error: {e}")))?;
            let mut file = fs::File::options()
                .write(true)
                .create(true)
                .truncate(true)
                .open("save.json")
                .map_err(|e| error(&format!("File open/create error: {e}")))?;
            serde_json::to_writer_pretty(&mut file, &val)
                .map_err(|e| error(&format!("JSON write error: {e}")))?;
        }

        // Parse JSON
        let data: GameDeser =
            serde_json::from_slice(&v).map_err(|e| error(&format!("JSON parse error: {e}")))?;

        let to_map =
            |entries: &[(&str, bool)]| entries.iter().map(|&(k, v)| (k.to_owned(), v)).collect();

        if let GameDeser::HollowKnight(data) = data {
            let pd = &data.player_data;

            let scene_activated = |name, id| {
                data.scene_data
                    .persistent_bool_items
                    .iter()
                    .find(|x| x.scene_name == name && x.id == id)
                    .is_some_and(|x| x.activated)
            };

            let mask_shard_collected = |name| scene_activated(name, "Heart Piece");
            let vessel_frag_collected = |name| scene_activated(name, "Vessel Fragment");
            let grub_freed = |name| scene_activated(name, "Grub Bottle");
            let whispering_root = |name| scene_activated(name, "Dream Plant");

            let bosses = to_map(&[
                ("[Broken Vessel]", pd.killed_infected_knight),
                ("[Brooding Mawlek]", pd.killed_mawlek),
                ("[The Collector]", pd.killed_jar_collector),
                ("[Dung Defender]", pd.defeated_dung_defender),
                ("[False Knight]", pd.false_knight_defeated),
                ("[Grimm]", pd.killed_grimm),
                ("[Gruz Mother]", pd.killed_big_fly),
                ("[Hive Knight]", pd.killed_hive_knight),
                ("[Hornet Protector]", pd.hornet1_defeated),
                ("[Hornet Sentinel]", pd.hornet_outskirts_defeated),
                ("[Mantis Lords]", pd.defeated_mantis_lords),
                ("[Nosk]", pd.killed_mimic_spider),
                ("[Soul Master]", pd.mage_lord_defeated),
                ("[Traitor Lord]", pd.killed_traitor_lord),
                ("[Uumuu]", pd.defeated_mega_jelly),
                ("[Watcher Knight]", pd.killed_black_knight),
            ]);

            let optional_bosses = to_map(&[
                ("[Absolute Radiance]", pd.boss_door_state_tier5.completed),
                ("[Brothers Oro & Mato]", pd.killed_nail_bros),
                ("[Crystal Guardian]", pd.killed_mega_beam_miner),
                (
                    "[Enraged Guardian]",
                    scene_activated("Mines_32", "Zombie Beam Miner Rematch"),
                ),
                ("[Flukemarm]", pd.killed_flukeman),
                ("[God Tamer]", pd.killed_lobster_lancer),
                ("[Great Nailsage Sly]", pd.killed_nailsage),
                ("[Hollow Knight]", pd.killed_hollow_knight),
                ("[Massive Moss Charger]", pd.killed_mega_moss_charger),
                ("[Oblobbles]", pd.killed_oblobble),
                ("[Paintmaster Sheo]", pd.killed_paintmaster),
                ("[Pure Vessel]", pd.killed_hollow_knight_prime),
                ("[Radiance]", pd.killed_final_boss),
                ("[Sisters of Battle]", pd.boss_door_state_tier5.completed),
                ("[Soul Warrior]", pd.killed_mage_knight),
                ("[Vengefly King]", pd.killed_big_buzzer),
                ("[Winged Nosk]", pd.boss_door_state_tier5.completed),
                ("[Zote]", pd.colosseum_bronze_completed),
            ]);

            let equipment = to_map(&[
                ("[Crystal Heart]", pd.has_super_dash),
                ("[Isma's Tear]", pd.has_acid_armour),
                ("[Mantis Claw]", pd.has_walljump),
                ("[Monarch Wings]", pd.has_double_jump),
                ("[Mothwing Cloak]", pd.has_dash),
                ("[Shade Cloak]", pd.has_shadow_dash),
                ("[King's Brand]", pd.has_kings_brand),
            ]);

            let nail = to_map(&[
                (
                    "[Sharpened Nail](Nail#Upgrades)",
                    pd.nail_smith_upgrades > 0.0,
                ),
                (
                    "[Channelled Nail](Nail#Upgrades)",
                    pd.nail_smith_upgrades > 1.0,
                ),
                ("[Coiled Nail](Nail#Upgrades)", pd.nail_smith_upgrades > 2.0),
                ("[Pure Nail](Nail#Upgrades)", pd.nail_smith_upgrades > 3.0),
            ]);

            let dream_nail = to_map(&[
                ("[Dream Nail]", pd.has_dream_nail),
                (
                    "[Awoken Dream Nail]",
                    pd.dream_nail_upgraded && pd.has_dream_gate,
                ),
                ("[Ascension](Seer)", pd.moth_departed),
            ]);

            let nail_arts = to_map(&[
                ("[Cyclone Slash]", pd.has_cyclone),
                ("[Dash Slash]", pd.has_upward_slash), // lol team cherry
                ("[Great Slash]", pd.has_dash_slash),  // lol team cherry
            ]);

            let spells = to_map(&[
                ("[Desolate Dive]", pd.quake_level > 0.0),
                ("[Descending Dark]", pd.quake_level > 1.0),
                ("[Howling Wraiths]", pd.scream_level > 0.0),
                ("[Abyss Shriek]", pd.scream_level > 1.0),
                ("[Vengeful Spirit]", pd.fireball_level > 0.0),
                ("[Shade Soul]", pd.fireball_level > 1.0),
            ]);

            let charms = to_map(&[
                ("[Wayward Compass]", pd.got_charm_2),
                ("[Gathering Swarm]", pd.got_charm_1),
                ("[Stalwart Shell]", pd.got_charm_4),
                ("[Soul Catcher]", pd.got_charm_20),
                ("[Shaman Stone]", pd.got_charm_19),
                ("[Soul Eater]", pd.got_charm_21),
                ("[Dashmaster]", pd.got_charm_31),
                ("[Sprintmaster]", pd.got_charm_37),
                ("[Grubsong]", pd.got_charm_3),
                ("[Grubberfly's Elegy]", pd.got_charm_35),
                ("[Fragile Heart] / [Unbreakable Heart]", pd.got_charm_23),
                ("[Fragile Greed] / [Unbreakable Greed]", pd.got_charm_24),
                (
                    "[Fragile Strength] / [Unbreakable Strength]",
                    pd.got_charm_25,
                ),
                ("[Spell Twister]", pd.got_charm_33),
                ("[Steady Body]", pd.got_charm_14),
                ("[Heavy Blow]", pd.got_charm_15),
                ("[Quick Slash]", pd.got_charm_32),
                ("[Longnail]", pd.got_charm_18),
                ("[Mark of Pride]", pd.got_charm_13),
                ("[Fury of the Fallen]", pd.got_charm_6),
                ("[Thorns of Agony]", pd.got_charm_12),
                ("[Baldur Shell]", pd.got_charm_5),
                ("[Flukenest]", pd.got_charm_11),
                ("[Defender's Crest]", pd.got_charm_10),
                ("[Glowing Womb]", pd.got_charm_22),
                ("[Quick Focus]", pd.got_charm_7),
                ("[Deep Focus]", pd.got_charm_34),
                ("[Lifeblood Heart]", pd.got_charm_8),
                ("[Lifeblood Core]", pd.got_charm_9),
                ("[Joni's Blessing]", pd.got_charm_27),
                ("[Hiveblood]", pd.got_charm_29),
                ("[Spore Shroom]", pd.got_charm_17),
                ("[Sharp Shadow]", pd.got_charm_16),
                ("[Shape of Unn]", pd.got_charm_28),
                ("[Nailmaster's Glory]", pd.got_charm_26),
                ("[Weaversong]", pd.got_charm_39),
                ("[Dream Wielder]", pd.got_charm_30),
                ("[Dreamshield]", pd.got_charm_38),
                ("[Grimmchild] / [Carefree Melody]", pd.got_charm_40),
                (
                    "[Kingsoul] / [Void Heart]",
                    pd.got_charm_36 && pd.got_king_fragment && pd.got_queen_fragment,
                ),
            ]);

            let mask_shards = to_map(&[
                ("[Sly] #1", pd.sly_shell_frag1),
                ("[Sly] #2", pd.sly_shell_frag2),
                ("[Sly] #3", pd.sly_shell_frag3),
                ("[Sly] #4", pd.sly_shell_frag4),
                (
                    "[Forgotten Crossroads] [Brooding Mawlek]",
                    mask_shard_collected("Crossroads_09"),
                ),
                ("[Grubfather]", mask_shard_collected("Crossroads_38")),
                (
                    "[Forgotten Crossroads] [Goams]",
                    mask_shard_collected("Crossroads_13"),
                ),
                ("[Queen's Station]", mask_shard_collected("Fungus2_01")),
                ("[Bretta]'s house", mask_shard_collected("Room_Bretta")),
                ("[Stone Sanctuary]", mask_shard_collected("Fungus1_36")),
                ("[Royal Waterways]", mask_shard_collected("Waterways_04b")),
                (
                    "[Deepnest] from [Fungal Core]",
                    mask_shard_collected("Fungus2_25"),
                ),
                ("[Enraged Guardian]", mask_shard_collected("Mines_32")),
                ("[The Hive]", mask_shard_collected("Hive_04")),
                ("[Seer]", pd.dream_reward7),
                ("[Grey Mourner]", mask_shard_collected("Room_Mansion")),
            ]);

            let vessel_fragments = to_map(&[
                ("[Sly] #1", pd.sly_vessel_frag1),
                ("[Sly] #2", pd.sly_vessel_frag2),
                ("[Greenpath]", vessel_frag_collected("Fungus1_13")),
                (
                    "Left of the lift in [Forgotten Crossroads]",
                    vessel_frag_collected("Crossroads_37"),
                ),
                (
                    "Above [King's Station] near a lift",
                    vessel_frag_collected("Ruins2_09"),
                ),
                ("[Deepnest]", vessel_frag_collected("Deepnest_38")),
                ("[Stag Nest]", pd.vessel_frag_stag_nest),
                ("[Seer]", pd.dream_reward5),
                (
                    "[Ancient Basin] fountain",
                    vessel_frag_collected("Abyss_04"),
                ),
            ]);

            let dreamers = to_map(&[
                ("[Herra the Beast]", pd.hegemol_defeated),
                ("[Lurien the Watcher]", pd.lurien_defeated),
                ("[Monomon the Teacher]", pd.monomon_defeated),
            ]);

            #[allow(clippy::float_cmp)]
            let dream_warriors = to_map(&[
                ("[Elder Hu]", pd.elder_hu_defeated == 2.0),
                ("[Galien]", pd.galien_defeated == 2.0),
                ("[Gorb]", pd.aladar_slug_defeated == 2.0),
                ("[Markoth]", pd.markoth_defeated == 2.0),
                ("[Marmu]", pd.mum_caterpillar_defeated == 2.0),
                ("[No Eyes]", pd.no_eyes_defeated == 2.0),
                ("[Xero]", pd.xero_defeated == 2.0),
                (
                    "[Nightmare King Grimm] / [Banishment](Grimm Troupe (Quest))",
                    pd.killed_nightmare_grimm || pd.nymm_in_town,
                ),
            ]);

            let dream_bosses = to_map(&[
                ("[Failed Champion]", pd.false_knight_dream_defeated),
                ("[Grey Prince Zote]", pd.grey_prince_defeated),
                ("[Lost Kin]", pd.infected_knight_dream_defeated),
                ("[White Defender]", pd.white_defender_defeated),
                ("[Soul Tyrant]", pd.mage_lord_dream_defeated),
            ]);

            let colosseum = to_map(&[
                ("[Trial of the Warrior]", pd.colosseum_bronze_completed),
                ("[Trial of the Conqueror]", pd.colosseum_silver_completed),
                ("[Trial of the Fool]", pd.colosseum_gold_completed),
            ]);

            let godhome = to_map(&[
                ("[Godtuner]", pd.has_godfinder),
                (
                    "[Pantheon of the Master]",
                    pd.boss_door_state_tier1.completed,
                ),
                (
                    "[Pantheon of the Artist]",
                    pd.boss_door_state_tier2.completed,
                ),
                ("[Pantheon of the Sage]", pd.boss_door_state_tier3.completed),
                (
                    "[Pantheon of the Knight]",
                    pd.boss_door_state_tier4.completed,
                ),
                (
                    "[Pantheon of the Hallownest] (no percent)",
                    pd.boss_door_state_tier5.completed,
                ),
            ]);

            let grubs = to_map(&[
                (
                    "[Forgotten Crossroads] behind [Husk Guard]",
                    grub_freed("Crossroads_48"),
                ),
                (
                    "[Forgotten Crossroads] [Fog Canyon] entrance",
                    grub_freed("Crossroads_35"),
                ),
                (
                    "[Forgotten Crossroads] breakable wall",
                    grub_freed("Crossroads_03"),
                ),
                (
                    "[Forgotten Crossroads] [Pogo](Nail#Nail-bouncing)",
                    grub_freed("Crossroads_31"),
                ),
                (
                    "[Forgotten Crossroads] on a ledge",
                    grub_freed("Crossroads_05"),
                ),
                (
                    "[Greenpath] with a moss block shortcut",
                    grub_freed("Fungus1_06"),
                ),
                ("[Greenpath] near acid", grub_freed("Fungus1_07")),
                ("[Greenpath] behind [Moss Knight]", grub_freed("Fungus1_21")),
                (
                    "[Greenpath] in the middle of a [Durandoo] room",
                    grub_freed("Fungus1_13"),
                ),
                (
                    "[Fungal Wastes] behind a line of [Fungling]s",
                    grub_freed("Fungus2_18"),
                ),
                (
                    "[Fungal Wastes] near [Spore Shroom]",
                    grub_freed("Fungus2_20"),
                ),
                (
                    "[City of Tears] on a ledge",
                    scene_activated("Ruins1_05", "Grub Bottle (1)"),
                ),
                (
                    "[City of Tears] behind [Great Husk Sentry]",
                    grub_freed("Ruins_House_01"),
                ),
                (
                    "[City of Tears] in the [Desolate Dive] dive",
                    grub_freed("Ruins1_32"),
                ),
                (
                    "[City of Tears] under the entrance to the [Tower of Love]",
                    grub_freed("Ruins2_07"),
                ),
                (
                    "[City of Tears] room leading to [Watcher Knight]",
                    grub_freed("Ruins2_03"),
                ),
                ("[Crystal Peak] from [Dirtmouth]", grub_freed("Mines_16")),
                ("[Crystal Peak] behind presses", grub_freed("Mines_19")),
                (
                    "[Crystal Peak] near [Crystal Heart]",
                    grub_freed("Mines_31"),
                ),
                (
                    "[Crystal Peak] on the way to [Hallownest's Crown]",
                    grub_freed("Mines_24"),
                ),
                (
                    "[Crystal Peak] vertical conveyor belts lever",
                    grub_freed("Mines_03"),
                ),
                (
                    "[Crystal Peak] from the top room with presses",
                    grub_freed("Mines_04"),
                ),
                (
                    "[Crystal Peak] in the [Crystallized Mound]",
                    grub_freed("Mines_35"),
                ),
                (
                    "[Resting Grounds] [Crypts](Resting Grounds#Crypts)",
                    grub_freed("RestingGrounds_10"),
                ),
                (
                    "[Royal Waterways] behind a wall near water",
                    grub_freed("Waterways_04"),
                ),
                (
                    "[Royal Waterways] from the [Kingdom's Edge]",
                    grub_freed("Waterways_14"),
                ),
                (
                    "[Royal Waterways] above [Isma's Tear]",
                    grub_freed("Waterways_13"),
                ),
                ("[Howling Cliffs]", grub_freed("Fungus1_28")),
                (
                    "[Kingdom's Edge] under [Oro]'s hut",
                    grub_freed("Deepnest_East_14"),
                ),
                (
                    "[Kingdom's Edge] behind a [Primal Aspid]",
                    grub_freed("Deepnest_East_11"),
                ),
                ("[Fog Canyon]", grub_freed("Fungus3_47")),
                (
                    "[Queen's Gardens] under the [Stag] station",
                    grub_freed("Fungus3_10"),
                ),
                (
                    "[Queen's Gardens] above the spiky roof",
                    grub_freed("Fungus3_22"),
                ),
                (
                    "[Queen's Gardens] near [White Lady]",
                    grub_freed("Fungus3_48"),
                ),
                ("[Deepnest] among [Grub Mimic]s", grub_freed("Deepnest_36")),
                ("[Deepnest] above the spike pit", grub_freed("Deepnest_03")),
                ("[Deepnest] on the way to [Nosk]", grub_freed("Deepnest_31")),
                (
                    "[Deepnest] near the [Weavers' Den]",
                    grub_freed("Deepnest_39"),
                ),
                (
                    "[Deepnest] in the [Beast's Den]",
                    grub_freed("Deepnest_Spider_Town"),
                ),
                (
                    "[Ancient Basin] above [Broken Vessel]",
                    grub_freed("Abyss_19"),
                ),
                ("[Ancient Basin] under [Cloth]", grub_freed("Abyss_17")),
                ("[The Hive] isolated room", grub_freed("Hive_03")),
                ("[The Hive]", grub_freed("Hive_04")),
                (
                    "[Tower of Love] #1",
                    scene_activated("Ruins2_11", "Grub Bottle"),
                ),
                (
                    "[Tower of Love] #2",
                    scene_activated("Ruins2_11", "Grub Bottle"),
                ),
                (
                    "[Tower of Love] #3",
                    scene_activated("Ruins2_11", "Grub Bottle"),
                ),
            ]);

            let items = to_map(&[
                ("[SIMPLE_KEY] [Simple Key] from [Sly]", pd.sly_simple_key),
                (
                    "[SIMPLE_KEY] [Simple Key] near [City Storerooms]",
                    scene_activated("Ruins1_17", "Shiny Item"),
                ),
                (
                    "[SIMPLE_KEY] [Simple Key] in the [Ancient Basin]",
                    scene_activated("Abyss_20", "Shiny Item Stand"),
                ),
                (
                    "[SIMPLE_KEY] [Simple Key] behind [Pale Lurker]",
                    pd.got_lurker_key,
                ),
                ("[ELEGANT_KEY] [Elegant Key]", pd.has_white_key),
                (
                    "[LOVE_KEY] [Love Key]",
                    pd.has_love_key || pd.opened_love_door,
                ),
                (
                    "[SHOPKEEPER'S_KEY] [Shopkeeper's Key]",
                    pd.has_slykey || pd.gave_slykey,
                ),
                ("[TRAM_PASS] [Tram Pass]", pd.has_tram_pass),
                ("[Lumafly Lantern]", pd.has_lantern),
                ("[Delicate Flower]", pd.xun_flower_given),
                (
                    "[PALE_ORE] [Pale Ore] in [Ancient Basin] below [Cloth]",
                    scene_activated("Abyss_17", "Battle Scene Ore"),
                ),
                (
                    "[PALE_ORE] [Pale Ore] awarded by the [Seer]",
                    pd.dream_reward3,
                ),
                (
                    "[PALE_ORE] [Pale Ore] on the [Hallownest's Crown]",
                    scene_activated("Mines_34", "Shiny Item Stand"),
                ),
                (
                    "[PALE_ORE] [Pale Ore] behind [Nosk]s lair",
                    scene_activated("Deepnest_32", "Shiny Item Stand"),
                ),
                (
                    "[PALE_ORE] [Pale Ore] awarded by [Grubfather]",
                    scene_activated("Crossroads_38", "Shiny Item Ore"),
                ),
                (
                    "[PALE_ORE] [Pale Ore] reward in [Trial of the Conqueror]",
                    scene_activated("Room_Colosseum_Silver", "Shiny Item"),
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] from [Salubra] #1",
                    pd.salubra_notch1,
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] from [Salubra] #2",
                    pd.salubra_notch2,
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] from [Salubra] #3",
                    pd.salubra_notch3,
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] from [Salubra] #4",
                    pd.salubra_notch4,
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] in [Fog Canyon]",
                    pd.notch_fog_canyon,
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] in [Fungal Wastes]",
                    pd.notch_shroom_ogres,
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] from [Colosseum of Fools]",
                    scene_activated("Room_Colosseum_Bronze", "Shiny Item"),
                ),
                (
                    "[CHARM_NOTCH] [Charm Notch] from [Grimm]",
                    pd.got_grimm_notch,
                ),
            ]);

            let relics = to_map(&[
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Greenpath] near a [Stag Station]",
                    scene_activated("Fungus1_22", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Greenpath] near [Fog Canyon] entrance",
                    scene_activated("Fungus1_11", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Fungal Wastes] near [Shrumal Ogre]s",
                    scene_activated("Fungus2_04", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] north of the [Mantis Village]",
                    scene_activated("Fungus2_17", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [City Storerooms]",
                    scene_activated("Ruins1_28", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] north of [King's Station]",
                    scene_activated("Deepnest_East_07", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Pleasure House]",
                    scene_activated("Ruins_Elevator", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Howling Cliffs]",
                    scene_activated("Cliffs_01", "Shiny Item (1)"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Crystal Peak]",
                    scene_activated("Mines_20", "Shiny Item (1)"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Crypts](Resting Grounds#Crypts)",
                    scene_activated("RestingGrounds_10", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] in [Royal Waterways]",
                    scene_activated("Abyss_02", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] near [City of Tears] entrance",
                    scene_activated("Ruins2_05", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] next to the [Cast-Off Shell] [Bench]",
                    scene_activated("Deepnest_East_13", "Shiny Item"),
                ),
                (
                    "[WANDERER'S_JOURNAL] [Wanderer's Journal] near [Markoth]",
                    scene_activated("Deepnest_East_18", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] awarded by [Grubfather]",
                    scene_activated("Crossroads_38", "Shiny Item Relic2"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] in the well to [Forgotten Crossroads]",
                    scene_activated("Crossroads_01", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] near [Thorns of Agony]",
                    scene_activated("Fungus1_10", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] near [Queen's Station]",
                    scene_activated("Fungus2_03", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] in [Mantis Village]",
                    scene_activated("Fungus2_31", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] at the [Willoh]",
                    scene_activated("Fungus2_34", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] near [Overgrown Mound]",
                    scene_activated("Fungus3_30", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] in [Forgotten Crossroads] in [Fog Canyon] entrance",
                    scene_activated("Fungus3_26", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] in [Crypts](Resting Grounds#Crypts)",
                    scene_activated("RestingGrounds_10", "Shiny Item (1)"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] awarded by the [Seer]",
                    pd.dream_reward1,
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] near [Relic Seeker Lemm]",
                    scene_activated("Ruins1_03", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] above [King's Station] [Stag Station]",
                    scene_activated("Ruins2_08", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] near [Soul Master]",
                    scene_activated("Ruins1_32", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] behind [Watcher Knight]",
                    scene_activated("Ruins2_03", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] in [Beast's Den]",
                    scene_activated("Deepnest_Spider_Town", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] in [Deepnest] near [Mantis Lords]",
                    scene_activated("Deepnest_16", "Shiny Item"),
                ),
                (
                    "[HALLOWNEST_SEAL] [Hallownest Seal] in [Queen's Gardens]",
                    scene_activated("Fungus3_48", "Shiny Item"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] awarded by [Grubfather]",
                    scene_activated("Crossroads_38", "Shiny Item Relic3"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] in [Crystal Peak]",
                    scene_activated("Mines_30", "Shiny Item Stand"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] in [Spirits' Glade]",
                    scene_activated("RestingGrounds_08", "Shiny Item"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] in [Dung Defender]'s secret room",
                    scene_activated("Waterways_15", "Shiny Item Stand"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] in [Howling Cliffs]",
                    scene_activated("Cliffs_01", "Shiny Item"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] under [Colosseum of Fools]",
                    scene_activated("Deepnest_East_08", "Shiny Item"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] near [Pale Lurker]",
                    scene_activated("GG_Lurker", "Shiny Item"),
                ),
                (
                    "[KING'S_IDOL] [King's Idol] in [Deepnest] near [Zote]",
                    scene_activated("Deepnest_33", "Shiny Item"),
                ),
                (
                    "[ARCANE_EGG] [Arcane Egg] below [Lifeblood Core]",
                    scene_activated("Abyss_08", "Shiny Item (1)"),
                ),
                (
                    "[ARCANE_EGG] [Arcane Egg] near [Shade Cloak]",
                    scene_activated("Abyss_10", "Shiny Item"),
                ),
                (
                    "[ARCANE_EGG] [Arcane Egg] in [Birthplace]",
                    scene_activated("Abyss_15", "Shiny Item"),
                ),
                (
                    "[ARCANE_EGG] [Arcane Egg] awarded by the [Seer]",
                    pd.dream_reward6,
                ),
            ]);

            let whispering_roots = to_map(&[
                (
                    "[Ancestral Mound]",
                    whispering_root("Crossroads_ShamanTemple"),
                ),
                ("[City of Tears]", whispering_root("Ruins1_17")),
                ("[Crystal Peak]", whispering_root("Mines_23")),
                ("[Deepnest]", whispering_root("Deepnest_39")),
                ("[Forgotten Crossroads]", whispering_root("Crossroads_07")),
                (
                    "[Fungal Wastes] (near [Fog Canyon])",
                    whispering_root("Fungus2_33"),
                ),
                (
                    "[Fungal Wastes] (above [Mantis Village])",
                    whispering_root("Fungus2_17"),
                ),
                ("[Greenpath]", whispering_root("Fungus1_13")),
                ("[The Hive]", whispering_root("Hive_02")),
                ("[Howling Cliffs]", whispering_root("Cliffs_01")),
                ("[Kingdom's Edge]", whispering_root("Deepnest_East_07")),
                ("[Queen's Gardens]", whispering_root("Fungus3_11")),
                ("[Resting Grounds]", whispering_root("RestingGrounds_05")),
                ("[Royal Waterways]", whispering_root("Abyss_01")),
                ("[Spirits' Glade]", whispering_root("RestingGrounds_08")),
            ]);

            self.map = GameSer::HollowKnight(HollowKnightChecks {
                bosses,
                optional_bosses,
                equipment,
                nail,
                dream_nail,
                nail_arts,
                spells,
                charms,
                mask_shards,
                vessel_fragments,
                dreamers,
                dream_warriors,
                dream_bosses,
                colosseum,
                godhome,
                grubs,
                items,
                relics,
                whispering_roots,
            });
        } else if let GameDeser::Silksong(data) = data {
            let pd = &data.player_data;

            let scene_activated = |name, id| {
                data.scene_data
                    .persistent_bools
                    .serialized_list
                    .iter()
                    .find(|x| x.scene_name == name && x.id == id)
                    .is_some_and(|x| x.value)
            };

            let has_tool = |name| {
                pd.tools
                    .saved_data
                    .iter()
                    .find(|x| x.name == name)
                    .is_some_and(|x| x.data.is_unlocked)
            };

            let quest_completed = |name| {
                pd.quest_completion_data
                    .saved_data
                    .iter()
                    .find(|x| x.name == name)
                    .is_some_and(|x| x.data.is_completed)
            };

            let mask_shard_collected = |name| scene_activated(name, "Heart Piece");
            let silk_spool_collected = |name| scene_activated(name, "Silk Spool");
            let silk_heart_collected = |name| scene_activated(name, "glow_rim_Remasker");

            let silk_hearts = to_map(&[
                (
                    "[Bell Beast]",
                    silk_heart_collected("Memory_Silk_Heart_BellBeast"),
                ),
                (
                    "[Lace Tower]",
                    silk_heart_collected("Memory_Silk_Heart_LaceTower"),
                ),
                (
                    "[The Unravelled]",
                    silk_heart_collected("Memory_Silk_Heart_WardBoss"),
                ),
            ]);

            let silk_skills = to_map(&[
                ("[Silkspear]", pd.has_needle_throw),
                ("[Thread Storm]", pd.has_thread_sphere),
                ("[Cross Stitch]", pd.has_parry),
                ("[Sharpdart]", pd.has_silk_charge),
                ("[Rune Rage]", pd.has_silk_bomb),
                ("[Pale Nails]", pd.has_silk_boss_needle),
            ]);

            let tools = to_map(&[
                ("[Shard Pendant]", has_tool("Bone Necklace")),
                ("[Compass]", has_tool("Compass")),
                (
                    "[Druid's Eye] / [Druid's Eyes]",
                    has_tool("Mosscreep Tool 1") | has_tool("Mosscreep Tool 2"),
                ),
                ("[Straight Pin]", has_tool("Straight Pin")),
                ("[Warding Bell]", has_tool("Bell Bind")),
                ("[Treefold Pin]", has_tool("Tri Pin")),
                ("[Flea Brew]", has_tool("Flea Brew")),
                ("[Sting Shard]", has_tool("Sting Shard")),
                ("[Longpin]", has_tool("Harpoon")),
                ("[Pollip Pouch]", has_tool("Poison Pouch")),
                ("[Weavelight]", has_tool("White Ring")),
                (
                    "[Dead Bug's Purse] / [Shell Satchel]",
                    has_tool("Dead Mans Purse") | has_tool("Shell Satchel"),
                ),
                ("[Plasmium Phial]", has_tool("Lifeblood Syringe")),
                ("[Silkspeed Anklets]", has_tool("Sprintmaster")),
                ("[Pimpillo]", has_tool("Pimpilo")),
                ("[Barbed Bracelet]", has_tool("Barbed Wire")),
                ("[Tacks]", has_tool("Tack")),
                ("[Flintslate]", has_tool("Flintstone")),
                (
                    "[Silkshot]",
                    has_tool("WebShot Forge")
                        | has_tool("WebShot Weaver")
                        | has_tool("WebShot Architect"),
                ),
                ("[Delver's Drill]", has_tool("Screw Attack")),
                ("[Injector Band]", has_tool("Quickbind")),
                ("[Cogwork Wheel]", has_tool("Cogwork Saw")),
                ("[Scuttlebrace]", has_tool("Scuttlebrace")),
                ("[Memory Crystal]", has_tool("Revenge Crystal")),
                ("[Multibinder]", has_tool("Multibind")),
                ("[Voltvessels]", has_tool("Lightning Rod")),
                ("[Wreath of Purity]", has_tool("Maggot Charm")),
                ("[Longclaw]", has_tool("Longneedle")),
                ("[Conchcutter]", has_tool("Conch Drill")),
                ("[Thief's Mark]", has_tool("Thief Charm")),
                ("[Throwing ring]", has_tool("Shakra Ring")),
                ("[Magnetite Brooch]", has_tool("Rosary Magnet")),
                ("[Magma Bell]", has_tool("Lava Charm")),
                (
                    "[Claw Mirror]",
                    has_tool("Dazzle Bind") | has_tool("Dazzle Bind Upgraded"),
                ),
                ("[Spider Strings]", has_tool("Musician Charm")),
                ("[Rosary Cannon]", has_tool("Rosary Cannon")),
                ("[Wispfire Lantern]", has_tool("Wisp Lantern")),
                ("[Magnetite Dice]", has_tool("Magnetite Dice")),
                ("[Volt Filament]", has_tool("Zap Imbuement")),
                ("[Weighted Belt]", has_tool("Weighted Anklet")),
                ("[Egg of Flealia]", has_tool("Flea Charm")),
                ("[Fractured Mask]", has_tool("Fractured Mask")),
                (
                    "[Curveclaw] / [Curvesickle]",
                    has_tool("Curve Claws") | has_tool("Curve Claws Upgraded"),
                ),
                ("[Quick Sling]", has_tool("Quick Sling")),
                ("[Cogfly]", has_tool("Cogwork Flier")),
                ("[Reserve Bind]", has_tool("Reserve Bind")),
                ("[Pin Badge]", has_tool("Pinstress Tool")),
                ("[Sawtooth Circlet]", has_tool("Brolly Spike")),
                ("[Spool Extender]", has_tool("Spool Extender")),
                ("[Ascendant's Grip]", has_tool("Wallcling")),
                ("[Snitch Pick]", has_tool("Thief Claw")),
            ]);

            let ancestral_arts = to_map(&[
                ("[Swift Step]", pd.has_dash),
                ("[Cling Grip]", pd.has_walljump),
                ("[Needolin]", pd.has_needolin),
                ("[Clawline]", pd.has_harpoon_dash),
                ("[Needle Strike]", pd.has_charge_slash),
                ("[Silk Soar]", pd.has_super_jump),
                ("[Sylphsong]", pd.has_bound_crest_upgrader),
            ]);

            let crests = to_map(&[
                ("[Reaper Crest]", pd.completed_memory_reaper),
                ("[Beast Crest]", pd.completed_memory_beast),
                ("[Wanderer Crest]", pd.completed_memory_wanderer),
                ("[Architect Crest]", pd.completed_memory_toolmaster),
                // completedMemory_witch does NOT give you %, only the crest,
                // which is Cursed, and you get Witch crest and % from the quest
                ("[Witch Crest]", quest_completed("Doctor Curse Cure")),
                ("[Shaman Crest]", pd.completed_memory_shaman),
            ]);

            let mask_shards = to_map(&[
                // TODO: names
                ("[Mask Shard Crawl_02]", mask_shard_collected("Crawl_02")),
                ("[Mask Shard Dock_08]", mask_shard_collected("Dock_08")),
                (
                    "[Mask Shard Bone_East_20]",
                    mask_shard_collected("Bone_East_20"),
                ),
                (
                    "[Mask Shard Shellwood_14]",
                    mask_shard_collected("Shellwood_14"),
                ),
                ("[Mask Shard Weave_05b]", mask_shard_collected("Weave_05b")),
                ("[Mask Shard Song_09]", mask_shard_collected("Song_09")),
                (
                    "[Mask Shard Bonebottom Shop]",
                    pd.purchased_bonebottom_heart_piece,
                ),
                (
                    "[Mask Shard Songclave Shop]",
                    pd.merchant_enclave_shell_fragment,
                ),
                ("[Mask Shard Peak_04c]", mask_shard_collected("Peak_04c")),
                (
                    "[Mask Shard Bone_East_LavaChallenge]",
                    scene_activated("Bone_East_LavaChallenge", "Heart Piece (1)"),
                ),
                (
                    "[Mask Shard Savage Beastfly Hunt]",
                    quest_completed("Beastfly Hunt"),
                ),
                ("[Mask Shard Coral_19b]", mask_shard_collected("Coral_19b")),
                ("[Mask Shard Shadow_13]", mask_shard_collected("Shadow_13")),
                ("[Mask Shard Slab_17]", mask_shard_collected("Slab_17")),
                (
                    "[Mask Shard Library_05]",
                    mask_shard_collected("Library_05"),
                ),
                ("[Mask Shard Wisp_07]", mask_shard_collected("Wisp_07")),
                (
                    "[Mask Shard Sprintmaster Race]",
                    quest_completed("Sprintmaster Race"),
                ),
                ("[Mask Shard Peak_06]", mask_shard_collected("Peak_06")),
                ("[Mask Shard Ant Trapper]", quest_completed("Ant Trapper")),
                (
                    "[Mask Shard Destroy Thread Cores]",
                    quest_completed("Destroy Thread Cores"),
                ),
            ]);

            let needle = to_map(&[
                (
                    "[Sharpened Needle](Needle#Upgrades)",
                    pd.nail_upgrades > 0.0,
                ),
                ("[Shining Needle](Needle#Upgrades)", pd.nail_upgrades > 1.0),
                (
                    "[Hivesteel Needle](Needle#Upgrades)",
                    pd.nail_upgrades > 2.0,
                ),
                (
                    "[Palesteel Needle](Needle#Upgrades)",
                    pd.nail_upgrades > 3.0,
                ),
            ]);

            let spool_fragments = to_map(&[
                // TODO: names
                (
                    "[Spool Fragment Bone_East_13]",
                    silk_spool_collected("Bone_East_13"),
                ),
                (
                    "[Spool Fragment Greymoor_02]",
                    silk_spool_collected("Greymoor_02"),
                ),
                (
                    "[Spool Fragment Weave_11]",
                    silk_spool_collected("Weave_11"),
                ),
                ("[Spool Fragment Peak_01]", silk_spool_collected("Peak_01")),
                (
                    "[Spool Fragment Bellhart Shop]",
                    pd.purchased_belltown_spool_segment,
                ),
                (
                    "[Spool Fragment Song_19_entrance]",
                    silk_spool_collected("Song_19_entrance"),
                ),
                (
                    "[Spool Fragment Under_10]",
                    silk_spool_collected("Under_10"),
                ),
                ("[Spool Fragment Cog_07]", silk_spool_collected("Cog_07")),
                (
                    "[Spool Fragment Library_11b]",
                    silk_spool_collected("Library_11b"),
                ),
                ("[Spool Fragment Ward_01]", silk_spool_collected("Ward_01")),
                ("[Spool Fragment Mooshka]", pd.caravan_troupe_location > 1.0),
                (
                    "[Spool Fragment Arborium_09]",
                    silk_spool_collected("Arborium_09"),
                ),
                (
                    "[Spool Fragment Dock_03c]",
                    silk_spool_collected("Dock_03c"),
                ),
                (
                    "[Spool Fragment Hang_03_top]",
                    silk_spool_collected("Hang_03_top"),
                ),
                (
                    "[Spool Fragment Songclave Shop]",
                    pd.merchant_enclave_spool_piece,
                ),
                ("[Spool Fragment Sherma]", quest_completed("Save Sherma")),
                ("[Spool Fragment Grindle]", pd.purchased_grindle_spool_piece),
                (
                    "[Spool Fragment Bone_11b]",
                    silk_spool_collected("Bone_11b"),
                ),
            ]);

            let tool_pouch = to_map(&[
                // TODO: add tool pouch upgrades
                (
                    "Tool Pouch Pin Challenge",
                    pd.pin_galleries_completed >= 2.0,
                ),
                ("Tool Kit Crow Feathers", quest_completed("Crow Feathers")),
                ("Tool Kit Forge Daughter", pd.purchased_forge_tool_kit),
                ("Tool Pouch Nuu", quest_completed("Journal")),
                (
                    "Tool Pouch Pilgrim's Rest",
                    pd.purchased_pilgrims_rest_tool_pouch,
                ),
                ("Tool Pouch Mooshka", pd.caravan_troupe_location > 2.0),
                ("Tool Kit Grindle", pd.purchased_grindle_tool_kit),
                ("Tool Kit Architect", pd.purchased_architect_tool_kit),
            ]);

            let items = to_map(&[
                ("[Drifter's Cloak]", pd.has_brolly),
                ("[Faydown Cloak]", pd.has_double_jump),
            ]);

            #[expect(clippy::float_cmp)]
            let everbloom = to_map(&[(
                "[Everbloom]",
                pd.completed_red_memory
                    && pd
                        .collectables
                        .saved_data
                        .iter()
                        .find(|x| x.name == "White Flower")
                        .is_some_and(|x| x.data.amount == 1.0),
            )]);

            self.map = GameSer::Silksong(SilksongChecks {
                silk_hearts,
                tools,
                silk_skills,
                ancestral_arts,
                crests,
                mask_shards,
                needle,
                spool_fragments,
                tool_pouch,
                items,
                everbloom,
            });
        }

        Ok(())
    }

    #[allow(clippy::missing_panics_doc)]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
    #[must_use]
    pub fn get_map(&self) -> Map {
        #[cfg(target_arch = "wasm32")]
        {
            serde_wasm_bindgen::to_value(&self.map).unwrap()
        }

        #[cfg(not(target_arch = "wasm32"))]
        {
            self.map.clone()
        }
    }
}

type Number = f64;

////////////////////////////////////////////////////////////////////////////////
// Serialization////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

#[expect(clippy::large_enum_variant)]
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum GameSer {
    HollowKnight(HollowKnightChecks),
    Silksong(SilksongChecks),
}

#[derive(Debug, Default, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HollowKnightChecks {
    bosses: HashMap<String, bool>,
    optional_bosses: HashMap<String, bool>,
    equipment: HashMap<String, bool>,
    nail: HashMap<String, bool>,
    dream_nail: HashMap<String, bool>,
    nail_arts: HashMap<String, bool>,
    spells: HashMap<String, bool>,
    charms: HashMap<String, bool>,
    mask_shards: HashMap<String, bool>,
    vessel_fragments: HashMap<String, bool>,
    dreamers: HashMap<String, bool>,
    dream_warriors: HashMap<String, bool>,
    dream_bosses: HashMap<String, bool>,
    colosseum: HashMap<String, bool>,
    godhome: HashMap<String, bool>,
    grubs: HashMap<String, bool>,
    items: HashMap<String, bool>,
    relics: HashMap<String, bool>,
    whispering_roots: HashMap<String, bool>,
}

#[derive(Debug, Default, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SilksongChecks {
    silk_hearts: HashMap<String, bool>,
    tools: HashMap<String, bool>,
    silk_skills: HashMap<String, bool>,
    ancestral_arts: HashMap<String, bool>,
    crests: HashMap<String, bool>,
    mask_shards: HashMap<String, bool>,
    needle: HashMap<String, bool>,
    spool_fragments: HashMap<String, bool>,
    tool_pouch: HashMap<String, bool>,
    items: HashMap<String, bool>,
    everbloom: HashMap<String, bool>,
}

////////////////////////////////////////////////////////////////////////////////
// Deserialization /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

#[allow(clippy::large_enum_variant)]
#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum GameDeser {
    HollowKnight(SaveFile<HollowKnightPlayerData, HollowKnightSceneData>),
    Silksong(SaveFile<SilksongPlayerData, SilksongSceneData>),
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveFile<GameData, SceneData> {
    player_data: Box<GameData>,
    scene_data: SceneData,
}

#[expect(clippy::struct_excessive_bools)]
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HollowKnightPlayerData {
    fireball_level: Number,
    quake_level: Number,
    scream_level: Number,
    has_cyclone: bool,
    has_dash_slash: bool,
    has_upward_slash: bool,
    has_dream_nail: bool,
    has_dream_gate: bool,
    dream_nail_upgraded: bool,
    has_dash: bool,
    has_walljump: bool,
    has_super_dash: bool,
    has_shadow_dash: bool,
    has_acid_armour: bool,
    has_double_jump: bool,
    has_lantern: bool,
    has_tram_pass: bool,
    has_slykey: bool,
    gave_slykey: bool,
    has_white_key: bool,
    has_love_key: bool,
    has_kings_brand: bool,
    notch_shroom_ogres: bool,
    notch_fog_canyon: bool,
    got_lurker_key: bool,
    lurien_defeated: bool,
    hegemol_defeated: bool,
    monomon_defeated: bool,
    sly_shell_frag1: bool,
    sly_shell_frag2: bool,
    sly_shell_frag3: bool,
    sly_shell_frag4: bool,
    sly_vessel_frag1: bool,
    sly_vessel_frag2: bool,
    sly_simple_key: bool,
    moth_departed: bool,
    dream_reward1: bool,
    dream_reward3: bool,
    dream_reward5: bool,
    dream_reward6: bool,
    dream_reward7: bool,
    salubra_notch1: bool,
    salubra_notch2: bool,
    salubra_notch3: bool,
    salubra_notch4: bool,
    nail_smith_upgrades: Number,
    xun_flower_given: bool,
    colosseum_bronze_completed: bool,
    colosseum_silver_completed: bool,
    colosseum_gold_completed: bool,
    #[serde(rename = "gotCharm_1")]
    got_charm_1: bool,
    #[serde(rename = "gotCharm_2")]
    got_charm_2: bool,
    #[serde(rename = "gotCharm_3")]
    got_charm_3: bool,
    #[serde(rename = "gotCharm_4")]
    got_charm_4: bool,
    #[serde(rename = "gotCharm_5")]
    got_charm_5: bool,
    #[serde(rename = "gotCharm_6")]
    got_charm_6: bool,
    #[serde(rename = "gotCharm_7")]
    got_charm_7: bool,
    #[serde(rename = "gotCharm_8")]
    got_charm_8: bool,
    #[serde(rename = "gotCharm_9")]
    got_charm_9: bool,
    #[serde(rename = "gotCharm_10")]
    got_charm_10: bool,
    #[serde(rename = "gotCharm_11")]
    got_charm_11: bool,
    #[serde(rename = "gotCharm_12")]
    got_charm_12: bool,
    #[serde(rename = "gotCharm_13")]
    got_charm_13: bool,
    #[serde(rename = "gotCharm_14")]
    got_charm_14: bool,
    #[serde(rename = "gotCharm_15")]
    got_charm_15: bool,
    #[serde(rename = "gotCharm_16")]
    got_charm_16: bool,
    #[serde(rename = "gotCharm_17")]
    got_charm_17: bool,
    #[serde(rename = "gotCharm_18")]
    got_charm_18: bool,
    #[serde(rename = "gotCharm_19")]
    got_charm_19: bool,
    #[serde(rename = "gotCharm_20")]
    got_charm_20: bool,
    #[serde(rename = "gotCharm_21")]
    got_charm_21: bool,
    #[serde(rename = "gotCharm_22")]
    got_charm_22: bool,
    #[serde(rename = "gotCharm_23")]
    got_charm_23: bool,
    #[serde(rename = "gotCharm_24")]
    got_charm_24: bool,
    #[serde(rename = "gotCharm_25")]
    got_charm_25: bool,
    #[serde(rename = "gotCharm_26")]
    got_charm_26: bool,
    #[serde(rename = "gotCharm_27")]
    got_charm_27: bool,
    #[serde(rename = "gotCharm_28")]
    got_charm_28: bool,
    #[serde(rename = "gotCharm_29")]
    got_charm_29: bool,
    #[serde(rename = "gotCharm_30")]
    got_charm_30: bool,
    #[serde(rename = "gotCharm_31")]
    got_charm_31: bool,
    #[serde(rename = "gotCharm_32")]
    got_charm_32: bool,
    #[serde(rename = "gotCharm_33")]
    got_charm_33: bool,
    #[serde(rename = "gotCharm_34")]
    got_charm_34: bool,
    #[serde(rename = "gotCharm_35")]
    got_charm_35: bool,
    #[serde(rename = "gotCharm_36")]
    got_charm_36: bool,
    #[serde(rename = "gotCharm_37")]
    got_charm_37: bool,
    #[serde(rename = "gotCharm_38")]
    got_charm_38: bool,
    #[serde(rename = "gotCharm_39")]
    got_charm_39: bool,
    #[serde(rename = "gotCharm_40")]
    got_charm_40: bool,
    got_king_fragment: bool,
    got_queen_fragment: bool,
    killed_big_buzzer: bool,
    killed_big_fly: bool,
    killed_mawlek: bool,
    killed_mega_moss_charger: bool,
    killed_infected_knight: bool,
    killed_black_knight: bool,
    killed_mage_knight: bool,
    killed_jar_collector: bool,
    killed_flukeman: bool,
    killed_mega_beam_miner: bool,
    killed_mimic_spider: bool,
    killed_hive_knight: bool,
    killed_traitor_lord: bool,
    killed_oblobble: bool,
    killed_lobster_lancer: bool,
    killed_hollow_knight: bool,
    killed_final_boss: bool,
    killed_grimm: bool,
    killed_nightmare_grimm: bool,
    killed_nail_bros: bool,
    killed_paintmaster: bool,
    killed_nailsage: bool,
    killed_hollow_knight_prime: bool,
    false_knight_defeated: bool,
    false_knight_dream_defeated: bool,
    hornet1_defeated: bool,
    hornet_outskirts_defeated: bool,
    mage_lord_dream_defeated: bool,
    infected_knight_dream_defeated: bool,
    white_defender_defeated: bool,
    grey_prince_defeated: bool,
    aladar_slug_defeated: Number,
    xero_defeated: Number,
    elder_hu_defeated: Number,
    mum_caterpillar_defeated: Number,
    no_eyes_defeated: Number,
    markoth_defeated: Number,
    galien_defeated: Number,
    vessel_frag_stag_nest: bool,
    defeated_mega_jelly: bool,
    defeated_mantis_lords: bool,
    mage_lord_defeated: bool,
    opened_love_door: bool,
    defeated_dung_defender: bool,
    got_grimm_notch: bool,
    boss_door_state_tier1: BossDoorStateTier,
    boss_door_state_tier2: BossDoorStateTier,
    boss_door_state_tier3: BossDoorStateTier,
    boss_door_state_tier4: BossDoorStateTier,
    boss_door_state_tier5: BossDoorStateTier,
    has_godfinder: bool,
    nymm_in_town: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BossDoorStateTier {
    completed: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HollowKnightSceneData {
    persistent_bool_items: Vec<HollowKnightSceneObjectBool>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SilksongSceneData {
    persistent_bools: PersistentBools,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersistentBools {
    serialized_list: Vec<SilksongSceneObjectBool>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
struct SilksongSceneObjectBool {
    #[serde(rename = "ID")]
    id: String,
    scene_name: String,
    value: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HollowKnightSceneObjectBool {
    id: String,
    scene_name: String,
    activated: bool,
}

#[expect(clippy::struct_excessive_bools)]
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SilksongPlayerData {
    has_brolly: bool,
    has_double_jump: bool,
    has_needle_throw: bool,
    has_thread_sphere: bool,
    has_dash: bool,
    has_walljump: bool,
    has_needolin: bool,
    has_charge_slash: bool,
    has_silk_boss_needle: bool,
    has_parry: bool,
    has_harpoon_dash: bool,
    has_silk_charge: bool,
    has_silk_bomb: bool,
    has_super_jump: bool,
    #[serde(rename = "HasBoundCrestUpgrader")]
    has_bound_crest_upgrader: bool,
    nail_upgrades: Number,
    #[serde(rename = "PurchasedBonebottomHeartPiece")]
    purchased_bonebottom_heart_piece: bool,
    #[serde(rename = "MerchantEnclaveShellFragment")]
    merchant_enclave_shell_fragment: bool,
    #[serde(rename = "MerchantEnclaveSpoolPiece")]
    merchant_enclave_spool_piece: bool,
    #[serde(rename = "PurchasedBelltownSpoolSegment")]
    purchased_belltown_spool_segment: bool,
    purchased_grindle_spool_piece: bool,
    pin_galleries_completed: Number,
    #[serde(rename = "PurchasedForgeToolKit")]
    purchased_forge_tool_kit: bool,
    #[serde(rename = "PurchasedPilgrimsRestToolPouch")]
    purchased_pilgrims_rest_tool_pouch: bool,
    purchased_grindle_tool_kit: bool,
    #[serde(rename = "PurchasedArchitectToolKit")]
    purchased_architect_tool_kit: bool,
    #[serde(rename = "Tools")]
    tools: SavedData<ToolsData>,
    #[serde(rename = "QuestCompletionData")]
    quest_completion_data: SavedData<QuestsData>,
    #[serde(rename = "completedMemory_reaper")]
    completed_memory_reaper: bool,
    #[serde(rename = "completedMemory_beast")]
    completed_memory_beast: bool,
    #[serde(rename = "completedMemory_wanderer")]
    completed_memory_wanderer: bool,
    #[serde(rename = "completedMemory_toolmaster")]
    completed_memory_toolmaster: bool,
    #[serde(rename = "completedMemory_shaman")]
    completed_memory_shaman: bool,
    #[serde(rename = "CaravanTroupeLocation")]
    caravan_troupe_location: Number,
    #[serde(rename = "CompletedRedMemory")]
    completed_red_memory: bool,
    #[serde(rename = "Collectables")]
    collectables: SavedData<CollectablesData>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SavedData<Data> {
    saved_data: Vec<SavedDataData<Data>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SavedDataData<Data> {
    data: Data,
    name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct ToolsData {
    is_unlocked: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct QuestsData {
    is_completed: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct CollectablesData {
    amount: Number,
}
