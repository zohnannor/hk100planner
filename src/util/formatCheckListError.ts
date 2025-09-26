import { PartialDeep } from 'type-fest';

import { OFFICIAL_TM_GRUB_NAMES } from '../constants';
import INITIAL_CHECKLIST_STATE from '../stores/INITIAL_CHECKLIST_STATE';
import useUiStore from '../stores/uiStore';
import {
    ChecklistState,
    CheckNames,
    Checks,
    ChecksSection,
    GameKey,
    SectionNames,
} from '../types/checklist';
import { typedEntries } from './typedObject';

const formatCheckListError = <Game extends GameKey>(
    checkName: CheckNames<Game, SectionNames<Game>>,
    errors: PartialDeep<ChecklistState<Game>> | undefined
): string | undefined => {
    if (errors && typeof errors === 'object') {
        const useOfficialTMGrubNames =
            useUiStore.getState().useOfficialTMGrubNames;
        const name =
            useOfficialTMGrubNames &&
            OFFICIAL_TM_GRUB_NAMES.hasOwnProperty(checkName)
                ? OFFICIAL_TM_GRUB_NAMES[
                      checkName as CheckNames<'hollow-knight', 'grubs'>
                  ]
                : checkName;

        const requires = typedEntries(errors)
            .map(([requirement, error]) => {
                const checks = () =>
                    typedEntries(error as Checks<Game>)
                        .map(([section, sectionErrors]) => {
                            const positive = getEntriesText(
                                section,
                                sectionErrors,
                                true
                            );
                            const negative = getEntriesText(
                                section,
                                sectionErrors,
                                false
                            );

                            return positive + negative;
                        })
                        .join('; ');

                if (
                    INITIAL_CHECKLIST_STATE['hollow-knight'].hasOwnProperty(
                        requirement
                    )
                ) {
                    const typedRequirement =
                        requirement as keyof ChecklistState<'hollow-knight'>;
                    switch (typedRequirement) {
                        case 'geo':
                            return `[GEO] ${error}`;
                        case 'essence':
                            return `[ESSENCE] ${error}`;
                        case 'paleOre':
                            return `[PALE_ORE] ${error}`;
                        case 'grubs':
                            return `${error} [grubs] rescued`;
                        case 'simpleKeys':
                            return `${error} [SIMPLE_KEY_(HOLLOW_KNIGHT)] [Simple Key](Simple Key (Hollow Knight))(s) collected`;
                        case 'maskShards':
                            return `${error} [Mask Shard](Mask Shard (Hollow Knight))(s) collected`;
                        case 'charms':
                            return `${error} [Charms] collected`;
                        case 'vesselFragments':
                        case 'geoReq':
                        case 'essenceReq':
                        case 'paleOreReq':
                        case 'simpleKeysReq':
                        case 'game':
                        case 'percent':
                            throw new Error(
                                `Nothing should require ${typedRequirement}`
                            );
                        case 'checks':
                            return checks();
                        default:
                            throw new Error(
                                `Unimplemented requirement for '${
                                    typedRequirement satisfies never
                                }' type`
                            );
                    }
                } else if (
                    INITIAL_CHECKLIST_STATE['silksong'].hasOwnProperty(
                        requirement
                    )
                ) {
                    const typedRequirement =
                        requirement as keyof ChecklistState<'silksong'>;
                    switch (typedRequirement) {
                        case 'rosaries':
                            return `[ROSARY] ${error}`;
                        case 'fleas':
                            return `${error} [fleas] rescued`;
                        case 'simpleKeys':
                            return `${error} [SIMPLE_KEY_(SILKSONG)] [Simple Key](Simple Key (Silksong))(s) collected`;
                        case 'maskShards':
                            return `${error} [Mask Shard](Mask Shard (Silksong))(s) collected`;
                        case 'memoryLockets':
                            return `${error} [MEMORY_LOCKET] [Memory Locket](Memory Locket (Silksong))(s) collected`;
                        case 'paleOil':
                            return `[PALE_OIL] ${error}`;
                        case 'tools':
                            return `${error} [Tools] collected`;
                        case 'spoolFragments':
                        case 'rosariesReq':
                        case 'simpleKeysReq':
                        case 'memoryLocketsReq':
                        case 'paleOilReq':
                        case 'game':
                        case 'percent':
                            throw new Error(
                                `Nothing should require ${typedRequirement}`
                            );
                        case 'acts':
                            return `[Act ${error}] being started`;
                        case 'checks':
                            return checks();
                        default:
                            throw new Error(
                                `Unimplemented requirement for '${
                                    typedRequirement satisfies never
                                }' type`
                            );
                    }
                } else {
                    throw new Error('Unreachable code');
                }
            })
            .filter(Boolean)
            .join(', ');

        return `${name} requires ${requires}.`;
    } else if (typeof errors === 'string') {
        return errors;
    }
    return undefined;
};

const getEntriesText = <Game extends GameKey>(
    section: SectionNames<Game>,
    sectionErrors: ChecksSection<Game, SectionNames<Game>>,
    checked: boolean
) => {
    const entries = typedEntries(sectionErrors)
        .filter(([, check]) => (check.checked ?? false) === checked)
        .map(([name]) => name);

    return entries.length !== 0
        ? requirementTextForSection(
              section,
              entries.join(', ') + (checked ? ' to be ' : ' to not be ')
          )
        : '';
};

const requirementTextForSection = <Game extends GameKey>(
    section: SectionNames<Game>,
    joined: string
): string => {
    if (
        INITIAL_CHECKLIST_STATE['hollow-knight'].checks.hasOwnProperty(section)
    ) {
        const typedSection = section as SectionNames<'hollow-knight'>;
        switch (typedSection) {
            case 'bosses':
            case 'optionalBosses':
            case 'dreamers':
            case 'dreamWarriors':
            case 'dreamBosses': {
                joined += 'defeated';
                break;
            }
            case 'equipment':
            case 'charms':
            case 'items':
            case 'vesselFragments':
            case 'maskShards':
            case 'relics':
            case 'whisperingRoots': {
                joined += 'collected';
                break;
            }
            case 'spells': {
                joined += 'learned';
                break;
            }
            case 'nail':
            case 'nailArts':
            case 'dreamNail': {
                joined += 'obtained';
                break;
            }
            case 'grubs': {
                joined += 'rescued';
                break;
            }
            case 'colosseum':
            case 'godhome': {
                joined += 'completed';
                break;
            }
            default:
                throw new Error(
                    `Unimplemented requirement for '${
                        typedSection satisfies never
                    }' section`
                );
        }
    } else if (
        INITIAL_CHECKLIST_STATE['silksong'].checks.hasOwnProperty(section)
    ) {
        const typedSection = section as SectionNames<'silksong'>;
        switch (typedSection) {
            case 'bosses':
            case 'ancestralArts':
            case 'tools':
            case 'items':
            case 'spoolFragments':
            case 'maskShards':
            case 'toolPouch': {
                joined += 'acquired';
                break;
            }
            case 'relics':
            case 'silkHearts':
            case 'everbloom': {
                joined += 'collected';
                break;
            }
            case 'silkSkills':
            case 'crests': {
                joined += 'bound';
                break;
            }
            case 'needle':
            case 'eva': {
                joined += 'obtained';
                break;
            }
            case 'fleas': {
                joined += 'found';
                break;
            }
            case 'wishes': {
                joined += 'granted';
                break;
            }
            case 'melodies': {
                joined += 'learned';
                break;
            }
            default:
                throw new Error(
                    `Unimplemented requirement for '${
                        typedSection satisfies never
                    }' section`
                );
        }
    } else {
    }

    return joined;
};

export default formatCheckListError;
